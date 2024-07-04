import React, { useState, useEffect } from 'react'
import 'react-tagsinput/react-tagsinput.css'
import { makeStyles } from '@material-ui/core/styles'
import { EditButton } from '../../../../../../components/EditButton'
import SelectItem from './SelectItem'

import {
  Row,
  Col,
  Card,
  CardBody,
  CardTitle,
  FormGroup,
  Label,
  Modal,
  CustomInput,
  Container,
  ModalHeader,
  ModalBody,
  Button,
  Form
} from 'reactstrap'
import styled from 'styled-components'
import IntlMessages from '../../../../../../helpers/IntlMessages'
import colors from '../../../../../../assets/js/colors'
import HighlightOffIcon from '@material-ui/icons/HighlightOff'
import { useTranslation } from 'react-i18next'

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

  return (
    <Card>
      <CardBody>
        <CardTitle>{t('estudiantes>matricula_estudiantil>matricular_estudiante>apoyos_educativos>apoyos_educativos_estudiante', 'Apoyos educativos del estudiante')}</CardTitle>
        <Row>
          <Col md='12'>
            <Row>
              <Col md='6'>
                <FormGroup>
                  <Label>{t('estudiantes>matricula_estudiantil>matricular_estudiante>apoyos_educativos>condicion', 'Condición de discapacidad')}</Label>
                  <StyledMultiSelect
                    className={classes.inputTags}
                    disabled={!editable}
                    onClick={() => {
                      handleOpenOptions(props.discapacidades, 'discapacidades')
                    }}
                  >
                    {discapacidades.map((discapacidad) => {
                      return <SelectItem item={discapacidad} />
                    })}
                  </StyledMultiSelect>
                </FormGroup>
              </Col>
              <Col md='6'>
                <span>{t('estudiantes>matricula_estudiantil>matricular_estudiante>apoyos_educativos>detalle_condicion', 'Detalle de la condición de discapacidad')}</span>
                <ButtonsContainer>
                  <DownloadIconContainer>
                    <i className='simple-icon-cloud-upload' />
                  </DownloadIconContainer>
                  <div style={{ paddingTop: '0.4rem' }}>
                    {editable && (
                      <input
                        onChange={(e) => {
                          handleFileDiscapacidad(e)
                        }}
                        className={classes.input}
                        id='filesDiscapacidad-id'
                        type='file'
                        name='filesDiscapacidad'
                        accept='.pdf,.jpg,.png'
                      />
                    )}
                    <label htmlFor='filesDiscapacidad-id'>
                      <FileLabel
                        disabled={!editable}
                      >
                        {t('general>subir_archivo', 'Subir archivo')}
                      </FileLabel>
                    </label>
                  </div>
                  {discapacidadesFiles.length > 0 && (
                    <Button
                      color='primary'
                      onClick={() => {
                        setOpenFiles({ open: true, type: 'discapacidad' })
                        setFiles(discapacidadesFiles)
                      }}
                    >
                      <IntlMessages id='family.uploadedFiles' />(
                      {`${discapacidadesFiles.length} archivos`})
                    </Button>
                  )}
                </ButtonsContainer>
              </Col>
            </Row>
          </Col>
          <Col md='12'>
            <Row>
              <Col md='6'>
                <FormGroup>
                  <Label>{t('estudiantes>matricula_estudiantil>matricular_estudiante>apoyos_educativos>otro_tipo_condicion', 'Otro tipo de condición')} </Label>
                  <StyledMultiSelect
                    className={classes.inputTags}
                    disabled={!editable}
                    onClick={() => {
                      handleOpenOptions(props.otrasCondiciones, 'conditions')
                    }}
                  >
                    {condiciones.map((discapacidad) => {
                      return <SelectItem item={discapacidad} />
                    })}
                  </StyledMultiSelect>
                </FormGroup>
              </Col>
              <Col md='6'>
                <span>{t('estudiantes>matricula_estudiantil>matricular_estudiante>apoyos_educativos>recomendaciones', 'Recomendaciones a docentes')}</span>
                <ButtonsContainer>
                  <DownloadIconContainer>
                    <i className='simple-icon-cloud-upload' />
                  </DownloadIconContainer>
                  <div style={{ paddingTop: '0.4rem' }}>
                    {editable && (
                      <input
                        onChange={(e) => {
                          handleFileCondition(e)
                        }}
                        className={classes.input}
                        id='filesCondicion-id'
                        type='file'
                        name='filesCondicion'
                        accept='.pdf,.jpg,.png'
                      />
                    )}
                    <label htmlFor='filesCondicion-id'>
                      <FileLabel
                        disabled={!editable}
                      >
                        {t('general>subir_archivo', 'Subir archivo')}
                      </FileLabel>
                    </label>
                  </div>
                  {condicionesFiles.length > 0 && (
                    <Button
                      color='primary'
                      onClick={() => {
                        setOpenFiles({ open: true, type: 'condicion' })
                        setFiles(condicionesFiles)
                      }}
                    >
                      <IntlMessages id='family.uploadedFiles' />(
                      {`${condicionesFiles.length} archivos`})
                    </Button>
                  )}
                </ButtonsContainer>
              </Col>
            </Row>
          </Col>
          <Col xs={12}>
            <Form onSubmit={handleSubmit(sentData)}>
              <EditButton
                editable={editable}
                setEditable={setEditable}
                loading={loading}
              />
            </Form>
          </Col>
        </Row>
      </CardBody>
      <Modal isOpen={openOptions.open} size='lg'>
        <ModalHeader>{openOptions.type === 'discapacidades' ? 'Tipos de discapacidades' : 'Otros tipos de condiciones'}</ModalHeader>
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
                  Cancelar
                </Button>
                <Button
                  color='primary'
                  onClick={() => {
                    toggleModal(true)
                  }}
                >
                  Guardar
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

const StyledMultiSelect = styled.div`
  &[disabled] {
    background-color: #eaeaea;
  }
`

const ButtonsContainer = styled.div`
  display: flex;
  margin-top: 1rem;
  align-items: center;
`

const FileLabel = styled.div`
  background-color: white;
  color: ${props => props.disabled ? '#636363' : colors.primary};
  border: 1.5px solid ${props => props.disabled ? '#636363' : colors.primary};
  width: 7rem;
  height: 2.7rem;
  text-align: center;
  justify-content: center;
  align-items: center;
  display: flex;
  margin-left: 0.35rem;
  margin-right: 0.35rem;
  border-radius: 26px;
  &:hover {
    background-color: ${props => props.disabled ? '' : colors.primary};
    color: ${props => props.disabled ? '' : 'white'};
  }
`

const DownloadIconContainer = styled.span`
  font-size: 35px;
`

const FileAnchorContainer = styled.div`
  text-align: center;
  margin: 1rem;
  display: flex;
  align-content: space-between;

  a {
    padding-top: 1.35px;
  }
`

const CenteredRow = styled(Col)`
  display: flex;
  justify-content: center;
  align-items: center;
`

export default ApoyoEducativo
