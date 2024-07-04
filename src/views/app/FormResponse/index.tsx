import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useActions } from '../../../hooks/useActions'
import {
  getForm,
  saveResponseForm,
  autoSaveResponseForm,
  updateResponseForm,
  setFormTheme,
  getUrlByForm,
  getFormTheme,
  validateInvitation,
  cleanCurrentTheme
} from '../../../redux/FormCreatorV2/actions'
import ResponseForm from './ResponseForm'
import ResponseFormList from './ResponseFormList'
import { Button, Modal, ModalHeader, ModalBody, Input } from 'reactstrap'
import { withRouter } from 'react-router-dom'
import colors from 'Assets/js/colors'
import FroalaEditorView from 'react-froala-wysiwyg/FroalaEditorView'
import useNotification from 'Hooks/useNotification'
import PrintQuestions from './PrintView'
import OutOfTime from '../FormCreator/OutOfTime'
import moment from 'moment'
import { useHistory } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

const Index = (props) => {
  const [loading, setLoading] = useState(null)
  const [questionsArray, setQuestionsArray] = useState([])
  const [password, setPassword] = useState('')
  const [allowComplete, setAllowComplete] = useState(true)
  const [ended, setEnded] = useState(false)
  const [showWelcomeMessage, setShowWelcomeMessage] = useState(false)
  const [form, setForm] = useState({
    id: null,
    titulo: null,
    encabezado: null,
    categoria: null,
    descripcion: null,
    questionContainers: [],
    questions: {}
  })
  const [snackBar, handleSnackBarClick] = useNotification()
  const { t } = useTranslation()
  const history = useHistory()
  const [snackbarContent, setSnacbarContent] = useState({
    msg: 'welcome',
    variant: 'info'
  })
  const handleSnackBarShow = (msg: string, variant: string) => {
    setSnacbarContent({
      variant,
      msg
    })
    handleSnackBarClick()
  }
  const [invitation, setInvitation] = useState(null)

  const actions = useActions({
    getForm,
    saveResponseForm,
    autoSaveResponseForm,
    updateResponseForm,
    cleanCurrentTheme,
    getFormTheme,
    getUrlByForm,
    setFormTheme,
    validateInvitation
  })
  const state = useSelector((store) => {
    return {
      ...store.creadorFormularios
    }
  })

  useEffect(() => {
    setLoading(true)
    actions.cleanCurrentTheme()
    const invitationId = new URLSearchParams(props.location.search).get(
      'invitation'
    )
    setInvitation(invitationId)

    const loadForm = async () => {
      if (props.match.params.response || props.location.search) {
        await actions.getUrlByForm(props.match.params.formId)
      } else {
        await actions.getForm(props.match.params.formId, true)
      }
    }
    loadForm()

    const createForm = async () => {
      await validateInvitationLocal(invitationId)
      await actions.saveResponseForm(props.match.params.formId, {
        respuesta: JSON.stringify({}),
        invitacionId: invitationId
      })
      setLoading(false)
    }

    createForm()
  }, [])

  useEffect(() => {
    if (!props.previewTheme) {
      const _form = state.currentForm?.autoguardadoFormulario
        ? JSON.parse(state.currentForm?.autoguardadoFormulario)
        : {
            questionContainers: [],
            questions: {}
				  }

      const config = state.currentForm.configuracion
        ? JSON.parse(state.currentForm.configuracion)
        : {}
      setForm({
        id: state.currentForm.id,
        titulo: state.currentForm.titulo,
        encabezado: state.currentForm.encabezado,
        categoria: state.currentForm.categoriaId,
        descripcion: state.currentForm.descripcion,
        questionContainers: _form.questionContainers || [],
        questions: _form.questions || {},
        configuracion: config
      })

      if (config.claveOption && config.clave) {
        setAllowComplete(false)
      }

      if (config.mensajeBienvenida && !config.clave) {
        setAllowComplete(false)
        setShowWelcomeMessage(true)
      }
      actions.getFormTheme(_form.tema)

      const newArray = _form.questionContainers
        ? _form.questionContainers.reduce(
          (acumulator, currentValue) => {
            if (_form.questions[currentValue.id]) {
              return [
                ...acumulator,
                ..._form.questions[currentValue.id].map(
                  (el) => {
                    return {
                      ...el,
                      parent: currentValue
                    }
                  }
                )
              ]
            }
            return acumulator
          },
          []
				  )
        : []

      setQuestionsArray(newArray)
    } else {
      setForm({
        id: null,
        titulo: t('formularios>formulario_respuestas>titulo', 'Titulo'),
        encabezado: t('formularios>formulario_respuestas>encabezado', 'Encabezado de formulario'),
        categoria: null,
        descripcion: t('formularios>formulario_respuestas>descripcion', 'Descripcion de formulario'),
        questionContainers: [],
        questions: {}
      })
      actions.setFormTheme(props.theme)
    }
  }, [state.currentForm])

  const validateInvitationLocal = async (invitationId) => {
    if (invitationId && invitationId != '') {
      const response = await actions.validateInvitation(invitationId)
      if (!response.data.esValido) {
        setEnded(true)
      }
    }
  }

  if (loading) {
    return <div className='loader' />
  }

  if (
    form.configuracion?.fechaHoraFinOption &&
		moment().isAfter(moment(form.configuracion.fechaHoraFin)) &&
		!props.match.params.print &&
		!props.preview
  ) {
    return <OutOfTime fomrConfig={form.configuracion} />
  }

  if (
    form.configuracion?.fechaHoraInicioOption &&
		moment().isBefore(moment(form.configuracion.fechaHoraInicio)) &&
		!props.match.params.print &&
		!props.preview
  ) {
    return <OutOfTime fomrConfig={form.configuracion} />
  }

  if (props.match.params.print) {
    return (
      <PrintQuestions
        actions={actions}
        state={state}
        setEnded={setEnded}
        form={form}
        setForm={setForm}
        questionsArray={questionsArray}
        setQuestionsArray={setQuestionsArray}
        loading={loading}
        previewTheme={props.previewTheme}
        {...props}
      />
    )
  }

  if (ended) {
    return (
      <div
        style={{
				  width: '100vw',
				  height: '100vh',
				  backgroundColor: colors.primary,
				  position: 'relative'
        }}
      >
        {/* <div
          style={{
					  height: '5rem',
					  width: '100%',
					  backgroundColor: 'white',
					  display: 'flex',
					  justifyContent: 'space-between',
					  alignItems: 'center',
					  paddingLeft: '3rem',
					  paddingRight: '3rem'
          }}
        >
          <img
            src='/assets/img/LogoMep.jpg'
            style={{ width: '5rem' }}
          />
          <img
            src='/assets/img/saber-logo-nocaption.svg'
            style={{ height: '2rem' }}
          />
        </div> */}
        <div
          style={{
					  backgroundColor: 'white',
					  borderRadius: '15px',
					  padding: '2rem',
					  width: 'fit-content',
					  display: 'flex',
					  flexDirection: 'column',
					  justifyContent: 'center',
					  alignItems: 'center',
					  position: 'absolute',
					  left: '40%',
					  top: '29%'
          }}
        >
          <h5 style={{ fontWeight: 'bold' }}>
            {t('formularios>formulario_respuestas>formulario_enviado', 'Formulario enviado con éxito')}
          </h5>
          <img src='/assets/img/FinishedSurveySvg.svg' />
          <br />
          <p>
            {t('formularios>formulario_respuestas>formulario_enviado_exito', 'Se ha enviado su respuesta con éxito')}
            <br />
          </p>
          <Button
            color='primary'
            onClick={() => {
						  history.push('/app')
            }}
          >
            {t('formularios>formulario_respuestas>ir_a_la_plataforma', 'Ir a la plataforma')}
          </Button>
        </div>
      </div>
    )
  }

  return (
    <>
      {snackBar(snackbarContent.variant, snackbarContent.msg)}
      <Modal isOpen={!allowComplete}>
        <ModalHeader>
          {showWelcomeMessage ? t('formularios>formulario_respuestas>bienvenido', 'Bienvenido') : t('formularios>formulario_respuestas>password', 'Contraseña')}
        </ModalHeader>
        <ModalBody>
          {!showWelcomeMessage
            ? (
              <>
                <p>{t('formularios>formulario_respuestas>introducir_password', 'Introduzca su contraseña')}</p>
                <Input
                  vlaue={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </>
              )
            : (
              <FroalaEditorView
                model={form.configuracion?.mensajeBienvenida}
              />
              )}
          <br />
          <Button
            color='primary'
            onClick={() => {
						  if (!allowComplete && !showWelcomeMessage) {
						    if (password === form.configuracion.clave) {
						      if (
						        form.configuracion.mensajeBienvenida &&
										!showWelcomeMessage
						      ) {
						        setShowWelcomeMessage(true)
						      } else {
						        setAllowComplete(true)
						      }
						    } else {
						      handleSnackBarShow(
						        'Clave incorrecta',
						        'error'
						      )
						    }
						  }
						  if (showWelcomeMessage) {
						    setAllowComplete(true)
						  }
            }}
          >
            Entrar
          </Button>
        </ModalBody>
      </Modal>
      {form.configuracion?.oneByOne
        ? (
          <ResponseForm
            actions={actions}
            state={state}
            setEnded={setEnded}
            form={form}
            setForm={setForm}
            questionsArray={questionsArray}
            setQuestionsArray={setQuestionsArray}
            loading={loading}
            previewTheme={props.previewTheme}
            {...props}
          />
          )
        : (
          <ResponseFormList
            actions={actions}
            state={state}
            form={form}
            setForm={setForm}
            setEnded={setEnded}
            questionsArray={questionsArray}
            setQuestionsArray={setQuestionsArray}
            previewTheme={props.previewTheme}
            loading={loading}
            {...props}
          />
          )}
    </>
  )
}

export default withRouter(Index)
