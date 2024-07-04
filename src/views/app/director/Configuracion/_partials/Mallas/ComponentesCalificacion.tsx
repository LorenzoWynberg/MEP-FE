import React, { useState, useEffect, useMemo } from 'react'
import {
  Card,
  Col,
  CardBody,
  Container,
  Form,
  FormGroup,
  Label,
  Button,
  Input,
  CustomInput
} from 'reactstrap'
import { useActions } from 'Hooks/useActions'
import { useSelector } from 'react-redux'
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos'
import { useForm } from 'react-hook-form'
import styled from 'styled-components'
import {
  getAllComponenteCalificacion,
  createComponenteCalificacion,
  getComponenteCalificacion,
  getComponenteCalificacionPaginated,
  updateComponenteCalificacion,
  deleteComponenteCalificacion,
  toggleComponenteEstado
} from '../../../../../../redux/componentesEvaluacion/actions'
import { TableReactImplementation } from 'Components/TableReactImplementation'
import ConfirmModal from 'Components/Modal/ConfirmModal'
import { IoMdTrash } from 'react-icons/io'
import { RiPencilFill } from 'react-icons/ri'
import { IoEyeSharp } from 'react-icons/io5'
import BookDisabled from 'Assets/icons/bookDisabled'
import BookAvailable from 'Assets/icons/bookAvailable'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import { useTranslation } from 'react-i18next'

const ComponentesCalificacion = () => {
  const { t } = useTranslation()
  const [edit, setEdit] = useState(false)
  const [disabled, setDisabled] = useState(false)
  const [data, setData] = useState({})
  const [listData, setListData] = useState([])
  const [confirmModal, setConfirmModal] = useState<boolean>(false)
  const actions = useActions({
    toggleComponenteEstado,
    getAllComponenteCalificacion,
    createComponenteCalificacion,
    getComponenteCalificacion,
    getComponenteCalificacionPaginated,
    updateComponenteCalificacion,
    deleteComponenteCalificacion
  })
  const [edModal, setEdModal] = useState<boolean>(false)
  const state = useSelector((store) => {
    return {
      ...store.componentesEvaluacion
    }
  })

  useEffect(() => {
    handleLoadComponenteCalificacion()
  }, [])

  useEffect(() => {
    if (state.componenteCalificacionAll) {
      setListData(
        state.componenteCalificacionAll.map((el) => ({
          ...el,
          estadoP: el.esActivo ? 'ACTIVO' : 'INACTIVO'
        }))
      )
    }
  }, [state.componenteCalificacionAll])

  const { handleSubmit, register, errors } = useForm()

  const handleLoadComponenteCalificacion = () => {
    actions.getAllComponenteCalificacion()
  }

  const toggleEdit = () => {
    setEdit(!edit)
  }

  const onChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value.toUpperCase() })
  }

  const sendData = async () => {
    let response = null
    if (data.id) {
      response = await actions.updateComponenteCalificacion({
        ...data,
        esActivo: data.esActivo,
        esAsistencia: data.esAsistencia,
        noRequiereInstrumentos: data.noRequiereInstrumentos,
        estado: true
      })
    } else {
      response = await actions.createComponenteCalificacion({
        ...data,
        esActivo: true,
        esAsistencia: data.esAsistencia,
        noRequiereInstrumentos: data.noRequiereInstrumentos,
        estado: true
      })
    }
    if (!response.error) {
      setData({})
      toggleEdit()
      handleLoadComponenteCalificacion()
    }
  }

  const deleteCompCalif = async (obj) => {
    let response = null
    if (!obj.id) return

    response = await actions.deleteComponenteCalificacion(obj)

    if (!response.error) {
      handleLoadComponenteCalificacion()
      setConfirmModal(false)
    }
  }

  const onRegresarEvent = () => {
    toggleEdit()
    setData({})
    setDisabled(false)
  }

  const onToggleEvent = async () => {
    const response = await actions.toggleComponenteEstado(data)
    handleLoadComponenteCalificacion()
    setEdModal(false)
  }

  const columns = useMemo(() => {
    return [
      {
        Header: t('configuracion>mallas_curriculares>comp_califi>columna_nombre', 'Nombre'),
        column: 'nombre',
        accessor: 'nombre',
        label: '',
        Cell: ({ value }) => <div>{value.toUpperCase()}</div>
      },
      {
        Header: t('configuracion>mallas_curriculares>comp_califi>columna_descripcion', 'Descripción'),
        column: 'descripcion',
        accessor: 'descripcion',
        label: '',
        Cell: ({ value }) => <div>{value.toUpperCase()}</div>
      },
      {
        Header: t('configuracion>mallas_curriculares>comp_califi>columna_estado', 'Estado'),
        column: 'estadoP',
        accessor: 'estadoP',
        label: '',
        Cell: ({ value }) => <div>{value.toUpperCase()}</div>
      },
      {
        Header: t('configuracion>mallas_curriculares>comp_califi>columna_acciones', 'Acciones'),
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
                  setDisabled(true)
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
                  toggleEdit()
                }}
              >
                <Tooltip title={t('boton>general>editar', 'Editar')}>
                  <IconButton>
                    <RiPencilFill style={{ fontSize: 25 }} />
                  </IconButton>
                </Tooltip>
              </button>
              {fullRow.usedBy === 0 && (
                <>
                {!fullRow.esActivo ? 
                    <button
                    className="btn-void"
                    onClick={() => {
                      setData(fullRow)
                      setEdModal(true)
                    }}
                  >
                    <Tooltip title={t("general>habilitar", "Habilitar")} >
                      <IconButton>
                        <BookAvailable />
                      </IconButton>
                    </Tooltip>
                  </button>               
                 :
                    <button
                    className='btn-void'
                    onClick={() => {
                      setData(fullRow)
                      setEdModal(true)
                    }}
                  >
                    <Tooltip title={t("boton>general>deshabilitar", "Deshabilitar")}>
                      <IconButton>
                        <BookDisabled />
                      </IconButton>
                    </Tooltip>
                  </button>
                 }
                  <button
                    className='btn-void'
                    onClick={() => {
                      // deleteCompCalif(el)
                      setData(fullRow)
                      setConfirmModal(true)
                    }}
                  >
                    <Tooltip title={t('boton>general>eliminar', 'Eliminar')}>
                      <IconButton>
                        <IoMdTrash style={{ fontSize: 30 }} />
                      </IconButton>
                    </Tooltip>
                  </button>
                </>
              )}
            </div>
          )
        }
      }
    ]
  }, [listData, t])

  if (edit) {
    return (
      <Container>
        <Col xs='12'>
          <h1>{t('configuracion>mallas_curriculares>comp_califi>agregar>comp_califi', 'Componentes de calificación')}</h1>
        </Col>
        <div style={{ display: 'flex', cursor: 'pointer' }}>
          <ArrowBackIosIcon onClick={onRegresarEvent} />
          <h3 onClick={onRegresarEvent}>{t('edit_button>regresar', 'REGRESAR')}</h3>
        </div>

        <Col xs='6'>
          <Card>
            <CardBody>
              <Form onSubmit={handleSubmit(sendData)}>
                <FormGroup>
                  <Label>{t('configuracion>mallas_curriculares>comp_califi>agregar>nombre', 'Nombre')}</Label>
                  <Input
                    value={data.nombre}
                    onChange={onChange}
                    name='nombre'
                    type='text'
                    disabled={disabled}
                    innerRef={register({ required: true })}
                  />
                  {errors.nombre ? <ErrorSpan>Campo Requerido</ErrorSpan> : ''}
                </FormGroup>
                <FormGroup>
                  <Label>{t('configuracion>mallas_curriculares>comp_califi>agregar>estado', 'Estado')}</Label>
                  <Input
                    type='select'
                    value={data.esActivo}
                    onChange={onChange}
                    name='esActivo'
                    readOnly={data.id || disabled}
                  >
                    <option
                      selected={!data.id || data.esActivo}
                      value
                      readOnly={!data.id || disabled}
                    >
                      ACTIVO
                    </option>
                    <option value={false} disabled={!data.id || disabled}>
                      INACTIVO
                    </option>
                  </Input>
                </FormGroup>
                <FormGroup>
                  <Label>{t('configuracion>mallas_curriculares>comp_califi>agregar>descripcion', 'Descripción')}</Label>
                  <Input
                    type='textarea'
                    name='descripcion'
                    value={data?.descripcion?.toUpperCase()}
                    disabled={disabled}
                    innerRef={register({ required: true })}
                    onChange={onChange}
                  />
                  {errors.descripcion
                    ? (
                      <ErrorSpan>{t("configuracion>superviciones_circuitales>agregar>estado>campo_requerido", "Campo requerido")}</ErrorSpan>
                      )
                    : (
                        ''
                      )}
                </FormGroup>
                <FormGroup>
                  <CustomInput
                    label={t('configuracion>mallas_curriculares>comp_califi>agregar>es_asistencia', 'Es asistencia')}
                    type='checkbox'
                    name='esAsistencia'
                    checked={data.esAsistencia}
                    disabled={disabled}
                    innerRef={register}
                    onClick={(e) =>
                      onChange({
                        ...e,
                        target: {
                          ...e.target,
                          name: 'esAsistencia',
                          value: !data.esAsistencia
                        }
                      })}
                  />
                  <FormGroup>
                    <CustomInput
                      label={t('configuracion>mallas_curriculares>comp_califi>agregar>no_instrumentos', 'No requiere instrumentos')}
                      type='checkbox'
                      name='noRequiereInstrumentos'
                      checked={data.noRequiereInstrumentos}
                      disabled={disabled}
                      innerRef={register}
                      onClick={(e) => {
                        console.log('e', e.target)
                        onChange({
                          ...e,
                          target: {
                            ...e.target,
                            name: 'noRequiereInstrumentos',
                            value: !data.noRequiereInstrumentos
                          }
                        })
                      }}
                    />
                  </FormGroup>
                </FormGroup>
                <FormGroup>
                  <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <Button
                      color='primary'
                      outline
                      style={{ marginRight: '9px' }}
                      onClick={() => {
                        setData({})
                        setDisabled(false)
                        setEdit(false)
                      }}
                    >
                      {t('edit_button>regresar', 'Regresar')}
                    </Button>
                    <Button
                      color='primary'
                      hidden={!disabled}
                      onClick={() => {
                        setDisabled(false)
                      }}
                    >
                      {t('boton>general>editar', 'Editar')}
                    </Button>
                    {!disabled && (
                      <Button
                        color='primary'
                        type='submit'
                        style={{ marginRight: '9px' }}
                      >
                        {t('boton>general>guardar', 'Guardar')}
                      </Button>
                    )}
                  </div>
                </FormGroup>
              </Form>
            </CardBody>
          </Card>
        </Col>
      </Container>
    )
  } else {
    return (
      <div>
        <ConfirmModal
          openDialog={confirmModal}
          onClose={() => setConfirmModal(false)}
          onConfirm={() => deleteCompCalif(data)}
          colorBtn='primary'
          txtBtn={t('boton>general>eliminar', 'Eliminar')}
          msg={t('configuracion>mallas_curriculares>comp_califi>eliminar>mensaje', '¿Está seguro que desea eliminar este Componente de Calificación?')}
          title={t('configuracion>mallas_curriculares>comp_califi>eliminar>comp_califi', 'Componentes de Calificación')}
        />
        <ConfirmModal
          openDialog={edModal}
          onClose={() => {
            setEdModal(false)
          }}
          onConfirm={() => onToggleEvent()}
          colorBtn='primary'
          txtBtn={
            data.esActivo
            ? t('configuracion>ofertas_educativas>modelo_de_ofertas>hover>deshabilitar','Deshabilitar') 
            : t(
              'configuracion>ofertas_educativas>niveles>hover>habilitar',
              'Habilitar'
            )}
          msg={
            data.esActivo ? 
            ` ${t('configuracion>mallas>componentes_calificacion>deshabilitar','¿Está seguro que desea deshabilitar el componente')} ${data.nombre} ?` :
            `${t('configuracion>mallas>componentes_calificacion>habilitar','¿Está seguro que desea habilitar el componente')} ${data.nombre} ?`
            } 
          title={t('configuracion>mallas_curriculares>comp_califi>deshabilitar>comp_califi', 'Componentes de Calificación')}
        />
        <h1>{t('configuracion>mallas_curriculares>comp_califi>comp_califi', 'Componentes de Calificación')}</h1>
        {/* toggleEditModal={(el) => {
                setData(el)
                setDisabled(true)
                toggleEdit()
        */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'right',
            alignContent: 'center',
            alignItems: 'center'
          }}
        >
          {/* <Button color='primary' onClick={toggleEdit}>
            {' '}
            {t('boton>general>agregrar', 'Agregar')}{' '}
          </Button> */}
        </div>
        <TableReactImplementation
          showAddButton
          msjButton
          onSubmitAddButton={toggleEdit} 
          data={listData}
          handleGetData={() => {}}
          columns={columns}
          orderOptions={[]}
        />
      </div>
    )
  }
}

const ErrorSpan = styled.span`
  position: absolute;
  color: #bd0505;
  right: 0;
  font-weight: bold;
  font-size: 10px;
  bottom: -19px;
`

export default ComponentesCalificacion
