import React from 'react'
import colors from 'Assets/js/colors'
import styled from 'styled-components'
interface IProps {
  width?: string
  children: JSX.Element
  color?: string
}
const DisplayCardInfo: React.FC<IProps> = (props) => {
  return (
    <Card width={props.width} color={props.color}>
      {props.children}
    </Card>
  )
}
DisplayCardInfo.defaultProps = {
  children: <></>,
  color: colors.primary,
  width: ''
}
const Card = styled.div<{ color; width }>`
  background: linear-gradient(
    to bottom left,
    #4279a8,
    ${(props) => props.color} 75%
  );
  border-radius: 15px;
  color: white;
  width: ${(props) => props.width};
  &:hover {
    background: linear-gradient(
      to bottom left,
      #4279a8,
      ${(props) => props.color} 75%
    );
  }
`
export default DisplayCardInfo
