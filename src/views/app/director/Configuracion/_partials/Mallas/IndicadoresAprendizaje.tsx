import React, { useState, useEffect, useMemo } from 'react'
import {
  Modal,
  ModalBody,
  ModalHeader,
  Form,
  FormGroup,
  Label,
  Button,
  Input
} from 'reactstrap'
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos'
import { useActions } from 'Hooks/useActions'
import { useForm } from 'react-hook-form'
import './IndicadoresAprendizaje.css'
import {
  createCompRubriCalif,
  deleteRubriCalif,
  updateRubriCalif,
  getIndicadorAprendizaje
} from '../../../../../../redux/IndicadoresAprendizaje/actions'
import { useSelector } from 'react-redux'
import Contenido from './IndicadoresGridDinamico/Contenido'
import ConfirmModal from 'Components/Modal/ConfirmModal'
import { TableReactImplementation } from 'Components/TableReactImplementation'
import { IoMdTrash } from 'react-icons/io'
import { RiPencilFill } from 'react-icons/ri'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import { IoEyeSharp } from 'react-icons/io5'
import { useTranslation } from 'react-i18next'

const IndicadoresAprendizaje = () => {
  const { t } = useTranslation()
  const [edit, setEdit] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [disabled, setDisabled] = useState(false)
  const [data, setData] = useState({})
  const [listData, setListData] = useState([])
  const [dataEliminar, setDataEliminar] = useState(null)
  const [confirmModal, setConfirmModal] = useState<boolean>(false)

  const actions = useActions({
    deleteRubriCalif,
    updateRubriCalif,
    createCompRubriCalif,
    getIndicadorAprendizaje
  })

  const state = useSelector((store) => {
    return {
      ...store.indicadorAprendizaje
    }
  })
  const label = { inputProps: { 'aria-label': 'Checkbox demo' } }

  const toggleEdit = () => {
    setEdit(!edit)
  }

  const onChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value.toUpperCase() })
  }

  useEffect(() => {
    handleLoadIndicadorAprendizaje()
  }, [])

  useEffect(() => {
    if (state.indicadoresAprendizaje) {
      setListData(state.indicadoresAprendizaje)
    }
  }, [state.indicadoresAprendizaje])

  const handleLoadIndicadorAprendizaje = () => {
    actions.getIndicadorAprendizaje()
  }

  const toggle = () => {
    setModalOpen(!modalOpen)
  }

  const sendData = async (e) => {
    let response = null
    if (data.id) {
      response = await actions.updateRubriCalif({
        ...data,
        estado: true
      })
    } else {
      response = await actions.createCompRubriCalif({
        ...data,
        estado: true
      })
    }
    if (!response.error && data.id) {
      toggle()
      handleLoadIndicadorAprendizaje()
      setData(response.data)
    } else {
      toggle()
      toggleEdit()
      handleLoadIndicadorAprendizaje()
      setData(response.data)
    }
  }

  const { handleSubmit, register } = useForm()

  const handleLoadAsginaturas = (
    pageNumber = 1,
    pageSize = 7,
    searchValue = ''
  ) => {
    actions.getTiposAsignaturas(pageNumber, pageSize, searchValue)
  }

  const deleteRubCal = async (obj) => {
    let response = null
    if (!obj.id) return
    response = await actions.deleteRubriCalif(obj)
    if (!response.error) {
      handleLoadIndicadorAprendizaje()
      setConfirmModal(false)
    }
  }

  const openMsj = () => {
    setConfirmModal(!confirmModal)
  }

  const closeConfirmModal = () => {
    setConfirmModal(false)
    setDataEliminar(null)
  }

  const columns = useMemo(() => {
    return [
      {
        Header: t('configuracion>mallas_curriculares>indicadores_aprendizaje>columna_nombre', 'Nombre'),
        column: 'nombre',
        accessor: 'nombre',
        label: '',
        Cell: ({ value }) => <div>{value.toUpperCase()}</div>
      },
      {
        Header: t('configuracion>mallas_curriculares>indicadores_aprendizaje>columna_descripcion', 'Descripción'),
        column: 'descripcion',
        accessor: 'descripcion',
        label: '',
        Cell: ({ value }) => <div>{value.toUpperCase()}</div>
      },
      {
        Header: t('configuracion>mallas_curriculares>indicadores_aprendizaje>columna_acciones', 'Acciones'),
        column: '',
        accessor: '',
        label: '',
        Cell: ({ cell, row, data }) => {
          const fullRow = data[row.index]
          return (
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                alignContent: 'center'
              }}
            >
              <button
                className='btn-void'
                onClick={() => {
                  setData(fullRow)
                  setDisabled(false)
                  toggleEdit()
                }}
              >
                <Tooltip title={t("estudiantes>expediente>buscador>col_acciones>ver", "Ver")}>
                  <IconButton>
                    <IoEyeSharp style={{ fontSize: 30 }} />
                  </IconButton>
                </Tooltip>
              </button>
              <button
                className='btn-void'
                onClick={() => {
                  setData(fullRow)
                  setDisabled(false)
                  toggle()
                }}
              >
                <Tooltip title={t('boton>general>editar', 'Editar')}>
                  <IconButton>
                    <RiPencilFill style={{ fontSize: 25 }} />
                  </IconButton>
                </Tooltip>
              </button>

              <button
                className='btn-void'
                onClick={() => {
                  setData(fullRow)
                  openMsj()
                }}
              >
                <Tooltip title={t('boton>general>eliminar', 'Eliminar')}>
                  <IconButton>
                    <IoMdTrash style={{ fontSize: 30 }} />
                  </IconButton>
                </Tooltip>
              </button>
            </div>
          )
        }
      }
    ]
  }, [listData, t])
  return (
    <div>
      <ConfirmModal
        openDialog={confirmModal}
        onClose={closeConfirmModal}
        onConfirm={() => deleteRubCal(data)}
        colorBtn='primary'
        msg={t('configuracion>mallas_curriculares>indicadores_aprendizaje>eliminar>mensaje', '¿Está seguro que desea eliminar el registro seleccionado?')}
        title={t('configuracion>mallas_curriculares>indicadores_aprendizaje>eliminar>confirm_eliminar', 'Confirmar eliminar')}
      />
      {!edit && (
        <div>
          <h1>{t('configuracion>mallas_curriculares>indicadores_aprendizaje>indicadores_aprendizaje', 'Indicadores de aprendizaje esperados')}</h1>
          {/*
            toggleEditModal={(el) => {
              setData(el)
              setDisabled(false)
              toggleEdit()
              */}
          <div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'right',
                alignContent: 'center',
                alignItems: 'center'
              }}
            >
              {/* <Button color='primary' onClick={() => { toggle(), setData({}) }}>
                {' '}
                {t('boton>general>agregrar', 'Agregar')}{' '}
              </Button> */}
            </div>
            <TableReactImplementation
              showAddButton
              msjButton
              onSubmitAddButton={() => { toggle(), setData({}) }} 
              data={listData}
              handleGetData={() => {}}
              columns={columns}
              orderOptions={[]}
            />
          </div>
        </div>
      )}

      {edit && (
        <div>
          <div style={{ display: 'flex' }}>
            <ArrowBackIosIcon onClick={toggleEdit} />
            <h3
              style={{ cursor: 'pointer' }}
              onClick={() => {
                toggleEdit()
                setData({})
              }}
            >
              {t('edit_button>regresar', 'REGRESAR')}
            </h3>
          </div>
          <div className='div-conteiner'>
            <div className='horizontal-conteiner'>
              <div className='title'>
                <h2>{t('configuracion>mallas_curriculares>indicadores_aprendizaje>agregar>agregar_indicador', 'Agregar indicador de aprendizaje esperado')}</h2>
              </div>
            </div>
            <div>
              <Contenido toggleEdit={toggleEdit} rubricaData={data} />
            </div>
          </div>
        </div>
      )}

      <Modal isOpen={modalOpen} toggle={toggle}>
        <ModalHeader toggle={toggle}>
          {t('configuracion>mallas_curriculares>indicadores_aprendizaje>agregar>agregar_indicador', 'Agregar indicador de aprendizaje esperado')}
        </ModalHeader>
        <ModalBody>
          <Form onSubmit={handleSubmit(sendData)}>
            <FormGroup>
              <Label>{t('configuracion>mallas_curriculares>indicadores_aprendizaje>agregar>nombre', 'Nombre')}</Label>
              <Input
                type='text'
                name='nombre'
                value={data?.nombre?.toUpperCase()}
                onChange={onChange}
                innerRef={register({ required: true })}
              />
            </FormGroup>
            <FormGroup>
              <Label>{t('configuracion>mallas_curriculares>indicadores_aprendizaje>agregar>descripcion', 'Descripción')}</Label>
              <Input
                type='textarea'
                name='descripcion'
                value={data?.descripcion?.toUpperCase()}
                onChange={onChange}
                innerRef={register({ required: true })}
              />
            </FormGroup>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <Button
                color='primary'
                outline
                style={{ marginRight: '20px' }}
                onClick={() => {
                  toggle()
                  setData({})
                }}
              >
                {t('boton>general>cancelar', 'Cancelar')}
              </Button>
              <Button color='primary' type='submit'>
                {t('boton>general>guardar', 'Guardar')}
              </Button>
            </div>
          </Form>
        </ModalBody>
      </Modal>
    </div>
  )
}

export default IndicadoresAprendizaje
