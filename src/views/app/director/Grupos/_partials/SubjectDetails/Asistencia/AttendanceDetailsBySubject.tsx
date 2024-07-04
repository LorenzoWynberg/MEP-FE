import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import {
	Card,
	CardBody,
	Col,
	Button,
	InputGroupAddon,
	DropdownToggle
} from 'reactstrap'
import search from 'Utils/search'
import ModalHistorial from './Historial'
import BackIcon from '@material-ui/icons/ArrowBackIos'
import DetailTable from './TableAsistencias/DetailTable'
import { FaArrowAltCircleLeft, FaArrowAltCircleRight } from 'react-icons/fa'
import colors from 'Assets/js/colors'
import { maxLengthString } from 'utils/maxLengthString.js'
import { useActions } from 'Hooks/useActions'
import {
	getAsistenciasByTipo,
	getAttendancesQuantityTypes
} from 'Redux/Asistencias/actions'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'

const AttendanceDetailsBySubject = ({
	student,
	subject,
	setCurrentStudent,
	setCurrentSubject,
	currentStudent,
	currentSubject,
	subjects,
	students,
	period
}) => {
	const { t } = useTranslation()
	const incidentTypes = [
		{
			name: 'Presente',
			points: 8
		},
		{
			name: 'Ausencia justificada',
			points: 5
		},
		{
			name: 'Ausencia injustificada',
			points: 7
		},
		{
			name: 'Tardía justificada',
			points: 5
		},
		{
			name: 'Tardía injustificada',
			points: 8
		},
		{
			name: 'No impartida',
			points: 6
		}
	]

	const [searchValue, setSearchValue] = useState('')
	const [openModal, setOpenModal] = useState<'' | 'dropdown-period'>('')
	const [selectedType, setSelectedType] = useState(null)
	const { assistancesQuantity, asistenciasByTipo } = useSelector(
		(state) => state.asistencias
	)
	const [items, setItems] = useState<Array<any>>(assistancesQuantity || [])

	const [data, setData] = useState([])

	useEffect(() => {
		setData(asistenciasByTipo)
	}, [asistenciasByTipo])
	const onSearchKey = async (e) => {
		const { value } = e.target
		setSearchValue(value)

		if (
			((e.charCode === 13 || e.keyCode === 13 || e.key === 'Enter') &&
				value.length >= 3) ||
			value.length === 0
		) {
			setItems(
				search(searchValue).in(
					incidentTypes,
					Object.keys(incidentTypes[0])
				)
			)
		}
	}

	useEffect(() => {
		if (assistancesQuantity.length > 0) {
			setItems(assistancesQuantity)
		}
	}, [assistancesQuantity])

	const actions = useActions({
		getAttendancesQuantityTypes,
		getAsistenciasByTipo
	})

	useEffect(() => {
		if (student?.identidadId && subject?.id) {
			// debugger
			actions.getAttendancesQuantityTypes(
				student?.identidadId,
				subject?.id,
				period?.fechaPeriodoCalendarioId || 0
			)
		}
	}, [student, subject, period])

	useEffect(() => {
		if ((student?.identidadId && subject?.id, selectedType)) {
			actions.getAsistenciasByTipo(
				student?.identidadId,
				subject?.id,
				period?.fechaPeriodoCalendarioId || 0,
				selectedType?.tipoRegistroAsistenciaId
			)
		}
	}, [student, subject, period, selectedType])

	return (
		<Col>
			<div className="my-4">
				<Back onClick={() => setCurrentStudent(null)}>
					<BackIcon />
					<BackTitle>
						{t('edit_button>regresar', 'Regresar')}
					</BackTitle>
				</Back>
			</div>
			<div>
				<h4>
					{t(
						'gestion_grupos>asistencia>detalle_asistencia',
						'Detalle de asistencia'
					)}{' '}
					-{' '}
					{
						subject?.datosMallaCurricularAsignaturaInstitucion
							?.nombreAsignatura
					}
				</h4>
			</div>
			<div className="d-flex my-4 justify-content-between">
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
										search(searchValue).in(
											incidentTypes,
											Object.keys(incidentTypes[0])
										)
									)
								}}
							>
								{t('general>buscar', 'Buscar')}
							</Button>
						</StyledInputGroupAddon>
					</div>
				</div>
				<div className="" />
			</div>
			<TablesContainer className="mt-3">
				<CustomCard>
					<CardBody>
						<div
							className="d-flex align-items-center my-3"
							style={{ height: '4rem', marginBottom: '1rem' }}
						>
							{currentStudent > 0 && (
								<FaArrowAltCircleLeft
									style={{
										color: `${colors.primary}`,
										fontSize: '0.8rem',
										marginRight: '8px'
									}}
									onClick={() =>
										setCurrentStudent(
											(prevState) => prevState - 1
										)
									}
								/>
							)}
							<div
								style={{
									maxWidth: '14rem',
									fontSize: '1rem',
									textOverflow: 'ellipsis'
								}}
							>
								<div>
									{maxLengthString(
										student?.nombreCompleto,
										20
									)}
								</div>
							</div>
							{currentStudent !== students.length - 1 && (
								<FaArrowAltCircleRight
									style={{
										color: `${colors.primary}`,
										fontSize: '0.8rem',
										marginLeft: '8px',
										cursor: 'pointer'
									}}
									onClick={() =>
										setCurrentStudent(
											(prevState) => prevState + 1
										)
									}
								/>
							)}
						</div>
						<div
							className="d-flex align-items-center my-3"
							style={{ fontSize: '1rem' }}
						>
							{currentSubject > 0 && (
								<FaArrowAltCircleLeft
									style={{
										color: `${colors.primary}`,
										fontSize: '0.8rem',
										marginRight: '8px',
										cursor: 'pointer'
									}}
									onClick={() =>
										setCurrentSubject(
											(prevState) => prevState - 1
										)
									}
								/>
							)}
							<div style={{ padding: '0 .5rem' }}>
								{maxLengthString(
									subject
										?.datosMallaCurricularAsignaturaInstitucion
										?.nombreAsignatura || '',
									20
								)}
							</div>
							{currentSubject !== subjects.length - 1 && (
								<FaArrowAltCircleRight
									style={{
										color: `${colors.primary}`,
										fontSize: '0.8rem',
										marginLeft: '8px',
										cursor: 'pointer'
									}}
									onClick={() =>
										setCurrentSubject(
											(prevState) => prevState + 1
										)
									}
								/>
							)}
						</div>
						<Table>
							<thead>
								<tr>
									<th>
										{t(
											'gestion_grupo>asistencia>tipo_incidencia',
											'Tipo de incidencia'
										)}
									</th>
									<th>
										{t(
											'gestion_grupo>asistencia>cantidad',
											'Cantidad'
										)}
									</th>
								</tr>
							</thead>
							<tbody>
								{items?.map((item, index) => (
									<tr
										className={
											index % 2 !== 0 ? 'row-odd' : ''
										}
										key={item?.tipoAsistenciaNombre}
									>
										<td
											style={{
												color: '#145388',
												textDecoration: 'underline',
												cursor: 'pointer'
											}}
										>
											<span
												onClick={() =>
													setSelectedType(item)
												}
											>
												{item.tipoAsistenciaNombre}
											</span>
										</td>
										<td style={{ textAlign: 'center' }}>
											{item.cantidadTipoRegistroAsistencia ===
											0
												? '-'
												: item.cantidadTipoRegistroAsistencia}
										</td>
									</tr>
								))}
								{assistancesQuantity?.length === 0 && (
									<tr className="row-odd">
										<td />
										<td />
									</tr>
								)}
							</tbody>
						</Table>
					</CardBody>
				</CustomCard>
				<CustomCard>
					<CardBody>
						<div style={{ height: '4rem' }}>
							<div className="d-flex justify-content-between align-items-center">
								<h4>
									{t(
										'gestion_grupos>asistencia>historial_asistencia',
										'Historial de asistencia del estudiante'
									)}
								</h4>
								<ModalHistorial subject={subject} />
							</div>
						</div>
						{selectedType && (
							<DetailTable
								subject={subject}
								selectedStudent={student}
								data={data}
								toggle={() => {}}
								selectedPeriod={period}
							/>
						)}
					</CardBody>
				</CustomCard>
			</TablesContainer>
		</Col>
	)
}

export default AttendanceDetailsBySubject

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

const CustomCard = styled(Card)`
	width: 75%;

	@media screen and (min-width: 1024px) {
		width: 49%;
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

const Table = styled.table`
  width: 100%;

  thead th {
    padding: .5rem;
    background-color #145388;
    border: 1px solid #8f8f8f;
    color: #fff;
  }

  tbody tr {
    &.row-odd {
      background-color: #eaeaea;
    }

    td {
      padding: 1rem .5rem;
      border: 1px solid #8f8f8f;
    }
  }
`
