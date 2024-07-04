import React, { useState } from 'react'
import styled from 'styled-components'
import IconButton from '@material-ui/core/IconButton'
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto'
import { Button } from 'reactstrap'
import colors from 'Assets/js/colors'
import Modal from 'Components/Modal/simple'
import DropZone from 'Components/Form/DropZone'
import TakePhoto from './_partials/takePhoto'
import Cropper from 'Components/Form/CropImage'
import useFaceRecognition from './_partials/useFaceRecognition'
import ConfirmModal from 'Components/Modal/ConfirmModal'
import useNotification from 'Hooks/useNotification'
import { useTranslation } from 'react-i18next'

interface IProps {
  onPrev: Function
  onNext: Function
  setImageForm: Function
  verificar: Function
  photo: string
  isAplicar?: boolean
  dimex?: boolean
}
type SnackbarConfig = {
  variant: string
  msg: string
}
const FormPhoto: React.FC<IProps> = (props) => {
  const { t } = useTranslation()
  const { onPrev, onNext, setImageForm, photo, verificar, isAplicar, dimex } =
    props

  const [modalTakePhoto, setModalTakePhoto] = useState<boolean>(false)
  const [openCrop, setOpenCrop] = useState<boolean>(false)
  const [imageSrc, setImageSrc] = useState<string>(null)
  const { thereIsFace } = useFaceRecognition()
  const [noFaceModal, setNoFaceModal] = useState<boolean>(false)
  const imageRef = React.useRef()
  const cropFormat = {
    unit: '%',
    aspect: 1 / 1,
    width: 50,
    height: 70
  }

  const [snackbar, handleClick] = useNotification()
  const [snackBarContent, setSnackbarContent] = React.useState<SnackbarConfig>({
    variant: '',
    msg: ''
  })
  const showNotification = (variant: string, msg: string) => {
    setSnackbarContent({ variant, msg })
    handleClick()
  }
  const thereIsFaceOnImage = (base64Image) =>
    new Promise((resolve, reject) => {
      thereIsFace(base64Image)
        .then((hay) => {
          resolve(hay)
        })
        .catch((e) => reject(e))
    })

  const closeModalTakePhoto = () => {
    setImageForm(null)
    setModalTakePhoto(false)
  }
  const saveTakePhoto = async (src) => {
    await verificar(src)
    setImageForm(src)
    setModalTakePhoto(false)
  }
  const onTakeAnother = () => {
    setImageForm(null)
    setModalTakePhoto(false)
  }

  const saveUploadPhoto = async (img: File[]) => {
    setOpenCrop(true)
    if (img[0].size > 5000000) {
      showNotification('error', 'La fotografiá adjunta no debe ser mayor a 5MB')
      return
    }
    let src = null
    if (img) {
      src = await getBase64(img[0])
    }
    if (src) {
      setImageSrc(src)
      const isFace = await thereIsFaceOnImage(src)
      if (!isFace) setNoFaceModal(true)

      // setImageSrc(src)
      setModalTakePhoto(false)
    }
  }

  const getBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => resolve(reader.result)
      reader.onerror = (error) => reject(error)
    })
  }

  const handleCrop = async (img) => {
    setOpenCrop(false)
    await verificar(img)
    setImageSrc(null)
    setImageForm(img)
  }

  const handleClose = () => {
    setImageForm(null)
    setImageSrc(null)
    setOpenCrop(false)
  }
  const onDelete = () => {
    setImageForm(null)
    setImageSrc(null)
  }

  return (
    <div>
      {snackbar(snackBarContent.variant, snackBarContent.msg)}

      <ConfirmModal
        btnCancel={false}
        openDialog={noFaceModal}
        onClose={() => setNoFaceModal(false)}
        onConfirm={() => setNoFaceModal(false)}
        colorBtn='primary'
        txtBtn={t("general>aceptar", "Aceptar")}
        msg={t('identidad_persona>aplicar_cambios>no_se_ha_detectado_imagen','No se ha detectado un rostro en la imagen que intenta subir')}
        title={t('general>identidad','Identidad')}
      />
      <h5>{t('estudiantes>registro_matricula>matricula_estudian>registrar_persona>subir_foto', 'Sube o captura una foto para la persona estudiante (opcional)')}</h5>
      <label>'{t('estudiantes>registro_matricula>matricula_estudian>registrar_persona>subir_foto>label', 'Subir foto (tamaño máximo 5MB)')}</label>
      {photo
        ? (
          <ImageContainer>
            <ContentImage>
              <img ref={imageRef} src={photo} alt='' />
            </ContentImage>
            <Actions className='mt-5' justify='flex-start'>
              <Button
                className='mr-3'
                onClick={() => onTakeAnother()}
                color='primary'
              >
                <AddAPhotoIcon style={{ color: '#fff' }} fontSize='small' />
                {t('estudiantes>indentidad_per>aplicar_camb>subir_foto', 'Subir o tomar otra foto')}
              </Button>
              <Button outline onClick={() => onDelete()} color='secondary'>
                {t('boton>general>eliminar', 'Eliminar')}
              </Button>
            </Actions>
          </ImageContainer>
          )
        : (
          <>
            <DropZone
              onConfirm={saveUploadPhoto}
              onRejection={() => {}}
              onDelete={() => {}}
              name='attachment'
              label={t('estudiantes>registro_matricula>matricula_estudian>registrar_persona>subir_foto_label', 'Subir foto')}
              span='(.jpg / .png)'
              type={{ 'image/*': ['image/png', 'image/jpeg'] }}
              value={[]}
            />
            <Separator>O</Separator>
            <label>{t('estudiantes>registro_matricula>matricula_estudian>registrar_persona>tomar_foto', 'Tomar foto')}</label>

            <TakePhotoContainer>
              <IconButton
                onClick={() => setModalTakePhoto(true)}
                color='primary'
                aria-label='Add'
                component='span'
              >
                <AddAPhotoIcon style={{ color: '#575757' }} fontSize='large' />
              </IconButton>
              <label>{t('estudiantes>registro_matricula>matricula_estudian>registrar_persona>tomar_foto', 'Tomar foto')}</label>
            </TakePhotoContainer>
          </>
          )}
      <Actions
        className='mt-5'
        justify={onPrev ? 'space-between' : 'flex-end'}
      >
        {onPrev && (
          <Button onClick={() => onPrev(onPrev && 'form')} color='primary'>
            {t('general>anterior', 'Anterior')}
          </Button>
        )}
        <Button onClick={() => onNext()} color='primary'>
          {dimex ? t("general>siguiente", "Siguiente") : isAplicar ? t("configuracion>anio_educativo>editar>actualizar", "Actualizar") : t('boton>general>registrar', 'Registrar')}
        </Button>
      </Actions>
      <Modal
        openDialog={modalTakePhoto}
        onClose={closeModalTakePhoto}
        txtBtn={t('boton>general>guardar', 'Guardar')}
        title={t('estudiantes>registro_matricula>matricula_estudian>registrar_persona>tomar_foto', 'Tomar foto')}
        actions={false}
      >
        <TakePhoto
          onConfirm={saveTakePhoto}
          closeModalTakePhoto={closeModalTakePhoto}
        />
      </Modal>
      <Modal
        openDialog={openCrop}
        onClose={handleClose}
        txtBtn={t('boton>general>guardar', 'Guardar')}
        title={t('general>editar_foto','Editar foto')}
        actions={false}
      >
        <ContainerWebCam>
          <Cropper
            handleClose={handleClose}
            handleCrop={handleCrop}
            image={imageSrc}
            format={cropFormat}
          />
        </ContainerWebCam>
      </Modal>
    </div>
  )
}
const ContainerWebCam = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-flow: column;
  min-width: 600px;
`

const Actions = styled.div<{ justify: string }>`
  display: flex;
  justify-content: ${(props) => props.justify};
  align-items: center;
  margin: 0 auto;
  width: 100%;
`

const Separator = styled.span`
  display: flex;
  text-align: center;
  align-items: center;
  justify-content: space-between;
  margin: 15px auto;
  font-weight: 600;

  &:before,
  &:after {
    content: '';
    width: 40%;
    height: 2.5px;
    background: #979797;
    border-radius: 2px;
  }
`

const TakePhotoContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-flow: column;
  background: ${colors.gray};
  border-radius: 10px;
  border: 1px solid ${colors.opaqueGray};
  color: ${colors.darkGray};
  padding: 40px 10px;
  font-weight: 600;

  label {
    font-size: 15px;
  }
`

const ImageContainer = styled.div`
  button {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
  }
`
const ContentImage = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-flow: column;
  border-radius: 10px;
  background: ${colors.gray};
  border: 1px solid ${colors.opaqueGray};
  color: ${colors.darkGray};
  font-weight: 600;
`
FormPhoto.defaultProps = {
  dimex: false,
  isAplicar: false
}
export default FormPhoto
