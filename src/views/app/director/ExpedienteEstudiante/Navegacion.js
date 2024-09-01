import React from 'react'
import { Colxx } from 'Components/common/CustomBootstrap'
import NavigationCard from './_partials/NavigationCard'
import AssignmentIcon from '@material-ui/icons/Assignment'
import AccountCircle from '@material-ui/icons/AccountCircle'
import House from '@material-ui/icons/House'
import Star from '@material-ui/icons/Star'
import Solidarity from '../../../../assets/icons/Solidarity'
import SquareFoot from '@material-ui/icons/SquareFoot'
import BookIcon from '@mui/icons-material/Book'
import Bookmark from '@material-ui/icons/Bookmark'
import LocalHospital from '@material-ui/icons/LocalHospital'
import EmailIcon from '@mui/icons-material/Email'
import { Row, Container } from 'reactstrap'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'

const Navegacion = props => {
	const { t } = useTranslation()
	const { aplicaSCE } = props

	const state = useSelector(store => {
		return {
			accessRole: store.authUser.currentRoleOrganizacion.accessRole,
			permisos: store.authUser.rolPermisos
		}
	})
	const tienePermisoSCE = state.permisos.find(permiso => permiso.codigoSeccion == 'servicioComunalEstudiantilSCE')
	return (
		<Container>
			<Row className='mb-5'>
				<Colxx xxs='12' className='px-5'>
					<Row>
						<NavigationCard
							icon=''
							title={t('estudiantes>expediente>nav>info_general', 'Información general')}
							href='/director/expediente-estudiante/general'
						>
							<AssignmentIcon style={{ fontSize: 50 }} />
						</NavigationCard>
						<NavigationCard
							icon=''
							title={t('estudiantes>expediente>nav>contacto', 'Contacto')}
							href='/director/expediente-estudiante/contacto'
						>
							<AccountCircle style={{ fontSize: 50 }} />
						</NavigationCard>
						<NavigationCard
							icon=''
							title={t('estudiantes>expediente>nav>hogar', 'Hogar')}
							href='/director/expediente-estudiante/hogar'
						>
							<House style={{ fontSize: 50 }} />
						</NavigationCard>
						<NavigationCard
							icon={''}
							title={t('estudiantes>expediente>nav>beneficios', 'Beneficios')}
							href={'/director/expediente-estudiante/beneficios'}
						>
							<Star style={{ fontSize: 50 }} />
						</NavigationCard>
						<NavigationCard
							icon=''
							title={t('estudiantes>expediente>nav>apoyos_edu', 'Apoyo Educativos')}
							href='/director/expediente-estudiante/apoyos-educativos'
						>
							<SquareFoot style={{ fontSize: 50 }} />
						</NavigationCard>
						<NavigationCard
							icon=''
							title={t('estudiantes>expediente>nav>area_curric', 'Área Curricular')}
							href='/director/expediente-estudiante/area-curricular'
						>
							<Bookmark style={{ fontSize: 50 }} />
						</NavigationCard>
						<NavigationCard
							icon=''
							title={t('estudiantes>expediente>nav>salud', 'Salud')}
							href='/director/expediente-estudiante/salud'
						>
							<LocalHospital style={{ fontSize: 50 }} />
						</NavigationCard>
						<NavigationCard
							icon=''
							title={t('estudiantes>expediente>nav>oferta_edu', 'Oferta Educativa')}
							href='/director/expediente-estudiante/oferta'
						>
							<img
								style={{ width: 50 }}
								alt={t('estudiantes>expediente>nav>oferta_edu', 'Oferta Educativa')}
								src='/assets/img/construction-white.svg'
							/>
						</NavigationCard>

						{
							/*<NavigationCard
              icon={''}
              title={'SINIRUBE'}
              href={'/director/expediente-estudiante/sinirube'}
            >
              <img
                style={{ width: 50 }}
                alt="ICON SINIRUBE"
                src="/assets/img/Icono-SINIRUBE.svg"
              />
            </NavigationCard>*/
							<NavigationCard
								icon={''}
								title={'Cuentas de usuario'}
								href={'/director/expediente-estudiante/cuenta-usuario'}
							>
								<EmailIcon style={{ fontSize: 50, color: 'white' }} />
							</NavigationCard>
						}
						<NavigationCard
							icon=''
							title={t('estudiantes>expediente>nav>bitacora_expediente', 'Bitácoras')}
							href='/director/expediente-estudiante/BitacoraExpediente'
						>
							<BookIcon style={{ fontSize: 50 }} />
						</NavigationCard>
						{aplicaSCE && tienePermisoSCE && tienePermisoSCE?.leer == 1 ? (
							<NavigationCard
								icon={''}
								title={'Servicio comunal estudiantil'}
								href={'/director/expediente-estudiante/servicio-comunal'}
							>
								<Solidarity style={{ fontSize: 50, color: 'white' }} />
							</NavigationCard>
						) : null}
					</Row>
				</Colxx>
			</Row>
		</Container>
	)
}

export default Navegacion
