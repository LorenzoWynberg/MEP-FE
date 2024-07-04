import React from 'react'
import {
  Form,
  FormGroup
  , Input, Label
} from 'reactstrap'
import { PropsLocation } from '../../../Types/propiedades.tsx'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import { IOSSwitch } from '../../../../../../components/IosSwitch.tsx'
import '../../../styles.scss'

const Location: React.FC<PropsLocation> = (props) => {
  const handleChange = () => {
    props.handleChange('required', !props.field.config.required, true)
  }

  const handleChangeTemporal = () => {
    props.handleChange('temporal', !props.field.config.temporal, true)
  }

  const handleTooltips = (e) => {
    props.handleChange('tooltips', props.field.config.tooltips ? { ...props.field.config.tooltips, [e.target.name]: e.target.value } : { [e.target.name]: e.target.value }, true)
  }

  return (
    <div>
      <h4>[LOCACION]</h4>
      <div className='content-form'>
        <Form>
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
          <FormGroup>
            <FormControlLabel
              control={
                <IOSSwitch
                  checked={props.field.config.temporal}
                  onClick={handleChangeTemporal}
                  name='temporal'
                  color='primary'
                />
                            }
              label='Temporal'
              labelPlacement='start'
              className='switch-required'
            />
          </FormGroup>
          <FormGroup>
            <Label for='informacionId'>Información de la dirección exacta (tooltip)</Label>
            <Input
              type='textarea'
              name='descripcion'
              value={props.field.config.tooltips?.descripcion}
              id='informacionId'
              placeholder='Identificación del estudiante'
              onChange={(e) => handleTooltips(e)}
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

export default Location
