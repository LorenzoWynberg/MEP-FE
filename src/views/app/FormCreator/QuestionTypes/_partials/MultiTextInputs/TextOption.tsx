import React from 'react'
import styled from 'styled-components'
import DeleteOutlinedIcon from '@material-ui/icons/DeleteOutlined'
import { Input } from 'reactstrap'

const TextOption = (props) => {
  return (
    <div
      style={{
        display: 'flex',
        width: '65%',
        alignItems: 'center'
      }}
    >
      <StyledDivContainer active={props.active} first={props.option.idx === 0}>
        <span style={{ marginRight: '1rem' }}>{props.option.idx + 1}.</span>
        <Input
          type='textarea'
          value={props.option.label}
          rows='1'
          onChange={(e) => {
            const data = e.target.value.split('\n')
            if (data.length === 1) {
              props.onChangeOption(data[0], 'label')
            } else {
              props.onChange(data.map((el, idx) => ({ idx, label: el })), 'options')
            }
          }}
          style={{
            height: '2rem',
            overflow: 'hidden',
            resize: 'none',
            padding: '0.3rem'
          }}
        />
        {props.active && <div>
          <StyledIcons>
            <DeleteOutlinedIcon
              style={{ cursor: 'pointer' }} onClick={(e) => {
                props.deleteOption()
              }}
            />
          </StyledIcons>
                         </div>}
      </StyledDivContainer>
    </div>
  )
}

const StyledDivContainer = styled.div`
  justify-content: space-around;
  display: flex;
  align-items: center;
  width: 100%;
`

const StyledIcons = styled.div`
  margin-top: 10px;
`

export default TextOption
