import React, { useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'
import { FormGroup, Label, Input, Form } from 'reactstrap'
import styled from 'styled-components'
import { useTranslation } from 'react-i18next'

const InformacionRegistralForm = (props) => {
  const { t } = useTranslation()
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
            <Grid item md={6} xs={12} className={classes.control} style={{ paddingLeft: '7px' }}>
              <Paper className={classes.paper}>
                <h4>{t('estudiantes>matricula_estudiantil>matricular_estudiante>encargados>info_padre', 'Información de madre/padre registral')}</h4>
                <FormGroup>
                  <Label>{t('estudiantes>matricula_estudiantil>matricular_estudiante>encargados>info_padres>id', 'Identificador')} </Label>
                  <Input
                    type='text'
                    name='identificadorRegistral1'
                    innerRef={register}
                    disabled
                    defaultValue={data.identificadorRegistral1}
                  />
                </FormGroup>

                <FormGroup>
                  <Label>{t('estudiantes>matricula_estudiantil>matricular_estudiante>encargados>info_padres>nombre', 'Nombre completo')}</Label>
                  <Input
                    type='text'
                    name='nombreRegistral1'
                    innerRef={register}
                    disabled
                    defaultValue={data.nombreRegistral1}
                  />
                </FormGroup>
                <div className='container-center' />
              </Paper>
            </Grid>
            <Grid item md={6} xs={12} className={classes.control} style={{ paddingRight: '7px' }}>
              <Paper className={classes.paper}>
                <h4>{t('estudiantes>matricula_estudiantil>matricular_estudiante>encargados>info_madre', 'Información de madre/padre registral')}</h4>
                <FormGroup>
                  <Label>{t('estudiantes>matricula_estudiantil>matricular_estudiante>encargados>info_padres>id', 'Identificador')}</Label>
                  <Input
                    type='text'
                    name='identificadorRegistral2'
                    innerRef={register}
                    disabled
                    defaultValue={data.identificadorRegistral2}
                  />
                </FormGroup>

                <FormGroup>
                  <Label>{t('estudiantes>matricula_estudiantil>matricular_estudiante>encargados>info_padres>nombre', 'Nombre completo')}</Label>
                  <Input
                    type='text'
                    name='nombreRegistral2'
                    innerRef={register}
                    disabled
                    defaultValue={data.nombreRegistral2}
                  />
                </FormGroup>
                <div className='container-center' />
              </Paper>
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
