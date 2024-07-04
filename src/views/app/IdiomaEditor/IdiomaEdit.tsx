import React, { useReducer } from 'react'
import { TableReactImplementation } from 'Components/TableReactImplementation'
import { Button } from 'Components/CommonComponents'
import styled from 'styled-components'
import { FaTrashAlt } from 'react-icons/fa'
import { Idioma } from '../../../api'
import { useTranslation } from 'react-i18next'
interface IProps {
	jsonFile?: string
	langKey: string
	langName: string
	onBack: any
}

const EditableCell = ({
  value: initialValue,
  row: { index },
  column: { id },
  updateMyData // This is a custom function that we supplied to our table instance
}) => {
  
  // We need to keep and update the state of the cell normally
  const [value, setValue] = React.useState(initialValue)

  const onChange = (e) => {
    setValue(e.target.value)
  }

  // We'll only update the external data when the input is blurred
  const onBlur = () => {
    updateMyData(index, id, value)
  }

  // If the initialValue is changed external, sync it up with our state
  React.useEffect(() => {
    setValue(initialValue)
  }, [initialValue])

  return <Input value={value} onChange={onChange} onBlur={onBlur} />
}

const buildArrayFromJson = (json) => {
  if (!json) return []
  return Object.keys(json).map((key) => {
    return {
      tag: key,
      valor: json[key]
    }
  })
}
const initialState = {
  arrayData: [],
  editRowIndex: null
}
const TYPES = {
  DELETE_ARRAY_ITEM: 'DELETE_ARRAY_ITEM',
  SET_ARRAY_DATA: 'SET_ARRAY_DATA',
  PUT_NEW_ARRAY_ITEM: 'PUT_NEW_ARRAY_ITEM',
  EDIT_TAG_NAME: 'EDIT_TAG_NAME',
  EDIT_TAG_VALUE: 'EDIT_TAG_VALUE'
}
const reducer = (state = initialState, action) => {
  const { type, payload } = action
  switch (type) {
    case TYPES.SET_ARRAY_DATA: {
      return payload
    }
    case TYPES.DELETE_ARRAY_ITEM: {
      const arrayData = [...state.arrayData]
      arrayData.splice(payload, 1)
      return {
        ...state,
        arrayData
      }
    }
    case TYPES.PUT_NEW_ARRAY_ITEM: {
      const arrayData = [...state.arrayData, { tag: '', valor: '' }]
      return {
        ...state,
        arrayData
      }
    }
    case TYPES.EDIT_TAG_NAME: {
      const { index, value } = payload
      return {
        ...state,
        arrayData: state.arrayData.map((item, i) => {
          if (index == i) {
            return { tag: value, valor: item.valor }
          } else return item
        })
      }
    }
    case TYPES.EDIT_TAG_VALUE: {
      const { index, value } = payload
      return {
        ...state,
        arrayData: state.arrayData.map((item, i) => {
          if (index == i) {
            return { tag: item.tag, valor: value }
          } else return item
        })
      }
    }
    default:
      return payload
  }
}

const IdiomaEdit: React.FC<IProps> = (props) => {
  const { t } = useTranslation()
  const { jsonFile, onBack, langKey } = props
  const [state, dispatch] = useReducer(reducer, {
    arrayData: buildArrayFromJson(jsonFile)
  })
  // const [state, setState] = React.useState(buildArrayFromJson(jsonFile))
  const addRow = () => {
    dispatch({ type: TYPES.PUT_NEW_ARRAY_ITEM })
  }
  const deleteRow = (index) => {
    dispatch({ type: TYPES.DELETE_ARRAY_ITEM, payload: index })
  }
  const editTagName = (index, value) => {
    dispatch({ type: TYPES.EDIT_TAG_NAME, payload: { index, value } })
  }
  const editTagValue = (index, value) => {
    dispatch({ type: TYPES.EDIT_TAG_VALUE, payload: { index, value } })
  }
  const updateMyData = (rowIndex, columnId, value) => {
    if (columnId == 'tag') editTagName(rowIndex, value)
    else editTagValue(rowIndex, value)
  }
  const buildJsonLanguageFile = (stateArray) => {
    const obj = {}

    stateArray.forEach((i) => {
      obj[i.tag] = i.valor
    })

    return obj
  }
  const onSaveEvent = () => {
    const object = buildJsonLanguageFile(state.arrayData)
    Idioma.uploadS3File(props.langKey, props.langName, object)
      .then((r) => {
        console.log(r)
      })
      .catch((e) => {
        console.log(e)
      })
  }

  const TableMetadata = React.useMemo(() => {
    const columns = [
      {
        accessor: 'tag',
        Header: t('idiomaEditor>etiqueta','Etiqueta'),
        Cell: EditableCell
      },
      {
        accessor: 'valor',
        Header: t('idiomaEditor>valor','Valor'),
        Cell: EditableCell
      },
      {
        accessor: 'acciones',
        Header: t("general>acciones", "Acciones"),
        Cell: ({ cell, row, data }) => {
          return (
            <AccionesDiv>
              <FaTrashAlt onClick={() => deleteRow(row.index)} />
            </AccionesDiv>
          )
        }
      }
    ]

    const data = state.arrayData || []

    return {
      columns,
      data
    }
  }, [state,t])

  return (
    <div>
      <TopBar>
        <span
          style={{ cursor: 'pointer' }}
          onClick={onBack || null}
        >
          {'<' } {t("edit_button>regresar", "Regresar")}
        </span>
        <Button onClick={onSaveEvent}>{t("edit_button>guardar", "Guardar")}</Button>
      </TopBar>
      <TableReactImplementation
        columns={TableMetadata.columns}
        data={TableMetadata.data}
        msjButton
        customFunctions={{ updateMyData }}
      />
      <Button onClick={addRow}>+</Button>
    </div>
  )
}
const AccionesDiv = styled.div`
	display: grid;
	justify-items: center;
	font-size: 1.1rem;
	grid-template-columns: 1fr;
	width: 100%;
`
const Input = styled.input`
	border: none;
	outline: none;
	width: 100%;
`
const TopBar = styled.div`
	display: flex;
	width: 100%;
	justify-content: space-between;
`

export default IdiomaEdit
