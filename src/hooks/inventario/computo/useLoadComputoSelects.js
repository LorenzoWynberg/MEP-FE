import axios from 'axios'
import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useActions } from 'Hooks/useActions'
import { getCatalogsByName } from 'Redux/selects/actions'
import { envVariables } from 'Constants/enviroment'

const useLoadComputoSelects = () => {
	const [loading, setLoading] = useState(true)
	const [selects, setSelects] = useState([])
	const [catalogos, setCatalogos] = useState([])
	const actions = useActions({ getCatalogsByName })

	const state = useSelector(store => ({
		selects: store.selects,
		currentInstitution: store.authUser.currentInstitution
	}))

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

	const loadSelects = async () => {
		if (!catalogos.length) return

		let data = {
			tipoActivoInventarioTecnologico: [],
			estadoInventarioTecnologico: [],
			ubicacionInventarioTecnologico: [],
			fuenteInventarioTecnologico: []
		}

		// Tipo activo inventario tecnológico
		const tipoActivo = catalogos.find(
			item => item.nombre === 'Tipo activo inventario tecnológico'
		)
		if (!state.selects.tipoActivoInventarioTecnologico[0]) {
			const res1 = await actions.getCatalogsByName(
				tipoActivo.id,
				-1,
				-1,
				tipoActivo.nombre
			)
			data.tipoActivoInventarioTecnologico = res1.data
		}

		// Estado inventario tecnológico
		const estadoInventario = catalogos.find(
			item => item.nombre === 'Estado inventario tecnológico'
		)
		if (!state.selects.estadoInventarioTecnologico[0]) {
			const res2 = await actions.getCatalogsByName(
				estadoInventario.id,
				-1,
				-1,
				estadoInventario.nombre
			)
			data.estadoInventarioTecnologico = res2.data
		}

		// Ubicación inventario tecnológico
		const ubicacionInventario = catalogos.find(
			item => item.nombre === 'Ubicación inventario tecnológico'
		)
		if (!state.selects.ubicacionInventarioTecnologico[0]) {
			const res3 = await actions.getCatalogsByName(
				ubicacionInventario.id,
				-1,
				-1,
				ubicacionInventario.nombre
			)
			data.ubicacionInventarioTecnologico = res3.data
		}

		// Fuente inventario tecnológico
		const fuenteInventario = catalogos.find(
			item => item.nombre === 'Fuente inventario tecnológico'
		)
		if (!state.selects.fuenteInventarioTecnologico[0]) {
			const res4 = await actions.getCatalogsByName(
				fuenteInventario.id,
				-1,
				-1,
				fuenteInventario.nombre
			)
			data.fuenteInventarioTecnologico = res4.data
		}

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

	return { selects, loading }
}

export default useLoadComputoSelects
