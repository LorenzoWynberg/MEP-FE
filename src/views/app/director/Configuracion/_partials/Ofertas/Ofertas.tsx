import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import GenericTable from './GenericTable'
import {
  getOfertas,
  createOferta,
  deleteOfertas,
  editOferta,
  updateOferta
} from '../../../../../../redux/ofertas/actions'
import { useActions } from 'Hooks/useActions'
import swal from 'sweetalert'
import { useTranslation } from 'react-i18next'

const Ofertas = (props) => {
  const { t } = useTranslation()
  const [data, setData] = useState<array>([])

  const {
    hasAddAccess = true,
    hasEditAccess = true,
    hasDeleteAccess = true
  } = props
  const actions = useActions({
    getOfertas,
    createOferta,
    deleteOfertas,
    editOferta,
    updateOferta
  })

  const state = useSelector((store) => {
    return {
      ofertas: store.ofertas.ofertas,
      loading: store.ofertas.loading
    }
  })

  useEffect(() => {
    setData(
      state.ofertas.map((ofr) => {
        return {
          ...ofr,
          estadoP: ofr?.esActivo ? 'ACTIVA' : 'INACTIVA'
        }
      })
    )
  }, [state.ofertas])

  useEffect(() => {
    actions.getOfertas()
  }, [])

  const handleCreate = async (data) => {
    const _data = {
      ...data,
      estado: data.estado == 1,
      tabla: ''
    }
    return await actions.createOferta(_data)
  }

  const handleEdit = async (data) => {
    const _data = {
      ...data,
      estado: data.estado == 1,
      tabla: ''
    }
    return await actions.editOferta(_data)
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
    return await actions.deleteOfertas(ids)
  }
  const handleUpdate = async (ids) => {
    await actions.updateOferta(ids)
  }

  return (
    <GenericTable
      data={data}
      tableName='label.offers'
      nombre={t('configuracion>ofertas_educativas>ofertas_educativa>columna_oferta_educativa', 'Oferta Educativa')}
      title={t('configuracion>ofertas_educativas>ofertas_educativas>ofertas_educativas', 'Ofertas Educativas')}
      handleCreate={handleCreate}
      handleEdit={handleEdit}
      type='Oferta'
      loading={state.loading}
      handleDelete={handleDelete}
      showButtonEdit
      handleUpdate={handleUpdate}
      refreshUpdate={() => actions.getOfertas()}
      hasAddAccess={hasAddAccess}
      hasEditAccess={hasEditAccess}
      hasDeleteAccess={hasDeleteAccess}
    />
  )
}

export default Ofertas
