import React, { useState } from 'react'
import { Wizard, Steps, Step } from 'react-albus'
// import { injectIntl } from 'react-intl'
import { BottomNavigation } from '../../../../components/wizard/BottomNavigation'
import { TopNavigation } from '../../../../components/wizard/TopNavigation'

import OtrosDatosPage from './_partials/OtrosDatosPage'
import ResidenciaPage from './_partials/ResidenciaPage'
import HogarPage from './_partials/HogarPage'
import ApoyosPage from './_partials/ApoyosPage'
import MatriculaPage from './_partials/MatriculaPage'
import { makeStyles } from '@material-ui/core/styles'
import { useTranslation } from 'react-i18next'

const MatricularEstudiantesWizard = (props) => {
  // const { messages } = props.intl
  const { t } = useTranslation()
  const [navigationStep, setNavigationStep] = useState(true)
  const classes = useStyles()
  const {
    state,
    register,
    errors,
    setValue,
    onClickNext,
    onClickPrev,
    topNavClick,
    setError,
    unregister,
    clearErrors,
    loading,
    disableNext
  } = props

  const toggleNavigationStep = (data) => {
    setNavigationStep(data)
  }

  return (
    <div className='wizard wizard-default wizard-matricular'>
      <Wizard id='wizard-matricular'>
        <TopNavigation
          className={classes.root + ' justify-content-center'}
          disableNav={false}
          topNavClick={topNavClick}
        />
        <Steps>
          <Step id='step1' name='Otros datos' desc=''>
            <div className='wizard-basic-step'>
              <OtrosDatosPage
                {...props}
                register={register}
                unregister={unregister}
                setValue={setValue}
                errors={errors}
                state={state}
                setError={setError}
              />
            </div>
          </Step>
          <Step id='step2' name='Residencia' desc=''>
            <div className='wizard-basic-step'>
              <ResidenciaPage
                {...props}
                register={register}
                setValue={setValue}
                errors={errors}
                state={state}
                setError={setError}
                clearErrors={clearErrors}
              />
            </div>
          </Step>
          <Step id='step3' name='Encargados' desc=''>
            <div className='wizard-basic-step '>
              <HogarPage
                {...props}
                register={register}
                setValue={setValue}
                errors={errors}
                state={state}
                setError={setError}
                toggleNavigationStep={toggleNavigationStep}
              />
            </div>
          </Step>
          <Step id='step4' name='Apoyos educativos' desc=''>
            <div className='wizard-basic-step'>
              <ApoyosPage
                {...props}
                register={register}
                setValue={setValue}
                errors={errors}
                state={state}
                setError={setError}
              />
            </div>
          </Step>
          <Step id='step5' name='Matrícula' desc=''>
            <div className='wizard-basic-step'>
              <MatriculaPage register={register} />
            </div>
          </Step>
        </Steps>

        <BottomNavigation
          disableNext={disableNext}
          onClickNext={onClickNext}
          onClickPrev={onClickPrev}
          className='justify-content-center'
          prevLabel={t('general>anterior', 'Anterior')}
          nextLabel={t('general>siguiente', 'Siguiente')}
        />
      </Wizard>
    </div>
  )
}

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: -75
  }
}))

export default MatricularEstudiantesWizard
