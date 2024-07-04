import * as React from 'react'

import { cssValue } from '../barLoader/helpers/unitConverter'
import { createAnimation } from '../barLoader/helpers/animation'
import { LoaderHeightWidthProps } from '../barLoader/helpers/props'
import { calculateRgba } from '../barLoader/helpers/colors'

const long = createAnimation(
  'BarLoader',
  '0% {left: -35%;right: 100%} 60% {left: 100%;right: -90%} 100% {left: 100%;right: -90%}',
  'long'
)

const short = createAnimation(
  'BarLoader',
  '0% {left: -200%;right: 100%} 60% {left: 107%;right: -8%} 100% {left: 107%;right: -8%}',
  'short'
)

function BarLoader ({
  loading = true,
  color = '#145388',
  speedMultiplier = 1,
  css = {},
  height = 4,
  width = 250,
  ...additionalprops
}: LoaderHeightWidthProps): JSX.Element | null {
  const wrapper: React.CSSProperties = {
    display: 'inherit',
    position: 'relative',
    width: cssValue(width),
    height: cssValue(height),
    maxWidth: '80%',
    overflow: 'hidden',
    backgroundColor: calculateRgba(color, 0.2),
    backgroundClip: 'padding-box',
    ...css
  }

  const style = (i: number): React.CSSProperties => {
    return {
      position: 'absolute',
      height: cssValue(height),
      overflow: 'hidden',
      backgroundColor: color,
      backgroundClip: 'padding-box',
      display: 'block',
      borderRadius: 2,
      willChange: 'left, right',
      animationFillMode: 'forwards',
      animation: `${i === 1 ? long : short} ${2.1 / speedMultiplier}s ${
        i === 2 ? `${1.15 / speedMultiplier}s` : ''
      } ${
        i === 1
          ? 'cubic-bezier(0.65, 0.815, 0.735, 0.395)'
          : 'cubic-bezier(0.165, 0.84, 0.44, 1)'
      } infinite`
    }
  }

  if (!loading) {
    return null
  }

  return (
    <div
      style={{
        height: '100vh',
        width: '100vw',
        position: 'fixed',
        background: 'rgba(0, 0, 0, .2)',
        zIndex: 20,
        left: '120px',
        top: '100px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      <div style={{ zIndex: '21' }}>
        <span style={wrapper} {...additionalprops}>
          <span style={style(1)} />
          <span style={style(2)} />
        </span>
      </div>
    </div>
  )
}

export default BarLoader
