import React from 'react'
import styled from 'styled-components'
import ContextualMenu from 'components/ContextualMenu'
import colors from 'Assets/js/colors'
import AssignmentIcon from '@material-ui/icons/Assignment'

const CardRol = (props) => {
  const { rol, options, edit } = props

  return (
    <Container>
      <Img color={rol.color || colors.primary} onClick={() => edit(rol)}>
        {rol.urlimg
          ? (
            <img src={rol.urlimg} alt='' />
            )
          : (
            <AssignmentIcon fontSize='large' style={{ color: 'white' }} />
            )}
      </Img>
      <Title onClick={() => edit(rol)}>{rol.nombre}</Title>
      <Actions>
        <ContextualMenu options={options} row={rol} />
      </Actions>
    </Container>
  )
}

const Container = styled.div`
  width: 100%;
  border: 1px solid;
  border-radius: 10px;
  display: flex;
  justify-content: space-between; // Alinea los elementos en el eje horizontal
  align-items: center; // Alinea los elementos en el eje vertical
  gap: 5px; // Espacio entre los elementos
  overflow: hidden;
  height: 70px;
  margin-bottom: 10px;
  cursor: pointer;
`
const Img = styled.div<{ color: string }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 120px;
  height: 70px;
  background: ${(props) => props.color};
  img {
    width: 100%;
  }
`
const Title = styled.label`
  text-align: left;
  width: 100%;
  margin: 0;
  font-weight: 600;
  font-size: 13px;
  cursor: pointer;
  text-transform: uppercase;
`
const Actions = styled.div``

export default CardRol
