import React from 'react'
import styled from 'styled-components'
import { FontDownload, CalendarToday, LooksOne, LooksTwo } from '@material-ui/icons'
import { UsuarioRegistro } from '../../../../types/usuario'
import DatePicker, { registerLocale } from 'react-datepicker'

import 'react-datepicker/dist/react-datepicker.css'
import es from 'date-fns/locale/es'
import { Controller } from 'react-hook-form'
import moment from 'moment'

registerLocale('es', es)

type IFormInput = {
    showForm: boolean,
    errors: any,
    register: any,
    control: any,
    setValue: any,
    watch: any,
    key: number,
    usuario: UsuarioRegistro,
    errorsValidation: any,
    keysErrors: Array<string>
}

const Step2: React.FC<IFormInput> = (props) => {
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
      {
                renderGlobalErrorValidation('Global') ? <ErrorValidation>{renderGlobalErrorValidation('Global')}</ErrorValidation> : null
            }
      <Form autoComplete='on'>
        <FormGroup>
          <Label>Nombre</Label>
          <ContentInput>
            <Input
              name='nombre'
              control={props.control}
              ref={props.register({ required: true })}
              defaultValue={props.usuario.nombre || ''}
            />
            <ContentIcon>
              <IconName />
            </ContentIcon>
            {props.errors.nombre && <ErrorFeedback>Campo requerido</ErrorFeedback>}
            {renderInputErrorValidation('Nombre')}
          </ContentInput>
        </FormGroup>
        <FormGroup>
          <Label>Primer apellido</Label>
          <ContentInput>
            <Input
              name='primerApellido'
              control={props.control}
              ref={props.register({ required: true })}
              defaultValue={props.usuario.primerApellido || ''}
            />
            <ContentIcon>
              <IconApellido />
            </ContentIcon>
            {props.errors.primerApellido && <ErrorFeedback>Campo requerido</ErrorFeedback>}
            {renderInputErrorValidation('PrimerApellido')}
          </ContentInput>
        </FormGroup>
        <FormGroup>
          <Label>Segundo apellido</Label>
          <ContentInput>
            <Input
              name='segundoApellido'
              control={props.control}
              ref={props.register({ required: true })}
              defaultValue={props.usuario.segundoApellido || ''}
            />
            <ContentIcon>
              <IconApellido2 />
            </ContentIcon>
            {props.errors.segundoApellido && <ErrorFeedback>Campo requerido</ErrorFeedback>}
            {renderInputErrorValidation('SegundoApellido')}
          </ContentInput>
        </FormGroup>
        <FormGroup>
          <Label>Fecha de nacimiento</Label>
          <ContentInput>
            <Controller
              control={props.control}
              name='fechaNacimiento'
              rules={{ required: true }}
              onChange={([selected]) => props.setValue('fechaNacimiento', selected)}
              placeholderText=''
              defaultValue={props.usuario.fechaNacimiento ? moment(props.usuario.fechaNacimiento).toDate() : null}
              render={({ onChange, onBlur, value }) => (
                <DatePicker
                  dateFormat='dd/MM/yyyy'
                  peekNextMonth
                  showMonthDropdown
                  showYearDropdown
                  minDate={new Date(1940, 0, 1)}
                  maxDate={new Date(2002, 0, 1)}
                  dropdownMode='select'
                  placeholderText='Seleccione fecha de nacimiento'
                  locale='es'
                  onChange={onChange}
                  onBlur={onBlur}
                  selected={value}
                />
              )}
            />
            <ContentIcon>
              <IconCalendario />
            </ContentIcon>
            {props.errors.fechaNacimiento && <ErrorFeedback>Campo requerido</ErrorFeedback>}
            {renderInputErrorValidation('fechaNacimiento')}
          </ContentInput>
        </FormGroup>
      </Form>
    </Wrapper>
  )
}

const Wrapper = styled.div`
    display: ${(props: IFormInput) => props.showForm ? 'block' : 'none'};
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
    &:last-child{
        margin-bottom: 0px;
    }
`

const Label = styled.label`
    color: #000;
`

const ContentInput = styled.div`position: relative;`

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
    border: 1px #D7D7D7 solid;
    min-height: 30px;
    position: relative;
    font-size: 12px;
    outline: 0;
`

const IconName = styled(FontDownload)`
    color: #888888;
    font-size: 17px;
`

const IconApellido = styled(LooksOne)`
    color: #888888;
    font-size: 17px;
`

const IconApellido2 = styled(LooksTwo)`
    color: #888888;
    font-size: 17px;
`

const IconCalendario = styled(CalendarToday)`
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

export default Step2
