import React from 'react'
import { Input } from 'reactstrap'

const TextFilter = ({ column: { filterValue, preFilteredRows, setFilter }, placeholder }) => {
  return (
    <div>
      <Input
        type='text'
        value={filterValue}
        onChange={(e) => setFilter(e.target.value)}
        placeholder={placeholder}
      />
    </div>
  )
}

export default TextFilter
