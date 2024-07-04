import React from 'react'

const LoaderContainer = ({ formLoader, styles }) => {
  return (
    <div className='loader-container'>
      <div className={`loading ${formLoader && 'loading-form ml-4'}`} style={styles || {}} />
    </div>
  )
}

export default LoaderContainer
