export const fields = {
  text: {
    type: 'text',
    typeLabel: 'Texto simple',
    label: '',
    config: {
      required: true
    }
  },
  date: {
    type: 'date',
    typeLabel: 'Fecha',
    label: '',
    config: {
      required: true
    }
  },
  radio: {
    type: 'radio',
    typeLabel: 'Selección Única',
    label: '',
    options: [
      {
        idx: 0,
        label: ''
      }
    ],
    config: {
      required: true
    }
  },
  textInputs: {
    type: 'textInputs',
    typeLabel: 'Múltiples textos cortos',
    label: '',
    options: [
      {
        idx: 0,
        label: ''
      }
    ],
    config: {
      required: true
    }
  },
  checklist: {
    type: 'checklist',
    typeLabel: 'Selección Múltiple',
    label: '',
    options: [
      {
        idx: 0,
        label: ''
      }
    ],
    config: {
      required: true
    }
  },
  dropdown: {
    type: 'dropdown',
    typeLabel: 'Lista Desplegable',
    label: '',
    options: [
      {
        idx: 0,
        label: ''
      }
    ],
    config: {
      required: true
    }
  },
  percentage: {
    type: 'percentage',
    typeLabel: 'Porcentaje',
    options: [
      {
        idx: 0,
        label: '',
        porcentaje: ''
      }
    ],
    config: {
      required: true
    }
  },
  uploadFile: {
    type: 'uploadFile',
    label: '',
    typeLabel: 'Subir Archivo',
    config: {
      required: true
    }
  },
  rate: {
    type: 'rate',
    label: '',
    typeLabel: 'Calificación',
    config: {
      required: true
    }
  },
  matrix: {
    type: 'matrix',
    label: '',
    typeLabel: 'Matriz con doble eje',
    rows: [],
    columns: [],
    config: {
      required: true
    }
  },
  richText: {
    type: 'richText',
    label: '',
    typeLabel: 'Texto Enriquecido',
    config: {
      required: true
    }
  }
  // pairing: {
  //   type: 'pairing',
  //   typeLabel: 'Pareo',
  //   label: '',
  //   config: {
  //     required: true,
  //   },
  // }
}
