import React, { useEffect, useState } from 'react'
import { Input, FormGroup, FormFeedback } from 'reactstrap'
import { TooltipLabel } from '../styles.tsx'
import { listasPredefinidas } from '../utils/Options'
import { withRouter } from 'react-router-dom'
import { useSelector } from 'react-redux'
import Select from 'react-select'
import CustomSelectInput from 'Components/common/CustomSelectInput'
import { Controller } from 'react-hook-form'

const DropDown: React.FC = (props) => {
  const state = useSelector((store) => {
    return {
      selects: store.selects
    }
  })
  const [selectOptions, setSelectOptions] = useState([])
  const [indexes, setIndexes] = useState([])
  const [defaultValue, setDefaultValue] = useState(null)

  useEffect(() => {
    if (!props.overrideOptionsWith) {
      if (typeof props.field.options === 'string') {
        if (
          props.field.options &&
					props.field.options?.search &&
					props.field.options?.search('FromDB') > 0
        ) {
          setSelectOptions(
            state.selects[
              props.field.options.substr(
                0,
                props.field.options.length - 6
              )
            ]
          )
          // ?.map((el) => ({
          // 	value: el?.id,
          // 	label: el.descripcion
          // 		? `${el.nombre} - ${el.descripcion}`
          // 		: el.nombre
          // }))
        } else {
          setSelectOptions(
            listasPredefinidas.find(
              (item) => item.id === props.field.options
            )?.options
          )
          // ?.map((el) => ({
          // 	value: el?.id,
          // 	label: el.descripcion
          // 		? `${el.nombre} - ${el.descripcion}`
          // 		: el.nombre
          // }))
        }
      } else {
        setSelectOptions(props.field.options)
        // ?.map((el) => ({ value: el?.value, label: el.label }))
      }
    } else {
      setSelectOptions(props.overrideOptionsWith)
      // .map((el) => ({
      // 	value: el?.id,
      // 	label: el.descripcion ? `${el.nombre} - ${el.descripcion}` : el.nombre
      // }))
    }
  }, [
    props.field.options,
    listasPredefinidas,
    state.selects,
    props.overrideOptionsWith
  ])

  useEffect(() => {
    if (selectOptions.length > 0 && props.dataForm) {
      // debugger
      const index = selectOptions?.findIndex(
        (el) =>
          el?.id == props?.dataForm[props?.field?.id] ||
					el?.value == props?.dataForm[props?.field?.id]
      )
      if (index !== -1 && !indexes.includes(index)) {
        setDefaultValue(selectOptions[index])
        setIndexes((prevState) => [...prevState, index])
      }
    }
  }, [selectOptions, props.dataForm, props?.field])

  useEffect(() => {
    if (
      defaultValue &&
			props.field?.id &&
			props.setValue &&
			defaultValue?.nombre
    ) {
      props.setValue(
        props.field?.id,
        defaultValue?.id || defaultValue?.value
      )
    }
  }, [defaultValue])
  useEffect(() => {
    if (selectOptions) {
      const value = props.getValues(props.field?.id)
      // const element = selectOptions?.find((el) => el.id === value)
      // setDefaultValue(element)
    }
  }, [props.field, selectOptions])
  const renderOptions = () => {
    let options = []
    if (typeof props.field.options === 'string') {
      if (props.field.options.search('FromDB') > 0) {
        options = state.selects[
          props.field.options.substr(
            0,
            props.field.options.length - 6
          )
        ]?.map((option, i) => {
          return (
            <option
              key={i}
              value={option.id}
              disabled={
								!props.editable ||
								props.readOnlyFields?.includes(props.field.id)
							}
            >
              {option.descripcion
							  ? `${option.nombre} - ${option.descripcion}`
							  : option.nombre}
            </option>
          )
        })
      } else {
        options = listasPredefinidas
          .find((item) => item.id === props.field.options)
          ?.options?.map((option, i) => {
            return (
              <option
                key={i}
                value={option.id}
                disabled={
									!props.editable ||
									props.readOnlyFields?.includes(
									  props.field.id
									)
								}
              >
                {option.descripcion
								  ? `${option.nombre} - ${option.descripcion}`
								  : option.nombre}
              </option>
            )
          })
      }
    } else {
      options = props.field.options?.map((option, i) => {
        return (
          <option
            key={i}
            value={option.value}
            disabled={
							!props.editable ||
							props.readOnlyFields?.includes(props.field.id)
						}
          >
            {option.label}
          </option>
        )
      })
    }
    return options
  }

  return (
    <>
      {/* <FormGroup className="position-relative" style={{ width: '100%' }}>
				<TooltipLabel field={props.field} />
				<Input
					type="select"
					name={`${props.field.id}`}
					// readOnly={
					// 	!props.editable ||
					// 	props.readOnlyFields?.includes(props.field.id)
					// }
					// disabled={
					// 	!props.editable ||
					// 	props.readOnlyFields?.includes(props.field.id)
					// }
					invalid={props.errors[`${props.field.id}`]}
					innerRef={props.register({
						required: props.field.config.required
					})}
					style={{
						cursor: 'pointer'
					}}
				>
					<option value={null} selected>
						{''}
					</option>
					{props.overrideOptionsWith
						? props.overrideOptionsWith?.map((option, i) => {
							return (
								<option
									key={i}
									value={option.id}
									disabled={
										!props.editable ||
										props.readOnlyFields?.includes(
											props.field.id
										)
									}
								>
									{option.descripcion
										? `${option.nombre} - ${option.descripcion}`
										: option.nombre}
								</option>
							)
						})
						: renderOptions()}
				</Input>

				<FormFeedback>
					{props.errors[`${props.field.id}`]
						? 'Este campo es requerido o fallo alguna validación'
						: null}
				</FormFeedback>
			</FormGroup> */}
      <FormGroup className='position-relative' style={{ width: '100%' }}>
        <TooltipLabel field={props.field} />
        {/* {false ? (
					<Controller
						control={props.control}
						// innerRef={props.register({
						// 	required: props.field.config.required
						// })}
						// value={defaultValue}
						name={props?.field?.id}
						rules={{ required: props.field.config.required }}
						styles={{
							menuPortal: (base) => ({
								...base,
								position: 'relative',
								zIndex: 999,
							})
						}}
						as={
							<Select
								components={{ Input: CustomSelectInput }}
								className="react-select"
								classNamePrefix="react-select"
								placeholder=""
								// value={defaultValue}
								getOptionLabel={(option: any) =>
									option.descripcion
										? `${option.nombre} - ${option.descripcion}`
										: option.nombre
								}
								getOptionValue={(option: any) =>
									option.value || option.id
								}
								// onChange={(e) => {
								// 	setDefaultValue(e)
								// }}
								options={selectOptions}
								isDisabled={
									!props.editable ||
									props.readOnlyFields?.includes(
										props.field.id
									)
								}
								invalid={props.errors[`${props.field.id}`]}
								styles={{
									menuPortal: (base) => ({
										...base,
										zIndex: 999,
									})
								}}
							/>
						}
					/>
				) : */}
        <Select
          components={{ Input: CustomSelectInput }}
          className='react-select'
          classNamePrefix='react-select'
          placeholder=''
          value={defaultValue}
          getOptionLabel={(option: any) =>
					  option.descripcion
					    ? `${option.nombre} - ${option.descripcion}`
					    : option.nombre}
          getOptionValue={(option: any) => option.value || option.id}
          onChange={(e) => {
					  setDefaultValue(e)
					  props.setValue(props.field?.id, e?.id || e?.value)
          }}
          options={selectOptions}
          isDisabled={
						!props.editable ||
						props.readOnlyFields?.includes(props.field.id)
					}
          invalid={props.errors[`${props.field.id}`]}
        />
      </FormGroup>
    </>
  )
}

export default withRouter(DropDown)
