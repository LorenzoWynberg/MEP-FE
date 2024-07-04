import React from 'react'
import { Form, FormGroup, Label, Input } from 'reactstrap'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import { IOSSwitch } from '../../../../../../components/IosSwitch.tsx'
import '../../../styles.scss'
import { PropsContenedor } from '../../../Types/propiedades.tsx'
import { Button } from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles'

const StyledButton = withStyles((theme) => ({
  root: {
    backgroundColor: 'red',
    color: 'white'
  }
}))(Button)

const NestedContainer: React.FC<PropsContenedor> = (props) => {
  return (
    <div>
      <h4>[CONTENEDOR ANIDADO]</h4>
      <div className='content-form'>
        <Form>
          <FormGroup>
            <Label for='tituloId'>Título</Label>
            <Input
              type='text'
              name='titulo'
              value={props.titulo}
              id='tituloId'
              placeholder='Identificación'
              onChange={props.handleChange}
            />
          </FormGroup>
          <FormGroup>
            <Label for='informacionId'>Información (tooltip)</Label>
            <Input
              type='textarea'
              name='tooltipText'
              value={props.tooltipText}
              id='informacionId'
              placeholder='Identificación del estudiante'
              onChange={props.handleChange}
            />
          </FormGroup>
          <FormGroup>
            <FormControlLabel
              control={
                <IOSSwitch
                  checked={props.relleno}
                  name='relleno'
                  color='primary'
                  onClick={props.handleChange}
                />
              }
              label='Con relleno'
              labelPlacement='start'
              className='switch-relleno'
            />
          </FormGroup>
        </Form>
      </div>
    </div>
  )
}

export default NestedContainer
