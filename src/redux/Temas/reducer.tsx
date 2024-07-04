
import {
  THEMES_LOAD,
  THEMES_SAVE,
  THEMES_LOAD_CURRENT_THEME,
  THEMES_LOAD_UPDATED,
  THEMES_LOAD_DELETED
} from './types'

const INIT_STATE = {
  themes: [],
  currentTheme: {}
}

export default (state = INIT_STATE, action) => {
  switch (action.type) {
    case THEMES_LOAD_UPDATED:
      const _themes = [...state.themes]
      _themes.forEach(el => {
        if (el.temaId == action.payload.themeId) {
          el = action.payload.data
        }
      })
      return { ...state, themes: _themes }
    case THEMES_LOAD:
      return { ...state, themes: action.payload }
    case THEMES_LOAD_DELETED:
      return { ...state, themes: state.themes.filter(theme => theme.temaId !== action.payload.themeId) }
    case THEMES_LOAD_CURRENT_THEME:
      return { ...state, currentTheme: action.payload }
    case THEMES_SAVE:
      return { ...state, themes: [...state.themes, action.payload] }

    default: return { ...state }
  }
}
