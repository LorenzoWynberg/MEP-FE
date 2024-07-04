import React from 'react'
import {
  Form,
  FormGroup,
  Label,
  Button,
  Input,
  InputGroup,
  InputGroupAddon
} from 'reactstrap'
import DefinirFuenteLista from '../utils/definirFuenteLista.tsx'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import { IOSSwitch } from '../../../../../../components/IosSwitch.tsx'
import '../../../styles.scss'

const getLabelValueDefined = (field) => {
  const options = field.options

  return options.length == 0 ? 'No definido' : 'Otro'
}

const MultiSelect = (props) => {
  const [modalOpen, setModalOpen] = React.useState(false)
  const [valueOptions, setValueOptions] = React.useState(
    getLabelValueDefined(props.field)
  )

  const toggleModal = () => {
    setModalOpen(!modalOpen)
  }

  const handleChange = () => {
    props.handleChange('required', !props.field.config.required, true)
  }

  const setValueDefined = (value) => {
    setValueOptions(value)
  }

  return (
    <div>
      <h4>[SELECCIÓN MULTIPLE]</h4>
      <div className='content-form'>
        <Form>
          <FormGroup>
            <Label for='tituloId'>Título</Label>
            <Input
              type='text'
              name='titulo'
              value={props.field.label}
              id='tituloId'
              placeholder='Estado civil'
              onChange={(e) => {
                props.handleChange('label', e.target.value)
              }}
            />
          </FormGroup>
          <FormGroup>
            <Label for='optionsId'>Lista de opciones</Label>
            <InputGroup>
              <Input
                type='text'
                name='options'
                disabled
                placeholder={valueOptions}
              />
              <InputGroupAddon addonType='append'>
                <Button
                  color='primary'
                  onClick={(e) => {
                    e.preventDefault()
                    toggleModal()
                  }}
                >
                  Definir
                </Button>
              </InputGroupAddon>
            </InputGroup>
          </FormGroup>

          <FormGroup>
            <Label for='informacionId'>Información (tooltip)</Label>
            <Input
              type='textarea'
              name='tooltip'
              value={props.field.config.tooltipText}
              id='informacionId'
              placeholder='Elege tu estado civil'
              onChange={(e) =>
                props.handleChange('tooltipText', e.target.value, true)}
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
      <DefinirFuenteLista
        field={props.field}
        modalOpen={modalOpen}
        toggleModal={toggleModal}
        selects={props.selects}
        handleChange={props.handleChange}
        setValueDefined={setValueDefined}
      />
    </div>
  )
}

export default MultiSelect
