import React, { useState } from 'react'
import ReactCrop, { Crop } from 'react-image-crop'
import { Button } from 'reactstrap'
import 'react-image-crop/dist/ReactCrop.css'
import styled from 'styled-components'

interface IProps {
	format: any
	image: string
	txtbtn: string
	handleCrop: Function
	handleClose: Function
}
const Cropper: React.FC<IProps> = (props) => {
  const { image, format } = props

  const imageRef = React.useRef()
  const [crop, setCrop] = useState<Crop>()

  const getCroppedImg = (image, crop) => {
    const canvas = document.createElement('canvas')
    const scaleX = image.naturalWidth / image.width
    const scaleY = image.naturalHeight / image.height
    canvas.width = crop.width
    canvas.height = crop.height
    const ctx = canvas.getContext('2d')

    // New lines to be added
    const pixelRatio = window.devicePixelRatio
    canvas.width = crop.width * pixelRatio
    canvas.height = crop.height * pixelRatio
    ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0)
    ctx.imageSmoothingQuality = 'high'

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height
    )

    // As Base64 string
    const base64Image = canvas.toDataURL('image/jpeg')
    return base64Image
  }

  const handleCrop = () => {
    const base64Cropped = getCroppedImg(imageRef.current, crop)

    props.handleCrop(base64Cropped)
    props.handleClose()
  }

  const close = () => {
    props.handleClose()
  }
  return (
    <>
      <ReactCrop
        crop={crop}
        onChange={(crop) => setCrop(crop)}
      >
        <img ref={imageRef} src={image} />
      </ReactCrop>
      <Actions className='mt-5'>
        <Button onClick={close} color='primary' outline>
          Cancelar
        </Button>
        <Button onClick={handleCrop} color='primary'>
          {props.txtbtn == null ? 'Guardar' : props.txtbtn}
        </Button>
      </Actions>
    </>
  )
}

Cropper.defaultProps = {
  format: {
    unit: '%',
    width: 30,
    aspect: 1 / 1
  },
  image: null
}

const Actions = styled.div`
	display: flex;
	justify-content: space-evenly;
	width: 100%;
	align-items: center;
`
export default Cropper
