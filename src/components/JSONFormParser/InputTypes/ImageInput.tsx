import React, { useState, FunctionComponent, useEffect } from 'react'
import {
  Input,
  FormGroup,
  FormFeedback,
  Button,
  Modal,
  ModalHeader,
  ModalBody
} from 'reactstrap'
import { makeStyles, Avatar, IconButton } from '@material-ui/core'
import styled from 'styled-components'
import colors from '../../../assets/js/colors'
import { Field } from '../Interfaces'
import Loader from '../../Loader'
import { envVariables } from '../../../constants/enviroment'
import axios from 'axios'
import AddAPhotoIcon from '@material-ui/icons/AddAPhoto'
import { TooltipLabel } from '../styles.tsx'
import HighlightOffIcon from '@material-ui/icons/HighlightOff'

const useStyles = makeStyles(theme => ({
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
    height: '150px',
    margin: '0 auto'
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

type Props = {
    field: Field;
    register: any;
    currentItem: {
        solucion: object;
    };
};

interface ItemImage {
    preview: string;
    raw: string;
}

const ImageInput: FunctionComponent<Props> = props => {
  const [image, setImage] = useState<ItemImage>({
    preview: props.currentItem?.solucion
      ? props.currentItem.solucion[
                  `${props.field.id}`
      ]
      : '',
    raw: ''
  })
  const [openViewImage, setOpenViewImage] = useState(false)
  const [loading, setLoading] = useState(false)
  const classes = useStyles()
  const imageUrl = props.watch(`${props.field.id}`)
  useEffect(() => {
    setImage({ preview: imageUrl, raw: '' })
  }, [imageUrl])

  const toggleModal = () => {
    setOpenViewImage(!openViewImage)
  }

  const uploadProfileImage = async (file: any) => {
    const data = new FormData()
    data.append('file', file)
    try {
      const response = await axios.post(
                `${envVariables.BACKEND_URL}/api/File/resource`,
                data
      )
      return response.data
    } catch (e) {
      return { message: e.message, error: true }
    }
  }

  const deleteImage = async (name: string) => {
    try {
      const response = await axios.delete(
                `${envVariables.BACKEND_URL}/api/ExpedienteCentroEducativo/Formulario/resources`, {
                  data: {
                    names: [name]
                  }
                })
      return response.data
    } catch (e) {
      return { message: e.message, error: true }
    }
  }

  const handleImageChange = async (e): Promise<void> => {
    if (e.target.files.length) {
      setLoading(true)
      setImage({
        preview: URL.createObjectURL(e.target.files[0]),
        raw: e.target.files[0]
      })
      const file = await uploadProfileImage(e.target.files[0])
      props.setValue(
                `${props.field.id}`,
                file.url
      )
      setLoading(false)
    }
  }

  const handleDeleteImage = async (name) => {
    setLoading(true)
    setImage({
      preview: '',
      raw: ''
    })
    const file = await deleteImage(name)
    props.setValue(
            `${props.field.id}`,
            ''
    )
    setOpenViewImage(false)
    setLoading(false)
  }

  return (
    <StyledFormGroup>
      <TooltipLabel field={props.field} />
      {props.field.shape !== 'circular'
        ? (
          <ImageStyledField src={image.preview}>
            {image.preview
              ? null
              : (
                <span>No hay imagen seleccionada</span>
                )}
          </ImageStyledField>
          )
        : (
          <>
            {image.preview
              ? (
                <Avatar
                  src={image.preview}
                  className={classes.avatar}
                />
                )
              : (
                <IconButton
                  className={classes.buttonIcon}
                  color='primary'
                  aria-label='Subir Fotografia'
                  component='span'
                >
                  <AddAPhotoIcon className={classes.icon} />
                </IconButton>
                )}
          </>
          )}
      <ButtonsContainer>
        {loading && <Loader formLoader />}
        {image.preview && (
          <Button
            color='primary'
            outline
            onClick={() => {
              toggleModal()
            }}
          >
            ver
          </Button>
        )}
        <label htmlFor={`${props.field.id}`}>
          {props.editable && <Input
            onChange={e => {
              handleImageChange(e, true)
            }}
            className={classes.input}
            id={`${props.field.id}`}
            type='file'
            disabled={!props.editable}
            invalid={
                            props.errors &&
                            props.errors[
                                `${props.field.id}`
                            ]
                        }
                             />}
          <Input
            className={classes.input}
            id={`${props.field.id}`}
            type='text'
            disabled={!props.editable || props.readOnlyFields?.includes(props.field.id)}
            invalid={
                            props.errors &&
                            props.errors[
                                `${props.field.id}`
                            ]
                        }
            name={`${props.field.id}`}
            innerRef={props.register({
              required: props.field.config.required
            })}
          />
          <FormFeedback>
            {props.errors &&
                        props.errors[`${props.field.id}`]
              ? 'El campo es requerido o fallo una validación'
              : null}
          </FormFeedback>
          {props.editable && !loading && <FileLabel>
            <span>Editar</span>
                                         </FileLabel>}
        </label>
        <Modal isOpen={openViewImage} toggle={toggleModal} size='lg'>
          <ModalHeader toggle={toggleModal} />
          <ModalBody>
            <ImageContainer>
              <StyledImage
                src={image.preview}
                alt={`${props.field.id}`}
              />
              {!loading && <IconContainer>
                <HighlightOffIcon
                  style={{ color: 'gray' }} onClick={() => {
                    handleDeleteImage(image.preview)
                  }}
                />
                           </IconContainer>}
            </ImageContainer>
          </ModalBody>
        </Modal>
      </ButtonsContainer>
    </StyledFormGroup>
  )
}

const ImageStyledField = styled.div`
    background-image: ${props => (props.src ? `url("${props.src}")` : 'unset')};
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center;
    min-height: 16rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
    background-position: center;
    align-items: center;
    background-size: cover;
    border: 1.5px solid grey;
`
const ButtonsContainer = styled.div`
    padding-top: 0.4rem;
    text-align: center;

    button {
        width: 7rem;
        margin: 1rem;
    }
`

const FileLabel = styled.div`
    background-color: ${colors.primary};
    color: white;
    border: 1.5px solid ${colors.primary};
    width: 7rem;
    height: 2.7rem;
    text-align: center;
    justify-content: center;
    align-items: center;
    display: flex;
    border-radius: 26px;
    &:hover {
        background-color: ${colors.primary};
        color: white;
    }
`

const StyledImage = styled.img`
    width: 100%;
`

const ImageContainer = styled.div`
    position: relative;
`

const IconContainer = styled.div`
    position: absolute;
    top: 20px;
    right: 20px;
`

const StyledFormGroup = styled(FormGroup)`
    display: flex;
    flex-direction: column;
`

export default ImageInput
