import React, { FunctionComponent, useState, useEffect } from 'react'
import { PageData, FileInterface } from './Interfaces'
import { Col, Row, Form, Card, CardBody, CardTitle, Modal, ModalHeader, ModalBody } from 'reactstrap'
import { EditButton } from '../EditButton'
import { useForm } from 'react-hook-form'
import LinearProgress from '@material-ui/core/LinearProgress'
import BackendPaginatedTable from '../table/paginacion'
import { useWindowSize } from 'react-use'
import withRouter from 'react-router-dom/withRouter'
import TablePaginationConfig from './TablePaginationConfig.ts'
import styled from 'styled-components'
import IntlMessages from '../../helpers/IntlMessages'
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos'
import { DisplayField } from './utils/fieldsFunction.tsx'
import axios from 'axios'
import { envVariables } from '../../constants/enviroment'
import '../../../node_modules/react-grid-layout/css/styles.css'
import '../../../node_modules/react-resizable/css/styles.css'
import GridLayout from 'react-grid-layout'
import { TooltipSimple } from '../../utils/tooltip.tsx'
import { catalogsEnum } from '../../utils/catalogsEnum'
import { useActions } from 'Hooks/useActions'
import { getMultiCatalogs } from 'Redux/selects/actions'
import { cloneDeep } from 'lodash'
import HTMLTable from 'Components/HTMLTable'
import { guidGenerator } from '../../utils/GUIDGenerator'
import { useTranslation } from 'react-i18next'
import colors from '../../assets/js/colors'
import withNotification from '../../Hoc/NotificationV2'
import { TableReactImplementation } from 'Components/TableReactImplementation'
import Tooltip from '@mui/material/Tooltip'
import useNotification from 'Hooks/useNotification'

import { Edit, Delete } from '@material-ui/icons'

type Props = {
	pageData: PageData
	match: any
	dataForm: object
	data: array
	mapFunctionObj: object
	statusColor(item: object): string
	checked?: boolean
	isTemporal?: boolean
	handleChangeSelectAll?: () => void
}

const JSONFormParser: FunctionComponent<Props> = props => {
	const { t } = useTranslation()
	const { pageData } = props
	const [editable, setEditable] = useState(props.editable)
	const [currentItem, setCurrentItem] = useState({})
	const [loadingRequestLocalState, setLoadingRequestLocalState] = useState(false)
	const [requiredMultipleSelects, setRequiredMultipleSelects] = useState([])
	const [uploading, setUploading] = useState(0)
	const [openUploading, setOpenUploading] = useState(0)
	const [tablesData, setTablesData] = useState({})
	const [loading, setLoading] = useState(false)
	const [showForm, setShowForm] = useState(false)
	const [openLayout, setOpenLayout] = useState(null)
	const [data, setData] = useState([])
	const [validationArray, setValidationArray] = useState([])
	const [files, setFiles] = useState({})
	const [multiSelects, setMultiSelects] = useState({})
	const [calledBefore, setCalledBefore] = useState(false)
	const { width } = useWindowSize()
	const [snackbar, handleClick] = useNotification()
	const [snackbarContent, setSnackbarContent] = useState({
		msg: '',
		variant: ''
	})

	const actions = useActions({ getMultiCatalogs })

	const toggleAddNewModal = () => {
		if (pageData?.table?.onCreate) {
			setOpenLayout(pageData?.table?.onCreate)
		} else {
			setShowForm(true)
			setEditable(true)
		}
	}
	const toggleAddNewModalReactTable = () => {
		if (pageData?.reactTable?.onCreate) {
			setOpenLayout(pageData?.reactTable?.onCreate)
		} else {
			setShowForm(true)
			setEditable(true)
		}
	}

	const handleFilesChange = (file: FileInterface, field) => {
		const _files = { ...files }
		if (field.config.type !== 'audio') {
			_files[field.id] = _files[field.id]
				? [
						..._files[field.id],
						{
							...file,
							upload: true,
							show: true,
							id: file.title + (_files[field.id].length + 1)
						}
				  ]
				: [{ ...file, upload: true, show: true, id: file.title + 1 }]
		} else {
			if (_files[field.id]) {
				_files[field.id].forEach(f => {
					f.delete = true
					f.show = false
					f.upload = false
				})
				_files[field.id].push({
					...file,
					upload: true,
					show: true,
					id: file.title + '1'
				})
			} else {
				_files[field.id] = [{ ...file, upload: true, show: true, id: file.title + '1' }]
			}
		}
		setFiles(_files)
	}

	const handleTableDataChange = (newItemsArray, id) => {
		const copiedData = { ...tablesData }
		copiedData[id] = newItemsArray
		setTablesData(copiedData)
	}

	const handleFilesDelete = (id: string, field) => {
		const _files = { ...files }
		_files[field.id].forEach(file => {
			if (file.id === id) {
				if (!file.upload) {
					file.delete = true
				}
				file.show = false
				file.upload = false
			}
		})
		setFiles(_files)
	}

	const handleSelectViewItem = (item, edit = true) => {
		setCurrentItem(item)
		setShowForm(true)
		if (edit) {
			setEditable(true)
		}
	}

	let paginationControl: TablePaginationConfig
	const { handleSubmit, register, watch, setValue, errors, getValues, control, reset, clearErrors } = useForm({
		shouldUnregister: false
	})
	const callback = () => {
		if (props.setFormUtils) {
			props.setFormUtils({
				handleSubmit,
				register,
				watch,
				setValue,
				errors,
				getValues,
				control,
				reset
			})
		}
	}

	useEffect(() => {
		if (!props.pageData.sources) return
		if (!Array.isArray(props.pageData.sources)) return
		const newData = props.pageData.sources
			.map(source => {
				return source
					? catalogsEnum.find(item => {
							return item.name == source
					  })?.id
					: null
			})
			.filter(i => i != null)
		actions.getMultiCatalogs(newData)

		return () => {
			reset()
		}
	}, [props.pageData])

	useEffect(() => {
		if (!showForm) {
			setCurrentItem({})
			setFiles({})
			setMultiSelects({})
			reset()
		}
	}, [showForm])

	useEffect(() => {
		const newData = props.data.map(item => {
			const parsedItem = { ...item }
			Object.keys(props.mapFunctionObj).forEach(key => {
				if (props.mapFunctionObj && props.mapFunctionObj[key]) {
					parsedItem[key] = props.mapFunctionObj[key](parsedItem)
				}
			})
			parsedItem.statusColor = props.statusColor(item)
			return parsedItem
		})
		setData(newData)
	}, [props.data])

	useEffect(() => {
		if (pageData.table?.backendPaginated) {
			paginationControl = new TablePaginationConfig(1, 10, 20)
		}
		if (pageData.contents) {
			setRequiredMultipleSelects(getRequiredMultiples(pageData.contents))
		}
	}, [pageData])

	const getRequiredMultiples = contents => {
		let arrdata = []
		contents.forEach(el => {
			el.fields.forEach(field => {
				if (Array.isArray(field)) {
					field.forEach(rowItem => {
						if (Array.isArray(rowItem)) {
							rowItem.forEach(colItem => {
								if (
									(colItem.type == 'multiple' || colItem.type == 'uploadFile') &&
									colItem.config.required
								) {
									arrdata = [...arrdata, colItem.id]
								}
							})
						} else {
							if (
								(rowItem.type == 'multiple' || rowItem.type == 'uploadFile') &&
								rowItem.config.required
							) {
								arrdata = [...arrdata, rowItem.id]
							}
						}
					})
				} else {
					//
					if ((field?.type == 'multiple' || field?.type == 'uploadFile') && field.config.required) {
						arrdata = [...arrdata, field.id]
					}
				}
			})
		})
		return arrdata
	}

	useEffect(() => {
		if (currentItem.id) {
			const _files = {}
			const _multiSelects = {}
			Object.keys(currentItem.solucion).map(key => {
				if (['file', 'images'].includes(currentItem.solucion[key]?.type)) {
					_files[key] = currentItem.solucion[key]?.files
				} else if (currentItem.solucion[key]?.type == 'multiSelect') {
					_multiSelects[key] = currentItem.solucion[key]
				} else {
					setValue(key, currentItem.solucion[key])
				}
			})
			setFiles(_files)
			setMultiSelects(_multiSelects)
			setTablesData(currentItem.solucion.tablesData || {})
		}
	}, [currentItem])

	const formDataChange = Object.keys(props.dataForm || {})[0]
	useEffect(() => {
		if (props.dataForm) {
			if (formDataChange) {
				const _files = {}
				const _multiSelects = {}
				Object.keys(props.dataForm).forEach(key => {
					if (['file', 'images'].includes(props.dataForm[key]?.type) || props.dataForm[key]?.files) {
						_files[key] = props.dataForm[key].files
					} else if (props.dataForm[key]?.type == 'multiSelect') {
						_multiSelects[key] = props.dataForm[key]
					} else {
						setValue(key, props.dataForm[key])
					}
				})
				setFiles(_files)
				setMultiSelects(_multiSelects)
				setTablesData(props.dataForm.tablesData || {})
				setCalledBefore(true)
			}
		} else {
			reset()
		}
		callback()
	}, [props.dataForm])

	useEffect(() => {
		if (!editable || (props.editable !== undefined && !props.editable)) {
			const item = currentItem.id ? { ...currentItem.solucion } : props.dataForm
			if (item) {
				setTimeout(() => {
					const _files = {}
					const _multiSelects = {}
					Object.keys(item).forEach(key => {
						if (item[key]?.files) {
							_files[key] = cloneDeep(
								item[key].files.map(file => ({
									...file,
									show: true,
									upload: false
								}))
							)
						} else if (item[key]?.type == 'multiSelect') {
							_multiSelects[key] = item[key]
						} else {
							setValue(key, item[key])
						}
					})
					setFiles(_files)
					setMultiSelects(_multiSelects)
					setTablesData(item.tablesData || {})
				}, 50)
			} else {
				reset()
				setFiles({})
				setMultiSelects({})
				setTablesData({})
			}
		}
		clearErrors()
	}, [editable, props.editable])

	const handleMultiSelectsOptions = (inputId, item) => {
		const _multiSelects = multiSelects
		_multiSelects[inputId] = {
			type: 'multiSelect',
			options: item.options
		}
		setMultiSelects(_multiSelects)
	}
	const tableActions = {
		delete: items => {
			if (items?.id) {
				props.deleteData([items.id])
			} else {
				props.deleteData(items)
			}
		},
		edit: handleSelectViewItem
	}

	const buildActionsButtons = ({ cell, row, data }) => {
		const fullRow = data[row.index]
		return (
			<div className='d-flex justify-content-center align-items-center'>
				<Tooltip title='Editar'>
					<Edit
						className='mr-2'
						style={{
							cursor: 'pointer',
							color: colors.darkGray
						}}
						onClick={() => tableActions.edit(fullRow, false)}
					/>
				</Tooltip>

				<Tooltip title='Eliminar'>
					<Delete
						style={{
							cursor: 'pointer',
							color: colors.darkGray
						}}
						onClick={() => {
							tableActions.delete([fullRow.id])
						}}
					/>
				</Tooltip>
			</div>
		)
	}
	pageData.reactTable?.columns?.push({
		Header: 'Acciones',
		langKey: 'formulario_finamico>columna>acciones',
		column: '',
		accessor: 'actions',
		label: '',
		Cell: buildActionsButtons
	})
	const sendStepperData = async (data, editItem = false) => {
		const response = await props.postData(data)
		if (!response.error && editItem) {
			await setOpenLayout(null)
			await setShowForm(true)
			setCurrentItem({
				...response.data,
				solucion: JSON.parse(response.data.solucion)
			})
		}
	}
	const watchData = props.stateUpdater ? watch(props.stateUpdater) : null
	useEffect(() => {
		if (props.stateUpdater) {
			props.setStateUpdater(watchData || multiSelects[props.stateUpdater])
		}
	}, [watchData, multiSelects, multiSelects[props.stateUpdater]])

	const getLayoutContent = (parentLayout): any => {
		const contentByParent = pageData.contents?.find(item => item.layoutId === parentLayout.i)
		return contentByParent?.fields.map((field, i) => {
			if (Array.isArray(field)) {
				return (
					<Row>
						{field.map((rowItem, rI) => {
							if (Array.isArray(rowItem)) {
								return (
									<Col
										xs={(rowItem[0].config.size || width < 1000) && 12}
										md={rowItem[0].config.size || null}
									>
										{rowItem.map((colItem, colI) => {
											return (
												<DisplayField
													requiredMultipleSelects={requiredMultipleSelects}
													validationArray={validationArray}
													setValidationArray={setValidationArray}
													setRequiredMultipleSelects={setRequiredMultipleSelects}
													sendStepperData={sendStepperData}
													control={control}
													setOpenLayout={setOpenLayout}
													editable={props.editable !== undefined ? props.editable : editable}
													handleSubmit={handleSubmit}
													field={colItem}
													register={register}
													setValue={setValue}
													watch={watch}
													currentItem={currentItem}
													errors={errors}
													getValues={getValues}
													handleFilesChange={handleFilesChange}
													files={files}
													handleFilesDelete={handleFilesDelete}
													multiSelects={multiSelects}
													setMultiSelects={setMultiSelects}
													handleMultiSelectsOptions={handleMultiSelectsOptions}
													tablesData={tablesData}
													handleTableDataChange={handleTableDataChange}
													dataForm={props.dataForm}
													readOnlyFields={props.readOnlyFields || []}
													isTemporal={props.isTemporal}
												/>
											)
										})}
									</Col>
								)
							}
							return (
								<Col xs={(rowItem.config.size || width < 1000) && 12} md={rowItem.config.size || null}>
									<DisplayField
										requiredMultipleSelects={requiredMultipleSelects}
										validationArray={validationArray}
										setValidationArray={setValidationArray}
										setRequiredMultipleSelects={setRequiredMultipleSelects}
										control={control}
										sendStepperData={sendStepperData}
										setOpenLayout={setOpenLayout}
										editable={props.editable !== undefined ? props.editable : editable}
										handleSubmit={handleSubmit}
										field={{
											...rowItem,
											style: props.labelStyle
										}}
										register={register}
										setValue={setValue}
										watch={watch}
										currentItem={currentItem}
										errors={errors}
										getValues={getValues}
										handleFilesChange={handleFilesChange}
										files={files}
										handleFilesDelete={handleFilesDelete}
										multiSelects={multiSelects}
										setMultiSelects={setMultiSelects}
										handleMultiSelectsOptions={handleMultiSelectsOptions}
										tablesData={tablesData}
										handleTableDataChange={handleTableDataChange}
										dataForm={props.dataForm}
										readOnlyFields={props.readOnlyFields || []}
										isTemporal={props.isTemporal}
									/>
								</Col>
							)
						})}
					</Row>
				)
			}
			return (
				<DisplayField
					requiredMultipleSelects={requiredMultipleSelects}
					validationArray={validationArray}
					setValidationArray={setValidationArray}
					setRequiredMultipleSelects={setRequiredMultipleSelects}
					control={control}
					sendStepperData={sendStepperData}
					editable={props.editable !== undefined ? props.editable : editable}
					setOpenLayout={setOpenLayout}
					handleSubmit={handleSubmit}
					field={field}
					register={register}
					setValue={setValue}
					watch={watch}
					currentItem={currentItem}
					errors={errors}
					getValues={getValues}
					handleFilesChange={handleFilesChange}
					files={files}
					handleFilesDelete={handleFilesDelete}
					multiSelects={multiSelects}
					setMultiSelects={setMultiSelects}
					handleMultiSelectsOptions={handleMultiSelectsOptions}
					tablesData={tablesData}
					handleTableDataChange={handleTableDataChange}
					dataForm={props.dataForm}
					readOnlyFields={props.readOnlyFields || []}
					isTemporal={props.isTemporal}
				/>
			)
		})
	}

	// Recursive function that iterates on the layouts array
	const getContainers = layout => {
		return layout.content.map((nestedLayout, i) => {
			return (
				<DisplayField
					requiredMultipleSelects={requiredMultipleSelects}
					validationArray={validationArray}
					setValidationArray={setValidationArray}
					setRequiredMultipleSelects={setRequiredMultipleSelects}
					control={control}
					key={i}
					sendStepperData={sendStepperData}
					editable={props.editable !== undefined ? props.editable : editable}
					setOpenLayout={setOpenLayout}
					handleSubmit={handleSubmit}
					field={nestedLayout}
					register={register}
					setValue={setValue}
					watch={watch}
					currentItem={currentItem}
					errors={errors}
					getValues={getValues}
					handleFilesChange={handleFilesChange}
					files={files}
					handleFilesDelete={handleFilesDelete}
					multiSelects={multiSelects}
					setMultiSelects={setMultiSelects}
					handleMultiSelectsOptions={handleMultiSelectsOptions}
					tablesData={tablesData}
					handleTableDataChange={handleTableDataChange}
					dataForm={props.dataForm}
					readOnlyFields={props.readOnlyFields || []}
					isTemporal={props.isTemporal}
				>
					{getLayoutContent(nestedLayout)}
				</DisplayField>
			)
		})
	}

	const renderContent = () => {
		if (showForm || (!pageData.table && !pageData.reactTable)) {
			return (
				<div>
					{!props.preview && pageData.table && (
						<NavigationContainer
							onClick={e => {
								setShowForm(false)
							}}
						>
							<ArrowBackIosIcon />
							<h4>
								<IntlMessages id='pages.go-back-home' />
							</h4>
						</NavigationContainer>
					)}
					<Form onSubmit={handleSubmit(sendData)}>
						{width > 1000 ? (
							<GridLayout
								layout={pageData.layouts}
								className={`layout ${props.w100 && 'override-w-100'}`}
								cols={4}
								rowHeight={35}
								width={1200}
								isDraggable={false}
								isResizable={false}
								isBounded={false}
							>
								{pageData.layouts.map((item, index) => {
									return (
										<div
											className={`${item?.config.relleno && 'bg-white__radius'}`}
											key={item.i}
											style={{
												overflow: 'inherit',
												zIndex: pageData.layouts?.length - index
											}}
										>
											<h4>
												{item.config.tooltip.length > 0 ? (
													<TooltipSimple title={item.config.tooltip} />
												) : null}
											</h4>
											<p>{item.config.subtitle}</p>
											<Row>
												{item.content ? getContainers(item) : null}
												<Col>{getLayoutContent(item)}</Col>
											</Row>
										</div>
									)
								})}
							</GridLayout>
						) : (
							<>
								{pageData.layouts.map(item => {
									return (
										<StyledCol xs='12' key={item.i} width={width}>
											<StyledCard>
												<CardBody>
													<CardTitle>
														{item.config.tooltip.length > 0 ? (
															<TooltipSimple title={item.config.tooltip} />
														) : null}
													</CardTitle>
													<p>{item.config.subtitle}</p>
													<Row>
														{item.content ? getContainers(item) : null}
														<Col>{getLayoutContent(item)}</Col>
													</Row>
												</CardBody>
											</StyledCard>
										</StyledCol>
									)
								})}
							</>
						)}
						{!props.readOnly && !props.disableButton && (
							<div
								style={{
									textAlign: 'center',
									...props.editButtonStyles
								}}
							>
								{props.regresar}
								<EditButton
									editable={editable}
									setEditable={newState => {
										props.setEditable && props.setEditable(newState)
										setEditable(newState)
									}}
									loading={loading || props.loadingRequest || loadingRequestLocalState}
								/>
							</div>
						)}
					</Form>
				</div>
			)
		}
		if (pageData?.table?.backendPaginated) {
			return (
				<BackendPaginatedTable
					columns={width > 800 ? pageData.table.columns : pageData.table.mobileColumns}
					data={data || []}
					actions={pageData.table.actions.map(action => {
						return {
							...action,
							actionFunction: tableActions[action.actionFunction]
						}
					})}
					isBreadcrumb={false}
					actionRow={pageData.table.actionRow.map(action => {
						return {
							...action,
							actionFunction: tableActions[action.actionFunction]
						}
					})}
					match={props.match}
					tableName='label.users'
					toggleEditModal={toggleAddNewModal}
					toggleModal={toggleAddNewModal}
					modalOpen={showForm}
					selectedOrderOption={{
						column: 'detalle',
						label: 'Nombre Completo'
					}}
					showHeaders={false}
					editModalOpen={false}
					modalfooter
					loading={loading}
					orderBy={false}
					totalRegistro={paginationControl.total}
					title=''
					handlePagination={paginationControl.handlePagination}
					handleSearch={paginationControl.handleSearch}
				/>
			)
		} else if (pageData?.table) {
			return (
				<HTMLTable
					useAllSearchParams={pageData.table.useAllSearchParams}
					columns={
						width > 800
							? pageData.table.columns
								? pageData.table.columns
								: []
							: pageData.table.mobileColumns
					}
					data={data || []}
					selectDisplayMode='datalist'
					actions={
						pageData.table.actions.map(action => {
							return {
								...action,
								actionFunction: tableActions[action.actionFunction]
							}
						}) || []
					}
					isBreadcrumb={false}
					toggleEditModal={item => tableActions.edit(item, false)}
					actionRow={
						pageData.table.actionRow.map(action => {
							return {
								...action,
								actionFunction: tableActions[action.actionFunction],
								actionDisplay: () => true
							}
						}) || []
					}
					match={props.match}
					showHeadersCenter={false}
					tableName={pageData.table.tableName}
					toggleModal={toggleAddNewModal}
					modalOpen={showForm}
					editModalOpen={false}
					selectedOrderOption={{
						column: 'nombre',
						label: 'Nombre Completo'
					}}
					showHeaders
					modalfooter
					loading={false}
					orderBy={false}
					labelSearch={pageData.table.tableSearch}
					totalRegistro={0}
					listView={false}
					dataListView={false}
					imageListView
					customThumbList={false}
					listPageHeading={false}
					handleCardClick={item => handleSelectViewItem(item, false)}
					disableSearch={!pageData.table.tableSearch}
					roundedStyle={pageData.table.roundedStyle}
				/>
			)
		} else if (pageData?.reactTable) {
			const filterColumns = {}
			pageData.reactTable?.columns.forEach(el => {
				if (el?.accessor && !filterColumns[el?.accessor]) {
					filterColumns[el?.accessor] = el
				}
			})

			const translatedColumns = Object.values(filterColumns)?.map(i => {
				return { ...i, Header: i.langKey ? t(i.langKey, i.Header) : i.Header }
			})
			return (
				<TableReactImplementation
					columns={translatedColumns || []}
					data={data || []}
					showAddButton={pageData.reactTable?.showAddButton}
					onSubmitAddButton={toggleAddNewModalReactTable}
					avoidSearch={pageData.reactTable?.avoidSearch}
					hideMultipleOptions
					handleChangeSelectAll={props.handleChangeSelectAll}
					actions={pageData.reactTable?.actions || []}
					checked={props.checked}
				/>
			)
		} else {
			return null
		}
	}
	const sendData = async (solution): void => {
		// debugger
		setLoadingRequestLocalState(true)
		const newSolution = { ...solution }
		const flattenedFiles = []
		const flattenedFilesToDelete = []
		const data = new FormData()
		const _validationArray = []
		for (const elementId of requiredMultipleSelects) {
			if (!multiSelects[elementId] && !files[elementId]) {
				_validationArray.push(elementId)
			}
		}
		setValidationArray(_validationArray)
		if (_validationArray.length > 0) {
			setLoadingRequestLocalState(false)
			setSnackbarContent({
				variant: 'error',
				msg: 'Debe completar los campos requeridos'
			})
			handleClick()
			return
		}

		for (const inputId of Object.keys(files)) {
			files[inputId].forEach(element => {
				if (element.upload) {
					flattenedFiles.push({ ...element, inputId })
					data.append('files', element.fileItem)
				} else if (element.delete) {
					flattenedFilesToDelete.push(element)
				}
			})
		}
		for (const selectId of Object.keys(multiSelects)) {
			newSolution[selectId] = multiSelects[selectId]
		}
		if (flattenedFiles.length > 0) {
			setUploading(0)
			setOpenUploading(true)
		}
		const config = {
			onUploadProgress: value => {
				setUploading(value)
			}
		}
		const filesResponse = await axios.post(
			`${envVariables.BACKEND_URL}/api/ExpedienteCentroEducativo/Formulario/resources`,
			data,
			config
		)

		setOpenUploading(false)

		if (flattenedFilesToDelete.length > 0) {
		}
		await axios.delete(`${envVariables.BACKEND_URL}/api/ExpedienteCentroEducativo/Formulario/resources`, {
			data: {
				names: flattenedFilesToDelete.map(item => item.url)
			}
		})
		flattenedFiles.forEach((item, i) => {
			if (!newSolution[item.inputId]) {
				newSolution[item.inputId] = {
					files: [],
					type: 'file'
				}
			}
			newSolution[item.inputId].files.push({
				...item,
				url: filesResponse.data[i],
				upload: false
			})
		})
		Object.keys(files).forEach(id => {
			const oldFiles = files[id].filter(file => file.show && !file.upload)
			if (newSolution[id]) {
				newSolution[id].files = [...newSolution[id].files, ...oldFiles]
			} else {
				newSolution[id] = {
					files: oldFiles,
					type: 'file'
				}
			}
		})
		newSolution.tablesData = tablesData

		const parsedData = JSON.stringify(newSolution)
		const _data = {
			solucion: parsedData,
			id: props.dataForm ? props.dataForm.id : currentItem?.id,
			provissionalId: props.dataForm ? props.dataForm.provissionalId : null
		}
		let response
		if (currentItem.id || props.dataForm?.id) {
			response = await props.putData(_data)
		} else {
			if (!_data.provissionalId) {
				_data.provissionalId = guidGenerator()
			}
			response = await props.postData(_data)
		}

		if (!response?.error) {
			setShowForm(false)
			setEditable(false)
		} else {
			props.showSnackbar(response.error, 'error')
		}
		setLoadingRequestLocalState(false)
	}

	return (
		<>
			{snackbar(snackbarContent?.variant, snackbarContent?.msg)}
			{pageData.table?.onCreate === openLayout &&
				mapLayout(
					pageData.layouts.find(layout => layout.id === pageData.table.onCreate),
					false
				)}
			{renderContent()}
			<Modal isOpen={openUploading}>
				<ModalHeader>Subiendo archivos</ModalHeader>
				<ModalBody>
					<LinearProgress variant='determinate' value={uploading} />
				</ModalBody>
			</Modal>
		</>
	)
}

const StyledCol = styled(Col)`
	padding: ${props => (props.width < 1000 ? 0 : 'initial')};
`
const StyledCard = styled(Card)`
	margin-bottom: 1rem;
`

const NavigationContainer = styled.span`
	display: flex;
	cursor: pointer;
`

export default withNotification(withRouter(JSONFormParser))
