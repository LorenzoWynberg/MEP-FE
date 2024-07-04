import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import GenericTable from './GenericTable'
import { useActions } from 'Hooks/useActions'
import { useTranslation } from 'react-i18next'
import {
  getModalidades,
  createModalidad,
  editModalidad,
  deleteModalidades,
  getCategoriasModalidades,
  updateModalidades
} from '../../../../../../redux/modalidades/actions'

const Modalidades = (props) => {
  const { t } = useTranslation()
  const [data, setData] = useState<array>([])

  const {
    hasAddAccess = true,
    hasEditAccess = true,
    hasDeleteAccess = true
  } = props
  const actions = useActions({
    getModalidades,
    createModalidad,
    editModalidad,
    deleteModalidades,
    getCategoriasModalidades,
    updateModalidades
  })

  const state = useSelector((store) => {
    return {
      modalidades: store.modalidades.modalidades,
      categorias: store.modalidades.categorias,
      loading: store.modalidades.loading
    }
  })

  useEffect(() => {
    setData(
      state.modalidades.map((mdlt) => {
        return {
          ...mdlt,
          estadoP: mdlt?.esActivo ? 'ACTIVA' : 'INACTIVA'
        }
      })
    )
  }, [state.modalidades])

  useEffect(() => {
    actions.getModalidades()
    actions.getCategoriasModalidades()
  }, [])

  const handleCreate = async (data) => {
    const _data = {
      ...data,
      estado: data.estado == 1,
      tabla: ''
    }
    return await actions.createModalidad(_data)
  }

  const handleEdit = async (data) => {
    const _data = {
      ...data,
      estado: data.estado == 1,
      tabla: ''
    }
    return await actions.editModalidad(_data)
  }
  const handleDelete = async (ids) => {
    return await actions.deleteModalidades(ids)
  }
  const handleUpdate = async (ids) => {
    return await actions.updateModalidades(ids)
  }

  return (
    <GenericTable
      data={data}
      tableName='label.modalities'
      nombre={t('configuracion>ofertas_educativas>modalidades>columna_modalidad', 'Modalidad')}
      type='Modalidad'
      title={t('configuracion>ofertas_educativas>modalidades>modalidad_educativa', 'Modalidad educativa')}
      handleCreate={handleCreate}
      handleEdit={handleEdit}
      loading={state.loading}
      handleDelete={handleDelete}
      categories={state.categorias}
      refreshUpdate={() => actions.getModalidades()}
      modalities
      showButtonEdit
      handleUpdate={handleUpdate}
      hasAddAccess={hasAddAccess}
      hasEditAccess={hasEditAccess}
      hasDeleteAccess={hasDeleteAccess}
    />
  )
}

export default Modalidades
