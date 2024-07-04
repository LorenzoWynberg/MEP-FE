import React from 'react'
import styled from 'styled-components'
import AssignmentIcon from '@material-ui/icons/Assignment'
import BookmarkIcon from '@material-ui/icons/Bookmark'
import AccountCircleIcon from '@material-ui/icons/AccountCircle'
import TwoPeople from '../../../../../../assets/icons/TwoPeople'
import HouseIcon from '@material-ui/icons/House'
import SquareFoot from '../../../../../../assets/icons/SquareFoo'

const Inicio = (props) => {
  return (
    <StyledCardContainer>
      {props.optionsTab.map((item, i) => {
        if (i === 1) return
        return (item.icon && item.title) && <StyledCard
          key={i} onClick={() => {
            props.setActiveTab(i)
          }}
                                            >
          <CarIcon>
            {item.icon}
          </CarIcon>
          <p>
            {item.title}
          </p>
        </StyledCard>
      })}
    </StyledCardContainer>
  )
}

const GetIcon = ({ title }) => {
  switch (title) {
    case 'Información general':
      return (
        <AssignmentIcon style={{ fontSize: '4rem', color: 'white' }} />
      )
    case 'Ubicación':
      return <BookmarkIcon style={{ fontSize: '4rem', color: 'white' }} />
    case 'Director del centro educativo':
      return (
        <AccountCircleIcon
          style={{ fontSize: '4rem', color: 'white' }}
        />
      )
    case 'Oferta educativa':
      return (
        <i
          className='fas fa-tools'
          style={{ fontSize: '3rem', color: 'white' }}
        />
      )
    case 'Administración auxiliar':
      return <TwoPeople style={{ fontSize: 50 }} />
    case 'Sedes':
      return <HouseIcon style={{ fontSize: '4rem', color: 'white' }} />

    default:
      return <SquareFoot style={{ fontSize: 50 }} />
  }
}

const StyledCard = styled.div`
	height: 5rem;
	width: 90%;
	display: flex;
	background-color: white;
	border-radius: 15px;
	margin-bottom: 1rem;
	overflow: hidden;
	cursor: pointer;
	text-align: right;
	p {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: flex-start;
		height: 100%;
	}
`
const CarIcon = styled.span`
    width: 30%;
    margin-right: 1rem;
    background-color: var(--primary-color);
    display: flex;
    align-items: center;
    justify-content: center;
`

const StyledCardContainer = styled.div`
	display: grid;
	grid-template-columns: 25% 25% 25% 25%;

	@media (max-width: 1000px) {
		grid-template-columns: 50% 50%;
	}

	@media (max-width: 800px) {
		grid-template-columns: 100%;
	}
`

export default Inicio
