import React, { useState, useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
import {
  FormGroup,
  Input,
  Form,
  Label,
  FormFeedback,
  Card,
  CardBody
} from 'reactstrap'
import styled from 'styled-components'
import PersonIcon from '@material-ui/icons/Person'
import { IconButton, Avatar } from '@material-ui/core'
import colors from 'Assets/js/colors'
import IntlMessages from 'Helpers/IntlMessages'
import {
  getStudentByIdentification,
  cleanStudent
} from 'Redux/identidad/actions'
import { showProgress, hideProgress } from 'Utils/progress'
import Skeleton from '@material-ui/lab/Skeleton'
import { getCatalogsSet } from 'Redux/selects/actions'
import { useActions } from 'Hooks/useActions'
import { catalogsEnumObj } from 'Utils/catalogsEnum'
import { mapOption } from 'Utils/mapeoCatalogos'
import moment from 'moment'
import useNotification from 'Hooks/useNotification'
import swal from 'sweetalert'

const IdentificacionForm = (props) => {
  const { errors, register, setValue, state, watch } = props
  const [typingTimeout, setTypingTimeout] = useState()
  const [nationalities, setNationalities] = useState([])
  const [loading, setLoading] = useState(true)
  const [showError, setShowError] = useState()
  const [snackbar, handleClick, handleClose] = useNotification()
  const [disabledFields, setDisabledFields] = useState(false)
  const [snackbarContent, setSnackbarContent] = useState({
    variant: 'error',
    msg: 'hubo un error'
  })
  const classes = useStyles()
  const actions = useActions({
    getStudentByIdentification,
    cleanStudent,
    getCatalogsSet
  })

  enum identificationFormNames {
    idType = 'idType',
    nationality = 'nationality',
    edad = 'edad',
    identificacion = 'identificacion',
    nombre = 'nombre',
    primerApellido = 'primerApellido',
    segundoApellido = 'segundoApellido',
    conocidoComo = 'conocidoComo',
    fechaNacimiento = 'fechaNacimiento',
    sexo = 'sexo',
    genero = 'genero',
    profilePic = 'profilePic',
    profilePic_url = 'profilePic_url',
  }

  enum snackbarTypes {
    error = 'error',
    success = 'success',
    ifno = 'info',
    warning = 'warning',
  }

  useEffect(() => {
    const loadData = async () => {
      const catalogsArray = [
        catalogsEnumObj.IDENTIFICATION,
        catalogsEnumObj.ETNIAS,
        catalogsEnumObj.LENGUASINDIGENAS,
        catalogsEnumObj.ESTATUSMIGRATORIO,
        catalogsEnumObj.LENGUAMATERNA,
        catalogsEnumObj.SEXO,
        catalogsEnumObj.GENERO,
        catalogsEnumObj.ESTADOCIVIL,
        catalogsEnumObj.NATIONALITIES
      ]
      await actions.getCatalogsSet(catalogsArray)
      setLoading(false)
    }
    loadData()
  }, [])

  const handleImageChange = (e) => {
    setValue(`${e.target.name}_url`, URL.createObjectURL(e.target.files[0]))
    setValue(`${e.target.name}`, e.target.files)
  }

  const showNotification = (type: snackbarTypes, msg) => {
    setSnackbarContent({ variant: type, msg })
    handleClick()
  }

  const updateIdentidad = () => {
    if (Object.keys(state.identidad?.data).length > 0) {
      if (state.identidad.data.datos && state.identidad.data.id > 0) {
        swal({
          title: 'Identidad registrada',
          text: 'No es posible crear esta identidad, ya existe',
          icon: 'warning',
          buttons: {
            ok: {
              text: 'Ok',
              value: true
            }
          }
        }).then(() => {
          setValue(identificationFormNames.identificacion, '')
        })
        return
      }
      const formNationality = watch(identificationFormNames.nationality)
      const nationality = state.selects.nationalities.find(
        (item) => item.id == formNationality
      )

      setValue(identificationFormNames.nombre, state.identidad.data.nombre)
      setValue(
        identificationFormNames.profilePic_url,
        state.identidad.data.fotografiaUrl
      )
      setValue(
        identificationFormNames.edad,
        state.identidad.data.fechaNacimiento
          ? moment().diff(state.identidad.data.fechaNacimiento, 'years', false)
          : null
      )

      setValue(
        identificationFormNames.primerApellido,
        state.identidad.data.primerApellido
      )
      setValue(
        identificationFormNames.segundoApellido,
        state.identidad.data.segundoApellido
      )
      setValue(
        identificationFormNames.conocidoComo,
        state.identidad.data.conocidoComo
      )
      setValue(
        identificationFormNames.fechaNacimiento,
        state.identidad.data.fechaNacimiento
          ? moment(state.identidad.data.fechaNacimiento).format('YYYY-MM-DD')
          : null
      )

      if (state.identidad.data.id == 0) {
        setValue(
          identificationFormNames.sexo,
          state.selects[catalogsEnumObj.SEXO.name].find(
            (item) => item.codigo == state.identidad.data.sexo
          )?.id
        )

        setValue(
          identificationFormNames.genero,
          state.selects[catalogsEnumObj.GENERO.name].find(
            (item) => item.codigo == state.identidad.data.sexo
          )?.id
        )
      } else {
        setValue(
          identificationFormNames.nationality,
          mapOption(
            state.identidad.data.datos,
            state.selects,
            catalogsEnumObj.NATIONALITIES.id,
            catalogsEnumObj.NATIONALITIES.name
          ).id
        )

        setValue(
          identificationFormNames.sexo,
          mapOption(
            state.identidad.data.datos,
            state.selects,
            catalogsEnumObj.SEXO.id,
            catalogsEnumObj.SEXO.name
          ).id || null
        )

        setValue(
          identificationFormNames.genero,
          mapOption(
            state.identidad.data.datos,
            state.selects,
            catalogsEnumObj.GENERO.id,
            catalogsEnumObj.GENERO.name
          ).id || null
        )
      }

      //  nationality.codigo == "15" && setDisabledFields(false)
    }
  }

  useEffect(() => {
    updateIdentidad()
  }, [state.identidad])

  useEffect(() => {
    setNationalities(
      state.selects.nationalities.filter((item) => item.codigo !== '15')
    )
  }, [state.selects.nationalities])

  const handleId = async (e) => {
    e.persist()
    clearTimeout(typingTimeout)
    showError && setShowError(false)
    const idType = state.selects.idTypes.find(
      (item) => item.id == props.watch(identificationFormNames.idType)
    )
    if (idType?.codigo == '01') {
      const length = e.target.value.length
      const valid = parseInt(e.target.value[length - 1])
      if (length === 1 && e.target.value !== '0' && !isNaN(valid)) {
        props.setValue(identificationFormNames.identificacion, e.target.value)
      } else if (length !== 1 && length <= 9 && !isNaN(valid)) {
        props.setValue(identificationFormNames.identificacion, e.target.value)
        if (length === 9) {
          showProgress()
          props.setValue(identificationFormNames.identificacion, e.target.value)
          const response = await actions.getStudentByIdentification(
            e.target.value
          )

          response.error &&
            showNotification('error', 'La identificacion no ha sido encontrada')
          hideProgress()
        }
      } else if (e.target.value.length === 0) {
        props.setValue(identificationFormNames.identificacion, e.target.value)
      }
    } else {
      const { value, name } = e.target
      if (value !== '') {
        setTypingTimeout(
          setTimeout(() => {
            async function getDataAsync () {
              showProgress()
              props.setValue(identificationFormNames.identificacion, value)
              const response = await actions.getStudentByIdentification(value)
              response.error &&
                showNotification(
                  'error',
                  'La identificacion no ha sido encontrada'
                )
              hideProgress()
            }
            getDataAsync()
          }, 800)
        )
      }
      props.setValue('identificacion', value)
    }
  }

  const handleChangeBirthday = () => {
    const fechaNacimientoWatch = watch(identificationFormNames.fechaNacimiento)

    setValue(
      identificationFormNames.edad,
      fechaNacimientoWatch
        ? moment().diff(fechaNacimientoWatch, 'years', false)
        : null
    )
  }

  return (
    <Card>
      <CardBody>
        <Grid container className={classes.root} spacing={2}>
          <Grid item md={12} xs={12}>
            <Grid container spacing={2}>
              <Grid item md={12} xs={12}>
                <h4>Identificación del estudiante</h4>
              </Grid>
              <Grid item md={12} xs={12}>
                <Form>
                  <Grid container>
                    {loading
                      ? (
                        <LoadingSkeleton classes={classes} />
                        )
                      : (
                        <>
                          <Grid item xs={6} className={classes.control}>
                            <StyledImgFieldsContainer>
                              <>
                                <input
                                  accept='image/*'
                                  onChange={handleImageChange}
                                  className={classes.input}
                                  id='profile-pic-id'
                                  type='file'
                                  name='profilePic'
                                  ref={props.register}
                                />
                              </>
                              <label htmlFor='profile-pic-id'>
                                {props.watch(
                                  identificationFormNames.profilePic_url
                                )
                                  ? (
                                    <Avatar
                                      alt={props.data.id}
                                      src={props.watch(
                  identificationFormNames.profilePic_url
                )}
                                      className={classes.avatar}
                                    />
                                    )
                                  : (
                                    <StyledIconButton
                                      className={`${classes.buttonIcon} icon cursor-pointer`}
                                      color='primary'
                                      aria-label='Subir Fotografia'
                                      component='span'
                                      isDisabled={!props.editable}
                                    >
                                      <PersonIcon className={classes.icon} />
                                    </StyledIconButton>
                                    )}
                              </label>
                              <input
                                type='hidden'
                                name='profilePic_url'
                                ref={props.register}
                              />
                              <div className='fields_div'>
                                <FormGroup>
                                  <Label>
                                    *<IntlMessages id='label.typeId' />
                                  </Label>
                                  <Input
                                    disabled={disabledFields}
                                    type='select'
                                    name='idType'
                                    invalid={
                                    errors.idType && errors.idType.message
                                  }
                                    innerRef={props.register({
                                      required: 'Requerido'
                                    })}
                                    className={
                                    errors.idType && errors.idType.message
                                      ? 'is-invalid'
                                      : ''
                                  }
                                    onChange={async (e) => {
                                      e.persist()
                                      const idType = state.selects.idTypes.find(
                                        (item) => item.id == e.target.value
                                      )
                                      if (idType.codigo == '01') {
                                        const _costaRica = state.selects.nationalities.filter(
                                          (item) => item.codigo == '15'
                                        )
                                        await setNationalities(_costaRica)
                                        props.setValue(
                                          identificationFormNames.nationality,
                                          _costaRica[0].id
                                        )
                                      } else {
                                        setNationalities(
                                          state.selects.nationalities.filter(
                                            (item) => item.codigo !== '15'
                                          )
                                        )
                                        props.setValue(
                                          identificationFormNames.nationality,
                                          null
                                        )
                                      }
                                      props.setValue(
                                        identificationFormNames.idType,
                                        e.target.value
                                      )
                                      props.setValue(
                                        identificationFormNames.identificacion,
                                        ''
                                      )
                                    }}
                                  >
                                    <option value=''>Seleccionar</option>
                                    {state.selects.idTypes.map((item) => {
                                      return (
                  <option key={item.id} value={item.id}>
                                        {item.nombre}
                                      </option>
                                      )
                                    })}
                                  </Input>

                                  <FormFeedback>
                                    {' '}
                                    {errors.idType && errors.idType.message}
                                  </FormFeedback>
                                </FormGroup>
                                <FormGroup>
                                  <Label>
                                    *<IntlMessages id='form.nationality' />
                                  </Label>
                                  <Input
                                    invalid={
                                    errors.nationality &&
                                    errors.nationality.message
                                  }
                                    disabled={disabledFields}
                                    type='select'
                                    name='nationality'
                                    innerRef={props.register({
                                      required: 'Requerido'
                                    })}
                                  >
                                    <option value=''>Seleccionar</option>
                                    {nationalities.map((item) => {
                                      return (
                  <option key={item.id} value={item.id}>
                                        {item.nombre}
                                      </option>
                                      )
                                    })}
                                  </Input>
                                  <FormFeedback>
                                    {' '}
                                    {errors.nationality &&
                                    errors.nationality.message}
                                  </FormFeedback>
                                </FormGroup>
                                <FormGroup>
                                  <Label>
                                    *<IntlMessages id='form.id' />
                                  </Label>
                                  <Input
                                    type='text'
                                    name='identificacion'
                                    onChange={handleId}
                                    invalid={
                                    errors.identificacion &&
                                    errors.identificacion.message
                                  }
                                    disabled={
                                    props.watch('nationality') == null ||
                                    !props.watch('idType') == null ||
                                    disabledFields
                                  }
                                    innerRef={props.register({
                                      required: 'Requerido'
                                    })}
                                  />
                                  <FormFeedback>
                                    {' '}
                                    {errors.identificacion &&
                                    errors.identificacion.message}
                                  </FormFeedback>
                                </FormGroup>
                              </div>
                            </StyledImgFieldsContainer>
                            <FormGroup>
                              <Label>
                                *<IntlMessages id='label.name' />
                              </Label>
                              <Input
                                disabled={disabledFields}
                                type='text'
                                name='nombre'
                                innerRef={props.register({
                                  required: 'Requerido'
                                })}
                                invalid={errors.nombre && errors.nombre.message}
                              />

                              <FormFeedback>
                                {' '}
                                {errors.nombre && errors.nombre.message}
                              </FormFeedback>
                            </FormGroup>
                            <FormGroup>
                              <Label>
                                *<IntlMessages id='label.lastName' />
                              </Label>
                              <Input
                                disabled={disabledFields}
                                type='text'
                                name='primerApellido'
                                innerRef={props.register({
                                  required: 'Requerido'
                                })}
                                invalid={
                                errors.primerApellido &&
                                errors.primerApellido.message
                              }
                              />

                              <FormFeedback>
                                {' '}
                                {errors.primerApellido &&
                                errors.primerApellido.message}
                              </FormFeedback>
                            </FormGroup>
                            <FormGroup>
                              <Label>
                                <IntlMessages id='form.secondLastName' />
                              </Label>
                              <Input
                                disabled={disabledFields}
                                type='text'
                                name='segundoApellido'
                                innerRef={props.register()}
                              />

                              <FormFeedback>
                                {' '}
                                {errors.segundoApellido &&
                                errors.segundoApellido.message}
                              </FormFeedback>
                            </FormGroup>
                          </Grid>
                          <Grid item xs={6} className={classes.control}>
                            <FormGroup>
                              <Label>
                                <IntlMessages id='institution.alias' />
                              </Label>
                              <Input
                                disabled={disabledFields}
                                type='text'
                                name='conocidoComo'
                                innerRef={props.register()}
                                invalid={
                                errors.conocidoComo &&
                                errors.conocidoComo.message
                              }
                              />

                              <FormFeedback>
                                {' '}
                                {errors.conocidoComo &&
                                errors.conocidoComo.message}
                              </FormFeedback>
                            </FormGroup>
                            <FormGroup>
                              <Label>
                                *<IntlMessages id='form.birthDate' />
                              </Label>
                              <Input
                                disabled={disabledFields}
                                type='date'
                                name='fechaNacimiento'
                                innerRef={props.register({
                                  required: 'Requerido'
                                })}
                                invalid={
                                errors.fechaNacimiento &&
                                errors.fechaNacimiento.message
                              }
                                onChange={handleChangeBirthday}
                              />

                              <FormFeedback>
                                {' '}
                                {errors.fechaNacimiento &&
                                errors.fechaNacimiento.message}
                              </FormFeedback>
                            </FormGroup>
                            <FormGroup>
                              <Label>
                                <IntlMessages id='form.age' />
                              </Label>
                              <Input
                                disabled
                                type='text'
                                name='edad'
                                innerRef={props.register}
                                invalid={errors.edad && errors.edad.message}
                              />

                              <FormFeedback>
                                {' '}
                                {errors.edad && errors.edad.message}
                              </FormFeedback>
                            </FormGroup>
                            <FormGroup>
                              <Label>
                                *<IntlMessages id='catalogo.sexoTypes' />
                              </Label>
                              <Input
                                disabled={disabledFields}
                                type='select'
                                name='sexo'
                                invalid={errors.sexo && errors.sexo.message}
                                innerRef={props.register({
                                  required: 'Requerido'
                                })}
                              >
                                <option value=''>Seleccionar</option>
                                {state.selects.sexoTypes.map((item) => {
                                  return (
                                    <option key={item.id} value={item.id}>
                                      {item.nombre}
                                    </option>
                                  )
                                })}
                              </Input>
                              <FormFeedback>
                                {' '}
                                {errors.sexo && errors.sexo.message}
                              </FormFeedback>
                            </FormGroup>
                            <FormGroup>
                              <Label>
                                <IntlMessages id='catalogo.genderTypes' />
                              </Label>
                              <Input
                                disabled={disabledFields}
                                type='select'
                                name='genero'
                                invalid={errors.genero && errors.genero.message}
                                innerRef={props.register()}
                              >
                                <option value=''>Seleccionar</option>
                                {state.selects.genderTypes.map((item) => {
                                  return (
                                    <option key={item.id} value={item.id}>
                                      {item.nombre}
                                    </option>
                                  )
                                })}
                              </Input>
                              <FormFeedback>
                                {' '}
                                {errors.genero && errors.genero.message}
                              </FormFeedback>
                            </FormGroup>
                          </Grid>
                        </>
                        )}
                  </Grid>
                </Form>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </CardBody>
    </Card>
  )
}

const LoadingSkeleton = ({ classes }) => (
  <>
    <Grid item xs={6} className={classes.control}>
      <StyledImgFieldsContainer>
        <span style={{ marginRight: '0.9rem' }}>
          <Skeleton
            animation='wave'
            variant='circle'
            width={150}
            height={150}
          />
        </span>
        <div className='fields_div'>
          <FormGroup>
            <Skeleton animation='wave' variant='text' width='30%' height={30} />
            <Skeleton
              animation='wave'
              variant='rect'
              width='100%'
              height={50}
            />
          </FormGroup>
          <FormGroup>
            <Skeleton animation='wave' variant='text' width='30%' height={30} />
            <Skeleton
              animation='wave'
              variant='rect'
              width='100%'
              height={50}
            />
          </FormGroup>
          <FormGroup>
            <Skeleton animation='wave' variant='text' width='30%' height={30} />
            <Skeleton
              animation='wave'
              variant='rect'
              width='100%'
              height={50}
            />
          </FormGroup>
        </div>
      </StyledImgFieldsContainer>
      <FormGroup>
        <Skeleton animation='wave' variant='text' width='30%' height={30} />
        <Skeleton animation='wave' variant='rect' width='100%' height={50} />
      </FormGroup>
      <FormGroup>
        <Skeleton animation='wave' variant='text' width='30%' height={30} />
        <Skeleton animation='wave' variant='rect' width='100%' height={50} />
      </FormGroup>
      <FormGroup>
        <Skeleton animation='wave' variant='text' width='30%' height={30} />
        <Skeleton animation='wave' variant='rect' width='100%' height={50} />
      </FormGroup>
    </Grid>
    <Grid item xs={6} className={classes.control}>
      <FormGroup>
        <Skeleton animation='wave' variant='text' width='30%' height={30} />
        <Skeleton animation='wave' variant='rect' width='100%' height={50} />
      </FormGroup>
      <FormGroup>
        <Skeleton animation='wave' variant='text' width='30%' height={30} />
        <Skeleton animation='wave' variant='rect' width='100%' height={50} />
      </FormGroup>
      <FormGroup>
        <Skeleton animation='wave' variant='text' width='30%' height={30} />
        <Skeleton animation='wave' variant='rect' width='100%' height={50} />
      </FormGroup>
      <FormGroup>
        <Skeleton animation='wave' variant='text' width='30%' height={30} />
        <Skeleton animation='wave' variant='rect' width='100%' height={50} />
      </FormGroup>
      <FormGroup>
        <Skeleton animation='wave' variant='text' width='30%' height={30} />
        <Skeleton animation='wave' variant='rect' width='100%' height={50} />
      </FormGroup>
    </Grid>
  </>
)

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    marginBottom: 125,
    '& > *': {
      margin: theme.spacing(1)
    }
  },
  control: {
    padding: theme.spacing(2)
  },
  paper: {
    minHeight: 475,
    padding: 20,
    marginLeft: 10
  },
  input: {
    display: 'none'
  },
  avatar: {
    width: '150px',
    height: '150px',
    boxShadow:
      '0 1px 2px 0 rgba(0, 0, 0, 0.15), 0 1px 3px 1px rgba(0, 0, 0, 0.15) !important',
    marginRight: '0.9rem'
  },
  icon: {
    width: '70px',
    height: '70px',
    color: '#fff'
  }
}))

const StyledImgFieldsContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;

  .fields_div {
    width: 100%;
  }
`
const StyledIconButton = styled(IconButton)`
  cursor: ${(props) => (props.isDisabled ? 'auto' : 'pointer')} !important;
  background: ${(props) => (props.isDisabled ? 'grey' : colors.primary)};
  width: 150px;
  margin-right: 0.9rem;
  height: 150px;
  &:hover {
    background-color: ${(props) => (props.isDisabled ? 'grey' : '#0c3253')};
  }
`

export default IdentificacionForm
