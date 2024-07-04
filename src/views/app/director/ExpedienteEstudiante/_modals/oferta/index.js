import React, { useEffect, useState } from 'react'
import { Modal, ModalHeader, ModalBody, Row, Col, Container } from 'reactstrap'

import Typography from '@material-ui/core/Typography'

import axios from 'axios'
import { envVariables } from 'Constants/enviroment'
import { GetResponseByInstitutionAndFormName } from '../../../../../../redux/formularioCentroResponse/actions'
import { useTranslation } from 'react-i18next'

const CentroEducativo = (props) => {
  const { t } = useTranslation()

  const [centerWithData, setCenterWithData] = useState({
    institucionalidad: {},
    direccion: {}
  })
  const [institutionImage, setInstitutionImage] = useState('')
  const { open, centro, toggleModal } = props
  const { titulo } = centro

  useEffect(() => {
    const loadData = async () => {
      const response = await axios.get(
        `${envVariables.BACKEND_URL}/api/ExpedienteCentroEducativo/Institucion/GetBasicInfo/${centro.codigoInstitucion}`
      )
      const responseContacto = await GetResponseByInstitutionAndFormName(
        response.data.institucionalidad.id,
        'datosExtensionesCentro'
      )
      const responseImage = await GetResponseByInstitutionAndFormName(
        response.data.institucionalidad.id,
        'perfildelcentro'
      )
      setInstitutionImage(
        responseImage.solucion
          ? JSON.parse(responseImage.solucion)[
            'd3b5c6f3-65f8-d7e4-9f1c-79614c45f686_c4f172cf-8f80-999e-c5e7-a95cfbdc60b1_col'
          ]?.files[0]?.url
          : ''
      )
      let responseContacto2 = await GetResponseByInstitutionAndFormName(
        response.data.institucionalidad.id,
        'datosContactoDeCentro'
      )
      responseContacto2 = responseContacto2.solucion
        ? JSON.parse(responseContacto2.solucion)
        : {}
      const responseDirection = await GetResponseByInstitutionAndFormName(
        response.data.institucionalidad.id,
        'ubicacionGeografica'
      )
      const responseDirectionParsed = responseDirection.solucion
        ? JSON.parse(responseDirection.solucion)
        : {}
      const province = await axios.get(
        `${envVariables.BACKEND_URL}/api/Provincia/GetById/${responseDirectionParsed['75bdf8ac-c36e-e47e-a007-37cdadbf954b']}`
      )
      const canton = await axios.get(
        `${envVariables.BACKEND_URL}/api/Canton/GetById/${responseDirectionParsed['cd492ff2-eebd-3976-163e-5b88bc3684a0']}`
      )
      const distrito = await axios.get(
        `${envVariables.BACKEND_URL}/api/Distrito/GetById/${responseDirectionParsed['66f130cc-0656-ff48-8710-708f230a9f9b']}`
      )
      const poblado = await axios.get(
        `${envVariables.BACKEND_URL}/api/Poblado/GetById/${responseDirectionParsed['9905c516-75b5-6c94-4703-507b2dfc00d0']}`
      )

      setCenterWithData({
        ...response.data,
        contacto: responseContacto
          ? {
              ...JSON.parse(responseContacto.solucion),
              correo:
                responseContacto2[
                  '34bf936b-846b-fc16-2274-770832549f1f_398f5e08-429f-9bee-3c80-dd15d2b5065d_col'
                ]
            }
          : {},
        direccion: responseDirection
          ? {
              ...responseDirectionParsed,
              province: province.data.nombre,
              canton: canton.data.nombre,
              distrito: distrito.data.nombre,
              poblado: poblado.data.nombre
            }
          : {}
      })

      return () => {
        setCenterWithData({ institucionalidad: {}, direccion: {} })
        setInstitutionImage('')
      }
    }

    loadData()
  }, [centro])

  return (
    <div>
      <Modal isOpen={open} toggle={toggleModal} size='lg'>
        <ModalHeader toggle={toggleModal}>
          {t('estudiantes>expediente>oferta_edu>historial_ce>modal>titulo', 'Detalle de Centro educativo')}
        </ModalHeader>
        <ModalBody>
          <Container className='modal-detalle-centro'>
            <Row>
              <Col xs={4}>
                <div
                  className='modal-detalle-centro-imagen'
                  style={{
                    backgroundImage: `url(${
                      institutionImage || '/assets/img/backgrounds/school.png'
                    })`
                  }}
                />
              </Col>
              <Col xs={8}>
                <Row>
                  <Col xs={6} className='modal-detalle-centro-col'>
                    <h4>{t('estudiantes>expediente>oferta_edu>historial_ce>modal>nombre', 'Nombre')}</h4>
                    <p>
                      <Typography variant='body1' noWrap>
                        {centerWithData.institucionalidad.nombre}
                      </Typography>
                    </p>
                    <h4>{t('estudiantes>expediente>oferta_edu>historial_ce>modal>cod_presu', 'Código presupuestario')}</h4>
                    <p>
                      {centerWithData.institucionalidad.codigoPresupuestario}
                    </p>
                    <h4>{t('estudiantes>expediente>oferta_edu>historial_ce>modal>categoria', 'Categoría')}</h4>
                    <p>Centro Privado</p>
                    <h4>{t('estudiantes>expediente>oferta_edu>historial_ce>modal>telefono', 'Teléfono')}</h4>
                    <p>
                      {centerWithData.contacto
                        ? centerWithData.contacto[
                          'f26f66d0-936a-b6f4-c161-4cd9a4b84339_89e0ec4e-1a1b-def9-311d-5136ff311910_col'
                        ]
                        : 'SIN ASIGNAR'}
                    </p>
                    <h4>{t('estudiantes>expediente>oferta_edu>historial_ce>modal>correo', 'Correo')}</h4>
                    <p>{centerWithData.contacto?.correo}</p>
                  </Col>
                  <Col xs={6} className='modal-detalle-centro-col'>
                    <h4>{t('estudiantes>expediente>oferta_edu>historial_ce>modal>provincia', 'Provincia')}</h4>
                    <p>{centerWithData.direccion.province}</p>
                    <h4>{t('estudiantes>expediente>oferta_edu>historial_ce>modal>canton', 'Cantón')}</h4>
                    <p>{centerWithData.direccion.canton}</p>
                    <h4>{t('estudiantes>expediente>oferta_edu>historial_ce>modal>distrito', 'Distrito')}</h4>
                    <p>{centerWithData.direccion.distrito}</p>
                    <h4>{t('estudiantes>expediente>oferta_edu>historial_ce>modal>poblado', 'Poblado')}</h4>
                    <p>{centerWithData.direccion.poblado}</p>
                    <h4>{t('estudiantes>expediente>oferta_edu>historial_ce>modal>distrito', 'Dirección')}</h4>
                    <p>
                      <Typography variant='body1' noWrap>
                        {
                          centerWithData.direccion[
                            '012e6d31-8890-e6be-3234-cd4bdd1a10e9'
                          ]
                        }
                      </Typography>
                    </p>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Container>
        </ModalBody>
      </Modal>
    </div>
  )
}

export default CentroEducativo
