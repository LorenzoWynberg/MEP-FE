import React, { useState, useEffect, useMemo } from 'react'
import { TableReactImplementation } from 'Components/TableReactImplementation'
import ContextualMenu from 'Components/TableReactImplementation/ContextualMenu'
import { getYearsOld } from 'Utils/years'
import { Card, CardBody } from 'reactstrap'
import { Colxx } from 'Components/common/CustomBootstrap'
import { format, parseISO } from 'date-fns'
import colors from 'Assets/js/colors'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'

interface IProps {
	data: Array<any>
	onSelectedStudent: Function
	hasEditAccess: boolean
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
				accessor: 'nombreCompleto',
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
					'estudiantes>registro_matricula>matricula_estudian>estudian_matriculados>colum_fecha_nacimi',
					'Fecha de nacimiento'
				),
				accessor: 'fechaNacimientoP',
				label: '',
				column: ''
			},
			{
				Header: t(
					'estudiantes>registro_matricula>matricula_estudian>estudian_matriculados>colum_edad',
					'Edad cumplida'
				),
				accessor: 'edad',
				label: '',
				column: ''
			},
			{
				Header: t(
					'estudiantes>registro_matricula>matricula_estudian>estudian_matriculados>colum_identi_genero',
					'Identidad de género'
				),
				accessor: 'genero',
				label: '',
				column: ''
			},
			{
				Header: t(
					'estudiantes>registro_matricula>matricula_estudian>estudian_matriculados>colum_condicion',
					'Condición'
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
					'estudiantes>registro_matricula>matricula_estudian>estudian_matriculados>colum_acciones',
					'Acciones'
				),
				column: '',
				accessor: '',
				label: '',
				Cell: ({ cell, row, data }) => {
					let _options = []

					const rowData = data[row.index]

					if (rowData.estadoCodigo == 1) {
						// Regular
						_options = [
							{
								name: t(
									'estudiantes>registro_matricula>matricula_estudian>estudian_matriculados>colum_acciones>ver',
									'Ver'
								),
								action: _row => {
									onSelectedStudent(_row, 'see')
								}
							},
							{
								name: t(
									'estudiantes>registro_matricula>matricula_estudian>estudian_matriculados>colum_acciones>riesgo',
									'Riesgo de exclusión'
								),
								action: _row => {
									onSelectedStudent(_row, '3')
								}
							},
							{
								name: t(
									'estudiantes>registro_matricula>matricula_estudian>estudian_matriculados>colum_acciones>excluido',
									'Excluído'
								),
								action: _row => {
									onSelectedStudent(_row, '4')
								}
							},
							{
								name: t(
									'estudiantes>registro_matricula>matricula_estudian>estudian_matriculados>colum_acciones>des_matricular',
									'Des-matricular'
								),
								action: _row => {
									onSelectedStudent(_row, 'remove')
								}
							}
						]
					} else if (rowData.estadoCodigo == 3) {
						// Riesgo de exclusión

						_options = [
							{
								name: 'Ver',
								action: _row => {
									onSelectedStudent(_row, 'see')
								}
							},
							{
								name: 'Excluído',
								action: _row => {
									onSelectedStudent(_row, '4')
								}
							}
						]
					} else if (rowData.estadoCodigo == 4) {
						// Excluído

						_options = [
							{
								name: 'Ver',
								action: _row => {
									onSelectedStudent(_row, 'see')
								}
							},
							{
								name: 'Reincorporar',
								action: _row => {
									onSelectedStudent(_row, '1')
								}
							}
						]
					} else if (rowData.estadoCodigo == 5) {
						// Fallecido
						_options = []
					} else if (rowData.estadoCodigo == 6) {
						// Trasladado a otro Centro
						_options = [
							{
								name: 'Ver',
								action: _row => {
									onSelectedStudent(_row, 'see')
								}
							},
							{
								name: 'Reincorporar',
								action: _row => {
									onSelectedStudent(_row, '1')
								}
							}
						]
					}

					const fullRow = data[row.index]

					if (!hasEditAccess) {
						_options.splice(1, 1)
						_options.splice(2, 1)
						_options.splice(3, 1)
						_options.splice(1, 2)
						_options.splice(2, 2)
					}
					if (!permisoDesMatricular) {
						_options.splice(3, 4)
					}
					return (
						<div key={row.index} className='d-flex justify-content-center align-items-center'>
							<ContextualMenu options={_options} row={fullRow} close={closeContextualMenu} />
						</div>
					)
				}
			}
		]
	}, [students, closeContextualMenu, t])

	onlyViewModule && columns.splice(7, 1)
	return (
		<Colxx className='mb-5' sm='12' lg='12' xl='12'>
			<Card>
				<CardBody>
					<h4>
						{t(
							'estudiantes>registro_matricula>matricula_estudian>estudian_matriculados',
							'Estudiantes matriculados'
						)}
					</h4>

					<TableReactImplementation orderOptions={[]} columns={columns} data={students} />
				</CardBody>
			</Card>
		</Colxx>
	)
}

export default ComunalTabla