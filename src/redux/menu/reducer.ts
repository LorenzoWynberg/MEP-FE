import {
  SET_MENU_STATE,
  TOGGLE_MENU_STATE,
  MENU_SET_CLASSNAMES,
  MENU_CONTAINER_ADD_CLASSNAME,
  MENU_CLICK_MOBILE_MENU,
  MENU_CHANGE_DEFAULT_CLASSES,
  MENU_CHANGE_HAS_SUB_ITEM_STATUS
} from '../actions'

import { envVariables } from '../../constants/enviroment'

const initialState = {
  active: true,
  containerClassnames: envVariables.DEFAULT_MENU_TYPE,
  subHiddenBreakpoint: envVariables.SUB_HIDDEN_BREAKPOINT,
  menuHiddenBreakpoint: envVariables.MENU_HIDDEN_BREAKPOINT,
  menuClickCount: 0,
  selectedMenuHasSubItems: envVariables.DEFAULT_MENU_TYPE === 'menu-default' // if you use menu-sub-hidden as default menu type, set value of this variable to false
}

const reducer = (state = initialState, action) => {
  const { type, payload } = action
  switch (type) {
    case SET_MENU_STATE: {
      return { ...state, active: payload }
    }
    case TOGGLE_MENU_STATE: {
      return { ...state, active: !state.active }
    }
    case MENU_CHANGE_HAS_SUB_ITEM_STATUS:
      return Object.assign({}, state, {
        selectedMenuHasSubItems: action.payload
      })

    case MENU_SET_CLASSNAMES:
      return Object.assign({}, state, {
        containerClassnames: action.payload.containerClassnames,
        menuClickCount: action.payload.menuClickCount
      })

    case MENU_CLICK_MOBILE_MENU:
      return Object.assign({}, state, {
        containerClassnames: action.payload.containerClassnames,
        menuClickCount: action.payload.menuClickCount
      })

    case MENU_CONTAINER_ADD_CLASSNAME:
      return Object.assign({}, state, {
        containerClassnames: action.payload
      })

    case MENU_CHANGE_DEFAULT_CLASSES:
      return Object.assign({}, state, {
        containerClassnames: action.payload
      })

    default:
      return { ...state }
  }
}
export default reducer
