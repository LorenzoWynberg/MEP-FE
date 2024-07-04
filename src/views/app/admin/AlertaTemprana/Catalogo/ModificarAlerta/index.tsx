import React from 'react'
import styled from 'styled-components'
import { Row, Col, Button, Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap'
import colors from '../../../../../../assets/js/colors'

import { useSelector } from 'react-redux'
import { useActions } from '../../../../../../hooks/useActions'
import { getAlertById, clearAlert } from '../../../../../../redux/alertaTemprana/actions'
import { getAlertsContext, getAlertsDimensionByContext, getResponsibleAlerts, deleteNormativa, uploadFicha } from '../../../../../../redux/alertaTemprana/actionsAlerts'
import AddIcon from '@material-ui/icons/CloudUploadOutlined'

import swal from 'sweetalert'

import ModificarAlertaForm from './ModificarAlertaForm'

import NormativasForm from './NormativasEditForm'
import NormativasModal from '../NormativasModal'
import EditNormativasModal from '../EditNormativasModal'

type IProps = {
    alerta: any,
    loading: boolean,
    handleUpdateAlert: Function,
    handleForm: Function
}

type IState = {
    alertaTemprana: any
};

const ModificarAlerta: React.FC<IProps> = (props) => {
  const [normativas, setNormativas] = React.useState<Array<any>>([])
  const [selectAll, setSelectAll] = React.useState<boolean>(false)
  const [modalVisible, setmodalVisible] = React.useState<boolean>(false)
  const [dropMenu, setdropMenu] = React.useState<boolean>(false)
  const [visibleMenu, setVisibleMenu] = React.useState<boolean>(false)
  const [editIndex, setEditIndex] = React.useState<number>(-1)
  const [currentNormativa, setCurrentNormativa] = React.useState<any>(null)
  const [uploading, setUploading] = React.useState<boolean>(false)
  const [uploadingNormativas, setUploadingNormativas] = React.useState<boolean>(false)
  const [editable, setEditable] = React.useState<boolean>(false)
  const [image, setImage] = React.useState<any>({})
  const [imageNormativa, setImageNormativa] = React.useState<any>({})
  const [errors, setErrors] = React.useState<Array<any>>([])

  const actions = useActions({ getAlertsContext, getAlertsDimensionByContext, getResponsibleAlerts, getAlertById, clearAlert, deleteNormativa })

  const state = useSelector((store: IState) => {
    return {
      alerta: store.alertaTemprana
    }
  })

  React.useEffect(() => {
    fetchAlert()
  }, [props.alerta])

  const fetchAlert = async () => {
    await actions.getAlertById(props.alerta.id)
  }

  React.useEffect(() => {
    if (Object.keys(state.alerta.currentAlert).length > 0) {
      setNormativas(state.alerta.currentAlert.normativas || [])
    }
  }, [state.alerta.currentAlert])

  React.useEffect(() => {
    setErrors(state.alerta.errors)
  }, [state.alerta])

  React.useEffect(() => {
    const fetchAlertsContext = async () => {
      await actions.getAlertsContext()
      await actions.getResponsibleAlerts()
    }
    fetchAlertsContext()
  }, [])

  const getDimensionsByContext = async (contexId: number) => {
    await actions.getAlertsDimensionByContext(contexId)
  }

  const handleAdd = (values: any) => {
    setmodalVisible(!modalVisible)
    const items = {
      ...values,
      selected: false
    }
    setNormativas([...normativas, items])
  }

  const handleSelectAll = () => {
    setSelectAll(!setSelectAll)
    const temps = []
    normativas.map((normativa, i) => {
      temps.push({
        ...normativa,
        selected: !!setSelectAll
      })
    })
    setNormativas(temps)
  }

  const deteleAll = () => {
    const temps = [...normativas]
    const selecteds = temps.filter(normativa => normativa.selected)
    selecteds.map((selected, index) => {
      const i = temps.findIndex(normativa => normativa.nombre === selected.nombre)
      temps.splice(i, 1)
    })
    setNormativas(temps)
  }

  const handleSelectItem = (index: number) => {
    const temps = [...normativas]
    temps[index].selected = !temps[index].selected
    setNormativas(temps)
  }

  const handleEditItem = (index: number) => {
    const currentNormativa = Object.assign({}, normativas[index])
    setmodalVisible(!modalVisible)
    setEditIndex(index)
    setCurrentNormativa(currentNormativa)
  }

  const handleDeleteItem = async (index: number) => {
    const temps = [...normativas]

    const res = await actions.deleteNormativa(props.alerta.id, normativas[index].id)

    if (!res.error) {
      fetchAlert()
    } else {
      swal({
        title: 'Oops',
        text: res.message,
        icon: 'warning',
        className: 'text-alert-modal',
        buttons: {
          ok: {
            text: '¡Entendido!',
            value: true,
            className: 'btn-alert-color'
          }
        }
      })
    }

    temps.splice(index, 1)
    setNormativas(temps)
  }

  const handleUpdate = (values: any) => {
    const temps = [...normativas]
    const item = {
      ...values,
      selected: false
    }
    temps[editIndex] = item
    setNormativas(temps)
    setmodalVisible(!modalVisible)
  }

  const handleUpload = async (e) => {
    e.preventDefault()
    try {
      setUploading(true)
      const res = await uploadFicha(e.target.files[0], (event) => {
        const percentCompleted = Math.round((event.loaded * 100) / event.total)
        if (percentCompleted == 100) {
          setUploading(false)
        }
      })
      setImage(res)
    } catch (error) {
      setUploading(false)
    }
  }

  const handleUploadNormativas = async (e) => {
    e.preventDefault()
    try {
      setUploadingNormativas(true)
      const res = await uploadFicha(e.target.files[0], (event) => {
        const percentCompleted = Math.round((event.loaded * 100) / event.total)
        if (percentCompleted == 100) {
          setUploadingNormativas(false)
        }
      })

      const items = {
        url: res.url,
        nombre: res.titulo,
        selected: false
      }

      setNormativas([...normativas, items])

      setImageNormativa(res)
    } catch (error) {
      setUploadingNormativas(false)
    }
  }

  const handleUpdateAlert = (values: any, responsables: any[]) => {
    const data = {
      id: props.alerta.id,
      nombre: values.nombre,
      atencionInmediata: values.atencionInmediata == 'Sí',
      descripcion: values.descripcion,
      recordatorio: values.recordatorio.value,
      dimensionId: values.DimensionId.id,
      responsables,
      recursoFicha: image ? image.id : 0,
      tipoAlerta: true,
      normativas,
      nivelPrioridad: values.esCompuesta === '' ? 0 : Object.keys(values.nivelPrioridad).length > 0 ? values.nivelPrioridad?.value : 0,
      esCompuesta: values.esCompuesta !== ''
    }
    props.handleUpdateAlert(data)
  }

  const handleOpenFile = (file: string) => {
    window.open(file, '_blank')
  }

  const handleForm = async () => {
    await actions.clearAlert()
    props.handleForm()
  }

  return (
    <Wrapper>
      {
                errors.length > 0
                  ? <Errors>
                    <ErrorsTitle>Por favor corregir los siguientes errores:</ErrorsTitle>
                    <List>
                      {
                            errors.map((error, i) => <Error key={i}>{error}</Error>)
                        }
                    </List>
                  </Errors>
                  : null
            }
      {
                Object.keys(state.alerta.currentAlert).length > 0
                  ? <Row className='mb-3'>
                    <Col md={6}>
                      <ModificarAlertaForm
                        alerta={state.alerta.currentAlert}
                        alertsContext={state.alerta.alertsContext}
                        alertsDimension={state.alerta.alertsDimension}
                        alertsResponisble={state.alerta.alertsResponisble}
                        getDimensionsByContext={getDimensionsByContext}
                        handleUpdateAlert={handleUpdateAlert}
                        editable={editable}
                        handleEditable={() => setEditable(!editable)}
                        handleForm={handleForm}
                      />
                    </Col>
                    <Col md={6}>
                      <Card className='bg-white__radius'>
                        <CardHead>
                          <CardTitle>Normativas</CardTitle>
                          <CardHeadActions>
                            <AddResource onClick={() => setmodalVisible(!modalVisible)} disabled={!editable} opacity={!!editable}>Agregar</AddResource>
                            <Dropdown isOpen={dropMenu} toggle={() => setdropMenu(!dropMenu)}>
                              <DropdownToggle color='primary' disabled={!editable} caret>
                                <input type='checkbox' checked={selectAll} onClick={handleSelectAll} />
                              </DropdownToggle>
                              <DropdownMenu right>
                                <DropdownItem onClick={deteleAll}>Eliminar</DropdownItem>
                              </DropdownMenu>
                            </Dropdown>
                          </CardHeadActions>
                        </CardHead>
                        <NormativasForm
                          normativas={normativas}
                          handleSelectItem={handleSelectItem}
                          visibleMenu={visibleMenu}
                          handleMenu={() => setVisibleMenu(!visibleMenu)}
                          handleEditItem={handleEditItem}
                          handleDeleteItem={handleDeleteItem}
                        />
                        {
                                    editable
                                      ? <FormGroup className='fied-upload'>
                                        <div className='fileinput-buttons'>
                                          <IconAdd />
                                          <Button color='primary' outline>{Object.keys(imageNormativa).length > 0 ? 'Actualizar Archivo' : 'Subir Archivo'}</Button>
                                          <input
                                            accept='pdf/*'
                                            id='profile-pic-id'
                                            type='file'
                                            name='profilePic'
                                            onChange={e => {
                                              handleUploadNormativas(e)
                                            }}
                                          />
                                        </div>
                                        {uploadingNormativas ? <Loading><div className='single-loading' /></Loading> : null}
                                      </FormGroup>
                                      : null
                                }

                      </Card>
                      <Card className='bg-white__radius'>
                        <CardTitle>Ficha</CardTitle>
                        {
                                    editable
                                      ? <FormGroup className='fied-upload'>

                                        <div className='d-flex align-items-center'>
                                          <div className='fileinput-buttons'>
                                            <IconAdd />
                                            <Button color='primary' outline>{Object.keys(image).length > 0 ? 'Actualizar Archivo' : 'Subir Archivo'}</Button>
                                            <input
                                              accept='pdf/*'
                                              id='profile-pic-id'
                                              type='file'
                                              name='profilePic'
                                              onChange={e => {
                                                handleUpload(e)
                                              }}
                                            />
                                          </div>
                                          {
                                                props.alerta.fichaUrl !== ''
                                                  ? <Button className='ml-2' onClick={() => handleOpenFile(props.alerta.fichaUrl)} color='primary'>Ver ficha</Button>
                                                  : null
                                            }
                                        </div>
                                        {uploading ? <Loading><div className='single-loading' /></Loading> : null}
                                      </FormGroup>
                                      : null
                                }
                      </Card>
                    </Col>
                  </Row>
                  : <LoadingForm><div className='single-loading' /></LoadingForm>
            }

      <NormativasModal
        visible={modalVisible}
        handleToggle={() => setmodalVisible(!modalVisible)}
        handleAdd={handleAdd}
      />
      {
                currentNormativa !== null
                  ? <EditNormativasModal
                      normativa={currentNormativa}
                      visible={modalVisible}
                      handleToggle={() => setmodalVisible(!modalVisible)}
                      handleUpdate={handleUpdate}
                    />
                  : null
            }
      {
                props.loading
                  ? <Loading>
                    <div className='single-loading' />
                    <LoadingFeedback>Por favor espere...</LoadingFeedback>
                  </Loading>
                  : null
            }
    </Wrapper>
  )
}

const Wrapper = styled.div`
    position: relative;
`

const Loading = styled.div`
    position: absolute;
    background: rgba(255, 255, 255, 0.7);
    top: 0px;
    bottom: 0px;
    left: 0px;
    right: 0px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
`

const LoadingForm = styled.div`
    min-height: 400px;
    display: flex;
    align-items: center;
    justify-content: center;
`

const LoadingFeedback = styled.strong`
    color: #145388;
    font-size: 15px;
`

const Card = styled.div`
  background: #fff;
  border-radius: calc(0.85rem - 1px);
  box-shadow: 0 1px 15px rgba(0, 0, 0, 0.04), 0 1px 6px rgba(0, 0, 0, 0.04);
`

const CardTitle = styled.h5`
  color: #000;
  margin-bottom: 10px;
`

const CardHead = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
`

const CardHeadActions = styled.div`
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    width: 29%;
    display: flex;
`

const AddResource = styled.button`
    border: 0;
    background: ${colors.primary};
    padding: 10px 25px;
    border-radius: 20px;
    color: #fff;
    cursor: pointer;
    opacity: ${props => props.disabled ? 0.65 : 1};
`

const FormGroup = styled.div`
    position: relative;
`

const IconAdd = styled(AddIcon)`
    font-size: 60px !important;
    color: #145388;
    margin-right: 10px;
`

const SelectItems = styled.button`
    border: 0;
    background: ${colors.primary};
    padding: 10px 20px;
    border-radius: 20px;
    color: #fff;
    cursor: pointer;
    margin-left: 5px;
    & input {
        position: relative;
        top: 2px;
    }
`

const Errors = styled.div`
    display: flex;
    flex-direction: column;
    margin-bottom: 10px;
`

const ErrorsTitle = styled.h5`
    color: #bd0505;
    font-weight: bold;
    font-size: 16px;
`

const List = styled.div`
    display: flex;
    flex-direction: column;
`

const Error = styled.span`
   margin-bottom: 5px;
   color: #bd0505;
`

export default ModificarAlerta
