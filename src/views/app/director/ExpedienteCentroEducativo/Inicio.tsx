import React, { useEffect, useState } from 'react'
import centroBreadcrumb from 'Constants/centroBreadcrumb'
import axios from 'axios'
import AssignmentIcon from '@material-ui/icons/Assignment'
import NavigationCard from '../ExpedienteEstudiante/_partials/NavigationCard'
import { Colxx } from 'Components/common/CustomBootstrap'
import { Container, Row } from 'reactstrap'
import StarIcon from '@material-ui/icons/Star'
import Bookmark from 'Assets/icons/Bookmark'
import SquareFoot from 'Assets/icons/SquareFoo'
import TwoPeople from 'Assets/icons/TwoPeople'
import Loader from 'Components/Loader'
import Horarios from 'Assets/icons/Horarios'
import Solidarity from 'Assets/icons/Solidarity'
import Computador from 'Assets/icons/Computador'
import Normativa from 'Assets/icons/Normativa'
import HouseIcon from '@material-ui/icons/House'
import GroupWorkIcon from '@material-ui/icons/GroupWork'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { envVariables } from 'Constants/enviroment'
import { MdFollowTheSigns } from 'react-icons/md'

const Inicio = props => {
	const { t } = useTranslation()
	const [aplicaSCE, setAplicaSCE] = useState(false)
	const [loading, setLoading] = useState(true)
	const idInstitucion = localStorage.getItem('idInstitucion')

	const state = useSelector((store: any) => {
		return {
			accessRole: store.authUser.currentRoleOrganizacion.accessRole,
			permisos: store.authUser.rolPermisos
		}
	})

	const tienePermisoSCE = state.permisos.find(
		permiso => permiso.codigoSeccion == 'registrosSCE'
	)

	const validarInstitucionSCE = async () => {
		try {
			const response = await axios.post(
				`${envVariables.BACKEND_URL}/api/ServicioComunal/VerificarInstitucionAplicaSCE?idInstitucion=${idInstitucion}`
			)
			setAplicaSCE(response.data)
		} catch (error) {
			console.error('API error:', error)
		}
	}

	const validarAcceso = async () => {
		await Promise.all([validarInstitucionSCE()])
		setLoading(false)
	}

	useEffect(() => {
		validarAcceso()
	}, [])

	const getIcon = idx => {
		switch (idx) {
			case 1:
				return <AssignmentIcon style={{ fontSize: 50 }} />
			case 2:
				return <SquareFoot style={{ fontSize: 50 }} />
			case 3:
				return <TwoPeople style={{ fontSize: 50 }} />
			case 4:
				return <Horarios />
			case 5:
				return <HouseIcon style={{ fontSize: 50 }} />
			case 6:
				return <StarIcon style={{ fontSize: 50 }} />
			case 7:
				return <Bookmark style={{ fontSize: 50 }} />
			case 8:
				return <GroupWorkIcon style={{ fontSize: 50 }} />
			case 9:
				return <Normativa />
			case 10:
				return <Solidarity style={{ fontSize: 50 }} />
			case 11:
				return <Computador style={{ fontSize: 50 }} />
			case 12:
				return <MdFollowTheSigns style={{ fontSize: 50 }} />
		}
	}

	return (
		<Container>
			<Row>
				{loading ? (
					<Loader />
				) : (
					<Colxx xxs="12" className="px-5">
						<Row>
							{centroBreadcrumb.map((r, i) => {
								if (r.active) return
								return (
									<NavigationCard
										icon=""
										title={t(r.label, `${r.label} not found`)}
										href={r.to}
										key={i}
									>
										{getIcon(i)}
									</NavigationCard>
								)
							})}
						</Row>
					</Colxx>
				)}
			</Row>
		</Container>
	)
}

export default Inicio
