import React from 'react'
import AppLayout from 'Layout/AppLayout'
import directorItems from 'Constants/directorMenu'
import anioBreadCrumb from 'Constants/anioBreadCrumb'
import { Container, Row, Col } from 'reactstrap'
import Breadcrumb from 'Containers/navs/CustomBreadcrumb'
import Anio from './Anio'
import Ofertas from './Ofertas'
import { useTranslation } from 'react-i18next'

const Main = (props) => {
  const { t } = useTranslation()

  anioBreadCrumb.map((item, idx) => {
    item.active = props.active === idx
    return item
  })
  const { hasAddAccess, hasEditAccess, hasDeleteAccess } = props
  return (
    <AppLayout items={directorItems}>
      <div className='dashboard-wrapper'>
        <Container>
          <Row>
            <Col xs={12}>
              <Col xs={12}>
                <Breadcrumb
                  header={t('configuracion>anio_educativo>configurador_anio_educativo', 'Configurador de año educativo')}
                  data={anioBreadCrumb}
                />
                <br />
                {
                  {
                    0: <Anio {...props} hasAddAccess={hasAddAccess} hasEditAccess={hasEditAccess} hasDeleteAccess={hasDeleteAccess} />,
                    1: <Ofertas {...props} />
                  }[props.active]
                }
              </Col>
            </Col>
          </Row>
        </Container>
      </div>
    </AppLayout>
  )
}

export default Main
