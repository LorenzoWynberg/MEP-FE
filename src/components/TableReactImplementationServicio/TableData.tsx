import React from 'react'
import { useTable, usePagination, useGlobalFilter, useAsyncDebounce, useExpanded, useSortBy } from 'react-table'
import { column } from './types'
import Pagination from './Pagination'
import {
	InputGroupAddon,
	Col,
	Dropdown,
	Row,
	DropdownToggle,
	DropdownMenu,
	DropdownItem,
	ButtonDropdown,
	CustomInput
} from 'reactstrap'
import { Button } from 'Components/CommonComponents'
import styled from 'styled-components'
import IntlMessages from 'Helpers/IntlMessages'
import { useTranslation } from 'react-i18next'
import { Search } from './Header'
interface IProps {
	autoResetPage?: boolean
	pageSize?: number
	columns: column[]
	items: any[]
	useFilters?: boolean
	avoidSearch: boolean
	backendSearch?: boolean
	useExpanded?: boolean
	RightAction?: JSX.Element
	handleGetData?: Function
	selectedColumn: any
	setSelectedColumn: (value: string) => void
	preferences?: boolean
	customFunctions?: any
	hideMultipleOptions: boolean
	handleChangeSelectAll?: (value: boolean) => void
	actions?: []
	checked?: boolean
}

interface IBackendPaginatedProps extends IProps {
	pageIndex: number
	pageCount: number
	handlePage: (pageIndex: number) => void
	onSearch: (value: string) => void
	preferences?: boolean
	selectedColumn: any
	setSelectedColumn: (value: string) => void
	customFunctions?: any
}

function GlobalFilter({
	preGlobalFilteredRows,
	setGlobalFilter,
	columnsToShow,
	setColumnsToShow,
	preferences,
	setSelectedColumn,
	selectedColumn,
	cols = [],
	hasData = false,
	showAddButton = false,
	onSubmitAddButton = () => {},
	avoidSearch = false,
	RightAction = <></>,
	selectAll,
	actions = [],
	selectedItemsId,
	handleChangeSelectAll = (value: boolean) => {},
	hideMultipleOptions = false,
	checked = false,
	msjButton = '',
	textButton = ''
}) {
	const { t } = useTranslation()

	const [dropdownOpen, setDropdownOpen] = React.useState<'preferences' | 'filter' | null>(null)
	const toggleDropDown = (value: 'preferences' | 'filter') => {
		if (dropdownOpen === value) {
			setDropdownOpen(null)
		} else {
			setDropdownOpen(value)
		}
	}

	const count = preGlobalFilteredRows?.length
	const [value, setValue] = React.useState('')
	const [isAllChecked, setIsAllChecked] = React.useState(false)
	const onChange = useAsyncDebounce(value => {
		setGlobalFilter(value || undefined)
	}, 200)

	const [dropdownSplitOpen, setDropdownSplitOpen] = React.useState(false)
	const toggleSplit = () => {
		setDropdownSplitOpen(!dropdownSplitOpen)
	}
	return (
		<Row>
			<Col className='container-nav d-flex justify-content-between aling-items-center'>
				{!avoidSearch ? <Search onSearch={onChange} /> : <></>}
				<div style={{ display: 'flex', justifyContent: 'flex-end' }}>
					{showAddButton && (
						<Button
							style={{ cursor: 'pointer' }}
							color='primary'
							onClick={() => {
								onSubmitAddButton()
							}}
						>
							{msjButton ? msjButton : t('general>agregar', 'Agregar')}
						</Button>
					)}
					{hideMultipleOptions && (
						<ButtonDropdown isOpen={dropdownSplitOpen} toggle={toggleSplit}>
							<div className='btn btn-primary btn-lg pl-4 pr-0 check-button check-all'>
								<CustomInput
									className='custom-checkbox mb-0 d-inline-block'
									type='checkbox'
									id='checkAll'
									onClick={e => {
										handleChangeSelectAll(!e.target.checked)
									}}
									checked={checked}
								/>
							</div>
							<DropdownToggle caret color='primary' className='dropdown-toggle-split btn-lg' />
							<DropdownMenu right>
								{Array.isArray(actions) &&
									actions?.map((action, index) => {
										return (
											<DropdownItem key={index} onClick={() => action.actionFunction()}>
												<IntlMessages id={action.actionName} />
											</DropdownItem>
										)
									})}
							</DropdownMenu>
						</ButtonDropdown>
					)}
				</div>
			</Col>
			{preferences && (
				<>
					<Col>
						<Dropdown
							className='btn-search-table-heading'
							isOpen={dropdownOpen === 'filter'}
							toggle={() => {
								toggleDropDown('filter')
							}}
						>
							<DropdownToggle color='secondary dropdown-toggle-split'>
								Buscar por {selectedColumn.Header?.toLowerCase()} <span className='caret-down' />
							</DropdownToggle>
							<DropdownMenu>
								{cols?.map((filter, i) => {
									return (
										<>
											<DropdownItem
												onClick={() => {
													setSelectedColumn(filter)
												}}
											>
												Buscar por {filter.Header?.toLowerCase()}
											</DropdownItem>
											{i < cols?.length - 1 && <DropdownItem divider />}
										</>
									)
								})}
							</DropdownMenu>
						</Dropdown>
					</Col>
					<Col>
						{hasData && (
							<Dropdown
								isOpen={dropdownOpen === 'preferences'}
								toggle={() => {
									toggleDropDown('preferences')
								}}
								ismultiple
								color='primary'
							>
								<DropdownToggle caret style={{ width: 139 }}>
									Preferencias
								</DropdownToggle>
								<DropdownMenu>
									{cols.map(item => {
										return (
											<DropdownItem disabled>
												<input
													type='checkbox'
													id={item.column}
													checked={!!columnsToShow.includes(item.column)}
													onClick={() => {
														if (columnsToShow.includes(item.column)) {
															setColumnsToShow(
																columnsToShow.filter(el => el !== item.column)
															)
														} else {
															setColumnsToShow([...columnsToShow, item.column])
														}
													}}
												/>{' '}
												{item.Header}{' '}
											</DropdownItem>
										)
									})}
								</DropdownMenu>
							</Dropdown>
						)}
					</Col>
				</>
			)}
		</Row>
	)
}

function BackendFilter({
	onChange,
	preferences,
	columnsToShow,
	setColumnsToShow,
	setSelectedColumn,
	selectedColumn,
	hasData = false,
	cols = [],
	onSubmitAddButton = () => {}
}) {
	const { t } = useTranslation()
	const [value, setValue] = React.useState('')
	const [dropdownOpen, setDropdownOpen] = React.useState<'preferences' | 'filter' | null>(null)
	const toggleDropDown = (value: 'preferences' | 'filter') => {
		if (dropdownOpen === value) {
			setDropdownOpen(null)
		} else {
			setDropdownOpen(value)
		}
	}

	return (
		<Row>
			<Col className='container-nav'>
				<Search onSearch={onChange} />
			</Col>
			{preferences && (
				<>
					<Col>
						<Dropdown
							className='btn-search-table-heading'
							isOpen={dropdownOpen === 'filter'}
							toggle={() => {
								toggleDropDown('filter')
							}}
						>
							<DropdownToggle color='secondary dropdown-toggle-split'>
								Buscar por {selectedColumn.Header?.toLowerCase()} <span className='caret-down' />
							</DropdownToggle>
							<DropdownMenu>
								{cols.map((filter, i) => {
									return (
										<>
											<DropdownItem
												onClick={() => {
													setSelectedColumn(filter)
												}}
											>
												Buscar por {filter.Header?.toLowerCase()}
											</DropdownItem>
											{i < cols?.length - 1 && <DropdownItem divider />}
										</>
									)
								})}
							</DropdownMenu>
						</Dropdown>
					</Col>
					<Col>
						{hasData && (
							<Dropdown
								isOpen={dropdownOpen === 'preferences'}
								toggle={() => {
									toggleDropDown('preferences')
								}}
								ismultiple
								color='primary'
							>
								<DropdownToggle caret style={{ width: 139 }}>
									Preferencias
								</DropdownToggle>
								<DropdownMenu>
									{cols.map(item => {
										return (
											<DropdownItem disabled>
												<input
													type='checkbox'
													id={item.column}
													checked={!!columnsToShow.includes(item.column)}
													onClick={() => {
														if (columnsToShow.includes(item.column)) {
															setColumnsToShow(
																columnsToShow.filter(el => el !== item.column)
															)
														} else {
															setColumnsToShow([...columnsToShow, item.column])
														}
													}}
												/>{' '}
												{item.Header}{' '}
											</DropdownItem>
										)
									})}
								</DropdownMenu>
							</Dropdown>
						)}
					</Col>
				</>
			)}
		</Row>
	)
}

export const TableDataFrontPaginated: React.FC<IProps> = props => {
	const { t } = useTranslation()

	const [columnsToShow, setColumnsToShow] = React.useState(
		Array.isArray(props?.columns) && !props?.columns?.includes(undefined)
			? props?.columns?.map(el => el.column)
			: []
	)
	const tableState = useTable(
		{
			columns: Array.isArray(props?.columns) && !props?.columns?.includes(undefined) ? props.columns : [],
			data: props.items || [],
			autoResetPage: props.autoResetPage,
			initialState: {
				pageIndex: 0,
				hiddenColumns: props.columns.filter(col => col.show === false).map(col => col.column),
				pageSize: props.pageSize || 10
			},
			globalFilter: (rws, columns, value) => {
				const filtered = rws.filter(row => {
					const { values } = row
					let valuesStr = ''
					const normalized = value
						.normalize('NFD')
						.replace(/[\u0300-\u036f]/gi, '')
						.toLowerCase()
					for (const col of columns) {
						const normalizedRowValue = String(values[col])
							.normalize('NFD')
							.replace(/[\u0300-\u036f]/gi, '')
							.toLowerCase()
						valuesStr +=
							typeof values[col] === 'string' || typeof values[col] === 'number' ? normalizedRowValue : ''
					}
					return valuesStr.includes(normalized)
				})
				return filtered
			}
		},
		!props.avoidSearch ? useGlobalFilter : () => ({}),
		props?.useExpanded ? useExpanded : () => ({}),
		usePagination
	)

	const {
		getTableProps,
		getTableBodyProps,
		headerGroups,
		prepareRow,
		page, // Instead of using 'rows', we'll use page,
		// which has only the rows for the active page

		// The rest of these things are super handy, too ;)
		canPreviousPage,
		canNextPage,
		pageOptions,
		pageCount,
		gotoPage,
		nextPage,
		previousPage,
		setPageSize,
		state: { pageIndex, pageSize }
	} = tableState

	return (
		<>
			<GlobalFilter
				hasData={props.items?.length > 0}
				RightAction={props.RightAction}
				preGlobalFilteredRows={tableState.preGlobalFilteredRows}
				columnsToShow={columnsToShow}
				setColumnsToShow={setColumnsToShow}
				preferences={props.preferences}
				cols={props.columns}
				setSelectedColumn={props.setSelectedColumn}
				selectedColumn={props.selectedColumn}
				setGlobalFilter={value => {
					props.handleGetData(value)
				}}
				showAddButton={props.showAddButton}
				onSubmitAddButton={props.onSubmitAddButton}
				avoidSearch={props.avoidSearch}
				hideMultipleOptions={props.hideMultipleOptions}
				handleChangeSelectAll={props.handleChangeSelectAll}
				actions={props.actions}
				checked={props.checked}
				msjButton={props.msjButton}
				textButton={props.textButton}
			/>
			<Table className='mallasTable' {...getTableProps()} style={{ marginBottom: 15 }}>
				<thead>
					{headerGroups.map((headerGroup, index) => (
						<tr key={index} {...headerGroup.getHeaderGroupProps()}>
							{headerGroup.headers.map((column, index) => {
								if (!columnsToShow.includes(column.column)) {
									return
								}
								return (
									<th key={index} {...column.getHeaderProps()} style={column.style}>
										{column.render('Header')}
									</th>
								)
							})}
						</tr>
					))}
				</thead>
				<tbody style={{ background: '#fff' }} {...getTableBodyProps()}>
					{page.map((row, index) => {
						prepareRow(row)
						return (
							<tr key={index} {...row.getRowProps()} style={row?.original?.style}>
								{row.cells.map((cell, index) => {
									if (!columnsToShow.includes(cell.column.column)) {
										return
									}
									return (
										<td key={index} {...cell.getCellProps()}>
											{cell.render('Cell')}
										</td>
									)
								})}
							</tr>
						)
					})}
				</tbody>
			</Table>
			{page.length === 0 && (
				<div className='d-flex justify-content-center align-items-center w-100' style={{ fontSize: '1.5rem' }}>
					{props.mensajeSinRegistros ? (
						<p style={{ fontSize: 14 }}>{props.mensajeSinRegistros}</p>
					) : (
						<p style={{ fontSize: 14 }}>{t('general>no_registros', 'No hay registros')}</p>
					)}
				</div>
			)}
			{pageCount > 1 && (
				<Pagination
					currentPage={pageIndex + 1}
					totalPage={pageCount}
					onChangePage={i => {
						gotoPage(i - 1)
					}}
				/>
			)}
		</>
	)
}

export const TableDataBackendPaginated: React.FC<IBackendPaginatedProps> = props => {
	const [columnsToShow, setColumnsToShow] = React.useState(props.columns.map(el => el.column))
	const filterTypes = React.useMemo(
		() => ({
			dateBetween: dateBetweenFilterFn,
			timeBetween: timeBetweenFilterFn,
			text: (rows, id, filterValue) => {
				return rows.filter(row => {
					const rowValue = row.values[id]
					return rowValue !== undefined
						? String(rowValue).toLowerCase().startsWith(String(filterValue).toLowerCase())
						: true
				})
			}
		}),
		[]
	)

	const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable(
		{
			columns: props.columns,
			autoResetPage: props.autoResetPage,
			data: props.items,
			filterTypes,
			initialState: {
				hiddenColumns: props.columns.filter(col => col.show === false).map(col => col.column)
			},
			...props.customFunctions
		},
		useSortBy,
		usePagination
		/* props.useFilters ? useFilters : null, */
	)

	return (
		<>
			{!props.avoidSearch && (
				<BackendFilter
					hasData={props.items?.length > 0}
					setSelectedColumn={props.setSelectedColumn}
					selectedColumn={props.selectedColumn}
					columnsToShow={columnsToShow}
					setColumnsToShow={setColumnsToShow}
					preferences={props.preferences}
					onChange={props.onSearch}
					onSubmitAddButton={props.onSubmitAddButton}
					cols={props.columns}
				/>
			)}
			<Table {...getTableProps()}>
				<thead>
					{headerGroups.map((headerGroup, index) => (
						<tr key={index} {...headerGroup.getHeaderGroupProps()}>
							{headerGroup.headers.map((column, index) => {
								if (!columnsToShow.includes(column.column)) {
									return
								}
								return (
									<th key={index} {...column.getHeaderProps()}>
										{column.render('Header')}
									</th>
								)
							})}
						</tr>
					))}
				</thead>
				<tbody style={{ background: '#fff' }} {...getTableBodyProps()}>
					{rows?.map((row, i) => {
						prepareRow(row)
						return (
							<tr key={i} {...row.getRowProps()}>
								{row.cells.map((cell, i) => {
									if (!columnsToShow.includes(cell.column.column)) {
										return
									}
									return (
										<td key={i} {...cell.getCellProps()}>
											{cell.render('Cell')}
										</td>
									)
								})}
							</tr>
						)
					})}
				</tbody>
			</Table>
			{rows.length === 0 && (
				<div className='d-flex justify-content-center align-items-center w-100' style={{ fontSize: '1.5em' }}>
					{props.mensajeSinRegistros ? (
						<p style={{ fontSize: 14 }}>{props.mensajeSinRegistros}</p>
					) : (
						<p style={{ fontSize: 14 }}>No hay registros.</p>
					)}
				</div>
			)}
			<Pagination
				currentPage={props.pageIndex}
				totalPage={props.pageCount}
				onChangePage={i => {
					props.handlePage(i)
				}}
			/>
		</>
	)
}

function dateBetweenFilterFn(rows, id, filterValues) {
	const sd = new Date(filterValues[0])
	const ed = new Date(filterValues[1])
	return rows.filter(r => {
		const time = new Date(r.values[id])
		if (filterValues?.length === 0) return rows
		return time >= sd && time <= ed
	})
}

function timeBetweenFilterFn(rows, id, filterValues) {
	const sd = new Date(filterValues[0])
	const ed = new Date(filterValues[1])
	const date = new Date()
	return rows.filter(r => {
		const time = new Date(`${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()} ${r.values[id]}`)
		if (filterValues?.length === 0) return rows
		return time >= sd && time <= ed
	})
}

const Table = styled.table`
	border-collapse: collapse;
	margin-top: 1rem;
	width: 100%;
	margin-top: 10px;
	tbody {
		border: 1px solid #eaeaea;
	}
	thead {
		td,
		th {
			color: white;
			background-color: ${props => props.theme.primary};
			border-left: 1px solid #eaeaea;
			border-right: 1px solid #eaeaea;
			padding: 10px 15px;
		}
		tr > *:first-child {
			border-top-left-radius: 8px;
			border-left: none;
			border-top: none;
		}
		tr > *:last-child {
			border-top-right-radius: 8px;
			border-right: none;
			border-top: none;
		}
	}

	tbody {
		td {
			height: 3rem;
			border-left: 1px solid #eaeaea;
			border-right: 1px solid #eaeaea;
			border-bottom: 1px solid #eaeaea;
			padding: 10px 15px;
		}
	}
	.lastItem {
		background-color: #c2dff7;
		font-weight: bold;
	}

	.grayBackground {
		td,
		th {
			color: black;
			background-color: #f5f5f5;
			border-left: 1px solid #eaeaea;
			border-right: 1px solid #eaeaea;
			padding: 10px 15px;
			border-top-left-radius: 0 !important;
			border-top-right-radius: 0 !important;
		}
	}

	.textCenter {
		td,
		th {
			text-align: center;
		}
	}
`
