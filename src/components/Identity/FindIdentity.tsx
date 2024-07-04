import CustomSelectInput from 'Components/common/CustomSelectInput'
import React from 'react'
import Select from 'react-select'
import { Input, Form, FormGroup, Label, Button } from 'reactstrap'
import styled from 'styled-components'
import ReactInputMask from 'react-input-mask'

interface IProps {
	onChangeId: Function
	lstIdType: any[]
	idValue: string
	idType: any
	setIdType: Function
	toggleModal: Function
	notFound: any
	isDead: Boolean
	readOnly: Boolean
}

const FindIdentity: React.FC<IProps> = (props) => {
  const {
    idValue,
    idType,
    onChangeId,
    lstIdType,
    notFound,
    setIdType,
    toggleModal,
    isDead,
    readOnly
  } = props

  const maskRegex = {
    1: '999999999',
    3: '999999999999',
    4: 'YR9999-99999',
    6508:'99999999999999999999' //documento de identidad generico para demo

    
  }

  return (
    <FormStyled>
      <FormGroup>
        <Label>Tipo de identificación</Label>
        <Select
          className='react-select'
          classNamePrefix='react-select'
          name='tipoIdentificacionId'
          value={idType}
          options={lstIdType}
          onChange={(value) =>
					  setIdType({
					    name: 'tipoIdentificacionId',
					    value
					  })}
          getOptionLabel={(option: any) => option.nombre}
          getOptionValue={(option: any) => option.id}
          components={{ Input: CustomSelectInput }}
        />
      </FormGroup>
      <FormGroup>
        <Label>Número de identificación</Label>
        <ReactInputMask
          mask={maskRegex[idType?.id]}
          type='text'
          name='identificacion'
          maskChar={null}
          value={idValue}
          onChange={(e) => onChangeId(e.target.value)}
        >
          {(inputProps) => <Input {...inputProps} />}
        </ReactInputMask>
      </FormGroup>

      {notFound && (
        <ServantNotFound>
          <Label>
            No se ha encontrado un funcionario con el número de
            identificación ingresado.
          </Label>
          <Label>
            Puede registrarlo en SABER haciendo click en registrar.
          </Label>
          <div style={{ textAlign: 'center' }}>
            <Button
              color='primary'
              onClick={() => toggleModal(true)}
            >
              Registrar
            </Button>
          </div>
        </ServantNotFound>
      )}
      {isDead && (
        <ServantNotFound>
          <Label>
            No se ha encontrado un funcionario con el número de
            identificación ingresado.
          </Label>
          <Label>
            Puede registrarlo en SABER haciendo click en registrar.
          </Label>
          <div style={{ textAlign: 'center' }}>
            <Button
              color='primary'
              onClick={() => toggleModal(true)}
            >
              Registrar
            </Button>
          </div>
        </ServantNotFound>
      )}
    </FormStyled>
  )
}

const FormStyled = styled(Form)`
	position: relative;
	float: left;
	width: 450px;
`
const ServantNotFound = styled.div`
	display: flex;
	flex-flow: wrap;
	flex-direction: row;
	justify-content: flex-start;
	align-items: center;
	label {
		margin-bottom: 5px;
	}
`

FindIdentity.defaultProps = {
  notFound: false
}

export default FindIdentity
