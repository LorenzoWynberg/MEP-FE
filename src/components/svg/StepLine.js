import React from 'react'

const StepLine = (props) => {
  const radius = 10
  return (
    <svg
      height={radius * 2}
      width={radius * 2}
    >
      <circle cx={10} cy={10} r={radius} fill='grey' />
      <circle cx={10} cy={10} r={radius / 2 + 2} fill='blue' />
    </svg>
  )
}

export default StepLine
