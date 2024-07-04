import React from 'react'
import {
  Row, Col
} from 'reactstrap'
import FroalaEditorView from 'react-froala-wysiwyg/FroalaEditorView'

class ItemsShow extends React.Component {
  render () {
    return (
      <div>
        {
                    this.props.form.questionContainers?.map((parent) => {
                      return (
                        this.props.form.questions[parent.id] &&
                          this.props.form.questions[parent.id].map(
                            (question, index, array) => {
                              return (
                                <div
                                  style={{
                                    paddingTop: '10px',
                                    paddingBottom: '10px'
                                  }}
                                >
                                  <Row style={{ marginBottom: '15px' }}>
                                    <Col md={10}>
                                      <FroalaEditorView model={question?.label} />
                                    </Col>
                                    <Col md={2} style={{ textAlign: 'end' }}>
                                      {this.props.getIcon(question?.type, {
                                        fontSize: 'xxx-large'
                                      })}
                                    </Col>
                                  </Row>
                                  <div id={'question-' + question.id} className={`${!this.props.print && 'scroller'} fchartsOverlay`}>
                                    {this.props.getResponses(question.id)}
                                  </div>
                                </div>
                              )
                            }
                          )
                      )
                    })
                }
      </div>
    )
  }
}

export default ItemsShow
