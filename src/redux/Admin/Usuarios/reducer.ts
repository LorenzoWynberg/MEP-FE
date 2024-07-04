import * as types from './types.ts'

const INITIAL_STATE = {
  users: [],
  currentUser: {},
  error: '',
  loading: false,
  buscador: {
    data: [],
    filters: [
      { id: 'f-01', column: 'nombreCompleto', label: 'Nombre Completo', isSelected: true }, // Debe existir uno seleccionado por defecto
      { id: 'f-02', column: 'TipoCatalogoId', label: 'Tipo de identificacion', isSelected: false },
      { id: 'f-03', column: 'identificacion', label: 'Número de identificación', isSelected: false },
      { id: 'f-04', column: 'nacionalidad', label: 'Nacionalidad', isSelected: false },
      { id: 'f-05', column: 'estado', label: 'Estado', isSelected: false }
    ],
    columns: [
      { label: 'Nombre Completo', column: 'nombreCompleto', isName: true, isSelected: true, width: 20, order: false },
      { label: 'Tipo de identificacion', column: 'TipoCatalogoId', isName: false, isSelected: true, width: 20, order: false },
      { label: 'Número de identificación', column: 'identificacion', isName: false, isSelected: true, width: 20, order: true },
      { label: 'Nacionalidad', column: 'nacionalidad', isName: false, isSelected: true, width: 20, order: false },
      { label: 'Estado', column: 'estado', isName: false, isSelected: true, width: 20, order: false }
    ]
  }
}

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case types.USERS_LOADING:
      return {
        ...state,
        loading: true,
        error: ''
      }
    case types.USERS_LOAD:
      return {
        ...state,
        users: action.payload,
        error: '',
        loading: false
      }
    case types.USERS_CLEAR:
      return {
        ...state,
        users: [],
        error: '',
        loading: false
      }
      // case EARLY_ALERT_LOAD:
      //     return {
      //         ...state,
      //         currentAlert: action.payload,
      //         error: '',
      //         loading: false
      //     }
    case types.CHANGE_COLUMN:
      const _selecteds = state.buscador.columns.filter(x => x.isSelected === true)
      const _selectedColumn = state.buscador.columns.find(c => c.column === action.payload.target.id)
      if (_selectedColumn.isSelected === false) {
        if (_selecteds.length >= 5) {
          return {
            ...state,
            error: 'No puede seleccionar más de 5 columnas'
          }
        }
      }
      const _columnsChanged = state.buscador.columns.map(item => {
        if (item.column === action.payload.target.id) {
          return {
            ...item,
            isSelected: action.payload.target.checked
          }
        } else {
          return item
        }
      })

      return { ...state, buscador: { ...state.buscador, columns: _columnsChanged } }

    case types.CHANGE_FILTER_OPTION:

      const _filterOptionChanged = state.buscador.filters.map(item => {
        if (item.id === action.payload.target.id) {
          return {
            ...item,
            isSelected: !item.isSelected
          }
        } else {
          return {
            ...item,
            isSelected: false
          }
        }
      })
      return { ...state, buscador: { ...state.buscador, filters: _filterOptionChanged } }

    default: return state
  }
}
