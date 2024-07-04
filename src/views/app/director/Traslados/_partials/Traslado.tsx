import BackIcon from '@material-ui/icons/ArrowBackIos'
import CustomSelectInput from 'Components/common/CustomSelectInput'
import LoaderContainer from 'Components/LoaderContainer'
import SimpleModal from 'Components/Modal/simple'
import { TableReactImplementation } from 'Components/TableReactImplementation'
import { useActions } from 'Hooks/useActions'
import useNotification from 'Hooks/useNotification'
import React, { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import Select from 'react-select'
import {
	Badge,
	Button,
	Card as ReactstrapCard,
	CardBody,
	CardTitle,
	Col,
	FormGroup,
	Input,
	Row
} from 'reactstrap'
import { getGroupsByIntitution } from 'Redux/grupos/actions'
import {
	cancelarSolicitud,
	clearNivelData,
	clearTrasladoData,
	rechazarSolicitudDesdeMiCentro,
	saveRevisionConNivel,
	setMotivoRechazoText,
	setOneTrasladoData,
	setRevisionAnwser
} from 'Redux/traslado/actions'
import styled from 'styled-components'
import swal from 'sweetalert'

import Ofertas from './Ofertas'
import ModalConfirmacion from './utils/_partials/ModalConfirmacion'
import CardEstudiante from './utils/CardEstudiantesolicitud'

const Traslado = props => {
	const { onlyViewModule } = props

	const { t } = useTranslation()
	const [openModal, setOpenModal] = useState(false)
	const [selectedOption, setSelectedOption] = useState(null)
	const [motivos, setMotivo] = useState(null)
	const [openModalOfertas, setOpenModalOfertas] = useState(false)
	const { centerOffersGrouped: centerOffers } = useSelector(store => store.grupos)

	const [snackbarContent, setSnackbarContent] = useState({
		variant: 'error',
		msg: 'hubo un error'
	})
	const [snackbar, handleClick] = useNotification()

	const state = useSelector((store: any) => {
		return {
			trasladoData: store.traslado.trasladoData,
			trasladoDatapropuesto: store.traslado.trasladoData.centroPropuesto,
			trasladoCondicionActual: store.traslado.trasladoData.condicionActual,
			motivoRechazo: store.traslado.motivoRechazo,
			motivo: store.traslado.motivo,
			loading: store.traslado.loading,
			revisionResult: store.traslado.revisionResult,
			entidadMatriculaId: store.traslado.entidadMatriculaId,
			nivelData: store.traslado.nivelData,
			directorEsRevisor: store.traslado.directorEsRevisor,
			idInstitucion: store.authUser.currentInstitution.id
		}
	})

	const { estado, numeroSolicitud, motivoRechazo, motivo, tipoTraslado } =
		state.trasladoData?.infoTraslado
	const actions = useActions({
		setMotivoRechazoText,
		setRevisionAnwser,
		clearNivelData,
		cancelarSolicitud,
		setOneTrasladoData,
		clearTrasladoData,
		saveRevisionConNivel,
		rechazarSolicitudDesdeMiCentro,
		getGroupsByIntitution
	})

	useEffect(() => {
		console.log(state.trasladoData)

		actions.getGroupsByIntitution(state.trasladoData?.centroPropuesto?.id)
	}, [state.idInstitucion])

	const getEstadoSolicitud = () => {
		// type=1, Especialidad, 2 servicio

		switch (estado) {
			case -1:
				return (
					<Badge color='warning' pill>
						Cancelada
					</Badge>
				)

			case 0:
				return (
					<Badge color='info' pill>
						En espera
					</Badge>
				)
			case 1:
				return (
					<Badge color='success' pill>
						Aceptada
					</Badge>
				)
			case 2:
				return (
					<Badge color='danger' pill>
						Rechazada
					</Badge>
				)
		}
	}

	const centropropuesto = [
		{
			codigo: state.trasladoDatapropuesto.codigo,
			direccionRegional: state.trasladoDatapropuesto.direccionRegional,
			diector: state.trasladoDatapropuesto.director,
			locacion: state.trasladoDatapropuesto.locacion,
			nombre: state.trasladoDatapropuesto.nombre,
			tipo: state.trasladoDatapropuesto.tipo,
			oferta: state.trasladoData?.condicionPropuesta?.oferta || state.nivelData?.ofertaNombre,
			nivel: state.trasladoData?.condicionPropuesta?.nivel
		}
	]

	const cancelarSolicitudTraslado = async () => {
		const res = await actions.cancelarSolicitud(state.trasladoData.infoTraslado.id)
		if (res.error) {
			setSnackbarContent({
				variant: 'error',
				msg: res.error
			})
			handleClick()
		} else {
			if (!res.error) {
				swal({
					title: 'Traslado cancelado',
					text: 'El traslado ha sido cancelado con éxito',
					icon: 'success',
					buttons: {
						ok: {
							text: 'Cerrar',
							value: true
						}
					}
				}).then(res => {
					if (res) {
						goBackForm()
					}
				})
			}
		}
		// props.closeModalAlert()
		setOpenModal(false)
		// goBackForm()
	}

	const DEFAULT_COLUMNS = useMemo(() => {
		return [
			{
				label: '',
				column: 'codigo',
				accessor: 'codigo',
				Header: 'Código'
			},
			{
				label: '',
				column: 'nombre',
				accessor: 'nombre',
				Header: 'Centro educativo'
			},
			{
				label: '',
				column: 'tipo',
				accessor: 'tipo',
				Header: 'Tipo de centro educativo'
			},
			{
				label: '',
				column: 'locacion',
				accessor: 'locacion',
				Header: 'Ubicación administrativa'
			},
			{
				label: '',
				column: '',
				accessor: 'nivel',
				Header: 'Nivel propuesto'
			}
		]
	}, [])
	const goBackForm = () => {
		actions.clearTrasladoData()
	}

	return (
		<Row>
			{snackbar(snackbarContent.variant, snackbarContent.msg)}
			<SimpleModal
				openDialog={openModalOfertas}
				title='Seleccionar nivel'
				onClose={() => {
					setOpenModalOfertas(false)
				}}
			>
				<div style={{ minWidth: '60rem', maxWidth: '80rem' }}>
					<div>
						<h6>Selecciona el nivel donde se trasladaran los estudiantes</h6>
						<Ofertas
							institutionId={state.idInstitucion}
							data={centerOffers}
							setTitle={() => {}}
							setSelectedLvl={level => {
								swal({
									title: 'Confirmación',
									text: '¿Esta seguro de que desea realizar esta acción?',
									icon: 'warning',
									buttons: {
										cancel: t('boton>general>cancelar', 'Cancelar'),
										ok: {
											text: t('general>aceptar', 'Aceptar'),
											value: true
										}
									}
								}).then(async res => {
									if (res) {
										const response = await actions.saveRevisionConNivel({
											idTraslado: state?.trasladoData?.infoTraslado?.id,
											estado: selectedOption,
											entidadMatriculaId: level?.entidadMatriculaId,
											nivelOfertaId: level?.nivelOfertaId,
											motivoRechazo: motivos || ''
										})
										if (response.error) {
											setSnackbarContent({
												variant: 'error',
												msg: response.error
											})
											handleClick()
										} else {
											swal({
												title: 'Traslado realizado',
												text: `El traslado ha sido ${
													selectedOption === 1 ? 'realizado' : 'rechazado'
												} con éxito`,
												icon: 'success',
												buttons: {
													ok: {
														text: 'Cerrar',
														value: true
													}
												}
											}).then(() => {
												goBackForm()
											})
										}
									}
									setOpenModalOfertas(false)
								})
							}}
						/>
					</div>
				</div>
			</SimpleModal>
			<Col xs={12} md={12}>
				<>
					<button
						onClick={() => {
							console.clear()
							console.log('click...')
							goBackForm()
						}}
						style={{
							padding: '0',
							margin: '0',
							background: 'unset',
							border: 'none'
						}}
					>
						<Back
							style={{ cursor: 'pointer' }}
							onClick={() => {
								goBackForm()
							}}
						>
							<BackIcon />
							<BackTitle>Regresar</BackTitle>
						</Back>
					</button>
				</>
				<Card>
					<CardBody>
						<Col xs={12} md={12}>
							<h2 className='studentInfo'>
								<strong>Solicitud de traslado:</strong>{' '}
								<span>{numeroSolicitud}</span>
							</h2>

							<CardEstudiante
								estudiante={state.trasladoData?.condicionActual}
								traslado={state.trasladoData?.infoTraslado}
							/>
						</Col>
						<br />
						
						<Col xs={6} md={6}>
							<FormGroup>
								<CardTitle>Motivo del traslado</CardTitle>
								<Textarea
									value={motivo || state.motivo || ''}
									cols='2'
									rows='2'
									readOnly
								/>
							</FormGroup>
						</Col>

						<br />
						{state.trasladoData.infoTraslado.tipoTraslado != 3 && (
							<Col xs={12} md={12}>
								<CardTitle>Condición propuesta</CardTitle>
								<TableReactImplementation
									avoidSearch
									backendPaginated={false}
									columns={DEFAULT_COLUMNS}
									data={centropropuesto}
									handleGetData={async () => {}}
									orderOptions={[]}
									pageSize={10}
									backendSearch
								/>
							</Col>
						)}
						<br />
						
						<Col xs={12} md={12}>
							<h4>Actualmente la solicitud se encuentra: {getEstadoSolicitud()}</h4>
							{state.trasladoData.infoTraslado.estado ===2 && (
								<Col xs={6} md={6}>
								<FormGroup>
									<CardTitle>Motivo del rechazo del traslado:</CardTitle>
									<Textarea
										value={motivoRechazo || state.motivoRechazo || ''}
										cols='2'
										rows='2'
										readOnly
									/>
								</FormGroup>
								
							</Col>
							)}
													
							
							{state.trasladoData?.infoTraslado?.estado === 0 &&
								state.trasladoData?.infoTraslado?.tipo === 'recibido' && (
									<>
										<h6>Respuesta</h6>
										<div
											className=''
											style={{
												maxWidth: '15rem',
												marginBottom: '1rem'
											}}
										>
											<Select
												placeholder='Dar respuesta'
												options={[
													{
														label: 'Aceptar',
														value: 1
													},
													{
														label: 'Rechazar',
														value: 2
													}
												]}
												menuPortalTarget={document.body}
												styles={{
													menuPortal: base => ({
														...base,
														zIndex: 9999
													})
												}}
												onChange={({ value }) => {
													setSelectedOption(value)
												}}
												className='react-select'
												classNamePrefix='react-select'
												components={{
													Input: CustomSelectInput
												}}
											/>
										</div>
									</>
								)}
								
							{selectedOption === 2 && (
								<>
									<h6>Motivo del rechazo</h6>
									<textarea
										rows={4}
										value={motivos}
										onChange={e => {
											setMotivo(e.target.value)
										}}
										minLength={1}
										required
										style={{
											width: '50%',
											resize: 'none'
										}}
									/>
								</>
							)}
							{!onlyViewModule && (
								<>
									{estado == 0 &&
										state.trasladoData.infoTraslado?.tipo === 'recibido' && (
											<FormGroup align='center' style={{ marginTop: '5%' }}>
												<Button
													color='primary'
													outline
													onClick={() => {
														goBackForm()
													}}
												>
													{t('boton>general>cancelar', 'Cancelar')}
												</Button>
												<Button
													color='primary'
													className='ml-3'
													onClick={async () => {
														if (selectedOption === 2 && !motivos) {
															setSnackbarContent({
																variant: 'error',
																msg: 'Necesita un motivo de rechazo'
															})
															handleClick()
															return
														}
														if (
															selectedOption === 1 &&
															state?.trasladoData?.infoTraslado
																?.tipoTraslado !== 2
														) {
															setOpenModalOfertas(true)
															return
														}

														if (
															selectedOption === 1 &&
															state?.trasladoData?.infoTraslado
																?.tipoTraslado === 2
														) {
															const res =
																await actions.saveRevisionConNivel({
																	idTraslado:
																		state?.trasladoData
																			?.infoTraslado?.id,
																	estado: selectedOption,
																	entidadMatriculaId:
																		state?.trasladoData
																			?.condicionPropuesta
																			?.idEntidadMatricula,
																	nivelOfertaId:
																		state?.trasladoData
																			?.condicionPropuesta
																			?.nivelOfertaId,
																	motivoRechazo: motivos || ''
																})

															if (!res.error) {
																swal({
																	title: t(
																		'traslados>mensaje>titulo',
																		'Traslado realizado'
																	),
																	text: t(
																		'traslados>mensaje',
																		'El traslado ha sido realizado con éxito'
																	),
																	icon: 'success',
																	buttons: {
																		ok: {
																			text: t(
																				'general>cerrar',
																				'Cerrar'
																			),
																			value: true
																		}
																	}
																}).then(() => {
																	goBackForm()
																})
															} else {
																setSnackbarContent({
																	variant: 'error',
																	msg: res.error
																})
																handleClick()
																return
															}
															return
														}

														if (selectedOption==null || selectedOption==undefined){
															setSnackbarContent({
																variant: 'error',
																msg: 'Por favor, seleccione una opción de respuesta.'
															})
															handleClick()
															return;

														}
														const res =
															await actions.rechazarSolicitudDesdeMiCentro(
																{
																	idTraslado:
																		state?.trasladoData
																			?.infoTraslado?.id,
																	estado: selectedOption,
																	entidadMatriculaId: 0,
																	nivelOfertaId: 0,
																	motivoRechazo: motivos
																}
															)

														if (res.error) {
															setSnackbarContent({
																variant: 'error',
																msg: res.error
															})
															handleClick()
														} else {
															swal({
																title: t(
																	'traslados>mensaje>titulo_error',
																	'Traslado rechazado'
																),
																text: 'El traslado ha sido rechazado con éxito',
																icon: 'success',
																buttons: {
																	ok: {
																		text: t(
																			'general>cerrar',
																			'Cerrar'
																		),
																		value: true
																	}
																}
															}).then(res => {
																if (res) {
																	goBackForm()
																}
															})
														}
													}}
												>
													Guardar
												</Button>
											</FormGroup>
										)}

									{estado === 0 &&
										state.trasladoData.infoTraslado?.tipo === 'enviado' && (
											<div className='d-flex justify-content-center align-items-center'>
												<Button
													color='primary'
													onClick={() => {
														setOpenModal(true)
													}}
												>
													Cancelar solicitud
												</Button>
											</div>
										)}
								</>
							)}
						</Col>

						{state.loading && <LoaderContainer />}

						<ModalConfirmacion
							numeroSolicitud={state.trasladoData.infoTraslado.numeroSolicitud}
							cancelarSolicitudTraslado={cancelarSolicitudTraslado}
							openModal={openModal}
							setOpenModal={setOpenModal}
						/>
					</CardBody>
				</Card>
			</Col>
		</Row>
	)
}

const Card = styled(ReactstrapCard)`
	margin: 0.5rem;
`

const Textarea = styled.textarea`
	width: 100%;
	border-color: #ddd;
	padding: 10px;
	outline: 0;
`

const Back = styled.div`
	display: flex;
	align-items: center;
	cursor: pointer;
	padding: 0 5px;
	margin-bottom: 20px;
`

const BackTitle = styled.span`
	color: #000;
	font-size: 14px;
	font-size: 16px;
`

export default Traslado
