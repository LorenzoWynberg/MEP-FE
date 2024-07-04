import React, { useState, useEffect, useRef } from 'react'
import {
  Row, Col, Button, InputGroupAddon, Input, ButtonGroup, Container,
  ButtonDropdown, DropdownToggle, DropdownItem, DropdownMenu, FormGroup, Label, Badge
} from 'reactstrap'
import 'moment/locale/es'
import Froala from '../../../../components/Froala'
import 'assets/css/sass/containerStyles/SendForm.scss'
import MultiSelect from '../../FormCreator/SendForm/_partials/autoComplete/MultiSelect'
import { useActions } from 'Hooks/useActions'
import {
  createComunicados,
  programarComunicado,
  getTemplatesComunicados, getEtiquetasComunicados,
  borradorComunicado,
  updateBorradorComunicado
} from '../../../../redux/comunicados/actions'
import ModalView from './ModalView'
import { TAGS, TEMPLATES } from '../util'
import colors from '../../../../assets/js/colors'
import moment from 'moment'
import Loader from '../../../../components/Loader'
import { useSelector } from 'react-redux'
import { envVariables } from '../../../../constants/enviroment'
import Destinatarios from './Destinatarios'
import { withRouter } from 'react-router-dom'
import TextField from '@material-ui/core/TextField'
import { makeStyles } from '@material-ui/core/styles'
import ModalEtiquetas from './ModalEtiquetas'
import { useTranslation } from 'react-i18next'

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap'
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 200
  }
}))

interface IProps {
  data: any;
  template?: any;
  snackBarShow: Function;
  replyMensajeId?: any;
  to?: any[];
  subject?: string;
  onSendMensaje: Function;
  onSendMensajeBorrador: Function;
  onTrashIcon: Function;
  minHeight?: number;
  redactar?: boolean;
}

const MensajeEdit = withRouter((props) => {
  const classes = useStyles()
  const [destinatariosData, setDestinatariosData] = useState([])
  const [destinatariosDataCC, setDestinatariosDataCC] = useState([])
  const [destinatariosDataBCC, setDestinatariosDataBCC] = useState([])
  const [timeoutItem, setTimeoutItem] = useState(null)
  const [calledOnce, setCalledOnce] = useState(false)

  const [bccEnabled, setBccEnabled] = useState(false)
  const [bccoEnabled, setCcoEnabled] = useState(false)
  const [inputName, setInputName] = useState('')
  const [froalaText, setFroalaText] = useState('')

  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [dropdownTemplateOpen, setDropdownTemplateOpen] = useState(false)
  const [templateDropdown, setTemplateDropdown] = useState(TEMPLATES[0] || null)
  const [openSearchModal, setOpenSearchModal] = useState(false)
  const { t } = useTranslation()

  const comunicadoAction = useActions({
    createComunicados,
    getTemplatesComunicados,
    getEtiquetasComunicados,
    programarComunicado,
    borradorComunicado,
    updateBorradorComunicado
  })

  const [data, setData] = useState({
    titulo: '',
    mensaje: '',
    fechaInsercion: '',
    usuarioRemitenteNombre: '',
    usuarioRemitenteEmail: ''
  })

  const [openModalView, setOpenModalView] = useState(false)
  const [propsModalView, setPropsModalView] = useState({
    title: '',
    size: '',
    icon: ''
  })
  const [selectedTag, setSelectedTag] = useState(null)
  const [tipoTag, setTipoTag] = useState(0)

  const [inputFile, setInputFile] = useState([])
  const fileToUploadRef = useRef(null)

  const [openModalProgramadaView, setOpenModalProgramadaView] = useState(false)
  const [dateSheduled, setDateSheduled] = useState(null)
  const [templates, setTemplates] = useState([])
  const [selectedTemplate, setSelectedTemplate] = useState(null)
  const [tags, setTags] = useState([])
  const [borrador, setBorrador] = useState<any>()
  const [savingBorrador, setSavingBorrador] = useState(false)
  const [savingBandejaBorradorId, setSavingBandejaBorradorId] = useState(null)
  const [savingComunicado, setSavingComunicado] = useState(false)
  const [mountingElements, setMountingElements] = useState(!props.createElement)

  useEffect(() => {
    if (props.to) { setDestinatariosData(props.to) }

    if (props.subject) { setInputName(props.subject) }

    const loadTemplates = async () => {
      await comunicadoAction.getTemplatesComunicados()
      setTemplates(state.templates || [])
      if (state.templates.length == 0) { setTemplates(TEMPLATES) }
      await comunicadoAction.getEtiquetasComunicados(36)
      setTags(state.etiquetas || TAGS)
    }

    loadTemplates()
  }, [])

  useEffect(() => {
    if (props.data?.bandejaCorreoId) {
      setData(props.data)
      setFroalaText(props.data.mensaje)
      if (!props.avoidSenders) {
        setDestinatariosDataCC(JSON.parse(props.data.copias))
        setDestinatariosDataBCC(JSON.parse(props.data.copiasOcultas))
        setDestinatariosData(JSON.parse(props.data.destinatarios))
      }
      setInputName(props.data.titulo)
      setInputFile(props.data.adjuntos ? JSON.parse(props.data.adjuntos) : [])
      if (props.isDraft) {
        setBorrador({ ...props.data, id: props.data.comunicadoId })
      }
      setTimeout(() => {
        setMountingElements(false)
      }, 500)
    } else {
      setData(props.data)
    }
  }, [props.data])

  useEffect(() => {
    if (props.template?.contenido) {
      setFroalaText(props.template.contenido)
    }
  }, [props.template])

  useEffect(() => {
    if (inputFile[0]) {
      handleBorrador(true)
    }
  }, [inputFile])

  useEffect(() => {
    if (!savingComunicado) {
      if (calledOnce && !mountingElements) {
        clearTimeout(timeoutItem)
        setTimeoutItem(setTimeout(() => {
          handleBorrador()
        }, 850
        ))
      } else if (!calledOnce) {
        setCalledOnce(true)
      }
    }
  }, [inputName, froalaText, destinatariosData, destinatariosDataCC, destinatariosDataBCC, selectedTag, dateSheduled])

  useEffect(() => {
    if (selectedTemplate) {
      setFroalaText(selectedTemplate.contenido)
    }
  }, [selectedTemplate])

  const state = useSelector((store) => {
    return {
      ...store.listaDifusion,
      ...store.comunicados
    }
  })

  const handleBorrador = async () => {
    setSavingComunicado(true)
    const updated = !!borrador?.id
    const _data = new FormData()
    const destinatariosParsed = []
    destinatariosData?.forEach(x => {
      if (x[0] === '@') {
        const currentList = state.listasEnvio.find(el => el.alias == x)
        const correos = currentList.correos ? JSON.parse(currentList.correos) : { elementos: [] }
        correos.elementos.forEach(y => {
          destinatariosParsed.push(y)
        })
      } else {
        destinatariosParsed.push(x)
      }
    })

    const destinatariosCCParsed = []
    destinatariosDataCC?.forEach(x => {
      if (x[0] === '@') {
        const currentList = state.listasEnvio.find(el => el.alias == x)
        const correos = currentList.correos ? JSON.parse(currentList.correos) : { elementos: [] }
        correos.elementos.forEach(y => {
          destinatariosCCParsed.push(y)
        })
      } else {
        destinatariosCCParsed.push(x)
      }
    })

    const destinatariosCCOParsed = []
    destinatariosDataBCC?.forEach(x => {
      if (x[0] === '@') {
        const currentList = state.listasEnvio.find(el => el.alias == x)
        const correos = currentList.correos ? JSON.parse(currentList.correos) : { elementos: [] }
        correos.elementos.forEach(y => {
          destinatariosCCOParsed.push(y)
        })
      } else {
        destinatariosCCOParsed.push(x)
      }
    })

    const destinatariosString = JSON.stringify(destinatariosParsed)
    const destinatariosCCString = JSON.stringify(destinatariosCCParsed)
    const destinatariosCCOString = JSON.stringify(destinatariosCCOParsed)

    _data.append('Asunto', inputName)
    _data.append('Mensaje', froalaText)
    _data.append('Destinatarios', destinatariosString)
    _data.append('Copias', destinatariosCCString)
    _data.append('CopiasOcultas', destinatariosCCOString)
    if (selectedTag && tipoTag === 0) {
      _data.append('EtiquetaId', selectedTag?.id)
    }
    if (selectedTag && tipoTag === 1) {
      _data.append('EtiquetaPersonalizadaId', selectedTag?.id)
    }
    if (props.replyMensajeId) {
      _data.append('ResponderComunicadoId', props.replyMensajeId)
    }
    inputFile.map((el) => {
      _data.append('Adjuntos', el.archivo)
    })
    if (dateSheduled) {
      _data.append('FechaProgramado', moment(dateSheduled).locale('es').format('yyyy-MM-DD HH:mm:ss'))
    }

    let response = null
    if (updated) {
      response = await comunicadoAction.updateBorradorComunicado(borrador.id, _data)
    } else {
      response = await comunicadoAction.borradorComunicado(_data)
    }
    setSavingComunicado(false)
    if (response?.error) {
      props.snackBarShow(t('comunicados>redactar>borrador_no_puede_ser_guardado', 'Borrador no pudo ser guardado'), 'error')
    } else {
      props.onSendMensajeBorrador()
      setBorrador(response.data)
      if (!updated) {
        setSavingBandejaBorradorId(response.data.bandejaCorreoId)
      }
    }
  }

  const handleSend = async () => {
    setSavingComunicado(true)
    const data = new FormData()
    data.append('Asunto', inputName)
    data.append('Mensaje', froalaText)
    const destinatariosParsed = []
    destinatariosData?.forEach(x => {
      if (x[0] === '@') {
        const currentList = state.listasEnvio.find(el => el.alias == x)
        const correos = currentList.correos ? JSON.parse(currentList.correos) : { elementos: [] }
        correos.elementos.forEach(y => {
          destinatariosParsed.push(y)
        })
      } else {
        destinatariosParsed.push(x)
      }
    })
    if (destinatariosParsed.length > 0) {
      const destinatariosCCParsed = []
      destinatariosDataCC?.forEach(x => {
        if (x[0] === '@') {
          const currentList = state.listasEnvio.find(el => el.alias == x)
          const correos = currentList.correos ? JSON.parse(currentList.correos) : { elementos: [] }
          correos.elementos.forEach(y => {
            destinatariosCCParsed.push(y)
          })
        } else {
          destinatariosCCParsed.push(x)
        }
      })

      const destinatariosCCOParsed = []
      destinatariosDataBCC?.forEach(x => {
        if (x[0] === '@') {
          const currentList = state.listasEnvio.find(el => el.alias == x)
          const correos = currentList.correos ? JSON.parse(currentList.correos) : { elementos: [] }
          correos.elementos.forEach(y => {
            destinatariosCCOParsed.push(y)
          })
        } else {
          destinatariosCCOParsed.push(x)
        }
      })
      data.append('Destinatarios', JSON.stringify(destinatariosParsed))
      data.append('Copias', JSON.stringify(destinatariosCCParsed))
      data.append('CopiasOcultas', JSON.stringify(destinatariosCCOParsed))
      if (selectedTag && tipoTag === 0) {
        data.append('EtiquetaId', selectedTag?.id)
      }
      if (selectedTag && tipoTag === 1) {
        data.append('EtiquetaPersonalizadaId', selectedTag?.id)
      }

      if (borrador) {
        data.append('BandejaCorreoBorradorId', props.isDraft ? borrador.bandejaCorreoId || props.data?.bandejaCorreoId : savingBandejaBorradorId)
      }
      if (props.replyMensajeId) {
        data.append('ResponderComunicadoId', props.replyMensajeId)
      }
      inputFile.map((el) => {
        data.append('Adjuntos', el.archivo)
      })

      if (!dateSheduled) {
        const response = await comunicadoAction.createComunicados(data)
        if (response?.error) {
          props.snackBarShow(t('comunicados>redactar>error', 'Hubo un error y el email no se pudo enviar'), 'error')
        } else {
          props.snackBarShow(t('comunicados>redactar>email_enviado', 'Email enviado correctamente'), 'success')
          props.onSendMensaje()
          resetForm()
        }
      } else {
        data.append('FechaProgramado', moment(dateSheduled).locale('es').format('yyyy-MM-DD HH:mm:ss'))
        const response = await comunicadoAction.programarComunicado(data)

        if (response?.error) {
          props.snackBarShow(t('comunicados>redactar>error_programar', 'Hubo un error y el email no se pudo programar'), 'error')
        } else {
          props.snackBarShow(t('comunicados>redactar>programado_correctamente', 'Email programado correctamente'), 'success')
          props.onSendMensaje()
          resetForm()
        }

        if (props.onSendMensaje) {
          props.onSendMensaje()
        }
      }

      setSavingComunicado(false)
    } else {
      props.snackBarShow(t('comunicados>redactar>especificar_destinatario', 'Debe especificar al menos un destinatario.'), 'error')
    }
  }

  const handleImportForm = async (e) => {
    const _archivos = []
    if (e.target.files.length > 0) {
      for (let i = 0; i < e.target.files.length; i++) {
        const _file = e.target.files[0]

        const bite = _file.size
        const sizeInMB = (bite / (1024 * 1024)).toFixed(2)
        if (parseInt(sizeInMB) > 10) {
          props.snackBarShow(t('comunicados>redactar>archivo_pesado', 'El archivo no debe pesar más de 10 MB'), 'error')
          return
        }
        _archivos.push({ archivo: _file, nombre: _file.name })
      }

      await setInputFile([...inputFile, ..._archivos])
    }

    e.preventDefault()
    try {
      props.snackBarShow(t('comunicados>redactar>archivos_adjuntos', 'Archivos adjuntados correctamente'), 'success')
    } catch (error) {
      props.snackBarShow(t('comunicados>redactar>subir_archivos', 'Error al subir los archivos'), 'error')
    }
  }

  const onDelete = (idx) => {
    const filtredData = inputFile.filter((item, index) => index !== idx)
    setInputFile(filtredData)
  }

  const resetForm = () => {
    setDestinatariosData([])
    setDestinatariosDataCC([])
    setDestinatariosDataBCC([])
    setInputFile([])
    setInputName('')
    setFroalaText('')
    setSelectedTag(null)
    setTipoTag(0)
    props.history.push('/comunicados/recibidos')
  }

  return (
    <Container>
      <Destinatarios
        open={openSearchModal == 'to'}
        setOpen={setOpenSearchModal}
        value={destinatariosData}
        onChange={setDestinatariosData}
        snackBarShow={props.snackBarShow}
      />
      <Destinatarios
        open={openSearchModal == 'cc'}
        setOpen={setOpenSearchModal}
        value={destinatariosDataCC}
        onChange={setDestinatariosDataCC}
        snackBarShow={props.snackBarShow}
      />
      <Destinatarios
        open={openSearchModal == 'cco'}
        setOpen={setOpenSearchModal}
        value={destinatariosDataBCC}
        onChange={setDestinatariosDataBCC}
        snackBarShow={props.snackBarShow}
      />

      <Col
        md='12'
        id='mail-view-box'
        className='pb-4'
        style={{ background: 'white' }}
      >
        <Row>
          <Col md={1}>
            <span
              style={{ color: colors.primary, cursor: 'pointer' }}
              onClick={() => {
                setOpenSearchModal('to')
              }}
            >
              Para
            </span>
          </Col>
          <Col md={9}>
            <div>
              <MultiSelect
                destinatarios={destinatariosData}
                setDestinatarios={setDestinatariosData}
              />
            </div>
          </Col>
          <Col md={2}>
            <InputGroupAddon addonType='append'>
              <span
                style={{ color: colors.primary, cursor: 'pointer' }}
                onClick={() => {
                  if (!bccEnabled) {
                    //  setOpenSearchModal('cc')
                  } else {
                    setDestinatariosDataCC([])
                  }
                  setBccEnabled(!bccEnabled)
                }}
              >
                CC
              </span>
              <span
                style={{
                  color: colors.primary,
                  cursor: 'pointer',
                  marginLeft: '1rem'
                }}
                color='link'
                onClick={() => {
                  if (!bccoEnabled) {
                    //  setOpenSearchModal('cco')
                  } else {
                    setDestinatariosDataBCC([])
                  }
                  setCcoEnabled(!bccoEnabled)
                }}
              >
                CCO
              </span>
            </InputGroupAddon>
          </Col>
        </Row>

        {bccEnabled && (
          <Row>
            <Col md={1}>
              <span
                style={{
                  color: colors.primary,
                  cursor: 'pointer',
                  marginLeft: '1rem'
                }}
                onClick={() => {
                  setOpenSearchModal('cc')
                }}
              >
                CC:
              </span>
            </Col>
            <Col md={9}>
              <div>
                {/* destinatariosDataCC.map((el, idx) => {
                    if (idx < 4) {
                      return (
                        <span
                          style={{
                            border: '1px solid grey',
                            backgroundColor: colors.primary,
                            color: 'white',
                            borderRadius: '15px',
                            padding: '1px',
                          }}
                        >
                          {el.value}
                        </span>
                      )
                    }
                  }) */}

                <MultiSelect
                  destinatarios={destinatariosDataCC}
                  setDestinatarios={setDestinatariosDataCC}
                />
              </div>
            </Col>
            <Col md={1} />
          </Row>
        )}

        {bccoEnabled && (
          <Row>
            <Col md={1}>
              <span
                style={{
                  color: colors.primary,
                  cursor: 'pointer',
                  marginLeft: '1rem'
                }}
                onClick={() => {
                  setOpenSearchModal('cco')
                }}
              >
                CCO:
              </span>
            </Col>
            <Col md={9}>
              <div>
                {/* destinatariosDataBCC.map((el) => {
                    return (
                      <span
                        style={{
                          border: '1px solid grey',
                          backgroundColor: colors.primary,
                          color: 'white',
                          borderRadius: '15px',
                          padding: '1px',
                        }}
                      >
                        {el.value}
                      </span>
                    )
                  }) */}

                <MultiSelect
                  destinatarios={destinatariosDataBCC}
                  setDestinatarios={setDestinatariosDataBCC}
                />
              </div>
            </Col>
            <Col md={1} />
          </Row>
        )}
        <hr />
        <Row>
          <Col sm='12'>
            <Input
              type='text'
              required
              value={inputName || ''}
              onChange={(e) => setInputName(e.target.value)}
              placeholder={t('comunicados>redactar>agregar_asunto', 'Agregar un asunto')}
            />
          </Col>
        </Row>

        <Row>
          <Col md='12'>
            <Froala
              uploadUrl={`${envVariables.BACKEND_URL}/api/File/resource`}
              resourcesUrl={`${envVariables.BACKEND_URL}/api/File/resource`}
              deleteResourceUrl={`${envVariables.BACKEND_URL}/api/File/resource`}
              value={froalaText}
              zIndex={1}
              onChange={(e) => setFroalaText(e)}
              heightMin={props.minHeight}
              redactar={props.redactar}
            />
          </Col>
        </Row>
        <Row>
          <Col md='12' style={{ margin: 5 }}>
            {selectedTag && (
              <Badge
                color='primary'
                pill
                style={{ fontSize: '0.7rem', margin: 5 }}
              >
                {selectedTag?.nombre}
              </Badge>
            )}
            {dateSheduled && (
              <Badge
                color='primary'
                pill
                style={{ fontSize: '0.7rem', margin: 5 }}
              >
                {moment(dateSheduled).locale('es').format('LLL A')}
              </Badge>
            )}
          </Col>
        </Row>
        <Row>
          <Col md='9'>
            <ButtonGroup size='sm'>
              <Button
                color='primary'
                disabled={state.loading}
                outline
                onClick={handleSend}
              >
                {state.loading
                  ? (
                    <Loader styles={{ position: 'relative' }} />
                    )
                  : (
                      dateSheduled ? t('comunicados>redactar>guardar' ,'Guardar') : t('comunicados>redactar>enviar', 'Enviar')
                    )}
              </Button>
              <ButtonDropdown
                isOpen={dropdownOpen}
                toggle={() => setDropdownOpen(!dropdownOpen)}
              >
                <DropdownToggle color='primary' caret />
                <DropdownMenu>
                  <DropdownItem
                    onClick={() => setOpenModalProgramadaView(true)}
                  >
                    Programar envío
                  </DropdownItem>
                </DropdownMenu>
              </ButtonDropdown>
            </ButtonGroup>

            <i
              style={{ fontSize: '1.5rem' }}
              className='fas fa-paperclip'
              onClick={() => {
                fileToUploadRef.current.click()
              }}
            >
              <input
                ref={fileToUploadRef}
                type='file'
                style={{
                  opacity: 0,
                  display: 'none'
                }}
                multiple
                onChange={(e) => handleImportForm(e)}
              />
            </i>
            {inputFile &&
              inputFile.length > 0 &&
              inputFile.map((el, index) => (
                <a style={{ fontSize: '0.8rem' }}>
                  <Badge
                    color='primary'
                    pill
                    style={{ fontSize: '0.7rem', margin: 5 }}
                  >
                    {el.nombre || el.Name}{' '}
                  </Badge>
                  <b
                    style={{ color: colors.primary, cursor: 'pointer' }}
                    onClick={() => onDelete(index)}
                  >
                    (x)
                  </b>
                </a>
              ))}
          </Col>
          <Col md='3'>
            <ButtonGroup size='sm'>
              <ButtonDropdown
                isOpen={dropdownTemplateOpen}
                toggle={() => {
                  setDropdownTemplateOpen(!dropdownTemplateOpen)
                }}
              >
                <DropdownToggle color='primary' caret>
                  {props.template?.nombre}
                </DropdownToggle>
                <DropdownMenu>
                  {templates?.map((item) => {
                    return (
                      <DropdownItem
                        key={item.id}
                        onClick={() => {
                          setTemplateDropdown(item)
                          setDropdownTemplateOpen(false)
                          setSelectedTemplate(item)
                          props.setSelectedTemplate(item)
                        }}
                      >
                        {item.nombre}
                      </DropdownItem>
                    )
                  })}
                </DropdownMenu>
              </ButtonDropdown>
            </ButtonGroup>
            <i
              style={{ fontSize: '1.5rem' }}
              className='fas fa-tag'
              onClick={() => setOpenModalView(true)}
            />
            <i
              style={{ fontSize: '1.5rem' }}
              className='fas fa-trash'
              onClick={() => {
                if (props.onDeleteMensaje) {
                  return props.onDeleteMensaje()
                }
                resetForm()
                if (props.onTrashIcon) { props.onTrashIcon() }
              }}
            />
          </Col>
        </Row>
      </Col>

      {openModalView && (
        <ModalEtiquetas
          openModalView={openModalView}
          setOpenModalView={setOpenModalView}
          tags={tags}
          tipoTag={tipoTag}
          selectedTag={selectedTag}
          setTipoTag={setTipoTag}
          setSelectedTag={setSelectedTag}
          customTags={state.etiquetasPersonalizadas}
          action={() => { setOpenModalView(false) }}
        />
      )}

      {openModalProgramadaView && (
        <ModalView
          open={openModalProgramadaView}
          {...propsModalView}
          onClose={() => {
            setOpenModalProgramadaView(false)
          }}
          action={() => {
            setOpenModalProgramadaView(false)
          }}
          title={t('comunicados>redactar>comunicado_progamado', 'Comunicado programado')}
          textAceptar={t('comunicados>redactar>guardar', 'Guardar')}
        >
          <p className='pt-4'>Seleccione fecha de programación </p>
          <Row>
            <Col md='12'>
              <FormGroup check>
                <Label check>
                  <TextField
                    id='datetime-local'
                    label={t('comunicados>redactar>fecha_programar', 'Fecha a programar')}
                    type='datetime-local'
                    className={classes.textField}
                    onChange={(e) => setDateSheduled(e.target.value)}
                    value={dateSheduled}
                    inputProps={{
                      min: `${new Date().toISOString().slice(0, 10)}T00:00`
                    }}
                    InputLabelProps={{
                      shrink: true
                    }}
                  />
                </Label>
              </FormGroup>
            </Col>
          </Row>
          {dateSheduled && <Row>
            <Col md='12'>
              <FormGroup check>
                <Label check style={{ marginLeft: '3px' }}>
                  {moment(dateSheduled).locale('es').format('LLL A')}
                </Label>
              </FormGroup>
            </Col>
          </Row>}
        </ModalView>
      )}
    </Container>
  )
})

export default MensajeEdit
