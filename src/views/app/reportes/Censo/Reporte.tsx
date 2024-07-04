import React from 'react'
import styled from 'styled-components'
import ReportHeader from '../_partials/ReportHeader'
import { getYearsOld } from '../../../../utils/years'
import { useSelector } from 'react-redux'
import moment from 'moment'
import { uniqBy } from 'lodash'

const formatter = Intl.DateTimeFormat('es-ES', {
	dateStyle: 'full',
	timeStyle: 'short',
	hour12: true
})
const ReporteRegistroEstudiantes = ({ reportData, innerRef, ofertaLabel }) => {
	const state = useSelector<any, any>((store) => {
		return {
			user: store.authUser.authObject.user
		}
	})
	const tableData = React.useMemo(() => {
		const data = reportData || []
		return {
			data
		}
	}, [])

	const Row = (key, item) => {
		return (
			<tr key={key}>
				<td>{key + 1}</td>
				<td>{item.identificacion}</td>
				<td>{item.nombre}</td>
				<td>{item.primerApellido}</td>
				<td>{item.segundoApellido}</td>
				<td>{item.fechaNacimiento}</td>
				<td>{item.edad}</td>
				<td>{item.genero}</td>
				<td>{item.condicionMatricula}</td>
				<td>{item.condicionFinal}</td>
			</tr>
		)
	}
	const contarCensos = () => {
		let data = tableData.data

		let _estudiantes = uniqBy(data, 'matriculaId')
		_estudiantes = _estudiantes.filter(
			(e: any) =>
				Boolean(e.condicionFinalId) &&
				(e.estadoId === 1 || e.estadoId === 3)
		)
		return _estudiantes.length
	}

	const contarEStudiantes = () => {
		let data = tableData.data
		let _estudiantes = uniqBy(data, 'matriculaId')
		_estudiantes = _estudiantes.filter(
			(e: any) => e.estadoId === 1 || e.estadoId === 3
		)
		return _estudiantes.length
	}

	return (
		<div ref={innerRef}>
			<Card>
				<ReportHeader mostrarContactoInstitucion />
				<div className="mt-2">
					<p className="m-0">
						Total de estudiantes:
						<b className="ml-1">{contarEStudiantes()}</b>
					</p>
					<p className="m-0">
						Estudiantes Censados:
						<b className="ml-1">{contarCensos()}</b>
					</p>
					<p className="m-0">
						Estudiantes Pendientes:
						<b className="ml-1">
							{contarEStudiantes() - contarCensos()}
						</b>
					</p>
				</div>
				<SeccionCentrada>
					<p>
						{`${ofertaLabel.ofertaNombre} / 
            ${ofertaLabel.modalidadNombre} / 
            ${ofertaLabel.servicioNombre} / 
             ${ofertaLabel.nivelNombre} / 
             ${ofertaLabel.especialidadNombre}

            `}
					</p>
					<p>
						<b>
							Censo final 2023 - registro de condición final del
							estudiante
						</b>
					</p>
				</SeccionCentrada>

				<p>
					<Table>
						<thead>
							<th className="py-1">N°</th>
							<th>Número de identificación</th>
							<th>Nombre</th>
							<th>Primer apellido</th>
							<th>Segundo apellido</th>
							<th>Fecha de nacimiento</th>
							<th>Edad</th>
							<th>Identidad de género</th>
							<th>Condición matrícula</th>
							<th>Condición final</th>
						</thead>
						<tbody>
							{tableData.data.map((item, index) =>
								Row(index, item)
							)}
						</tbody>
					</Table>
				</p>
				<p>
					<Linea />
				</p>
				<Seccion>
					<p>
						Reporte emitido por el usuario: {state.user.userName},
						el {formatter.format(new Date(Date.now()))}
					</p>
				</Seccion>
			</Card>
		</div>
	)
}

const Table = styled.div`
	border-collapse: collapse;
	thead {
		font-width: bold;
		text-align: center;
	}
	th {
		border: solid 1px;
		padding: 2px;
	}
	td {
		text-align: center;
		border: solid 1px;
		padding: 2px;
	}
`

const Card = styled.div`
	border-radius: 15px;
	min-width: 100%;
	min-height: 100%;
	border-color: gray;
	background: white;
	padding: 15px;
`
const Linea = styled.hr`
	width: 100%;
	background-color: black;
	height: 1px;
	border: none;
	margin: 0;
`
const Seccion = styled.section`
	text-align: center;
`
const SeccionCentrada = styled.section`
	font-weight: bold;
	text-align: center;
	margin-top: 1rem;
`
export default ReporteRegistroEstudiantes
