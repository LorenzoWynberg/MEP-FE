import React from 'react'
import Countdown from 'react-countdown'
import moment from 'moment'
import Circle from '../../components/svg/CircleLoader'
import IntlMessages from '../../helpers/IntlMessages'

const date = {
  start: {
    day: 1,
    month: 1,
    year: 2020
  },
  finish: {
    day: 10,
    month: 3 - 1,
    year: 2020
  }
}

class ProgressRing extends React.Component {
  render () {
    return (
      <Circle
        color={this.props.color}
        radius={60}
        stroke={6}
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

    if (props.days <= 1) { color = 'red' } else { color = '#339AD3' }

    return (
      <div className='countdown-container'>
        <div className='circle-container'>
          <ProgressRing
            progress={progress(props.days, getDays([props.props.startDate.year, props.props.startDate.month - 1, props.props.startDate.day], [props.props.finishDate.year, props.props.finishDate.month, props.props.finishDate.day]))}
            color={color}
          />
          <span className='counter-label'>
            <h6>{props.days}</h6>
            <IntlMessages id='countdown.days' />
          </span>
        </div>
        <div className='circle-container'>
          <ProgressRing progress={progress(props.hours, 60)} color={color} />
          <span className='counter-label'>
            <h6>{props.hours}</h6>
            <IntlMessages id='countdown.hours' />
          </span>
        </div>
        <div className='circle-container'>
          <ProgressRing progress={progress(props.minutes, 60)} color={color} />
          <span className='counter-label'>
            <h6>{props.minutes}</h6>
            <IntlMessages id='countdown.minutes' />
          </span>
        </div>
        <div className='circle-container'>
          <ProgressRing progress={progress(props.seconds, 60)} color={color} />
          <span className='counter-label'>
            <h6>{props.seconds}</h6>
            <IntlMessages id='countdown.seconds' />
          </span>
        </div>
      </div>
    )
  } else {
    return (
      <h1>
        The app is ready to use
      </h1>
    )
  }
}

const Counter = (props) => {
  return (
    <div className='countdown_view'>
      <Countdown
        date={new Date(date.finish.year, date.finish.month, date.finish.day)}
        startDate={date.start}
        finishDate={date.finish}
        renderer={Periods}
      />
    </div>
  )
}

export default Counter
