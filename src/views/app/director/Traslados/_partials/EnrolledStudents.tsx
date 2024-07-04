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
import { trasladarEstudiantes } from 'Redux/matricula/actions.js'
import { Card, CardBody, InputGroupAddon, Button } from 'reactstrap'
import swal from 'sweetalert'

import ModalTrasladosInternos from './ModalTrasladosInternos'
import ModalTrasladosACentroNoIdentificado from './ModalTrasladosACentroNoIdentificado'
import { IconButton, Tooltip } from '@mui/material'
import TouchAppIcon from '@material-ui/icons/TouchApp'
import { useTranslation } from 'react-i18next'

const EnrolledStudents = ({
	selectedLvl,
	setSnackbarContent,
	handleClick,
	type = 'trasladosInternos'
}: {
	selectedLvl: any
	setSnackbarContent: (e) => void
	handleClick: () => void
	type: 'trasladosInternos' | 'trasladosACentroNoIdentificado'
}) => {
	const actions: any = useActions({
		getEstudiantesByNivelOfertaSinFallecidos,
		trasladarEstudiantes,
		getGroupsByIntitutionForTraslados
	})
	const { t } = useTranslation()
	const [selectedLevel, setSelectedLevel] = useState(null)
	const [selectedInstitution, setSelectedInstitution] = useState(null)

	const calculateAge = birthday => {
		// birthday is a date
		const ageDifMs = Date.now() - birthday
		const ageDate = new Date(ageDifMs) // miliseconds from epoch
		return Math.abs(ageDate.getUTCFullYear() - 1970)
	}
	const { authObject, currentInstitution } = useSelector((state: any) => state.authUser)
	const [items, setItems] = useState([])
	const [searchValue, setSearchValue] = useState('')
	const students = useSelector((state: any) => state.grupos.allGroupMembers)
	const [selectedMatriculasId, setSelectedMatriculasId] = useState([])
	const [loading, setLoading] = useState(false)
	const [openModal, setOpenModal] = useState(false)

	const onSubmit = async () => {
		try {
			const res = await actions.trasladarEstudiantes(selectedMatriculasId, selectedLevel?.entidadMatriculaId)
			await actions.getEstudiantesByNivelOfertaSinFallecidos(selectedLvl?.nivelOfertaId)

			if (!res.error) {
				swal({
					title: t('traslados>mensaje>titulo', 'Traslado realizado'),
					text: t('traslados>mensaje', 'El traslado ha sido realizado con éxito'),
					icon: 'success',
					className: 'text-alert-modal',
					buttons: {
						ok: {
							text: t('general>cerrar', 'Cerrar'),
							value: true,
							className: 'btn-alert-color'
						}
					}
				})
				setOpenModal(false)
				setSelectedLevel(null)

				setSnackbarContent({
					msg: t('traslados>mensaje_estudiantes', 'Se han trasladado los estudiantes con éxito'),
					variant: 'success'
				})
				handleClick()

				// recargamos los datos de los niveles
				await actions.getGroupsByIntitutionForTraslados(selectedInstitution?.id)
			}
		} catch (error) {
			setSnackbarContent({
				msg: t('traslados>mensaje_error', 'Ha ocurrido un error al trasladar estudiantes'),
				variant: 'error'
			})
			handleClick()
		}
	}
	const isEncargadoOrEstudiante = authObject.user.rolesOrganizaciones.find(
		rol => rol.rolNombre.toLowerCase() === 'estudiante' || rol.rolNombre.toLowerCase() === 'encargado'
	)

	const institutionsArray = isEncargadoOrEstudiante
		? ''
		: authObject.user.rolesOrganizaciones.map(el => {
				const institution = authObject.user.instituciones.find(item => item.id === parseInt(el.organizacionId))
				return { ...el, institutionObject: institution }
		  })
	const onSearch = () => {
		setItems(search(searchValue).in(students, Object.keys(students[0])))
	}
	const columns = useMemo(() => {
		let aux = []

		if (type === 'trasladosInternos') {
			aux.push({
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
									newMatriculas = newMatriculas?.filter(el => el !== row.original.matriculaId)
								}
								setSelectedMatriculasId(newMatriculas)
							}}
						/>
					)
				}
			})
		}
		aux = [
			...aux,
			{
				Header: t(
					'estudiantes>traslados>gestion_traslados>traslado_centro_no_identificado>estudiantes_matriculados>columna_identificacion',
					'Identificación'
				),
				accessor: 'identificacion',
				label: '',
				column: ''
			},
			{
				Header: t(
					'estudiantes>traslados>gestion_traslados>traslado_centro_no_identificado>estudiantes_matriculados>columna_nombre',
					'Nombre completo'
				),
				accessor: 'nombreCompleto',
				label: '',
				column: ''
			},
			{
				Header: t(
					'estudiantes>traslados>gestion_traslados>traslado_centro_no_identificado>estudiantes_matriculados>columna_nacionalidad',
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
					'estudiantes>traslados>gestion_traslados>traslado_centro_no_identificado>estudiantes_matriculados>columna_fecha_nacimiento',
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
					'estudiantes>traslados>gestion_traslados>traslado_centro_no_identificado>estudiantes_matriculados>columna_edad_cumplida',
					'Edad cumplida'
				),
				accessor: 'edad',
				label: '',
				column: '',
				Cell: ({ row }) => {
					return (
						<div>
							{row.original?.fechaNacimiento && calculateAge(new Date(row.original?.fechaNacimiento))}{' '}
							{t('general>años', 'años')}
						</div>
					)
				}
			},
			{
				Header: t(
					'estudiantes>traslados>gestion_traslados>traslado_centro_no_identificado>estudiantes_matriculados>columna_identidad_genero',
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
					'estudiantes>traslados>gestion_traslados>traslado_centro_no_identificado>estudiantes_matriculados>columna_condicion',
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
		if (type === 'trasladosACentroNoIdentificado') {
			aux.push({
				Header: t(
					'estudiantes>traslados>gestion_traslados>traslado_centro_no_identificado>estudiantes_matriculados>columna_acciones',
					'Acciones'
				),
				column: '',
				label: '',
				Cell: ({ row }) => {
					if (type === 'trasladosACentroNoIdentificado' && row.original.estadoId === 6) {
						return <></>
					}
					return (
						<div>
							<button
								style={{
									border: 'none',
									background: 'transparent',
									cursor: 'pointer',
									color: 'grey'
								}}
								onClick={() => {
									setSelectedMatriculasId([row.original.matriculaId])
									setOpenModal(true)
								}}
							>
								<Tooltip title={t('boton>general>trasladar', 'Trasladar')}>
									<IconButton>
										<TouchAppIcon
											style={{
												fontSize: 30,
												cursor: 'pointer'
											}}
										/>
									</IconButton>
								</Tooltip>
							</button>
						</div>
					)
				}
			})
		}
		return aux
	}, [items, selectedMatriculasId, type, t])

	const data = useMemo(() => {
		return items || []
	}, [items, selectedLevel, selectedLvl])

	useEffect(() => {
		setItems(students)
	}, [students])

	useEffect(() => {
		setSelectedInstitution(currentInstitution)
	}, [currentInstitution])

	useEffect(() => {
		const fetchData = async () => {
			await actions.getGroupsByIntitutionForTraslados(selectedInstitution?.id)
		}
		// call the function
		selectedInstitution && fetchData()
	}, [selectedInstitution])

	useEffect(() => {
		setLoading(true)

		const fetchData = async () => {
			await actions.getEstudiantesByNivelOfertaSinFallecidos(selectedLvl?.nivelOfertaId)
		}

		fetchData()
		setLoading(false)
	}, [])
	return (
		<div>
			{loading ? (
				<Loader />
			) : (
				<Card className='mb-3'>
					{type === 'trasladosInternos' ? (
						<ModalTrasladosInternos
							selectedLevel={selectedLevel}
							selectedLvl={selectedLvl}
							selectedMatriculasId={selectedMatriculasId}
							selectedInstitution={selectedInstitution}
							setSelectedInstitution={setSelectedInstitution}
							setSelectedLevel={setSelectedLevel}
							setOpenModal={setOpenModal}
							openModal={openModal}
							columns={columns}
							data={data}
							onSubmit={onSubmit}
						/>
					) : (
						<ModalTrasladosACentroNoIdentificado
							openModal={openModal}
							setOpenModal={setOpenModal}
							selectedMatriculasId={selectedMatriculasId}
							nivelOfertaId={selectedLvl?.nivelOfertaId}
						/>
					)}
					<CardBody>
						<h3>
							{t(
								'estudiantes>traslados>gestion_traslados>traslado_centro_no_identificado>estudiantes_matriculados>estudiantes_matriculados',
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
							{type === 'trasladosInternos' && (
								<Button
									color='primary'
									onClick={() => {
										if (selectedMatriculasId.length > 0) {
											setOpenModal(true)
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
							)}
						</div>
						<TableReactImplementation columns={columns} data={data} avoidSearch />
					</CardBody>
				</Card>
			)}
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

export default EnrolledStudents
