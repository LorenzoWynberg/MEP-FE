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
  Input
} from 'reactstrap'
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos'
import {
  getTiposAsignaturas,
  createTipoAsignatura,
  updateTipoAsignatura,
  getAllTiposAsignaturas,
  deleteTipoAsignatura,
  toggleTipoAsignaturaEstado
} from '../../../../../../redux/asignaturas/actions'
import { useActions } from 'Hooks/useActions'
import { useForm } from 'react-hook-form'
import { useSelector } from 'react-redux'
import ConfirmModal from 'Components/Modal/ConfirmModal'
import styled from 'styled-components'
import { TableReactImplementation } from 'Components/TableReactImplementation'
import { IoMdTrash } from 'react-icons/io'
import { RiPencilFill } from 'react-icons/ri'
import { IoEyeSharp } from 'react-icons/io5'
import BookDisabled from 'Assets/icons/bookDisabled'
import BookAvailable from 'Assets/icons/bookAvailable'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import { useTranslation } from 'react-i18next'

const TiposAsignatura = () => {
  const { t } = useTranslation()
  const [edit, setEdit] = useState(false)
  const [disabled, setDisabled] = useState(false)
  const [data, setData] = useState({})
  const [listData, setListData] = useState([])
  const actions = useActions({
    getTiposAsignaturas,
    createTipoAsignatura,
    updateTipoAsignatura,
    getAllTiposAsignaturas,
    deleteTipoAsignatura,
    toggleTipoAsignaturaEstado
  })
  const [confirmModal, setConfirmModal] = useState<boolean>(false)
  const [edModal, setEdModal] = useState<boolean>(false)

  const state = useSelector((store) => {
    return {
      ...store.asignaturas
    }
  })

  useEffect(() => {
    handleLoadAsginaturas()
  }, [])

  useEffect(() => {
    if (state.tiposAsignaturas) {
      setListData(
        state.tiposAsignaturas.map((el) => ({
          ...el,
          estadoP: el.esActivo ? 'ACTIVO' : 'INACTIVO'
        }))
      )
    }
  }, [state.tiposAsignaturas])

  const { handleSubmit, register, errors } = useForm()

  const handleLoadAsginaturas = () => {
    actions.getAllTiposAsignaturas()
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
      response = await actions.updateTipoAsignatura({
        ...data,
        esActivo: data.esActivo,
        estado: true
      })
    } else {
      response = await actions.createTipoAsignatura({
        ...data,
        esActivo: true,
        estado: true
      })
    }
    if (!response.error) {
      setData({})
      toggleEdit()
      handleLoadAsginaturas()
    }
  }

  const deleteTipoAsignaturaEvent = async () => {
    if (!data.id) return

    const response = await actions.deleteTipoAsignatura(data)

    if (!response.error) {
      handleLoadAsginaturas()
      setConfirmModal(false)
    }
  }

  const onToggleEvent = async () => {
    const response = await actions.toggleTipoAsignaturaEstado(data)
    handleLoadAsginaturas()
    setEdModal(false)
  }

  const onRegresarEvent = () => {
    setData({})
    setDisabled(false)
    setEdit(false)
  }

  const columns = useMemo(() => {
    return [
      {
        Header: t('configuracion>mallas_curriculares>columna_nombre', 'Nombre'),
        column: 'nombre',
        accessor: 'nombre',
        label: '',
        Cell: ({ value }) => <div>{value?.toUpperCase()}</div>
      },
      {
        Header: t('configuracion>mallas_curriculares>tipos_asignatura/figura_afin>columa_descripcion', 'Descripción'),
        column: 'descripcion',
        accessor: 'descripcion',
        label: '',
        Cell: ({ value }) => <div>{value?.toUpperCase()}</div>
      },
      {
        Header: t('configuracion>mallas_curriculares>tipos_asignatura/figura_afin>columa_estado', 'Estado'),
        column: 'estadoP',
        accessor: 'estadoP',
        label: '',
        Cell: ({ value }) => <div>{value.toUpperCase()}</div>
      },
      {
        Header: t('configuracion>mallas_curriculares>tipos_asignatura/figura_afin>columa_acciones', 'Acciones'),
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
                    className="btn-void"
                    onClick={() => {
                      setData(fullRow)
                      setEdModal(true)
                    }}
                  >
                    <Tooltip title={t("boton>general>deshabilitar", "Deshabilitar")} >
                      <IconButton>
                        <BookDisabled />
                      </IconButton>
                    </Tooltip>
                  </button>
              }
              <button
                className='btn-void'
                onClick={() => {
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
          <h1>{t('configuracion>mallas_curriculares>tipos_asignatura/figura_afin>agregar>tipos_asignatura_afin', 'Tipos de asignatura/figura afín')}</h1>
        </Col>
        <div style={{ display: 'flex', cursor: 'pointer' }}>
          <ArrowBackIosIcon onClick={onRegresarEvent} />
          <h3 style={{ cursor: 'pointer' }} onClick={onRegresarEvent}>
            {t('edit_button>regresar', 'REGRESAR')}
          </h3>
        </div>

        <Col xs='6'>
          <Card>
            <CardBody>
              <Form onSubmit={handleSubmit(sendData)}>
                <FormGroup>
                  <Label>{t('configuracion>mallas_curriculares>tipos_asignatura/figura_afin>agregar>nombre', 'Nombre')} </Label>
                  <Input
                    value={data?.nombre?.toUpperCase()}
                    onChange={onChange}
                    name='nombre'
                    type='text'
                    disabled={disabled}
                    innerRef={register({ required: true })}
                  />
                  {errors.nombre ? <ErrorSpan>Campo Requerido</ErrorSpan> : ''}
                </FormGroup>
                <FormGroup>
                  <Label>{t('configuracion>mallas_curriculares>tipos_asignatura/figura_afin>agregar>estado', 'Estado')}</Label>
                  <Input
                    type='select'
                    value={data?.esActivo}
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
                  <Label>{t('configuracion>mallas_curriculares>tipos_asignatura/figura_afin>agregar>descripcion', 'Descripción')}</Label>

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
                      <ErrorSpan>Campo Requerido</ErrorSpan>
                      )
                    : (
                        ''
                      )}
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
          onConfirm={() => deleteTipoAsignaturaEvent()}
          colorBtn='primary'
          txtBtn={t('boton>general>eliminar', 'Eliminar')}
          msg={t('configuracion>mallas_curriculares>tipos_asignatura>eliminar>mensaje', '¿Está seguro que desea eliminar este tipo de asignatura?')}
          title={t('configuracion>mallas_curriculares>tipos_asignatura>eliminar>tipos_asignatura/figura_afin', 'Tipos de asignatura/figura afín')}
        />
        <ConfirmModal
          openDialog={edModal}
          onClose={() => {
            setEdModal(false)
          }}
          onConfirm={() => onToggleEvent()}
          colorBtn={'primary'}
          txtBtn={
            data.esActivo
            ? t('configuracion>ofertas_educativas>modelo_de_ofertas>hover>deshabilitar','Deshabilitar') 
            : t(
              'configuracion>ofertas_educativas>niveles>hover>habilitar',
              'Habilitar'
            )}
          msg={
						data.esActivo ? 
            t('configuracion>mallas_curriculares>tipos_asignatura/figura_afin>mensajeDeshabilitar',`¿Está seguro que desea deshabilitar el tipo de asignatura ?`)
            : t('configuracion>mallas_curriculares>tipos_asignatura/figura_afin>mensajeHabilitar',`¿Está seguro que desea habilitar el tipo de asignatura ?`)
          }
          title={t('menu>configuracion>tipo_asignatura',`Tipos de asignaturas`)}
        />
        <h1>{t('configuracion>mallas_curriculares>tipos_asignatura/figura_afin>tipos_asignatura/figura_afin', 'Tipos de asignatura/figura afín')}</h1>
        {/*
            toggleEditModal={(el) => {
                setData(el)
                setDisabled(true)
                toggleEdit()
            }}
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

export default TiposAsignatura
