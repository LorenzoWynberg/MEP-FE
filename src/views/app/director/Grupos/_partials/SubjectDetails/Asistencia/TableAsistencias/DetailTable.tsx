import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import colors from 'Assets/js/colors'
import { IoIosAlert } from 'react-icons/io'
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  Label,
  CustomInput
} from 'reactstrap'
import moment from 'moment'
import './DetailAsistencia.css'
import { Backup } from '@material-ui/icons'
import { BsFillEyeFill } from 'react-icons/bs'
import ModalDetailJust from './Modal'
import Tooltip from '@mui/material/Tooltip'
import { useActions } from 'Hooks/useActions'
import {
  createMultipleAssistance,
  createRecursosPorAsistencia,
  getAssistanceByIdentidadIdsAndLectionId,
  getAssistanceByIdentidadId
} from 'Redux/Asistencias/actions'
import { useSelector } from 'react-redux'
import useNotification from 'Hooks/useNotification'

interface Props {
  data: Array<any>
  selectedStudent: any
  toggle: () => void
  subject: any
  selectedPeriod: any
}

const DetailTable = (props: Props) => {
  const { data, selectedStudent, toggle, subject } = props
  const [openModal, setOpenModal] = useState<
    '' | 'see-assis' | 'edit-assis' | 'edit-multiple-assis'
  >('')
  const [selectedAssis, setSelectedAssis] = useState(null)
  const [selectedMultipleAssis, setSelectedMultipleAssis] = useState([])
  const { membersBySubjectGroup } = useSelector((state) => state.grupos)
  const [selectedPeriod, setSelectedPeriod] = useState(null)
  const [snackbar, handleClick] = useNotification()
  const [snackbarContent, setSnackbarContent] = useState({
    msg: '',
    variant: ''
  })

  const initialValues = {
    assisType: 0,
    observation: '',
    notifyManager: true,
    files: [],
    studentId: '',
    filesToSee: []
  }
  const toggleModal = (
    type: '' | 'see-assis' | 'edit-assis' | 'edit-multiple-assis'
  ) => {
    if (type === '') {
      setInputValues(initialValues)
    }
    if (type !== '' && type === openModal) {
      setOpenModal('')
      setSelectedAssis(null)
    } else {
      setOpenModal(type)
    }
  }

  const [inputValues, setInputValues] = useState(initialValues)

  const onChange = (e) => {
    setInputValues({
      ...inputValues,
      [e.target.name]: e.target.value
    })
  }

  const actions = useActions({
    createMultipleAssistance,
    getAssistanceByIdentidadIdsAndLectionId,
    getAssistanceByIdentidadId,
    createRecursosPorAsistencia
  })

  useEffect(() => {
    setSelectedPeriod(props.selectedPeriod)
  }, [props.selectedPeriod])

  useEffect(() => {
    console.log('selectedAssis', selectedAssis)
    if (selectedAssis && openModal) {
      const resources = selectedAssis.recursosPorAsistencia
        ? JSON.parse(selectedAssis.recursosPorAsistencia)
        : []
      setInputValues((prevState) => ({
        ...prevState,
        files:
          resources.length > 0 && resources[0]?.Recursos
            ? resources[0]?.Recursos.map((el) => ({
              ...el,
              RecursosPorAsistenciaId: resources[0]?.RecursosPorAsistenciaId
            }))
            : []
      }))
    }
  }, [selectedAssis, openModal])

  return (
    <>
      {snackbar(snackbarContent.variant, snackbarContent.msg)}
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <span>
          {selectedStudent?.nombreCompleto && selectedStudent?.nombreCompleto}
        </span>
        {data.findIndex(
          (el) =>
            el.tipoRegistroAsistencia_id === 3 ||
            el.tipoRegistroAsistencia_id === 5
        ) !== -1 && (
          <button
            className='btn-just'
            style={{ backgroundColor: `${colors.primary}`, color: '#fff' }}
            onClick={() => toggleModal('edit-multiple-assis')}
          >
            <IoIosAlert style={{ fontSize: '18px' }} /> Justificar
          </button>
        )}
      </div>
      <div style={{ marginTop: '10px' }}>
        <table>
          <thead>
            <tr>
              <Th
                style={{
                  width: '25px',
                  borderRight: '1px solid #fff',
                  height: '3rem'
                }}
              >
                <div style={{ paddingLeft: '6px' }}>
                  <CustomInput
                    type='checkbox'
                    checked={selectedMultipleAssis?.length > 0}
                    onClick={() => {
                      if (selectedMultipleAssis.length > 0) {
                        setSelectedMultipleAssis([])
                      } else {
                        setSelectedMultipleAssis(
                          data.filter(
                            (el) =>
                              el.tipoRegistroAsistencia_id === 3 ||
                              el.tipoRegistroAsistencia_id === 5
                          )
                        )
                      }
                    }}
                  />
                </div>
              </Th>
              <Th
                style={{
                  width: '100px',
                  borderRight: '1px solid #fff',
                  height: '3rem'
                }}
              >
                Fecha
              </Th>
              <Th
                style={{
                  width: '150px',
                  borderRight: '1px solid #fff',
                  height: '3rem'
                }}
              >
                Tipo de incidencia
              </Th>
              <Th
                style={{
                  width: '150px',
                  borderRight: '1px solid #fff',
                  height: '3rem'
                }}
              >
                Docente
              </Th>
              <Th
                style={{
                  width: '80px',
                  borderRight: '1px solid #fff',
                  height: '3rem'
                }}
              >
                Lección
              </Th>
              <Th style={{ width: '100px', height: '3rem' }}>Acciones</Th>
            </tr>
          </thead>
          <tbody>
            {data?.map((item, i) => (
              <tr className={`${i % 2 !== 0 ? 'row-odd' : ''}`} key={i}>
                <Td1>
                  <div style={{ paddingLeft: '6px' }}>
                    <CustomInput
                      type='checkbox'
                      disabled={
                        item.tipoRegistroAsistencia_id !== 3 &&
                        item.tipoRegistroAsistencia_id !== 5
                      }
                      onClick={() => {
                        const index = selectedMultipleAssis.findIndex(
                          (el) => el.id === item.id
                        )

                        if (index !== -1) {
                          const aux = JSON.parse(
                            JSON.stringify(selectedMultipleAssis)
                          )
                          aux.splice(index, 1)
                          setSelectedMultipleAssis(aux)
                        } else {
                          setSelectedMultipleAssis((prevState) => [
                            ...prevState,
                            item
                          ])
                        }
                      }}
                      checked={
                        selectedMultipleAssis.findIndex(
                          (el) => el.id === item.id
                        ) !== -1
                      }
                    />
                  </div>
                </Td1>
                <Td1>{moment(item.fecha).format('DD/MM/yyyy')}</Td1>
                <Td1>{item?.tipoRegistroAsistenciaNombre}</Td1>
                <Td1>
                  {
                    `${item?.datosProfesoresinstitucion?.datosIdentidad?.nombre || ''} ${item?.datosProfesoresinstitucion?.datosIdentidad?.primerApellido || ''} ${item?.datosProfesoresinstitucion?.datosIdentidad?.segundoApellido || ''}`
                  }
                </Td1>
                <Td1>{item?.leccion}</Td1>
                <Td1>
                  <div className='d-flex justify-content-between'>
                    <Tooltip title='Ver'>
                      <button
                        onClick={() => {
                          setSelectedAssis(item)
                          toggleModal('see-assis')
                        }}
                        className='btn-void'
                      >
                        <BsFillEyeFill style={{ fontSize: '23px' }} />
                      </button>
                    </Tooltip>
                    {(item?.tipoRegistroAsistencia_id === 3 ||
                      item?.tipoRegistroAsistencia_id === 5) && (
                        <Tooltip title='Justificar'>
                          <button
                            onClick={() => {
                              toggleModal('edit-assis')
                              setSelectedAssis(item)
                            }}
                            className='btn-void'
                          >
                            <IoIosAlert style={{ fontSize: '23px' }} />
                          </button>
                        </Tooltip>
                    )}
                  </div>
                </Td1>
              </tr>
            ))}
          </tbody>
        </table>
        <ModalDetailJust
          setInputValues={setInputValues}
          period={selectedPeriod}
          inputValues={inputValues}
          onChange={onChange}
          openModal={openModal}
          toggleModal={toggleModal}
          selectedAssis={selectedAssis}
          selectedStudent={selectedStudent}
          subject={subject}
        />
      </div>
      <Modal
        isOpen={openModal === 'edit-multiple-assis'}
        toggle={() => toggleModal('edit-multiple-assis')}
      >
        <ModalHeader>Justificar incidencia</ModalHeader>
        <ModalBody>
          <div>
            <table>
              <thead>
                <Th style={{ borderRight: '1px solid #fff' }}>Fecha</Th>
                <Th style={{ borderRight: '1px solid #fff' }}>Lección</Th>
                <Th style={{ width: '180px' }}>Tipo de incidencia</Th>
              </thead>
              <tbody>
                {selectedMultipleAssis.map((item, i) => (
                  <tr>
                    <Td>{moment(item.fecha).format('DD/MM/YYYY')}</Td>
                    <Td>Lección 1</Td>
                    <Td>{item?.datosTipoRegistroAsistencia?.nombre}</Td>
                  </tr>
                ))}
                {selectedMultipleAssis.length === 0 && (
                  <>
                    <Td />
                    <Td />
                    <Td />
                  </>
                )}
              </tbody>
            </table>
            <div>
              <Label className='my-3' htmlFor='observation'>
                Observación
              </Label>
              <Input
                type='textarea'
                rows={3}
                style={{ resize: 'none' }}
                value={inputValues.observation}
                name='observation'
                id='observation'
                onChange={onChange}
                disabled={openModal === 'see-assis'}
              />
            </div>
            <p className='my-3'>Archivo</p>
            <div className='d-flex'>
              <div className='d-flex align-items-center'>
                <Input
                  color='primary'
                  type='file'
                  id='uploadIncidentFile'
                  name='uploadIncidentFile'
                  onChange={async (e) => {
                    const res = await actions.createRecursosPorAsistencia(
                      inputValues.files[0],
                      selectedMultipleAssis.map((el) => ({
                        id: inputValues.files[0]?.RecursosPorAsistenciaId || 0,
                        nombreArchivo: `Recursos de asistencia ${el?.id}`,
                        asistenciaEstudianteGrupoAsignatura_id: el?.id
                      }))
                    )
                    // if (!res.error) {
                    //   setInputValues({
                    //     ...inputValues,
                    //     files: [{ ...res.data }],
                    //   })
                    // }
                  }}
                  style={{ display: 'none' }}
                />
                <Backup
                  style={{
                    color: '#145388',
                    margin: '0 1rem 1rem 0',
                    fontSize: '2rem'
                  }}
                />
                <Label
                  color='primary'
                  className='btn btn-outline-primary mr-2'
                  outline
                  htmlFor='uploadIncidentFile'
                >
                  Subir un archivo
                </Label>
                {inputValues?.files?.length > 0 && (
                  <Button color='primary'>
                    Ver (
                    {inputValues.files.length} archivo
                    {inputValues.files.length > 1 && 's'}
                    )
                  </Button>
                )}
              </div>
            </div>
          </div>
        </ModalBody>
        <ModalFooter style={{ display: 'flex', justifyContent: 'center' }}>
          <Button outline color='primary' onClick={() => toggleModal('')}>
            Cerrar
          </Button>
          <Button
            onClick={async () => {
              const countAusenciaInjustificada = selectedMultipleAssis.filter(
                (el) => el?.tipoRegistroAsistencia_id === 3
              )?.length
              const countTardiaInjustificada = selectedMultipleAssis.filter(
                (el) => el?.tipoRegistroAsistencia_id === 5
              )?.length
              if (
                countAusenciaInjustificada > 0 &&
                countTardiaInjustificada > 0
              ) {
                setSnackbarContent({
                  variant: 'error',
                  msg: 'Debe seleccionar tipos de incidencias similares para justificar masivamente.'
                })
                handleClick()
                return
              }

              const aux = selectedMultipleAssis.map((item) => ({
                ...item,
                observacion: inputValues.observation,
                fechaAsistencia: item.fecha,
                tipoRegistroAsistencia_id:
                  item?.tipoRegistroAsistencia_id === 3
                    ? 2
                    : item?.tipoRegistroAsistencia_id === 5
                      ? 4
                      : item?.tipoRegistroAsistencia_id
              }))
              // if (inputValues.files.length > 0) {

              //   await actions.createRecursosPorAsistencia(inputValues.files[0], selectedMultipleAssis.map((el) => ({
              //     id: inputValues.files[0]?.RecursosPorAsistenciaId || 0,
              //     nombreArchivo: `Recursos de asistencia ${el?.id}`,
              //     asistenciaEstudianteGrupoAsignatura_id: el?.id,
              //   })))
              // }
              await actions.createMultipleAssistance(aux)
              actions.getAssistanceByIdentidadIdsAndLectionId(
                membersBySubjectGroup.map((item) => item.identidadesId),
                subject?.leccionAsignaturaGrupoId
              )
              actions.getAssistanceByIdentidadId([
                selectedStudent?.identidadesId
              ])
              toggleModal('')
            }}
            color='primary'
          >
            Justificar
          </Button>
        </ModalFooter>
      </Modal>

      {/* <Modal isOpen={modalOpen2} toggle={toggle3}>
        <ModalHeader>Fecha de registro tardío</ModalHeader>
        <ModalBody>
          La justificación de la incidencia se ha realizado fuera de término
        </ModalBody>
        <ModalFooter style={{ display: 'flex', justifyContent: 'center' }}>
          <Button onClick={toggle3} color="primary">
            Entendido
          </Button>
        </ModalFooter>
      </Modal> */}
    </>
  )
}

export default DetailTable

const Th = styled.th`
  text-align: center;
  background: #145388;
  color: #fff;
  height: 2rem;
  font-size: 12px;
  width: 130px;
`
const Td = styled.td`
  text-align: center;
  padding: 2%;
  border: 1px solid #eaeaea;
`
const Td1 = styled.td`
  text-align: center;
  height: 3rem;
  border: 1px solid #eaeaea;
`
