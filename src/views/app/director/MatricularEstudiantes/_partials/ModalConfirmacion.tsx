import React, { useState, useEffect } from 'react'
import 'react-tagsinput/react-tagsinput.css'
import { makeStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
import { FormGroup, Input, Label, Row, Col, Modal, ModalHeader, ModalBody, Button } from 'reactstrap'
import styled from 'styled-components'
import { IconButton, Avatar } from '@material-ui/core'
import colors from '../../../../../assets/js/colors'
import IntlMessages from '../../../../../helpers/IntlMessages'
import { catalogsEnumObj } from '../../../../../utils/catalogsEnum'
import { mapOption } from '../../../../../utils/mapeoCatalogos'

import { useSelector } from 'react-redux'
import moment from 'moment'

const ModalConfirmacion = (props) => {
  const [data, setData] = useState({})
  const { onMatricular, open, toggle } = props
  const [institucion, setInstitucion] = useState({ nombre: '' })

  const classes = useStyles()

  const state = useSelector((store) => {
    return {
      authUser: store.authUser,
      informacionMatricula: store.matricula.informacionMatricula
    }
  })

  useEffect(() => {
    const _data = props.state.data

    let _item = {}
    if (_data.datos) {
      _item = {
        tipoIdentificacion: mapOption(
          _data.datos,
          props.selects,
          catalogsEnumObj.IDENTIFICATION.id,
          catalogsEnumObj.IDENTIFICATION.name
        ),
        nacionalidad: mapOption(
          _data.datos,
          props.selects,
          catalogsEnumObj.NATIONALITIES.id,
          catalogsEnumObj.NATIONALITIES.name
        ),
        sexo: mapOption(
          _data.datos,
          props.selects,
          catalogsEnumObj.SEXO.id,
          catalogsEnumObj.SEXO.name
        ),
        genero: mapOption(
          _data.datos,
          props.selects,
          catalogsEnumObj.GENERO.id,
          catalogsEnumObj.GENERO.name
        )
      }
    }

    const _nivelSeleccionado = props.state.niveles.find(
      (x) => x.entidadMatriculaId === props.state.entidadMatriculaId
    )

    const _identidad = {
      id: props.state.data.id,
      identificacion: props.state.data.identificacion,
      conocidoComo: props.state.data.conocidoComo,
      nombre: props.state.data.nombre,
      nombreCompleto:
				props.state.data.nombre +
				' ' +
				props.state.data.primerApellido +
				' ' +
				props.state.data.segundoApellido,
      primerApellido: props.state.data.primerApellido,
      segundoApellido: props.state.data.segundoApellido,
      fechaNacimiento: props.state.data.fechaNacimiento
        ? moment(props.state.data.fechaNacimiento).format('DD/MM/YYYY')
        : null,
      edad: moment().diff(
        props.state.data.fechaNacimiento,
        'years',
        false
      ),
      tipoIdentificacion: { label: '' },
      nacionalidad: { label: '' },
      sexo: { label: '' },
      genero: { label: '' },
      fotografiaUrl: props.state.data.fotografiaUrl,
      nivel: _nivelSeleccionado,
      ..._item
    }

    setData(_identidad)
  }, [props.state])

  useEffect(() => {
    if (state.authUser.currentInstitution) {
      setInstitucion(state.authUser.currentInstitution)
    }
  }, [state.authUser.currentInstitution])
  return (
    <Modal isOpen={open} size='xl'>
      <ModalHeader
        toggle={() => {
				  toggle(false)
        }}
      >
        Confirmación de matrícula
      </ModalHeader>
      <ModalBody id='modal-confirmar'>
        <Grid container>
          <Grid item xs={3} className={classes.control}>
            <StyledImgFieldsContainer>
              <label htmlFor='profile-pic-id'>
                <Avatar
                  alt={data.id}
                  src={data.fotografiaUrl}
                  className={classes.avatar}
                />
              </label>
            </StyledImgFieldsContainer>
          </Grid>

          <Grid item xs={4} className={classes.control}>
            <div className='row'>
              <div className='col-md-12'>
                <FormGroup>
                  <Label>Tipo de identificación</Label>
                  <Input
                    type='text'
                    name='tipoIdentificacion'
                    value={data.tipoIdentificacion?.label}
                    disabled
                  />
                </FormGroup>
              </div>
            </div>

            <div className='row'>
              <div className='col-md-12'>
                <FormGroup>
                  <Label>Número de identificación</Label>
                  <Input
                    type='text'
                    name='identificacion'
                    value={data.identificacion}
                    disabled
                  />
                </FormGroup>
              </div>
            </div>

            <div className='row'>
              <div className='col-md-7'>
                <FormGroup>
                  <Label>
                    <IntlMessages id='form.birthDate' />
                  </Label>
                  <Input
                    type='text'
                    name='fechaNacimiento'
                    value={data.fechaNacimiento}
                    disabled
                  />
                </FormGroup>
              </div>

              <div className='col-md-5'>
                <FormGroup>
                  <Label>
                    <IntlMessages id='form.age' />
                  </Label>
                  <Input
                    type='text'
                    name='edad'
                    value={data.edad}
                    disabled
                  />
                </FormGroup>
              </div>
            </div>

            <div className='row'>
              <div className='col-md-12'>
                <FormGroup>
                  <Label>
                    <IntlMessages id='catalogo.genderTypes' />
                  </Label>
                  <Input
                    type='text'
                    name='genero'
                    value={data.genero?.label}
                    disabled
                  />
                </FormGroup>
              </div>
            </div>
          </Grid>

          <Grid item xs={5} className={classes.control}>
            <div className='row'>
              <div className='col-md-12'>
                <FormGroup>
                  <Label>
                    <IntlMessages id='form.nationality' />
                  </Label>
                  <Input
                    type='text'
                    name='nacionalidad'
                    value={data.nacionalidad?.label}
                    disabled
                  />
                </FormGroup>
              </div>
            </div>
            <div className='row'>
              <div className='col-md-12'>
                <FormGroup>
                  <Label>Nombre completo</Label>
                  <Input
                    type='text'
                    name='nombreCompleto'
                    value={data.nombreCompleto}
                    disabled
                  />
                </FormGroup>
              </div>
            </div>
            <div className='row'>
              <div className='col-md-12'>
                <FormGroup>
                  <Label>Conocido como</Label>
                  <Input
                    type='text'
                    name='conocidoComo'
                    value={data.conocidoComo}
                    disabled
                  />
                </FormGroup>
              </div>
            </div>
          </Grid>
        </Grid>

        <Row>
          <Grid item xs={8} className={classes.control}>
            <FormGroup>
              <Label>Centro educativo</Label>
              <Input
                type='text'
                name='genero'
                value={
									institucion.codigo +
									'-' +
									institucion.nombre
								}
                disabled
              />
            </FormGroup>
            <FormGroup>
              <Label>Oferta educativa seleccionada</Label>
              <Input
                type='text'
                name='genero'
                value={data.nivel?.modeloOfertaNombre}
                disabled
              />
            </FormGroup>
            <FormGroup>
              <Label>Especialidad</Label>
              <Input
                type='text'
                name='genero'
                value={data.nivel?.especialidadNombre}
                disabled
              />
            </FormGroup>
            <div className='row'>
              <Grid item xs={6} className={classes.control}>
                <FormGroup>
                  <Label>Nivel a matricular</Label>
                  <Input
                    type='text'
                    name='genero'
                    value={data.nivel?.nivelNombre}
                    disabled
                  />
                </FormGroup>
              </Grid>

              <Grid item xs={6} className={classes.control}>
                <FormGroup>
                  <Label>Año educativo</Label>
                  <Input
                    type='text'
                    name='genero'
                    value={data.nivel?.anioEducativo}
                    disabled
                  />
                </FormGroup>
              </Grid>
            </div>
          </Grid>

          <Grid item xs={4} className={classes.control}>
            <p
              className='panel-info-matricula'
              style={{
							  backgroundColor: '#ffffff',
							  color: '#000000'
              }}
            >
              <b>Datos de Matrícula: </b> <br />
              Fecha: {moment().format('DD/MM/YYYY')}
              <br />
              Hora: {moment().format('hh:mm A')}
              <br />
              <b>Datos del curso lectivo: </b> <br />
              Inicio:{' '}
              {state.informacionMatricula.inicioPeriodoLectivo
							  ? moment(
							    state.informacionMatricula
							      .inicioPeriodoLectivo
								  ).format('DD/MM/YYYY')
							  : ''}
              <br />
              Finalización:{' '}
              {state.informacionMatricula.finPeriodoLectivo
							  ? moment(
							    state.informacionMatricula
							      .finPeriodoLectivo
								  ).format('DD/MM/YYYY')
							  : ''}
            </p>
          </Grid>
        </Row>
        <Row>
          <p
            style={{
						  color: '#4a7ba3',
						  fontWeight: 'bold',
						  fontSize: 14,
						  padding: 20
            }}
          >
            *Si la información es correcta de clic en Matricular, de
            lo contrario de clic en Cancelar para que pueda realizar
            las correcciones necesarias.
          </p>
        </Row>
        <Row>
          <CenteredRow xs='12'>
            <Button
              onClick={() => {
							  toggle(false)
              }}
              color='primary'
              outline
            >
              Cancelar
            </Button>
            <Button
              style={{ marginLeft: 20 }}
              color='primary'
              onClick={() => {
							  onMatricular()
              }}
            >
              Matricular
            </Button>
          </CenteredRow>
        </Row>
      </ModalBody>
    </Modal>
  )
}

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    marginBottom: 125,
    '& > *': {
      margin: theme.spacing(1)
    }
  },
  control: {
    padding: theme.spacing(2)
  },
  paper: {
    minHeight: 475,
    padding: 20,
    marginLeft: 10
  },
  input: {
    display: 'none'
  },
  avatar: {
    width: '150px',
    height: '150px',
    boxShadow:
			'0 1px 2px 0 rgba(0, 0, 0, 0.15), 0 1px 3px 1px rgba(0, 0, 0, 0.15) !important',
    marginRight: '0.9rem'
  },
  icon: {
    width: '70px',
    height: '70px',
    color: '#fff'
  }
}))
const StyledImgFieldsContainer = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	width: 100%;

	.fields_div {
		width: 100%;
	}
`
const StyledIconButton = styled(IconButton)`
	cursor: ${(props) => (props.isDisabled ? 'auto' : 'pointer')} !important;
	background: ${(props) => (props.isDisabled ? 'grey' : colors.primary)};
	width: 150px;
	margin-right: 0.9rem;
	height: 150px;
	&:hover {
		background-color: ${(props) => (props.isDisabled ? 'grey' : '#0c3253')};
	}
`

const CenteredRow = styled(Col)`
	display: flex;
	justify-content: center;
	align-items: center;
`
export default ModalConfirmacion
