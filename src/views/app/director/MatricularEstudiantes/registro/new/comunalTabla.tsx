import React, { useState, useEffect, useMemo } from 'react'
import { TableReactImplementationServicio } from 'Components/TableReactImplementationServicio'
import ContextualMenu from 'Components/TableReactImplementation/ContextualMenu'
import { getYearsOld } from 'Utils/years'
import { Card, CardBody } from 'reactstrap'
import { Colxx } from 'Components/common/CustomBootstrap'
import { format, parseISO } from 'date-fns'
import colors from 'Assets/js/colors'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { Button } from '@material-ui/core'

interface IProps {
	data: Array<any>
	onSelectedStudent: Function
	hasEditAccess: boolean
	handleGetData?: Function
	closeContextualMenu?: boolean
	onlyViewModule: boolean
}

const ComunalTabla: React.FC<IProps> = props => {
	const { t } = useTranslation()
	const { data, onSelectedStudent, hasEditAccess, onlyViewModule, closeContextualMenu = false } = props

	const [students, setStudents] = useState([])

	const roles = useSelector((store: any) => store.authUser?.authObject?.user?.rolesOrganizaciones)

	useEffect(() => {
		const _data = data.map(mapper)
		setStudents(_data)
	}, [data])

	const mapper = el => {
		return {
			...el,
			id: el.matriculaId,
			image: el.img,
			edad: getYearsOld(el.fechaNacimiento),
			fechaNacimientoP: format(parseISO(el.fechaNacimiento), 'dd/MM/yyyy'),
			nacionalidad: Array.isArray(el.nacionalidades) ? el.nacionalidades[0].nacionalidad : '',
			genero: Array.isArray(el.genero) ? el.genero[0].nombre : '',
			cuentaCorreoOffice: el.cuentaCorreoOffice ? 'Sí' : 'No'
		}
	}

	const columns = useMemo(() => {
		// Si tiene permiso para des-matricular, se agrega la columna de acciones

		// ID #2 -> Director
		// ID #3 -> Gestor rectores
		// ID #4 -> Gestor de apoyo
		// ID #5 -> Supervisor de circuito
		// ID #6 -> Director Regional
		// ID #7 -> Gestor consultas
		// ID #19 -> SA

		const permisoDesMatricular = roles?.find(r => {
			return r.rolId === 1 || r.rolId === 5 || r.rolId === 6 || r.rolId === 19
		})

		return [
			{
				Header: t(
					'estudiantes>registro_matricula>matricula_estudian>estudian_matriculados>colum_id',
					'Identificación'
				),
				accessor: 'identificacion',
				label: '',
				column: ''
			},
			{
				Header: t(
					'estudiantes>registro_matricula>matricula_estudian>estudian_matriculados>colum_nombre',
					'Nombre completo'
				),
				accessor: 'nombreEstudiante',
				label: '',
				column: ''
			},
			{
				Header: t(
					'estudiantes>registro_matricula>matricula_estudian>estudian_matriculados>colum_nacionalidad',
					'Nacionalidad'
				),
				accessor: 'nacionalidad',
				label: '',
				column: ''
			},
			{
				Header: t(
					'servicio_comunal>registro_servicio_comunal>genero',
					'genero'
				),
				accessor: 'genero',
				label: '',
				column: ''
			},
			{
				Header: t(
					'estudiantes>registro_matricula>matricula_estudian>estudian_matriculados>colum_fecha_nacimi',
					'Fecha de nacimiento'
				),
				accessor: 'fechaNacimiento',
				label: '',
				column: ''
			},
			{
				Header: t(
					'servicio_comunal>registro_servicio_comunal>edad',
					'Edad'
				),
				accessor: 'edad',
				label: '',
				column: ''
			},

			{
				Header: t(
					'servicio_comunal>registro_servicio_comunal>discapacidad',
					'Discapacidad'
				),
				accessor: 'condicion',
				label: '',
				column: '',
				Cell: ({ cell, row, data }) => {
					const _row = data[row.index]

					return (
						<p
							style={{
								background: colors.primary,
								color: '#fff',
								textAlign: 'center',
								borderRadius: ' 20px'
							}}
						>
							{_row.estadoNombre}
						</p>
					)
				}
			},
			{
				Header: t(
					'servicio_comunal>registro_servicio_comunal>Eliminar',
					'Eliminar'
				),
				accessor: 'Eliminar',
				label: '',
				column: '',
				Cell: ({ cell, row, data }) => {
					const _row = data[row.index]

					return (
						<p
							style={{
								background: colors.primary,
								color: '#fff',
								textAlign: 'center',
								borderRadius: ' 20px'
							}}
						>
							{_row.id}
						</p>
					)
				}
			},
			{
				Header: t(
					'servicio_comunal>registro_servicio_comunal>eliminar',
					'Eliminar'
				),
				column: '',
				accessor: '',
				label: '',
				Cell: ({ cell, row, data }) => {

					return (
						<p
							style={{
								background: colors.primary,
								color: '#fff',
								textAlign: 'center',
								borderRadius: ' 20px'
							}}
						>
							<Button onClick={() => {
								const _row = data[row.index]
								console.log('_row', _row)
								let newEstudiantes = [...props.estudiantes]

								newEstudiantes = newEstudiantes.filter(function (obj) {
									return obj.idEstudiante !== _row.idEstudiante;
								});
								console.log('newEstudiantes',newEstudiantes)
								props.setEstudiantes(newEstudiantes)
							}}>Eliminar</Button>
						</p>
					)
				}
			}
		]
	}, [students, closeContextualMenu, t])

	onlyViewModule && columns.splice(7, 1)
	return (
		<div style={{paddingTop:'10px'}}>
		<Colxx className='mb-5' sm='12' lg='12' xl='12'>
			<Card>
				<CardBody>
					<h4>
						{t(
							'servicio_comunal>registro_servicio_comunal>titulo',
							'título'
						)}
					</h4>

					<TableReactImplementationServicio  avoidSearch={props.avoidSearch} handleGetData={() => { props.handleGetData() }} orderOptions={[]} columns={columns} data={students} />
				</CardBody>
			</Card>
		</Colxx>
		</div>
	)
}

export default ComunalTabla