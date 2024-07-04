import React, { useState } from 'react'
import { Typography } from '@material-ui/core'
import Option from './_partials/ListaDespegable/Option'
import { cloneDeep } from 'lodash'
import { Input } from 'reactstrap'
import Add from '@material-ui/icons/Add'
import '../../../../assets/css/sass/containerStyles/report.scss'
import Select from 'react-select'
import styled from 'styled-components'

const ListaDespegable = (props) => {
  const [loadingOptionsRender, setLoadingOptionsRender] = useState(false)

  // delete options
  const deleteOption = (idx) => {
    const options = props.question.options
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

  const CreateOption = () => {
    const options = cloneDeep(props.question.options)
    props.onChange(
      [...options, { label: '', idx: options.length }],
      'options'
    )
  }

  const handleChange = (event) => {
    // const {name, value} = event.target
    /* const name = event.target.value
		props.handleOnChangeValue({
			[name]: event.target.value
		}) */

    props.handleOnChangeValue({
      [props.question.idx]: event.value
    })
  }

  return (
    <div>
      {!props.response && (
        <>
          <Typography
            variant='caption'
            style={{
						  marginTop: '0',
						  marginLeft: '1rem',
						  color: '#848484'
            }}
          >
            {props.question.config.placeholder &&
							props.question.config.placeholderText}
          </Typography>
          <div
            style={{
						  paddingTop: '0.2rem',
						  paddingBottom: '1rem'
            }}
            id='draggableOptionsContainer'
            onDragOver={(e) => {
						  if (
						    props.draggingContainerId ==
								'draggableOptionsContainer'
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
										      setLoadingOptionsRender(
										        true
										      )
										      setTimeout(() => {
										        props.onChange(
										          elements,
										          'options'
										        )
										        setLoadingOptionsRender(
										          false
										        )
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
    {props.active && (
      <div>
        <Option
          onChange={(value, type) =>
													  handleChangeOption(
													    value,
													    type,
													    i
													  )}
          onChangeQuestion={
														props.onChange
													}
          deleteOption={() =>
													  deleteOption(i)}
          active={props.active}
          option={option}
          index={i}
        />
      </div>
    )}
  </div>
							  )
							})}
          </div>
          <br />
        </>
      )}
      <Typography
        variant='caption'
        style={{ margin: '1rem', padding: '1rem', color: '#00aae4' }}
      >
        {props.active && (
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
        )}
      </Typography>

      {!props.active && (
        <div>
          <StyledSelect
            isDisabled={props.disabled}
            options={props.question.options?.map((i) => ({
						  label: i.label,
						  value: i.idx
            }))}
            value={{
						  label:
								props.value != undefined
								  ? props.question.options.find(
								    (item) =>
								      item.idx ===
												props.value[props.question.idx]
									  )?.label
								  : null,
						  value:
								props.value != undefined
								  ? props.question.options.find(
								    (item) =>
								      item.idx ===
												props.value[props.question.idx]
									  )?.idx
								  : null
            }}
            onChange={handleChange}
            placeholder='Seleccione una opción'
          />
          {/* <Input
						type="select"
						className="SelectOption"
						value={props.value && props.value.option}
						onChange={handleChange}
						disabled={props.disabled}
						inputProps={{
							name: 'option',
							id: 'SelectId'
						}}
					>
						<option
							selected={!props.value}
							style={{ display: 'none', opacity: 0 }}
						>
							Seleccione una opción
						</option>

						{props.question.options.map((option, i) => {
							if (props.value) {
								if (
									option.idx.toString() ==
									props.value[option.idx.toString()]
								) {
									return (
										<option
											key={'option-select-' + i}
											value={i}
											selected
										>
											{option.label}
										</option>
									)
								} else {
									return (
										<option
											key={'option-select-' + i}
											value={i}
										>
											{option.label}
										</option>
									)
								}
							} else {
								return (
									<option
										key={'option-select-' + i}
										value={i}
									>
										{option.label}
									</option>
								)
							}
						})}
					</Input> */}
        </div>
      )}
    </div>
  )
}

const StyledSelect = styled(Select)`
	width: 14rem;
`

export default ListaDespegable
