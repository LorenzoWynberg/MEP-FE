import React, { useEffect } from 'react'
import Avatar from '@material-ui/core/Avatar'
import AddAPhotoIcon from '@material-ui/icons/AddAPhoto'
import IconButton from '@material-ui/core/IconButton'
import { makeStyles } from '@material-ui/core/styles'
import { IdentificationInputs } from '../../../../../../Hoc/Identification'
import PersonIcon from '@material-ui/icons/Person'
import { Form, Row, Col, Card, CardBody } from 'reactstrap'
import colors from '../../../../../../assets/js/colors'
import styled from 'styled-components'
import { useTranslation } from 'react-i18next'

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
  icon: {
    width: '100px',
    height: '100px',
    color: 'lightgrey'
  }
}))

const InformationCard = (props) => {
  const { t } = useTranslation()

  const { image, setImage } = props
  const classes = useStyles()

  const handleImageChange = (e) => {
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

  return (
    <Card>
      <CardBody>
        <Row>
          <Col sm='12' md='4'>
            <div className='container-center container-avatar-expediente'>
              <div className='content-avatar-expediente mb-3'>
                <Form id='image_form'>
                  {image.preview
                    ? (
                    <label
                    htmlFor='icon-button-file'
                    id='student-photo'
                  >
                    <Avatar
                    alt={
													props.identification.data.id
												}
                    src={image.preview}
                    className={classes.avatar}
                  />
                  </label>
                      )
                    : props.editable
                      ? (
                      <label htmlFor='icon-button-file'>
                      <StyledIconButton
                      className={`${classes.buttonIcon} icon`}
                      color='primary'
                      aria-label='Subir Fotografia'
                      component='span'
                    >
                      <AddAPhotoIcon
                      className={classes.icon}
                    />
                    </StyledIconButton>
                    </label>
                        )
                      : (
                      <label htmlFor='icon-button-file'>
                      <StyledIconButton
                      className={`${classes.buttonIcon} icon cursor-pointer`}
                      color='primary'
                      aria-label='Subir Fotografia'
                      component='span'
                    >
                      <PersonIcon
                      className={classes.icon}
                    />
                    </StyledIconButton>
                    </label>
                        )}
                  {props.editable && (
                    <>
                    <span>
                    * {t('estudiantes>expediente>info_gen>info_gen>img_mensaje', 'Haga Click en la imagen para cambiarla')}
                  </span>
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
                </Form>
              </div>
            </div>
          </Col>

          <Col sm='12' md='8' className='mt-sm-2'>
            <IdentificationInputs
              {...props}
              handleChange={props.handleChange}
              identificacion={props.identidadData.identificacion}
              nacionalidad={props.identidadData.nacionalidad}
              idType={props.identidadData.idType}
              avoidSearch
              errors={props.errors}
              fields={props.fields}
              editable
              label
            />
          </Col>
        </Row>
      </CardBody>
    </Card>
  )
}

const StyledIconButton = styled(IconButton)`
	cursor: ${(props) => (props.isDisabled ? 'auto' : 'pointer')} !important;
	background: ${(props) => (props.isDisabled ? 'grey' : colors.primary)};
	width: 150px;
	height: 150px;
	&:hover {
		background-color: ${(props) => (props.isDisabled ? 'grey' : '#0c3253')};
	}
`

export default InformationCard
