import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import DeleteOutlinedIcon from '@material-ui/icons/DeleteOutlined'
import Cloud from '@material-ui/icons/BackupOutlined'
import {
  Input, Label,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  DropdownToggle
} from 'reactstrap'

import { FormGroup } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'

const Option = (props) => {
  const [dropdownCondicionOpen, setDropdownCondicionOpen] = useState(false)
  const { t } = useTranslation()

  const [condicionSelected, setCondicionSelected] = useState({ label: t('formularios>formulario_respuestas>condicion', 'Condición'), value: '' })

  const [condiciones, setCondiciones] = useState([
    { label: t('formularios>formulario_respuestas>siguiente_seccion', 'Ir a la siguiente sección'), value: '0' },
    { label: t('formularios>formulario_respuestas>enviar_formulario', 'Enviar formulario'), value: '-1' }
  ])

  useEffect(() => {
    if (props.option.section) {
      setCondicionSelected(props.option.section)
    }
    if (props.option.question) {
      setCondicionSelected(props.option.question)
    }
  }, [props.option])

  useEffect(() => {
    if (props.secciones) {
      const _condiciones = [{ label: t('formularios>formulario_respuestas>siguiente_seccion', 'Ir a la siguiente sección'), value: '0' }, ...props.secciones.filter(el => el.id !== props.parentId).map(el => ({ ...el, label: `Ir a la sección ${el.idx + 1}`, type: 'section', value: el.value })), ...props.preguntasSiguientes.map(el => ({ ...el, label: `Ir a la pregunta ${el.idx + 1}`, type: 'question', value: el.id })), { label: 'Enviar formulario', value: '-1' }]
      setCondiciones(_condiciones)
    }
  }, [props.secciones])

  const handleImage = () => {
    props.handleImagesOpen(props.option, props.option.image, function (newUrl) { props.onChangeOption(newUrl, 'image') })
  }

  const handleChangeCondicion = (pCondicion, deleteCondition = false) => {
    setCondicionSelected(pCondicion)
    if (deleteCondition) {
      props.handleCondicion(pCondicion, 'delete', props.option.idx)
    } else {
      const _type = pCondicion.type ? pCondicion.type : 'section'
      props.handleCondicion(pCondicion, _type, props.option.idx)
    }
  }

  const getSelectionIcon = () => {
    if (props.unic) {
      return <Input type='radio' color='primary' checked={!!props.checked} onClick={() => props.handleChangeOptionSelected(props.option.idx, true)} />
    } else {
      return <Input type='checkbox' color='primary' checked={!!props.checked} onClick={() => props.handleChangeOptionSelected(props.option.idx, false)} />
    }
  }

  if (props.response) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {props.option.image && <img src={props.option.image} style={{ height: '10rem', marginRight: '10px' }} />}
        <FormGroup className='cursor-pointer' style={props.option.image ? { display: 'flex', justifyContent: 'center' } : {}} onClick={(e) => props.handleChangeOptionSelected(props.option.idx, props.unic)}>
          <Label check>
            {getSelectionIcon(true)}
            {props.option.label}
          </Label>
        </FormGroup>
      </div>
    )
  }

  return (

    <div
      style={{
        display: 'flex',
        width: props.unic ? '100%' : '65%',
        alignItems: 'center',
        paddingLeft: '1rem'
      }}
    >
      <div
        style={{
          display: 'flex',
          width: !props.unic ? '100%' : '65%',
          alignItems: 'center'
        }}
      >
        {getSelectionIcon()}
        <StyledDivContainer active={props.active} first={props.option.idx === 0}>
          <span style={{ marginRight: '1rem' }}>{props.option.idx + 1}.</span>
          {
                  !props.option.image
                    ? props.active && <div
                        style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginRight: '10px' }} onClick={(e) => {
                          handleImage()
                        }}
                                      >
                      <Cloud color='primary' />
                    </div>
                    : <img
                        src={props.option.image} style={{ height: '2rem', marginRight: '10px' }} onClick={(e) => {
                          handleImage()
                        }}
                      />
                }
          <Input
            type='textarea'
            value={props.option.label}
            rows='1'
            onChange={(e) => {
              const data = e.target.value.split('\n')
              if (data.length === 1) {
                props.onChangeOption(data[0], 'label')
              } else {
                props.onChange(data.map((el, idx) => ({ idx, label: el })), 'options')
              }
            }}
            style={{
              height: '2rem',
              overflow: 'hidden',
              resize: 'none',
              padding: '0.3rem'
            }}
          />
          {props.active && <div>
            <StyledIcons>
              <DeleteOutlinedIcon
                style={{ cursor: 'pointer' }} onClick={(e) => {
                  props.deleteOption()
                }}
              />
            </StyledIcons>
                           </div>}

        </StyledDivContainer>
      </div>

      {
                props.active && props.question.config.conditions &&
                  <div style={{
                    display: 'flex',
                    width: '35%',
                    marginLeft: '10px',
                    alignItems: 'right'
                  }}
                  >
                    <Dropdown
                      style={{ float: 'right' }}
                      className='btn-search-table-heading'
                      isOpen={dropdownCondicionOpen}
                      toggle={() => {
                        setDropdownCondicionOpen(!dropdownCondicionOpen)
                      }}
                    >
                      <DropdownToggle color='primary dropdown-toggle-split'>
                        {condicionSelected.label}
                        <span className='caret-down' />
                      </DropdownToggle>
                      <DropdownMenu>
                        <DropdownItem
                          onClick={(e) => {
                            handleChangeCondicion({ label: 'Sin condición', value: '' }, true)
                          }}
                        >
                          {t('formularios>formulario_respuestas>sin_condicion', 'Sin condición')}
                        </DropdownItem>
                        {condiciones.map((condicion, i) => {
                          return (
                            <>
                              <DropdownItem
                                onClick={(e) => {
                                  handleChangeCondicion(condicion)
                                }}
                              >
                                {condicion.label}
                              </DropdownItem>

                            </>
                          )
                        })}
                      </DropdownMenu>
                    </Dropdown>
                  </div>

                }
    </div>
  )
}

const StyledDivContainer = styled.div`
  border-bottom: 1px solid gray;
  padding-bottom: 5px;
  justify-content: space-around;
  ${props => props.first
? `
  border-top: 1px solid gray;
  `
: ''}
  display: flex;
  align-items: center;
  width: 100%;
`

const StyledIcons = styled.div`
  margin-top: 10px;
`

export default Option
