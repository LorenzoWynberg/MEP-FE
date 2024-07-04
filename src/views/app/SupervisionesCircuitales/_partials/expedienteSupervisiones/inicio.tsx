import React from 'react'
import styled from 'styled-components'
import AssignmentIcon from '@material-ui/icons/Assignment'
import BookmarkIcon from '@material-ui/icons/Bookmark'
import AccountCircleIcon from '@material-ui/icons/AccountCircle'
import GroupsIcon from '@mui/icons-material/Groups'
import HouseIcon from '@material-ui/icons/House'
import ContactMailIcon from '@mui/icons-material/ContactMail'
import colors from 'Assets/js/colors'

const Inicio = (props) => {
  return (
    <StyledCardContainer>
      {props.optionsTab
			  ?.slice(1, props.optionsTab?.length)
			  .map((item, i) => {
			    return (
			      item.icon && (
  <StyledCard
    key={i}
    onClick={() => {
								  props.setActiveTab(i + 1)
    }}
  >
    <CarIcon>
      {item.icon}
    </CarIcon>
    <p>{item.title}</p>
  </StyledCard>
			      )
			    )
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
    case 'Supervisor':
      return (
        <AccountCircleIcon
          style={{ fontSize: '4rem', color: 'white' }}
        />
      )
    case 'Contacto':
      return (
        <ContactMailIcon style={{ fontSize: '4rem', color: 'white' }} />
      )
    case 'Ubicación':
      return <BookmarkIcon style={{ fontSize: '4rem', color: 'white' }} />
    case 'Recurso humano':
      return <GroupsIcon style={{ fontSize: '4rem', color: 'white' }} />
    case 'Centros educativos':
      return <HouseIcon style={{ fontSize: '4rem', color: 'white' }} />
    default:
      return <GroupsIcon style={{ fontSize: '4rem', color: 'white' }} />
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
	background-color: #113d64;
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
