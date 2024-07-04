import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

import TopNav from '../containers/navs/Topnav'
import SidebarComunicados from '../containers/navs/SidebarComunicados'

class AppLayoutComunicados extends Component {
  render () {
    const {
      containerClassnames,
      onKeyPress,
      onClick,
      onChangeInput
    } = this.props

    const ItemsMenu = this.props.items.map((item) => {
      return item
    })

    const background = this.props.menuBackground

    return (
      <div id='app-container' className={containerClassnames}>
        <TopNav
          history={this.props.history}
          isComunicado
          onKeyPress={onKeyPress}
          onChangeInput={onChangeInput}
          textoFiltro={this.props.textoFiltro}
        />
        <SidebarComunicados items={ItemsMenu} onClick={onClick} background={background} />
        <main style={{ marginTop: 105 }}>
          <div className='container-fluid'>{this.props.children}</div>
        </main>
      </div>
    )
  }
}
const mapStateToProps = ({ menu, authUser }) => {
  const { periodosLectivos } = authUser
  const { containerClassnames } = menu
  return { containerClassnames, periodosLectivos }
}
const mapActionToProps = {}

export default withRouter(connect(mapStateToProps, mapActionToProps)(AppLayoutComunicados))
