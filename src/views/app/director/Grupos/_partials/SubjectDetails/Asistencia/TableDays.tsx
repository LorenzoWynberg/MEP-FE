import React from 'react'
import { Td, Th } from './Styles'
import colors from 'Assets/js/colors'
import { maxLengthString } from 'Utils/maxLengthString'
import { Tooltip } from '@material-ui/core'

const TableDays = ({ schedule, days, onSelectedLeccion }) => {
  return (
    <div>
      <table>
        <thead>
          {days?.map((day, iday) => {
            return <Th style={{ textAlign: 'center' }}>{day}</Th>
          })}
        </thead>
        <tbody>
          {schedule.map((item) => (
            <tr>
              {item.map((item) => {
                if (item.esReceso) {
                  return (
                    <Td style={{ backgroundColor: colors.primary, border: '1px solid black' }} />
                  )
                }
                if (item?.nombreAsignatura) {
                  return (
                    <Tooltip title={item?.nombreAsignatura}>
                      <Td style={{ border: '1px solid black' }}>
                        {item !== 0
                          ? (
                            <button
                              onClick={() => onSelectedLeccion(item)}
                              className='btn-table'
                            >
                              {maxLengthString(item?.nombreAsignatura, 12)}
                            </button>
                            )
                          : null}
                      </Td>
                    </Tooltip>
                  )
                }
                return (
                  <Td style={{ border: '1px solid black' }}>
                    {item !== 0
                      ? (
                        <button
                          onClick={() => onSelectedLeccion(item)}
                          className='btn-table'
                        >
                          {maxLengthString(item?.nombreAsignatura, 12)}
                        </button>
                        )
                      : null}
                  </Td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default TableDays
