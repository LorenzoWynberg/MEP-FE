import React from 'react'
import IdiomaEdit from './IdiomaEdit'
import IdiomaList from './IdiomaList'
import AppLayout from '../../../layout/AppLayout'
import directorMenu from 'Constants/directorMenu'
import { Idioma } from '../../../api'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
const IdiomaEditor = () => {
  const [state, setState] = React.useState({ showForm: false, idiomaList: [], jsonFile: null, langKey: null, nombre: null })
  const [loading, setLoading] = React.useState(false)
  const { i18n } = useTranslation()
  const loadGrid = () => {
    return Idioma.getIdiomaList().then(r => {
      setState({ ...state, idiomaList: r })
    })
  }
  React.useEffect(() => {
    loadGrid()
  }, [])

  const onEditEvent = (row) => {
    Idioma.getIdiomaFromS3(row.url).then(r => {
      setState({ ...state, jsonFile: r, showForm: true, langKey: row.nombre, nombre: row.id })
    })
  }
  const onCopyEvent = (row, id, nombre) => {
    Idioma.getIdiomaFromS3(row.url).then(response => {
      Idioma.uploadS3File(id, nombre, response).then(r => {
        loadGrid()
      })
    })
  }
  const onDeleteEvent = (id) => {
    Idioma.deleteS3File(id)
  }
  const onAddEvent = (id, nombre) => {
    setState({ ...state, jsonFile: [], langKey: id, nombre, showForm: true })
  }
  const onBackEvent = () => {
    setLoading(true)
    i18n.reloadResources().then(_ => {
      setLoading(false)
      setState({ ...state, langKey: null, jsonFile: [], showForm: false })
    })
  }
  return (
    <AppLayout items={directorMenu}>
      <div>
        {loading && (
          <Loading>
            <span className='single-loading' />
          </Loading>
        )}
        {state.showForm ? <IdiomaEdit onBack={onBackEvent} langKey={state.langKey} langName={state.nombre} jsonFile={state.jsonFile} /> : <IdiomaList onAdd={onAddEvent} onCopy={onCopyEvent} onDelete={onDeleteEvent} onEdit={onEditEvent} rows={state.idiomaList} />}
      </div>
    </AppLayout>
  )
}

const Loading = styled.div`
	width: 100%;
	min-height: 381px;
	display: flex;
	align-items: center;
	justify-content: center;
	background: #ffffffb8;
	position: absolute;
	z-index: 99;
	left: 0;
	right: 0;
	top: 0;
	bottom: 0;
`

export default IdiomaEditor
