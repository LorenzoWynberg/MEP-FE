import React, { useState } from 'react'
import { Typography } from '@material-ui/core'
import Option from './_partials/seleccionMultiple/Option'
import { cloneDeep } from 'lodash'
import styled from 'styled-components'
import Add from '@material-ui/icons/Add'
import '../../../../assets/css/sass/containerStyles/report.scss'
import * as XLSX from 'xlsx'
import { Row, Col } from 'reactstrap'

const SeleccionMultiple = (props) => {
  const [loadingOptionsRender, setLoadingOptionsRender] = useState(false)
  const [state, setState] = React.useState({
    checkedA: false,
    checkedB: false,
    checkedC: false
  })

  const handleChange = (event) => {
    setState({ ...state, [event.target.name]: event.target.checked })
  }

  // metodo para crear checkbox

  const CreateCheckBox = () => {
    const options = cloneDeep(props.question.options)

    props.onChange([...options, { label: '', idx: options.length }], 'options')
  }

  // delete options
  const deleteOption = (idx) => {
    const options = cloneDeep(props.question.options)
    const newOptions = []

    options.forEach((o, i) => {
      if (i !== idx) {
        newOptions.push(o)
      }
    })
    newOptions.forEach((el, i) => {
      el.idx = i
    })
    props.onChange(newOptions, 'options')
  }

  const handleChangeOption = (value, type, optionIdx) => {
    const options = cloneDeep(props.question.options)
    options[optionIdx][type] = value
    props.onChange(options, 'options')
  }

  const handleCondicion = (value, type, optionIdx) => {
    const options = cloneDeep(props.question.options)

    const _option = options[optionIdx]
    if (type === 'delete') {
      if (_option.section) {
        delete _option.section
      } else if (_option.question) {
        delete _option.question
      }
      const _newProp = { ..._option }
      options[optionIdx] = _newProp
      props.onChange(options, 'options')
    } else {
      if (type === 'question') {
        delete _option.section
      } else {
        delete _option.question
      }
      const _newProp = { ..._option, [type]: value }
      options[optionIdx] = _newProp
      props.onChange(options, 'options')
    }
  }

  const handleChangeOptionSelected = (idx, unic = false) => {
    if (unic) {
      props.handleOnChangeValue(idx, props.question.id)
    } else {
      if (props.value) {
        props.handleOnChangeValue(!props.value.includes(idx) ? [...props.value, idx] : props.value.filter(el => el !== idx), props.question.id)
      } else {
        props.handleOnChangeValue([idx], [props.question.id])
      }
    }
  }

  const handleCreateListOptions = (options) => {
    const newArray = []
    let idx = 0
    options.forEach((el, i) => {
      if (Array.isArray(el)) {
        el.forEach(j => {
          idx += 1
          newArray.push({ label: j, idx })
        })
      } else {
        idx += 1
        newArray.push({ label: el, idx })
      }
    })
    props.onChange(newArray, 'options')
  }

  if (props.response) {
    return (
      <div id='responseForm'>
        <div
          style={!props.response
            ? {
                paddingTop: '1rem',
                paddingBottom: '1rem'
              }
            : {
                display: 'flex',
                flexWrap: 'wrap',
                flexDirection: props.question.options.some(el => el.image) ? 'row' : 'column'
              }}
          id={`${props.question.id}-draggableOptionsContainer`}
          onDragOver={(e) => {
            if (props.draggingContainerId == `${props.question.id}-draggableOptionsContainer`) {
              e.stopPropagation()
              props.dragOver(e, `${props.question.id}-draggableOptionsContainer`)
            }
          }}
        >
          {props.question.config.columnsLimit && props.question.config.numberColumns === '2'
            ? <div>
              <Row>
                {!loadingOptionsRender && props.question.options.map((option, i) => {
                  return (
                    <Col xs='6'>
                      <div
                      id={`${props.question.id}-${option.idx}-option`}
                      className={`${props.question.id}-draggableOptions`}
                      draggable
                      index={i}
                      onDragStart={(e) => {
                        e.stopPropagation()
                        props.dragStart(`${props.question.id}-${option.idx}-option`, `${props.question.id}-draggableOptions`, `${props.question.id}-draggableOptionsContainer`, e)
                      }}
                      onDragEnd={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        props.dragEnd(e, props.question.options, async (elements) => {
                          setLoadingOptionsRender(true)
                          setTimeout(() => {
                            props.onChange(elements, 'options')
                            setLoadingOptionsRender(false)
                          }, 100)
                        })
                      }}
                      onDrop={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                      }}
                      style={
                    props.response
                      ? {
                          margin: '10px'
                        }
                      : {
                          marginBottom: '10px'
                        }
}
                    >
                      <Option

                        onChangeOption={(value, type) => handleChangeOption(value, type, i)}
                        deleteOption={() => deleteOption(i)}
                        active={props.active}
                        option={option}
                        unic={props.unic}
                        checked={props.unic ? props.value === option.idx : props.value && props.value?.includes && props.value?.includes(i)}
                        secciones={props.form?.questionContainers?.map(item => { return { ...item, value: item.id } })}
                        preguntasSiguientes={props.form?.questions && props.form?.questions[props.parentId]
                            ? props.form?.questions[props.parentId]?.filter((item, idx) => {
                              if (item.idx > props.question.idx) return { ...item, goToQuestion: true, value: item.id }
                            })
                            : []}
                        handleImagesOpen={props.handleImagesOpen}
                        response={props.response}
                        handleCondicion={handleCondicion}
                        handleChangeOptionSelected={handleChangeOptionSelected}
                        question={props.question}
                        parentId={props.parentId}
                      />
                    </div>
                    </Col>
                  )
                })}
              </Row>
              </div>
            : props.question.config.columnsLimit && props.question.config.numberColumns === '3'
              ? <div>
                <Row>
                  {!loadingOptionsRender && props.question.options.map((option, i) => {
                    return (
                      <Col xs='6' sm='4'>
                        <div
                        id={`${props.question.id}-${option.idx}-option`}
                        className={`${props.question.id}-draggableOptions`}
                        draggable
                        index={i}
                        onDragStart={(e) => {
                          e.stopPropagation()
                          props.dragStart(`${props.question.id}-${option.idx}-option`, `${props.question.id}-draggableOptions`, `${props.question.id}-draggableOptionsContainer`, e)
                        }}
                        onDragEnd={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          props.dragEnd(e, props.question.options, async (elements) => {
                            setLoadingOptionsRender(true)
                            setTimeout(() => {
                              props.onChange(elements, 'options')
                              setLoadingOptionsRender(false)
                            }, 100)
                          })
                        }}
                        onDrop={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                        }}
                        style={
                    props.response
                      ? {
                          margin: '10px'
                        }
                      : {
                          marginBottom: '10px'
                        }
}
                      >
                        <Option

                          onChangeOption={(value, type) => handleChangeOption(value, type, i)}
                          deleteOption={() => deleteOption(i)}
                          active={props.active}
                          option={option}
                          unic={props.unic}
                          checked={props.unic ? props.value === option.idx : props.value && props.value?.includes(i)}
                          secciones={props.form?.questionContainers?.map(item => { return { ...item, value: item.id } })}
                          preguntasSiguientes={props.form?.questions && props.form?.questions[props.parentId]
                            ? props.form?.questions[props.parentId]?.filter((item, idx) => {
                              if (item.idx > props.question.idx) return { ...item, goToQuestion: true, value: item.id }
                            })
                            : []}
                          handleImagesOpen={props.handleImagesOpen}
                          response={props.response}
                          handleCondicion={handleCondicion}
                          handleChangeOptionSelected={handleChangeOptionSelected}
                          question={props.question}
                          parentId={props.parentId}
                        />
                      </div>
                      </Col>
                    )
                  })}
                </Row>
                </div>
              : <div>
                {!loadingOptionsRender && props.question.options.map((option, i) => {
                  return (
                    <div
                      id={`${props.question.id}-${option.idx}-option`}
                      className={`${props.question.id}-draggableOptions`}
                      draggable
                      index={i}
                      onDragStart={(e) => {
                        e.stopPropagation()
                        props.dragStart(`${props.question.id}-${option.idx}-option`, `${props.question.id}-draggableOptions`, `${props.question.id}-draggableOptionsContainer`, e)
                      }}
                      onDragEnd={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        props.dragEnd(e, props.question.options, async (elements) => {
                          setLoadingOptionsRender(true)
                          setTimeout(() => {
                            props.onChange(elements, 'options')
                            setLoadingOptionsRender(false)
                          }, 100)
                        })
                      }}
                      onDrop={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                      }}
                      style={
                    props.response
                      ? {
                          margin: '10px'
                        }
                      : {
                          marginBottom: '10px'
                        }
}
                    >
                      <Option

                        onChangeOption={(value, type) => handleChangeOption(value, type, i)}
                        deleteOption={() => deleteOption(i)}
                        active={props.active}
                        option={option}
                        unic={props.unic}
                        checked={props.unic ? props.value === option.idx : props.value && props.value?.includes && props.value?.includes(i)}
                        secciones={props.form?.questionContainers?.map(item => { return { ...item, value: item.id } })}
                        preguntasSiguientes={props.form?.questions && props.form?.questions[props.parentId]
                        ? props.form?.questions[props.parentId]?.filter((item, idx) => {
                          if (item.idx > props.question.idx) return { ...item, goToQuestion: true, value: item.id }
                        })
                        : []}
                        handleImagesOpen={props.handleImagesOpen}
                        response={props.response}
                        handleCondicion={handleCondicion}
                        handleChangeOptionSelected={handleChangeOptionSelected}
                        question={props.question}
                        parentId={props.parentId}
                      />
                    </div>
                  )
                })}
                </div>}
        </div>
        {!props.response &&
          <>
            {props.active && <div>
              <a htmlFor='' onClick={CreateCheckBox} className='AgregarOpcionButon'>
                {' '}
                <Add className='AddButon' />
                Agregar una opción
              </a>
                             </div>}
            <br />
            <label className='btn btn-primary btn-lg'>
              Seleccione su archivo de opciones (CSV)
              <input
                style={{
                  display: 'none'
                }}
                type='file'
                onChange={(e) => {
                  e.preventDefault()

                  const files = e.target.files; const f = files[0]
                  const reader = new FileReader()
                  reader.onload = function (e) {
                    const data = e.target.result
                    const readedData = XLSX.read(data, { type: 'binary' })
                    const wsname = readedData.SheetNames[0]
                    const ws = readedData.Sheets[wsname]

                    /* Convert array to json */
                    const dataParse = XLSX.utils.sheet_to_json(ws, { header: 1 })
                    handleCreateListOptions(dataParse)
                  }
                  reader.readAsBinaryString(f)
                }}
              />
            </label>

            {/* <CSVReader
          cssClass="multipotionsLoader"
          label=
            opacity: 0
          }}
          onFileLoaded={(data, fileInfo) => {

          }}
        /> */}
            <Typography
              variant='caption'
              style={{ margin: '1rem', padding: '1rem', color: '#00aae4' }}
            />
          </>}
      </div>
    )
  }
  return (
    <div>
      <div
        style={!props.response
          ? {
              paddingTop: '1rem',
              paddingBottom: '1rem'
            }
          : {
              display: 'flex',
              flexWrap: 'wrap',
              flexDirection: props.question.options.some(el => el.image) ? 'row' : 'column'
            }}
        id={`${props.question.id}-draggableOptionsContainer`}
        onDragOver={(e) => {
          if (props.draggingContainerId == `${props.question.id}-draggableOptionsContainer`) {
            e.stopPropagation()
            props.dragOver(e, `${props.question.id}-draggableOptionsContainer`)
          }
        }}
      >
        {!loadingOptionsRender && props.question.options.map((option, i) => {
          let _optionValue = props.value

          if (Array.isArray(props.value)) {
            _optionValue = props.value?.find((x) => x == option.idx)
          }
          return (
            <div
              id={`${props.question.id}-${option.idx}-option`}
              className={`${props.question.id}-draggableOptions`}
              draggable
              index={i}
              onDragStart={(e) => {
                e.stopPropagation()
                props.dragStart(
                      `${props.question.id}-${option.idx}-option`,
                      `${props.question.id}-draggableOptions`,
                      `${props.question.id}-draggableOptionsContainer`,
                      e
                )
              }}
              onDragEnd={(e) => {
                e.preventDefault()
                e.stopPropagation()
                props.dragEnd(
                  e,
                  props.question.options,
                  async (elements) => {
                    setLoadingOptionsRender(true)
                    setTimeout(() => {
                      props.onChange(elements, 'options')
                      setLoadingOptionsRender(false)
                    }, 100)
                  }
                )
              }}
              onDrop={(e) => {
                e.preventDefault()
                e.stopPropagation()
              }}
              style={
                    props.response
                      ? {
                          margin: '10px'
                        }
                      : {
                          marginBottom: '10px'
                        }
                  }
            >
              <Option
                onChangeOption={(value, type) =>
                  handleChangeOption(value, type, i)}
                deleteOption={() => deleteOption(i)}
                onChange={props.onChange}
                active={props.active}
                option={option}
                unic={props.unic}
                checked={
                      props.unic
                        ? props.value === option.idx
                        : props.value && _optionValue == option.idx
                    }
                secciones={props.form?.questionContainers?.map((item) => {
                  return { ...item, value: item.id }
                })}
                preguntasSiguientes={
                      props.form?.questions &&
                      props.form?.questions[props.parentId]
                        ? props.form?.questions[props.parentId]?.filter(
                          (item, idx) => {
                            if (item.idx > props.question.idx) {
                              return {
                                ...item,
                                goToQuestion: true,
                                value: item.id
                              }
                            }
                          }
                        )
                        : []
                    }
                handleImagesOpen={props.handleImagesOpen}
                response={props.response}
                handleCondicion={handleCondicion}
                handleChangeOptionSelected={handleChangeOptionSelected}
                question={props.question}
                parentId={props.parentId}
              />
            </div>
          )
        })}
      </div>
      {!props.response &&
        <>
          {props.active && <div>
            <a htmlFor='' onClick={CreateCheckBox} className='AgregarOpcionButon'>
              {' '}
              <Add className='AddButon' />
              Agregar una opción
            </a>
          </div>}
          <br />
          <label className='btn btn-primary btn-lg'>
            Seleccione su archivo de opciones (CSV)
            <input
              style={{
                display: 'none'
              }}
              type='file'
              onChange={(e) => {
                e.preventDefault()

                const files = e.target.files; const f = files[0]
                const reader = new FileReader()
                reader.onload = function (e) {
                  const data = e.target.result
                  const readedData = XLSX.read(data, { type: 'binary' })
                  const wsname = readedData.SheetNames[0]
                  const ws = readedData.Sheets[wsname]

                  /* Convert array to json */
                  const dataParse = XLSX.utils.sheet_to_json(ws, { header: 1 })
                  handleCreateListOptions(dataParse)
                }
                reader.readAsBinaryString(f)
              }}
            />
          </label>

          {/* <CSVReader
          cssClass="multipotionsLoader"
          label=
            opacity: 0
          }}
          onFileLoaded={(data, fileInfo) => {

          }}
        /> */}
          <Typography
            variant='caption'
            style={{ margin: '1rem', padding: '1rem', color: '#00aae4' }}
          />
        </>}
    </div>
  )
}

const StyledDivContainer = styled.div`
margin-bottom: -7px;
`

export default SeleccionMultiple
