import React from 'react'
import {
  Form,
  FormGroup
  , Input
} from 'reactstrap'
import { PropsCoordinates } from '../../../Types/propiedades.tsx'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import { IOSSwitch } from '../../../../../../components/IosSwitch.tsx'
import '../../../styles.scss'

const Coordinates: React.FC<PropsCoordinates> = (props) => {
  const handleChange = () => {
    props.handleChange('required', !props.field.config.required, true)
  }

  const handleChangeUseModal = () => {
    props.handleChange('useModal', !props.field.config.useModal, true)
  }

  return (
    <div>
      <h4>[COORDENADAS]</h4>
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

            <FormControlLabel
              control={
                <IOSSwitch
                  checked={props.field.config.useModal}
                  onClick={handleChangeUseModal}
                  name='useModal'
                  color='primary'
                />
                            }
              label='Usar Modal'
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

export default Coordinates
