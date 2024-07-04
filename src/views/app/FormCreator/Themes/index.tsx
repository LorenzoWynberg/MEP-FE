import React, { useEffect } from 'react'
import { Container, Row, Col } from 'reactstrap'
import colors from 'Assets/js/colors'
import { getThemes, deleteTheme } from '../../../../redux/Temas/actions'
import { useSelector } from 'react-redux'
import { useActions } from 'Hooks/useActions'
import { withRouter } from 'react-router-dom'
import DeleteIcon from '@material-ui/icons/Delete'
import swal from 'sweetalert'
import BackIcon from '@material-ui/icons/ArrowBackIos'
import styled from 'styled-components'
import AppLayout from 'Layout/AppLayout'
import directorItems from 'Constants/directorMenu'
import { useTranslation } from 'react-i18next'
import creadorDeFormulariosItems from 'Constants/creadorDeFormulariosItems'

const Themes = (props) => {
  const actions = useActions({ getThemes, deleteTheme })
  const state = useSelector((store) => store.temas)

  const { t } = useTranslation()
  const newMenus = creadorDeFormulariosItems.map((el) => ({
    ...el,
    label: t(`formularios>navigation>${el?.id}`, el?.label)
  }))
  useEffect(() => {
    actions.getThemes()
  }, [])

  return (
    <AppLayout items={newMenus}>
      <Container>
        <Row>
          <button
            onClick={() => {
              console.clear()
              console.log('click...')

              props.history.push('/forms')
            }}
            style={{
              padding: '0',
              margin: '0',
              background: 'unset',
              border: 'none'
            }}
          >
            <Back
              style={{ cursor: 'pointer' }}
              onClick={() => {
                props.history.push('/forms')
              }}
            >
              <BackIcon />
              <BackTitle>{t('general>regresar', 'Regresar')}</BackTitle>
            </Back>
          </button>
        </Row>
        <Row>
          <Col xs='12' md='3'>
            <div
              className='cursor-pointer'
              style={{
                width: '100%',
                backgroundColor: colors.primary,
                color: 'white',
                fontSize: 'xx-large',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '12rem',
                borderRadius: '15px'
              }}
              onClick={() => {
                props.history.push('/forms/themes/create')
              }}
            >
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}
              >
                <i className='iconsminds-photo' />
                <p>{t('formularios>crear_tema>nuevo_tema', 'Nuevo Tema')}</p>
              </div>
            </div>
          </Col>
          {state?.themes?.map((el) => {
            return (
              <Col xs='12' md='3'>
                <div
                  style={{
                    width: '100%',
                    color: el.textColor
                      ? el.textColor
                      : 'white',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'stretch',
                    height: '12rem',
                    overflow: 'hidden',
                    flexDirection: 'column',
                    boxShadow:
                      '4px 0 5px rgba(0, 0, 0, 0.04)',
                    marginBottom: '20px',
                    borderRadius: '15px'
                  }}
                >
                  <div
                    style={{
                      width: '100%',
                      background: el.imagenFondo
                        ? `url(${el.imagenFondo}) no-repeat center top`
                        : "url('/assets/img/errorBackground.jpg') no-repeat center top",
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'flex-end',
                      backgroundSize: 'cover',
                      backgroundRepeat: 'no-repeat',
                      padding: '20px'
                    }}
                    onClick={() => {
                      props.history.push(
                        `/forms/themes/edit/${el.temaId}`
                      )
                    }}
                  >
                    <p
                      style={{
                        fontSize: '20px',
                        fontWeight: 'bold'
                      }}
                    >
                      Pregunta
                    </p>
                    <p
                      style={{
                        fontSize: '15px',
                        fontWeight: '100'
                      }}
                    >
                      {t('formularios>crear_tema>respuesta', 'Respuesta')}
                    </p>
                    <div
                      style={{
                        width: '45%',
                        height: '32px',
                        backgroundColor: el.color,
                        borderRadius: '7px'
                      }}
                    />
                  </div>
                  <div
                    style={{
                      backgroundColor: 'white',
                      padding: '2px',
                      color: 'gray',
                      height: '4.35rem'
                    }}
                  >
                    <p>
                      {el.nombre}
                      <DeleteIcon
                        id='eliminar'
                        className='SectionIcons'
                        style={{
                          color: colors.primary,
                          float: 'right',
                          right: 0
                        }}
                        onClick={() => {
                          swal({
                            title: t('formularios>crear_tema>eliminar_tema', '¿Está seguro de eliminar el tema?'),
                            icon: 'warning',
                            buttons: {
                              ok: {
                                text: t('general>aceptar', 'Aceptar'),
                                value: true
                              },
                              cancel: t('general>cancelar', 'Cancelar')
                            }
                          }).then((result) => {
                            if (result) {
                              actions.deleteTheme(
                                el.temaId
                              )
                            }
                          })
                        }}
                      />
                    </p>
                  </div>
                </div>
              </Col>
            )
          })}
        </Row>
      </Container>
    </AppLayout>
  )
}
const Back = styled.div`
	display: flex;
	align-items: center;
	cursor: pointer;
	padding: 0 5px;
	margin-bottom: 20px;
`

const BackTitle = styled.span`
	color: #000;
	font-size: 14px;
	font-size: 16px;
`
export default withRouter(Themes)
