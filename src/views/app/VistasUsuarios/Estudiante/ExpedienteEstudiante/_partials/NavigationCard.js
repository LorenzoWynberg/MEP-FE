import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import PropTypes from 'prop-types'
import { Col } from 'reactstrap'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import { NavLink } from 'react-router-dom'

import colors from 'assets/js/colors'

const useStyles = makeStyles((theme) => ({
  containerCardNavigation: {
    borderRadius: '14px',
    background: '#fff'
  },
  iconCardNavigation: {
    background: colors.primary,
    color: '#fff',
    borderRadius: '14px 0 0 14px'
  },
  contentCardNavigation: {
    background: '#fff',
    color: '#212121',
    borderRadius: '0 14px 14px 0',
    textDecoration: 'none'
  },
  linkCardNavigation: {
    color: '#212121',
    textDecoration: 'none'
  }
}))

const InformationCard = (props) => {
  const { title, href, children } = props
  const classes = useStyles()
  return (
    <Col xs={12} md={6} lg='4' className='mt-5'>
      <NavLink to={href} className={classes.linkCardNavigation}>
        <Grid
          container
          direction='row'
          justify='center'
          alignItems='center'
          spacing={2}
          className={classes.containerCardNavigation}
        >
          <Grid item className={classes.iconCardNavigation}>
            {children}
          </Grid>

          <Grid item xs sm container className={classes.contentCardNavigation}>
            <Typography variant='subtitle1'>{title}</Typography>
          </Grid>
        </Grid>
      </NavLink>
    </Col>
  )
}
InformationCard.propTypes = {
  title: PropTypes.string,
  href: PropTypes.string
}
InformationCard.defaultProps = {
  title: '',
  href: ''
}
export default InformationCard
