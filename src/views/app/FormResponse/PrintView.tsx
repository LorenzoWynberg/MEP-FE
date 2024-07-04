import React from 'react'
import Question from './Question'
import { Button } from 'reactstrap'

const PrintQuestions = (props) => {
  const handlePrint = async () => {
    const printC = document.getElementById('printController')
    printC.style.display = 'none'
    window.print()
    props.history.push(`/forms/edit/${props.form.id}`)
  }

  return (
    <div>

      {props.questionsArray?.map((question, index, array) => {
        return (
          <Question
            state={props.state}
            ButtonStyled={() => null}
            displayAll
            question={question}
            parent={question.parent}
            handleOnResolveQuestion={() => {}}
            ocultarNumeracionRespuestas={false}
            currentErrors={{}}
            handleKeyPress={() => {}}
            formResponse={{}}
            onChange={() => {}}
            questionsRefs={{}}
            setQuestionRef={(value) => {}}
            {...props}
          />
        )
      })}

      <div style={{ padding: '1rem', display: 'flex', justifyContent: 'center' }} id='printController'>
        <Button
          style={{ margin: '0.5rem' }} color='primary' onClick={() => {
            handlePrint()
          }}
        >
          Imprimir
        </Button>
        <Button
          style={{ margin: '0.5rem' }} color='light' onClick={() => {
            props.history.push(`/forms/edit/${props.form.id}`)
          }}
        >
          Cancelar
        </Button>
      </div>
    </div>
  )
}

export default PrintQuestions
