import React from 'react'
import { ModalBody, Modal, ModalHeader, Button } from 'reactstrap'
import styled from 'styled-components'

import StyledMultiSelect from 'Components/styles/StyledMultiSelect'

type ComentariosAlertaProps = {
    currentAlert: any,
    visible: boolean,
    loading: boolean,
    handleCancel: Function,
    handleSave: Function,
}

const ReasignarResponsables: React.FC<ComentariosAlertaProps> = (props) => {
  const [observations, setObservations] = React.useState<string>('')
  const [selectedLevels, setSelectedLevels] = React.useState<Array<any>>([])
  const [stagedLevelsOptions, setStagedLevelsOptions] = React.useState<Array<any>>([])
  const [isOpenLevels, setIsOpenLevels] = React.useState<boolean>(false)

  React.useEffect(() => {
    const responsables = props.currentAlert.responsables.map(responsable => responsable.id)
    setSelectedLevels(responsables)
  }, [props.currentAlert])

  const toggleLevels = (e: React.ChangeEvent<HTMLInputElement>, save: boolean = false) => {
    if (save) {
      setSelectedLevels(stagedLevelsOptions)
    } else {
      setStagedLevelsOptions(selectedLevels)
    }
    setIsOpenLevels(!isOpenLevels)
  }

  const handleChangeLevel = (item) => {
    if (stagedLevelsOptions.includes(item.id)) return setStagedLevelsOptions(stagedLevelsOptions.filter(el => el !== item.id))
    setStagedLevelsOptions([...stagedLevelsOptions, item.id])
  }

  const handleSave = () => {
    props.handleSave(observations)
  }

  return (
    <CustomModal
      isOpen={props.visible}
      centered
      size='md'
      backdrop
    >
      <Header>
        Reasignar responsble
      </Header>
      <StyledModalBody>
        <Label>Responsable de recibir la alerta</Label>
        <StyledMultiSelect
          toggle={toggleLevels}
          selectedOptions={selectedLevels}
          isOpen={isOpenLevels}
          editable
          stagedOptions={stagedLevelsOptions}
          options={props.currentAlert.responsables || []}
          handleChangeItem={handleChangeLevel}
          height='4rem'
        />
        <Actions>
          <Button className='mr-2' onClick={props.handleCancel} color='primary' outline>Cancelar</Button>
          <Button onClick={handleSave} color='primary'>Guardar</Button>
        </Actions>
        {props.loading ? <Loading><div className='single-loading' /></Loading> : null}
      </StyledModalBody>
    </CustomModal>
  )
}

const CustomModal = styled(Modal)`
    box-shadow: none;
`

const StyledModalBody = styled(ModalBody)`
    padding: 20px 30px !important;
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

const Header = styled(ModalHeader)`
    padding: 15px 30px !important;
    border-bottom-width: 1px;
    border-bottom-color: #ddd;
`

const Label = styled.label`
    color: #000;
    margin-bottom: 5px;
`

const Actions = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-around;
    width: 30%;
    justify-content: space-around;
    margin: 10px auto;
`

export default ReasignarResponsables
