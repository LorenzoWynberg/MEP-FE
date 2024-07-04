import React, { useEffect, useState } from 'react'
import JSONFormParser from '../../../../../../components/JSONFormParser/JSONFormParser'
import {
  PageData,
  FormResponse
} from '../../../components/JSONFormParser/Interfaces'
import axios from 'axios'
import { envVariables } from '../../../../../../constants/enviroment'
import { useSelector } from 'react-redux'
import { expedienteBaseUrl } from '../../../_partials/expetienteBaseUrl'
import { listasPredefinidas } from 'Components/JSONFormParser/utils/Options'
import SimpleModal from 'Components/Modal/simple'
import Tooltip from '@mui/material/Tooltip'
import colors from '../../../../../../assets/js/colors'
import { Edit, Delete } from '@material-ui/icons'
import swal from 'sweetalert'
import { useTranslation } from 'react-i18next'

const Terrenos: React.FC = () => {
  const { t } = useTranslation()
  const [pageData, setPageData] = useState<PageData | object>({ layouts: [] })
  const [formResponse, setFormResponse] = useState<FormResponse | object>({})
  const [data, setData] = useState([])
  const [modal, setModal] = useState(true)
  const [selectedDR, setSelectedDR] = React.useState([])
  const [isAllChecked, setIsAllChecked] = React.useState(false)

  const state = useSelector((store) => {
    return {
      auth: store.authUser
    }
  })
  const closeModal = () => {
    setModal(false)
  }

  const getAndParseItems = async () => {
    const responseDataStored = await axios.get(
			`${envVariables.BACKEND_URL}${expedienteBaseUrl}FormularioCentro/GetAllByInstitucionAndFormName/${state.auth.currentInstitution.id}/terreno`
    )
    setData(
      responseDataStored.data?.map((item) => {
        return {
          checked: false,
          ...item,
          solucion: JSON.parse(item.solucion)
        }
      })
    )
  }
  const putData = async (data) => {
    const _data = {
      ...data,
      institucionId: state.auth.currentInstitution.id,
      formularioCategoriaId: formResponse.formularioCategoriaId
    }
    const solucion = JSON.parse(_data.solucion)
    try {
      const response = await axios.put(
				`${envVariables.BACKEND_URL}${expedienteBaseUrl}FormularioCentro`,
				_data
      )
      // getAndParseItems()
      return { error: false }
    } catch (e) {
      // getAndParseItems()
      return { error: true }
    }
  }

  const delteteData = async (ids) => {
    try {
      swal({
        title: 'Eliminar',
        text: `¿Esta seguro de que desea eliminar ${
					ids.length === 1 || ids.id ? 'el' : 'los'
				} registro${ids.length === 1 || ids.id ? '' : 's'}?`,
        className: 'text-alert-modal',
        icon: 'warning',
        buttons: {
          cancel: 'Cancelar',
          ok: {
            text: 'Aceptar',
            value: true
          }
        }
      }).then(async (res) => {
        if (res) {
          const response = await axios.delete(
						`${envVariables.BACKEND_URL}${expedienteBaseUrl}FormularioCentro`,
						{ data: ids }
          )
          getAndParseItems()
        }
      })
      return { error: false }
    } catch (e) {
      getAndParseItems()
      return { error: true }
    }
  }
  const handleDelete = (ids) => {
    swal({
      title: 'Eliminar',
      text: `¿Esta seguro de que desea eliminar ${
				ids.length === 1 || ids.id ? 'el' : 'los'
			} registro${ids.length === 1 || ids.id ? '' : 's'}?`,
      className: 'text-alert-modal',
      icon: 'warning',
      buttons: {
        cancel: 'Cancelar',
        ok: {
          text: 'Aceptar',
          value: true
        }
      }
    }).then(async (result) => {
      if (result) {
        const response = await axios.delete(
					`${envVariables.BACKEND_URL}${expedienteBaseUrl}FormularioCentro`,
					{ data: ids }
        )
        getAndParseItems()
      }
    })
  }

  const onRowCheckClick = (data, fullRow, index) => {
    const newState = [...data]
    newState[index] = { ...fullRow, checked: !fullRow.checked }
    setData(newState)
    setIsAllChecked(
      !newState.find((item) => item.checked === false)
    )
  }

  const buildCheckboxTable = ({ cell, row, data }) => {
    const fullRow = data[row.index]
    return (
      <div
        style={{
				  textAlign: 'center',
				  display: 'flex',
				  justifyContent: 'center',
				  alignItems: 'center'
        }}
      >
        <input
          className='custom-checkbox mb-0 d-inline-block'
          type='checkbox'
          id='checki'
          style={{
					  width: '1rem',
					  height: '1rem',
					  marginRight: '1rem'
          }}
          onClick={() => {
					  onRowCheckClick(data, fullRow, row.index)
          }}
          checked={fullRow.checked}
        />
      </div>
    )
  }
  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await axios.get(
					`${envVariables.BACKEND_URL}${expedienteBaseUrl}Formulario/GetByName/terreno`
        )
        getAndParseItems()
        setPageData(JSON.parse(response.data.formulario))
        setFormResponse(response.data)
      } catch (e) {
        setPageData({ layouts: [] })
        setData([])
      }
    }
    loadData()
  }, [state.auth.currentInstitution])

  pageData?.reactTable?.columns?.unshift({
    label: '',
    column: 'id',
    accessor: 'checked',
    Header: '',
    Cell: buildCheckboxTable
  })

  /* pageData.reactTable.actions = [
		{
			actionName: 'button.remove',
			actionFunction: () => {
				handleDelete(
					data
						.filter((e) => e.checked === true)
						.map((item) => item?.id)
				)
			}
		}
	] */
  useEffect(() => {
    const newState = {
      ...pageData,
      reactTable: {
        ...pageData?.reactTable,
        actions: [
          {
            actionName: t("general>eliminar", "Eliminar"),
            actionFunction: () => {
              handleDelete(
                data
                  .filter((e) => e.checked === true)
                  .map((item) => item?.id)
              )
            }
          }
        ]
      }
    }

    if (data?.length > 0) {
      setPageData(newState)
    }
  }, [data])

  const mapFunctionObj = {
    nroFinca: (item) =>
      item.solucion[
        '1_1b6b5c16-50fe-ce50-0231-c94a00afcdbc_cf26b7c5-10fe-8d21-76de-6f95be7e83b8_col'
      ],
    nroPlano: (item) =>
      item.solucion[
        '1_12c3dcbc-65ec-7dd4-43a0-2a1024143a5a_cf26b7c5-10fe-8d21-76de-6f95be7e83b8_col'
      ],
    ubicacionGeografica: (item) => {
      return `
      ${item.solucion['10']}, 
      ${item.solucion['12']}
      `
    },
    registralOwner: (item) =>
      listasPredefinidas
        .find((el) => el.id == 'duenioRegistral')
        .options.find(
          (el) =>
            el.id ==
						item.solucion[
						  '05d61179-ef1b-86bc-8013-3aa551e0bfdd_d1de4078-3068-0253-e6e3-aa3e9a80fe07_col'
						]
        ).nombre,
    descripcion: (item) =>
      item.solucion[
        'e1e2d320-d484-0954-3339-f862f222f703_cf26b7c5-10fe-8d21-76de-6f95be7e83b8_col'
      ],
    edificaciones: (item) => 'Edificaciones'
  }

  const postData = async (data, editData = false) => {
    const lastId = await axios.get(
			`${envVariables.BACKEND_URL}/api/ExpedienteCentroEducativo/FormularioCentro/${state.auth.currentInstitution.id}/LastIdentificacionTerreno/terreno`
    )
    const newSolution = JSON.parse(data.solucion)
    newSolution[
      '4927bd91-a550-895b-bc68-e3e8a07a6473_cf26b7c5-10fe-8d21-76de-6f95be7e83b8_col'
    ] = parseInt(lastId.data || 0) + 1

    const _data = {
      ...data,
      solucion: JSON.stringify(newSolution),
      institucionId: state.auth.currentInstitution.id,
      formularioCategoriaId: formResponse.formularioCategoriaId
    }
    try {
      const response = await axios.post(
				`${envVariables.BACKEND_URL}${expedienteBaseUrl}FormularioCentro`,
				_data
      )
      getAndParseItems()

      return { error: false, data: response.data }
    } catch (e) {
      getAndParseItems()
      return { error: true }
    }
  }

  const handleChangeSelectAll = (e) => {
    const newState = data?.map((item) => {
      return { ...item, checked: e }
    })
    setData(newState)
    setIsAllChecked(e)
  }

  return (
    <>
      <JSONFormParser
        pageData={pageData}
        mapFunctionObj={mapFunctionObj}
        postData={postData}
        putData={putData}
        deleteData={delteteData}
        handleChangeSelectAll={handleChangeSelectAll}
        checked={isAllChecked}
        data={data}
        readOnlyFields={[
				  '4927bd91-a550-895b-bc68-e3e8a07a6473_cf26b7c5-10fe-8d21-76de-6f95be7e83b8_col'
        ]}
        statusColor={(item) => (true ? 'primary' : 'light')}
      />
      <SimpleModal
        openDialog={modal}
        onClose={closeModal}
        onConfirm={() => {
				  closeModal()
        }}
        txtBtn='Aceptar'
        msg={`La información de la Sección: Terreno, solamente debe ser completada por aquellos centros educativos que poseen terrenos (son dueños) o por centros educativos que utilizan terrenos de otras instancia del estado.

                Si su centro educativo utiliza el terreno de otro centro educativo, NO es necesario que complete la información de terrenos. `}
        title='Terrenos'
        btnCancel={false}
      />
    </>
  )
}

export default Terrenos
