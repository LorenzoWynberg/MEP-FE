import React, { useEffect, useState } from 'react'
import DatePicker from 'react-datepicker'
import styled from 'styled-components'

const DateFilter = ({ column: { filterValue = [], preFilteredRows, setFilter, id } }) => {
  const [min, max] = React.useMemo(() => {
    let min = preFilteredRows.length ? new Date(preFilteredRows[0].values[id]) : new Date()
    let max = preFilteredRows.length ? new Date(preFilteredRows[0].values[id]) : new Date()
    preFilteredRows.forEach(row => {
      min = new Date(row.values[id]) < min ? new Date(row.values[id]) : min
      max = new Date(row.values[id]) > max ? new Date(row.values[id]) : max
    })
    min.setDate(min.getDate() - 1)
    max.setDate(max.getDate() + 1)
    return [min, max]
  }, [id, preFilteredRows])

  const [dates, setDates] = useState([])

  useEffect(() => {
    if (filterValue.length === 0 && dates.length > 0) {
      setFilter(dates)
    }
    if (filterValue.length > 0 && (filterValue[0] !== dates[0] || filterValue[1] !== dates[1])) {
      setFilter(dates)
    }
  }, [dates, filterValue])
  return (
    <div className='d-flex align-items-center'>
      <div style={{ width: '4rem' }} className='mr-2'>
        <CustomDatePicker
          className='remove-padding'
          selected={dates[0] || min}
          value={dates[0] || min}
          minDate={min}
          onChange={(val) => {
            setDates((old = []) => [val || undefined, !old[1] ? max : old[1]])
          }}
        />
      </div>
      <div style={{ width: '4rem' }}>
        <CustomDatePicker
          selected={dates[1] || max}
          value={dates[1] || max}
          maxDate={max}
          onChange={(val) => {
            setDates((old = []) => [!old[0] ? min : old[0], val || undefined])
          }}
          className='remove-padding'
        />
      </div>
    </div>
  )
}

const CustomDatePicker = styled(DatePicker)`
  padding: 0 !important;

  &.react-datepicker__input-container input {
    padding: 0 !important;
  }

  input {
    padding: 0 !important;
  }
`

export default DateFilter
