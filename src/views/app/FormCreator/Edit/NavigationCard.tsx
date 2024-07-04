import React from 'react'
import { Typography } from '@material-ui/core'
import DragIndicatorIcon from '@material-ui/icons/DragIndicator'
import FroalaEditorView from 'react-froala-wysiwyg/FroalaEditorView'
import Edit from './index'
import ConditionalsIcon from './ConditionalsIcon'

const NavigationCard = (props) => {
  return (
    <div
      className='hoverColor' style={{ display: 'flex' }} onClick={() => {
        props.scrollTo(props.question.id, props.question, props.parent)
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <DragIndicatorIcon fontSize='default' style={{ color: 'gray' }} />
      </div>
      <div
        style={{
          height: '3rem',
          width: '30%',
          color: 'white',
          margin: '20px',
          backgroundColor: '#155388',
          display: 'flex',
          alignItems: 'center',
          borderRadius: '8px',
          justifyContent: 'center'
        }}
      >
        {Edit.getIcon(props.question.type, 'white')}
      </div>
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '70%'
      }}
      >
        <Typography style={{ width: '100%', display: 'flex' }}>
          {props.question.idx + 1}. <div style={{ paddingTop: '3px' }}><FroalaEditorView model={props.question.label} /></div>
        </Typography>
        {props.question.options?.some(el => el.question || el.section) && <div style={{
          backgroundColor: '#155388',
          borderRadius: '50%',
          color: 'white'
        }}
                                                                          ><ConditionalsIcon />
        </div>}
      </div>
    </div>
  )
}

export default NavigationCard
