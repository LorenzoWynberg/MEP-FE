import colors from 'Assets/js/colors'
import ConfirmModal from 'Components/Modal/ConfirmModal'
import SimpleModal from 'Components/Modal/simple'
import { useActions } from 'Hooks/useActions'
import useNotification from 'Hooks/useNotification'
import moment from 'moment'
import React, { useMemo } from 'react'
import { useSelector } from 'react-redux'
import { Button } from 'reactstrap'
import {
	getIdentificacionPersona,
	verificarPhoto,
	setWizardNavDataStore,
	setWizardDataStore,
	clearWizardDataStore,
	getPersonaByIdentificacion,
	clearWizardNavDataStore
} from 'Redux/identidad/actions'
import { isEqual } from 'lodash'

import { getCatalogs } from 'Redux/selects/actions'
import styled from 'styled-components'
import { catalogsEnum } from 'Utils/catalogsEnum'
import { progressInCard } from 'Utils/progress'
import { getYearsOld } from 'Utils/years'
import Tooltip from '@mui/material/Tooltip'

import Wizard from './_partials/wizard'
import FormDocumentos from './FormDocumentosAprobatorios'
import FormPhoto from './FormPhoto'
import PreviewRegister from './modals/previewRegister'
import RegistroForm from './RegistroForm'
import ConfirmarGemeloModal from './modals/ConfirmarGemeloModal'
import { useTranslation } from 'react-i18next'
import { TableReactImplementation } from 'Components/TableReactImplementation'

type IProps = {
	isAplicar?: boolean
	selectedType: any
	sendData: any
	setSelectedType: any
	identificationChange: boolean
	setIdentificationChange: any
	filesTodelete: any
	setFilesTodelete: any
	cancelPreview?: any
	editResource?: any
	show?: any
}

type SnackbarConfig = {
	variant: string
	msg: string
}

const parseDatosToSelectValue = (datos, selects) => {
	let _data = {}

	datos.forEach(item => {
		const typeCat = catalogsEnum.find(x => x.id === item.catalogoId)
		const selected = selects[typeCat.name].find(x => x.id === item.elementoId)
		let _obj = {}
		switch (typeCat.name) {
			case 'nationalities':
				_obj = {
					nationality: selected
				}
				break
			case 'genderTypes':
				_obj = {
					genero: selected
				}
				break
			case 'sexoTypes':
				_obj = {
					sexo: selected
				}
				break
			case 'tipoDimex':
				_obj = {
					tipoDimex: selected
				}
				break
			case 'tipoYisro':
				_obj = {
					tipoYisro: selected
				}
				break
			case 'idTypes':
				_obj = {
					type_identification: selected.nombre,
					tipoIdentificacionId: selected.id
				}
				break
		}
		_data = { ..._data, ..._obj }
	})
	return _data
}
const parseDataToFormValue = (user, stateSelects) => {
	const selects = parseDatosToSelectValue(user.datos, stateSelects)
	const fechaNacimiento = moment(user.fechaNacimiento).toDate()
	const userAge: any = getYearsOld(fechaNacimiento)

	return {
		...user,
		...selects,
		edad: userAge,
		fechaNacimiento
	}
}
const WizardRegistrar: React.FC<IProps> = props => {
	const {
		isAplicar,
		selectedType,
		setSelectedType,
		sendData,
		identificationChange,
		filesTodelete,
		setFilesTodelete
	} = props
	const { t } = useTranslation()
	const selects = useSelector((state: any) => state.selects)
	const dataWizard = useSelector((state: any) => state.identidad.dataWizard)
	const steps = useSelector((state: any) => state.identidad.steps)

	const actions = useActions({
		getCatalogs,
		getPersonaByIdentificacion,
		getIdentificacionPersona,
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
	const [verify, setVerify] = React.useState<any>(null)
	const [persona, setPersona] = React.useState(null)
	const [matchesModalYisro, setMatchesModalYisro] = React.useState<boolean>(false)
	const [personasYisro, setPersonaYisro] = React.useState([])

	const [step, setStep] = React.useState<number>(0)

	const [contentWizard, setContentWizard] = React.useState<string>('form')

	const [snackbar, handleClick] = useNotification()
	const [snackBarContent, setSnackbarContent] = React.useState<SnackbarConfig>({
		variant: '',
		msg: ''
	})

	const [confirmarGemelo, setConfirmarGemelo] = React.useState<boolean>(false)

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

	React.useEffect(() => {
		if (dataWizard.data) {
			const _dataParse = parseDataToFormValue(dataWizard.data, selects)

			setDataStore('form', _dataParse)
			setDataStore('dataCompare', _dataParse)
			setDataStore('files', _dataParse.documentosAprobatorios)
			setDataStore('photo', _dataParse.imagen)
			setDataStore('data', null)
			setAreChange(false)

			if (_dataParse.tipoIdentificacionId === 4) {
				switch (step) {
					case 0:
						setContentWizard('photo')
						break
					case 1:
						setContentWizard('form')
						break
					case 2:
						setContentWizard('docs')
						break
					default:
						setContentWizard('photo')
						break
				}
			} else {
				setContentWizard('form')
			}
		}
	}, [dataWizard.data, selects])

	React.useEffect(() => {
		if (dataWizard.dataCompare) {
			const _isEqual = isEqual(dataWizard.form, dataWizard.dataCompare)
			setAreChange(!_isEqual)
		}
	}, [dataWizard.dataCompare])

	React.useEffect(() => {
		setStep(0)
		!dataWizard.data && actions.clearWizardDataStore()

		if (selectedType.id === 4) {
			setContentWizard('photo')
		} else {
			setContentWizard('form')
		}
	}, [selectedType])

	const onDataForm = values => {
		setDataStore('form', values)
		setDataStore('data', null)
		if (dataWizard.dataCompare) {
			const _isEqual = isEqual(values, dataWizard.dataCompare)
			setAreChange(!_isEqual)
		}
		if (selectedType.id === 4) {
			setStep(2)
			setContentWizard('docs')
		} else {
			setStep(1)
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
		setContentWizard(view)
		setStep(step - 1)
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
		let dtaForm = dataWizard.form
		dtaForm = {
			...dtaForm,
			continuarRegistroYisro: continuar
		}
		const res = await sendData(dtaForm, dataWizard.photo, dataWizard.files)
		progressInCard(false)

		if (res.error) {
			if (res.message.includes('data')) {
				const _data = JSON.parse(res.message)
				setPersonaYisro(_data.data)
				setModalConfirmation(false)
				setMatchesModalYisro(true)
			} else {
				showNotification('error', res.message || 'Ha ocurrido un error')
			}
		} else {
			showNotification('success', 'Se ha creado la identidad correctamente')
			setModalConfirmation(false)
			setInformationStateModal(true)
			setDataResponse(res.data)
		}
	}

	const oncloseInformationStateModal = async () => {
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

	const onClosePreviewPerson = async (preview = true) => {
		if (preview) {
			setIsVerify(false)
			verify?.persona.length > 0 && setMatchesModal(true)
			setPersona(null)
		}
		setModalConfirmation(false)
	}
	const onCloseMatchesModal = async () => {
		setVerify(null)
		setMatchesModal(false)
	}

	const onCloseMatchesModalYisro = async () => {
		setPersonaYisro([])
		setMatchesModalYisro(false)
	}
	const onSelectMatchesModalYisro = async id => {
		const _response = await actions.getPersonaByIdentificacion(id)
		if (!_response.error) {
			setMatchesModalYisro(false)
			setModalConfirmation(true)
			setMatchesModal(false)
			setPersonaYisro([])
			setIsVerify(true)
			setDataResponse(_response.data)
		} else {
			showNotification('error', 'Ha ocurrido un error')
		}
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
	const onRegistrarGemelo = () => {
		setMatchesModal(false)
		setConfirmarGemelo(true)
	}
	const columns = useMemo(
		() => [
			{
				column: 'Identificacion',
				label: 'Identificación',
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
				label: 'Centro educativo',
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
			<ConfirmarGemeloModal
				visible={confirmarGemelo}
				setVisible={setConfirmarGemelo}
				onClose={() => handleClear(false)}
				onConfirmModal={() => setConfirmarGemelo(false)}
			/>
			{snackbar(snackBarContent.variant, snackBarContent.msg)}

			<Wizard steps={steps[selectedType.name]} step={step} setStep={setStep}>
				{
					{
						form: (
							<RegistroForm
								editResource={props.editResource}
								show={props.show}
								data={dataWizard.form}
								showNotification={showNotification}
								idType={selectedType.id}
								onNext={onDataForm}
								isAplicar={isAplicar}
								cancelPreview={props.cancelPreview}
								onPrev={selectedType.id === 4 && onPrev}
							/>
						),
						photo: (
							<FormPhoto
								onPrev={selectedType.id !== 4 && onPrev}
								onNext={onPhotoNext}
								setImageForm={setPhoto}
								photo={dataWizard.photo}
								verificar={verificar}
								isAplicar={isAplicar}
								dimex={selectedType.id === 4}
							/>
						),
						docs: (
							<FormDocumentos
								filesTodelete={filesTodelete}
								setFilesTodelete={setFilesTodelete}
								onPrev={onPrev}
								onNext={openConfirmModal}
								setEvidentialDocuments={setFiles}
								files={dataWizard.files}
								isAplicar={isAplicar}
							/>
						)
					}[contentWizard]
				}
			</Wizard>
			{(persona || dataWizard.form) && (
				<PreviewRegister
					openModal={modalConfirmation}
					closeModal={() => onClosePreviewPerson(isVerify)}
					data={persona || dataWizard.form}
					isVerify={isVerify}
					identificationChange={identificationChange}
					photo={dataWizard.photo}
					isAplicar={isAplicar}
					areChange={areChange}
					onConfirm={
						isVerify
							? () => onClosePreviewPerson(isVerify)
							: areChange || identificationChange
							? handleCreate
							: () => onClosePreviewPerson(false)
					}
					onCancel={() => onClosePreviewPerson(isVerify)}
				/>
			)}
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
						<Button onClick={() => onRegistrarGemelo()} color='primary'>
							Registrar Gemelo
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
	min-width: 100px;
	height: 100px;
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

WizardRegistrar.defaultProps = {
	isAplicar: false
}
export default WizardRegistrar
