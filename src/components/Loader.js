import React from 'react'

const Loader = ({ formLoader, styles }) => {
  return (
    <div className={`loading ${formLoader && 'loading-form ml-4'}`} style={styles || {}} />
  )
}

export default Loader
