import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import AppLayout from 'Layout/AppLayout'
import { Row, Col, Container, Button, Input } from 'reactstrap'
import './styles.scss'
import PlayArrowIcon from '@material-ui/icons/PlayArrow'
import SideBarRight from './SideBars/SideBarRight.tsx'
import creadorItems from 'Constants/creadorElementos'
import GridLayout from 'react-grid-layout'

import '../../../../node_modules/react-grid-layout/css/styles.css'
import '../../../../node_modules/react-resizable/css/styles.css'

import { fieldTypes } from './utils/fieldTypes.ts'
import { TooltipSimple } from 'Utils/tooltip.tsx'
import { reduce, cloneDeep } from 'lodash'
import { useActions } from 'Hooks/useActions'
import { useSelector } from 'react-redux'
import useNotification from 'Hooks/useNotification'
import { getMultiCatalogs, getAllCatalogs } from 'Redux/selects/actions'
import { withRouter } from 'react-router-dom'
import Field from './Field.tsx'
import MUIButton from '@material-ui/core/Button'
import { guidGenerator } from '../../../utils/GUIDGenerator'
import { exportToJson } from '../../../utils/JSONDownloader'

import GetAppOutlinedIcon from '@material-ui/icons/GetAppOutlined'
import { useForm } from 'react-hook-form'

type Props = {}

const ContenedorPrincipal: React.FC<Props> = (props) => {
  const [data, setData] = useState({ titulo: 'Crear formulario' })
  const [currentContainer, setCurrentContainer] = useState({})
  const [showSidebarRight, setShowSidebarRight] = useState(false)
  const [layout, setLayout] = useState([])
  const [currentField, setCurrentField] = useState({})
  const [currentNestedContainer, setCurrentNestedContainer] = useState({})
  const [editTitle, setEditTitle] = useState(false)
  const [layoutContents, setLayoutContents] = useState([])
  const [clickTimeout, setClickTimeOut] = useState(null)
  const [multiSelects, setMultiSelects] = useState({})
  const [sources, setSources] = useState([])
  const [currentForm, setCurrentForm] = useState({})
  const { control } = useForm()
  const [snackbarContent, setSnacbarContent] = useState({
    msg: 'welcome',
    variant: 'info'
  })
  const [snackBar, handleClick] = useNotification()

  const actions = useActions({
    getMultiCatalogs,
    getAllCatalogs
  })

  const state = useSelector((store) => {
    return {
      selects: store.selects
    }
  })

  useEffect(() => {
    const loadData = async () => {
      const response = await actions.getAllCatalogs()

      if (response.error) {
        setSnacbarContent({
          variant: 'error',
          msg: 'Hubo un error al tratar de conseguir los datos del servidor'
        })
        handleClick()
      }
    }
    loadData()

    // Buscar y cargar form del storage
    getCurrentFormFromStorage()
  }, [])

  const getCurrentFormFromStorage = () => {
    const formStoraged = localStorage.getItem('currentForm')
      ? JSON.parse(localStorage.getItem('currentForm'))
      : {}
    if (Object.keys(formStoraged)?.length > 0) {
      const { layouts, contents } = formStoraged
      setCurrentForm(formStoraged)
      setData(formStoraged)

      setLayout(layouts)

      setLayoutContents(contents)
      setSources(formStoraged.sources || [])

      if (layouts[0]) {
        setCurrentContainer(layouts[0])

        setShowSidebarRight(true)
      }
    }
  }

  const removeCurrentFormInStorage = () => {
    localStorage.removeItem('currentForm')
    setCurrentForm({})
    setData({})
    setLayout([])
    setLayoutContents([])
    setSources([])
  }

  const autoSaveAndSetCurrentForm = (form) => {
    const newData = form || data
    if (!form) {
      newData.layouts = layout
      newData.contents = layoutContents || []
      newData.sources = sources
      newData.table = data.table
    }

    setCurrentForm(newData)

    // Save on localStorage
    localStorage.setItem('currentForm', JSON.stringify(newData))
  }

  const handleShowSidebarRight = () => {
    setShowSidebarRight(!showSidebarRight)
    setCurrentField({})
  }

  const addContainer = async () => {
    const newId = `${guidGenerator()}_col`
    const newContainer = {
      i: newId,
      x: 0,
      y: 0,
      w: 1,
      h: 4,
      titulo: 'new Layout',
      type: 'containerParent',
      config: { titulo: 'Nuevo contenedor', relleno: true, tooltip: '' },
      rowH: 0
    }
    await setLayoutContents([
      ...layoutContents,
      { layoutId: newId, fields: [], order: layoutContents?.length + 1 }
    ])
    await setLayout([...layout, newContainer])
    setCurrentContainer(newContainer)
    setShowSidebarRight(true)

    autoSaveAndSetCurrentForm()
  }

  // Fields functions

  const handleCreateRow = async (parentLayout, item, newItem) => {
    setShowSidebarRight(false)

    let newContainer
    const newField = fieldTypes[newItem.id]
    const _layout = layout?.map((element) => {
      if (element.i == parentLayout.i) {
        const currentH = item.config.h ? item.config.h : 2.5
        const newH = newField.config.h ? newField.config.h : 2.5
        const newh =
					currentH > newH
					  ? currentH
					  : newH > currentH
					    ? newH
					    : currentH
        newContainer = {
          ...element,
          rowH: element.rowH + newh
        }
        return newContainer
      } else {
        return element
      }
    })
    setCurrentContainer(newContainer)
    setLayout(_layout)
    const _layoutContents = layoutContents?.map((content) => {
      const newId = `${guidGenerator()}_${parentLayout.i}`
      if (content.layoutId == parentLayout.i) {
        return {
          ...content,
          fields: content.fields?.map((field) => {
            if (Array.isArray(field)) {
              let selectedRow
              field.forEach((rowItem) => {
                if (Array.isArray(rowItem)) {
                  rowItem.forEach((colItem) => {
                    if (colItem.id == colItem.id) {
                      selectedRow = true
                    }
                  })
                }
                if (rowItem.id == item.id) {
                  selectedRow = true
                }
              })
              return selectedRow
                ? [
                    ...field,
                    {
                      ...newField,
                      id: `${newId}`,
                      row: true
                    }
								  ]
                : field
            }
            if (field.id == item.id) {
              return [
                { ...item, row: true },
                { ...newField, id: `${newId}`, row: true }
              ]
            } else {
              return field
            }
          })
        }
      } else {
        return content
      }
    })
    setLayoutContents(_layoutContents)

    autoSaveAndSetCurrentForm()
  }

  const handleCreateCol = async (parentLayout, item, newItem) => {
    setShowSidebarRight(false)

    let newId
    let newContainer
    const newField = fieldTypes[newItem.id]
    const _layoutContents = layoutContents?.map((content) => {
      if (content.layoutId == parentLayout.i) {
        newId = `${guidGenerator()}_${parentLayout.i}`
        return {
          ...content,
          fields: content.fields?.map((field) => {
            if (Array.isArray(field)) {
              return field?.map((rowItem) => {
                if (
                  rowItem.id == item.id &&
									!Array.isArray(rowItem)
                ) {
                  return [
                    { ...item, row: true, col: true },
                    {
                      ...newField,
                      id: `1_${newId}`,
                      row: true,
                      col: true
                    }
                  ]
                } else if (
                  Array.isArray(rowItem) &&
									rowItem[rowItem?.length - 1].id == item.id
                ) {
                  rowItem.push({
                    ...newField,
                    id: `1_${newId}`,
                    row: true,
                    col: true
                  })
                  return rowItem
                } else {
                  return rowItem
                }
              })
            } else {
              return field
            }
          })
        }
      } else {
        return content
      }
    })
    setLayoutContents(_layoutContents)

    autoSaveAndSetCurrentForm()
  }

  const changeFieldInPlace = (currentField, newField) => {
    return {
      ...newField,
      id: currentField.id,
      label: currentField.label,
      row: currentField.row,
      col: currentField.col,
      config: {
        ...newField.config,
        tooltipText:
					newField.config.tooltipText ||
					currentField.config.tooltipText
      }
    }
  }

  const handleFieldChange = async (parentLayout, item, newItem) => {
    const newField = fieldTypes[newItem.id]
    let newFieldFull = {}
    const _layoutContents = layoutContents?.map((content) => {
      if (content.layoutId == parentLayout.i) {
        return {
          ...content,
          fields: content.fields?.map((field) => {
            if (Array.isArray(field)) {
              return field?.map((rowItem) => {
                if (
                  rowItem.id == item.id &&
									Array.isArray(rowItem)
                ) {
                  return rowItem?.map((lastLevelItem) => {
                    if (lastLevelItem.id == item.id) {
                      newFieldFull = changeFieldInPlace(
                        lastLevelItem,
                        newField
                      )
                      return newFieldFull
                    } else {
                      return lastLevelItem
                    }
                  })
                } else {
                  if (rowItem.id == item.id) {
                    newFieldFull = changeFieldInPlace(
                      rowItem,
                      newField
                    )
                    return newFieldFull
                  }
                  return rowItem
                }
              })
            } else {
              if (field.id == item.id) {
                newFieldFull = changeFieldInPlace(
                  field,
                  newField
                )
                return newFieldFull
              }
              return field
            }
          })
        }
      } else {
        return content
      }
    })

    setCurrentField(newFieldFull)

    setLayoutContents(_layoutContents)

    autoSaveAndSetCurrentForm()
  }

  const handleCreateField = async (item) => {
    if (layoutContents?.length == 0) return
    if (!currentNestedContainer.i) {
      const _newContent = layoutContents
      let newField
      _newContent.forEach((element) => {
        if (element.layoutId === currentContainer.i) {
          newField = {
            ...fieldTypes[item.id],
            id: `${guidGenerator()}_${element.layoutId}`
          }
          element = {
            ...element,
            fields: element.fields.push(newField)
          }
        }
      })

      await setLayoutContents(_newContent)

      setCurrentField(newField)
      setShowSidebarRight(true)
    } else {
      const _newContent = layoutContents
      let newField
      _newContent.forEach((element) => {
        if (element.layoutId == currentNestedContainer.i) {
          newField = {
            id: `${guidGenerator()}_${element.layoutId}`,
            ...fieldTypes[item.id]
          }
          element = {
            ...element,
            fields: element.fields.push(newField)
          }
        }
      })

      await setLayoutContents(_newContent)

      setCurrentField(newField)
      setShowSidebarRight(true)
    }

    autoSaveAndSetCurrentForm()
  }

  const handleMultiSelectsOptions = (inputId, item) => {
    const _multiSelects = multiSelects
    _multiSelects[inputId] = {
      type: 'multiSelect',
      options: item.options
    }
    setMultiSelects(_multiSelects)

    autoSaveAndSetCurrentForm()
  }

  const removeItem = async (item) => {
    const _contents = layoutContents || []
    const _content = _contents.find((content) => {
      if (currentNestedContainer.i) {
        return content.layoutId === currentNestedContainer.i
      }
      return content.layoutId === currentContainer.i
    })
    _content?.fields.forEach((field, i) => {
      let filteredFields
      const hasCols = field
        ? Array.isArray(field[0]) || Array.isArray(field[1])
        : []
      if (Array.isArray(field) && hasCols) {
        field.forEach((rowItem, rI) => {
          if (Array.isArray(rowItem)) {
            filteredFields = rowItem.filter(
              (colItem) => colItem?.id != item?.id
            )
            _content.fields[i][rI] = filteredFields
            if (filteredFields?.length === 1) {
              filteredFields[0].row = true
              _content.fields[i][rI] = filteredFields[0]
            }
            if (filteredFields?.length < 1) {
              _content.fields[i][rI] = null
            }
          } else if (rowItem?.id == item?.id) {
            _content.fields[i][rI] = null
            if (
              rI - 1 === 0 &&
							_content.fields[i][rI - 1] &&
							!_content.fields[i][rI + 1]
            ) {
              if (Array.isArray(_content.fields[i][rI - 1])) {
                let newI = i
                _content.fields[i][rI - 1]
                  .reverse()
                  .forEach((colItem) => {
                    _content.fields.splice(i, 0, {
                      ...colItem,
                      row: false,
                      col: false
                    })
                    newI += 1
                  })
                _content.fields.splice(newI, 1)
              }
            }
          }
        })
      } else if (Array.isArray(field)) {
        filteredFields = field.filter(
          (rowItem) => rowItem?.id != item?.id
        )
        if (filteredFields[0] && !filteredFields[1]) {
          filteredFields[0].row = false
          _content.fields[i] = filteredFields[0]
        } else if (filteredFields?.length < 1) {
          _content.fields[i] = null
        } else {
          _content.fields[i] = filteredFields
        }
      } else if (field?.id == item?.id) {
        _content.fields[i] = null
      }
    })
    const newContent = []
    _content.fields.forEach((field) => {
      let fieldArray = []
      if (Array.isArray(field)) {
        const rowItemArray = []
        field.forEach((rowItem) => {
          if (Array.isArray(rowItem)) {
            const foo = rowItem.filter((colItem) => colItem)
            rowItemArray.push(foo)
          } else if (rowItem) {
            rowItemArray.push(rowItem)
          }
        })
        fieldArray = rowItemArray
        fieldArray[0] && newContent.push(fieldArray)
      } else if (field) {
        fieldArray = field
        field.row = false
        newContent.push(fieldArray)
      }
    })
    const newLayoutContent = _contents?.map((content) => {
      if (_content.layoutId == content.layoutId) {
        return { ..._content, fields: newContent }
      } else {
        return content
      }
    })
    await setLayoutContents(newLayoutContent)
    setCurrentField({})

    autoSaveAndSetCurrentForm()
  }

  const removeNestedContainer = (item) => {
    setCurrentField({})
    const newLayout = layout?.map((container) => {
      if (container.i == currentContainer.i) {
        return {
          ...container,
          content: container.content.filter(
            (nestedContainer) => nestedContainer.i != item.i
          )
        }
      } else {
        return container
      }
    })

    const newContent = layoutContents.filter(
      (content) => content.layoutId != item.i
    )
    setLayout(newLayout)
    setLayoutContents(newContent)
    setCurrentNestedContainer({})
  }

  const createNestedContainer = async () => {
    if (!currentContainer.i) return
    const newContainer = {
      i: `${guidGenerator()}_col`,
      type: 'container',
      config: {
        titulo: 'Nuevo contenedor',
        relleno: true,
        tooltipText: ''
      }
    }
    await setLayoutContents([
      ...layoutContents,
      {
        layoutId: `${newContainer.i}`,
        fields: [],
        order: layoutContents?.length + 1
      }
    ])

    const newLayout = layout?.map((container) => {
      if (container.i == currentContainer.i) {
        return {
          ...currentContainer,
          content: currentContainer.content
            ? [...currentContainer.content, newContainer]
            : [newContainer]
        }
      }
      return container
    })
    await setLayout(newLayout)
    setCurrentNestedContainer(newContainer)

    autoSaveAndSetCurrentForm()
  }

  const handleChange = async (property: string, value, isConfig: boolean) => {
    const _content = cloneDeep(
      layoutContents.find((layoutC) => {
        if (currentNestedContainer.i) {
          return layoutC.layoutId == currentNestedContainer.i
        }
        return layoutC.layoutId == currentContainer.i
      })
    )
    let item = cloneDeep(
      _content.fields.find((field) => {
        if (Array.isArray(field)) {
          return field.some((rowItem) => {
            if (Array.isArray(rowItem)) {
              return rowItem.some((colItem) => {
                return colItem?.id == currentField?.id
              })
            } else {
              return rowItem?.id == currentField?.id
            }
          })
        }
        return field?.id == currentField?.id
      })
    )
    if (Array.isArray(item)) {
      item.forEach((rowItem) => {
        if (Array.isArray(rowItem)) {
          rowItem.forEach((colItem) => {
            if (colItem?.id == currentField?.id) {
              item = colItem
            }
          })
        } else if (rowItem?.id == currentField?.id) {
          item = rowItem
        }
      })
    }

    if (isConfig) {
      if (property == 'type' && item.type == 'uploadFile') {
        item.config[property] = value
        item.config.icon = value
      } else {
        item.config[property] = value
      }
    } else {
      if (
        (property == 'options' || property == 'source') &&
				['checklist', 'radio', 'unic', 'multiple'].includes(item.type)
      ) {
        item[property] = value.options

        if (typeof value.options === 'string') {
          const sbString = value.options.substr(
            0,
            value.options?.length - 6
          )
          if (sbString !== '') {
            const existingSources = sources.find(
              (source) => source == sbString
            )
            !existingSources && setSources([...sources, sbString])
          }
        }
        item.config.h = 2.5 + value.numOptions
      } else if (property == 'options') {
        item[property] = value.options
      } else {
        item[property] = value
      }
    }
    const newFields = _content.fields
      .filter((field) => field)
      ?.map((field) => {
        if (Array.isArray(field)) {
          return field?.map((rowItem) => {
            if (Array.isArray(rowItem)) {
              return rowItem?.map((colItem) => {
                if (colItem?.id == item?.id) {
                  return item
                } else {
                  return colItem
                }
              })
            }
            if (rowItem?.id === item?.id) {
              return item
            } else {
              return rowItem
            }
          })
        } else if (field?.id === item?.id) {
          return item
        } else {
          return field
        }
      })

    const aux = layoutContents?.map((element) => {
      if (element.layoutId === currentNestedContainer.i) {
        return { ..._content, fields: newFields }
      } else if (
        element.layoutId === currentContainer.i &&
				!currentNestedContainer.i
      ) {
        return { ..._content, fields: newFields }
      } else {
        return element
      }
    })
    await setLayoutContents(
      layoutContents?.map((element) => {
        if (element.layoutId === currentNestedContainer.i) {
          return { ..._content, fields: newFields }
        } else if (
          element.layoutId === currentContainer.i &&
					!currentNestedContainer.i
        ) {
          return { ..._content, fields: newFields }
        } else {
          return element
        }
      })
    )

    setCurrentField(item)

    autoSaveAndSetCurrentForm()
  }

  // Layout functions

  const resizeLayout = async (_newContent, deleted) => {
    const _layoutWithNewHeight = getNewWidthAndHeight(_newContent, deleted)
    await setLayout(_layoutWithNewHeight)

    autoSaveAndSetCurrentForm()
  }

  const getNewWidthAndHeight = (_newContent, deleted) => {
    return layout?.map((item) => {
      if (item.i === currentContainer.i) {
        const _content = _newContent.find(
          (element) => element.layoutId === currentContainer.i
        )

        let _fieldsHeight = 0
        if (_content) {
          const _contentConfig = _content.fields?.map((item) => {
            if (Array.isArray(item)) {
              return item[0].config
            }
            return item.config
          })
          _fieldsHeight = _contentConfig?.map((item) => {
            return item?.h || 2.5
          })
        }
        const calcHeight =
          2 + reduce(_fieldsHeight, (sum, n) => sum + n)
        if (item.h < calcHeight + currentContainer.rowH && !deleted) {
          return {
            ...item,
            h: calcHeight + currentContainer.rowH
          }
        } else if (deleted) {
          return {
            ...item,
            h: item.h - deleted.config.h
          }
        } else {
          return {
            ...item
          }
        }
      } else {
        return item
      }
    })
  }

  const handleContainerChange = (event) => {
    const { name, value } = event.target
    if (!currentNestedContainer.i) {
      const current = { ...currentContainer }
      current.config[name] =
        name === 'relleno' ? !current.config[name] : value

      setCurrentContainer(current)

      const layoutsUpdated = cloneDeep(layoutContents)
      layoutsUpdated.find(
        (item) => item.layoutId === currentContainer.i
      ).config = current.config

      setLayoutContents(layoutsUpdated)
    } else {
      const current = { ...currentNestedContainer }
      current.config[name] =
        name === 'relleno' ? !current.config[name] : value

      setCurrentNestedContainer(current)

      const layoutsUpdated = cloneDeep(layoutContents)
      layoutsUpdated.find(
        (item) => item.layoutId === currentContainer.i
      ).config = current.config

      setLayoutContents(layoutsUpdated)
    }

    autoSaveAndSetCurrentForm()
  }

  const removeContainer = (container) => {
    setLayoutContents(
      layoutContents.filter((cont) => cont.layoutId != container.i)
    )
    setLayout(layout.filter((cont) => cont.i != container.i))
    setCurrentContainer({})
    setCurrentField({})

    const newData = { ...data }
    newData.layouts = layout.filter((cont) => cont.i != container.i)
    newData.contents = layoutContents.filter(
      (cont) => cont.layoutId != container.i
    )
    autoSaveAndSetCurrentForm(newData)
  }

  const fileReader = new FileReader()

  fileReader.onload = (event) => {
    const parsed = JSON.parse(event.target.result)
    setData({ ...data, titulo: parsed.titulo })
    setLayout(parsed.layouts)
    setLayoutContents(parsed.contents)

    setCurrentContainer(parsed.layouts[0])
    setSources(parsed.sources)

    setShowSidebarRight(true)

    const newData = { ...data, titulo: parsed.titulo, table: parsed.table }
    newData.layouts = parsed.layouts
    newData.contents = parsed.contents
    autoSaveAndSetCurrentForm(newData)
  }

  // Render functions
  const getLayoutContent = (parentLayout) => {
    const contentByParent = layoutContents.find(
      (item) => item.layoutId === parentLayout.i
    )
    return contentByParent?.fields?.map((field, i) => {
      if (Array.isArray(field)) {
        return (
          <Row>
            {field?.map((rowItem, rI) => {
              if (Array.isArray(rowItem)) {
                return (
                  <Col
                    xs={rowItem[0].config.size && 12}
                    md={rowItem[0].config.size || null}
                  >
                    {rowItem?.map((colItem, colI) => {
                      return (
                        <Field
                          key={i}
                          control={control}
                          layout={parentLayout}
                          field={colItem}
                          array={Array.isArray(
                            rowItem
                          )}
                          currentField={currentField}
                          multiSelects={multiSelects}
                          setMultiSelects={
                            setMultiSelects
                          }
                          handleMultiSelectsOptions={
                            handleMultiSelectsOptions
                          }
                          setCurrentField={
                            setCurrentField
                          }
                          setCurrentContainer={
                            setCurrentContainer
                          }
                          setShowSidebarRight={
                            setShowSidebarRight
                          }
                          handleCreateField={
                            handleCreateField
                          }
                          handleCreateRow={
                            handleCreateRow
                          }
                          removeItem={removeItem}
                          handleCreateCol={
                            handleCreateCol
                          }
                          showCol={
                            colI ===
                            colItem?.length - 1
                          }
                          isFirst={
                            rI === field?.length - 1
                          }
                          dataForm={{}}
                        />
                      )
                    })}
                  </Col>
                )
              }
              return (
                <Col
                  xs={rowItem.config.size && 12}
                  md={rowItem.config.size || null}
                >
                  <Field
                    key={i}
                    control={control}
                    layout={parentLayout}
                    field={rowItem}
                    array={Array.isArray(field)}
                    currentField={currentField}
                    multiSelects={multiSelects}
                    setMultiSelects={setMultiSelects}
                    handleMultiSelectsOptions={
                      handleMultiSelectsOptions
                    }
                    setCurrentField={setCurrentField}
                    setCurrentContainer={
                      setCurrentContainer
                    }
                    setShowSidebarRight={
                      setShowSidebarRight
                    }
                    handleCreateField={handleCreateField}
                    handleCreateRow={handleCreateRow}
                    removeItem={removeItem}
                    handleCreateCol={handleCreateCol}
                    handleFieldChange={handleFieldChange}
                    showCol
                    isFirst={rI === field?.length - 1}
                    dataForm={{}}
                  />
                </Col>
              )
            })}
          </Row>
        )
      }
      return (
        <Field
          key={i}
          control={control}
          layout={parentLayout}
          field={field}
          currentField={currentField}
          multiSelects={multiSelects}
          setMultiSelects={setMultiSelects}
          handleMultiSelectsOptions={handleMultiSelectsOptions}
          setCurrentField={setCurrentField}
          setCurrentContainer={setCurrentContainer}
          setShowSidebarRight={setShowSidebarRight}
          handleCreateField={handleCreateField}
          handleCreateRow={handleCreateRow}
          handleCreateCol={handleCreateCol}
          removeItem={removeItem}
          dataForm={{}}
          isFirst
        />
      )
    })
  }

  const getContainers = (layout) => {
    return layout.content?.map((nestedLayout, i) => {
      return (
        <Field
          key={i}
          control={control}
          layout={layout}
          field={nestedLayout}
          currentField={currentField}
          multiSelects={multiSelects}
          setMultiSelects={setMultiSelects}
          handleMultiSelectsOptions={handleMultiSelectsOptions}
          setCurrentField={setCurrentField}
          setCurrentContainer={setCurrentContainer}
          setShowSidebarRight={setShowSidebarRight}
          handleCreateField={handleCreateField}
          handleCreateRow={handleCreateRow}
          handleCreateCol={handleCreateCol}
          removeItem={removeItem}
          setCurrentNestedContainer={setCurrentNestedContainer}
          currentNestedContainer={currentNestedContainer}
          removeNestedContainer={removeNestedContainer}
          dataForm={{}}
        >
          {getLayoutContent(nestedLayout)}
        </Field>
      )
    })
  }

  const sidebarItem = currentField?.id
    ? currentField
    : currentNestedContainer?.i
      ? currentNestedContainer
      : currentContainer

  return (
    <div>
      {snackBar(snackbarContent.variant, snackbarContent.msg)}
      <AppLayout
        items={
          currentNestedContainer.i
            ? creadorItems.filter((_, i) => i != 0)
            : creadorItems
        }
        creador
        handleCreateItem={handleCreateField}
        createNestedContainer={createNestedContainer}
      >
        <Container
          style={{
            marginLeft: showSidebarRight ? '0' : 'auto'
          }}
        >
          <StyledRow>
            <Col xs={3}>
              {!editTitle
                ? (
                  <h4
                    onClick={() => {
                      setEditTitle(true)
                    }}
                  >
                    {data.titulo}
                  </h4>
                )
                : (
                  <TitleInput
                    value={data.titulo}
                    onChange={(e) => {
                      const { value } = e.target
                      setData({
                        ...data,
                        titulo: e.target.value
                      })
                      autoSaveAndSetCurrentForm()
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        setEditTitle(false)
                      }
                    }}
                  />
                )}
              <Button
                color='primary'
                outline
                onClick={() => addContainer()}
              >
                Agregar Contenedor
              </Button>
            </Col>
            <Col xs={3}>
              <Input
                type='file'
                id='formInput'
                style={{ opacity: 0 }}
                accept='application/JSON'
                onChange={(e) => {
                  fileReader.readAsText(e.target.files[0])
                }}
              />
              <MUIButton
                color='primary'
                component='label'
                htmlFor='formInput'
              >
                Importar archivo
              </MUIButton>
            </Col>
            <Col xs={3} align='right'>
              {layoutContents?.length > 0
                ? (
                  <>
                    <Button
                      color='rgba(0, 0, 0, 0.1)'
                      disabled={layoutContents?.length == 0}
                      onClick={removeCurrentFormInStorage}
                    />
                    <Button
                      color='rgba(0, 0, 0, 0.1)'
                      onClick={() => {
                        exportToJson(currentForm)
                      }}
                    >
                      <PreviewContent>
                        <GetAppOutlinedIcon />
                        Descargar
                      </PreviewContent>
                    </Button>
                  </>
                )
                : null}
            </Col>
            <Col xs={3}>
              {layoutContents?.length > 0
                ? (
                  <StyledButtonRow>
                    <Button
                      color='primary'
                      onClick={() => {
                        autoSaveAndSetCurrentForm()
                        window.open(
                          '/#/creador/previsualizar/',
                          '_blank'
                        )
                      }}
                    >
                      <PreviewContent>
                        Previsualizar
                        <PlayArrowIcon
                          style={{ color: 'white' }}
                        />
                      </PreviewContent>
                    </Button>
                  </StyledButtonRow>
                )
                : null}
            </Col>
          </StyledRow>
          <GridLayout
            className='layout'
            layout={layout}
            cols={4}
            rowHeight={30}
            width={1200}
            autoSize
            isDraggable
            isResizable
            isBounded={false}
            onLayoutChange={(
              items,
              oldItem,
              newItem,
              placeholder,
              e,
              element
            ) => {
              setLayout(
                items?.map((item, i) => {
                  if (item.i == currentContainer.i) {
                    setCurrentContainer({
                      ...currentContainer,
                      ...item
                    })
                  }
                  return { ...layout[i], ...item }
                })
              )
            }}
          >
            {layout?.map((item) => {
              return (
                <div
                  className={`${item?.config.relleno
                      ? 'bg-white__radius'
                      : 'whitout-bg-white__radius'
                    } ${item?.i == currentContainer.i &&
                    'current-layout'
                    }`}
                  key={item.i}
                  onClick={() => {
                    if (clickTimeout !== null) {
                      setCurrentField({})
                      setCurrentNestedContainer({})
                      setClickTimeOut(null)
                    } else {
                      setClickTimeOut(
                        setTimeout(() => {
                          clearTimeout(clickTimeout)
                          setClickTimeOut(null)
                        }, 200)
                      )
                    }
                    setCurrentContainer({
                      ...item
                    })
                  }}
                >
                  <h4>
                    {item.config.titulo}
                    {item.config.tooltip?.length > 0
                      ? (
                        <TooltipSimple
                          title={item.config.tooltip}
                        />
                      )
                      : null}
                  </h4>
                  <Row>
                    {item.content
                      ? getContainers(item)
                      : null}
                    <Col>{getLayoutContent(item)}</Col>
                  </Row>
                </div>
              )
            })}
          </GridLayout>
          {showSidebarRight
            ? (
              <SideBarRight
                item={sidebarItem}
                removeContainer={removeContainer}
                propiedades={
                  currentNestedContainer.i
                    ? currentNestedContainer.config
                    : currentContainer.config
                }
                handleContainerChange={handleContainerChange}
                handleChange={handleChange}
                handleShow={handleShowSidebarRight}
                selects={state.selects}
              />
            )
            : null}
        </Container>
      </AppLayout>
    </div>
  )
}

const PreviewContent = styled.span`
	display: flex;
	align-items: center;
`

const StyledButtonRow = styled.span`
	width: 100%;
	display: flex;
	justify-content: flex-end;
`

const TitleInput = styled(Input)`
	margin: 1rem;
	margin-left: 0;
	border-radius: 35px;
`

const StyledRow = styled.div`
	margin: 20px;
	display: flex;
`

export default withRouter(ContenedorPrincipal)
