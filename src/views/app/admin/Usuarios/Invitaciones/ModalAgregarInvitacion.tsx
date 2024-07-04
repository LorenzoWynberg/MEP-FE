import React from 'react'
import { ModalBody, Modal, ModalHeader, Row, Col } from 'reactstrap'
import styled from 'styled-components'
import Select from 'react-select'
import { useForm, Controller } from 'react-hook-form'
import { useSelector } from 'react-redux'
import DatePicker, { registerLocale } from 'react-datepicker'

import 'react-datepicker/dist/react-datepicker.css'
import es from 'date-fns/locale/es'
import colors from '../../../../../assets/js/colors'

registerLocale('es', es)

type IProps = {
  visible: boolean
  closeModal: any
  handleSubmit: any
  title: string
  usuario: any
  requesting: boolean
  errorsValidation: any
  keysErrors: Array<string>
  globalError: string
}

type IState = {
  selects: Array<any>
}

const ModalAgregarInvitacion: React.FC<IProps> = (props) => {
  const {
    register,
    errors,
    control,
    getValues,
    setValue,
    watch,
    handleSubmit
  } = useForm({ mode: 'onChange' })
  const [type, setType] = React.useState<string>('')
  const [min, setMin] = React.useState<number>(0)
  const [identificaciones, actualizarIdentificaciones] = React.useState<
    Array<any>
  >([])
  const [nacionalidades, actualizarNacionalidades] = React.useState<Array<any>>(
    []
  )
  const selects = useSelector((state: IState) => state.selects)

  const CR: string = 'COSTARRICENSE'

  React.useEffect(() => {
    ordernarNombres()
  }, [])

  // watch typeId change
  React.useEffect(() => {
    if (watch('type_identification')) {
      switch (watch('type_identification').id) {
        case 1: // Nacional
          const filter1 = selects.nationalities.filter(
            (pais: any) => pais.nombre == CR
          )
          actualizarNacionalidades(filter1)
          setValue('identification', '')
          setValue('nationality', '')
          setMin(9)
          setType('number')
          break
        case 2: // pasaporte
          const filter2 = selects.nationalities.filter(
            (pais: any) => pais.nombre !== CR
          )
          actualizarNacionalidades(filter2)
          setValue('identification', '')
          setValue('nationality', '')
          setMin(22)
          setType('text')
          break
        case 3: // Dimex
          const filter3 = selects.nationalities.filter(
            (pais: any) => pais.nombre !== CR
          )
          actualizarNacionalidades(filter3)
          setValue('identification', '')
          setValue('nationality', '')
          setMin(12)
          setType('number')
          break
        default:
          break
      }
    }
  }, [watch('type_identification')])

  const ordernarNombres = () => {
    actualizarIdentificaciones(selects.idTypes)
    actualizarNacionalidades(selects.nationalities)
  }

  const onSubmit = (data) => {
    props.handleSubmit(data)
  }

  return (
    <CustomModal
      isOpen={props.visible}
      centered
      size='lg'
      backdrop
    >
      <Header>{props.title}</Header>
      <StyledModalBody>
        {props.globalError !== ''
          ? (
            <ErrorValidation>{props.globalError}</ErrorValidation>
            )
          : null}
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Row>
            <Col md={6}>
              <FormGroup>
                <Label>Tipo de identificación</Label>
                <ContentInput>
                  <Controller
                    as={
                      <StyleSelect
                        className='react-select'
                        classNamePrefix='react-select'
                        placeholder=''
                        options={identificaciones}
                        getOptionLabel={(option: any) => option.nombre}
                        getOptionValue={(option: any) => option.id}
                        value={identificaciones.find(
                          (item: any) =>
                            item.nombre === getValues('type_identification')
                        )}
                      />
                    }
                    name='type_identification'
                    control={control}
                    rules={{ required: true }}
                  />
                  {errors.type_identification && (
                    <ErrorFeedback>Campo requerido</ErrorFeedback>
                  )}
                </ContentInput>
              </FormGroup>
              <FormGroup>
                <Label>Nacionalidad</Label>
                <ContentInput>
                  <Controller
                    as={
                      <StyleSelect
                        className='react-select'
                        classNamePrefix='react-select'
                        placeholder=''
                        options={nacionalidades}
                        getOptionLabel={(option: any) => option.nombre}
                        getOptionValue={(option: any) => option.id}
                      />
                    }
                    name='nationality'
                    control={control}
                    rules={{ required: true }}
                  />
                  {errors.nationality && (
                    <ErrorFeedback>Campo requerido</ErrorFeedback>
                  )}
                </ContentInput>
              </FormGroup>
              <FormGroup>
                <Label>Número de identificación</Label>
                <ContentInput>
                  <Input
                    type={type}
                    name='identification'
                    pattern={
                      type == 'text' ? '[a-zA-Z0-9 ]+' : '^-?[0-9]d*.?d*$'
                    }
                    autoComplete='off'
                    control={control}
                    ref={register({
                      required: true,
                      maxLength: min
                    })}
                  />
                  {errors.identification &&
                    errors.identification.type === 'required' && (
                      <ErrorFeedback>Campo requerido</ErrorFeedback>
                  )}
                  {errors.identification &&
                    errors.identification.type === 'maxLength' && (
                      <ErrorFeedback>{`Como máximo ${min} caracteres`}</ErrorFeedback>
                  )}
                </ContentInput>
              </FormGroup>
              <FormGroup>
                <Label>Fecha de nacimiento</Label>
                <ContentInput>
                  <Controller
                    control={control}
                    name='fechaNacimiento'
                    rules={{ required: true }}
                    onChange={([selected]) =>
                      setValue('fechaNacimiento', selected)}
                    placeholderText=''
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
                  {errors.fechaNacimiento && (
                    <ErrorFeedback>Campo requerido</ErrorFeedback>
                  )}
                </ContentInput>
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup>
                <Label>Correo electrónico</Label>
                <ContentInput>
                  <Input
                    name='email'
                    control={control}
                    ref={register({
                      required: true,
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                        message: 'Dirección invalida'
                      }
                    })}
                    autoComplete='off'
                  />
                  {errors.email && errors.email.type === 'required' && (
                    <ErrorFeedback>Campo requerido</ErrorFeedback>
                  )}
                  {errors.email && errors.email.type === 'pattern' && (
                    <ErrorFeedback>Dirección invalida</ErrorFeedback>
                  )}
                </ContentInput>
              </FormGroup>
              <FormGroup>
                <Label>Nombre</Label>
                <ContentInput>
                  <Input
                    name='nombre'
                    control={control}
                    ref={register({ required: true })}
                    autoComplete='off'
                  />
                  {errors.nombre && (
                    <ErrorFeedback>Campo requerido</ErrorFeedback>
                  )}
                </ContentInput>
              </FormGroup>
              <FormGroup>
                <Label>Primer Apellido</Label>
                <ContentInput>
                  <Input
                    name='primerApellido'
                    control={control}
                    ref={register({ required: true })}
                    autoComplete='off'
                  />
                  {errors.primerApellido && (
                    <ErrorFeedback>Campo requerido</ErrorFeedback>
                  )}
                </ContentInput>
              </FormGroup>
              <FormGroup>
                <Label>Segundo Apellido</Label>
                <ContentInput>
                  <Input
                    name='segundoApellido'
                    control={control}
                    ref={register({ required: true })}
                    autoComplete='off'
                  />
                  {errors.segundoApellido && (
                    <ErrorFeedback>Campo requerido</ErrorFeedback>
                  )}
                </ContentInput>
              </FormGroup>
            </Col>
          </Row>
          <Actions>
            <CancelButton onClick={props.closeModal}>Cancelar</CancelButton>
            <ConfirmButton type='submit'>Enviar</ConfirmButton>
          </Actions>
        </Form>
        {props.requesting
          ? (
            <Loading>
              <span className='single-loading' />
            </Loading>
            )
          : null}
      </StyledModalBody>
    </CustomModal>
  )
}

const CustomModal = styled(Modal)`
  box-shadow: none;
`

const StyledModalBody = styled(ModalBody)`
  padding: 20px 30px !important;
  position: relative;
`

const ErrorValidation = styled.div`
  background: #f77d7d;
  text-align: center;
  color: #fff;
  padding: 5px;
  position: absolute;
  width: 93%;
  bottom: 73px;
`

const Loading = styled.div`
  width: 100%;
  min-height: 381px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #ffffffb8;
  position: absolute;
  z-index: 1;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
`

const Form = styled.form`
  background: #fff;
`

const Header = styled(ModalHeader)`
  padding: 15px 30px !important;
  border-bottom-width: 1px;
  border-bottom-color: #ddd;
`

const FormGroup = styled.div`
  display: block;
  margin-bottom: 15px;
`

const Actions = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-around;
  width: 30%;
  justify-content: space-around;
  margin: 40px auto 0px;
`

const CancelButton = styled.button`
  border: 1px ${colors.secondary} solid;
  background: transparent;
  border-radius: 20px;
  color: ${colors.secondary};
  padding: 10px 20px;
  margin-right: 10px;
  cursor: pointer;
`

const ConfirmButton = styled.button`
  background: ${colors.primary};
  border-radius: 20px;
  color: #fff;
  border: 0;
  padding: 10px 20px;
  cursor: pointer;
`

const ContentInput = styled.div`
  position: relative;
`

const Input = styled.input`
  width: 100%;
  padding: 0px 10px;
  border: 1px #d7d7d7 solid;
  min-height: 42px;
  position: relative;
  font-size: 12px;
  outline: 0;
`

const Label = styled.label`
  color: #000;
`

const StyleSelect = styled(Select)`
  .react-select__control {
    padding: 0 5px;
  }
`

const ErrorFeedback = styled.span`
  position: absolute;
  color: #bd0505;
  right: 0;
  font-weight: bold;
  font-size: 10px;
  bottom: -19px;
`

export default ModalAgregarInvitacion
