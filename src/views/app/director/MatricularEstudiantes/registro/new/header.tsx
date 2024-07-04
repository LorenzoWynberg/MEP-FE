import React, { useEffect, useState } from 'react'
import InputWrapper from 'Components/wrappers/InputWrapper'
import { Colxx } from 'Components/common/CustomBootstrap'
import Select from 'react-select'
import CustomSelectInput from 'Components/common/CustomSelectInput'
import Typography from '@material-ui/core/Typography'
import { useSelector } from 'react-redux'
import useNotification from 'Hooks/useNotification'
import { useActions } from 'Hooks/useActions'
import { Form, Card, Button, Input } from 'reactstrap'
import ReactInputMask from 'react-input-mask'
import styled from 'styled-components'
import { useTranslation } from 'react-i18next'

import {
	deleteFuncionario,
	getFuncionarios,
	getFuncionariosIdentificacion,
	createFuncionario,
	getFuncionariosByTipoIdAndId
} from 'Redux/RecursosHumanos/actions'

interface IProps {
	dataNivel: any
	data: any
	setStudent: Function
	clearPersonaEncontrada: Function
	onlyViewModule?: boolean
}
type SnackbarConfig = {
	variant: string
	msg: string
}
const FormFilterStudent: React.FC<IProps> = props => {
	const { t } = useTranslation()
	const state = useSelector((store: any) => {
		return {
			funcionarios: store.funcionarios.funcionarios,
			institution: store.authUser.currentInstitution,
			lstIdTypes: store.selects.idTypes
		}
	})
	const { dataNivel, data, setStudent, clearPersonaEncontrada } = props
	const [idValueRegister, setIdValueRegister] = useState(null)
	const [idTypeRegister, setIdTypeRegister] = useState(state.lstIdTypes[0])
	const [error, setError] = useState(null)
	const [loading, setLoading] = useState(false)
	const [snackbar, handleClick] = useNotification()
	const [snackBarContent, setSnackbarContent] = React.useState<SnackbarConfig>({
		variant: '',
		msg: ''
	})

	const showNotification = (variant: string, msg: string) => {
		setSnackbarContent({ variant, msg })
		handleClick()
	}
	useEffect(() => {
		if (data) {
			debugger
			const _type = data?.datos.find(x => x.codigoCatalogo === 1)

			const _tipeId = state.lstIdTypes.find(x => x.id === _type.elementoId)
			setIdTypeRegister(_tipeId)

			setIdValueRegister(data.identificacion)
		} else {
			setError(null)
			setIdValueRegister('')
			setIdTypeRegister(state.lstIdTypes[0])
		}
	}, [data])

	const actions = useActions({
		deleteFuncionario,
		getFuncionarios,
		getFuncionariosIdentificacion,
		getFuncionariosByTipoIdAndId,
		createFuncionario
	})
	const onChangeIdRegister = async () => {
		if (!idValueRegister) {
			setError(
				t(
					'estudiantes>registro_matricula>matricula_estudian>buscar>mensaje',
					'Ingrese la identificación a buscar'
				)
			)
			return
		}
		let response = null
		setLoading(true)

		switch (idTypeRegister.codigo) {
			case '01':
				if (idValueRegister.length === 9) {
					response = await actions.getFuncionariosByTipoIdAndId(1, idValueRegister)
					setLoading(false)
					if (response.error) {
						showNotification('error', 'Oops! Algo ha salido mal, Inténtelo luego')
					} else {
						if (response.data) {
							setStudent(response.data)
						} else {
							setStudent(null)
						}
					}
				} else {
					setError('Debe tener una longitud de 9 caracteres')
				}

				break
			case '03':
				if (idValueRegister.length === 12) {
					response = await actions.getFuncionariosByTipoIdAndId(3, idValueRegister)
					setLoading(false)

					if (response.error) {
						showNotification('error', 'Oops! Algo ha salido mal, Inténtelo luego')
					} else {
						if (response.data) {
							setStudent(response.data)
						} else {
							setStudent(null)
						}
					}
				} else {
					setError('Debe tener una longitud de 12 caracteres')
				}
				break
			case '04':
				if (idValueRegister.length >= 12) {
					response = await actions.getFuncionariosByTipoIdAndId(4, idValueRegister)
					setLoading(false)

					if (response.error) {
						showNotification('error', 'Oops! Algo ha salido mal, Inténtelo luego')
					} else {
						if (response.data) {
							setStudent(response.data)
						} else {
							setStudent(null)
						}
					}
				} else {
					setError('Debe tener una longitud mínima de 12 caracteres')
				}
				break
			case '05':
				if (idValueRegister.length > 20) {
					setError('Debe tener una longitud máxima de 20 caracteres')
				} else if (idValueRegister.length >= 1) {
					response = await actions.getFuncionariosByTipoIdAndId(6508, idValueRegister)
					setLoading(false)

					if (response.error) {
						showNotification('error', 'Oops! Algo ha salido mal, Inténtelo luego')
					} else {
						if (response.data) {
							setStudent(response.data)
						} else {
							setStudent(null)
						}
					}
				} else {
					setError('Debe tener una longitud mínima de 1 caracteres')
				}
				break

			default:
				setLoading(false)
		}
		setLoading(false)
	}
	const onChangeIdTypeRegister = value => {
		setError(null)
		clearPersonaEncontrada()
		setIdTypeRegister(value)
		setIdValueRegister('')
		setLoading(false)
	}

	const onChangeIdValueRegister = value => {
		setError(null)
		clearPersonaEncontrada()
		setIdValueRegister(value)
	}

	return (
		<Colxx xxs='12' className='mb-5'>
			{snackbar(snackBarContent.variant, snackBarContent.msg)}

			<Card className='radius-t'>
				<Form autoComplete='off'>
					<div className='register-box' style={{ alignItems: 'center' }}>
						<div
							className='info-card card-radius-l cursor-pointer py-3'
							style={{ width: '300px' }}
							onClick={e => {}}
						>
							<Typography gutterBottom variant='subtitle1'>
								{dataNivel.nivelNombre}
							</Typography>
							<Typography variant='body2'>{dataNivel.ofertaNombre}</Typography>
							<Typography variant='body2'>{dataNivel.modalidadNombre}</Typography>
							{dataNivel.servicioNombre && (
								<Typography variant='body2' gutterBottom>
									{dataNivel.servicioNombre}
								</Typography>
							)}
							{dataNivel.especialidadNombre && (
								<Typography variant='body2' gutterBottom>
									{dataNivel.especialidadNombre}
								</Typography>
							)}
						</div>
						<Colxx sm='12' md='6' xl='3'>
							<div className='form-group has-top-label m-0'>
								<Select
									components={{ Input: CustomSelectInput }}
									className='react-select'
									classNamePrefix='react-select'
									name='id-type'
									onChange={onChangeIdTypeRegister}
									value={idTypeRegister}
									options={state.lstIdTypes}
									getOptionLabel={(option: any) => option.nombre}
									getOptionValue={(option: any) => option.id}
									placeholder=''
								/>
								<span>
									{t(
										'estudiantes>buscador_per>col_tipo_id',
										'Tipo de identificación'
									)}
								</span>
							</div>
						</Colxx>

						<Colxx lg='2' md='6' xl='3'>
							<div className='form-group has-top-label  m-0'>
								<ReactInputMask
									mask={
										idTypeRegister?.id === 1
											? '999999999' // 9
											: idTypeRegister?.id === 3
											? '999999999999' // 12
											: idTypeRegister?.id === 4
											? 'YR9999-99999'
											: '99999999999999999999'
									}
									type='text'
									name='identificacion'
									maskChar={null}
									value={idValueRegister}
									onChange={e => onChangeIdValueRegister(e.target.value)}
									invalid={error}
								>
									{inputProps => <Input {...inputProps} />}
								</ReactInputMask>

								<span>ID</span>
								{error && <ErrorFeedback>{error}</ErrorFeedback>}
							</div>
						</Colxx>
						<Colxx lg='2' xl='2'>
							<InputWrapper className='m-0'>
								<div className='text-zero button-container'>
									{loading ? (
										<div className='t-center-button-container'>
											<div className='loading loading-form ml-5' />
										</div>
									) : (
										<div className='t-right-button-container'>
											<Button
												color='primary'
												size='lg'
												className='t-right-button button-sm'
												onClick={() => onChangeIdRegister()}
											>
												{t('general>buscar', 'Buscar')}
											</Button>
										</div>
									)}
								</div>
							</InputWrapper>
						</Colxx>
					</div>
				</Form>
			</Card>
		</Colxx>
	)
}
const ErrorFeedback = styled.div`
	position: absolute;
	color: #bd0505;
	left: 0;
	font-weight: bold;
	font-size: 10px;
	bottom: -19px;
`
export default FormFilterStudent
