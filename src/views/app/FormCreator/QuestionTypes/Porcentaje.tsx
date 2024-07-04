import React, { useState } from 'react'
import { Typography } from '@material-ui/core'
import Option from './_partials/Porcentaje/Option'
import { cloneDeep } from 'lodash'
import Add from '@material-ui/icons/Add'
import '../../../../assets/css/sass/containerStyles/report.scss'
const Porcentaje = (props) => {
  const [loadingOptionsRender, setLoadingOptionsRender] = useState(false)
  const [numberOption, setNumberOpcion] = useState([])

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
    const numberOptionsArray = numberOption
    if (type == 'porcentaje') {
      if (value <= 0) {
        value = ''
      } else {
        if (
          numberOption.length >= optionIdx &&
					numberOption.length > 0
        ) {
          numberOptionsArray[optionIdx] = value
          setNumberOpcion(numberOptionsArray)
        } else {
          setNumberOpcion([...numberOption, value])
        }
        let total = 0
        for (const number of numberOption) {
          total += parseFloat(number)
          if (total > 100) {
            value = ''
          }
        }
      }
    }
    const options = cloneDeep(props.question.options)
    options[optionIdx][type] = value
    props.onChange(options, 'options')
  }

  const CreateOption = () => {
    const options = cloneDeep(props.question.options)
    props.onChange(
      [...options, { label: '', idx: options.length, porcentaje: '' }],
      'options'
    )
  }
  return (
    <div>
      {props.active && <br />}
      <Typography
        variant='caption'
        style={{ marginTop: '1rem', marginLeft: '0', color: '#848484' }}
      >
        {props.question.config.placeholder
				  ? props.question.config.placeholderText
				  : 'Porcentaje'}
      </Typography>
      <div
        style={{
				  paddingTop: '1rem',
				  paddingBottom: '1rem'
        }}
        id='draggableOptionsContainer'
        onDragOver={(e) => {
				  if (
				    props.draggingContainerId == 'draggableOptionsContainer'
				  ) {
				    e.stopPropagation()
				    props.dragOver(e, 'draggableOptionsContainer')
				  }
        }}
      >
        {!loadingOptionsRender &&
					props.question.options.map((option, i) => {
					  return (
  <div
    id={`${option.idx}-option`}
    className='draggableOptions'
    draggable
    index={i}
    onDragStart={(e) => {
								  e.stopPropagation()
								  props.dragStart(
										`${option.idx}-option`,
										'draggableOptions',
										'draggableOptionsContainer',
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
								        props.onChange(
								          elements,
								          'options'
								        )
								        setLoadingOptionsRender(false)
								      }, 100)
								    }
								  )
    }}
    onDrop={(e) => {
								  e.preventDefault()
								  e.stopPropagation()
    }}
    style={{
								  marginBottom: '10px'
    }}
  >
    <Option
      onChangeOption={(value, type) =>
									  handleChangeOption(value, type, i)}
      deleteOption={() => deleteOption(i)}
      active={props.active}
      disabled={props.disabled}
      value={props.value}
      option={option}
      index={i}
      {...props}
    />
  </div>
					  )
					})}
      </div>
      {props.active && (
        <>
          <br />
          <Typography
            variant='caption'
            style={{
						  margin: '1rem',
						  padding: '1rem',
						  color: '#00aae4'
            }}
          >
            <div>
              <a
                htmlFor=''
                onClick={CreateOption}
                className='AgregarOpcionButon'
              >
                {' '}
                <Add className='AddButon' />
                Agregar una opción
              </a>
            </div>
          </Typography>
        </>
      )}
    </div>
  )
}
export default Porcentaje
