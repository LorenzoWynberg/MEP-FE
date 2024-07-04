import TYPES from './types'
const initialState = {
  tema: 'orange',
  primary: '#145388',
  secondary: '#F5B72B',
  tertiary: '#DBC5A9',
  quaternary: '#060606',
  primaryText: 'white',
  gray: '#6D7280',
  gray1: '#F3F4F6',
  gray2: '#E5E7EB',
  gray3: '#D2D5DA',
  gray4: '#9CA3AF',
  gray5: '#6D7280',
  gray6: '#4B5563',
  gray7: '#374151',
  gray8: '#1F2937',
  gray9: '#111827',
  red: '#FEF2F2',
  red1: '#FEE2E2',
  red2: '#FECACA',
  red3: '#FCA5A5',
  red4: '#F87171',
  red5: '#EF4444',
  red6: '#DC2626',
  red7: '#B91C1C',
  red8: '#991B1B',
  red9: '#7F1D1D',
  orange: '#FFF7ED',
  orange1: '#FFEDD5',
  orange2: '#FED7AA',
  orange3: '#FDBA74',
  orange4: '#FB923C',
  orange5: '#F97316',
  orange6: '#EA580C',
  orange7: '#C2410C',
  orange8: '#9A3412',
  orange9: '#7C2D12',
  // gray: '#D4D4D4',
  darkGray: '#575757',
  opaqueGray: '#dbdbdb', // Se usa para los border
  error: '#bd0505'
}
const reducer = (state = initialState, action: any): typeof initialState => {
  const { payload, type } = action
  switch (type) {
    case TYPES.SET_ALL_COLORS:
      return { ...payload }
    case TYPES.SET_PRIMARY: {
      return { ...state, primary: payload }
    }
    default:
      return state
  }
}

export default reducer
