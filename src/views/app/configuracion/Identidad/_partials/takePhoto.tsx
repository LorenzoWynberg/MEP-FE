import React, { useEffect, useState } from 'react'
import Webcam from 'react-webcam'
import { Button } from 'reactstrap'
import styled from 'styled-components'
import Cropper from 'Components/Form/CropImage'
import colors from 'Assets/js/colors'

interface IProps {
  onConfirm: Function
  closeModalTakePhoto: Function
}

const TakePhoto: React.FC<IProps> = (props) => {
  const { onConfirm, closeModalTakePhoto } = props
  const [errors, setErrors] = useState(null)
  const [imageSrc, setImageSrc] = useState(null)
  const [imgCropped, setImgCropped] = useState(null)

  const webcamRef = React.useRef(null)

  const cropFormat = {
    unit: '%',
    aspect: 1 / 1,
    width: 50,
    height: 70
  }

  const videoConstraints = {
    width: 800,
    height: 700,
    facingMode: 'user'
  }

  const checkMediaAccess = async () => {
    navigator.mediaDevices.enumerateDevices().then((devices) => {
      const hasCamera = devices.find((x) => x.kind === 'videoinput' && x.label)
      if (!hasCamera) {
        setErrors({ dontHasCamera: true })
      }
    })
  }

  useEffect(() => {
    checkMediaAccess()
  }, [navigator.mediaDevices])

  const onSaveImage = async () => {
    onConfirm(imgCropped)
  }

  const capture = React.useCallback(() => {
    setImageSrc(webcamRef.current.getScreenshot())
  }, [webcamRef])

  const takeAnotherPhoto = () => {
    setImageSrc(null)
    setImgCropped(null)
  }

  const handleCrop = async (img) => {
    setImgCropped(img)
  }

  const handleClose = () => {
    setImageSrc(null)
  }

  if (errors) {
    return (
      <ErrorContainer>
        {errors?.dontHasCamera && <h2>No se logró el acceso a la cámara</h2>}
        <Button
          className='mt-5'
          onClick={() => closeModalTakePhoto()}
          color='primary'
        >
          Cerrar
        </Button>
      </ErrorContainer>
    )
  }
  if (imgCropped) {
    return (
      <ContainerViewerImage>
        <ContentImage>
          <img src={imgCropped} alt='' />
        </ContentImage>

        <Actions className='mt-5'>
          <Button outline onClick={takeAnotherPhoto} color='secondary'>
            Tomar otra
          </Button>
          <Button onClick={() => onSaveImage()} color='primary'>
            Guardar
          </Button>
        </Actions>
      </ContainerViewerImage>
    )
  }
  if (imageSrc) {
    return (
      <ContainerWebCam>
        <Cropper
          handleClose={handleClose}
          handleCrop={handleCrop}
          image={imageSrc}
          format={cropFormat}
        />
      </ContainerWebCam>
    )
  }

  return (
    <ContainerWebCam>
      <ContentCamera>
        <Webcam
          audio={false}
          ref={webcamRef}
          screenshotFormat='image/jpeg'
          width={600}
          height={400}
          videoConstraints={videoConstraints}
        />
      </ContentCamera>
      <Button className='mt-5' onClick={capture} color='primary'>
        Tomar foto
      </Button>
    </ContainerWebCam>
  )
}
const ErrorContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-flow: column;
  padding: 40px;
`
const ContentImage = styled.div`
  border-radius: 10px;
  background: #f3f3f3;
  border: 1px solid #c3c3c3;
  padding: 20px 0;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`
const ContentCamera = styled.div`
  border-radius: 10px;
  background: ${colors.gray};
  border: 1px solid ${colors.opaqueGray};
  padding: 20px 0;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`
const ContainerViewerImage = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-flow: column;
  min-width: 600px;
`
const ContainerWebCam = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-flow: column;
  min-width: 600px;
`
const Actions = styled.div`
  display: flex;
  justify-content: space-evenly;
  width: 100%;
  align-items: center;
`
export default TakePhoto
