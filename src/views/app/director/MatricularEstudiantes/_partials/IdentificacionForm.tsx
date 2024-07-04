import React, { useState, useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
import { FormGroup, Input, Form, Label, FormFeedback } from 'reactstrap'
import styled from 'styled-components'
import AddAPhotoIcon from '@material-ui/icons/AddAPhoto'
import { IconButton, Avatar } from '@material-ui/core'
import colors from '../../../../../assets/js/colors'
import IntlMessages from '../../../../../helpers/IntlMessages'
import Skeleton from '@material-ui/lab/Skeleton'
import { getCatalogsSet } from '../../../../../redux/selects/actions'
import { useActions } from 'Hooks/useActions'
import { catalogsEnumObj } from '../../../../../utils/catalogsEnum'
import { mapOption } from '../../../../../utils/mapeoCatalogos'
import moment from 'moment'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import AccordionSummary from '@material-ui/core/AccordionSummary'
import AccordionDetails from '@material-ui/core/AccordionDetails'
import Accordion from '@material-ui/core/Accordion'
import withRouter from 'react-router-dom/withRouter'
import Link from 'react-router-dom/Link'
import { useTranslation } from 'react-i18next'

const IdentificacionForm = (props) => {
  const { t } = useTranslation()
  const { errors, register, setValue, state, watch } = props
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState(true)
  const [editable, setEditable] = useState(true)
  const [data, setData] = useState({})
  const [nombreCompleto, setNombreCompleto] = useState('')
  const classes = useStyles()
  const actions = useActions({
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

  useEffect(() => {
    if (state.identification.data.id && !loading) {
      const _nombreCompleto = state.identification.data.nombre + ' ' + state.identification.data.primerApellido + ' ' + state.identification.data.segundoApellido

      setNombreCompleto(_nombreCompleto)

      props.register({ name: 'primerApellido' })
      setValue(
        'primerApellido',
        state.identification.data.primerApellido
      )
      props.register({ name: 'segundoApellido' })
      setValue(
        'segundoApellido',
        state.identification.data.segundoApellido
      )

      props.register({ name: 'nombre' })
      props.register({ name: 'nationality' })
      props.register({ name: 'idType' })

      setValue(identificationFormNames.nombre, state.identification.data.nombre)
      setValue(
        identificationFormNames.profilePic_url,
        state.identification.data.fotografiaUrl
      )
      setValue(
        identificationFormNames.edad,
        state.identification.data.fechaNacimiento
          ? moment().diff(state.identification.data.fechaNacimiento, 'years', false)
          : null
      )

      setValue(
        identificationFormNames.primerApellido,
        state.identification.data.primerApellido
      )
      setValue(
        identificationFormNames.segundoApellido,
        state.identification.data.segundoApellido
      )
      setValue(
        identificationFormNames.conocidoComo,
        state.identification.data.conocidoComo
      )
      setValue(
        identificationFormNames.fechaNacimiento,
        state.identification.data.fechaNacimiento
          ? moment(state.identification.data.fechaNacimiento).format('DD/MM/YYYY')
          : null
      )
      setValue(
        identificationFormNames.sexo,
        mapOption(
          state.identification.data.datos,
          state.selects,
          catalogsEnumObj.SEXO.id,
          catalogsEnumObj.SEXO.name
        )?.id || null
      )

      setValue(
        identificationFormNames.genero,
        mapOption(
          state.identification.data.datos,
          state.selects,
          catalogsEnumObj.GENERO.id,
          catalogsEnumObj.GENERO.name
        )?.id || null
      )

      const idType = state.selects.idTypes.find(
        (item) => item.id == props.watch(identificationFormNames.idType)
      )

      if (idType !== undefined) {
        idType.codigo == '01' && setEditable(false)
      }
    }
  }, [state.identification.data, loading])

  useEffect(() => {
    const _data = {
      idType: mapOption(
        state.matricula.data.datos,
        state.selects,
        catalogsEnumObj.IDENTIFICATION.id,
        catalogsEnumObj.IDENTIFICATION.name
      ),
      nationality: mapOption(
        state.matricula.data.datos,
        state.selects,
        catalogsEnumObj.NATIONALITIES.id,
        catalogsEnumObj.NATIONALITIES.name
      ),
      identificacion: state.matricula.data.identificacion
    }
    setData(_data)

    if (_data.idType) { setValue(identificationFormNames.idType, _data.idType.elementoId) }

    if (_data.nationality) { setValue(identificationFormNames.nationality, _data.nationality ? _data.nationality.elementoId : null) }
  }, [state.matricula.data.datos])

  return (
    <Grid container className={classes.root} spacing={2}>
      <Grid item md={12} xs={12}>
        <div style={{ display: 'flex', justifyContent: 'space-around', width: '15%' }}>
          <Link to='/director/matricular-estudiantes'>
            <h3>
              {t('estudiantes>expediente>nav>inicio', 'Inicio')}
            </h3>
          </Link>
          <p>|</p>
          <h3>
            {t('estudiantes>matricula_estudiantil>matricular_estudiante>resgistro', 'Registro')}
          </h3>
        </div>
        <Accordion expanded={expanded} onChange={() => setExpanded(!expanded)}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls='panel1c-content'
            id='panel1c-header'
          >
            <h4>{t('estudiantes>matricula_estudiantil>matricular_estudiante>identificacion_estu>identificacion_estu', 'Identificación del estudiante')}</h4>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={2}>
              <Grid item md={12} xs={12}>
                <Form>
                  <Grid container>
                    {loading ? (
                      <LoadingSkeleton classes={classes} />
                    ) : (
                      <>
                        <Grid item xs={12} className={classes.control}>
                          <StyledImgFieldsContainer>
                            <>
                              <input
                                accept='image/*'
                                disabled
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
                                    className='icon cursor-pointer'
                                    color='primary'
                                    aria-label='Subir Fotografia'
                                    component='span'
                                    isDisabled
                                  >
                                    <AddAPhotoIcon className={classes.icon} />
                                  </StyledIconButton>
                                  )}
                            </label>
                            <input
                              type='hidden'
                              name='profilePic_url'
                              ref={props.register}
                            />
                            <Grid container spacing={1}>
                              <Grid item xs={5}>
                                <FormGroup>
                                  <Label>
                                    {t('estudiantes>matricula_estudiantil>matricular_estudiante>identificacion_estu>tipo_id', 'Tipo de identificación')}
                                  </Label>
                                  <Input
                                    disabled
                                    type='text'
                                    name='idType'

                                    value={data.idType?.label}
                                    className={
                                      errors.idType && errors.idType.message
                                        ? 'is-invalid'
                                        : ''
                                    }
                                  />

                                  <FormFeedback>
                                    {' '}
                                    {errors.idTypes && errors.idTypes.message}
                                  </FormFeedback>
                                </FormGroup>
                              </Grid>
                              <Grid item xs={7}>
                                <FormGroup>
                                  <Label>
                                    {t('estudiantes>matricula_estudiantil>matricular_estudiante>identificacion_estu>nacionalidad', 'Nacionalidad')}
                                  </Label>
                                  <Input
                                    invalid={
                                      errors.nationality &&
                                      errors.nationality.message
                                    }
                                    disabled
                                    type='text'
                                    name='nationality'

                                    value={data.nationality?.label}
                                  />

                                  <FormFeedback>
                                    {' '}
                                    {errors.nationality &&
                                      errors.nationality.message}
                                  </FormFeedback>
                                </FormGroup>
                              </Grid>
                              <Grid item xs={5}>
                                <FormGroup>
                                  <Label>
                                    {t('estudiantes>matricula_estudiantil>matricular_estudiante>identificacion_estu>num_id', 'Número de identificación')}
                                  </Label>
                                  <Input
                                    type='text'
                                    name='identificacion'
                                    invalid={
                                      errors.identificacion &&
                                      errors.identificacion.message
                                    }
                                    disabled
                                    value={data.identificacion}
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
                              </Grid>
                              <Grid item xs={7}>
                                <FormGroup>
                                  <Label>
                                    {t('estudiantes>matricula_estudiantil>matricular_estudiante>identificacion_estu>nombre', 'Nombre completo')}
                                  </Label>
                                  <Input
                                    disabled
                                    type='text'
                                    name='nombre'
                                    value={nombreCompleto}

                                  />

                                  <FormFeedback>
                                    {' '}
                                    {errors.nombre && errors.nombre.message}
                                  </FormFeedback>
                                </FormGroup>
                              </Grid>
                              <Grid item xs={5}>
                                <Grid container spacing={1}>
                                  <Grid item xs={8}>
                                    <FormGroup>
                                      <Label>
                                        {t('estudiantes>matricula_estudiantil>matricular_estudiante>identificacion_estu>fecha_nacimiento', '*Fecha de nacimiento')}
                                      </Label>
                                      <Input
                                        disabled
                                        type='text'
                                        name='fechaNacimiento'
                                        innerRef={props.register({
                                          required: 'Requerido'
                                        })}
                                        invalid={
                                          errors.fechaNacimiento &&
                                          errors.fechaNacimiento.message
                                        }
                                      />

                                      <FormFeedback>
                                        {' '}
                                        {errors.fechaNacimiento &&
                                          errors.fechaNacimiento.message}
                                      </FormFeedback>
                                    </FormGroup>
                                  </Grid>
                                  <Grid item xs={4}>
                                    <FormGroup>
                                      <Label>
                                        {t('estudiantes>matricula_estudiantil>matricular_estudiante>identificacion_estu>edad', 'Edad')}
                                      </Label>
                                      <Input
                                        disabled
                                        type='text'
                                        name='edad'
                                        innerRef={props.register}
                                        invalid={
                                          errors.edad && errors.edad.message
                                        }
                                      />

                                      <FormFeedback>
                                        {' '}
                                        {errors.edad && errors.edad.message}
                                      </FormFeedback>
                                    </FormGroup>
                                  </Grid>
                                </Grid>
                              </Grid>
                              <Grid item xs={7}>
                                <FormGroup>
                                  <Label>
                                    {t('estudiantes>matricula_estudiantil>matricular_estudiante>identificacion_estu>conocido_como', 'Conocido como')}
                                  </Label>
                                  <Input
                                    disabled
                                    type='text'
                                    name='conocidoComo'
                                    innerRef={props.register}
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
                              </Grid>
                              <Grid item xs={5}>
                                <FormGroup>
                                  <Label>
                                    {t('estudiantes>matricula_estudiantil>matricular_estudiante>identificacion_estu>genero', 'Género')}
                                  </Label>
                                  <Input
                                    disabled={false}
                                    type='select'
                                    name='genero'
                                    invalid={
                                      errors.genero && errors.genero.message
                                    }
                                    innerRef={props.register({
                                      required: 'Requerido'
                                    })}
                                  >
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
                                </FormGroup>{' '}
                              </Grid>
                            </Grid>
                          </StyledImgFieldsContainer>
                        </Grid>
                        {/* <Grid item xs={6} className={classes.control}>
                          <FormGroup>
                            <Label>
                              <IntlMessages id="catalogo.sexoTypes" />
                            </Label>
                            <Input
                              disabled={!editable}
                              type="select"
                              name="sexo"
                              invalid={errors.sexo && errors.sexo.message}
                              innerRef={props.register({
                                required: 'Requerido',
                              })}
                            >
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
                        </Grid> */}
                      </>
                    )}
                  </Grid>
                </Form>
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>
      </Grid>
    </Grid>
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
    marginBottom: 0,
    '& > *': {
      margin: theme.spacing(1)
    }
  },
  control: {
    padding: theme.spacing(2),
    paddingTop: 0
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
    width: 50%;
  }
`
const StyledIconButton = styled(IconButton)`
  cursor: ${(props) => (props.isDisabled ? 'auto' : 'pointer')} !important;
  background: ${colors.primary} !important;
  width: 150px !important;
  margin-right: 0.9rem !important;
  height: 150px !important;
  &:hover {
    background: ${colors.primary} !important;
  }
`

export default withRouter(IdentificacionForm)
