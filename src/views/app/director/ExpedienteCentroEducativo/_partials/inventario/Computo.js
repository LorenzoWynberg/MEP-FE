import React, { useEffect, useState } from 'react'
import { useActions } from 'Hooks/useActions'
import { useSelector } from 'react-redux'
import Loader from 'Components/Loader'
import { getDatosDirector, clearDatosDirector } from 'Redux/institucion/actions'

const UbicacionGeografica = props => {
	const [loading, setLoading] = useState(true)
	const actions = useActions({ clearDatosDirector, getDatosDirector })

	const state = useSelector(store => {
		return {
			currentInstitution: store.authUser.currentInstitution
		}
	})

	return <div>{!loading ? <>Hi</> : <Loader />}</div>
}

export default UbicacionGeografica
