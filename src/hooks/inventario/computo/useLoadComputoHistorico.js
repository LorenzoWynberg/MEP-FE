import axios from 'axios'
import { useState, useEffect, useCallback } from 'react'
import { useSelector } from 'react-redux'
import { envVariables } from 'Constants/enviroment'

const useLoadComputoHistorico = pagination => {
	const [loading, setLoading] = useState(true)
	const [data, setData] = useState([])

	const selectedYear = useSelector(store => store.authUser.selectedActiveYear)
	const currentInstitution = useSelector(
		store => store.authUser.currentInstitution
	)

	const loadHistorico = useCallback(async () => {
		if (!currentInstitution?.id || !selectedYear?.nombre) {
			setData([])
			setLoading(false)
			return
		}
		try {
			setLoading(true)
			const baseURL = `${envVariables.BACKEND_URL}/api/Inventario/ListarInventarioByInstitucionId/${currentInstitution.id}/${selectedYear.nombre}`
			let url = baseURL

			if (pagination.searchValue) {
				url += `/${pagination.searchValue}`
			}

			const response = await axios.get(url)
			setData(response.data || [])
		} catch (error) {
			console.error('Error loading historical data:', error)
			setData([])
		} finally {
			setLoading(false)
		}
	}, [
		currentInstitution?.id,
		selectedYear?.nombre,
		pagination.searchValue,
		pagination.page,
		pagination.pageSize
	])

	useEffect(() => {
		loadHistorico()
	}, [loadHistorico])

	return {
		data,
		loading,
		refetch: loadHistorico
	}
}

export default useLoadComputoHistorico
