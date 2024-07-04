import React from 'react'

import {
  Label,
  Button,
  FormGroup
} from 'reactstrap'

const ModalFilesUpload = (props) => {
  return (
    <div>
      <FormGroup>
        <Label>Detalle de la condición de discapacidad</Label>
        <div className='d-flex justify-content-left'>
          <span className='mr-1'>
            <i style={{ fontSize: '45px', color: '#145388' }} className='simple-icon-cloud-upload d-block' />
          </span>
          <Button outline color='primary' className='mr-2 cursor-pointer'>
            Subir un archivo
          </Button>
          <Button color='primary' className='cursor-pointer'>
            Ver (5 archivos)
          </Button>
        </div>
      </FormGroup>

    </div>
  )
}
export default ModalFilesUpload
