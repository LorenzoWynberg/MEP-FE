import React from 'react'
import { Colxx } from 'Components/common/CustomBootstrap'
import NavigationCard from './_partials/NavigationCard'
import AssignmentIcon from '@material-ui/icons/Assignment'
import AccountCircle from '@material-ui/icons/AccountCircle'
import House from '@material-ui/icons/House'
import Star from '@material-ui/icons/Star'
import SquareFoot from '@material-ui/icons/SquareFoot'
import Bookmark from '@material-ui/icons/Bookmark'
import Email from '@material-ui/icons/Email'
import LocalHospital from '@material-ui/icons/LocalHospital'

import { Row, Container } from 'reactstrap'
const EXPEDIENTE_ESTUDIANTE_BASE_PATH = '/view/expediente-estudiante'
const Navegacion = (props) => {
  return (
    <Container>
      <Row>
        <Colxx xxs='12' className='px-5'>
          <Row>
            <NavigationCard
              icon=''
              title='Información general'
              href={`${EXPEDIENTE_ESTUDIANTE_BASE_PATH}/general`}
            >
              <AssignmentIcon style={{ fontSize: 50 }} />
            </NavigationCard>
            <NavigationCard
              icon=''
              title='Contacto'
              href={`${EXPEDIENTE_ESTUDIANTE_BASE_PATH}/contacto`}
            >
              <AccountCircle style={{ fontSize: 50 }} />
            </NavigationCard>
            <NavigationCard
              icon=''
              title='Hogar'
              href={`${EXPEDIENTE_ESTUDIANTE_BASE_PATH}/hogar`}
            >
              <House style={{ fontSize: 50 }} />
            </NavigationCard>
            <NavigationCard
              icon=''
              title='Beneficios'
              href={`${EXPEDIENTE_ESTUDIANTE_BASE_PATH}/beneficios`}
            >
              <Star style={{ fontSize: 50 }} />
            </NavigationCard>
            <NavigationCard
              icon=''
              title='Apoyo Educativos'
              href={
                                `${EXPEDIENTE_ESTUDIANTE_BASE_PATH}/apoyos-educativos`
                            }
            >
              <SquareFoot style={{ fontSize: 50 }} />
            </NavigationCard>
            <NavigationCard
              icon=''
              title='Área Curricular'
              href={
                                `${EXPEDIENTE_ESTUDIANTE_BASE_PATH}/area-curricular`
                            }
            >
              <Bookmark style={{ fontSize: 50 }} />
            </NavigationCard>
            <NavigationCard
              icon=''
              title='Salud'
              href={`${EXPEDIENTE_ESTUDIANTE_BASE_PATH}/salud`}
            >
              <LocalHospital style={{ fontSize: 50 }} />
            </NavigationCard>
            <NavigationCard
              icon=''
              title='Oferta Educativa'
              href={`${EXPEDIENTE_ESTUDIANTE_BASE_PATH}/oferta`}
            >
              <img
                style={{ width: 50 }}
                alt='Oferta Educativa'
                src='/assets/img/construction-white.svg'
              />
            </NavigationCard>
            <NavigationCard
              icon=''
              title='SINIRUBE'
              href={`${EXPEDIENTE_ESTUDIANTE_BASE_PATH}/sinirube`}
            >
              <img
                style={{ width: 50 }}
                alt='ICON SINIRUBE'
                src='/assets/img/Icono-SINIRUBE.svg'
              />
            </NavigationCard>
            <NavigationCard
              icon=''
              title='Cuenta de Correo'
              href={`${EXPEDIENTE_ESTUDIANTE_BASE_PATH}/cuenta-correo`}
            >
              <Email style={{ fontSize: 50 }} />
            </NavigationCard>
          </Row>
        </Colxx>
      </Row>
    </Container>
  )
}

export default React.memo(Navegacion)
