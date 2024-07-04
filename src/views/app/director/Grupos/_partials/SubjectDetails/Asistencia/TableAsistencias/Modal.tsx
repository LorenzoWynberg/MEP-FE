import React from 'react'
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  Label
} from 'reactstrap'
import { Backup } from '@material-ui/icons'
import styled from 'styled-components'
import moment from 'moment'
import { useActions } from 'Hooks/useActions'
import {
  getAssistanceByIdentidadIdsAndLectionId,
  updateAssistance,
  createRecursosPorAsistencia,
  getAssistanceByIdentidadId
} from 'Redux/Asistencias/actions'
import { useSelector } from 'react-redux'
import getEstadoAsignatura from '../../../../../../../../utils/getEstadoAsignatura'

const ModalDetailJust = ({
  setInputValues,
  inputValues,
  onChange,
  openModal,
  toggleModal,
  selectedAssis,
  selectedStudent,
  subject,
  period,
  filesToSee
}) => {
  const actions = useActions({
    updateAssistance,
    getAssistanceByIdentidadIdsAndLectionId,
    createRecursosPorAsistencia,
    getAssistanceByIdentidadId
  })

  const { membersBySubjectGroup: students } = useSelector((state) => state.grupos)
  return (
    <>
      <Modal
        isOpen={openModal === 'see-assis'}
        toggle={() => toggleModal('see-assis')}
      >
        <ModalHeader>Detalle de justificación</ModalHeader>
        <ModalBody>
          <div>
            <p>Incidencia</p>
            <table>
              <thead>
                <Th style={{ borderRight: '1px solid #fff' }}>Fecha</Th>
                <Th style={{ borderRight: '1px solid #fff' }}>Lección</Th>
                <Th style={{ width: '180px' }}>Tipo de incidencia</Th>
              </thead>
              <tbody>
                <tr>
                  <Td style={{ textAlign: 'center' }}>
                    {moment(selectedAssis?.fecha).format('DD/MM/YYYY')}
                  </Td>
                  <Td style={{ textAlign: 'center' }}>Lección 1</Td>
                  <Td style={{ textAlign: 'center' }}>
                    {selectedAssis?.datosTipoRegistroAsistencia?.nombre}
                  </Td>
                </tr>
              </tbody>
            </table>
            <div>
              <Label className='my-3' htmlFor='justification'>
                Justificación
              </Label>
              <Input
                type='textarea'
                rows={3}
                style={{ resize: 'none' }}
                value={selectedAssis?.observacion || inputValues.observation}
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
                    const res = await actions.createRecursosPorAsistencia(e.target.files[0], [{
                      id: inputValues.files[0]?.RecursosPorAsistenciaId || 0,
                      nombreArchivo: `Recursos de asistencia ${selectedAssis?.id}`,
                      asistenciaEstudianteGrupoAsignatura_id: selectedAssis?.id
                    }])
                    if (!res.error) {
                      setInputValues({
                        ...inputValues,
                        files: [...res.data]
                      })
                    }
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
                {inputValues.files.length > 0 && (
                  <Button
                    color='primary' onClick={() => {
                      window.open(inputValues.files[0]?.url)
                    }}
                  >
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
        </ModalFooter>
      </Modal>

      <Modal isOpen={openModal === 'edit-assis'} toggle={() => toggleModal('')}>
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
                <tr>
                  <Td>{moment(selectedAssis?.fecha).format('DD/MM/YYYY')}</Td>
                  <Td>Lección 1</Td>
                  <Td>{selectedAssis?.datosTipoRegistroAsistencia?.nombre}</Td>
                </tr>
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
                value={inputValues.observation || selectedAssis?.observacion}
                name='observation'
                id='observation'
                onChange={onChange}
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
                    console.log('selectedAssis', selectedAssis)
                    const res = await actions.createRecursosPorAsistencia(e.target.files[0], [{
                      id: inputValues.files[0]?.RecursosPorAsistenciaId || 0,
                      nombreArchivo: `Recursos de asistencia ${selectedAssis?.id}`,
                      asistenciaEstudianteGrupoAsignatura_id: selectedAssis?.id,
                      identidadId: selectedAssis.datosIdentidadEstudiante?.id
                    }])
                    console.log('res', res)
                    if (!res.error) {
                      setInputValues({
                        ...inputValues,
                        files: [...res.data]
                      })
                    }
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
                {inputValues.files.length > 0 && (
                  <Button
                    color='primary' onClick={() => {
                      console.log(inputValues.files)
                      window.open(inputValues.files[0]?.url)
                    }}
                  >
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
            Cancelar
          </Button>
          <Button
            color='primary'
            onClick={async () => {
              // if (inputValues.files.length > 0) {
              //   await actions.createRecursosPorAsistencia(inputValues.files[0], [{
              //     id: inputValues.files[0]?.RecursosPorAsistenciaId || 0,
              //     nombreArchivo: `Recursos de asistencia ${selectedAssis?.id}`,
              //     asistenciaEstudianteGrupoAsignatura_id: selectedAssis?.id,
              //   }])
              // }

              await actions.updateAssistance(
                {
                  id: selectedAssis?.id,
                  observacion: inputValues.observation,
                  tipoRegistroAsistencia_id: selectedAssis?.tipoRegistroAsistencia_id === 3 ? 2 : selectedAssis?.tipoRegistroAsistencia_id === 5 ? 4 : selectedAssis?.tipoRegistroAsistencia_id,
                  estadoasistencia_id: getEstadoAsignatura(selectedAssis?.tipoRegistroAsistencia_id),
                  fechaPeriodoCalendario_id: period.fechaPeriodoCalendarioId,
                  leccionAsignaturaGrupo_id: selectedAssis?.leccionAsignaturaGrupo_id,
                  asignaturaGrupoEstudianteMatriculado_id: selectedAssis.asignaturaGrupoEstudianteMatriculado_id,
                  notificarEncargados: inputValues.notifyManager,
                  fechaAsistencia: selectedAssis?.fecha,
                  estado: true
                },
                selectedStudent?.identidadId
              )
              actions.getAssistanceByIdentidadId([selectedStudent?.identidadesId])
              actions.getAssistanceByIdentidadIdsAndLectionId(
                students.map((item) => item.identidadesId),
                subject?.leccionAsignaturaGrupoId
              )
              toggleModal('')
            }}
          >
            Guardar
          </Button>
        </ModalFooter>
      </Modal>
    </>
  )
}

export default ModalDetailJust

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
