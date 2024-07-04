import React from 'react'
import {
  Form,
  FormGroup,
  Label,
  Input
} from 'reactstrap'
import { PropsSimpleText } from '../../../Types/propiedades.tsx'
import '../../../styles.scss'

const SwitchInput: React.FC<PropsSimpleText> = (props) => {
  const [required, setRequired] = React.useState(props.required)

  const handleChange = () => {
    props.handleChange('required', !props.field.config.required, true)
  }

  return (
    <div>
      <h4>[INTERRUPTOR]</h4>
      <div className='content-form'>
        <Form>
          <FormGroup>
            <Label for='tituloId'>Título</Label>
            <Input
              type='text'
              name='titulo'
              value={props.field.label}
              id='tituloId'
              placeholder='Identificación'
              onChange={(e) => {
                props.handleChange('label', e.target.value)
              }}
            />
          </FormGroup>
          {props.field.row && !props.field.col && <FormGroup>
            <Input
              type='select'
              name='size'
              value={props.field.config.size || 6}
              onChange={(e) => props.handleChange('size', e.target.value, true)}
              id='placeholderId'
              placeholder='Introduzca nombre aquí'
            >
              <option value={3}>
                25%
              </option>
              <option value={6}>
                50%
              </option>
              <option value={9}>
                75%
              </option>
            </Input>
          </FormGroup>}

        </Form>
      </div>
    </div>
  )
}

export default SwitchInput
