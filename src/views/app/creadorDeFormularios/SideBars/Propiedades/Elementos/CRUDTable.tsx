import React from 'react'
import {
  Form,
  FormGroup,
  Label,
  Button,
  Input
  , InputGroup, InputGroupAddon
} from 'reactstrap'
import { PropsTextArea } from '../../../Types/propiedades.tsx'
import { cloneDeep } from 'lodash'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import { IOSSwitch } from '../../../../../../components/IosSwitch.tsx'
import '../../../styles.scss'
import DefinirFuenteLista from '../utils/definirFuenteLista.tsx'

const getLabelValueDefined = (field) => {
  const options = field.options || ''

  return options.length == 0 ? 'No definido' : 'Otro'
}

const TextArea: React.FC<PropsTextArea> = (props) => {
  const [required, setRequired] = React.useState(props.required)
  const [modalOpen, setModalOpen] = React.useState(false)
  const [valueOptions, setValueOptions] = React.useState(
    getLabelValueDefined(props.field)
  )
  const inputRefs = {
    column1: React.createRef(null),
    column2: React.createRef(null)
  }
  const handleChange = (idx, value) => {
    const _columns = cloneDeep(props.field.config.columns)
    props.handleChange('columns', _columns.map((item, i) => {
      if (i === idx) {
        return { ...item, titulo: value }
      }
      return item
    }), true)
  }

  const handleOptions = () => {
    props.handleChange('multipleOptions', !props.field.config.multipleOptions, true)
  }

  const setValueDefined = (value) => {
    setValueOptions(value)
  }

  const toggleModal = () => {
    setModalOpen(!modalOpen)
  }

  return (
    <div>
      <h4>[TABLA]</h4>
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
            <Label for='tituloId'>Titulo del modal</Label>
            <Input
              type='text'
              name='titulo'
              value={props.field.modalTitle}
              id='tituloId'
              placeholder='Identificación'
              onChange={(e) => {
                props.handleChange('modalTitle', e.target.value)
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
            <Label for='informacionId'>Valor de la primera columna</Label>
            <Input
              type='text'
              name='titulo'
              value={props.field.config.columns[0].titulo}
              id='value1id'
              innerRef={inputRefs.column1}
              placeholder='Identificación'
              onChange={(e) => {
                handleChange(0, e.target.value)
              }}
            />
          </FormGroup>
          <FormGroup>
            <Label for='btnSubmitText'>Texto del botón</Label>
            <Input
              type='text'
              name='btnSubmitText'
              value={props.field.btnSubmitText}
              id='btnSubmitText'
              placeholder='Agregar'
              onChange={(e) => {
                props.handleChange('btnSubmitText', e.target.value)
              }}
            />
          </FormGroup>
          <FormGroup>
            <Label for='informacionId'>Valor de la segunda columna</Label>
            <Input
              type='text'
              name='value2'
              value={props.field.config.columns[1].titulo}
              id='value2id'
              innerRef={inputRefs.column1}
              placeholder='Identificación'
              onChange={(e) => {
                handleChange(1, e.target.value)
              }}
            />
          </FormGroup>
          <FormGroup>
            <FormControlLabel
              control={
                <IOSSwitch
                  checked={props.field.config.multipleOptions}
                  onClick={handleOptions}
                  name='options'
                  color='primary'
                />
              }
              label='Opciones'
              labelPlacement='start'
              className='switch-required'
            />
          </FormGroup>
          <FormGroup>
            <FormControlLabel
              control={
                <IOSSwitch
                  checked={props.field.config.avoidCutText}
                  onClick={(e) => {
                    const aux = props.field?.config?.checkbox !== undefined ? !e.target?.checked : e.target?.checked
                    props.handleChange('avoidCutText', aux, true)
                  }}
                  name='avoidCutText'
                  color='primary'
                />
              }
              label='Evitar cortar texto'
              labelPlacement='start'
              className='switch-required'
            />
          </FormGroup>
          {props.field.config.multipleOptions &&
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
              <DefinirFuenteLista
                field={{ ...props.field, options: props.field.options || '' }}
                modalOpen={modalOpen}
                toggleModal={toggleModal}
                selects={props.selects}
                handleChange={props.handleChange}
                setValueDefined={setValueDefined}
              />
            </FormGroup>}
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
