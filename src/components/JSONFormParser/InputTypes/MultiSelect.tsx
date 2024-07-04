import React, { useState } from 'react'
import { Modal, ModalHeader, Container, ModalBody, Button, Col, Row, CustomInput } from 'reactstrap'
import { makeStyles } from '@material-ui/core/styles'
import { useSelector } from 'react-redux'
import { listasPredefinidas } from '../utils/Options'
import colors from '../../../assets/js/colors'
import styled from 'styled-components'
import { TooltipLabel, StyledFormGroup } from '../styles.tsx'

import { maxLengthString } from '../../../utils/maxLengthString'
import { TooltipSimple } from '../../../utils/tooltip.tsx'
import { cloneDeep } from 'lodash'

const useStyles = makeStyles((theme) => ({
  inputTags: {
    minHeight: '2.8rem',
    border: '1px solid #d7d7d7;',
    padding: '0.35rem',
    color: 'white',
    marginBottom: '0.5rem'
  },
  input: {
    display: 'none'
  }
}))

const MultiSelect = (props) => {
  const [isOpen, setIsOpen] = useState(false)
  const [stagedOptions, setStagedOptions] = useState({ options: [] })
  const classes = useStyles()
  const state = useSelector((store) => {
    return {
      selects: store.selects
    }
  })
  const renderOptions = () => {
    let _options = []
    if (typeof props.field.options === 'string') {
      if (props.field.options.search('FromDB') > 0) {
        _options = state.selects[
          props.field.options.substr(0, props.field.options.length - 6)
        ]
      } else {
        _options = listasPredefinidas.find(item => item.id === props.field.options)?.options
      }
    } else {
      _options = props.field.options.map((option, i) => {
        return { ...option, id: option.value, nombre: option.label }
      })
    }
    return _options
  }

  const options = renderOptions()

  const toggle = (e, save = false) => {
    e && e.preventDefault()
    if (isOpen) {
      save && props.handleMultiSelectsOptions(props.field.id, stagedOptions)
    } else {
      setStagedOptions(props.multiSelects[props.field.id] || { options: [] })
    }
    setIsOpen(!isOpen)
  }

  const handleChangeItem = (item) => {
    const _options = cloneDeep(stagedOptions)
    if (props.field.config.unicOption) {
      _options.options = [item.id]
    } else if (_options.options.includes(item.id)) {
      _options.options = _options.options.filter(option => option !== item.id)
    } else {
      _options.options.push(item.id)
    }

    setStagedOptions(_options)
  }

  return (
    <StyledFormGroup>
      <TooltipLabel field={props.field} />
      <StyledMultiSelect
        className={classes.inputTags}
        disabled={!props.editable || props.readOnlyFields?.includes(props.field.id)}
        onClick={(e) => {
          if (props.editable && !props.readOnlyFields?.includes(props.field.id)) {
            toggle(e)
          }
        }}
      >
        {props.multiSelects[props.field.id] && props.multiSelects[props.field.id].options.map((option) => {
          const selectedOption = options.find(item => item.id == option)
          return <SelectItem item={selectedOption} />
        })}
      </StyledMultiSelect>
      <span style={{ color: 'red' }}>
        {/* props.validationArray.find(el => el == props.field.id) && "Este campo es requerido" */}
      </span>
      <Modal isOpen={isOpen && props.editable} toggle={toggle} size='lg'>
        <ModalHeader toggle={toggle}>
          Seleccione las opciones que apliquen
        </ModalHeader>
        <ModalBody>
          <Container className='modal-detalle-subsidio'>
            <Row>
              <Col xs={12}>
                {options && options.map((item) => {
                  return (
                    <Row>
                        <Col xs={3} className='modal-detalle-subsidio-col'>
                            <div>
                                <CustomInput
                                    type={props.field.config.unicOption ? 'radio' : 'checkbox'}
                                    label={item.nombre}
                                    inline
                                    onClick={() => handleChangeItem(item)}
                                    checked={stagedOptions.options?.includes(item.id)}
                                  />
                              </div>
                          </Col>
                        <Col xs={9} className='modal-detalle-subsidio-col'>
                            <div>
                                <p>
                                    {item.descripcion
                                        ? item.descripcion
                                        : item.detalle ? item.detalle : 'Elemento sin detalle actualmente'}
                                  </p>
                              </div>
                          </Col>
                      </Row>
                  )
                })}
              </Col>
            </Row>
            <Row>
              <CenteredRow xs='12'>
                <Button
                  onClick={(e) => {
                    toggle(e)
                  }}
                  color='primary'
                  outline
                >
                  Cancelar
                </Button>
                <Button
                  color='primary'
                  onClick={(e) => {
                    toggle(e, true)
                  }}
                >
                  Guardar
                </Button>

              </CenteredRow>
            </Row>

          </Container>
        </ModalBody>
      </Modal>
    </StyledFormGroup>
  )
}

const SelectItem = (props) => {
  if (props.item) {
    return (
      <TooltipSimple
        element={<ItemSpan>{maxLengthString(props.item.nombre)}</ItemSpan>}
        title={props.item.nombre}
      />
    )
  } else {
    return null
  }
}

const ItemSpan = styled.span`
    background-color: ${colors.primary};
    padding-left: 8px;
    padding-right: 8px;
    border-radius: 15px;
    height: 1.45rem;
    margin: 2px;
`
const StyledMultiSelect = styled.div`
    display: grid;
    grid-template-columns: 50% 50%;
    position: relative;

    ${props => !props.disabled
? `&::after {
        content: "+";
        color: white;
        position: absolute;
        right: 10px;
        top: 30%;
        background-color: ${colors.primary};
        border-radius: 50%;
        height: 1.5rem;
        width: 1.5rem;
        font-weight: bold;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        font-size: 21px;
    }`
: ''}
    &[disabled] {
        background-color: #eaeaea;
    }
`

const CenteredRow = styled(Col)`
  display: flex;
  justify-content: center;
  align-items: center;
`

export default MultiSelect
