import React, { useEffect, useMemo, useState } from 'react'
import { TableReactImplementation } from 'Components/TableReactImplementation'
import { useActions } from 'Hooks/useActions'
import { getEstudiantesByNivelOfertaSinFallecidos, getGroupsByIntitutionForTraslados } from 'Redux/grupos/actions'
import Loader from 'Components/LoaderContainer'
import { useSelector } from 'react-redux'
import colors from 'Assets/js/colors'
import moment from 'moment'
import search from 'Utils/search'
import styled from 'styled-components'
import { Card, CardBody, InputGroupAddon, Button } from 'reactstrap'

import { calculateAge } from 'Utils/years'
import { useTranslation } from 'react-i18next'

const TablaEstudiantes = ({ selectedLvl, onConfirm, setSnackbarContent, handleClick }) => {
	const { currentInstitution } = useSelector((state: any) => state.authUser)

	const actions: any = useActions({
		getEstudiantesByNivelOfertaSinFallecidos,

		getGroupsByIntitutionForTraslados
	})
	const { t } = useTranslation()
	const [selectedInstitution, setSelectedInstitution] = useState(null)
	const [items, setItems] = useState([])
	const [searchValue, setSearchValue] = useState('')
	const students = useSelector((state: any) => state?.grupos.allGroupMembers)
	const [selectedMatriculasId, setSelectedMatriculasId] = useState([])
	const [loading, setLoading] = useState(false)

	const onSearch = () => {
		!!students.length && setItems(search(searchValue).in(students, Object.keys(students[0])))
	}

	const columns = useMemo(() => {
		return [
			{
				Header: ({ page, state }) => (
					<input
						checked={selectedMatriculasId.length === page.length}
						className='custom-checkbox mb-0 d-inline-block'
						type='checkbox'
						onClick={e => {
							setSelectedMatriculasId(
								selectedMatriculasId.length !== page.length
									? page.map(el => el.original.matriculaId)
									: []
							)
						}}
					/>
				),
				column: 'checked',
				accessor: 'checked',
				label: '',
				Cell: ({ row }) => {
					return (
						<input
							checked={selectedMatriculasId.includes(row.original.matriculaId)}
							className='custom-checkbox mb-0 d-inline-block'
							type='checkbox'
							onClick={e => {
								let newMatriculas = [...selectedMatriculasId]
								if (!newMatriculas.includes(row.original.matriculaId)) {
									newMatriculas.push(row.original.matriculaId)
								} else {
									newMatriculas = newMatriculas.filter(el => el !== row.original.matriculaId)
								}
								setSelectedMatriculasId(newMatriculas)
							}}
						/>
					)
				}
			},
			{
				Header: t(
					'estudiantes>traslados>gestion_traslados>solicitar_desde_mi_centro>estudiantes_matriculados>columna_id',
					'Identificación'
				),
				accessor: 'identificacion',
				label: '',
				column: ''
			},
			{
				Header: t(
					'estudiantes>traslados>gestion_traslados>solicitar_desde_mi_centro>estudiantes_matriculados>columna_nombre',
					'Nombre completo'
				),
				accessor: 'nombreCompleto',
				label: '',
				column: ''
			},
			{
				Header: t(
					'estudiantes>traslados>gestion_traslados>solicitar_desde_mi_centro>estudiantes_matriculados>columna_nacionalidad',
					'Nacionalidad'
				),
				accessor: 'nacionalidad',
				label: '',
				column: '',
				Cell: ({ row }) => {
					return <div>{row.original?.nacionalidades && row.original?.nacionalidades[0]?.nacionalidad}</div>
				}
			},
			{
				Header: t(
					'estudiantes>traslados>gestion_traslados>solicitar_desde_mi_centro>estudiantes_matriculados>columna_fecha_nacimiento',
					'Fecha de nacimiento'
				),
				accessor: 'fechaNacimiento',
				label: '',
				column: '',
				Cell: ({ row }) => {
					return (
						<div>
							{row.original?.fechaNacimiento &&
								moment(row.original?.fechaNacimiento).format('DD/MM/yyyy')}
						</div>
					)
				}
			},
			{
				Header: t(
					'estudiantes>traslados>gestion_traslados>solicitar_desde_mi_centro>estudiantes_matriculados>columna_edad',
					'Edad cumplida'
				),
				accessor: 'edad',
				label: '',
				column: '',
				Cell: ({ row }) => {
					return <div>{row.original?.fechaNacimiento && calculateAge(row.original?.fechaNacimiento)}</div>
				}
			},
			{
				Header: t(
					'estudiantes>traslados>gestion_traslados>solicitar_desde_mi_centro>estudiantes_matriculados>columna_identidad_genero',
					'Identidad de género'
				),
				accessor: 'genero',
				label: '',
				column: '',
				Cell: ({ row }) => {
					return (
						<div>{row.original?.genero && row.original?.genero[0] && row.original?.genero[0]?.nombre}</div>
					)
				}
			},
			{
				Header: t(
					'estudiantes>traslados>gestion_traslados>solicitar_desde_mi_centro>estudiantes_matriculados>columna_condicion',
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
			}
		]
	}, [items, selectedMatriculasId, t])

	const data = useMemo(() => {
		return items || []
	}, [items])

	useEffect(() => {
		setItems(students)
	}, [students])

	useEffect(() => {
		setSelectedInstitution(currentInstitution)
	}, [currentInstitution])

	useEffect(() => {
		const Fetch = async () => {
			await actions.getGroupsByIntitutionForTraslados(selectedInstitution?.id)
		}
		selectedInstitution && Fetch()
	}, [selectedInstitution])

	useEffect(() => {
		const Fetch = async () => {
			setLoading(true)
			await actions
				.getEstudiantesByNivelOfertaSinFallecidos(selectedLvl?.nivelOfertaId)
				.then(() => setLoading(false))
				.catch(() => setLoading(false))
		}

		Fetch()
	}, [])

	return (
		<div>
			<Card className='mb-3'>
				<CardBody>
					<h3>
						{t(
							'estudiantes>traslados>gestion_traslados>solicitar_desde_mi_centro>estudiantes_matriculados',
							'Estudiantes matriculados'
						)}
					</h3>
					<div className='d-flex justify-content-between align-items-center'>
						<div
							className='search-sm--rounded'
							style={{
								width: '20rem'
							}}
						>
							<input
								type='text'
								name='keyword'
								id='search'
								onInput={e => onSearch()}
								onKeyPress={e => {
									if (e.key === 'Enter' || e.keyCode === 13) {
										onSearch()
									}
								}}
								value={searchValue}
								onChange={e => setSearchValue(e.target.value)}
								placeholder={t('general>buscar', 'Buscar')}
							/>

							<StyledInputGroupAddon style={{ zIndex: 2 }} addonType='append'>
								<Button
									color='primary'
									className='buscador-table-btn-search'
									onClick={onSearch}
									id='buttonSearchTable'
								>
									{t('general>buscar', 'Buscar')}
								</Button>
							</StyledInputGroupAddon>
						</div>
						<Button
							color='primary'
							onClick={() => {
								if (selectedMatriculasId.length > 0) {
									const _data = data.filter(el => {
										return selectedMatriculasId.some(f => {
											return f === el.matriculaId
										})
									})
									onConfirm(_data)
								} else {
									setSnackbarContent({
										variant: 'error',
										msg: t(
											'general>aviso>necesita_seleccionar_estudiante',
											'Necesitas seleccionar al menos a un estudiante'
										)
									})
									handleClick()
								}
							}}
						>
							{t('boton>general>trasladar', 'Trasladar')}
						</Button>
					</div>
					{loading ? <Loader /> : <TableReactImplementation columns={columns} data={data} avoidSearch />}
				</CardBody>
			</Card>
		</div>
	)
}

const StyledInputGroupAddon = styled(InputGroupAddon)`
	top: 0;
	right: 0;
	position: absolute;
	height: 100%;
	display: flex;
	align-items: center;
`

export default TablaEstudiantes
