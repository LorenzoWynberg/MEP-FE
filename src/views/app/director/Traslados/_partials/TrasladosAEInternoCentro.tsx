import React, { useEffect, useState, useMemo } from 'react'
import { useSelector } from 'react-redux'
import { useActions } from 'Hooks/useActions'
import { injectIntl } from 'react-intl'
import styled from 'styled-components'
import Loader from 'Components/LoaderContainer'
import useNotification from 'Hooks/useNotification'
import Buscador from './BuscadorEstudiantes'
import '../style.scss'
import Ofertas from './Ofertas'
import SimpleModal from 'Components/Modal/simple'
import { getGroupsByIntitution } from 'Redux/grupos/actions'
import ResumenTraslado from './ResumenTraslado'
import { createMultipleTraslado } from 'Redux/traslado/actions'
import InfoContactoDirector from './InfoContactoDirector'
import { useTranslation } from 'react-i18next'

const TrasladosAEInternoCentro = props => {
	const { t } = useTranslation()
	const [snackbarContent, setSnackbarContent] = useState({
		variant: 'error',
		msg: 'hubo un error'
	})

	const [snackbar, handleClick] = useNotification()
	const [loading, setLoading] = useState(false)
	const [selectedStudents, setSelectedStudents] = useState(null)
	const [title, setTitle] = useState<string>('- Seleccione el nivel')
	const [selectedNivelOferta, setSelectedNivelOferta] = useState<any>(null)
	const [finalizacionModal, setFinalizacionModal] = useState(false)
	const [motivoSolicitud, setMotivoSolicitud] = useState()
	const [openModal, setOpenModal] = useState(false)
	const [currentInstitution, setCurrentInstitucion] = useState(false)
	const [responseModal, setResponseModal] = useState({})

	const [errorModal, setErrorModal] = useState({})

	const state = useSelector((store: any) => {
		return {
			centerOffers: store.grupos.centerOffersGrouped,
			authUser: store.authUser,
			institution: store.authUser.currentInstitution,
			centerOffersSpecialty: store.grupos.centerOffersSpecialtyGrouped
		}
	})
	const actions = useActions({
		getGroupsByIntitution,
		createMultipleTraslado
	})

	useEffect(() => {
		const fetch = async () => {
			if (state.centerOffers?.length === 0) {
				setLoading(true)
			}
			await actions.getGroupsByIntitution(state.institution?.id)
			setLoading(false)
		}
		debugger
		fetch()
	}, [selectedStudents])

	const onSelectedStudent = student => {
		// debugger
		setOpenModal(true)
		setSelectedStudents([{ ...student }])
	}
	const onSelectedOferta = (oferta, nivel) => {
		setSelectedNivelOferta([{ ...oferta }])
		const _insitucion = {
			...state.institution,
			regional: state.institution.regionNombre + '/' + state.institution.circuitoNombre,
			tipoInstitucion: state.institution.esPrivado ? 'Privado' : 'Público',
			nivelPropuesto: nivel.nivelNombre + '/' + nivel.especialidadNombre
		}
		setCurrentInstitucion(_insitucion)
	}

	const closeModal = () => {
		setMotivoSolicitud(null)
		setCurrentInstitucion(false)
		setOpenModal(false)
		setSelectedNivelOferta(null)
	}

	const onSave = async () => {
		if (motivoSolicitud) {
			// Guardar, si todo esta bien, mostrar modal informativo si no snack red (Si la validacion falla mostrar modal)
			const dataTraslado = {
				tipoTraslado: 2,
				matriculaId: selectedStudents.map(e => e.idMatricula),
				institucionOrigenId: selectedStudents[0].idInstitucion,
				institucionDestinoId: state.authUser.currentInstitution.id,
				NivelOfertaId: selectedNivelOferta[0].nivelOfertaId,
				EntidadMatriculaId: selectedNivelOferta[0].entidadMatriculaId,
				motivoTraslado: motivoSolicitud
			}
			const response = await actions.createMultipleTraslado(dataTraslado)
			if (!response.error) {
				setSnackbarContent({
					variant: 'success',
					msg: 'La solicitud se ha realizado con éxito'
				})
				handleClick()
				closeModal()
				setResponseModal(response.data?.director)
				setFinalizacionModal(true)
			} else {
				if (response.message) {
					if (response.message.indexOf('{') > -1) {
						const _mensajeArrary = JSON.parse(response.message)

						const _mensajeTexto = _mensajeArrary.map(item => {
							return item.mensaje + ' '
						})

						setErrorModal(_mensajeTexto)
						setSnackbarContent({
							variant: 'error',
							msg: _mensajeTexto
						})
						handleClick()

						return
					}
				}

				if (response.error && response?.message == 'no') {
					// setOpenModalAlert(true)
					setErrorModal(response.message)
					setSnackbarContent({
						variant: 'error',
						msg: t(
							'estudiantes>traslados>gestion_traslados>inicio>solicitar_hacia_mi_centro>error',
							'Ha fallado al guardar, inténtalo mas tarde'
						)
					})
				} else {
					setSnackbarContent({
						variant: 'error',
						msg: t(
							'estudiantes>traslados>gestion_traslados>inicio>solicitar_hacia_mi_centro>error',
							'Ha fallado al guardar, inténtalo mas tarde'
						)
					})
					handleClick()
				}
			}
		} else {
			setSnackbarContent({
				variant: 'warning',
				msg: t(
					'estudiantes>traslados>gestion_traslados>inicio>solicitar_hacia_mi_centro>advertencia',
					'Debe agregar el motivo del traslado para confirmar.'
				)
			})
			handleClick()
		}
	}

	const columnsExtras = [
		{
			Header: t(
				'estudiantes>traslados>gestion_traslados>traslados_internos>trasladar>columna_nivel_propuesto',
				'Nivel propuesto'
			),
			column: 'nivelPropuesto',
			accessor: 'nivelPropuesto',
			label: ''
		}
	]

	return (
		<Container>
			{snackbar(snackbarContent.variant, snackbarContent.msg)}
			{loading ? (
				<Loader />
			) : (
				<>
					<Buscador onConfirm={onSelectedStudent} />

					<SimpleModal
						stylesContent={{
							overflowX: 'hidden'
						}}
						title={t(
							'estudiantes>traslados>gestion_traslados>solicitar_hacia_mi_centro',
							'Solicitar traslado hacia mi centro educativo'
						)}
						openDialog={openModal}
						onClose={() => {
							closeModal()
						}}
						txtBtn={t('boton>general>confirmar', 'Confirmar')}
						onConfirm={() => onSave()}
						btnSubmit={selectedStudents && selectedNivelOferta}
					>
						<div style={{ minWidth: '100%' }}>
							{selectedStudents && !selectedNivelOferta && (
								<Ofertas
									data={loading ? [] : state.centerOffers}
									institutionId={state.institution?.id}
									setTitle={setTitle}
									setSelectedLvl={onSelectedOferta}
								/>
							)}
							{selectedNivelOferta && (
								<ResumenTraslado
									students={selectedStudents}
									columnasExtras={columnsExtras}
									institution={currentInstitution}
									setMotivoSolicitud={setMotivoSolicitud}
									motivoSolicitud={motivoSolicitud}
								/>
							)}
						</div>
					</SimpleModal>
				</>
			)}
			<SimpleModal
				title='Solicitud de traslado finalizada'
				openDialog={finalizacionModal}
				onClose={() => {
					setFinalizacionModal(false)
					window.history.back()
				}}
				onConfirm={() => {
					setFinalizacionModal(false)
					window.history.back()
				}}
				txtBtn='Aceptar'
				btnCancel={false}
			>
				<div style={{ minWidth: '100%' }}>
					<InfoContactoDirector director={responseModal} />
				</div>
			</SimpleModal>
		</Container>
	)
}

const Container = styled.div``

export default injectIntl(TrasladosAEInternoCentro)
