import colors from '../../../../assets/js/colors'
import styled from 'styled-components'

export const DropDownToggle = styled.span`
  margin-left: 0.5rem;
  height: 1.5rem;
  width: 1.5rem;
  color: white;
  border-radius: 50%;
  background-color: ${colors.primary};
  display: flex;
  justify-content: center;
  align-items: center;
  transition: all 0.5s ease-in-out;
  ${(props) => props.active && 'transform: rotate(180deg);'}
`

export const Card = styled.div`
  cursor: pointer;
  width: 100%;
  background-color: white;
  height: 18rem;
  box-shadow: 0 0 2px 1px rgba(0, 0, 0, 0.2);
  border-radius: 15px;
  overflow: hidden;
  position: relative;
  margin-bottom: 1rem;
  .img_overlay {
    background-image: linear-gradient(
      to top,
      #000000ba,
      transparent,
      transparent,
      transparent,
      transparent
    );
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 58%;
  }

  img {
    width: 100%;
    height: 58%;
  }
`

export const CardContent = styled.div`
  padding: 1rem;
  h6 {
    color: ${colors.primary};
    font-weight: bold;
  }

  .card_footer {
    font-size: 25px;
    display: flex;
    justify-content: space-between;
  }
`

export const InformationGroup = styled.div`
  h1 {
    font-weight: bold;
    text-transform: uppercase;
  }

  a {
    font-weight: bold;
    color: white;
  }
`

export const GroupCardOferta = styled.div`
  background-color: #145388;
  height: 58%;
  color: white;
  padding: 0.2rem;
  p {
    padding: 0;
    margin-bottom: 0.5rem;
  }
`
