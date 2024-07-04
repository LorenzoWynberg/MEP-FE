import React, { useState, useEffect } from 'react'
import withRouter from 'react-router-dom/withRouter'
import MensajeEdit from './MensajeEdit'
import {
  Card, CardBody, Row, Col
} from 'reactstrap'
import ModalView from './ModalView'
import { getTemplatesComunicados, getEtiquetasComunicados } from '../../../../redux/comunicados/actions'
import { useActions } from 'Hooks/useActions'
import { useSelector } from 'react-redux'
import { TAGS, TEMPLATES } from '../util'
import useNotification from 'Hooks/useNotification'
import Circulares from '../_partials/Icons/Circulares'
import Boletines from '../_partials/Icons/Boletines'
import Oficios from '../_partials/Icons/Oficios'
import Resoluciones from '../_partials/Icons/Resoluciones'
import SinPlantilla from '../_partials/Icons/SinPlantilla'
import { useTranslation } from 'react-i18next'

interface IProps {
  openModal: boolean;
  data: any;
  itemSelected: any;
  setItemSelected: Function;
  snackBarShow: Function;
}

const Redactar = (props: IProps) => {
  const [redactar, setRedactar] = useState(true)
  const { t } = useTranslation()
  const [data, setData] = useState({
    entityList: [],
    totalCount: 0
  })
  const [openModalView, setOpenModalView] = useState(props.openModal)
  const [propsModalView, setPropsModalView] = useState({
    title: '',
    size: '',
    icon: ''
  })
  const [templates, setTemplates] = useState([])
  const [selectedTemplate, setSelectedTemplate] = useState(null)

  const comunicadoAction = useActions({ getTemplatesComunicados, getEtiquetasComunicados })
  const [snackbarContent, setSnacbarContent] = useState({
    msg: 'welcome',
    variant: 'info'
  })
  const [snackBar, handleSnackBarClick] = useNotification()

  const [tags, setTags] = useState([])

  const state = useSelector((store) => {
    return {
      ...store.comunicados
    }
  })

  useEffect(() => {
    if (props.data !== undefined) {
      setData(props.data)
      props.setItemSelected({})
    }

    const loadTemplates = async () => {
      await comunicadoAction.getTemplatesComunicados()
      setTemplates(state.templates || [])
      if (state.templates.length == 0) {
        setTemplates(TEMPLATES.map((el) => ({
          ...el,
          nombre: t(`comunicados>menu>${el?.nombre?.toLowerCase()}`, el?.nombre)
        })))
      }

      await comunicadoAction.getEtiquetasComunicados(36)
      setTags(state.etiquetas || TAGS)
    }

    loadTemplates()
  }, [t])

  return (
    <>
      {snackBar(snackbarContent.variant, snackbarContent.msg)}

      {selectedTemplate && (
        <MensajeEdit
          template={selectedTemplate}
          data={props.itemSelected}
          snackBarShow={props.snackBarShow}
          onSendMensaje={() => { }}
          onSendMensajeBorrador={() => { }}
          minHeight={300}
          createElement
          setSelectedTemplate={setSelectedTemplate}
          redactar={redactar}
        />
      )}

      {openModalView && (
        <ModalView
          open={openModalView}
          {...propsModalView}
          onClose={() => {
            setOpenModalView(false)
          }}
          action={() => {
            if (!selectedTemplate) {
              setSelectedTemplate({
                icon: '',
                template: t('comunicados>redactar>sin_plantilla', 'Sin plantilla'),
                id: ''
              })
            }
            setOpenModalView(false)
          }}
          title={t('comunicados>redactar>tipo_plantilla', 'Tipo de plantilla')}
          textAceptar={t('comunicados>redactar>continuar', 'Continuar')}
          textCancelar={t('comunicados>redactar>cancelar', 'Cancelar')}
        >
          <p className='pt-4'>{t('comunicados>redactar>redactar_como', 'Redactar como')}: </p>
          <Row>
            {templates?.map((item) => {
              return (
                <Col md={4} style={{ marginTop: 10 }}>
                  <a
                    style={{ cursor: 'pointer' }}
                    onClick={(e) => {
                      
                      setSelectedTemplate(item)
                    }}
                  >
                    {item.key === 'sin_plantilla'
                      ? <Card
                        style={{
                          backgroundColor:
                            selectedTemplate?.id === item.id
                              ? 'rgb(232 232 232)'
                              : 'white',
                          color:
                            selectedTemplate?.id === item.id ? 'black' : 'black'
                        }}
                      >
                        <CardBody className='text-center'>
                          <SinPlantilla />
                          <p className='pt-4'>{item.nombre}</p>
                        </CardBody>
                      </Card>
                      : item.key === 'circulares'
                        ? <Card
                          style={{
                            backgroundColor:
                              selectedTemplate?.id === item.id
                                ? 'rgb(232 232 232)'
                                : 'white',
                            color:
                              selectedTemplate?.id === item.id ? 'black' : 'black'
                          }}
                        >
                          <CardBody className='text-center'>
                            <Circulares />
                            <p className='pt-4 nombreIcon'>{item.nombre}</p>
                          </CardBody>
                        </Card>
                        : item.key === 'oficios'
                          ? <Card
                            style={{
                              backgroundColor:
                                selectedTemplate?.id === item.id
                                  ? 'rgb(232 232 232)'
                                  : 'white',
                              color:
                                selectedTemplate?.id === item.id ? 'black' : 'black'
                            }}
                          >
                            <CardBody className='text-center'>
                              <Oficios />
                              <p className='pt-4'>{item.nombre}</p>
                            </CardBody>
                          </Card>
                          : item.key === 'resoluciones'
                            ? <Card
                              style={{
                                backgroundColor:
                                  selectedTemplate?.id === item.id
                                    ? 'rgb(232 232 232)'
                                    : 'white',
                                color:
                                  selectedTemplate?.id === item.id ? 'black' : 'black'
                              }}
                            >
                              <CardBody className='text-center'>
                                <Resoluciones />
                                <p className='pt-4'>{item.nombre}</p>
                              </CardBody>
                            </Card>
                            : <Card
                              style={{
                                backgroundColor:
                                  selectedTemplate?.id === item.id
                                    ? 'rgb(232 232 232)'
                                    : 'white',
                                color:
                                  selectedTemplate?.id === item.id ? 'black' : 'black'
                              }}
                            >
                              <CardBody className='text-center'>
                                <Boletines />
                                <p className='pt-4'>{item.nombre}</p>
                              </CardBody>
                            </Card>}
                  </a>
                </Col>
              )
            })}
          </Row>
        </ModalView>
      )}
    </>
  )
}

Redactar.defaultProps = {
  openModal: false
}

export default withRouter(Redactar)
