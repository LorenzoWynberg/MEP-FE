/*
Menu Types:
"menu-default", "menu-sub-hidden", "menu-hidden"
Color Options:
"light.purple", "light.blue", "light.green", "light.orange", "light.red", "dark.purple", "dark.blue", "dark.green", "dark.orange", "dark.red"
*/
const enviroment = process.env.NODE_ENV

const getVariables = (env) => {
  const variables = {
    DEFAULT_LOCALE: process.env.DEFAULT_LOCALE,
    DEFAULT_COLOR: process.env.DEFAULT_COLOR,
    DEFAULT_DIRECTION: process.env.DEFAULT_DIRECTION,
    DEFAULT_MENU_TYPE: process.env.DEFAULT_MENU_TYPE,
    SUB_HIDDEN_BREAKPOINT: 1440,
    MENU_HIDDEN_BREAKPOINT: 768,
    IS_MULTICOLOR_ACTIVE: false,
    THEME_COLOR_STORAGE_KEY: '__theme_color',
    THEME_RADIUS_STORAGE_KEY: '__theme_radius',
    SEARCH_PATH: '/app/pages/search',
    LOCALE_OPTIONS: [
      { id: 'en', name: 'English', direction: 'ltr' },
      { id: 'es', name: 'Español', direction: 'ltr' }
    ]
  }
  if (env === 'development') {
    variables.BACKEND_URL = process.env.DEVELOPMENT_API_URL
  } else {
    variables.BACKEND_URL = process.env.PRODUCTION_API_URL
  }

  return variables
}

export const envVariables = getVariables(enviroment)
