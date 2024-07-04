import React from 'react'
import Escrita from './RespuestaEscrita'
import Multiple from './SeleccionMultiple'
import Enriquecido from './TextoEnriquecido'
import Despegable from './ListaDespegale'
import Porcentaje from './Porcentaje'
import SubirArchivo from './SubirArchivo'
import Escala from './Escala'
import MultiTextInput from './MultiTextInputs'
import MatrizDobleEje from './MatrizDobleEje'
import DateInput from './Date'
import { IPropsViewQuestion } from '../Types/types'
import PropTypes from 'prop-types'

const ViewQuestion = (props: IPropsViewQuestion) => {
  const renderOptions = () => {
    switch (props.question.type) {
      case 'imageSelector':
        return (
          <Multiple
            unic
            handleImagesOpen={props.handleImagesOpen}
            question={props.question}
            {...props}
          />
        )
      case 'text':
        return <Escrita question={props.question} {...props} />
      case 'checklist':
        return (
          <Multiple
            handleImagesOpen={props.handleImagesOpen}
            question={props.question}
            {...props}
          />
        )
      case 'radio':
        return (
          <Multiple
            unic
            handleImagesOpen={props.handleImagesOpen}
            question={props.question}
            {...props}
          />
        )
      case 'richText':
        return <Enriquecido question={props.question} {...props} />
      case 'dropdown':
        return (
          <Despegable
            question={props.question}
            {...props}
            value={props.value}
          />
        )
      case 'percentage':
        return <Porcentaje question={props.question} {...props} />
      case 'rate':
        return (
          <Escala
            question={props.question}
            {...props}
            value={props.value}
          />
        )
      case 'uploadFile':
        return (
          <SubirArchivo
            question={props.question}
            {...props}
            value={Array.isArray(props.value) ? props.value : []}
          />
        )
      case 'textInputs':
        return <MultiTextInput question={props.question} {...props} />
      case 'matrix':
        return (
          <MatrizDobleEje
            question={props.question}
            value={props.value || []}
            {...props}
          />
        )
      case 'date':
        return <DateInput question={props.question} {...props} />
      default:
        return null
    }
  }
  return renderOptions()
}

ViewQuestion.propTypes = {
  question: PropTypes.object.isRequired,
  response: PropTypes.bool,
  active: PropTypes.bool,
  handleImagesOpen: PropTypes.func.isRequired,
  handleKeyPress: PropTypes.func,
  dragEnd: PropTypes.func,
  handleOnChangeValue: PropTypes.func,
  value: PropTypes.any,
  form: PropTypes.any,
  disabled: PropTypes.bool,
  dragStart: PropTypes.func
}

ViewQuestion.defaultProps = {
  response: false,
  active: false,
  disabled: false,
  dragStart: () => {},
  dragEnd: () => {},
  handleOnChangeValue: () => {}
}

export default ViewQuestion
