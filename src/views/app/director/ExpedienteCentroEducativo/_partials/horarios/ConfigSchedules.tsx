import React, { useEffect, useState } from 'react'
import {
	Col,
	Button,
	Modal,
	ModalHeader,
	ModalBody,
	ModalFooter,
	CustomInput,
	Input
} from 'reactstrap'
import styled from 'styled-components'
import Tooltip from '@mui/material/Tooltip'
import ReactToPrint from 'react-to-print'
import { useSelector } from 'react-redux'
import { useActions } from 'Hooks/useActions'
import moment from 'moment'
import {
	createLectionSubjectGroupMultiple,
	deleteLectionSubjectGroup,
	getLectionsSubjectGroup,
	getLectionsSubjectGroupByLectionsIds,
	updateLectionSubjectGroup
} from '../../../../../../redux/LeccionAsignaturaGrupo/actions'
import useNotification from 'Hooks/useNotification'
import {
	getAllSubjectGroupByGroupId,
	getAsignaturasByGrupoId
} from 'Redux/AsignaturaGrupo/actions'
import {
	getAllProfessors,
	getProfessorsByInstitution
} from 'Redux/ProfesoresInstitucion/actions'
import colors from 'Assets/js/colors'
import Select from 'react-select'
import { AsyncPaginate } from 'react-select-async-paginate'
import { useTranslation } from 'react-i18next'

const SubjectItem = ({
	item,
	type = 'subject',
  selectedGroup = null
}: {
	item: any
	type: 'subject' | 'lectionSubjectGroup',
  selectedGroup
}) => {
	const { t } = useTranslation()
	const el = item?.datosAsignaturaGrupo ? item.datosAsignaturaGrupo : item
	const subjectName =
		el?.nombreAsignatura ||
		`${el?.nombre.slice(
			0,
			25
		)}...`
	const groupName = el?.nombreGrupo || selectedGroup?.nombre
	const professorName =
		item?.datosProfesoresInstitucion?.datosIdentidad?.nombre
	const professorApellidos = el?.profesorNombre
		? `${el?.profesorNombre} ${el?.profesorprimerApellido}`
		: `${item?.datosProfesoresInstitucion?.datosIdentidad?.nombre} ${item?.datosProfesoresInstitucion?.datosIdentidad?.primerApellido}`
	const cantidadLecciones = el?.cantidadLecciones
	return (
		<Tooltip
			title={
				<>
					<p>
						{t(
							'configuracion>mallas_curriculares>asignatura/figura_afin>asignatura/figura_afin',
							'Asignatura/figura afín'
						)}
						: {subjectName?.toUpperCase()}
					</p>
					<p>
						{t('estudiantes>expediente>header>grupo', 'Grupo')}:{' '}
						{groupName}
					</p>
					{type === 'lectionSubjectGroup' && (
						<>
							<p>
								{t(
									'expediente_ce>horario>docente_titular',
									'Docente titular'
								)}
								: {professorName} {professorApellidos}
							</p>
						</>
					)}
				</>
			}
		>
			<SubjectContainer>
				{type === 'subject' && (
					<div className={type === 'subject' ? '' : 'text-center'}>
						{subjectName?.toUpperCase() || el.id}
						{type === 'subject' && ` ${String(cantidadLecciones)}`}
					</div>
				)}
				{type === 'lectionSubjectGroup' && (
					<div>
						<div className="text-center">
							{`${subjectName.slice(0, 20)}...` || el.id}
						</div>
						<div className="text-center">
							{professorName}{' '}
							{`${professorApellidos.slice(0, 20)}...`}
						</div>
					</div>
				)}
			</SubjectContainer>
		</Tooltip>
	)
}
const ConfigSchedules = ({ days }) => {
	const { t } = useTranslation()
	const [tableRef, setTableRef] = useState(null)
	const [open, setOpen] = useState<'group' | 'selectSubject' | ''>('')
	const [lectionIndexSelected, setLectionIndexSelected] =
		useState<Array<number>>(null)
	const [selectedSubject, setSelectedSubject] = useState<any>(null)
	const [selectedGroup, setSelectedGroup] = useState<any>({})
	const [selectedLectionSubjectGroup, setSelectedLectionSubjectGroup] =
		useState(null)
	const [selectedProfessor, setSelectedProfessor] = useState(null)
	const [printRef, setPrintRef] = useState<any>(null)
	const [print, setPrint] = useState(false)
	const { lections } = useSelector((state) => state.lecciones)
	const { lectionsSubjectGroup } = useSelector(
		(state) => state.leccionAsignaturaGrupo
	)
	const { groupsByOffer: groups = [] } = useSelector((state) => state.grupos)
	const { subjectsGroupByGroup } = useSelector(
		(state) => state.asignaturaGrupo
	)
	const { currentInstitution } = useSelector((state) => state.authUser)
	const { professorsInstitution: professors } = useSelector(
		(state) => state.profesoresInstitucion
	)
	const [items, setItems] = useState<
		Array<{
			cantidadLecciones: number
			asignaturaGrupoId: number
			nombre: string
			remove?: number
		}>
	>([])
	const [schedule, setSchedule] = useState([])
	const [updateSchedule, setUpdateSchedule] = useState(false)
	const [snackbar, handleClick] = useNotification()
	const [snackbarContent, setSnackbarContent] = useState({
		msg: '',
		variant: ''
	})

	const actions = useActions({
		getLectionsSubjectGroup,
		updateLectionSubjectGroup,
		deleteLectionSubjectGroup,
		getAllSubjectGroupByGroupId,
		getLectionsSubjectGroupByLectionsIds,
		createLectionSubjectGroupMultiple,
		getAllProfessors,
		getProfessorsByInstitution,
		getAsignaturasByGrupoId
	})

	useEffect(() => {
		if (groups.length > 0) {
			setSelectedGroup(groups[0])
		}
	}, [groups])

	useEffect(() => {
		if (selectedGroup?.id) {
			actions.getAsignaturasByGrupoId(selectedGroup?.id, currentInstitution?.id)
			actions
				.getLectionsSubjectGroupByLectionsIds(
					lections.map((lection) => lection.id)
				)
				.then(() => {
					setUpdateSchedule(true)
				})
		}
	}, [selectedGroup])

	const createSchedule = () => {
		const aux = new Array(lections.length).fill(
			new Array(days.length).fill(0)
		)
		const breakTimes = lections.filter((lection) => lection.esReceso)

		if (breakTimes.length > 0) {
			breakTimes.forEach((breakTime) => {
				const index = lections.findIndex(
					(lection) => lection.id === breakTime.id
				)

				if (index !== -1) {
					aux[index] = new Array(days.length).fill(lections[index])
				}
			})
		}
		return aux
	}

	useEffect(() => {
		if (lections.length > 0) {
			const aux = createSchedule()
			setSchedule(aux)
		}
	}, [lections])

	useEffect(() => {
		if (selectedLectionSubjectGroup) {
			const professorIndex = professors.findIndex(
				(el) =>
					el?.id ===
					selectedLectionSubjectGroup?.profesoresInstitucionId
			)
			const subjectIndex = subjectsGroupByGroup.findIndex(
				(el) =>
					el?.asignaturaGrupoId === selectedLectionSubjectGroup?.asignaturaGrupoid
			)
      // debugger
			setSelectedProfessor(professors[professorIndex])
			setSelectedSubject(subjectsGroupByGroup[subjectIndex])
		}
	}, [selectedLectionSubjectGroup])

	useEffect(() => {
		if (schedule.length > 0 && updateSchedule) {
			const copy = JSON.parse(JSON.stringify(createSchedule()))
			lections.forEach((lection, index) => {
				lectionsSubjectGroup[lection.id] &&
					lectionsSubjectGroup[lection.id].forEach((item) => {
						if (
							index !== -1 &&
							item?.gruposId === selectedGroup?.id &&
							item.diaSemana > 0
						) {
							copy[index][item.diaSemana - 1] = item
						}
					})
			})
			setSchedule(copy)
			setUpdateSchedule(false)
		}
	}, [updateSchedule, lectionsSubjectGroup, selectedGroup])

	useEffect(() => {
		if (subjectsGroupByGroup.length === 0) {
			setItems([])
		}
	}, [subjectsGroupByGroup])

	useEffect(() => {
		if (
			lections.length > 0 &&
			subjectsGroupByGroup.length > 0 &&
			(!selectedLectionSubjectGroup ||
				!selectedLectionSubjectGroup?.estado)
		) {
			const newItems = JSON.parse(
				JSON.stringify([...subjectsGroupByGroup])
			)
			const ids = subjectsGroupByGroup.map((subject) => subject.asignaturaGrupoId)

			lections.forEach((lection) => {
				lectionsSubjectGroup[lection.id] &&
					lectionsSubjectGroup[lection.id].forEach((item) => {
						if (ids.includes(item.asignaturaGrupoid)) {
							const indexSelected = newItems.findIndex(
								(el) =>
									el?.asignaturaGrupoId ===
									selectedLectionSubjectGroup?.asignaturaGrupoid
							)
							const index = subjectsGroupByGroup.findIndex(
								(el) => el.asignaturaGrupoId === item.asignaturaGrupoid
							)
							if (index !== -1) {
								if (newItems[index]?.cantidadLecciones <= 1) {
									if (indexSelected !== -1 && newItems[index]?.asignaturaGrupoId === newItems[indexSelected]?.asignaturaGrupoId) {
										newItems[index] = {
											...newItems[index],
											remove: 0
										}
										return
									}
									newItems[index] = {
										...newItems[index],
										remove: true
									}
								} else {
									const subtract = newItems[index].cantidadLecciones - 1
									newItems[index].cantidadLecciones = subtract
								}
							}
						}
					})
			})
			setItems(newItems)
		}
	}, [
		lectionsSubjectGroup,
		subjectsGroupByGroup,
		lections,
		schedule,
		selectedLectionSubjectGroup,
		selectedGroup,
		updateSchedule
	])

	const loadOptions = async (searchQuery, loadedOptions, { page }) => {
		let response: any = {}
		if (!searchQuery) {
			response = await actions.getProfessorsByInstitution(
				currentInstitution?.id,
				page,
				10
			)
		}

		if (searchQuery) {
			response.options = professors.filter((item) => {
				if (
					item?.nombreProfesor
						?.toLowerCase()
						?.includes(searchQuery.toLowerCase())
				) {
					return item
				}

				if (
					item?.primerApellidoProfesor
						?.toLowerCase()
						?.includes(searchQuery.toLowerCase())
				) {
					return item
				}

				if (
					item?.segundosApellidoProfesor
						?.toLowerCase()
						?.includes(searchQuery.toLowerCase())
				) {
					return item
				}
			})
		}

		return {
			options:
				response?.options.sort(function (a, b) {
					if (a.nombreProfesor < b.nombreProfesor) {
						return -1
					}
					if (a.nombreProfesor > b.nombreProfesor) {
						return 1
					}
					return 0
				}) || [],
			hasMore:
				searchQuery.length > 0 ? false : response?.options?.length >= 1,
			additional: {
				page: searchQuery?.length > 0 ? page : page + 1
			}
		}
	}

	return (
		<div className="">
			{snackbar(snackbarContent.variant, snackbarContent.msg)}
			<CustomModal
				isOpen={open === 'selectSubject'}
				toggle={() => setOpen('selectSubject')}
				size="md"
				style={{ borderRadius: '10px' }}
				centered="static"
			>
				<ModalHeader>
					{t('general>placeholder>seleccionar_asignatura', 'Selecciona una asignatura')}
				</ModalHeader>
				<ModalBody>
					<div>
						<div className="">
							<h6>{t("gestion_grupo>conducta>docente", "Docente")}*</h6>
							{/* <Select
                onChange={(value) => setSelectedProfessor(value.value)}
                value={selectedProfessor ? {
                  label: `${selectedProfessor?.datosIdentidad?.nombre} ${selectedProfessor?.datosIdentidad?.primerApellido}`,
                  value: selectedProfessor
                } : null}
                styles={{
                  indicatorSeparator: (styles) => ({ ...styles, display: 'none' }),
                }}
                options={professors.sort(function(a, b){
                  if (a?.datosIdentidad?.nombre?.toLowerCase() < b?.datosIdentidad?.nombre?.toLowerCase()) { return -1; }
                  if (a?.datosIdentidad?.nombre?.toLowerCase() > b?.datosIdentidad?.nombre?.toLowerCase()) { return 1; }
                  return 0;
                }).map((item) => ({
                  value: item,
                  label: `${item?.datosIdentidad?.nombre} ${item?.datosIdentidad?.primerApellido}`
                }))}
                placeholder="Buscar y seleccionar un profesor"
              /> */}
							<div className="mb-5">
								<AsyncPaginate
									key="async-students"
									placeholder={t('expediente_ce>horario>seleccione_docente','Seleccione el docente')}
									loadOptions={loadOptions}
									additional={{
										page: 1
									}}
									onChange={(value) => {
										setSelectedProfessor(value)
									}}
									getOptionValue={(option) => option}
									getOptionLabel={(option) =>
										`${option?.nombreProfesor} ${option?.primerApellidoProfesor} ${option?.segundosApellidoProfesor}`
									}
									styles={{
										control: (styles) => ({
											...styles,
											border: '1px solid #808080'
										}),
										indicatorSeparator: (styles) => ({
											...styles,
											display: 'none'
										})
									}}
									value={selectedProfessor}
									cacheUniqs={[selectedProfessor]}
								/>
							</div>
						</div>
						<div className="my-5">
							<h6>{t("configuracion>centro_educativo>ver_centro_educativo>mallas_curriculares>asignatura", "Asignatura")}*</h6>
							<Select
								onChange={(value) =>
									setSelectedSubject(value.value)
								}
								value={
									selectedSubject
										? {
												label: selectedSubject?.nombre,
												value: selectedSubject
										  }
										: null
								}
								styles={{
									indicatorSeparator: (styles) => ({
										...styles,
										display: 'none'
									})
								}}
								options={items
									.sort(function (a, b) {
										if (
											a.nombre?.toLowerCase() <
											b.nombre?.toLowerCase()
										) {
											return -1
										}
										if (
											a?.nombre?.toLowerCase() >
											b?.nombre?.toLowerCase()
										) {
											return 1
										}
										return 0
									})
									.filter((el) => !el.remove)
									.map((item) => ({
										value: item,
										label: item?.nombre.toUpperCase()
									}))}
								placeholder={t(
									'expediente_ce>horario>buscar_seleccionar_asignatura',
									'Buscar y seleccionar una asignatura'
								)}
							/>
						</div>
						{selectedLectionSubjectGroup && (
							<div className="mb-5 d-flex">
								<CustomInput
									className="custom-checkbox"
									type="checkbox"
									checked={
										!selectedLectionSubjectGroup?.estado
									}
									onClick={() =>
										setSelectedLectionSubjectGroup(
											(prevState) => ({
												...prevState,
												estado: !selectedLectionSubjectGroup?.estado
											})
										)
									}
								/>{' '}
								{t("expediente_ce>horario>eliminar_leccion", "Eliminar lección")}
							</div>
						)}
						<div className="">
							<h6>{t('expediente_ce>horario>horario_seleccionado', 'Horario Seleccionado')}</h6>
							<div className="d-flex justify-content-between w-100">
								<div
									style={{
										padding: '.5rem 2rem',
										backgroundColor: colors.opaqueGray,
										borderRadius: '5px'
									}}
								>
									{lectionIndexSelected &&
										moment(
											lections[lectionIndexSelected[0]]
												?.horaInicio
										).format('hh:mm A')}
								</div>
								<div
									style={{
										padding: '.5rem 2rem',
										backgroundColor: colors.opaqueGray,
										borderRadius: '5px'
									}}
								>
									{lectionIndexSelected &&
										moment(
											lections[lectionIndexSelected[0]]
												?.horaFin
										).format('hh:mm A')}
								</div>
							</div>
						</div>
					</div>
				</ModalBody>
				<ModalFooter>
					<div className="d-flex justify-content-center align-items-center w-100">
						<Button
							color="outline-primary"
							className="mr-3"
							onClick={() => {
								setOpen('')
								setSelectedSubject(null)
								setSelectedLectionSubjectGroup(null)
								setSelectedProfessor(null)
							}}
						>
							{t('general>cancelar', 'Cancelar')}
						</Button>
						<Button
							color="primary"
							onClick={() => {
								if (
									(selectedProfessor ||
										selectedLectionSubjectGroup) &&
									(selectedLectionSubjectGroup ||
										selectedSubject)
								) {
									if (lectionIndexSelected.length > 0) {
										const copy = JSON.parse(
											JSON.stringify([...schedule])
										)
										let newItem = {}
										if (
											selectedSubject &&
											selectedLectionSubjectGroup
										) {
											newItem = {
												...selectedSubject,
												...selectedLectionSubjectGroup,
												id: selectedLectionSubjectGroup?.id
											}
										} else if (
											selectedSubject &&
											!selectedLectionSubjectGroup
										) {
											newItem = selectedSubject
										} else {
											newItem =
												selectedLectionSubjectGroup
										}

										copy[lectionIndexSelected[0]][
											lectionIndexSelected[1]
										] = newItem
										actions
											.createLectionSubjectGroupMultiple([
												{
													id:
														selectedLectionSubjectGroup?.leccionAsignaturaGrupoId ||
														0,
													diaSemana:
														selectedLectionSubjectGroup?.diaSemana ||
														lectionIndexSelected[1] +
															1,
													leccionId:
														selectedLectionSubjectGroup?.leccion_id ||
														lections[
															lectionIndexSelected[0]
														]?.id,
													asignaturaGrupoid:
														selectedSubject?.asignaturaGrupoId ||
														selectedLectionSubjectGroup
															.datosAsignaturaGrupo
															?.id,
													groupId:
														selectedLectionSubjectGroup
															?.datosAsignaturaGrupo
															?.datosGrupo?.id ||
														selectedGroup?.id,
													estado: !selectedLectionSubjectGroup
														? 1
														: selectedLectionSubjectGroup?.estado
														? 1
														: 0,
													sb_ProfesoresInstitucion_id:
														selectedProfessor?.id
												}
											])
											.then(() => {
												setUpdateSchedule(true)
											})
										setSchedule(copy)
									}
									setOpen('')
									setSelectedSubject(null)
									setSelectedLectionSubjectGroup(null)
									setSelectedProfessor(null)
								} else {
									setSnackbarContent({
										variant: 'error',
										msg: t(
											'general>mensaje>error>seleccionar_profesor_asignatura',
											'Debe seleccionar un profesor y una asignatura'
										)
									})
									handleClick()
								}
							}}
						>
							{t('boton>general>confirmar', 'Confirmar')}
						</Button>
					</div>
				</ModalFooter>
			</CustomModal>
			<Col>
				<Container>
					<div className="d-flex justify-content-between w-100">
						<div className="my-2" style={{ width: '15rem' }}>
							<h6>
								{t(
									'expediente_ce>horario>selec_grupo',
									'Selecciona el grupo'
								)}
							</h6>
							<Select
								options={groups?.map((el) => ({
									label: `${el?.nombre} ${
										el?.especialidadNombre
											? el?.especialidadNombre
											: ''
									}`,
									value: el
								}))}
								value={
									selectedGroup
										? {
												label: `${
													selectedGroup?.nombre
												} ${
													selectedGroup?.especialidadNombre
														? selectedGroup?.especialidadNombre
														: ''
												}`,
												value: selectedGroup
										  }
										: null
								}
								styles={{
									control: (styles) => ({
										...styles,
										borderRadius: '20px',
										border: '1px solid #000'
									}),
									indicatorSeparator: (styles) => ({
										...styles,
										display: 'none'
									})
								}}
								onChange={({ value }) => {
									setSelectedGroup(value)
								}}
							/>
						</div>
						<div>
							<ReactToPrint
								trigger={() => (
									<Button color="primary">
										{t(
											'estudiantes>indentidad_per>imp_doc>imprimir',
											'Imprimir'
										)}
									</Button>
								)}
								content={() => printRef}
								onAfterPrint={() => {
									setPrint(false)
								}}
								onBeforeGetContent={() => {
									setPrint(true)
								}}
							/>
						</div>
					</div>
					<div
						style={{ display: 'flex', width: '100%' }}
						ref={(ref) => setPrintRef(ref)}
					>
						<div style={{ display: 'flex' }}>
							<div>
								<p
									className="generic-schedule__column-header"
									style={{ padding: ' 0.95rem 0' }}
								>
									{t(
										'expediente_ce>horario>leccion',
										'Lección'
									)}
								</p>
								{lections?.map((el, i) => (
									<p
										style={{
											textAlign: 'center',
											margin: 0,
											border: '1px solid #eaeaea',
											display: 'flex',
											justifyContent: 'center',
											alignItems: 'center',
											height: '3.5rem',
											backgroundColor: el.esReceso
												? '#145388'
												: 'unset',
											color: el.esReceso
												? '#fff'
												: 'unset'
										}}
										key={i}
									>
										{el.orden === 0 ? '' : el.orden}
									</p>
								))}
								{lections.length === 0 && (
									<div
										style={{
											textAlign: 'center',
											margin: 0,
											border: '1px solid #eaeaea',
											display: 'flex',
											justifyContent: 'center',
											alignItems: 'center',
											height: '3.5rem'
										}}
									/>
								)}
							</div>
							<div>
								<p
									className="generic-schedule__column-header"
									style={{
										width: '10rem',
										padding: ' 0.95rem 0'
									}}
								>
									{t(
										'expediente_ce>horario>horario',
										'Horario'
									)}
								</p>
								{lections?.map((el, i) => (
									<p
										className="generic-schedule__row-content"
										style={{
											width: '10rem',
											backgroundColor: el.esReceso
												? '#145388'
												: 'unset',
											color: el.esReceso
												? '#fff'
												: 'unset'
										}}
										key={i}
									>
										{moment(el.horaInicio).format(
											'hh:mm A'
										)}{' '}
										- {moment(el.horaFin).format('hh:mm A')}
									</p>
								))}
								{lections.length === 0 && (
									<div
										style={{
											textAlign: 'center',
											margin: 0,
											border: '1px solid #eaeaea',
											display: 'flex',
											justifyContent: 'center',
											alignItems: 'center',
											height: '3.5rem'
										}}
									/>
								)}
							</div>
						</div>
						<div style={{ width: '100%', overflow: 'scroll' }}>
							<table
								style={{ borderRadius: 'unset' }}
								ref={(ref) => setTableRef(ref)}
							>
								<thead>
									<tr>
										{days?.map((day, i) => (
											<th
												scope="col"
												style={{
													borderRadius: '0',
													height: 'auto',
													textAlign: 'center',
													padding: '1rem 0'
												}}
												key={i}
												className="generic-schedule__column-header"
											>
												{day}
											</th>
										))}
									</tr>
								</thead>
								<tbody>
									{schedule.map((item, i) => {
										return (
											<tr key={i}>
												{item.map((_, index) => (
													<td
														scope="col"
														style={{
															borderRadius: '0',
															border: '1px solid #eaeaea',
															height: '3.5rem',
															cursor: 'pointer',
															padding: 0,
															backgroundColor:
																item[index]
																	?.esReceso
																	? '#145388'
																	: 'unset',
															color: item[index]
																?.esReceso
																? '#fff'
																: 'unset'
														}}
														key={index}
														onClick={() => {
															if (
																!item[index]
																	?.esReceso
															) {
																setOpen(
																	'selectSubject'
																)
																setLectionIndexSelected(
																	[i, index]
																)
																if (
																	item[index]
																		?.leccionAsignaturaGrupoId
																) {
																	setSelectedLectionSubjectGroup(
																		item[
																			index
																		]
																	)
																}
															}
														}}
													>
														<div
															style={{
																width: '13.5rem',
																display: 'flex',
																justifyContent:
																	'center',
																alignItems:
																	'center',
																margin: '0 auto'
															}}
														>
															{!item[index]
																?.esReceso &&
															item[index] ? (
																<SubjectItem
																	item={
																		item[
																			index
																		]
																	}
                                  selectedGroup={selectedGroup}
																	type="lectionSubjectGroup"
																/>
															) : (
																''
															)}
															{item[index]
																?.esReceso && (
																<span />
															)}
														</div>
													</td>
												))}
											</tr>
										)
									})}
									{lections.length === 0 && (
										<tr>
											{days.map((_, i) => (
												<td
													key={`schedule-${i}`}
													style={{
														height: '3.5rem',
														padding: 0
													}}
												>
													<div
														className="generic-schedule__row-content"
														style={{
															width: '13.5rem'
														}}
													/>
												</td>
											))}
										</tr>
									)}
								</tbody>
							</table>
						</div>
						<div>
							<p
								style={{
									padding: '1rem',
									margin: 0,
									backgroundColor: '#145388',
									color: '#fff',
									height: '3rem',
									width: '100%',
									borderTopRightRadius: '5px',
									borderTopLeftRadius: '5px',
									textAlign: 'center'
								}}
							>
								{t(
									'configuracion>mallas_curriculares>asignatura/figura_afin>asignatura/figura_afin',
									'Asignatura/figura afín'
								)}
							</p>
							<div
								style={{
									border: '1px solid #eaeaea',
									height: tableRef?.clientHeight
										? `calc(${tableRef?.clientHeight}px - 3rem)`
										: '100%',
									minHeight: '15rem',
									backgroundColor: '#fff',
									display: 'flex',
									justifyContent: 'flex-start',
									flexDirection: 'column',
									alignItems: 'center',
									overflowY: 'scroll',
									width: '100%'
								}}
							>
								{items &&
									items
										.filter((el) => {
											if (
												el?.asignaturaGrupoId ===
													selectedLectionSubjectGroup?.asignaturaGrupoid &&
												el?.cantidadLecciones >= 1 &&
												el.remove !== 0 &&
												!el.remove
											) {
												return el
											}
											if (
												el.remove !== 0 &&
												!el.remove &&
												el?.cantidadLecciones >= 1
											) {
												return el
											}
										})
										.sort(function (a, b) {
											if (
												a?.nombre?.toLowerCase() <
												b?.nombre?.toLowerCase()
											) {
												return -1
											}
											if (
												a?.nombre?.toLowerCase() >
												b?.nombre?.toLowerCase()
											) {
												return 1
											}
											return 0
										})
										.map((item, index) => {
											return (
												<div>
													<SubjectItem
														item={item}
														key={index}
														type="subject"
                            selectedGroup={selectedGroup}
													/>
												</div>
											)
										})}
							</div>
						</div>
					</div>
				</Container>
			</Col>
		</div>
	)
}

const Container = styled.div`
	width: 100%;
	margin: 0 auto;
	height: auto;
	background-color: #fff;
	display: flex;
	flex-direction: column;
	justify-content: center;
	border-radius: 10px;
	padding: 1rem;
	overflow: hidden;
`

const SubjectContainer = styled.div`
	width: 12.75rem;
	height: 3rem;
	background-color: #e9ecef;
	color: #000;
	margin: 3px 0;
	padding: 0.5rem;
	border-radius: 5px;
	display: flex;
	align-items: center;
	justify-content: center;
	cursor: pointer; // grab
`

const CustomModal = styled(Modal)`
	&.modal-dialog {
		box-shadow: unset !important;
	}
	& > div.modal-content {
		border-radius: 10px !important;
	}
`

const InputSelect = styled(Input)`
	border-radius: 2rem !important;
	border: 1px solid #000;
	width: 10rem !important;

	@media screen and (min-width: 726px) {
		width: 16rem !important;
	}
`

export default ConfigSchedules
