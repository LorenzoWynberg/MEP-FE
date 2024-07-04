import React, { useEffect, useState, useMemo } from 'react'
import { TableReactImplementation } from 'Components/TableReactImplementation'

import Tooltip from '@mui/material/Tooltip'
import TouchAppIcon from '@material-ui/icons/TouchApp'
import { useActions } from 'Hooks/useActions'
import { getEstudiantesConAlerta } from 'Redux/alertaTemprana/actionsAlerts'
import { useSelector } from 'react-redux'
import moment from 'moment'
import { useTranslation } from 'react-i18next'
import colors from 'assets/js/colors'
import { Col, Row, Container } from 'reactstrap'
import { CustomInput } from 'Components/CommonComponents'
import HeaderTable from '../HeaderTable'
import { showProgress, hideProgress } from 'Utils/progress'

interface IProps {
	onSelectedStudent: Function
}

const TableStudents: React.FC<IProps> = props => {
	const { onSelectedStudent } = props
	const { t } = useTranslation()
	const { currentInstitution } = useSelector(state => state.authUser)
	const { estudiantesConAlertas } = useSelector(state => state.alertaTemprana)

	const [onlyOpensAlert, setOnlyOpenAlert] = useState<boolean>(false)
	const [txtSearch, setTxtSearch] = useState<string>('all')

	const ACTIVE_YEAR = useSelector((store: any) => store.authUser.selectedActiveYear)


	const actions = useActions({
		getEstudiantesConAlerta
	})

	const fetch = async () => {
		const _onlyOpensAlert = onlyOpensAlert ? 'Abierta' : 'all'
		showProgress()
		await actions.getEstudiantesConAlerta(currentInstitution?.id, txtSearch, 1, _onlyOpensAlert, 500, 1)
		hideProgress()
	}

	useEffect(() => {
		fetch()
	}, [currentInstitution, ACTIVE_YEAR])

	useEffect(() => {
		fetch()
	}, [onlyOpensAlert])

	const calculateAge = birthday => {
		// birthday is a date
		const ageDifMs = Date.now() - birthday
		const ageDate = new Date(ageDifMs) // miliseconds from epoch
		return Math.abs(ageDate.getUTCFullYear() - 1970)
	}

	const columns = useMemo(() => {
		return [
			{
				Header: t('buscador_ce>ver_centro>datos_director>identificacion', 'Identificación'),
				accessor: 'identificacion',
				label: '',
				column: ''
			},
			{
				Header: t('buscador_ce>ver_centro>datos_director>nombre', 'Nombre completo'),
				accessor: 'nombreEstudiante',
				label: '',
				column: ''
			},
			{
				Header: t('estudiantes>buscador_per>col_fecha_naci', 'Fecha de nacimiento'),
				accessor: 'fechaNacimiento',
				label: '',
				column: '',
				Cell: ({ row }) => <div>{moment(row.original.fechaNacimiento).format('DD/MM/YYYY')}</div>
			},
			{
				Header: t('estudiantes>expediente>info_gen>info_gen>datos_personales>edad', 'Edad cumplida'),
				accessor: 'edad',
				label: '',
				column: '',
				Cell: ({ row }) => {
					return (
						<div>
							{row.original.fechaNacimiento && calculateAge(new Date(row.original.fechaNacimiento))}{' '}
							{t('general>años', 'años')}
						</div>
					)
				}
			},
			{
				Header: t('estudiantes>expediente>hogar>miembros_hogar>agregar>identidad_gen', 'Identidad de género'),
				accessor: 'genero',
				label: '',
				column: ''
			},
			{
				Header: 'Condición matrícula',
				accessor: 'condicionMatricula',
				label: '',
				column: '',
				Cell: ({ row }) => {
					const color = colors.opaqueGray
					return (
						<div>
							<div
								style={{
									padding: '0.2em 2em',
									backgroundColor: color,
									color: '#000',
									textAlign: 'center',
									borderRadius: '8px'
								}}
							>
								{row.original?.condicionMatricula}
							</div>
						</div>
					)
				}
			},

			{
				Header: 'Estado',
				accessor: 'estadoAlerta',
				label: '',
				column: '',
				Cell: ({ row }) => {
					let color = colors.primary
					let colorTxt = '#fff'

					if (row.original?.estadoAlerta === 'Abierta') {
						color = colors.primary
					}
					if (row.original?.estadoAlerta === 'Cerrada') {
						color = colors.opaqueGray
						colorTxt = '#000'
					}
					return (
						<div>
							<div
								style={{
									padding: '0.2em 2em',
									backgroundColor: color,
									color: colorTxt,
									textAlign: 'center',
									borderRadius: '8px'
								}}
							>
								{row.original?.estadoAlerta}
							</div>
						</div>
					)
				}
			},

			{
				Header: t('buscador_ce>buscador>columna_acciones', 'Acciones'),
				accessor: 'actions',
				label: '',
				column: '',
				Cell: ({ cell, row, data }) => {
					const fullRow = data[row.index]

					return (
						<Tooltip title={t('common>reactselect>seleccione', 'Seleccionar')}>
							<TouchAppIcon
								onClick={() => {
									onSelectedStudent(fullRow)
								}}
								style={{
									fontSize: 25,
									color: colors.darkGray,
									cursor: 'pointer'
								}}
							/>
						</Tooltip>
					)
				}
			}
		]
	}, [estudiantesConAlertas, t])

	const data = useMemo(() => estudiantesConAlertas, [estudiantesConAlertas])

	const onFilter = async (filter: number = 1) => {
		const _onlyOpensAlert = onlyOpensAlert ? 'Abierta' : 'all'
		showProgress()
		await actions.getEstudiantesConAlerta(currentInstitution?.id, txtSearch, filter, _onlyOpensAlert, 50, 1)
		hideProgress()
	}

	const onSearch = async (texto: string) => {
		setTxtSearch(texto)
		const _onlyOpensAlert = onlyOpensAlert ? 'Abierta' : 'all'
		const _texto = texto.length > 0 ? texto : 'all'
		showProgress()
		await actions.getEstudiantesConAlerta(currentInstitution?.id, _texto, 1, _onlyOpensAlert, 50, 1)
		hideProgress()
	}
	const optionsFilters = [
		{
			label: 'Riesgo de exclusión',
			value: 3
		},
		{
			label: 'Excluidos',
			value: 4
		}
	]
	return (
		<Container className='mt-3 mb-5' sm='12'>
			<Row>
				<Col xs={12}>
					<h4>
						{t(
							'estudiantes>registro_matricula>matricula_estudian>estudian_matriculados',
							'Estudiantes matriculados'
						)}{' '}
					</h4>
				</Col>
				<Col xs={12}>
					<HeaderTable onSearch={onSearch} onFilter={onFilter} optionsFilter={optionsFilters} />

					<div
						style={{
							display: 'flex',
							justifyContent: 'flex-end'
						}}
					>
						<CustomInput
							type='checkbox'
							label='Ocultar alertas cerradas'
							checked={onlyOpensAlert}
							onClick={() => setOnlyOpenAlert(!onlyOpensAlert)}
						/>
					</div>
				</Col>
			</Row>

			<Row>
				<Col xs={12}>
					<TableReactImplementation orderOptions={[]} columns={columns} data={data} avoidSearch />
				</Col>
			</Row>
		</Container>
	)
}

export default TableStudents
