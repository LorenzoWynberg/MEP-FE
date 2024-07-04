import React from 'react'
import { NavLink } from 'react-router-dom'
import styled from 'styled-components'
import { useTranslation } from 'react-i18next'
interface IProps {
  steps: any[]
  step: number
  setStep: Function
  children: any
}

const WizardC: React.FC<IProps> = (props) => {
  const { steps, step, setStep } = props
  const { t } = useTranslation()
  const getClassName = (index, stepItem): string => {
    if (step === index) {
      return 'step-doing'
    } else if (step > index || stepItem.isDone) {
      stepItem.isDone = true
      return 'step-done'
    }
  }

  const itemClick = (stepItem) => {
    setStep(stepItem.key)
  }

  return (
    <div className='wizard wizard-default'>
      <ul className='nav nav-tabs justify-content-between disabled'>
        {steps.map((stepItem, index) => {
          return (
            <WizardTab
              key={index}
              className={'nav-item ' + getClassName(index, stepItem)}
            >
              <NavLink
                location={{}}
                to='#'
                className='nav-link'
                onClick={() => stepItem.isDone && itemClick(stepItem)}
              >
                <span>{t(stepItem.titleKey, stepItem.title)}</span>
                <small>{t(stepItem.descKey, stepItem.description)}</small>
              </NavLink>
            </WizardTab>
          )
        })}
      </ul>
      <>{props.children}</>
    </div>
  )
}
const WizardTab = styled.li`
  cursor: pointer;
`
export default WizardC
