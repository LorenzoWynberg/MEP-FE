import React, { useState, useEffect } from 'react'
import { Colxx } from 'Components/common/CustomBootstrap'

import { Row, Modal, ModalBody, ModalHeader, Form } from 'reactstrap'
import { EditButton } from 'components/EditButton'
import MiembroPersonalDataForm from './MiembroPersonalData'
import MiembroId from './MiembroId'
import Asociacion from './Asociacion'
import InformacionContacto from './InformacionContacto'
import 'react-datepicker/dist/react-datepicker.css'
import ProgressBar from './ProgressBar'
import HighlightOffIcon from '@material-ui/icons/HighlightOff'
import styled from 'styled-components'
import Loader from 'components/Loader'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

const General = (props) => {
  const { t } = useTranslation()

  const {
    editable,
    setEditable,
    handleChange,
    handleLoadMember,
    memberData,
    disableFields,
    image,
    setImage,
    loadingId,
    setLoadingId,
    state,
    disableIds,
    itemsToLoad,
    loadingProgress,
    handleFile,
    openFilesModal,
    handleOpenFiles,
    setDisplayingModalFiles,
    //  sendData,
    loadingOnSave,
    files,
    handleCloseFiles,
    handleResourceDelete,
    actions,
    setLoading,
    setDisableFields,
    setDisableIds,
    loading
  } = props
  const [alertModalOpen, setAlertModalOpen] = useState()

  const { handleSubmit } = useForm()

  useEffect(() => {
    const loadData = async () => {
      if (state.miembro.currentMember.id) {
        const response = await actions.getFamilyMember(
          state.miembro.currentMember.id
        )
      }
      setLoading(false)
    }
    loadData()

    return () => {
      setDisableIds(false)
      actions.cleanCurrentMember()
      setEditable(false)
    }
  }, [])

  const toggleAlertModal = () => {
    setAlertModalOpen(!alertModalOpen)
  }
  const sendData = (data) => {
  // props.sendData(data);
    props.miembro.currentMember.id ? props.authHandler('modificar', () => props.sendData(data)) : props.authHandler('crear', () => props.sendData(data))
  }
  return (
    <Form onSubmit={handleSubmit(sendData)}>
      {loading
        ? (
          <Loader />
          )
        : (
          <div>
            {state.miembro.loading && itemsToLoad > 0 && (
              <ProgressBar
                itemsToLoad={itemsToLoad}
                loadingProgress={loadingProgress}
              />
            )}
            <br />
            <MiembroId
              {...props}
              handleChange={handleChange}
              toggleAlertModal={toggleAlertModal}
              clearErrors={props.clearErrors}
              loadMemberActions={handleLoadMember}
              memberData={memberData}
              avoidSearch={props.avoidSearch}
              editable={editable}
              disableFields={disableFields}
              disableIds={props.disableIds}
              image={image}
              setImage={setImage}
              loading={loadingId}
              setLoading={setLoadingId}
              errors={state.errors}
              fields={state.fields}
              setDisableFields={setDisableFields}
            />
            <Row>
              <Colxx xxs='12' md='6' className='mt-5'>
                <MiembroPersonalDataForm
                  memberData={memberData}
                  disabled={disableFields}
                  editable={editable}
                  identification={props.identification}
                  selects={props.selects}
                  handleChange={handleChange}
                  errors={state.errors}
                  fields={state.fields}
                  discapacidades={props.discapacidades}
                />
              </Colxx>
              <Colxx xxs='12' md='6' className='mt-5'>
                <Asociacion
                  handleFile={handleFile}
                  memberData={memberData}
                  toggleAlertModal={toggleAlertModal}
                  selects={props.selects}
                  handleChange={handleChange}
                  editable={editable}
                  errors={state.errors}
                  openFilesModal={openFilesModal}
                  handleOpenFiles={handleOpenFiles}
                  fields={state.fields}
                  setDisplayingModalFiles={setDisplayingModalFiles}
                />
                <InformacionContacto
                  personalData={memberData}
                  handleChange={handleChange}
                  editable={editable}
                  errors={state.errors}
                  fields={state.fields}
                />
              </Colxx>
              <div className='container-center my-5 mb-3'>
                <EditButton
                  editable={editable}
                  setEditable={setEditable}
                  loading={loadingOnSave}
                />
              </div>
              <Modal isOpen={openFilesModal}>
                <ModalHeader toggle={handleCloseFiles} />
                <ModalBody>
                  <div>
                    {files &&
                    files.map((item) => {
                      return (
                        <FileAnchorContainer>
                          <a
                            href={item.descripcion}
                            target='_blank'
                            rel='noopener noreferrer'
                          >
                            {item.name || item.titulo}
                          </a>
                          <span
                            onClick={() => {
                              handleResourceDelete(item)
                            }}
                          >
                            <HighlightOffIcon />
                          </span>
                        </FileAnchorContainer>
                      )
                    })}
                  </div>
                </ModalBody>
              </Modal>
              <Modal isOpen={alertModalOpen} toggle={toggleAlertModal}>
                <ModalHeader toggle={toggleAlertModal}>{t('estudiantes>expediente>hogar>miembros_hogar>agregar>modal>titulo', 'Acción no permitida')}</ModalHeader>
                <ModalBody>
                  <div>
                    <p>
                      {t('estudiantes>expediente>hogar>miembros_hogar>agregar>modal>mensaje', 'Para poder adjuntar archivos como imagenes o documentos debe primero crear el miembro')}
                    </p>
                  </div>
                </ModalBody>
              </Modal>
            </Row>
          </div>)}
    </Form>
  )
}

const FileAnchorContainer = styled.div`
  text-align: center;
  margin: 1rem;
  display: flex;
  align-content: space-between;

  a {
    padding-top: 1.35px;
  }
`

export default General
