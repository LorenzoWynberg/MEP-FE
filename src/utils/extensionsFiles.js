export const allExtentions = [
  {
    id: 'DOC',
    extension: '.DOC',
    descripcion: 'Microsoft Word Document'
  },
  {
    id: 'DOCX',
    extension: '.DOCX',
    descripcion: 'Microsoft Word Open XML Document'
  },
  {
    id: 'TXT',
    extension: '.TXT',
    descripcion: 'Plain Text File'
  },
  {
    id: 'CSV',
    extension: '.CSV',
    descripcion: 'Comma Separated Values File'
  },
  {
    id: 'PPT',
    extension: '.PPT',
    descripcion: 'PowerPoint Presentation'
  },
  {
    id: 'PPTX',
    extension: '.PPTX',
    descripcion: 'PowerPoint Open XML Presentation'
  },
  {
    id: 'MP3',
    extension: '.MP3',
    descripcion: 'MP3 Audio File'
  },
  {
    id: 'WAV',
    extension: '.WAV',
    descripcion: 'WAV'
  },
  {
    id: 'WMA',
    extension: '.WMA',
    descripcion: 'WMA'
  },
  {
    id: 'MID',
    extension: '.MID',
    descripcion: 'MIDI'
  },
  {
    id: 'MP4',
    extension: '.MP4',
    descripcion: 'MPEG-4 Video File'
  },
  {
    id: 'JPG',
    extension: '.JPG',
    descripcion: 'JPEG Image'
  },
  {
    id: 'JPEG',
    extension: '.JPEG',
    descripcion: 'JPEG Image'
  },
  {
    id: 'PNG',
    extension: '.PNG',
    descripcion: 'Portable Network Graphic'
  },
  {
    id: 'GIF',
    extension: '.GIF',
    descripcion: 'Graphical Interchange Format File'
  },
  {
    id: 'PSD',
    extension: '.PSD',
    descripcion: 'Adobe Photoshop Document'
  },
  {
    id: 'AI',
    extension: '.AI',
    descripcion: 'Adobe Illustrator File'
  },
  {
    id: 'SVG',
    extension: '.SVG',
    descripcion: 'Scalable Vector Graphics File'
  },
  {
    id: 'ICO',
    extension: '.ICO',
    descripcion: 'ICON'
  },
  {
    id: 'WEBP',
    extension: '.WEBP',
    descripcion: 'WEBP'
  },
  {
    id: 'PDF',
    extension: '.PDF',
    descripcion: 'Portable Document Format File'
  },
  {
    id: 'XLS',
    extension: '.XLS',
    descripcion: 'Excel Spreadsheet'
  },
  {
    id: 'XLSX',
    extension: '.XLSX',
    descripcion: 'Microsoft Excel Open XML Spreadsheet'
  },
  {
    id: '7Z',
    extension: '.7Z',
    descripcion: '7-Zip Compressed File'
  },
  {
    id: 'RAR',
    extension: '.RAR',
    descripcion: 'WinRAR Compressed Archive'
  },
  {
    id: 'ZIP',
    extension: '.ZIP',
    descripcion: 'Zipped File'
  },
  {
    id: 'ZIPX',
    extension: '.ZIPX',
    descripcion: 'Extended Zip Archive'
  }
]

export const imageExtensions = allExtentions.filter((item) =>
  ['JPG', 'PNG', 'JPEG', 'GIF', 'SVG', 'WEBP', 'ICO'].includes(item.id)
)

export const audioExtensions = allExtentions.filter((item) =>
  ['MP3', 'WAV', 'WMA', 'MID'].includes(item.id)
)
