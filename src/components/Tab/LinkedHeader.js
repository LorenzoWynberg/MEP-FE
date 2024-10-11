import React from 'react'
import PropTypes from 'prop-types'
import { Nav, NavItem, NavLink } from 'reactstrap'
import classnames from 'classnames'
import { useTranslation } from 'react-i18next'
import { useHistory } from 'react-router-dom'

const HeaderTab = props => {
	const { activeTab, options, disabled, setParentTab, style = {} } = props
	const { t } = useTranslation()
	const history = useHistory()

	const handleTabClick = (index, path) => {
		if (index === 0 && setParentTab) {
			setParentTab(index)
		} else {
			if (path) {
				history.push(`${path}`)
			}
		}
	}

	return (
		<Nav
			tabs
			className={`separator-tabs ml-0 mb-${props.marginTop}`}
			style={{ ...style }}
		>
			{options.map((opt, i) => (
				<NavItem key={i}>
					<NavLink
						disabled={disabled}
						className={classnames(
							{ active: activeTab === i, 'nav-link': true },
							'cursor-pointer'
						)}
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
	activeTab: PropTypes.number,
	marginTop: PropTypes.number
}

HeaderTab.defaultProps = {
	activeTab: 0,
	options: [],
	marginTop: 1
}

export default HeaderTab
