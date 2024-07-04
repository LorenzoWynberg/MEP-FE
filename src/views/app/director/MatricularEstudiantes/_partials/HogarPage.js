import React, { useEffect } from 'react'
import Grid from '@material-ui/core/Grid'
import { makeStyles } from '@material-ui/core/styles'
import { useDispatch, useSelector } from 'react-redux'
import InformacionRegistralForm from './InformacionRegistralForm'
import { useActions } from 'Hooks/useActions'

import { setInformacionRegistral, getInformacionRegistral } from '../../../../../redux/matricula/actions'

import MiembrosHogar from './hogar/MiembrosHogar'

const HogarPage = (props) => {
  const dispatch = useDispatch()
  const classes = useStyles()

  const actions = useActions({
    getInformacionRegistral
  })

  const matricula = useSelector((state) => state.matricula.data)

  const informacionRegistral = useSelector(
    (state) => state.matricula.informacionRegistral
  )

  useEffect(() => {
    const loadData = async () => {
      await actions.getInformacionRegistral(matricula.identificacion)
    }
    loadData()
  },

  [props.state.matricula.data])

  const onSaveRegistral = (data) => {
    dispatch(setInformacionRegistral(data))
  }

  return (
    <Grid container className={classes.root}>
      <Grid item md={12} xs={12}>
        <InformacionRegistralForm
          save={onSaveRegistral}
          register={props.register}
          setValue={props.setValue}
          data={informacionRegistral}
        />

        <MiembrosHogar
          data={matricula}
          toggleNavigationStep={props.toggleNavigationStep}
        />
      </Grid>
    </Grid>
  )
}

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    '& > *': {}
  }
}))

export default HogarPage
