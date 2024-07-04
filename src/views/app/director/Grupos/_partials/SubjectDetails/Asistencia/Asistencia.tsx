import React, { useEffect, useState } from 'react'
import {
	Button,
	Dropdown,
	DropdownToggle,
	DropdownItem,
	DropdownMenu,
	InputGroupAddon
} from 'reactstrap'
import styled from 'styled-components'
import './Asistencia.css'
import { FaArrowAltCircleLeft, FaArrowAltCircleRight } from 'react-icons/fa'
import search from 'Utils/search'
import colors from 'Assets/js/colors'
import { Th0 } from './Styles'
import ModalHistorial from './Historial'
import TableDays from './TableDays'
import Consolidado from './Consolidado/Consolidado'
import moment from 'moment'
import TableAsistencia from './TableAsistencias/TableAsistencia'
import { getLectionsSubjectGroupBySubjectGroupId } from 'Redux/LeccionAsignaturaGrupo/actions'
import { useActions } from 'Hooks/useActions'
import { useSelector } from 'react-redux'
import { getLectionsByModelOfferIdAndInstitutionId } from 'Redux/lecciones/actions'
import { GetByIdAnio } from 'Redux/periodos/actions'
import { getAssistanceTypes } from 'Redux/Asistencias/actions'
import { useTranslation } from 'react-i18next'
import BackIcon from '@material-ui/icons/ArrowBackIos'

moment.defineLocale('es', {
	months: 'Enero_Febrero_Marzo_Abril_Mayo_Junio_Julio_Agosto_Septiembre_Octubre_Noviembre_Diciembre'.split(
		'_'
	),
	monthsShort:
		'Enero._Feb._Mar_Abr._May_Jun_Jul._Ago_Sept._Oct._Nov._Dec.'.split('_'),
	weekdays: 'Domingo_Lunes_Martes_Miercoles_Jueves_Viernes_Sabado'.split('_'),
	weekdaysShort: 'Dom._Mun._Mar._Mier._Jue._Vier._Sab.'.split('_'),
	weekdaysMin: 'Do_Lu_Ma_Mi_Ju_Vi_Sa'.split(' _ ')
})

const Asistencia = ({ students, subject, currentOffer }) => {
	const { t } = useTranslation()
	const DAYS = [
		t('expediente_ce>horario>dias>lunes', 'Lunes'),
		t('expediente_ce>horario>dias>martes', 'Martes'),
		t('expediente_ce>horario>dias>miercoles', 'Miércoles'),
		t('expediente_ce>horario>dias>jueves', 'Jueves'),
		t('expediente_ce>horario>dias>viernes', 'Viernes'),
		t('expediente_ce>horario>dias>sabado', 'Sábado'),
		t('expediente_ce>horario>dias>domingo', 'Domingo')
	]
	const [openModal, setOpenModal] = useState<
		| ''
		| 'add-incident'
		| 'edit-incident'
		| 'see-incident'
		| 'dropdown-period'
	>('')
	const [editable, setEditable] = useState<boolean>(true)
	const [searchValue, setSearchValue] = useState('')
	const [week, setWeek] = useState(0)
	const [days, setDays] = useState(DAYS)
	const [items, setItems] = useState<Array<any>>(students || [])
	const [date, setDate] = useState(new Date())
	const [dayi, setDayi] = useState(
		moment(date).add(week, 'weeks').startOf('isoWeek').format('D')
	)
	const [dayf, setDayf] = useState(
		moment(date).add(week, 'weeks').endOf('isoWeek').format('D')
	)
	const { lectionsSubjectGroup } = useSelector(
		(state) => state.leccionAsignaturaGrupo
	)
	const { currentInstitution, activeYears } = useSelector(
		(state) => state.authUser
	)
	const { lections } = useSelector((state) => state.lecciones)
	const { bloques } = useSelector((state) => state.grupos)
	const [schedule, setSchedule] = useState([])
	const [currentSubject, setCurrentSubject] = useState(null)

	const actions = useActions({
		getLectionsSubjectGroupBySubjectGroupId,
		getLectionsByModelOfferIdAndInstitutionId,
		GetByIdAnio,
		getAssistanceTypes
	})

	useEffect(() => {
		const f = (day1) => {
			const array = [...DAYS]

			array.forEach((_, index) => {
				array[index] = `${array[index]} ${day1.format('D').toString()}`
				day1.add(1, 'days')
			})
			return array
		}
		setDays(f(moment(new Date(new Date().setDate(Number(dayi))))))
	}, [week, dayi, dayf])

	useEffect(() => {
		setDayi(moment(date).add(week, 'weeks').startOf('isoWeek').format('D'))
		setDayf(moment(date).add(week, 'weeks').endOf('isoWeek').format('D'))
	}, [date, week])

	useEffect(() => {
		actions.getLectionsByModelOfferIdAndInstitutionId(
			currentOffer.modeloOfertaId,
			currentInstitution.id
		)
		actions.getLectionsSubjectGroupBySubjectGroupId(subject?.id)
		actions.getAssistanceTypes()
	}, [])

	useEffect(() => {
		if (activeYears.length > 0) {
			// actions.GetByIdAnio(activeYears[0]?.id)
		}
	}, [activeYears])

	const onNextWeek = () => {
		setWeek(week[0] + 1)
		setDate(new Date(date.setDate(date.getDate() + 7)))
	}

	const onLastWeek = () => {
		setWeek(week[0] - 1)
		setDate(new Date(date.setDate(date.getDate() - 7)))
	}

	const onSearchKey = async (e) => {
		const { value } = e.target
		setSearchValue(value)

		if (
			((e.charCode === 13 || e.keyCode === 13 || e.key === 'Enter') &&
				value.length >= 3) ||
			value.length === 0
		) {
			setItems(search(value).in(students, ['name']))
		}
	}
	const [selectedPeriod, setSelectedPeriod] = useState(bloques[0])
	const [selectedLection, setSelectedLection] = useState(0)
	const onSelectedLeccion = (item) => {
		setCurrentSubject(item)
		const index = lections.findIndex(
			(lection) => lection.id === item.leccion_id
		)
		if (index !== -1) {
			setSelectedLection(index)
		}
		setEditable(false)
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
	useEffect(() => {
		if (lections.length > 0) {
			const newSchedule = JSON.parse(JSON.stringify(createSchedule()))
			lections.forEach((lection, index) => {
				if (lectionsSubjectGroup[lection.id]) {
					lectionsSubjectGroup[lection.id].forEach((item) => {
						if (item.asignaturaGrupoid === subject?.id) {
							newSchedule[index][item.diaSemana - 1] = item
						}
					})
				}
			})
			setSchedule(newSchedule)
		}
	}, [lections, lectionsSubjectGroup])

	console.log(subject)

	return (
		<>
			{!editable && (
				<Back
					onClick={() => {
						setEditable(true)
					}}
				>
					<BackIcon />
					<BackTitle>
						{t('edit_button>regresar', 'Regresar')}
					</BackTitle>
				</Back>
			)}
			<h6 className="my-4">
				{t(
					'gestion_grupos>registro_asistencia',
					'Registro de asistencia'
				)}
			</h6>
			<Container>
				<div className="container-nav">
					<SearchContainer className="mr-4">
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
									onClick={() => {
										setItems(
											search(searchValue).in(students, [
												'name'
											])
										)
									}}
									className="buscador-table-btn-search"
								>
									{t('general>buscar', 'Buscar')}
								</Button>
							</StyledInputGroupAddon>
						</div>
					</SearchContainer>
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
						<DropdownToggle caret color="primary">
							{selectedPeriod?.nombre ||
								t(
									'gestion_grupos>escoge_periodo',
									'Escoge un periodo'
								)}
						</DropdownToggle>
						<DropdownMenu>
							{bloques &&
								bloques?.map((period) => (
									<DropdownItem
										onClick={() =>
											setSelectedPeriod(period)
										}
										key={period.id}
									>
										{period?.nombre}
									</DropdownItem>
								))}
							<DropdownItem
								onClick={() =>
									setSelectedPeriod({ nombre: 'Consolidado' })
								}
							>
								{t('gestion_grupos>consolidado', 'Consolidado')}
							</DropdownItem>
						</DropdownMenu>
					</Dropdown>
				</div>
			</Container>
			{selectedPeriod?.nombre === 'Consolidado' ? (
				<Consolidado
					groupId={subject?.datosAsignaturaGrupo?.id}
					type="subjectGroup"
				/>
			) : (
				<div>
					{editable ? (
						<div className="table">
							<div className="div-container-header">
								<div className="div-buttons-date">
									<button
										onClick={onLastWeek}
										className="btn-date"
									>
										<FaArrowAltCircleLeft
											style={{
												color: `${colors.primary}`,
												fontSize: '1rem'
											}}
										/>
									</button>
									<h5
										style={{
											fontWeight: 'bolder',
											marginLeft: '5px',
											marginRight: '5px'
										}}
									>
										{dayi} al {dayf} de{' '}
										{moment(date)
											.lang('es')
											.format('MMMM YYYY')}{' '}
									</h5>
									<button
										onClick={onNextWeek}
										className="btn-date"
									>
										<FaArrowAltCircleRight
											style={{
												color: `${colors.primary}`,
												fontSize: '1rem'
											}}
										/>
									</button>
								</div>
								<ModalHistorial subject={subject} />
							</div>
							<div className="d-flex">
								<div className="row-absolute">
									<Th0
										style={{
											display: 'flex',
											justifyContent: 'center',
											alignItems: 'center',
											alignContent: 'center',
											borderTopLeftRadius: '5px'
										}}
									>
										{t(
											'expediente_ce>horario>leccion',
											'Lección'
										)}
									</Th0>
									{lections.map((lection, i) => (
										<Th0
											style={{
												background: '#fff',
												color: '#000',
												fontWeight: 'lighter',
												backgroundColor:
													lection.esReceso
														? colors.primary
														: 'unser'
											}}
											key={i}
										>
											{lection?.orden || ''}
										</Th0>
									))}
								</div>
								<div style={{ overflowX: 'scroll' }}>
									<TableDays
										schedule={schedule}
										days={days}
										onSelectedLeccion={onSelectedLeccion}
									/>
								</div>
							</div>
						</div>
					) : (
						<TableAsistencia
							onLastWeek={onLastWeek}
							onNextWeek={onNextWeek}
							date={date}
							days={days}
							setEditable={setEditable}
							selectedLection={selectedLection}
							setSelectedLection={setSelectedLection}
							currentSubject={currentSubject}
							setCurrentSubject={setCurrentSubject}
							selectedPeriod={selectedPeriod}
						/>
					)}
				</div>
			)}
		</>
	)
}

export default Asistencia

const SearchContainer = styled.div`
	width: 32vw;
`

const Container = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: space-between @media screen and (min-width: 1120px) {
		flex-direction: row;
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

const Back = styled.div`
	display: flex;
	align-items: center;
	cursor: pointer;
	padding: 0 5px;
	margin-bottom: 20px;
`

const BackTitle = styled.span`
	color: #000;
	font-size: 14px;
	font-size: 16px;
`
