import React, { Component } from 'react'
import { connect } from 'react-redux'
import ReactDOM from 'react-dom'
import { Nav } from 'reactstrap'
import { NavLink, withRouter } from 'react-router-dom'
import PerfectScrollbar from 'react-perfect-scrollbar'

/* import {
  setContainerClassnames,
  addContainerClassname,
  changeDefaultClassnames,
  changeSelectedMenuHasSubItems,
} from "../../redux/actions";
*/

class SidebarComunicados extends Component {
  constructor (props) {
    super(props)
    this.state = {
      selectedParentMenu: '',
      viewingParentMenu: '',
      collapsedMenus: []
    }
  }

  handleWindowResize = (event) => {
    if (event && !event.isTrusted) {
      return
    }
    const { containerClassnames } = this.props
    const nextClasses = this.getMenuClassesForResize(containerClassnames)
    /* this.props.setContainerClassnames(
      0,
      nextClasses.join(" "),
      this.props.selectedMenuHasSubItems
    ); */
  }

  handleDocumentClick = (e) => {
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

  getMenuClassesForResize = (classes) => {
    const { menuHiddenBreakpoint, subHiddenBreakpoint } = this.props
    let nextClasses = classes?.split(' ')?.filter((x) => x !== '')
    const windowWidth = window.innerWidth
    if (windowWidth < menuHiddenBreakpoint) {
      nextClasses.push('menu-mobile')
    } else if (windowWidth < subHiddenBreakpoint) {
      nextClasses = nextClasses.filter((x) => x !== 'menu-mobile')
      if (
        nextClasses.includes('menu-default') &&
        !nextClasses.includes('menu-sub-hidden')
      ) {
        nextClasses.push('menu-sub-hidden')
      }
    } else {
      nextClasses = nextClasses.filter((x) => x !== 'menu-mobile')
      if (
        nextClasses.includes('menu-default') &&
        nextClasses.includes('menu-sub-hidden')
      ) {
        nextClasses = nextClasses.filter((x) => x !== 'menu-sub-hidden')
      }
    }
    return nextClasses
  }

  getContainer = () => {
    return ReactDOM.findDOMNode(this)
  }

  toggle = () => {
    /* const hasSubItems = this.getIsHasSubItem();
    //this.props.changeSelectedMenuHasSubItems(hasSubItems);
    const { containerClassnames, menuClickCount } = this.props;
    const currentClasses = containerClassnames
      ? containerClassnames.split(" ").filter((x) => x !== "")
      : "";
    let clickIndex = -1;

    if (!hasSubItems) {
      if (
        currentClasses.includes("menu-default") &&
        (menuClickCount % 4 === 0 || menuClickCount % 4 === 3)
      ) {
        clickIndex = 1;
      } else if (
        currentClasses.includes("menu-sub-hidden") &&
        (menuClickCount === 2 || menuClickCount === 3)
      ) {
        clickIndex = 0;
      } else if (
        currentClasses.includes("menu-hidden") ||
        currentClasses.includes("menu-mobile")
      ) {
        clickIndex = 0;
      }
    } else {
      if (currentClasses.includes("menu-sub-hidden") && menuClickCount === 3) {
        clickIndex = 2;
      } else if (
        currentClasses.includes("menu-hidden") ||
        currentClasses.includes("menu-mobile")
      ) {
        clickIndex = 0;
      }
    }
    if (clickIndex >= 0) {

      this.props.setContainerClassnames(
        clickIndex,
        containerClassnames,
        hasSubItems
      );
    } */
  }

  handleProps = () => {
    this.addEvents()
  }

  addEvents = () => {
    ['click', 'touchstart', 'touchend'].forEach((event) =>
      document.addEventListener(event, this.handleDocumentClick, true)
    )
  }

  removeEvents = () => {
    ['click', 'touchstart', 'touchend'].forEach((event) =>
      document.removeEventListener(event, this.handleDocumentClick, true)
    )
  }

  setSelectedLiActive = (callback) => {
    const oldli = document.querySelector('.sub-menu  li.active')
    if (oldli != null) {
      oldli.classList.remove('active')
    }

    const oldliSub = document.querySelector('.third-level-menu  li.active')
    if (oldliSub != null) {
      oldliSub.classList.remove('active')
    }

    /* set selected parent menu */
    const selectedSublink = document.querySelector(
      '.third-level-menu  a.active'
    )
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
            selectedParentMenu: this.props.items.length > 0 ? this.props.items[0].id : ''
          },
          callback
        )
      }
    }
  }

  setHasSubItemStatus = () => {
    const hasSubmenu = this.getIsHasSubItem()
    // this.props.changeSelectedMenuHasSubItems(hasSubmenu);
    this.toggle()
  }

  getIsHasSubItem = () => {
    const { selectedParentMenu } = this.state
    const menuItem = this.props.items.find((x) => x.id === selectedParentMenu)
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

  takeElement = (e, menuItem) => {
    e.preventDefault()
    if (menuItem.id == 'container') {
      return this.props.createNestedContainer(menuItem)
    } else {
      this.props.handleCreateItem(menuItem)
    }
  }

  render () {
    const {
      selectedParentMenu,
      viewingParentMenu,
      collapsedMenus
    } = this.state
    
    return (
      <div className='sidebar sidebarLeft'>
        <div
          className='main-menu menu-comunicados'
          style={{
            background: this.props.background,
            width: 250,
            top: this.props.currentInstitution?.id > 0 ? '170px' : '150px',
          }}
        >
          <div className='scroll'>
            <PerfectScrollbar
              options={{ suppressScrollX: true, wheelPropagation: false }}
            >
              <Nav vertical className='list-unstyled creator-elements-list'>
                {this.props.items &&
                  this.props.items.map((item, index) => {
                    if (item.onClick === undefined) {
                      return (
                        <li
                          className={item.isSelected ? 'selected' : ''}
                          style={
                          item.submenu.length > 0
                            ? { }
                            : {
                                height: 35
                              }
                        }
                        >
                          <NavLink
                            style={
                            item.itemsLength > 0
                              ? { fontWeight: 700, alignItems: 'flex-start' }
                              : {
                                  fontWeight: 400,
                                  alignItems: 'flex-start',
                                  height: 35
                                }
                          }
                            to={item.to}
                            data-flag={item.id}
                          >
                            {item.submenu.length > 0 && item.isSelected
                              ? (
                                <i className='fas fa-arrow-down' />
                                )
                              : item.submenu.length > 0
                                ? (
                                  <i className='fas fa-arrow-right' />
                                  )
                                : (
                                    ''
                                  )}
                            <i className={item.icon} />
                            {item.label}

                            <span>
                              {item.itemsLength > 0 ? item.itemsLength : ''}
                            </span>
                            {index === 0 ? <div className='subline' /> : ''}
                          </NavLink>

                          <Nav
                            vertical
                            className='list-unstyled creator-elements-list'
                            style={{
                              display:
                                item.submenu.length > 0 && item.isSelected
                                  ? 'block'
                                  : 'none'
                            }}
                          >
                            {item.submenu.map((sub) => {
                              return (
                                <li
                                  className={sub.isSelected ? 'selected' : ''}
                                >
                                  <NavLink
                                    style={{ alignItems: 'flex-start' }}
                                    to={sub.to}
                                    data-flag={sub.id}
                                  >
                                    <i className={sub.icon} />
                                    {sub.label}
                                    <span>
                                      {sub.itemsLength > 0
                                      ? sub.itemsLength
                                      : ''}
                                    </span>
                                  </NavLink>
                                </li>
                              )
                            })}
                          </Nav>

                          {item.to.indexOf('etiqueta') !== -1
                            ? (
                              <i
                                id={item.to}
                                onClick={item.onDelete}
                                className='fas fa-trash icon-delete-tag'
                              />
                              )
                            : (
                                ''
                              )}
                        </li>
                      )
                    } else {
                      return (
                        <li className={item.isSelected ? 'selected' : ''}>

                          <a

                            style={item.itemsLength > 0 ? { fontWeight: 700, alignItems: 'flex-start' } : { fontWeight: 400, alignItems: 'flex-start' }}
                            onClick={item.onClick}
                            data-flag={item.id}
                          >
                            {item.submenu.length > 0 && item.isSelected ? <i className='fas fa-arrow-down' /> : item.submenu.length > 0 ? <i className='fas fa-arrow-right' /> : ''}
                            <i className={item.icon} />
                            {item.label}

                            <span>{item.itemsLength > 0 ? item.itemsLength : ''}</span>
                            {index === 0 ? <div className='subline' /> : ''}
                          </a>

                        </li>
                      )
                    }
                  })}
              </Nav>
            </PerfectScrollbar>
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = ({ menu, comunicados, authUser }) => {
  const {
    containerClassnames,
    subHiddenBreakpoint,
    menuHiddenBreakpoint,
    menuClickCount,
    selectedMenuHasSubItems,
  } = menu;
  return {
    containerClassnames,
    subHiddenBreakpoint,
    menuHiddenBreakpoint,
    menuClickCount,
    selectedMenuHasSubItems,
    currentInstitution: authUser.currentInstitution,
  };
}
export default withRouter(
  connect(mapStateToProps, {
    // setContainerClassnames,
    // addContainerClassname,
    // changeDefaultClassnames,
    // changeSelectedMenuHasSubItems,
  })(SidebarComunicados)
)
