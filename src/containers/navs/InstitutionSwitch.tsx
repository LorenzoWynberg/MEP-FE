import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import styled from 'styled-components'
import { BsFillEyeSlashFill } from 'react-icons/bs'
import { setDefaultInstitution } from '../../redux/auth/actions'
import { handleChangeInstitution, updatePeriodosLectivos } from 'Redux/auth/actions'
import { setExpedienteRegional, setExpedienteSupervision } from 'Redux/configuracion/actions'
import { useActions } from 'Hooks/useActions'

import swal from 'sweetalert'

const InstitutionSwitch = () => {
	const dispatch = useDispatch()

	const actions = useActions({
		setExpedienteRegional,
		setExpedienteSupervision
	})

	// useEffect(() => {
	//   swal({
	//     title: 'Traslado realizado',
	//     text: `El traslado ha sido realizado con éxito`,
	//     icon: 'success',
	//     buttons: {
	//       ok: {
	//         text: 'Cerrar',
	//         value: true
	//       }
	//     }
	//   })
	// }, [])

	const state = useSelector<any, any>(store => {
		return {
			accessRole: store.authUser.currentRoleOrganizacion.accessRole,
			currentInstitution: store.authUser.currentInstitution,
			expedienteRegional: store.configuracion.expedienteRegional,
			expedienteSupervision: store.configuracion.expedienteSupervision,
			isRoleDirectorOrRoleSupervisor: store.authUser.currentRoleOrganizacion.accessRole.nivelAccesoId > 1
		}
	})

	const verifyStorage = () => {
		try {
			const selected = localStorage.getItem('selectedInstitution')
			if (!selected || selected == '') return
			const institution = JSON.parse(selected)
			dispatch(handleChangeInstitution(institution.institucionId))
			dispatch(updatePeriodosLectivos(institution.institucionId))
		} catch (e) {
			console.log(e)
		}
	}
	React.useEffect(() => {
		verifyStorage()
	}, [])
	useEffect(() => {
		if (state.expedienteRegional?.id) {
			onUnselectInstitutionClick()
			actions.setExpedienteSupervision(null)
		}
	}, [state.expedienteRegional?.id])

	useEffect(() => {
		if (state.expedienteSupervision?.id) {
			onUnselectInstitutionClick()
			actions.setExpedienteRegional(null)
		}
	}, [state.expedienteSupervision?.id])

	const onUnselectInstitutionClick = () => {
		dispatch(setDefaultInstitution())
		localStorage.removeItem('selectedInstitution')
		localStorage.removeItem('idInstitucion')
	}

	if (state.isRoleDirectorOrRoleSupervisor && state.currentInstitution?.id && state.currentInstitution?.id != -1) {
		return (
			<>
				<Marco
					onClick={() => {
						onUnselectInstitutionClick()
						window.location.replace('/#/director/buscador/centro')
					}}
				>
					<span>
						{`${state.currentInstitution?.codigo ? state.currentInstitution?.codigo + ' - ' : ''}`}
						{state.currentInstitution?.nombre}
					</span>
					&nbsp;&nbsp;
					<BsFillEyeSlashFill size='1.5rem' />
				</Marco>
			</>
		)
	} else if (state.expedienteRegional?.id) {
		return (
			<Marco
				onClick={() => {
					actions.setExpedienteRegional(null)
					window.location.replace('/#/director/buscador/direcciones')
				}}
			>
				<span>
					{`${state.expedienteRegional?.codigo ? state.expedienteRegional?.codigo + ' - ' : ''}`}
					{state.expedienteRegional?.nombre}
				</span>
				&nbsp;&nbsp;
				<BsFillEyeSlashFill size='1.5rem' />
			</Marco>
		)
	} else if (state.expedienteSupervision?.id) {
		return (
			<Marco
				onClick={() => {
					actions.setExpedienteSupervision(null)
					window.location.replace('/#/director/supervisiones/buscador-supervision')
				}}
			>
				<span>
					{`${state.expedienteSupervision?.codigo ? state.expedienteSupervision?.codigo + ' - ' : ''}`}
					{state.expedienteSupervision?.nombre}
				</span>
				&nbsp;&nbsp;
				<BsFillEyeSlashFill size='1.5rem' />
			</Marco>
		)
	} else return <></>
}

const Marco = styled.div`
	display: flex;
	height: 2rem;
	background: ${props => props.theme.orange};
	border-radius: 10rem;
	justify-content: center;
	align-content: center;
	justify-items: center;
	align-items: center;
	padding: 1rem;
	color: ${props => props.theme.primary};
	cursor: pointer;
	width: 100%;

	@media (min-width: 600px) {
		width: auto;
	}
`

export default InstitutionSwitch
