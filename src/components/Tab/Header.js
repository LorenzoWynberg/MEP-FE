import React from 'react'
import PropTypes from 'prop-types'

import { Nav, NavItem, NavLink } from 'reactstrap'

import classnames from 'classnames'
import { useTranslation } from 'react-i18next'
const HeaderTab = props => {
	const {
		activeTab,
		setActiveTab,
		options,
		disabled,
		setParentTab,
		style = {}
	} = props
	const { t } = useTranslation()
	const str = opt => {
		if (typeof opt === 'string') return opt
		if (opt.key) return t(opt.key, `${opt.key} not found`)
		if (opt.title) return opt.title
		// return 'invalid'
	}
	return (
		<Nav
			tabs
			className={`separator-tabs ml-0 mb-${props.marginTop}`}
			style={{ ...style }}
		>
			{options.map((opt, i) => {
				if (opt?.icon && opt?.showIcon === false) {
					return (
						<NavItem key={i}>
							<NavLink
								disabled={props?.disabled}
								className={classnames(
									{
										active: activeTab === i,
										'nav-link': true
									},
									'cursor-pointer'
								)}
								onClick={() => {
									setActiveTab(i)
								}}
								location={{}}
								to="#"
							>
								{opt.title}
							</NavLink>
						</NavItem>
					)
				} else if (opt?.icon) {
					return (
						<NavItem key={i}>
							<NavLink
								disabled={props.disabled}
								className={classnames(
									{
										active: activeTab === i,
										'nav-link': true
									},
									'cursor-pointer'
								)}
								onClick={() => {
									if (i === 0 && setParentTab) {
										setParentTab(i)
									} else {
										setActiveTab(i)
									}
								}}
								location={{}}
								to="#"
							>
								{opt?.icon}
							</NavLink>
						</NavItem>
					)
				} else if (opt) {
					return (
						<NavItem key={i}>
							<NavLink
								disabled={props?.disabled}
								className={classnames(
									{
										active: activeTab === i,
										'nav-link': true
									},
									'cursor-pointer'
								)}
								onClick={() => {
									setActiveTab(i)
								}}
								location={{}}
								to="#"
							>
								{str(opt)}
							</NavLink>
						</NavItem>
					)
				}
			})}
		</Nav>
	)
}
HeaderTab.propTypes = {
	options: PropTypes.array,
	setActiveTab: PropTypes.func,
	activeTab: PropTypes.number,
	marginTop: PropTypes.number
}
HeaderTab.defaultProps = {
	activeTab: 0,
	options: {},
	setActiveTab: () => {},
	marginTop: 1
}
export default HeaderTab
