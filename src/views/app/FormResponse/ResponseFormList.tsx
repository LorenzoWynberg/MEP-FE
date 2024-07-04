import React, { useState, useEffect, useRef } from 'react'
import { Grid, Typography, LinearProgress, withStyles, Tooltip } from '@material-ui/core'
import { Modal, ModalHeader, ModalBody } from 'reactstrap'
import './styles.scss'
import useNotification from 'Hooks/useNotification'
import styled from 'styled-components'
import FroalaEditorView from 'react-froala-wysiwyg/FroalaEditorView'
import Loader from 'Components/Loader'

import colors from 'Assets/js/colors'
import Question from './Question'
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined'
import ArrowBackIcon from '@material-ui/icons/ArrowBack'
import { arr_diff, union_arrays, isEmail } from './utils'
import { useParams } from 'react-router-dom'
import moment from 'moment'

import { useHistory } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

const ResponseForm = (props) => {
  const { print } = useParams()

  const fullPageRef = useRef(null)
  const { t } = useTranslation()
  const [formResponse, setResponseForm] = useState({})
  const [snackBar, handleSnackBarClick] = useNotification()
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(null)
  const [started, setStarted] = useState(null)
  const [avoidRenderFrom, setAvoidRenderFrom] = useState(null)
  const history = useHistory()

  const [snackbarContent, setSnacbarContent] = useState({
    msg: 'welcome',
    variant: 'info'
  })
  const [tooltipOpens, setTooltipOpens] = useState(false)
  const [currentErrors, setCurrentErrors] = useState<{ [key: string]: any }>(
    {}
  )
  const [questionsRefs, setQuestionsRefs] = useState<{ [key: string]: any }>(
    {}
  )
  const [loadingQuestions, setLoadingQuestions] = useState(false)
  const [parsedQuestionsArray, setParsedQuestionsArray] = useState([])
  const [autoSaveInteractionsInterval, setAutoSaveInteractionsInterval] =
    useState(null)
  const [questionChangeInterval, setQuestionChangeInterval] = useState(null)
  const [autoSaveLoading, setAutoSaveLoading] = useState(false)
  const [finished, setFinished] = useState(false)
  const [finisheds, setFinisheds] = useState(false)
  const [activeQuestion, setActiveQuestion] = useState({ parent: {} })
  const [avoidToShowQuestions, setAvoidToShowQuestions] = useState([])
  const {
    actions,
    state,
    form,
    setForm,
    questionsArray,
    setQuestionsArray,
    loading
  } = props
  const fechaN = moment(new Date()).format('LLL')
  const fechaInicio = moment(form.configuracion?.fechaHoraInicio).format('LLL')
  const fechaFin = moment(form.configuracion?.fechaHoraFin).format('LLL')
  const toggles = () => setTooltipOpens(!tooltipOpens)

  const handleMsesaje = () => {
    setFinisheds(true)
  }
  const CustomLinearProgress = withStyles({
    bar: {
      backgroundColor: state.currentFormTheme?.colorTexto,
      height: 5.5
    },
    thumb: {
      backgroundColor: 'red',
      height: 10,
      width: 10,
      marginTop: -2
    },
    colorPrimary: {
      backgroundColor: '#908c91'
    }
  })(LinearProgress)

  const HtmlTooltip = withStyles((theme) => ({
    tooltip: {
      backgroundColor: '#fff',
      color: 'rgba(0, 0, 0, 0.87)',
      maxWidth: 220,
      fontSize: theme.typography.pxToRem(12),
      fontFamily: state?.currentFormTheme?.font || 'inherit',
      border: `2px solid ${colors.primary}`
    }
  }))(Tooltip)

  const getCurrentQuestion = () => currentQuestionIndex

  const handleKeyEvent = (e, array) => {
    const idx = getCurrentQuestion()
    handleKeyPress(e, array[idx])
  }

  useEffect(() => {
    const _form = !state.currentResponse?.respuesta
      ? {}
      : JSON.parse(
        state.currentResponse?.autoguardadoRespuesta ||
        state.currentResponse?.respuesta
      )
    setResponseForm(_form || {})
  }, [state.currentResponse])

  useEffect(() => {
    if (currentQuestionIndex || currentQuestionIndex === 0) {
      const newQuestions = questionsArray.filter((el) => {
        return (
          el.parent.id ==
          form.questionContainers[currentQuestionIndex].id
        )
      })
      if (
        newQuestions.length < 1 &&
        form.questionContainers[currentQuestionIndex + 1]
      ) {
        setCurrentQuestionIndex(currentQuestionIndex + 1)
      } else {
        setParsedQuestionsArray(newQuestions)
      }
    }
  }, [currentQuestionIndex, formResponse, questionsArray])

  const handleSnackBarShow = (msg: string, variant: string) => {
    setSnacbarContent({
      variant,
      msg
    })
    handleSnackBarClick()
  }

  const returnASrray = (el) => {
    return Array.isArray(el) ? el : [el]
  }

  const onChange = (target: any, question: any) => {
    const _form = { ...formResponse }
    const formParsed = {}

    if (
      question.options &&
      question.options.some((el) => el.section || el.question)
    ) {
      const arrayTarget = returnASrray(target)
      const diff = formResponse[question.id]?.respuesta
        ? arr_diff(
          arrayTarget,
          returnASrray(formResponse[question.id].respuesta)
        )
        : null
      const newValue = question.options[target]
        ? target
        : arr_diff(
          arrayTarget,
          returnASrray(formResponse[question.id].respuesta)
        )
      if (
        question.options[newValue].section &&
        question.options[newValue].section?.label ===
        'Enviar formulario'
      ) {
        setFinished(true)
      } else if (
        formResponse[question.id] &&
        formResponse[question.id].respuesta &&
        !question.type === 'radio'
      ) {
        const _baseForm = { ...form }
        let isAfterId = false
        const newArray = _baseForm.questionContainers.reduce(
          (acumulator, currentValue) => {
            let isAfterIdContainer = false
            if (_baseForm.questions[currentValue.id]) {
              return [
                ...acumulator,
                ..._baseForm.questions[currentValue.id]
                  .filter((el) => {
                    if (
                      question.options[newValue].question
                        ?.value == el.id
                    ) {
                      isAfterIdContainer = false
                      isAfterId = false
                      return true
                    }
                    if (isAfterIdContainer || isAfterId) {
                      return false
                    }
                    if (
                      el.id === question.id &&
                      question.options[newValue].question
                    ) {
                      isAfterIdContainer = true
                      isAfterId = true
                      return isAfterIdContainer
                    }
                    return true
                  })
                  .map((el) => {
                    return { ...el, parent: currentValue }
                  })
              ]
            }
            return acumulator
          },
          []
        )
        const newArrayMapped = newArray.map((el) => el.id)
        Object.keys(_form).forEach((element) => {
          if (newArrayMapped.includes(element)) {
            formParsed[element] = _form[element]
          }
        })
        const newArrayMerged = union_arrays(
          newArray.map((el) => el.idx),
          questionsArray.map((el) => el.idx)
        )
        const questionsPool = _baseForm.questionContainers.reduce(
          (acumulator, currentValue) => {
            if (_baseForm.questions[currentValue.id]) {
              return [
                ...acumulator,
                ..._baseForm.questions[currentValue.id].map(
                  (el) => {
                    return { ...el, parent: currentValue }
                  }
                )
              ]
            }
            return acumulator
          },
          []
        )
        if (target.length === 0) {
          setAvoidRenderFrom(question.idx)
          const newArrayValue = form.questionContainers.reduce(
            (acumulator, currentValue) => {
              if (form.questions[currentValue.id]) {
                return [
                  ...acumulator,
                  ...form.questions[currentValue.id].map(
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
          setQuestionsArray(newArrayValue)
        } else if (diff !== null && !target.includes(diff[0])) {
          const _newValue = arr_diff(
            newArrayMerged,
            newArray.map((el) => el.idx)
          )
          setAvoidRenderFrom(null)
          setQuestionsArray(
            questionsPool.filter(
              (el) =>
                !_newValue.includes(el.idx) &&
                questionsArray
                  .map((el) => el.idx)
                  .includes(el.idx)
            )
          )
        } else {
          setAvoidRenderFrom(null)
          setQuestionsArray(
            questionsPool.filter((el) =>
              newArrayMerged.includes(el.idx)
            )
          )
        }
      } else if (question.options[newValue].question) {
        const _baseForm = { ...form }
        let isAfterId = false
        let questionsToAvoid = [...avoidToShowQuestions]
        const newArray = _baseForm.questionContainers.reduce(
          (acumulator, currentValue) => {
            let isAfterIdContainer = false

            if (_baseForm.questions[currentValue.id]) {
              return [
                ...acumulator,
                ..._baseForm.questions[currentValue.id]
                  .filter((el) => {
                    const _options = question.options
                      ? Object.keys(
                        question.options
                      ).filter(
                        (el) =>
                          question.options[el]
                            .question
                      )
                      : []
                    if (
                      question.options &&
                      _options.length > 1
                    ) {
                      if (question.type === 'radio') {
                        _options.forEach((i) => {
                          if (
                            parseInt(i) === target
                          ) {
                            questionsToAvoid =
                              questionsToAvoid.filter(
                                (item) =>
                                  item !==
                                  question
                                    .options[
                                    target
                                  ].question
                                    .value
                              )
                          } else if (
                            parseInt(i) !==
                            target &&
                            !questionsToAvoid.includes(
                              question.options[
                                target
                              ].question.value
                            )
                          ) {
                            questionsToAvoid.push(
                              question.options[i]
                                .question.value
                            )
                          }
                        })
                      } else {
                        _options.forEach((i) => {
                          if (
                            target.includes(
                              parseInt(i)
                            )
                          ) {
                            questionsToAvoid =
                              questionsToAvoid.filter(
                                (item) =>
                                  item !==
                                  question
                                    .options[
                                    i
                                  ].question
                                    ?.value
                              )
                          } else if (
                            !target.includes(
                              parseInt(i)
                            ) &&
                            !target.some((tI) =>
                              questionsToAvoid.includes(
                                question
                                  .options[tI]
                                  .question
                                  .value
                              )
                            )
                          ) {
                            questionsToAvoid.push(
                              question.options[i]
                                .question.value
                            )
                          }
                        })
                      }
                    } else {
                      if (
                        question.options[newValue]
                          .question.value == el.id
                      ) {
                        isAfterIdContainer = false
                        isAfterId = false
                        return true
                      }
                      if (
                        isAfterIdContainer ||
                        isAfterId
                      ) {
                        return false
                      }
                      if (
                        el.id === question.id &&
                        question.options[newValue]
                          .question
                      ) {
                        isAfterIdContainer = true
                        isAfterId = true
                        return isAfterIdContainer
                      }
                    }
                    return true
                  })
                  .map((el) => {
                    return { ...el, parent: currentValue }
                  })
              ]
            }
            return acumulator
          },
          []
        )
        const newArrayMapped = newArray.map((el) => el.id)
        Object.keys(_form).forEach((element) => {
          if (newArrayMapped.includes(element)) {
            formParsed[element] = _form[element]
          }
        })
        setAvoidRenderFrom(null)
        setQuestionsArray(newArray)

        setAvoidToShowQuestions(questionsToAvoid)
      } else {
        const _baseForm = { ...form }
        let isAfterId = false
        const newArray = _baseForm.questionContainers.reduce(
          (acumulator, currentValue) => {
            if (
              currentValue.id ==
              question.options[newValue].section?.value ||
              question.options[newValue].section?.value === '0'
            ) {
              isAfterId = false
            }
            let isAfterIdContainer = false

            if (_baseForm.questions[currentValue.id]) {
              return [
                ...acumulator,
                ..._baseForm.questions[currentValue.id]
                  .filter((el) => {
                    if (isAfterIdContainer || isAfterId) {
                      return false
                    }
                    if (
                      el.id === question.id &&
                      question.options[newValue].section
                    ) {
                      isAfterIdContainer = true
                      isAfterId = true
                      return isAfterIdContainer
                    }
                    return true
                  })
                  .map((el) => {
                    return { ...el, parent: currentValue }
                  })
              ]
            }
            return acumulator
          },
          []
        )
        const newArrayMapped = newArray.map((el) => el.id)
        Object.keys(_form).forEach((element) => {
          if (newArrayMapped.includes(element)) {
            formParsed[element] = _form[element]
          }
        })
        setAvoidRenderFrom(null)

        setQuestionsArray(newArray)
      }
      formParsed[question.id] = {
        id: question?.id,
        etiqueta: question?.label,
        respuesta: target,
        tipo: question?.type
      }
      setResponseForm(formParsed)
    } else {
      _form[question.id] = {
        id: question?.id,
        etiqueta: question?.label,
        respuesta: target,
        tipo: question?.type
      }
      setResponseForm(_form)
    }
  }

  const handleAutoSave = (autoSaveForm) => {
    clearTimeout(autoSaveInteractionsInterval)
    setAutoSaveInteractionsInterval(
      setTimeout(() => {
        if (props.previewTheme || props.previewTheme) return
        handleOnSubmitResponse(true)
      }, 800)
    )
  }

  const handleOnResolveQuestion = (question, value) => {
    if (props.previewTheme) return
    const questionValidations = validations(question, value)
    setCurrentErrors(questionValidations)
    if (!questionValidations.error) {
      if (
        questionsArray[currentQuestionIndex + 1] &&
        questionsRefs[currentQuestionIndex + 1]
      ) {
        setCurrentQuestionIndex(currentQuestionIndex + 1)
        handleScroll(currentQuestionIndex + 1)
        clearTimeout(questionChangeInterval)
        setQuestionChangeInterval(
          setTimeout(() => {
            if (props.preview || props.previewTheme) return
            handleAutoSave(formResponse)
          }, 800)
        )
      } else {
        setFinished(true)
      }
    }
  }
  const handleClickOutDate = () => {
    handleSnackBarShow(t('formularios>formulario_respuestas>debe_espera', 'Debe esperar a que sea la hora de inicio'), 'error')
  }
  const handleOnSubmitResponse = async (
    autoSave: boolean,
    terminado: boolean = false
  ) => {
    if (props.preview) return props.history.push(`/forms/edit/${form.id}`)
    if (autoSave) {
      setAutoSaveLoading(true)
    }

    const data = {
      terminado,
      respuesta: JSON.stringify(formResponse)
    }

    let response = null

    if (!autoSave) {
      response = await actions.updateResponseForm(
        state.currentResponse.id,
        data
      )
      if (response.error) {
        handleSnackBarShow(t('formularios>formulario_respuestas>error_formulario', 'Error de respuesta de formulario'), 'error')
      } else {
        handleSnackBarShow(
          t('formularios>formulario_respuestas>formulario_guardado', 'Respuesta de formulario guardado'),
          'success'
        )
      }
    } else {
      response = await actions.autoSaveResponseForm(
        state.currentResponse.id,
        data
      )
    }
  }

  const validations = (question, value) => {
    const validationErrors: { [key: string]: any } = {}
    if (
      !avoidToShowQuestions.includes(question.id) &&
      question.config.required &&
      value !== 0 &&
      (!value ||
        value == '' ||
        value == {} ||
        value == [] ||
        value == undefined)
    ) {
      validationErrors.error = true
      validationErrors.required = true
      return validationErrors
    }

    switch (question.type) {
      case 'text':
        if (
          question.config.charLimits &&
          value.respuesta.length < parseInt(question.config.min)
        ) {
          validationErrors.error = true
          validationErrors.min = parseInt(question.config.min)
        }
        if (
          value &&
          typeof value.respuesta === 'string' &&
          value.respuesta.trim() == ''
        ) {
          validationErrors.error = true
          validationErrors.required = true
        }

        if (question.config.isEmail && !isEmail(value?.respuesta)) {
          validationErrors.error = true
          validationErrors.email = true
        }
        break
      case 'textargetnputs':
        if (question.config.required) {
          if (value && value.respuesta) {
            const responses = Object.keys(value.respuesta)

            if (
              Array.isArray(responses) &&
              question.options.length != responses.length
            ) {
              validationErrors.error = true
              validationErrors.required = true
            }

            const fieldsLost = []

            responses.map((x) => {
              if (value.respuesta[x].respuesta == '') {
                fieldsLost.push(x)
              }
            })

            if (fieldsLost.length > 0) {
              validationErrors.error = true
              validationErrors.required = true
            }
          } else {
            validationErrors.error = true
            validationErrors.required = true
          }
        }
        break

      case 'percentage':
        const _value = value.respuesta.reduce(
          (accumulator, currentValue) =>
            parseInt(accumulator) + parseInt(currentValue)
        )
        if (question.config.requiredHundred) {
          if (_value < 100) {
            validationErrors.error = true
            validationErrors.hundred = true
          }
        }
        if (_value > 100) {
          validationErrors.error = true
          validationErrors.hundred = true
        }
        break
      // case "checklist":
      // case "radio":
      //   if (question.config.required && value == []) {
      //     validationErrors.error = true
      //     validationErrors.required = true
      //   }
      default:
        break
    }

    return validationErrors
  }

  const handleKeyPress = (target: any, question) => {
    if (target.charCode == 13 && question) {
      handleOnResolveQuestion(question, formResponse[question.id])
    }
  }

  const getQuestionsLenght = () => {
    return questionsArray.length
  }

  const handleScroll = (idx) => {
    questionsRefs[idx] &&
      questionsRefs[idx].current.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      })
  }
  const validateView = () => {
    const errors = {}
    let hasError
    parsedQuestionsArray.forEach((el) => {
      const elementErrors = validations(el, formResponse[el.id])
      errors[el.id] = elementErrors
      if (elementErrors.error) {
        hasError = true
      }
    })
    setCurrentErrors(errors)
    return hasError
  }

  if (state.themeLoading) return <Loader />
  return (
    <div
      style={{
        position: 'relative',
        fontFamily: state.currentFormTheme?.font || 'inherit',
        display: 'flex',
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      {(props.previewTheme || props.preview) && (
        <ButtonStyled
          className='goBack-button'
          primary
          backgroundColor={
            state.currentFormTheme?.color || colors.primary
          }
          fontFamily={state?.currentFormTheme?.font || 'inherit'}
          onClick={() => {
            if (props.preview) {
                window.history.back()
                setTimeout(() => {
                  window.location.reload()
                }, 300)
            } else {
              props.setPreview(false)
            }
          }}
        >
          <ArrowBackIcon /> {t('formularios>crear_formulario>configuracion>volver', 'Volver')}{' '}
        </ButtonStyled>
      )}
      <div ref={fullPageRef} />
      <Grid
        container
        direction='column'
        alignItems='center'
        className='slideClass'
        style={{
          width: state.currentFormTheme?.imagenFondo ? '100vw' : '',
          height: '100vh',
          alignItems: 'center',
          overflow: 'auto',
          background: state.currentFormTheme?.imagenFondo
            ? `url(${state.currentFormTheme?.imagenFondo})`
            : 'none',
          fontFamily: state?.currentFormTheme?.font || 'inherit'
        }}
      >
        {!started && (
          <StyledDivContainer>
            <div
              style={{
                width: '100%',
                fontFamily:
                  state?.currentFormTheme?.font || 'inherit'
              }}
            >
              <FroalaEditorView model={form.encabezado} />
            </div>
            <div
              style={{
                justifyContent: 'flex-start',
                display: 'flex',
                width: '100%',
                fontFamily:
                  state?.currentFormTheme?.font || 'inherit'
              }}
            >
              <p
                style={{
                  fontWeight: 'bold',
                  fontFamily:
                    state?.currentFormTheme?.font ||
                    'inherit'
                }}
              >
                {t('formularios>formulario_respuestas>descripcion_formulario', 'Descripción del formulario')}:
              </p>
            </div>
            <div
              style={{
                justifyContent: 'flex-start',
                display: 'flex',
                width: '100%',
                fontFamily:
                  state?.currentFormTheme?.font || 'inherit'
              }}
            >
              <FroalaEditorView model={form.descripcion} />
            </div>
            <div
              style={{
                justifyContent: 'flex-start',
                display: 'flex',
                width: '100%',
                fontFamily:
                  state?.currentFormTheme?.font || 'inherit'
              }}
            >
              {snackBar(
                snackbarContent.variant,
                snackbarContent.msg
              )}
              <div>
                {!props.previewTheme && (
                  <ButtonStyled
                    primary
                    backgroundColor={
                      state.currentFormTheme?.color ||
                      colors.primary
                    }
                    fontFamily={
                      state?.currentFormTheme?.font ||
                      'inherit'
                    }
                    textColor={
                      state.currentFormTheme
                        ?.colorTexto || 'white'
                    }
                    onClick={() => {
                      setStarted(true)
                      setCurrentQuestionIndex(0)
                    }}
                  >
                    {t('formularios>formulario_respuestas>comenzar', 'Comenzar')}
                  </ButtonStyled>
                )}
              </div>
              {/* {!props.previewTheme && <ButtonStyled
                  primary
                  backgroundColor={
                    state.currentFormTheme?.color || colors.primary
                  }
                  textColor={state.currentFormTheme?.colorTexto || 'white'}
                  onClick={() => {
                    setStarted(true)
                    setCurrentQuestionIndex(0)
                  }}
                >
                  Comenzar
                </ButtonStyled>} */}
            </div>
          </StyledDivContainer>
        )}
        {started && (
          <StyledDivContainer id='scrollController'>
            <div
              id='responseForms'
              style={{
                borderRadius: '15px',
                width: '100%',
                textAlign: 'center',
                backgroundColor: '#145388',
                minHeight: '10rem',
                color: 'white',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                fontFamily:
                  state?.currentFormTheme?.font || 'inherit'
              }}
            >
              <h1>{form.titulo}</h1>
            </div>
            {currentQuestionIndex >= 0 &&
              form.questionContainers[currentQuestionIndex] && (
                <div
                  style={{
                    borderRadius: '15px',
                    width: '100%',
                    padding: '2rem',
                    position: 'relative',
                    backgroundColor: '#a6d9f2',
                    border: '1px solid #145388',
                    marginTop: '2rem',
                    marginBottom: '2rem',
                    fontFamily:
                      state?.currentFormTheme?.font ||
                      'inherit'
                  }}
                >
                  <p
                    style={{
                      fontFamily:
                        state?.currentFormTheme?.font ||
                        'inherit'
                    }}
                  >
                    {t('formularios>formulario_respuestas>seccion', 'Sección')}{' '}
                    {form.questionContainers[
                      currentQuestionIndex
                    ].idx + 1}{' '}
                    :{' '}
                    {
                      form.questionContainers[
                        currentQuestionIndex
                      ].title
                    }
                    {form.questionContainers[
                      currentQuestionIndex
                    ].tooltip && (
                        <HtmlTooltip
                          title={
                            form.questionContainers[
                              currentQuestionIndex
                            ].tooltipText
                          }
                          placement='right'
                        >
                          <StyledInfoOutlinedIcon />
                        </HtmlTooltip>
                      )}
                  </p>
                  <p
                    style={{
                      fontFamily:
                        state?.currentFormTheme?.font ||
                        'inherit'
                    }}
                  >
                    {
                      form.questionContainers[
                        currentQuestionIndex
                      ].descriptionText
                    }
                  </p>
                </div>
              )}
            {snackBar(snackbarContent.variant, snackbarContent.msg)}
            {!loadingQuestions &&
              parsedQuestionsArray?.map(
                (question, index, array) => {
                  if (
                    avoidRenderFrom !== 0 &&
                    avoidRenderFrom === null &&
                    question.options &&
                    question.options.some(
                      (el) => el.section || el.question
                    ) &&
                    !formResponse[question.id]
                  ) {
                    setAvoidRenderFrom(index)
                  }
                  if (
                    (avoidRenderFrom !== null &&
                      avoidRenderFrom < index) ||
                    avoidToShowQuestions.includes(
                      question.id
                    )
                  ) {
                    return
                  }
                  return (
                    <Question
                      state={state}
                      ButtonStyled={ButtonStyled}
                      displayAll
                      question={question}
                      parent={question.parent}
                      handleOnResolveQuestion={
                        handleOnResolveQuestion
                      }
                      ocultarNumeracionRespuestas={
                        form.configuracion
                          .ocultarNumeracionRespuestas
                      }
                      currentErrors={currentErrors}
                      handleKeyPress={handleKeyPress}
                      formResponse={formResponse}
                      onChange={onChange}
                      questionsRefs={questionsRefs}
                      setQuestionRef={(value) =>
                        (questionsRefs[index] = value)}
                      {...props}
                    />
                  )
                }
              )}
            <div
              style={{
                display: 'flex',
                justifyContent: 'flex-start',
                width: '100%',
                fontFamily:
                  state?.currentFormTheme?.font || 'inherit'
              }}
            >
              {form.questionContainers[
                currentQuestionIndex + 1
              ] &&
                started && (
                  <ButtonStyled
                    primary
                    backgroundColor={
                      state.currentFormTheme?.color ||
                      colors.primary
                    }
                    fontFamily={
                      state?.currentFormTheme?.font ||
                      'inherit'
                    }
                    onClick={() => {
                      const errors = validateView()
                      if (!errors) {
                        setCurrentQuestionIndex(
                          currentQuestionIndex + 1
                        )
                      }
                    }}
                  >
                    Siguiente
                  </ButtonStyled>
                )}

              {!form.questionContainers[
                currentQuestionIndex + 1
              ] &&
                started && (
                  <ButtonStyled
                    primary
                    backgroundColor={
                      state.currentFormTheme?.color ||
                      colors.primary
                    }
                    fontFamily={
                      state?.currentFormTheme?.font ||
                      'inherit'
                    }
                    onClick={() => {
                      const errors = validateView()
                      if (!errors) {
                        setFinished(true)
                      }
                    }}
                  >
                    {t('formularios>formulario_respuestas>enviar_formulario', 'Enviar formulario')}
                  </ButtonStyled>
                )}
            </div>
          </StyledDivContainer>
        )}
      </Grid>
      <Modal isOpen={finished}>
        <ModalHeader>{t('ormularios>crear_formulario>configuracion>finalizado', 'Finalizado')}</ModalHeader>
        <ModalBody>
          <FroalaEditorView
            model={form.configuracion?.mensajeAgradecimiento}
          />
          <ButtonStyled
            primary
            backgroundColor={
              state.currentFormTheme?.color || colors.primary
            }
            fontFamily={state?.currentFormTheme?.font || 'inherit'}
            onClick={() => {
              handleOnSubmitResponse(false, true)
              props.setEnded(true)
            }}
          >
            {t('general>aceptar', 'Aceptar')}
          </ButtonStyled>
        </ModalBody>
      </Modal>
      <Modal isOpen={finisheds}>
        <ModalHeader>
          {t('formularios>formulario_respuestas>tiempo_terminado', 'El tiempo se ha terminado, se enviara con las respuestas actuales.')}
        </ModalHeader>
        <ModalBody>
          <FroalaEditorView
            model={form.configuracion?.mensajeAgradecimiento}
          />
          <ButtonStyled
            primary
            backgroundColor={
              state.currentFormTheme?.color || colors.primary
            }
            fontFamily={state?.currentFormTheme?.font || 'inherit'}
            onClick={() => {
              handleOnSubmitResponse(false, true)
              props.setEnded(true)
            }}
          >
            {t('general>aceptar', 'Aceptar')}
          </ButtonStyled>
        </ModalBody>
      </Modal>
    </div>
  )
}

const ButtonStyled = styled.div`
	background-color: white;
	border: 1.5px solid ${(props) => props.backgroundColor};
	width: ${(props) => (props.avoidWidth ? props.avoidWidth : '7rem')};
	height: 2.7rem;
	text-align: center;
	justify-content: center;
	align-items: center;
	cursor: pointer;
	${(props) =>
    props.primary
      ? `background-color: ${props.backgroundColor};
  color: white;`
      : ''}
	display: flex;
	border-radius: ${(props) => (props.buttonController ? '5px' : '26px')};
	&:hover {
		background-color: ${(props) => props.backgroundColor};
	}
`

const StyledInfoOutlinedIcon = styled(InfoOutlinedIcon)`
	font-size: 1.2rem;
	margin-left: 5px;
`

const StyledDivContainer = styled.div`
	height: auto;
	width: 50vw;
	display: flex;
	flex-direction: column;
	align-items: center;
	box-shadow: 0px 0px 6px 1px rgba(0, 0, 0, 0.35);
	border-radius: 15px;
	padding: 1rem;
	background-color: white;
	margin-top: 4rem;
	@media (max-width: 1024px) {
		width: 90vw;
	}
`

export default ResponseForm
