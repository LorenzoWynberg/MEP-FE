import { guidGenerator } from '../../../../utils/GUIDGenerator'

const fields = {
  text: {
    type: 'text',
    label: '',
    options: [],
    config: {
      required: true,
      tooltipText: '',
      placeholder: '',
      mask: ''
    }
  },
  textArea: {
    type: 'textArea',
    label: '',
    options: [],
    config: {
      required: true,
      tooltipText: ''
    }
  },
  unic: {
    type: 'unic',
    label: '',
    source: '', // Perzonalizada [source_1], predefinida [source_2], desde base de datos [source_3]
    options: [], // Manual esta el arreglo, predefinido. el nombre de la lista, desde DB (nombreCatalogoFromDB) {id,value,label}
    config: {
      required: true,
      tooltipText: ''
    }
  },
  location: {
    type: 'location',
    orientation: 'column',
    dropDowns: [
      {
        type: 'dropDown',
        label: 'Provincia',
        options: [
          {
            label: '',
            value: 0,
            default: true
          }
        ],
        config: {}
      },
      {
        type: 'dropDown',
        label: 'Cantón',
        options: [
          {
            label: '',
            value: 0,
            default: true
          }
        ],
        config: {}
      },
      {
        type: 'dropDown',
        label: 'Distrito',
        options: [
          {
            label: '',
            value: 0,
            default: true
          }
        ],
        config: {},
        buttons: true
      },
      {
        type: 'dropDown',
        label: 'Poblado',
        options: [
          {
            label: '',
            value: 0,
            default: true
          }
        ],
        config: {}
      },
      {
        type: 'textArea',
        label: 'Dirección exacta',
        options: [],
        config: {
          required: true,
          tooltipText: ''
        }
      }
    ],
    config: {
      h: 12,
      required: true
    }
  },
  coordinates: {
    type: 'coordinates',
    showLocation: true,

    defaultHidden: true,
    options: [
      {
        type: 'map',
        controlledMap: true
      },
      {
        type: 'text',
        label: 'Longitud',
        config: {
          tooltipText: '',
          required: true
        }
      },

      {
        type: 'text',
        label: 'Latitud',
        config: {
          tooltipText: '',
          required: true
        }
      }
    ],
    config: {
      h: 12,
      required: true,
      useModal: false
    }
  },
  checklist: {
    type: 'checklist',
    label: '',
    source: '', // Perzonalizada [source_1], predefinida [source_2], desde base de datos [source_3]
    options: [], // Manual esta el arreglo, predefinido. el nombre de la lista, desde DB (nombreCatalogoFromDB) {id,value,label}
    config: {
      required: true,
      tooltipText: '',
      orientation: 'row', // row=horizontal, column=vertical
      h: 3
    }
  },
  radio: {
    type: 'radio',
    label: '',
    source: '', // Perzonalizada [source_1], predefinida [source_2], desde base de datos [source_3]
    options: [], // Manual esta el arreglo, predefinido. el nombre de la lista, desde DB (nombreCatalogoFromDB) {id,value,label}
    config: {
      required: true,
      tooltipText: '',
      orientation: 'column', // row=horizontal, column=vertical
      h: 3
    }
  },
  date: {
    type: 'date',
    label: '',
    options: [],
    config: {
      required: true,
      tooltipText: ''
    }
  },
  image: {
    type: 'image',
    label: 'nuevo título',
    config: {
      required: false,
      multiple: false,
      forma: 'Rectangular',
      h: 9.5
    }
  },

  uploadFile: {
    type: 'uploadFile',
    label: 'nuevo título',
    config: {
      required: false,
      type: 'archivo',
      icon: 'archivo',
      maxFiles: 5,
      typesAccepted: '*',
      h: 6
    }
  },
  switch: {
    type: 'switch',
    label: '',
    config: {
      tooltipText: ''
    }
  },
  multiple: {
    type: 'multiple',
    label: '',
    source: '', // Perzonalizada [source_1], predefinida [source_2], desde base de datos [source_3]
    options: [], // Manual esta el arreglo, predefinido. el nombre de la lista, desde DB (nombreCatalogoFromDB) {id,value,label}
    config: {
      required: true,
      tooltipText: ''
    }
  },
  crudTable: {
    type: 'crudTable',
    label: '',
    config: {
      columns: [
        { titulo: 'columna', id: guidGenerator() },
        { titulo: 'columna', id: guidGenerator() }
      ],
      tooltipText: ''
    }
  },
  reactTable: {
    type: 'reactTable',
    label: '',
    config: {
      columns: [
        { Header: 'columna', accessor: 'accessor1', label: '', column: '', id: guidGenerator() },
        { Header: 'columna', accessor: 'accessor2', label: '', column: '', id: guidGenerator() }
      ],
      data: [],
      tooltipText: ''
    }
  },
  redes: {
    type: 'redes',
    label: '',
    config: {
      facebook: true,
      twitter: true,
      instagram: true,
      whatsapp: true
    }
  }
}

export const fieldTypes = {
  ...fields,
  locationExact: {
    type: 'locationExact',
    components: {
      location: fields.location,
      coordinates: fields.coordinates
    },
    config: {
      required: true,
      h: 12
    }
  }
}
