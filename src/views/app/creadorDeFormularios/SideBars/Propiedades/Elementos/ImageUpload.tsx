import React from 'react'
import {
  Form,
  FormGroup,
  Input,
  Label
} from 'reactstrap'
import { PropsImageUpload } from '../../../Types/propiedades.tsx'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import { IOSSwitch } from '../../../../../../components/IosSwitch.tsx'
import '../../../styles.scss'
import CustomSelectInput from 'Components/common/CustomSelectInput'
import Select from 'react-select'

const ImageUpload: React.FC<PropsImageUpload> = (props) => {
  const handleChangeRequired = () => {
    props.handleChange('required', !props.field.config.required, true)
  }

  const handleChangeMultiple = () => {
    props.handleChange('multiple', !props.field.config.multiple, true)
  }

  const _formas = ['rectangular', 'circular']

  return (
    <div>
      <h4>[IMAGEN]</h4>
      <div className='content-form'>
        <Form>
          <FormGroup>
            <Label for='tituloId'>Título</Label>
            <Input
              type='text'
              name='titulo'
              value={props.field.label}
              id='tituloId'
              placeholder='Título'
              onChange={(e) => { props.handleChange('label', e.target.value) }}
            />
          </FormGroup>

          <FormGroup>
            <FormControlLabel
              control={
                <IOSSwitch
                  checked={props.field.config.required}
                  onClick={handleChangeRequired}
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
                  checked={props.field.config.multiple}
                  onClick={handleChangeMultiple}
                  name='multiple'
                  color='primary'
                />
                            }
              label='Multiple'
              labelPlacement='start'
              className='switch-required'
            />
          </FormGroup>

          <FormGroup className='position-relative' style={{ width: '100%' }}>
            <Label>Forma</Label>
            <Select
              components={{ Input: CustomSelectInput }}
              className='react-select'
              classNamePrefix='react-select'
              name='forma'
              id='forma'
              isDisabled={false}
              onChange={data => {
                props.handleChange('forma', data.value, true)
              }}
              value={{ label: props.field.config.forma, value: props.field.config.forma }}
              placeholder='Seleccionar'
              options={_formas.map(
                item => ({
                  label: item,
                  value: item
                })
              )}
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

export default ImageUpload
