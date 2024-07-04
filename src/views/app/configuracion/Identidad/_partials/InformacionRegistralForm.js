import React, { useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'
import { FormGroup, Label, Input, Form } from 'reactstrap'
import styled from 'styled-components'

const InformacionRegistralForm = (props) => {
  const { save, data, register } = props
  const classes = useStyles()
  useEffect(() => {
    register({ name: 'identificadorRegistral1' })
    register({ name: 'identificadorRegistral2' })
    register({ name: 'nombreRegistral1' })
    register({ name: 'nombreRegistral2' })
  }, [data])

  return (
    <Grid container className={classes.root}>
      <Grid item md={12} xs={12}>
        <Form>
          <Grid container>
            <Grid item md={6} xs={12} className={classes.control}>
              <Grid
                item
                md={12}
                xs={12}
                className={classes.control}
                spacing={1}
              >
                <Paper className={classes.paper}>
                  <h4>Información de madre/padre registral</h4>
                  <FormGroup>
                    <Label>Identificador</Label>
                    <Input
                      type='text'
                      name='identificadorRegistral1'
                      innerRef={register}
                      defaultValue={data.identificadorRegistral1}
                    />
                  </FormGroup>

                  <FormGroup>
                    <Label>Nombre completo</Label>
                    <Input
                      type='text'
                      name='nombreRegistral1'
                      innerRef={register}
                      defaultValue={data.nombreRegistral1}
                    />
                  </FormGroup>
                  <div className='container-center' />
                </Paper>
              </Grid>

              <div className='col-md-1' />
            </Grid>
            <Grid item md={6} xs={12} className={classes.control}>
              <Grid
                item
                md={12}
                xs={12}
                className={classes.control}
                spacing={1}
              >
                <Paper className={classes.paper}>
                  <h4>Información de madre/padre registral</h4>
                  <FormGroup>
                    <Label>Identificador</Label>
                    <Input
                      type='text'
                      name='identificadorRegistral2'
                      innerRef={register}
                      defaultValue={data.identificadorRegistral2}
                    />
                  </FormGroup>

                  <FormGroup>
                    <Label>Nombre completo</Label>
                    <Input
                      type='text'
                      name='nombreRegistral2'
                      innerRef={register}
                      defaultValue={data.nombreRegistral2}
                    />
                  </FormGroup>
                  <div className='container-center' />
                </Paper>
              </Grid>
            </Grid>
          </Grid>
        </Form>
      </Grid>
    </Grid>
  )
}
const FormSpan = styled.span`
  color: red;
`

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1
  },
  control: {
    padding: theme.spacing(2)
  },
  labelCheck: { color: '#145388', fontWeight: 'bold' },
  paper: {
    minHeight: 250,
    padding: 20
  }
}))

export default InformacionRegistralForm
