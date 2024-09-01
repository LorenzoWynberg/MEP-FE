import React, { useState, useEffect, useMemo } from 'react'
import { column } from './types'
import { TableDataFrontPaginated, TableDataBackendPaginated } from './TableData'

interface paginatedTableObject {
	totalCount: number
	page: number
}

interface IProps {
	columns: column[]
	data: any[]
	handleGetData?: (
		searchValue: string,
		filterColumn: string | undefined | null,
		pageSize: number,
		page: number,
		column: string,
		order: string
	) => {} | any | undefined
	useFilters?: boolean
	useExpanded?: boolean
	backendPaginated?: boolean
	pageSize?: number
	orderOptions?: column[]
	paginationObject?: paginatedTableObject
	RightAction?: JSX.Element
	avoidSearch?: boolean
	preferences?: boolean
	backendSearch?: boolean
	triggerParams?: Array<any>
	mensajeSinRegistros?: string
	showAddButton?: boolean
	onSubmitAddButton?: () => void
	autoResetPage?: boolean
	customFunctions?: any
	hideMultipleOptions?: boolean
	handleChangeSelectAll?: () => void
	actions?: []
	checked?: boolean
	msjButton?: string
	textButton?: string
}

type orderType = 'ASC' | 'DESC'

export const ApoyosTableReactImplementation: React.FC<IProps> = React.memo(props => {
	const [cols, setCols] = useState<column[]>(props.columns || [])
	const [currentPage, setCurrentPage] = useState<number>(1)
	const [pageSize, setPageSize] = useState<number>(props.pageSize || 6)
	const [selectedPageSize, setSelectedPageSize] = useState<number>(0)
	const [items, setItems] = useState<any[]>([])
	const [selectedColumn, setSelectedColumn] = useState<column>(
		props.columns ? props.columns[0] : { Header: '', accessor: 'no', column: 'no', label: '' }
	)
	const [searchValue, setSearchValue] = useState<string>()
	const [totalPage, setTotalPage] = useState<number>(0)
	const [selectedOrder, setSelectedOrder] = useState<orderType>('ASC')
	const [selectAll, setSelectAll] = useState(false)
	const [selectedItemsId, setSelectedItemsId] = useState([])
	const [columnsToShow, setColumnsToShow] = useState<string[]>(
		props.columns ? props.columns.map(item => item.column) : []
	)

	const { triggerParams = [] } = props

	useMemo(() => {
		setCols(props.columns || [])
		setColumnsToShow(props.columns ? props.columns.map(item => item.column) : [])
	}, [props.columns])

	useMemo(() => {
		setItems(props.data)
	}, [props.data])

	useEffect(() => {
		if (props.backendPaginated) {
			props.handleGetData(
				selectedColumn?.filterAction ? selectedColumn.filterAction(searchValue) : searchValue,
				selectedColumn.filterColumn ? selectedColumn.filterColumn : selectedColumn.column,
				props.pageSize ? props.pageSize : selectedPageSize,
				currentPage,
				selectedColumn.column,
				selectedOrder
			)
		}
	}, [currentPage, pageSize, ...triggerParams])

	const addSelectedIds = id => {
		if (selectedItemsId.indexOf(id) >= 0) {
			return
		}
		return id
	}

	const changeOrderByAsc = async (column, isFilterColumn = false) => {
		if (props.backendPaginated) {
			if (props.handleGetData) {
				await props.handleGetData(
					column.filterAction ? column.filterAction(searchValue) : searchValue,
					isFilterColumn
						? column.filterColumn
							? column.filterColumn
							: column.column
						: selectedColumn.filterColumn
						? selectedColumn.filterColumn
						: selectedColumn.column,
					props.pageSize ? props.pageSize : selectedPageSize,
					1,
					column.column,
					'ASC'
				)
			}
			setSelectedOrder('ASC')
			setCurrentPage(1)
		} else {
			const formatDate = date => date.split('.').reverse().join('-')
			const getDate = date => new Date(formatDate(date))
			const getTime = date => getDate(date).getTime()

			setItems([
				...items.sort((a, b) => {
					let comparison
					if (column.isNumericField) {
						comparison = {
							string: parseInt(b[column.column]) - parseInt(a[column.column])
						}
					} else {
						const aa = a[column.column] == null ? '' : a[column.column]
						const bb = b[column.column] == null ? '' : b[column.column]
						comparison = {
							string: aa.localeCompare(bb),
							date: getTime(aa) - getTime(bb)
						}
					}
					return column.column === 'date' ? comparison.date : comparison.string
				})
			])
		}

		if (Array.isArray(props.orderOptions) && isFilterColumn) {
			const _selectedColumn = props.orderOptions.find(item => item.column === column.column)
			setSelectedColumn(_selectedColumn)
		}

		const newCols = cols.map(col => {
			if (col.column === column.column) {
				return { ...col, direction: 'asc' }
			} else {
				return { ...col, direction: undefined }
			}
		})
		setCols(newCols)
	}

	const changeOrderByDesc = async column => {
		if (props.backendPaginated) {
			if (props.handleGetData) {
				await props.handleGetData(
					column.filterAction ? column.filterAction(searchValue) : searchValue,
					selectedColumn.filterColumn ? selectedColumn.filterColumn : selectedColumn.column,
					props.pageSize ? props.pageSize : selectedPageSize,
					1,
					column.column,
					'DESC'
				)
			}
			setSelectedOrder('DESC')
			setCurrentPage(1)
		} else {
			const formatDate = date => date.split('.').reverse().join('-')
			const getDate = date => new Date(formatDate(date))
			const getTime = date => getDate(date).getTime()
			setItems([
				...items.sort((a, b) => {
					let comparison
					if (column.isNumericField) {
						comparison = {
							string: parseInt(a[column.column]) - parseInt(b[column.column])
						}
					} else {
						const aa = a[column.column] == null ? '' : a[column.column]
						const bb = b[column.column] == null ? '' : b[column.column]
						comparison = {
							string: bb.localeCompare(aa),
							date: getTime(bb) - getTime(aa)
						}
					}
					return column.column === 'date' ? comparison.date : comparison.string
				})
			])
		}

		const newCols = cols.map(col => {
			if (col.column === column.column) {
				return { ...col, direction: 'desc' }
			} else {
				return { ...col, direction: undefined }
			}
		})
		setCols(newCols)
	}

	const changeColumn = column => {
		if (columnsToShow.includes(column)) {
			return setColumnsToShow(columnsToShow.filter(item => item !== column))
		}
		return setColumnsToShow([...columnsToShow, column])
	}

	return (
		<>
			{!props?.backendPaginated ? (
				<TableDataFrontPaginated
					handleGetData={props.handleGetData}
					pageSize={props.pageSize}
					selectedColumn={selectedColumn}
					setSelectedColumn={setSelectedColumn}
					backendSearch={props.backendSearch}
					columns={cols}
					items={items}
					useFilters={props.useFilters}
					avoidSearch={props.avoidSearch}
					useExpanded={props.useExpanded}
					preferences={props.preferences}
					mensajeSinRegistros={props.mensajeSinRegistros}
					showAddButton={props.showAddButton}
					onSubmitAddButton={props.onSubmitAddButton}
					hideMultipleOptions={props.hideMultipleOptions}
					handleChangeSelectAll={props.handleChangeSelectAll}
					actions={props.actions}
					checked={props.checked}
					autoResetPage={props.autoResetPage}
					customFunctions={props.customFunctions}
					msjButton={props.msjButton}
					textButton={props.textButton}
				/>
			) : (
				<TableDataBackendPaginated
					autoResetPage={props.autoResetPage}
					columns={cols}
					items={items}
					useFilters={props.useFilters}
					pageSize={props.pageSize}
					pageCount={props.paginationObject.totalCount}
					pageIndex={currentPage}
					avoidSearch={props.avoidSearch}
					preferences={props.preferences}
					mensajeSinRegistros={props.mensajeSinRegistros}
					selectedColumn={selectedColumn}
					setSelectedColumn={setSelectedColumn}
					showAddButton={props.showAddButton}
					hideMultipleOptions={props.hideMultipleOptions}
					handleChangeSelectAll={props.handleChangeSelectAll}
					actions={props.actions}
					checked={props.checked}
					onSubmitAddButton={props.onSubmitAddButton}
					onSearch={(value: string) => {
						setSearchValue(value)
						props.handleGetData(
							value,
							selectedColumn.filterColumn ? selectedColumn.filterColumn : selectedColumn.column,
							props.pageSize ? props.pageSize : selectedPageSize,
							currentPage,
							selectedColumn.column,
							selectedOrder
						)
					}}
					handlePage={page => {
						setCurrentPage(page)
					}}
					customFunctions={props.customFunctions}
					msjButton={props.msjButton}
					textButton={props.textButton}
				/>
			)}
		</>
	)
})

TableReactImplementation.defaultProps = {
	autoResetPage: true
}
