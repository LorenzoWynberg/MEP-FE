import axios from 'axios'
import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { envVariables } from 'Constants/enviroment'

const useLoadComputoHistorico = () => {
	const [loading, setLoading] = useState(true)
	const [data, setData] = useState([])

	const state = useSelector(store => {
		return {
			selectedYear: store.authUser.selectedActiveYear,
			currentInstitution: store.authUser.currentInstitution
		}
	})

	const loadHistorico = async () => {
		try {
			const response = await axios.get(
				`${envVariables.BACKEND_URL}/api/Inventario/ListarInventarioByInstitucionId/${state.currentInstitution.id}/${state.selectedYear.nombre}`
			)
			if (response.data.length) {
				setData(response.data)
			}
		} catch (error) {
			console.error('Error loading historical data:', error)
		} finally {
			setLoading(false)
		}
	}

	useEffect(() => {
		if (state.currentInstitution?.id && state.selectedYear?.nombre) {
			setLoading(true)
			loadHistorico()
		}
	}, [state.currentInstitution?.id, state.selectedYear?.nombre])

	return { data, loading, refetch: loadHistorico }
}

export default useLoadComputoHistorico
