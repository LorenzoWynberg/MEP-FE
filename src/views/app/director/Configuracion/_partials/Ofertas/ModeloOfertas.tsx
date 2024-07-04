import { Tooltip } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import { Delete, Edit } from '@material-ui/icons'
import IconButton from '@mui/material/IconButton'
import BookAvailable from 'Assets/icons/bookAvailable'
import BookDisabled from 'Assets/icons/bookDisabled'
import colors from 'Assets/js/colors'
import BarLoader from 'Components/barLoader/barLoader'
import CustomSelectInput from 'Components/common/CustomSelectInput'
import RequiredLabel from 'Components/common/RequeredLabel'
import { EditButton } from 'Components/EditButton'
import NavigationContainer from 'Components/NavigationContainer'
import StyledMultiSelectTable from 'Components/styles/StyledMultiSelectTable'
import { CenteredCol } from 'Components/styles/styles'
import { TableReactImplementation } from 'Components/TableReactImplementation'
import { useActions } from 'Hooks/useActions'
import useNotification from 'Hooks/useNotification'
import React, { useEffect, useMemo, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import Select from 'react-select'
import {
	Button,
	ButtonDropdown,
	Card,
	CardBody,
	CardTitle,
	Col,
	Container,
	CustomInput,
	DropdownItem,
	DropdownMenu,
	DropdownToggle,
	Form,
	FormFeedback,
	FormGroup,
	Input,
	InputGroupAddon,
	Label,
	Row
} from 'reactstrap'
import { getEspecialidades } from 'Redux/especialidades/actions'
import { getModalidades } from 'Redux/modalidades/actions'
import {
	cleanCurrentOffer,
	createOffer,
	deleteModels,
	editOffer,
	enableAndDisable,
	getLevelsByModel,
	getOfferModels,
	getSpecialtiesByModel,
	loadCurrentOffer,
	loadLastOfferId,
	updateOferta
} from 'Redux/modelosOferta/actions'
import { getNiveles } from 'Redux/niveles/actions'
import { getOfertas } from 'Redux/ofertas/actions'
import { getServicios } from 'Redux/servicios/actions'
import styled from 'styled-components'
import swal from 'sweetalert'
import search from 'Utils/search'

const useStyles = makeStyles(theme => ({
	inputTags: {
		minHeight: '3rem',
		border: '1px solid #d7d7d7;',
		padding: '0.35rem',
		color: 'white',
		marginBottom: '0.5rem'
	},
	input: {
		display: 'none'
	}
}))

const ModeloOfertas = props => {
	const { t } = useTranslation()
	const actions = useActions({
		getNiveles,
		getModalidades,
		getServicios,
		getEspecialidades,
		getOfertas,
		getLevelsByModel,
		createOffer,
		getOfferModels,
		getSpecialtiesByModel,
		cleanCurrentOffer,
		loadCurrentOffer,
		editOffer,
		deleteModels,
		loadLastOfferId,
		enableAndDisable,
		updateOferta
	})
	const [snackbar, handleClick] = useNotification()
	const [editable, setEditable] = useState(false)
	const [showForm, setShowForm] = useState(false)
	const [snackbarContent, setSnackbarContent] = useState({
		msg: '',
		variant: 'error'
	})
	const [items, setItems] = useState([])
	const [openDropdown, setOpenDropdown] = useState(false)
	const [selectedIds, setSelectedIds] = useState([])
	const [searchValue, setSearchValue] = useState('')
	/* levels variables */
	const [isOpenLevels, setIsOpenLevels] = useState(false)
	const [stagedLevelsOptions, setStagedLevelsOptions] = useState([])
	const [selectedLevels, setSelectedLevels] = useState([])
	/* specialties variables */
	const [selectedSpecialties, setSelectedSpecialties] = useState([])
	const [stagedSpecialtiesOptions, setStagedSpecialtiesOptions] = useState([])
	const [isOpenSpecialties, setIsOpenSpecialties] = useState(false)
	const [lvlsError, setLvlsError] = useState(false)
	const [data, setData] = useState([])
	const [editing, setEditing] = useState(false)
	const [loading, setLoading] = useState(false)
	const [using, setUsing] = useState(0)
	const {
		register,
		handleSubmit,
		formState: { errors },
		clearErrors,
		setValue,
		watch,
		control,
		getValues
	} = useForm({ mode: 'onChange' })

	const state: any = useSelector(store => {
		return {
			ofertas: store.ofertas.ofertas,
			modalidades: store.modalidades.modalidades,
			servicios: store.servicios.servicios,
			niveles: store.niveles.niveles,
			especialidades: store.especialidades.especialidades,
			modelOffers: store.modelosOfertas.modelOffers,
			currentOfferLevels: store.modelosOfertas.currentOfferLevels,
			currentOfferSpecialties: store.modelosOfertas.currentOfferSpecialties,
			currentModel: store.modelosOfertas.currentModelOffer,
			lastId: store.modelosOfertas.lastId
		}
	})
	const { hasAddAccess = true, hasEditAccess = true, hasDeleteAccess = true } = props

	useEffect(() => {
		const fetch = () => {
			actions.getOfertas(false)
			actions.getNiveles(false)
			actions.getModalidades(false)
			actions.getServicios(false)
			actions.getEspecialidades(false)
			actions.getOfferModels()
			actions.loadLastOfferId()
		}
		fetch()
	}, [])

	useEffect(() => {
		setItems(data)
	}, [data])

	useEffect(() => {
		setData(
			state.modelOffers.map(item => {
				return {
					...item,
					estadoP: item.esActivo ? 'ACTIVA' : 'INACTIVA',
					idP: String(item.id).padStart(3, '0')
				}
			})
		)
	}, [state.modelOffers])

	useEffect(() => {
		setSelectedLevels(state.currentOfferLevels.map(item => item.id))
		setSelectedSpecialties(state.currentOfferSpecialties.map(item => item.id))
		// debugger
		setValue('nombre', state.currentModel.nombre)
		setValue('idP', state.currentModel.idP || '')
		setValue('ofertaId', state.currentModel.ofertaId)
		setValue('modalidadId', state.currentModel.modalidadId)
		setValue('servicioId', state.currentModel.servicioId)
		setValue('permiteDuplicados', state.currentModel.permiteDuplicados)
		setValue('esActivo', state.currentModel.id ? (state.currentModel.esActivo ? 1 : 0) : 1)
		setUsing(state.currentModel.totalUsing)
	}, [state.currentOfferSpecialties, editable])

	const onSearch = value => {
		setSearchValue(value)
		setItems(
			search(searchValue).in(
				data,
				columns.map(column => column.column)
			)
		)
	}

	const getItemLvlsAndSp = async (item: object) => {
		actions.loadCurrentOffer(item)
		await actions.getLevelsByModel(item.id)
		await actions.getSpecialtiesByModel(item.id)
	}

	const toggleForm = (item = {}) => {
		if (item.id) {
			getItemLvlsAndSp(item)
			setEditing(true)
		} else {
			actions.cleanCurrentOffer()
			setEditing(false)
		}
		setShowForm(!showForm)
		clearErrors()
		setLvlsError(false)
	}

	const toggleLevels = (e, save = false) => {
		if (!save) {
			setStagedLevelsOptions(selectedLevels)
		} else {
			setSelectedLevels(stagedLevelsOptions)
		}
		setLvlsError(false)
		setIsOpenLevels(!isOpenLevels)
	}

	const toggleSpecialties = (e, save = false) => {
		if (!save) {
			setStagedSpecialtiesOptions(selectedSpecialties)
		} else {
			setSelectedSpecialties(stagedSpecialtiesOptions)
		}
		setIsOpenSpecialties(!isOpenSpecialties)
	}

	const handleChangeLevel = item => {
		if (selectedLevels?.includes(item.id) && state.currentModel.id && using) {
			return
		}
		if (stagedLevelsOptions.includes(item.id)) {
			return setStagedLevelsOptions(stagedLevelsOptions.filter(el => el !== item.id))
		}
		setStagedLevelsOptions([...stagedLevelsOptions, item.id])
	}

	const handleChangeSpecialty = item => {
		if (selectedSpecialties?.includes(item.id) && state.currentModel.id && using) {
			return
		}
		if (stagedSpecialtiesOptions.includes(item.id)) {
			return setStagedSpecialtiesOptions(
				stagedSpecialtiesOptions.filter(el => el !== item.id)
			)
		}
		setStagedSpecialtiesOptions([...stagedSpecialtiesOptions, item.id])
	}

	const sendData = async data => {
		if (selectedLevels.length < 1) {
			setLvlsError(true)
			return
		}
		setLoading(true)
		data.nombre = getValues('nombre')
		const name = getValues('nombre')
		let newName
		if (selectedSpecialties.length > 0) {
			if (name && name.search(' - SIN ESPECIALIDAD') >= 0) {
				newName = name.replace(' - SIN ESPECIALIDAD', '')
			}
		} else {
			if (name && name.search(' - SIN ESPECIALIDAD') < 0) {
				newName = data.nombre + ' - SIN ESPECIALIDAD'
			}
		}
		if (!data.modalidadId) {
			setLoading(false)
			return
		}
		if (!data.servicioId) {
			setLoading(false)
			return
		}
		if (!data.servicioId) {
			if (newName) {
				newName = newName + ' - SIN SERVICIO'
			} else {
				if (!data.nombre.includes('SIN SERVICIO')) {
					newName = data.nombre + ' - SIN SERVICIO'
				} else {
					newName = data.nombre
				}
			}
		}

		const servicio = state.servicios.find(el => el?.id === data?.servicioId)
		const modalidad = state.modalidades.find(el => el?.id === data?.modalidadId)
		const oferta = state.ofertas.find(el => el?.id === data?.ofertaId)
		const _data = {
			...data,
			nombre: newName || data.nombre,
			estado: data.esActivo > 0,
			niveles: selectedLevels,
			especialidades: selectedSpecialties,
			servicio: servicio.nombre || 0,
			oferta: oferta?.nombre,
			modalidad: modalidad?.nombre,
			permiteDuplicados: !!data.permiteDuplicados,
			servicioId: data.servicioId == '' ? 0 : data.servicioId,
			id: state.currentModel.id ? state.currentModel.id : 0
		}
		let response

		if (state.currentModel.id) {
			response = await actions.editOffer(_data)
		} else {
			response = await actions.createOffer(_data)
		}

		if (response.error) {
			setSnackbarContent({ msg: response.msj, variant: 'error' })
			handleClick()
		} else {
			toggleForm()
			setSnackbarContent({
				msg: state.currentModel.id
					? t('general>msj_actualizado', 'Se actualizó correctamente')
					: t('general>msj_guardado', 'Se guardó correctamente'),
				variant: 'success'
			})
			handleClick()
		}
		setLoading(false)
	}

	const options = [
		{ value: 1, label: 'Activo' },
		{ value: 0, label: 'Inactivo' }
	]

	const columns = useMemo(
		() => [
			{
				label: '',
				column: 'id',
				accessor: 'id',
				Header: '',
				Cell: ({ row }) => {
					return (
						<div
							style={{
								textAlign: 'center',
								display: 'flex',
								justifyContent: 'center',
								alignItems: 'center'
							}}
						>
							<input
								className='custom-checkbox mb-0 d-inline-block'
								type='checkbox'
								id='checki'
								style={{
									width: '1rem',
									height: '1rem',
									marginRight: '1rem'
								}}
								onClick={e => {
									if (selectedIds.includes(row.original.id)) {
										setSelectedIds(
											selectedIds.filter(el => el !== row.original.id)
										)
									} else {
										setSelectedIds([...selectedIds, row.original.id])
									}
								}}
								checked={selectedIds.includes(row.original.id)}
							/>
						</div>
					)
				}
			},
			{
				column: 'idP',
				label: 'Código',
				Header: t(
					'configuracion>ofertas_educativas>modelo_de_ofertas>columna_codigo',
					'Código'
				),
				accessor: 'idP'
			},
			{
				column: 'nombre',
				label: 'Nombre de modelo',
				Header: t(
					'configuracion>ofertas_educativas>modelo_de_ofertas>columna_nombre_de_modelo',
					'Nombre de modelo'
				),
				accessor: 'nombre'
			},
			{
				column: 'estadoP',
				label: 'Estado',
				Header: t(
					'configuracion>ofertas_educativas>modelo_de_ofertas>columna_estado',
					'Estado'
				),
				accessor: 'estadoP'
			},
			{
				column: 'actions',
				label: 'Acciones',
				Header: t(
					'configuracion>ofertas_educativas>modelo_de_ofertas>columna_acciones',
					'Acciones'
				),
				accessor: 'actions',
				Cell: ({ row }) => {
					return (
						<>
							<div className='d-flex justify-content-center align-items-center'>
								{hasEditAccess && (
									<>
										<Tooltip title={t('boton>general>editar', 'Editar')}>
											<Edit
												style={{
													cursor: 'pointer',
													color: colors.darkGray
												}}
												onClick={() => {
													toggleForm(row.original)
													setEditable(true)
												}}
											/>
										</Tooltip>
									</>
								)}

								{hasDeleteAccess && (
									<Tooltip title={t('boton>general>eliminar', 'Eliminar')}>
										<Delete
											style={{
												cursor: 'pointer',
												color: colors.darkGray
											}}
											onClick={() => {
												swal({
													title: t(
														'configuracion>ofertas_educaticas>modelo_ofertas>eliminar>titulo',
														'Atención'
													),
													text: t(
														'configuracion>ofertas_educaticas>modelo_ofertas>eliminar>texto',
														'¿Está seguro de querer deshabilitar estos registros?'
													),
													dangerMode: true,
													icon: 'warning',
													buttons: [
														t('boton>general>cancelar', 'Cancelar'),
														t('general>aceptar', 'Aceptar')
													]
												}).then(val => {
													if (val) {
														setLoading(true)
														actions
															.deleteModels([row.original.id])
															.then(response => {
																setLoading(false)
																if (
																	response.error &&
																	response.error === 418
																) {
																	swal({
																		title: t(
																			'configuracion>anio_educativo>eliminar>titulo',
																			'Atención'
																		),
																		text: t(
																			'configuracion>ofertas>msj_no_puede_inhabilitarla',
																			'Esta oferta tiene registros asociados, no puede inhabilitarla'
																		),
																		icon: 'error',
																		button: t(
																			'general>aceptar',
																			'Aceptar'
																		)
																	})
																}
															})
														setLoading(false)
													}
												})
											}}
										/>
									</Tooltip>
								)}
								{hasEditAccess && !row.original.esActivo && (
									<>
										<Tooltip title={t('boton>general>habilitar', 'Habilitar')}>
											<IconButton
												onClick={async () => {
													swal({
														title: t(
															'configuracion>ofertas_educativas>modelo_de_ofertas>deshabilitar>confirmacion',
															'Confirmación'
														),
														text: t(
															'generic_table>mensaje_habilitar>texto',
															'¿Estás seguro de que deseas habilitar éste registro'
														),
														icon: 'warning',
														className: 'text-alert-modal',
														buttons: {
															cancel: t(
																'boton>general>cancelar',
																'Cancelar'
															),
															ok: {
																text: t(
																	'boton>general>si_seguro',
																	'Sí, seguro'
																),
																value: true,
																className: 'btn-alert-color'
															}
														}
													}).then(async res => {
														if (res) {
															setLoading(true)
															const response =
																await actions.enableAndDisable(
																	'OfertaModalServ',
																	[row.original?.id]
																)
															setLoading(false)
															if (!response.error) {
																setSnackbarContent({
																	variant: 'success',
																	msg: t(
																		'configuracion>ofertas>msj_habilitado',
																		'Se ha habilitado el registro'
																	)
																})
																handleClick()
																actions.getOfferModels()
															} else {
																setSnackbarContent({
																	variant: 'error',
																	msg: response.error
																})
																handleClick()
															}
														}
													})
												}}
											>
												<BookAvailable
													style={{
														cursor: 'pointer',
														color: colors.darkGray
													}}
												/>
											</IconButton>
										</Tooltip>
									</>
								)}
								{hasEditAccess && row.original.esActivo && (
									<>
										<Tooltip
											title={t('boton>general>deshabilitar', 'Deshabilitar')}
										>
											<IconButton
												onClick={async () => {
													swal({
														title: t(
															'configuracion>ofertas_educativas>modelo_de_ofertas>deshabilitar>confirmacion',
															'Confirmación'
														),
														text: t(
															'configuracion>ofertas_educativas>modelo_de_ofertas>deshabilitar>mensaje',
															'¿Estás seguro de que deseas deshabilitar este registro?'
														),
														icon: 'warning',
														className: 'text-alert-modal',
														buttons: {
															cancel: t(
																'boton>general>cancelar',
																'Cancelar'
															),
															ok: {
																text: t(
																	'boton>general>si_seguro',
																	'Sí, seguro'
																),
																value: true,
																className: 'btn-alert-color'
															}
														}
													}).then(async res => {
														if (res) {
															setLoading(true)
															const response =
																await actions.enableAndDisable(
																	'OfertaModalServ',
																	[row.original?.id]
																)
															setLoading(false)
															if (!response.error) {
																setSnackbarContent({
																	variant: 'success',
																	msg: t(
																		'configuracion>ofertas>msj_deshabilitado',
																		'Se ha deshabilitado el registro'
																	)
																})
																handleClick()
																actions.getOfferModels()
															} else {
																if (
																	response.error &&
																	response.error === 418
																) {
																	swal({
																		title: t(
																			'configuracion>anio_educativo>eliminar>titulo',
																			'Atención'
																		),
																		text: t(
																			'configuracion>ofertas>msj_no_puede_inhabilitarla',
																			'Esta oferta tiene registros asociados, no puede inhabilitarla'
																		),
																		icon: 'error',
																		button: t(
																			'general>aceptar',
																			'Aceptar'
																		)
																	})
																} else {
																	setSnackbarContent({
																		variant: 'error',
																		msg: response.error
																	})
																	handleClick()
																}
															}
														}
													})
												}}
											>
												<BookDisabled
													style={{
														cursor: 'pointer',
														color: colors.darkGray
													}}
												/>
											</IconButton>
										</Tooltip>
									</>
								)}
							</div>
						</>
					)
				}
			}
		],
		[hasEditAccess, hasDeleteAccess, selectedIds]
	)

	return (
		<div>
			{snackbar(snackbarContent.variant, snackbarContent.msg)}
			{loading && <BarLoader />}
			<div>
				<h3>
					{t('configuracion>ofertas_educativas>modelo_de_ofertas', 'Modelo de Ofertas')}
				</h3>
			</div>
			<br />
			{showForm ? (
				<Container>
					<NavigationContainer goBack={toggleForm} />
					<Form onSubmit={handleSubmit(sendData)}>
						<Row>
							<Col md={6} xs={12}>
								<Card>
									<CardBody>
										<CardTitle>
											{t(
												'configuracion>ofertas_educativas>modelo_de_ofertas>agregar>ofertas_educativas',
												'Ofertas educativas'
											)}
										</CardTitle>
										{using > 0 && (
											<StyledAlert>
												{t(
													'configuracion>ofertas_educativas>modelo_de_ofertas>editar>en_uso',
													'En uso'
												)}
											</StyledAlert>
										)}
										<FormGroup
											style={{
												paddingLeft: '1.3rem'
											}}
										>
											<Input
												type='checkbox'
												name='permiteDuplicados'
												innerRef={register}
											/>
											<Label>
												{t(
													'configuracion>ofertas_educativas>modelo_de_ofertas>agregar>permite_duplicados',
													'Permite duplicados'
												)}
											</Label>
										</FormGroup>
										<FormGroup>
											<Label>
												{t(
													'configuracion>ofertas_educativas>modelo_de_ofertas>agregar>codigo',
													'Código'
												)}
											</Label>
											<Input
												readOnly
												type='text'
												name='idP'
												innerRef={register}
											/>
										</FormGroup>
										<FormGroup>
											<Label for='nombre'>
												{t(
													'configuracion>ofertas_educativas>modelo_de_ofertas>agregar>nombre_de_oferta_educativa',
													'Nombre de oferta educativa'
												)}
											</Label>
											<Input
												readOnly
												type='text'
												name='nombre'
												disabled
												invalid={errors.nombre}
												innerRef={register({
													required: true
												})}
											/>

											{/* {errors['nombre'] && (
												<FormFeedback>
													Este campo es requerido
												</FormFeedback>
											)} */}
										</FormGroup>
										<FormGroup>
											<RequiredLabel for='ofertaId'>
												{t(
													'configuracion>ofertas_educativas>modelo_de_ofertas>agregar>oferta',
													'Oferta'
												)}
											</RequiredLabel>
											<Controller
												name='ofertaId'
												control={control}
												rules={{ required: true }}
												render={({ onChange, value }, { invalid }) => {
													return (
														<Select
															isDisabled={using > 0}
															placeholder=''
															className={`select-rounded react-select form-control ${
																invalid ? 'is-invalid' : ''
															}`}
															styles={{
																container: base => ({
																	...base,
																	border: 'none',
																	padding: '0'
																})
															}}
															classNamePrefix='select-rounded react-select'
															value={{
																id: value,
																nombre: value
																	? state.ofertas.find(
																			item => item.id == value
																	  )?.nombre
																	: null
															}}
															options={state.ofertas}
															noOptionsMessage={() =>
																t('general>no_opt', 'Sin opciones')
															}
															getOptionLabel={(option: any) =>
																option.nombre
															}
															getOptionValue={(option: any) =>
																option.id
															}
															components={{
																Input: CustomSelectInput
															}}
															onChange={e => {
																onChange(e)
																const option = state.ofertas.find(
																	el => el.id == e.id
																)
																if (e.id) {
																	setValue(
																		'nombre',
																		option.nombre
																	)
																	setValue('servicioId', null)
																	setValue('modalidadId', null)
																	setValue('ofertaId', e.id)
																	clearErrors('nombre')
																}
															}}
														/>
													)
												}}
											/>
											{errors.ofertaId && (
												<FormFeedback>
													{t(
														'campo_requerido',
														'Este campo es requerido'
													)}
												</FormFeedback>
											)}
										</FormGroup>
										<FormGroup>
											<RequiredLabel for='modalidadId'>
												{t(
													'configuracion>ofertas_educativas>modelo_de_ofertas>agregar>modalidad',
													'Modalidad'
												)}
											</RequiredLabel>
											<Controller
												name='modalidadId'
												control={control}
												rules={{ required: true }}
												render={({ onChange, value }, { invalid }) => (
													<Select
														isDisabled={using > 0}
														placeholder=''
														className={`select-rounded react-select form-control ${
															invalid ? 'is-invalid' : ''
														}`}
														styles={{
															container: base => ({
																...base,
																border: 'none',
																padding: '0'
															})
														}}
														classNamePrefix='select-rounded react-select'
														value={{
															id: value,
															nombre: value
																? state.modalidades.find(
																		item => item.id == value
																  )?.nombre
																: null
														}}
														options={state.modalidades.map(item => ({
															...item,
															label: item.nombre,
															value: item.id
														}))}
														noOptionsMessage={() =>
															t('general>no_opt', 'Sin opciones')
														}
														getOptionLabel={(option: any) =>
															option.nombre
														}
														getOptionValue={(option: any) => option.id}
														components={{
															Input: CustomSelectInput
														}}
														onChange={e => {
															onChange(e)
															const option = state.modalidades.find(
																el => el.id == e.id
															)
															const offer = watch('ofertaId')
															const offerName = state.ofertas.find(
																el => el.id == offer
															)
															if (offerName && option != null) {
																setValue(
																	'nombre',
																	`${offerName.nombre} - ${option.nombre}`
																)
																setValue('servicioId', null)
																setValue('modalidadId', e.id)
															} else {
																return ErrorEvent
															}
														}}
													/>
												)}
											/>
											{errors.modalidadId && (
												<FormFeedback>
													{t(
														'campo_requerido',
														'Este campo es requerido'
													)}
												</FormFeedback>
											)}
										</FormGroup>
										<FormGroup>
											<RequiredLabel for='servicioId'>
												{t(
													'configuracion>ofertas_educativas>modelo_de_ofertas>agregar>servicio',
													'Servicio'
												)}
											</RequiredLabel>
											<Controller
												name='servicioId'
												control={control}
												rules={{ required: true }}
												render={({ onChange, value }, { invalid }) => (
													<Select
														isDisabled={using > 0}
														placeholder=''
														className={`select-rounded react-select form-control ${
															invalid ? 'is-invalid' : ''
														}`}
														styles={{
															container: base => ({
																...base,
																border: 'none',
																padding: '0'
															})
														}}
														classNamePrefix='select-rounded react-select'
														value={{
															id: value,
															nombre: value
																? state.servicios.find(
																		item => item.id == value
																  )?.nombre
																: null
														}}
														options={state.servicios.map(item => ({
															...item,
															label: item.nombre,
															value: item.id
														}))}
														noOptionsMessage={() =>
															t('general>no_opt', 'Sin opciones')
														}
														getOptionLabel={(option: any) =>
															option.nombre
														}
														getOptionValue={(option: any) => option.id}
														components={{
															Input: CustomSelectInput
														}}
														onChange={e => {
															onChange(e)
															const option = state.servicios.find(
																el => el.id == e.id
															)
															const modality = watch('modalidadId')
															const modalityName =
																state.modalidades.find(
																	el => el.id == modality
																)
															const offer = watch('ofertaId')
															const offerName = state.ofertas.find(
																el => el.id == offer
															)
															if (modalityName && option != null) {
																setValue(
																	'nombre',
																	`${offerName.nombre} - ${modalityName.nombre} - ${option.nombre}`
																)
																setValue('servicioId', e.id)
															}
														}}
													/>
												)}
											/>
											{errors.servicioId && (
												<FormFeedback>
													{t(
														'campo_requerido',
														'Este campo es requerido'
													)}
												</FormFeedback>
											)}
										</FormGroup>
										<FormGroup>
											<Label>
												{t(
													'configuracion>ofertas_educativas>modelo_de_ofertas>agregar>estado',
													' Estado'
												)}
											</Label>
											<Controller
												name='esActivo'
												control={control}
												rules={{ required: true }}
												render={({ value }) => (
													<Select
														className='react-select'
														classNamePrefix='react-select'
														placeholder=''
														value={options.find(
															el => el.value == value
														)}
														onChange={e =>
															setValue('esActivo', e.value)
														}
														options={options}
														isDisabled={
															!editable || !editing || using > 0
														}
														noOptionsMessage={() =>
															t('general>no_opt', 'Sin opciones')
														}
														getOptionLabel={(option: any) =>
															option.label
														}
														getOptionValue={(option: any) =>
															option.value
														}
														components={{
															Input: CustomSelectInput
														}}
													/>
												)}
											/>
											{errors.esActivo && (
												<FormFeedback>
													{t(
														'campo_requerido',
														'Este campo es requerido'
													)}
												</FormFeedback>
											)}
										</FormGroup>
										<FormGroup>
											<RequiredLabel>
												{t(
													'configuracion>ofertas_educativas>modelo_de_ofertas>agregar>niveles',
													' Niveles'
												)}
											</RequiredLabel>
											<StyledMultiSelectTable
												toggle={toggleLevels}
												selectedOptions={selectedLevels}
												isOpen={isOpenLevels}
												editable={editable}
												stagedOptions={stagedLevelsOptions}
												options={state.niveles}
												handleChangeItem={handleChangeLevel}
												columns={1}
												length={200}
											/>
											<span style={{ color: 'red' }}>
												{lvlsError &&
													t('campo_requerido', 'Este campo es requerido')}
											</span>
										</FormGroup>
									</CardBody>
								</Card>
							</Col>
							<Col md={6} xs={12}>
								<Card>
									<CardBody>
										<CardTitle>
											{t(
												'configuracion>ofertas_educativas>modelo_de_ofertas>agregar>detalle_de_especialidades',
												'Detalle de especialidades'
											)}
										</CardTitle>
										<FormGroup>
											<Label>
												{t(
													'configuracion>ofertas_educativas>modelo_de_ofertas>agregar>especialidades',
													' Especialidades'
												)}
											</Label>
											<StyledMultiSelectTable
												toggle={toggleSpecialties}
												selectedOptions={selectedSpecialties}
												isOpen={isOpenSpecialties}
												editable={editable}
												options={state.especialidades}
												stagedOptions={stagedSpecialtiesOptions}
												handleChangeItem={handleChangeSpecialty}
												columns={1}
											/>
										</FormGroup>
									</CardBody>
								</Card>
							</Col>
						</Row>
						<Row>
							{hasEditAccess && (
								<CenteredCol>
									<EditButton
										editable={editable}
										setEditable={() => {
											setEditable()
											toggleForm(false)
										}}
										loading={loading}
									/>
								</CenteredCol>
							)}
						</Row>
					</Form>
				</Container>
			) : (
				<>
					<div className='d-flex justify-content-between align-items-center'>
						<SearchContainer className='mr-4'>
							<div className='search-sm--rounded'>
								<input
									type='text'
									name='keyword'
									id='search'
									value={searchValue || ''}
									onKeyPress={e => {
										if (
											e.charCode == 13 ||
											e.keyCode == 13 ||
											e.key === 'Enter'
										) {
											onSearch(e.target.value)
										}
									}}
									onChange={e => {
										setSearchValue(e.target.value)
									}}
									placeholder={t(
										'place_holder>general>buscar_en_tabla',
										'Buscar en tabla'
									)}
								/>
								<StyledInputGroupAddon style={{ zIndex: 2 }} addonType='append'>
									<Button
										color='primary'
										className='buscador-table-btn-search'
										onClick={() => onSearch(searchValue)}
										id='buttonSearchTable'
									>
										{t('general>buscar', 'Buscar')}
									</Button>
								</StyledInputGroupAddon>
							</div>
						</SearchContainer>
						<div>
							<div
								style={{
									display: 'flex',
									justifyContent: 'flex-end'
								}}
							>
								<Button
									onClick={() => {
										toggleForm()
										setEditable(true)
									}}
									color='primary'
								>
									{t('boton>general>agregrar', 'Agregar')}
								</Button>
								<StyledButtonDropdown
									isOpen={openDropdown}
									toggle={() => {
										setOpenDropdown(!openDropdown)
									}}
								>
									<div className='btn btn-primary btn-lg pl-4 pr-0 check-button check-all'>
										<CustomInput
											className='custom-checkbox mb-0 d-inline-block'
											type='checkbox'
											id='checkAll'
											onClick={e => {
												if (selectedIds.length === items.length) {
													setSelectedIds([])
												} else {
													setSelectedIds(items.map(el => el.id))
												}
											}}
											checked={selectedIds.length === items.length}
										/>
									</div>
									<DropdownToggle
										caret
										color='primary'
										className='dropdown-toggle-split btn-lg'
									/>
									<DropdownMenu right>
										<DropdownItem
											onClick={async () => {
												swal({
													title: 'Confirmación',
													text: t(
														'mensaje_deshabillitado>pregunta',
														'¿Estás seguro de que deseas deshabilitar o habilitar los registros?'
													),
													icon: 'warning',
													className: 'text-alert-modal',
													buttons: {
														cancel: t(
															'boton>general>cancelar',
															'Cancelar'
														),
														ok: {
															text: t(
																'boton>general>si_seguro',
																'Sí, seguro'
															),
															value: true,
															className: 'btn-alert-color'
														}
													}
												}).then(async res => {
													if (res) {
														const response =
															await actions.enableAndDisable(
																'OfertaModalServ',
																selectedIds
															)
														if (!response.error) {
															setSnackbarContent({
																variant: 'success',
																msg: t(
																	'mensaje_deshabilitado',
																	'Se ha deshabilitado los registros'
																)
															})
															handleClick()
															actions.getOfferModels()
														} else {
															if (
																response.error &&
																response.error === 418
															) {
																swal({
																	title: t(
																		'configuracion>anio_educativo>eliminar>titulo',
																		'Atención'
																	),
																	text: t(
																		'configuracion>ofertas>msj_no_puede_inhabilitarla',
																		'Esta oferta tiene registros asociados, no puede inhabilitarla'
																	),
																	icon: 'error',
																	button: t(
																		'general>aceptar',
																		'Aceptar'
																	)
																})
															} else {
																setSnackbarContent({
																	variant: 'error',
																	msg: response.error
																})
																handleClick()
															}
														}
													}
												})
											}}
										>
											{t('boton>general>deshabilitar', 'Deshabilitar')}
										</DropdownItem>
									</DropdownMenu>
								</StyledButtonDropdown>
							</div>
						</div>
					</div>
					<TableReactImplementation avoidSearch columns={columns} data={items} />
				</>
			)}
		</div>
	)
}

const StyledAlert = styled.div`
	height: 3rem;
	width: 5rem;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	background: red;
	color: white;
	border-radius: 24px;
	position: absolute;
	top: 10px;
	right: 10%;
`

const StyledInputGroupAddon = styled(InputGroupAddon)`
	top: 0;
	right: 0;
	position: absolute;
	height: 100%;
	display: flex;
	align-items: center;
`
const SearchContainer = styled.div`
	width: 32vw;
	min-width: 16rem;
`

const StyledButtonDropdown = styled(ButtonDropdown)`
	margin-left: 10px;
	margin-right: 10px;
`

export default ModeloOfertas
