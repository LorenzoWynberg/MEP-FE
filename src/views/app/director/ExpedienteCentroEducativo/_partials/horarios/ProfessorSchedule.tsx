import React, { useState, useEffect } from 'react'
import GenericSchedule from './GenericSchedule'
import styled from 'styled-components'
import {
	Col,
	Input,
	Button,
	Modal,
	ModalBody,
	ModalHeader,
	ModalFooter,
	InputGroupAddon
} from 'reactstrap'
import search from 'Utils/search'
import ReactToPrint from 'react-to-print'
import { useSelector } from 'react-redux'
import moment from 'moment'
import { useActions } from 'Hooks/useActions'
import {
	getProfessorsByInstitution,
	getProfessorsWithoutSchedule
} from 'Redux/ProfesoresInstitucion/actions'
import { AsyncPaginate } from 'react-select-async-paginate'
import Tooltip from '@mui/material/Tooltip'
import { useTranslation } from 'react-i18next'

const ProfessorSchedule = ({ days }) => {
	const { t } = useTranslation()
	const [openModal, setOpenModal] = useState(false)
	const [printRef, setPrintRef] = useState<any>(null)
	const [print, setPrint] = useState(false)
	const [schedule, setSchedule] = useState([])
	const { lectionsSubjectGroup } = useSelector(
		(state) => state.leccionAsignaturaGrupo
	)
	const { lections } = useSelector((state) => state.lecciones)
	const { professorsInstitution: professors, professorsWithoutSchedule } =
		useSelector((state) => state.profesoresInstitucion)
	const { currentInstitution } = useSelector((state) => state.authUser)

	const actions = useActions({
		getProfessorsWithoutSchedule,
		getProfessorsByInstitution
	})

	useEffect(() => {
		actions.getProfessorsWithoutSchedule()
	}, [])

	const [items, setItems] = useState(professorsWithoutSchedule)
	const [searchValue, setSearchValue] = useState('')

	const [selectedProfessor, setSelectedProfessor] = useState(null)

	const onSearchKey = async (e) => {
		const { value } = e.target
		setSearchValue(value)

		if (
			((e.charCode === 13 || e.keyCode === 13 || e.key === 'Enter') &&
				value.length >= 3) ||
			value.length === 0
		) {
			setItems(
				search(value).in(
					professorsWithoutSchedule,
					Object.keys(
						professorsWithoutSchedule.length > 0
							? professorsWithoutSchedule[0]
							: []
					)
				)
			)
		}
	}

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

	useEffect(() => {
		const newSchedule = createSchedule()
		setSchedule(newSchedule)
	}, [lections])

	useEffect(() => {
		if (selectedProfessor?.id) {
			const newSchedule = JSON.parse(JSON.stringify(createSchedule()))

			lections.forEach((lection, index) => {
				lectionsSubjectGroup[lection.id] &&
					lectionsSubjectGroup[lection.id].forEach((item) => {
						if (
							index !== -1 &&
							item?.profesoresInstitucionId ===
								selectedProfessor?.id
						) {
							newSchedule[index][item.diaSemana - 1] = item
						}
					})
			})

			setSchedule(newSchedule)
		}
	}, [selectedProfessor, lectionsSubjectGroup])

	return (
		<Col>
			<CustomModal
				isOpen={openModal}
				toggle={() => setOpenModal((prevState) => !prevState)}
				size="md"
				style={{ borderRadius: '10px' }}
				centered="static"
			>
				<ModalHeader>{t('expediente_ce>horario>docentes_sin_horario','Docentes sin horario definidos')}</ModalHeader>
				<ModalBody>
					<div style={{ width: '100%' }} className="mr-4">
						<div className="search-sm--rounded">
							<input
								type="text"
								name="keyword"
								id="search"
								onInput={(e) => onSearchKey(e)}
								onKeyPress={(e) => onSearchKey(e)}
								autoComplete="off"
								placeholder={t("general>buscar>docente","Buscar docente")}
							/>
							<StyledInputGroupAddon addonType="append">
								<Button
									color="primary"
									className="buscador-table-btn-search"
									onClick={() => {
										setItems(
											search(searchValue).in(
												professorsWithoutSchedule,
												Object.keys(
													professorsWithoutSchedule.length >
														0
														? professorsWithoutSchedule[0]
														: []
												)
											)
										)
									}}
								>
									{t("general>buscar", "Buscar")}
								</Button>
							</StyledInputGroupAddon>
						</div>
					</div>
					<table className="mallasTable" style={{ width: '100%' }}>
						<thead>
							<tr>
								<td style={{ borderRadius: '0' }}>{t(" dir_regionales>col_nombre", "Nombre")}</td>
								<td style={{ borderRadius: '0' }}>{t('expediente_ce>horario>cedula','Cédula')}</td>
							</tr>
						</thead>
						<tbody>
							{items.map((item, i) => (
								<tr key={`${item.name}-${i}`}>
									<td>
										<div className="d-flex">
											<span className="ml-2">
												{item.nombreProfesor}{' '}
												{item.primerApellidoProfesor}{' '}
												{item.segundosApellidoProfesor}
											</span>
										</div>
									</td>
									<td>{item.identificacionProfesor}</td>
								</tr>
							))}
							{items.length === 0 && (
								<p
									style={{ fontWeight: 'bold' }}
									className="d-flex justify-content-between"
								>
									{t("general>mensaje>no_resultados", "No hay resultados")}
								</p>
							)}
						</tbody>
					</table>
				</ModalBody>
				<ModalFooter>
					<div className="d-flex justify-content-center align-items-center w-100">
						<Button
							color="outline-primary"
							className="mr-3"
							onClick={() => {
								setOpenModal(false)
							}}
						>
							{t("boton>general>cancelar", "Cancelar")}
						</Button>
						<Button
							color="primary"
							onClick={() => {
								setOpenModal(false)
							}}
						>
							{t("boton>general>confirmar", "Confirmar")}
						</Button>
					</div>
				</ModalFooter>
			</CustomModal>
			<Container ref={(ref) => setPrintRef(ref)}>
				<div className="d-flex justify-content-between w-100">
					<div className="">
						<h6>{t('expediente_ce>horario>seleccione_docente','Seleccione el docente')}</h6>
						{!print && (
							<div style={{ width: '15rem' }} className="mb-5">
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
											borderRadius: '20px',
											border: '1px solid #000'
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
						)}
					</div>
					<div className="d-flex">
						{!print && (
							<>
								<div>
									<Button
										color="primary"
										className="mr-2"
										onClick={() => setOpenModal(true)}
									>
										{t("estudiantes>expediente>docente>btndocente", "Mostrar docentes sin horario definidos")}
									</Button>
								</div>
								<div>
									<ReactToPrint
										trigger={() => (
											<Button color="primary">
												{t("estudiantes>indentidad_per>imp_doc>imprimir", "Imprimir")}
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
							</>
						)}
					</div>
				</div>
				<GenericSchedule
					firstColumnContent={lections}
					renderFirstColumnItem={(el) => (
						<p style={{ margin: 0 }}>
							{el.orden === 0 ? '' : el.orden}
						</p>
					)}
					schedule={lections}
					renderScheduleItem={(el) => (
						<p style={{ margin: 0 }}>
							{moment(el.horaInicio).format('hh:mm A')} -{' '}
							{moment(el.horaFin).format('hh:mm A')}
						</p>
					)}
					schedules={schedule}
					days={days}
					renderBodyItem={(el) => {
						const subjectName = el?.nombreAsignatura
						return subjectName ? (
							<Tooltip
								title={
									<>
										<p>
											{t("configuracion>mallas_curriculares>asignatura/figura_afin>asignatura/figura_afin", "Asignatura/figura afín")}:{' '}
											{el?.nombreAsignatura?.toUpperCase()}
										</p>

										<p>{t("estudiantes>expediente>header>grupo", "Grupo")}: {el?.nombreGrupo}</p>
									</>
								}
							>
								<div
									style={{
										width: '13.5rem',
										backgroundColor: el.esReceso
											? '#145388'
											: 'unset',
										color: el.esReceso ? '#fff' : 'unset',
										display: 'flex',
										justifyContent: 'center',
										alignContent: 'center',
										alignItems: 'center',
										textAlign: 'center'
									}}
									className="generic-schedule__row-content"
								>
									<div>
										<p style={{ margin: 0 }}>
											{el.orden === 0
												? ''
												: subjectName === undefined
												? null
												: subjectName.length < 20
												? subjectName
												: `${subjectName.slice(
														0,
														25
												  )}...`}
										</p>
										<p style={{ margin: 0 }}>
											{el?.nombreGrupo}
										</p>
									</div>
								</div>
							</Tooltip>
						) : (
							<div
								style={{
									width: '13.5rem',
									backgroundColor: el.esReceso
										? '#145388'
										: 'unset',
									color: el.esReceso ? '#fff' : 'unset',
									display: 'flex',
									justifyContent: 'center',
									alignContent: 'center',
									alignItems: 'center',
									textAlign: 'center'
								}}
								className="generic-schedule__row-content"
							/>
						)
					}}
				/>
			</Container>
		</Col>
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

const InputSelect = styled(Input)`
	border-radius: 2rem !important;
	border: 1px solid #000;
	width: 10rem !important;

	@media screen and (min-width: 726px) {
		width: 16rem !important;
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

const StyledInputGroupAddon = styled(InputGroupAddon)`
  top: 0;
  right: 0;
  position: absolute;
  height: 100%;
  display: flex;
  align-items: center;
  }
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
	justify-content: space-between;
	cursor: pointer; // grab
`

export default ProfessorSchedule
