import React, { useEffect, useState, useMemo, useCallback } from 'react'
import { Col, Row, Container } from 'reactstrap'
import AppLayout from 'Layout/AppLayout'
import directorItems from 'Constants/directorMenu'
import {
	getStudentDataFilter,
	getStudentsSCE,
	clearDataFilter
} from '../../../../redux/expedienteEstudiantil/actions.js'
import { useActions } from 'Hooks/useActions'
import { useSelector } from 'react-redux'
import withRouter from 'react-router-dom/withRouter'
import { Helmet } from 'react-helmet'
import { TableReactImplementation } from 'Components/TableReactImplementation'
import { RiFileInfoLine } from 'react-icons/ri'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import BarLoader from 'Components/barLoader/barLoader'
import colors from 'Assets/js/colors'
import swal from 'sweetalert'

import { useTranslation } from 'react-i18next'
import { useHistory } from 'react-router'
import {
	GetServicioComunalByInstitucionId,
	getTablaEstudiantesServicioComunalById
} from '../../../../redux/configuracion/actions'
import { Button } from '@material-ui/core'

const BuscadorPersonasServicioComunal = props => {
	const [t] = useTranslation()
	const [fallecidos, setFallecidos] = useState<boolean>(false)
	const [data, setData] = useState<object[]>([])
	const [soloEstudiantes, setSoloEstudiantes] = useState<boolean>(false)
	const idInstitucion = localStorage.getItem('idInstitucion')
	const [firstCalled, setFirstCalled] = useState(false)
	const [loading, setLoading] = useState(false)

	const history = useHistory()

	const actions = useActions({
		getStudentDataFilter,
		getStudentsSCE,
		clearDataFilter,
		getTablaEstudiantesServicioComunalById
	})

	const columns = useMemo(() => {
		return [
			{
				Header: t('estudiantes>buscador_per>col_id', 'Identificación'),
				column: 'identificacion',
				accessor: 'identificacion',
				label: ''
			},
			{
				Header: t(
					'servicio_comunal_table>registro_servicio_comunal>agregar_estudiante>nombre',
					'Nombre completo'
				),
				column: 'nombreEstudiante',
				accessor: 'nombreEstudiante',
				label: ''
			},
			{
				Header: t(
					'servicio_comunal_table>registro_servicio_comunal>agregar_estudiante>nacionalidad',
					'Nacionalidad'
				),
				column: 'nacionalidad',
				accessor: 'nacionalidad',
				label: ''
			},
			{
				Header: t('servicio_comunal_table>registro_servicio_comunal>agregar_estudiante>genero', 'Género'),
				column: 'género',
				accessor: 'genero',
				label: ''
			},
			/*  {
      Header: 'Estado de la persona',
      column: 'estadoP',
      accessor: 'estadoP',
      label: '',
    }, */
			{
				Header: t(
					'servicio_comunal_table>registro_servicio_comunal>agregar_estudiante>fecha_nacimiento',
					'Fecha de nacimiento'
				),
				column: 'fechaNacimiento',
				accessor: 'fechaNacimiento',
				label: ''
			},
			{
				Header: t('servicio_comunal_table>registro_servicio_comunal>agregar_estudiante>edad', 'Edad'),
				column: 'edad',
				accessor: 'edad',
				label: ''
			},
			{
				Header: t(
					'servicio_comunal_table>registro_servicio_comunal>agregar_estudiante>discapacidad',
					'Discapacidad'
				),
				column: 'discapacidad',
				accessor: 'discapacidad',
				label: ''
			},
			{
				Header: t('general>acciones', 'Acciones'),
				column: 'actions',
				accessor: 'actions',
				label: '',
				Cell: ({ cell, row, data }) => {
					const fullRow = data[row.index]
					return (
						<div className='d-flex justify-content-center align-items-center'>
							<Button
								class='sc-iqcoie bQFwPO cursor-pointer'
								primary
								onClick={() => {
									let array = [...props.estudiantes]
									const studentExists = array.some(
										student => student.idEstudiante === fullRow.idEstudiante
									)

									if (!studentExists) {
										array.push(fullRow)
										props.setEstudiantes(array)
									}
								}}
							>
								{/* TODO: i18n */}
								Agregar
							</Button>
						</div>
					)
				}
			}
		]
	}, [t, props.estudiantes])

	useEffect(() => {
		setFirstCalled(true)
		return () => {
			actions.clearDataFilter()
		}
	}, [])

	const state = useSelector(store => {
		return {
			...store.expedienteEstudiantil
		}
	})

	useEffect(() => {
		setData(
			state.estudiantes.map(item => {
				return {
					...item,
					estadoP: !item.fallecido ? 'Activo' : 'Fallecido',
					institucion: `${item.codigoinstitucion} ${item.institucion}`,
					fechaNacimiento: item.fechaNacimiento
				}
			})
		)
		{
			if (state.estudiantes.length === 1) {
				if (state.estudiantes[0].fallecido) {
					swal({
						icon: 'info',
						text: 'La persona estudiante que está consultando se encuentra registrada como FALLECIDA, por lo cual hay funcionalidades en el sistema que solamente son de consulta.',
						buttons: {
							ok: {
								text: 'Aceptar',
								value: true
							}
						}
					})
				}
			}
		}
	}, [state.estudiantes])

	useEffect(() => {
		setLoading(true)
		let val = document.getElementById('servicioComunalSearch').value
		if (val != '') {
			actions.getStudentsSCE(val, idInstitucion, 1, 30).then(() => setLoading(false))
		} else {
			setLoading(false)
		}
	}, [])

	return (
		<AppLayout items={directorItems}>
			{loading && <BarLoader />}
			<Helmet>
				<title>Buscador de personas</title>
			</Helmet>

			<Container>
				<Row>
					<Col xs={12}>
						<h3>
							{t(
								'servicio_comunal_table>registro_servicio_comunal>agregar_estudiante>titulo',
								'Agregar estudiante'
							)}
						</h3>
					</Col>
					<Col
						xs={12}
						style={{
							display: 'flex',
							flexDirection: 'column',
							alignItems: 'flex-end',
							width: '100%'
						}}
					/>
					<Col xs={12}>
						<div>
							<TableReactImplementation
								data={data}
								handleGetData={async (searchValue: string, column: string | undefined | null) => {
									// if (!searchValue) return
									setLoading(true)
									await actions.getStudentsSCE(searchValue, idInstitucion, 1, null)
									setLoading(false)
								}}
								columns={columns}
								orderOptions={[]}
								pageSize={10}
								backendSearch
							/>
						</div>
					</Col>
				</Row>
			</Container>
		</AppLayout>
	)
}

export default withRouter(BuscadorPersonasServicioComunal)
