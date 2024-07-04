import React from 'react'
import { ReactComponent as NotFound } from '../assets/images/NotFoundImage.svg'
import { Button } from '../components/CommonComponents'
import { useHistory } from 'react-router-dom'

const Error = () => {
  const history = useHistory()
  const onRegresarButton = () => {
    history.push('/app')
    // history.goBack()
  }
  return (
    <>
      <div className='fixed-background'>
        <div style={{ color: 'white', display: 'flex', height: '100vh', width: '100vw', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
          <NotFound />
          <div align='center'><h1>Error 404: No se ha <br /> encontrado el recurso </h1></div>
          <Button onClick={onRegresarButton}>Regresar</Button>
        </div>
      </div>
    </>
  )
}
export default Error
