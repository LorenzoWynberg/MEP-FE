import React, { useState, useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
import styled from 'styled-components'
import { useSelector } from 'react-redux'
import { AccordionSummary, AccordionDetails, Accordion } from '@material-ui/core'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import { useTranslation } from 'react-i18next'

const DatosEducativosTable = (props) => {
  const { t } = useTranslation()
  const [data, setData] = useState([])
  const [expanded, setExpanded] = useState(false)
  const classes = useStyles()

  const state = useSelector((store) => {
    return {
      matricula: store.matricula
    }
  })

  useEffect(() => {
    if (state.matricula.datosEducativos) {
      setData(state.matricula.datosEducativos)
    }
  }, [state.matricula.datosEducativos])

  return (
    <Grid container className={classes.root} spacing={2}>
      <Grid item md={12} xs={12}>
        <Accordion expanded={expanded} onChange={() => setExpanded(!expanded)}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls='panel1c-content'
            id='panel1c-header'
          >
            <h4>{t('estudiantes>matricula_estudiantil>matricular_estudiante>datos_educativos>datos_educativos', 'Datos educativos')}</h4>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container className={classes.root}>
              <Grid item md={12} xs={12}>

                <Grid
                  item
                  md={12}
                  xs={12}
                  className={classes.control}
                >
                  <p>{t('estudiantes>matricula_estudiantil>matricular_estudiante>datos_educativos>texto', '*Se muestran únicamente datos de los últimos dos años educativos del estudiante.')} </p>

                  <table className='table simple-table'>

                    <thead>
                      <tr>
                        <td>{t('estudiantes>matricula_estudiantil>matricular_estudiante>datos_educativos>año_educativo', 'Año educativo')}</td>
                        <td>{t('estudiantes>matricula_estudiantil>matricular_estudiante>datos_educativos>centro_educativo', 'Centro educativo')}</td>
                        <td>{t('estudiantes>matricula_estudiantil>matricular_estudiante>datos_educativos>oferta', 'Oferta/Modalidad')}</td>
                        <td>{t('estudiantes>matricula_estudiantil>matricular_estudiante>datos_educativos>nivel', 'Nivel')}</td>
                        <td>{t('estudiantes>matricula_estudiantil>matricular_estudiante>datos_educativos>condicion', 'Condición')}</td>
                        <td>{t('estudiantes>matricula_estudiantil>matricular_estudiante>datos_educativos>condicion_final', 'Condición final')}  </td>
                      </tr>
                    </thead>
                    <tbody>

                      {data.map(dato => {
                        return (
                          <tr>
                            <td><p>{dato.anioEducativo}</p></td>
                            <td><p>{dato.institucion}</p></td>
                            <td><p>{dato.oferta + '/' + dato.modalidad}</p></td>
                            <td><p>{dato.nivel}</p></td>
                            <td><p>{dato.condicion}</p></td>
                            <td><p>{dato.condicionFinal ? dato.condicionFinal : 'No definido'}</p></td>
                          </tr>
                        )
                      })}

                    </tbody>

                  </table>

                </Grid>
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>
      </Grid>
    </Grid>
  )
}
const FormSpan = styled.span`
  color: red;
`

const useStyles = makeStyles((theme) => ({
  root: {
    marginBottom: 100,
    flexGrow: 1,
    padding: '8px'
  },
  control: {
    padding: theme.spacing(1)
  },
  labelCheck: { color: '#145388', fontWeight: 'bold' },
  paper: {
    minHeight: 250,
    padding: 20
  }
}))

export default DatosEducativosTable
