import React from 'react'
import styled from 'styled-components'
import DeleteOutlinedIcon from '@material-ui/icons/DeleteOutlined'
import { Input } from 'reactstrap'
import '../../../../../../assets/css/sass/containerStyles/report.scss'
import { Typography } from '@material-ui/core'

const Option = (props) => {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'flex-start',
      flexDirection: 'column'
    }}
    >
      <div
        style={{
          alignItems: 'center'
        }}
      >
        <StyledDivContainer>
          <div>
            <StyledDiv>
              <div className='numberOption'>
                {props.index + 1}.
              </div>
              {props.active
                ? <Input
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
                  /> :
                <Typography variant='caption'>
                  {props.option.label}
                </Typography>}
            </StyledDiv>
          </div>
        </StyledDivContainer>
        {props.active && <div>
          <StyledIcons>
            <DeleteOutlinedIcon onClick={(e) => {
              props.deleteOption()
            }}
            />
          </StyledIcons>
        </div>}
      </div>
      {!props.active && <StyledDivContainer>
        <div>
          <StyledDiv>
            <Input
              type='number'
              maxlength={4}
              className='inputPorcentajeClass'
              disabled={(props.disabled) ? 'disabled' : ''}
              value={props.value ? props.value[props.index] : ''}
              onChange={(e) => {
                if (props.response) {
                  const _value = props.value ? [...props.value] : []
                  _value[props.index] = e.target.value
                  props.handleOnChangeValue(_value, props.question.id)
                }
              }}
              style={{
                height: '2rem',
                width: '5rem'
              }}
            />
            <div className='PorcentajeOption'>
              <span>
                %
              </span>
            </div>
          </StyledDiv>
        </div>
                        </StyledDivContainer>}
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
margin-top: -29px;
margin-left: 654px;
`
export default Option
