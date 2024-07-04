import React from 'react'
import styled from 'styled-components'
import { Container, Button, Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap'
import { getStepsGlobal, addNewStep, disableStep } from '../../../../../redux/alertaTemprana/actionRequests'
import { useSelector } from 'react-redux'
import { useActions } from 'Hooks/useActions'
import useNotification from 'Hooks/useNotification'

import ProcesoModal from './ProcesoModal'
import ProcesoForm from './ProcesoForm'

type AlertaProps = {};

type IStore = {
    alertaTemprana: any
}

type SnackbarConfig = {
    variant: string,
    msg: string
};

const Proceso: React.FC<AlertaProps> = (props) => {
  const [steps, setSteps] = React.useState<Array<any>>([])
  const [loading, setLoading] = React.useState<boolean>(false)
  const [modalVisible, setModalVisible] = React.useState<boolean>(false)
  const [dropMenu, setdropMenu] = React.useState<boolean>(false)
  const [selectAll, setSelectAll] = React.useState<boolean>(false)
  const [visibleMenu, setVisibleMenu] = React.useState<boolean>(false)
  const [editIndex, setEditIndex] = React.useState<number>(-1)
  const [currentStep, setCurrentStep] = React.useState<any>(null)
  const [snackBarContent, setSnackbarContent] = React.useState<SnackbarConfig>({ variant: '', msg: '' })
  const [snackbar, handleClick] = useNotification()
  const actions = useActions({ getStepsGlobal, addNewStep, disableStep })

  const state = useSelector((store: IStore) => {
    return {
      steps: store.alertaTemprana
    }
  })

  const showNotification = (variant: string, msg: string) => {
    setSnackbarContent({ variant, msg })
    handleClick()
  }

  React.useEffect(() => {
    fetchSteps()
  }, [])

  const fetchSteps = async () => {
    await actions.getStepsGlobal()
  }

  React.useEffect(() => {
    setSteps(state.steps.globalSteps.map(step => {
      return {
        ...step
      }
    }) || [])
  }, [state.steps.globalSteps])

  const handleAdd = async (values: any) => {
    try {
      setLoading(true)
      const res = await actions.addNewStep(values)
      if (!res.error) {
        setLoading(false)
        setModalVisible(!modalVisible)
        showNotification('success', 'Se ha agregado el paso correctamente')
        fetchSteps()
      } else {
        setLoading(false)
        setModalVisible(!modalVisible)
        showNotification('error', 'Oops! Algo ha salido mal')
      }
    } catch (error) {
      setLoading(false)
      setModalVisible(!modalVisible)
      showNotification('error', 'Oops! Algo ha salido mal')
    }
  }

  const handleSelectAll = () => {
    setSelectAll(!setSelectAll)
    const temps = []
    steps.map((normativa, i) => {
      temps.push({
        ...normativa,
        selected: !!setSelectAll
      })
    })
    setSteps(temps)
  }

  const deteleAll = () => {
    const temps = [...steps]
    const selecteds = temps.filter(normativa => normativa.selected)
    selecteds.map((selected, index) => {
      const i = temps.findIndex(normativa => normativa.nombre === selected.nombre)
      temps.splice(i, 1)
    })
    setSteps(temps)
  }

  const handleSelectItem = (index: number) => {
    const temps = [...steps]
    temps[index].selected = !temps[index].selected
    setSteps(temps)
  }

  const handleEditItem = (index: number) => {
    const currentStep = Object.assign({}, steps[index])
    setModalVisible(!modalVisible)
    setEditIndex(index)
    setCurrentStep(currentStep)
  }

  const handleDeleteItem = async (index: number) => {
    const currentStep = steps[index]
    const res = await actions.disableStep(currentStep.id)
    if (!res.error) {
      showNotification('success', 'Se ha deshabilitado el paso correctamente')
      fetchSteps()
    } else {
      showNotification('error', res.message)
    }
  }

  return (
    <Container>
      {snackbar(snackBarContent.variant, snackBarContent.msg)}
      <Title>Configuración del proceso de atención</Title>
      <Card className='bg-white__radius'>
        <CardHead>
          <CardTitle>Paso del proceso de atención</CardTitle>
          <CardHeadActions>
            <Button color='primary' onClick={() => setModalVisible(!modalVisible)}>Agregar</Button>
            <Dropdown isOpen={dropMenu} toggle={() => setdropMenu(!dropMenu)}>
              <DropdownToggle color='primary' caret>
                <input type='checkbox' checked={selectAll} onClick={handleSelectAll} />
              </DropdownToggle>
              <DropdownMenu right>
                <DropdownItem onClick={deteleAll}>Eliminar</DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </CardHeadActions>
        </CardHead>
        <ProcesoForm
          steps={steps}
          handleSelectItem={handleSelectItem}
          visibleMenu={visibleMenu}
          handleMenu={() => setVisibleMenu(!visibleMenu)}
          handleEditItem={handleEditItem}
          handleDeleteItem={handleDeleteItem}
        />
      </Card>
      <ProcesoModal
        steps={steps}
        visible={modalVisible}
        handleToggle={() => setModalVisible(!modalVisible)}
        handleAdd={handleAdd}
        loading={loading}
      />
    </Container>
  )
}

const Title = styled.strong`
    color: #000;
    font-size: 17px;
    margin: 35px 0px 20px;
    display: block;
`

const Card = styled.div`
  background: #fff;
  border-radius: calc(0.85rem - 1px);
  box-shadow: 0 1px 15px rgba(0, 0, 0, 0.04), 0 1px 6px rgba(0, 0, 0, 0.04);
  width: 50%;
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

export default Proceso
