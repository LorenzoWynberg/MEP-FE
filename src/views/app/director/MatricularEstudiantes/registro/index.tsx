import directorItems from 'Constants/directorMenu'
import AppLayout from 'Layout/AppLayout'
import React, { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet'
import { Container, Row } from 'reactstrap'

import { useActions } from 'Hooks/useActions'
import Loader from 'Components/Loader'
import Typography from '@material-ui/core/Typography'
import { useParams, useHistory } from 'react-router-dom'

import { getGroupsByIntitution } from 'Redux/grupos/actions'
import { useSelector } from 'react-redux'

import Ofertas from './ofertas'
import Register from './new/register'
import { useTranslation } from 'react-i18next'
import { usePrevious } from 'Hooks'

const RegistroEstudiantil = props => {
	const { hasAddAccess = true, hasEditAccess = true, hasDeleteAccess = true } = props
	const { t } = useTranslation()
	const [loading, setLoading] = useState<boolean>(true)
	const [title, setTitle] = useState<string>(
		'estudiantes>registro_matricula>matricula_estudian>matricula_estudiantes>titulo'
	)
	const { nivelOfertaId } = useParams<any>()
	const [mount, setMount] = useState(false)
	const [selectedNivelOferta, setSelectedNivelOferta] = useState<any>(null)
	const [onlyViewModule, setOnlyViewModule] = useState<boolean>(true)
	const history = useHistory()

	const actions = useActions({
		getGroupsByIntitution
	})

	const state = useSelector((store: any) => {
		return {
			grupos: store.grupos.groups,
			gruposState: store.grupos,
			centerOffers: store.grupos.centerOffersGrouped,
			institution: store.authUser.currentInstitution,
			centerOffersSpecialty: store.grupos.centerOffersSpecialtyGrouped
		}
	})
	const ACTIVE_YEAR = useSelector((store: any) => store.authUser.selectedActiveYear)

	const PREV_ACTIVE_YEAR: any = usePrevious(ACTIVE_YEAR)

	useEffect(() => {
		setOnlyViewModule(!ACTIVE_YEAR.esActivo)
		if (PREV_ACTIVE_YEAR?.id) {
			if (PREV_ACTIVE_YEAR?.id !== ACTIVE_YEAR?.id)
				history.push('/director/registro-estudiantil')
		}
	}, [ACTIVE_YEAR])

	useEffect(() => {
		const fetch = async () => {
			setLoading(true)
			await actions.getGroupsByIntitution(state.institution?.id)
			setLoading(false)
		}

		if (mount) {
			fetch()
		}

		setMount(true)
	}, [state.institution, ACTIVE_YEAR, mount])

	useEffect(() => {
		if (nivelOfertaId) {
			let nivelOferta = state.centerOffers.find(
				o => o.nivelOfertaId === Number(nivelOfertaId)
			)
			if (!nivelOferta) {
				nivelOferta = state.centerOffersSpecialty?.find(el => {
					return el.nivelOfertaId === Number(nivelOfertaId)
				})
			}
			setSelectedNivelOferta(nivelOferta)
		}
	}, [nivelOfertaId, state.centerOffers])

	const goBackOffer = async () => {
		setSelectedNivelOferta(null)
		history.push('/director/registro-estudiantil')
	}
	const goTo = nivelOferta => {
		history.push('/director/registro-estudiantil/' + nivelOferta)
	}
	if (state.institution?.id == -1) {
		return (
			<AppLayout items={directorItems}>
				<Helmet>
					<title>Registro Estudiante</title>
				</Helmet>
				<div className='dashboard-wrapper'>
					<Container>
						<Row>
							<Typography variant='h5' className='mb-3'>
								{t(
									'estudiantes>traslados>gestion_traslados>seleccionar',
									'Debe seleccionar un centro educativo en el buscador de centro educativo.'
								)}
							</Typography>
						</Row>
					</Container>
				</div>
			</AppLayout>
		)
	}

	return (
		<AppLayout items={directorItems}>
			<Helmet>
				<title>Registro Estudiante</title>
			</Helmet>
			<div className='dashboard-wrapper'>
				<Container>
					<Row>
						<Typography variant='h5' className='mb-3'>
							{t(
								'estudiantes>registro_matricula>matricula_estudian>matricula_estudiantes',
								'Matrícula de estudiantes '
							)}
							{t(title, `${title} not found`)}
						</Typography>
					</Row>
					<Row>
						{loading ? (
							<Loader />
						) : (
							<>
								{!selectedNivelOferta && (
									<Ofertas
										goTo={goTo}
										data={loading ? [] : state.centerOffers}
										setTitle={setTitle}
									/>
								)}
								{selectedNivelOferta && (
									<Register
										onlyViewModule={onlyViewModule}
										hasAddAccess={hasAddAccess}
										hasEditAccess={hasEditAccess}
										hasDeleteAccess={hasDeleteAccess}
										dataNivel={selectedNivelOferta}
										goBack={goBackOffer}
									/>
								)}
							</>
						)}
					</Row>
				</Container>
			</div>
		</AppLayout>
	)
}

export default RegistroEstudiantil
