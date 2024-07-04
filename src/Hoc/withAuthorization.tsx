import React from 'react'
import {
  useAuthValidation,
  Section,
  useAuthHandler
} from '../hooks/authProfileUser'
// returns component with showNotification inside the props element
// showNotification(msg, variant)
const withAuthorization = (sectionElement: Section) => {
  return (Component) => {
    return (props) => {
      const validations = useAuthValidation(sectionElement)
      const authHandler = useAuthHandler(sectionElement)
      if (validations.leer) {
        return (
          <Component
            validations={validations}
            authHandler={authHandler}
            {...props}
          />
        )
      } else {
        return (
          <div>
            <h1>No tiene acceso a este sitio</h1>
          </div>
        )
      }
    }
  }
}

export default withAuthorization
