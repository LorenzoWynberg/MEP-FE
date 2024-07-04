import React, { useState, useEffect } from 'react'
import { Wizard, Steps, Step, WithWizard } from 'react-albus'
import { Button, Form } from 'reactstrap'
import { DisplayField } from '../utils/fieldsFunction.tsx'

const Stepper = (props) => {
  const [stepperInputsData, setStepperInputsData] = useState({})
  const [stepperController, setStepperController] = useState({})
  const {
    field,
    register,
    setValue,
    watch,
    errors,
    currentItem,
    pageData,
    getValues,
    setOpenLayout
  } = props

  useEffect(() => {
    const _data = { ...stepperInputsData, ...getValues() }
    setStepperInputsData(_data)
  }, [stepperController])

  useEffect(() => {
    Object.keys(stepperInputsData).forEach((item) => {
      setValue(item, stepperInputsData[item])
    })
  }, [stepperInputsData])

  const sendData = (data) => {
    const _data = {
      solucion: JSON.stringify({
        ...stepperInputsData,
        ...data
      })
    }

    props.sendStepperData(_data, true)
  }

  return (
    <Form>
      <Wizard>
        <Steps>
          {field.steps.map((step, i) => {
					  return (
  <Step id={`step${i}`}>
    <DisplayField
      sendStepperData={props.sendStepperData}
      setOpenLayout={props.setOpenLayout}
      editable={props.editable}
      handleSubmit={props.handleSubmit}
      getValues={props.getValues}
      handleFilesChange={props.handleFilesChange}
      files={props.files}
      handleFilesDelete={props.handleFilesDelete}
      multiSelects={props.multiSelects}
      setMultiSelects={props.setMultiSelects}
      handleMultiSelectsOptions={
										props.handleMultiSelectsOptions
									}
      tablesData={props.tablesData}
      handleTableDataChange={
										props.handleTableDataChange
									}
      dataForm={props.dataForm}
      readOnlyFields={props.readOnlyFields}
      field={step}
      register={register}
      setValue={setValue}
      watch={watch}
      errors={errors}
      currentItem={currentItem}
      pageData={pageData}
    />
  </Step>
					  )
          })}
        </Steps>
        <WithWizard
          render={({ next, previous, step, steps }) => (
            <div className='text-center'>
              <Button
                onClick={async () => {
								  if (steps.indexOf(step) > 0) {
								    await setStepperController(step)
								    return previous()
								  }
								  return setOpenLayout(null)
                }}
                outline
                color='primary'
              >
                {steps.indexOf(step) > 0
								  ? 'Anterior'
								  : 'Cancelar'}
              </Button>
              <Button
                onClick={async () => {
								  if (
								    steps.indexOf(step) <
										steps.length - 1
								  ) {
								    await setStepperController(step)
								    next()
								  } else {
								    sendData(getValues())
								  }
                }}
                color='primary'
              >
                Siguiente
              </Button>
            </div>
          )}
        />
      </Wizard>
    </Form>
  )
}

export default Stepper
