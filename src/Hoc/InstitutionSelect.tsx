import Typography from '@material-ui/core/Typography'
import directorItems from 'Constants/directorMenu'
import adminItems from 'Constants/adminMenu'

import AppLayout from 'Layout/AppLayout'
import React from 'react'
import { Helmet } from 'react-helmet'
import { useSelector } from 'react-redux'
import { Container, Row } from 'reactstrap'

import { useTranslation } from 'react-i18next'

const withInstitution = (Component) => {
	
  return (props) => {
    const { t } = useTranslation()
    const state = useSelector((store: any) => {
      return {
        institution: store.authUser.currentInstitution
      }
    })

    if (state.institution?.id === -1) {
      return (
        <AppLayout items={directorItems}>
          <Helmet>
            <title>Registro Estudiante</title>
          </Helmet>
          <div className='dashboard-wrapper'>
            <Container>
              <Row>
                <Typography variant='h5' className='mb-3'>
                  {t("estudiantes>traslados>gestion_traslados>seleccionar", "Debe seleccionar un centro educativo en el buscador de centros educativos.")}
                </Typography>
              </Row>
            </Container>
          </div>
        </AppLayout>
      )
    }

    return (
      <>
        <Component {...props} />
      </>
    )
  }
}

export default withInstitution
