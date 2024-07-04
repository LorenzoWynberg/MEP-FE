import { TableReactImplementation as Table } from 'Components/TableReactImplementation'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import {
	Dropdown,
	DropdownMenu,
	DropdownItem,
	DropdownToggle,
	Col,
	Card,
	CardBody,
	Input,
	Modal,
	ModalHeader,
	ModalBody,
	ModalFooter,
	Button
} from 'reactstrap'
import styled from 'styled-components'
import { Edit, Delete, ErrorOutline } from '@material-ui/icons'
import { Tooltip } from '@material-ui/core'
import colors from 'Assets/js/colors'
import { useActions } from 'Hooks/useActions'
import {
	removeScoresBySubjectGroup,
	updateJSON
} from 'Redux/Calificaciones/actions'
import RubricaModal from './RubricaModal'
import useNotification from 'Hooks/useNotification'
import swal from 'sweetalert'
import GridEscalaCalificacion from 'views/app/director/Configuracion/_partials/Mallas/GridEscalaCalificacion/index'
import { guidGenerator } from 'Utils/GUIDGenerator'
import { useTranslation } from 'react-i18next'

const ComponentsSettings = ({
	components,
	setComponents,
	subject,
	selectedPeriod,
	setSelectedPeriod,
	scoreType
}) => {
	const { t } = useTranslation()
	const { bloques } = useSelector((state) => state.grupos)
	const { scores } = useSelector((state) => state?.calificaciones)
	const [openModal, setOpenModal] = useState<
		| ''
		| 'dropdown-period'
		| 'addInstrument'
		| 'instrumentAdded'
		| 'editInstrument'
		| 'removeInstrument'
		| 'instrumentNotRemoved'
		| 'instrumentRemoved'
		| 'editComponent'
		| 'addComponent'
		| 'addRubrica'
		| 'editRubrica'
		| 'addEscala'
		| 'editEscala'
	>('')
	const [inputValues, setInputValues] = useState<{
		name: string
		points: string
		specificPercentage?: string
		rubrica: boolean
	}>({
		name: '',
		points: '',
		specificPercentage: '',
		rubrica: false
	})
	const [snackbar, handleClick] = useNotification()
	const [snackbarContent, setSnackbarContent] = useState({
		msg: '',
		variant: ''
	})

	const actions = useActions({
		updateJSON,
		removeScoresBySubjectGroup
	})

	const updateComponents = async () => {
		let response = true
		if (
			scores.filter(
				(el) =>
					el?.fechaPeriodoCalendario_id ===
					selectedPeriod?.fechaPeriodoCalendarioId
			).length > 0
		) {
			response = await swal({
				title: 'Eliminar calificaciones',
				text: '¡Este cambio eliminara todas las calificaciones de este periodo!',
				icon: 'warning',
				className: 'text-alert-modal',
				buttons: {
					ok: {
						text: 'Aceptar',
						value: true,
						className: 'btn-alert-color'
					},
					cancel: 'Cancelar'
				}
			}).then((res) => {
				if (res) {
					actions.removeScoresBySubjectGroup(subject?.id)
				}
				return res
			})
		}
		return response
	}

	const [selectedComponent, setSelectedComponent] = useState<any>(null)
	const [selectedInstrument, setSelectedInstrument] = useState<any>(null)
	const [contenidos, setContenidos] = useState<Array<any>>([])

	const [tableState, setTableState] = useState({
		data: []
	})

	const columns = React.useMemo(
		() => [
			{
				// Build our expander column
				id: 'expander', // Make sure it has an ID
				Header: ' ',
				Cell: ({ row }) =>
					// Use the row.canExpand and row.getToggleRowExpandedProps prop getter
					// to build the toggle for expanding a row
					row.canExpand ? (
						<span
							{...row.getToggleRowExpandedProps({
								style: {
									// We can even use the row.depth property
									// and paddingLeft to indicate the depth
									// of the row
									paddingLeft: `${row.depth * 2}rem`
								}
							})}
						>
							{row.isExpanded ? (
								<Tooltip
									title={t(
										'gestion_grupo>calificacion>ver_instrumento',
										'Ver instrumento'
									)}
								>
									<img
										src="/assets/img/desplegable.svg"
										alt=""
										style={{ transform: 'rotate(-90deg)' }}
									/>
								</Tooltip>
							) : (
								<Tooltip
									title={t(
										'gestion_grupo>calificacion>ver_instrumento',
										'Ver instrumento'
									)}
								>
									<img
										src="/assets/img/desplegable.svg"
										alt=""
										style={{ transform: 'rotate(180deg)' }}
									/>
								</Tooltip>
							)}
						</span>
					) : null
			},
			{
				Header: t(
					'gestion_grupo>calificacion>nombre_componente',
					'Nombre del componente'
				),
				accessor: 'nombre'
			},
			{
				Header: t('expediente_ce>normativa_interna>puntos', 'Puntos'),
				accessor: 'puntos'
			},
			{
				Header: (
					<div
						style={{
							display: 'flex',
							justifyContent: 'center',
							alignItems: 'center'
						}}
					>
						<Tooltip
							title={t(
								'configuracion>mallas_curriculares>indicadores_aprendizaje>indicadores_aprendizaje',
								'Indicadores de aprendizaje esperados'
							)}
						>
							<ErrorOutline
								style={{
									color: '#fff',
									marginRight: '1rem',
									cursor: 'pointer'
								}}
							/>
						</Tooltip>
						<div>
							{t(
								'gestion_grupo>calificacion>indicadores',
								'Indicadores'
							)}
						</div>
					</div>
				),
				accessor: 'rubrica',
				Cell: ({ row }) => {
					if (row?.original?.value?.rubricaAprendizaje) {
						return (
							<div className="d-flex align-items-center justify-content-center">
								<Edit
									className="mr-2"
									style={{
										cursor: 'pointer',
										color: colors.darkGray
									}}
									onClick={() => {
										if (!row.original.parent) {
											setSelectedComponent(
												row.original.value
											)
										} else {
											setSelectedComponent(
												row.original.parent
											)
											setSelectedInstrument(
												row.original.value
											)
										}
										setOpenModal('editRubrica')
									}}
								/>
							</div>
						)
					}

					if (
						!row?.original?.value?.rubricaAprendizaje &&
						row?.original?.rubrica !== false
					) {
						return (
							<div className="d-flex justify-content-center align-items-center">
								<img
									src="/assets/img/agregar-rubrica.svg"
									alt=""
									style={{
										color: colors.darkGray,
										cursor: 'pointer'
									}}
									onClick={() => {
										if (!row.original.parent) {
											setSelectedComponent(
												row.original.value
											)
										} else {
											setSelectedComponent(
												row.original.parent
											)
											setSelectedInstrument(
												row.original.value
											)
										}
										setOpenModal('addRubrica')
									}}
								/>
							</div>
						)
					}

					return ''
				}
			},
			{
				Header: t(
					'configuracion>anio_educativo>columna_acciones>ver>calendarios_asociados>agregar_calendarios>periodos>agregar>porcentaje',
					'Porcentaje'
				),
				accessor: 'porcentaje'
			},
			{
				Header: t('buscador_ce>buscador>columna_acciones', 'Acciones'),
				accessor: 'acciones',
				Cell: ({ row }) => {
					if (
						!row?.original?.acciones ||
						row?.original?.noRequiereInstrumentos
					) {
						return <div className="text-center">-</div>
					}

					if (row.original?.acciones === 'edit') {
						return (
							<Tooltip
								title={t(
									'general>tooltip>editar_componente',
									'Editar componente'
								)}
							>
								<Edit
									className="mr-2"
									style={{
										cursor: 'pointer',
										color: colors.darkGray
									}}
									onClick={() => {
										setOpenModal('editComponent')
										setSelectedComponent(row.original.value)
									}}
								/>
							</Tooltip>
						)
					}
					return (
						<div className="d-flex justify-content-center align-items-center">
							<Tooltip
								title={t(
									'general>tooltip>editar_subcomponente',
									'Editar subcomponente'
								)}
							>
								<Edit
									className="mr-2"
									style={{
										cursor: 'pointer',
										color: colors.darkGray
									}}
									onClick={() => {
										setSelectedComponent(
											row.original.parent
										)
										setSelectedInstrument(
											row.original.value
										)
										setOpenModal('editInstrument')
									}}
								/>
							</Tooltip>
							<Tooltip
								title={t(
									'general>tooltip>editar_subcomponente',
									'Editar subcomponente'
								)}
							>
								<Delete
									style={{
										cursor: 'pointer',
										color: colors.darkGray
									}}
									onClick={() => {
										setSelectedComponent(
											row.original.parent
										)
										setSelectedInstrument(
											row.original.value
										)
										setOpenModal('removeInstrument')
									}}
								/>
							</Tooltip>
						</div>
					)
				}
			}
		],
		[]
	)

	useEffect(() => {
		if (selectedInstrument?.rubricaAprendizaje?.contenidos) {
			setContenidos(selectedInstrument?.rubricaAprendizaje?.contenidos)
		} else if (
			selectedComponent?.rubricaAprendizaje?.contenidos &&
			!selectedInstrument
		) {
			setContenidos(selectedComponent?.rubricaAprendizaje?.contenidos)
		} else {
			setContenidos([])
		}
	}, [selectedComponent, selectedInstrument])

	useEffect(() => {
		setTableState({
			data: [
				...components
					.filter((el) => !el.matriculasId)
					.map((component, index) => {
						const subRows = [
							...component?.instrumentos?.map((instrument) => ({
								nombre: instrument?.nombre || instrument?.id,
								porcentaje: instrument?.valor,
								puntos: instrument?.puntos,
								rubrica: instrument?.rubrica || null,
								acciones: true,
								value: instrument,
								parent: component
							}))
						]

						if (
							(component?.instrumentos?.length === 0 ||
								(component?.instrumentos?.length > 0 &&
									component.instrumentos?.reduce(
										(acc, cur) => acc + Number(cur?.valor),
										0
									) < Number(component.valor))) &&
							!component.noRequiereInstrumentos
						) {
							subRows.push({
								nombre: (
									<span
										style={{
											color: colors.primary,
											textDecoration: 'underline',
											cursor: 'pointer'
										}}
										onClick={() => {
											setSelectedComponent(component)
											setOpenModal('addInstrument')
										}}
									>
										+{' '}
										{t(
											'gestion_grupo>calificacion>agregar_instrumento',
											'Agregar instrumento'
										)}
									</span>
								),
								puntos: '',
								rubrica: false,
								porcentaje: '',
								acciones: false
							})
						}
						return {
							nombre: component?.nombre || '',
							porcentaje: component?.valor,
							puntos: component?.puntos,
							rubrica:
								component.rubricaAprendizaje ||
								component.rubrica ||
								'',
							acciones: 'edit',
							value: component,
							escala: component?.escalaCalificacion
								? 'edit'
								: 'add',
							noRequiereInstrumentos:
								component?.noRequiereInstrumentos,
							style: {
								backgroundColor:
									index % 2 !== 0
										? colors.opaqueGray
										: 'unset'
							},
							subRows
						}
					})
			]
		})
	}, [components])

	if (scoreType === 'highschool') {
		columns.splice(5, 0, {
			Header: 'Escala',
			accessor: 'escala',
			Cell: ({ row }) => {
				if (row.original.escala === 'add') {
					return (
						<div
							style={{ cursor: 'pointer' }}
							className="d-flex justify-content-center align-items-center"
							onClick={() => {
								setOpenModal('addEscala')
								setSelectedComponent(
									row.original.parent || row.original.value
								)
							}}
						>
							<img src="/assets/img/agregar-escala.svg" alt="" />
						</div>
					)
				}
				if (row.original.escala === 'edit') {
					return (
						<div
							style={{ cursor: 'pointer' }}
							className="d-flex justify-content-center align-items-center"
							onClick={() => {
								setOpenModal('addEscala')
								setSelectedComponent(
									row.original.parent || row.original.value
								)
							}}
						>
							<img src="/assets/img/escala.svg" alt="" />
						</div>
					)
				}
				return <></>
			}
		})
	}

	const onChange = (e) => {
		const { name, value } = e.target
		setInputValues({ ...inputValues, [name]: value })
	}

	const validateInputs = (
		puntos,
		valor,
		valorOriginal,
		type: 'add' | 'edit'
	) => {
		const instruments = JSON.parse(
			JSON.stringify(selectedComponent?.instrumentos)
		)

		if (instruments?.length > 0 && selectedInstrument) {
			const index = instruments.findIndex(
				(el) => el?.id === selectedInstrument?.id
			)
			if (index !== -1) {
				instruments[index] = selectedInstrument
			}
		}

		const sum =
			selectedComponent?.instrumentos.length > 0
				? instruments.reduce((acc, cur) => {
						return acc + Number(cur?.valor)
				  }, 0)
				: 0

		let total = sum

		if (type === 'add') {
			total = sum + valor
		}

		if (!valor) {
			setSnackbarContent({
				variant: 'error',
				msg: t(
					'gestion_grupo>calificaciones>msj_porcentaje_especifico',
					'Debe indicar un porcentaje específico.'
				)
			})
			handleClick()
			return true
		}

		if (puntos < 0) {
			setSnackbarContent({
				variant: 'error',
				msg: t(
					'gestion_grupo>calificaciones>msj_puntos_menor',
					'Los puntos no pueden ser menor a 0'
				)
			})
			handleClick()
			return true
		}

		if (valor < 0) {
			setSnackbarContent({
				variant: 'error',
				msg: t(
					'gestion_grupo>calificaciones>msj_puntos_menor',
					'Los puntos no pueden ser menor a 0'
				)
			})
			handleClick()
			return true
		}

		if (valor > valorOriginal) {
			setSnackbarContent({
				variant: 'error',
				msg: t(
					'gestion_grupo>calificaciones>msj_porcentaje_mayorr',
					'El porcentaje no puede ser mayor al porcentaje del componente'
				)
			})
			handleClick()
			return true
		}

		if (total > valorOriginal) {
			setSnackbarContent({
				variant: 'error',
				msg: t(
					'gestion_grupo>calificaciones>msj_suma_porcentaje',
					'La suma del porcentaje de los instrumentos supera al porcentaje del componente'
				)
			})
			handleClick()
			return true
		}
		return false
	}

	const modals = {
		addInstrument: {
			title: t(
				'gestion_grupo>calificacion>agregar_instrumento',
				'Agregar instrumento'
			),
			notCloseModal: true,
			handleClick: async () => {
				const error = validateInputs(
					Number(inputValues.points),
					Number(inputValues?.specificPercentage),
					Number(selectedComponent?.valor),
					'add'
				)

				if (error) return

				const newInstrument: any = {
					id: selectedComponent?.instrumentos.length + 1 || 0,
					nombre: inputValues.name,
					puntos: inputValues.points,
					valor: inputValues.specificPercentage
				}
				if (inputValues?.rubrica) {
					newInstrument.rubricaAprendizaje = {
						contenido: { columnas: Array(0), filas: Array(0) },
						contenidos: [],
						observaciones: {},
						selectedIds: []
					}
				}
				const index = components.findIndex(
					(el) => el?.id === selectedComponent?.id
				)
				if (index !== -1) {
					const newComponents = JSON.parse(JSON.stringify(components))
					const instruments = newComponents[index].instrumentos || []
					instruments.push(newInstrument)
					newComponents[index] = {
						...newComponents[index],
						instrumentos: instruments
					}
					const response = await updateComponents()
					let res = { error: true }
					if (response) {
						res = await actions.updateJSON(
							'Componentes',
							newComponents,
							subject,
							selectedPeriod
						)
					}
					if (!res?.error) {
						setComponents(newComponents)
						setOpenModal(
							inputValues?.rubrica ? 'instrumentAdded' : ''
						)
					}
					setInputValues({
						name: '',
						points: '',
						specificPercentage: '',
						rubrica: false
					})
				}
				setOpenModal('')
			},
			body: (
				<div>
					<div className="">
						<h6>{t(' dir_regionales>col_nombre', 'Nombre')}*</h6>
						<Input
							type="text"
							value={inputValues.name}
							onChange={onChange}
							name="name"
						/>
					</div>
					<div className="my-3">
						<h6>
							{t(
								'expediente_ce>normativa_interna>puntos',
								'Puntos'
							)}
						</h6>
						<Input
							type="number"
							value={inputValues.points}
							onChange={onChange}
							name="points"
							invalid={Number(inputValues.points) < 0}
						/>
					</div>
					<div className="">
						<h6>
							{t(
								'gestion_grupo>calificaciones>porcentaje_especifico',
								'Porcentaje específico'
							)}
						</h6>
						<Input
							type="number"
							min={0}
							max={selectedComponent?.valor}
							value={inputValues.specificPercentage}
							onChange={onChange}
							invalid={
								Number(inputValues.specificPercentage) < 0 ||
								inputValues.specificPercentage >
									selectedComponent?.valor
							}
							name="specificPercentage"
						/>
					</div>
				</div>
			)
		},
		editInstrument: {
			title: t(
				'gestion_grupo>calificaciones>editar_instrumento',
				'Editar instrumento'
			),
			notCloseModal: true,
			handleClick: async () => {
				const error = validateInputs(
					Number(selectedInstrument?.puntos),
					Number(selectedInstrument?.valor),
					Number(selectedComponent?.valor),
					'edit'
				)

				if (error) return

				const index = components.findIndex(
					(el) => el?.id === selectedComponent?.id
				)
				if (index !== -1) {
					const newComponents = JSON.parse(JSON.stringify(components))
					const newInstruments = newComponents[index].instrumentos
					const instrumentIndex = newInstruments.findIndex(
						(el) => el?.id === selectedInstrument?.id
					)
					newInstruments[instrumentIndex] = selectedInstrument
					newComponents[index] = {
						...newComponents[index],
						instrumentos: newInstruments
					}
					const response = await updateComponents()
					let res = { error: true }
					if (response) {
						setComponents(newComponents)
						res = await actions.updateJSON(
							'Componentes',
							newComponents,
							subject,
							selectedPeriod
						)
					}

					if (!res?.error) {
						setOpenModal(
							inputValues?.rubrica ? 'instrumentAdded' : ''
						)
					}
					setInputValues({
						name: '',
						points: '',
						specificPercentage: '',
						rubrica: false
					})
				}
				setOpenModal('')
			},
			body: (
				<div>
					<div className="">
						<h6>{t(' dir_regionales>col_nombre', 'Nombre')}*</h6>
						<Input
							type="text"
							value={selectedInstrument?.nombre}
							onChange={(e) => {
								const { name, value } = e.target

								setSelectedInstrument((prevState) => ({
									...prevState,
									[name]: value
								}))
							}}
							name="nombre"
						/>
					</div>
					<div className="my-3">
						<h6>
							{t(
								'expediente_ce>normativa_interna>puntos',
								'Puntos'
							)}
						</h6>
						<Input
							type="number"
							value={selectedInstrument?.puntos}
							invalid={selectedInstrument?.puntos < 0}
							onChange={(e) => {
								const { name, value } = e.target

								setSelectedInstrument((prevState) => ({
									...prevState,
									[name]: value
								}))
							}}
							min={0}
							name="puntos"
						/>
					</div>
					<div className="">
						<h6>
							{t(
								'gestion_grupo>calificaciones>porcentaje_especifico',
								'Porcentaje específico'
							)}
						</h6>
						<Input
							type="number"
							value={selectedInstrument?.valor}
							onChange={(e) => {
								const { name, value } = e.target

								setSelectedInstrument((prevState) => ({
									...prevState,
									[name]: value
								}))
							}}
							max={selectedComponent?.valor}
							min={0}
							invalid={
								selectedInstrument?.valor < 0 ||
								selectedInstrument?.valor >
									selectedComponent?.valor
							}
							name="valor"
						/>
					</div>
				</div>
			)
		},
		instrumentAdded: {
			title: t(
				'gestion_grupo>calificaciones>instrumento_agregado',
				'Instrumento agregado'
			),
			body: (
				<>
					<p>
						{t(
							'gestion_grupo>calificaciones>instrumento_mesj_exito',
							'El instrumento se ha agregado con éxito'
						)}
						.
					</p>
					<p>
						{t(
							'gestion_grupo>calificaciones>instrumento_pregunta',
							'¿Desea editar la rúbrica de aprendizaje ahora mismo?'
						)}
					</p>
				</>
			),
			notCloseModal: true,
			handleClick: () => {
				setOpenModal('addRubrica')
			},
			btnSubmitText: t(
				'gestion_grupo>calificaciones>instrumento_msj_ok',
				'Si, ir a editar rúbrica'
			),
			btnCancelText: t(
				'gestion_grupo>calificaciones>instrumento_boton_volver',
				'Volver a componentes'
			)
		},
		removeInstrument: {
			title: t(
				'gestion_grupo>calificaciones>eliminar_instrumento',
				'Eliminar instrumento'
			),
			handleClick: async () => {
				const index = components.findIndex(
					(el) => el?.id === selectedComponent?.id
				)
				if (index !== -1) {
					const newComponents = JSON.parse(JSON.stringify(components))
					const instruments = newComponents[index].instrumentos || []
					const instrumentIndex = instruments.findIndex(
						(el) => el.id === selectedInstrument?.id
					)
					instruments.splice(instrumentIndex, 1)
					newComponents[index] = {
						...newComponents[index],
						instrumentos: instruments
					}
					const response = await updateComponents()
					let res
					if (response) {
						res = await actions.updateJSON(
							'Componentes',
							newComponents,
							subject,
							selectedPeriod
						)
						setComponents(newComponents)
					}
					if (res === undefined) {
						setOpenModal('')
						return
					}
					setOpenModal(
						!res?.error
							? 'instrumentRemoved'
							: 'instrumentNotRemoved'
					)
				}
			},
			body: (
				<>
					<p>
						{t(
							'gestion_grupo>calificaciones>eliminar_instrumento_pregunta',
							'¿Está seguro que deseas eliminar el instrumento seleccionado?'
						)}
					</p>
				</>
			),
			btnSubmitText: t(
				'expediente_ce>horario>si_eliminar',
				'Sí, eliminar'
			)
		},
		instrumentNotRemoved: {
			title: t(
				'configuracion>anio_educativo>eliminar>titulo',
				'Atención'
			),
			btnSubmitText: t(
				'configuracion>centro_educativo>ver_centro_educativo>oferta_educativa>mallas_curriculares>modelo_oferta>eliminar_asignatura>btn_aceptar',
				'¡Entendido!'
			),
			body: (
				<>
					<p>
						{t(
							'gestion_grupo>calificaciones>eliminar_instrumento_error',
							'No se puede eliminar el instrumento debido a que presenta calificaciones relacionadas con el mismo.'
						)}
					</p>
				</>
			)
		},
		instrumentRemoved: {
			title: t(
				'gestion_grupo>calificaciones>eliminar_instrumento_exito',
				'Instrumento eliminado'
			),
			body: (
				<>
					<p>
						{t(
							'gestion_grupo>calificaciones>eliminar_instrumento_confirmacion',
							'El instrumento ha sido eliminado con éxito.'
						)}
					</p>
				</>
			),
			showOnlyBtnSubmit: true,
			btnSubmitText: t(
				'configuracion>centro_educativo>ver_centro_educativo>oferta_educativa>mallas_curriculares>modelo_oferta>eliminar_asignatura>btn_aceptar',
				'¡Entendido!'
			),
			handleClick: () => setOpenModal('')
		},
		addEscala: {
			title: selectedComponent?.escalaCalificacion
				? t(
						'gestion_grupo>calificaciones>editar_escala',
						'Editar escala'
				  )
				: t(
						'gestion_grupo>calificaciones>añadir_escala',
						'Añadir escala'
				  ),
			notCloseModal: true,
			handleClick: async () => {
				const index = components.findIndex(
					(el) => el?.id === selectedComponent?.id
				)
				if (index !== -1) {
					const newComponents = JSON.parse(JSON.stringify(components))
					const maximoPuntajeEscala =
						selectedComponent.escalaCalificacion.reduce(
							(acc, cur) => {
								return cur.rango.superior > acc
									? cur.rango.superior
									: acc
							},
							0
						)
					newComponents[index] = {
						...selectedComponent,
						puntos: maximoPuntajeEscala
					}
					setComponents(newComponents)
					const response = await updateComponents()
					if (response) {
						await actions.updateJSON(
							'Componentes',
							newComponents,
							subject,
							selectedPeriod
						)
					}
				}
				setOpenModal('')
				setSelectedComponent(null)
			},
			body: (
				<div>
					<p>
						{t(
							'gestion_grupo>calificaciones>escala_calificacion',
							'Escala de calificación del componente'
						)}
						: {selectedComponent?.nombre}
					</p>
					<GridEscalaCalificacion
						data={selectedComponent?.escalaCalificacion || []}
						setData={(data) => {
							setSelectedComponent((prevState) => ({
								...prevState,
								escalaCalificacion: JSON.parse(data)
							}))
						}}
					/>
				</div>
			)
		},
		addComponent: {
			title: t(
				'gestion_grupo>calificaciones>añadir_componente_evaluacion',
				'Añadir component de evaluación'
			),
			handleClick: async () => {
				if (Number(inputValues.points) < 0) {
					setSnackbarContent({
						variant: 'error',
						msg: t(
							'gestion_grupo>calificaciones>msj_puntos_menor": "Los puntos no pueden ser menor a 0',
							'Los puntos no pueden ser menor a 0'
						)
					})
					handleClick()
					return
				}
				if (!inputValues.specificPercentage) {
					setSnackbarContent({
						variant: 'error',
						msg: t(
							'gestion_grupo>calificaciones>indicar_porcentaje',
							'Debe indicar el porcentaje'
						)
					})
					handleClick()
					return
				}
				if (Number(inputValues.specificPercentage) < 0) {
					setSnackbarContent({
						variant: 'error',
						msg: t(
							'gestion_grupo>calificaciones>porcentaje_error',
							'El porcentaje no pueden ser menor a 0'
						)
					})
					handleClick()
					return
				}
				const newComponents = JSON.parse(JSON.stringify(components))
				newComponents.push({
					id: guidGenerator(),
					sb_componenteCalificacionId: guidGenerator(),
					nombre: inputValues?.name,
					valor: Number(inputValues?.specificPercentage),
					puntos: Number(inputValues?.points),
					instrumentos: []
				})
				let res = { error: true }
				const response = await updateComponents()
				if (response) {
					res = await actions.updateJSON(
						'Componentes',
						newComponents,
						subject,
						selectedPeriod
					)
				}
				if (!res.error) {
					setComponents(newComponents)
				}
				setOpenModal('')
				setInputValues({
					name: '',
					points: '',
					rubrica: null,
					specificPercentage: ''
				})
			},
			body: (
				<>
					<div className="">
						<h6>{t(' dir_regionales>col_nombre', 'Nombre')}*</h6>
						<Input
							type="text"
							value={inputValues?.name || ''}
							onChange={onChange}
							name="name"
						/>
					</div>
					<div className="my-3">
						<h6>
							{t(
								'expediente_ce>normativa_interna>puntos',
								'Puntos'
							)}
						</h6>
						<Input
							type="number"
							value={inputValues.points || null}
							onChange={onChange}
							invalid={Number(inputValues.points) < 0}
							name="points"
						/>
					</div>
					<div className="my-3">
						<h6>
							{t(
								'gestion_grupo>calificaciones>porcentaje_especifico',
								'Porcentaje específico'
							)}
						</h6>
						<Input
							type="number"
							value={inputValues?.specificPercentage || null}
							onChange={onChange}
							invalid={Number(inputValues.specificPercentage) < 0}
							name="specificPercentage"
						/>
					</div>
				</>
			)
		},
		editComponent: {
			title: t('general>tooltip>editar_componente', 'Editar componente'),
			handleClick: async () => {
				const index = components.findIndex(
					(el) => el?.id === selectedComponent?.id
				)
				if (index !== -1) {
					const newComponents = JSON.parse(JSON.stringify(components))
					newComponents[index] = selectedComponent
					setComponents(newComponents)
					const response = await updateComponents()
					if (response) {
						await actions.updateJSON(
							'Componentes',
							newComponents,
							subject,
							selectedPeriod
						)
					}
				}
				setSelectedComponent(null)
			},
			body: (
				<>
					{scoreType === 'open' && (
						<div className="">
							<h6>
								{t(' dir_regionales>col_nombre', 'Nombre')}*
							</h6>
							<Input
								type="text"
								value={selectedComponent?.nombre || ''}
								onChange={(e) => {
									const { name, value } = e.target
									setSelectedComponent((prevState) => ({
										...prevState,
										[name]: value
									}))
								}}
								name="nombre"
							/>
						</div>
					)}
					<div className="my-3">
						<h6>
							{t(
								'expediente_ce>normativa_interna>puntos',
								'Puntos'
							)}
						</h6>
						<Input
							type="number"
							value={selectedComponent?.puntos || ''}
							onChange={(e) => {
								const { name, value } = e.target
								setSelectedComponent((prevState) => ({
									...prevState,
									[name]: value
								}))
							}}
							name="puntos"
						/>
					</div>
				</>
			)
		}
	}

	return (
		<Col>
			{snackbar(snackbarContent.variant, snackbarContent.msg)}
			<CustomModal
				isOpen={
					openModal.length > 0 &&
					openModal !== 'dropdown-period' &&
					openModal !== 'addRubrica' &&
					openModal !== 'editRubrica'
				}
				toggle={() => setOpenModal('')}
				size={modals[openModal]?.size || 'md'}
				style={{ borderRadius: '10px' }}
				centered="static"
			>
				<ModalHeader>{modals[openModal]?.title}</ModalHeader>
				<ModalBody>{modals[openModal]?.body}</ModalBody>
				<ModalFooter>
					<div className="d-flex justify-content-center align-items-center w-100">
						{!modals[openModal]?.showOnlyBtnSubmit && (
							<Button
								color="outline-primary"
								className="mr-3"
								onClick={() => {
									setOpenModal('')
									setInputValues({
										name: '',
										points: '',
										rubrica: null,
										specificPercentage: ''
									})
									setSelectedComponent(null)
								}}
							>
								{modals[openModal]?.btnCancelText ||
									t('boton>general>cancelar', 'Cancelar')}
							</Button>
						)}
						<Button
							color="primary"
							onClick={() => {
								if (!modals[openModal].notCloseModal) {
									setOpenModal('')
								}
								modals[openModal]?.handleClick()
							}}
						>
							{modals[openModal]?.btnSubmitText ||
								t('boton>general>confirmar', 'Confirmar')}
						</Button>
					</div>
				</ModalFooter>
			</CustomModal>
			<RubricaModal
				handleCerrar={async (data: any) => {
					swal({
						title: t(
							'gestion_grupo>asistencia>cambios_realizados',
							'Cambios realizados'
						),
						text: t(
							'gestion_grupos>calificacion>modal_msg',
							'Se han detectado cambios en la calificación del indicador de aprendizaje esperado'
						),
						icon: 'warning',
						className: 'text-alert-modal',
						buttons: {
							ok: {
								text: t(
									'configuracion>ofertas_educativas>modelo_de_ofertas>eliminar>aceptar',
									'Aceptar'
								),
								value: true,
								className: 'btn-alert-color'
							},
							cancel: t('boton>general>cancelar', 'Cancelar')
						}
					}).then(async (result) => {
						if (result) {
							const index = components.findIndex(
								(el) => el?.id === selectedComponent?.id
							)
							const copy = JSON.parse(
								JSON.stringify(data.contenidos)
							)
							const puntos = data.contenidos.reduce(
								(acc, cur) => {
									const pointsPerContent =
										cur.columnas.reduce(
											(accumulator, current) => {
												return accumulator >
													Number(current.puntos)
													? accumulator
													: Number(current.puntos)
											},
											0
										)
									return (
										acc +
										cur.filas.filter((row) => !row.inactiva)
											.length *
											pointsPerContent
									)
								},
								0
							)
							const puntosObject = {}
							data.contenidos.forEach((el, contenidoIndex) => {
								el.columnas.forEach((item, columnaIndex) => {
									puntosObject[columnaIndex] = item?.puntos
								})

								data.contenidos[contenidoIndex]?.filas.forEach(
									(row, rowIndex) => {
										row?.celdas?.forEach(
											(cell, cellIndex) => {
												copy[contenidoIndex].filas[
													rowIndex
												].celdas[cellIndex] = {
													...cell,
													puntos: Number(
														puntosObject[cellIndex]
													)
												}
											}
										)
									}
								)
							})
							data.contenidos = copy
							if (index !== -1 && selectedInstrument) {
								const newComponents = JSON.parse(
									JSON.stringify(components)
								)
								const newInstruments =
									newComponents[index].instrumentos
								const instrumentIndex =
									newInstruments.findIndex(
										(el) =>
											el?.id === selectedInstrument?.id
									)

								newInstruments[instrumentIndex] = {
									...selectedInstrument,
									rubricaAprendizaje:
										data?.contenidos?.length > 0
											? { ...data, puntos }
											: null,
									puntos: puntos === 0 ? null : puntos
								}
								newComponents[index] = {
									...newComponents[index],
									instrumentos: newInstruments
								}
								setComponents(newComponents)
								const response = await updateComponents()
								if (response) {
									await actions.updateJSON(
										'Componentes',
										newComponents,
										subject,
										selectedPeriod
									)
								}
							}

							if (index !== -1 && !selectedInstrument) {
								const auxNewComponents = JSON.parse(
									JSON.stringify(components)
								)
								auxNewComponents[index] = {
									...auxNewComponents[index],
									rubricaAprendizaje:
										data?.contenidos?.length > 0
											? { ...data, puntos }
											: null,
									puntos: puntos === 0 ? null : puntos
								}
								setComponents(auxNewComponents)
								const response = await updateComponents()
								if (response) {
									await actions.updateJSON(
										'Componentes',
										auxNewComponents,
										subject,
										selectedPeriod
									)
								}
							}
						}
						setOpenModal('')
					})
				}}
				open={openModal === 'addRubrica' || openModal === 'editRubrica'}
				sendData={(data, student = 0) => {}}
				contenidos={contenidos}
				initialData={{}}
				isEdit
				allowOverrideFlags={selectedComponent?.noRequiereInstrumentos}
			/>
			<div className="d-flex justify-content-end my-3">
				<Dropdown
					isOpen={openModal === 'dropdown-period'}
					toggle={() =>
						setOpenModal((prevState) =>
							prevState === 'dropdown-period'
								? ''
								: 'dropdown-period'
						)
					}
				>
					<CustomDropdownToggle caret color="primary">
						{selectedPeriod?.nombre ||
							t(
								'gestion_grupos>escoge_periodo',
								'Escoge un periodo'
							)}
					</CustomDropdownToggle>
					<DropdownMenu>
						{bloques.map((period) => (
							<DropdownItem
								onClick={() => setSelectedPeriod(period)}
								key={period.id}
							>
								{period.nombre}
							</DropdownItem>
						))}
					</DropdownMenu>
				</Dropdown>
			</div>
			<Card>
				<CardBody>
					<Table
						data={selectedPeriod === null ? [] : tableState.data}
						columns={columns as any}
						orderOptions={[]}
						useExpanded
						avoidSearch
					/>
					{(selectedPeriod === null ||
						tableState.data.length === 0) && (
						<p
							className="d-flex justify-content-center align-items-center"
							style={{ fontWeight: 'bold', fontSize: '1.2rem' }}
						>
							{t(
								'general>mensaje>no_resultados',
								'No hay resultados'
							)}
						</p>
					)}
					{scoreType === 'open' && (
						<Button
							color="primary"
							onClick={() => setOpenModal('addComponent')}
						>
							+{' '}
							{t(
								'gestion_grupo>calificaciones>agregar_componente',
								'Agregar componente'
							)}
						</Button>
					)}
				</CardBody>
			</Card>
		</Col>
	)
}

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

const CustomModal = styled(Modal)`
	&.modal-dialog {
		box-shadow: unset !important;
	}
	& > div.modal-content {
		border-radius: 10px !important;
	}
`

export default ComponentsSettings
