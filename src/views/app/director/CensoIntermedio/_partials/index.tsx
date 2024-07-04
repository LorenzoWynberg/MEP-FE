import GoBack from 'Components/goBack'
import { useActions } from 'Hooks/useActions'
import useNotification from 'Hooks/useNotification'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useParams,useHistory } from 'react-router-dom'
import { Col, Row } from 'reactstrap'
import {
  getEstudiantesCensoByNivelOferta,
  createCenso,
  createCensoMatriculaAlertas,
  updateCensoMatriculaAlertas,
  updateCenso
} from 'Redux/matricula/actions'
import Loader from 'Components/LoaderContainer'

import styled from 'styled-components'
import HeaderPage from 'Components/common/Header'
import InputWrapper from 'Components/wrappers/InputWrapper'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import TableStudents from './tableStudents'
import RegistrarAlerta from 'Views/app/director/AlertaTemprana/Registrar'
import SimpleModal from 'Components/Modal/simple'
import ConfirmModal from 'Components/Modal/ConfirmModal'
import { uniqBy } from 'lodash'
import { usePrevious } from 'Hooks'

interface IProps {
	dataNivel: any
	goBack: Function
}
type SnackbarConfig = {
	variant: string
	msg: string
}
const RegisterStudentForm: React.FC<IProps> = (props) => {
  const { dataNivel, goBack } = props

  const [estudiantes, setEstudiantes] = useState([])
  const [selectedStudent, setSelectedStudent] = useState(null)
  const [dataSend, setDataSend] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [verEstudianteModal, setVerEstudianteModal] = useState(false)
  const [onlyViewModule, setOnlyViewModule] = useState<boolean>(true)
  const [modalAlertas, setModalAlertas] = useState<any>(false)
  const [alerta, setAlerta] = useState<any>(false)
	const history = useHistory()
  
  const ACTIVE_YEAR = useSelector((store: any) => store.authUser.selectedActiveYear)

	const PREV_ACTIVE_YEAR: any = usePrevious(ACTIVE_YEAR)

	useEffect(() => {
		setOnlyViewModule(!ACTIVE_YEAR.esActivo)
		if (PREV_ACTIVE_YEAR?.id) {
			if (PREV_ACTIVE_YEAR?.id !== ACTIVE_YEAR?.id)
				history.push('/director/censo-intermedio')
		}
	}, [ACTIVE_YEAR])
  const [snackBarContent, setSnackbarContent] =
		React.useState<SnackbarConfig>({
		  variant: '',
		  msg: ''
		})
  const [snackbar, handleClick] = useNotification()

  const { nivelOfertaId } = useParams<any>()

  const state = useSelector((store: any) => {
    return {
      institution: store.authUser.currentInstitution,
      students: store.matricula.estudiantesCenso
    }
  })

  useEffect(() => {
    setEstudiantes(state.students)
  }, [state.students])

  const showNotification = (variant: string, msg: string) => {
    setSnackbarContent({ variant, msg })
    handleClick()
  }

  const actions = useActions({
    getEstudiantesCensoByNivelOferta,
    updateCenso,
    createCenso,
    createCensoMatriculaAlertas,
    updateCensoMatriculaAlertas
  })

  useEffect(() => {
    const fetch = async () => {
      await actions.getEstudiantesCensoByNivelOferta(nivelOfertaId)
    }
    if (nivelOfertaId) {
      fetch()
    }
  }, [nivelOfertaId, ACTIVE_YEAR])

  const firewallRegistrarCenso = async (student, action) => {
    if (action === student.estadoCensoId) {
      return
    }
    setSelectedStudent(student)
    const dta = {
      IdentidadId: student.identidadId,
      MatriculaId: student.matriculaId,
      CensoId: student.censoId,
      EstadoCensoId: action
    }
    setDataSend(dta)
    if (
      (action !== 3 || action !== 4) &&
			(student.estadoCensoId === 3 || student.estadoCensoId === 4)
    ) {
      setModalAlertas(true)
    } else {
      registrarCenso(dta)
    }
  }

  const registrarCenso = async (dataSend) => {
    try {
      if (!dataSend) {
        return
      }
      setLoading(true)
      
      const dta = {
        MatriculaId: dataSend?.MatriculaId,
        IdentidadId: dataSend?.IdentidadId,
        EstadoCensoId: dataSend?.EstadoCensoId,
        CensoId: dataSend?.CensoId
      }
      if (dta.EstadoCensoId === 4 || dta.EstadoCensoId === 3) {
        setLoading(false)
        setAlerta(true)
      } else {
        
        if (dta.CensoId!=null) {
          const response = await actions.updateCenso(dta, dta.CensoId)

          response.error
            ? showNotification('error', 'Oops, Algo ha salido mal')
            : showNotification(
              'success',
              'Se ha actualizado el estado del Censo'
						  )
        } else {
          const response = await actions.createCenso(dta)

          response.error
            ? showNotification('error', 'Oops, Algo ha salido mal')
            : showNotification(
              'success',
              'Se ha guardado el estado del Censo'
						  )
        }
        setDataSend(null)
        setSelectedStudent(null)
      }
      await actions.getEstudiantesCensoByNivelOferta(nivelOfertaId)
      setLoading(false)
      return true
    } catch (e) {
      showNotification('error', 'Oops, Algo ha salido mal')
      setLoading(false)
      return false
    }
  }
  const continuarCensoUpdate = () => {
    setModalAlertas(false)
    registrarCenso(dataSend)
  }

  const saveAlertasCenso = async (alertas) => {
    const dta = {
      MatriculaId: dataSend?.MatriculaId,
      IdentidadId: dataSend?.IdentidadId,
      EstadoCensoId: dataSend?.EstadoCensoId,
      alertas: alertas.map((e) => {
        return {
          e,
          observacion: e.observacion,
          alertaId: e.id,
          anioEducativoId: ACTIVE_YEAR?.id
        }
      })
    }
    let response = { error: false }

    if (dataSend?.CensoId) {
      response = await actions.updateCensoMatriculaAlertas(
        dta,
        dataSend?.CensoId
      )
    } else {
      response = await actions.createCensoMatriculaAlertas(dta)
    }

    response.error
      ? showNotification('error', 'Oops, Algo ha salido mal')
      : showNotification('success', 'Se ha guardado el estado del Censo')
    !response.error &&
			(await actions.getEstudiantesCensoByNivelOferta(nivelOfertaId))

    !response.error && setAlerta(false)
  }

  const goBackAlerta = () => {
    setSelectedStudent(null)
    setDataSend(null)
    setAlerta(false)
  }
  const closeModalAlertas = () => {
    setSelectedStudent(null)
    setDataSend(null)
    setModalAlertas(false)
  }

  const contarCensos = () => {
    let _estudiantes = uniqBy(estudiantes, 'matriculaId')
    _estudiantes = _estudiantes.filter(
      (e) =>
        e.estadoCensoId !== null &&
				(e.estadoId === 1 || e.estadoId === 3)
    )
    return _estudiantes.length
  }
  const contarEStudiantes = () => {
    let _estudiantes = uniqBy(estudiantes, 'matriculaId')
    _estudiantes = _estudiantes.filter(
      (e) => e.estadoId === 1 || e.estadoId === 3
    )
    return _estudiantes.length
  }
  return (
    <>
      {snackbar(snackBarContent.variant, snackBarContent.msg)}

      <SimpleModal
        openDialog={alerta}
        onClose={goBackAlerta}
        title='Registro de alerta temprana'
        subTitle='Permite registrar la alerta temprana a una persona estudiante.'
        actions={false}
      >
        <StyledModalBody>
          <RegistrarAlerta
            dataInstitution={state.institution}
            dataNivel={dataNivel}
            dataStudent={selectedStudent}
            goBack={goBackAlerta}
            onConfirm={saveAlertasCenso}
          />
        </StyledModalBody>
      </SimpleModal>
      <ConfirmModal
        openDialog={modalAlertas}
        onClose={closeModalAlertas}
        title='Alertas asociadas'
        onConfirm={continuarCensoUpdate}
        btnCancel
        txtBtn='Aceptar'
      >
        <Typography variant='body1' className='my-4'>
          Cualquier alerta temprana registrada no será eliminada,
          éstas deben ser atendidas desde el módulo de alerta
          temprana.
        </Typography>
      </ConfirmModal>
      <Row>
        <Col xs={12}>
          <HeaderPage
            title='Registro de condición del estudiante (Censo intermedio)'
            subHeader='Esta pantalla permite realizar el registro de la condición de la persona estudiante en la actualidad.'
            className={{ separator: 'mb-2' }}
          />
        </Col>

        <Col xs={12}>
          <GoBack onClick={() => goBack()} />
        </Col>
        <Col xs={12} md={6}>
          <Card>
            <InputWrapper
              classNames=' backgroundCard backgroundCard-blue'
            >
              <div
                style={{
								  height: '100%',
								  cursor: 'pointer'
                }}
              >
                <Grid xs={12} container>
                  <Grid
                    xs={12}
                    direction='row'
                    className='mt-3'
                    container
                  >
                    <Grid
                    container
                    direction='column'
                    xs={8}
                  >
                    <Grid item xs container>
                    <Grid
                    xs={12}
                    direction='row'
                    container
                  >
                    <Typography
                    gutterBottom
                    variant='subtitle1'
                  >
                    {dataNivel.nivelNombre}
                  </Typography>
                  </Grid>
                    <Grid
                    xs={12}
                    direction='row'
                    container
                  >
                    <Typography variant='body2'>
                    {dataNivel.ofertaNombre}
                  </Typography>
                  </Grid>
                    <Grid
                    xs={12}
                    direction='row'
                    container
                  >
                    <Typography variant='body2'>
                    {
															dataNivel.modalidadNombre
														}
                  </Typography>
                  </Grid>
                    <Grid
                    xs={12}
                    direction='row'
                    container
                  >
                    <Typography variant='body2'>
                    {
															dataNivel.especialidadNombre
														}
                  </Typography>
                  </Grid>
                    <Grid
                    xs={12}
                    direction='row'
                    container
                  >
                    <Typography variant='body2'>
                    {
															dataNivel.servicioNombre
														}
                  </Typography>
                  </Grid>
                  </Grid>
                  </Grid>
                    <Grid item xs={4} container>
                    <Grid
                    xs={12}
                    direction='row'
                    container
                  >
                    <Typography variant='body2'>
                    {contarEStudiantes()}{' '}
                    Estudiantes
												</Typography>
                  </Grid>
                    <Grid
                    xs={12}
                    direction='row'
                    container
                  >
                    <Typography variant='body2'>
                    {contarCensos()} Estudiantes
                    Censados
												</Typography>
                  </Grid>
                    <Grid
                    xs={12}
                    direction='row'
                    container
                  >
                    <Typography variant='body2'>
                    {contarEStudiantes() -
														contarCensos()}{' '}
                    Estudiantes Pendientes
												</Typography>
                  </Grid>

                    <Grid
                    xs={12}
                    direction='row'
                    container
                  >
                    <Typography
                    variant='body2'
                    className='mr-1'
                  >
                    <i className='simple-icon-user-female' />{' '}
                    {dataNivel.mujeres}
                  </Typography>
                    <Typography variant='body2'>
                    <i className='simple-icon-user' />{' '}
                    {dataNivel.hombres}
                  </Typography>{' '}
                  </Grid>
                  </Grid>
                  </Grid>
                </Grid>
              </div>
            </InputWrapper>
          </Card>
        </Col>
        <TableStudents
          onConfirm={firewallRegistrarCenso}
          data={estudiantes}
          hasEditAccess
          closeContextualMenu={verEstudianteModal}
        />
      </Row>
      {loading && (
        <Row>
          <Loader />
        </Row>
      )}
    </>
  )
}

const Card = styled.div``
const StyledModalBody = styled.div``

export default RegisterStudentForm
