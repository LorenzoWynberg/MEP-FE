import React, { Component } from 'react'
import { connect } from 'react-redux'
import ReactDOM from 'react-dom'
import { Nav, NavItem } from 'reactstrap'
import { NavLink, withRouter } from 'react-router-dom'
import PerfectScrollbar from 'react-perfect-scrollbar'

import IntlMessages from '../../helpers/IntlMessages'
import { TooltipSimple } from 'Utils/tooltip.tsx'
import TextFieldsIcon from '@material-ui/icons/TextFields'
import TextFormatIcon from '@material-ui/icons/TextFormat'
import ArrowDropDownCircleIcon from '@material-ui/icons/ArrowDropDownCircle'
import LibraryAddCheckIcon from '@material-ui/icons/LibraryAddCheck'
import RadioButtonCheckedIcon from '@material-ui/icons/RadioButtonChecked'
import ViewAgendaIcon from '@material-ui/icons/ViewAgenda'
import LocationOnIcon from '@material-ui/icons/LocationOn'
import MapIcon from '@material-ui/icons/Map'
import ImageIcon from '@material-ui/icons/Image'
import BackupIcon from '@material-ui/icons/Backup'
import CalendarTodayIcon from '@material-ui/icons/CalendarToday'
import ToggleOnIcon from '@material-ui/icons/ToggleOn'
import PersonPinCircleIcon from '@material-ui/icons/PersonPinCircle'
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank'
import TableChartIcon from '@material-ui/icons/TableChart'
import RecentActorsIcon from '@material-ui/icons/RecentActors'
import styled from 'styled-components'
import {
  setContainerClassnames,
  addContainerClassname,
  changeDefaultClassnames,
  changeSelectedMenuHasSubItems
} from '../../redux/actions'

const GetIcon = (props) => {
  return (
    <>
      {
        {
          container: <CheckBoxOutlineBlankIcon fontSize='large' style={{ color: 'white' }} />,
          text: <TextFieldsIcon fontSize='large' style={{ color: 'white' }} />,
          textArea: (
            <TextFormatIcon fontSize='large' style={{ color: 'white' }} />
          ),
          unic: (
            <ArrowDropDownCircleIcon
              fontSize='large'
              style={{ color: 'white' }}
            />
          ),
          checklist: (
            <LibraryAddCheckIcon fontSize='large' style={{ color: 'white' }} />
          ),
          radio: (
            <RadioButtonCheckedIcon
              fontSize='large'
              style={{ color: 'white' }}
            />
          ),
          multiple: (
            <ViewAgendaIcon fontSize='large' style={{ color: 'white' }} />
          ),
          location: (
            <LocationOnIcon fontSize='large' style={{ color: 'white' }} />
          ),
          coordinates: <MapIcon fontSize='large' style={{ color: 'white' }} />,
          locationExact: <PersonPinCircleIcon fontSize='large' style={{ color: 'white' }} />,
          image: <ImageIcon fontSize='large' style={{ color: 'white' }} />,
          uploadFile: (
            <BackupIcon fontSize='large' style={{ color: 'white' }} />
          ),
          date: (
            <CalendarTodayIcon fontSize='large' style={{ color: 'white' }} />
          ),
          switch: <ToggleOnIcon fontSize='large' style={{ color: 'white' }} />,
          crudTable: <TableChartIcon fontSize='large' style={{ color: 'white' }} />,
          reactTable: <TableChartIcon fontSize='large' style={{ color: 'white' }} />,
          redes: <RecentActorsIcon
            fontSize='large' style={{ color: 'white' }}
                 />
        }[props.id]
      }
    </>
  )
}

class SidebarCreador extends Component {
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
    this.props.setContainerClassnames(
      0,
      nextClasses.join(' '),
      this.props.selectedMenuHasSubItems
    )
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
    let nextClasses = classes.split(' ').filter((x) => x !== '')
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
    const hasSubItems = this.getIsHasSubItem()
    this.props.changeSelectedMenuHasSubItems(hasSubItems)
    const { containerClassnames, menuClickCount } = this.props
    const currentClasses = containerClassnames
      ? containerClassnames.split(' ').filter((x) => x !== '')
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
        <div className='main-menu'>
          <div className='scroll'>
            <PerfectScrollbar
              options={{ suppressScrollX: true, wheelPropagation: false }}
            >
              <Nav vertical className='list-unstyled creator-elements-list'>
                {this.props.items &&
                  this.props.items.map((item) => {
                    return (
                      <NavItem key={item.id} className='creator-item'>
                        <NavLink
                          to='#'
                          onClick={(e) => this.takeElement(e, item)}
                          data-flag={item.id}
                        >
                          <TooltipSimple
                            title={<IntlMessages id={item.label} />}
                            element={<GetIcon id={item.id} />}
                          />
                        </NavLink>
                      </NavItem>
                    )
                  })}
              </Nav>
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

export default withRouter(
  connect(mapStateToProps, {
    setContainerClassnames,
    addContainerClassname,
    changeDefaultClassnames,
    changeSelectedMenuHasSubItems
  })(SidebarCreador)
)
