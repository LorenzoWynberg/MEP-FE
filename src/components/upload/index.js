import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import PropTypes from 'prop-types'
import {
  Label,
  Button,
  FormGroup
} from 'reactstrap'

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      margin: theme.spacing(1)
    }
  },
  input: {
    display: 'none'
  },
  icon: {
    fontSize: '45px',
    color: '#145388'
  }
}))

const Upload = (props) => {
  const classes = useStyles()
  const { titulo } = props
  return (
    <div>
      <FormGroup>
        <Label>{titulo}</Label>
        <div className='d-flex justify-content-left'>
          <input
            accept='image/*'
            className={classes.input}
            id='contained-button-file'
            multiple
            type='file'
          />
          <span className='mr-1'>
            <i className={`simple-icon-cloud-upload d-block ${classes.icon} `} />
          </span>
          <label htmlFor='contained-button-file'>
            <span outline color='primary' className='mr-2 cursor-pointer btn btn-span-primary'>
              Subir un archivo
            </span>
            <Button color='primary' className='cursor-pointer'>
              Ver (5 archivos)
            </Button>
          </label>
        </div>
      </FormGroup>

    </div>
  )
}
Upload.prototype = {
  titulo: PropTypes.string
}
Upload.defaultProps = {
  titulo: ''
}
export default Upload
