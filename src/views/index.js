import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
// Archivo principal de la app
class Main extends Component {
  render () {
    return <Redirect to='/app' />
  }
}
export default Main
