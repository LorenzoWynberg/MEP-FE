import directorItems from 'Constants/directorMenu'
import AppLayout from 'Layout/AppLayout'
import React, { useEffect, useState } from 'react'
import Loader from 'Components/LoaderContainer'
import { Col, Container, Row } from 'reactstrap'
import { useSelector } from 'react-redux'
import withNotification from 'Hoc/NotificationV2'
import withInstitution from 'Hoc/InstitutionSelect'
import { getGroupsByIntitution } from 'Redux/grupos/actions'
import { useActions } from 'Hooks/useActions'
import { useParams } from 'react-router-dom'
import HeaderPage from 'Components/common/Header'
import NivelesOfertas from 'Views/app/director/MatricularEstudiantes/registro/ofertas'
import { useHistory } from 'react-router-dom'
import Register from './_partials'
import { getTiposCenso } from 'Redux/matricula/actions'
import { usePrevious } from 'Hooks'
interface IProps {
	showSnackbar: Function
}

const CensoFinal = (props: IProps) => {
	const { showSnackbar } = props

	const { nivelOfertaId } = useParams<any>()
	const [loading, setLoading] = useState<boolean>(false)
	const [onlyViewModule, setOnlyViewModule] = useState<boolean>(true)
	const [data, setData] = useState<any[]>()
	const [title, setTitle] = useState<string>('- Seleccione el nivel')
	const [selectedNivelOferta, setSelectedNivelOferta] = useState<any>(null)
	let history = useHistory()

	const actions = useActions({
		getGroupsByIntitution,
		getTiposCenso
	})
	const state = useSelector((store: any) => {
		return {
			Niveles: store.grupos.centerOffersGrouped || [],

			Especialidades: store.grupos.centerOffersSpecialtyGrouped || [],
			institution: store.authUser.currentInstitution
		}
	})
	const ACTIVE_YEAR = useSelector((store: any) => store.authUser.selectedActiveYear)

	const PREV_ACTIVE_YEAR: any = usePrevious(ACTIVE_YEAR)

	useEffect(() => {
		setOnlyViewModule(!ACTIVE_YEAR.esActivo)
		if (PREV_ACTIVE_YEAR?.id) {
			if (PREV_ACTIVE_YEAR?.id !== ACTIVE_YEAR?.id)
				history.push('/director/censo-final')
		}
	}, [ACTIVE_YEAR])
	useEffect(() => {
		const fetch = async () => {
			await actions.getTiposCenso()
		}
		fetch()
	}, [])

	useEffect(() => {
		const fetch = async () => {
			setLoading(true)
			let response = await actions.getGroupsByIntitution(
				state.institution?.id
			)
			if (response?.error) {
				showSnackbar(
					'Ha ocurrido un problema al obtener los niveles ',
					'error'
				)
			}
			setLoading(false)
		}

		if (state.institution) {
			fetch()
			nivelOfertaFilter()
		}
	}, [state.institution,ACTIVE_YEAR])

	useEffect(() => {
		if (!!state.Niveles.length) {
			setData(state.Niveles)
		}
	}, [state.Niveles])

	useEffect(() => {
		nivelOfertaFilter()
	}, [nivelOfertaId])

	const nivelOfertaFilter = () => {
		if (nivelOfertaId) {
			let nivelOferta = state.Niveles.find(
				(o) => o.nivelOfertaId === Number(nivelOfertaId)
			)
			if (!nivelOferta) {
				nivelOferta = state.Especialidades?.find((el) => {
					return el.nivelOfertaId === Number(nivelOfertaId)
				})
			}
			setSelectedNivelOferta(nivelOferta)
		}
	}
	const goTo = (nivelOferta) => {
		history.push('/director/censo-final/' + nivelOferta)
	}

	const goBackOffer = async () => {
		setSelectedNivelOferta(null)
		history.push('/director/censo-final')
	}
	return (
		<AppLayout items={directorItems}>
			<div className="dashboard-wrapper">
				<Container>
					{!loading && (
						<Row>
							{selectedNivelOferta && (
								<Col xs={12}>
									<Register
										dataNivel={selectedNivelOferta}
										goBack={goBackOffer}
									/>
								</Col>
							)}
							{!selectedNivelOferta && (
								<Col xs={12}>
									<Row>
										<Col xs={12}>
											<HeaderPage
												title={`Censo final ${title}`}
												className={{
													separator: 'mb-2'
												}}
											/>
										</Col>
										<NivelesOfertas
											goTo={goTo}
											data={data}
											setTitle={() => {}}
										/>
									</Row>
								</Col>
							)}
						</Row>
					)}
					{loading && (
						<Row>
							<Loader />
						</Row>
					)}
				</Container>
			</div>
		</AppLayout>
	)
}

export default CensoFinal
