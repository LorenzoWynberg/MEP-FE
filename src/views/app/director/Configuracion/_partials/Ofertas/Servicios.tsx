import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import GenericTable from './GenericTable'
import { useTranslation } from 'react-i18next'

import { useActions } from 'Hooks/useActions'
import {
  getServicios,
  createServicio,
  deleteServicios,
  editServicio,
  updateServicios
} from '../../../../../../redux/servicios/actions'

const Servicios = (props) => {
  const { t } = useTranslation()
  // const [inputState, setInputState] = useState(false)
  const [data, setData] = useState<array>([])
  const {
    hasAddAccess = true,
    hasEditAccess = true,
    hasDeleteAccess = true
  } = props
  const actions = useActions({
    getServicios,
    createServicio,
    deleteServicios,
    editServicio,
    updateServicios
  })

  const state = useSelector((store) => {
    return {
      servicios: store.servicios.servicios,
      loading: store.servicios.loading
    }
  })

  useEffect(() => {
    actions.getServicios()
  }, [])

  useEffect(() => {
    setData(
      state.servicios
        .filter((srv) => srv.id)
        .map((srv) => {
          return {
            ...srv,
            estadoP: srv?.esActivo ? 'ACTIVA' : 'INACTIVA'
          }
        })
    )
  }, [state.servicios])

  const handleCreate = async (data) => {
    const _data = {
      ...data,
      estado: data.estado == 1,
      tabla: ''
    }
    return await actions.createServicio(_data)
  }

  const handleEdit = async (data) => {
    const _data = {
      ...data,
      estado: data.estado == 1,
      tabla: ''
    }
    return await actions.editServicio(_data)
  }

  const handleDelete = async (ids) => {
    return await actions.deleteServicios(ids)
  }
  const handleUpdate = async (ids) => {
    return await actions.updateServicios(ids)
  }

  return (
    <GenericTable
      validateUsing
      data={data}
      tableName='label.services'
      nombre={t('configuracion>ofertas_educativas>servicios>columna_servicio', 'Servicio')}
      title={t('configuracion>ofertas_educativas>servicios>servicios_educativos', 'Servicios educativos')}
      handleCreate={handleCreate}
      handleEdit={handleEdit}
      loading={state.loading}
      handleDelete={handleDelete}
      showButtonEdit
			// inputState={inputState}
			// setInputState={setInputState}
      handleUpdate={handleUpdate}
      refreshUpdate={() => actions.getServicios()}
      hasAddAccess={hasAddAccess}
      type='Servicio'
      hasEditAccess={hasEditAccess}
      hasDeleteAccess={hasDeleteAccess}
    />
  )
}

export default Servicios
