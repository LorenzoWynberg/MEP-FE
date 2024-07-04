import colors from 'Assets/js/colors'
import React, { useState, useEffect } from 'react'
import {
	Modal,
	ModalBody,
	ModalHeader,
	Button,
	Input,
	Card,
	CardBody,
	CardTitle
} from 'reactstrap'
import AddCircleIcon from '@material-ui/icons/AddCircle'
import DeleteIcon from '@material-ui/icons/Delete'
import { ChromePicker } from 'react-color'
import styled from 'styled-components'
import AddIcon from '@material-ui/icons/Add'
import { guidGenerator } from 'Utils/GUIDGenerator'
import { isEqual } from 'lodash'
import Tooltip from '@mui/material/Tooltip'
import { ErrorOutline } from '@material-ui/icons'
import { ModalFooter } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'

interface IProps {
	sendData: (data: object, nextStudent?: number) => void
	handleCerrar: (data: object, fullOverride?: boolean) => void
	initialData: object
	open: boolean
	isEdit?: boolean
	contenido?: any
	avoidModal?: boolean
	data?: object
	editedContents?: string
	noEdit?: boolean
	hasMore?: boolean
	hasLess?: boolean
	contenidos?: any[]
	HTMLComponents?: any
	consolidado?: boolean
	allowOverrideFlags?: boolean
	headerData?: Array<any>
}

interface Icontenido {
	nombre?: string
	columnas: any[]
	filas: any[]
}

interface IEditedObject {
	selectedIds?: any[]
	observaciones?: object
	contenidos?: Icontenido[]
	contenido?: Icontenido
}
interface data {
	student?: any
	editedObject: IEditedObject
	objectiveIdx?: number
	jsonData?: string
	puntos?: number
}

const RubricaModal: React.FC<IProps> = (props) => {
	const { t } = useTranslation()
	const [data, setData] = useState<data>({
		puntos: 0,
		student: {},
		editedObject: {
			selectedIds: [],
			observaciones: {},
			contenidos: [],
			contenido: { columnas: [], filas: [] }
		}
	})
	const [showColor, setShowColor] = useState<null | string>(null)
	const [firstCalled, setFirstCalled] = useState<boolean>(false)
	const [points, setPoints] = useState<number>(0)
	const [openModal, setOpenModal] = useState({
		current: null,
		data: null
	})
	useEffect(() => {
		if (
			!isEqual(
				{ contenidos: data?.contenidos, stdent: data?.student },
				{
					contenidos: props.data?.contenidos,
					stdent: props.data?.student
				}
			)
		) {
			let jsonData = props.data?.jsonData
				? JSON.parse(props.data.jsonData)
				: { selectedIds: [], observaciones: {} }
			if (
				!props.data?.jsonData &&
				(props?.data?.selectedIds || props?.data?.observaciones)
			) {
				jsonData = {
					selectedIds: props?.data?.selectedIds || [],
					observaciones: props?.data?.observaciones || {}
				}
			}
			setData({
				...props.data,
				editedObject: {
					contenido: props.contenido,
					objectiveIdx: jsonData.objectiveIdx,
					selectedIds: jsonData.selectedIds,
					observaciones: jsonData.observaciones || {},
					contenidos: props.contenidos
				}
			})
			if (!firstCalled) {
				setFirstCalled(true)
			}
		}
	}, [props.data])

	useEffect(() => {
		if (props.isEdit) {
			setData({
				...props.data,
				editedObject: {
					...data.editedObject,
					contenidos: props.contenidos
				}
			})
		} else {
			let jsonData = props.data?.jsonData
				? JSON.parse(props.data.jsonData)
				: { selectedIds: [], observaciones: {} }
			if (
				!props.data?.jsonData &&
				(props.data.selectedIds || props.data.observaciones)
			) {
				jsonData = {
					selectedIds: props.data?.selectedIds || [],
					observaciones: props.data?.observaciones || {}
				}
			}
			setData({
				...props.data,
				editedObject: {
					...data.editedObject,
					contenido: props.contenido,
					objectiveIdx: jsonData.objectiveIdx,
					selectedIds: jsonData.selectedIds,
					observaciones: jsonData.observaciones || {},
					contenidos: props.contenidos
				}
			})
		}
	}, [props.contenido, props.contenidos, props.open])

	const handleEdit = (
		value: any,
		type: string | null,
		contenidoIdx: number | null = null
	): void => {
		// debugger
		if (contenidoIdx !== null) {
			const _data = { ...data }
			_data.editedObject = {
				...data.editedObject,
				contenidos: data.editedObject.contenidos.map((el, elIdx) => {
					if (elIdx === contenidoIdx) {
						let finalValue
						if (type) {
							finalValue = {
								...el,
								[type]: value
							}
						} else {
							finalValue = value
						}
						return finalValue
					}
					return { ...el }
				})
			}
			setData(_data)
		} else {
			const _data = { ...data }
			_data.editedObject = { ...data.editedObject, [type]: value }
			setData(_data)
		}
	}

	const removeIndicadorColumn = (
		colIdx: number,
		contenidoIdx: number
	): void => {
		handleEdit(
			{
				...data.editedObject.contenidos[contenidoIdx],
				filas: data.editedObject.contenidos[contenidoIdx]?.filas.map(
					(el) => {
						return {
							...el,
							celdas: el.celdas.filter(
								(cell, cellIdx) => cellIdx !== colIdx
							)
						}
					}
				),
				columnas: data.editedObject.contenidos[
					contenidoIdx
				]?.columnas.filter((el, elIdx) => elIdx !== colIdx)
			},
			null,
			contenidoIdx
		)
	}

	const addColl = (contenidoIdx: number): void => {
		debugger
		const colArray = data.editedObject.contenidos[contenidoIdx]?.columnas
			? [
				...data.editedObject.contenidos[contenidoIdx]?.columnas,
				{ id: guidGenerator(), color: colors.primary, nombre: '' }
			]
			: [{ id: guidGenerator(), color: colors.primary, nombre: '' }]
		handleEdit(
			{
				...data.editedObject.contenidos[contenidoIdx],
				filas: data.editedObject.contenidos[contenidoIdx]?.filas.map(
					(el) => {
						return {
							...el,
							celdas: [
								...el.celdas,
								{ nombre: '', id: guidGenerator() }
							]
						}
					}
				),
				columnas: colArray
			},
			null,
			contenidoIdx
		)
	}

	const addRow = (contenidoIdx: number): void => {
		handleEdit(
			{
				...data.editedObject.contenidos[contenidoIdx],
				filas: data.editedObject.contenidos[contenidoIdx]?.filas
					? [
						...data.editedObject.contenidos[contenidoIdx]
							?.filas,
						{
							id: guidGenerator(),
							nombre: '',
							celdas: data.editedObject.contenidos[
								contenidoIdx
							]?.columnas.map((_, colIdx) => ({
								id: guidGenerator(),
								nombre: ''
							}))
						}
					]
					: [
						{
							id: guidGenerator(),
							nombre: '',
							celdas: data.editedObject.contenidos[
								contenidoIdx
							]?.columnas.map((_) => ({
								id: _.id,
								nombre: ''
							}))
						}
					]
			},
			null,
			contenidoIdx
		)
	}

	const removeIndicadorRow = (rowIdx: number, contenidoIdx: number): void => {
		handleEdit(
			{
				...data.editedObject.contenidos[contenidoIdx],
				filas: data.editedObject.contenidos[contenidoIdx]?.filas.filter(
					(el: any, elIdx: number) => elIdx !== rowIdx
				)
			},
			null,
			contenidoIdx
		)
	}

	const handleEditRow = (
		value: any,
		type: string,
		rowIdx: number,
		contenidoIdx: number
	): void => {
		handleEdit(
			{
				...data.editedObject.contenidos[contenidoIdx],
				filas: data.editedObject.contenidos[contenidoIdx]?.filas.map(
					(el: any, elIdx: number) => {
						if (elIdx === rowIdx) {
							return {
								...el,
								[type]: value
							}
						}
						return { ...el }
					}
				)
			},
			null,
			contenidoIdx
		)
	}

	const handleEditCell = (
		value: any,
		type: string,
		cellIdx: number,
		contenidoIdx: number
	): void => {
		const newData: any = {
			...data.editedObject.contenidos[contenidoIdx],
			columnas: data.editedObject.contenidos[contenidoIdx]?.columnas.map(
				(el: any, elIdx: number) => {
					if (elIdx === cellIdx) {
						return {
							...el,
							[type]: value
						}
					}
					return { ...el }
				}
			)
		}
		if (type === 'puntos') {
			newData.filas = data.editedObject.contenidos[
				contenidoIdx
			]?.filas.map((el) => {
				const newCeldas = [...el.celdas]
				newCeldas[cellIdx] = { ...el.celdas[cellIdx], puntos: value }
				return { ...el, celdas: newCeldas }
			})
		}

		handleEdit(newData, null, contenidoIdx)
	}

	const handleEditRowCell = (
		value: any,
		type: string,
		rowIdx: number,
		cellIdx: number,
		contenidoIdx: number
	): void => {
		const cells = data.editedObject.contenidos[contenidoIdx]?.filas[
			rowIdx
		].celdas.map((cell: any, elIdx: number) => {
			if (elIdx === cellIdx) {
				return {
					...cell,
					[type]: value
				}
			}
			return { ...cell }
		})
		handleEditRow(cells, 'celdas', rowIdx, contenidoIdx)
	}

	const addContent = (): void => {
		handleEdit(
			[
				...data.editedObject.contenidos,
				{ id: guidGenerator(), filas: [], columnas: [], nombre: '' }
			],
			'contenidos'
		)
	}

	const removeContent = (contenidoIdx: number) => {
		handleEdit(
			data.editedObject.contenidos.filter(
				(el: any, elIdx: number) => elIdx !== contenidoIdx
			),
			'contenidos'
		)
	}

	const GetData = () => {
		return (
			<>
				{!props.isEdit && !props.consolidado && (
					<div
						style={{
							margin: '1rem',
							width: '100%',
							display: 'flex',
							justifyContent: 'space-between'
						}}
					>
						{props.hasLess ? (
							<Button
								color="primary"
								onClick={() => {
									setPoints(0)
									props.sendData(
										{
											id: data.id,
											...data.editedObject,
											objectiveIdx: data.objectiveIdx,
											puntos: points
										},
										-1
									)
								}}
							>
								<i className="fas fa-arrow-circle-left" />
								{t('general>anterior', 'Anterior')}
							</Button>
						) : (
							<div />
						)}
						<span>{`${data.student?.datosIdentidadEstudiante?.nombre} ${data.student?.datosIdentidadEstudiante?.primerApellido} ${data.student?.datosIdentidadEstudiante?.segundoApellido}`}</span>
						{props.hasMore ? (
							<Button
								color="primary"
								onClick={() => {
									setPoints(0)
									props.sendData(
										{
											id: data.id,
											...data.editedObject,
											objectiveIdx: data.objectiveIdx,
											puntos: points
										},
										1
									)
								}}
							>
								{t('general>siguiente', 'Siguiente')}{' '}
								<i className="fas fa-arrow-circle-right" />
							</Button>
						) : (
							<div />
						)}
					</div>
				)}
				{props.HTMLComponents && props.HTMLComponents}
				{props.isEdit && (
					<div
						style={{
							justifyContent: 'space-between',
							alignItems: 'center',
							display: 'flex',
							marginBottom: '10px'
						}}
					>
						<h6>
							{t(
								'gestion_grupo>rubrica_modal>rubrica_indicador',
								'Rúbrica de indicador de aprendizajes'
							)}
						</h6>
						<div
							style={{
								display: 'flex',
								justifyContent: 'center',
								marginTop: '1rem'
							}}
						>
							<Button
								color="primary"
								style={{
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'center'
								}}
								onClick={() => addContent()}
							>
								<AddIcon />{' '}
								{t('boton>general>agregrar', 'Agregar')}
							</Button>
						</div>
					</div>
				)}

				{props.isEdit ? (
					data.editedObject.contenidos?.map(
						(contenido: any, contenidoIdx: number) => {
							return (
								<>
									<div
										style={{
											width: '100%',
											backgroundColor: colors.primary,
											padding: '1rem',
											color: 'white',
											marginBottom: '6px'
										}}
									>
										<span>
											{t(
												'gestion_grupo>rubicrza>indicador/contenido/etapa',
												'Indicador / Contenido Curricular / Etapa'
											)}
										</span>
										<div style={{ display: 'flex' }}>
											<Input
												value={contenido.nombre}
												onChange={(e) =>
													handleEdit(
														e.target.value,
														'nombre',
														contenidoIdx
													)
												}
											/>
											<DeleteIcon
												className="cursor-pointer"
												fontSize="large"
												onClick={() =>
													removeContent(contenidoIdx)
												}
											/>
										</div>
									</div>
									<table className="rubricasTable">
										<thead>
											<th>
												{t(
													'configuracion>mallas_curriculares>indicadores_aprendizaje>indicadores_aprendizaje',
													'Indicadores de aprendizaje esperados'
												)}
											</th>
											{contenido?.columnas?.map(
												(col, idx) => {
													return (
														<th
															style={{
																backgroundColor:
																	col.color ||
																	''
															}}
														>
															<Input
																value={
																	col.nombre
																}
																style={{
																	width: '100%'
																}}
																onChange={(e) =>
																	handleEditCell(
																		e.target
																			.value,
																		'nombre',
																		idx,
																		contenidoIdx
																	)
																}
															/>
															<div
																style={{
																	display:
																		'flex',
																	justifyContent:
																		'space-between',
																	alignItems:
																		'center',
																	marginTop:
																		'5px'
																}}
															>
																<Input
																	placeholder="Puntos"
																	type="number"
																	style={{
																		width: '5rem'
																	}}
																	value={
																		col.puntos
																	}
																	onChange={(
																		e
																	) =>
																		handleEditCell(
																			e
																				.target
																				.value,
																			'puntos',
																			idx,
																			contenidoIdx
																		)
																	}
																/>
																<div
																	style={{
																		display:
																			'flex',
																		alignItems:
																			'center',
																		marginTop:
																			'5px'
																	}}
																>
																	<span>
																		{t(
																			'configuracion>centro_educativo>agregar>color',
																			'Color'
																		)}
																	</span>
																	<BtnColor
																		style={{
																			cursor: 'pointer'
																		}}
																		onClick={() => {
																			setShowColor(
																				showColor ===
																					`${contenidoIdx}-${idx}`
																					? null
																					: `${contenidoIdx}-${idx}`
																			)
																		}}
																	/>
																	<DeleteIcon
																		onClick={() =>
																			removeIndicadorColumn(
																				idx,
																				contenidoIdx
																			)
																		}
																	/>
																</div>
															</div>
															{showColor ==
																`${contenidoIdx}-${idx}` && (
																	<ChromeContainer>
																		<div
																			style={{
																				position:
																					'fixed',
																				top: '0px',
																				right: '0px',
																				bottom: '0px',
																				left: '0px'
																			}}
																			onClick={() =>
																				setShowColor(
																					null
																				)
																			}
																		/>
																		<ChromePicker
																			color={
																				col.color
																			}
																			onChange={(
																				color
																			) => {
																				handleEdit(
																					contenido?.columnas.map(
																						(
																							el,
																							elIdx
																						) => {
																							if (
																								elIdx ===
																								idx
																							) {
																								return {
																									...el,
																									color: color.hex
																								}
																							}
																							return {
																								...el
																							}
																						}
																					),
																					'columnas',
																					contenidoIdx
																				)
																			}}
																		/>
																	</ChromeContainer>
																)}
														</th>
													)
												}
											)}
											<th
												onClick={() =>
													addColl(contenidoIdx)
												}
											>
												<div
													style={{
														justifyContent:
															'center',
														alignItems: 'center',
														display: 'flex',
														flexDirection: 'column'
													}}
												>
													<AddCircleIcon />
													<span>
														{t(
															'configuracion>mallas_curriculares>indicadores_aprendizaje>ver>fila>agregar_nivel_aprendi',
															'Agregar nivel de aprendizaje'
														)}
													</span>
												</div>
											</th>
										</thead>
										<tbody>
											{contenido.filas?.map(
												(row, rowIdx) => {
													return (
														<tr
															style={{
																backgroundColor:
																	!row.inactiva
																		? 'unset'
																		: colors.opaqueGray
															}}
														>
															<td
																style={{
																	padding:
																		'5px'
																}}
															>
																<textarea
																	style={{
																		backgroundColor:
																			!row.inactiva
																				? 'unset'
																				: colors.opaqueGray
																	}}
																	value={
																		row.nombre
																	}
																	onChange={(
																		e
																	) => {
																		handleEditRow(
																			e
																				.target
																				.value,
																			'nombre',
																			rowIdx,
																			contenidoIdx
																		)
																	}}
																/>
															</td>
															{row.celdas.map(
																(
																	cell,
																	cellIdx
																) => {
																	return (
																		<td
																			style={{
																				padding:
																					'5px'
																			}}
																		>
																			<textarea
																				value={
																					cell.nombre
																				}
																				onChange={(
																					e
																				) => {
																					handleEditRowCell(
																						e
																							.target
																							.value,
																						'nombre',
																						rowIdx,
																						cellIdx,
																						contenidoIdx
																					)
																				}}
																				style={{
																					backgroundColor:
																						!row.inactiva
																							? 'unset'
																							: colors.opaqueGray
																				}}
																			/>
																		</td>
																	)
																}
															)}
															{false && (
																<td>
																	<div
																		style={{
																			justifyContent:
																				'center',
																			alignItems:
																				'center',
																			display:
																				'flex',
																			flexDirection:
																				'column'
																		}}
																	>
																		<DeleteIcon
																			style={{
																				cursor: 'pointer'
																			}}
																			color="primary"
																			onClick={() =>
																				removeIndicadorRow(
																					rowIdx,
																					contenidoIdx
																				)
																			}
																		/>
																	</div>
																</td>
															)}
															{true &&
																contenido.filas
																	.length >
																0 &&
																!row.inactiva && (
																	<td>
																		<div
																			style={{
																				justifyContent:
																					'center',
																				alignItems:
																					'center',
																				display:
																					'flex',
																				flexDirection:
																					'column',
																				cursor: 'pointer'
																			}}
																		>
																			<Tooltip
																				title={t(
																					'general>tooltip>inactivar_indicador',
																					'Inactivar indicador'
																				)}
																			>
																				<img
																					src="/assets/img/inactivar_icono.svg"
																					alt="Inactivar indicador"
																					onClick={() => {
																						setOpenModal(
																							{
																								current:
																									'inactivar-indicador',
																								data: {
																									value: true,
																									type: 'inactiva',
																									rowIdx,
																									contenidoIdx
																								}
																							}
																						)
																					}}
																				/>
																			</Tooltip>
																		</div>
																	</td>
																)}
															{true &&
																contenido.filas
																	.length >
																0 &&
																row.inactiva && (
																	<td>
																		<div
																			style={{
																				justifyContent:
																					'center',
																				alignItems:
																					'center',
																				display:
																					'flex',
																				flexDirection:
																					'column',
																				cursor: 'pointer'
																			}}
																		>
																			<Tooltip
																				title={t(
																					'general>tooltip>reactivar_indicador',
																					'Reactivar indicador'
																				)}
																			>
																				<img
																					src="/assets/img/reactivar_indicador.svg"
																					alt="Reactivar indicador"
																					onClick={() => {
																						handleEditRow(
																							false,
																							'inactiva',
																							rowIdx,
																							contenidoIdx
																						)
																						// setOpenModal({
																						//     current: 'inactivar-indicador',
																						//     data: {
																						//         value: false,
																						//         type: 'inactiva',
																						//         rowIdx,
																						//         contenidoIdx
																						//     }
																						// })
																					}}
																				/>
																			</Tooltip>
																		</div>
																	</td>
																)}
														</tr>
													)
												}
											)}
										</tbody>
									</table>
									<div
										style={{
											color: colors.primary,
											justifyContent: 'space-between',
											alignItems: 'center',
											display: 'flex',
											marginBottom: '1rem'
										}}
									>
										<div
											onClick={() => addRow(contenidoIdx)}
											style={{
												color: colors.primary,
												justifyContent: 'center',
												alignItems: 'center',
												display: 'flex',
												cursor: 'pointer'
											}}
										>
											<AddCircleIcon />
											{t(
												'configuracion>mallas_curriculares>indicadores_aprendizaje>ver>boton>agregar_indicador_aprendi',
												'Agregar indicador de aprendizaje'
											)}
										</div>
									</div>
								</>
							)
						}
					)
				) : (
					<>
						{data.editedObject.contenidos ? (
							data.editedObject.contenidos.map(
								(contenido: any, contenidoIdx: number) => {
									return (
										<>
											<div className="d-flex align-items-center">
												<div className="mr-5">
													{t(
														'gestion_grupo>calificacion>puntos_estudiante',
														'Puntos del estudiante'
													)}{' '}
													<span
														style={{
															fontWeight: 'bold'
														}}
													>
														{props.headerData
															? props.headerData[
																contenidoIdx
															]?.puntos
															: 0}
														pts
													</span>
												</div>
												<div className="mr-5">
													{t(
														'configuracion>anio_educativo>columna_acciones>ver>calendarios_asociados>agregar_calendarios>periodos>agregar>porcentaje',
														'Porcentaje'
													)}{' '}
													<span
														style={{
															fontWeight: 'bold'
														}}
													>
														{props.headerData
															? props.headerData[
																contenidoIdx
															]?.porcentaje
															: '-'}{' '}
														/{' '}
														{props.headerData
															? props.headerData[
																contenidoIdx
															]?.valor
															: 0}
														%
													</span>
												</div>
												<div className="mr-5">
													{t(
														'gestion_grupo>calificacion>indicadores_evaluados',
														'Indicadores evaluados'
													)}{' '}
													<span style={{ fontWeight: 'bold' }}>
														{' '}
														{props.headerData
															? props.headerData[
																contenidoIdx
															]
																?.indicadoresEvaluados
															: 0}{' '}
														/{' '}
														{props.headerData ? props.headerData[contenidoIdx]?.indicadoresTotales : 0}
													</span>
												</div>
											</div>
											<div
												style={{
													width: '100%',
													backgroundColor: colors.primary,
													padding: '1rem',
													color: 'white',
													marginBottom: '6px',
													textAlign: 'center'
												}}
											>
												{contenido.nombre}
											</div>

											<table className="rubricasTable">
												<thead
													className="textCenter"
													style={{
														position: 'sticky'
													}}
												>
													<th>
														{t(
															'configuracion>mallas_curriculares>indicadores_aprendizaje>boton>previsualizar>indicadores_de _aprendizaje',
															'Indicadores de aprendizaje'
														)}
													</th>
													{contenido?.columnas?.map(
														(col) => {
															return (
																<th style={{ backgroundColor: col.color || '' }}>
																	<div>{col.nombre}</div>
																	{col.puntos ? (
																		<div>
																			{
																				col.puntos
																			}
																			pts
																		</div>
																	) : null}
																</th>
															)
														}
													)}
													<th>
														{t(
															'gestion_grupo>calificacion>recomendaciones',
															'Recomendaciones'
														)}
													</th>
												</thead>
												<tbody>
													{contenido?.filas?.map((row: any, rIdx: number) => {
														return (
															<tr style={{ backgroundColor: row.inactiva ? colors.opaqueGray : 'unset' }}>
																<td style={{ fontWeight: 'bold' }}>
																	<div style={{ cursor: 'pointer' }}>
																		{row.inactiva && (
																			<Tooltip title="Indicador inactivo">
																				<ErrorOutline
																					style={{
																						color: '#e74c3c',
																						marginRight:
																							'1rem',
																						fontSize:
																							'1.1rem'
																					}}
																				/>
																			</Tooltip>
																		)}
																	</div>
																	<div>
																		{
																			row.nombre
																		}
																	</div>
																</td>
																{row.celdas.map(
																	(
																		cell,
																		idx
																	) => {
																		const isIncluded =
																			data.editedObject.selectedIds?.includes(
																				typeof cell.id ===
																					'string'
																					? cell.id
																					: cell.guid
																			)
																		return (
																			<td
																				className={isIncluded ? 'selected' : ''}
																				style={{
																					pointerEvents:
																						row.inactiva
																							? 'none'
																							: 'auto'
																				}}
																				onClick={() => {
																					debugger
																					if (!row.inactiva) {
																						const _dataToDelete = row.celdas
																							.filter((el) => el.id !== cell.id)
																							.map((el) => typeof el.id === 'string' ? el.id : el.guid)
																						let val = [...data.editedObject.selectedIds]
																						if (!isIncluded) {
																							val = [
																								...val,
																								typeof cell.id === 'string' ? cell.id : cell.guidGenerator
																							]
																							if (idx === row.celdas.length - 1) {
																								setPoints((prevState) => (prevState += Number(cell.puntos) || 0))
																							}
																							val = val.filter((item) => !_dataToDelete.includes(item))
																						} else {
																							val =
																								[
																									...data.editedObject.selectedIds?.filter((el) =>
																										typeof cell.id ===
																											'string'
																											? el !==
																											cell.id
																											: el !==
																											cell.guid
																									)
																								]
																							val =
																								val.filter(
																									(
																										item
																									) =>
																										!_dataToDelete.includes(
																											item
																										)
																								)
																							setPoints(
																								(
																									prevState
																								) =>
																								(prevState +=
																									Number(
																										cell.puntos
																									) ||
																									0)
																							)
																						}
																						handleEdit(
																							val,
																							'selectedIds'
																						)
																					}
																				}}
																			>
																				{
																					cell.nombre
																				}
																			</td>
																		)
																	}
																)}
																<td>
																	<textarea
																		value={
																			data
																				.editedObject
																				.observaciones &&
																				data
																					.editedObject
																					.observaciones[
																				row
																					.id
																				]
																				? data
																					.editedObject
																					.observaciones[
																				row
																					.id
																				]
																				: ''
																		}
																		disabled={
																			props.consolidado
																		}
																		onChange={(
																			e
																		) => {
																			if (
																				!row.inactiva
																			) {
																				const observaciones =
																					data
																						.editedObject
																						.observaciones
																				observaciones[
																					row.id
																				] =
																					e.target.value
																				handleEdit(
																					observaciones,
																					'observaciones'
																				)
																			}
																		}}
																		style={{
																			backgroundColor:
																				row.inactiva
																					? colors.opaqueGray
																					: 'unset',
																			pointerEvents:
																				row.inactiva
																					? 'none'
																					: 'auto'
																		}}
																	/>
																</td>
															</tr>
														)
													}
													)}
												</tbody>
											</table>
										</>
									)
								}
							)
						) : (
							<>
								<div
									style={{
										width: '100%',
										backgroundColor: colors.primary,
										padding: '1rem',
										color: 'white',
										marginBottom: '6px',
										textAlign: 'center'
									}}
								>
									{data.editedObject.contenido?.nombre}
								</div>
								<>
								{/* <div style={{ width: '100%' }}>
									<table className="rubricasTable" style={{ position: 'absolute', width: 'calc(100% - 2rem)' }}>
										<thead
											className="textCenter">
											<th>
												{t(
													'configuracion>mallas_curriculares>indicadores_aprendizaje>boton>previsualizar>indicadores_de _aprendizaje',
													'Indicadores de aprendizaje'
												)}
											</th>
											{data.editedObject.contenido?.columnas?.map(
												(col) => {
													return (
														<th
															style={{
																backgroundColor:
																	col.color || ''
															}}
														>
															{col.nombre}
														</th>
													)
												}
											)}
											<th
												style={{
													// minWidth: '12rem'
												}}
											>
												{t(
													'expediente_ce>infraestructura>agregar_comparte>observaciones',
													'Observaciones'
												)}
											</th>
										</thead>
									</table>
								</div> */}
								<div
									style={{
										transform: 'scale(1)'
									}}
								>
									<div
										style={{
											maxHeight: '35rem',
											overflowY: 'scroll',
											overflowX: 'visible',
											width: 'fit-content'
										}}
									>

										<table className="rubricasTable" style={{ position: 'relative', width: 'fit-content', }}>
											<>
												<thead
													style={{
														// opacity: 0,
														position: 'fixed',
														top: 0,
														// visibility: 'hidden'
													}}
													className="textCenter">
													<th>
														{t(
															'configuracion>mallas_curriculares>indicadores_aprendizaje>boton>previsualizar>indicadores_de _aprendizaje',
															'Indicadores de aprendizaje'
														)}
													</th>
													{data.editedObject.contenido?.columnas?.map(
														(col) => {
															return (
																<th
																	style={{
																		backgroundColor:
																			col.color || ''
																	}}
																>
																	{col.nombre}
																</th>
															)
														}
													)}
													<th>
														{t(
															'expediente_ce>infraestructura>agregar_comparte>observaciones',
															'Observaciones'
														)}
													</th>
												</thead>
												<thead
													style={{
														opacity: 0,
														visibility: 'hidden'
													}}
													className="textCenter">
													<th>
														{t(
															'configuracion>mallas_curriculares>indicadores_aprendizaje>boton>previsualizar>indicadores_de _aprendizaje',
															'Indicadores de aprendizaje'
														)}
													</th>
													{data.editedObject.contenido?.columnas?.map(
														(col) => {
															return (
																<th
																	style={{
																		backgroundColor:
																			col.color || ''
																	}}
																>
																	{col.nombre}
																</th>
															)
														}
													)}
													<th>
														{t(
															'expediente_ce>infraestructura>agregar_comparte>observaciones',
															'Observaciones'
														)}
													</th>
												</thead>
											</>
											<tbody>
												{data.editedObject.contenido?.filas?.map(
													(row: any, rIdx: number) => {
														return (
															<tr
																style={{
																	backgroundColor:
																		row.inactiva
																			? colors.opaqueGray
																			: 'unset',
																	pointerEvents:
																		row.inactiva
																			? 'none'
																			: 'auto'
																}}
															>
																<td
																	style={{
																		fontWeight:
																			'bold'
																	}}
																>
																	{row.nombre}
																</td>
																{row.celdas.map(
																	(cell, idx) => {
																		const isIncluded = data.editedObject.selectedIds?.includes(
																			typeof cell.id === 'string' ? cell.id : cell.guid
																		)
																		if (isIncluded) {

																			console.log({
																				cell,
																				isIncluded,
																				selectedIds: data.editedObject.selectedIds,
																				row,
																			})
																		}
																		// if (isIncluded) {
																		// 	debugger
																		// }
																		return (
																			<td
																				className={isIncluded ? 'selected' : ''}
																				style={{
																					pointerEvents:
																						row.inactiva
																							? 'none'
																							: 'auto'
																				}}
																				onClick={() => {
																					// debugger
																					if (!row.inactiva) {
																						const _dataToDelete = row.celdas
																							.filter((el) => el.id !== cell.id)
																							.map((el) => typeof el.id === 'string' ? el.id : el.guid)
																						let val = [...data.editedObject.selectedIds]
																						if (!isIncluded) {
																							val = [
																								...val,
																								typeof cell.id === 'string' ? cell.id : cell.guid
																							]
																							if (idx === row.celdas.length - 1) {
																								setPoints((prevState) => (prevState += Number(cell.puntos) || 0))
																							}
																							val = val.filter((item) => !_dataToDelete.includes(item))
																						} else {
																							val = [
																								...data.editedObject.selectedIds?.filter((el) =>
																									typeof cell.id === 'string' ? el !== cell.id : el !== cell.guid
																								)
																							]
																							val = val.filter((item) => !_dataToDelete.includes(item))
																							setPoints((prevState) => (prevState += Number(cell.puntos) || 0))
																						}
																						handleEdit(val, 'selectedIds')
																					}
																				}}
																			>
																				{cell.nombre}
																			</td>
																		)
																	}
																)}
																<td>
																	<textarea
																		value={
																			data
																				.editedObject
																				.observaciones
																				? data
																					.editedObject
																					.observaciones[
																				row
																					.id
																				]
																				: ''
																		}
																		disabled={
																			props.consolidado
																		}
																		onChange={(
																			e
																		) => {
																			if (
																				!row.inactiva
																			) {
																				const observaciones =
																					data
																						.editedObject
																						.observaciones
																				observaciones[
																					row.id
																				] =
																					e.target.value
																				handleEdit(
																					observaciones,
																					'observaciones'
																				)
																			}
																		}}
																		placeholder={t(
																			'gestion_grupo>rubrica>placeholder_observaciones',
																			'Escriba aquí las observaciones'
																		)}
																		style={{
																			backgroundColor:
																				row.inactiva
																					? colors.opaqueGray
																					: 'unset',
																			pointerEvents:
																				row.inactiva
																					? 'none'
																					: 'auto'
																		}}
																	/>
																</td>
															</tr>
														)
													}
												)}
											</tbody>
										</table>
									</div>
								</div>
								</>

							</>
						)}
					</>
				)}
				<div
					style={{
						width: '100%',
						display: 'flex',
						justifyContent: 'center',
						marginTop: '1rem'
					}}
				>
					<Button
						color="primary"
						outline={!props.avoidModal}
						onClick={() => {
							// setPoints(0)
							props.handleCerrar({
								id: data.id,
								...data.editedObject,
								objectiveIdx: data.objectiveIdx,
								puntos: points
							})
						}}
					>
						{props.avoidModal
							? t('boton>general>guardar', 'Guardar')
							: t('general>cerrar', 'Cerrar')}
					</Button>
				</div>
			</>
		)
	}

	if (!props.avoidModal) {
		return (
			<>
				<Modal
					isOpen={props.open}
					size="xl"
					toggle={() => {
						setPoints(0)
						props.handleCerrar({
							id: data.id,
							...data.editedObject,
							objectiveIdx: data.objectiveIdx
						})
					}}
				>
					<ModalHeader
						toggle={() => {
							setPoints(0)
							props.handleCerrar({
								id: data.id,
								...data.editedObject,
								objectiveIdx: data.objectiveIdx
							})
						}}
					>
						{props.isEdit
							? t(
								'gestion_grupo>rubrica>componente_evaluacion',
								'Componentes de la evaluación'
							)
							: t('gestion_grupo>rubrica>calificar', 'Calificar')}
					</ModalHeader>
					<ModalBody style={{ overflowX: 'auto' }}>
						{GetData()}
					</ModalBody>
				</Modal>
				<CustomModal
					isOpen={openModal?.current === 'inactivar-indicador'}
					toggle={() => setOpenModal({ current: null, data: null })}
				>
					<ModalHeader>
						{t(
							'gestion_grupo>rubrica>justificacion_aprendizaje',
							'A continuación justifique la razón de la inhabilitación del indicador de aprendizaje'
						)}
						:
					</ModalHeader>
					<ModalBody>
						<textarea
							name="justificar"
							id="justificar"
							rows={3}
							value={openModal?.data?.content}
							style={{
								resize: 'none',
								width: '100%',
								border: `1px solid ${colors.opaqueGray}`
							}}
							placeholder="Razón para inactivar indicador"
							onChange={(e) => {
								console.log(e.target?.value)
								setOpenModal((prevState) => ({
									...prevState,
									data: {
										...prevState?.data,
										content: e.target?.value || null
									}
								}))
							}}
						/>
					</ModalBody>
					<ModalFooter className="flex justify-content-center">
						<Button
							color="primary"
							onClick={() => {
								console.log('openModal', openModal)
								handleEdit(
									{
										...data.editedObject.contenidos[
										openModal?.data?.contenidoIdx
										],
										filas: data.editedObject.contenidos[
											openModal?.data?.contenidoIdx
										]?.filas.map(
											(el: any, elIdx: number) => {
												if (
													elIdx ===
													openModal?.data?.rowIdx
												) {
													return {
														...el,
														inactiva:
															openModal?.data
																?.value,
														justificacionInactivar:
															openModal?.data
																?.content
													}
												}
												return { ...el }
											}
										)
									},
									null,
									openModal?.data?.contenidoIdx
								)
								setOpenModal({ current: null, data: null })
							}}
						>
							{t('edit_button>guardar', 'Guardar')}
						</Button>
					</ModalFooter>
				</CustomModal>
			</>
		)
	} else {
		return (
			<Card>
				<CardBody style={{ overflowX: 'auto' }}>
					<CardTitle>
						{props.isEdit
							? t(
								'gestion_grupo>rubrica>componente_evaluacion',
								'Componentes de la evaluación'
							)
							: t('gestion_grupo>rubrica>calificar', 'Calificar')}
					</CardTitle>
					{GetData()}
				</CardBody>
			</Card>
		)
	}
}

const ChromeContainer = styled.div`
	position: absolute;
	z-index: 2;
	transform: translate(100px, 13px);
`

const BtnColor = styled.button`
	width: 1.33rem;
	height: 1.33rem;
	border-radius: 50%;
	border: 1px solid #fff;
	background-color: transparent;
	box-shadow: 0px 0px 5px #444;
	margin-left: 5px;
`

const CustomModal = styled(Modal)`
	&.modal-dialog {
		box-shadow: unset !important;
	}
	& > div.modal-content {
		border-radius: 10px !important;
	}
`

export default RubricaModal
