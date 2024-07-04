import React from 'react'
import styled from 'styled-components'

const ReportCardContainer = ({ children }) => {
  return (
    <Container>
      {children}
    </Container>
  )
}

const Container = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 20px;
`

export default ReportCardContainer
