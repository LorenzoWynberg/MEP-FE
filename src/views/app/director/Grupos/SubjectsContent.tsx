import React, { useEffect, useState } from 'react'
import { Col } from 'reactstrap'
import { CardContent, Card } from './styles'
import Loader from 'Components/Loader'
import { Close } from '@material-ui/icons'
import styled from 'styled-components'
import HTMLTable from 'Components/HTMLTable'
import { useSelector } from 'react-redux'
import Select from 'react-select'
import { useTranslation } from 'react-i18next'
import { verificarAcceso } from 'Hoc/verificarAcceso'

const MenuView = ({ subject, onClick, t }) => (
	<Col xs={12} md={3} key={subject.id}>
		<Card onClick={onClick} style={{ cursor: 'pointer' }}>
			<div className='img_overlay' />
			<div
				style={{
					backgroundImage: 'url(/assets/img/gruposUnassigned.png)',
					backgroundPosition: 'center',
					height: '58%',
					backgroundSize: 'auto',
					backgroundRepeat: 'no-repeat'
				}}
			/>
			<CardContent>
				<>
					<div className='d-flex justify-content-between align-items-star'>
						<div>
							<h6>
								{subject.datosGrupo.nombre}{' '}
								{
									subject
										.datosMallaCurricularAsignaturaInstitucion
										.nombreAsignatura
								}
							</h6>
						</div>
						{/* {subject.isMultiLevel && (
              <Badge
                color="primary"
                style={{ height: '2rem', fontSize: '0.9rem' }}
              >
                Multinivel
              </Badge>
            )} */}
					</div>
					<br />
					<div className='d-flex w-100 justify-content-between'>
						<p>
							{subject.hombres + subject.mujeres}{' '}
							{t(
								'estudiantes>registro_matricula>matricula_estudian>estudian_matriculados',
								'Estudiantes matriculados'
							)}
						</p>
						<div className='d-flex'>
							<i className='icon-Female pink' />
							<p className='pink'>{subject.mujeres}</p>
							<i className='icon-Male blue' />
							<p className='blue'>{subject.hombres}</p>
						</div>
					</div>
				</>
			</CardContent>
		</Card>
	</Col>
)

const CalendarView = ({ t }) => (
	<CalendarContainer>
		<h1 className='title'>
			{t(
				'gestion_grupos>calendario_titulo',
				'Visualiza información por horarios'
			)}
		</h1>
		<p className='description'>
			{t(
				'gestion_grupos>calendario_descripcion',
				'Para visualizar la información por horarios seleccione el filtro por grupoo docente'
			)}
		</p>
		<img src='/assets/img/saber_info_blank.svg' alt='' />
	</CalendarContainer>
)

const SubjectsContent = ({
	loading = false,
	setSubjectSelected = val => {},
	selectedSubject,
	data,
	filters,
	setFilters,
	verificarAcceso
}) => {
	const { t } = useTranslation()

	const [viewMode, setViewMode] = useState<'list' | 'menu' | 'calendar' | ''>(
		'menu'
	)

	const state: any = useSelector(store => {
		return {
			...store.asignaturaGrupo,
			...store.authUser,
			...store.grupos
		}
	})

	useEffect(() => {
		if (data.length > 0 && selectedSubject) {
			const index = data.findIndex(el => el.id === selectedSubject?.id)

			if (index !== -1) {
				setSubjectSelected(data[index])
			}
		}
	}, [data, state.update])

	const subjectsName = state.asignaturasGruposByNivelOferta.reduce(
		(acc, cur) => {
			if (
				!acc.find(
					el =>
						el.name ===
						cur.datosMallaCurricularAsignaturaInstitucion
							.nombreAsignatura
				)
			) {
				acc.push({
					id: cur.datosMallaCurricularAsignaturaInstitucion.id,
					name: cur.datosMallaCurricularAsignaturaInstitucion
						.nombreAsignatura
				})
			}
			return acc
		},
		[]
	)

	if (!verificarAcceso('asignaturaafinpornivel', 'leer')) {
		return <></>
	}

	if (loading) {
		return <Loader />
	}

	return (
		<>
			<Col className='col-md-12'>
				<div className='d-flex justify-content-between align-items-center w-100'>
					<Col>
						<div className='d-flex'>
							<div style={{ width: '15rem' }} className='mr-2'>
								<Select
									placeholder={t(
										'gestion_grupos>placeholder>filtrar_grupo',
										'Filtrar por grupo'
									)}
									value={
										filters.sb_gruposId
											? {
													label:
														filters?.sb_gruposId
															?.grupo ||
														t(
															'gestion_grupos>placeholder>filtrar_grupo',
															'Filtrar por grupo'
														),
													value:
														filters?.sb_gruposId
															?.grupoId ||
														'Filtrar por grupo'
											  }
											: null
									}
									options={state.groups.map(group => ({
										...group,
										label: group.grupo,
										value: group.grupoId
									}))}
									noOptionsMessage={() =>
										t('general>no_opt', 'Sin opciones')
									}
									onChange={e => {
										setFilters({
											...filters,
											sb_gruposId: e
										})
									}}
									styles={{
										control: styles => ({
											...styles,
											borderRadius: '20px',
											border: '1px solid #000'
										}),
										indicatorSeparator: styles => ({
											...styles,
											display: 'none'
										})
									}}
								/>
							</div>
							<div style={{ width: '15rem' }}>
								<Select
									placeholder={t(
										'gestion_grupos>placeholder>filtrar_asignatura',
										'Filtrar por asignatura'
									)}
									value={
										filters?.subject
											? {
													label:
														filters?.subject
															?.name ||
														t(
															'gestion_grupos>placeholder>filtrar_asignatura',
															'Filtrar por asignatura'
														),
													value:
														filters?.subject?.id ||
														'Filtrar por asignatura'
											  }
											: null
									}
									options={subjectsName
										.map(subject => ({
											...subject,
											label: subject.name,
											value: subject.id
										}))
										.sort((a, b) =>
											a.name > b.name
												? 1
												: a.name < b.name
												? -1
												: 0
										)}
									noOptionsMessage={() =>
										t('general>no_opt', 'Sin opciones')
									}
									onChange={e => {
										setFilters({ ...filters, subject: e })
									}}
									styles={{
										control: styles => ({
											...styles,
											borderRadius: '20px',
											border: '1px solid #000'
										}),
										indicatorSeparator: styles => ({
											...styles,
											display: 'none'
										})
									}}
								/>
							</div>
						</div>
					</Col>
					<Col className='d-flex justify-content-end'>
						<Icon
							className={`simple-icon-calendar ${
								viewMode === 'calendar'
									? 'view-modes-selected'
									: ''
							}`}
							onClick={() =>
								setViewMode(prevState =>
									prevState === 'calendar'
										? 'menu'
										: 'calendar'
								)
							}
						/>
						<Icon
							className={`simple-icon-list ${
								viewMode === 'list' ? 'view-modes-selected' : ''
							}`}
							onClick={() =>
								setViewMode(prevState =>
									prevState === 'list' ? 'menu' : 'list'
								)
							}
						/>
						<Icon
							className={`simple-icon-grid ${
								viewMode === 'menu' ? 'view-modes-selected' : ''
							}`}
							onClick={() => setViewMode('menu')}
						/>
					</Col>
				</div>
			</Col>
			<div className='row'>
				<Col
					style={{
						height: '.5rem',
						marginTop: '1rem',
						display: 'flex'
					}}
				>
					{Object.keys(filters).map(filter => {
						return filters[filter].id || filters[filter].grupoId ? (
							<div
								className='mr-2'
								style={{ width: 'max-content' }}
								key={filter}
							>
								<p className='btn d-flex align-items-center btn-disabled bg-primary'>
									{filter === 'sb_gruposId'
										? `Grupo: ${filters[filter].grupo}`
										: filters[filter].name}
									<Close
										fontSize='small'
										onClick={() =>
											setFilters({
												...filters,
												[filter]: ''
											})
										}
										className='ml-2 btn-primary rounded'
									/>
								</p>
							</div>
						) : null
					})}
				</Col>
			</div>
			<div className='row mt-5 col-12' style={{ width: '100%' }}>
				{viewMode === 'menu' &&
					data.map((subject, i) => (
						<MenuView
							t={t}
							subject={subject}
							onClick={() => {
								if (data.length > 0 && subject) {
									const index = data.findIndex(
										el => el.id === subject?.id
									)

									if (index !== -1) {
										setSubjectSelected(data[index])
									}
								}
							}}
							key={i}
						/>
					))}
				{viewMode === 'list' && (
					<TableContainer>
						<HTMLTable
							columns={[
								{
									label: t(
										'gestion_grupos>columna_asignatura',
										'Asignaturas/figuras afines por nivel'
									),
									column: 'nombreAsignatura'
								},
								{
									label: t(
										'gestion_grupos>columa_docente',
										'Docentes'
									),
									column: 'teacher'
								},
								{
									label: t(
										'estudiantes>registro_matricula>matricula_estudian>estudian_matriculados',
										'Estudiantes matriculados'
									),
									column: 'hombres'
								}
							]}
							startIcon
							selectDisplayMode='datalist'
							data={data.map(subject => {
								return {
									...subject,
									nombreAsignatura:
										subject.datosGrupo.nombre +
										' ' +
										subject
											.datosMallaCurricularAsignaturaInstitucion
											.nombreAsignatura,
									id: subject.id,
									estudiantesMatriculados:
										subject.hombres + subject.mujeres,
									teacher: subject.teacher
								}
							})}
							width={100}
							loading={false}
							PageHeading={false}
							hideMultipleOptions
							toggleEditModal={() => {}}
						/>
					</TableContainer>
				)}
				<Col>{viewMode === 'calendar' && <CalendarView t={t} />}</Col>
			</div>
		</>
	)
}

const Icon = styled.i`
	font-size: 1.5rem;
	cursor: pointer;
	margin-left: 1rem;
	&:hover {
		color: #145388;
	}

	&.view-modes-selected {
		color: #145388;
	}
`

const TableContainer = styled.div`
	width: 100%;
	& > div {
		width: 100%;
	}
`

const CalendarContainer = styled.div`
	width: 100%;
	margin: 0 auto;
	height: auto;
	background-color: #fff;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	border-radius: 10px;
	padding: 3rem 0;

	p {
		font-size: 1rem;
	}
`

export default verificarAcceso(SubjectsContent)
