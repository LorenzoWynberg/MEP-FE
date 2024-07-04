import React, { useState, useRef, useEffect } from 'react'
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  Row,
  Col,
  TabContent,
  TabPane,
  Nav,
  NavItem,
  NavLink,
  Input
} from 'reactstrap'
import '../../../../../src/assets/css/sass/containerStyles/SendForm.scss'
import classnames from 'classnames'
import BackupIcon from '@material-ui/icons/Backup'
import Froala from '../../../../components/Froala/index'
import {
  clearEmails,
  getForm,
  getEmail,
  createInvitation
} from '../../../../redux/FormCreatorV2/actions'
import { createComunicados } from '../../../../redux/comunicados/actions'
import { useActions } from 'Hooks/useActions'
import useNotification from 'Hooks/useNotification'
import { useSelector } from 'react-redux'
import MultiSelect from './_partials/autoComplete/MultiSelect'
import { useTranslation } from 'react-i18next'

function SendForm(props) {
  const fileToUploadRef = useRef(null)
  const comunicadoAction = useActions({
    createComunicados,
    clearEmails,
    getForm,
    getEmail,
    createInvitation
  })
  const [modals, setModals] = useState(false)
  const toggle = () => setModals(!modals)
  const [inputName, setInputName] = useState(null)
  const [froalaText, setFroalaText] = useState(null)
  const [inputVinculo, setInputVinculo] = useState(null)
  const [activeTabSend, setActiveTabSend] = useState('1')
  const [snackBar, handleSnackBarClick] = useNotification()
  const [inputFile, setInputFile] = useState([])
  const state = useSelector((store) => store.creadorFormularios)
  const [destinatariosData, setDestinatariosData] = useState([])
  const [destinatariosDataCC, setDestinatariosDataCC] = useState([])
  const [destinatariosDataBCC, setDestinatariosDataBCC] = useState([])
  const { t } = useTranslation()

  const toggleTab = (tab) => {
    if (activeTabSend !== tab) setActiveTabSend(tab)
  }
  const [snackbarContent, setSnacbarContent] = useState({
    msg: 'welcome',
    variant: 'info'
  })

  useEffect(() => {
    comunicadoAction.getForm(props.value)
  }, [])
  const onNextTab = () => {
    if (activeTabSend === '1') {
      toggleTab('2')
    } else if (activeTabSend === '2') {
      toggleTab('3')

      setInputVinculo(
        window.location.origin +
        '/#/forms/response/open/' +
        state.currentForm.urlId
      )
    }
  }
  const handleSnackBarShow = (msg: string, variant: string) => {
    setSnacbarContent({
      variant,
      msg
    })
    handleSnackBarClick()
  }
  const volverTab = () => {
    if (activeTabSend === '3') {
      toggleTab('2')
    } else if (activeTabSend === '2') {
      toggleTab('1')
    }
  }
  const cancelTab = () => {
    setModals(!modals)
  }
  const vinculo = () => {
    toggleTab('3')
    setInputVinculo(
      window.location.origin +
      '/#/forms/response/open/' +
      state.currentForm.urlId
    )
  }
  const sendEmail = () => {
    if (destinatariosData != null && destinatariosData.length > 0) {
      const invitaciones = []
      destinatariosData.map((correo) => {
        invitaciones.push({
          hashFormulario: state.currentForm.urlId,
          email: correo
        })
      })
      const createInvitacion = async () => {
        const response = await comunicadoAction.createInvitation({
          invitaciones
        })
        if (response.error) {
          setSnacbarContent({
            variant: 'error',
            msg: t('formulario>enviar_formulario>error_genera_invitacion', 'Hubo un error al generar la invitación')
          })
          handleSnackBarClick()
        } else {
          response.data.map((correo) => {
            const sinAsunto = `(${t('formulario>enviar_formulario>sin_asunto', 'sin asunto')})`
            const correoCC = destinatariosDataCC.map(
              (correoCC) => correoCC
            )
            const correoBCC = destinatariosDataBCC.map(
              (correoBCC) => correoBCC
            )
            const arrayCorreo = [correo.email]
            let mensajeNuevo = ''
            const arrayCorreoCC = correoCC
            const arrayCorreoBCC = correoBCC
            if (froalaText == null) {
              mensajeNuevo =
                window.location.origin +
                '/#/forms/' +
                state.currentForm.urlId +
                '/response?invitation=' +
                correo.id
            } else {
              mensajeNuevo =
                froalaText +
                window.location.origin +
                '/#/forms/' +
                state.currentForm.urlId +
                '/response?invitation=' +
                correo.id
            }
            const data = new FormData()
            if (inputName == null) {
              data.append('Asunto', sinAsunto)
            } else {
              data.append('Asunto', inputName)
            }
            inputFile.map((el) => {
              data.append('Adjuntos', el.archivo)
            })
            data.append('Mensaje', mensajeNuevo)
            data.append('ResponderComunicadoId', '0')
            data.append(
              'Destinatarios',
              JSON.stringify(arrayCorreo)
            )
            data.append('Copias', JSON.stringify(arrayCorreoCC))
            data.append(
              'CopiasOcultas',
              JSON.stringify(arrayCorreoBCC)
            )
            const loadForm = async () => {
              const response =
                await comunicadoAction.createComunicados(data)
              if (response.error) {
                setSnacbarContent({
                  variant: 'error',
                  msg: t('formulario>enviar_formulario>error_enviar_email', 'Hubo un error y el email no se pudo mandar')
                })
                handleSnackBarClick()
              } else {
                setSnacbarContent({
                  variant: 'success',
                  msg: t('formulario>enviar_formulario>enviar_email_correctamente', 'Email enviado correctamente')
                })
                handleSnackBarClick()
              }
            }
            loadForm()
          })
        }
        setModals(!modals)
        setInputName(null)
        setFroalaText(null)
        setDestinatariosData([])
        setInputFile([])
        toggleTab('1')
      }
      createInvitacion()
    } else {
      handleSnackBarShow(
        t('formulario>enviar_formulario>ingresar_destinatarios', 'Favor ingresar destinatarios del correo y luego presione enter'),
        'error'
      )
      setDestinatariosData([])
    }
  }

  const copiarPortapapeles = () => {
    const aux = document.createElement('input')
    aux.setAttribute('value', inputVinculo.toString())
    document.body.appendChild(aux)
    aux.select()
    document.execCommand('copy')
    document.body.removeChild(aux)
    handleSnackBarShow('Url Copiada', 'success')
  }

  const handleImportForm = async (e) => {
    setInputFile([
      ...inputFile,
      { archivo: e.target.files[0], nombre: e.target.files[0].name }
    ])
    e.preventDefault()
    try {
      handleSnackBarShow(t('formulario>enviar_formulario>archivo_adjuntado_correctamente', 'Archivo adjuntado correctamente'), 'success')
    } catch (error) {
      handleSnackBarShow(t('formulario>enviar_formulario>subir_archivo_error', 'Error al subir el archivo'), 'error')
    }
  }
  const onDelete = (idx) => {
    const filtredData = inputFile.filter((item, index) => index !== idx)
    setInputFile(filtredData)
  }
  return (
    <div>
      {snackBar(snackbarContent.variant, snackbarContent.msg)}
      <Button
        color='primary'
        size='lg'
        onClick={() => {
          props.onClickButton()
          toggle()
        }}
      >
        {' '}
        {t('formulario>enviar_formulario>enviar', 'Enviar')}{' '}
      </Button>
      <Modal isOpen={modals} toggle={toggle} className='modalSendForm'>
        <ModalHeader className='modalHeaderClass' toggle={toggle}>
          {t('formulario>enviar_formulario>enviar', 'Enviar Formulario')}{' '}
        </ModalHeader>
        <ModalBody>
          <Nav tabs>
            <NavItem>
              <NavLink
                className={classnames({
                  active: activeTabSend === '1'
                })}
                onClick={() => {
                  toggleTab('1')
                }}
              >
                1. {t('formulario>enviar_formulario>mensaje', 'Mensaje')}
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                className={classnames({
                  active: activeTabSend === '2'
                })}
                onClick={() => {
                  toggleTab('2')
                }}
              >
                2. {t('formulario>enviar_formulario>destinatario', 'Destinario')}
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                className={classnames({
                  active: activeTabSend === '3'
                })}
                onClick={() => {
                  vinculo()
                }}
              >
                3. {t('formulario>enviar_formulario>enviar_y_vinculo', 'Enviar y Vínculo')}
              </NavLink>
            </NavItem>
          </Nav>
          <TabContent activeTab={activeTabSend}>
            <TabPane tabId='1'>
              <Row>
                <Col sm='12'>
                  <p className='asuntoClass'>{t('formulario>enviar_formulario>asunto', 'Asunto')}</p>
                  <Input
                    type='text'
                    required
                    value={inputName}
                    onChange={(e) =>
                      setInputName(e.target.value)}
                  />
                  <p className='asuntoClass'>{t('formulario>enviar_formulario>mensaje', 'Mensaje')}</p>
                  <Froala
                    zIndex={10}
                    value={froalaText}
                    onChange={(e) => setFroalaText(e)}
                  />

                  <Button
                    className='btnSubirClass'
                    size='lg'
                    onClick={() => {
                      fileToUploadRef.current.click()
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#145388 ',
                        margin: '-1px'
                      }}
                    >
                      <BackupIcon className='iconSube' />{' '}
                      {t('formulario>enviar_formulario>adjuntar_archivo', 'Adjuntar archivo')}
                    </div>
                    <input
                      ref={fileToUploadRef}
                      type='file'
                      style={{
                        opacity: 0,
                        display: 'none'
                      }}
                      onChange={(e) =>
                        handleImportForm(e)}
                    />
                  </Button>
                  {inputFile.map((el, index) => (
                    <Col sm='12'>
                      <p>
                        {el.nombre}{' '}
                        <p
                          className='xClass'
                          onClick={() =>
                            onDelete(index)}
                        >
                          x
                        </p>
                      </p>
                    </Col>
                  ))}
                </Col>
              </Row>
            </TabPane>
            <TabPane tabId='2'>
              <Row>
                <Col sm='12'>
                  <p className='asuntoClass'>
                    {t('formulario>enviar_formulario>ingresa_destinatario', 'Ingrese el destinatario y presione enter')}
                  </p>
                  <p className='asuntoClass'>{t('comunicados>mensaje>para', 'Para')}: </p>
                  <MultiSelect
                    setDestinatarios={setDestinatariosData}
                  />
                </Col>
              </Row>
            </TabPane>
            <TabPane tabId='3'>
              <p className='asuntoClass'>{t('formulario>enviar_formulario>vinculo', 'Vínculo')}</p>
              <Row>
                <Col sm='10'>
                  <Input
                    readOnly='true'
                    type='text'
                    required
                    value={inputVinculo}
                  />
                </Col>
                <Col sm='2'>
                  <Button
                    className='btnCopiar'
                    onClick={() => copiarPortapapeles()}
                  >
                    {t('formulario>enviar_formulario>copiar', 'Copiar')}
                  </Button>{' '}
                </Col>
              </Row>
            </TabPane>
          </TabContent>
        </ModalBody>
        <div className='BtnSendForm'>
          <Row className='rowVinculo'>
            {activeTabSend === '1' && (
              <div>
                <Col sm='2'>
                  <Button
                    className='btnCancelForm'
                    onClick={() => cancelTab()}
                  >
                    {t('general>cancelar', 'Cancelar')}
                  </Button>{' '}
                </Col>
                <Col sm='2'>
                  <Button
                    className='btnSiguiente'
                    onClick={() => onNextTab()}
                  >
                    {t('formulario>enviar_formulario>siguiente', 'Siguiente')}
                  </Button>
                </Col>
              </div>
            )}
            {activeTabSend === '2' && (
              <div>
                <Col sm='2'>
                  <Button
                    className='btnCancelForm'
                    onClick={() => volverTab()}
                  >
                    {t('formulario>enviar_formulario>volver', 'Volver')}
                  </Button>{' '}
                </Col>
                <Col sm='2'>
                  <Button
                    className='btnSiguiente'
                    onClick={() => onNextTab()}
                  >
                    {t('formulario>enviar_formulario>siguiente', 'Siguiente')}
                  </Button>
                </Col>
              </div>
            )}
            {activeTabSend === '3' && (
              <div>
                <Col sm='2'>
                  <Button
                    className='btnCancelForm'
                    onClick={() => volverTab()}
                  >
                    {t('formulario>enviar_formulario>volver', 'Volver')}
                  </Button>{' '}
                </Col>
                <Col sm='2'>
                  <Button
                    className='btnSiguiente'
                    onClick={() => sendEmail()}
                  >
                    {t('formulario>enviar_formulario>enviar', 'Enviar')}
                  </Button>
                </Col>
              </div>
            )}
          </Row>
        </div>
      </Modal>
    </div>
  )
}
export default SendForm
