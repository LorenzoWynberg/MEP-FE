import React, { useState, useEffect, useRef } from 'react'
import withRouter from 'react-router-dom/withRouter'

import { Grid, Typography, LinearProgress, withStyles, Tooltip } from '@material-ui/core'
import { Modal, ModalHeader, ModalBody } from 'reactstrap'
import './styles.scss'
import useNotification from 'Hooks/useNotification'
import styled from 'styled-components'
import FroalaEditorView from 'react-froala-wysiwyg/FroalaEditorView'
import Loader from 'Components/Loader'

import colors from 'Assets/js/colors'
import ExpandLessIcon from '@material-ui/icons/ExpandLess'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import Question from './Question'
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined'
import ArrowBackIcon from '@material-ui/icons/ArrowBack'
import { arr_diff, union_arrays, isEmail } from './utils'
import { useHistory } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

const ResponseForm = (props) => {
  const fullPageRef = useRef(null)
  const [formResponse, setResponseForm] = useState({})
  const [snackBar, handleSnackBarClick] = useNotification()
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(null)
  const history = useHistory()
  const { t } = useTranslation()
  const [snackbarContent, setSnacbarContent] = useState({
    msg: 'welcome',
    variant: 'info'
  })
  const [currentErrors, setCurrentErrors] = useState<{ [key: string]: any }>(
    {}
  )
  const [questionsRefs, setQuestionsRefs] = useState<{ [key: string]: any }>(
    {}
  )
  const [loadingQuestions, setLoadingQuestions] = useState(false)
  const [autoSaveInteractionsInterval, setAutoSaveInteractionsInterval] =
    useState(null)
  const [questionChangeInterval, setQuestionChangeInterval] = useState(null)
  const [autoSaveLoading, setAutoSaveLoading] = useState(false)
  const [avoidToShowQuestions, setAvoidToShowQuestions] = useState([])

  const [finished, setFinished] = useState(false)

  const {
    actions,
    state,
    form,
    setForm,
    questionsArray,
    setQuestionsArray,
    loading
  } = props

  const CustomLinearProgress = withStyles({
    bar: {
      backgroundColor: state?.currentFormTheme?.colorTexto,
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

  function disableScrolling() {
    const scrollController = document.getElementById('scrollController')
    if (scrollController) {
      scrollController.style.overflow = 'hidden'
    }
  }

  function enableScrolling() {
    const scrollController = document.getElementById('scrollController')
    if (scrollController) {
      scrollController.style.overflow = 'auto'
    }
  }

  useEffect(() => {
    disableScrolling()
  }, [])

  useEffect(() => {
    const _form = !state?.currentResponse?.respuesta
      ? {}
      : JSON.parse(
        state?.currentResponse?.autoguardadoRespuesta ||
        state?.currentResponse?.respuesta
      )
    setResponseForm(_form || {})
  }, [state?.currentResponse])

  useEffect(() => {
    if (currentQuestionIndex >= 0) {
      window.addEventListener('keypress', (e) =>
        handleKeyEvent(e, questionsArray)
      )
    }
    return () => {
      window.removeEventListener('keypress', (e) =>
        handleKeyEvent(e, questionsArray)
      )
    }
  }, [currentQuestionIndex, formResponse])

  const goPrev = (prevIndex = 1) => {
    if (props.previewTheme) return

    if (
      !avoidToShowQuestions.includes(
        questionsArray[currentQuestionIndex - prevIndex].id
      )
    ) {
      enableScrolling()
      setCurrentQuestionIndex(currentQuestionIndex - prevIndex)
      handleScroll(currentQuestionIndex - prevIndex)
      setTimeout(() => {
        disableScrolling()
      }, 1050)
    } else {
      goPrev(prevIndex + 1)
    }
  }

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
      }, 1050)
    )
  }

  const handleOnResolveQuestion = (question, value, nextIndex = 1) => {
    if (props.previewTheme) return
    const questionValidations = validations(question, value)

    setCurrentErrors(questionValidations)
    if (!questionValidations.error) {
      if (
        questionsArray[currentQuestionIndex + nextIndex] &&
        questionsRefs[currentQuestionIndex + nextIndex] &&
        !avoidToShowQuestions.includes(
          questionsArray[currentQuestionIndex + nextIndex].id
        )
      ) {
        enableScrolling()
        setCurrentQuestionIndex(currentQuestionIndex + nextIndex)
        handleScroll(currentQuestionIndex + nextIndex)
        clearTimeout(questionChangeInterval)
        setQuestionChangeInterval(
          setTimeout(() => {
            if (props.preview || props.previewTheme) return
            handleAutoSave(formResponse)
          }, 1050)
        )
        setTimeout(() => {
          disableScrolling()
        }, 1050)
      } else if (
        avoidToShowQuestions.includes(
          questionsArray[currentQuestionIndex + nextIndex].id
        )
      ) {
        handleOnResolveQuestion(question, value, nextIndex + 1)
      } else {
        setFinished(true)
      }
    }
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
        state?.currentResponse.id,
        data
      )
      if (response.error) {
        handleSnackBarShow(t('formularios>formulario_respuestas>error_formulari', 'Error de respuesta de formulario'), 'error')
      } else {
        handleSnackBarShow(
          t('formularios>formulario_respuestas>formulario_guardado', 'Respuesta de formulario guardado'),
          'success'
        )
      }
    } else {
      response = await actions.autoSaveResponseForm(
        state?.currentResponse.id,
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
        if (question.config.charLimits) {
          if (value.length < parseInt(question.config.min)) {
            validationErrors.error = true
            validationErrors.min = question.config.min
          }
          if (value.length < parseInt(question.config.max)) {
            validationErrors.error = true
            validationErrors.max = question.config.max
          }
        }

        if (question.config.isEmail && !isEmail(value?.respuesta)) {
          validationErrors.error = true
          validationErrors.email = true
        }
        break
      case 'textInputs':
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
      case 'percentage':
        if (question.config.requiredHundred) {
          const _value = value.respuesta.reduce(
            (accumulator, currentValue) =>
              parseInt(accumulator) + parseInt(currentValue)
          )
          if (_value < 100) {
            validationErrors.error = true
            validationErrors.hundred = true
          }
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
        block: 'start'
      })
  }

  if (state?.themeLoading) return <Loader />

  return (
    <div
      style={{
        position: 'relative',
        fontFamily: state?.currentFormTheme?.font || 'inherit',
        display: 'flex'
      }}
    >
      {(props.previewTheme || props.preview) && (
        <ButtonStyled
          className='goBack-button'
          primary
          backgroundColor={
            state?.currentFormTheme?.color || colors.primary
          }
          style={{
            fontFamily: state?.currentFormTheme?.font || 'inherit'
          }}
          onClick={() => {
            
            if (props.preview) {
              history.goBack()
            } else {
              props.setPreview(false)
            }
          }}
        >
          <ArrowBackIcon /> {t('formularios>crear_formulario>configuracion>volver', 'Volver')}{' '}
        </ButtonStyled>
      )}
      <div ref={fullPageRef} />
      {state?.currentFormTheme?.imagenFondo && (
        <div
          className='slideClass'
          style={{
            minHeight: '100vh',
            width: '50vw',
            position: 'relative',
            background: state?.currentFormTheme?.imagenFondo
              ? `url(${state?.currentFormTheme?.imagenFondo})`
              : 'none',
            fontFamily: state?.currentFormTheme?.font || 'inherit'
          }}
        />
      )}
      <div>
        {currentQuestionIndex >= 0 &&
          questionsArray &&
          questionsArray[currentQuestionIndex] && (
            <div
              style={{
                borderRadius: '15px',
                padding: '2rem',
                overflow: 'auto',
                width: '100%',
                fontFamily:
                  state?.currentFormTheme?.font || 'inherit'
              }}
            >
              <Typography>
                Sección{' '}
                {questionsArray[currentQuestionIndex]?.parent
                  .idx + 1}{' '}
                :{' '}
                {
                  questionsArray[currentQuestionIndex]?.parent
                    .title
                }
                {questionsArray[currentQuestionIndex]?.parent
                  .tooltip && (
                    <HtmlTooltip
                      title={
                        questionsArray[currentQuestionIndex]
                          ?.parent.tooltipText
                      }
                      placement='right'
                    >
                      <StyledInfoOutlinedIcon />
                    </HtmlTooltip>
                  )}
              </Typography>
              <p>
                {
                  questionsArray[currentQuestionIndex]?.parent
                    .descriptionText
                }
              </p>
            </div>
          )}
        <div
          id='scrollController'
          style={{
            height: currentQuestionIndex !== null ? '50' : '',
            maxHeight: '80vh',
            width: '100%',
            padding: '2rem',
            overflow: 'auto',
            fontFamily: state?.currentFormTheme?.font || 'inherit'
          }}
        >
          <div
            style={{
              height: '100%',
              marginBottom: '2rem',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily:
                state?.currentFormTheme?.font || 'inherit'
            }}
          >
            <div
              style={{
                width: '50vw',
                padding: '1rem'
              }}
            >
              <div
                style={{
                  width: '100%',
                  fontFamily:
                    state?.currentFormTheme?.font ||
                    'inherit'
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
                    state?.currentFormTheme?.font ||
                    'inherit'
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
                  Descripción del formulario:
                </p>
              </div>
              <div
                style={{
                  justifyContent: 'flex-start',
                  display: 'flex',
                  width: '100%',
                  fontFamily:
                    state?.currentFormTheme?.font ||
                    'inherit'
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
                    state?.currentFormTheme?.font ||
                    'inherit'
                }}
              >
                {!props.previewTheme && (
                  <ButtonStyled
                    primary
                    backgroundColor={
                      state?.currentFormTheme?.color ||
                      colors.primary
                    }
                    textColor={
                      state?.currentFormTheme
                        ?.colorTexto || 'white'
                    }
                    style={{
                      fontFamily:
                        state?.currentFormTheme?.font ||
                        'inherit'
                    }}
                    onClick={() => {
                      enableScrolling()
                      setCurrentQuestionIndex(0)
                      handleScroll(0)
                      setTimeout(() => {
                        disableScrolling()
                      }, 850)
                    }}
                  >
                    Comenzar
                  </ButtonStyled>
                )}
              </div>
            </div>
          </div>
          {snackBar(snackbarContent.variant, snackbarContent.msg)}
          {!loadingQuestions &&
            questionsArray?.map((question, index, array) => {
              if (avoidToShowQuestions.includes(question.id)) {
                return
              }
              return (
                <Question
                  state={state}
                  ButtonStyled={ButtonStyled}
                  question={question}
                  parent={question.parent}
                  ocultarNumeracionRespuestas={
                    form.configuracion
                      .ocultarNumeracionRespuestas
                  }
                  handleOnResolveQuestion={
                    handleOnResolveQuestion
                  }
                  currentErrors={currentErrors}
                  handleKeyPress={handleKeyPress}
                  formResponse={formResponse}
                  onChange={onChange}
                  questionsRefs={questionsRefs}
                  setQuestionRef={(value) =>
                    (questionsRefs[index] = value)}
                  isLast={index === questionsArray.length - 1}
                  {...props}
                />
              )
            })}
        </div>
      </div>
      {!loadingQuestions && !finished && currentQuestionIndex !== null && (
        <div className='button-pagination'>
          <div
            style={{
              display: 'flex',
              width: '100%',
              justifyContent: 'center',
              fontFamily:
                state?.currentFormTheme?.font || 'inherit'
            }}
          >
            <div
              style={{
                width: '20rem',
                backgroundColor:
                  state?.currentFormTheme?.color ||
                  colors.primary,
                padding: '12px',
                borderRadius: '12px',
                color:
                  state?.currentFormTheme?.colorTexto ||
                  'white',
                textAlign: 'left',
                marginRight: '12px',
                fontFamily:
                  state?.currentFormTheme?.font || 'inherit'
              }}
            >
              {Object.keys(formResponse).length} respondidas{' '}
              {getQuestionsLenght()}
              <CustomLinearProgress
                variant='determinate'
                value={
                  (Object.keys(formResponse).length /
                    getQuestionsLenght()) *
                  100
                }
              />
            </div>
            {currentQuestionIndex >= 1 && (
              <ButtonStyled
                buttonController
                avoidWidth='4rem'
                className='enter-btn'
                textColor={
                  state?.currentFormTheme?.colorTexto ||
                  'white'
                }
                backgroundColor={
                  state?.currentFormTheme?.color ||
                  colors.primary
                }
                style={{
                  backgroundColor:
                    state?.currentFormTheme?.color ||
                    colors.primary,
                  marginRight: '12px',
                  fontFamily:
                    state?.currentFormTheme?.font ||
                    'inherit'
                }}
                onClick={() => goPrev()}
              >
                <ExpandLessIcon
                  fontSize='large'
                  style={{
                    color:
                      state?.currentFormTheme
                        ?.colorTexto || 'white'
                  }}
                />
              </ButtonStyled>
            )}
            <ButtonStyled
              buttonController
              avoidWidth='4rem'
              className='enter-btn'
              textColor={
                state?.currentFormTheme?.colorTexto || 'white'
              }
              backgroundColor={
                state?.currentFormTheme?.color || colors.primary
              }
              style={{
                backgroundColor:
                  state?.currentFormTheme?.color ||
                  colors.primary,
                fontFamily:
                  state?.currentFormTheme?.font || 'inherit'
              }}
              onClick={() =>
                handleOnResolveQuestion(
                  questionsArray[currentQuestionIndex],
                  questionsArray[currentQuestionIndex]
                    ? formResponse[
                    questionsArray[
                      currentQuestionIndex
                    ].id
                    ]
                    : null
                )}
            >
              <ExpandMoreIcon
                fontSize='large'
                style={{
                  color:
                    state?.currentFormTheme?.colorTexto ||
                    'white'
                }}
              />
            </ButtonStyled>
          </div>
        </div>
      )}
      <Modal isOpen={finished}>
        <ModalHeader>{t('formularios>crear_formulario>configuracion>finalizado', 'Finalizado')}</ModalHeader>
        <ModalBody>
          <p>{form.configuracion?.mensajeAgradecimiento}</p>
          <ButtonStyled
            primary
            backgroundColor={
              state?.currentFormTheme?.color || colors.primary
            }
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
	fontfamily: ${(props) => props.currentFormTheme.font || 'inherit'};
`

const StyledInfoOutlinedIcon = styled(InfoOutlinedIcon)`
	font-size: 1.2rem;
	margin-left: 5px;
`

export default withRouter(ResponseForm)
