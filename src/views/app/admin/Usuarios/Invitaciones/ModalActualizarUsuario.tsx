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
import moment from 'moment'

registerLocale('es', es)

type IProps = {
    visible: boolean,
    closeModal: any,
    handleSubmit: any,
    title: string,
    usuario: any,
    requesting: boolean,
    globalError: string
}

type IState = {
    selects: Array<any>,
}

const ModalActualizarUsuario: React.FC<IProps> = (props) => {
  const {
    register,
    errors,
    control,
    getValues,
    setValue,
    handleSubmit
  } = useForm({ mode: 'onChange' })
  const selects = useSelector((state: IState) => state.selects)

  const onSubmit = data => {
    props.handleSubmit(data)
  }

  return (
    <CustomModal
      isOpen={props.visible}
      centered
      size='lg'
      backdrop
    >
      <Header>
        {props.title}
      </Header>
      <StyledModalBody>
        {
                    props.globalError !== '' ? <ErrorValidation>{props.globalError}</ErrorValidation> : null
                }
        <Form>
          <Row>
            <Col md={6}>
              <FormGroup>
                <Label>Tipo de identificación</Label>
                <ContentInput>
                  <Controller
                    defaultValue={selects.idTypes.find((item: any) => item.nombre === props.usuario.tipoIdentificacion)}
                    as={<StyleSelect
                        className='react-select'
                        classNamePrefix='react-select'
                        placeholder=''
                        options={selects.idTypes}
                        getOptionLabel={(option: any) => option.nombre}
                        getOptionValue={(option: any) => option.id}
                        value={selects.idTypes.find((item: any) => item.nombre === getValues('type_identification'))}
                          />}
                    name='type_identification'
                    control={control}
                    rules={{ required: true }}
                  />
                  {errors.type_identification && <ErrorFeedback>Campo requerido</ErrorFeedback>}
                </ContentInput>
              </FormGroup>
              <FormGroup>
                <Label>Nacionalidad</Label>
                <ContentInput>
                  <Controller
                    defaultValue={selects.nationalities.find((item: any) => item.nombre === props.usuario.nacionalidad)}
                    as={<StyleSelect
                        className='react-select'
                        classNamePrefix='react-select'
                        placeholder=''
                        options={selects.nationalities}
                        getOptionLabel={(option: any) => option.nombre}
                        getOptionValue={(option: any) => option.id}
                          />}
                    name='nationality'
                    control={control}
                    rules={{ required: true }}
                  />
                  {errors.nationality && <ErrorFeedback>Campo requerido</ErrorFeedback>}
                </ContentInput>
              </FormGroup>
              <FormGroup>
                <Label>Número de identificación</Label>
                <ContentInput>
                  <Input
                    type='text'
                    name='identification'
                    pattern='^-?[0-9]\d*\.?\d*$'
                    autoComplete='off'
                    control={control}
                    ref={register({
                        required: true,
                        maxLength: 10
                      })}
                    defaultValue={props.usuario.identificacion}
                  />
                  {errors.identification && errors.identification.type === 'required' && (
                    <ErrorFeedback>Campo requerido</ErrorFeedback>
                  )}
                  {errors.identification && errors.identification.type === 'maxLength' && (
                    <ErrorFeedback>{`Como máximo ${10} caracteres`}</ErrorFeedback>
                  )}
                </ContentInput>
              </FormGroup>
              <FormGroup>
                <Label>Sexo</Label>
                <ContentInput>
                  <Controller
                    defaultValue={props.usuario.datosAdicionalesJson.length > 2 ? selects.sexoTypes.find((item: any) => item.nombre === props.usuario.datosAdicionalesJson[2].nombreElemento) : null}
                    as={<StyleSelect
                        className='react-select'
                        classNamePrefix='react-select'
                        placeholder=''
                        options={selects.sexoTypes}
                        getOptionLabel={(option: any) => option.nombre}
                        getOptionValue={(option: any) => option.id}
                          />}
                    name='sexo'
                    control={control}
                    rules={{ required: true }}
                  />
                  {errors.sexo && <ErrorFeedback>Campo requerido</ErrorFeedback>}
                </ContentInput>
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup>
                <Label>Nombre</Label>
                <ContentInput>
                  <Input
                    name='nombre'
                    control={control}
                    ref={register({ required: true })}
                    defaultValue={props.usuario.nombre || ''}
                  />
                  {errors.nombre && <ErrorFeedback>Campo requerido</ErrorFeedback>}
                </ContentInput>
              </FormGroup>
              <FormGroup>
                <Label>Primer Apellido</Label>
                <ContentInput>
                  <Input
                    name='primerApellido'
                    control={control}
                    ref={register({ required: true })}
                    defaultValue={props.usuario.apellido || ''}
                  />
                  {errors.primerApellido && <ErrorFeedback>Campo requerido</ErrorFeedback>}
                </ContentInput>
              </FormGroup>
              <FormGroup>
                <Label>Segundo Apellido</Label>
                <ContentInput>
                  <Input
                    name='segundoApellido'
                    control={control}
                    ref={register({ required: true })}
                    defaultValue={props.usuario.segundoApellido || ''}
                  />
                  {errors.segundoApellido && <ErrorFeedback>Campo requerido</ErrorFeedback>}
                </ContentInput>
              </FormGroup>
              <FormGroup>
                <Label>Fecha de nacimiento</Label>
                <ContentInput>
                  <Controller
                    control={control}
                    name='fechaNacimiento'
                    rules={{ required: true }}
                    onChange={([selected]) => setValue('fechaNacimiento', selected)}
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
                  {errors.fechaNacimiento && <ErrorFeedback>Campo requerido</ErrorFeedback>}
                </ContentInput>
              </FormGroup>
            </Col>
          </Row>
        </Form>
        <Actions>
          <CancelButton onClick={props.closeModal}>Atrás</CancelButton>
          <ConfirmButton onClick={handleSubmit(onSubmit)}>Actualizar</ConfirmButton>
        </Actions>
        {props.requesting ? <Loading><span className='single-loading' /></Loading> : null}
      </StyledModalBody>
    </CustomModal>
  )
}

const CustomModal = styled(Modal)`
    box-shadow: none;
`

const StyledModalBody = styled(ModalBody)`
    padding: 20px 30px !important;
`

const ErrorValidation = styled.div`
    background: #f77d7d;
    text-align: center;
    color: #fff;
    padding: 5px;
    position: absolute;
    width: 93%;
    bottom: 75px;
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

const ContentInput = styled.div`position: relative;`

const Input = styled.input`
    width: 100%;
    padding: 0px 10px;
    border: 1px #D7D7D7 solid;
    min-height: 42px;
    position: relative;
    font-size: 12px;
    outline: 0;
`

const Label = styled.label`
    color: #000;
`

const StyleSelect = styled(Select)`
    .react-select__control{
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

export default ModalActualizarUsuario
