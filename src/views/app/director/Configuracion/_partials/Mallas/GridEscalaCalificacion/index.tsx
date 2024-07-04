import React, { useReducer, useEffect } from 'react'
import styled from 'styled-components'
import { MdDelete } from 'react-icons/md'
import { IconContext } from 'react-icons'
import { Button } from 'reactstrap'
type Escala = {
  id: number
  calificacion: number | string
  rango: {
    inferior: number
    superior: number
  }
}

interface IProps {
  data?: Escala[] | string | null
  setData?: Function
  readonly?: boolean
}

const ACTION_TYPE = {
  ADD_ROW: 'ADD_ROW',
  DELETE_ROW: 'DELETE_ROW',
  SET_DATA: 'SET_DATA',
  SET_CALIFICACION: 'SET_CALIFICACION',
  SET_RANGO_SUPERIOR: 'SET_RANGO_SUPERIOR',
  SET_RANGO_INFERIROR: 'SET_RANGO_INFERIROR',
  ON_CHANGE_DATA: 'ON_CHANGE_DATA'
}

const reducer = (state, action) => {
  const { payload, type } = action

  switch (type) {
    case ACTION_TYPE.ADD_ROW:
      payload.id = state[state.length - 1]?.id + 1 || 1
      return [...state, payload]
      break
    case ACTION_TYPE.DELETE_ROW:
      return state.filter((item) => item.id !== payload.id)
      break
    case ACTION_TYPE.SET_DATA:
      return [...payload]
      break

    case ACTION_TYPE.ON_CHANGE_DATA: {
      const index = state.findIndex((i) => i.id === payload.id)
      const newState = [...state]
      newState[index] = payload
      return newState
      break
    }
  }
}
const GridEscalaCalificacion: React.FC<IProps> = (
  props = { readonly: false }
) => {
  const columnas = props.readonly
    ? ['Calificación', 'Rango']
    : ['Calificación', 'Rango', 'Eliminar']
  const validatedInput = () => {
    if (!props.data) return []
    if (typeof props.data === 'string') return JSON.parse(props.data)
    if (typeof props.data === 'object') return props.data
  }

  const [state, dispatch] = useReducer(reducer, validatedInput())

  const deleteRow = (row: Escala) => {
    dispatch({ type: ACTION_TYPE.DELETE_ROW, payload: row })
  }
  const addRow = () => {
    const newObj: Escala = {
      id: 0,
      calificacion: '',
      rango: {
        inferior: 0,
        superior: 0
      }
    }
    dispatch({ type: ACTION_TYPE.ADD_ROW, payload: newObj })
  }

  const onChangeCalificacion = (e, obj: Escala) => {
    const newValue = e.target.value
    obj.calificacion = newValue.length > 1 ? newValue[1] : newValue
    dispatch({ type: ACTION_TYPE.ON_CHANGE_DATA, payload: newValue })
  }
  const onChangeRangoInferior = (e, obj: Escala) => {
    const newValue = Number(e.target.value)
    obj.rango.inferior = newValue
    dispatch({ type: ACTION_TYPE.ON_CHANGE_DATA, payload: newValue })
  }
  const onChangeRangoSuperior = (e, obj: Escala) => {
    const newValue = Number(e.target.value)
    obj.rango.superior = newValue
    dispatch({ type: ACTION_TYPE.ON_CHANGE_DATA, payload: newValue })
  }
  const createRow = (key: number, escala: Escala) => {
    return (
      <tr key={key}>
        <td>
          <Input
            readOnly={props.readonly}
            type='text'
            onChange={(e) => onChangeCalificacion(e, escala)}
            value={escala.calificacion}
          />
        </td>
        <td>
          <Input
            readOnly={props.readonly}
            type='number'
            onChange={(e) => onChangeRangoInferior(e, escala)}
            value={escala.rango.inferior}
          />
          {' - '}
          <Input
            readOnly={props.readonly}
            type='number'
            onChange={(e) => onChangeRangoSuperior(e, escala)}
            value={escala.rango.superior}
          />
        </td>
        {!props.readonly && (
          <td>
            <IconContext.Provider value={{ color: '#145388' }}>
              <MdDelete onClick={() => deleteRow(escala)} size={25} />
            </IconContext.Provider>
          </td>
        )}
      </tr>
    )
  }
  useEffect(() => {
    if (props.setData) props.setData(JSON.stringify(state))
  }, [state])

  return (
    <>
      <Table>
        <thead>
          <tr>
            {columnas.map((item, index) => (
              <th key={index}>{item}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {state.map((escala: Escala, index: number) =>
            createRow(index, escala)
          )}
        </tbody>
        <tfoot>
          <tr>
            <td>
              {!props.readonly && (
                <Button onClick={addRow}>+ Agregar escala</Button>
              )}
            </td>
          </tr>
        </tfoot>
      </Table>
    </>
  )
}

const Table = styled.table`
  width: 100%;
  text-align: center;
  thead::after {
    content: '-';

    color: transparent;
  }
  thead tr {
    border-bottom: solid 2px #d7d7d7;
  }
  tfoot::before {
    content: '-';
    line-height: 1em;
    margin-top: 15px;
    color: transparent;
  }
  th {
    width: 3.33%;
  }
`
const Input = styled.input`
  border-radius: 5px;
  border: solid 1px #d7d7d7;
  text-align: center;
  height: 35px;
  width: 35px;
`
export default GridEscalaCalificacion
