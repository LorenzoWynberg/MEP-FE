import React, { useEffect, useState } from 'react'
import DateTime from 'react-datetime'
import styled from 'styled-components'

import 'react-datetime/css/react-datetime.css'

const TimeFilter = ({ column: { filterValue = [], preFilteredRows, setFilter, id } }) => {
  const [min, max] = React.useMemo(() => {
    const date = new Date()
    let min = preFilteredRows.length ? new Date(`${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()} ${preFilteredRows[0].values[id]}`) : new Date()
    let max = preFilteredRows.length ? new Date(`${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()} ${preFilteredRows[0].values[id]}`) : new Date()

    preFilteredRows.forEach(row => {
      min = new Date(`${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()} ${row.values[id]}`) < min
        ? new Date(`${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()} ${row.values[id]}`)
        : min
      max = new Date(`${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()} ${row.values[id]}`) > max
        ? new Date(`${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()} ${row.values[id]}`)
        : max
    })
    min.setHours(min.getHours() - 1, 0, 0)
    max.setHours(max.getHours() + 1, 0, 0)
    return [min, max]
  }, [id, preFilteredRows])

  const [times, setTimes] = useState<any>([min, max])

  useEffect(() => {
    if (filterValue.length === 0 && times.length > 0) {
      setFilter(times)
    }
    if (filterValue.length > 0 && (filterValue[0] !== times[0] || filterValue[1] !== times[1])) {
      setFilter(times)
    }
  }, [times, filterValue])

  return (
    <div className='d-flex align-items-center'>
      <div style={{ width: '5rem' }} className='mr-2'>
        <CustomDateTime
          value={new Date(times[0]) || min}
          timeFormat='hh:mm A'
          locale='es'
          onChange={(val) => {
            setTimes((old = []) => [val.toString(), old ? old[1] : undefined])
          }}
          dateFormat={false}
        />
      </div>
      <div style={{ width: '5rem' }}>
        <CustomDateTime
          value={new Date(times[1]) || max}
          timeFormat='hh:mm A'
          locale='es'
          dateFormat={false}
          onChange={(val) => {
            setTimes((old = []) => [old ? old[0] : undefined, val.toString()])
          }}
        />
      </div>
    </div>
  )
}

const CustomDateTime = styled(DateTime)`
  color: #000;
  & > div {
    min-width: 180px;
  }
`

export default TimeFilter
