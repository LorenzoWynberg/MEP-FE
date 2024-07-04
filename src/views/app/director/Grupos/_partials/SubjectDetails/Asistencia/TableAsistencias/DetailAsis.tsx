import React, { useEffect, useState } from 'react'
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
import { Backup } from '@material-ui/icons'
import { useSelector } from 'react-redux'
import {
	createAssistance,
	createMultipleAssistance,
	getAssistanceByIdentidadIdsAndLectionId,
	updateAssistance,
	createRecursosPorAsistencia,
	getAssistanceByIdentidadId,
	getAssistanceTypes
} from 'Redux/Asistencias/actions'
import { useActions } from 'Hooks/useActions'
import { getLectionsSubjectGroupBySubjectGroupId } from 'Redux/LeccionAsignaturaGrupo/actions'
import getEstadoAsignatura from '../../../../../../../../utils/getEstadoAsignatura'

import Select from 'react-select'
import CustomSelectInput from 'Components/common/CustomSelectInput'
import axios from 'axios'
import { envVariables } from 'Constants/enviroment'
import { useTranslation } from 'react-i18next'

const DetailAssistence = ({
	toggle,
	modalOpen,
	openModal,
	subject,
	selectedStudent,
	selectedAssis,
	period,
	date,
	days
}) => {
	const { t } = useTranslation()
	const initialValues = {
		assisType: selectedAssis?.datosTipoRegistroAsistencia?.id || 0,
		observation: selectedAssis?.observacion || '',
		notifyManager: selectedAssis?.notificarEncargados || false,
		files: [],
		studentId: selectedAssis?.datosIdentidadEstudiante?.id || 0
	}

	const [inputValues, setInputValues] = useState(initialValues)
	const { membersBySubjectGroup } = useSelector((state) => state.grupos)
	const onChange = (e) => {
		setInputValues({
			...inputValues,
			[e.target.name]: e.target.value
		})
	}

	const { types } = useSelector((state) => state.asistencias)
	const actions = useActions({
		createAssistance,
		createMultipleAssistance,
		updateAssistance,
		getLectionsSubjectGroupBySubjectGroupId,
		getAssistanceByIdentidadIdsAndLectionId,
		getAssistanceTypes,
		createRecursosPorAsistencia,
		getAssistanceByIdentidadId
	})

	useEffect(() => {
		const fetch = async () => {
			await actions.getAssistanceTypes()
		}
		fetch()
		if (types.length > 0) {
			setInputValues({
				...inputValues,
				assisType: types[0].id
			})
		}
	}, [])

	useEffect(() => {
		if (selectedAssis?.id) {
			setInputValues({
				...inputValues,
				assisType: selectedAssis?.datosTipoRegistroAsistencia?.id || 0,
				observation: selectedAssis?.observacion,
				notifyManager: selectedAssis?.notificarEncargados,
				studentId: selectedAssis?.datosIdentidadEstudiante?.id
			})
		}
	}, [selectedAssis])

	return (
		<>
			<Modal isOpen={modalOpen} toggle={toggle}>
				<ModalHeader toggle={toggle}>
					{t(
						'gestion_grupos>asistencia>detalle_asistencia',
						'Detalle de asistencia'
					)}
				</ModalHeader>
				<ModalBody>
					<div>
						<div>
							<p>
								{t(
									'gestion_grupo>asistencia>marcar_como',
									'Marcar como'
								)}
							</p>
							<Select
								placeholder=""
								className="select-rounded react-select"
								classNamePrefix="select-rounded react-select"
								value={{
									id: inputValues.assisType,
									nombre: inputValues.assisType
										? types.find(
												(item) =>
													item.id ==
													inputValues.assisType
										  )?.nombre
										: null
								}}
								options={types
									?.filter(
										(el) => el?.nombre !== 'No Impartido'
									)
									?.filter(
										(el) => el.nombre !== 'No Impartida'
									)
									?.map((type) => ({
										...type,
										label: type.nombre,
										value: type.id
									}))}
								isDisabled={openModal === 'see-assis'}
								noOptionsMessage={() =>
									t('general>no_opt', 'Sin opciones')
								}
								getOptionLabel={(option: any) => option.nombre}
								getOptionValue={(option: any) => option.id}
								components={{ Input: CustomSelectInput }}
								onChange={(e) => {
									setInputValues({
										...inputValues,
										assisType: JSON.parse(e.id)
									})
								}}
							/>
						</div>
						<div>
							<Label className="my-3" htmlFor="observation">
								{t(
									'configuracion>centro_educativo>ver_centro_educativo>ofertas_autorizadas>editar>observacion',
									'Observación'
								)}
							</Label>
							<Input
								type="textarea"
								rows={3}
								style={{ resize: 'none' }}
								value={inputValues.observation}
								name="observation"
								id="observation"
								placeholder={t(
									'gestion_grupo>asistencia>placeholder',
									'Escriba aquí su comentario'
								)}
								onChange={onChange}
								disabled={openModal === 'see-assis'}
							/>
						</div>
						<p className="my-3">
							{t('gestion_grupo>asistencia>archivo', 'Archivo')}
						</p>
						<div className="d-flex">
							<div className="d-flex align-items-center">
								<Input
									color="primary"
									type="file"
									id="uploadIncidentFile"
									name="uploadIncidentFile"
									onChange={async (e) => {
										const data = new FormData()
										data.append('file', e.target.files[0])
										try {
											const res: any = await axios.post(
												`${envVariables.BACKEND_URL}/api/File/resource`,
												data
											)
											console.log('res', res)
											setInputValues({
												...inputValues,
												files: [{ ...res.data }]
											})
										} catch (error) {
											return error
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
									color="primary"
									className="btn btn-outline-primary mr-2"
									outline
									htmlFor="uploadIncidentFile"
								>
									{t(
										'general>subir_archivo", "Subir archivo'
									)}
								</Label>
								{inputValues.files.length > 0 && (
									<Button
										color="primary"
										onClick={() => {
											window.open(
												inputValues.files[0]?.url
											)
										}}
									>
										{t(
											'configuracion>anio_educativo>columna_acciones>hover>ver',
											'Ver'
										)}{' '}
										({inputValues.files.length} archivo
										{inputValues.files.length > 1 && 's'}
										{')'}
									</Button>
								)}
							</div>
						</div>
						{openModal !== 'see-assis' && (
							<div className="my-4">
								<div>
									<CustomInput
										className="custom-checkbox mb-0 d-inline-block"
										type="checkbox"
										id="notifyManager"
										name="notifyManager"
										value={inputValues.notifyManager}
										onClick={(e) =>
											setInputValues({
												...inputValues,
												notifyManager:
													!inputValues.notifyManager
											})
										}
										checked={inputValues.notifyManager}
									/>
									<span>
										{t(
											'gestion_grupo>asistencia>notificar_asistencia',
											'Notificar encargados'
										)}
									</span>
								</div>
							</div>
						)}
					</div>
				</ModalBody>
				<ModalFooter
					style={{ display: 'flex', justifyContent: 'center' }}
				>
					<Button outline color="primary" onClick={toggle}>
						{t(
							'configuracion>mallas_curriculares>indicadores_aprendizaje>boton>previsualizar>boton>cerrar',
							'Cerrar'
						)}
					</Button>
					<Button
						color="primary"
						onClick={async () => {
							if (inputValues.files.length > 0) {
								const res =
									await actions.createRecursosPorAsistencia(
										inputValues.files[0],
										[
											{
												id:
													inputValues.files[0]
														?.RecursosPorAsistenciaId ||
													0,
												nombreArchivo: `Recursos de asistencia ${selectedAssis?.id}`,
												asistenciaEstudianteGrupoAsignatura_id:
													selectedAssis?.id
											}
										],
										'add-assis-resource'
									)
								if (!res.error) {
									setInputValues({
										...inputValues,
										files: [{ ...res.data }]
									})
								}
							}
							if (selectedAssis?.id) {
								await actions.updateAssistance(
									{
										id: selectedAssis?.id,
										observacion: inputValues.observation,
										tipoRegistroAsistencia_id:
											inputValues.assisType,
										leccionAsignaturaGrupo_id:
											selectedAssis?.leccionAsignaturaGrupo_id,
										asignaturaGrupoEstudianteMatriculado_id:
											selectedAssis.asignaturaGrupoEstudianteMatriculado_id,
										notificarEncargados:
											inputValues?.assisType,
										estado: true,
										estadoasistencia_id:
											getEstadoAsignatura(
												inputValues.assisType
											),
										fechaPeriodoCalendario_id:
											period.fechaPeriodoCalendarioId,
										fechaAsistencia: new Date(
											date
										).toISOString()
									},
									selectedStudent?.identidadId
								)
							} else {
								await actions.createAssistance(
									{
										observacion: inputValues.observation,
										tipoRegistroAsistencia_id:
											inputValues.assisType,
										leccionAsignaturaGrupo_id:
											subject?.leccionAsignaturaGrupoId,
										asignaturaGrupoEstudianteMatriculado_id:
											selectedStudent?.Id,
										notificarEncargados:
											inputValues?.notifyManager,
										fechaPeriodoCalendario_id:
											period.fechaPeriodoCalendarioId,
										estadoasistencia_id:
											getEstadoAsignatura(
												inputValues.assisType
											),
										fechaAsistencia: new Date(
											date
										).toISOString()
									},

									selectedStudent?.identidadId
								)
							}
							actions.getAssistanceByIdentidadId([
								selectedStudent?.identidadesId
							])
							actions.getAssistanceByIdentidadIdsAndLectionId(
								membersBySubjectGroup.map(
									(item) => item.identidadesId
								),
								subject?.leccionAsignaturaGrupoId
							)
							toggle()
							setInputValues(initialValues)
						}}
					>
						{t('boton>general>guardar', 'Guardar')}
					</Button>
				</ModalFooter>
			</Modal>
		</>
	)
}

export default DetailAssistence
