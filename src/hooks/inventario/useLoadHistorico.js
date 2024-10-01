import axios from 'axios'
import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { envVariables } from 'Constants/enviroment'

const useLoadHistorico = () => {
	const [loading, setLoading] = useState(true)
	const [data, setData] = useState([])

	const currentInstitution = useSelector(
		store => store.authUser.currentInstitution
	)

	const loadHistorico = async () => {
		try {
			const response = await axios.get(
				`${envVariables.BACKEND_URL}/api/Inventario/ListarInventarioByInstitucionId/${currentInstitution.id}`
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
		if (currentInstitution?.id) {
			setLoading(true)
			loadHistorico()
		}
	}, [currentInstitution?.id])

	return { data, loading }
}

export default useLoadHistorico
