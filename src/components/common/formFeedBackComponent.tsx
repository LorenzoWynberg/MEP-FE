import React from 'react'
import { FormFeedback } from 'reactstrap'

interface IProps {
  txt?: string
}

const FormFeedBack: React.FC<IProps> = (props) => {
  const { txt } = props
  return <FormFeedback>{txt}</FormFeedback>
}

FormFeedBack.defaultProps = {
  txt: 'Este campo es requerido'
}
export default FormFeedBack
