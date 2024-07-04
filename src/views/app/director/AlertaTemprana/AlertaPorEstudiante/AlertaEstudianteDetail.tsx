import React from 'react'
import styled from 'styled-components'
import { uploadFicha } from '../../../../../redux/alertaTemprana/actionsAlerts'
import {
	getAlertById,
	getAlertByStudent,
	createAlertStepByStudent,
	closeAlertStudent
} from '../../../../../redux/alertaTemprana/actionStudent'
import { useSelector } from 'react-redux'
import { useActions } from 'Hooks/useActions'
import { Button } from 'reactstrap'
import AddIcon from '@material-ui/icons/CloudUploadOutlined'
import swal from 'sweetalert'
import BackIcon from '@material-ui/icons/ArrowBackIos'

import Observaciones from '../modals/Observaciones'
import AgregarObservaciones from '../modals/AgregarObservacion'
import StepFiles from '../modals/StepFiles'
import CerrarAlerta from '../modals/CerrarAlert'

type IProps = {
	currentStudent: any
	handleClearStudent: Function
	handleBack: Function
	updateView: Function
}

type IStore = {
	alertaTemprana: any
}

const AlertaEstudianteDetail: React.FC<IProps> = props => {
	const [activeStep, setActiveStep] = React.useState<number>(-1)
	const [key, setKey] = React.useState<number>(0)
	const [currentStep, setCurrentStep] = React.useState<any>(null)
	const [loading, setLoading] = React.useState<boolean>(false)
	const [uploading, setUploading] = React.useState<boolean>(false)
	const [visibleObservations, setVisibleObservations] = React.useState<boolean>(false)
	const [observationsModal, setObservationsModal] = React.useState<boolean>(false)
	const [filesModal, setFilesModal] = React.useState<boolean>(false)
	const [closeModal, setCloseModal] = React.useState<boolean>(false)
	const [image, setImage] = React.useState<any>({})
	const [pasos, setPasos] = React.useState<Array<any[]>>([])
	const [stepIndex, setStepIndex] = React.useState<number>(-1)

	const actions = useActions({ getAlertById, getAlertByStudent, createAlertStepByStudent, closeAlertStudent })

	React.useEffect(() => {
		fetchAlert()
	}, [props.currentStudent])

	const fetchAlert = async () => {
		setLoading(true)
		await actions.getAlertByStudent(props.currentStudent.alertaEstudianteId)
		await actions.getAlertById(props.currentStudent.alertaId)
		setLoading(false)
	}

	const state = useSelector((store: IStore) => {
		return {
			currentAlert: store.alertaTemprana.currentAlert,
			currentAlertStudent: store.alertaTemprana.currentAlertStudent
		}
	})

	React.useEffect(() => {
		const datos =
			state.currentAlert?.pasos &&
			state.currentAlert.pasos.map((paso, i) => {
				const isActive =
					state.currentAlertStudent.pasos &&
					state.currentAlertStudent.pasos.length > 0 &&
					state.currentAlertStudent.pasos[i]
				return {
					...paso,
					completado: !!(isActive && isActive.paso.completado)
				}
			})
		setPasos(datos || [])
	}, [state.currentAlert])

	const handleStep = async (step: any, activeIndex: number) => {
		await actions.getAlertByStudent(props.currentStudent.alertaEstudianteId)

		const nuevos = [...pasos]
		nuevos[activeIndex].completado = !nuevos[activeIndex].completado
		setPasos(nuevos)

		setActiveStep(activeIndex)
		setCurrentStep(step)
		setKey(Math.random())
	}

	const handleSave = async (values: string) => {
		const data = {
			pasos: [
				{
					numeroPaso: currentStep.numeroPaso,
					estado: true,
					completado: currentStep.completado,
					observaciones: [
						{
							observacion: values,
							estado: true,
							dePaso: true,
							numeroDePaso: currentStep.numeroPaso
						}
					],
					recursos: []
				}
			]
		}

		setLoading(true)
		const res = await actions.createAlertStepByStudent(props.currentStudent.alertaEstudianteId, data)
		setLoading(false)
		setVisibleObservations(!visibleObservations)
	}

	const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>, step: any) => {
		e.preventDefault()

		try {
			setUploading(true)

			const res = await uploadFicha(e.target.files[0], event => {
				const percentCompleted = Math.round((event.loaded * 100) / event.total)
				if (percentCompleted == 100) {
					setUploading(false)
				}
			})

			const dataUpload = {
				pasos: [
					{
						numeroPaso: step.numeroPaso,
						estado: true,
						completado: step.completado,
						observaciones: [],
						recursos: [
							{
								estado: true,
								dePaso: true,
								recursosId: res.id,
								numeroDePaso: step.numeroPaso
							}
						]
					}
				]
			}
			await actions.createAlertStepByStudent(props.currentStudent.alertaEstudianteId, dataUpload)
			setImage(res)
		} catch (error) {
			setUploading(false)
		}
	}

	const handleCloseAlert = async (description: string) => {
		try {
			setLoading(true)
			setCloseModal(!closeModal)
			const res = await actions.closeAlertStudent(props.currentStudent.alertaEstudianteId, {
				razonDeCierre: description,
				recursosId: []
			})
			if (!res.error) {
				swal({
					title: 'Se ha cerrado la alerta',
					text: 'Se ha cerrado la alerta de forma exitosa',
					icon: 'success',
					buttons: {
						ok: {
							text: 'Aceptar',
							value: true
						}
					}
				}).then(result => {
					if (result) {
						props.updateView()
					}
				})
			}
			setLoading(false)
		} catch (error) {
			setLoading(false)
		}
	}

	const handleSaveProcess = async () => {
		const pasosUpdated = []
		pasos.map(paso => {
			pasosUpdated.push({
				numeroPaso: paso.numeroPaso,
				estado: paso.estado,
				completado: paso.completado,
				observaciones: [],
				recursos: []
			})
		})

		const dataUpload = {
			pasos: pasosUpdated
		}

		setLoading(true)

		const res = await actions.createAlertStepByStudent(props.currentStudent.alertaEstudianteId, dataUpload)

		if (!res.error) {
			fetchAlert()
		} else {
			swal({
				title: 'Oops',
				text: res.message,
				icon: 'danger',
				buttons: {
					ok: {
						text: 'Aceptar',
						value: true
					}
				}
			}).then(result => {
				if (result) {
					props.handleClearStudent()
				}
			})
		}
	}

	const handleAddObservations = (step: any, index: number) => {
		setCurrentStep(step)
		setStepIndex(index)
		setVisibleObservations(!visibleObservations)
	}

	const handleViewObservations = (step: any, index: number) => {
		setCurrentStep(step)
		setStepIndex(index)
		setObservationsModal(!observationsModal)
	}

	return (
		<Wrapper key={key}>
			<Back onClick={props.handleBack}>
				<BackIcon />
				<BackTitle>Regresar</BackTitle>
			</Back>
			<Card>
				<Title>Paso a paso del proceso</Title>
				{Object.keys(state.currentAlert).length > 0 ? (
					<List>
						{pasos.map((step: any, i: number) => {
							const totalFiles =
								state.currentAlertStudent &&
								state.currentAlertStudent?.pasos.find(obser => obser.paso.numeroPaso == step.numeroPaso)
							return (
								<Item key={i}>
									<ItemInfo>
										<input
											type='checkbox'
											name='step'
											disabled={props.currentStudent.cerrada}
											checked={step.completado}
											onClick={() => handleStep(step, i)}
										/>
										<StepName>{step.nombre}</StepName>
									</ItemInfo>
									{step.completado && Object.keys(state.currentAlertStudent).length > 0 ? (
										<ItemResources>
											<ItemObservations>
												<Button
													className='mr-1'
													size='sm'
													color='primary'
													outline
													onClick={() => handleAddObservations(step, i)}
													disabled={state.currentAlertStudent.cerrada}
												>
													Agregar nueva observación
												</Button>
												<Button
													size='sm'
													color='primary'
													onClick={() => handleViewObservations(step, i)}
												>
													Ver observaciones
												</Button>
											</ItemObservations>
											<ItemUploads>
												<Upload>
													<FormGroup className='fied-upload'>
														<div className='fileinput-buttons'>
															<IconAdd />
															<Button
																className='mr-1'
																size='sm'
																color='primary'
																outline
																disabled={state.currentAlertStudent.cerrada}
															>
																Subir Archivo
															</Button>
															<input
																accept='pdf/*'
																id='profile-pic-id'
																type='file'
																name='profilePic'
																onChange={e => {
																	setCurrentStep(step)
																	handleUpload(e, step)
																}}
																disabled={state.currentAlertStudent.cerrada}
															/>
														</div>
													</FormGroup>
												</Upload>
												<Button
													size='sm'
													color='primary'
													onClick={() => {
														setCurrentStep(step)
														setStepIndex(i)
														setFilesModal(!filesModal)
													}}
												>
													Ver ({totalFiles && totalFiles.recursos.length} archivos)
												</Button>
											</ItemUploads>
										</ItemResources>
									) : null}
								</Item>
							)
						})}
					</List>
				) : null}

				{props.currentStudent.cerrada ? (
					<Feedback>
						<TitleFeed>Razón de cierre: </TitleFeed>
						<ClosedFedback>
							<ClosedFedbackText>{state.currentAlertStudent.razonCierre}</ClosedFedbackText>
						</ClosedFedback>
					</Feedback>
				) : null}

				{!props.currentStudent.cerrada ? (
					<Button color='primary' onClick={handleSaveProcess}>
						Guardar Procesos
					</Button>
				) : null}

				{props.currentStudent.cerrada ? (
					<ActionLink color='#d1d1d1' className='ml-2' outline>
						Cerrar Alerta
					</ActionLink>
				) : (
					<Button
						color='primary'
						className='ml-2'
						onClick={() => setCloseModal(!closeModal)}
						disabled={props.currentStudent.cerrada}
						outline
					>
						Cerrar Alerta
					</Button>
				)}

				<AgregarObservaciones
					visible={visibleObservations}
					handleCancel={() => setVisibleObservations(!visibleObservations)}
					handleSave={handleSave}
					loading={loading}
				/>

				<Observaciones
					visible={observationsModal}
					handleModal={() => setObservationsModal(!observationsModal)}
					currentStep={currentStep}
					stepIndex={stepIndex}
					observaciones={state.currentAlertStudent}
				/>

				<StepFiles
					visible={filesModal}
					handleModal={() => setFilesModal(!filesModal)}
					currentStep={currentStep || null}
					stepIndex={stepIndex}
					files={state.currentAlertStudent}
				/>

				<CerrarAlerta
					visible={closeModal}
					handleModal={() => setCloseModal(!closeModal)}
					handleCloseAlert={handleCloseAlert}
				/>

				{loading ? (
					<Loading>
						<div className='single-loading' />
					</Loading>
				) : null}
				{uploading ? (
					<Loading>
						<div className='single-loading' />
					</Loading>
				) : null}
			</Card>
		</Wrapper>
	)
}

const Wrapper = styled.div`
	margin-top: 0px;
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

const Card = styled.div`
	background: #fff;
	border-radius: calc(0.85rem - 1px);
	box-shadow: 0 1px 15px rgba(0, 0, 0, 0.04), 0 1px 6px rgba(0, 0, 0, 0.04);
	padding: 20px 25px;
	position: relative;
`

const Loading = styled.div`
	position: absolute;
	background: rgba(255, 255, 255, 0.7);
	top: 0px;
	bottom: 0px;
	left: 0px;
	right: 0px;
	display: flex;
	align-items: center;
	justify-content: center;
	flex-direction: column;
`

const Title = styled.h4`
	color: #000;
	margin: 0px;
`

const List = styled.div`
	flex-direction: column;
	margin-top: 15px;
`

const Item = styled.div`
	padding: 8px 0px;
	margin-bottom: 10px;
`

const ItemInfo = styled.div`
	flex-direction: row;
	align-items: center;
`

const ItemResources = styled.div`
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: space-between;
	width: 65%;
	margin: 15px 0 0;
`

const IconAdd = styled(AddIcon)`
	font-size: 60px !important;
	color: #145388;
	margin-right: 10px;
`

const ItemObservations = styled.div`
	flex: 1;
`

const ItemUploads = styled.div`
	display: flex;
	flex-direction: row;
	align-items: center;
`

const FormGroup = styled.div`
	position: relative;
`

const Upload = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
	flex-direction: row;
`

const StepName = styled.span`
	color: #000;
	padding-left: 10px;
`

const ActionLink = styled(Button)`
	background: ${props => props.color};
`

const Feedback = styled.div`
	margin: 20px 0px;
`

const TitleFeed = styled.strong`
	color: #000;
	margin-bottom: 5px;
	display: block;
`

const ClosedFedback = styled.div`
	background: #ea7979;
	padding: 8px;
	width: 40%;
	border-radius: 5px;
`

const ClosedFedbackText = styled.span`
	color: #fff;
`

export default AlertaEstudianteDetail
