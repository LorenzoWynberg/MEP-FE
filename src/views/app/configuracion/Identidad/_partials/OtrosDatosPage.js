import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import CustomSelectInput from 'Components/common/CustomSelectInput'
import Select from 'react-select'
import { makeStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'
import { FormGroup, Input, Label, CustomInput, FormFeedback } from 'reactstrap'
import ReactInputMask from 'react-input-mask'
import { validateSelectsData } from '../../../../../utils/ValidateSelectsData'
import { catalogsEnumObj } from '../../../../../utils/catalogsEnum'
import { mapOption } from '../../../../../utils/mapeoCatalogos'
import { useSelector } from 'react-redux'

const OtrosDatos = (props) => {
  const classes = useStyles()
  const [editable, setEditable] = useState(true)
  const [data, setData] = useState({})
  const [loading, setLoading] = useState(true)
  const { register, errors, setValue, selects, validationErrors } = props
  const state = useSelector((store) => {
    return {
      identidad: store.identidad
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
      if (state.identidad.data.datos === undefined) {
        return
      }
      const _item = {
        ...state.identidad.data,
        migracionStatus: mapOption(
          state.identidad.data.datos,
          props.state.selects,
          catalogsEnumObj.ESTATUSMIGRATORIO.id,
          catalogsEnumObj.ESTATUSMIGRATORIO.name
        ),
        lenguaIndigena: mapOption(
          state.identidad.data.datos,
          props.state.selects,
          catalogsEnumObj.LENGUASINDIGENAS.id,
          catalogsEnumObj.LENGUASINDIGENAS.name
        ),
        lenguaMaterna: mapOption(
          state.identidad.data.datos,
          props.state.selects,
          catalogsEnumObj.LENGUAMATERNA.id,
          catalogsEnumObj.LENGUAMATERNA.name
        ),
        estadoCivil: mapOption(
          state.identidad.data.datos,
          props.state.selects,
          catalogsEnumObj.ESTADOCIVIL.id,
          catalogsEnumObj.ESTADOCIVIL.name
        ),
        etnia: mapOption(
          state.identidad.data.datos,
          props.state.selects,
          catalogsEnumObj.ETNIAS.id,
          catalogsEnumObj.ETNIAS.name
        )
      }

      setData(_item)

      setLoading(false)
    } else {
      setLoading(true)
    }
  }, [
    state.identidad.data.id,
    state.identidad.data.fotografiaUrl,
    state.identidad.data.datos
  ])

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

  useEffect(() => {
    props.register({ name: 'migracionStatus' }, { required: 'Requerido' })

    setValue('migracionStatus', data.migracionStatus)

    props.register({ name: 'etnia' })
    setValue('etnia', data.etnia)

    props.register({ name: 'lenguaIndigena' })
    setValue('lenguaIndigena', data?.lenguaIndigena)

    props.register({ name: 'lesco' })
    setValue('lesco', data.lesco)

    props.register({ name: 'lenguaMaterna' }, { required: 'Requerido' })
    setValue('lenguaMaterna', data.lenguaMaterna)

    props.register({ name: 'estadoCivil' }, { required: 'Requerido' })
    setValue('estadoCivil', data.estadoCivil)
  }, [data])

  return (
    <Grid container className={classes.root}>
      <Grid item md={12} xs={12}>
        <Grid container>
          <Grid item md={6} xs={12} className={classes.control}>
            <Grid item md={12} xs={12} className={classes.control} spacing={1}>
              <Paper className={classes.paper}>
                <h4>Otros datos</h4>
                <FormGroup>
                  <Label>*Estado migratorio</Label>
                  <Select
                    name='migracionStatus'
                    components={{ Input: CustomSelectInput }}
                    className={
                      validationErrors.migracionStatus
                        ? 'react-select is-invalid'
                        : 'react-select'
                    }
                    classNamePrefix='react-select'
                    options={props.state.selects.migrationTypes.map((item) => {
                      return { ...item, label: item?.nombre, value: item.id }
                    })}
                    placeholder=''
                    value={data.migracionStatus}
                    onChange={(data) => {
                      handleChange(data, 'migracionStatus')
                      setValue('migracionStatus', data)
                    }}
                    innerRef={props.register({
                      required: 'Requerido'
                    })}
                    isDisabled={false}
                  />
                  <ErrorFeedback>
                    {validationErrors.migracionStatus && 'Requerido'}
                  </ErrorFeedback>
                </FormGroup>

                <FormGroup>
                  <Label> Etnia indígena </Label>
                  <Select
                    components={{ Input: CustomSelectInput }}
                    className='react-select'
                    classNamePrefix='react-select'
                    options={[
                      { label: 'Sin seleccionar', value: null },
                      ...props.state.selects.etnias.map((item) => {
                        return { ...item, label: item?.nombre, value: item.id }
                      })
                    ]}
                    placeholder=''
                    value={data.etnia}
                    onChange={(data) => {
                      handleChange(data, 'etnia')
                      setValue('etnia', data)
                    }}
                    isDisabled={false}
                  />
                </FormGroup>

                <FormGroup>
                  <Label> Lengua indígena </Label>
                  <Select
                    components={{ Input: CustomSelectInput }}
                    className='react-select'
                    classNamePrefix='react-select'
                    options={[
                      { label: 'Sin seleccionar', value: null },
                      ...props.state.selects.lenguasIndigenas.map((item) => {
                        return { ...item, label: item?.nombre, value: item.id }
                      })
                    ]}
                    placeholder=''
                    value={data.lenguaIndigena}
                    onChange={(data) => {
                      handleChange(data, 'lenguaIndigena')
                      setValue('lenguaIndigena', data)
                    }}
                    isDisabled={false}
                  />
                </FormGroup>

                <FormGroup>
                  <Label>Lengua de señas costarricense (LESCO)</Label>
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
                  <Label>*Lengua materna</Label>
                  <Select
                    components={{ Input: CustomSelectInput }}
                    className={
                      validationErrors.lenguaMaterna
                        ? 'react-select is-invalid'
                        : 'react-select'
                    }
                    classNamePrefix='react-select'
                    options={props.state.selects.lenguasMaternas.map((item) => {
                      return { ...item, label: item.nombre, value: item.id }
                    })}
                    placeholder=''
                    value={data.lenguaMaterna}
                    onChange={(data) => {
                      handleChange(data, 'lenguaMaterna')
                      setValue('lenguaMaterna', data)
                    }}
                    innerRef={props.register({
                      required: 'Requerido'
                    })}
                    isDisabled={false}
                  />

                  <ErrorFeedback>
                    {validationErrors.lenguaMaterna && 'Requerido'}
                  </ErrorFeedback>
                </FormGroup>

                <FormGroup>
                  <Label>*Estado civil</Label>
                  <Select
                    components={{ Input: CustomSelectInput }}
                    className={
                      validationErrors.estadoCivil
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
                    innerRef={props.register({
                      required: 'Requerido'
                    })}
                    isDisabled={false}
                  />
                  <ErrorFeedback>
                    {validationErrors.estadoCivil && 'Requerido'}
                  </ErrorFeedback>
                </FormGroup>
              </Paper>
            </Grid>

            <div className='col-md-1' />
          </Grid>
          <Grid item md={6} xs={12} className={classes.control}>
            <Grid item md={12} xs={12} className={classes.control} spacing={1}>
              <Paper className={classes.paper}>
                <h4>Contacto</h4>

                <FormGroup>
                  <Label>*Teléfono principal</Label>
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
                        innerRef={register({
                          required: 'Requerido',
                          pattern: /^[\+]?[-\s\.]?[0-9]{4}[-\s\.]?[0-9]{4}$/im
                        })}
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
                  <Label>Teléfono alternativo</Label>

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
                  <Label>*Correo electrónico principal</Label>
                  <Input
                    type='text'
                    onChange={(data) => {
                      handleChange(data)
                    }}
                    name='email'
                    invalid={errors.email && errors.email.message}
                    value={data.email}
                    innerRef={register({
                      required: 'Requerido',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Correo electronico inválido'
                      }
                    })}
                  />
                  <FormFeedback>
                    {' '}
                    {errors.email && errors.email.message}
                  </FormFeedback>
                </FormGroup>

                <FormGroup>
                  <Label>Correo electrónico alternativo</Label>
                  <Input
                    innerRef={register}
                    onChange={(data) => {
                      handleChange(data)
                    }}
                    type='text'
                    name='emailSecundario'
                    value={data.emailSecundario}
                  />
                </FormGroup>
              </Paper>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  )
}

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    marginBottom: 125,
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

const ErrorFeedback = styled.span`
  position: absolute;
  color: #bd0505;
  right: 0;
  font-weight: bold;
  font-size: 10px;
  bottom: -19px;
`

export default OtrosDatos
