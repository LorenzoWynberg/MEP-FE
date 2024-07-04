import React from 'react'
import CssBaseline from '@material-ui/core/CssBaseline'
import MaUTable from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import styled from 'styled-components'

import { useTable, useFilters } from 'react-table'
interface IProps {
  columns:any
  data:any
  avoidFilter:any
  avoidCss?:any
}
const Table:React.FC<IProps> = ({ columns, data, avoidFilter, avoidCss }) => {
  const filterTypes = React.useMemo(
    () => ({
      dateBetween: dateBetweenFilterFn,
      timeBetween: timeBetweenFilterFn,
      text: (rows, id, filterValue) => {
        return rows.filter(row => {
          const rowValue = row.values[id]
          return rowValue !== undefined
            ? String(rowValue)
              .toLowerCase()
              .startsWith(String(filterValue).toLowerCase())
            : true
        })
      }
    }),
    []
  )

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow
  } = useTable(
    {
      columns,
      data,
      filterTypes
    },
    !avoidFilter ? useFilters : null
  )

  return (
    <>
      {avoidCss ? '' : <CssBaseline />}
      <MaUTable {...getTableProps()}>
        <TableHead>
          {headerGroups.map(headerGroup => (
            <TableRow {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => {
                return (

                  <CustomTableCell
                    {...column.getHeaderProps()}
                    style={{
                      backgroundColor: '#145388',
                      color: '#fff',
                      width: column.width ? column.width : 'auto'
                    }}
                  >
                    {column.render('Header')}
                    <div>{column.canFilter ? column.render('Filter') : null}</div>
                  </CustomTableCell>
                )
              })}
            </TableRow>
          ))}
        </TableHead>
        <TableBody {...getTableBodyProps()}>
          {rows.map((row, i) => {
            prepareRow(row)
            return (
              <TableRow {...row.getRowProps()}>
                {row.cells.map(cell => {
                  return (
                    <CustomTableCell {...cell.getCellProps()} className={i % 2 !== 0 && 'row-odd'}>
                      {cell.render('Cell')}
                    </CustomTableCell>
                  )
                })}
              </TableRow>
            )
          })}
        </TableBody>
      </MaUTable>

    </>
  )
}
function dateBetweenFilterFn (rows, id, filterValues) {
  const sd = new Date(filterValues[0])
  const ed = new Date(filterValues[1])
  return rows.filter(r => {
    const time = new Date(r.values[id])
    if (filterValues.length === 0) return rows
    return (time >= sd && time <= ed)
  })
}

function timeBetweenFilterFn (rows, id, filterValues) {
  const sd = new Date(filterValues[0])
  const ed = new Date(filterValues[1])
  const date = new Date()
  return rows.filter(r => {
    const time = new Date(`${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()} ${r.values[id]}`)
    if (filterValues.length === 0) return rows
    return (time >= sd && time <= ed)
  })
}

dateBetweenFilterFn.autoRemove = val => !val
timeBetweenFilterFn.autoRemove = val => !val

const CustomTableCell = styled(TableCell)`
  border: 1px solid #bdc3c7;
  &.row-odd {
    background-color: #eaeaea !important;
  }
`

export default Table
