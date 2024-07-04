import React from 'react'
import styled from 'styled-components'
import { Link, useHistory, useLocation } from 'react-router-dom'
import IntlMessages from '../../../helpers/IntlMessages'
import { useSelector } from 'react-redux'
function useOutsideAlerter (ref:any, onClickOutside) {
  React.useEffect(() => {
    function onOutsideclick (event) {
      if (ref.current && !ref.current.contains(event.target)) {
        if (onClickOutside != null)onClickOutside()
      }
    }
    // Bind the event listener
    document.addEventListener('mousedown', onOutsideclick)
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener('mousedown', onOutsideclick)
    }
  }, [ref])
}

const SidebarBuilder = (props) => {
  const storage = localStorage.getItem('menu') ? JSON.parse(localStorage.getItem('menu')) : null

  const [state, setState] = React.useState(storage || { index: null, object: null })
  const active = useSelector((store:any) => store.menu.active)
  const wrapperRef = React.useRef(null)
  const history = useHistory()
  const location = useLocation()
  const onMenuSubItemClick = (e, subItem) => {
    e.preventDefault()
    const newState = { ...state, object: null }
    localStorage.setItem('menu', JSON.stringify(newState))
    setState(newState)
    const newLocation = { ...location, pathname: subItem.to }
    history.replace(newLocation)
    // window.history.replaceState(null,'','/#'+subItem.to)
    // location.pathname = subItem.to
  }
  const onMenuItemClick = (e, item, index) => {
    e.preventDefault()
    const newState = { index, object: item }
    localStorage.setItem('menu', JSON.stringify(newState))
    setState(newState)
    if (!item.subs || item.subs?.length == 0) {
      const newLocation = { ...location, pathname: item.to }
      history.replace(newLocation)
      // window.history.replace({pathname:'/#'+item.to})
      // location.pathname = item.to
    }
  }
  useOutsideAlerter(wrapperRef, () => setState({ index: null, object: null }))

  return (
    <div ref={wrapperRef}>
      <SidebarMenu id='sidebar-menu' close={active}>
        {/* <MenuIconClose to="#">xx</MenuIconClose> */}

        {props.items.map((item, index) => {
				  return (
  <MenuItems key={index}>
    {/* <MenuItemLinks to={item.to}> */}
    <MenuItem
      active={index == state.index}
      onClick={(e) => onMenuItemClick(e, item, index)}
    >
      <i
        style={{
									  fontSize: '32px',
									  lineHeight: '42px'
        }}
        className={item.icon}
      />
      <span style={{ textAlign: 'center' }}>
        <IntlMessages id={item.label} />
      </span>
    </MenuItem>
    {/* </MenuItemLinks> */}
  </MenuItems>
				  )
        })}
      </SidebarMenu>
      {state.object != null && state.object.subs?.length > 0 && (
        <SidebarSubMenu close>
          {state.object.subs.map((subItem, i) => {
					  return (
  <MenuSubItem
    key={i}
    onClick={(e) => onMenuSubItemClick(e, subItem)}
  >
    <i
      style={{ fontSize: '17px', marginRight: '5px' }}
      className={subItem.icon}
    />
    <IntlMessages id={subItem.label} />
  </MenuSubItem>
					  )
          })}
        </SidebarSubMenu>
      )}
    </div>
  )

  /* return (
		<Sidebar>
			{props.items.map((menu,index) => {
				return (
					<Menu key={index} menuIndex={index}>
						{menu.label}
						{menu?.subs?.map((subMenu,subIndex) => {
							return <SubMenu key={subIndex} >{subMenu.label}</SubMenu>
						})}
					</Menu>
				)
			})}
		</Sidebar>
	) */
}

const Navbar = styled.div`
	display: flex;
	justify-content: start;
	align-items: center;
	height: 3.5rem;
	background-color: #000080;
`

const MenuIconOpen = styled(Link)`
	display: flex;
	justify-content: start;
	font-size: 1.5rem;
	margin-left: 2rem;
	color: #ffffff;
`

const MenuIconClose = styled(Link)`
	display: flex;
	justify-content: end;
	font-size: 1.5rem;
	margin-top: 0.75rem;
	margin-right: 1rem;
	color: #ffffff;
`

const SidebarMenu = styled.div<{ close: boolean }>`
	padding-top: 150px;
	overflow-y: hidden;
	overflow-x: hidden;
	border-right: solid 1px lightgrey;
	color: ${(props) => props.theme.gray9};
    scrollbar-color: ${(props) => props.theme.gray7} ${(props) => props.theme.gray};
    scrollbar-width: thin;
    box-shadow: 5px 10px 10px lightgrey;

    /*Track*/
    ::-webkit-scrollbar {
        width: 3px;
    /* Handle */
    ::-webkit-scrollbar-thumb {
        background: ${(props) => props.theme.gray5}; 
        border-radius: 10px;
    }}
    /* Handle on hover */
    ::-webkit-scrollbar-thumb:hover {
      background: ${(props) => props.theme.gray7};; 
    }
	&:hover {
		overflow-y: auto;
	}

	width: 110px;
	height: 100vh;
	background-color: white;
	position: fixed;
	top: 0;
	left: ${({ close }) => (close ? '0' : '-100%')};
	transition: 0.6s;
`

const SidebarSubMenu = styled.div<{ close: boolean }>`
	padding-top: 150px;
	overflow-y: auto;
	overflow-x: hidden;
	color: ${(props) => props.theme.gray9};
    box-shadow: 5px 10px 10px lightgrey;

	z-index: 4;
	width: 230px;
	height: 100vh;
	background-color: white;
	position: fixed;
	top: 0;
	left: ${({ close }) => (close ? '110px' : '-100%')};
	transition: 0.6s;
`

const MenuItems = styled.li`
	list-style: none;
	display: flex;
	align-items: center;
	justify-content: center;
	width: 100%;
	padding: 1rem 0 1.25rem;
`

const MenuItemLinks = styled(Link)` 
	display: flex;
	align-items: center;
	padding: 0 2rem;
	font-size: 20px;
	text-decoration: none;
	color: #ffffff;

	&:hover {
		background-color: #ffffff;
		color: #000080;
		width: 100%;
		height: 45px;
		text-align: center;
		border-radius: 5px;
		margin: 0 2rem;
	}
`

const MenuItem = styled.div<{ active }>`
	display: flex;
	flex-direction: column;
	align-items: center;
	padding: 0 1rem;
	text-decoration: none;
	color: ${(props) => props.active == true ? props.theme.primary : 'inherit'};
    &:hover{
        color: ${props => props.theme.primary};
        cursor: pointer;
    }

    
`

const MenuSubItem = styled.div`
	display: flex;
	align-items: center;
	padding: 0 2rem;
	text-decoration: none;
	margin-bottom: 1.8rem;

	&:hover{
        color: ${props => props.theme.primary};
        cursor: pointer;
    }
    
`

export default SidebarBuilder
