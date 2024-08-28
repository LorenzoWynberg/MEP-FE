import React, { useState, useEffect, useCallback } from 'react'
import 'react-tagsinput/react-tagsinput.css'
import { makeStyles } from '@material-ui/core/styles'
import SelectItem from './SelectItem'

import HeaderTab from 'Components/Tab/Header'
import ContentTab from 'Components/Tab/Content'
import {
  Row,
  Col,
  FormGroup,
  Label,
  Modal,
  CustomInput,
  Container,
  ModalHeader,
  ModalBody,
  Button,
  Form,
  Card
} from 'reactstrap'
import styled from 'styled-components'
import HighlightOffIcon from '@material-ui/icons/HighlightOff'
import { useTranslation } from 'react-i18next'
import CondicionDiscapacidad from './CondicionDiscapacidad'
import OtraCondicion from './OtraCondicion'
import axios from 'axios'
import { envVariables } from '../../../../../../constants/enviroment'

const useStyles = makeStyles((theme) => ({
  inputTags: {
    minHeight: '8rem',
    border: '1px solid #eaeaea',
    padding: '0.35rem',
    color: 'white'
  },
  input: {
    display: 'none'
  }
}))

const ApoyoEducativo = (props) => {
  const { t } = useTranslation()

  const { handleSubmit } = props
  const classes = useStyles()
  const [editable, setEditable] = useState(true)
  const [discapacidades, setDiscapacidades] = useState([])
  const [condiciones, setCondiciones] = useState([])
  const [openOptions, setOpenOptions] = useState({ open: false, type: null })
  const [modalOptions, setModalOptions] = useState([])
  const [activeTab, setActiveTab] = useState(0)
  const [discapacidadesToDelete, setDiscapacidadesToDelete] = useState([])
  const [condicionesToDelete, setCondicionesToDelete] = useState([])
  const [discapacidadesToUpload, setDiscapacidadesToUpload] = useState([])
  const [condicionesToUpload, setCondicionesToUpload] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const _discapacidades = []
    const _discapacidadesIdentidad = props.discapacidadesIdentidad.map(
      (discapacidad) => discapacidad.elementosCatalogosId
    )
    props.discapacidades.forEach((discapacidad) => {
      if (_discapacidadesIdentidad.includes(discapacidad.id)) {
        _discapacidades.push(discapacidad)
      }
    })
    setDiscapacidades(_discapacidades)
  }, [props.discapacidadesIdentidad, editable])

  useEffect(() => {
    const _condiciones = []
    const _condicionesIdentidad = props.condicionesIdentidad.map(
      (condicion) => condicion.elementosCatalogosId
    )
    props.condiciones.forEach((condicion) => {
      if (_condicionesIdentidad.includes(condicion.id)) {
        _condiciones.push(condicion)
      }
    })

    setCondiciones(_condiciones)
  }, [props.condicionesIdentidad, editable])

  const handleOpenOptions = (options, name) => {
    // if (!editable) return
    let _options = []
    if (name === 'discapacidades') {
      const mappedDiscapacidades = discapacidades.map((item) => item.id)
      _options = options.map((discapacidad) => {
        if (mappedDiscapacidades.includes(discapacidad.id)) {
          return { ...discapacidad, checked: true }
        } else {
          return { ...discapacidad, checked: false }
        }
      })
    } else {
      const mappedCondiciones = condiciones.map((item) => item.id)
      _options = options.map((condicion) => {
        if (mappedCondiciones.includes(condicion.id)) {
          return { ...condicion, checked: true }
        } else {
          return { ...condicion, checked: false }
        }
      })
    }
    setModalOptions(_options)
    setOpenOptions({ open: true, type: name })
  }

  const toggleModal = async (saveData = false) => {
    let options = []
    console.log('props.discapacidades openOptions', openOptions)
    console.log('props.discapacidades modalOptions', modalOptions)
    console.log('props.discapacidades modalOptions', saveData)
    if (saveData) {
      if (openOptions.type === 'discapacidades') {
        options = []
        modalOptions.forEach((discapacidad) => {
          if (discapacidad.checked) options.push(discapacidad)
        })


        setDiscapacidades(options)
        console.log('props.discapacidades options', options)

        axios.post(`${envVariables.BACKEND_URL}/api/ExpedienteEstudiante/DiscapacidadesPorUsuario/CreateMultiple/${props.identidadId}`, options.map(d => {
          return {
            id: 0,
            elementosCatalogoId: d.id,
            identidadesId: props.identidadId,
            estado: true
          }
        })).then(r => {
          window.location.reload()

        })

      } else {
        options = []
        modalOptions.forEach((condicion) => {
          if (condicion.checked) options.push(condicion)
        })
        setCondiciones(options)
      }
    }
    setOpenOptions({ open: false, type: null })
  }

  const handleChangeItem = (item) => {
    const newItems = modalOptions.map((element) => {
      if (element.id === item.id) { return { ...element, checked: !element.checked } }
      return element
    })
    setModalOptions(newItems)
  }



  const sentData = async () => {
    setEditable(false)
    setLoading(true)
    const discapacidadesData = discapacidades.map((discapacidad) => {
      return {
        id: 0,
        elementosCatalogoId: discapacidad.id,
        identidadesId: props.identidadId,
        estado: true
      }
    })
    const condicionesData = condiciones.map((condicion) => {
      return {
        id: 0,
        elementosCatalogoId: condicion.id,
        identidadesId: props.identidadId,
        estado: true
      }
    })

    console.log('sentData discapacidades', discapacidades)
    console.log('sentData props', props)
    console.log('sentData data', {
      discapacidadesData,
      condicionesData,
      discapacidadesToUpload,
      condicionesToUpload,
      discapacidadesToDelete,
      condicionesToDelete,
    })

    const response = await props.saveDiscapacidades(
      discapacidadesData,
      condicionesData,
      discapacidadesToUpload,
      condicionesToUpload,
      discapacidadesToDelete,
      condicionesToDelete,
      props.identidadId
    )

    console.log(
      'sentData response', response
    )
    if (!response.error) {
      setDiscapacidadesToUpload([])
      setCondicionesToUpload([])
      setCondicionesToDelete([])
      setDiscapacidadesToDelete([])
      // window.location.reload()

      props.showsnackBar('success', 'Contenido enviado con éxito')
    } else {
      props.showsnackBar('error', response.message)
    }
    setEditable(false)
    setLoading(false)
  }
  const optionsTab = [
    { title: 'Condicion De Discapacidad' },
    { title: 'Otras Condiciones' }
  ]
  return (
    <Card style={{ paddingLeft: 36, paddingRight: 36, }}>
      <Row>
        <HeaderTab options={optionsTab} activeTab={activeTab} setActiveTab={setActiveTab} />
        <ContentTab activeTab={activeTab} numberId={activeTab}>

          {activeTab === 0 && <CondicionDiscapacidad discapacidadesSelected={discapacidades} discapacidadesIdentidad={props.discapacidadesIdentidad} disabled={props.disabled} sentData={sentData} handleSubmit={handleSubmit} showsnackBar={props.showsnackBar} setEditable={setEditable} authHandler={props.authHandler} classes={classes} handleOpenOptions={handleOpenOptions} setOpenOptions={setOpenOptions} discapacidades={props.discapacidades} apoyos={props.apoyos} editable={editable} loading={loading} />}
          {activeTab === 1 && <OtraCondicion disabled={props.disabled} sentData={sentData} handleSubmit={handleSubmit} showsnackBar={props.showsnackBar} setEditable={setEditable} authHandler={props.authHandler} classes={classes} condiciones={condiciones} handleOpenOptions={handleOpenOptions} editable={editable} loading={loading} />}
        </ContentTab>


      </Row>
      <Modal isOpen={openOptions.open} size='lg'>
        <ModalHeader>{openOptions.type === 'discapacidades' ? t('estudiantes>expediente>apoyos_edu>modal>tipos', 'Tipos de discapacidades') : t('estudiantes>expediente>apoyos_edu>modal>otro', 'Otros tipos de condiciones')}</ModalHeader>
        <ModalBody>
          <Container className='modal-detalle-subsidio'>
            <Row>
              {console.log('modalOptions', modalOptions)}
              {console.log('modalOptions props.discapacidadesIdentidad', props.discapacidadesIdentidad)}
              {console.log('modalOptions props.discapacidadesIdentidad', modalOptions.filter(d =>
                !props.discapacidadesIdentidad?.some(di => di.id == d.id)))}
              <Col xs={12}>
                {modalOptions.filter(d =>
                  !props.discapacidadesIdentidad?.some(di => di.id == d.id)
                ).map((item) => {
                  console.log('the item', item)
                  return (
                    <Row>
                      <Col xs={3} className='modal-detalle-subsidio-col'>
                        <div>
                          <CustomInput
                            type='checkbox'
                            label={item.nombre}
                            inline
                            onClick={() => handleChangeItem(item)}
                            checked={item.checked}
                          />
                        </div>
                      </Col>
                      <Col xs={9} className='modal-detalle-subsidio-col'>
                        <div>
                          <p>
                            {item.descripcion
                              ? item.descripcion
                              : item.detalle ? item.detalle : 'Elemento sin detalle actualmente'}
                          </p>
                        </div>
                      </Col>
                    </Row>
                  )
                })}
              </Col>
            </Row>
            <Row>
              <CenteredRow xs='12'>
                <Button
                  onClick={() => {
                    toggleModal()
                  }}
                  color='primary'
                  outline
                >
                  {t('general>cancelaaaar', 'Cancaaelar')}
                </Button>
                <Button
                  color='primary'
                  onClick={() => {
                    toggleModal(true)
                  }}
                >
                  {t('general>guardar', 'Guaraadar')}
                </Button>

              </CenteredRow>
            </Row>

          </Container>
        </ModalBody>
      </Modal>

    </Card>
  )
}


const CenteredRow = styled(Col)`
        display: flex;
        justify-content: center;
        align-items: center;
        `

export default ApoyoEducativo
