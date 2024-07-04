import React from 'react'
import styled from 'styled-components'

interface IProps {
  txt?: string
}
const Feedback: React.FC<IProps> = (props) => {
  const { txt } = props
  return <FeedbackLabel>{txt}</FeedbackLabel>
}
Feedback.defaultProps = {
  txt: 'Campo requerido'
}
const FeedbackLabel = styled.label`
  color: #ef2b2b;
`

export default Feedback
