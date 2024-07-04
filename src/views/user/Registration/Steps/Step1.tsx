import React from 'react'
import styled from 'styled-components'
import Select from 'react-select'
import CustomSelectInput from './CustomInput.tsx'
import { AccountBox, Subtitles, Flag, Accessibility } from '@material-ui/icons'
import { Controller } from 'react-hook-form'

import { useDispatch } from 'react-redux'
import { getIdentification } from '../../../../redux/registro/actions'

type IFormInput = {
  showForm: boolean
  errors: any
  register: any
  control: any
  setValue: any
  watch: any
  ids: Array<any>
  nationalities: Array<any>
  sexos: Array<any>
  errorsValidation: any
  keysErrors: Array<string>
}

const Step1: React.FC<IFormInput> = (props) => {
  const [type, setType] = React.useState<string>('')
  const [min, setMin] = React.useState<number>(0)
  const [identificaciones, actualizarIdentificaciones] = React.useState<
    Array<any>
  >([])
  const [nacionalidades, actualizarNacionalidades] = React.useState<Array<any>>(
    []
  )
  const [sexos, actualizarSexos] = React.useState<Array<any>>([])
  const [required, toggleRequired] = React.useState(true)
  const dispatch = useDispatch()

  const CR: string = 'COSTARRICENSE'

  // transformar nombres del array
  React.useEffect(() => {
    ordernarNombres()
  }, [])

  // watch typeId change
  React.useEffect(() => {
    if (props.watch('type_identification')) {
      switch (props.watch('type_identification').id) {
        case 1: // Nacional
          const filter1 = props.nationalities.filter(
            (pais: any) => pais.nombre == CR
          )
          actualizarNacionalidades(filter1)
          props.setValue('identification', '')
          props.setValue('nationality', '')
          setMin(9)
          setType('number')
          break
        case 2: // pasaporte
          const filter2 = props.nationalities.filter(
            (pais: any) => pais.nombre !== CR
          )
          actualizarNacionalidades(filter2)
          props.setValue('identification', '')
          props.setValue('nationality', '')
          setMin(22)
          setType('text')
          break
        case 3: // Dimex
          const filter3 = props.nationalities.filter(
            (pais: any) => pais.nombre !== CR
          )
          actualizarNacionalidades(filter3)
          props.setValue('identification', '')
          props.setValue('nationality', '')
          setMin(12)
          setType('number')
          break
        default:
          break
      }
    }
  }, [props.watch('type_identification')])

  React.useEffect(() => {
    if (props.watch('identification')) {
      const digitos = props.watch('identification')
      if (digitos.length === 9) {
        obtenerInformacion(digitos)
      }
    }
  }, [props.watch('identification')])

  const obtenerInformacion = async (identificacion: string) => {
    await dispatch(getIdentification(identificacion))
  }

  const ordernarNombres = () => {
    actualizarIdentificaciones(props.ids)
    actualizarNacionalidades(props.nationalities)
    actualizarSexos(props.sexos)
  }

  const renderInputErrorValidation = (input: string) => {
    if (props.keysErrors.includes(input)) {
      if (props.errorsValidation[input] !== undefined) {
        return <ErrorFeedback>{props.errorsValidation[input][0]}</ErrorFeedback>
      }
    }
  }

  const renderGlobalErrorValidation = (keyError: string) => {
    if (props.keysErrors.includes(keyError)) {
      if (props.errorsValidation[keyError] !== undefined) {
        return <span>{props.errorsValidation[keyError][0]}</span>
      }
    }
  }

  return (
    <Wrapper showForm={props.showForm}>
      {renderGlobalErrorValidation('Global')
        ? (
          <ErrorValidation>
            {renderGlobalErrorValidation('Global')}
          </ErrorValidation>
          )
        : null}
      <Form autoComplete='on'>
        <FormGroup>
          <Label>Tipo de identificación</Label>
          <ContentInput>
            <Controller
              as={
                <StyleSelect
                  components={{ Input: CustomSelectInput }}
                  className='react-select'
                  classNamePrefix='react-select'
                  placeholder=''
                  options={identificaciones}
                  getOptionLabel={(option: any) => option.nombre}
                  getOptionValue={(option: any) => option.id}
                />
              }
              name='type_identification'
              control={props.control}
              rules={{ required }}
            />
            <ContentIcon>
              <IconType />
            </ContentIcon>
            {props.errors.type_identification && (
              <ErrorFeedback>Campo requerido</ErrorFeedback>
            )}
            {renderInputErrorValidation('TipoIdentificacionId')}
          </ContentInput>
        </FormGroup>
        <FormGroup>
          <Label>Número de identificación</Label>
          <ContentInput>
            <Input
              type={type}
              name='identification'
              pattern='^-?[0-9]\d*\.?\d*$'
              autoComplete='off'
              control={props.control}
              ref={props.register({
                required: true,
                maxLength: min
              })}
            />

            <ContentIcon>
              <IconIdenti />
            </ContentIcon>
            {props.errors.identification &&
              props.errors.identification.type === 'required' && (
                <ErrorFeedback>Campo requerido</ErrorFeedback>
            )}
            {props.errors.identification &&
              props.errors.identification.type === 'maxLength' && (
                <ErrorFeedback>{`Como máximo ${min} caracteres`}</ErrorFeedback>
            )}
            {renderInputErrorValidation('Identificacion')}
          </ContentInput>
        </FormGroup>
        <FormGroup>
          <Label>Nacionalidad</Label>
          <ContentInput>
            <Controller
              as={
                <StyleSelect
                  components={{ Input: CustomSelectInput }}
                  className='react-select'
                  classNamePrefix='react-select'
                  placeholder=''
                  options={nacionalidades}
                  getOptionLabel={(option: any) => option.nombre}
                  getOptionValue={(option: any) => option.id}
                />
              }
              name='nationality'
              control={props.control}
              rules={{ required }}
            />
            <ContentIcon>
              <IconNation />
            </ContentIcon>
            {props.errors.nationality && (
              <ErrorFeedback>Campo requerido</ErrorFeedback>
            )}
            {renderInputErrorValidation('NacionalidadId')}
          </ContentInput>
        </FormGroup>
        <FormGroup>
          <Label>Sexo</Label>
          <ContentInput>
            <Controller
              as={
                <StyleSelect
                  components={{ Input: CustomSelectInput }}
                  className='react-select'
                  classNamePrefix='react-select'
                  placeholder=''
                  options={sexos}
                  getOptionLabel={(option: any) => option.nombre}
                  getOptionValue={(option: any) => option.id}
                />
              }
              name='people_sex'
              control={props.control}
              rules={{ required }}
            />
            <ContentIcon>
              <IconSex />
            </ContentIcon>
            {props.errors.people_sex && (
              <ErrorFeedback>Campo requerido</ErrorFeedback>
            )}
            {renderInputErrorValidation('SexoId')}
          </ContentInput>
        </FormGroup>
      </Form>
    </Wrapper>
  )
}

const Wrapper = styled.div`
  display: ${(props: IFormInput) => (props.showForm ? 'block' : 'none')};
`

const ErrorValidation = styled.div`
  background: #f77d7d;
  text-align: center;
  color: #fff;
  padding: 5px;
  position: absolute;
  width: 77%;
  bottom: 25px;
`

const Form = styled.form`
  margin-top: 5px;
  display: block;
  width: 100%;
`

const FormGroup = styled.div`
  margin-bottom: 10px;
  &:last-child {
    margin-bottom: 0px;
  }
`

const Label = styled.label`
  color: #000;
`

const ContentInput = styled.div`
  position: relative;
`

const ContentIcon = styled.div`
  display: flex;
  align-items: center;
  height: 100%;
  position: absolute;
  top: 0;
  left: 5px;
`

const Input = styled.input`
  width: 100%;
  padding: 0px 30px;
  border: 1px #d7d7d7 solid;
  min-height: 30px;
  position: relative;
  font-size: 12px;
  outline: 0;
`

const IconType = styled(AccountBox)`
  color: #888888;
  font-size: 17px;
`

const IconIdenti = styled(Subtitles)`
  color: #888888;
  font-size: 17px;
`

const IconNation = styled(Flag)`
  color: #888888;
  font-size: 17px;
`

const IconSex = styled(Accessibility)`
  color: #888888;
  font-size: 17px;
`

const ErrorFeedback = styled.span`
  position: absolute;
  color: #bd0505;
  right: 0;
  font-weight: bold;
  font-size: 10px;
  bottom: -19px;
`

const StyleSelect = styled(Select)`
  .react-select__control {
    padding: 0 15px;
  }
`

const InputIdentification = styled.input`
  width: 100%;
  padding: 0px 30px;
  border: 1px #d7d7d7 solid;
  min-height: 30px;
  position: relative;
  font-size: 12px;
  outline: 0;
`

export default Step1
