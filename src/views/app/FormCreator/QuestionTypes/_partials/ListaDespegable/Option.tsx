import React from 'react'
import styled from 'styled-components'
import DeleteOutlinedIcon from '@material-ui/icons/DeleteOutlined'
import { Input } from 'reactstrap'
import '../../../../../../assets/css/sass/containerStyles/report.scss'

const Option = (props) => {
  return (
    <div
      style={{
        // backgroundColor: 'white',
        //  display:"flex",
        width: '56%',
        alignItems: 'center'
      }}
    >
      <StyledDivContainer>
        <div>
          <StyledDiv>
            <div className='numberOption'>
              {props.index + 1}.
            </div>
            <Input
              type='textarea'
              value={props.option.label}
              rows='1'
              onChange={(e) => {
                const data = e.target.value.split('\n')
                if (data.length === 1) {
                  props.onChange(data[0], 'label')
                } else {
                  props.onChangeQuestion(data.map((el, idx) => ({ idx, label: el })), 'options')
                }
              }}
              style={{
                height: '2rem',
                overflow: 'hidden',
                resize: 'none',
                padding: '0.3rem'
              }}
            />
          </StyledDiv>
        </div>
      </StyledDivContainer>
      {props.active && <div>
        <StyledIcons>
          <DeleteOutlinedIcon
            style={{ cursor: 'pointer', marginLeft: '10px' }} onClick={(e) => {
              props.deleteOption()
            }}
          />
        </StyledIcons>
                       </div>}

    </div>
  )
}

const StyledDivContainer = styled.div`
  margin-left: 18px;
`
const StyledDiv = styled.div`
  display: flex;
  margin-bottom: auto;
`
const StyledIcons = styled.div`
margin-top: -27px;
margin-left: 458px;
`

export default Option
