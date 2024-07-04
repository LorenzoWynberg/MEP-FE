import React, { useEffect } from 'react'
import styled from 'styled-components'
//import axios from 'axios'
//import { envVariables } from 'Constants/enviroment'
import { Calificacion } from '../../../../../api'
import {
	Button,
	InputGroupAddon,
	Dropdown,
	DropdownToggle,
	DropdownMenu,
	DropdownItem
} from 'reactstrap'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'

interface IProps {
	grupoId: number
	students: Array<any>
}
const collator = new Intl.Collator('es-Es', {
	sensitivity: 'base',
	ignorePunctuation: true
})
const CalificacionesGrupo: React.FC<IProps> = (props) => {
	const { t } = useTranslation()
	const [displayDropdown, setDisplayDropdown] = React.useState(false)
	const [selectedPeriodo, setSelectedPeriodo] = React.useState(null)
	const [asignaturas, setAsignaturas] = React.useState([])
	const [estudiantes, setEstudiantes] = React.useState([])
	const [estudiantesFiltrados, setEstudiantesFiltrados] = React.useState(null)
	const [filterName, setFilterName] = React.useState('')
	const mallaPeriodos = useSelector((store: any) => {
		return store.mallasCurriculares.bloquesPeriodos
	})

	const selectedActiveYear = useSelector((store: any) => {
		return store.authUser.selectedActiveYear
	})

	useEffect(() => {
		if (!mallaPeriodos) return
		if (Array.isArray(mallaPeriodos) && mallaPeriodos.length == 0) return
		onChangePeriodo(mallaPeriodos[0])
	}, [mallaPeriodos])

	const buildGridData = (fetchData) => {
		const { data } = fetchData

		setAsignaturas(data.asignaturas)
		const rows = data.estudiantes.map((i) => {
			const calificaciones = data.asignaturas.map((j) => {
				const c = i.calificaciones.find(
					(k) => k.asignatura.asignaturaId == j.asignaturaId
				)
				return { ...j, calificacion: c.notaFinal }
			})

			return {
				nombre: i.nombre,
				calificaciones
			}
		})
		setEstudiantes(rows)
	}
	const onChangePeriodo = (periodo) => {
		setSelectedPeriodo(periodo)
		// Aqui va logica de fetch de calificaciones
		Calificacion.fetchCalificacionesByPeriodoGrupoAnio(periodo.id, props.grupoId, selectedActiveYear.id)
			.then((data) => {
				buildGridData(data)
			})
			.catch((e) => {
				console.log(e)
			})
	}
	const onChangeFilter = (e) => {
		setFilterName(e.target.value)
		findEstudiante(e.target.value)
		if (e.target.value == '') {
			setEstudiantesFiltrados(null)
		}
	}
	const findEstudiante = (filter) => {
		const normalizedFilterValue = filter
			.normalize('NFD')
			.replace(/[\u0300-\u036f]/gi, '')
			.toLowerCase()
		const newState = estudiantes.filter((value) => {
			const normalizedValue = value.nombre
				.normalize('NFD')
				.replace(/[\u0300-\u036f]/gi, '')
				.toLowerCase()
			return normalizedValue.includes(normalizedFilterValue)
		})
		setEstudiantesFiltrados(newState)
	}
	const renderEstudiantesCalificacionList = () => {
		if (estudiantesFiltrados) {
			return estudiantesFiltrados.map((i, index) => {
				return (
					<tr key={index}>
						{i.calificaciones.map((j) => (
							<td>{j.calificacion}</td>
						))}
					</tr>
				)
			})
		} else {
			return estudiantes.map((i, index) => {
				return (
					<tr key={index}>
						{i.calificaciones.map((j, jindex) => (
							<td key={jindex}>{j.calificacion}</td>
						))}
					</tr>
				)
			})
		}
	}
	const renderEstudiantesList = (estFiltrados) => {
		if (estFiltrados) {
			return estFiltrados.map((i, index) => (
				<tr key={index}>
					<td>{i.nombre}</td>
				</tr>
			))
		} else {
			return estudiantes.map((i, index) => (
				<tr key={index}>
					<td>{i.nombre}</td>
				</tr>
			))
		}
	}
	return (
		<>
			<div
				style={{
					display: 'flex',
					width: '100%',
					justifyContent: 'space-between',
					marginTop: '1rem',
					marginBottom: '1rem'
				}}
			>
				<SearchContainer>
					<div className="search-sm--rounded">
						<input
							type="text"
							name="keyword"
							id="search"
							onChange={onChangeFilter}
							value={filterName}
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
								onClick={() => {}}
							>
								{t('general>buscar', 'Buscar')}
							</Button>
						</StyledInputGroupAddon>
					</div>
				</SearchContainer>
				<Dropdown
					isOpen={displayDropdown}
					toggle={
						() => {
							setDisplayDropdown((s) => !s)
						}
						//   setOpenModal((prevState) =>
						//     prevState === 'dropdown-period' ? '' : 'dropdown-period',
						//   )
					}
				>
					<CustomDropdownToggle caret color="primary">
						{selectedPeriodo?.nombre ||
							t(
								'gestion_grupos>escoge_periodo',
								'Escoge un periodo'
							)}
					</CustomDropdownToggle>
					<DropdownMenu>
						{mallaPeriodos.map((period) => (
							<DropdownItem
								onClick={() => onChangePeriodo(period)}
								key={period.id}
							>
								{period?.nombre}
							</DropdownItem>
						))}
						<DropdownItem
							onClick={() => onChangePeriodo({ id: null })}
						>
							{t('gestion_grupos>consolidado', 'Consolidado')}
						</DropdownItem>
					</DropdownMenu>
				</Dropdown>
			</div>
			<Card>
				<div
					style={{
						margin: '1rem',
						display: 'grid',
						width: '100%',
						gridTemplateColumns: '20% 80%'
					}}
				>
					<div>
						<Table>
							<thead>
								<tr>
									<th>
										<br />
									</th>
								</tr>
								<tr>
									<th>
										{t(
											'gestion_grupo>asistencia>estudiante',
											'Estudiante'
										)}
									</th>
								</tr>
							</thead>
							<tbody>
								{renderEstudiantesList(estudiantesFiltrados)}
								{/* {estudiantes.map((i) => (
                  <tr>
                    <td>{i.nombre}</td>
                  </tr>
                ))} */}
							</tbody>
						</Table>
					</div>
					<div style={{ overflowX: 'scroll' }}>
						<Table tablaNotas>
							<thead>
								<tr>
									<th
										style={{ textTransform: 'uppercase' }}
										colSpan={asignaturas.length}
									>
										{t(
											'configuracion>mallas_curriculares>columna_asignatura_figura_afin',
											'Asignatura/figura afín'
										)}
									</th>
								</tr>
								<tr>
									{asignaturas.map((i) => (
										<th>{i.nombre}</th>
									))}
								</tr>
							</thead>
							<tbody>
								{renderEstudiantesCalificacionList()}
								{/* {estudiantes.map((i) => {
                  return (
                    <tr>
                      {i.calificaciones.map((j) => (
                        <td>{j.calificacion}</td>
                      ))}
                    </tr>
                  )
                })} */}
							</tbody>
						</Table>
					</div>
				</div>
			</Card>
		</>
	)
}
const Card = styled.div`
	border-radius: 15px;
	min-width: 100%;
	min-height: 100%;
	border-color: gray;
	background: white;
	padding: 15px;
`
const Table = styled.table`
	width: 100%;
	tbody tr td {
		border-left: solid 1px gray;
		border-right: solid 1px gray;
		padding: 10px;
		${(props) => props.tablaNotas && 'text-align: center;'}
	}
	thead > tr:first-child {
		th {
			background: ${(props) => props.theme.primary};
			color: white;
		}
	}
	thead th {
		background: lightgray;
		padding: 10px;
		text-align: center;
		border: solid 1px gray;
	}
	tr:nth-child(even) {
		background: lightgray;
	}
	tbody tr:last-child {
		td {
			border-bottom: solid 1px gray;
		}
	}
`

const SearchContainer = styled.div`
	width: 32vw;
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

export default CalificacionesGrupo
