import React, { useState, useEffect } from 'react'
import Main from './_partials/Anio'
import { Helmet } from 'react-helmet'
const Anio = (props) => {
  const [currentTab, setCurrentTab] = useState(0)
  const [currentYear, setCurrentYear] = useState(null)

  const { hasAddAccess = true, hasEditAccess = true, hasDeleteAccess = true } = props

  useEffect(() => {
    if (currentTab === 0) {
      setCurrentYear(null)
    }
  }, [currentTab])

  return (
    <div>
      <Helmet>
        <title>Año educativo</title>
      </Helmet>
      <Main
        currentYear={currentYear}
        {...props}
        setCurrentTab={setCurrentTab}
        setCurrentYear={setCurrentYear}
        hasAddAccess={hasAddAccess}
        hasEditAccess={hasEditAccess}
        hasDeleteAccess={hasDeleteAccess}
      />
    </div>
  )
}

export default Anio
