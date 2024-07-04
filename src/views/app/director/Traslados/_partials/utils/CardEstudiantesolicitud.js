import React, { useMemo } from 'react'
import {
  Row,
  Col,
  Card,
  CardBody,
  FormGroup,
  Input,
  Label,
  CardTitle,
  Badge,
  Button
} from 'reactstrap'

import { calculateAge } from 'Utils/years'
import { makeStyles } from '@material-ui/core/styles'

import { Avatar } from '@material-ui/core'
import { TableReactImplementation } from 'Components/TableReactImplementation'
import styled from 'styled-components'
import moment from 'moment'
import colors from '../../../../../../assets/js/colors'

const useStyles = makeStyles((theme) => ({
  large: {
    width: theme.spacing(10),
    height: theme.spacing(10),
    margin: theme.spacing(2)
  }
}))
const StyledCardBody = styled(CardBody)`
  width: 100%;
  padding: 0 !important;
  display: flex;
`

const StyledCard = styled(Card)`
  margin-left: 0rem;
  margin-bottom: 2rem;
  margin-top: 1rem;
  margin-right: 1rem;
  overflow: hidden;
  margin-right: 0rem;
  .cardText {
    padding-top: 0.5rem;
  }

  .iconsContainer {
    min-width: 80px;
    margin-right: 1rem;
    color: white;
    padding: 0.5rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background-color: ${colors.primary};
  }
`
const tipotrasladocard =
  {
    className: '',
    titulo: '',
    subtitulo: ''
  }

const CardEstudiante = (props) => {
  const classes = useStyles()
  const {
    identificacion,
    nombre,
    fechaNacimiento,
    nacionalidadEstudiante,
    nivel
  } = props.estudiante

  const estudiantetrasladar = [
    {
      identificacion,
      nombre,
      nacionalidad: nacionalidadEstudiante,
      fechaNacimiento: moment(fechaNacimiento).format(
        'DD/MM/YYYY'
      ),
      edadcumplida: calculateAge(fechaNacimiento),
      nivelactual: nivel
    }

  ]
  const {
    tipoTraslado
  } = props.traslado

  if (tipoTraslado == 1) {
    tipotrasladocard.className = 'fa-arrow-alt-circle-right'
    tipotrasladocard.titulo = 'TRASLADO DESDE MI CENTRO EDUCATIVO'
    tipotrasladocard.subtitulo = 'El estudiante se encuentra en mi centro educativo y requiero trasladarlo hacia otro centro educativo'
  } else if (tipoTraslado == 2) {
    tipotrasladocard.className = 'fa-arrow-alt-circle-left'
    tipotrasladocard.titulo = 'TRASLADO HACIA MI CENTRO EDUCATIVO'
    tipotrasladocard.subtitulo = 'El estudiante se encuentra en otro centro educativo y requiero trasladarlo hacia mi centro educativo'
  } else if (tipoTraslado == 0) {
    tipotrasladocard.className = 'fa-desktop'
    tipotrasladocard.titulo = 'TRASLADO INTERNO'
    tipotrasladocard.subtitulo = 'El estudiante se encuentra en mi centro educativo y requiero trasladarlo entre ofertas,especialidades o niveles'
  } else if (tipoTraslado == 3) {
  // tipotrasladocard.className='fa-arrow-alt-circle-left'
    tipotrasladocard.titulo = 'TRASLADO HACIA CENTRO EDUCATIVO NO IDENTIFICADO'
    tipotrasladocard.subtitulo = 'Permite realizar los movimientos de traslados a un centro educativo no acreditado o fuera del país'
  }

  const DEFAULT_COLUMNS = useMemo(() => {
    return [

      {
        label: 'identificacion',
        column: 'identificacion',
        accessor: 'identificacion',
        Header: 'Identificacion'
      },
      {
        label: '',
        column: 'nombre',
        accessor: 'nombre',
        Header: 'Nombre Completo'
      }, {
        label: '',
        column: 'nacionalidad',
        accessor: 'nacionalidad',
        Header: 'Nacionalidad'
      }, {
        label: 'Fecha de Nacimiento',
        column: 'fechaNacimiento',
        accessor: 'fechaNacimiento',
        Header: 'Fecha de nacimiento'
      }, {
        label: '',
        column: '',
        accessor: 'edadcumplida',
        Header: 'Edad cumplida'

      },
      {
        label: '',
        column: '',
        accessor: 'nivelactual',
        Header: 'Nivel actual'
      }

    ]
  }, [])

  return (
    <div>
      <Row>

        <Col md={8}>

          {props.traslado
            ? (
              <>

                <br />
                <p className='studentInfo'>
                  Fecha de confección:{' '}
                  <span>
                    {moment(props.traslado.fechaHoraSolicitud).format(
                      'DD/MM/YYYY h:mm'
                    )}
                  </span>
                  <br />
                  Fecha de resolución:{' '}
                  <span>
                    {props.traslado.estado
                      ? moment(props.traslado.fechaHoraRevision).format(
                        'DD/MM/YYYY h:mm'
                      )
                      : '--'}
                  </span>
                </p>

                <CardTitle> Tipo de Solicitud</CardTitle>

                <StyledCard>
                  <StyledCardBody>
                    <div className='iconsContainer'>
                      {tipoTraslado == 3 ? <img src='/assets/img/centro-no-identificado.svg' alt='' /> : <i className={`far ${tipotrasladocard.className} icon-3-fs`} />}
                    </div>
                    <div className='cardText'>
                      <h5>{tipotrasladocard.titulo}</h5>
                      <p>{tipotrasladocard.subtitulo}</p>
                    </div>
                  </StyledCardBody>
                </StyledCard>
              </>
              )
            : null}

        </Col>

        <br />
        <br />

        <Col xs={12} md={12}>
          <CardTitle>Estudiante a trasladar</CardTitle>
          <TableReactImplementation
            avoidSearch backendPaginated={false} columns={DEFAULT_COLUMNS} data={
       estudiantetrasladar
        }
            handleGetData={async (

            ) => {

            }}
            orderOptions={[]}
            pageSize={10}
            backendSearch
          />
        </Col>
      </Row>

      <br />
    </div>
  )
}

export default CardEstudiante
