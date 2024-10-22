import axios from 'axios'
import { useSelector } from 'react-redux'
import { useState, useEffect } from 'react'
import { useActions } from 'Hooks/useActions'
import { envVariables } from 'Constants/enviroment'
import { getCatalogsByName } from 'Redux/selects/actions'

const useLoadOrientacionSelects = () => {
	const [loading, setLoading] = useState(true)

	const [selects, setSelects] = useState({
		mediosIntervencion: []
	})
	const [catalogos, setCatalogos] = useState([])
	const actions = useActions({ getCatalogsByName })

	const state = useSelector(store => ({
		selects: store.selects,
		currentInstitution: store.authUser.currentInstitution
	}))

	//? Carga de tipos de catalogos
	const loadCatalogos = async () => {
		try {
			const response = await axios.get(
				`${envVariables.BACKEND_URL}/api/Areas/GestorCatalogos/TipoCatalogo`
			)
			setCatalogos(response.data)
		} catch (error) {
			console.error('Error loading catalogos:', error)
			setLoading(false)
		}
	}

	//? Carga de selects
	const loadSelects = async () => {
		if (!catalogos.length) return

		let data = {
			mediosIntervencion: [],
			tiposOrientacion: [],
			bloqueTematico: [],
			tipoActividadOrientacion: [],
			accionesIndispensables: [],
			steam: [],
			accionRealizada: [],
			motivoConsulta: [],
			mecanismoDeteccion: [],
			motivoIntervencion: [],
			participantesPlanIntervencion: [],
			participantesPlanAsesoria: []
		}

		//* Medios de intervencion
		const mediosIntervencion = catalogos.find(
			item => item.nombre === 'Medios Intervención'
		)

		if (mediosIntervencion && !state.selects.mediosIntervencion[0]) {
			const res1 = await actions.getCatalogsByName(
				mediosIntervencion.id,
				-1,
				-1,
				mediosIntervencion.nombre
			)
			data.mediosIntervencion = res1.data
		}

		//* Tipos de orientacion
		const tiposOrientacion = catalogos.find(
			item => item.nombre === 'Tipos Orientación'
		)

		if (tiposOrientacion && !state.selects.tiposOrientacion[0]) {
			const res2 = await actions.getCatalogsByName(
				tiposOrientacion.id,
				-1,
				-1,
				tiposOrientacion.nombre
			)
			data.tiposOrientacion = res2.data
		}

		//* Bloque tematico
		const bloqueTematico = catalogos.find(
			item => item.nombre === 'Bloque temático'
		)

		if (bloqueTematico && !state.selects.bloqueTematico[0]) {
			const res3 = await actions.getCatalogsByName(
				bloqueTematico.id,
				-1,
				-1,
				bloqueTematico.nombre
			)
			data.bloqueTematico = res3.data
		}

		//* Tipo de actividad
		const tipoActividad = catalogos.find(
			item => item.nombre === 'Tipo de actividad'
		)

		if (tipoActividad && !state.selects.tipoActividadOrientacion[0]) {
			const res4 = await actions.getCatalogsByName(
				tipoActividad.id,
				-1,
				-1,
				tipoActividad.nombre
			)
			data.tipoActividadOrientacion = res4.data
		}

		//* Acciones indispensables
		const accionesIndispensables = catalogos.find(
			item => item.nombre === 'Acciones Indispensables'
		)

		if (accionesIndispensables && !state.selects.accionesIndispensables[0]) {
			const res5 = await actions.getCatalogsByName(
				accionesIndispensables.id,
				-1,
				-1,
				accionesIndispensables.nombre
			)
			data.accionesIndispensables = res5.data
		}

		//* STEAM
		const steam = catalogos.find(item => item.nombre === 'STEAM')
		if (steam && !state.selects.steam[0]) {
			const res6 = await actions.getCatalogsByName(
				steam.id,
				-1,
				-1,
				steam.nombre
			)
			data.steam = res6.data
		}

		//* Acción realizada
		const accionRealizada = catalogos.find(
			item => item.nombre === 'Acción realizada'
		)
		if (accionRealizada && !state.selects.accionRealizada[0]) {
			const res7 = await actions.getCatalogsByName(
				accionRealizada.id,
				-1,
				-1,
				accionRealizada.nombre
			)
			data.accionRealizada = res7.data
		}

		//* Motivo de counsulta
		const motivoConsulta = catalogos.find(
			item => item.nombre === 'Motivo de consulta'
		)
		if (motivoConsulta && !state.selects.motivoConsulta[0]) {
			const res8 = await actions.getCatalogsByName(
				motivoConsulta.id,
				-1,
				-1,
				motivoConsulta.nombre
			)
			data.motivoConsulta = res8.data
		}

		//* Mecanismo de detección
		const mecanismoDeteccion = catalogos.find(
			item => item.nombre === 'Mecanismo de detección'
		)
		if (mecanismoDeteccion && !state.selects.mecanismoDeteccion[0]) {
			const res9 = await actions.getCatalogsByName(
				mecanismoDeteccion.id,
				-1,
				-1,
				mecanismoDeteccion.nombre
			)
			data.mecanismoDeteccion = res9.data
		}

		//* Motivo de intervención
		const motivoIntervencion = catalogos.find(
			item => item.nombre === 'Motivo de intervención'
		)
		if (motivoIntervencion && !state.selects.motivoIntervencion[0]) {
			const res10 = await actions.getCatalogsByName(
				motivoIntervencion.id,
				-1,
				-1,
				motivoIntervencion.nombre
			)
			data.motivoIntervencion = res10.data
		}

		//* Participantes del proceso - Plan Intervención
		const participantesProceso = catalogos.find(
			item => item.nombre === 'Participantes del proceso - Plan Intervención '
		)
		if (
			participantesProceso &&
			!state.selects.participantesPlanIntervencion[0]
		) {
			const res11 = await actions.getCatalogsByName(
				participantesProceso.id,
				-1,
				-1,
				participantesProceso.nombre
			)
			data.participantesPlanIntervencion = res11.data
		}

		//* Participantes del proceso - Asesoría
		const participantesPlanAsesoria = catalogos.find(
			item => item.nombre === 'Participantes del proceso - Asesoría '
		)
		if (
			participantesPlanAsesoria &&
			!state.selects.participantesPlanAsesoria[0]
		) {
			const res12 = await actions.getCatalogsByName(
				participantesPlanAsesoria.id,
				-1,
				-1,
				participantesPlanAsesoria.nombre
			)
			data.participantesPlanAsesoria = res12.data
		}

		console.log('JPBR data', data)
		setSelects(data)
		setLoading(false)
	}

	useEffect(() => {
		setLoading(true)
		loadCatalogos()
	}, [])

	useEffect(() => {
		if (catalogos.length) {
			loadSelects()
		}
	}, [catalogos])

	return {
		loading,
		selects
	}
}

export default useLoadOrientacionSelects
