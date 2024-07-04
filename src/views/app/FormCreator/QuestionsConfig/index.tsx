import React, { useState } from 'react'
import { Container, Row, Col, Button, Form } from 'reactstrap'
import Escrita from './Escrita'
import Multiple from './Multiple'
import Enriquecido from './Enriquecido'
import Despegable from './Despegable'
import Porcentaje from './Porcentaje'
import Rate from './Rate'
import TextosMultiples from './TextosMultiples'
import FechaConfigs from './FechaConfigs'
import Subir from './Subir'
import Matrix from './Matrix'

const Configs = (props) => {
  const [stagedChanges, setStagedChanges] = useState(props.question)

  const onConfigSave = () => {
    props.handleChange(stagedChanges.config, 'config')
    props.handleConfigClose()
  }

  const onConfigChange = (value, type) => {
    const _config = { ...stagedChanges.config, [type]: value }

    setStagedChanges({ ...stagedChanges, config: _config })
  }

  const renderOptions = () => {
    switch (props.question.type) {
      case 'text':
        return (<Escrita question={stagedChanges} onConfigChange={onConfigChange} />)
      case 'matrix':
        return (<Matrix question={stagedChanges} onConfigChange={onConfigChange} />)
      case 'checklist':
        return (<Multiple question={stagedChanges} onConfigChange={onConfigChange} />)
      case 'radio':
        return (<Multiple question={stagedChanges} unic onConfigChange={onConfigChange} />)
      case 'rate':
        return (<Rate question={stagedChanges} onConfigChange={onConfigChange} />)
      case 'richText':
        return (<Enriquecido question={stagedChanges} onConfigChange={onConfigChange} />)
      case 'dropdown':
        return (<Despegable question={stagedChanges} onConfigChange={onConfigChange} />)
      case 'percentage':
        return (<Porcentaje question={stagedChanges} onConfigChange={onConfigChange} />)
      case 'textInputs':
        return (<TextosMultiples question={stagedChanges} onConfigChange={onConfigChange} />)
      case 'date':
        return (<FechaConfigs question={stagedChanges} onConfigChange={onConfigChange} />)
      case 'uploadFile':
        return (<Subir question={stagedChanges} onConfigChange={onConfigChange} />)
    }
  }

  return (
    <Container>
      <Form>
        {renderOptions()}
        <Row>
          <Col xs='12'>
            <div style={{ width: '100%', display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
              <Button
                outline color='primary' type='submit' style={{ marginRight: '10px' }} onClick={() => {
                  props.handleConfigClose()
                }}
              >
                Cancelar
              </Button>
              <Button
                color='primary' onClick={() => {
                  onConfigSave()
                }}
              >
                Guardar
              </Button>
            </div>
          </Col>
        </Row>
      </Form>
    </Container>
  )
}

export default Configs
