import React, { Component } from 'react'
import { WithWizard } from 'react-albus'
import { Button } from 'reactstrap'

export class BottomNavigation extends Component {
  render () {
    return (
      <WithWizard
        render={({ next, previous, step, steps, disableNext }) => (
          <div className={'wizard-buttons ' + this.props.className}>
            <Button
              color='primary'
              outline
              className='mr-1'
              onClick={() => {
                if (!steps.indexOf(step) <= 0) {
                  this.props.onClickPrev(previous, steps, step)
                } else {
                  window.location.replace('/#/director/matricular-estudiantes')
                }
              }}
            >
              {steps.indexOf(step) <= 0 ? 'Cancelar' : this.props.prevLabel}
            </Button>

            <Button
              disabled={this.props.disableNext}
              color='primary'
              className={
                steps.indexOf(step) >= steps.length - 1 || this.props.disableNext ? 'disabled' : ''
              }
              onClick={() => {
                if (!this.props.disableNext) {
                  this.props.onClickNext(next, steps, step)
                }
              }}
            >
              {this.props.nextLabel}
            </Button>
          </div>
        )}
      />
    )
  }
}
