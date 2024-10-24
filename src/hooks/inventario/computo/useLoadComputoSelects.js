import axios from 'axios'
import { useSelector } from 'react-redux'
import { useState, useEffect } from 'react'
import { useActions } from 'Hooks/useActions'
import { envVariables } from 'Constants/enviroment'
import { getCatalogsByName } from 'Redux/selects/actions'

const useLoadComputoSelects = () => {
	const [loading, setLoading] = useState(true)
	const [selects, setSelects] = useState({
		tipoActivoInventarioTecnologico: [],
		estadoInventarioTecnologico: [],
		ubicacionInventarioTecnologico: [],
		fuenteInventarioTecnologico: []
	})
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
		const catalogo1 = catalogos.find(
			item => item.nombre === 'Tipo activo inventario tecnológico'
		)
		if (catalogo1 && !state.selects.tipoActivoInventarioTecnologico[0]) {
			const res1 = await actions.getCatalogsByName(
				catalogo1.id,
				-1,
				-1,
				catalogo1.nombre
			)
			data.tipoActivoInventarioTecnologico = res1.data
		}

		// Estado inventario tecnológico
		const catalogo2 = catalogos.find(
			item => item.nombre === 'Estado inventario tecnológico'
		)
		if (catalogo2 && !state.selects.estadoInventarioTecnologico[0]) {
			const res2 = await actions.getCatalogsByName(
				catalogo2.id,
				-1,
				-1,
				catalogo2.nombre
			)

			const estadoOrder = ['Excelente', 'Bueno', 'Regular', 'Malo', 'N/A']
			const getEstadoOrderIndex = nombre => {
				const index = estadoOrder.indexOf(nombre)
				return index === -1 ? estadoOrder.length : index
			}
			const sortedEstadoInventarioTecnologico = res2.data.sort((a, b) => {
				return getEstadoOrderIndex(a.nombre) - getEstadoOrderIndex(b.nombre)
			})

			data.estadoInventarioTecnologico = sortedEstadoInventarioTecnologico
		}

		// Ubicación inventario tecnológico
		const catalogo3 = catalogos.find(
			item => item.nombre === 'Ubicación inventario tecnológico'
		)
		if (catalogo3 && !state.selects.ubicacionInventarioTecnologico[0]) {
			const res3 = await actions.getCatalogsByName(
				catalogo3.id,
				-1,
				-1,
				catalogo3.nombre
			)
			data.ubicacionInventarioTecnologico = res3.data
		}

		// Fuente inventario tecnológico
		const catalogo4 = catalogos.find(
			item => item.nombre === 'Fuente inventario tecnológico'
		)
		if (catalogo4 && !state.selects.fuenteInventarioTecnologico[0]) {
			const res4 = await actions.getCatalogsByName(
				catalogo4.id,
				-1,
				-1,
				catalogo4.nombre
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
