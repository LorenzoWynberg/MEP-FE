import React from 'react'
import centroBreadcrumb from 'Constants/centroBreadcrumb'
import AssignmentIcon from '@material-ui/icons/Assignment'
import NavigationCard from '../ExpedienteEstudiante/_partials/NavigationCard'
import { Colxx } from 'Components/common/CustomBootstrap'
import { Container, Row } from 'reactstrap'
// import { injectIntl } from 'react-intl';
import StarIcon from '@material-ui/icons/Star'
import Bookmark from '../../../../assets/icons/Bookmark'
import SquareFoot from '../../../../assets/icons/SquareFoo'
import TwoPeople from '../../../../assets/icons/TwoPeople'
import Horarios from '../../../../assets/icons/Horarios'
import Solidarity from '../../../../assets/icons/Solidarity'
import Normativa from '../../../../assets/icons/Normativa'
import HouseIcon from '@material-ui/icons/House'
import GroupWorkIcon from '@material-ui/icons/GroupWork'
import styled from 'styled-components'
import { useTranslation } from 'react-i18next'

// import { NavigationCard } from 'Components/CommonComponents'

const Inicio = props => {
	// const { messages } = props.intl;
	const { t } = useTranslation()
	const getIcon = idx => {
		switch (idx) {
			case 1:
				return <AssignmentIcon style={{ fontSize: 50 }} />
			case 2:
				return <SquareFoot style={{ fontSize: 50 }} />
			case 3:
				return <TwoPeople style={{ fontSize: 50 }} />
			case 4:
				return <Horarios />
			case 5:
				return <HouseIcon style={{ fontSize: 50 }} />
			case 6:
				return <StarIcon style={{ fontSize: 50 }} />
			case 7:
				return <Bookmark style={{ fontSize: 50 }} />
			case 8:
				return <GroupWorkIcon style={{ fontSize: 50 }} />
			case 9:
				return <Normativa />
			case 10:
				return <Solidarity style={{ fontSize: 50 }} />
		}
	}
	return (
		<Container>
			<Row>
				<Colxx xxs='12' className='px-5'>
					<Row>
						{centroBreadcrumb.map((r, i) => {
							if (r.active) return

							return (
								<NavigationCard icon='' title={t(r.label, `${r.label} not found`)} href={r.to} key={i}>
									{getIcon(i)}
								</NavigationCard>
							)
						})}
					</Row>
				</Colxx>
			</Row>
		</Container>
	)
	// return <div></div>
}

/* const Container = styled.div`

` */

export default Inicio
