import React, { useState, useEffect } from 'react'

import { useSelector } from 'react-redux'
import {
  getInstitutionSedes,
  updateInstitucion
} from '../../../../../../redux/institucion/actions'
import { useActions } from 'Hooks/useActions'
import JSONFormParser from 'Components/JSONFormParser/JSONFormParser.tsx'
import { GetByName } from 'Redux/formularios/actions'
import moment from 'moment'
import { GetInstitucion } from 'Redux/institucion/actions'
import {
  CreateNewFormResponse,
  GetResponseByInstitutionAndFormName,
  UpdateFormResponse
} from '../../../../../../redux/formularioCentroResponse/actions'
import Loader from 'Components/Loader'
import DateYear from 'Components/JSONFormParser/InputTypes/DateYear'
import { Modal, ModalBody, Input, ModalFooter, Button, Label } from 'reactstrap'
import Datetime from 'react-datetime'
import useNotification from 'Hooks/useNotification'
import { guidGenerator } from 'Utils/GUIDGenerator'
import { useTranslation } from 'react-i18next'

const PerfilCentro = (props) => {
  const { t } = useTranslation()
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState([])
  const [pageDataProfile, setPageDataProfile] = useState<PageData | object>({
    layouts: []
  })
  const [formResponse, setFormResponse] = useState<FormResponse | object>({})
  const [loadingRequest, setLoadingRequest] = useState<boolean>(false)
  const [openModal, setOpenModal] = useState(false)
  const [snackbar, handleClick] = useNotification()
  const [selectedRow, setSelectedRow] = useState(null)
  const [selectedIds, setSelectedIds] = useState([])
  const [snackBarContent, setSnackbarContent] = useState({
    variant: '',
    msg: ''
  })
  const state = useSelector((store) => {
    return {
      currentInstitution: store.authUser.currentInstitution,
      institucionWithAditionalData: store.institucion.currentInstitution
    }
  })

  const actions = useActions({
    getInstitutionSedes,
    GetInstitucion,
    updateInstitucion
  })

	enum InputIdsToNames {
		'efd0551c-9f30-7272-7197-af237e4a47f6_3659521e-4836-64b1-6fe6-9dcbe094ceec_col' = 'nombre',
		'8606bdfc-65ef-cae4-1ac2-245c53bf7830_3659521e-4836-64b1-6fe6-9dcbe094ceec_col' = 'codigo',
		'11e93d66-3ed8-6589-b6a2-5e83f74b9ba1_3659521e-4836-64b1-6fe6-9dcbe094ceec_col' = 'conocidoComo',
		'fec333b1-72d4-89a2-5970-41e879e18957_3659521e-4836-64b1-6fe6-9dcbe094ceec_col' = 'fechaFundacion',
		'563ac934-869c-9ab6-a412-bdefcea0cfa7_c87e762b-9ebc-522f-f7b6-516bae11c3a1_col' = 'motivoEstado',
		'cb2835f7-9818-93a6-92cb-c12e99ff7889_3659521e-4836-64b1-6fe6-9dcbe094ceec_col' = 'imagen',
		'59eb23f9-79f4-6f17-8cac-7118cd0b6e52_3659521e-4836-64b1-6fe6-9dcbe094ceec_col' = 'historia',
		'5e4427ca-42ae-3369-64c3-e3cb10880a68_c4f172cf-8f80-999e-c5e7-a95cfbdc60b1_col' = 'mision',
		'ad393433-9495-4827-8ce9-5ea86d33fd1f_c4f172cf-8f80-999e-c5e7-a95cfbdc60b1_col' = 'vision',
		'b305f83a-1ee4-8978-78e4-0c951771568a_3659521e-4836-64b1-6fe6-9dcbe094ceec_col' = 'elementosCatalogosIds'
	}

	enum NamesToInputIds {
		nombre = 'efd0551c-9f30-7272-7197-af237e4a47f6_3659521e-4836-64b1-6fe6-9dcbe094ceec_col',
		codigo = '8606bdfc-65ef-cae4-1ac2-245c53bf7830_3659521e-4836-64b1-6fe6-9dcbe094ceec_col',
		conocidoComo = '11e93d66-3ed8-6589-b6a2-5e83f74b9ba1_3659521e-4836-64b1-6fe6-9dcbe094ceec_col',
		fechaFundacion = 'fec333b1-72d4-89a2-5970-41e879e18957_3659521e-4836-64b1-6fe6-9dcbe094ceec_col',
		motivoEstado = '563ac934-869c-9ab6-a412-bdefcea0cfa7_c87e762b-9ebc-522f-f7b6-516bae11c3a1_col',
		imagen = 'cb2835f7-9818-93a6-92cb-c12e99ff7889_3659521e-4836-64b1-6fe6-9dcbe094ceec_col',
		historia = '59eb23f9-79f4-6f17-8cac-7118cd0b6e52_3659521e-4836-64b1-6fe6-9dcbe094ceec_col',
		mision = '5e4427ca-42ae-3369-64c3-e3cb10880a68_c4f172cf-8f80-999e-c5e7-a95cfbdc60b1_col',
		vision = 'ad393433-9495-4827-8ce9-5ea86d33fd1f_c4f172cf-8f80-999e-c5e7-a95cfbdc60b1_col',
		elementosCatalogosIds = 'b305f83a-1ee4-8978-78e4-0c951771568a_3659521e-4836-64b1-6fe6-9dcbe094ceec_col'
	}

	useEffect(() => {
	  const loadData = async () => {
	    setLoading(true)
	    try {
	      const form = await GetByName('perfildelcentro')
	      await actions.GetInstitucion(state.currentInstitution?.id)
	      const response = await GetResponseByInstitutionAndFormName(
	        state.currentInstitution?.id,
	        'perfildelcentro'
	      )
	      setFormResponse(
	        response.solucion
	          ? { ...JSON.parse(response.solucion), id: response?.id }
	          : {}
	      )
	      setPageDataProfile(form.formulario)
	    } catch (e) {
	      setPageDataProfile({ layouts: [] })
	      setData([])
	    }
	    setLoading(false)
	  }

	  loadData()
	}, [state.currentInstitution?.id])

	const getDataToTable = (dataSolucionParsed) => {
	  return {
	    [NamesToInputIds.mision]:
				dataSolucionParsed[NamesToInputIds.mision],
	    [NamesToInputIds.historia]:
				dataSolucionParsed[NamesToInputIds.historia],
	    [NamesToInputIds.vision]:
				dataSolucionParsed[NamesToInputIds.vision],
	    [NamesToInputIds.nombre]:
				dataSolucionParsed[NamesToInputIds.nombre],
	    [NamesToInputIds.codigo]:
				dataSolucionParsed[NamesToInputIds.codigo],
	    [NamesToInputIds.conocidoComo]:
				dataSolucionParsed[NamesToInputIds.conocidoComo],
	    [NamesToInputIds.fechaFundacion]:
				dataSolucionParsed[NamesToInputIds.fechaFundacion],
	    [NamesToInputIds.imagen]:
				dataSolucionParsed[NamesToInputIds.imagen],
	    [NamesToInputIds.elementosCatalogosIds]:
				dataSolucionParsed[NamesToInputIds.elementosCatalogosIds]
				  .options
	  }
	}

	const postData = async (data, editData = false) => {
	  setLoadingRequest(true)
	  const dataSolucionParsed = JSON.parse(data.solucion)
	  const dataToTable = getDataToTable(dataSolucionParsed)
	  const dataTotableParsedPutData = {
	    ...state.currentInstitution,
	    codigo: state.institucionWithAditionalData.codigo,
	    codigosCatalogosRelacionadosVista: [20]
	  }
	  Object.keys(dataToTable).forEach((key) => {
	    if (InputIdsToNames[key]) {
	      if (
	        dataToTable[key]?.type === 'file' &&
					dataToTable[key].files[0]
	      ) {
	        dataTotableParsedPutData[InputIdsToNames[key]] =
						dataToTable[key].files[0].url
	      } else {
	        dataTotableParsedPutData[InputIdsToNames[key]] =
						dataToTable[key]
	      }
	    }
	  })

	  const newData = {
	    ...dataSolucionParsed,
	    tablesData: formResponse?.tablesData
	  }
	  const response = await CreateNewFormResponse({
	    solucion: JSON.stringify(newData),
	    institucionId: state.currentInstitution?.id,
	    formularioCategoriaId: 4
	  })
	  await actions.updateInstitucion({
	    ...dataTotableParsedPutData,
	    codigo: state.institucionWithAditionalData.codigo,
	    fechaFundacion:
				state.institucionWithAditionalData.fechaFundacion,
	    nombre: state.institucionWithAditionalData.nombre
	  })
	  const responseData = await GetResponseByInstitutionAndFormName(
	    state.currentInstitution?.id,
	    'perfildelcentro'
	  )
	  setFormResponse(
	    responseData.solucion
	      ? { ...JSON.parse(responseData.solucion), id: responseData?.id }
	      : {}
	  )
	  await actions.GetInstitucion(state.currentInstitution?.id)
	  setLoadingRequest(false)
	  return response
	}

	const putData = async (data) => {
	  setLoadingRequest(true)
	  const dataSolucionParsed = JSON.parse(data.solucion)
	  const dataToTable = getDataToTable(dataSolucionParsed)
	  const dataTotableParsedPutData = {
	    ...state.currentInstitution,
	    codigosCatalogosRelacionadosVista: [20]
	  }
	  Object.keys(dataToTable).forEach((key) => {
	    if (InputIdsToNames[key]) {
	      if (
	        dataToTable[key]?.type === 'file' &&
					dataToTable[key].files[0]
	      ) {
	        dataTotableParsedPutData[InputIdsToNames[key]] =
						dataToTable[key].files[0].url
	      } else {
	        dataTotableParsedPutData[InputIdsToNames[key]] =
						dataToTable[key]
	      }
	    }
	  })

	  const newData = {
	    ...dataSolucionParsed,
	    tablesData: formResponse?.tablesData
	  }

	  const response = await UpdateFormResponse({
	    solucion: JSON.stringify(newData),
	    id: formResponse?.id
	  })
	  await actions.updateInstitucion({
	    ...dataTotableParsedPutData,
	    codigo: state.institucionWithAditionalData.codigo,
	    fechaFundacion:
				state.institucionWithAditionalData.fechaFundacion,
	    nombre: state.institucionWithAditionalData.nombre
	  })
	  const responseData = await GetResponseByInstitutionAndFormName(
	    state.currentInstitution?.id,
	    'perfildelcentro'
	  )
	  setFormResponse(
	    responseData.solucion
	      ? { ...JSON.parse(responseData.solucion), id: responseData?.id }
	      : {}
	  )
	  await actions.GetInstitucion(state.currentInstitution?.id)
	  setLoadingRequest(false)
	  return response
	}

	const tableData = React.useMemo(() => {
	  if (formResponse.tablesData) {
	    return formResponse.tablesData[
	      'b3fb33ee-2edb-08ab-7036-dedf39842580_96c5299f-ccfa-1b21-c16e-106d6a160dbf_col'
	    ].map((el) => {
	      const newItem = {}

	      el.columnValues.forEach((item) => {
	        newItem[item?.id] = item.value
	      })
	      return {
	        ...newItem,
	        id: el?.id,
	        selected: selectedIds.includes(el?.id)
	      }
	    })
	  } else {
	    return []
	  }
	}, [formResponse, selectedIds])
	if (pageDataProfile && pageDataProfile.contents) {
	  pageDataProfile.contents.forEach((el, index) => {
	    if (
	      el?.layoutId === '96c5299f-ccfa-1b21-c16e-106d6a160dbf_col' &&
				el?.fields[0]?.id ===
					'b3fb33ee-2edb-08ab-7036-dedf39842580_96c5299f-ccfa-1b21-c16e-106d6a160dbf_col'
	    ) {
	      pageDataProfile.contents[index].fields[0] = {
	        ...pageDataProfile.contents[index].fields[0],
	        config: {
	          ...pageDataProfile?.contents[index]?.fields[0]?.config,
	          data: tableData,
	          onSubmitAddButton: () => {
	            setOpenModal(true)
	          },
	          onDelete: (row) => {
	            const newTableData =
								formResponse.tablesData[
								  'b3fb33ee-2edb-08ab-7036-dedf39842580_96c5299f-ccfa-1b21-c16e-106d6a160dbf_col'
								]
	            setFormResponse({
	              ...formResponse,
	              tablesData: {
	                ...formResponse?.tablesData,
	                'b3fb33ee-2edb-08ab-7036-dedf39842580_96c5299f-ccfa-1b21-c16e-106d6a160dbf_col':
										newTableData.filter(
										  (el) => el?.id !== row.id
										)
	              }
	            })
	          },
	          onEdit: (row) => {
	            setOpenModal(true)
	            setSelectedRow(row)
	            const year = new Date().setFullYear(
	              row['64c2caad-504d-84b6-3f90-7512101f2d80']
	            )

	            setLogro(
	              row['fc51bda7-47a2-cdd2-c182-2f447c87fe1d']
	            )
	            setSelectedDate(new Date(year))
	          },
	          onSelect: (row) => {
	            if (selectedIds.includes(row.id)) {
	              setSelectedIds(
	                selectedIds.filter((el) => el !== row.id)
	              )
	            } else {
	              setSelectedIds([...selectedIds, row.id])
	            }
	          },
	          handleChangeSelectAll: () => {
	            if (selectedIds?.length < tableData?.length) {
	              setSelectedIds(tableData.map((el) => el.id))
	            } else {
	              setSelectedIds([])
	            }
	          },
	          actions: [
	            {
	              actionFunction: () => {
	                const newTableData =
										formResponse.tablesData[
										  'b3fb33ee-2edb-08ab-7036-dedf39842580_96c5299f-ccfa-1b21-c16e-106d6a160dbf_col'
										]
	                setFormResponse({
	                  ...formResponse,
	                  tablesData: {
	                    ...formResponse?.tablesData,
	                    'b3fb33ee-2edb-08ab-7036-dedf39842580_96c5299f-ccfa-1b21-c16e-106d6a160dbf_col':
												newTableData.filter(
												  (el) =>
												    !selectedIds.includes(
												      el.id
												    )
												)
	                  }
	                })
	              },
	              actionName: 'Eliminar'
	            }
	          ]
	        }
	      }
	    }
	  })
	}

	const [selectedDate, setSelectedDate] = useState(null)
	const [logro, setLogro] = useState(null)

	const onChange = (e) => {
	  setSelectedDate(e)
	}

	return (
  <div>
    {snackbar(snackBarContent.variant, snackBarContent.msg)}
    <Modal isOpen={openModal} toggle={() => setOpenModal(false)}>
      <ModalBody>
        <div className='d-flex justify-content-between align-items-center'>
          <div style={{ width: '65%' }}>
            <Label>{t('expediente_ce>informacion_general>perfil>logros>columna_logro', 'Logro')}</Label>
            <Input
              type='text'
              name='logro'
              value={logro}
              required={logro?.length === 0}
              invalid={logro?.length === 0}
              onChange={(e) => {
								  setLogro(e.target.value)
              }}
            />
          </div>
          <div
            style={{
							  width: '30%'
            }}
          >
            <Label>{t('expediente_ce>informacion_general>perfil>logros>columna_año', 'Año')}</Label>
            <Datetime
              closeOnSelect
              inputProps={{
								  disabled: props.editable,
								  required: !selectedDate,
								  invalid: !selectedDate
              }}
              dateFormat='YYYY'
              timeFormat={false}
              onChange={(e) => {
								  const aux =
										String(e?.valueOf())?.length >= 4
										  ? e?.valueOf()
										  : null
								  const date = new Date(aux)
								  const year = date.getFullYear()
								  setSelectedDate(aux || null)
              }}
              value={selectedDate}
            />
          </div>
        </div>
      </ModalBody>
      <ModalFooter>
        <div className='d-flex justify-content-center align-items-center w-100 w-full'>
          <Button
            color='primary'
            outline
            className='mr-3'
            onClick={(e) => {
							  setOpenModal(false)
            }}
          >
            {t('general>cancelar', 'Cancelar')}
          </Button>
          <Button
            color='primary'
            onClick={(e) => {
							  if (
							    !logro ||
									logro?.length === 0 ||
									!selectedDate
							  ) {
							    setSnackbarContent({
							      variant: 'error',
							      msg: t('general>campos_requeridos', 'Todos los campos son requeridos')
							    })
							    handleClick()
							    return
							  }
							  if (!selectedRow) {
							    setFormResponse({
							      ...formResponse,
							      tablesData: {
							        ...formResponse?.tablesData,
							        'b3fb33ee-2edb-08ab-7036-dedf39842580_96c5299f-ccfa-1b21-c16e-106d6a160dbf_col':
												[
												  ...formResponse?.tablesData[
												    'b3fb33ee-2edb-08ab-7036-dedf39842580_96c5299f-ccfa-1b21-c16e-106d6a160dbf_col'
												  ],
												  {
												    id: guidGenerator(),
												    columnValues: [
												      {
												        id: 'fc51bda7-47a2-cdd2-c182-2f447c87fe1d',
												        titulo: 'Logro',
												        value: logro
												      },
												      {
												        id: '64c2caad-504d-84b6-3f90-7512101f2d80',
												        value: new Date(
												          selectedDate
												        ).getFullYear(),
												        titulo: 'Año',
												        type: 'date'
												      }
												    ]
												  }
												]
							      }
							    })
							  } else {
							    const newTableData =
										formResponse.tablesData[
										  'b3fb33ee-2edb-08ab-7036-dedf39842580_96c5299f-ccfa-1b21-c16e-106d6a160dbf_col'
										]
							    const index = newTableData.findIndex(
							      (el) => el?.id === selectedRow?.id
							    )
							    if (index !== -1) {
							      newTableData[index] = {
							        ...newTableData[index],
							        columnValues: [
							          {
							            id: 'fc51bda7-47a2-cdd2-c182-2f447c87fe1d',
							            titulo: 'Logro',
							            value: logro
							          },
							          {
							            id: '64c2caad-504d-84b6-3f90-7512101f2d80',
							            value: new Date(
							              selectedDate
							            ).getFullYear(),
							            titulo: 'Año',
							            type: 'date'
							          }
							        ]
							      }
							      setFormResponse({
							        ...formResponse,
							        tablesData: {
							          ...formResponse?.tablesData,
							          'b3fb33ee-2edb-08ab-7036-dedf39842580_96c5299f-ccfa-1b21-c16e-106d6a160dbf_col':
													newTableData
							        }
							      })
							    }
							  }
							  setSelectedRow(null)
							  setLogro(null)
							  setSelectedDate(null)
							  setOpenModal(false)
            }}
          >
            {t('general>guardar', 'Guardar')}
          </Button>
        </div>
      </ModalFooter>
    </Modal>
    {!loading ? (
      <JSONFormParser
        pageData={pageDataProfile}
        mapFunctionObj={{}}
        postData={postData}
        putData={putData}
        deleteData={() => {}}
        readOnlyFields={[
					  NamesToInputIds.codigo,
					  NamesToInputIds.elementosCatalogosIds,
					  NamesToInputIds.nombre,
					  NamesToInputIds.fechaFundacion,
					  NamesToInputIds.conocidoComo
        ]}
        dataForm={{
					  ...formResponse,
					  [NamesToInputIds.nombre]:
							state.institucionWithAditionalData.nombre, // Nombre
					  [NamesToInputIds.codigo]:
							state.institucionWithAditionalData.codigo, // Código saber
					  [NamesToInputIds.conocidoComo]:
							state.institucionWithAditionalData.conocidoComo, // Conocido como
					  [NamesToInputIds.historia]:
							state.institucionWithAditionalData.historia, // Historia del centro
					  [NamesToInputIds.mision]:
							state.institucionWithAditionalData.mision, // Mision del centro
					  [NamesToInputIds.vision]:
							state.institucionWithAditionalData.vision, // Vision del centro
					  [NamesToInputIds.fechaFundacion]: moment(
					    state.institucionWithAditionalData.fechaFundacion
					  ).format('YYYY-MM-DD'), // fechaFundacion
					  [NamesToInputIds.motivoEstado]:
							state.institucionWithAditionalData.motivoEstado, // motivo de estado
					  [NamesToInputIds.elementosCatalogosIds]: {
					    type: 'multiSelect',
					    options: state.institucionWithAditionalData.datos
					      ?.filter((d) => d.codigoCatalogo == 20)
					      ?.map((e) => e.elementoId)
					  }
        }}
        data={data}
        statusColor={(item) => (true ? 'primary' : 'light')}
        readOnly={false}
        loadingRequest={loadingRequest}
      />
    ) : (
      <Loader />
    )}
  </div>
	)
}

export default PerfilCentro
