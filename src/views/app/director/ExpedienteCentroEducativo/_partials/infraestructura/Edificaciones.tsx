import React, { useEffect, useState, useMemo } from 'react'
import JSONFormParser from '../../../../../../components/JSONFormParser/JSONFormParser.tsx'
import {
  PageData,
  FormResponse
} from '../../../../components/JSONFormParser/Interfaces.ts'
import axios from 'axios'
import { envVariables } from '../../../../../../constants/enviroment'
import { useSelector } from 'react-redux'
import { expedienteBaseUrl } from '../../../_partials/expetienteBaseUrl.ts'
import {
  Modal,
  ModalBody,
  ModalHeader,
  CustomInput,
  Button,
  ButtonDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from 'reactstrap'
import { useWindowSize } from 'react-use'
import swal from 'sweetalert'
import {
  DeleteFormResponses,
  CreateNewFormResponse,
  UpdateFormResponse
} from '../../../../../../redux/formularioCentroResponse/actions'
import styled from 'styled-components'
import IntlMessages from 'Helpers/IntlMessages'
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos'
import HTMLTable from 'Components/HTMLTable'
import SimpleModal from 'Components/Modal/simple'
import { TableReactImplementation } from 'Components/TableReactImplementation'
import Tooltip from '@mui/material/Tooltip'
import colors from '../../../../../../assets/js/colors'
import { Edit, Delete } from '@material-ui/icons'
import { useTranslation } from 'react-i18next'


const Edificaciones: React.FC = (props) => {
  const { t } = useTranslation()
  const [pageData, setPageData] = useState<PageData | object>({ layouts: [] })
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [formResponse, setFormResponse] = useState<FormResponse | object>()
  const [data, setData] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [editable, setEditable] = useState(false)
  const [terrenoId, setTerrenoId] = useState(null)
  const [terrenos, setTerrenos] = useState([])
  const [showError, setShowError] = useState(false)
  const [terrenoIdentificacion, setTerrenoIdentificacion] = useState(null)
  const { width } = useWindowSize()
  const [modal, setModal] = useState(false)
  const [selectedDR, setSelectedDR] = React.useState([])
  const [dropdownSplitOpen, setDropdownSplitOpen] = React.useState(false)
  const toggleSplit = () => {
    setDropdownSplitOpen(!dropdownSplitOpen)
  }
  const state = useSelector((store) => {
    return {
      auth: store.authUser
    }
  })

  const getAndParseTerrenos = async () => {
    const responseDataStored = await axios.get(
			`${envVariables.BACKEND_URL}${expedienteBaseUrl}FormularioCentro/GetAllByInstitucionAndFormName/${state.auth.currentInstitution.id}/terreno`
    )
    const terrenosArray = []
    const _data = responseDataStored.data.map((item) => {
      return { ...item, solucion: JSON.parse(item.solucion) }
    })
    let i = 0
    for await (const terreno of _data) {
      try {
        const province = await axios.get(
					`${
						envVariables.BACKEND_URL
					}/api/Provincia/GetById/${terreno.solucion['5']?.trim()}`
        )
        const canton = await axios.get(
					`${
						envVariables.BACKEND_URL
					}/api/Canton/GetById/${terreno.solucion['6']?.trim()}`
        )
        const distrito = await axios.get(
					`${
						envVariables.BACKEND_URL
					}/api/Distrito/GetById/${terreno.solucion['7']?.trim()}`
        )
        const poblado = await axios.get(
					`${
						envVariables.BACKEND_URL
					}/api/poblado/GetById/${terreno.solucion['8']?.trim()}`
        )
        terrenosArray[i] = {
          ...terreno,
          province: province.data.nombre,
          canton: canton.data.nombre,
          distrito: distrito.data.nombre,
          poblado: poblado.data.nombre
        }
        i++
      } catch (e) {
        terrenosArray[i] = {
          ...terreno
        }
      }
    }
    setTerrenos(terrenosArray)
  }
  const closeModal = () => {
    setModal(false)
  }

  const getAndParseItems = async () => {
    const responseDataStored = await axios.get(
			`${envVariables.BACKEND_URL}${expedienteBaseUrl}FormularioCentro/GetAllByInstitucionAndFormName/${state.auth.currentInstitution.id}/edificacion`
    )

    setData(
      responseDataStored.data.map((item) => {
        const _item = JSON.parse(item.solucion)
        return {
          ...item,
          solucion: _item,
          codigo: _item[edificacionesNamesToIds.codigo],
          terrenoAsociado:
						_item[edificacionesNamesToIds.terrenoAsociado]
        }
      })
    )
  }

  const deleteData = async (items) => {
    const response = DeleteFormResponses(items.id ? [items.id] : items)
    getAndParseItems()
  }
  const handleDelete = (items) => {
    swal({
      title: 'Eliminar',
      text: `¿Esta seguro de que desea eliminar ${
				items.length === 1 || items.id ? 'el' : 'los'
			} registro${items.length === 1 || items.id ? '' : 's'}?`,
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
        items.forEach(async (value) => {
          const response = await DeleteFormResponses(
            value ? [value] : value
          )
          getAndParseItems()
        })
      }
    })
  }
  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await axios.get(
					`${envVariables.BACKEND_URL}${expedienteBaseUrl}Formulario/GetByName/edificacion`
        )
        getAndParseItems()
        getAndParseTerrenos()
        setPageData(JSON.parse(response.data.formulario))
      } catch (e) {
        setPageData({})
        setData([])
      }
    }
    loadData()
  }, [state.auth.currentInstitution])

  const postData = async (data) => {
    const lastId = await axios.get(
			`${envVariables.BACKEND_URL}/api/ExpedienteCentroEducativo/FormularioCentro/${state.auth.currentInstitution.id}/LastIdentificacionTerreno/edificacion`
    )
    const newSolution = JSON.parse(data.solucion)
    const lastIdInt = parseInt(lastId.data || 0)
    newSolution[
      '4927bd91-a550-895b-bc68-e3e8a07a6473_cf26b7c5-10fe-8d21-76de-6f95be7e83b8_col'
    ] = isNaN(lastIdInt) ? 1 : lastIdInt + 1
    const response = await CreateNewFormResponse({
      solucion: JSON.stringify({ ...newSolution, terrenoId }),
      institucionId: state.auth.currentInstitution.id,
      formularioCategoriaId: 2
    })
    getAndParseItems()
    resetState()
    return response
  }

  const putData = async (data) => {
    const response = await UpdateFormResponse({
      ...data,
      id: formResponse.id
    })
    getAndParseItems()
    resetState()
    return response
  }

  const columns1 = [
    { column: 'codigo', label: 'Código', width: 33.33, sum: 1.67 },
    { column: 'terrenoAsociado', label: 'Terreno Asociado' }
  ]
  const columns = useMemo(() => {
    return [
      {
        label: '',
        column: 'id',
        accessor: 'id',
        Header: '',
        Cell: ({ row }) => {
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
                onClick={(e) => {
								  e.stopPropagation()
								  if (selectedDR.includes(row.original.id)) {
								    const i = selectedDR.indexOf(
								      row.original.id
								    )
								    selectedDR.splice(i, 1)

								    setSelectedDR([...selectedDR])
								  } else {
								    selectedDR.push(row.original.id)
								    setSelectedDR([...selectedDR])
								  }
                }}
                checked={
									(selectedDR?.length === row?.length &&
										row?.length > 0) ||
									selectedDR?.includes(row.original.id)
								}
              />
            </div>
          )
        }
      },
      {
        Header: t('expediente_ce>infraestructura>edificaciones>columna_codigo', 'Código'),
        column: 'codigo',
        accessor: 'codigo',
        label: ''
      },
      {
        Header: t('expediente_ce>infraestructura>edificaciones>columna_terrenoAsociado', 'Terreno asociado'),
        column: 'terrenoAsociado',
        accessor: 'terrenoAsociado',
        label: ''
      },

      {
        Header: t('expediente_ce>infraestructura>edificaciones>columna_acciones', 'Acciones'),
        column: '',
        accessor: '',
        label: '',
        Cell: ({ cell, row, data }) => {
          const fullRow = data[row.index]
          return (
            <div className='d-flex justify-content-center align-items-center'>
              <Tooltip title='Editar'>
                <Edit
                  className='mr-2'
                  style={{
									  cursor: 'pointer',
									  color: colors.darkGray
                  }}
                  onClick={async () => {
									  const r = {
									    id: fullRow.id,
									    ...fullRow.solucion
									  }
									  await setFormResponse(r)
									  setShowForm(true)
                  }}
                />
              </Tooltip>

              <Tooltip title='Eliminar'>
                <Delete
                  style={{
									  cursor: 'pointer',
									  color: colors.darkGray
                  }}
                  onClick={() => {
									  deleteData(fullRow)
                  }}
                />
              </Tooltip>
            </div>
          )
        }
      }
    ]
  }, [selectedDR,t])

  const actions = [
    {
      actionName: 'button.remove',
      actionFunction: (e) => {
        deleteData(e)
      }
    }
  ]
  const actionRow = [
    {
      actionName: 'label.edit',
      actionFunction: async (element) => {
        const r = { id: element.id, ...element.solucion }
        await setFormResponse(r)
        setShowForm(true)
      },
      actionDisplay: () => true
    },
    {
      actionName: 'button.remove',
      actionFunction: (e) => {
        deleteData(e)
      },
      actionDisplay: () => true
    }
  ]

  const toggleAddNewModal = () => {
    setModal(!isOpen)
    setIsOpen(false)
    setShowError(false)
  }

	enum terrenosNamesToIds {
		nroFinca = '1_1b6b5c16-50fe-ce50-0231-c94a00afcdbc_cf26b7c5-10fe-8d21-76de-6f95be7e83b8_col',
		plano = '1_12c3dcbc-65ec-7dd4-43a0-2a1024143a5a_cf26b7c5-10fe-8d21-76de-6f95be7e83b8_col',
		descripcion = 'e1e2d320-d484-0954-3339-f862f222f703_cf26b7c5-10fe-8d21-76de-6f95be7e83b8_col',
		direccion = '36b16bf1-18de-46a6-fe8f-4399ca0245fe_25c814d4-7189-0703-1b14-45fc1d7b5643_col:'
	}

	enum edificacionesNamesToIds {
		codigo = '4927bd91-a550-895b-bc68-e3e8a07a6473_cf26b7c5-10fe-8d21-76de-6f95be7e83b8_col',
		terrenoAsociado = '1_4d8801e7-4e64-b8bc-3fa2-5f029bade93d_3de69386-8f6e-c38b-f3eb-1ab857b46305_col'
	}

	const resetState = () => {
	  setShowForm(false)
	  setTerrenoId(null)
	  setTerrenoIdentificacion(null)
	  setEditable(false)
	  setFormResponse()
	}

	return (
  <div>
    <br />
    <p>
      {t('expediente_ce>infraestructura>edificaciones>titulo', 'En este módulo se describirán con detalle cada una de las edificaciones que componen el centro educativo')}
    </p>
    <br />
    {showForm && (
      <NavigationContainer
        onClick={(e) => {
					  resetState()
        }}
      >
        <ArrowBackIosIcon />
        <h4>
          <IntlMessages id='pages.go-back-home' />
        </h4>
      </NavigationContainer>
    )}
    {!showForm && (
      <div
        style={{
					  display: 'flex',
					  justifyContent: 'flex-end'
        }}
      >
        <Button color='primary' onClick={toggleAddNewModal}>
          {' '}
          {t('boton>general>agregrar', 'Agregar')}
          {' '}
        </Button>

        <StyledButtonDropdown
          isOpen={dropdownSplitOpen}
          toggle={toggleSplit}
          disabled={!editable}
        >
          <div className='btn btn-primary btn-lg pl-4 pr-0 check-button check-all'>
            <CustomInput
              className='custom-checkbox mb-0 d-inline-block'
              type='checkbox'
              id='checkAll'
              onClick={(e) => {
								  e.stopPropagation()

								  if (selectedDR?.length === data?.length) {
								    selectedDR.splice(0, selectedDR.length)
								    setSelectedDR([...selectedDR])
								  } else {
								    data.forEach(function (row, index) {
								      if (!selectedDR.includes(row.id)) {
								        selectedDR.push(row.id)
								        setSelectedDR([...selectedDR])
								      }
								    })
								  }
              }}
              checked={
									selectedDR?.length === data?.length &&
									data?.length > 0
								}
            />
          </div>
          <DropdownToggle
            caret
            color='primary'
            className='dropdown-toggle-split btn-lg'
          />
          <DropdownMenu right>
            <DropdownItem
              onClick={() => {
								  if (selectedDR?.length > 0) { handleDelete(selectedDR) }
              }}
            >
              {t("general>eliminar", "Eliminar")}
            </DropdownItem>
          </DropdownMenu>
        </StyledButtonDropdown>
      </div>
    )}
    {/* {!showForm && (
				<HTMLTable
					columns={columns1}
					useAllSearchParams={true}
					selectDisplayMode="datalist"
					data={data}
					showHeaders={true}
					loading={false}
					actions={actions}
					actionRow={actionRow}
					listPageHeading={false}
					isBreadcrumb={false}
					labelSearch={false}
					modalfooter={true}
					orderBy={false}
					toggleModal={toggleAddNewModal}
					toggleEditModal={async (element) => {
						const r = { id: element.id, ...element.solucion }
						await setFormResponse(r)
						setShowForm(true)
					}}
					showHeadersCenter={false}
					disableSearch={false}
					roundedStyle={true}
				/>
			)} */}
    {!showForm ? (
      <TableReactImplementation
        data={data}
        handleGetData={() => {}}
        columns={columns}
        orderOptions={[]}
      />
    ) : (
      <JSONFormParser
        pageData={pageData}
        postData={postData}
        putData={putData}
        dataForm={
						formResponse || {
						  '1_4d8801e7-4e64-b8bc-3fa2-5f029bade93d_3de69386-8f6e-c38b-f3eb-1ab857b46305_col':
								terrenoIdentificacion
						}
					}
					// setEditable={setEditable}
        readOnlyFields={[
					  '1_4d8801e7-4e64-b8bc-3fa2-5f029bade93d_3de69386-8f6e-c38b-f3eb-1ab857b46305_col',
					  '4927bd91-a550-895b-bc68-e3e8a07a6473_cf26b7c5-10fe-8d21-76de-6f95be7e83b8_col'
        ]}
        data={[]}
      />
    )}
    <Modal isOpen={isOpen} toggle={toggleAddNewModal} size='lg'>
      <ModalHeader>
        <div>
          Asociar terreno
          {showError && (
            <FormFeedbackSpan>
              Debe seleccionar un terreno
            </FormFeedbackSpan>
          )}
        </div>
      </ModalHeader>
      <ModalBody>
        {width > 1000 && (
          <Terreno width={width}>
            <div />
            <p>N. de Finca</p>
            <p>N. de Plano</p>
            <p>Descripción</p>
            <p>Provincia/Canton/Distrito</p>
          </Terreno>
        )}
        {terrenos.map((item) => {
					  return (
  <Terreno
    width={width}
    onClick={() => {
								  setTerrenoId(item.id)
								  setTerrenoIdentificacion(
								    item.solucion[
								      '1_1b6b5c16-50fe-ce50-0231-c94a00afcdbc_cf26b7c5-10fe-8d21-76de-6f95be7e83b8_col'
								    ]
								  )
    }}
  >
    <CustomInput
      type='radio'
      checked={terrenoId === item.id}
    />
    <p>
      {item.solucion[terrenosNamesToIds.nroFinca]}
    </p>
    <p>{item.solucion[terrenosNamesToIds.plano]}</p>
    <p>
      {
										item.solucion[
										  terrenosNamesToIds.descripcion
										]
									}
    </p>
    <p>{`${item.province}/${item.canton}/${item.distrito}`}</p>
  </Terreno>
					  )
        })}
        <ButtonRow>
          <Button
            color='primary'
            outline
            onClick={() => {
							  toggleAddNewModal()
            }}
          >
            Cancelar
          </Button>
          <Button
            color='primary'
            onClick={() => {
							  if (terrenoId) {
							    toggleAddNewModal()
							    setShowForm(true)
							    setEditable(true)
							  } else {
							    setShowError(true)
							  }
            }}
          >
            Siguiente
          </Button>
        </ButtonRow>
      </ModalBody>
    </Modal>

    <SimpleModal
      openDialog={modal}
      onClose={closeModal}
      onConfirm={() => {
				  closeModal()
				  setIsOpen(!isOpen)
      }}
      txtBtn='Aceptar'
      msg={`Estimado usuario:
        La información de la Sección: Edificaciones solamente debe ser completada por aquellos centros educativos que poseen edificios en sus terrenos o por centros educativos que utilizan edificaciones de otras instancia del estado.
        Si su centro educativo utiliza el edificio de otro centro educativo, NO es necesario que complete la información de edifcaciones. `}
      title='Edificaciones'
      btnCancel={false}
    />
  </div>
	)
}

const Terreno = styled.div`
	display: grid;
	grid-template-columns: ${(props) =>
		props.width > 1000 ? '5% 20% 20% 20% 35%' : '40% 40% 40%'};
`

const FormFeedbackSpan = styled.span`
	color: red;
`

const ButtonRow = styled.div`
	display: flex;
	width: 100%;
	justify-content: center;
	align-items: center;

	button {
		margin: 10px;
	}
`
const StyledButtonDropdown = styled(ButtonDropdown)`
	margin-left: 10px;
	margin-right: 10px;
`

const NavigationContainer = styled.span`
	display: flex;
	cursor: pointer;
`

export default Edificaciones
