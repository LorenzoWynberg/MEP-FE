import React from 'react'
import AssignmentIcon from '@material-ui/icons/Assignment'
import NavigationCard from '../ExpedienteEstudiante/_partials/NavigationCard'
import { Colxx } from 'Components/common/CustomBootstrap'
import { Container, Row } from 'reactstrap'
import { injectIntl } from 'react-intl'
import Bookmark from 'Assets/icons/Bookmark'
import Normativa from 'Assets/icons/Normativa'
import GroupWorkIcon from '@material-ui/icons/GroupWork'
import AccountCircle from '@material-ui/icons/AccountCircle'
import ContactMail from '@material-ui/icons/ContactMail'
import Group from '@material-ui/icons/Group'
import Map from '@material-ui/icons/Map'
import { useTranslation } from 'react-i18next'

const ROUTES = [
  {
    label: 'home',
    to: '/director/expediente-direcciones/inicio',
    active: false
  },
  {
    label: 'supervision_circ>expediente>nav>info_gen',
    to: '/director/expediente-direcciones/general',
    active: false
  },
  {
    label: 'supervision_circ>expediente>nav>director',
    to: '/director/expediente-direcciones/director',
    active: false
  },
  {
    label: 'supervision_circ>expediente>nav>contacto',
    to: '/director/expediente-direcciones/contacto',
    active: false
  },
  {
    label: 'supervision_circ>expediente>nav>ubicacion',
    to: '/director/expediente-direcciones/ubicacion',
    active: false
  },
  {
    label: 'supervision_circ>expediente>nav>recurso_humano',
    to: '/director/expediente-direcciones/recursos-humanos',
    active: false
  },
  {
    label: 'supervision_circ>expediente>nav>supervisiones_circ',
    to: '/director/expediente-direcciones/supervisiones-circuitales',
    active: false
  },
  {
    label: 'supervision_circ>expediente>nav>centros_educativos',
    to: '/director/expediente-direcciones/centros',
    active: false
  }
]

const Inicio = (props) => {
  const { t } = useTranslation()
  const { messages } = props.intl
  const getIcon = (idx) => {
    switch (idx) {
      case 1:
        return <AssignmentIcon style={{ fontSize: 50 }} />
      case 2:
        return <AccountCircle style={{ fontSize: 50 }} />
      case 3:
        return <ContactMail style={{ fontSize: 50 }} />
      case 4:
        return <Bookmark style={{ fontSize: 50 }} />
      case 5:
        return <Group style={{ fontSize: 50 }} />
      case 6:
        return <Map style={{ fontSize: 50 }} />
      case 7:
        return <GroupWorkIcon style={{ fontSize: 50 }} />
      case 8:
        return <Normativa />
    }
  }
  return (
    <Container>
      <Row>
        <Colxx xxs='12' className='px-5'>
          <Row>
            {ROUTES.map((r, i) => {
              if (r.label === 'home') return
              const title = t(r.label, `${r.label} not found`)
              return (
                <NavigationCard
                  icon=''
                  title={title}
                  href={r.to}
                  key={i}
                >
                  {getIcon(i)}
                </NavigationCard>
              )
            })}
          </Row>
        </Colxx>
      </Row>
    </Container>
  )
}

export default injectIntl(Inicio)
