import React from 'react'
import IconButton from '@material-ui/core/IconButton'
import { makeStyles } from '@material-ui/core/styles'
import { IdentificationInputs } from '../../../../../../Hoc/IdentificationEncargado'

import colors from '../../../../../../assets/js/colors'
import styled from 'styled-components'

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
    cursor: 'pointer'
  },
  buttonIcon: {
    width: '150px',
    height: '150px',
    background: colors.primary,
    '&:hover': {
      background: '#0c3253'
    },
    cursor: 'pointer'
  },
  buttonIconDisabled: {
    width: '150px',
    height: '150px',
    background: 'grey'
  },
  icon: {
    width: '80px',
    height: '80px',
    color: '#fff'
  }
}))

const MiembroId = props => {
  const {
    image,
    setImage
  } = props

  const classes = useStyles()

  const handleImageChange = e => {
    if (props.editable) {
      if (e.target.files.length) {
        setImage({
          preview: URL.createObjectURL(e.target.files[0]),
          raw: e.target.files[0],
          edited: true
        })
      }
    }
  }

  const openAlert = () => {
    props.toggleAlertModal()
  }

  return (

    <IdentificationInputs
      {...props}
      handleChange={props.handleChange}
      nacionalidad={props.memberData.nationalityId}
      storeAction={props.loadMemberActions}
      idType={props.memberData.idType}
      identificacion={props.memberData.identificacion}
      setLoading={props.setLoading}
      loading={props.loading}
      editable={props.editable}
      disableFields={props.disableFields || props.disableIds}
      avoidSearch={props.disableFields}
      errors={props.errors}
      fields={props.fields}
      setDisableFields={props.setDisableFields}
    />

  )
}

const StyledIconButton = styled(IconButton)`
  cursor: ${props => props.isDisabled ? 'auto' : 'pointer'} !important;
  background: ${props => props.isDisabled ? 'grey' : colors.primary};
  width: 150px;
  height: 150px;
  &:hover {
    background-color: ${props => props.isDisabled ? 'grey' : '#0c3253'};
  }
`

export default MiembroId
