import axios from 'axios'
import { useState, useEffect, useCallback } from 'react'
import { useSelector } from 'react-redux'
import { envVariables } from 'Constants/enviroment'

const useLoadComputoHistorico = () => {
	const [loading, setLoading] = useState(true)
	const [data, setData] = useState([])

	const { selectedYear, currentInstitution } = useSelector(store => ({
		selectedYear: store.authUser.selectedActiveYear,
		currentInstitution: store.authUser.currentInstitution
	}))

	const loadHistorico = useCallback(async () => {
		if (!currentInstitution?.id || !selectedYear?.nombre) {
			setData([])
			setLoading(false)
			return
		}

		try {
			setLoading(true)
			const response = await axios.get(
				`${envVariables.BACKEND_URL}/api/Inventario/ListarInventarioByInstitucionId/${currentInstitution.id}/${selectedYear.nombre}`
			)
			if (response.data.length) {
				console.log('LORE', response.data)
				setData(response.data)
			} else {
				setData([])
			}
		} catch (error) {
			console.error('Error loading historical data:', error)
			setData([])
		} finally {
			setLoading(false)
		}
	}, [currentInstitution?.id, selectedYear?.nombre])

	useEffect(() => {
		loadHistorico()
	}, [loadHistorico])

	return { data, loading, refetch: loadHistorico }
}

export default useLoadComputoHistorico
