
import { envVariables } from '../../constants/enviroment'

import {
  CHANGE_LOCALE
} from '../actions'

const INIT_STATE = {
  locale: (localStorage.getItem('currentLanguage') && envVariables.LOCALE_OPTIONS.filter(x => x.id === localStorage.getItem('currentLanguage')).length > 0) ? localStorage.getItem('currentLanguage') : envVariables.DEFAULT_LOCALE
}

export default (state = INIT_STATE, action) => {
  switch (action.type) {
    case CHANGE_LOCALE:
      return { ...state, locale: action.payload }

    default: return { ...state }
  }
}
