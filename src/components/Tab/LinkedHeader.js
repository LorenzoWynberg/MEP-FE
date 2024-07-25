import React from 'react'
import PropTypes from 'prop-types'
import { Nav, NavItem, NavLink } from 'reactstrap'
import classnames from 'classnames'
import { useTranslation } from 'react-i18next'
import { useHistory } from 'react-router-dom' // Import useHistory for navigation

const HeaderTab = props => {
	const { activeTab, setActiveTab, options, disabled, setParentTab, style = {} } = props
	const { t } = useTranslation()
	const history = useHistory() // Create history object for navigation

	const handleTabClick = (index, path) => {
		if (index === 0 && setParentTab) {
			setParentTab(index)
		} else {
			setActiveTab(index)
			if (path) {
				history.push(`/director/expediente-centro/servicio-comunal${path}`) // Navigate to the path specified in the tab object
			}
		}
	}

	return (
		<Nav tabs className={`separator-tabs ml-0 mb-${props.marginTop}`} style={{ ...style }}>
			{options.map((opt, i) => (
				<NavItem key={i}>
					<NavLink
						disabled={disabled}
						className={classnames({ active: activeTab === i, 'nav-link': true }, 'cursor-pointer')}
						onClick={() => handleTabClick(i, opt.path)}
					>
						{opt.title}
					</NavLink>
				</NavItem>
			))}
		</Nav>
	)
}

HeaderTab.propTypes = {
	options: PropTypes.arrayOf(
		PropTypes.shape({
			title: PropTypes.string.isRequired,
			path: PropTypes.string
		})
	),
	setActiveTab: PropTypes.func,
	activeTab: PropTypes.number,
	marginTop: PropTypes.number
}

HeaderTab.defaultProps = {
	activeTab: 0,
	options: [],
	setActiveTab: () => {},
	marginTop: 1
}

export default HeaderTab
