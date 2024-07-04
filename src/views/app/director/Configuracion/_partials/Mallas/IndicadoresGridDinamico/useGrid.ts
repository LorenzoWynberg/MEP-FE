import { useSelector, useDispatch } from 'react-redux'
import {
  setColumnColor,
  addIndicadorColumn,
  addIndicadorRow,
  setCellText,
  setRowNameText,
  setColumnText,
  addContenido,
  toggleHabilitarPuntos,
  setContenidoName,
  saveJsonData,
  setDataIndicador,
  setPuntosColumnas
} from '../../../../../../../redux/IndicadoresAprendizaje/actions'
import { guidGenerator } from 'utils/GUIDGenerator'
import swal from 'sweetalert'
const useGrid = () => {
  const state = useSelector(store => {
    return store.indicadorAprendizaje.dataIndicadores
  })
  const dispatch = useDispatch()
  const { Contenidos } = state

  const Alerts = {
    QuestionAlert: (text, yesCallback) => {
      swal(text, {
        buttons: {
          no: { text: 'No', value: 'no' },
          si: { text: 'Si', value: 'si' }
        }
      }).then(value => {
        switch (value) {
          case 'si':{
            yesCallback()
          }
        }
      })
    }
  }

  const setDataIndicadorState = (dataIndicadores) => {
    let obj = null
    if (typeof dataIndicadores === 'string') {
      obj = JSON.parse(dataIndicadores)
    }

    if (!obj?.Contenidos) { dispatch(setDataIndicador(null)) } else { dispatch(setDataIndicador(obj)) }
  }

  const onChangeColor = (contenido, column, color) => {
    dispatch(setColumnColor(contenido, column, color))
  }

  const getColor = (contenidoIndex, columnIndex) => {
    return Contenidos[contenidoIndex].columnas[columnIndex].color
  }

  const onAddColumnEvent = (contenidoIndex) => {
    const defaultColumn = {
      nombre: '',
      color: '#145388',
      puntos: ''
    }
    dispatch(addIndicadorColumn(defaultColumn, contenidoIndex))
  }

  const onAddRowEvent = (contenidoIndex) => {
    const cantidadCeldas = Contenidos[contenidoIndex].columnas.length
    const defaultFila = {
      celdas: []
    }

    for (let i = 0; i < cantidadCeldas; i++) {
      defaultFila.celdas.push({
        id: i + 1,
        nombre: '',
        detalle: '',
        guid: guidGenerator()
      })
    }

    dispatch(addIndicadorRow(defaultFila, contenidoIndex))
  }

  const onCellChange = (contenidoIndex, rowIndex, cellIndex, text) => {
    dispatch(setCellText(contenidoIndex, rowIndex, cellIndex, text))
  }

  const onRowNameChange = (contenidoIndex, rowIndex, text) => {
    dispatch(setRowNameText(contenidoIndex, rowIndex, text))
  }

  const onColumnNameChange = (contenidoIndex, columnIndex, text) => {
    dispatch(setColumnText(contenidoIndex, columnIndex, text))
  }

  const onAddContenidoEvent = () => {
    dispatch(addContenido())
  }

  const onContenidoNameChange = (contenidoIndex, contenidoName) => {
    dispatch(setContenidoName(contenidoIndex, contenidoName))
  }

  const onToggleHabilitarPuntos = (contenidoIndex) => {
    dispatch(toggleHabilitarPuntos(contenidoIndex))
  }

  const getHabilitarPuntosValue = (contenidoIndex) => {
    return Contenidos[contenidoIndex].puntos
  }

  const saveJsonDataEvent = (rubricaId) => {
    dispatch(saveJsonData(rubricaId, Contenidos))
  }

  const onChangePuntosEvent = (contenidoIndex, columnIndex, puntos) => {
    dispatch(setPuntosColumnas(contenidoIndex, columnIndex, puntos))
  }

  return {
    Contenidos,
    onChangeColor,
    getColor,
    onAddColumnEvent,
    onAddRowEvent,
    onCellChange,
    onRowNameChange,
    onColumnNameChange,
    onAddContenidoEvent,
    onContenidoNameChange,
    getHabilitarPuntosValue,
    onToggleHabilitarPuntos,
    setDataIndicadorState,
    saveJsonDataEvent,
    onChangePuntosEvent
  }
}

export default useGrid
