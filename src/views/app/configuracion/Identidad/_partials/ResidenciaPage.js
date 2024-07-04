import React, { useState, useEffect } from 'react'
import InformacionResidenciaForm from './InformacionResidenciaForm'
import Paper from '@material-ui/core/Paper'
import { FormGroup, Label, Input } from 'reactstrap'
import { makeStyles } from '@material-ui/core/styles'
import { getProvincias } from '../../../../../redux/provincias/actions'
import { useActions } from '../../../../../hooks/useActions'
import Loader from '../../../../../components/Loader'

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

  const classes = useStyles()

  const showTemporal = (e) => {
    setShowFormTemporal(!showFormTemporal)
  }

  if (loading) return <Loader />
  return (
    <div>
      <InformacionResidenciaForm
        identidad={props.state.identidad.data}
        titulo='Información de residencia'
        validationError={{
          longitud: props.validationErrors.longitud,
          latitud: props.validationErrors.latitud
        }}
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
                showFormTemporal ||
                props.state.identidad.data.direcciones?.length > 1
              }
            />
            Requiere domicilio temporal
          </Label>
        </FormGroup>
      </Paper>

      {(showFormTemporal ||
        props.state.identidad.data.direcciones?.length > 1) && (
          <InformacionResidenciaForm
            identidad={props.state.identidad.data}
            titulo='Información de residencia temporal'
            temporal
            validationError={{
              longitud: props.validationErrors.longitudTemp,
              latitud: props.validationErrors.latitudTemp
            }}
            {...props}
          />
      )}
    </div>
  )
}

export default ResidenciaPage
