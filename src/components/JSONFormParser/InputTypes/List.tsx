import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import axios from 'axios'
import { envVariables } from '../../../constants/enviroment'
import {
  fromDbListOptionsURLS,
  fromDbListOptionsColumns
} from '../utils/Options'
import { OptionsMapper } from '../utils/OptionsMapper.ts'
import styled from 'styled-components'
import Loader from '../../Loader'
import Radio from '@material-ui/core/Radio'

const List = props => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const state = useSelector(store => {
    return { ...store }
  })
  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      let response
      if (typeof props.field.options === 'string') {
        response = await axios.get(
                    `${envVariables.BACKEND_URL}/${fromDbListOptionsURLS[
                        props.field.options
                    ](state)}`
        )
        setData(
          response.data.map(item =>
            OptionsMapper[props.field.options](item)
          )
        )
      } else {
        setData(props.field.options)
      }
      setLoading(false)
    }
    loadData()
  }, [])

  const handleItemSelect = item => {
    props.setValue(`${props.field.id}`, item.id)
  }

  return (
    <StyledListContainer>
      <FormFeedbackSpan>
        {props.errors[`${props.field.id}`] &&
                    'Debe seleccionar por lo menos una opcion'}
      </FormFeedbackSpan>
      {loading && <Loader formLoader />}
      {data.map(value => {
        return (
          <StyledDivRow
            className='bg-white__radius'
            onClick={() => {
              handleItemSelect(value)
            }}
          >
            <Radio
              color='primary'
              checked={
                                props.watch(
                                    `${props.field.id}`
                                ) == value.id
                            }
              disabled={!props.editable || props.readOnlyFields?.includes(props.field.id)}
            />
            {fromDbListOptionsColumns[props.field.options].map(
              column => {
                return <p>{value[column.column]}</p>
              }
            )}
          </StyledDivRow>
        )
      })}
      <input
        type='hidden'
        name={`${props.field.id}`}
        ref={props.register({ required: props.field.config?.required })}
      />
    </StyledListContainer>
  )
}

const StyledListContainer = styled.div`
    min-height: 80%;
    max-height: 400px;
    overflow-y: scroll;
    text-align: center;
    width: 100%;
`

const StyledDivRow = styled.div`
    display: flex;
    justify-content: space-between;
    margin: 1rem;
`

const FormFeedbackSpan = styled.span`
    color: red;
`

export default List
