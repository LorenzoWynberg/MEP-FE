import React from 'react'
import {
  Form,
  FormGroup,
  Label,
  Input
} from 'reactstrap'
import { PropsTextArea } from '../../../Types/propiedades.tsx'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import { IOSSwitch } from '../../../../../../components/IosSwitch.tsx'
import '../../../styles.scss'

const TextArea: React.FC<PropsTextArea> = (props) => {
  const [required, setRequired] = React.useState(props.required)

  const handleChange = () => {
    props.handleChange('required', !props.field.config.required, true)
  }

  return (
    <div>
      <h4>[ÁREA DE TEXTO]</h4>
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

          <FormGroup>
            <Label for='informacionId'>Información (tooltip)</Label>
            <Input
              type='textarea'
              name='tooltip'
              value={props.field.config.tooltipText}
              id='informacionId'
              placeholder='Identificación del estudiante'
              onChange={(e) =>
                props.handleChange('tooltipText', e.target.value, true)}
            />
          </FormGroup>

          <FormGroup>
            <Label for='minLengthId'>Mínimo de caracteres permitidos</Label>
            <Input
              type='text'
              name='minLength'
              value={props.field.config.minLength}
              id='minLengthId'
              onChange={(e) =>
                props.handleChange('minLength', e.target.value, true)}
              placeholder='5'
            />
          </FormGroup>
          <FormGroup>
            <Label for='maxLengthId'>Máximo de caracteres permitidos</Label>
            <Input
              type='text'
              name='maxLength'
              value={props.field.config.maxLength}
              onChange={(e) =>
                props.handleChange('maxLength', e.target.value, true)}
              id='maxLengthId'
              placeholder='120'
            />
          </FormGroup>
          <FormGroup>
            <Label for='placeholderId'>Texto de ejemplo (placeholder)</Label>
            <Input
              type='text'
              name='placeholder'
              value={props.field.config.placeholder}
              onChange={(e) =>
                props.handleChange('placeholder', e.target.value, true)}
              id='placeholderId'
              placeholder='Introduzca nombre aquí'
            />
          </FormGroup>

          <FormGroup>
            <FormControlLabel
              control={
                <IOSSwitch
                  checked={props.field.config.required}
                  onClick={handleChange}
                  name='required'
                  color='primary'
                />
              }
              label='Requerido'
              labelPlacement='start'
              className='switch-required'
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

export default TextArea
