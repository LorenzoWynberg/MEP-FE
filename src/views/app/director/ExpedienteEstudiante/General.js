import React, { useState, useEffect } from 'react'
import { Colxx } from 'Components/common/CustomBootstrap'
import PersonalDataForm from './_partials/general/PersonalDataForm'
import DataForm from './_partials/general/DataForm'
import { Row, Form } from 'reactstrap'
import { withIdentification } from 'Hoc/Identification'
import { sendStudentData } from 'Redux/expedienteEstudiantil/actions'
import { useActions } from 'Hooks/useActions'
import useNotification from 'Hooks/useNotification'
import moment from 'moment'
import { updateIdentity } from 'Redux/identificacion/actions'
import { getCatalogs, getCatalogsSet } from 'Redux/selects/actions'
import { useSelector } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { catalogsEnumObj } from 'Utils/catalogsEnum'
import { mapOption, parseOptions } from 'Utils/mapeoCatalogos'
import { EditButton } from 'Components/EditButton'
import Loader from 'Components/Loader'
import { validateSelectsData } from 'Utils/ValidateSelectsData'
import { useForm } from 'react-hook-form'
import withAuthorization from 'Hoc/withAuthorization'
import { getYearsOld } from 'Utils/years'
import { useTranslation } from 'react-i18next'

const listSexo = [
	{ value: 1, label: 'Masculino', key: 1 },
	{ value: 2, label: 'Femenino', key: 2 }
]

const General = props => {
	const { t } = useTranslation()
	const { authHandler } = props
	const [identidadData, setIdentidadData] = useState({})
	const [disableMigrationStatus, setDisableMigrationStatus] = useState(false)
	const submitData = data => authHandler('modificar', sendData, toggleSnackbar)
	const [loading, setLoading] = useState(true)
	const [editable, setEditable] = useState(false)
	const [snackBar, handleClick] = useNotification()
	const { handleSubmit } = useForm()

	const [snackbarContent, setSnackbarContent] = useState({
		msg: 'welcome',
		variant: 'info'
	})

	const toggleSnackbar = (variant, msg) => {
		setSnackbarContent({
			variant,
			msg
		})
		handleClick()
	}

	const actions = useActions({
		sendStudentData,
		getCatalogs,
		updateIdentity,
		getCatalogsSet
	})

	const state = useSelector(store => {
		return {
			identification: store.identification
		}
	})

	useEffect(() => {
		const loadData = async () => {
			const catalogsArray = [
				catalogsEnumObj.IDENTIFICATION,
				catalogsEnumObj.ETNIAS,
				catalogsEnumObj.LENGUASINDIGENAS,
				catalogsEnumObj.ESTATUSMIGRATORIO,
				catalogsEnumObj.LENGUAMATERNA,
				catalogsEnumObj.SEXO,
				catalogsEnumObj.GENERO,
				catalogsEnumObj.ESTADOCIVIL
			]
			const response = await actions.getCatalogsSet(catalogsArray)

			if (response.error) {
				setSnackbarContent({
					variant: 'error',
					msg: 'Hubo un error al tratar de conseguir los datos del servidor'
				})
				handleClick()
			}
		}
		loadData()
	}, [])

	useEffect(() => {
		const catalogsNamesArray = [
			catalogsEnumObj.IDENTIFICATION.name,
			catalogsEnumObj.ETNIAS.name,
			catalogsEnumObj.LENGUASINDIGENAS.name,
			catalogsEnumObj.ESTATUSMIGRATORIO.name,
			catalogsEnumObj.LENGUAMATERNA.name,
			catalogsEnumObj.SEXO.name,
			catalogsEnumObj.GENERO.name,
			catalogsEnumObj.ESTADOCIVIL.name
		]
		if (
			state.identification.data.id &&
			validateSelectsData(props.selects, catalogsNamesArray)
		) {
			const _item = {
				...state.identification.data,
				sexo: mapOption(
					state.identification.data.datos,
					props.selects,
					catalogsEnumObj.SEXO.id,
					catalogsEnumObj.SEXO.name
				),
				nacionalidad: mapOption(
					state.identification.data.datos,
					props.selects,
					catalogsEnumObj.NATIONALITIES.id,
					catalogsEnumObj.NATIONALITIES.name
				),
				idType: mapOption(
					state.identification.data.datos,
					props.selects,
					catalogsEnumObj.IDENTIFICATION.id,
					catalogsEnumObj.IDENTIFICATION.name
				),
				genero: mapOption(
					state.identification.data.datos,
					props.selects,
					catalogsEnumObj.GENERO.id,
					catalogsEnumObj.GENERO.name
				),
				migracionStatus: mapOption(
					state.identification.data.datos,
					props.selects,
					catalogsEnumObj.ESTATUSMIGRATORIO.id,
					catalogsEnumObj.ESTATUSMIGRATORIO.name
				),
				lenguaIndigena: mapOption(
					state.identification.data.datos,
					props.selects,
					catalogsEnumObj.LENGUASINDIGENAS.id,
					catalogsEnumObj.LENGUASINDIGENAS.name
				),
				lenguaMaterna: mapOption(
					state.identification.data.datos,
					props.selects,
					catalogsEnumObj.LENGUAMATERNA.id,
					catalogsEnumObj.LENGUAMATERNA.name
				),
				estadoCivil: mapOption(
					state.identification.data.datos,
					props.selects,
					catalogsEnumObj.ESTADOCIVIL.id,
					catalogsEnumObj.ESTADOCIVIL.name
				),
				etnia: mapOption(
					state.identification.data.datos,
					props.selects,
					catalogsEnumObj.ETNIAS.id,
					catalogsEnumObj.ETNIAS.name
				),
				fechaDeNacimiento: moment(
					state.identification.data.fechaNacimiento
				).format('DD/MM/YYYY'),
				edad: getYearsOld(state.identification.data.fechaNacimiento),
				facebook: state.identification.data.facebook
					? state.identification.data.facebook
					: '',
				instagram: state.identification.data.instagram
					? state.identification.data.instagram
					: '',
				twitter: state.identification.data.twitter
					? state.identification.data.twitter
					: '',
				whatsapp: state.identification.data.whatsapp
					? state.identification.data.whatsapp
					: ''
			}
			setIdentidadData(_item)
			setLoading(false)
		} else {
			setLoading(true)
		}
	}, [
		state.identification.data.id,
		state.identification.data.datos,
		props.selects,
		editable
	])

	useEffect(() => {
		const reg = /([0-9]{9})/g
		let _item = {}
		if (reg.test(identidadData.identificacion)) {
			const status = props.selects[catalogsEnumObj.ESTATUSMIGRATORIO.name].find(
				item => item.codigo === '02'
			)
			_item = {
				...identidadData,
				migracionStatus: {
					...status,
					label: status.nombre,
					value: status.id
				}
			}
			setIdentidadData(_item)
		}
		setDisableMigrationStatus(
			identidadData?.idType?.id && identidadData?.idType?.id == 1
		)
	}, [identidadData.id, editable])

	const sendData = async () => {
		const datos = parseOptions(identidadData, [
			'genero',
			'migracionStatus',
			'lenguaIndigena',
			'lenguaMaterna',
			'estadoCivil',
			'etnia'
		])

		const _data = {
			id: identidadData.id,
			identificacion: identidadData.identificacion,
			nombre: identidadData.nombre,
			primerApellido: identidadData.primerApellido,
			segundoApellido: identidadData.segundoApellido,
			conocidoComo: identidadData.conocidoComo,
			lesco: identidadData.lesco,
			elementosNoRequiridosIds: datos,
			sexoId: identidadData.sexo ? identidadData.sexo.value : 0,
			nacionalidadId: identidadData.nacionalidad.value,
			tipoIdentificacionId: identidadData.idType.value
		}
		let response
		response = await actions.updateIdentity(_data)
		setIdentidadData(_data)
		if (response.data.error) {
			setSnackbarContent({
				variant: 'error',
				msg: response.data.message
			})
			handleClick()
			setEditable(true)
		} else {
			setSnackbarContent({
				variant: 'success',
				msg: '¡Los datos se han actualizado con éxito!'
			})
			handleClick()
			setEditable(false)
		}
	}

	const handleChange = (e, select = '') => {
		let _data = {}
		if (e.target && e.target.name === 'id') {
			_data = { ...identidadData, id: e.target.value.trim() }
		} else if (select && select !== 'idType') {
			_data = { ...identidadData, [select]: e }
		} else if (select === 'idType') {
			if (Array.isArray(e)) {
				_data = {
					...identidadData,
					idType: e[0].value,
					nationalityId: e[1].id
				}
			} else {
				_data = { ...identidadData, idType: e.value }
			}
		} else {
			_data = {
				...identidadData,
				[e.target.name]: e.target.value
			}
		}
		setIdentidadData(_data)
	}

	return (
		<div>
			<br />

			<h4>
				{t(
					'estudiantes>expediente>info_gen>info_gen>titulo',
					'Información general'
				)}
			</h4>

			{loading ? (
				<Loader />
			) : (
				<>
					<br />
					{snackBar(snackbarContent.variant, snackbarContent.msg)}
					<Form onSubmit={handleSubmit(submitData)}>
						<Row>
							<Colxx lg="6">
								<PersonalDataForm
									personalData={identidadData}
									disabled={
										(state.identification.loaded &&
											identidadData.idType &&
											identidadData.idType.codigo === '01') ||
										!editable
									}
									identification={state.identification}
									handleChange={handleChange}
									listSexo={listSexo}
									selects={props.selects}
									label
								/>
							</Colxx>

							<Colxx lg="6">
								<DataForm
									selects={props.selects}
									identification={state.identification}
									personalData={identidadData}
									handleChange={handleChange}
									disabled={
										(state.identification.loaded &&
											identidadData.idType &&
											identidadData.idType.codigo === '01') ||
										!editable
									}
									editable={editable}
									disableMigrationStatus={disableMigrationStatus}
								/>
							</Colxx>
						</Row>
						<div className="container-center my-3">
							<EditButton
								loading={state.identification.loading}
								editable={editable}
								setEditable={value => {
									authHandler(
										'modificar',
										() => setEditable(value),
										toggleSnackbar
									)
								}}
								sendData={sendData}
							/>
						</div>
					</Form>
				</>
			)}
		</div>
	)
}

export default withAuthorization({
	id: 1,
	Modulo: 'Expediente Estudiantil',
	Apartado: 'Informacion General',
	Seccion: 'Informacion General'
})(withIdentification(withRouter(General)))
