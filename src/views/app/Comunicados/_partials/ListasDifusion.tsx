import React, { useState, useEffect } from 'react'
import {
  Col,
  Container,
  Row,
  Modal,
  Label,
  Input,
  FormGroup,
  Button,
  ModalBody,
  InputGroupAddon
} from 'reactstrap'
import Pagination from '../../../../components/table/Pagination'
import Destinatarios from './Destinatarios'
import styled from 'styled-components'
import { useActions } from '../../../../hooks/useActions'
import { getListaDifusion, createListaDifusionByUser, deleteListaDifusion, updateListaDifusionByUser } from '../../../../redux/ListasDifusion/actions'
import { useSelector } from 'react-redux'
import DeleteIcon from '@material-ui/icons/Delete'
import VisibilityIcon from '@material-ui/icons/Visibility'
import swal from 'sweetalert'
import CSVReader from 'react-csv-reader'
import colors from 'Assets/js/colors'
import search from 'Utils/search'
import { arr_diff, union_arrays } from '../../FormResponse/utils'

const ListasDifusion = (props) => {
  const [items, setItems] = useState([])
  const [searchValue, setSearchValue] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [currentListMails, setCurrentListMails] = useState([])
  const [openModal, setOpenModal] = useState(null)
  const [data, setData] = useState({})
  const actions = useActions({ createListaDifusionByUser, deleteListaDifusion, updateListaDifusionByUser, getListaDifusion })
  const state = useSelector((store) => {
    return store.listaDifusion
  })

  useEffect(() => {
    setItems(state.listasDifusion)
  }, [state.listasDifusion])

  useEffect(() => {
    const correos = state.currentList.correos ? JSON.parse(state.currentList.correos) : { elementos: [] }
    setData({ ...state.currentList, correos })
    setCurrentListMails(correos.elementos)
  }, [state.currentList])

  const handleChange = (value, type) => {
    setData({ ...data, [type]: value })
  }

  const endIndex = currentPage * 10
  const startIndex = endIndex - 10

  const renderModalContent = () => {
    switch (openModal) {
      case 'massive':
        return (
          <div>
            <h2>
              Carga masiva de destinatarios
            </h2>
            <p>
              Para cargar destinatarios de forma masiva deve de descargar la plantilla y subirla con
              <br />
              los datos requeridos.
            </p>
            <p>
              Si no posee la plantilla llena puede cerrar esta ventana y entrar nuevamente cuando
              <br />
              esté lista.
            </p>
            <a className='btn btn-primary' href='files/plantillaDestinatariosMasivos.csv' download style={{ color: 'white' }}>
              <i className='fas fa-file-download' /> Descargar plantilla
            </a>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '1rem' }}>
              <span
                className='multipotionsLoader-outlined' onClick={async () => {
                  setOpenModal(null)
                  setData({})
                }}
              >
                Atrás
              </span>
              <CSVReader
                cssClass='multipotionsLoader-difusion'
                label='Subir archivo'
                inputStyle={{
                  opacity: 0
                }}
                onFileLoaded={async (elementos, fileInfo) => {
                  const _data = arr_diff(data.correos.elementos ? data.correos.elementos : [], elementos.slice(1, elementos.length).map(el => {
                    if (Array.isArray(el)) {
                      return el[0]
                    }
                    return el
                  }))
                  const union = union_arrays(data.correos.elementos ? data.correos.elementos : [], _data)
                  const response = await actions.updateListaDifusionByUser({ ...data, correos: JSON.stringify({ elementos: [...union] }), miembros: union.length })
                  if (!response.error) {
                    setOpenModal(null)
                    setData({})
                  }
                }}
              />
            </div>
          </div>
        )
      case 'create':
        return (
          <div>
            <h2>
              Ingresar la información de la lista de difusión
            </h2>
            <p>
              Se creara una lista de difusión con los destinatarios que han sido agregados
            </p>
            <FormGroup>
              <Label>
                Nombre
              </Label>
              <Input value={data.nombre} onChange={(e) => { handleChange(e.target.value, 'nombre') }} />
            </FormGroup>
            <FormGroup>
              <Label>
                Alias
              </Label>
              <Input value={data.alias} placeholder='@listaDeDifusión' onChange={(e) => { handleChange(e.target.value.trim().search('@') >= 0 ? `${e.target.value.trim()}` : `@${e.target.value}`, 'alias') }} />
            </FormGroup>
            <FormGroup>
              <Label>
                Descripción
              </Label>
              <Input type='textarea' value={data.descripcion} onChange={(e) => { handleChange(e.target.value, 'descripcion') }} />
            </FormGroup>
            <FormGroup>
              <Label>
                Género
              </Label>
              <Input type='select' value={data.genero} onChange={(e) => { handleChange(e.target.value, 'genero') }}>
                <option disabled selected={!data.genero} value style={{ display: 'none' }} />
                <option value={1}>Masculino</option>
                <option value={2}>Femenino</option>
                <option value={3}>Ambos</option>
              </Input>
            </FormGroup>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <Button
                color='primary' outline style={{ marginRight: '1rem' }} onClick={async () => {
                  setOpenModal(null)
                  setData({})
                }}
              >
                Cancelar
              </Button>
              <Button color='primary' onClick={async () => { setOpenModal('edit') }}>
                Siguiente
              </Button>
            </div>
          </div>
        )
    }
  }

  return (
    <Container style={{ padding: '2rem' }}>
      <Row>
        <Col sm='12'>
          <h2>
            Lista de difusión
          </h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between' }}>
            <div
              className='search-sm--rounded'
            >
              <input
                type='text'
                name='keyword'
                id='search'
                placeholder='Escribe aqui las palabras claves para buscar'
                onChange={(e) => {
                  setSearchValue(e.target.value)
                }}
                style={{
                  width: '31rem'
                }}
              />
              <StyledInputGroupAddon
                style={{ zIndex: 2 }}
                addonType='append'
              >
                <Button
                  color='primary'
                  className='buscador-table-btn-search'
                  onClick={() => {
                    setItems(
                      search(searchValue).in(
                        state.listasDifusion,
                        ['alias', 'nombre', 'descripcion']
                      )
                    )
                  }}
                  id='buttonSearchTable'
                >
                  Buscar
                </Button>
              </StyledInputGroupAddon>
            </div>
            <Button
              color='primary' onClick={() => {
                setOpenModal('create')
              }}
            >
              Crear
            </Button>
          </div>
        </Col>

        <Col sm='12'>
          <table className='difusionTable'>
            <tr>
              <th>
                Nombre
              </th>
              <th>
                Alias
              </th>
              <th>
                Cantidad de miembros
              </th>
              <th>
                Acciones
              </th>
            </tr>
            <tbody>
              {items.slice(startIndex, endIndex).map(el => {
                return (
                  <tr>
                    <td>
                        {el.nombre}
                      </td>
                    <td>
                        {el.alias}
                      </td>
                    <td>
                        {el.miembros || 0}
                      </td>
                    <td style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', color: colors.primary }}>
                        <DeleteIcon
                            color='primary' className='cursor-pointer hoverColor' onClick={(e) => {
                                swal({
                                  title: 'Atención',
                                  text: '¿Está seguro de querer eliminar esta lista de difusión?',
                                  icon: 'warning',
                                  buttons: {
                                    ok: {
                                      text: 'Aceptar',
                                      value: true
                                    },
                                  },
                                }).then((result) => {
                                  if (result) {
                                    actions.deleteListaDifusion(el.id)
                                  }
                                })
                              }}
                          />
                        <VisibilityIcon
                            color='primary' className='cursor-pointer hoverColor' onClick={async (e) => {
                                
                                await actions.getListaDifusion(el.id)
                                setOpenModal('create')
                              }}
                          />
                        <i
                            className='fas fa-file-upload' style={{ fontSize: '21px', marginLeft: '5px' }} onClick={async () => {
                                
                                await actions.getListaDifusion(el.id)
                                setOpenModal('massive')
                              }}
                          />
                      </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
          <div>
            <Pagination
              currentPage={currentPage}
              totalPage={Math.ceil(state.listasDifusion.length / 10)}
              onChangePage={(i) => {
                setCurrentPage(i)
              }}
            />
          </div>
          <Modal
            isOpen={openModal !== null && openModal !== 'edit'} toggle={() => {
              setOpenModal(null)
            }}
          >
            <ModalBody>
              {renderModalContent()}
            </ModalBody>
          </Modal>
          <div>
            <Destinatarios
              value={currentListMails} cancelName='Atrás' open={openModal === 'edit'} setOpen={async (open, _correos) => {
                if (!open && _correos) {
                  let response
                  if (data.id) {
                    response = await actions.updateListaDifusionByUser({ ...data, correos: JSON.stringify({ elementos: _correos }), miembros: _correos.length })
                  } else {
                    response = await actions.createListaDifusionByUser({ ...data, correos: JSON.stringify({ elementos: _correos }), miembros: _correos.length })
                  }
                  if (!response.error) {
                    setOpenModal(null)
                    setData({})
                  }
                } else {
                  setOpenModal('create')
                }
              }} onChange={(value) => {
                setCurrentListMails(value)
              }}
            />
          </div>
        </Col>
      </Row>
    </Container>
  )
}

const StyledInputGroupAddon = styled(InputGroupAddon)`
  top: 0;
  right: 0;
  position: absolute;
  height: 100%;
  display: flex;
  align-items: center;
`

export default ListasDifusion
