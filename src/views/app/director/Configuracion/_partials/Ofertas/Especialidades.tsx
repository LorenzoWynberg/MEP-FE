import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import GenericTable from './GenericTable'
import { useTranslation } from 'react-i18next'
import { useActions } from 'Hooks/useActions'
import {
  getEspecialidades,
  createEspecialidad,
  editEspecialidad,
  deleteEspecialidades,
  updateEspecialidad
} from '../../../../../../redux/especialidades/actions'

const Especialidades = (props) => {
  const { t } = useTranslation()
  const [data, setData] = useState<array>([])
  const {
    hasAddAccess = true,
    hasEditAccess = true,
    hasDeleteAccess = true
  } = props
  const actions = useActions({
    getEspecialidades,
    createEspecialidad,
    editEspecialidad,
    deleteEspecialidades,
    updateEspecialidad
  })

  const state = useSelector((store) => {
    return {
      especialidades: store.especialidades.especialidades,
      loading: store.especialidades.loading
    }
  })

  useEffect(() => {
    actions.getEspecialidades()
  }, [])

  useEffect(() => {
    setData(
      state.especialidades.map((esp) => {
        return {
          ...esp,
          estadoP: esp?.esActivo ? 'ACTIVA' : 'INACTIVA'
        }
      })
    )
  }, [state.especialidades])

  const handleCreate = async (data) => {
    const _data = {
      ...data,
      estado: data.estado == 1,
      tabla: ''
    }
    return await actions.createEspecialidad(_data)
  }

  const handleEdit = async (data) => {
    const _data = {
      ...data,
      estado: data.estado == 1,
      tabla: ''
    }
    return await actions.editEspecialidad(_data)
  }

  const handleDelete = async (ids) => {
    
    return await actions.deleteEspecialidades(ids)
  }

  const handleUpdate = async (ids) => {
    return await actions.updateEspecialidad(ids)
  }

  return (
    <GenericTable
      data={data}
      tableName='label.especialities'
      tableNombre={t('configuracion>ofertas_educativas>especialidades>columna_especialidad', 'Especialidad')}
      type='Especialidad'
      nombre={t('configuracion>ofertas_educativas>especialidades>columna_especialidad', 'Especialidad')}
      title={t('configuracion>ofertas_educativas>especialidades>especialidades', 'Especialidades')}
      handleCreate={handleCreate}
      handleEdit={handleEdit}
      showButtonEdit
      handleUpdate={handleUpdate}
      loading={state.loading}
      handleDelete={handleDelete}
      refreshUpdate={() => actions.getEspecialidades()}
      hasAddAccess={hasAddAccess}
      hasEditAccess={hasEditAccess}
      hasDeleteAccess={hasDeleteAccess}
    />
  )
}

export default Especialidades
