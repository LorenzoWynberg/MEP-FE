import React, { useState } from 'react'
import { Col, Row, Input, FormGroup, Label } from 'reactstrap'
import AddIcon from '@material-ui/icons/AddAPhoto'
import styled from 'styled-components'
import colors from '../../../../../../assets/js/colors'
import { useForm, Controller } from 'react-hook-form'
import { CurrentRegional } from '../../../../../../types/configuracion'
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined'
import { Tooltip, withStyles, Avatar } from '@material-ui/core'
import NavigationContainer from '../../../../../../components/NavigationContainer'
import Modal from 'Components/Modal/simple'
import Cropper from 'Components/Form/CropImage'
import useNotification from 'Hooks/useNotification'
import Select from 'react-select'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useTranslation } from 'react-i18next'
import axios from 'axios'

type IProps = {
	currentRegional: CurrentRegional
	handleCreate: Function
	handleEdit: Function
	handleBack: Function
	loading: boolean
	editable: boolean
	hasEditAccess: boolean
}
type SnackbarConfig = {
	variant: string
	msg: string
}
export const HtmlTooltip = withStyles(theme => ({
	tooltip: {
		backgroundColor: '#fff',
		color: 'rgba(0, 0, 0, 0.87)',
		maxWidth: 220,
		fontSize: theme.typography.pxToRem(12),
		border: `2px solid ${colors.primary}`
	}
}))(Tooltip)

const cropFormat = {
	unit: '%',
	aspect: 1 / 1,
	width: 50,
	height: 70
}
const urlToBase64 = url =>
	new Promise((resolve, reject) => {
		fetch(url)
			.then(r => {
				const reader = new FileReader()
				reader.onloadend = function () {
					resolve(reader.result)
				}
				r.blob()
					.then(blob => {
						reader.readAsDataURL(blob)
					})
					.catch(e => reject(e))
			})
			.catch(e => reject(e))
	})

const General = (props: IProps) => {
	const { t } = useTranslation()
	const [image, setImage] = React.useState<{ url: string; update?: bool }>({
		url: props.currentRegional?.imagenUrl
	})
	const { hasEditAccess } = props
	const [openCrop, setOpenCrop] = useState<boolean>(false)
	const [imageSrc, setImageSrc] = useState<string>(null)
	const estadosarray: any[] = [
		{ value: 'Activo', label: 'Activo' },
		{ value: 'Inactivo', label: 'Inactivo' }
	]
	const [snackbar, handleClick] = useNotification()
	const [snackBarContent, setSnackbarContent] = React.useState<SnackbarConfig>({
		variant: '',
		msg: ''
	})

	React.useEffect(() => {
		// setImage({ url: props.currentRegional?.imagenUrl || '' })

		if (props.currentRegional?.imagenUrl) {
			urlToBase64(props.currentRegional.imagenUrl)
				.then(base64 => {
					setImage({ url: base64 })
				})
				.catch(e => {
					console.log(e)
				})
		}
		setValue('esActivo', {
			value: props.currentRegional.esActivo || 'Activo',
			label: props.currentRegional.esActivo || 'Activo'
		})
	}, [props.currentRegional?.imagenUrl])

	const schema = yup.object().shape({
		esActivo: yup.object().shape({ value: yup.string() }).required('Campo requerido'),
		codigoDgsc: yup
			.number()
			.max(99999, 'El código no puede ser mayor a 5 números')
			.min(1, 'El número debe ser igual o mayor a 1')
			.required('Campo requerido'),
		codigoPresupuestario: yup
			.number()
			.max(99999, 'Debe tener una longitud máxima de 5 carácteres')
			.min(1, '')
			.required('Campo requerido'),
		conocidoComo: yup
			.string()
			.max(50, 'Debe tener una longitud máximo de 50 carácteres')
			.required('Campo requerido'),
		codigo: yup.number().required('Campo requerido'),
		nombre: yup.string().required('Campo requerido')
	})
	const {
		handleSubmit,
		register,
		setValue,
		control,

		formState: { errors },
		setError
	} = useForm({
		defaultValues: {
			esActivo: {
				label: props.currentRegional.esActivo || 'Activo',
				value: props.currentRegional.esActivo || 'Activo'
			},

			nombre: props.currentRegional.nombre || '',
			conocidoComo: props.currentRegional.conocidoComo || '',
			codigo: props.currentRegional.codigo || '',
			codigoPresupuestario: props.currentRegional.codigoPresupuestario || '',
			codigoDgsc: props.currentRegional.codigoDgsc2 || ''
		},
		resolver: yupResolver(schema)
	})

	const onSubmit = async (circuito: any) => {
		const errors = {}

		Object.keys(circuito).forEach(el => {
			if (!circuito[el]) {
				errors[el] = true
				setError(el, { type: 'required' })
			}
		})
		if (Object.keys(errors)?.length > 0) {
			return
		}
		// debugger
		const _data = {
			...circuito,
			id: props.currentRegional.id || '0',
			esActivo: circuito.esActivo === undefined ? true : circuito.esActivo.value == 'Activo',
			codigoDgsc: parseInt(circuito.codigoDgsc)
		}

		const formData = new FormData()

		Object.keys(_data).forEach(key => {
			formData.append(key, _data[key])
		})
		if (image?.update) {
			formData.append('image', image.url)
		}

		props.handleCreate(formData)
		setValue('esActivo', circuito.esActivo)
	}
	const block = Object.keys(props.currentRegional).length === 0

	const toInputUppercase = e => {
		e.target.value = ('' + e.target.value).toUpperCase()
	}
	const showNotification = (variant: string, msg: string) => {
		setSnackbarContent({ variant, msg })
		handleClick()
	}
	const getBase64 = file => {
		return new Promise((resolve, reject) => {
			const reader = new FileReader()
			reader.readAsDataURL(file)
			reader.onload = () => resolve(reader.result)
			reader.onerror = error => reject(error)
		})
	}
	const saveUploadPhoto = async img => {
		setOpenCrop(true)
		if (img[0].size > 5000000) {
			showNotification('error', 'La fotografía adjunta no debe ser mayor a 5MB')
			return
		}
		let src = null
		if (img) {
			src = await getBase64(img[0])
		}
		if (src) {
			setImageSrc(src)
		}
	}

	const handleCrop = async img => {
		setOpenCrop(false)

		setImageSrc(null)
		setImage({ url: img, update: true })
	}

	const handleClose = () => {
		setImageSrc(null)
		setOpenCrop(false)
	}

	return (
		<Wrapper>
			{snackbar(snackBarContent.variant, snackBarContent.msg)}
			<NavigationContainer goBack={props.handleBack} />
			<BoxForm>
				<FormTitle>
					{t(
						'configuración>direcciones_regionales>agregar>informacion_general',
						'Información general'
					)}
				</FormTitle>
				<Form>
					<Row>
						<Col lg={6}>
							<FormGroup className='fied-upload'>
								<label htmlFor='profilePic2'>
									{!image.url ? (
										<div className='fileinput-button'>
											<IconAdd />
										</div>
									) : (
										<Avatar
											className='fileinput-button__avatar'
											src={image.url}
										/>
									)}
								</label>
								<input
									style={{ display: 'none' }}
									disabled={!props.editable}
									onChange={e => {
										saveUploadPhoto(e.target.files)
									}}
									accept='image/*'
									type='file'
									name='profilePic2'
									className='fileinput-button__input'
									id='profilePic2'
								/>
							</FormGroup>
						</Col>
						<Col lg={6}>
							<FormGroup>
								<Label>
									{t(
										'configuración>direcciones_regionales>agregar>estado',
										'Estado'
									)}
								</Label>
								<Controller
									as={
										<Select
											className='select-rounded react-select'
											classNamePrefix='select-rounded react-select'
											placeholder=''
											options={estadosarray}
											isDisabled={block ? true : !props.editable}
										/>
									}
									name='esActivo'
									control={control}
									rules={{ required: true }}
								/>
								{errors.esActivo && (
									<ErrorFeedback>
										{t('general>campo_requerido', 'Campo requerido')}
									</ErrorFeedback>
								)}
							</FormGroup>
						</Col>
					</Row>
					<FormGroup>
						<Label>
							{t(
								'configuración>direcciones_regionales>agregar>nombre_oficial',
								'Nombre oficial *'
							)}
						</Label>
						<InputForm
							name='nombre'
							innerRef={register({
								required: true
							})}
							color={!props.editable ? '#e9ecef' : '#fff'}
							disabled={!props.editable}
							onInput={toInputUppercase}
							invalid={errors.nombre && errors.nombre.type}
						/>
						{errors.nombre && (
							/* errors.nombre.type === 'required' && */ <ErrorFeedback>
								{t('general>campo_requerido', 'Campo requerido')}
							</ErrorFeedback>
						)}
					</FormGroup>
					<FormGroup>
						<LabelRow>
							<Label>
								{t(
									'configuración>direcciones_regionales>agregar>conocido_como',
									' Conocido como'
								)}
							</Label>
							<HtmlTooltip
								title={t(
									'configuración>direcciones_regionales>agregar>conocido_como>msj',
									'Digite otro nombre con el cual se conoce la Dirección Regional.'
								)}
								placement='right'
							>
								<StyledInfoOutlinedIcon className='position-absolute' />
							</HtmlTooltip>
						</LabelRow>
						<InputForm
							name='conocidoComo'
							innerRef={register({
								required: false
							})}
							invalid={errors.conocidoComo}
							color={!props.editable ? '#e9ecef' : '#fff'}
							onInput={toInputUppercase}
							disabled={!props.editable}
						/>
						{errors.conocidoComo && (
							/* errors.conocidoComo.type === 'maxLength' &&  */ <ErrorFeedback>
								{t(
									'general>msj_error>long_max_50',
									'Debe tener una longitud máximo de 50 carácteres'
								)}
							</ErrorFeedback>
						)}
						{/* {errors.conocidoComo &&
              errors.conocidoComo.type === 'required' && (
                <ErrorFeedback>
                  {t('general>campo_requerido','Campo requerido')}
                </ErrorFeedback>
              )} */}
					</FormGroup>
					<Row>
						<Col lg={4}>
							<FormGroup>
								<Label>
									{t(
										'configuración>direcciones_regionales>agregar>codigo',
										'Código'
									)}{' '}
									*
								</Label>
								<InputForm
									name='codigo'
									innerRef={register({
										required: true,
										maxLength: 5
									})}
									color={!props.editable ? '#e9ecef' : '#fff'}
									disabled={!props.editable}
									invalid={errors.codigo}
									maxLength='5'
									readOnly={props.currentRegional.id}
								/>
								{/* 	{errors.codigo &&
                  errors.codigo.type === 'required' && (
                    <ErrorFeedback>
                      {t('general>campo_requerido','Campo requerido')}
                    </ErrorFeedback>
                  )} */}
								{errors.codigo && (
									/* errors.codigo.type === 'maxLength' && */ <ErrorFeedback>
										{t(
											'general>msj_error>long_max_5',
											'Debe tener una longitud máxima de 5 carácteres'
										)}
									</ErrorFeedback>
								)}
							</FormGroup>
						</Col>
						<Col lg={4}>
							<FormGroup>
								<Label>
									{t(
										'configuración>direcciones_regionales>agregar>codigo_presupuestario',
										'Código presupuestario *'
									)}{' '}
								</Label>
								<InputForm
									name='codigoPresupuestario'
									innerRef={register({
										required: true
									})}
									maxLength='5'
									invalid={errors.codigoPresupuestario}
									color={!props.editable ? '#e9ecef' : '#fff'}
									disabled={!props.editable}
								/>
								{/* {errors.codigoPresupuestario &&
                  errors.codigoPresupuestario.type ===
                    'required' && (
                    <ErrorFeedback>
                      {t('general>campo_requerido','Campo requerido')}
                    </ErrorFeedback>
                  )} */}
								{errors.codigoPresupuestario && (
									/* errors.codigoPresupuestario.type ===
                    'maxLength' &&  */ <ErrorFeedback>
										{t(
											'general>msj_error>long_max_5',
											'Debe tener una longitud máxima de 5 carácteres'
										)}
									</ErrorFeedback>
								)}
							</FormGroup>
						</Col>
						<Col lg={4}>
							<FormGroup>
								<Label>
									{t(
										'configuración>direcciones_regionales>agregar>codigo_DGSC',
										'Código DGSC *'
									)}
								</Label>
								<InputForm
									type='number'
									name='codigoDgsc'
									onKeyDown={evt => evt.key === 'e' && evt.preventDefault()}
									color={!props.editable ? '#e9ecef' : '#fff'}
									invalid={errors?.codigoDgsc}
									innerRef={register({
										required: true
									})}
									disabled={!props.editable}
								/>
								{errors.codigoDgsc && (
									<ErrorFeedback>
										{t(
											'general>msj_error>long_max_5_num',
											'Solo se admiten 5 numeros'
										)}
									</ErrorFeedback>
								)}
							</FormGroup>
						</Col>
					</Row>
				</Form>
				{props.loading ? (
					<Loading>
						<span className='single-loading' />
					</Loading>
				) : null}
			</BoxForm>
			<Actions>
				{!props.editable ? (
					<>
						{hasEditAccess ? (
							<ActionButton onClick={props.handleEdit}>Editar</ActionButton>
						) : null}
					</>
				) : (
					<>
						<BackButton onClick={props.handleBack}>
							{t('boton>general>cancelar', 'Cancelar')}
						</BackButton>
						<ActionButton onClick={handleSubmit(onSubmit)}>
							{Object.keys(props.currentRegional).length === 0
								? t('boton>general>guardar', 'Guardar')
								: t('boton>general>guardar', 'Guardar')}
						</ActionButton>
					</>
				)}
			</Actions>
			<Modal
				openDialog={openCrop}
				onClose={handleClose}
				txtBtn='Guardar'
				title='Editar foto'
				actions={false}
			>
				<ContainerWebCam>
					<Cropper
						handleClose={handleClose}
						handleCrop={handleCrop}
						txtbtn='Cortar'
						image={imageSrc}
						format={cropFormat}
					/>
				</ContainerWebCam>
			</Modal>
		</Wrapper>
	)
}

const ContainerWebCam = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	flex-flow: column;
	min-width: 600px;
`
const Wrapper = styled.div`
	margin-top: 5px;
`

const BoxForm = styled.div`
	border-radius: calc(0.85rem - 1px);
	box-shadow: 0 1px 15px rgba(0, 0, 0, 0.04), 0 1px 6px rgba(0, 0, 0, 0.04);
	background: #fff;
	padding: 1.65rem;
	margin-top: 20px;
	width: 50%;
	position: relative;
`

const Loading = styled.div`
	width: 100%;
	min-height: 381px;
	display: flex;
	align-items: center;
	justify-content: center;
	background: #ffffffb8;
	position: absolute;
	z-index: 1;
	left: 0;
	right: 0;
	top: 0;
	bottom: 0;
`

const FormTitle = styled.h4`
	color: #000;
`

const Form = styled.form`
	margin-top: 10px;
`

const InputForm = styled(Input)`
	background-color: ${props => props.color};
	&:focus {
		background: #fff;
	}
`

const IconAdd = styled(AddIcon)`
	font-size: 50px !important;
`

const ErrorFeedback = styled.span`
	color: #bd0505;
	right: 0;
	font-weight: bold;
	font-size: 9px;
	position: absolute;
	padding-top: 3px;
`

const Actions = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
	margin-top: 20px;
`

const BackButton = styled.button`
	background: transparent;
	border: 1px ${colors.primary} solid;
	border-radius: 30px;
	color: ${colors.primary};
	padding: 9px 15px;
	cursor: pointer;
	margin-right: 5px;
`

const ActionButton = styled.button`
	background: ${colors.primary};
	border: 1px ${colors.primary} solid;
	border-radius: 30px;
	color: #fff;
	border: 0;
	padding: 9px 15px;
	cursor: pointer;
`

const LabelRow = styled.div`
	flex-direction: row;
	align-items: center;
`

const StyledInfoOutlinedIcon = styled(InfoOutlinedIcon)`
	top: -5px;
	margin-left: 4px;
`

export default General
