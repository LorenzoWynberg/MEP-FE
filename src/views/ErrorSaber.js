import React, { Component } from 'react'
import { Row, Card, CardTitle, Button } from 'reactstrap'
import { NavLink } from 'react-router-dom'
import { Colxx } from '../components/common/CustomBootstrap'
import IntlMessages from '../helpers/IntlMessages'

class Error extends Component {
  componentDidMount () {
    document.body.classList.add('background')
  }

  componentWillUnmount () {
    document.body.classList.remove('background')
  }

  render () {
    if (this.props.location.state) {
      return (
        <>
          <div className='fixed-background-saber' />
          <main>
            <div className='container'>
              <Row className='h-100'>
                <Colxx xxs='12' md='10' className='mx-auto my-auto'>
                  <Card className='auth-card'>
                    <div className='position-relative image-side-error--2'>
                    </div>
                    <div className='form-side'>
                      <NavLink to='/' className='white'>
                        <span className='logo-single-2-saber' />
                      </NavLink>
                      <p className='display-1 font-weight-bold mb-5'>¡OOPS!</p>
                      <CardTitle className='mb-4'>
                        {/* <IntlMessages id='pages.error-400'/> */}
                        {this.props.message ? <div>{this.props.message}</div> : <IntlMessages id='pages.error-400' /> }
                      </CardTitle>
                      <Button
                        onClick={(e) => {
                          this.props.history.goBack()
                        }}
                        color='primary'
                        className='btn-shadow cursor-pointer'
                        size='lg'
                      >
                        <IntlMessages id='pages.go-back-home' />
                      </Button>
                    </div>
                  </Card>
                </Colxx>
              </Row>
            </div>
          </main>
        </>
      )
    } else {
      return (
        <>
          <div className='fixed-background-saber' />
          <main>
            <div className='container'>
              <Row className='h-100'>
                <Colxx xxs='12' md='10' className='mx-auto my-auto'>
                  <Card className='auth-card'>
                    <div className='position-relative image-side-error '>
                    </div>
                    <div className='form-side'>
                      <NavLink to='/' className='white'>
                        <span className='logo-single-2-saber' />
                      </NavLink>
                      <p className='display-1 font-weight-bold mb-5 font-size-4'>
                       { this.props.title ? <div>{this.props.title}</div>: <IntlMessages id='pages.error-400-title'/>}
                      </p>
                      <CardTitle className='mb-4'>
                        <IntlMessages id='pages.error-400'/>
                      </CardTitle>
                      <Button
                        onClick={(e) => {
                          this.props.history.goBack()
                        }}
                        color='primary'
                        className='btn-shadow cursor-pointer'
                        size='lg'
                      >
                        <IntlMessages id='pages.go-back-home' />
                      </Button>
                    </div>
                  </Card>
                </Colxx>
              </Row>
            </div>
          </main>
        </>
      )
    }
  }
}
export default Error