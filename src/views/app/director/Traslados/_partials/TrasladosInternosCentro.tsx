import React, { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet'
import { Container, Row } from 'reactstrap'
import useNotification from 'Hooks/useNotification'
import { useActions } from 'Hooks/useActions'
import Loader from 'Components/Loader'
import Typography from '@material-ui/core/Typography'
import { useParams, useLocation, useHistory } from 'react-router-dom'

import { getGroupsByIntitution } from 'Redux/grupos/actions'
import { useSelector } from 'react-redux'

import Ofertas from './Ofertas'
import EnrolledStudents from './EnrolledStudents'
import Register from '../../MatricularEstudiantes/registro/new/register'
import { useTranslation } from 'react-i18next'
type SnackbarConfig = {
	variant: string
	msg: string
}

const TrasladosInternosCentro = props => {
	const [loading, setLoading] = useState<boolean>(false)
	const [title, setTitle] = useState<string>('- Seleccione el nivel')
	const { nivelOfertaId } = useParams<any>()
	const [mount, setMount] = useState(false)
	const [selectedNivelOferta, setSelectedNivelOferta] = useState<any>(null)
	const [institucionId, setinstitucionId] = useState<number>(0)
	const { t } = useTranslation()
	const history = useHistory()
	const { hasAddAccess = true, hasEditAccess = true, hasDeleteAccess = true } = props
	const [snackBarContent, setSnackbarContent] = React.useState<SnackbarConfig>({
		variant: '',
		msg: ''
	})
	const [snackbar, handleClick] = useNotification()

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

  	useEffect(() => {
	
	}, [state.institution, institucionId])

	useEffect(() => {
		const fetch = async () => {
			if (state.centerOffers?.length === 0) {
				setLoading(true)
			}

			await actions.getGroupsByIntitution(state.institution?.id)

			setLoading(false)
		}

		if (mount) {
			fetch()
		}

		setMount(true)
		setinstitucionId(state.institution?.id)
	}, [state.institution, mount])

	useEffect(() => {
		if (institucionId && state.institution?.id != institucionId) {
			setLoading(true)
			setSelectedNivelOferta(null)
		}
	}, [state.institution, institucionId])

	useEffect(() => {
		if (nivelOfertaId) {
			let nivelOferta = state.centerOffers.find(o => o.nivelOfertaId === Number(nivelOfertaId))
			if (!nivelOferta) {
				nivelOferta = state.centerOffersSpecialty?.find(el => {
					return el.nivelOfertaId === Number(nivelOfertaId)
				})
			}
			setSelectedNivelOferta(nivelOferta)
		}
	}, [state.centerOffers])

	const goBackOffer = async () => {
		setSelectedNivelOferta(null)
		history.push('/director/registro-estudiantil')
	}

	if (state.institution?.id == -1) {
		return (
			<>
				<Helmet>
					<title>Gestión de Traslados</title>
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
			</>
		)
	}

	return (
		<>
			<Helmet>
				<title>Gestión de Traslados</title>
			</Helmet>
			<div className='dashboard-wrapper'>
				{snackbar(snackBarContent.variant, snackBarContent.msg)}
				<Container>
					<>
						{loading ? (
							<Loader />
						) : (
							<>
								{!selectedNivelOferta && (
									<Ofertas
										data={loading ? [] : state.centerOffers}
										institutionId={institucionId}
										setTitle={setTitle}
										setSelectedLvl={setSelectedNivelOferta}
									/>
								)}
								{selectedNivelOferta && (
									<EnrolledStudents
										selectedLvl={selectedNivelOferta}
										setSnackbarContent={setSnackbarContent}
										handleClick={handleClick}
										type={props.type}
									/>
								)}
							</>
						)}
					</>
				</Container>
			</div>
		</>
	)
}

export default TrasladosInternosCentro
