import React, { useRef, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import ViewQuestion from '../FormCreator/QuestionTypes'
import FroalaEditorView from 'react-froala-wysiwyg/FroalaEditorView'
import { Row } from 'reactstrap'
import styled from 'styled-components'
import CheckIcon from '@material-ui/icons/Check'
import colors from 'Assets/js/colors'
import { Tooltip, withStyles } from '@material-ui/core'
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined'
import { envVariables } from 'Constants/enviroment'

const HtmlTooltip = withStyles((theme) => ({
  tooltip: {
    backgroundColor: '#fff',
    color: 'rgba(0, 0, 0, 0.87)',
    maxWidth: 220,
    fontSize: theme.typography.pxToRem(12),
    border: `2px solid ${colors.primary}`
  }
}))(Tooltip)

const Question = (props) => {
  const [started, setStarted] = useState(null)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(null)
  const ref = useRef(null)
  const { print } = useParams()
  useEffect(() => {
    props.setQuestionRef(ref)
  }, [ref])
  const fontfamilystyle = props.state.currentFormTheme.font || 'inherit'

  const errorFunction = (el) => {
    switch (el) {
      case 'required':
        return <p>Esta pregunta es requerida</p>
      case 'min':
        return (
          <p>
            Esta pregunta ocupa un mínimo de{' '}
            {props.currentErrors[props.question.id].min} caracteres
          </p>
        )
      case 'email':
        return (
          <p>Esta respuesta debe ser un correo electrónico válido</p>
        )
      case 'hundred':
        return <p>Los porcentajes deben de sumar 100%</p>
    }
  }
  return (
    <div
      style={{
			  height: !props.displayAll ? '52vh' : '',
			  padding: '1.5rem',
			  width: '100%',
			  position: 'relative',
			  fontFamily: props.state.currentFormTheme.font || 'inherit',
			  backgroundColor: !props.displayAll ? '' : 'white',
			  borderRadius: '15px',
			  marginTop: !props.displayAll ? '28rem' : '',
			  marginBottom: !props.displayAll
			    ? props.isLast
			      ? '28rem'
			      : ''
			    : '0.5rem'
      }}
    >
      <div ref={ref} />
      {props.question.config.tooltip && (
        <span
          style={{ position: 'absolute', top: '9px', right: '9px' }}
          style={{
					  position: 'absolute',
					  top: '9px',
					  right: '9px',
					  fontFamily:
							props.state.currentFormTheme.font || 'inherit'
          }}
        >
          <HtmlTooltip
            title={props.question.config.tooltipText}
            placement='right'
          >
            <StyledInfoOutlinedIcon />
          </HtmlTooltip>
        </span>
      )}
      <Row>
        {/* {!props.ocultarNumeracionRespuestas && (
          <p>{props.question.idx + 1} - </p>
        )} */}
        {/* <FroalaEditorView model={props.question.label} /> */}
        <p
          style={{
            fontFamily:
              props.state.currentFormTheme.font || 'inherit'
          }}
        >
          {props.question.idx + 1} -{' '}
        </p>

        <FroalaEditorView
          model={props.question.label
            .replace(
              '<p>',
              `<p style=
							font-Family:` +
              fontfamilystyle +
              '>'
            )
            .replace('arial', fontfamilystyle)}
        />
      </Row>
      <ErrorFeedback>
        {props.displayAll
				  ? props.currentErrors[props.question.id]?.error &&
					  Object.keys(props.currentErrors[props.question.id]).map(
					    errorFunction
					  )
				  : Object.keys(props.currentErrors).map(errorFunction)}
      </ErrorFeedback>
      <ViewQuestion
        form={props.state.currentForm}
        active={false}
        response
        question={props.question}
        handleImagesOpen={() => {}}
        handleKeyPress={(e) => props.handleKeyPress(e, props.question)}
        handleOnChangeValue={(event) => {
				  props.onChange(event, props.question)
        }}
        value={
					props.formResponse[props.question.id] != undefined
					  ? props.formResponse[props.question.id].respuesta
					  : ''
				}
        resourcesUrl={`${envVariables.BACKEND_URL}/api/GestorFormulario/${props.state.currentForm.id}/Recurso`}
        uploadUrl={`${envVariables.BACKEND_URL}/api/GestorFormulario/${props.state.currentForm.id}/Recurso`}
        deleteResourceUrl={`${envVariables.BACKEND_URL}/api/GestorFormulario/${props.state.currentForm.id}/Recurso`}
        {...props}
      />
      {!props.displayAll && (
        <div
          style={{
					  display: 'flex',
					  width: '100%',
					  justifyContent: 'flex-start',
					  marginTop: '15px',
					  alignItems: 'center'
          }}
        >
          <props.ButtonStyled
            style={{ marginRight: '20px' }}
            primary
            backgroundColor={
							props.state.currentFormTheme.color || colors.primary
						}
            fontFamily={
							props.state.currentFormTheme.font || 'inherit'
						}
            onClick={() =>
						  props.handleOnResolveQuestion(
						    props.question,
						    props.formResponse[props.question.id]
						  )}
          >
            <span>Continuar</span> <CheckIcon />
          </props.ButtonStyled>
          <span>Presiona Enter</span>
        </div>
      )}
    </div>
  )
}

const ErrorFeedback = styled.span`
	color: #bd0505;
	right: 0;
	font-weight: bold;
	font-size: 9px;
	padding-top: 3px;
`

const StyledInfoOutlinedIcon = styled(InfoOutlinedIcon)`
	font-size: 1.2rem;
	margin-left: 5px;
`

export default Question
