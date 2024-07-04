import React, { useEffect, useState } from 'react'
import {
	Card,
	CardBody,
	Col,
	Button,
	InputGroupAddon,
	Dropdown,
	DropdownToggle,
	DropdownMenu,
	DropdownItem,
	Modal,
	ModalHeader,
	ModalBody,
	Label,
	Input,
	CustomInput
} from 'reactstrap'
import styled from 'styled-components'
import DatePicker, { registerLocale } from 'react-datepicker'
import { Backup } from '@material-ui/icons'
import es from 'date-fns/locale/es'
import PeriodTable from './StudentConduct/PeriodTable'
import IncidentTable from './StudentConduct/IncidentsTable'
import PeriodsTable from './StudentConduct/PeriodsTable'
import search from 'Utils/search'
import { useActions } from 'Hooks/useActions'
import { getBase64Promise } from 'Utils/getBase64'
import { showProgress, hideProgress } from 'Utils/progress'
import AddIcon from '@material-ui/icons/Add'
import RemoveIcon from '@material-ui/icons/Remove'
import colors from 'Assets/js/colors'
import swal from 'sweetalert'

import 'react-datepicker/dist/react-datepicker.css'
import { createIncidencia, updateIncidencia } from 'Redux/grupos/actions'
import { getPeriodoBloques } from 'Redux/mallasCurriculares/actions'
import { GetByIdAnio } from 'Redux/periodos/actions'
import { useSelector } from 'react-redux'
import ModalHistorial from './Asistencia/Historial'
import moment from 'moment'
import {
	getFalta,
	getTipoFalta
} from '../../../../../../redux/NormativaInterna/actions'
import Select from 'react-select'
import { useTranslation } from 'react-i18next'

registerLocale('es', es)

const StudentsConduct = ({
	tiposIncidencia,
	groupIncidencias,
	getIncidentsFunction,
	director,
	getStudents,
	activeLvl,
	currentInstitution,
	students
}) => {
	const { t } = useTranslation()
	const state = useSelector((store: any) => {
		return {
			tiposFalta: store.faltas.tiposFalta,
			faltas: store.faltas.faltas,
			bloquesAsignables: store.grupos.bloques,
			institution: store.authUser.currentInstitution,
			...store.authUser,
			...store.periodos
		}
	})

	const [openModal, setOpenModal] = useState<
		| ''
		| 'add-incident'
		| 'edit-incident'
		| 'see-incident'
		| 'dropdown-period'
	>('')
	const [secondData, setSecondData] = useState<Array<any>>([])
	const [selectedStudent, setSelectedStudent] = useState(null)
	const [selectedIncident, setSelectedIncident] = useState(null)
	const [items, setItems] = useState<Array<any>>(students || [])
	const [incidentesSeleccionables, setIncidentesSeleccionables] = useState<
		any[]
	>([])
	const [faltasInstitucionales, setFaltasInstitucionales] = useState<any[]>(
		[]
	)
	const [groupIncidentesStudents, setGroupIncidentesStudents] = useState<
		Array<any>
	>([])
	const [searchValue, setSearchValue] = useState('')
	const actions = useActions({
		createIncidencia,
		updateIncidencia,
		getPeriodoBloques,
		GetByIdAnio,
		getFalta,
		getTipoFalta
	})

	const initialValues = {
		date: new Date(),
		tipoIncumplimiento: {},
		tipoIncumplimientoId: 0,
		breachType: 0,
		description: '',
		puntajeRatificado: 0,
		notifyManager: true,
		notifyProfessor: true,
		filesToUpload: [],
		files: [],
		tipoIncumplimientoIdNormativa: null,
		studentId: ''
	}

	const [inputValues, setInputValues] = useState(initialValues)

	const onChange = (e) => {
		if (Array.isArray(e)) {
			const _iV = { ...inputValues }
			e.forEach((el) => {
				_iV[el.nombre] = el.value
			})
			return setInputValues(_iV)
		}
		setInputValues({
			...inputValues,
			[e.target.name]: e.target.value
		})
	}

	const [selectedPeriod, setSelectedPeriod] = useState({})

	useEffect(() => {
		if (getStudents) {
			getStudents()
		}
		actions.getFalta(state.institution.id)
		actions.getTipoFalta()
		actions.GetByIdAnio(state.selectedActiveYear.id)
		getIncidentsFunction()
	}, [])

	useEffect(() => {
		actions.getPeriodoBloques(selectedPeriod.id || selectedPeriod.periodoId)
	}, [selectedPeriod])

	useEffect(() => {
		setSelectedPeriod(state.bloquesAsignables[0] || {})
	}, [state.bloquesAsignables])

	useEffect(() => {
		if (!selectedStudent?.identidadId && !selectedStudent?.identidadesId) {
			setSecondData([])
		} else {
			setSecondData(
				groupIncidencias.filter((incident) => {
					return (
						(incident?.identidadesId ===
							selectedStudent?.identidadId ||
							incident?.identidadesId ===
								selectedStudent?.identidadesId) &&
						incident.sB_FechaPeriodoCalendario_id ===
							selectedPeriod.fechaPeriodoCalendarioId
					)
				})
			)
		}
		setGroupIncidentesStudents(
			groupIncidencias.map((el) => {
				const identidad = items.find(
					(item) => item.identidadesId == el.identidadesId
				)
				return {
					...el,
					action: [...tiposIncidencia, ...state.faltas].find(
						(j) => j.id == el.sB_TipoIncumplimiento_id
					).nombre,
					fechaRatificacion:
						moment(el.fechaRatificacion).format('DD/MM/yyyy') ||
						'No ratificado',
					fechaInsercion: moment(el.fechaInsercion).format(
						'DD/MM/yyyy hh:mm:ss A'
					),
					studentName: identidad ? identidad.nombreCompleto : '',
					horaRatificacion: el.fechaRatificacion
						? moment(el.fechaRatificacion).format('hh:mm:ss a')
						: 'No ratificado'
				}
			})
		)
	}, [selectedStudent, groupIncidencias, selectedPeriod, students])

	useEffect(() => {
		setItems(students.map(studentsMapper))
	}, [students, secondData, groupIncidencias])

	useEffect(() => {
		if (selectedIncident) {
			const tipoFalta = state.tiposFalta.find(
				(el) => el.nivel == selectedIncident.nivel
			)
			const filesMapper = (i) => {
				return i.R.map((recurso) => {
					return {
						name: recurso.titulo,
						url: recurso.url
					}
				})
			}

			setInputValues({
				...inputValues,
				description: selectedIncident.descripcion,
				date: new Date(selectedIncident.fechaInsercion),
				tipoFalta,
				tipoIncumplimientoId: selectedIncident.sB_TipoIncumplimiento_id,
				tipoIncumplimientoIdNormativaId:
					selectedIncident.requiereNormativa
						? selectedIncident.sB_TipoIncumplimiento_id
						: null,
				notifyManager: selectedIncident.notificarPadre,
				notifyProfessor: selectedIncident.notificarGuia,
				/* files: selectedIncident.recursos
          ? JSON.parse(selectedIncident.recursos)
          : [], */
				files: selectedIncident.recursos
					? JSON.parse(selectedIncident.recursos).flatMap(filesMapper)
					: [],
				studentId: selectedIncident.asignaturaGrupoEstudianteId,
				puntajeRatificado: selectedIncident.esRatificado
					? selectedIncident.puntajeRatificado
					: tipoFalta.rangoInferior,
				razonRatificacion: selectedIncident.razonRatificacion
					? selectedIncident.razonRatificacion.split('//')[0]
					: null,
				tipoFaltaId: state.tiposFalta.find(
					(el) => el.nivel === selectedIncident.nivel
				)?.id,
				estadoRatificacion: selectedIncident.razonRatificacion
					? selectedIncident.razonRatificacion.split('//')[1]
					: null,
				esRatificado: selectedIncident.esRatificado,
				sB_FechaPeriodoCalendario_id:
					selectedIncident.sB_FechaPeriodoCalendario_id,
				requiereNormativa: selectedIncident.requiereNormativa
			})
		}
	}, [selectedIncident])

	useEffect(() => {
		setIncidentesSeleccionables(
			tiposIncidencia.filter(
				(item) => item.sB_TipoFalta_id == inputValues.tipoFaltaId
			)
		)
		setFaltasInstitucionales(
			state.faltas.filter(
				(item) => item.sB_TipoFalta_id == inputValues.tipoFaltaId
			)
		)
	}, [inputValues.tipoFaltaId])

	const studentsMapper = (el) => {
		const Incidencias =
			secondData.length > 0 ? secondData : groupIncidencias
		const periodsObject = {}
		Incidencias.forEach((item) => {
			if (
				item?.identidadesId === el?.identidadesId ||
				item?.identidadesId === el?.identidadId
			) {
				if (periodsObject[item.sB_FechaPeriodoCalendario_id]) {
					periodsObject[item.sB_FechaPeriodoCalendario_id] = [
						...periodsObject[item.sB_FechaPeriodoCalendario_id],
						item
					]
				} else {
					periodsObject[item.sB_FechaPeriodoCalendario_id] = [item]
				}
			}
		})
		return {
			...el,
			rating: groupIncidencias.filter(
				(incident) =>
					(incident?.identidadesId === el?.identidadId ||
						incident?.identidadesId === el?.identidadesId) &&
					incident.sB_FechaPeriodoCalendario_id ===
						selectedPeriod.fechaPeriodoCalendarioId
			),
			ratings: periodsObject
		}
	}

	const fouls = [
		{
			id: 0,
			type: 'Muy leve',
			point: 5
		},
		{
			id: 1,
			type: 'Leve',
			point: 10
		},
		{
			id: 2,
			type: 'Grave',
			point: 10
		}
	]

	const modals = {
		'add-incident': {
			title: t(
				'gestion_grupo>conducta>agregar_incidencia',
				'Agregar incidencia'
			)
		},
		'edit-incident': {
			title: t(
				'gestion_grupo>modal>titulo>editar_incidencia',
				'Editar incidencia'
			)
		},
		'see-incident': {
			title: t(
				'gestion_grupo>modal>titulo>ver_incidencia',
				'Ver incidencia'
			)
		}
	}

	const onSearchKey = async (e) => {
		const { value } = e.target
		setSearchValue(value)
		if (
			((e.charCode === 13 || e.keyCode === 13 || e.key === 'Enter') &&
				value.length >= 3) ||
			value.length === 0
		) {
			setItems(
				search(value)
					.in(students, ['nombreCompleto'])
					.map(studentsMapper)
			)
		}
	}

	return (
		<Col>
			<CustomModal
				isOpen={openModal !== 'dropdown-period' && openModal.length > 0}
				toggle={() => {
					setInputValues(initialValues)
					setSelectedIncident(null)
					setOpenModal('')
				}}
				size="lg"
				style={{ borderRadius: '10px' }}
				centered="static"
			>
				<ModalHeader>{modals[openModal]?.title}</ModalHeader>
				<ModalBody>
					<h5>
						{t(
							'estudiantes>buscador_per>info_cuenta>historial_cambios>colum_fecha',
							'Fecha'
						)}
					</h5>
					<div style={{ width: '10rem' }}>
						<DatePickerStyled
							selected={inputValues.date}
							onChange={(date) =>
								onChange({
									target: { value: date, name: 'date' }
								})
							}
							locale="es"
							dateFormat="dd/MM/yyyy"
							className="demo-icon iconsminds-calendar-1"
							disabled={openModal === 'see-incident'}
						/>
					</div>
					<Label className="my-2" htmlFor="breachType">
						{t(
							'expediente_ce>normativa_interna>agregar_falta>tipo_falta',
							'Tipo de falta'
						)}
					</Label>

					<Select
						className="react-select"
						classNamePrefix="react-select"
						placeholder=""
						value={{
							id: inputValues.tipoFaltaId,
							nivel: inputValues?.tipoFaltaId
								? state.tiposFalta.find(
										(item) =>
											item.id == inputValues.tipoFaltaId
								  )?.nivel
								: null
						}}
						options={state.tiposFalta
							.filter(
								(item) =>
									!Object.keys(inputValues)
										.map((el) => parseInt(el))
										.includes(item.id)
							)
							.map((x) => {
								x.nivel = x.nivel
								return x
							})}
						noOptionsMessage={() =>
							t('general>no_opt', 'Sin opciones')
						}
						getOptionLabel={(option: any) => option.nivel}
						getOptionValue={(option: any) => option.id}
						onChange={(e) => {
							onChange([
								{
									nombre: 'tipoFaltaId',
									value: e.id
								},
								{
									nombre: 'tipoFalta',
									value: state.tiposFalta.find(
										(el) => el.id == e.id
									)
								},
								{
									nombre: 'isNormativaInterna',
									value: null
								},
								{ nombre: 'tipoIncumplimiento', value: null },
								{ nombre: 'tipoIncumplimientoId', value: null },
								{
									nombre: 'tipoIncumplimientoIdNormativa',
									value: null
								}
							])
						}}
						isDisabled={openModal === 'see-incident'}
					/>
					<Label className="my-3" htmlFor="foulType">
						(De {inputValues.tipoFalta?.rangoInferior} a{' '}
						{inputValues.tipoFalta?.rangoSuperior}{' '}
						{t('expediente_ce>normativa_interna>puntos', 'puntos')})
					</Label>
					<br />
					<Label className="my-2" htmlFor="breachType">
						{t(
							'gestion_grupos>conducta>tipo_incumplimiento',
							'Tipo de incumplimiento'
						)}
					</Label>

					<Select
						className="react-select"
						classNamePrefix="react-select"
						placeholder=""
						value={{
							id: inputValues.tipoIncumplimientoId,
							nombre: inputValues?.tipoIncumplimientoId
								? incidentesSeleccionables.find(
										(item) =>
											item.id ==
											inputValues.tipoIncumplimientoId
								  )?.nombre
								: null
						}}
						options={incidentesSeleccionables
							.filter((item) => !item.sB_Instituciones_id)
							.map((item, i) => ({
								...item,
								label: item.nombre,
								value: item.id
							}))}
						noOptionsMessage={() =>
							t('general>no_opt', 'Sin opciones')
						}
						getOptionLabel={(option: any) => option.nombre}
						getOptionValue={(option: any) => option.id}
						onChange={(e) => {
							onChange([
								{
									nombre: 'tipoIncumplimiento',
									value: tiposIncidencia.find(
										(el) => el.id == e.id
									)
								},
								{
									nombre: 'tipoIncumplimientoId',
									value: e.value
								},
								{
									nombre: 'isNormativaInterna',
									value: e.isNormativaInterna
								},
								{
									nombre: 'tipoIncumplimientoIdNormativa',
									value: null
								}
							])
						}}
						isDisabled={openModal === 'see-incident'}
					/>
					{Boolean(inputValues.isNormativaInterna) && (
						<>
							<Label>
								{t(
									'expediente_ce>nav>norvativa',
									'Normativa Interna'
								)}
							</Label>
							<Select
								className="react-select"
								classNamePrefix="react-select"
								placeholder=""
								value={{
									id: inputValues.tipoIncumplimientoIdNormativaId,
									nombre: inputValues?.tipoIncumplimientoIdNormativaId
										? faltasInstitucionales.find(
												(item) =>
													item.id ==
													inputValues.tipoIncumplimientoIdNormativaId
										  )?.nombre
										: null
								}}
								options={faltasInstitucionales.map(
									(item, i) => ({
										...item,
										label: item.nombre,
										value: item.id
									})
								)}
								noOptionsMessage={() =>
									t('general>no_opt', 'Sin opciones')
								}
								getOptionLabel={(option: any) => option.nombre}
								getOptionValue={(option: any) => option.id}
								onChange={(e) => {
									onChange([
										{
											nombre: 'tipoIncumplimientoIdNormativa',
											value: tiposIncidencia.find(
												(el) => el.id == e.id
											)
										},
										{
											nombre: 'tipoIncumplimientoIdNormativaId',
											value: e.id
										}
									])
								}}
								isDisabled={openModal === 'see-incident'}
							/>
						</>
					)}
					<Label className="my-3" htmlFor="breachType">
						{t(
							'gestion_grupo>conducta>descripcion_falta',
							'Descripción de la falta'
						)}
					</Label>
					<Input
						type="textarea"
						rows={3}
						style={{ resize: 'none' }}
						value={inputValues.description}
						name="description"
						id="description"
						onChange={onChange}
						disabled={openModal === 'see-incident'}
					/>

					<p className="my-3">
						{t(
							'gestion_grupos>conducta>adjunto-evidencia',
							'Adjuntos/evidencias'
						)}
					</p>
					<div className="d-flex">
						<div className="d-flex align-items-center">
							<Input
								color="primary"
								type="file"
								id="uploadIncidentFile"
								name="uploadIncidentFile"
								onChange={(e) => {
									if (e.target.files.length == 0) return
									const getUrlFromFile = (file) => {
										const fr = new FileReader()
										fr.readAsDataURL(file)

										const blob = new Blob([file], {
											type: file.type
										})

										const objectURL =
											window.URL.createObjectURL(blob)
										return objectURL
									}

									const newInputFile = e.target.files[0]
									const fileUrl = getUrlFromFile(newInputFile)
									const newFiles = [
										...inputValues.files,
										{
											name: newInputFile.name,
											url: fileUrl,
											raw: newInputFile
										}
									]

									let newState = null
									if (openModal === 'edit-incident') {
										const newFilesToUpload = [
											...inputValues.filesToUpload,
											e.target.files[0]
										]
										newState = {
											...inputValues,
											files: newFiles,
											filesToUpload: newFilesToUpload
										}
									} else {
										newState = {
											...inputValues,
											files: newFiles
										}
									}

									setInputValues(newState)

									/* if (openModal === 'edit-incident') {
                    setInputValues({
                      ...inputValues,
                      filesToUpload: [
                        ...inputValues.filesToUpload,
                        e.target.files[0],
                      ],
                    })
                  } else {
                    setInputValues({
                      ...inputValues,
                      files: [...inputValues.files, e.target.files[0]],
                    })
                  } */
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
							{openModal !== 'see-incident' && (
								<Label
									color="primary"
									className="btn btn-outline-primary mr-2"
									outline
									htmlFor="uploadIncidentFile"
								>
									{t(
										'general>subir_archivo',
										'Subir archivo'
									)}
								</Label>
							)}
							{inputValues?.files?.map((el, i) => {
								return (
									<Button
										href={el.url}
										color="primary"
										target="_blank"
									>
										{el.name}
									</Button>
								)
								/* if (el.R) {
                    return (
                      <Button
                        href={el?.R[i]?.url}
                        target="_blank"
                        color="primary"
                      >
                        Ver {`(`}
                        {inputValues?.files.length} archivo
                        {inputValues?.files.length > 1 && 's'}
                        {`)`}
                      </Button>
                    )
                  } */
							})}
						</div>
					</div>
					{openModal !== 'see-incident' && (
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
									disabled={openModal === 'see-incident'}
								/>
								<span>
									{t(
										'gestion_grupos>conducta>notificar_encargado',
										'Notificar encargado/representante legal'
									)}
								</span>
							</div>
							<div className="my-2">
								<CustomInput
									className="custom-checkbox mb-0 d-inline-block"
									type="checkbox"
									id="notifyProfessor"
									name="notifyProfessor"
									onClick={(e) =>
										setInputValues({
											...inputValues,
											notifyProfessor:
												!inputValues.notifyProfessor
										})
									}
									value={inputValues.notifyProfessor}
									checked={inputValues.notifyProfessor}
									disabled={openModal === 'see-incident'}
								/>
								<span>
									{t(
										'gestion_grupo>conducta>notificar_al_docente',
										'Notificar al docente guía y/o al orientador'
									)}
								</span>
							</div>
						</div>
					)}
					{openModal === 'see-incident' && (
						<>
							<div
								className="d-flex justify-content-between my-3"
								style={{ width: '70%' }}
							>
								<div className="">
									<p>
										{t(
											'gestion_grupo>coducta>puntaje_aplicado',
											'Puntaje aplicado'
										)}
									</p>
									<div>
										{selectedIncident?.puntajeRatificado}
									</div>
								</div>
								<div className="">
									<p>
										{t(
											'gestion_grupo>conducta>aplicado_por',
											'Aplicado por'
										)}
									</p>
									<div>{selectedIncident?.docente}</div>
								</div>
							</div>

							<Label htmlFor="comments">
								{t(
									'gestion_grupo>conducta>comentario_ratificacion',
									'Comentario de ratificación'
								)}
							</Label>
							<Input
								type="textarea"
								rows={3}
								style={{ resize: 'none' }}
								value={inputValues.razonRatificacion}
								name="comments"
								id="comment"
								disabled={openModal === 'see-incident'}
							/>
						</>
					)}
					{openModal === 'edit-incident' && (
						<>
							<Label htmlFor="comments">
								{t(
									'buscador_ce>buscador>columna_estado',
									'Estado'
								)}
							</Label>
							<Input
								type="select"
								rows={3}
								style={{ resize: 'none' }}
								value={inputValues.estadoRatificacion}
								onChange={(e) => {
									if (e.target.value != 'Desestimada') {
										onChange(e)
									} else {
										onChange([
											{
												nombre: 'estadoRatificacion',
												value: e.target.value
											},
											{
												nombre: 'puntajeRatificado',
												value: 0
											}
										])
									}
								}}
								name="estadoRatificacion"
								id="estadoRatificacion"
							>
								<option
									value={null}
									style={{ display: 'none' }}
								/>
								{[
									'Ratificada',
									'Desestimada',
									'Por ratificar'
								].map((el) => {
									return <option value={el}>{el}</option>
								})}
							</Input>
							<Label htmlFor="comments">
								{t(
									'gestion_grupo>coducta>puntaje_aplicado',
									'Puntaje aplicado'
								)}
							</Label>
							<div
								className="d-flex justify-content-between my-3"
								style={{ width: '70%' }}
							>
								<div
									style={{
										display: 'flex',
										alignItems: 'center'
									}}
								>
									<span>
										<RemoveIcon
											style={{
												color: colors.primary,
												cursor: 'pointer'
											}}
											onClick={() => {
												if (
													inputValues.estadoRatificacion !=
													'Desestimada'
												) {
													if (
														selectedIncident.rangoInferior <=
														(inputValues.puntajeRatificado
															? parseInt(
																	inputValues.puntajeRatificado
															  )
															: 0) -
															1
													) {
														setInputValues({
															...inputValues,
															puntajeRatificado:
																(inputValues.puntajeRatificado
																	? parseInt(
																			inputValues.puntajeRatificado
																	  )
																	: 0) - 1
														})
													}
												}
											}}
										/>
									</span>
									<span>
										{inputValues?.puntajeRatificado || 0}
									</span>
									<span>
										<AddIcon
											style={{
												color: colors.primary,
												cursor: 'pointer'
											}}
											onClick={() => {
												if (
													inputValues.estadoRatificacion !=
													'Desestimada'
												) {
													if (
														selectedIncident.rangoSuperior >=
														(inputValues.puntajeRatificado
															? parseInt(
																	inputValues.puntajeRatificado
															  )
															: 0) +
															1
													) {
														setInputValues({
															...inputValues,
															puntajeRatificado:
																(inputValues.puntajeRatificado
																	? parseInt(
																			inputValues.puntajeRatificado
																	  )
																	: 0) + 1
														})
													}
												}
											}}
										/>
									</span>
								</div>
							</div>
							<Label htmlFor="comments">
								{t(
									'gestion_grupo>conducta>comentario_ratificacion',
									'Comentario de ratificación'
								)}
							</Label>
							<Input
								type="textarea"
								rows={3}
								style={{ resize: 'none' }}
								value={inputValues.razonRatificacion}
								name="razonRatificacion"
								id="razonRatificacion"
								onChange={onChange}
								disabled={openModal === 'see-incident'}
							/>
						</>
					)}
					{openModal !== 'see-incident' && (
						<div className="d-flex justify-content-center align-items-center w-100">
							<Button
								color="outline-primary"
								className="mr-3"
								onClick={() => {
									setOpenModal('')
									setSelectedIncident(null)
								}}
							>
								{t('boton>general>cancelar', 'Cancelar')}
							</Button>
							<Button
								color="primary"
								onClick={() => {
									if (openModal === 'add-incident') {
										showProgress()

										const makeCreateRequest = async () => {
											const recursosParsed = []
											for (const file of inputValues.files) {
												const base64 =
													await getBase64Promise(
														file.raw
													)
												recursosParsed.push({
													nombreArchivo: file.name,
													archivoBase64: base64
												})
											}

											const response =
												await actions.createIncidencia({
													fechaIncidencia:
														inputValues.date,
													descripccion:
														inputValues.description,
													requiereNormativa:
														inputValues.tipoIncumplimientoIdNormativaId
															? true
															: null,
													sB_TipoIncumplimiento_id:
														inputValues.tipoIncumplimientoIdNormativaId
															? parseInt(
																	inputValues.tipoIncumplimientoIdNormativaId
															  )
															: inputValues.tipoIncumplimientoId,
													sB_Matriculas_id:
														inputValues.studentId,
													notificarPadre:
														inputValues.notifyManager,
													notificarGuia:
														inputValues.notifyProfessor,
													sB_FechaPeriodoCalendario_id:
														selectedPeriod.fechaPeriodoCalendarioId,
													puntajeRatificado: 0,
													recursosPorIncidencia:
														recursosParsed
												})
											if (!response.error) {
												await getIncidentsFunction()
												hideProgress()
												setInputValues(initialValues)
												setSelectedIncident(null)
												setOpenModal('')
											}
										}

										makeCreateRequest()
									}

									if (openModal === 'edit-incident') {
										if (inputValues.estadoRatificacion) {
											showProgress()
											const makeUpdateRequest =
												async () => {
													const recursosParsed = []

													for (const file of inputValues.filesToUpload) {
														const base64 =
															await getBase64Promise(
																file
															)
														recursosParsed.push({
															nombreArchivo:
																file.name,
															archivoBase64:
																base64
														})
													}

													const response =
														await actions.updateIncidencia(
															{
																fechaIncidencia:
																	inputValues.date,
																id: selectedIncident.id,
																requiereNormativa:
																	inputValues.tipoIncumplimientoIdNormativaId
																		? inputValues.tipoIncumplimientoIdNormativaId
																		: null,
																descripccion:
																	inputValues.description,
																sB_TipoIncumplimiento_id:
																	inputValues.tipoIncumplimientoIdNormativaId
																		? parseInt(
																				inputValues.tipoIncumplimientoIdNormativaId
																		  )
																		: inputValues.tipoIncumplimientoId,
																sB_Matriculas_id:
																	selectedStudent.matriculaId,
																notificarPadre:
																	inputValues.notifyManager,
																notificarGuia:
																	inputValues.notifyProfessor,
																puntajeRatificado:
																	inputValues?.puntajeRatificado ||
																	0,
																recursosPorIncidenciaToAdd:
																	recursosParsed,
																sB_FechaPeriodoCalendario_id:
																	inputValues.sB_FechaPeriodoCalendario_id,
																razonRatificacion:
																	inputValues.razonRatificacion +
																	'//' +
																	inputValues.estadoRatificacion,
																esRatificado:
																	inputValues.estadoRatificacion ==
																	'Ratificada',
																recursosPorIncidenciaToDelete:
																	[]
															}
														)
													if (!response.error) {
														await getIncidentsFunction()
														hideProgress()
														setInputValues(
															initialValues
														)
														setSelectedIncident(
															null
														)
														setOpenModal('')
													}
												}
											makeUpdateRequest()
										} else {
											swal({
												title: t(
													'gestion_grupo>conducta>msj_estado',
													'Se debe seleccionar el estado de la incidencia'
												),
												icon: 'warning',
												className: 'text-alert-modal',
												buttons: {
													ok: {
														text: t(
															'configuracion>centro_educativo>ver_centro_educativo>oferta_educativa>mallas_curriculares>modelo_oferta>eliminar_asignatura>btn_aceptar',
															'¡Entendido!'
														),
														value: true,
														className:
															'btn-alert-color'
													}
												}
											})
										}
									}
								}}
							>
								{t('boton>general>confirmar', 'Confirmar')}
							</Button>
						</div>
					)}
					{openModal === 'see-incident' && (
						<div className="d-flex justify-content-center align-items-center my-3">
							<Button
								color="primary"
								onClick={() => {
									setInputValues(initialValues)
									setSelectedIncident(null)
									setOpenModal('')
								}}
							>
								{t('general>cerrar', 'Cerrar')}
							</Button>
						</div>
					)}
				</ModalBody>
			</CustomModal>
			<div className="d-flex my-5 justify-content-between">
				<div style={{ width: '40%' }}>
					<div className="search-sm--rounded">
						<input
							type="text"
							name="keyword"
							id="search"
							onInput={(e) => onSearchKey(e)}
							onKeyPress={(e) => onSearchKey(e)}
							autoComplete="off"
							placeholder={t(
								'general>buscador_estudiante>placeholder',
								'Buscar estudiante'
							)}
						/>
						<StyledInputGroupAddon addonType="append">
							<Button
								color="primary"
								className="buscador-table-btn-search"
								onClick={() => {
									setItems(
										search(searchValue)
											.in(students, ['nombreCompleto'])
											.map(studentsMapper)
									)
								}}
							>
								{t('general>buscar', 'Buscar')}
							</Button>
						</StyledInputGroupAddon>
					</div>
				</div>
				<div className="">
					<Dropdown
						isOpen={openModal === 'dropdown-period'}
						toggle={() =>
							setOpenModal((prevState) =>
								prevState === 'dropdown-period'
									? ''
									: 'dropdown-period'
							)
						}
					>
						<CustomDropdownToggle caret color="primary">
							{selectedPeriod.nombre ||
								t(
									'gestion_grupos>escoge_periodo',
									'Escoge un periodo'
								)}
						</CustomDropdownToggle>
						<DropdownMenu>
							{[
								...state.bloquesAsignables,
								{
									nombre: t(
										'gestion_grupos>consolidado',
										'Consolidado'
									),
									id: 0
								}
							].map((period) => (
								<DropdownItem
									onClick={() => setSelectedPeriod(period)}
									key={period.id}
								>
									{period.nombre}
								</DropdownItem>
							))}
						</DropdownMenu>
					</Dropdown>
				</div>
			</div>
			<TablesContainer>
				<CustomCard>
					<CardBody>
						<div style={{ height: '4.7rem' }}>
							<h4>
								{t(
									'gestion_grupo>conducta>registro_incidencia',
									'Registro de incidencias'
								)}
							</h4>
						</div>
						{selectedPeriod.nombre !== 'Consolidado' && (
							<PeriodTable
								students={items}
								director={director}
								setSelectedStudent={setSelectedStudent}
								onClick={(item) => {
									setInputValues({
										...inputValues,
										studentId:
											item.matriculaId ||
											item.matriculasId
									})
									setOpenModal('add-incident')
								}}
							/>
						)}
						{selectedPeriod.nombre === 'Consolidado' && (
							<PeriodsTable
								periods={state.bloquesAsignables}
								students={items}
								director={director}
								onClick={(incidents) => {
									setSecondData(incidents)
								}}
							/>
						)}
					</CardBody>
				</CustomCard>
				<CustomCard>
					<CardBody>
						<div style={{ height: '4rem', marginBottom: '10px' }}>
							<div className="d-flex justify-content-between">
								<h4>
									{t(
										'gestion_grupo>conducta>historial_incidencia',
										'Historial de incidencias del estudiante'
									)}
								</h4>
								<div className="">
									<ModalHistorial
										data={groupIncidentesStudents}
									/>
								</div>
							</div>
							<p style={{ color: '#8f8f8f' }}>
								{selectedStudent?.nombre ||
									selectedStudent?.nombreCompleto}
							</p>
						</div>
						<IncidentTable
							data={secondData}
							fouls={fouls}
							director={director}
							onClickDesestimar={async (_selectedIncident) => {
								swal({
									title: t(
										'gestion_grupo>conducta>desestimar_incidencia',
										'Se va a desestimar esta incidencia'
									),
									icon: 'warning',
									className: 'text-alert-modal',
									buttons: {
										ok: {
											text: t(
												'configuracion>centro_educativo>ver_centro_educativo>oferta_educativa>mallas_curriculares>modelo_oferta>eliminar_asignatura>btn_aceptar',
												'¡Entendido!'
											),
											value: true,
											className: 'btn-alert-color'
										}
									}
								}).then(async (result) => {
									if (result) {
										const response =
											await actions.updateIncidencia({
												fechaIncidencia:
													inputValues.date,
												id: _selectedIncident.id,
												requiereNormativa:
													inputValues.tipoIncumplimientoIdNormativaId
														? inputValues.tipoIncumplimientoIdNormativaId
														: null,
												descripccion:
													_selectedIncident.descripcion,
												sB_TipoIncumplimiento_id:
													_selectedIncident.sB_TipoIncumplimiento_id,
												sB_AsignaturaGrupoEstudianteMatriculado_id:
													_selectedIncident.sB_AsignaturaGrupoEstudianteMatriculado_id,
												notificarPadre:
													_selectedIncident.notificarPadre,
												notificarGuia:
													_selectedIncident.notificarGuia,
												puntajeRatificado: 0,
												recursosPorIncidenciaToAdd: [],
												sB_FechaPeriodoCalendario_id:
													_selectedIncident.sB_FechaPeriodoCalendario_id,
												razonRatificacion:
													_selectedIncident.razonRatificacion
														? _selectedIncident.razonRatificacion.split(
																'//'
														  )[0] +
														  '//' +
														  'Desestimada'
														: null,
												esRatificado: false,
												recursosPorIncidenciaToDelete:
													[]
											})
										if (!response.error) {
											await getIncidentsFunction()
											hideProgress()
											setInputValues(initialValues)
											setSelectedIncident(null)
											setOpenModal('')
										}
									}
								})
							}}
							onClickEdit={(item) => {
								setSelectedIncident(item)
								setOpenModal('edit-incident')
							}}
							onClickSeeIncident={(item) => {
								setSelectedIncident(item)
								setOpenModal('see-incident')
							}}
						/>
					</CardBody>
				</CustomCard>
			</TablesContainer>
		</Col>
	)
}

const StyledInputGroupAddon = styled(InputGroupAddon)`
  top: 0;
  right: 0;
  position: absolute;
  height: 100%;
  display: flex;
  align-items: center;
  }
`

const CustomDropdownToggle = styled(DropdownToggle)`
	text-overflow: ellipsis;
	overflow-x: hidden;
	&:hover,
	&:active,
	&:focus {
		background-color: #145388 !important;
		color: #fff !important;
	}
`

const CustomModal = styled(Modal)`
	&.modal-dialog {
		box-shadow: unset !important;
	}
	& > div.modal-content {
		border-radius: 10px !important;
	}
`

const DatePickerStyled = styled(DatePicker)`
	width: 10rem !important;
`

const TablesContainer = styled.div`
	display: flex;
	justify-content: space-between;
	flex-direction: column;
	align-items: center;

	@media screen and (min-width: 1024px) {
		flex-direction: unset;
		align-items: unset;
	}
`

const CustomCard = styled(Card)`
	width: 75%;

	@media screen and (min-width: 1024px) {
		width: 49%;
	}
`

export default StudentsConduct
