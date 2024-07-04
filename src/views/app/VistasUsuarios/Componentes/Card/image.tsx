import React from 'react'
import styled from 'styled-components'
import SchoolIcon from '@mui/icons-material/School'

const Image = () => {
  return (
    <Img>
      <SchoolIcon style={{ color: '#fff', fontSize: '60px' }} />
    </Img>
  )
}

export default Image

const Img = styled.div`
  width: 100%;
  height: 100%;
  background: #145388;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  box-shadow: 0px 0px 5px 1px rgba(0, 0, 0, 0.2);
  display: flex;
  justify-content: center;
  align-items: center;
  align-content: center;
`
