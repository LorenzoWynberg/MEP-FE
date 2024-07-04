import * as XLSX from 'xlsx'

const GenerateExcelObject = (data, useAttAsHeader = true, sheetname = 'Hoja 1') => {
  let xlsxData = []
  const options:XLSX.JSON2SheetOpts = {}
  if (useAttAsHeader && data.length > 0) {
    const keys = Object.keys(data[0])
    options.header = keys
    /* data.forEach((datarow) => {
            const row = []
            keys.forEach(k=>{
                row.push(datarow[k])
            })
            xlsxData.push(row)
        }) */
    xlsxData = data
  } else {
    xlsxData = data
  }

  const sheet = XLSX.utils.json_to_sheet(xlsxData, options)

  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, sheet, sheetname)

  return workbook
}

const SendWorkbookToDownload = (workbook: XLSX.WorkBook, filename = 'reporte.xlsx') => {
  const file = XLSX.write(workbook, {
    type: 'buffer',
    bookType: 'xlsx'
  })

  const a = document.createElement('a')
  document.body.appendChild(a)
  a.style.display = 'none'
  const blob = new Blob([file], { type: 'octet/stream' })
  const url = window.URL.createObjectURL(blob)
  a.href = url
  a.download = filename
  a.click()
  window.URL.revokeObjectURL(url)
}

export {
  GenerateExcelObject,
  SendWorkbookToDownload
}
