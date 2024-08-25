import React, { useState, useEffect } from 'react'
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
  const [editable, setEditable] = useState(false)
  const [discapacidades, setDiscapacidades] = useState([])
  const [condiciones, setCondiciones] = useState([])
  const [openOptions, setOpenOptions] = useState({ open: false, type: null })
  const [openFiles, setOpenFiles] = useState({ open: false, type: null })
  const [modalOptions, setModalOptions] = useState([])
  const [files, setFiles] = useState([])
  const [activeTab, setActiveTab] = useState(0)
  const [discapacidadesFiles, setDiscapacidadesFiles] = useState([])
  const [condicionesFiles, setCondicionesFiles] = useState([])
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

  useEffect(() => {
    setDiscapacidadesFiles(props.apoyos.recursosDiscapacidadesIdentidad)
  }, [props.apoyos.recursosDiscapacidadesIdentidad, editable])

  useEffect(() => {
    setCondicionesFiles(props.apoyos.recursosCondicionesIdentidad)
  }, [props.apoyos.recursosCondicionesIdentidad, editable])

  const handleOpenOptions = (options, name) => {
    if (!editable) return
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

  const toggleModal = (saveData = false) => {
    let options = []
    if (saveData) {
      if (openOptions.type === 'discapacidades') {
        options = []
        modalOptions.forEach((discapacidad) => {
          if (discapacidad.checked) options.push(discapacidad)
        })
        setDiscapacidades(options)
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

  const toggleModalFiles = () => {
    setOpenFiles({ open: false, type: null })
  }

  const handleChangeItem = (item) => {
    const newItems = modalOptions.map((element) => {
      if (element.id === item.id) { return { ...element, checked: !element.checked } }
      return element
    })
    setModalOptions(newItems)
  }

  const handleFileDiscapacidad = (e) => {
    if (!editable) return
    setDiscapacidadesToUpload([...discapacidadesToUpload, e.target.files[0]])
    setDiscapacidadesFiles([...discapacidadesFiles, e.target.files[0]])
  }

  const handleFileCondition = (e) => {
    if (!editable) return
    setCondicionesToUpload([...condicionesToUpload, e.target.files[0]])
    setCondicionesFiles([...condicionesFiles, e.target.files[0]])
  }

  const handleResourceDelete = async (item) => {
    let _options
    if (openFiles.type === 'discapacidad') {
      if (item.name) {
        _options = discapacidadesFiles.filter(
          (discapacidad) => discapacidad.name !== item.name
        )
      } else {
        _options = discapacidadesFiles.filter(
          (discapacidad) => discapacidad.id !== item.id
        )
        setDiscapacidadesToDelete([...discapacidadesToDelete, item])
      }
      setDiscapacidadesFiles(_options)
    } else {
      if (item.name) {
        _options = condicionesFiles.filter(
          (discapacidad) => discapacidad.name !== item.name
        )
      } else {
        _options = condicionesFiles.filter(
          (discapacidad) => discapacidad.id !== item.id
        )
        setCondicionesToDelete([...condicionesToDelete, item])
      }
      setCondicionesFiles(_options)
    }

    setFiles(_options)
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
    const response = await props.saveDiscapacidades(
      discapacidadesData,
      condicionesData,
      discapacidadesToUpload,
      condicionesToUpload,
      discapacidadesToDelete,
      condicionesToDelete,
      props.identidadId
    )
    if (!response.error) {
      setDiscapacidadesToUpload([])
      setCondicionesToUpload([])
      setCondicionesToDelete([])
      setDiscapacidadesToDelete([])
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

          {activeTab === 0 && <CondicionDiscapacidad disabled={props.disabled} discapacidadesFiles={discapacidadesFiles} sentData={sentData} handleSubmit={handleSubmit} showsnackBar={props.showsnackBar} setEditable={setEditable} authHandler={props.authHandler} classes={classes} handleFileDiscapacidad={handleFileDiscapacidad} handleOpenOptions={handleOpenOptions} setFiles={setFiles} setOpenFiles={setOpenFiles} setOpenOptions={setOpenOptions} discapacidades={props.discapacidades} apoyos={props.apoyos} editable={editable} loading={loading} />}
          {activeTab === 1 && <OtraCondicion disabled={props.disabled} sentData={sentData} handleSubmit={handleSubmit} showsnackBar={props.showsnackBar} setEditable={setEditable} authHandler={props.authHandler} handleFileDiscapacidad={handleFileDiscapacidad} classes={classes} setFiles={setFiles} setOpenFiles={setOpenFiles} handleFileCondition={handleFileCondition} condiciones={condiciones} condicionesFiles={condicionesFiles} handleOpenOptions={handleOpenOptions} editable={editable} loading={loading} />}
        </ContentTab>


      </Row>
      <Modal isOpen={openOptions.open} size='lg'>
        <ModalHeader>{openOptions.type === 'discapacidades' ? t('estudiantes>expediente>apoyos_edu>modal>tipos', 'Tipos de discapacidades') : t('estudiantes>expediente>apoyos_edu>modal>otro', 'Otros tipos de condiciones')}</ModalHeader>
        <ModalBody>
          <Container className='modal-detalle-subsidio'>
            <Row>
              <Col xs={12}>
                {modalOptions.map((item) => {
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
                  {t('general>cancelar', 'Cancelar')}
                </Button>
                <Button
                  color='primary'
                  onClick={() => {
                    toggleModal(true)
                  }}
                >
                  {t('general>guardar', 'Guardar')}
                </Button>

              </CenteredRow>
            </Row>

          </Container>
        </ModalBody>
      </Modal>
      <Modal isOpen={openFiles.open} size='lg'>
        <ModalHeader toggle={toggleModalFiles}>
          {openFiles.type == 'discapacidad' ? 'Detalle de la condición' : 'Recomendaciones a docentes'}
        </ModalHeader>
        <ModalBody>
          <div>
            {files &&
              files.map((item) => {
                return (
                  <FileAnchorContainer>
                    <a
                      href={item.url}
                      target='_blank'
                      rel='noopener noreferrer'
                    >
                      {item.name || item.titulo}
                    </a>
                    {editable && <span
                      onClick={() => {
                        handleResourceDelete(item)
                      }}
                    >
                      <HighlightOffIcon />
                    </span>}
                  </FileAnchorContainer>
                )
              })}
          </div>
        </ModalBody>
      </Modal>
    </Card>
  )
}


const FileAnchorContainer = styled.div`
        text-align: center;
        margin: 1rem;
        display: flex;
        align-content: space-between;

        a {
          padding - top: 1.35px;
  }
        `

const CenteredRow = styled(Col)`
        display: flex;
        justify-content: center;
        align-items: center;
        `

export default ApoyoEducativo
