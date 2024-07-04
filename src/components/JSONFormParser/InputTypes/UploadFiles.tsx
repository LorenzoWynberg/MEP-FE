import React, { useState } from 'react'
import { makeStyles } from '@material-ui/core'
import { Button, Modal, ModalHeader, ModalBody } from 'reactstrap'
import colors from '../../../assets/js/colors'
import styled from 'styled-components'
import HighlightOffIcon from '@material-ui/icons/HighlightOff'
import { TooltipSimple } from '../../../utils/tooltip.tsx'
import ImageOutlinedIcon from '@material-ui/icons/ImageOutlined'
import CameraAltOutlinedIcon from '@material-ui/icons/CameraAltOutlined'
import VolumeUpOutlinedIcon from '@material-ui/icons/VolumeUpOutlined'
import QueueMusicOutlinedIcon from '@material-ui/icons/QueueMusicOutlined'
import CloudUploadOutlinedIcon from '@material-ui/icons/CloudUploadOutlined'
import { TooltipLabel } from '../styles.tsx'
import { maxLengthString } from '../../../utils/maxLengthString'

import {
  allExtentions,
  imageExtensions,
  audioExtensions
} from 'Utils/extensionsFiles'

import { map } from 'lodash'

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      margin: theme.spacing(1)
    }
  },
  input: {
    display: 'none'
  },
  avatar: {
    width: '150px',
    height: '150px'
  },
  buttonIcon: {
    width: '150px',
    height: '150px',
    background: colors.primary,
    '&:hover': {
      background: '#0c3253'
    }
  },
  icon: {
    width: '80px',
    height: '80px',
    color: '#fff'
  }
}))

const UploadFiles = (props) => {
  const { handleFilesDelete } = props
  const [modalOpen, setModalOpen] = useState(false)
  const classes = useStyles()
  const isImage = props.field.config?.type === 'imagen'

  const handleFileChange = async (e) => {
    const item = e.target.files[0]
    // const data = new FormData();
    // data.append("file", item);
    // let file: FileInterface
    // let response
    // try {
    //     response = await axios.post(
    //         `${envVariables.BACKEND_URL}/api/File/resource`,
    //         data,
    //     );
    // } catch (e) {
    //     return { message: e.message, error: true };
    // }
    if (item) {
      const file = {
        url: URL.createObjectURL(item),
        fileItem: item,
        title: item.name
      }
      props.handleFilesChange(file, props.field)
    }
  }

  const toggleModal = () => {
    setModalOpen(!modalOpen)
  }

  const getAcceptedTypes = () => {
    if (
      !props.field.config.typesAccepted ||
      props.field.config.typesAccepted == '*'
    ) {
      switch (props.field.config?.type) {
        case 'imagen':
          return map(imageExtensions, 'extension').join(',')
        case 'audio':
          return map(audioExtensions, 'extension').join(',')

        default:
          return map(allExtentions, 'extension').join(',')
      }
    } else {
      return props.field.config.typesAccepted
    }
  }

  const showModalCondition =
    props.files[props.field.id] &&
    props.files[props.field.id].filter((file) => file.show).length > 0

  return (
    <div className='position-relative'>
      <TooltipLabel field={props.field} />
      <ButtonsContainer>
        <IconSpan className='upload-files-type-icon'>
          {
            {
              archivo: <CloudUploadOutlinedIcon className='icon' />,
              imagen: <ImageOutlinedIcon className='icon' />,
              imagen1: <CameraAltOutlinedIcon className='icon' />,
              audio: <VolumeUpOutlinedIcon className='icon' />,
              audio1: <QueueMusicOutlinedIcon className='icon' />
            }[props.field.config.icon]
          }
        </IconSpan>
        {props.editable && (
          <input
            onChange={(e) => {
              handleFileChange(e)
            }}
            className={classes.input}
            id={props.field.id}
            type='file'
            name={props.field.id}
            accept={getAcceptedTypes()}
            disabled={
              !props.editable ||
              props.readOnlyFields?.includes(props.field.id) ||
              props.files[props.field.id]?.filter(el => el.show).length ===
                (props.field.config.maxFiles || 1)
            }
          />
        )}
        {props.editable &&
          ((props.files[props.field.id] &&
            props.files[props.field.id]?.filter((el) => el.show).length < (props.field.config.maxFiles || 1)
          ) ||
            !props.files[props.field.id]) && (
              <label htmlFor={props.field.id}>
                <FileLabel
                  color='primary'
                  outline
                  type='button'
                  disabled={
                  !props.editable ||
                  props.readOnlyFields?.includes(props.field.id)
                }
                >
                  Subir{' '}
                  {props.field.config?.type == 'imagen'
                    ? 'Imagen'
                    : props.field.config?.type == 'audio'
                      ? 'Audio'
                      : 'Archivo'}
                </FileLabel>
              </label>
        )}
        {showModalCondition && (
          <Button
            color='primary'
            type='button'
            tag='span'
            onClick={toggleModal}
          >
            Ver{' '}
            {props.field.config?.type == 'imagen'
              ? `(${props.files[props.field.id] ? props.files[props.field.id]?.filter((el) => el.show).length : 0} Imagenes)`
              : props.field.config?.type == 'audio'
                ? `(${props.files[props.field.id] ? props.files[props.field.id]?.filter((el) => el.show).length : 0} Audios)`
                : 'Archivos'}
          </Button>
        )}
        <Modal
          size='lg'
          isOpen={modalOpen && showModalCondition}
          toggle={toggleModal}
        >
          <ModalHeader toggle={toggleModal}>
            {props.field.config?.type == 'imagen'
              ? 'Imagenes'
              : props.field.config?.type == 'audio'
                ? 'Audios'
                : 'Archivos'}
          </ModalHeader>
          <ModalBody>
            <div>
              {props.field.config.maxFiles == 1 && props.files[props.field.id]?.filter(el => el.show).length === 1
                ? <SingleImageContainer>
                  <StyledImage
                    src={props.files[props.field.id]?.filter(el => el.show)[0].url}
                    alt={`${props.field.id}`}
                  />
                  <IconContainer>
                    <HighlightOffIcon
                      style={{ color: 'gray' }} onClick={() => {
                        handleFilesDelete(props.files[props.field.id]?.filter(el => el.show)[0].id, props.field)
                      }}
                    />
                  </IconContainer>
                  </SingleImageContainer>
                : <FilesContainer isImage={isImage}>
                  {props.files[props.field.id]
                    ? props.files[props.field.id].map((file) => {
                      const newTitle: string = file.title ? maxLengthString(file.title, 16) : ''
                      if (props.field.config.type == 'audio') {
                        if (file.show) {
                          return (
                            <FlexCentered>
                              <span style={{ display: 'flex' }}>
                                <TooltipSimple
                                  title={file.title}
                                  element={<p>{newTitle}</p>}
                                />
                                {props.editable && (
                                  <span>
                                    <HighlightOffIcon
                                      style={{ marginLeft: '0.5rem' }}
                                      onClick={() => {
                                      handleFilesDelete(file.id, props.field)
                                    }}
                                    />
                                  </span>
                                )}
                              </span>
                              <video src={file.url} controls name='media' />
                            </FlexCentered>
                          )
                        }
                      } else if (isImage) {
                        if (file.show) {
                          return (
                            <TooltipSimple
                              title={file.title}
                              element={
                                <ImageContainer>
                                  <ImageTag src={file.url} />
                                  <ImageTitleCntainer>
                                    <p>{newTitle}</p>
                                    {props.editable && (
                                      <span>
                                      <HighlightOffIcon
                                        onClick={() => {
                                          handleFilesDelete(
                                            file.id,
                                            props.field
                                          )
                                        }}
                                      />
                                    </span>
                                    )}
                                  </ImageTitleCntainer>
                                </ImageContainer>
                              }
                            />
                          )
                        }
                      }
                      if (file.show) {
                        return (
                          <AnchorContainer>
                            <a href={file.url} target='_blank' rel='noreferrer'>
                              {file.title}
                            </a>
                            {props.editable && (
                              <span>
                                <HighlightOffIcon
                                  onClick={() => {
                                    handleFilesDelete(file.id, props.field)
                                  }}
                                />
                              </span>
                            )}
                          </AnchorContainer>
                        )
                      }
                    })
                    : null}
                </FilesContainer>}
            </div>
          </ModalBody>
        </Modal>
      </ButtonsContainer>
      <span style={{ color: 'red' }}>
        {/* props.validationArray.find(el => el == props.field.id) && "Este campo es requerido" */}
      </span>
    </div>
  )
}
// Styles
const ButtonsContainer = styled.div`
  display: flex;
  height: 2.7rem;
  margin-bottom: 1rem;
`

const AnchorContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid lightgray;
`

const FileLabel = styled.div`
  background-color: white;
  color: ${(props) => (props.disabled ? '#636363' : colors.primary)};
  border: 1.5px solid
    ${(props) => (props.disabled ? '#636363' : colors.primary)};
  width: 7rem;
  height: 2.7rem;
  text-align: center;
  justify-content: center;
  align-items: center;
  display: flex;
  border-radius: 26px;
  &:hover {
    background-color: ${(props) => (props.disabled ? '' : colors.primary)};
    color: ${(props) => (props.disabled ? '' : 'white')};
  }
`

const IconSpan = styled.span`
  font-size: 2rem;
  width: 5rem;
  display: flex;
  justify-content: center;
  align-items: center;
`

const ImageContainer = styled.div`
  position: relative;
  margin: 0.47rem;
`
const ImageTag = styled.img`
  width: 10rem;
  height: 10rem;
`

const FilesContainer = styled.div`
  display: ${(props) => (props.isImage ? 'flex' : 'initial')};
  padding: ${(props) => (props.isImage ? '1.35rem' : '0')};
  flex-wrap: wrap;
`

const ImageTitleCntainer = styled.div`
  position: absolute;
  bottom: 0;
  background-image: linear-gradient(to bottom, transparent, black);
  color: white;
  height: 4rem;
  display: flex;
  justify-content: space-around;
  align-items: center;
  width: 100%;
`

const FlexCentered = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`

const StyledImage = styled.img`
    width: 100%;
`

const SingleImageContainer = styled.div`
    position: relative;
`

const IconContainer = styled.div`
    position: absolute;
    top: 20px;
    right: 20px;
`

export default UploadFiles
