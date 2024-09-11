import React, { useState, useEffect } from 'react'
import ApoyoEducativo from './_partials/apoyo/ApoyoEducativo'
import ApoyoItem from './_partials/apoyo/ApoyoItem'
import ApoyoHeader from './_partials/apoyo/ApoyoHeader'
import 'react-tagsinput/react-tagsinput.css'
import CollapseCard from 'Components/common/CollapseCard'
import Pagination from '../../../../components/table/Pagination'
import { useSelector } from 'react-redux'
import { useActions } from '../../../../hooks/useActions'
import {
	getTiposApoyos,
	getDependenciasApoyos,
	getCategoriasApoyos,
	getApoyosByType,
	addApoyo,
	deleteApoyo,
	editApoyo,
	getDiscapacidades,
	saveDiscapacidades,
	getCondiciones,
	getResources,
	clearCurrentDiscapacidades
} from '../../../../redux/apoyos/actions'
import { getCatalogs } from '../../../../redux/selects/actions'
import Loader from '../../../../components/Loader'
import { catalogsEnumObj } from '../../../../utils/catalogsEnum'
import useNotification from '../../../../hooks/useNotification'
import { useWindowSize } from 'react-use'
import { useForm } from 'react-hook-form'
import { Container } from 'reactstrap'
import withAuthorization from '../../../../Hoc/withAuthorization'
import swal from 'sweetalert'
import { useTranslation } from 'react-i18next'

const ApoyoEducativoOpciones = withAuthorization({
	id: 9,
	Modulo: 'Expediente Estudiantil',
	Apartado: 'Apoyos Educativos',
	Seccion: 'Apoyos Educativos'
})(ApoyoEducativo)

//TODO JPBR: Limpiar los llamados innesarios de esta pagina al BE
const General = props => {
	const { t } = useTranslation()

	const [addItems, setAddItems] = useState({})
	const [loading, setLoading] = useState(false)
	const [snackBar, handleClick] = useNotification()
	const [snackBarContent, setSnackbarContent] = useState({ varian: 'error', msg: '' })
	const { handleSubmit } = useForm()
	const [categorias, setCategorias] = useState([])
	const { width } = useWindowSize()
	const state = useSelector(store => {
		return {
			apoyos: store.apoyos,
			identification: store.identification,
			selects: store.selects,
			currentStudent: store.expedienteEstudiantil
		}
	})

	const actions = useActions({
		getResources,
		getTiposApoyos,
		getDependenciasApoyos,
		getCategoriasApoyos,
		getApoyosByType,
		addApoyo,
		deleteApoyo,
		editApoyo,
		getCatalogs,
		getDiscapacidades,
		saveDiscapacidades,
		getCondiciones,
		clearCurrentDiscapacidades
	})

	const agregarApoyo = async (data, category, categoryKeyName) => {
		let dataSend = {
			...data,
			condicionApoyoId: 6050
		}
		debugger
		return await actions.addApoyo(dataSend, category, categoryKeyName, state.apoyos[categoryKeyName].pageNumber)
	}

	const handleDeleteApoyo = async (id, categoryKeyName, category) => {
		swal({
			title: 'Confirmación',
			text: '¿Está seguro que desea eliminar el registro seleccionado?',
			icon: 'warning',
			className: 'text-alert-modal',
			buttons: {
				ok: {
					text: 'Aceptar',
					value: true,
					className: 'btn-alert-color'
				},
				cancel: 'Cancelar'
			}
		}).then(async result => {
			if (result) {
				return await actions.deleteApoyo(
					id,
					categoryKeyName,
					state.identification.data.id,
					state.apoyos[categoryKeyName].pageNumber,
					category
				)
			}
		})
	}

	const editarApoyo = async (data, category, categoryKeyName) => {
		return await actions.editApoyo(data, category, categoryKeyName, state.apoyos[categoryKeyName].pageNumber)
	}

	const showsnackBar = (variant, msg) => {
		setSnackbarContent({ variant, msg })
		handleClick()
	}

	useEffect(() => {
		const loadData = async () => {
			setLoading(true)
			await actions.getResources('discapacidades', state.identification.data.id)
			await actions.getResources('condiciones', state.identification.data.id)
			await actions.getTiposApoyos()
			await actions.getDependenciasApoyos()
			await actions.getCategoriasApoyos()
			await actions.getCondiciones(state.identification.data.id)
			!state.selects[catalogsEnumObj.OTRASCONDICIONES.name][0] &&
				(await actions.getCatalogs(catalogsEnumObj.OTRASCONDICIONES.id))
			!state.selects[catalogsEnumObj.DISCAPACIDADES.name][0] &&
				(await actions.getCatalogs(catalogsEnumObj.DISCAPACIDADES.id))
			await actions.getDiscapacidades(state.identification.data.id)
			setLoading(false)
		}
		loadData()

		return () => {
			actions.clearCurrentDiscapacidades()
		}
	}, [])

	if (loading) return <Loader />

	return (
		<>
			{snackBar(snackBarContent.variant, snackBarContent.msg)}
			<h4>{t('estudiantes>expediente>apoyos_edu>titulo', 'Apoyos educativos')}</h4>
			<br />
			<ApoyoEducativoOpciones
				showsnackBar={showsnackBar}
				discapacidades={state.selects[catalogsEnumObj.DISCAPACIDADES.name]}
				condiciones={state.selects[catalogsEnumObj.OTRASCONDICIONES.name]}
				identidadId={state.identification.data.id}
				otrasCondiciones={state.selects[catalogsEnumObj.OTRASCONDICIONES.name]}
				discapacidadesIdentidad={state.apoyos.discapacidadesIdentidad}
				condicionesIdentidad={state.apoyos.condicionesIdentidad}
				saveDiscapacidades={actions.saveDiscapacidades}
				apoyos={state.apoyos}
				handleSubmit={handleSubmit}
			/>
		</>
	)
}

export default withAuthorization({
	id: 9,
	Modulo: 'Expediente Estudiantil',
	Apartado: 'Apoyos Educativos',
	Seccion: 'Apoyos Educativos'
})(General)
