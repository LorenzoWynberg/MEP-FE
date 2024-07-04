import React, { useState, useEffect } from 'react'
import { Colxx } from 'Components/common/CustomBootstrap'
import {
  Row,
  Modal,
  ModalBody,
  ModalHeader,
  Button,
  Card,
  CardBody,
  CardTitle
} from 'reactstrap'
import MiembroPersonalDataForm from './MiembroPersonalData'
import Asociacion from './Asociacion'
import InformacionContacto from './InformacionContacto'
import 'react-datepicker/dist/react-datepicker.css'
import ProgressBar from './ProgressBar'
import HighlightOffIcon from '@material-ui/icons/HighlightOff'
import styled from 'styled-components'
import Loader from '../../../../../../components/Loader'
import { useForm } from 'react-hook-form'
import swal from 'sweetalert'
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
    itemsToLoad,
    loadingProgress,
    handleFile,
    openFilesModal,
    handleOpenFiles,
    setDisplayingModalFiles,
    sendData,
    loadingOnSave,
    files,
    handleCloseFiles,
    handleResourceDelete,
    actions,
    setLoading,
    setDisableFields,
    loading,
    onCancelBtn
  } = props
  const [alertModalOpen, setAlertModalOpen] = useState()

  const {
    handleSubmit,
    errors,
    watch,
    register,
    formState,
    setValue,
    reset
  } = useForm({ validateCriteriaMode: 'all', mode: 'onChange' })

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
      actions.cleanCurrentMember()
      setEditable(true)
    }
  }, [])

  const toggleAlertModal = () => {
    setAlertModalOpen(!alertModalOpen)
  }

  return (
    <div>
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

            <Row>
              <Colxx xxs='12' md='12' className='mt-5'>
                <Card>

                  <CardBody>
                    <CardTitle>{t('estudiantes>matricula_estudiantil>matricular_estudiante>encargados>info_encargado', 'Información del encargado')}</CardTitle>
                    <Row>
                      <Colxx xxs='6' md='6'>

                        <MiembroPersonalDataForm
                  {...props}
                  loadMemberActions={handleLoadMember}
                  avoidSearch={props.avoidSearch}
                  memberData={memberData}
                  disabled={disableFields}
                  editable={editable}
                  identification={props.identification}
                  selects={props.selects}
                  handleChange={handleChange}
                  errors={state.errors}
                  fields={state.fields}
                  discapacidades={props.discapacidades}
                  disableFields={disableFields}
                  disableIds={props.disableIds}
                  setDisableFields={setDisableFields}
                  image={image}
                  setImage={setImage}
                  loading={loadingId}
                  setLoading={setLoadingId}
                  toggleAlertModal={toggleAlertModal}
                />
                      </Colxx>
                      <Colxx xxs='6' md='6'>
                        <InformacionContacto
                  personalData={memberData}
                  handleChange={handleChange}
                  editable={editable}
                  errors={state.errors}
                  fields={state.fields}
                />
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

                      </Colxx>
                    </Row>
                  </CardBody>
                </Card>

                <div className='container-center my-5 mb-3'>
                  {loading
                    ? (
                      <>
                        <Loader formLoader />
                      </>
                      )
                    : (
                      <>
                        <Button
                  color='primary'
                  className='btn-shadow m-0 edit-btn-cancelar'
                  outline
                  type='button'
                  onClick={() => {
                          props.onCancelBtn(false)
                          props.toggleNavigationStep(true)
                        }}
                >
                  {t('boton>general>cancelar', 'Cancelar')}
                </Button>
                        {editable
                  ? (
                          <Button
                            color='primary'
                            className='btn-shadow m-0'
                            type='submit'
                            onClick={
                          handleSubmit(sendData)
                        }
                          >
                            {t('boton>general>guardar', 'Guardar')}
                          </Button>
                    )
                  : (
                          <Button
                            color='primary'
                            className='btn-shadow m-0'
                            type='button'
                            onClick={() => {
                              setEditable(true)
                            }}
                          >
                            Editar
                          </Button>
                    )}
                      </>
                      )}
                </div>
              </Colxx>
              <Modal isOpen={openFilesModal}>
                <ModalHeader toggle={handleCloseFiles}>
                  Lista de archivos
                </ModalHeader>
                <ModalBody>
                  <table style={{ width: '100%' }}>
                    <tr>
                      <th>
                        Nombre
                    </th>
                      <th>
                        Extensión
                    </th>
                      <th />
                    </tr>
                    {files &&
                    files.map((item) => {
                      const fileUrl = item.url.split('.')
                      return (
                        <tr>
                          <td>
                            <a
                              href={item.descripcion}
                              target='_blank'
                              rel='noopener noreferrer'
                            >
                              {item.name || item.titulo}
                            </a>
                          </td>
                          <td>
                            <span>
                              {fileUrl[fileUrl.length - 1]}
                            </span>
                          </td>
                          <td>
                            <span
                              onClick={() => {
                                swal({
                                  title: 'Atención',
                                  text: '¿Está seguro de querer eliminar este archivo?',
                                  dangerMode: true,
                                  icon: 'warning',
                                  buttons: ['Cancelar', 'Aceptar']
                                }).then(async val => {
                                  if (val) {
                                    handleResourceDelete(item)
                                  }
                                })
                              }}
                            >
                              <HighlightOffIcon />
                            </span>
                          </td>
                        </tr>
                      )
                    })}
                  </table>
                </ModalBody>
              </Modal>
              <Modal isOpen={alertModalOpen} toggle={toggleAlertModal}>
                <ModalHeader toggle={toggleAlertModal}>
                  Acción no permitida
                </ModalHeader>
                <ModalBody>
                  <div>
                    <p>
                      Para poder adjuntar archivos como imagenes o documentos debe
                      primero crear el miembro
                    </p>
                  </div>
                </ModalBody>
              </Modal>
            </Row>
          </div>
          )}
    </div>
  )
}

const FileAnchorContainer = styled.tr`
  text-align: center;
  margin: 1rem;
  display: flex;
  align-content: space-between;

  a {
    padding-top: 1.35px;
  }
`

export default General
