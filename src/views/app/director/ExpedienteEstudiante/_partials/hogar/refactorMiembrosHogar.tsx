import React, { useState, useMemo } from 'react'
import styled from 'styled-components'
import { useTranslation } from 'react-i18next'
import Select from 'react-select'
import NavigationContainer from 'Components/NavigationContainer'
import moment from 'moment'
import {
	Row,
	Col,
	Card,
	CardBody,
	Label,
	Button,
	Container,
	FormFeedback,
	CardTitle,
	CustomInput
} from 'reactstrap'
import { TableReactImplementation } from 'Components/TableReactImplementation'
import colors from 'Assets/js/colors'
import IconButton from '@material-ui/core/IconButton'
import CustomSelectInput from 'Components/common/CustomSelectInput'
import SimpleModal from 'Components/Modal/simple'
import WizardRegisterIdentityModal from 'Views/app/configuracion/Identidad/_partials/wizardRegisterIdentityModal'
import {
	clearWizardDataStore,
	clearWizardNavDataStore
} from 'Redux/identidad/actions'
import { Colxx } from 'Components/common/CustomBootstrap'
import DatePicker from 'react-datepicker'
import IntlMessages from 'Helpers/IntlMessages'
import ReactInputMask from 'react-input-mask'
import useMiembrosHogar from './useMiembrosHogar'
import { IoMdTrash } from 'react-icons/io'
import { HiPencil } from 'react-icons/hi'
import Tooltip from '@mui/material/Tooltip'
import useNotification from 'Hooks/useNotification'
import UploadComponent from './UploadComponent'
import Avatar from './Avatar'
import { getFamilyMembers } from 'Redux/miembros/actions'
import { useActions } from 'Hooks/useActions'
import { useSelector } from 'react-redux'
import Loader from 'Components/Loader'
import swal from 'sweetalert'
import RequiredSpan from 'Components/Form/RequiredSpan'
import styles from './Hogar.css'
import withAuthorization from '../../../../../../Hoc/withAuthorization'
import { withRouter } from 'react-router-dom'

const RefactorMiembrosHogar = props => {
	const [loadingRegistrarModal, setLoadingRegistrarModal] = useState(false)
	const [loading, setLoading] = useState(false)
	const [showDiscapacidadesModal, setShowDiscapacidadesModal] = useState(false)
	const [showRegisterModal, setShowRegisterModal] = useState(false)
	const [snackbarContent, setSnackbarContent] = useState({
		msg: 'welcome',
		variant: 'info'
	})
	const [snackBar, handleClick] = useNotification()

	const [data, setData] = useState([])

	const idEstudiante = useSelector((store: any) => {
		return store.expedienteEstudiantil.currentStudent.idEstudiante
	})
	const identification = useSelector(store => store.identification)
	const actions = useActions({
		getFamilyMembers,
		clearWizardDataStore,
		clearWizardNavDataStore
	})
	const loadFamilyMembers = () => {
		setLoading(true)
		actions
			.getFamilyMembers(idEstudiante)
			.then(response => {
				const mapeador = i => {
					return {
						...i,
						encargadoLegal: i.encargadoLegal ? 'Sí' : 'No',
						encargado: i.encargado ? 'Sí' : 'No'
					}
				}
				setLoading(false)
				if (!response.error) {
					setData(response.data.map(mapeador))
				}
			})
			.catch(() => setLoading(false))
	}

	const closeRegistrarPersona = async () => {
		await actions.clearWizardDataStore()
		await actions.clearWizardNavDataStore()
		setShowRegisterModal(false)
	}

	const guardarNuevaPersona = async _student => {
		try {
			await actions.clearWizardDataStore()
			await actions.clearWizardNavDataStore()
			events.addMiembroFromModal(_student.identificacion)
			events.toggleShowModalBusqueda(false)
			setLoadingRegistrarModal(false)
			closeRegistrarPersona()
		} catch (error) {
			events.toggleShowModalBusqueda(false)
			setLoadingRegistrarModal(false)
			closeRegistrarPersona()
		}
	}

	const { formData, catalogs, events } = useMiembrosHogar({
		setSnackbarContent,
		handleClick
	})

	React.useEffect(() => {
		if (!idEstudiante) return
		loadFamilyMembers()
	}, [])

	const closeModalNoEncontrado = () => {
		events.toggleShowModalBusqueda(false)
	}

	const { t } = useTranslation()

	const onAgregarEvent = () => {
		events.clearForm()
		events.toggleShowForm(true)
		events.toggleEditable(true)
		events.toggleNuevo(true)
	}
	const columns = useMemo(() => {
		return [
			{
				Header: t(
					'estudiantes>expediente>hogar>miembros_hogar>col_relacion_estudiante',
					'Relación con el estudiante'
				),
				column: 'parentesco',
				accessor: 'parentesco',
				label: ''
			},
			{
				Header: t(
					'estudiantes>expediente>hogar>miembros_hogar>col_nombre',
					'Nombre'
				),
				column: 'nombre',
				accessor: 'nombre',
				label: ''
			},
			{
				Header: t(
					'estudiantes>expediente>hogar>miembros_hogar>col_apellido_1',
					'Primer apellido'
				),
				column: 'primerApellido',
				accessor: 'primerApellido',
				label: ''
			},
			{
				Header: t(
					'estudiantes>expediente>hogar>miembros_hogar>col_apellido_2',
					'Segundo apellido'
				),
				column: 'segundoApellido',
				accessor: 'segundoApellido',
				label: ''
			},
			/* {
				Header: t('estudiantes>expediente>hogar>miembros_hogar>col_rol', 'Rol'),
				column: 'nombreRol',
				accessor: 'nombreRol',
				label: ''
			}, */
			{
				Header: t(
					'estudiantes>expediente>hogar>miembros_hogar>col_represen_legal',
					'Representante legal'
				),
				column: 'encargado',
				accessor: 'encargado',
				label: ''
			},
			{
				Header: t('general>acciones', 'Acciones'),
				column: '',
				accessor: '',
				label: '',
				Cell: ({ _, row, data }) => {
					const fullRow = data[row.index]

					return (
						<div
							style={{
								display: 'flex',
								justifyContent: 'center',
								alignItems: 'center',
								alignContent: 'center'
							}}
						>
							<button
								style={
									props.validations.modificar
										? {
												border: 'none',
												background: 'transparent',
												cursor: 'pointer',
												color: 'grey'
										  }
										: { display: 'none' }
								}
								onClick={async () => {
									setLoading(true)
									await events.onEditarClick(fullRow.id)
									setLoading(false)
									// props.authHandler('modificar', () => {
									//   setMemberDetailOpen(true)
									// })
								}}
							>
								<Tooltip title="Actualizar">
									<IconButton>
										<HiPencil style={{ fontSize: 30 }} />
									</IconButton>
								</Tooltip>
							</button>
							<button
								style={
									props.validations.eliminar
										? {
												border: 'none',
												background: 'transparent',
												cursor: 'pointer',
												color: 'grey'
										  }
										: { display: 'none' }
								}
								onClick={() => {
									swal({
										title: 'Eliminar Miembro',
										text: '¿Esta seguro de que desea eliminar el miembro del hogar?',
										icon: 'warning',
										className: 'text-alert-modal',
										buttons: {
											cancel: 'Cancelar',
											ok: {
												text: 'Eliminar',
												value: true,
												className: 'btn-alert-color'
											}
										}
									}).then(async result => {
										if (result) {
											const age = identification.data?.fechaNacimiento
												? moment().diff(
														identification.data?.fechaNacimiento,
														'years',
														false
												  )
												: 0
											debugger
											if (
												age < 18 &&
												fullRow.encargado &&
												data.filter(el => el?.encargado === 'Sí').length === 1
											) {
												setSnackbarContent({
													msg: 'No se puede eliminar la relación de encargado con el estudiante, hasta que incluya un nuevo encargado',
													variant: 'error'
												})
												handleClick()

												return
											}
											if (
												(fullRow.encargadoLegal && data.length < 1) ||
												!fullRow.encargadoLegal
											) {
												setSnackbarContent({
													msg: 'No se puede eliminar la relación de encargado con el estudiante, hasta que incluya un nuevo encargado',
													variant: 'error'
												})
												handleClick()
											} else {
												// toggle(!modal.show, fullRow.id)
												setLoading(true)
												await events.onDeleteClick(fullRow.id)
												await loadFamilyMembers()
												setLoading(false)
											}
										}
									})
								}}
							>
								<Tooltip title="Deshabilitar relación">
									<IconButton>
										<IoMdTrash style={{ fontSize: 30 }} />
									</IconButton>
								</Tooltip>
							</button>
						</div>
					)
				}
			}
		]
	}, [t])

	const onRegresarEvent = () => {
		events.clearForm()
		events.toggleEditable(false)
		events.toggleShowForm(false)
		loadFamilyMembers()
	}

	return (
		<div className={styles}>
			{loading && (
				<div
					style={{
						display: 'flex',
						justifyContent: 'center',
						alignItems: 'center',
						width: '100%',
						height: '100vh',
						overflow: 'hidden',
						pointerEvents: 'auto',
						cursor: 'wait',
						left: 0,
						top: 0,
						position: 'fixed',
						zIndex: 1
					}}
				>
					<Loader />
				</div>
			)}
			{snackBar(snackbarContent.variant, snackbarContent.msg)}
			{!formData.showForm && (
				<>
					<TableReactImplementation
						showAddButton={props.validations.agregar}
						msjButton="Agregar miembro"
						onSubmitAddButton={() => onAgregarEvent()}
						data={data}
						columns={columns}
					/>
				</>
			)}
			{formData.showForm && (
				<>
					<NavigationContainer goBack={() => onRegresarEvent()} />
					<h4 className="mt-2">
						{t(
							'estudiantes>expediente>hogar>miembros_hogar>agregar>info_gen',
							'Información general'
						)}
					</h4>
					<br />
					<Card>
						<CardBody>
							<Row>
								<Col sm="12" md="4">
									<h4>
										{t(
											'estudiantes>expediente>hogar>miembros_hogar>agregar>info_personal',
											'Información personal'
										)}
									</h4>

									<div className="container-center container-avatar-expediente">
										<div
											className="content-avatar-expediente mb-3"
											id="image_form"
										>
											<Avatar value={formData.imagen} disabled={true} />
										</div>
									</div>
								</Col>

								<Col sm="12" md="8" className="mt-sm-2">
									<Label>
										{t(
											'estudiantes>expediente>info_gen>info_gen>num_id',
											'Número de identificación'
										)}
										<RequiredSpan />
									</Label>
									<InputContainer>
										<Input
											type="text"
											name="identificacion"
											value={formData.identificacion}
											disabled={formData.editable && formData.miembroId != null}
											onChange={events.onIdentificacionChange}
										/>
									</InputContainer>
									<Label className="mt-3">
										{t(
											'estudiantes>expediente>info_gen>info_gen>tipo_id',
											'Tipo de identificación'
										)}
									</Label>
									<Select
										components={{
											Input: CustomSelectInput
										}}
										className="react-select"
										classNamePrefix="react-select"
										options={catalogs.tipoIdentificacionCatalog}
										value={formData.tipoIdentificacion}
										placeholder=""
										isDisabled
										onChange={events.onTipoIdentificacionChange}
									/>
									<Label className="mt-3">
										{t(
											'estudiantes>expediente>info_gen>info_gen>nacionalidad',
											'Nacionalidad'
										)}
									</Label>
									<Select
										components={{
											Input: CustomSelectInput
										}}
										className="react-select"
										classNamePrefix="react-select"
										options={catalogs.nacionalidadCatalog}
										placeholder=""
										value={formData.nacionalidad}
										isDisabled
										onChange={events.onNacionalidadChange}
									/>
								</Col>
							</Row>
						</CardBody>
					</Card>
					<Row>
						<Colxx xxs="12" md="6" className="mt-5">
							<Card>
								<CardBody>
									<CardTitle>
										{t(
											'estudiantes>expediente>hogar>miembros_hogar>agregar>titulo',
											'Información general'
										)}
									</CardTitle>
									<Row>
										<Col sm="12">
											<Label className="">
												{t(
													'estudiantes>expediente>hogar>miembros_hogar>agregar>nombre',
													'Nombre'
												)}
											</Label>

											<Input
												type="text"
												name="nombre"
												value={formData.nombre}
												disabled
												onChange={events.onNombreChange}
											/>
											<FormFeedback />
										</Col>
										<Col sm="12">
											<Label className="mt-3">
												{t(
													'estudiantes>expediente>hogar>miembros_hogar>agregar>apellido_1',
													'Primer apellido'
												)}
											</Label>
											<Input
												type="text"
												name="primerApellido"
												value={formData.primerApellido}
												disabled
												onChange={events.onPrimerApellidoChange}
											/>
											<FormFeedback />
										</Col>
										<Col sm="12">
											<Label className="mt-3">
												{t(
													'estudiantes>expediente>hogar>miembros_hogar>agregar>apellido_2',
													'Segundo apellido'
												)}
											</Label>
											<Input
												type="text"
												name="segundoApellido"
												value={formData.segundoApellido}
												disabled
												onChange={events.onSegundoApellidoChange}
											/>
										</Col>
										<Col sm="12">
											<Label className="mt-3">
												{t(
													'estudiantes>expediente>hogar>miembros_hogar>agregar>conocido',
													'Conocido como'
												)}
											</Label>
											<Input
												type="text"
												name="conocidoComo"
												value={formData.conocidoComo}
												disabled
												onChange={events.onConocidoComoChange}
											/>
											<FormFeedback />
										</Col>
										<Col sm="12">
											<Label className="mt-3">
												{t(
													'estudiantes>expediente>hogar>miembros_hogar>agregar>nacimiento',
													'Fecha de nacimiento'
												)}
											</Label>
											{
												<DatePicker
													style={{ paddingLeft: '0px', color: '#000' }}
													dateFormat="dd/MM/yyyy"
													peekNextMonth
													showMonthDropdown
													showYearDropdown
													selectsStart
													maxDate={[]}
													disabled
													selected={
														formData.fechaNacimiento
															? moment(formData.fechaNacimiento).toDate()
															: null
													}
													onChange={events.onFechaNacimientoChange}
												/>
											}
											<FormFeedback />
										</Col>
										<Col sm="12">
											<Label className="mt-3">
												{t(
													'estudiantes>expediente>hogar>miembros_hogar>agregar>sexo',
													'Sexo'
												)}
											</Label>
											<Select
												components={{
													Input: CustomSelectInput
												}}
												className="react-select"
												classNamePrefix="react-select"
												options={catalogs.sexoCatalog}
												placeholder=""
												value={formData.sexo}
												isDisabled
												onChange={events.onSexoChange}
											/>
											<FormFeedback />
										</Col>
										<Col sm="12">
											<Label className="mt-3">
												{t(
													'estudiantes>expediente>hogar>miembros_hogar>agregar>identidad_gen',
													'Identidad de género'
												)}
											</Label>
											<Select
												components={{
													Input: CustomSelectInput
												}}
												className="react-select"
												classNamePrefix="react-select"
												options={catalogs.identidadGeneroCatalog}
												placeholder=""
												value={formData.identidadGenero}
												isDisabled
												onChange={events.onIdentidadGeneroChange}
											/>
										</Col>
										<Col sm="12">
											<Label className="mt-3">
												{t(
													'estudiantes>expediente>hogar>miembros_hogar>agregar>escolaridad',
													'Escolaridad'
												)}
											</Label>
											<Select
												components={{
													Input: CustomSelectInput
												}}
												className="react-select"
												classNamePrefix="react-select"
												options={catalogs.escolaridadCatalog}
												placeholder=""
												value={formData.escolaridad}
												onChange={events.onEscolaridadChange}
												isDisabled={!formData.editable}
											/>
											<FormFeedback />
										</Col>
										<Col sm="12">
											<Label className="mt-3">
												{t(
													'estudiantes>expediente>hogar>miembros_hogar>agregar>condicion_lab',
													'Condición laboral'
												)}
											</Label>
											<Select
												components={{
													Input: CustomSelectInput
												}}
												className="react-select"
												classNamePrefix="react-select"
												options={catalogs.condicionLaboralCatalog}
												placeholder=""
												value={formData.condicionLaboral}
												isDisabled={!formData.editable}
												onChange={events.onCondicionLaboralChange}
											/>
											<FormFeedback />
										</Col>
										<Col sm="12">
											<Label className="mt-3">
												{t(
													'estudiantes>expediente>hogar>miembros_hogar>agregar>condicion_discap',
													'Condición de discapacidad'
												)}
											</Label>
											<StyledMultiSelect
												disabled={!formData.editable}
												onClick={() => {
													events.onDiscapacidadesClick()
													setShowDiscapacidadesModal(true)
												}}
											>
												{formData.condicionDiscapacidad?.map(discapacidad => {
													return <ItemSpan>{discapacidad.nombre}</ItemSpan>
												})}
											</StyledMultiSelect>
										</Col>
									</Row>
								</CardBody>
							</Card>
						</Colxx>
						<Colxx xxs="12" md="6" className="mt-5">
							<Card className="mb-5">
								<CardBody>
									<Row>
										<Col sm="12" md="12">
											<h5 className="card-title">
												<IntlMessages id="menu.info-contacto" />
											</h5>
										</Col>
										<Col sm="12" md="12">
											<Label className="">
												{t(
													'estudiantes>expediente>hogar>miembros_hogar>agregar>tel_prin',
													'Teléfono principal'
												)}
												<RequiredSpan />
											</Label>
											<ReactInputMask
												mask="9999-9999"
												value={formData.telefonoPrincipal}
												disabled={!formData.editable}
												type="text"
												name="telefono"
												onChange={events.onTelefonoPrincipalChange}
											>
												{inputProps => (
													<Input
														{...inputProps}
														disabled={!formData.editable}
													/>
												)}
											</ReactInputMask>
											<FormFeedback />
										</Col>
										<Col sm="12" md="12">
											<Label className="mt-3">
												{t(
													'estudiantes>expediente>hogar>miembros_hogar>agregar>tel_alt',
													'Teléfono alternativo'
												)}
											</Label>
											<ReactInputMask
												type="text"
												mask="9999-9999"
												name="telefonoSecundario"
												value={formData.telefonoAlternativo}
												disabled={!formData.editable}
												onChange={events.onTelefonoAlternativoChange}
											>
												{inputProps => (
													<Input
														{...inputProps}
														disabled={!formData.editable}
													/>
												)}
											</ReactInputMask>
											<FormFeedback />
										</Col>
										<Col sm="12" md="12">
											<Label className="mt-3">
												{t(
													'estudiantes>expediente>hogar>miembros_hogar>agregar>correo',
													'Correo electrónico'
												)}
											</Label>
											<Input
												type="email"
												name="email"
												value={formData.correo}
												disabled={!formData.editable}
												onChange={events.onCorreoChange}
											/>
											<FormFeedback />
										</Col>
									</Row>
								</CardBody>
							</Card>
							<Card>
								<CardBody>
									<Row>
										<Col sm="12" md="12">
											<h5 className="card-title">
												{t(
													'estudiantes>expediente>hogar>miembros_hogar>agregar>asociacion',
													'Asociación'
												)}
											</h5>
										</Col>
										<Col sm="12" md="12">
											<Label className="mb-3">
												{t(
													'estudiantes>expediente>hogar>miembros_hogar>agregar>relacion_est',
													'Relación con estudiante'
												)}
												<RequiredSpan />
											</Label>
											<Select
												className="react-select"
												classNamePrefix="react-select"
												components={{
													Input: CustomSelectInput
												}}
												isDisabled={!formData.editable}
												placeholder={t('general>seleccionar', 'Seleccionar')}
												value={formData.relacionConEstudiante}
												onChange={events.onRelacionConEstudianteChange}
												options={catalogs.relacionConEstudianteCatalog}
											/>
											<span style={{ color: 'red' }}>
												{/* {props.fields["ParentescoId"] && props.errors["ParentescoId"]} */}
											</span>
											<Label className="mt-3">
												{t(
													'estudiantes>expediente>hogar>miembros_hogar>agregar>encargado_est',
													'¿Es el encargado del estudiante?'
												)}
											</Label>
											<div>
												<CustomInput
													name="esEncargado"
													type="radio"
													disabled={!formData.editable}
													value
													inline
													label={t('general>si', 'Si')}
													checked={formData.esEncargadoDelEstudiante}
													onClick={events.onEsEncargadoDelEstudianteChange}
												/>
												<CustomInput
													name="esEncargado"
													type="radio"
													disabled={!formData.editable}
													value={false}
													inline
													label={t('general>no', 'No')}
													checked={!formData.esEncargadoDelEstudiante}
													onClick={events.onEsEncargadoDelEstudianteChange}
												/>
											</div>
											{formData.esEncargadoDelEstudiante && (
												<UploadComponent
													id="encargado"
													removeElement={events.onDocumentoEncargadoRemove}
													files={formData.documentosEncargado}
													addImage={events.onDocumentoEncargadoChange}
												/>
											)}
										</Col>
										<Col sm="12" md="12">
											<Label className="mt-3">
												{t(
													'estudiantes>expediente>hogar>miembros_hogar>agregar>represen_legal_est',
													'¿Es el representante legal del estudiante?'
												)}
											</Label>
											<div>
												<CustomInput
													type="radio"
													disabled={!formData.editable}
													inline
													label={t('general>si', 'Si')}
													value="true"
													checked={formData.esRepresentanteLegalEstudiante}
													onClick={
														events.onEsRepresentanteLegalEstudianteChange
													}
												/>
												<CustomInput
													type="radio"
													disabled={!formData.editable}
													inline
													label={t('general>no', 'No')}
													value="false"
													checked={!formData.esRepresentanteLegalEstudiante}
													onClick={
														events.onEsRepresentanteLegalEstudianteChange
													}
												/>
											</div>
											{formData.esRepresentanteLegalEstudiante && (
												<UploadComponent
													id="representante"
													removeElement={
														events.onDocumentoRepresentanteLegalRemove
													}
													files={formData.documentosRepresentanteLegal}
													addImage={events.onDocumentoRepresentanteLegalChange}
												/>
											)}
										</Col>

										<Col sm="12" md="12">
											<Label className="mt-3">
												{t(
													'estudiantes>expediente>hogar>miembros_hogar>agregar>vive_est',
													'¿Vive con estudiante?'
												)}
											</Label>
											<div>
												<CustomInput
													type="radio"
													disabled={!formData.editable}
													inline
													label={t('general>si', 'Si')}
													value="true"
													checked={formData.viveConEstudiante}
													onClick={events.onViveConEstudianteChange}
												/>
												<CustomInput
													type="radio"
													disabled={!formData.editable}
													inline
													label={t('general>no', 'No')}
													value="false"
													checked={!formData.viveConEstudiante}
													onClick={events.onViveConEstudianteChange}
												/>
											</div>
										</Col>
										<Col sm="12" md="12">
											<Label className="mt-3">
												{t(
													'estudiantes>expediente>hogar>miembros_hogar>agregar>depende_econ_est',
													'¿Depende económicamente del estudiante?'
												)}
											</Label>
											<div>
												<CustomInput
													type="radio"
													disabled={!formData.editable}
													inline
													label={t('general>si', 'Si')}
													value="true"
													checked={formData.dependeEconomicamente}
													onClick={events.onDependeEconomicamenteChange}
												/>
												<CustomInput
													type="radio"
													disabled={!formData.editable}
													inline
													label={t('general>no', 'No')}
													value="false"
													checked={!formData.dependeEconomicamente}
													onClick={events.onDependeEconomicamenteChange}
												/>
											</div>
										</Col>
									</Row>
								</CardBody>
							</Card>
						</Colxx>
						<div className="container-center my-5 mb-3">
							{!formData.editable ? (
								<Button color="primary" onClick={events.toggleEditable}>
									Editar
								</Button>
							) : (
								<>
									<Button
										className="mr-2"
										outline
										color="primary"
										onClick={onRegresarEvent}
									>
										Cancelar
									</Button>
									<Button
										color="primary"
										onClick={async () => {
											setLoading(true)
											await events.onGuardarClick()
											setLoading(false)
										}}
									>
										Guardar
									</Button>
								</>
							)}
							{/* <EditButton
                                editable={editable}
                                setEditable={setEditable}
                                loading={loadingOnSave}
                            /> */}
						</div>
						{/* <Modal isOpen={openFilesModal}>
                            <ModalHeader toggle={handleCloseFiles} />
                            <ModalBody>
                                <div>
                                    {files &&
                                        files.map((item) => {
                                            return (
                                                <FileAnchorContainer>
                                                    <a
                                                        href={item.descripcion}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                    >
                                                        {item.name ||
                                                            item.titulo}
                                                    </a>
                                                    <span
                                                        onClick={() => {
                                                            handleResourceDelete(
                                                                item
                                                            )
                                                        }}
                                                    >
                                                        <HighlightOffIcon />
                                                    </span>
                                                </FileAnchorContainer>
                                            )
                                        })}
                                </div>
                            </ModalBody>
                        </Modal>
                        <Modal
                            isOpen={alertModalOpen}
                            toggle={toggleAlertModal}
                        >
                            <ModalHeader toggle={toggleAlertModal}>
                                {t('estudiantes>expediente>hogar>miembros_hogar>agregar>imagen>accion_no_permitida', 'Acción no permitida')}
                            </ModalHeader>
                            <ModalBody>
                                <div>
                                    <p>
                                        {t('estudiantes>expediente>hogar>miembros_hogar>agregar>imagen>accion_no_permitida>mensaje', 'Para poder adjuntar archivos como imagenes o documentos debe primero crear el miembro')}

                                    </p>
                                </div>
                            </ModalBody>
                        </Modal> */}
					</Row>{' '}
				</>
			)}

			<SimpleModal
				openDialog={formData.showModalBusqueda}
				onClose={closeModalNoEncontrado}
				onConfirm={() => {
					closeModalNoEncontrado()
					setShowRegisterModal(true)
				}}
				txtBtn={t('boton>general>registrar', 'Registrar')}
				title={t(
					'estudiantes>registro_matricula>matricula_estudian>buscar>persona_no_encontrada',
					'Persona no encontrada'
				)}
			>
				<>
					<p>
						{t(
							'estudiantes>registro_matricula>matricula_estudian>buscar>persona_no_encontrada>texto',
							'No se ha encontrado una persona con el número de identificación ingresado'
						)}
					</p>
					<p>
						{t(
							'estudiantes>registro_matricula>matricula_estudian>buscar>persona_no_encontrada>texto2',
							'Puede registrarlo haciendo click en "Registrar"'
						)}
					</p>
				</>
			</SimpleModal>

			<SimpleModal
				openDialog={showRegisterModal}
				onClose={() => closeRegistrarPersona()}
				actions={false}
				title={t(
					'estudiantes>registro_matricula>matricula_estudian>buscar>registrar_persona',
					'Registrar persona'
				)}
			>
				<>
					<WizardRegisterIdentityModal onConfirm={guardarNuevaPersona} />
					{loadingRegistrarModal && <Loader />}
				</>
			</SimpleModal>
			<SimpleModal
				openDialog={showDiscapacidadesModal}
				onClose={() => setShowDiscapacidadesModal(false)}
				title="Condición de discapacidad"
				actions={false}
			>
				<Container className="modal-detalle-subsidio">
					<Row>
						<Col xs={12}>
							{catalogs.discapacidadesCatalog.map(item => {
								return (
									<Row
										style={{
											borderBottom: '1px solid',
											marginTop: '10px',
											paddingBottom: '10px'
										}}
										onClick={_ =>
											events.onDiscapacidadesSeleccionadasClick(item)
										}
									>
										<Col xs={3} className="modal-detalle-subsidio-col">
											<OnlyVert>
												<CustomInput
													type="checkbox"
													label={item.nombre}
													inline
													onClick={_ =>
														events.onDiscapacidadesSeleccionadasClick(item)
													}
													checked={formData.condicionDiscapacidadSeleccionadas.find(
														i => i.id == item.id
													)}
												/>
											</OnlyVert>
										</Col>
										<Col xs={9} className="modal-detalle-subsidio-col">
											<OnlyVert>
												{item.descripcion
													? item.descripcion
													: item.detalle
													? item.detalle
													: 'Elemento sin detalle actualmente'}
											</OnlyVert>
										</Col>
									</Row>
								)
							})}
						</Col>
					</Row>
					<Row>
						<CenteredRow xs="12">
							<Button
								onClick={() => setShowDiscapacidadesModal(false)}
								color="primary"
								outline
								className="mr-3"
							>
								Cancelar
							</Button>
							<Button
								color="primary"
								onClick={() => {
									events.onDiscapacidadesGuardarClick()
									setShowDiscapacidadesModal(false)
								}}
							>
								Guardar
							</Button>
						</CenteredRow>
					</Row>
				</Container>
			</SimpleModal>
		</div>
	)
}

export default withAuthorization({
	id: 6,
	Modulo: 'Expediente Estudiantil',
	Apartado: 'Informacion del Hogar',
	Seccion: 'Miembros del hogar'
})(withRouter(RefactorMiembrosHogar))

const InputContainer = styled.div`
	display: flex;
`

const Input = styled.input`
	border-radius: 0.1rem;
	outline: initial !important;
	box-shadow: initial !important;
	font-size: 0.8rem;
	padding: 0.75rem;
	line-height: 1;
	border: 1px solid #d7d7d7;
	background: ${props => (props.disabled == true ? '#e9ecef' : 'white')};
	width: 100%;
	color: #000;
`

const CenteredRow = styled(Col)`
	display: flex;
	justify-content: center;
	align-items: center;
`

const CenterDiv = styled.div`
	display: flex;
	width: 100%;
	justify-content: center;
	align-items: center;
`

const StyledMultiSelect = styled.div`
	&[disabled] {
		background-color: #eaeaea;
	}
	min-height: 8rem;
	border: 1px solid #eaeaea;
	padding: 0.25rem;
	color: white;
	word-break: break-all;
`

const OnlyVert = styled(CenterDiv)`
	display: flex;
	width: 100%;
	justify-content: left !important;
	align-items: center;
`

const ItemSpan = styled.span`
	background-color: ${colors.primary};
	margin-right: 8px;
	margin-top: 0.25rem;
	border-radius: 15px;
	padding: 2px;
`
