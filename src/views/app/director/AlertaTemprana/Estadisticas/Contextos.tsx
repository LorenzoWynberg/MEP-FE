import React from 'react'
import styled from 'styled-components'
import colors from '../../../../../assets/js/colors'

type IProps = {
    interno: number,
    externo: number
};

const Contextos: React.FC<IProps> = (props) => {
  return (
    <Row>
      <Content>
        <Title>Contexto interno</Title>
        <Box>
          <TotalAlerts>{props.interno}</TotalAlerts>
          <Description>alertas en contexto interno</Description>
        </Box>
      </Content>
      <Content>
        <Title>Contexto externo</Title>
        <Box>
          <TotalAlerts>{props.externo}</TotalAlerts>
          <Description>alertas en contexto externo</Description>
        </Box>
      </Content>
    </Row>
  )
}

const Row = styled.div`
    display: grid;
    grid-template-columns: repeat(2, 48%);
    justify-content: space-between;
    align-items: center;
`

const Content = styled.div`
    flex-direction: column;
`

const Title = styled.h3`
    color: #000;
`

const Box = styled.div`
    background: ${colors.primary};
    padding: 0 20px;
    border-radius: 10px;
    min-height: 70px;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    cursor: pointer;
`

const TotalAlerts = styled.strong`
    color: #fff;
    font-size: 20px;
`

const Description = styled.span`
    color: #fff;
    font-size: 16px;
    padding-left: 6px;
    font-weight: 100;
`

export default Contextos
