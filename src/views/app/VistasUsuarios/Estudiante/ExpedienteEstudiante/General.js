import React, { useState, useEffect } from 'react'
import { Colxx } from 'Components/common/CustomBootstrap'
import IdForm from './_partials/general/IdForm'
import PersonalDataForm from './_partials/general/PersonalDataForm'
import DataForm from './_partials/general/DataForm'
import { Row, Form } from 'reactstrap'
import { withIdentification } from '../../../../../Hoc/Identification'
import { sendStudentData } from '../../../../../redux/expedienteEstudiantil/actions'
import { useActions } from '../../../../../hooks/useActions'
import useNotification from '../../../../../hooks/useNotification'
import moment from 'moment'
import { getIdentification, updateIdentity } from '../../../../../redux/identificacion/actions'
import { getCatalogs, getCatalogsSet } from '../../../../../redux/selects/actions'
import { useSelector } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { catalogsEnumObj } from '../../../../../utils/catalogsEnum'
import { mapOption, parseOptions } from '../../../../../utils/mapeoCatalogos'
import { EditButton } from 'components/EditButton'
import Loader from 'components/Loader'
import { validateSelectsData } from '../../../../../utils/ValidateSelectsData'
import { useForm } from 'react-hook-form'
import withAuthorization from '../../../../../Hoc/withAuthorization'

const listSexo = [
	{ value: 1, label: 'Masculino', key: 1 },
	{ value: 2, label: 'Femenino', key: 2 }
]

const General = props => {
	const { authHandler } = props
	const imageInitialState = { preview: '', raw: '', edited: false }
	const [identidadData, setIdentidadData] = useState({})
	const [disableMigrationStatus, setDisableMigrationStatus] = useState(false)
	const [loading, setLoading] = useState(true)
	const [birthDate, setBirthDate] = useState('')
	const [editable, setEditable] = useState(false)
	const [image, setImage] = useState(imageInitialState)
	const [snackbarContent, setSnacbarContent] = useState({
		msg: 'welcome',
		variant: 'info'
	})
	const [snackBar, handleClick] = useNotification()
	const { handleSubmit } = useForm()
	const toggleSnackbar = (variant, msg) => {
		setSnacbarContent({
			variant,
			msg
		})
		handleClick()
	}
	const actions = useActions({
		sendStudentData,
		getCatalogs,
		updateIdentity,
		getIdentification,
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
				setSnacbarContent({
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
		if (state.identification.data.id && validateSelectsData(props.selects, catalogsNamesArray)) {
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
				fechaDeNacimiento: moment(state.identification.data.fechaNacimiento).format('DD/MM/YYYY'),
				edad: moment().diff(state.identification.data.fechaNacimiento, 'years', false),
				facebook: state.identification.data.facebook ? state.identification.data.facebook : '',
				instagram: state.identification.data.instagram ? state.identification.data.instagram : '',
				twitter: state.identification.data.twitter ? state.identification.data.twitter : '',
				whatsapp: state.identification.data.whatsapp ? state.identification.data.whatsapp : '',
				fotografiaUrl: state.identification.data.fotografiaUrl ? state.identification.data.fotografiaUrl : ''
			}

			setIdentidadData(_item)
			setBirthDate(state.identification.fechaDeNacimiento)
			if (state.identification.data.fotografiaUrl) {
				setImage({
					preview: state.identification.data.fotografiaUrl,
					raw: '',
					edited: false
				})
			} else {
				setImage(imageInitialState)
			}
			setLoading(false)
		} else {
			setLoading(true)
		}
	}, [
		state.identification.data.id,
		state.identification.data.fotografiaUrl,
		state.identification.data.datos,
		props.selects,
		editable
	])
	useEffect(() => {
		const reg = /([0-9]{9})/g
		let _item = {}
		if (reg.test(identidadData.identificacion)) {
			const status = props.selects[catalogsEnumObj.ESTATUSMIGRATORIO.name].find(item => item.codigo === '02')
			_item = {
				...identidadData,
				migracionStatus: {
					...status,
					label: status.nombre,
					value: status.id
				}
			}

			setIdentidadData(_item)
			setDisableMigrationStatus(true)
		}
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
			fotografiaUrl: identidadData.fotografiaUrl,
			conocidoComo: identidadData.conocidoComo,
			lesco: identidadData.lesco,
			elementosNoRequiridosIds: datos,
			sexoId: identidadData.sexo ? identidadData.sexo.value : 0,
			nacionalidadId: identidadData.nacionalidad.value,
			tipoIdentificacionId: identidadData.idType.value
		}
		let response
		if (image.edited) {
			response = await actions.updateIdentity(_data, image.raw)
		} else {
			response = await actions.updateIdentity(_data)
		}
		if (response.data.error) {
			setSnacbarContent({
				variant: 'error',
				msg: response.data.message
			})
			handleClick()
			setEditable(true)
		} else {
			setSnacbarContent({
				variant: 'success',
				msg: '¡Los datos se han actualizado con éxito!'
			})
			handleClick()
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

	const submitData = data => authHandler('modificar', sendData, toggleSnackbar)

	return (
		<Form onSubmit={handleSubmit(submitData)}>
			{snackBar(snackbarContent.variant, snackbarContent.msg)}
			<h4>Información general</h4>
			{loading ? (
				<Loader />
			) : (
				<>
					<br />
					<IdForm
						{...props}
						identification={state.identification}
						errors={state.identification.errorMessages}
						fields={state.identification.errorFields}
						handleChange={handleChange}
						identidadData={identidadData}
						avoidSearch={props.avoidSearch}
						editable={editable}
						image={image}
						setImage={setImage}
					/>
					<Row>
						<Colxx xxs='6' className='mt-5'>
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
							/>
						</Colxx>
						<Colxx xxs='6' className='mt-5'>
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
						<div className='container-center my-5 mb-3'>
							<EditButton
								loading={state.identification.loading}
								editable={editable}
								setEditable={value => {
									authHandler('modificar', () => setEditable(value), toggleSnackbar)
								}}
								sendData={sendData}
							/>
						</div>
					</Row>
				</>
			)}
		</Form>
	)
}

export default withAuthorization({
	id: 1,
	Modulo: 'Expediente Estudiantil',
	Apartado: 'Informacion General',
	Seccion: 'Informacion General'
})(withIdentification(withRouter(General)))
