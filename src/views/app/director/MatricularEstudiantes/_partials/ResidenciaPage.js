import React, { useState, useEffect } from 'react'
import InformacionResidenciaFormSaber from './InformacionResidenciaFormSaber'
import Paper from '@material-ui/core/Paper'
import { FormGroup, Label, Input } from 'reactstrap'
import { makeStyles } from '@material-ui/core/styles'
import { getProvincias } from '../../../../../redux/provincias/actions'
import { useActions } from '../../../../../hooks/useActions'
import Loader from '../../../../../components/Loader'
import { useTranslation } from 'react-i18next'

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1
  },
  control: {
    padding: theme.spacing(2),
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2)
  },
  labelCheck: { color: '#145388', fontWeight: 'bold' }
}))

const ResidenciaPage = (props) => {
  const { t } = useTranslation()
  const [showFormTemporal, setShowFormTemporal] = useState(false)
  const [loading, setLoading] = useState(true)
  const actions = useActions({ getProvincias })

  useEffect(() => {
    const loadData = async () => {
      await actions.getProvincias()
      setLoading(false)
    }
    loadData()
  }, [])

  useEffect(() => {
    props.register({ name: 'requiereInformacionTemp' })
  }, [showFormTemporal])

  useEffect(() => {
    props.register({ name: 'latitude' }, { required: 'Requerido' })
    props.register({ name: 'longitude' }, { required: 'Requerido' })
    props.register({ name: 'countryId' }, { required: 'Requerido' })
    props.register({ name: 'administrativeAreaLevel1' }, { required: 'Requerido' })
    props.register({ name: 'administrativeAreaLevel2' }, { required: 'Requerido' })
    props.register({ name: 'direction' }, { required: 'Requerido' })

    const temps = [
      'latitudeTemp',
      'longitudeTemp',
      'countryIdTemp',
      'administrativeAreaLevel1Temp',
      'administrativeAreaLevel2Temp',
      'directionTemp',
      'razon'
    ]
    if (showFormTemporal) {
      temps.forEach((el) => {
        props.register({ name: el }, { required: 'Requerido' })
      })
    } else {
      temps.forEach((el) => {
        props.unregister({ name: el }, { required: 'Requerido' })
      })
    }
    props.clearErrors()
  }, [showFormTemporal])

  useEffect(() => {
    if (props.state.matricula.data.direcciones?.length > 1) {
      setShowFormTemporal(true)
    }
  }, [props.state.matricula.data])

  const classes = useStyles()

  const showTemporal = () => {
    setShowFormTemporal(!showFormTemporal)
  }

  if (loading) return <Loader />
  return (
    <div>
      <InformacionResidenciaFormSaber
        matricula={props.state.matricula.data}
        titulo={t('estudiantes>matricula_estudiantil>matricular_estudiante>informacion_residencia', 'Información de residencia')}
        {...props}
      />
  
      <Paper className={classes.control}>
        <FormGroup check>
          <Label check className={classes.labelCheck}>
            <Input
              name='requiereInformacionTemp'
              type='checkbox'
              innerRef={props.register}
              onClick={(e) => {
                showTemporal(e)
              }}
              checked={
                showFormTemporal
              }
              clearErrors={props.clearErrors}
            />
            {t('estudiantes>expediente>contacto>info_residencia_temporal>checkbox', 'Requiere domicilio temporal')}
          </Label>
        </FormGroup>
      </Paper>

      {showFormTemporal &&
        (
          <InformacionResidenciaFormsSaber
            matricula={props.state.matricula.data}
            titulo={t('estudiantes>expediente>contacto>info_residencia_temporal>titulo', 'Información de residencia temporal')}
            temporal
            clearErrors={props.clearErrors}
            {...props}
          />
        )}
    </div>
  )
}

export default ResidenciaPage
