import '../style.scss'

import { useActions } from 'Hooks/useActions'
import useNotification from 'Hooks/useNotification'
import React, { useEffect, useState } from 'react'
import { Wizard } from 'react-albus'
import { injectIntl } from 'react-intl'
import { useSelector } from 'react-redux'
import {
	clearNivelData,
	clearTrasladoData,
	clearTrasladosData,
	getDataNiveles,
	saveRevisionConNivel,
	saveRevisionSimple,
	setDirectorApruebaValidacion,
	setMotivoRechazoText,
	setOneTrasladoData,
	setRevisionAnwser,
	setTrasladosData
} from 'Redux/traslado/actions'
import styled from 'styled-components'

import TableSolicitudes from './SolicitudesComponent/TableSolicitudes'
import Traslado from './Traslado'
import ModalFaltaInformacion from './utils/_partials/ModalFaltaInformacion'

const Solicitudes = props => {
	const { onlyViewModule } = props

	const [openModal, setOpenModal] = useState(false)

	const [institucionId, setinstitucionId] = useState<number>(0)
	const [snackbarContent, setSnackbarContent] = useState({
		variant: 'error',
		msg: 'hubo un error'
	})
	const [snackbar, handleClick] = useNotification()

	const [ableToAddNivel, setAbleToAddNivel] = useState(0)

	const state = useSelector((store: any) => {
		const {
			traslados,
			trasladoData,
			loading,
			motivoRechazo,
			revisionResult,
			entidadMatriculaId,
			directorEsRevisor,
			nivelData,
			validadorTraslado
		} = store.traslado

		return {
			traslados,
			trasladoData,
			loading,
			authUser: store.authUser,
			motivoRechazo,
			revisionResult,
			entidadMatriculaId,
			directorEsRevisor,
			validadorTraslado,
			nivelData,
			idInstitucion: store.authUser.currentInstitution.id
		}
	})

	const actions = useActions({
		setOneTrasladoData,
		setTrasladosData,
		clearTrasladoData,
		clearTrasladosData,
		saveRevisionSimple,
		saveRevisionConNivel,
		getDataNiveles,
		setRevisionAnwser,
		clearNivelData,
		setDirectorApruebaValidacion,
		setMotivoRechazoText
	})

	useEffect(() => {
		const fetch = async () => {
			await actions.clearTrasladoData()
			await actions.clearTrasladosData()

			await actions.getDataNiveles(
				state.authUser.currentInstitution?.id,
				state.authUser.periodosLectivos[0]?.idCurso
			)
		}
		fetch()
	}, [])

	useEffect(() => {
		const fetch = async () => {
			if (state.trasladoData?.infoTraslado?.id !== undefined) {
				await actions.setDirectorApruebaValidacion(state.trasladoData?.infoTraslado?.id)
			}
		}
		fetch()
	}, [state.trasladoData?.infoTraslado?.id])

	useEffect(() => {
		const fetchTraslados = async () => {
			if (state.authUser.currentInstitution?.id) {
				await actions.setTrasladosData(
					state.authUser.currentInstitution?.id,
					'all',
					true,
					true,
					'fechaHoraSolicitud',
					'DESC',
					1,
					100
				)
			}
		}
		fetchTraslados()
		setinstitucionId(state.authUser.currentInstitution?.id)
	}, [state.idInstitucion])

	useEffect(() => {
		if (state.trasladoData?.infoTraslado?.id > 0) {
			if (institucionId && state.authUser.currentInstitution?.id != institucionId) {
				state.trasladoData.infoTraslado.id = 0
			}
		}
	}, [state.authUser.currentInstitution?.id, institucionId])

	const cleanRevisionMode = async () => {
		await actions.clearTrasladoData()
		await actions.clearNivelData()
		setAbleToAddNivel(0)
		await actions.setRevisionAnwser(0)
		await actions.setMotivoRechazoText('')
	}

	const closeModalAlert = () => {
		props.history.push('/director/traslados/inicio')
	}
	const sendRevision = async () => {
		const noResuelta = state.trasladoData?.infoTraslado?.estado === 0
		const tipoTraslado = state.trasladoData?.infoTraslado?.tipoTraslado

		if (!noResuelta || validarCreadorParaCancelar() || !state.directorEsRevisor) {
			cleanRevisionMode()
		} else {
			if (
				(noResuelta &&
					tipoTraslado === 2 &&
					state.trasladoData?.condicionPropuesta?.idEntidadMatricula > 0) ||
				(noResuelta && tipoTraslado === 1)
			) {
				if (!state.motivoRechazo && state.revisionResult == 2) {
					setSnackbarContent({
						variant: 'warning',
						msg: 'Es necesario que agregue el motivo del rechazo'
					})
					return handleClick()
				}
				if ([1, 2].includes(parseInt(state.revisionResult))) {
					// Guardar, si todo esta bien, mostrar modal informativo si no snack red (Si la validacion falla mostrar modal)
					const dataTraslado: any = {
						idTraslado: state.trasladoData?.infoTraslado?.id,
						estado: state.revisionResult,
						motivoRechazo: state.motivoRechazo
					}
					let response
					if (tipoTraslado === 2) {
						response = await actions.saveRevisionSimple(dataTraslado)
					} else {
						if (state.revisionResult == 1 && state.entidadMatriculaId == 0) {
							setOpenModal(true)
						}
						dataTraslado.entidadMatriculaId = state.entidadMatriculaId
						dataTraslado.nivelOfertaId = state.nivelData.nivelOfertaId
						response = await actions.saveRevisionConNivel(dataTraslado)
					}
					await actions.setMotivoRechazoText('')
					if (response.error) {
						setSnackbarContent({
							variant: 'error',
							msg: 'Ha fallado al guardar, intentalo mas tarde'
						})
					} else {
						setSnackbarContent({
							variant: 'success',
							msg: 'Revisión guardada con éxito'
						})
					}
					return handleClick()
				} else {
					setSnackbarContent({
						variant: 'info',
						msg: 'Aún no das una respuesta'
					})
					return handleClick()
				}
			}
		}
	}

	const validarCreadorParaCancelar = () => {
		// 0>Interno, 1> Desde mi centro. 2>Hacia mi centro
		// tipos hacia=origen, desde=destino, interno=origen - Aprueba
		const tipoTraslado = state.trasladoData.infoTraslado.tipoTraslado
		const centroAprueba =
			tipoTraslado == 1
				? state.trasladoData.centroPropuesto.id
				: state.trasladoData.condicionActual.idCentro

		return centroAprueba != state.idInstitucion
	}
	return (
		<>
			{snackbar(snackbarContent.variant, snackbarContent.msg)}
			{!state.trasladoData?.infoTraslado?.id ? (
				<TableSolicitudes
					traslados={state.traslados.entityList}
					trasladoData={state.trasladoData}
					setOneTrasladoData={actions.setOneTrasladoData}
					setTrasladosData={actions.setTrasladosData}
				/>
			) : (
				// 0 aun no se agrega nivel, default. 1 definiendo, 2 Definido
				<StyledWizardContainer
					className='wizard wizard-default wizard-generico'
					style={{ marginTop: '0rem' }}
				>
					<Wizard id='wizard-matricular'>
						<div className='wizard-basic-step min-height-600'>
							<Traslado
								onlyViewModule={onlyViewModule}
								setAbleToAddNivel={setAbleToAddNivel}
								ableToAddNivel={ableToAddNivel}
								closeModalAlert={closeModalAlert}
							/>
						</div>
					</Wizard>
				</StyledWizardContainer>
			)}

			<ModalFaltaInformacion openModal={openModal} setOpenModal={setOpenModal} />
		</>
	)
}

const StyledWizardContainer = styled.div`
	ul.nav::before {
		left: 0;
		right: 0;
		margin-left: auto;
		margin-right: auto;
		width: 40%;

		@media (max-width: 1620px) {
			width: 45%;
		}

		@media (max-width: 1300px) {
			width: 55%;
		}
	}
`

export default injectIntl(Solicitudes)
