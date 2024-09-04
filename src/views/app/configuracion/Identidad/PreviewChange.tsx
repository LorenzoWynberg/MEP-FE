import React from 'react'
import styled from 'styled-components'
import { Row, Col, Input } from 'reactstrap'
import Select from 'react-select'
import { useForm, Controller } from 'react-hook-form'
import { useSelector } from 'react-redux'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import moment from 'moment'
import colors from '../../../../assets/js/colors'
import AddIcon from '@material-ui/icons/AddAPhoto'

import { actualizarTSE } from '../../../../redux/identidad/actions'

import { UsuarioRegistro } from '../../../../types/usuario'
import { STUDENT_NATIONAL } from '../../../../utils/utils'
import { calculateAge } from '../../../../utils/years'

import swal from 'sweetalert'
import { uploadSingleFile } from '../../../../redux/identificacion/actions'
import axios from 'axios'
import { envVariables } from '../../../../constants/enviroment'

type FormProps = {
  title: string
  subtitle?: string
  user?: UsuarioRegistro
  requesting?: boolean
  disabled?: boolean
  toggleEdit?: Function
  handleUpdate?: Function
}

type IState = {
  selects: any
}

type FormValidations = {
  typeId?: boolean
  identification?: boolean
  nacionalidad?: boolean
  nombre?: boolean 
  primerApellido?: boolean
  segundoApellido?: boolean
  conocidoComo?: boolean
  sexoId?: boolean
  generoId?: boolean
  fechaNacimiento?: boolean
  edad?: boolean
}

const IdentidadForm: React.FC<FormProps> = (props) => {
  const [requesting, setRequesting] = React.useState<boolean>(false)
  const selects = useSelector((state: IState) => state.selects)
  const [image, setImage] = React.useState<boolean>({ url: props.user.imagen })
  const [uploading, setUploading] = React.useState<boolean>(false)
  const [validations, setValidation] = React.useState<FormValidations>({
    typeId: true,
    identification: true,
    nacionalidad: true,
    nombre: true,
    primerApellido: true,
    segundoApellido: true,
    conocidoComo: true,
    sexoId: true,
    generoId: true,
    fechaNacimiento: true,
    edad: true
  })

  const datos = props.user.datos

  const identificationId = props.user.type_identification
    ? props.user.type_identification
    : datos?.length > 0
      ? datos.find(
        (item: any) => item.nombreCatalogo === 'Tipo de Identificación'
      ).elementoId
      : ''
  const userIdentification = selects.idTypes.find(
    (item: any) => item.id === identificationId
  )

  const userCountry =
    datos?.length > 0
      ? datos.find((item: any) => item.nombreCatalogo === 'Nacionalidad')
      : ''
  const userNacionalidad = userCountry
    ? selects.nationalities.find(
      (item: any) => item.id === userCountry.elementoId
    )
    : ''

  const userSex =
    datos?.length > 0
      ? datos.find((item: any) => item.nombreCatalogo === 'Sexo')
      : ''
  const userSexo = userSex
    ? selects.sexoTypes.find((item: any) => item.id === userSex.elementoId)
    : ''

  const genderId =
    datos?.length > 0
      ? datos.find((item: any) => item.nombreCatalogo === 'Genero')
      : ''
  const userGender = genderId
    ? selects.genderTypes.find((item: any) => item.id === genderId.elementoId)
    : ''

  const nacionalidad = userCountry
    ? selects.nationalities.find(
      (item: any) => item.id === userCountry.elementoId
    )
    : null

  const userNacimiento =
    props.user.fechaNacimiento != null
      ? moment(props.user.fechaNacimiento).toDate()
      : null

  const { register, control, setValue, watch, errors, handleSubmit } = useForm({
    mode: 'onChange',
    defaultValues: {
      type_identification: userIdentification,
      nationality: userNacionalidad,
      sexo: userSexo,
      genero: userGender,
      identificacion: props.user.identificacion,
      nombre: props.user.nombre,
      primerApellido: props.user.primerApellido,
      segundoApellido: props.user.segundoApellido,
      conocidoComo: props.user.conocidoComo,
      fechaNacimiento: userNacimiento,
      edad: userNacimiento != null ? calculateAge(userNacimiento) : '',
      imagen: props.user.imagen
    }
  })

  React.useEffect(() => {
    if (watch('type_identification')) {
      switch (watch('type_identification').id) {
        case 1:
          setValidation({
            typeId: true,
            identification: true,
            nacionalidad: true,
            nombre: true,
            primerApellido: true,
            segundoApellido: true,
            conocidoComo: true,
            sexoId: false,
            generoId: false,
            fechaNacimiento: true,
            edad: true
          })
          break
        case 2:
          setValidation({
            typeId: true,
            identification: true,
            nacionalidad: false,
            nombre: false,
            primerApellido: false,
            segundoApellido: false,
            conocidoComo: false,
            sexoId: false,
            generoId: false,
            fechaNacimiento: false,
            edad: true
          })
          break
        case 3:
          setValidation({
            typeId: true,
            identification: true,
            nacionalidad: false,
            nombre: false,
            primerApellido: false,
            segundoApellido: false,
            conocidoComo: false,
            sexoId: false,
            generoId: false,
            fechaNacimiento: false,
            edad: true
          })
          break
        case 4:
          setValidation({
            typeId: true,
            identification: true,
            nacionalidad: false,
            nombre: false,
            primerApellido: false,
            segundoApellido: false,
            conocidoComo: false,
            sexoId: false,
            generoId: false,
            fechaNacimiento: false,
            edad: true
          })
          break
      }
    }
  }, [])

  const handleImage = (e) => {
    setImage({
      url: URL.createObjectURL(e.target.files[0]),
      raw: e.target.files[0]
    })
  }

  const toMayus = (e) => {
    e.target.value = e.target.value.toUpperCase()
    return e.target.value
  }

  const onSubmit = async (values) => {
    let _image = props.user.imagen

    setUploading(true)
    if (image.raw) {
      props.setRequesting(true)
      try {
        const res = await uploadSingleFile(image.raw, (event) => {})
        _image = res
        if (props.user.imagen) {
          await axios.delete(
            `${envVariables.BACKEND_URL}/api/ExpedienteCentroEducativo/Formulario/resources`,
            {
              data: {
                names: [props.user.imagen]
              }
            }
          )
        }
      } catch (e) {}
    }
    const data = {
      id: props.user.id,
      tipoIdentificacionId: values.type_identification.id,
      identificacion: values.identificacion,
      nacionalidadId: values.nationality.id,
      nombre: values.nombre,
      primerApellido: values.primerApellido,
      segundoApellido: values.segundoApellido,
      conocidoComo: values.conocidoComo,
      imagen: _image || '',
      fechaNacimiento: moment(values.fechaNacimiento).format('YYYY-MM-DD'),
      sexoId: values.sexo.id,
      generoId: values.genero.id
    }
    props.handleUpdate(data)
    setUploading(false)
  }

  const handleTSEUpdate = async (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    setRequesting(true)
    const res = await actualizarTSE(props.user.identificacion)

    if (!res.error) {
      setRequesting(false)
      const fechaNacimiento = moment(res.data.fechaNacimiento).toDate()
      setValue('nombre', res.data.nombre)
      setValue('primerApellido', res.data.primerApellido)
      setValue('segundoApellido', res.data.segundoApellido)
      setValue('conocidoComo', res.data.conocidoComo)
      setValue('fechaNacimiento', fechaNacimiento)
      setValue('edad', calculateAge(fechaNacimiento))
    } else {
      swal({
        title: 'Oops! Algo ha salido mal',
        text: 'Algo ha sucedido con la solicitud al TSE',
        icon: 'warning',
        buttons: {
          ok: {
            text: 'Ok',
            value: true
          }
        }
      })
    }
  }

  return (
    <Wrapper>
      <Card className='bg-white__radius'>
        <CardTitle>
          {props.title}{' '}
          {props.subtitle !== undefined ? `(${props.subtitle})` : null}
        </CardTitle>
        <Form>
          <Row>
            <Col
              md={5}
              className='d-flex align-items-center justify-content-center'
            >
              <FormGroup className='fied-upload'>
                <div className='fileinput-button'>
                  <IconAdd />
                  <input
                    accept='image/*'
                    id='profile-pic'
                    type='file'
                    name='profilePic'
                    onChange={(e) => {
                      handleImage(e)
                    }}
                  />
                </div>
                {image.url != ''
                  ? (
                    <Label
                      htmlFor='profile-pic'
                      className='circle_loading cursor-pointer'
                    >
                      <img src={image.url} alt='' />
                    </Label>
                    )
                  : null}
              </FormGroup>
            </Col>
            <Col md={7}>
              {nacionalidad && nacionalidad.nombre == STUDENT_NATIONAL
                ? (
                  <Row className='align-items-center'>
                    <Col md={6}>
                      <FormGroup>
                        <Label>Tipo de identificación</Label>
                        <Controller
                          as={
                            <Select
                              className='react-select'
                              classNamePrefix='react-select'
                              placeholder=''
                              options={selects.idTypes}
                              getOptionLabel={(option: any) => option.nombre}
                              getOptionValue={(option: any) => option.id}
                              isDisabled={validations.typeId}
                            />
                        }
                          name='type_identification'
                          control={control}
                          rules={{ required: false }}
                        />
                      </FormGroup>
                    </Col>
                    <Col md={6}>
                      <ActionTSE onClick={handleTSEUpdate}>
                        Actualizar TSE
                      </ActionTSE>
                    </Col>
                  </Row>
                  )
                : (
                  <FormGroup>
                    <Label>Tipo de identificación</Label>
                    <Controller
                      as={
                        <Select
                          className='react-select'
                          classNamePrefix='react-select'
                          placeholder=''
                          options={selects.idTypes}
                          getOptionLabel={(option: any) => option.nombre}
                          getOptionValue={(option: any) => option.id}
                          isDisabled={validations.typeId}
                        />
                    }
                      name='type_identification'
                      control={control}
                      rules={{ required: false }}
                    />
                  </FormGroup>
                  )}
              <FormGroup>
                <Label>Número de identificación</Label>
                <Input
                  name='identificacion'
                  innerRef={register({ required: false })}
                  readOnly={validations.identification}
                />
              </FormGroup>
              <FormGroup>
                <Label>Nacionalidad</Label>
                <Controller
                  as={
                    <Select
                      className='react-select'
                      classNamePrefix='react-select'
                      placeholder=''
                      options={selects.nationalities}
                      getOptionLabel={(option: any) => option.nombre}
                      getOptionValue={(option: any) => option.id}
                      isDisabled={validations.nacionalidad}
                    />
                  }
                  name='nationality'
                  control={control}
                  rules={{ required: false }}
                />
              </FormGroup>
            </Col>
          </Row>
          <FormGroup>
            <Label>Nombre</Label>
            <Input
              name='nombre'
              autoComplete='off'
              className='upper-case'
              onInput={toMayus}
              innerRef={register({
                required: false,
                maxLength: 50
              })}
              readOnly={validations.nombre}
            />
            {errors.nombre && errors.nombre.type === 'required' && (
              <ErrorFeedback>Campo requerido</ErrorFeedback>
            )}
            {errors.nombre && errors.nombre.type === 'maxLength' && (
              <ErrorFeedback>
                Debe tener una longitud máxima de 50 caracteres
              </ErrorFeedback>
            )}
          </FormGroup>
          <FormGroup>
            <Label>Primer apellido</Label>
            <Input
              name='primerApellido'
              autoComplete='off'
              onInput={toMayus}
              className='upper-case'
              innerRef={register({
                required: true,
                maxLength: 30
              })}
              readOnly={validations.primerApellido}
            />
            {errors.primerApellido &&
              errors.primerApellido.type === 'required' && (
                <ErrorFeedback>Campo requerido</ErrorFeedback>
            )}
            {errors.primerApellido &&
              errors.primerApellido.type === 'maxLength' && (
                <ErrorFeedback>
                  Debe tener una longitud máxima de 30 caracteres
                </ErrorFeedback>
            )}
          </FormGroup>
          <FormGroup>
            <Label>Segundo apellido</Label>
            <Input
              name='segundoApellido'
              autoComplete='off'
              className='upper-case'
              onInput={toMayus}
              innerRef={register({
                maxLength: 30
              })}
              readOnly={validations.segundoApellido}
            />
            {errors.segundoApellido &&
              errors.segundoApellido.type === 'maxLength' && (
                <ErrorFeedback>
                  Debe tener una longitud máxima de 30 caracteres
                </ErrorFeedback>
            )}
          </FormGroup>
          <FormGroup>
            <Label>Conocido como</Label>
            <Input
              name='conocidoComo'
              autoComplete='off'
              onInput={toMayus}
              className='upper-case'
              innerRef={register({
                maxLength: 150
              })}
              readOnly={validations.conocidoComo}
            />
            {errors.conocidoComo &&
              errors.conocidoComo.type === 'maxLength' && (
                <ErrorFeedback>
                  Debe tener una longitud máxima de 150 caracteres
                </ErrorFeedback>
            )}
          </FormGroup>
          <Row>
            <Col md={6}>
              <FormGroup>
                <Label>Fecha de nacimiento</Label>
                <Controller
                  control={control}
                  name='fechaNacimiento'
                  rules={{ required: false }}
                  onChange={([selected]) => {
                    setValue('fechaNacimiento', selected)
                  }}
                  placeholderText=''
                  render={({ onChange, onBlur, value }) => (
                    <DatePicker
                      dateFormat='dd/MM/yyyy'
                      peekNextMonth
                      showMonthDropdown
                      showYearDropdown
                      minDate={new Date(1940, 0, 1)}
                      maxDate={new Date()}
                      dropdownMode='select'
                      placeholderText='Seleccione fecha de nacimiento'
                      locale='es'
                      onChange={(date) => {
                        setValue('edad', calculateAge(date))

                        onChange(date)
                      }}
                      onBlur={onBlur}
                      selected={value}
                      disabled={validations.fechaNacimiento}
                    />
                  )}
                />
              </FormGroup>
              <FormGroup>
                <Label>Sexo</Label>
                <Controller
                  as={
                    <Select
                      className='react-select'
                      classNamePrefix='react-select'
                      placeholder=''
                      options={selects.sexoTypes}
                      getOptionLabel={(option: any) => option.nombre}
                      getOptionValue={(option: any) => option.id}
                      isDisabled={validations.sexoId}
                    />
                  }
                  name='sexo'
                  control={control}
                  rules={{ required: false }}
                />
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup>
                <Label>Edad</Label>
                <Input
                  name='edad'
                  autoComplete='off'
                  innerRef={register({ required: false })}
                  readOnly
                />
              </FormGroup>
              <FormGroup>
                <Label>Género</Label>
                <Controller
                  as={
                    <Select
                      className='react-select'
                      classNamePrefix='react-select'
                      placeholder=''
                      options={selects.genderTypes}
                      getOptionLabel={(option: any) => option.nombre}
                      getOptionValue={(option: any) => option.id}
                      isDisabled={validations.generoId}
                    />
                  }
                  name='genero'
                  control={control}
                  rules={{ required: false }}
                />
              </FormGroup>
            </Col>
          </Row>
        </Form>
        {props.requesting
          ? (
            <Loading>
              <span className='single-loading' />
            </Loading>
            )
          : null}
        {requesting
          ? (
            <Loading>
              <span className='single-loading' />
            </Loading>
            )
          : null}
      </Card>
      <Actions>
        <ActionFeedback>
          Nota: Los cambios afectarán al estudiante y todos sus registros,
          después de aplicar los cambios, no podrá deshacerlos, por favor tenga
          cuidado.
        </ActionFeedback>
        <ActionsButton>
          <ActionButton onClick={props.toggleEdit}>Cancelar</ActionButton>
          <ActionButton onClick={handleSubmit(onSubmit)}>Guardar</ActionButton>
        </ActionsButton>
      </Actions>
    </Wrapper>
  )
}

const Wrapper = styled.div`
  margin-top: 20px;
  margin-bottom: 20px;
`

const Card = styled.div`
  background: #fff;
  position: relative;
`

const Loading = styled.div`
  width: 100%;
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

const CardTitle = styled.h5`
  color: #000;
  margin-bottom: 10px;
`

const Form = styled.form`
  margin-bottom: 20px;
`

const Avatar = styled.img`
  width: 120px;
  height: 120px;
  border-radius: 50%;
`

const FormGroup = styled.div`
  margin-bottom: 10px;
  position: relative;
`

const FormRadio = styled.div`
  display: block;
  margin-top: 18px;
  margin-bottom: 15px;
`

const Label = styled.label`
  color: #000;
  display: block;
`

const Button = styled.button`
  background: ${colors.primary};
  color: #fff;
  border: 0;
  min-height: 43px;
  padding: 0 20px;
  border-radius: 25px;
  cursor: pointer;
`

const Actions = styled.div`
  flex-direction: column;
`

const ActionFeedback = styled.p`
  font-size: 15px;
  margin: 0;
`

const ActionButton = styled(Button)`
  font-size: 11px;
`

const ActionTSE = styled(Button)`
  font-size: 11px;
  margin-top: 17px;
`

const ActionsButton = styled.div`
  display: grid;
  grid-template-columns: 20% 20%;
  justify-content: center;
  grid-column-gap: 15px;
  margin-top: 10px;
`

const ErrorFeedback = styled.span`
  position: absolute;
  color: #bd0505;
  right: 0;
  font-weight: bold;
  font-size: 10px;
  bottom: -19px;
`
const IconAdd = styled(AddIcon)`
  font-size: 50px !important;
`

export default IdentidadForm
