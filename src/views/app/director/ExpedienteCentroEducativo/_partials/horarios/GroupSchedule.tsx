import React, { useEffect, useState } from 'react'
import GenericSchedule from './GenericSchedule'
import styled from 'styled-components'
import { Col, FormGroup, Input, Button } from 'reactstrap'
import ReactToPrint from 'react-to-print'
import { useSelector } from 'react-redux'
import moment from 'moment'
import Tooltip from '@mui/material/Tooltip'
import Select from 'react-select'
import { useTranslation } from 'react-i18next'

const GroupSchedule = ({ days }) => {
	const { t } = useTranslation()
	const [selectedGroup, setSelectedGroup] = useState(null)
	const [printRef, setPrintRef] = useState<any>(null)
	const [print, setPrint] = useState(false)
	const [schedule, setSchedule] = useState([])
	const { lections } = useSelector((state) => state.lecciones)
	const { lectionsSubjectGroup } = useSelector(
		(state) => state.leccionAsignaturaGrupo
	)
	const { groupsByOffer: groups } = useSelector((state) => state.grupos)

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
		const newSchedule = createSchedule()
		setSchedule(newSchedule)
	}, [lections])

	useEffect(() => {
		if (groups.length > 0) {
			setSelectedGroup(groups[0])
		}
	}, [groups])

	useEffect(() => {
		if (schedule.length > 0) {
			const newSchedule = JSON.parse(JSON.stringify(createSchedule()))
			lections.forEach((lection, index) => {
				lectionsSubjectGroup[lection.id] &&
					lectionsSubjectGroup[lection.id].forEach((item) => {
						if (
							index !== -1 &&
							item?.gruposId === selectedGroup?.id
						) {
							newSchedule[index][item.diaSemana - 1] = item
						}
					})
			})
			setSchedule(newSchedule)
		}
	}, [lectionsSubjectGroup, selectedGroup])

	return (
		<Col>
			<Container ref={(ref) => setPrintRef(ref)}>
				<div className="d-flex justify-content-between w-100">
					<div className="">
						<h6>{t('expediente_ce>horario>selec_grupo','Selecciona el grupo')}</h6>
						{!print && (
							<FormGroup>
								<Select
									placeholder={t("general>placeholder>seleccione_grupo","Seleccione un grupo")}
									onChange={(e) =>
										setSelectedGroup(JSON.parse(e.value))
									}
									options={groups.map((el, i) => ({
										value: JSON.stringify(el),
										label: el?.nombre
									}))}
									styles={{
										control: (styles) => ({
											...styles,
											width: '15rem',
											borderRadius: '20px',
											border: '1px solid #000'
										}),
										indicatorSeparator: (styles) => ({
											...styles,
											display: 'none'
										})
									}}
								/>
							</FormGroup>
						)}
					</div>
					<div className="d-flex">
						<div>
							<ReactToPrint
								trigger={() => (
									<Button color="primary">
										<i className="simple-icon-printer mr-2" />
										<span>{t("estudiantes>indentidad_per>imp_doc>imprimir", "Imprimir")}</span>
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
											{t("configuracion>mallas_curriculares>columna_asignatura_figura_afin", "Asignatura/figura afín")}:{' '}
											{subjectName?.toUpperCase()}
										</p>

										<p>
											{t("expediente_ce>horario>docente_titular", "Docente titular")}:{' '}
											{el?.nombreProfesor}{' '}
											{el?.profesorprimerApellido}
										</p>
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
										<p
											style={{
												margin: 0,
												fontWeight: 'bold'
											}}
										>
											{el?.nombreProfesor}{' '}
											{el?.profesorprimerApellido}
										</p>
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

export default GroupSchedule
