import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import GenericTable from './GenericTable'
import { useTranslation } from 'react-i18next'
import { useActions } from 'Hooks/useActions'
import {
  getNiveles,
  createNivel,
  editNivel,
  deleteNiveles,
  updateNivel
} from '../../../../../../redux/niveles/actions'
import swal from 'sweetalert'

const Especialidades = (props) => {
  const { t } = useTranslation()
  const [data, setData] = useState<Array<any>>([])
  const {
    hasAddAccess = true,
    hasEditAccess = true,
    hasDeleteAccess = true
  } = props

  const actions = useActions({
    getNiveles,
    createNivel,
    editNivel,
    deleteNiveles,
    updateNivel
  })

  const state = useSelector((store) => {
    return {
      niveles: store.niveles.niveles,
      loading: store.niveles.loading
    }
  })

  useEffect(() => {
    actions.getNiveles()
  }, [])

  useEffect(() => {
    setData(
      state.niveles.map((lvl) => {
        return {
          ...lvl,
          estadoP: lvl?.esActivo ? 'ACTIVA' : 'INACTIVA'
        }
      })
    )
  }, [state.niveles])

  const handleCreate = async (data) => {
    const _data = {
      ...data,
      estado: data.estado == 1,
      tabla: ''
    }
    return await actions.createNivel(_data)
  }

  const handleEdit = async (data) => {
    const _data = {
      ...data,
      estado: data.estado == 1,
      tabla: ''
    }
    return await actions.editNivel(_data)
  }

  const handleDelete = async (ids) => {
    const usedData = data
      .filter((el) => el.totalUsing > 0)
      .map((el) => el.id)
    if (usedData.some((el) => ids.includes(el))) {
      swal({
        title: 'Atención',
        text: `${
					ids.length > 1
						? 'Uno o mas de los registros seleccionados'
						: 'El registro seleccionado'
				} no puede ser eliminado`,
        dangerMode: true,
        icon: 'warning',
        buttons: ['Aceptar']
      })
      return { error: 'no se ha podido completar la operación' }
    }
    return await actions.deleteNiveles(ids)
  }
  const handleUpdate = async (ids) => {
    await actions.updateNivel(ids)
  }

  return (
    <GenericTable
      data={data}
      tableName='label.levels'
      tableNombre={t('configuracion>ofertas_educativas>niveles>columna_nivel_educativo', 'Nivel educativo')}
      nombre={t('configuracion>ofertas_educativas>niveles>agregar>nivel', 'Nivel')}
      title={t('configuracion>ofertas_educativas>niveles', 'Niveles educativos')}
      type='Nivel'
      handleCreate={handleCreate}
      handleEdit={handleEdit}
      loading={state.loading}
      showButtonEdit
      handleUpdate={handleUpdate}
      handleDelete={handleDelete}
      refreshUpdate={() => actions.getNiveles()}
      hasAddAccess={hasAddAccess}
      hasEditAccess={hasEditAccess}
      hasDeleteAccess={hasDeleteAccess}
    />
  )
}

export default Especialidades
