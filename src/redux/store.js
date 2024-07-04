import { createStore, applyMiddleware } from 'redux'
import { composeWithDevTools } from '@redux-devtools/extension'
import reducers from './reducers'
import thunk from 'redux-thunk'
import logger from 'redux-logger'

const middlewares = [thunk, logger]

export function configureStore (initialState) {
  const store = createStore(
    reducers,
    initialState,
    composeWithDevTools(applyMiddleware(...middlewares))
  )

  if (module.hot) {
    module.hot.accept('./reducers', () => {
      const nextRootReducer = require('./reducers')
      store.replaceReducer(nextRootReducer)
    })
  }

  return store
}
