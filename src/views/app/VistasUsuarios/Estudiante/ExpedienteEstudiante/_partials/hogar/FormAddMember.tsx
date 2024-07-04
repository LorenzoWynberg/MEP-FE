import CustomSelectInput from 'Components/common/CustomSelectInput'
import React from 'react'
import Select from 'react-select'
import { Input, Form, FormGroup, Label } from 'reactstrap'
import styled from 'styled-components'
import colors from 'Assets/js/colors'
import ReactInputMask from 'react-input-mask'

interface IProps {
  onChangeId: Function
  lstIdType: any[]
  idValueRegister: string
  idTypeRegister: any
  setIdTypeRegister: Function
  servantFounded: any
  notFound: any
}

const FormAddMember: React.FC<IProps> = (props) => {
  const {
    idValueRegister,
    idTypeRegister,
    onChangeId,
    lstIdType,
    servantFounded,
    notFound,
    setIdTypeRegister
  } = props

  return (
    <FormStyled>
      <h5>Buscar funcionario</h5>
      <FormGroup>
        <Label>Tipo de identificación</Label>
        <Select
          className='react-select'
          classNamePrefix='react-select'
          placeHolder=''
          value={idTypeRegister}
          options={lstIdType}
          onChange={setIdTypeRegister}
          getOptionLabel={(option: any) => option.nombre}
          getOptionValue={(option: any) => option.id}
          components={{ Input: CustomSelectInput }}
        />
      </FormGroup>
      <FormGroup>
        <Label>Número de identificación</Label>
        <ReactInputMask
          mask={
            idTypeRegister.id === 1
            ? '999999999' // 9
            : idTypeRegister.id === 3
              ? '999999999999' // 12
              :idTypeRegister.id === 4? 'YR9999-99999':'99999999999999999999'
          }
          type='text'
          name='identificacion'
          maskChar={null}
          value={idValueRegister}
          onChange={(e) => onChangeId(e.target.value)}
        >
          {(inputProps) => <Input {...inputProps} />}
        </ReactInputMask>
      </FormGroup>
      {servantFounded && (
        <ServantFounded>
          <Label>Funcionario encontrado:</Label>
          <CardImg>
            <img
              src={
                servantFounded.imagen || '/assets/img/profile-pic-generic.png'
              }
              alt='Servant'
            />
            <h5>
              {servantFounded.nombre +
                ' ' +
                servantFounded.primerApellido +
                '' +
                servantFounded.segundoApellido +
                ''}
            </h5>
          </CardImg>
        </ServantFounded>
      )}
      {notFound && (
        <ServantNotFound>
          <Label>
            No se ha encontrado un funcionario con el número de identificación
            ingresado.
          </Label>
          <Label>Puede registrarlo en el sistema haciendo click en registrar.</Label>
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
const ServantFounded = styled.div``
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
const CardImg = styled.div`
  display: flex;
  width: 100%;
  justify-content: flex-start;
  align-items: center;
  border: 1px solid ${colors.primary};
  border-radius: 10px;
  gap: 10px;
  overflow: hidden;

  img {
    width: 100px;
    height: auto;
  }
  label {
    display: flex;
    flex: 1;
    margin: 0;
    align-items: center;
  }
`

FormAddMember.defaultProps = {
  notFound: false,
  servantFounded: null
}
export default FormAddMember
