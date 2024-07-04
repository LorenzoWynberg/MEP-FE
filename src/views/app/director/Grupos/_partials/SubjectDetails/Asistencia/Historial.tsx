import React, { useEffect, useMemo, useState } from 'react'
import { Button, Modal, ModalBody, ModalHeader, ModalFooter } from 'reactstrap'
import colors from 'Assets/js/colors'
import UpdateIcon from '@mui/icons-material/Update'
import TableFilter from '../../../../../../../components/Table-filter/Table'
import moment from 'moment'
import { getBitacoraAsistencia } from 'Redux/Asistencias/actions'
import { useActions } from 'Hooks/useActions'
import { useSelector } from 'react-redux'
import { TableReactImplementation } from 'Components/TableReactImplementation'
import { useTranslation } from 'react-i18next'

const ModalHistorial = (props) => {
	const { t } = useTranslation()
	const [modalHistory, setModalHistory] = useState(false)
	const [data, setData] = useState([])
	const bitacora = useSelector((store) => store.asistencias.historial)
	const actions = useActions({ getBitacoraAsistencia })

	useEffect(() => {
		// debugger
		const grupoId = props.subject?.sb_gruposId || props.subject?.gruposId
		const asignaturaId =
			props.subject?.datosMallaCurricularAsignaturaInstitucion
				?.sb_asignaturaId || props?.subject?.asignaturaId
		actions.getBitacoraAsistencia(grupoId, asignaturaId)
	}, [modalHistory])

	useEffect(() => {
		setData(
			bitacora.map((el) => {
				const jsonParsed = JSON.parse(el.json)
				const _data = Array.isArray(jsonParsed)
					? jsonParsed[0]
					: jsonParsed
				return {
					...el,
					..._data.Datos[0],
					fechaActualizacion: moment(el.fechaActualizacion).format(
						'DD/MM/yyyy'
					),
					horaRatificacion: moment(el.fechaActualizacion).format(
						'hh:mm a'
					)
				}
			})
		)
	}, [bitacora])

	const toggle = () => {
		setModalHistory(!modalHistory)
	}

	const columns = React.useMemo(
		() => [
			{
				Header: t('gestion_grupo>asistencia>estudiante', 'Estudiante'),
				accessor: 'estudiante'
			},
			{
				Header: t(
					'estudiantes>buscador_per>info_cuenta>historial_cambios>colum_accion',
					'Acción'
				),
				accessor: 'accion'
			},
			{
				Header: t(
					'gestion_grupo>asistencia>historia>registrados_cambio',
					'Registrador del cambio'
				),
				accessor: 'docente',
				width: '14rem'
			},
			{
				Header: t(
					'gestion_grupo>asistencia>historia>fecha_cambio',
					'Fecha del cambio'
				),
				accessor: 'fechaActualizacion'
			},
			{
				Header: t(
					'gestion_grupo>asistencia>historia>hora_cambio',
					'Hora del cambio'
				),
				accessor: 'horaRatificacion'
			}
		],
		[t]
	)

	const tableData = useMemo(() => {
		return data
	}, [data, t])
	return (
		<>
			<Button
				style={{ backgroundColor: `${colors.primary}` }}
				className="btn-history"
				onClick={toggle}
			>
				<div className="d-flex justify-content-center align-items-center">
					<UpdateIcon
						style={{ marginRight: '4px', fontSize: '16px' }}
					/>{' '}
					{t(
						'gestion_grupos>asistencia>historia>boton',
						'Historial de cambios'
					)}
				</div>
			</Button>
			<Modal
				size="lg"
				style={{ maxWidth: '1400px', width: '80%' }}
				isOpen={modalHistory}
				toggle={toggle}
				scrollable
			>
				<ModalHeader toggle={toggle}>
					{t(
						'gestion_grupos>asistencia>historia>boton',
						'Historial de cambios'
					)}
				</ModalHeader>
				<div style={{ padding: '2rem' }}>
					<ModalBody style={{ overflowX: 'scroll', padding: 0 }}>
						<div
							style={{
								width: '1275px',
								margin: '0 auto',
								minHeight: '14rem'
							}}
						>
							<TableFilter
								avoidFilter
								columns={columns}
								data={data || []}
							/>
							{/* <TableReactImplementation
                columns={columns}
                avoidSearch
                data={tableData}
              /> */}
						</div>
					</ModalBody>
				</div>
				<ModalFooter
					style={{ display: 'flex', justifyContent: 'center' }}
				>
					<Button color="primary" onClick={toggle}>
						{t(
							'configuracion>mallas_curriculares>indicadores_aprendizaje>boton>previsualizar>boton>cerrar',
							'Cerrar'
						)}
					</Button>
				</ModalFooter>
			</Modal>
		</>
	)
}

export default ModalHistorial
