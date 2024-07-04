import React from 'react'
import { Card, CardBody, Badge } from 'reactstrap'
import ViewQuestion from '../../QuestionTypes'

class ItemsShow extends React.Component {
  render () {
    return (
      <div>
        <h2>Respuestas</h2>
        {this.props.currentResponses?.map((response) => {
				  console.log(response)
				  console.log(response.r.respuesta)
				  return (
  <Card md={12} style={{ marginTop: '30px' }}>
    <CardBody>
      <ViewQuestion
        question={this.props.currentQuestion}
        value={response.r.respuesta}
        disabled
        active={false}
        response
        handleImagesOpen={() => {}}
        summary
      />
      <hr />
      <Badge href='#' color='dark'>
        {response?.name
									  ? `${response?.name} - `
									  : ''}{' '}
        {response?.email}
      </Badge>
    </CardBody>
  </Card>
				  )
        })}
      </div>
    )
  }
}

export default ItemsShow
