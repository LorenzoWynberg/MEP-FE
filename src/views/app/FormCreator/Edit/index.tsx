import React, { useEffect, useState, useRef } from 'react'
import Froala from '../../../../components/Froala'
import {
  Container,
  Row,
  Col,
  Input,
  FormGroup,
  Label,
  Button
  , ModalHeader, Modal as RModal, ModalBody
} from 'reactstrap'
import PrintIcon from '@material-ui/icons/Print'
import PaletteIcon from '@material-ui/icons/Palette'
import VisibilityIcon from '@material-ui/icons/Visibility'
import SettingsIcon from '@material-ui/icons/Settings'
import GetAppIcon from '@material-ui/icons/GetApp'
import PublishIcon from '@material-ui/icons/Publish'
import { Typography, Modal } from '@material-ui/core'
import { fields } from '../utils/inputTypes'
import TextFieldsIcon from '@material-ui/icons/TextFields'
import RadioButtonCheckedIcon from '@material-ui/icons/RadioButtonChecked'
import CheckBoxIcon from '@material-ui/icons/CheckBox'
import ArrowDropDownCircleIcon from '@material-ui/icons/ArrowDropDownCircle'
import StarsIcon from '@material-ui/icons/Stars'
import SubjectIcon from '@material-ui/icons/Subject'
import styled from 'styled-components'
import Percentage from './PercentageDiv'
import PanoramaIcon from '@material-ui/icons/Panorama'
import CloudUploadIcon from '@material-ui/icons/CloudUpload'
import MatrixIcon from './MatrixIcon'
import { useActions } from 'Hooks/useActions'
import AddIcon from '@material-ui/icons/Add'
import SortIcon from '@material-ui/icons/Sort'
import BackIcon from '@material-ui/icons/ArrowBackIos'

import {
  saveForm,
  updateForm,
  exportForm,
  getCategorias,
  getForm,
  importForm,
  getUsersByEmail,
  getAdmins,
  saveAdmins,
  clearSearch,
  deleteAdmins
} from '../../../../redux/FormCreatorV2/actions'
import QuestionEditorContainer from '../QuestionTypes/QuestionEditorContainer'
import { cloneDeep } from 'lodash'
import Configs from '../QuestionsConfig/index'
import { makeStyles } from '@material-ui/core/styles'
import swal from 'sweetalert'
import ItemMenu from './OptionsMenu'
import { useHover } from 'react-use'
import NavigationCard from './NavigationCard'
import MoreVertIcon from '@material-ui/icons/MoreVert'
import ContainerConfigs from '../QuestionsConfig/ContainerConfigs'
import Loader from '../../../../components/Loader'
import { useSelector } from 'react-redux'
import AddAPhotoIcon from '@material-ui/icons/AddAPhoto'
import colors from 'Assets/js/colors'
import axios from 'axios'
import { envVariables } from '../../../../constants/enviroment'
import useNotification from 'Hooks/useNotification'
import '../../../../assets/css/sass/containerStyles/report.scss'
import CalendarTodayIcon from '@material-ui/icons/CalendarToday'
import FormatListNumberedIcon from '@material-ui/icons/FormatListNumbered'

import ModalConfiguracion from './ModalConfiguracion'
import { generarClave } from 'Utils/utils'
import withRouter from 'react-router-dom/withRouter'

import { getThemes } from '../../../../redux/Temas/actions'
import './styles.scss'
import SendFormComponent from '../SendForm/indexSendForm'
import DeleteIcon from '@material-ui/icons/Delete'
import { useTranslation } from 'react-i18next'
import creadorDeFormulariosItems from 'Constants/creadorDeFormulariosItems'

import Tippy from '@tippyjs/react'

import moment from 'moment'
import 'moment/locale/es'
import AppLayout from 'Layout/AppLayout'
import directorItems from 'Constants/directorMenu'
const useStyles = makeStyles((theme) => ({
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 0, 3),
    borderRadius: '15px',
    width: '36rem'
  }
}))

const getIcon = (el, color = 'primary') => {
  switch (el) {
    case 'text':
      return <TextFieldsIcon style={{ color }} />
    case 'date':
      return <CalendarTodayIcon style={{ color }} />
    case 'radio':
      return <RadioButtonCheckedIcon style={{ color }} />
    case 'checklist':
      return <CheckBoxIcon style={{ color }} />
    case 'dropdown':
      return <ArrowDropDownCircleIcon style={{ color }} />
    case 'percentage':
      return <Percentage color={color} />
    case 'uploadFile':
      return <CloudUploadIcon style={{ color }} />
    case 'imageSelector':
      return <PanoramaIcon style={{ color }} />
    case 'rate':
      return <StarsIcon style={{ color }} />
    case 'matrix':
      return <MatrixIcon color={color} />
    case 'richText':
      return <SubjectIcon style={{ color }} />
    case 'textInputs':
      return <FormatListNumberedIcon style={{ color }} />
    case 'pairing':
  }
}

const Edit = (props) => {
  const { t } = useTranslation()
  const element = (hovered) => (
    <div style={{ width: '15px', margin: '0 auto', padding: '15px' }}>
      <div
        style={{
          height: '5px',
          borderTop: '2px solid gray',
          borderBottom: '2px solid gray',
          width: '15px'
        }}
      />
    </div>
  )

  const [hoverable, hovered] = useHover(element)
  const questionElement = (hovered) => (
    <div style={{ width: '15px', margin: '0 auto', padding: '15px' }}>
      <div
        style={{
          height: '5px',
          borderTop: '2px solid gray',
          borderBottom: '2px solid gray',
          width: '15px'
        }}
      />
    </div>
  )
  const [questionHoverable, questionHovered] = useHover(questionElement)
  const classes = useStyles()
  const [activeHeigtAnimation, setActiveHeigtAnimation] = useState(false)
  const [form, setForm] = useState({ questionContainers: [], questions: {} })
  const [draggingId, setDraggingId] = useState('')
  const [draggingContainerId, setDraggingContainerId] = useState('')
  const [anchorEl, setAnchorEl] = useState(null)
  const [questionConfigOpen, setQuestionConfigOpen] = useState(null)
  const [activeQuestion, setActiveQuestion] = useState({ parent: {} })
  const [questionsRefs, setQuestionsRefs] = useState([])
  const [currentParentId, setCurrentParentId] = useState(null)
  const [optionsParentId, setOptionsParentId] = useState(null)
  const [draggableClassName, setDraggableClassName] = useState(null)
  const [fromDraggingContainerId, setFromDraggingContainerId] = useState(null)
  const [loading, setLoading] = useState(null)
  const [loadingQuestions, setLoadingQuestions] = useState(null)
  const [containerConfigsOpen, setContainerConfigsOpen] = useState(null)
  const [imagesOpen, setImagesOpen] = useState(null)
  const [imageToUpload, setImageToUpload] = useState(null)
  const [image, setImage] = useState(null)
  const [imageCallback, setImageCallback] = useState({
    callBackFunction: () => { }
  })
  const [autoSaveInteractionsInterval, setAutoSaveInteractionsInterval] =
    useState(null)
  const [questionChangeInterval, setQuestionChangeInterval] = useState(null)
  const [fileToUpload, setFileToUpload] = useState(null)
  const fileToUploadRef = useRef(null)
  const [snackBar, handleSnackBarClick] = useNotification()
  const [autoSaveLoading, setAutoSaveLoading] = useState(false)
  const [themesOpen, setThemesOpen] = useState(false)
  const [calledBefore, setCalledBefore] = useState(false)
  const [draggingElements, setDraggingElements] = useState(false)
  const [snackbarContent, setSnacbarContent] = useState({
    msg: 'welcome',
    variant: 'info'
  })

  const [openModalConfiguracion, setOpenModalConfiguracion] = useState(false)
  const [dataConfiguracion, setDataConfiguracion] = useState({
    requiereAuntenticacion: false,
    fechaHoraFin: null,
    fechaHoraInicio: null,
    clave: null,
    permiteReenvio: false,
    notificarRespuesta: false,
    ocultarNumeracionRespuestas: false
  })
  const [tooltipOpens, setTooltipOpens] = useState(false)

  const toggles = () => setTooltipOpens(!tooltipOpens)
  const state = useSelector((store) => {
    return {
      ...store.creadorFormularios,
      ...store.temas
    }
  })

  useEffect(() => {
    if (calledBefore) {
      if (props.create && state.currentForm.id) {
        props.history.push(`/forms/edit/${state.currentForm.id}`)
      }
      const _form = !state.currentForm?.formulario
        ? {
          questionContainers: [],
          questions: {}
        }
        : JSON.parse(state.currentForm?.formulario)
      setForm({
        id: state.currentForm.id,
        titulo: state.currentForm.titulo?.trim() || '',
        encabezado: state.currentForm.encabezado,
        categoria: state.currentForm.sB_CategoriaFormularioId || null,
        descripcion: state.currentForm.descripcion,
        questionContainers: _form.questionContainers || [],
        questions: _form.questions || {},
        tema: _form.tema
      })

      state.currentForm.configuracion
        ? setDataConfiguracion({
          ...JSON.parse(state.currentForm.configuracion)
        })
        : setDataConfiguracion({})
    }
  }, [state.currentForm])

  useEffect(() => {
    setLoading(true)

    actions.getCategorias()

    if (props.create) {
      const createForm = async () => {
        const sendData = {
          id: 0,
          titulo: '',
          encabezado: '',
          formulario: '{}',
          descripcion: ''
        }

        const response = await actions.saveForm(sendData)
        setLoading(false)
      }
      createForm()
    } else {
      const loadForm = async () => {
        await actions.getForm(props.formId, props.manual)
        setLoading(false)
      }

      loadForm()
    }
    setCalledBefore(true)
  }, [])

  useEffect(() => {
    if (themesOpen) {
      actions.getThemes()
    }
  }, [themesOpen])

  const actions = useActions({
    saveForm,
    updateForm,
    getCategorias,
    getForm,
    exportForm,
    importForm,
    getAdmins,
    getUsersByEmail,
    saveAdmins,
    clearSearch,
    deleteAdmins,
    getThemes
  })

  const handleClick = (event, parentId) => {
    setAnchorEl(event.currentTarget)
    setOptionsParentId(parentId)
  }

  const handleClose = () => {
    setAnchorEl(null)
    setOptionsParentId(null)
  }

  const handleChangeDataConfiguracion = (name, value) => {
    let _data = { ...dataConfiguracion }

    switch (name) {
      case 'fechaHoraInicioOption':
        if (!value) {
          _data = { ..._data, fechaHoraInicio: null }
        }
        break
      case 'fechaHoraFinOption':
        if (!value) {
          _data = { ..._data, fechaHoraFin: null }
        }
        break
      case 'claveOption':
        if (!value) {
          _data = { ..._data, clave: null }
        } else {
          _data = { ..._data, clave: generarClave('', 6) }
        }
        break
    }

    _data = { ..._data, [name]: value }
    setDataConfiguracion(_data)
  }

  const onChange = (value: any, type: string) => {
    const _form = { ...form }
    _form[type] = value
    setForm(_form)
    clearTimeout(questionChangeInterval)
    setQuestionChangeInterval(
      setTimeout(() => {
        handleAutoSave(_form)
      }, 400)
    )
  }

  const handleCancelConfiguracion = () => {
    setDataConfiguracion(
      cloneDeep(JSON.parse(state.currentForm.configuracion))
    )

    setOpenModalConfiguracion(false)
  }

  const handleSaveConfiguracion = () => {
    if (dataConfiguracion.fechaHoraInicioOption) {
      if (
        dataConfiguracion.fechaHoraInicio == null ||
        dataConfiguracion.fechaHoraInicio == ''
      ) {
        setSnacbarContent({
          variant: 'error',
          msg: 'Debe seleccionar una fecha y hora de inicio.'
        })
        handleSnackBarClick()

        return
      }
    }

    if (dataConfiguracion.fechaHoraFinOption) {
      if (
        dataConfiguracion.fechaHoraFin == null ||
        dataConfiguracion.fechaHoraFin == ''
      ) {
        setSnacbarContent({
          variant: 'error',
          msg: 'Debe seleccionar una fecha y hora de fin.'
        })
        handleSnackBarClick()
        return
      }
    }

    if (
      dataConfiguracion.fechaHoraInicioOption &&
      dataConfiguracion.fechaHoraFinOption
    ) {
      if (
        moment(dataConfiguracion.fechaHoraInicio) >
        moment(dataConfiguracion.fechaHoraFin)
      ) {
        setSnacbarContent({
          variant: 'error',
          msg: 'Fecha y hora fin debe ser mayor o igual a fecha y hora de inicio.'
        })
        handleSnackBarClick()
        return
      }
    }

    if (dataConfiguracion.fechaHoraInicioOption) {
      if (
        moment(dataConfiguracion.fechaHoraInicio) < moment(new Date())
      ) {
        setSnacbarContent({
          variant: 'error',
          msg: 'Fecha y hora inicio no puede ser menor a hoy.'
        })
        handleSnackBarClick()
        return
      }
    }

    handleSendForm()
    setOpenModalConfiguracion(false)
  }

  const handleSnackbarShow = (msg, type) => {
    setSnacbarContent({
      variant: type,
      msg
    })
    handleSnackBarClick()
  }
  const handleSendForm = async (autoSave = false, autoSaveForm?) => {
    const _form = autoSaveForm || form
    const sendData = {
      id: state.currentForm.id,
      titulo: _form.titulo,
      encabezado: _form.encabezado,
      formulario: JSON.stringify(_form),
      categoriaId: _form.categoria,
      descripcion: _form.descripcion,
      configuracion: JSON.stringify(dataConfiguracion)
    }

    if (autoSave) {
      setAutoSaveLoading(true)
    }

    const response = await actions.updateForm(autoSave, sendData)
    if (response.error) {
      setSnacbarContent({
        variant: 'error',
        msg: 'Hubo un error y el formulario no pudo ser guardado'
      })
      handleSnackBarClick()
    }
    if (autoSave) {
      setAutoSaveLoading(false)
    }
  }

  const handleToggleThemes = () => {
    setThemesOpen(!themesOpen)
  }

  const handleExportForm = async () => {
    const response = await actions.exportForm(
      state.currentForm.id,
      state.currentForm.titulo
    )
    if (response.error) {
      setSnacbarContent({
        variant: 'error',
        msg: 'Hubo un error y el formulario no pudo ser exportado'
      })
    } else {
      setSnacbarContent({
        variant: 'success',
        msg: 'Formulario exportado con éxito'
      })
    }
    handleSnackBarClick()
  }

  const handleImportForm = async (file) => {
    const response = await actions.importForm(file)

    if (response.error) {
      setSnacbarContent({
        variant: 'error',
        msg:
          response.message ||
          'Hubo un error y el formulario no pudo ser importado'
      })
    } else {
      setSnacbarContent({
        variant: 'success',
        msg: 'Formulario importado con éxito'
      })
    }
    handleSnackBarClick()
  }

  let counter = 0
  let counter2 = 0

  const handleAutoSave = (autoSaveForm) => {
    clearTimeout(autoSaveInteractionsInterval)
    setAutoSaveInteractionsInterval(
      setTimeout(() => {
        handleSendForm(true, autoSaveForm)
      }, 400)
    )
  }

  const onQuestionChange = async (value, type, parentId, questionId) => {
    let _question
    const _form = cloneDeep(form)
    if (_form.questions[parentId]) {
      _form.questions[parentId].forEach((q) => {
        if (q.id == questionId) {
          q[type] = value
          _question = q
        }
      })
    }
    setActiveQuestion({ ...activeQuestion, [type]: value })
    await setForm(_form)
    clearTimeout(questionChangeInterval)
    setQuestionChangeInterval(
      setTimeout(() => {
        handleAutoSave(_form)
      }, 400)
    )
  }

  const onChangeContainer = async (datos, containerIdx) => {
    const _form = cloneDeep(form)
    _form.questionContainers[containerIdx] = {
      ..._form.questionContainers[containerIdx],
      ...datos
    }
    setLoadingQuestions(true)
    await setForm({ ..._form })
    handleAutoSave({ ..._form })
  }

  const deleteContainer = (containeridx) => {
    const _form = { ...form }
    const container = form.questionContainers[containeridx]
    const questionContainers = _form.questionContainers.filter(
      (el, idx) => {
        return idx !== containeridx
      }
    )
    _form.questionContainers = questionContainers
    delete _form.questions[container.id]
    setForm({ ..._form })
    handleAutoSave({ ..._form })
  }

  const appendItem = (item, afterElement, dragContainer) => {
    if (afterElement) {
      dragContainer.insertBefore(item, afterElement)
    } else {
      dragContainer.appendChild(item)
    }
  }

  const dragStart = (id, className, cointainerId, e) => {
    const node = document.getElementById(id)
    setDraggableClassName(className)
    setDraggingContainerId(cointainerId)
    setDraggingId(id)
    node.classList.add('dragging')
  }

  const dragOver = (e, containerId) => {
    const dragContainer = document.getElementById(draggingContainerId)
    if (containerId === draggingContainerId) {
      e.persist()
      counter += 1
      const afterElement = draggableContent(dragContainer, e.clientY)
      const draggingElement = document.getElementById(draggingId)
      if (counter === 10) {
        appendItem(draggingElement, afterElement, dragContainer)
        counter = 0
      }
    }
  }

  const dragOverComponents = (e, containerId, node) => {
    const dragContainer = node
    e.persist()
    counter2 += 1
    const afterElement = draggableContent(dragContainer, e.clientY)
    const draggingElement = document.getElementById(draggingId)

    if (counter2 === 60) {
      appendItem(draggingElement, afterElement, dragContainer)
      counter2 = 0
    }
  }

  const draggableContent = (container, y) => {
    const draggableItems = [
      ...container.getElementsByClassName(draggableClassName)
    ]

    return draggableItems.reduce(
      (closest, child) => {
        const box = child.getBoundingClientRect()
        const offset = y - box.top - box.height / 2
        if (offset < 0 && offset > closest.offset) {
          return { offset, element: child }
        } else {
          return closest
        }
      },
      { offset: Number.NEGATIVE_INFINITY }
    ).element
  }

  // the callback should receive an array of elements
  const dragEnd = async (e, elementsArray, cb) => {
    e.preventDefault()
    e.stopPropagation()
    e.persist()
    const dragContainer = document.getElementById(draggingContainerId)
    const afterElement = draggableContent(dragContainer, e.clientY)
    const draggingElement = document.getElementById(draggingId)
    appendItem(draggingElement, afterElement, dragContainer)
    e.target.classList.remove('dragging')
    const draggableItems = [
      ...dragContainer.getElementsByClassName(draggableClassName)
    ]

    const draggableItemsContent = []
    draggableItems.forEach((element) => {
      draggableItemsContent.push({
        ...elementsArray[element.getAttribute('index')]
      })
    })
    draggableItemsContent.forEach((element, i) => {
      element.idx = i
    })
    cb(draggableItemsContent)
  }

  const dragEndBetweenComponents = (e, keyWord, cb) => {
    e.persist()
    const dragContainer = document.getElementById(draggingContainerId)
    const afterElement = draggableContent(dragContainer, e.clientY)
    const draggingElement = document.getElementById(draggingId)
    draggingElement.classList.add(draggableClassName)
    appendItem(draggingElement, afterElement, dragContainer)

    e.target.classList.remove('dragging')
    const draggableItems = [
      ...dragContainer.getElementsByClassName(draggableClassName)
    ]

    const draggableItemsContent = []
    const elementsArray = getQuestionsArrayMerged()

    draggableItems.forEach((element) => {
      const foo = elementsArray.find(
        (el) => el.id == element.id.split(keyWord)[0]
      )
      draggableItemsContent.push({
        ...foo
      })
    })
    draggableItemsContent.forEach((element, i) => {
      element.idx = i
    })
    cb(draggableItemsContent)
  }

  const addQuestion = async (containerIdx, question) => {
    const containerQuestions = form.questions[containerIdx]
    let newIndex = 0
    Object.keys(form.questions).forEach((q) => {
      newIndex = form.questions[q].length + newIndex
    })
    const generatedId = generateId()
    const parentContainer = form.questionContainers.find(
      (el) => el.id == containerIdx
    )
    const _question = {
      ...question,
      id: generatedId,
      idx: newIndex,
      parent: parentContainer
    }
    const newQuestions = getQuestionIndexes({
      ...form,
      questions: {
        ...form.questions,
        [containerIdx]: containerQuestions
          ? [...containerQuestions, _question]
          : [_question]
      }
    })

    await setForm({ ...form, questions: newQuestions })
    setActiveQuestion(_question)
  }

  const changeQuestion = (containerIdx, question, questionId) => {
    const containerQuestions = form.questions[containerIdx]
    const _question = { ...question, id: questionId }
    containerQuestions.forEach((element, i) => {
      if (element.id == questionId) {
        containerQuestions[i] = _question
      }
    })

    const questionParent = form.questionContainers.find(
      (el) => el.id == containerIdx
    )

    const newQuestions = getQuestionIndexes({
      ...form,
      questions: { ...form.questions, [containerIdx]: containerQuestions }
    })
    const newQuestion = newQuestions[containerIdx].find(
      (el) => el.id == questionId
    )
    setActiveQuestion({ ...newQuestion, parent: questionParent })

    setForm({ ...form, questions: newQuestions })
  }

  const generateId = () => {
    const result = []
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    const charactersLength = characters.length
    for (let i = 0; i < 7; i++) {
      result.push(
        characters.charAt(Math.floor(Math.random() * charactersLength))
      )
    }
    return result.join('')
  }

  const handleConfigClose = (container = false) => {
    if (container) {
      return setContainerConfigsOpen(null)
    }
    setQuestionConfigOpen(null)
  }

  const handleImagesClose = () => {
    setImagesOpen(null)
  }

  const handleImagesOpen = (question, image = null, cb) => {
    setImagesOpen({ parentType: 'question', idx: question.idx })
    setImage(image)
    setImageCallback({ callBackFunction: cb })
  }

  const openConfig = (question, index, parentId) => {
    setQuestionConfigOpen({ ...question, index, parentId })
  }

  const openContainerConfig = (container) => {
    setContainerConfigsOpen(container)
  }

  const [modals, setModals] = useState(false)
  const toggle = () => setModals(!modals)

  const [activeTabSend, setActiveTabSend] = useState('1')
  const toggleTab = (tab) => {
    if (activeTabSend !== tab) setActiveTabSend(tab)
  }

  const addDuplicatedQuestion = (question, containerIdx) => {
    const containerQuestions = form.questions[containerIdx]
    let newIndex = 0
    Object.keys(form.questions).forEach((q) => {
      newIndex = form.questions[q].length + newIndex
    })
    const _question = { ...question, id: generateId(), idx: newIndex }
    const _array = [...containerQuestions]
    _array.splice(question.idx + 1, 0, _question)
    const newQuestions = getQuestionIndexes({
      ...form,
      questions: { ...form.questions, [containerIdx]: _array }
    })

    setForm({ ...form, questions: newQuestions })
  }

  const duplicateQuestion = (element, parentId) => {
    swal({
      title: '¿Está seguro que quiere duplicar la pregunta?',
      icon: 'warning',
      buttons: {
        ok: {
          text: 'Aceptar',
          value: true
        },
        cancel: 'Cancelar'
      }
    }).then((result) => {
      if (result) {
        addDuplicatedQuestion(element, parentId)
      }
    })
  }

  const handleDelete = (questionId, parentId) => {
    const questions = cloneDeep(form.questions)
    questions[parentId] = questions[parentId].filter(
      (el) => el.id !== questionId
    )
    const _questions = getQuestionIndexes({ ...form, questions })
    setForm({ ...form, questions: _questions })

    handleAutoSave({ ...form, questions: _questions })
    setActiveQuestion(null)
  }

  const deleteQuestion = (questionId, parentId) => {
    swal({
      title: t('formularios>crear_formulario>eliminar_pregunta', '¿Está seguro que quiere eliminar la pregunta?'),
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
        handleDelete(questionId, parentId)
      }
    })
  }

  const getQuestionIndexes = (_form) => {
    const _newQuestions = {}
    const questions = cloneDeep({ ..._form.questions })
    let currentIndex = 0
    _form.questionContainers.forEach((el) => {
      if (questions[el.id]) {
        questions[el.id].forEach((item) => {
          if (!_newQuestions[el.id]) {
            _newQuestions[el.id] = [{ ...item, idx: currentIndex }]
          } else {
            _newQuestions[el.id].push({
              ...item,
              idx: currentIndex
            })
          }
          currentIndex += 1
        })
      }
    })

    return _newQuestions
  }

  const addQuestionRef = (questionId, ref) => {
    questionsRefs[questionId] = ref
  }

  const removeQuestionRef = (questionId) => {
    const _newRefs = {}
    Object.keys(questionsRefs).forEach((key) => {
      if (questionId != key) {
        _newRefs[key] = questionsRefs[key]
      }
    })
    setQuestionsRefs(_newRefs)
  }

  const getQuestionsArrayMerged = (): array => {
    const newArray = []
    Object.keys(form.questions).forEach((el) => {
      form.questions[el].forEach((q) => {
        newArray.push(q)
      })
    })
    return newArray
  }

  if (loading) return <Loader />

  const PrintElem = async () => {
    await setActiveQuestion(null)
    window.print()
  }

  const handlePrint = () => {
    const printContents = document.getElementById('responseForm').innerHTML
    const w = window.open()
    w.document.write(printContents)
    w.document.close()
    w.focus()
    w.print()
    w.close()
    return true
  }
  const newMenus = creadorDeFormulariosItems.map((el) => ({
    ...el,
    label: t(`formularios>navigation>${el?.id}`, el?.label)
  }))
  return (
    <AppLayout items={newMenus}>
      <Container>
        {snackBar(snackbarContent.variant, snackbarContent.msg)}
        {autoSaveLoading && (
          <div
            style={{
              position: 'fixed',
              bottom: '10px',
              right: '10px'
            }}
          >
            <div className='loading loading-form' />
          </div>
        )}

        <Row>
          <Col xs={12} md={6}>
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
            <h2>{t('formularios>navigation>inicioFormularios', 'Crear formulario')}</h2>
          </Col>
          <Col xs={12} md={6}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'flex-end'
              }}
            >
              <div style={{ display: 'flex' }}>
                <PrintIcon
                  fontSize='large'
                  style={{
                    marginRight: '4rem',
                    cursor: 'pointer'
                  }}
                  onClick={() => {
                    props.history.push(
                      `/forms/${form.id
                      }/preview/${true}/print`
                    )
                  }}
                />
                {/* <Question /> */}
                <PaletteIcon
                  fontSize='large'
                  style={{
                    marginRight: '4rem',
                    cursor: 'pointer'
                  }}
                  onClick={() => {
                    handleToggleThemes()
                  }}
                />
                <VisibilityIcon
                  fontSize='large'
                  style={{
                    marginRight: '4rem',
                    cursor: 'pointer'
                  }}
                  onClick={() => {
                    props.history.push(
                      `/forms/${form.id}/preview`
                    )
                  }}
                />
                <SettingsIcon
                  fontSize='large'
                  style={{
                    marginRight: '4rem',
                    cursor: 'pointer'
                  }}
                  onClick={() => {
                    setOpenModalConfiguracion(true)
                  }}
                />
              </div>
              <SendFormComponent
                onClickButton={() => {
                  handleSendForm()
                }}
                value={form.id}
              />
            </div>
            <br />
            <div
              style={{
                display: 'flex',
                justifyContent: 'flex-end'
              }}
            >
              <Button
                size='lg'
                color='light'
                style={{ marginRight: '20px' }}
                onClick={() => {
                  fileToUploadRef.current.click()
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <PublishIcon /> {t('formularios>crear_formulario>importar', 'Importar archivo')}
                </div>
              </Button>
              <Button
                size='lg'
                color='light'
                style={{ width: '9rem' }}
                onClick={() => {
                  handleExportForm()
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <GetAppIcon /> {t('formularios>crear_formulario>exportar', 'Exportar')}
                </div>
              </Button>
              <input
                ref={fileToUploadRef}
                type='file'
                accept='application/json'
                style={{
                  opacity: 0,
                  display: 'none'
                }}
                onChange={(e) => {
                  const data = new FormData()
                  data.append('file', e.target.files[0])
                  data.append(
                    'formularioId',
                    state.currentForm.id || null
                  )
                  handleImportForm(data)
                  e.target.value = null
                }}
              />
            </div>
          </Col>
        </Row>
        <br />
        <div
          style={{
            borderRadius: '5px',
            padding: '10px',
            backgroundColor: 'white',
            border: '1px solid #ECECEC',
            padding: '2rem'
          }}
        >
          <Row>
            <Col xs={12} md={6}>
              <FormGroup>
                <Label>{t('formularios>crear_formulario>titulo_formulario', 'Título del formulario')} *</Label>
                <Input
                  value={form.titulo}
                  onChange={(e) => {
                    onChange(e.target.value, 'titulo')
                  }}
                />
              </FormGroup>
              <br />
              <Label>{t('formularios>crear_formulario>encabezado', 'Encabezado')} *</Label>
              <Froala
                uploadUrl={`${envVariables.BACKEND_URL}/api/GestorFormulario/${form.id}/Recurso`}
                resourcesUrl={`${envVariables.BACKEND_URL}/api/GestorFormulario/${form.id}/Recurso`}
                deleteResourceUrl={`${envVariables.BACKEND_URL}/api/GestorFormulario/${form.id}/Recurso`}
                value={form.encabezado}
                zIndex={100}
                onChange={(value) => {
                  onChange(value, 'encabezado')
                }}
              />
            </Col>
            <Col xs={12} md={6}>
              <FormGroup>
                <Label>{t('formularios>crear_formulario>categoria', 'Categoría')} *</Label>
                <Input
                  type='select'
                  value={form.categoria}
                  onChange={(e) => {
                    onChange(e.target.value, 'categoria')
                  }}
                >
                  <option value={0}>Seleccionar</option>
                  {state.categorias?.map((category) => {
                    return (
                      <option value={category.id}>
                        {category.nombre}
                      </option>
                    )
                  })}
                </Input>
              </FormGroup>
              <br />
              <Label>{t('formularios>crear_formulario>descripcion', 'Descripción')}</Label>
              <Froala
                zIndex={10}
                resourcesUrl={`${envVariables.BACKEND_URL}/api/GestorFormulario/${form.id}/Recurso`}
                uploadUrl={`${envVariables.BACKEND_URL}/api/GestorFormulario/${form.id}/Recurso`}
                deleteResourceUrl={`${envVariables.BACKEND_URL}/api/GestorFormulario/${form.id}/Recurso`}
                value={form.descripcion}
                onChange={(value) => {
                  onChange(value, 'descripcion')
                }}
              />
            </Col>
          </Row>
        </div>
        <Row style={{ padding: '1rem' }}>
          <Col xs='12' md='4' className='d-none d-lg-block'>
            <div
              style={{
                backgroundColor: 'white',
                borderRadius: '8px',
                width: '100%',
                height: '50vh',
                overflow: 'auto',
                padding: '10px'
              }}
            >
              <div
                id='draggableListContainer'
                onDragOver={(e) => {
                  if (
                    draggingContainerId ===
                    'draggableListContainer'
                  ) {
                    dragOver(e, 'draggableListContainer')
                  }
                }}
              >
                {!loadingQuestions &&
                  form.questionContainers?.map((p, i) => {
                    return (
                      <div
                        id={`${p.id}-${p.idx}parent`}
                        style={{
                          borderRadius: '5px',
                          padding: '10px',
                          backgroundColor: '#F2F2F2',
                          border: '1px solid #ECECEC',
                          margin: '10px',
                          position: 'relative',
                          height:
                            draggingElements &&
                              !activeHeigtAnimation
                              ? '3.5rem'
                              : activeHeigtAnimation
                                ? '8rem'
                                : 'auto'
                        }}
                        index={p.idx}
                        draggable={draggingElements}
                        className='draggable draggableChild'
                        onDragStart={(e) => {
                          if (draggingElements) {
                            setActiveQuestion({
                              parent: {}
                            })
                            dragStart(
                              `${p.id}-${p.idx}parent`,
                              'draggable',
                              'draggableListContainer',
                              e
                            )
                          }
                        }}
                        onDragEnd={(e) => {
                          if (
                            draggingContainerId ===
                            'draggableListContainer'
                          ) {
                            e.preventDefault()
                            e.stopPropagation()
                            dragEnd(
                              e,
                              form.questionContainers,
                              async (
                                elements
                              ) => {
                                setLoadingQuestions(
                                  true
                                )
                                const questions =
                                  getQuestionIndexes(
                                    {
                                      ...form,
                                      questionContainers:
                                        elements
                                    }
                                  )
                                Object.keys(
                                  questions
                                ).forEach(
                                  (el) => {
                                    questions[
                                      el
                                    ].forEach(
                                      (
                                        item,
                                        idx
                                      ) => {
                                        if (
                                          item.options &&
                                          item.options.some(
                                            (
                                              k
                                            ) =>
                                              k.question
                                          )
                                        ) {
                                          item.options.forEach(
                                            (
                                              option
                                            ) => {
                                              if (
                                                option.question
                                              ) {
                                                const conditionQuestion =
                                                  questions[
                                                    el
                                                  ].find(
                                                    (
                                                      i
                                                    ) => {
                                                      return (
                                                        i.id ==
                                                        option
                                                          .question
                                                          .value
                                                      )
                                                    }
                                                  )
                                                option.question.label = `Ir a la pregunta ${conditionQuestion.idx +
                                                  1
                                                  }`
                                              }
                                            }
                                          )
                                        }
                                      }
                                    )
                                  }
                                )
                                await setForm({
                                  ...form,
                                  questionContainers:
                                    elements,
                                  questions
                                })
                                handleAutoSave({
                                  ...form,
                                  questions
                                })
                                setLoadingQuestions(
                                  false
                                )
                              }
                            )
                          }
                        }}
                        onDrop={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                        }}
                      >
                        <div
                          style={{
                            position: 'absolute',
                            top: 9,
                            right: 9
                          }}
                        >
                          <SortIcon
                            className='SectionIcons'
                            style={{
                              color: 'gray'
                            }}
                            onClick={() => {
                              if (
                                draggingElements
                              ) {
                                setActiveHeigtAnimation(
                                  true
                                )
                                setTimeout(
                                  () => {
                                    setActiveHeigtAnimation(
                                      false
                                    )
                                    setDraggingElements(
                                      !draggingElements
                                    )
                                  },
                                  800
                                )
                              } else {
                                setDraggingElements(
                                  !draggingElements
                                )
                              }
                            }}
                          />
                          <Tippy
                            theme='light'
                            content='Eliminar'
                          >
                            <DeleteIcon
                              className='SectionIcons'
                              style={{
                                color: 'gray'
                              }}
                              onClick={() => {
                                swal({
                                  title: '¿Está seguro de eliminar la sección y todas las preguntas asociadas?',
                                  icon: 'warning',
                                  buttons: {
                                    ok: {
                                      text: 'Aceptar',
                                      value: true
                                    },
                                    cancel: 'Cancelar'
                                  }
                                }).then(
                                  (
                                    result
                                  ) => {
                                    if (
                                      result
                                    ) {
                                      deleteContainer(
                                        p.idx
                                      )
                                      setContainerConfigsOpen(
                                        false
                                      )
                                      setLoadingQuestions(
                                        false
                                      )
                                    }
                                  }
                                )
                              }}
                            />
                          </Tippy>
                          <MoreVertIcon
                            className='SectionIcons'
                            style={{
                              color: 'gray'
                            }}
                            onClick={() => {
                              openContainerConfig(
                                p
                              )
                            }}
                          />
                        </div>
                        {p.title}
                        <div
                          id={`${p.id}navigationContainer`}
                          style={{
                            minHeight: '3rem'
                          }}
                          onDragOver={async (e) => {
                            if (
                              draggingContainerId !==
                              'draggableListContainer'
                            ) {
                              const fromContainerId =
                                fromDraggingContainerId.split(
                                  'navigationContainer'
                                )[0]
                              const parsedContainerByClassName =
                                draggableClassName.split(
                                  'draggableNavigationCard'
                                )[0]
                              if (
                                parsedContainerByClassName !==
                                fromContainerId &&
                                counter2 === 60
                              ) {
                                const parentContainer =
                                  document.getElementById(
                                    fromDraggingContainerId
                                  )
                                parentContainer.removeChild(
                                  document.getElementById(
                                    draggingId
                                  )
                                )
                              }
                              await setDraggingContainerId(
                                `${p.id}navigationContainer`
                              )
                              await setCurrentParentId(
                                `${p.id}navigationContainer`
                              )
                              await setDraggableClassName(
                                `${p.id}draggableNavigationCard`
                              )
                              dragOverComponents(
                                e,
                                `${p.id}navigationContainer`,
                                document.getElementById(
                                  `${p.id}navigationContainer`
                                )
                              )
                            }
                          }}
                        >
                          {!draggingElements &&
                            form.questions[p.id] &&
                            form.questions[
                              p.id
                            ]?.map((q, index) => {
                              return (
                                <div
                                  className={`${p.id}draggableNavigationCard`}
                                  id={`${q.id}navigationChild`}
                                  draggable
                                  onDragStart={(
                                    e
                                  ) => {
                                    setFromDraggingContainerId(
                                      `${p.id}navigationContainer`
                                    )
                                    dragStart(
                                      `${q.id}navigationChild`,
                                      `${p.id}draggableNavigationCard`,
                                      `${p.id}navigationContainer`,
                                      e
                                    )
                                  }}
                                  onDragEnd={(
                                    e
                                  ) => {
                                    e.preventDefault()
                                    e.stopPropagation()
                                    e.persist()
                                    const promise = new Promise((resolve,reject)=>{
                                      dragEndBetweenComponents(
                                        e,
                                        'navigationChild',
                                        (elements) => {
                                          const fromContainerId = fromDraggingContainerId.split('navigationContainer')[0]
                                          const parsedContainerByClassName = draggableClassName.split('draggableNavigationCard')[0]
                                          setLoadingQuestions(true)

                                          let questions
                                          if (parsedContainerByClassName !== fromContainerId) {
                                            questions = getQuestionIndexes({
                                              ...form,
                                              questions: {
                                                ...form.questions,
                                                [parsedContainerByClassName]: elements,
                                                [fromContainerId]: form.questions[fromContainerId].filter((el) =>
                                                  el.id !=
                                                  draggingId.split(
                                                    'navigationChild'
                                                  )[0]
                                                )
                                              }
                                            }
                                            )
                                          } else {
                                            questions = getQuestionIndexes({
                                              ...form,
                                              questions: {
                                                ...form.questions,
                                                [parsedContainerByClassName]: elements
                                              }
                                            })
                                          }

                                          Object.keys(questions).forEach((el) => {
                                            questions[el].forEach((item, idx) => {
                                              if (item.options && item.options.some((k) => k.question)) {
                                                item.options.forEach((option) => {
                                                  if (option.question) {
                                                    const conditionQuestion = questions[el].find((i) => {
                                                      return (
                                                        i.id ==
                                                        option
                                                          .question
                                                          .value
                                                      )
                                                    }
                                                    )
                                                    option.question.label = `Ir a la pregunta ${conditionQuestion.idx + 1}`
                                                  }
                                                }
                                                )
                                              }
                                            }
                                            )
                                          }
                                          )
                                          let _question = {}
                                          if (activeQuestion?.id) {
                                            Object.keys(questions).forEach((el) => {
                                              questions[el].forEach((item, idx) => {
                                                if (item.id == activeQuestion.id) {
                                                  _question = item
                                                }
                                              }
                                              )
                                            }
                                            )
                                            setActiveQuestion(_question)
                                          }
                                          // debugger
                                          setForm(
                                            {
                                              ...form,
                                              questions
                                            }
                                          )
                                          handleAutoSave({
                                            ...form,
                                            questions
                                          })
                                          setLoadingQuestions(false)
                                        }
                                      )
                                      resolve(true)
                                    })
                                      
                                    promise.then(_=>{
                                      dragEndBetweenComponents(
                                        e,
                                        'navigationChild',
                                        async (
                                          elements
                                        ) => {
                                          const fromContainerId = fromDraggingContainerId.split('navigationContainer')[0]
                                          const parsedContainerByClassName = draggableClassName.split('draggableNavigationCard')[0]
                                          setLoadingQuestions(true)

                                          let questions
                                          if (parsedContainerByClassName !== fromContainerId) {
                                            questions = getQuestionIndexes({
                                              ...form,
                                              questions: {
                                                ...form.questions,
                                                [parsedContainerByClassName]: elements,
                                                [fromContainerId]: form.questions[fromContainerId].filter((el) =>
                                                  el.id !=
                                                  draggingId.split(
                                                    'navigationChild'
                                                  )[0]
                                                )
                                              }
                                            }
                                            )
                                          } else {
                                            questions = getQuestionIndexes({
                                              ...form,
                                              questions: {
                                                ...form.questions,
                                                [parsedContainerByClassName]: elements
                                              }
                                            })
                                          }

                                          Object.keys(questions).forEach((el) => {
                                            questions[el].forEach((item, idx) => {
                                              if (item.options && item.options.some((k) => k.question)) {
                                                item.options.forEach((option) => {
                                                  if (option.question) {
                                                    const conditionQuestion = questions[el].find((i) => {
                                                      return (
                                                        i.id ==
                                                        option
                                                          .question
                                                          .value
                                                      )
                                                    }
                                                    )
                                                    option.question.label = `Ir a la pregunta ${conditionQuestion.idx + 1}`
                                                  }
                                                }
                                                )
                                              }
                                            }
                                            )
                                          }
                                          )
                                          let _question = {}
                                          if (activeQuestion?.id) {
                                            Object.keys(questions).forEach((el) => {
                                              questions[el].forEach((item, idx) => {
                                                if (item.id == activeQuestion.id) {
                                                  _question = item
                                                }
                                              }
                                              )
                                            }
                                            )
                                            setActiveQuestion(_question)
                                          }
                                          // debugger
                                          // await setForm(
                                          //   {
                                          //     ...form,
                                          //     questions
                                          //   }
                                          // )
                                          handleAutoSave({
                                            ...form,
                                            questions
                                          })
                                          setLoadingQuestions(false)
                                        }
                                      )
                                    })
                                      
                                  }}
                                  onDrop={(
                                    e
                                  ) => {
                                    e.preventDefault()
                                    e.stopPropagation()
                                  }}
                                >
                                  <NavigationCard
                                    onChangeQuestionIdx={(parent, question) => {
                                      
                                    }}
                                    index={index}
                                    question={q}
                                    parent={p}
                                    getIcon={getIcon}
                                    scrollTo={(
                                      questionId,
                                      _question,
                                      _parent
                                    ) => {
                                      setActiveQuestion({
                                          ..._question,
                                          parent: p
                                        })
                                    }}
                                  />
                                </div>
                              )
                            })}

                          <ItemMenu
                            anchorEl={anchorEl}
                            open={Boolean(
                              p.id ===
                              optionsParentId
                            )}
                            addQuestion={
                              addQuestion
                            }
                            handleClose={
                              handleClose
                            }
                            onClose={handleClose}
                            getIcon={getIcon}
                            fields={fields}
                            parentId={p.id}
                          />
                        </div>
                        {!draggingElements && (
                          <div
                            style={{
                              width: '100%',
                              cursor: 'pointer',
                              backgroundColor:
                                colors.primary,
                              alignItems:
                                'center',
                              justifyContent:
                                'space-around',
                              color: 'white',
                              display: 'flex',
                              height: '3rem'
                            }}
                            color='primary'
                            onClick={(e) =>
                              handleClick(e, p.id)}
                          >
                            <span>
                              Agregar pregunta
                            </span>{' '}
                            <span
                              style={{
                                backgroundColor:
                                  'rgba(0,0,0,0.3)',
                                padding: '1px',
                                borderRadius:
                                  '3px',
                                height: '1.6rem'
                              }}
                            >
                              {' '}
                              <AddIcon />{' '}
                            </span>
                          </div>
                        )}
                      </div>
                    )
                  })}
              </div>
              <div
                style={{
                  width: '100%',
                  cursor: 'pointer',
                  alignItems: 'center',
                  justifyContent: 'space-around',
                  display: 'flex',
                  height: '3rem'
                }}
                onClick={() => {
                  setContainerConfigsOpen({
                    id: generateId(),
                    idx: form.questionContainers.length,
                    title: ''
                  })
                }}
              >
                <span>{t('formularios>crear_formulario>agregar_seccion', 'Agregar sección')}</span>
                <span
                  style={{
                    backgroundColor: 'rgba(0,0,0,0.3)',
                    padding: '1px',
                    borderRadius: '3px',
                    height: '1.6rem'
                  }}
                >
                  {' '}
                  <AddIcon />{' '}
                </span>
              </div>
            </div>
          </Col>
          <Col>
            {activeQuestion?.id && (
              <div
                style={{
                  borderRadius: '5px',
                  padding: '10px',
                  backgroundColor: 'white',
                  border: '1px solid #ECECEC'
                }}
              >
                <QuestionEditorContainer
                  question={activeQuestion}
                  isActive={activeQuestion.id}
                  setActiveQuestion={setActiveQuestion}
                  onClick={() => {
                    setActiveQuestion(activeQuestion.id)
                    setCurrentParentId(
                      activeQuestion.parent.id
                    )
                  }}
                  removeActiveElement={async () => {
                    setActiveQuestion(null)
                    setCurrentParentId(null)
                  }}
                  onChange={(value, type) => {
                    onQuestionChange(
                      value,
                      type,
                      activeQuestion.parent.id,
                      activeQuestion.id
                    )
                  }}
                  openSettings={() => {
                    openConfig(
                      activeQuestion,
                      activeQuestion.idx,
                      activeQuestion.parent.id
                    )
                  }}
                  uploadUrl={`${envVariables.BACKEND_URL}/api/GestorFormulario/${form.id}/Recurso`}
                  resourcesUrl={`${envVariables.BACKEND_URL}/api/GestorFormulario/${form.id}/Recurso`}
                  deleteResourceUrl={`${envVariables.BACKEND_URL}/api/GestorFormulario/${form.id}/Recurso`}
                  openDuplicates={() =>
                    duplicateQuestion(
                      {
                        ...activeQuestion,
                        id: generateId()
                      },
                      activeQuestion.parent?.id
                    )}
                  deleteQuestion={() =>
                    deleteQuestion(
                      activeQuestion.id,
                      activeQuestion.parent?.id
                    )}
                  parentId={activeQuestion.parent?.id}
                  questionHovered={questionHovered}
                  questionHoverable={questionHoverable}
                  parentDOMId={`${activeQuestion.parent?.id}-${activeQuestion.parent?.idx}`}
                  setDraggingContainerId={
                    setDraggingContainerId
                  }
                  form={form}
                  setDraggingId={setDraggingId}
                  dragStart={dragStart}
                  dragEnd={dragEnd}
                  changeQuestion={changeQuestion}
                  setDraggableClassName={
                    setDraggableClassName
                  }
                  getQuestionIndexes={getQuestionIndexes}
                  setForm={setForm}
                  getIcon={getIcon}
                  fields={fields}
                  idx={activeQuestion.idx}
                  addQuestionRef={addQuestionRef}
                  handleImagesOpen={handleImagesOpen}
                  dragAndDropUtils={{
                    dragOver,
                    setDraggableClassName,
                    setDraggingContainerId,
                    draggingContainerId,
                    dragStart,
                    dragEnd,
                    form,
                    setForm
                  }}
                />
              </div>
            )}
          </Col>
        </Row>
        {Boolean(questionConfigOpen) && (
          <Modal
            open={Boolean(questionConfigOpen)}
            onClose={() => handleConfigClose()}
            aria-labelledby='simple-modal-title'
            aria-describedby='simple-modal-description'
            className={classes.modal}
          >
            <div className={classes.paper}>
              <p style={{ padding: '1rem' }}>
                <Typography>
                  {t('formularios>crear_formulario>question_config>title', 'Configuración de la pregunta')}:{' '}
                  {activeQuestion.typeLabel}
                </Typography>
              </p>
              <hr />
              <Configs
                question={activeQuestion}
                handleConfigClose={handleConfigClose}
                handleChange={(value, type) => {
                  onQuestionChange(
                    value,
                    type,
                    activeQuestion.parent?.id,
                    activeQuestion.id
                  )
                }}
              />
            </div>
          </Modal>
        )}

        {Boolean(containerConfigsOpen) && (
          <Modal
            open={Boolean(containerConfigsOpen)}
            onClose={() => handleConfigClose(true)}
            aria-labelledby='simple-modal-title'
            aria-describedby='simple-modal-description'
            className={classes.modal}
          >
            <div className={classes.paper}>
              <p style={{ padding: '1rem' }}>
                <Typography>
                  {t('formularios>crear_formulario>configuracion_seccion', 'Configuración de la sección')}
                </Typography>
              </p>
              <hr />
              <ContainerConfigs
                container={containerConfigsOpen}
                onConfigClose={() => handleConfigClose(true)}
                deleteContainer={() => {
                  swal({
                    title: t('formularios>crear_formulario>eliminar_preguntas', '¿Está seguro de eliminar la sección y todas las preguntas asociadas?'),
                    icon: 'warning',
                    buttons: {
                      ok: {
                        text: t('formularios>crear_formulario>aceptar', 'Aceptar'),
                        value: true
                      },
                      cancel: t('formularios>crear_formulario>cancelar', 'Cancelar')
                    }
                  }).then((result) => {
                    if (result) {
                      deleteContainer(
                        containerConfigsOpen.idx
                      )
                      setContainerConfigsOpen(false)
                      setLoadingQuestions(false)
                    }
                  })
                }}
                onSave={async (datos) => {
                  onChangeContainer(
                    { ...containerConfigsOpen, ...datos },
                    containerConfigsOpen.idx
                  )
                  await setContainerConfigsOpen(false)
                  setLoadingQuestions(false)
                }}
              />
            </div>
          </Modal>
        )}
        {Boolean(imagesOpen) && (
          <Modal
            open={Boolean(imagesOpen)}
            onClose={() => handleImagesClose()}
            aria-labelledby='simple-modal-title'
            aria-describedby='simple-modal-description'
            className={classes.modal}
          >
            <div className={classes.paper}>
              <p style={{ padding: '1rem' }}>
                <Typography>{t('formularios>crear_formulario>subir_imagen', 'Subir imagen')}</Typography>
              </p>
              <hr />
              <div>
                <div style={{ padding: '3rem' }}>
                  {!image
                    ? (
                      <div
                        style={{
                          height: '15rem',
                          border: '1px solid gray',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexDirection: 'column'
                        }}
                      >
                        <Label
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexDirection: 'column'
                          }}
                        >
                          <input
                            type='file'
                            accept='image/*'
                            style={{
                              opacity: 0
                            }}
                            onChange={(e) => {
                              setImageToUpload(
                                e.target.files[0]
                              )
                              setImage(
                                URL.createObjectURL(
                                  e.target
                                    .files[0]
                                )
                              )
                            }}
                          />
                          <div
                            style={{
                              backgroundColor:
                                colors.primary,
                              borderRadius: '50%',
                              height: '5rem',
                              width: '5rem',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}
                          >
                            <AddAPhotoIcon
                              fontSize='large'
                              style={{
                                color: 'white'
                              }}
                            />
                          </div>
                        </Label>
                        <p>{t('formularios>crear_formulario>seleccionar_imagen', 'Seleccionar Imagen')}</p>
                      </div>
                    )
                    : (
                      <Label
                        style={{
                          height: '15rem',
                          backgroundImage: `url(${image})`,
                          backgroundSize: 'cover',
                          width: '100%'
                        }}
                      >
                        <input
                          type='file'
                          accept='image/*'
                          style={{
                            opacity: 0
                          }}
                          onChange={(e) => {
                            setImageToUpload(
                              e.target.files[0]
                            )
                            setImage(
                              URL.createObjectURL(
                                e.target.files[0]
                              )
                            )
                          }}
                        />
                      </Label>
                    )}
                </div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <Button
                    color='primary'
                    outline
                    onClick={() => {
                      setImageToUpload(null)
                      setImage(null)
                      handleImagesClose()
                    }}
                  >
                    {t('boton>general>cancelar', 'Cancelar')}
                  </Button>
                  <Button
                    color='primary'
                    onClick={async () => {
                      // uploadImage
                      const data = new FormData()
                      data.append('file', imageToUpload)
                      try {
                        const response =
                          await axios.post(
                            `${envVariables.BACKEND_URL}/api/GestorFormulario/${form.id}/Recurso`,
                            data
                          )
                        // save Image Url
                        imageCallback.callBackFunction(
                          response.data.link
                        )
                        setImageToUpload(null)
                        setImage(null)
                        handleImagesClose()
                      } catch (e) {
                        alert(
                          t('formularios>crear_formulario>error_subir_imagen', 'Hubo un error subiendo la imagen')
                        )
                      }
                    }}
                  >
                    {t('formularios>crear_formulario>guardar', 'Guardar')}
                  </Button>
                </div>
              </div>
            </div>
          </Modal>
        )}

        <RModal
          wrapClassName='modal-right'
          className='modal-dialog-scrollable'
          isOpen={Boolean(themesOpen)}
          onClose={() => handleToggleThemes()}
        >
          <ModalHeader toggle={handleToggleThemes}>{t('formularios>crear_formulario>temas', 'Temas')}</ModalHeader>
          <ModalBody>
            <div style={{ display: 'flex', flexWrap: 'wrap' }}>
              {state.themes?.map((el) => {
                return (
                  <div
                    className='hoverableTheme'
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                    onClick={() => {
                      onChange(el.temaId, 'tema')
                    }}
                  >
                    <div
                      style={{
                        borderRadius: '5px',
                        border:
                          form.tema == el.temaId
                            ? '2px solid #F4F418'
                            : 'none',
                        background: el.imagenFondo
                          ? `url(${el.imagenFondo}) no-repeat center top`
                          : "url('/assets/img/errorBackground.jpg') no-repeat center top",
                        height: '5rem',
                        width: '5rem',
                        margin: '0.5rem'
                      }}
                    />
                    <div className='themeoverlay'>
                      <p>{el.nombre}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </ModalBody>
        </RModal>
        {openModalConfiguracion && (
          <ModalConfiguracion
            uploadUrl={`${envVariables.BACKEND_URL}/api/GestorFormulario/${form.id}/Recurso`}
            resourcesUrl={`${envVariables.BACKEND_URL}/api/GestorFormulario/${form.id}/Recurso`}
            deleteResourceUrl={`${envVariables.BACKEND_URL}/api/GestorFormulario/${form.id}/Recurso`}
            data={dataConfiguracion}
            onChange={handleChangeDataConfiguracion}
            openDialog={openModalConfiguracion}
            onClose={() => {
              handleCancelConfiguracion()
            }}
            loading={loading}
            state={state}
            handleSnackbarShow={handleSnackbarShow}
            actions={actions}
            action={handleSaveConfiguracion}
            formId={form.id}
          />
        )}
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
export default {
  Edit: withRouter(Edit),
  getIcon
}
