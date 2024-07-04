import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useActions } from 'Hooks/useActions'
import { injectIntl } from 'react-intl'
import { Helmet } from 'react-helmet'
import { Container, Row } from 'reactstrap'

import useNotification from 'Hooks/useNotification'
import Typography from '@material-ui/core/Typography'
import Ofertas from './Ofertas'
import TablaEstudiantes from './TablaEstudiantes'
import TablaInstituciones from './TablaInstituciones'
import Loader from 'Components/Loader'
import SimpleModal from 'Components/Modal/simple'
import ResumenTraslado from './ResumenTraslado'
import InfoContactoDirector from './InfoContactoDirector'
import { useHistory } from 'react-router-dom'
import '../style.scss'

import {
  getStudentSearchPaginated,
  setTrasladoWizardPasos,
  setDataEstudiante,
  clearStudentsData,
  clearStudentData,
  createMultipleTraslado,
  setDataCentro,
  getCentrosSearchPaginated,
  clearCentroData,
  clearCentrosData
} from 'Redux/traslado/actions'
import { getGroupsByIntitution } from 'Redux/grupos/actions'
import { useTranslation } from 'react-i18next'

const TrasladosDesdeCentro = (props) => {
  const [openModal, setOpenModal] = useState(false)
  const [currentInstitution, setCurrentInstitution] = useState(null)
  const [openModalAlert, setOpenModalAlert] = useState(false)
  const [finalizacionModal, setFinalizacionModal] = useState(false)
  const { t } = useTranslation()

  const [snackbarContent, setSnackbarContent] = useState({
    variant: 'error',
    msg: 'hubo un error'
  })
  const [snackbar, handleClick] = useNotification()
  const [motivoSolicitud, setMotivoSolicitud] = useState()
  const [students, setStudents] = useState([])
  const [errorModal, setErrorModal] = useState({})
  const [responseModal, setResponseModal] = useState({})

  const [selectedNivelOferta, setSelectedNivelOferta] = useState<any>(null)
  const [title, setTitle] = useState<string>('- Seleccione el nivel')

  const [loading, setLoading] = useState<boolean>(false)
  const [institucionId, setinstitucionId] = useState<number>(0)
  const history = useHistory()
  const state = useSelector((store: any) => {
    const {
      trasladoData,
      studentsToTranslate,
      studentsFiltered,
      estudianteData,
      nivelData,
      loading,
      entidadMatriculaId,
      motivoSolicitud,
      infoDirectorRevisor,
      centros,
      centroData,
      validadorTraslado
    } = store.traslado

    return {
      trasladoData,
      studentsToTranslate,
      studentsFiltered,
      estudianteData,
      nivelData,
      authUser: store.authUser,
      loading,
      entidadMatriculaId,
      motivoSolicitud,
      infoDirectorRevisor,
      centros,
      centroData,
      validadorTraslado,
      grupos: store.grupos.groups,
      gruposState: store.grupos,
      centerOffers: store.grupos.centerOffersGrouped,
      institution: store.authUser.currentInstitution,
      centerOffersSpecialty: store.grupos.centerOffersSpecialtyGrouped
    }
  })

  const actions = useActions({
    getStudentSearchPaginated,
    setTrasladoWizardPasos,
    setDataEstudiante,
    clearStudentsData,
    clearStudentData,
    createMultipleTraslado,
    setDataCentro,
    getCentrosSearchPaginated,
    clearCentroData,
    clearCentrosData,
    getGroupsByIntitution
  })

  const firstFetch = async () => {
    await actions.clearStudentsData()
    await actions.clearStudentData()
    await actions.clearCentroData()
    await actions.clearCentrosData()
  }

  useEffect(() => {
    fetchOferts()
    firstFetch()
  }, [])

  useEffect(() => {
    fetchOferts()
    firstFetch()
    setinstitucionId(state.institution?.id)
  }, [state.institution])

  useEffect(() => {
    if (institucionId && state.institution?.id != institucionId) {
      setLoading(true)
      setSelectedNivelOferta(null)
    }
  }, [state.institution, institucionId, selectedNivelOferta])

  const fetchOferts = async () => {
    if (state.centerOffers?.length === 0) {
      setLoading(true)
    }
    await actions.getGroupsByIntitution(state.institution?.id)
    setLoading(false)
  }

  const closeModal = () => {
    setCurrentInstitution(null)
    setMotivoSolicitud(null)
    setOpenModal(false)
  }

  const onSave = async () => {
    if (motivoSolicitud) {
      // Guardar, si todo esta bien, mostrar modal informativo si no snack red (Si la validacion falla mostrar modal)
      const dataTraslado = {
        tipoTraslado: 1,
        matriculaId: students.map((e) => e.matriculaId),
        institucionOrigenId: state.authUser.currentInstitution.id,
        institucionDestinoId: currentInstitution.institucionId,
        motivoTraslado: motivoSolicitud
      }
      const response = await actions.createMultipleTraslado(dataTraslado)
      if (!response.error) {
        setSnackbarContent({
          variant: 'success',
          msg: t('estudiantes>traslados>gestion_traslados>solicitar_desde_mi_centro>msg_traslado_aceptado', 'Traslado Aceptado, el traslado ha sido Aceptado con éxito')
        })
        handleClick()
        closeModal()
        setResponseModal(response.data?.director)
        setFinalizacionModal(true)
      } else {
        if (response.message) {
          if (response.message.indexOf('{') > -1) {
            const _mensajeArrary = JSON.parse(response.message)

            const _mensajeTexto = _mensajeArrary.map((item) => {
              return item.mensaje + ' '
            })

            setErrorModal(_mensajeTexto)
            setSnackbarContent({
              variant: 'error',
              msg: _mensajeTexto
            })
            handleClick()
            return
          }
        }

        if (response.error && response?.message == 'no') {
          closeModal()
          setOpenModalAlert(true)
          setErrorModal(response.message)
        } else {
          setSnackbarContent({
            variant: 'error',
            msg: t('estudiantes>traslados>gestion_traslados>solicitar_desde_mi_centro>msg_traslado_error', 'Ha fallado al guardar, inténtalo mas tarde.')
          })
          handleClick()
        }
      }
    } else {
      setSnackbarContent({
        variant: 'warning',
        msg: t('estudiantes>traslados>gestion_traslados>solicitar_desde_mi_centro>msg_agrega_motivo_traslado', 'Agrega el motivo del traslado')
      })
      handleClick()
    }
  }

  const selectedStudents = (students: any[]) => {
    const _students = students.map((student) => {
      return {
        ...student,
        nombreEstudiante: student.nombreCompleto,
        nivel: student.nivelNombre,
        nacionalidad: student?.nacionalidades[0]?.nacionalidad
      }
    })
    setStudents(_students)
    setOpenModal(true)
  }
  const selectedInstitucion = (institution: any) => {
    setCurrentInstitution(institution)
    setOpenModal(true)
  }

  if (state.institution?.id == -1) {
    return (
      <>
        <Helmet>
          <title>Gestión de Traslados</title>
        </Helmet>
        <div className='dashboard-wrapper'>
          <Container>
            <Row>
              <Typography variant='h5' className='mb-3'>
                {t(
                  'estudiantes>traslados>gestion_traslados>seleccionar',
                  'Debe seleccionar un centro educativo en el buscador de centro educativo.'
                )}
              </Typography>
            </Row>
          </Container>
        </div>
      </>
    )
  }

  const columnsExtras = [
    {
      Header: 'Director(a)',
      column: 'directorNombre',
      accessor: 'directorNombre',
      label: ''
    }
  ]
  return (
    <div>
      {snackbar(snackbarContent.variant, snackbarContent.msg)}

      <Container>
        {loading
          ? (
            <Loader />
            )
          : (
            <>
              {!selectedNivelOferta && (
                <Ofertas
                  data={loading ? [] : state.centerOffers}
                  institutionId={institucionId}
                  setTitle={setTitle}
                  setSelectedLvl={setSelectedNivelOferta}
                />
              )}
              {selectedNivelOferta && (
                <TablaEstudiantes
                  selectedLvl={selectedNivelOferta}
                  setSnackbarContent={setSnackbarContent}
                  handleClick={handleClick}
                  onConfirm={selectedStudents}
                />
              )}
            </>
            )}
      </Container>

      <SimpleModal
        title={t('estudiantes>traslados>gestion_traslados>solicitar_desde_mi_centro>estudiantes_matriculados>trasladar>desde_mi_centro', 'Trasladar desde mi centro')}
        openDialog={openModal}
        onClose={() => {
				  closeModal()
        }}
        txtBtn={t('boton>general>confirmar', 'Confirmar')}
        onConfirm={() => onSave()}
        btnSubmit={currentInstitution && motivoSolicitud}
      >
        <div style={{ minWidth: '100%' }}>
          {!currentInstitution && (
            <TablaInstituciones onConfirm={selectedInstitucion} type='desdeMiCentro' />
          )}
          {currentInstitution && (
            <ResumenTraslado
              columnasExtras={columnsExtras}
              students={students}
              institution={currentInstitution}
              setMotivoSolicitud={setMotivoSolicitud}
              motivoSolicitud={motivoSolicitud}
            />
          )}
        </div>
      </SimpleModal>
      <SimpleModal
        title='Solicitud de traslado finalizada'
        openDialog={finalizacionModal}
        onClose={() => {
				  setFinalizacionModal(false)
				  window.history.back()
        }}
        onConfirm={() => {
				  setFinalizacionModal(false)
				  window.history.back()
        }}
        txtBtn='Aceptar'
        btnCancel={false}
      >
        <div style={{ minWidth: '100%' }}>
          <InfoContactoDirector director={responseModal} />
        </div>
      </SimpleModal>
    </div>
  )
}

export default injectIntl(TrasladosDesdeCentro)
