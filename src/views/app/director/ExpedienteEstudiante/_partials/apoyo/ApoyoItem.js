import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import {
	Input,
	FormGroup,
	FormFeedback,
	Form,
	Container,
	Col,
	Button,
	CustomInput
} from 'reactstrap'
import moment from 'moment'
import styled from 'styled-components'
import colors from '../../../../../../assets/js/colors'
import { Menu, MenuItem } from '@material-ui/core'
import MoreVertIcon from '@material-ui/icons/MoreVert'
import { useTranslation } from 'react-i18next'

const ApoyoItem = props => {
	const { t } = useTranslation()

	const [editing, setEditing] = useState(props.addNew)
	const [resepcionVerificada, setResepcionVerificada] = useState(
		props.apoyo.resepcionVerificada
	)
	const { handleSubmit, errors, watch, setValue, register } = useForm()
	const [anchorEl, setAnchorEl] = useState(null)

	const fromDate = watch(`${props.storedValuesKey}dateFrom`)
	const toDate = watch(`${props.storedValuesKey}dateTo`)
	const toDateInvalid =
		fromDate && toDate && moment(toDate, 'YYYY-MM-DD').isBefore(fromDate)

	useEffect(() => {
		setData()

		return () => {
			setData()
		}
	}, [props.apoyo, editing])

	const setData = () => {
		if (props.apoyo.id) {
			setValue(
				`${props.storedValuesKey}Dependencias`,
				props.apoyo.dependenciasApoyosId
			)
			setValue(`${props.storedValuesKey}Tipos`, props.apoyo.tipoDeApoyoId)
			setValue(`${props.storedValuesKey}Detalle`, props.apoyo.detalle)
			setValue(
				`${props.storedValuesKey}dateFrom`,
				moment(props.apoyo.fechaInicio).format('YYYY-MM-DD')
			)
			setValue(
				`${props.storedValuesKey}dateTo`,
				moment(props.apoyo.fechaFin).format('YYYY-MM-DD')
			)
		}
	}

	const handleSaveApoyo = async data => {
		debugger
		//console.log('JPBR idMatricula save', props.matriculaId)
		let _data = {
			id: props.matriculaId, //props.apoyo.id || 0,
			detalle: data[`${props.storedValuesKey}Detalle`],
			resepcionVerificada,
			fechaInicio: data[`${props.storedValuesKey}dateFrom`],
			fechaFin: data[`${props.storedValuesKey}dateTo`],
			tipoDeApoyoId: parseInt(data[`${props.storedValuesKey}Tipos`]),
			dependenciasApoyosId: props.apoyosMateriales
				? parseInt(data[`${props.storedValuesKey}Dependencias`])
				: null,
			identidadesId: props.identidadesId
		}

		let response
		if (!props.apoyo.id) {
			//delete _data['id']
			response = await props.agregarApoyo(
				_data,
				props.categoria,
				props.storedValuesKey
			)
		} else {
			response = await props.editarApoyo(
				_data,
				props.categoria,
				props.storedValuesKey
			)
		}
		if (!response.error && props.addItems[props.storedValuesKey]) {
			props.setAddItems({ ...props.addItems, [props.storedValuesKey]: false })
		} else if (!response.error) {
			props.showsnackBar('success', 'Contenido enviado con éxito')
			setEditing(false)
		} else {
			props.showsnackBar('error', response.error)
		}
	}

	const handleDelete = id => {
		props.handleDeleteApoyo(id, props.storedValuesKey, props.categoria)
	}

	const handleClick = event => {
		setAnchorEl(event.currentTarget)
	}

	const handleClose = () => {
		setAnchorEl(null)
	}

	return (
		<Container>
			<EditButtonSpanContainer />
			<Form
				onSubmit={handleSubmit(
					props.apoyo.id
						? data => props.authHandler('modificar', handleSaveApoyo(data))
						: data => props.authHandler('crear', handleSaveApoyo(data))
				)}
				inline
			>
				{props.apoyosMateriales && (
					<Col>
						<FormGroup>
							<StyledInput
								disabled={!editing}
								innerRef={register({ required: props.apoyosMateriales })}
								name={`${props.storedValuesKey}Dependencias`}
								type="select"
								invalid={errors[`${props.storedValuesKey}Dependencias`]}
							>
								<option value={null}>
									{t(
										'estudiantes>expediente>apoyos_edu>apoyos_mater_tech>dependencia_apoyo',
										'Dependencia de apoyo'
									)}
								</option>
								{props.dependencias.map(dependencia => {
									return (
										<option value={dependencia.id}>{dependencia.nombre}</option>
									)
								})}
							</StyledInput>
							<FormFeedback>
								{errors[`${props.storedValuesKey}Dependencias`] &&
									errors[`${props.storedValuesKey}Dependencias`].message}
							</FormFeedback>
						</FormGroup>
					</Col>
				)}
				<Col>
					<FormGroup className="mb-2 mr-sm-2 mb-sm-0">
						<StyledInput
							disabled={!editing}
							innerRef={register({
								required: t('general>campo_requerido', 'El campo es requerido')
							})}
							name={`${props.storedValuesKey}Tipos`}
							type="select"
							invalid={errors[`${props.storedValuesKey}Tipos`]}
							placeholder="Seleccionar"
						>
							<option value={null}>
								{t('general>seleccionar', 'Seleccionar')}
							</option>
							{props.tipos.map(tipo => {
								return (
									<option value={tipo.id} selected={props.categoria.id == 4}>
										{tipo.nombre}
									</option>
								)
							})}
						</StyledInput>
						<FormFeedback>
							{errors[`${props.storedValuesKey}Tipos`] &&
								errors[`${props.storedValuesKey}Tipos`].message}
						</FormFeedback>
					</FormGroup>
				</Col>
				<Col>
					<FormGroup>
						<StyledInput
							disabled={!editing}
							innerRef={register}
							name={`${props.storedValuesKey}Detalle`}
							type="text"
							invalid={errors[`${props.storedValuesKey}Detalle`]}
						/>
						<FormFeedback>
							{errors[`${props.storedValuesKey}Detalle`] &&
								errors[`${props.storedValuesKey}Detalle`].message}
						</FormFeedback>
					</FormGroup>
				</Col>
				{props.apoyosMateriales && (
					<Col>
						<CustomInput
							type="radio"
							inline
							disabled={!editing}
							label={t('general>si', 'Si')}
							checked={resepcionVerificada}
							onClick={() => {
								setResepcionVerificada(true)
							}}
						/>
						<CustomInput
							type="radio"
							inline
							disabled={!editing}
							label={t('general>no', 'No')}
							checked={!resepcionVerificada}
							onClick={() => {
								setResepcionVerificada(false)
							}}
						/>
					</Col>
				)}
				<Col>
					<FormGroup>
						<StyledInput
							disabled={!editing}
							type="date"
							name={`${props.storedValuesKey}dateFrom`}
							invalid={
								toDateInvalid || errors[`${props.storedValuesKey}dateFrom`]
							}
							innerRef={register({
								required: t('general>campo_requerido', 'El campo es requerido')
							})}
						/>
						<FormFeedback style={{ top: '76px' }}>
							{toDateInvalid &&
								'la fecha de inicio debe ser antes de la fecha de final'}
							{errors[`${props.storedValuesKey}dateFrom`] &&
								errors[`${props.storedValuesKey}dateFrom`].message}
						</FormFeedback>
					</FormGroup>
				</Col>
				<Col>
					<FormGroup>
						<StyledInput
							disabled={!editing}
							type="date"
							name={`${props.storedValuesKey}dateTo`}
							invalid={
								toDateInvalid || errors[`${props.storedValuesKey}dateTo`]
							}
							innerRef={register({
								required: t('general>campo_requerido', 'El campo es requerido')
							})}
						/>
						<FormFeedback style={{ top: '76px' }}>
							{toDateInvalid &&
								'la fecha de inicio debe ser antes de la fecha de final'}
							{errors[`${props.storedValuesKey}dateTo`] &&
								errors[`${props.storedValuesKey}dateTo`].message}
						</FormFeedback>
					</FormGroup>
				</Col>
				<Col md={1}>
					{!editing && !props.addItems[props.storedValuesKey] && (
						<MoreVertIcon
							aria-controls="simple-menu"
							aria-haspopup="true"
							onClick={handleClick}
						/>
					)}
					<Menu
						id="simple-menu"
						anchorEl={anchorEl}
						keepMounted
						open={Boolean(anchorEl)}
						onClose={handleClose}
					>
						<MenuItem
							onClick={() => {
								setEditing(!editing)
								handleClose()
							}}
						>
							{t('general>editar', 'Editar')}
						</MenuItem>
						<MenuItem
							onClick={() => {
								handleDelete(props.apoyo.id)
								handleClose()
							}}
						>
							{t('general>eliminar', 'Eliminar')}
						</MenuItem>
					</Menu>
				</Col>
				{editing && (
					<Col xs={12}>
						<ButonsContainer>
							<Button
								color="primary"
								outline
								type="button"
								onClick={() => {
									if (!props.apoyo.id) {
										props.setAddItems({
											...props.addItems,
											[props.storedValuesKey]: false
										})
									} else {
										setEditing(false)
									}
								}}
							>
								{t('general>cancelar', 'Cancelar')}
							</Button>
							<Button color="primary" type="submit">
								{t('general>guardar', 'Guardar')}
							</Button>
						</ButonsContainer>
					</Col>
				)}
			</Form>
		</Container>
	)
}

const StyledInput = styled(Input)`
	width: 100% !important;
	margin-top: 1rem;
	margin-bottom: 1rem;
	padding-right: 12%;
`

const ButonsContainer = styled.div`
	justify-content: center;
	display: flex;
	margin-top: 1rem;
	margin-bottom: 1rem;
`

const EditButtonSpanContainer = styled.div`
	justify-content: flex-start;
	display: flex;
	margin-top: 1rem;
	border-top: 1px solid #eaeaea;
	color: ${colors.primary};
`

export default ApoyoItem
