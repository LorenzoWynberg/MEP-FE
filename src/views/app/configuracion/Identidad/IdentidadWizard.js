import React from 'react'

import { Wizard, Steps, Step } from 'react-albus'
import { injectIntl } from 'react-intl'
import { BottomNavigation } from 'Components/wizard/BottomNavigation'
import { TopNavigation } from 'Components/wizard/TopNavigation'

import IdentificacionForm from './_partials/IdentificacionForm.tsx'
import OtrosDatosPage from './_partials/OtrosDatosPage'
import ResidenciaPage from './_partials/ResidenciaPage'
import { makeStyles } from '@material-ui/core/styles'

import { Button } from 'reactstrap'

const IdentidadWizard = (props) => {
  const { messages } = props.intl
  const classes = useStyles()
  const {
    state,
    register,
    watch,
    loading,
    errors,
    setValue,
    getValues,
    onClickNext,
    onClickPrev,
    topNavClick,
    setError,
    control,
    currentStep,
    validationErrors
  } = props

  const renderIdentity = (action) => {
    if (action) {
      window.location.reload()
    } else {
      props.history.push('/director/expediente-estudiante')
    }
  }

  return (
    <div className='wizard wizard-default wizard-matricular'>
      <Wizard id='wizard-matricular'>
        <TopNavigation
          className={classes.root + ' justify-content-center'}
          disableNav
          topNavClick={topNavClick}
        />
        <Steps>
          <Step id='step1' name={messages['wizard.infoGeneral']}>
            <div className='wizard-basic-step'>
              <IdentificacionForm
                {...props}
                watch={watch}
                loading={loading}
                register={register}
                setValue={setValue}
                data={state.identidad.data}
                errors={errors}
                setError={setError}
                state={state}
              />
            </div>
          </Step>
          <Step id='step2' name={messages['wizard.otrosDatos']}>
            <div className='wizard-basic-step'>
              <OtrosDatosPage
                {...props}
                register={register}
                setValue={setValue}
                errors={errors}
                state={state}
                setError={setError}
                control={control}
                getValues={getValues}
                validationErrors={validationErrors}
              />
            </div>
          </Step>
          <Step id='step3' name={messages['wizard.residencia']}>
            <div className='wizard-basic-step'>
              <ResidenciaPage
                {...props}
                register={register}
                setValue={setValue}
                errors={errors}
                state={state}
                setError={setError}
                validationErrors={validationErrors}
              />
            </div>
          </Step>

          <Step id='step4' hideTopNav>
            <div
              className='wizard-basic-step text-center'
              style={{ margin: 50 }}
            >
              <h2
                className='mb-2'
                style={{
                  fontSize: '3rem',
                  color: '#145388',
                  fontWeight: 'bold'
                }}
              >
                ¡Excelente!
              </h2>
              <p>Has registrado una identidad exitosamente</p>
            </div>
          </Step>
        </Steps>
        {currentStep == 'step4'
          ? (
            <div style={{ textAlign: 'center' }}>
              <Button
                className='mr-1 mb-2'
                color='secondary'
                onClick={renderIdentity.bind(this, false)}
              >
                Ir a inicio
              </Button>
              <Button
                className='mr-1 mb-2'
                color='primary'
                onClick={renderIdentity.bind(this, true)}
              >
                Continuar
              </Button>
            </div>
            )
          : (
            <BottomNavigation
              onClickNext={onClickNext}
              onClickPrev={onClickPrev}
              className='justify-content-center'
              prevLabel={messages['wizard.prev']}
              nextLabel={
              currentStep == 'step3' ? 'Guardar' : messages['wizard.next']
            }
            />
            )}
      </Wizard>
    </div>
  )
}

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: -75
  }
}))

export default injectIntl(IdentidadWizard)
