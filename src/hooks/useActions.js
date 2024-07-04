import { bindActionCreators } from 'redux'
import { useDispatch } from 'react-redux'
import { useMemo } from 'react'
// supports passing in action creators as a single function, an array, or an object
/*
    to use this hook:
    import useActions from "hooks/useActions"
    const actions = useActions({reduxThunkAction, otherReduxThunkAction})

    //then access to the actions from the actions variable previously created
        example:
        useEffect(() => {

            const loadData = async () => {
                ...
                const response = await actions.reduxThunkAction()
                ...
            }

            loadData()

            return () => {
                ...
            }
        }, [])
*/

export function useActions (actions, deps) {
  const dispatch = useDispatch()
  return useMemo(
    () => {
      if (Array.isArray(actions)) {
        return actions.map((a) => bindActionCreators(a, dispatch))
      }
      return bindActionCreators(actions, dispatch)
    },
    [actions, dispatch]
  )
}
