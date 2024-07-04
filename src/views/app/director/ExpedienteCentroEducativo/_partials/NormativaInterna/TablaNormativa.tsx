import React, { useState, useMemo, useEffect } from 'react'
import styled from 'styled-components'
import { TableReactImplementation } from 'Components/TableReactImplementation'
import {
  Button,
  Input,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter
} from 'reactstrap'
import './general.css'
import { IoMdTrash } from 'react-icons/io'
import { RiPencilFill } from 'react-icons/ri'
import ConfirmModal from 'Components/Modal/ConfirmModal'
import { useActions } from 'Hooks/useActions'
import {
  getFalta,
  deleteFalta,
  createFalta,
  updateFalta,
  getTipoFalta
} from '../../../../../../redux/NormativaInterna/actions'
import { useSelector } from 'react-redux'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import swal from 'sweetalert'
import Select from 'react-select'
import CustomSelectInput from 'Components/common/CustomSelectInput'
import { useTranslation } from 'react-i18next'

const TablaNormativa = () => {
  const { t } = useTranslation()
  const [confirmModal, setConfirmModal] = useState(false)
  const [confirmViewModal, setConfirmViewModal] = useState<
    '' | 'view-delete' | 'view-add'
  >('')
  const [modalOpen, setModalOpen] = useState<'' | 'see-edit' | 'see-add'>('')
  const [inputValues, setInputValues] = useState({
    id: 0,
    nombre: '',
    tipoFalta: 0,
    rangoInferior: 0,
    rangoSuperior: 5
  })
  const [isEdit, setEdit] = useState(false)
  const [listData, setListData] = useState([])
  const actions = useActions({
    getFalta,
    deleteFalta,
    createFalta,
    updateFalta,
    getTipoFalta
  })

  const state = useSelector((store: any) => {
    return {
      faltas: store.faltas.faltas,
      tiposFalta: store.faltas.tiposFalta,
      institution: store.authUser.currentInstitution
    }
  })

  useEffect(() => {
    if (state.faltas) {
      setListData(state.faltas)
    }
  }, [state.faltas])

  useEffect(() => {
    handleLoadFalta()
  }, [])

  const handleLoadFalta = async () => {
    await actions.getTipoFalta()
    await actions.getFalta(state.institution.id)
  }

  const toggle = (type: '' | 'see-edit' | 'see-add') => {
    if (type !== '' && type === modalOpen) {
      setModalOpen(type)
    } else {
      setModalOpen(type)
    }
  }

  const closeConfirmModal = () => {
    setConfirmModal(false)
    setConfirmViewModal('')
  }

  const onDeleteFalta = async () => {
    const response = await actions.deleteFalta(inputValues.id)

    if (!response.error) {
      setConfirmViewModal('view-delete')
      handleLoadFalta()
      closeConfirmModal()
      setInputValues(null)
    } else {
      swal({
        title: 'Error',
        text: response.data.error,
        icon: 'error',
        buttons: {
          ok: {
            text: t('general>aceptar', 'Aceptar'),
            value: true
          }
        }
      }).then((result) => {
        closeConfirmModal()
        setInputValues(null)
      })
    }
  }

  const addNewFalta = async () => {
    let response = null
    if (!inputValues.nombre || inputValues?.nombre?.trim() === '') return
    response = await actions.createFalta({
      id: inputValues.id,
      nombre: inputValues.nombre,
      sB_TipoFalta_id: inputValues.tipoFalta,
      rangoInferior: inputValues.rangoInferior,
      rangoSuperior: inputValues.rangoSuperior,
      sB_Instituciones_id: state.institution.id,
      institucional: true
    })

    if (response.error) {
      setConfirmViewModal('')
    } else {
      handleLoadFalta()
      setConfirmViewModal('view-add')
    }
    toggle('')
  }

  const onChangeSelect = (e) => {
    const tipoFalta = state.tiposFalta.find(
      (item) => item.id === Number(e.value)
    )
    setInputValues({
      ...inputValues,
      tipoFalta: Number(e.value),
      rangoInferior: tipoFalta?.rangoInferior,
      rangoSuperior: tipoFalta?.rangoSuperior
    })
  }

  const onChange = (e) => {
    setInputValues({
      ...inputValues,
      [e.target.name]: e.target.value
    })
  }

  const onDeleteEvent = (rowData) => {
    setConfirmModal(true)
    setInputValues(rowData)
  }

  const onEditEvent = async () => {
    const resp = await actions.updateFalta({
      id: inputValues.id,
      nombre: inputValues.nombre,
      sB_TipoFalta_id: inputValues.tipoFalta,
      sB_Instituciones_id: state.institution.id,
      estado: true,
      institucional: true
    })

    if (!resp.error) {
      handleLoadFalta()
      toggle('')
    } else {
      swal({
        title: 'Error',
        text: resp.data.error,
        icon: 'error',
        buttons: {
          ok: {
            text: t('general>aceptar', 'Aceptar'),
            value: true
          }
        }
      }).then((result) => {
        handleLoadFalta()
        toggle('')
      })
    }
  }

  const onViewModal = () => {
    setConfirmViewModal('')
  }

  const columns = useMemo(() => {
    return [
      {
        Header: 'id',
        column: 'id',
        accessor: 'id',
        label: '',
        show: false
      },
      {
        Header: t('expediente_ce>normativa_interna>agregar_falta>tipo_falta', 'Tipo de falta'),
        column: 'nivel',
        accessor: 'nivel',
        label: ''
      },
      {
        Header: t('expediente_ce>normativa_interna>agregar_falta>nombre_falta', 'Nombre'),
        column: 'nombre',
        accessor: 'nombre',
        label: ''
      },
      {
        Header: t('general>acciones', 'Acciones'),
        column: '',
        accessor: 'sB_TipoFalta_id',
        label: '',
        Cell: ({ cell, row, data }) => {
          const fullRow = data[row.index]
          return (
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignContent: 'center',
                alignItems: 'center'
              }}
            >
              <button
                className='btn-void'
                onClick={() => {
                  toggle('see-edit')
                  setInputValues({
                    id: cell.row.values.id,
                    nombre: cell.row.values.nombre,
                    tipoFalta: cell.row.values.sB_TipoFalta_id,
                    rangoInferior: fullRow.rangoInferior,
                    rangoSuperior: fullRow.rangoSuperior
                  })
                  setEdit(true)
                }}
              >
                <Tooltip title={t('general>editar', 'Editar')}>
                  <IconButton>
                    <RiPencilFill style={{ fontSize: 25 }} />{' '}
                  </IconButton>
                </Tooltip>
              </button>
              <button
                className='btn-void'
                onClick={() => onDeleteEvent(cell.row.values)}
              >
                <Tooltip title={t('general>eliminar', 'Eliminar')}>
                  <IconButton>
                    <IoMdTrash style={{ fontSize: 30 }} />
                  </IconButton>
                </Tooltip>{' '}
              </button>
            </div>
          )
        }
      }
    ]
  }, [listData, t])

  return (
    <>
      <ConfirmModal
        openDialog={
          confirmViewModal === 'view-delete' || confirmViewModal === 'view-add'
        }
        onClose={() => {}}
        onConfirm={() => {
          onViewModal()
        }}
        colorBtn='primary'
        txtBtn='Entendido'
        btnCancel={false}
        msg={
          confirmViewModal === 'view-delete'
            ? t('expediente_ce>normativa_interna>eliminar_falta_msj_success', 'La falta ha sido eliminada en el listado con éxito')
            : t('expediente_ce>normativa_interna>agregar_falta_msj_success', 'La falta ha sido agregada en el listado con éxito')
        }
        title={
          confirmViewModal === 'view-delete'
            ? t('expediente_ce>normativa_interna>eliminar_falta', 'Eliminar falta')
            : t('expediente_ce>normativa_interna>agregar_falta', 'Agregar falta')
        }
      />
      <ConfirmModal
        openDialog={confirmModal}
        onClose={closeConfirmModal}
        onConfirm={() => {
          onDeleteFalta()
        }}
        colorBtn='primary'
        txtBtn='Si, Eliminar'
        msg={t('expediente_ce>normativa_interna>eliminar_falta_msj', '¿Está seguro que desea eliminar la falta?')}
        title={t('expediente_ce>normativa_interna>eliminar_falta', 'Eliminar falta')}
      />
      <Modal
        isOpen={modalOpen === 'see-edit' || modalOpen === 'see-add'}
        toggle={() => {
          toggle('see-edit')
          toggle('see-add')
        }}
      >
        <ModalHeader>
          {modalOpen === 'see-edit'
            ? (
              <div>{t('expediente_ce>normativa_interna>editar_falta', 'Editar falta')}</div>
              )
            : (
              <div>{t('expediente_ce>normativa_interna>agregar_falta', 'Agregar falta')}</div>
              )}
        </ModalHeader>
        {modalOpen === 'see-edit'
          ? (
            <ModalBody>
              <div>
                <p style={{ margin: '0' }}>{t('expediente_ce>normativa_interna>agregar_falta>tipo_falta', 'Tipo de falta')}</p>
                <Select
                  placeholder=''
                  className='select-rounded react-select'
                  classNamePrefix='select-rounded react-select'
                  value={{
                    id: inputValues?.tipoFalta,
                    nivel: inputValues?.tipoFalta
                      ? state.tiposFalta.find(
                        (item) => item.id == inputValues?.tipoFalta
                      )?.nivel
                      : null
                  }}
                  options={state.tiposFalta.map((falta) => ({
                    ...falta,
                    label: falta.nivel,
                    value: falta.id
                  }))}
                  noOptionsMessage={() => t('general>no_opt', 'Sin opciones')}
                  getOptionLabel={(option: any) => option.nivel}
                  getOptionValue={(option: any) => option.id}
                  components={{ Input: CustomSelectInput }}
                  onChange={onChangeSelect}
                />
                <p style={{ margin: '0', marginTop: '15px' }}>
                  {t('expediente_ce>normativa_interna>agregar_falta>nombre_falta', 'Nombre de la falta')}
                </p>
                <Input
                  name='nombre'
                  onChange={onChange}
                  value={inputValues?.nombre}
                  style={{ marginBottom: '1rem' }}
                />
                <P>
                  {t('expediente_ce>normativa_interna>puntaje_de', 'Puntaje: de')} {inputValues?.rangoInferior} {t('expediente_ce>normativa_interna>a', 'a')}{' '}
                  {inputValues?.rangoSuperior} {t('expediente_ce>normativa_interna>puntos', 'puntos')}
                </P>
              </div>
            </ModalBody>
            )
          : (
            <ModalBody>
              <div>
                <span>{t('expediente_ce>normativa_interna>agregar_falta>tipo_falta', 'Tipo de falta')}</span>
                <Select
                  placeholder=''
                  className='select-rounded react-select'
                  classNamePrefix='select-rounded react-select'
                  value={{
                    id: inputValues?.tipoFalta,
                    nivel: inputValues?.tipoFalta
                      ? state.tiposFalta.find(
                        (item) => item.id == inputValues?.tipoFalta
                      )?.nivel
                      : null
                  }}
                  options={state.tiposFalta.map((falta) => ({
                    ...falta,
                    label: falta.nivel,
                    value: falta.id
                  }))}
                  noOptionsMessage={() => t('general>no_opt', 'Sin opciones')}
                  getOptionLabel={(option: any) => option.nivel}
                  getOptionValue={(option: any) => option.id}
                  components={{ Input: CustomSelectInput }}
                  onChange={onChangeSelect}
                />
                <p style={{ margin: '0', marginTop: '15px' }}>
                  {t('expediente_ce>normativa_interna>agregar_falta>nombre_falta', 'Nombre de la falta')}
                </p>
                <Input
                  name='nombre'
                  placeHolder={t('expediente_ce>normativa_interna>falta', 'Falta')}
                  onChange={onChange}
                  value={inputValues?.nombre}
                  style={{ marginBottom: '1rem' }}
                />
                <P>
                  {t('expediente_ce>normativa_interna>puntaje_de', 'Puntaje: de')} {inputValues?.rangoInferior} {t('expediente_ce>normativa_interna>a', 'a')}{' '}
                  {inputValues?.rangoSuperior} {t('expediente_ce>normativa_interna>puntos', 'puntos')}
                </P>
              </div>
            </ModalBody>
            )}
        <ModalFooter style={{ display: 'flex', justifyContent: 'center' }}>
          <Button onClick={toggle} color='primary' outline>
            {t('general>cancelar', 'Cancelar')}
          </Button>
          <Button
            onClick={() => {
              if (isEdit) onEditEvent()
              else addNewFalta()
            }}
            color='primary'
          >
            {t('general>guardar', 'Guardar')}
          </Button>
        </ModalFooter>
      </Modal>
      <Box>
        <div className='div-header'>
          <div>
            {/* <h6 style={{ fontWeight: 'bolder' }}>{faltas.falta}</h6>
            <span style={{ fontWeight: 'lighter' }}>
              Puntaje: {faltas.puntaje}
            </span> */}
          </div>
          <div>
            <Button
              color='primary'
              onClick={() => {
                toggle('see-add')
                setEdit(false)
                setInputValues({
                  id: 0,
                  tipoFalta: 1,
                  nombre: '',
                  rangoInferior: 1,
                  rangoSuperior: 5
                })
              }}
            >
              {t('general>agregar', 'Agregar')}
            </Button>
          </div>
        </div>
        <div className='margen'>
          <TableReactImplementation
            data={listData}
            handleGetData={() => {}}
            columns={columns}
            orderOptions={[]}
          />
        </div>
      </Box>
    </>
  )
}

export default TablaNormativa

const Box = styled.div`
  width: 100%;
  min-height: 15rem;
  max-height: 100%;
  background: #fff;
  border-radius: 10px;
  box-shadow: 2px 2px 2px 2px rgba(0, 0, 0, 0.2);
  margin-top: 2%;
  margin-bottom: 2%;
`
const P = styled.p`
  color: grey;
  margin-top: 1rem;
`
