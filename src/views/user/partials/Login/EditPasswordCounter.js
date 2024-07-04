import React from 'react'
import Circle from '../../../../components/svg/CircleLoader'
import Countdown from 'react-countdown'
import moment from 'moment'
import { Redirect } from 'react-router-dom'

class ProgressRing extends React.Component {
  render () {
    return (
      <Circle
        color={this.props.color}
        radius={40}
        stroke={4}
        progress={this.props.progress}
      />
    )
  }
}

const progress = (days, total) => {
  const countProgress = days * 100 / total
  return countProgress
}

const getDays = (firstDate, finalDate) => {
  const a = moment(finalDate)
  const b = moment(firstDate)
  const daysDiff = a.diff(b, 'days')
  return daysDiff
}

const getHours = (firstDate, finalDate) => {
  const a = moment(finalDate)
  const b = moment(firstDate)
  const daysDiff = a.diff(b, 'hours')
  return daysDiff
}

const getMinutes = (firstDate, finalDate) => {
  const a = moment(finalDate)
  const b = moment(firstDate)
  const daysDiff = a.diff(b, 'minutes')
  return daysDiff
}

const Periods = (props) => {
  if (!props.completed) {
    let color

    if (props.seconds <= 10 && props.minutes === 0) { color = 'red' } else { color = '#339AD3' }

    return (
      <div className='countdown-container'>
        <div className='circle-container--big'>
          <ProgressRing progress={progress(props.minutes, 2)} color={color} />
          <span>
            <h6>{props.minutes}</h6>
            Minutos
          </span>
        </div>
        <div className='circle-container--big'>
          <ProgressRing progress={progress(props.seconds, 60)} color={color} />
          <span>
            <h6>{props.seconds}</h6>
            Segundos
          </span>
        </div>
      </div>
    )
  } else {
    sessionStorage.clear()
    localStorage.clear()
    return (
      <Redirect to='/' />
    )
  }
}

const Counter = (props) => (
  <Countdown
    date={Date.now() + 150000}
    startDate={Date.now()}
    finishDate={Date.now() + 150000}
    toLogin={props.toLogin}
    renderer={Periods}
  />
)

export default Counter
