import React from 'react'
import styled from 'styled-components'
import { GiGraduateCap } from 'react-icons/gi'
import Image from './image'

interface IProps {
  image?: string
  name: string
  institutos?: []
  onClick?: any
}

const CardStudent: React.FC<IProps> = ({
  image,
  name,
  institutos,
  onClick
}) => {
  const colegios = [
    'Colegio secundario: Sección 10-1',
    'Colegio técnico nocturno: Sección 10-1'
  ]

  return (
    <Container onClick={onClick}>
      <Card>
        <Img>{image ? <img width='264px' height='194px' src={image} alt='' /> : <Image />}</Img>
        <Footer>
          <Title>{name}</Title>
          <Body>
            {institutos?.map((e) => (
              <div>
                <GiGraduateCap style={{ marginRight: '3px' }} color='#145388' />{' '}
                {e}
              </div>
            ))}
          </Body>
        </Footer>
      </Card>
    </Container>
  )
}

export default CardStudent

const Card = styled.div`
  background: #fff;
  width: 16.5rem;
  min-height: 17rem;
  max-height: 25rem;
  border-radius: 10px;
  box-shadow: 0px 0px 5px 1px rgba(0, 0, 0, 0.2);
`

const Container = styled.div`
  cursor: pointer;
`

const Img = styled.div`
  width: 100%;
  height: 12rem;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  box-shadow: 0px 0px 5px 1px rgba(0, 0, 0, 0.2);
  max-width: 264px;
  max-height: 192px;
`
const Title = styled.h5`
  color: #145388;
`

const Footer = styled.div`
  display: flex;
  justify-content: flex-start;
  flex-direction: column;
  padding: 3%;
`
const Body = styled.div`
  display: flex;
  justify-content: flex-start;
  flex-direction: column;
  align-items: start;
  align-content: center;
`
