import React from 'react'
import Avatar from '@material-ui/core/Avatar'
import { makeStyles } from '@material-ui/core/styles'
import { Row, Col } from 'reactstrap'
import PropTypes from 'prop-types'
import { NavLink } from 'react-router-dom'

import colors from 'Assets/js/colors'
import { useActions } from '../../../../../../hooks/useActions'
import { loadStudent } from '../../../../../../redux/expedienteEstudiantil/actions'

const useStyles = makeStyles(theme => ({
  avatar: {
    width: '5em',
    height: '5em'
  },
  container: {
    margin: '0 1rem 0 1rem'
  },
  content: {
    padding: '1rem 0 1rem 0',
    borderBottom: '1px solid #848484'
  },
  information: {
    width: '100%',
    float: 'left',
    color: '#636363',
    fontSize: '1em'
  },
  informationName: {
    fontSize: '1.5em',
    color: colors.primary
  }
}))

const InformationCard = props => {
  const { data, showImageAvatar } = props
  const classes = useStyles()

  const actions = useActions({ loadStudent })

  return (
    <div
      className={classes.container}
      onClick={() => {
        actions.loadStudent(data)
      }}
    >
      <NavLink to='/director/expediente-estudiante/inicio'>
        <Row className={classes.content}>
          <Col
            xs='4'
            md='auto'
            className='d-flex justify-content-center align-items-center'
          >
            <Avatar
              alt={data.idEstudiante}
              src={
                                data.fotografiaUrl
                                  ? data.fotografiaUrl
                                  : '/assets/img/profile-pic-generic.png'
                            }
              className={classes.avatar}
            />
          </Col>
          <Col xs='8'>
            <span
              className={`${classes.information} ${classes.informationName} font-weight-semibold`}
            >
              {data.nombreEstudiante
                ? data.nombreEstudiante
                : 'Sin definir'}
            </span>
            <span className={classes.information}>
              {data.identificacion ? data.identificacion : '-'}
            </span>
            <span className={classes.information}>
              {data.institucion
                ? data.institucion
                : 'Sin centro educativo'}
            </span>
            <span className={classes.information}>
              {data.grupo ? data.grupo : 'Sin grupo'}
            </span>
            <span className={classes.information}>
              {data.modalidad}
            </span>
          </Col>
        </Row>
      </NavLink>
    </div>
  )
}
InformationCard.propTypes = {
  data: PropTypes.bool
}
InformationCard.defaultProps = {
  data: {}
}
export default InformationCard
