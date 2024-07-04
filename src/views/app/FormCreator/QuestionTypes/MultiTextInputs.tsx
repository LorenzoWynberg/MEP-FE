import React, { useState } from 'react'
import { Typography } from '@material-ui/core'
import { cloneDeep } from 'lodash'
import Add from '@material-ui/icons/Add'
import '../../../../assets/css/sass/containerStyles/report.scss'
import TextOption from './_partials/MultiTextInputs/TextOption'
import { Input, Label, FormGroup } from 'reactstrap'
import { useTranslation } from 'react-i18next'

const MultiTextInput = (props) => {
  const { t } = useTranslation()
  const [loadingOptionsRender, setLoadingOptionsRender] = useState(false)
  const [stateResponse, setStateResponse] = React.useState({})

  const handleOnChange = (event, option) => {
    setStateResponse({ ...stateResponse, [option.idx]: { ...option, respuesta: event.target.value } })
    props.handleOnChangeValue({ ...stateResponse, [option.idx]: { ...option, respuesta: event.target.value } })
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
    props.onChange(newOptions, 'options')
  }

  const handleChangeOption = (value, type, optionIdx) => {
    const options = cloneDeep(props.question.options)
    options[optionIdx][type] = value
    props.onChange(options, 'options')
  }

  return (
    <div>
      <div
        id={`${props.question.id}-draggableTextOptionsContainer`}
        onDragOver={(e) => {
          if (props.draggingContainerId == `${props.question.id}-draggableTextOptionsContainer`) {
            e.stopPropagation()
            props.dragOver(e, `${props.question.id}-draggableTextOptionsContainer`)
          }
        }}
      >

        {!loadingOptionsRender && props.question.options.map((option, i) => {
          if (!props.active) {
            return (
              <FormGroup key={option.idx}>
                <Label>
                  {option.label}
                </Label>
                <Input
                  value={props.value && props.value[option.idx]?.respuesta}
                  disabled={(props.disabled) ? 'disabled' : ''}
                  style={{ width: '15rem' }}
                  onChange={(event) => handleOnChange(event, option)}
                />
              </FormGroup>
            )
          }
          return (
            <div
              id={`${props.question.id}-${option.idx}-text-option`}
              className={`${props.question.id}-draggableTextOptions`}
              draggable
              index={i}
              onDragStart={(e) => {
                e.stopPropagation()
                props.dragStart(`${props.question.id}-${option.idx}-text-option`, `${props.question.id}-draggableTextOptions`, `${props.question.id}-draggableTextOptionsContainer`, e)
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
            >
              <TextOption
                onChangeOption={(value, type) => handleChangeOption(value, type, i)}
                deleteOption={() => deleteOption(i)}
                active={props.active}
                option={option}
                unic={props.unic}
                handleImagesOpen={props.handleImagesOpen}
                {...props}
              />
            </div>
          )
        })}
      </div>
      {!props.response &&
        <>
          <br />
          <Typography
            variant='caption'
            style={{ margin: '1rem', padding: '1rem', color: '#00aae4' }}
          >
            {props.active && <div>
              <a htmlFor='' onClick={CreateCheckBox} className='AgregarOpcionButon'>
                {' '}
                <Add className='AddButon' />
                {t('formularios>formulario_respuestas>agregar_campo_texto', 'Agregar campo de texto')}
              </a>
                             </div>}
          </Typography>
        </>}
    </div>
  )
}

export default MultiTextInput
