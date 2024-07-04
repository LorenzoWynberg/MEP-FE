import React from 'react'
import styled from 'styled-components'

import colors from '../../../assets/js/colors'

type StepsProps = {
    forms: Array<any>,
    step: number
}

const CurrentSteps: React.FC<StepsProps> = (props) => {
  return (
    <ContentSteps>
      {
                Array.from({ length: 3 }).map((current: any, index: number) => <Circle key={index} active={index == props.step}>{index + 1}</Circle>)
            }
    </ContentSteps>
  )
}

const ContentSteps = styled.div`
    display: flex;
    align-items: center;
`

const Circle = styled.button`
    background: ${(props) => props.active ? colors.primary : 'transparent'};
    border: 1px ${(props) => props.active ? colors.primary : '#707070'} solid;
    border-radius: 30px;
    color: ${(props) => props.active ? '#ffffff' : '#707070'};
    padding: 9px 15px;
    cursor: pointer;
    margin-right: 5px;
`

export default CurrentSteps
