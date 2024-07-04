import React, { useState, useEffect } from 'react'
import CustomSelectInput from 'Components/common/CustomSelectInput'

import { makeStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'
import Select from 'react-select'
import { FormGroup, Input, Label, CustomInput, FormFeedback } from 'reactstrap'
import IntlMessages from '../../../../../helpers/IntlMessages'
import ReactInputMask from 'react-input-mask'
import { validateSelectsData } from '../../../../../utils/ValidateSelectsData'
import { catalogsEnumObj } from '../../../../../utils/catalogsEnum'
import { mapOption } from '../../../../../utils/mapeoCatalogos'
import { useTranslation } from 'react-i18next'
import SelectCatalogo from 'Components/SelectCatalogo'
import { useSelector } from 'react-redux'
import moment from 'moment'

const OtrosDatos = (props) => {
  const { t } = useTranslation()
  const classes = useStyles()
  const [editable, setEditable] = useState(true)
  const [edad, setEdad] = useState(0)
  const [data, setData] = useState({})
  const [loading, setLoading] = useState(true)
  const { register, errors, setValue, selects } = props
  const state = useSelector((store) => {
    return {
      matricula: store.matricula
    }
  })
  useEffect(() => {
    const catalogsNamesArray = [
      catalogsEnumObj.IDENTIFICATION.name,
      catalogsEnumObj.ETNIAS.name,
      catalogsEnumObj.LENGUASINDIGENAS.name,
      catalogsEnumObj.ESTATUSMIGRATORIO.name,
      catalogsEnumObj.LENGUAMATERNA.name,
      catalogsEnumObj.SEXO.name,
      catalogsEnumObj.GENERO.name,
      catalogsEnumObj.ESTADOCIVIL.name
    ]
    if (validateSelectsData(props.state.selects, catalogsNamesArray)) {
      if (state.matricula.data.datos === undefined) {
        return
      }
      const _item = {
        ...state.matricula.data,
        migracionStatus: mapOption(
          state.matricula.data.datos,
          props.state.selects,
          catalogsEnumObj.ESTATUSMIGRATORIO.id,
          catalogsEnumObj.ESTATUSMIGRATORIO.name
        ),
        lenguaIndigena: mapOption(
          state.matricula.data.datos,
          props.state.selects,
          catalogsEnumObj.LENGUASINDIGENAS.id,
          catalogsEnumObj.LENGUASINDIGENAS.name
        ),
        lenguaMaterna: mapOption(
          state.matricula.data.datos,
          props.state.selects,
          catalogsEnumObj.LENGUAMATERNA.id,
          catalogsEnumObj.LENGUAMATERNA.name
        ),
        estadoCivil: mapOption(
          state.matricula.data.datos,
          props.state.selects,
          catalogsEnumObj.ESTADOCIVIL.id,
          catalogsEnumObj.ESTADOCIVIL.name
        ),
        etnia: mapOption(
          state.matricula.data.datos,
          props.state.selects,
          catalogsEnumObj.ETNIAS.id,
          catalogsEnumObj.ETNIAS.name
        ),
        idType: mapOption(
          state.matricula.data.datos,
          props.state.selects,
          catalogsEnumObj.IDENTIFICATION.id,
          catalogsEnumObj.IDENTIFICATION.name
        )
      }

      const _migracionStatus = props.state.selects
        ? props.state.selects.migrationTypes.find((x) => x.codigo === '02')
        : undefined
      if (state.matricula.data.id && _item) {
        props.register({ name: 'migracionStatus' }, { required: 'Requerido' })
        setValue(
          'migracionStatus',
          _item.migracionStatus?.label === 'Seleccionar'
            ? _migracionStatus
              ? { label: _migracionStatus.nombre, value: _migracionStatus.id }
              : null
            : _item.migracionStatus
        )

        if (_item.migracionStatus?.label === 'Seleccionar') {
          _item.migracionStatus = {
            label: _migracionStatus.nombre,
            value: _migracionStatus.id
          }
        }

        const _etnia = props.state.selects
          ? props.state.selects.etnias.find((x) => x.codigo === '01')
          : undefined
        props.register({ name: 'etnia' }, { required: 'Requerido' })
        setValue(
          'etnia',
          _item.etnia?.label === 'Seleccionar'
            ? _etnia
              ? { label: _etnia.nombre, value: _etnia.id }
              : null
            : _item.etnia
        )

        if (_item.etnia?.label === 'Seleccionar') {
          _item.etnia = { label: _etnia.nombre, value: _etnia.id }
        }
        const _lenguaIndigena = props.state.selects
          ? props.state.selects.lenguasIndigenas.find((x) => x.codigo === '01')
          : undefined
        props.register({ name: 'lenguaIndigena' }, { required: 'Requerido' })
        setValue(
          'lenguaIndigena',
          _item.lenguaIndigena?.label === 'Seleccionar'
            ? _lenguaIndigena
              ? { label: _lenguaIndigena.nombre, value: _lenguaIndigena.id }
              : null
            : _item.lenguaIndigena
        )
        if (_item.lenguaIndigena?.label === 'Seleccionar') {
          _item.lenguaIndigena = {
            label: _lenguaIndigena.nombre,
            value: _lenguaIndigena.id
          }
        }

        props.register({ name: 'lesco' })
        setValue('lesco', _item.lesco)

        const _lenguaMaterna = props.state.selects
          ? props.state.selects.lenguasIndigenas.find((x) => x.codigo === '01')
          : undefined
        props.register({ name: 'lenguaMaterna' }, { required: 'Requerido' })
        setValue(
          'lenguaMaterna',
          _item.lenguaMaterna?.label === 'Seleccionar'
            ? _lenguaMaterna
              ? { label: _lenguaMaterna.nombre, value: _lenguaMaterna.id }
              : null
            : _item.lenguaMaterna
        )

        if (_item.lenguaMaterna?.label === 'Seleccionar') {
          _item.lenguaMaterna = {
            label: _lenguaMaterna.nombre,
            value: _lenguaMaterna.id
          }
        }

        const _soltero = props.state.selects
          ? props.state.selects.estadosCiviles.find((x) => x.codigo === '06')
          : undefined
        props.register({ name: 'estadoCivil' }, { required: 'Requerido' })
        setValue(
          'estadoCivil',
          _item.estadoCivil?.label === 'Seleccionar'
            ? _soltero
              ? { label: _soltero.nombre, value: _soltero.id }
              : null
            : _item.estadoCivil
        )

        if (_item.estadoCivil?.label === 'Seleccionar') {
          _item.estadoCivil = { label: _soltero.nombre, value: _soltero.id }
        }
      }

      setData(_item)

      if (
        state.matricula.data.fechaNacimiento &&
        state.matricula.data.fechaNacimiento !== ''
      ) {
        const edadYears = moment().diff(
          state.matricula.data.fechaNacimiento,
          'years',
          false
        )
        setEdad(edadYears)

        if (
          edadYears >= 18 &&
          (state.matricula.data.telefono == null ||
            state.matricula.data.telefono === '')
        ) {
          props.unregister(['telefono'])
          props.register({ name: 'telefono' })
          setValue('telefono', '')
        }

        if (
          edadYears >= 18 &&
          (state.matricula.data.email == null ||
            state.matricula.data.email === '')
        ) {
          props.unregister(['email'])
          props.register({ name: 'email' })
          setValue('email', '')
        }
      }

      //  setEditable(false)
    }
  }, [state.matricula.data, props.state.selects])

  const handleChange = (e, select = '') => {
    let _data = {}
    if (e.target && e.target.name === 'id') {
      _data = { ...data, id: e.target.value.trim() }
    } else if (select && select !== 'idType') {
      _data = { ...data, [select]: e }
    } else if (select === 'idType') {
      if (Array.isArray(e)) {
        _data = {
          ...data,
          idType: e[0].value,
          nationalityId: e[1].id
        }
      } else {
        _data = { ...data, idType: e.value }
      }
    } else {
      _data = {
        ...data,
        [e.target.name]: e.target.value
      }
    }
    setData(_data)
  }

  return (
    <Grid container className={classes.root}>
      <Grid item md={12} xs={12}>
        <Grid container>
          <Grid item md={6} xs={12} className={classes.control}>
            <Paper className={classes.paper}>
              <h4>{t('estudiantes>matricula_estudiantil>matricular_estudiante>otros_datos>otros_datos', 'Otros datos')}</h4>
              <FormGroup>
                <Label>{t('estudiantes>matricula_estudiantil>matricular_estudiante>otros_datos>estado_migratorio', '*Estado migratorio')}</Label>
                <Select
                  name='migracionStatus'
                  components={{ Input: CustomSelectInput }}
                  className={
                    errors.migracionStatus && errors.migracionStatus.message
                      ? 'react-select is-invalid'
                      : 'react-select'
                  }
                  classNamePrefix='react-select'
                  options={props.state.selects.migrationTypes.map((item) => {
                    return { ...item, label: item.nombre, value: item.id }
                  })}
                  placeholder=''
                  value={data.migracionStatus}
                  onChange={(data) => {
                    handleChange(data, 'migracionStatus')
                    setValue('migracionStatus', data)
                  }}
                  isDisabled={!editable}
                />

                <FormFeedback>
                  {' '}
                  {errors.migracionStatus && errors.migracionStatus.message}
                </FormFeedback>
              </FormGroup>

              <FormGroup>
                <Label>{t('estudiantes>matricula_estudiantil>matricular_estudiante>otros_datos>etnia', 'Etnia indígena')}</Label>
                <Select
                  components={{ Input: CustomSelectInput }}
                  className={
                    errors.etnia && errors.etnia.message
                      ? 'react-select is-invalid'
                      : 'react-select'
                  }
                  classNamePrefix='react-select'
                  options={[
                    ...props.state.selects.etnias.map((item) => {
                      return { ...item, label: item.nombre, value: item.id }
                    })
                  ]}
                  placeholder=''
                  value={data.etnia}
                  onChange={(data) => {
                    handleChange(data, 'etnia')
                    setValue('etnia', data)
                  }}
                  isDisabled={!editable}
                />

                <FormFeedback>
                  {' '}
                  {errors.etnia && errors.etnia.message}
                </FormFeedback>
              </FormGroup>

              <FormGroup>
                <Label>{t('estudiantes>matricula_estudiantil>matricular_estudiante>otros_datos>lenguia_indigena', 'Lengua indígena')}</Label>
                <Select
                  components={{ Input: CustomSelectInput }}
                  className={
                    errors.etnia && errors.etnia.message
                      ? 'react-select is-invalid'
                      : 'react-select'
                  }
                  classNamePrefix='react-select'
                  options={[
                    ...props.state.selects.lenguasIndigenas.map((item) => {
                      return { ...item, label: item.nombre, value: item.id }
                    })
                  ]}
                  placeholder=''
                  value={data.lenguaIndigena}
                  onChange={(data) => {
                    handleChange(data, 'lenguaIndigena')
                    setValue('lenguaIndigena', data)
                  }}
                  isDisabled={!editable}
                />
                <FormFeedback>
                  {' '}
                  {errors.lenguaIndigena && errors.lenguaIndigena.message}
                </FormFeedback>
              </FormGroup>

              <FormGroup>
                <Label>{t('estudiantes>matricula_estudiantil>matricular_estudiante>otros_datos>lengua_señas', 'Lengua de señas costarricense (LESCO)')}</Label>
                <div>
                  <CustomInput
                    type='radio'
                    id='exampleCustomInline'
                    inline
                    label='Si'
                    checked={data.lesco}
                    onClick={() => {
                      handleChange({
                        target: { value: true, name: 'lesco' }
                      })

                      setValue('lesco', true)
                    }}
                  />
                  <CustomInput
                    type='radio'
                    id='exampleCustomInline2'
                    inline
                    label='No'
                    checked={!data.lesco}
                    onClick={() => {
                      handleChange({
                        target: { value: false, name: 'lesco' }
                      })

                      setValue('lesco', false)
                    }}
                  />
                </div>
              </FormGroup>
              <FormGroup>
                <Label>{t('estudiantes>matricula_estudiantil>matricular_estudiante>otros_datos>lengua_materna', ' *Lengua materna')}</Label>
                <SelectCatalogo
                  components={{ Input: CustomSelectInput }}
                  className={
                    errors.lenguaMaterna && errors.lenguaMaterna.message
                      ? 'react-select is-invalid'
                      : 'react-select'
                  }
                  classNamePrefix='react-select'
                  catalogo='lenguasMaternas'
                  /* options={props.state.selects.lenguasMaternas.map((item) => {
                    return { ...item, label: item.nombre, value: item.id }
                  })} */
                  // placeholder=''
                  value={data.lenguaMaterna}
                  onChange={(data) => {
                    handleChange(data, 'lenguaMaterna')
                    setValue('lenguaMaterna', data)
                  }}
                  isDisabled={!editable}
                />

                <FormFeedback>
                  {' '}
                  {errors.lenguaMaterna && errors.lenguaMaterna.message}
                </FormFeedback>
              </FormGroup>

              <FormGroup>
                <Label>{t('estudiantes>matricula_estudiantil>matricular_estudiante>otros_datos>estado_civil', ' *Estado civil')}</Label>
                <Select
                  components={{ Input: CustomSelectInput }}
                  className={
                    errors.estadoCivil && errors.estadoCivil.message
                      ? 'react-select is-invalid'
                      : 'react-select'
                  }
                  classNamePrefix='react-select'
                  options={props.state.selects.estadosCiviles.map((item) => {
                    return { ...item, label: item.nombre, value: item.id }
                  })}
                  placeholder=''
                  value={data.estadoCivil}
                  onChange={(data) => {
                    handleChange(data, 'estadoCivil')
                    setValue('estadoCivil', data)
                  }}
                  isDisabled={!editable}
                />

                <FormFeedback>
                  {' '}
                  {errors.estadoCivil && errors.estadoCivil.message}
                </FormFeedback>
              </FormGroup>
            </Paper>
            <div className='col-md-1' />
          </Grid>
          <Grid item md={6} xs={12} className={classes.control}>
            <Paper className={classes.paper}>
              <h4>{t('estudiantes>matricula_estudiantil>matricular_estudiante>otros_datos>contacto', 'Contacto')}</h4>

              <FormGroup>
                <Label>
                  {edad < 18 ? '*' : ''}
                  {t('estudiantes>matricula_estudiantil>matricular_estudiante>otros_datos>telefono_principal', '*Teléfono principal ')}
                </Label>
                <ReactInputMask
                  mask='9999-9999'
                  type='text'
                  name='telefono'
                  id='telefono'
                  placeholder='8888-8888'
                  value={data.telefono}
                  disabled={!editable}
                  onChange={(data) => {
                    handleChange(data)
                  }}
                >
                  {(inputProps) => (
                    <Input
                      innerRef={
                        edad > 17
                          ? register({
                            required: 'Requerido',
                            pattern: /^[\+]?[-\s\.]?[0-9]{4}[-\s\.]?[0-9]{4}$/im
                          })
                          : register({
                            pattern: /^[\+]?[-\s\.]?[0-9]{4}[-\s\.]?[0-9]{4}$/im
                          })
                      }
                      {...inputProps}
                      disabled={!editable}
                      invalid={errors.telefono && errors.telefono.message}
                    />
                  )}
                </ReactInputMask>
                <FormFeedback>
                  {' '}
                  {errors.telefono && errors.telefono.message}
                </FormFeedback>
              </FormGroup>

              <FormGroup>
                <Label>
                  {t('estudiantes>matricula_estudiantil>matricular_estudiante>otros_datos>telefono_alternativo', ' Teléfono alternativo')}
                </Label>

                <ReactInputMask
                  mask='9999-9999'
                  type='text'
                  name='telefonoSecundario'
                  id='telefonoSecundario'
                  placeholder='8888-8888'
                  value={data.telefonoSecundario}
                  disabled={!editable}
                  innerRef={register}
                  onChange={(data) => {
                    handleChange(data)
                  }}
                  invalid={false}
                >
                  {(inputProps) => (
                    <Input {...inputProps} disabled={!editable} />
                  )}
                </ReactInputMask>
              </FormGroup>

              <FormGroup>
                <Label>
                  {edad > 17 ? '*' : ''}
                  {t('estudiantes>matricula_estudiantil>matricular_estudiante>otros_datos>correo', '*Correo electrónico principal')}
                </Label>
                <Input
                  type='text'
                  name='email'
                  disabled={!editable}
                  invalid={errors.email && errors.email.message}
                  value={data.email}
                  onChange={(data) => {
                    handleChange(data)
                  }}
                  innerRef={
                    edad > 17
                      ? register({
                        required: 'Requerido',
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: 'Correo electronico inválido'
                        }
                      })
                      : register({
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: 'Correo electronico inválido'
                        }
                      })
                  }
                />
                <FormFeedback>
                  {' '}
                  {errors.email && errors.email.message}
                </FormFeedback>
              </FormGroup>

              <FormGroup>
                <Label>
                  {t('estudiantes>matricula_estudiantil>matricular_estudiante>otros_datos>correo_alternativo', 'Correo electrónico alternativo')}
                </Label>
                <Input
                  innerRef={register}
                  onChange={(data) => {
                    handleChange(data)
                  }}
                  type='text'
                  name='emailSecundario'
                  value={data.emailSecundario}
                  disabled={!editable}
                />
              </FormGroup>
            </Paper>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  )
}

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    '& > *': {}
  },
  control: {
    padding: theme.spacing(2)
  },
  paper: {
    minHeight: 575,
    padding: 20
  }
}))

export default OtrosDatos
