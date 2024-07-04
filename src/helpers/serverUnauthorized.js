import {
  SERVER_ERROR,
  SEREVER_UNAUTHORIZED
} from '../redux/actions'

export default async (store) => {
  try {
    store.dispatch({
      type: SEREVER_UNAUTHORIZED
    })
  } catch (e) {
    store.dispatch({
      type: SERVER_ERROR
    })
  }
}
