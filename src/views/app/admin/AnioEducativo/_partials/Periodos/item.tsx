import React, { useState, useEffect, useMemo } from 'react'
import CardContent from '@material-ui/core/CardContent'
import Card from '@material-ui/core/Card'
import styled from 'styled-components'
import { Button } from 'reactstrap'
import moment from 'moment'
import { TableReactImplementation } from 'Components/TableReactImplementation'
import { useTranslation } from 'react-i18next'

interface IProps {
	data: any
	onDisabled: Function
	onEdit: Function
}
const formatter = new Intl.NumberFormat('es-NI', { maximumFractionDigits: 2 })
const ItemPeriodo: React.FC<IProps> = props => {
	const { t } = useTranslation()

	const { data, onDisabled, onEdit } = props
	const [rows, setRows] = useState<any[]>([])

	useEffect(() => {
		const _data = data.fechaPeriodoCalendario.map(item => {
			return {
				...item,
				fechaInicioP: moment(item.fechaInicio).format('DD/MM/YYYY'),
				fechaFinalP: moment(item.fechaFin).format('DD/MM/YYYY'),
				fechaCierreP: moment(item.fechaCierre).format('DD/MM/YYYY'),
				porcentajeP: formatter.format(parseFloat(item.porcentaje)) + '%'
			}
		})
		setRows(_data)
	}, [data])

	const tableData = useMemo(() => {
		return rows
	}, [rows])

	const columns = useMemo(() => {
		return [
			{
				column: 'nombre',
				label: 'Nombre',
				accessor: 'nombre',
				Header: t(
					'configuracion>anio_educativo>columna_acciones>ver>calendarios_asociados>agregar_calendarios>periodos>columna_nombre',
					'Nombre'
				)
			},
			{
				column: 'fechaInicioP',
				label: 'Fecha inicio',
				accessor: 'fechaInicioP',
				Header: t(
					'configuracion>anio_educativo>columna_acciones>ver>calendarios_asociados>agregar_calendarios>periodos>columna_fecha_inicio',
					'Fecha inicio'
				)
			},
			{
				column: 'fechaFinalP',
				label: 'Fecha de finalización',
				accessor: 'fechaFinalP',
				Header: t(
					'configuracion>anio_educativo>columna_acciones>ver>calendarios_asociados>agregar_calendarios>periodos>columna_fehca_finalizacion',
					'Fecha de finalización'
				)
			},
			{
				column: 'fechaCierreP',
				label: 'Fecha cierre',
				accessor: 'fechaCierreP',
				Header: t(
					'configuracion>anio_educativo>columna_acciones>ver>calendarios_asociados>agregar_calendarios>periodos>columna_fecha_cierre',
					'Fecha cierre'
				)
			},
			{
				column: 'porcentajeP',
				label: 'Porcentaje',
				accessor: 'porcentajeP',
				Header: t(
					'configuracion>anio_educativo>columna_acciones>ver>calendarios_asociados>agregar_calendarios>periodos>columna_porcentaje',
					'Porcentaje'
				)
			}
		]
	}, [tableData, t])

	return (
		<Card className='mb-3'>
			<CardContent>
				<CardHeader>
					<CardHeaderLabel>{data.nombre}</CardHeaderLabel>
					<Buttons>
						<Button color='primary' className='mr-4' onClick={() => onDisabled(data)}>
							Eliminar
						</Button>
						<Button color='primary' onClick={() => onEdit(data)}>
							{t(
								'configuracion>anio_educativo>columna_acciones>ver>calendarios_asociados>agregar_calendarios>periodos>editar_periodo>editar_periodo',
								'Editar periodo'
							)}
						</Button>
					</Buttons>
				</CardHeader>
				{/* <Table
          minWidth={'auto'}
          selectable={false}
          columns={columns}
          rows={rows}
        /> */}
				<TableReactImplementation columns={columns} avoidSearch data={rows} />
			</CardContent>
		</Card>
	)
}
const CardHeader = styled.div`
	padding: 10px 0;
	display: flex;
	align-items: center;
	justify-content: space-between;
`
const Buttons = styled.div`
	padding: 10px 0;
	display: flex;
	align-items: center;
	justify-content: space-between;
`
const CardHeaderLabel = styled.h4`
	margin: 0;
	span {
		width: 100%;
		position: relative;
		float: left;
		font-size: 12px;
		color: #908a8a;
		font-weight: 600;
	}
`
export default ItemPeriodo
