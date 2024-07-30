import { isEmpty } from 'lodash'
import {
	ESTUDIANTE_FILTER,
	EXPEDIENTEESTUDIANTIL_LOADING,
	ESTUDIANTE_LOAD,
	ESTUDIANTE_CLEAR,
	CHANGE_FILTER_OPTION,
	CHANGE_COLUMN,
	FILTER_CLEAR
} from './types'

export const INITIAL_STATE = {
	estudiantes: [],
	currentStudent: !isEmpty(localStorage.getItem('currentStudent'))
		? JSON.parse(localStorage.getItem('currentStudent'))
		: {},
	error: '',
	loading: false,
	buscador: {
		data: [],
		filters: [
			{ id: 'f-01', column: 'nombreEstudiante', label: 'Buscar por Nombre', isSelected: true }, // Debe existir uno seleccionado por defecto
			{ id: 'f-02', column: 'identificacion', label: 'Buscar por Identificación', isSelected: false },
			{ id: 'f-03', column: 'institucion', label: 'Buscar por centro educativo', isSelected: false },
			{ id: 'f-04', column: 'grupo', label: 'Buscar por Grupo', isSelected: false },
			{ id: 'f-05', column: 'modalidad', label: 'Buscar por Modalidad', isSelected: false }
		],
		columns: [
			{
				label: 'Nombre / Apellidos',
				column: 'nombreEstudiante',
				isName: false,
				isSelected: true,
				width: 25,
				order: true
			},
			{
				label: 'Identificación',
				column: 'identificacion',
				isName: true,
				isSelected: true,
				width: 15,
				paddingLeft: '20px',
				order: true
			},
			{
				label: 'Centro educativo',
				column: 'institucion',
				isName: false,
				isSelected: true,
				width: 20,
				order: false
			},
			{
				label: 'Tipo de centro educativo',
				column: 'tipoInstitucion',
				isName: false,
				isSelected: true,
				width: 20,
				order: false
			},
			{
				label: 'Regional / Circuito',
				column: 'regional',
				isName: false,
				isSelected: true,
				width: 20,
				order: false
			},
			{ label: 'Extra 1', column: 'Extra1', isName: false, isSelected: false, width: 20, order: false },
			{ label: 'Extra 2', column: 'Extra2', isName: false, isSelected: false, width: 20, order: false },
			{ label: 'Extra 3', column: 'Extra3', isName: false, isSelected: false, width: 20, order: false }
		]
	}
}

export default (state = INITIAL_STATE, action) => {
	switch (action.type) {
		case ESTUDIANTE_FILTER:
			return {
				...state,
				estudiantes: action.payload.data,
				error: '',
				loading: false
			}
		case FILTER_CLEAR:
			return {
				...state,
				estudiantes: [],
				error: '',
				loading: false
			}
		case ESTUDIANTE_CLEAR:
			localStorage.removeItem('currentStudent')
			return {
				...state,
				error: '',
				loading: false,
				currentStudent: {}
			}
		case ESTUDIANTE_LOAD:
			localStorage.setItem('currentStudent', JSON.stringify(action.payload))
			return {
				...state,
				currentStudent: action.payload,
				error: '',
				loading: false
			}
		case EXPEDIENTEESTUDIANTIL_LOADING:
			return { ...state, loading: true, error: '' }

		case CHANGE_COLUMN:
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

		case CHANGE_FILTER_OPTION:
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

		default:
			return state
	}
}
