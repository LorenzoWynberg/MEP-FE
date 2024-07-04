import React from 'react'
import { Button } from 'react-bootstrap'
import XLSX from 'xlsx'

interface Column {
    label: string
    column: string
}
interface Iprops {
    columns: Column[],
    data: any[],
    reportName: string
}

const DataTable: React.FC<Iprops> = (props) => {
  const handleDonwload = (): void => {
    const _data = [props.columns.map(el => el.label),
      ...props.data.map((i) => {
        return [
          ...props.columns.map((j) => {
            return i[j.column]
          })
        ]
      })
    ]
    const worksheet = XLSX.utils.aoa_to_sheet(_data)
    const new_workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(new_workbook, worksheet, 'SheetJS')
    XLSX.writeFile(new_workbook, `${props.reportName.trim()}.xlsx`)
  }

  return (
    <div style={{ width: '50%' }}>
      <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-end' }}>
        <Button color='primary' onClick={handleDonwload}>
          Descargar
        </Button>
      </div>
      <table className='mallasTable-2'>
        <thead>
          <tr>
            {
                            props.columns?.map(el => (
                              <td>
                                {el.label}
                              </td>
                            ))
                        }
          </tr>
        </thead>
        <tbody>
          {
                        props.data?.map(item => {
                          return (
                            <tr>
                              {props.columns?.map(el => (
                                <td>
                                  {item[el.column] ? item[el.column] : 'N/A'}
                                </td>
                              ))}
                            </tr>
                          )
                        })
                    }
        </tbody>
      </table>
    </div>
  )
}

export default DataTable
