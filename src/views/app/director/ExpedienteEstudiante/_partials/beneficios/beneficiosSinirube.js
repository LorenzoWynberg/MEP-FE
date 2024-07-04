import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'

import { FormGroup, Label, Input } from 'reactstrap'

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1
  },
  control: {
    padding: theme.spacing(2)

  },
  paper: {
    minHeight: 475,
    padding: 20,
    marginLeft: 10
  }
}))

const BeneficiosSinirube = (props) => {
  const classes = useStyles()

  return (
    <Grid container className={classes.root} spacing={2}>
      <Grid item xs={6}>
        <Paper className={classes.paper}>
          <Grid container>
            <Grid item xs={12} className={classes.control}>
              <h4>Información de contacto</h4>
            </Grid>
            <Grid item xs={12} className={classes.control}>
              <FormGroup>
                <Label for='telPricipal'>Teléfono principal</Label>
                <Input type='tel' disabled name='telPricipal' id='telPricipal' placeholder='8251 5168' />
              </FormGroup>
              <FormGroup>
                <Label for='telAlternativo'>Teléfono alternativo</Label>
                <Input type='tel' disabled name='telAlternativo' id='telAlternativo' placeholder='7685 8542' />
              </FormGroup>
              <FormGroup>
                <Label for='emailPrincipal'>Correo electrónico principal</Label>
                <Input type='email' disabled name='emailPrincipal' id='emailPrincipal' placeholder='claujerozymas@gmail.com' />
              </FormGroup>
              <FormGroup>
                <Label for='emailAlternativo'>Correo electrónico alternativo</Label>
                <Input type='email' disabled name='emailAlternativo' id='emailAlternativo' placeholder='luna1828@yahoo.com' />
              </FormGroup>
            </Grid>
          </Grid>
        </Paper>
      </Grid>
    </Grid>
  )
}
export default BeneficiosSinirube
