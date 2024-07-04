import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import ReactDOM from 'react-dom'
import { Nav, NavItem, Collapse } from 'reactstrap'
import { NavLink, withRouter } from 'react-router-dom'
import classnames from 'classnames'
import PerfectScrollbar from 'react-perfect-scrollbar'

// import IntlMessages from '../../helpers/IntlMessages';

import {
  setContainerClassnames,
  addContainerClassname,
  changeDefaultClassnames,
  changeSelectedMenuHasSubItems
} from '../../redux/actions'
import { verificarAcceso } from '../../Hoc/verificarAcceso'
import { withTranslation } from 'react-i18next'

class Sidebar extends Component {
  constructor (props) {
    super(props)
    this.state = {
      selectedParentMenu: '',
      viewingParentMenu: '',
      collapsedMenus: []
    }
  }

  handleWindowResize = event => {
    if (event && !event.isTrusted) {
      return
    }
    const { containerClassnames } = this.props
    const nextClasses = this.getMenuClassesForResize(containerClassnames)
    this.props.setContainerClassnames(
      0,
      nextClasses.join(' '),
      this.props.selectedMenuHasSubItems
    )
  }

  handleDocumentClick = e => {
    const container = this.getContainer()
    let isMenuClick = false
    if (
      e.target &&
      e.target.classList &&
      (e.target.classList.contains('menu-button') ||
        e.target.classList.contains('menu-button-mobile'))
    ) {
      isMenuClick = true
    } else if (
      e.target.parentElement &&
      e.target.parentElement.classList &&
      (e.target.parentElement.classList.contains('menu-button') ||
        e.target.parentElement.classList.contains('menu-button-mobile'))
    ) {
      isMenuClick = true
    } else if (
      e.target.parentElement &&
      e.target.parentElement.parentElement &&
      e.target.parentElement.parentElement.classList &&
      (e.target.parentElement.parentElement.classList.contains('menu-button') ||
        e.target.parentElement.parentElement.classList.contains(
          'menu-button-mobile'
        ))
    ) {
      isMenuClick = true
    }
    if (container.contains(e.target) || container === e.target || isMenuClick) {
      return
    }
    this.setState({
      viewingParentMenu: ''
    })
    this.toggle()
  }

  getMenuClassesForResize = classes => {
    const { menuHiddenBreakpoint, subHiddenBreakpoint } = this.props
    let nextClasses = classes.split(' ').filter(x => x !== '')
    const windowWidth = window.innerWidth
    if (windowWidth < menuHiddenBreakpoint) {
      nextClasses.push('menu-mobile')
    } else if (windowWidth < subHiddenBreakpoint) {
      nextClasses = nextClasses.filter(x => x !== 'menu-mobile')
      if (
        nextClasses.includes('menu-default') &&
        !nextClasses.includes('menu-sub-hidden')
      ) {
        nextClasses.push('menu-sub-hidden')
      }
    } else {
      nextClasses = nextClasses.filter(x => x !== 'menu-mobile')
      if (
        nextClasses.includes('menu-default') &&
        nextClasses.includes('menu-sub-hidden')
      ) {
        nextClasses = nextClasses.filter(x => x !== 'menu-sub-hidden')
      }
    }
    return nextClasses
  }

  getContainer = () => {
    return ReactDOM.findDOMNode(this)
  }

  toggle = () => {
    const hasSubItems = this.getIsHasSubItem()
    this.props.changeSelectedMenuHasSubItems(hasSubItems)
    const { containerClassnames, menuClickCount } = this.props
    const currentClasses = containerClassnames
      ? containerClassnames.split(' ').filter(x => x !== '')
      : ''
    let clickIndex = -1

    if (!hasSubItems) {
      if (
        currentClasses.includes('menu-default') &&
        (menuClickCount % 4 === 0 || menuClickCount % 4 === 3)
      ) {
        clickIndex = 1
      } else if (
        currentClasses.includes('menu-sub-hidden') &&
        (menuClickCount === 2 || menuClickCount === 3)
      ) {
        clickIndex = 0
      } else if (
        currentClasses.includes('menu-hidden') ||
        currentClasses.includes('menu-mobile')
      ) {
        clickIndex = 0
      }
    } else {
      if (currentClasses.includes('menu-sub-hidden') && menuClickCount === 3) {
        clickIndex = 2
      } else if (
        currentClasses.includes('menu-hidden') ||
        currentClasses.includes('menu-mobile')
      ) {
        clickIndex = 0
      }
    }
    if (clickIndex >= 0) {
      this.props.setContainerClassnames(
        clickIndex,
        containerClassnames,
        hasSubItems
      )
    }
  }

  handleProps = () => {
    this.addEvents()
  }

  addEvents = () => {
    ['click', 'touchstart', 'touchend'].forEach(event =>
      document.addEventListener(event, this.handleDocumentClick, true)
    )
  }

  removeEvents = () => {
    ['click', 'touchstart', 'touchend'].forEach(event =>
      document.removeEventListener(event, this.handleDocumentClick, true)
    )
  }

  setSelectedLiActive = callback => {
    const oldli = document.querySelector('.sub-menu  li.active')
    if (oldli != null) {
      oldli.classList.remove('active')
    }

    const oldliSub = document.querySelector('.third-level-menu  li.active')
    if (oldliSub != null) {
      oldliSub.classList.remove('active')
    }

    /* set selected parent menu */
    const selectedSublink = document.querySelector('.third-level-menu  a.active')
    if (selectedSublink != null) {
      selectedSublink.parentElement.classList.add('active')
    }

    const selectedlink = document.querySelector('.sub-menu  a.active')
    if (selectedlink != null) {
      selectedlink.parentElement.classList.add('active')
      this.setState(
        {
          selectedParentMenu: selectedlink.parentElement.parentElement.getAttribute(
            'data-parent'
          )
        },
        callback
      )
    } else {
      const selectedParentNoSubItem = document.querySelector(
        '.main-menu  li a.active'
      )
      if (selectedParentNoSubItem != null) {
        this.setState(
          {
            selectedParentMenu: selectedParentNoSubItem.getAttribute(
              'data-flag'
            )
          },
          callback
        )
      } else if (this.state.selectedParentMenu === '') {
        this.setState(
          {
            selectedParentMenu: this.props.items[0].id
          },
          callback
        )
      }
    }
  }

  setHasSubItemStatus = () => {
    const hasSubmenu = this.getIsHasSubItem()
    this.props.changeSelectedMenuHasSubItems(hasSubmenu)
    this.toggle()
  }

  getIsHasSubItem = () => {
    const { selectedParentMenu } = this.state
    const menuItem = this.props.items.find(x => x.id === selectedParentMenu)
    if (menuItem) { return !!(menuItem && menuItem.subs && menuItem.subs.length > 0) } else return false
  }

  componentDidUpdate (prevProps) {
    if (this.props.location.pathname !== prevProps.location.pathname) {
      this.setSelectedLiActive(this.setHasSubItemStatus)

      window.scrollTo(0, 0)
    }
    this.handleProps()
  }

  componentDidMount () {
    window.addEventListener('resize', this.handleWindowResize)
    this.handleWindowResize()
    this.handleProps()
    this.setSelectedLiActive(this.setHasSubItemStatus)
  }

  componentWillUnmount () {
    this.removeEvents()
    window.removeEventListener('resize', this.handleWindowResize)
  }

  openSubMenu = (e, menuItem) => {
    const selectedParent = menuItem.id
    const hasSubMenu = menuItem.subs && menuItem.subs.length > 0
    this.props.changeSelectedMenuHasSubItems(hasSubMenu)
    if (!hasSubMenu) {
      this.setState({
        viewingParentMenu: selectedParent,
        selectedParentMenu: selectedParent
      })
      this.toggle()
    } else {
      e.preventDefault()

      const { containerClassnames, menuClickCount } = this.props
      const currentClasses = containerClassnames
        ? containerClassnames.split(' ').filter(x => x !== '')
        : ''

      if (!currentClasses.includes('menu-mobile')) {
        if (
          currentClasses.includes('menu-sub-hidden') &&
          (menuClickCount === 2 || menuClickCount === 0)
        ) {
          this.props.setContainerClassnames(3, containerClassnames, hasSubMenu)
        } else if (
          currentClasses.includes('menu-hidden') &&
          (menuClickCount === 1 || menuClickCount === 3)
        ) {
          this.props.setContainerClassnames(2, containerClassnames, hasSubMenu)
        } else if (
          currentClasses.includes('menu-default') &&
          !currentClasses.includes('menu-sub-hidden') &&
          (menuClickCount === 1 || menuClickCount === 3)
        ) {
          this.props.setContainerClassnames(0, containerClassnames, hasSubMenu)
        }
      } else {
        this.props.addContainerClassname(
          'sub-show-temporary',
          containerClassnames
        )
      }
      this.setState({
        viewingParentMenu: selectedParent
      })
    }
  }

  toggleMenuCollapse = (e, menuKey) => {
    e.preventDefault()

    const collapsedMenus = this.state.collapsedMenus
    if (collapsedMenus.indexOf(menuKey) > -1) {
      this.setState({
        collapsedMenus: collapsedMenus.filter(x => x !== menuKey)
      })
    } else {
      collapsedMenus.push(menuKey)
      this.setState({
        collapsedMenus
      })
    }
    return false
  }

  render () {
    const {
      selectedParentMenu,
      viewingParentMenu,
      collapsedMenus
    } = this.state
    return (
      <div className='sidebar'>
        <div className='main-menu'>
          <div className='scroll'>

            <PerfectScrollbar
              options={{ suppressScrollX: true, wheelPropagation: false }}
            >
              <Nav vertical className='list-unstyled'>
                {this.props.items &&
                  this.props.items.map(item => {
                    let hasAccessOverAll = false
                    if (item.section) {
                      hasAccessOverAll = this.props.verificarAcceso(item.section, 'leer')
                    }
                    return !hasAccessOverAll ? null : (
                      <NavItem
                        key={item.id}
                        className={classnames({
                          active:
                            (selectedParentMenu === item.id &&
                              viewingParentMenu === '') ||
                            viewingParentMenu === item.id
                        })}
                      >
                        {item.newWindow ? (
                          <a
                            href={item.to}
                            rel='noopener noreferrer'
                            target='_blank'
                          >
                            {typeof item.icon !== 'function' ? <i className={item.icon} /> : <item.icon />}
                            {/* <IntlMessages id={item.label} /> */}
                            <div align='center'>{this.props.t(item.label, `${item.label} not found`)}</div>
                          </a>
                        ) : (
                          <NavLink
                            to={item.to||"#"}
                            onClick={e => this.openSubMenu(e, item)}
                            data-flag={item.id}
                          >
                            {typeof item.icon !== 'function' ? <i className={item.icon} /> : <item.icon />}
                            {/* <IntlMessages id={item.label} /> */}
                            <div align='center'>{this.props.t(item.label, `${item.label}`)}</div>
                          </NavLink>
                        )}
                      </NavItem>
                    )
                  })}
              </Nav>
            </PerfectScrollbar>
          </div>
        </div>

        <div className='sub-menu'>
          <div className='scroll'>
            <PerfectScrollbar
              options={{ suppressScrollX: true, wheelPropagation: false }}
            >
              {this.props.items &&
                this.props.items.map(item => {
                  let hasAccessOverAll = true
                  if (item.section) {
                    hasAccessOverAll = this.props.verificarAcceso(item.section, 'leer')
                  }
                  return !hasAccessOverAll ? null : (
                    <Nav
                      key={item.id}
                      className={classnames({
                        'd-block':
                          (this.state.selectedParentMenu === item.id &&
                            this.state.viewingParentMenu === '') ||
                          this.state.viewingParentMenu === item.id
                      })}
                      data-parent={item.id}
                    >
                      {item.subs &&
                        item.subs.map((sub, index) => {
                          const hasAccess = this.props.verificarAcceso(sub.section, 'leer')
                          if (!hasAccess) {
                            return null
                          }
                          return (
                            <NavItem
                              key={`${item.id}_${index}`}
                              className={`${
                                sub.subs && sub.subs.length > 0
                                  ? 'has-sub-item'
                                  : ''
                              }`}
                            >
                              {sub.newWindow ? (
                                <a
                                  href={sub.to}
                                  rel='noopener noreferrer'
                                  target='_blank'
                                >
                                  {typeof item.icon !== 'function' ? <i className={sub.icon} /> : <item.icon />}
                                  {/* <IntlMessages id={sub.label} /> */}
                                  {this.props.t(sub.label, `${sub.label} not found`)}
                                </a>
                              ) : sub.subs && sub.subs.length > 0 ? (
                                <>
                                  <NavLink
                                    className={`rotate-arrow-icon opacity-50 ${
                                      collapsedMenus.indexOf(
                                        `${item.id}_${index}`
                                      ) === -1
                                        ? ''
                                        : 'collapsed'
                                    }`}
                                    to={sub.to||"#"}
                                    id={`${item.id}_${index}`}
                                    onClick={e =>
                                      this.toggleMenuCollapse(
                                        e,
                                        `${item.id}_${index}`
                                      )}
                                  >
                                    <i className='simple-icon-arrow-down' />
                                    {/* <IntlMessages id={sub.label} /> */}
                                    {this.props.t(sub.label, `${sub.label} not found`)}
                                  </NavLink>

                                  <Collapse
                                    isOpen={
                                      collapsedMenus.indexOf(
                                        `${item.id}_${index}`
                                      ) === -1
                                    }
                                  >
                                    <Nav className='third-level-menu'>
                                      {sub.subs.map((thirdSub, thirdIndex) => {
                                        return (
                                          <NavItem
                                            key={`${
                                              item.id
                                            }_${index}_${thirdIndex}`}
                                          >
                                            {thirdSub.newWindow ? (
                                              <a
                                                href={thirdSub.to}
                                                rel='noopener noreferrer'
                                                target='_blank'
                                              >
                                                {typeof item.icon !== 'function' ? <i className={thirdSub.icon} /> : <thirdSub.icon />}
                                                {/* <IntlMessages
                                                  id={thirdSub.label}
                                                /> */}
                                                {this.props.t(thirdSub.label, `${thirdSub.label} not found`)}
                                              </a>
                                            ) : (
                                              <NavLink to={thirdSub.to||"#"}>
                                                {typeof item.icon !== 'function' ? <i className={thirdSub.icon} /> : <thirdSub.icon />}
                                                {/* <IntlMessages
                                                  id={thirdSub.label}
                                                /> */}
                                                {this.props.t(thirdSub.label, `${thirdSub.label} not found`)}
                                              </NavLink>
                                            )}
                                          </NavItem>
                                        )
                                      })}
                                    </Nav>
                                  </Collapse>
                                </>
                              ) : (
                                <NavLink to={sub.to||"#"}>
                                  {typeof item.icon !== 'function' ? <i className={sub.icon} /> : <sub.icon />}
                                  {/* <IntlMessages id={sub.label} /> */}
                                  {this.props.t(sub.label, `${sub.label} not found7`)}
                                </NavLink>
                              )}
                            </NavItem>
                          )
                        })}
                    </Nav>
                  )
                })}

            </PerfectScrollbar>

          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = ({ menu }) => {
  const {
    containerClassnames,
    subHiddenBreakpoint,
    menuHiddenBreakpoint,
    menuClickCount,
    selectedMenuHasSubItems
  } = menu
  return {
    containerClassnames,
    subHiddenBreakpoint,
    menuHiddenBreakpoint,
    menuClickCount,
    selectedMenuHasSubItems
  }
}
export default withTranslation()(withRouter(
  connect(
    mapStateToProps,
    {
      setContainerClassnames,
      addContainerClassname,
      changeDefaultClassnames,
      changeSelectedMenuHasSubItems
    }
  )(verificarAcceso(Sidebar))
))
