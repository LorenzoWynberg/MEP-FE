import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

import TopNav from '../containers/navs/Topnav'

class AppLayoutGestorFormulario extends Component {
  render () {
    const {
      containerClassnames,
      creador,
      handleCreateItem,
      periodosLectivos
    } = this.props

    const ItemsMenu = this.props.items.map((item) => {
      if (item.id == 'ofertas' && (periodosLectivos || []).length == 0) {
        if (item.subs) {
          const traslado = item.subs.find(
            (sub) => sub.label == 'menu.traslados'
          )

          if (traslado) {
            item.subs.splice(item.subs.indexOf(traslado), 1)
          }
        }
      }

      return item
    })
    return (
      <div id='app-container' className={containerClassnames}>
        <TopNav history={this.props.history} />
        <main>
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

export default withRouter(connect(mapStateToProps, mapActionToProps)(AppLayoutGestorFormulario))
