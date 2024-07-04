import React from 'react'
import RespuestaEscrita from '../QuestionTypes/RespuestaEscrita'

const displayQuestion = (props) => {
  switch (props.question.type) {
    case 'text':
      return (
        <RespuestaEscrita
          onChange={props.handleChange}
          question={props.question}
        />
      )
  }
}

export default displayQuestion
