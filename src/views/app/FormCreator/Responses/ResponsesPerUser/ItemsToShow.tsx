import React from 'react'
import FroalaEditorView from 'react-froala-wysiwyg/FroalaEditorView'
import { Col, CardBody } from 'reactstrap'
import ViewQuestion from '../../QuestionTypes'

class ItemsToShow extends React.Component {
  render () {
    return (
      <CardBody>
        <h2>Sección de preguntas</h2>
        <Col
          md={8}
          style={{ paddingBottom: '40px', paddingTop: '10px' }}
        >
          {!this.props.loading &&
						this.props.form.questionContainers.map((parent) => {
						  return (
						    this.props.form.questions[parent.id] &&
								this.props.form.questions[parent.id].map(
								  (question, index, array) => {
								    return (
  <div
    style={{
												  paddingTop: '20px',
												  paddingBottom: '20px'
    }}
  >
    <FroalaEditorView
      model={question?.label}
    />
    <ViewQuestion
      value={
														this.props
														  .currentResponse
														  ?.respuestaParse[
														    question.id
														  ]?.respuesta
													}
      disabled
      response
      active={false}
      question={question}
      handleImagesOpen={() => {}}
      summary
    />
  </div>
								    )
								  }
								)
						  )
						})}
        </Col>
      </CardBody>
    )
  }
}

export default ItemsToShow
