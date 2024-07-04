import colors from 'Assets/js/colors'
import ConfirmModal from 'Components/Modal/ConfirmModal'
import SimpleModal from 'Components/Modal/simple'
import { useActions } from 'Hooks/useActions'
import useNotification from 'Hooks/useNotification'
import React, { useMemo } from 'react'
import { useSelector } from 'react-redux'
import { Button } from 'reactstrap'
import {
	crearIdentidadPersona,
	getIdentificacionPersona,
	verificarPhoto,
	setWizardNavDataStore,
	setWizardDataStore,
	clearWizardDataStore,
	clearWizardNavDataStore,
	getPersonaByIdentificacion
} from 'Redux/identidad/actions'
import { isEqual } from 'lodash'
import moment from 'moment'

import { getCatalogs } from 'Redux/selects/actions'
import styled from 'styled-components'
import { progressInCard } from 'Utils/progress'

import Wizard from './wizard'
import FormDocumentos from '../FormDocumentosAprobatorios'
import FormPhoto from '../FormPhoto'
import PreviewRegister from '../modals/previewRegister'
import RegistroForm from '../RegistroForm'
import Nav from '../NavRegistrarPersona'
import { useTranslation } from 'react-i18next'
import { TableReactImplementation } from 'Components/TableReactImplementation'

type IProps = {
	onConfirm: any
}

type SnackbarConfig = {
	variant: string
	msg: string
}
const steps = {
	cedula: [
		{
			key: 2,
			id: 'cedulaStep2',
			title: 'Paso 2',
			description: 'Ingresar la información'
		},
		{
			key: 3,
			id: 'cedulaStep3',
			title: 'Paso 3',
			description: 'Subir o tomar foto'
		}
	],
	dimex: [
		{
			key: 2,
			id: 'dimexStep1',
			title: 'Paso 2',
			description: 'Ingresar la información'
		},
		{
			key: 3,
			id: 'dimexStep2',
			title: 'Paso 3',
			description: 'Subir o tomar foto'
		}
	],
	yisro: [
		{
			key: 1,
			id: 'yisroStep1',
			title: 'Paso 2',
			description: 'Subir o tomar foto'
		},
		{
			key: 2,
			id: 'yisroStep2',
			title: 'Paso 3',
			description: 'Ingresar la información'
		},
		{
			key: 3,
			id: 'yisroStep3',
			title: 'Paso 4',
			description: 'Indicar documentos probatorios'
		}
	]
}
const stepIdType = {
	key: 1,
	id: 'idType1',
	title: 'Paso 1',
	description: 'seleccionar tipo de documento'
}
const WizardRegisterIdentityModal: React.FC<IProps> = props => {
	const { onConfirm } = props
	const { t } = useTranslation()
	const dataWizard = useSelector((state: any) => state.identidad.dataWizard)

	const actions = useActions({
		getCatalogs,
		getPersonaByIdentificacion,
		getIdentificacionPersona,
		crearIdentidadPersona,
		verificarPhoto,
		setWizardNavDataStore,
		setWizardDataStore,
		clearWizardDataStore,
		clearWizardNavDataStore
	})

	const [modalConfirmation, setModalConfirmation] = React.useState<boolean>(false)
	const [informationStateModal, setInformationStateModal] = React.useState<boolean>(false)

	const [dataResponse, setDataResponse] = React.useState<any>({})

	const [areChange, setAreChange] = React.useState<boolean>(true)
	const [matchesModal, setMatchesModal] = React.useState<boolean>(false)
	const [isVerify, setIsVerify] = React.useState<boolean>(false)
	const [verify, setVerify] = React.useState(null)
	const [persona, setPersona] = React.useState(null)

	const [step, setStep] = React.useState<number>(0)
	const [selectedType, setSelectedType] = React.useState<any>({})
	const [contentWizard, setContentWizard] = React.useState<string>('idType')
	const [matchesModalYisro, setMatchesModalYisro] = React.useState<boolean>(false)
	const [personasYisro, setPersonaYisro] = React.useState([])

	const [snackbar, handleClick] = useNotification()
	const [snackBarContent, setSnackbarContent] = React.useState<SnackbarConfig>({
		variant: '',
		msg: ''
	})

	const showNotification = (variant: string, msg: string) => {
		setSnackbarContent({ variant, msg })
		handleClick()
	}

	const setDataStore = async (key, data) => {
		await actions.setWizardDataStore({ [key]: data })
	}

	React.useEffect(() => {
		const fetch = async () => {
			await actions.getCatalogs(40)
		}
		fetch()
	}, [])

	const changeIdType = type => {
		setSelectedType(type)
		setStep(1)
		if (type.id === 4) {
			setContentWizard('photo')
		} else {
			setContentWizard('form')
		}
	}

	const onDataForm = values => {
		setDataStore('form', values)
		setDataStore('data', null)
		if (dataWizard.dataCompare) {
			const _isEqual = isEqual(dataWizard.form, dataWizard.dataCompare)
			setAreChange(!_isEqual)
		}
		if (selectedType.id === 4) {
			setStep(3)
			setContentWizard('docs')
		} else {
			setStep(2)
			setContentWizard('photo')
		}
	}

	const onPhotoNext = () => {
		if (selectedType.id === 4) {
			setStep(1)
			setContentWizard('form')
		} else {
			openConfirmModal()
		}
	}

	const openConfirmModal = () => {
		setModalConfirmation(true)
	}

	const onPrev = view => {
		const _step = step - 1
		if (selectedType.id === 4) {
			switch (_step) {
				case 0:
					setContentWizard('idType')
					break
				case 1:
					setContentWizard('photo')
					break
				case 2:
					setContentWizard('form')
					break
				case 3:
					setContentWizard('docs')
					break
				default:
					break
			}
		} else {
			switch (_step) {
				case 0:
					setContentWizard('idType')
					break
				case 1:
					setContentWizard('form')
					break
				case 2:
					setContentWizard('photo')
					break
				default:
					break
			}
		}
		setStep(_step)
	}

	const handleClear = async (avoidIdChange = false) => {
		if (!avoidIdChange) {
			setSelectedType({
				name: 'cedula',
				id: 1
			})
			setContentWizard('form')
		}
		setStep(0)
	}

	const handleCreate = async (continuar: boolean = false) => {
		progressInCard(true)
		let res: any = {}

		try {
			const dta = {
				tipoIdentificacionId: dataWizard.form.tipoIdentificacionId,
				identificacion: dataWizard.form.identificacion,
				nacionalidadId: dataWizard.form.nacionalidadId,
				nombre: dataWizard.form.nombre,
				primerApellido: dataWizard.form.primerApellido,
				segundoApellido: dataWizard.form.segundoApellido,
				conocidoComo: dataWizard.form.conocidoComo,
				fechaNacimiento: dataWizard.form.fechaNacimiento,
				sexoId: dataWizard.form.sexoId,
				generoId: dataWizard.form.generoId,
				tipoDimexId: dataWizard.form.tipoDimex?.id,
				forzar: true,
				continuarRegistroYisro: continuar,

				imagenBase64: dataWizard.photo ? dataWizard.photo.split(',')[1] : '',

				documentosAprobatorios: dataWizard.files
			}

			const response = await actions.crearIdentidadPersona(dta)
			if (response.error) {
				if (response.message.includes('data')) {
					const _data = JSON.parse(response.message)
					setPersonaYisro(_data.data)
					setModalConfirmation(false)
					setMatchesModalYisro(true)
				} else {
					res = { error: true, data: null, message: response.message }
				}
			} else {
				res = { error: false, data: response.data }
				setModalConfirmation(false)
				setInformationStateModal(true)
				await actions.clearWizardDataStore()
				await actions.clearWizardNavDataStore()
				setDataResponse(res.data)
			}
		} catch (error) {
			res = {
				error: true,
				data: null,
				message: 'Oops, Algo ha salido mal'
			}
		}
		progressInCard(false)
		return res
	}

	const oncloseInformationStateModal = async () => {
		onConfirm(dataResponse)
		await actions.clearWizardDataStore()
		handleClear()
		setStep(0)
		if (selectedType.id === 4) {
			setContentWizard('photo')
		} else {
			setContentWizard('form')
		}
		setInformationStateModal(false)
	}

	const onClosePreviewPerson = async (verify = true) => {
		if (verify) {
			setIsVerify(false)
			setMatchesModal(true)
			setPersona(null)
		}
		setModalConfirmation(false)
	}
	const onCloseMatchesModal = async () => {
		setVerify(null)
		setDataStore('photo', null)
		setMatchesModal(false)
	}

	const verificar = async img => {
		progressInCard(true)

		const res = await actions.verificarPhoto(img)
		progressInCard(false)
		if (res?.data?.persona) {
			setVerify(res.data)
			setMatchesModal(true)
		}
	}

	const setPhoto = img => {
		setDataStore('photo', img)
	}
	const setFiles = files => {
		setDataStore('files', files)
	}

	const onCloseMatchesModalYisro = async () => {
		setPersonaYisro([])
		setMatchesModalYisro(false)
	}
	const onSelectMatchesModalYisro = async id => {
		const _response = await actions.getPersonaByIdentificacion(id)
		if (!_response.error) {
			setMatchesModalYisro(false)

			setPersonaYisro([])
			onConfirm(_response.data)
			await actions.clearWizardDataStore()
			handleClear()
			setStep(0)
			if (selectedType.id === 4) {
				setContentWizard('photo')
			} else {
				setContentWizard('form')
			}
		} else {
			showNotification('error', 'Ha ocurrido un error')
		}
	}
	const columns = useMemo(
		() => [
			{
				column: 'Identificacion',
				label: 'Identificacion',
				accessor: 'Identificacion',
				Header: 'Identificación'
			},
			{
				column: 'NombreEstudiante',
				label: 'Nombre del Estudiante',
				accessor: 'NombreEstudiante',
				Header: 'NombreEstudiante'
			},
			{
				column: 'FechaNacimiento',
				label: 'Fecha de Nacimiento',
				accessor: 'FechaNacimiento',
				Header: 'Fecha de Nacimiento',
				Cell: ({ row }) => {
					const _date = moment(row.original.FechaNacimiento).format('DD/MM/YYYY')
					return <label>{_date}</label>
				}
			},
			{
				column: 'Institucion',
				label: 'Institución',
				accessor: 'Institucion',
				Header: 'Centro educativo'
			},
			{
				column: 'actions',
				label: 'Acciones',
				accessor: 'actions',
				Header: '',
				Cell: ({ row }) => {
					return (
						<div className='d-flex justify-content-center align-items-center'>
							<Button
								onClick={() => {
									onSelectMatchesModalYisro(row.original.Identificacion)
								}}
								color='primary'
							>
								Seleccionar
							</Button>
						</div>
					)
				}
			}
		],
		[personasYisro, t]
	)
	return (
		<Wrapper>
			{snackbar(snackBarContent.variant, snackBarContent.msg)}

			{!informationStateModal && !matchesModalYisro && (
				<Wizard
					steps={[{ ...stepIdType }, ...steps[selectedType.name || 'cedula']]}
					step={step}
					setStep={setStep}
				>
					{
						{
							idType: <Nav setSelectedType={changeIdType} selectedType={selectedType} />,
							form: (
								<RegistroForm
									data={dataWizard.form}
									showNotification={showNotification}
									idType={selectedType.id}
									onNext={onDataForm}
									isAplicar={false}
									onPrev={onPrev}
								/>
							),
							photo: (
								<FormPhoto
									onPrev={onPrev}
									onNext={onPhotoNext}
									setImageForm={setPhoto}
									photo={dataWizard.photo}
									verificar={verificar}
									dimex={selectedType.id === 4}
								/>
							),
							docs: (
								<FormDocumentos
									onPrev={onPrev}
									onNext={openConfirmModal}
									setEvidentialDocuments={setFiles}
									setFilesTodelete={() => {}}
									filesTodelete={[]}
									files={dataWizard.files}
									isAplicar={false}
								/>
							)
						}[contentWizard]
					}
				</Wizard>
			)}
			{(persona || dataWizard.form) && (
				<PreviewRegister
					openModal={modalConfirmation}
					closeModal={() => onClosePreviewPerson(isVerify)}
					data={persona || dataWizard.form}
					isVerify={isVerify}
					photo={dataWizard.photo}
					isAplicar={false}
					areChange={areChange}
					onConfirm={
						isVerify
							? () => onClosePreviewPerson(isVerify)
							: areChange
							? handleCreate
							: () => onClosePreviewPerson(false)
					}
					onCancel={() => onClosePreviewPerson(isVerify)}
				/>
			)}
			<SimpleModal
				openDialog={matchesModal}
				onClose={() => onCloseMatchesModal()}
				title='Coincidencias de fotos'
				actions={false}
			>
				<Container>
					<h5 className='my-2 text-left w-100 '>{verify?.message}</h5>
					{verify?.persona.map((persona, i) => {
						return (
							<Persona key={i}>
								<PhotoContainer>
									<img src={persona?.imagen} alt='Identity register' />
								</PhotoContainer>
								<Nombre>
									{persona?.nombre + ' ' + persona?.primerApellido + ' ' + persona?.segundoApellido}
								</Nombre>
								<ActionsVerify>
									<Button
										onClick={() => {
											setIsVerify(true)
											setPersona(persona)
											setModalConfirmation(true)
											setMatchesModal(false)
										}}
										color='primary'
									>
										Ver ficha
									</Button>
								</ActionsVerify>
							</Persona>
						)
					})}
					<Actions>
						<Button className='mr-5' onClick={() => onCloseMatchesModal()} color='secondary' outline>
							Cerrar
						</Button>
						<Button onClick={() => setMatchesModal(false)} color='primary'>
							Registrar Gemelo
						</Button>
					</Actions>
				</Container>
			</SimpleModal>
			<SimpleModal
				openDialog={matchesModalYisro}
				onClose={() => onCloseMatchesModalYisro()}
				title='Coincidencias de personas registradas'
				actions={false}
			>
				<Container>
					<TableReactImplementation avoidSearch columns={columns} data={personasYisro} />

					<Actions>
						<Button className='mr-5' onClick={() => onCloseMatchesModalYisro()} color='secondary' outline>
							Cerrar
						</Button>

						<Button
							onClick={() => {
								setMatchesModalYisro(false)
								handleCreate(true)
							}}
							color='primary'
						>
							Continuar el Registro
						</Button>
					</Actions>
				</Container>
			</SimpleModal>
			<ConfirmModal
				openDialog={informationStateModal}
				onClose={oncloseInformationStateModal}
				title={t('general>modal>register>titulo', 'Registro con éxito')}
				actions={false}
				icon='info-circle'
			>
				<Container>
					<h5 className={`${selectedType.id === 4 ? 'mt-3 text-left' : 'my-5 text-center'} mt-3 w-100 `}>
						{t(
							'general>modal>register>se_ha_resgitrado_con_exito',
							'La persona se ha registrado con éxito en la plataforma'
						)}
						.
					</h5>
					{selectedType.id === 4 && (
						<Yisro>
							<h5 className='m-0 w-100 text-left'>
								{t('general>calendar>error', 'El número Yís Rö - Identificación MEP de la persona es:')}
							</h5>
							<label className=' w-100 text-center'>{dataResponse?.identificacion}</label>
						</Yisro>
					)}
					<Actions>
						<Button onClick={() => oncloseInformationStateModal()} color='primary'>
							{t('general>boton>entendido', 'Entendido')}
						</Button>
					</Actions>
				</Container>
			</ConfirmModal>
		</Wrapper>
	)
}
const Persona = styled.div`
	align-items: center;
	display: flex;
	width: 100%;
	border: 1px solid;
	padding: 10px;
	gap: 20px;
`
const PhotoContainer = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	width: 150px;
	min-width: 150px;
	height: 150px;
	border-radius: 100px;
	background: #c3c3c3;
	overflow: hidden;
	img {
		width: 100%;
	}
`
const ActionsVerify = styled.div`
	display: flex;
	justify-content: center;
	flex-flow: row;
	flex-wrap: wrap;
	min-width: 150px;
`
const Nombre = styled.div`
	display: flex;
	justify-content: center;
	flex-flow: row;
	flex-wrap: wrap;
	width: 100%;
`
const Yisro = styled.div`
	display: flex;
	justify-content: center;
	flex-flow: row;
	flex-wrap: wrap;
	width: 100%;

	label {
		margin-top: 15px;
		width: 100%;
		padding: 20px;
		background: ${colors.gray};
		font-size: 30px;
		font-weight: 800;
	}
`
const Container = styled.div`
	display: flex;
	flex-flow: row;
	flex-wrap: wrap;
	gap: 20px;
`
const Actions = styled.div`
	display: flex;
	width: 100%;
	text-align: center;
	align-items: center;
	justify-content: center;
`

const Wrapper = styled.div`
	margin-top: 5px;
`
export default WizardRegisterIdentityModal
