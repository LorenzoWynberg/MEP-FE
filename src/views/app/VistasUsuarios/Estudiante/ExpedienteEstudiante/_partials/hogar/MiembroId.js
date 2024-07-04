import React from 'react'
import Avatar from '@material-ui/core/Avatar'
import AddAPhotoIcon from '@material-ui/icons/AddAPhoto'
import IconButton from '@material-ui/core/IconButton'
import { makeStyles } from '@material-ui/core/styles'
import { IdentificationInputs } from '../../../../../../../Hoc/Identification'

import {
  Row,
  Col,
  Card,
  CardBody
} from 'reactstrap'

import colors from 'assets/js/colors'
import styled from 'styled-components'
import PersonIcon from '@material-ui/icons/Person'

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
    <Card>
      <CardBody>
        <Row>
          <Col sm='12' md='4'>
            <h4>Información personal</h4>
            <div className='container-center container-avatar-expediente'>
              <div className='content-avatar-expediente mb-3' id='image_form'>
                {(props.editable && props.memberData.idIdentidad) && (
                  <>
                    <span>*Haga Click en la imagen para cambiarla</span>
                    <input
                        accept='image/*'
                        onChange={handleImageChange}
                        className={classes.input}
                        id='icon-button-file'
                        type='file'
                        name='files'
                      />
                  </>
                )}
                {image.preview
                  ? (
                    <label htmlFor='icon-button-file'>
                        <Avatar
                            alt={props.memberData.idMiembro + 'profileImage'}
                            src={image.preview}
                            className={classes.avatar}
                          />
                      </label>
                    )
                  : (props.editable
                      ? (
                        <label htmlFor='icon-button-file'>
                            <IconButton
                                className={!props.editable || !props.memberData.idMiembro ? classes.buttonIconDisabled : classes.buttonIcon}
                                color='primary'
                                aria-label='Subir Fotografia'
                                component='span'
                                onClick={() => {
                                    if (!props.memberData.idMiembro) {
                                      openAlert()
                                    }
                                  }}
                              >
                                <AddAPhotoIcon
                                    className={classes.icon}
                                  />
                              </IconButton>
                          </label>
                        )
                      : (
                        <label htmlFor='icon-button-file'>
                            <StyledIconButton
                                className={!props.editable || !props.memberData.idMiembro ? classes.buttonIconDisabled : classes.buttonIcon}
                                color='primary'
                                aria-label='Subir Fotografia'
                                component='span'
                                isDisabled={!props.editable}
                              >
                                <PersonIcon className={classes.icon} />
                              </StyledIconButton>
                          </label>
                        )

                    )}
              </div>
            </div>
          </Col>
          <Col sm='12' md='8' className='mt-sm-2'>
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
              disableFields={props.disableIds}
              avoidSearch={false}
              errors={props.errors}
              fields={props.fields}
              clearErrors={props.clearErrors}
              setDisableFields={props.setDisableFields}
            />
          </Col>
        </Row>
      </CardBody>
    </Card>
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
