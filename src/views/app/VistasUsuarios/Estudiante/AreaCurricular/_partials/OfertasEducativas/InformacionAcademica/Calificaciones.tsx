import React from 'react'
import styled from 'styled-components'

const Calificaciones = () => {
  return (
    <Box>
      <h5>Calificaciones</h5>
      <span>No hay datos reportados</span>
    </Box>
  )
}

export default Calificaciones

const Box = styled.div`
  box-shadow: 0px 0px 5px 1px rgba(0, 0, 0, 0.2);
  background: #fff;
  padding: 5%;
  width: 60%;
  min-height: 15rem;
  max-height: 100%;
  border-radius: 15px;
`
