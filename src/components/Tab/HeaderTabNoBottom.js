import React from 'react'
import PropTypes from 'prop-types'

import {
  Nav,
  NavItem,
  NavLink
} from 'reactstrap'

import classnames from 'classnames'

const HeaderTabNoBottom = (props) => {
  const { activeTab, setActiveTab, options, disabled, setParentTab } = props
  return (
    <Nav tabs style={{ borderBottom: 'unset' }} className={`separator-tabs ml-0 mb-${props.marginTop}`}>
      {
                options.map((opt, i) => {
                  if (opt.icon) {
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
                          to='#'
                        >
                          {opt.icon}
                        </NavLink>
                      </NavItem>
                    )
                  }
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
                          setActiveTab(i)
                        }}
                        location={{}}
                        to='#'
                      >
                        {opt}
                      </NavLink>
                    </NavItem>
                  )
                })
            }
    </Nav>
  )
}
HeaderTabNoBottom.propTypes = {
  options: PropTypes.array,
  setActiveTab: PropTypes.func,
  activeTab: PropTypes.number,
  marginTop: PropTypes.number
}
HeaderTabNoBottom.defaultProps = {
  activeTab: 0,
  options: {},
  setActiveTab: () => { },
  marginTop: 1
}
export default HeaderTabNoBottom
