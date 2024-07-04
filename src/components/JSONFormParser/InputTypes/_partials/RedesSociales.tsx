import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'

import Fab from '@material-ui/core/Fab'

import FacebookIcon from '@material-ui/icons/Facebook'
import InstagramIcon from '@material-ui/icons/Instagram'
import WhatsAppIcon from '@material-ui/icons/WhatsApp'
import TwitterIcon from '@material-ui/icons/Twitter'
import CloseIcon from '@material-ui/icons/Close'

import { InputGroup, InputGroupText, InputGroupAddon, Input } from 'reactstrap'

import colors from 'Assets/js/colors'
import { useTranslation } from 'react-i18next'

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%'
  },
  social: {
    height: 30,
    width: 30,
    minHeight: 12,
    backgroundColor: `${colors.primary} !important`,
    color: 'white !important'
  },
  delete: {
    height: 30,
    width: 30,
    minHeight: 12,
    backgroundColor: '#575757 !important',
    color: 'white !important',
    marginLeft: 10,
    boxShadow: 'none'
  },
  socialLink: {
    paddingTop: 10,
    marginRight: 5
  },
  addSocial: {
    backgroundColor: colors.primary,
    color: 'white',
    fontWeight: 'bold',
    cursor: 'pointer'
  }
}))

const Redes = (props) => {
  const classes = useStyles()
  const { hasEditable, socialNetworks, handleInputChange, handleAdd, handleDelete, hideUndefinedSocialNetworks = false } = props
  const { t } = useTranslation()

  const getSocial = (id) => {
    return (
      <Fab disabled aria-label='like' className={classes.social}>
        {
          {
            1: <FacebookIcon fontSize='small' />,
            2: <InstagramIcon fontSize='small' />,
            3: <WhatsAppIcon fontSize='small' />,
            4: <TwitterIcon fontSize='small' />
          }[id]
        }
      </Fab>
    )
  }

  const getSocialContent = (item) => {
    return (
      <>
        {item.text?.length > 0
          ? (
            <>
              <a href={item.text} target='_blank' rel='noopener noreferrer'>{item.text}</a>
              {hasEditable
                ? (
                  <Fab
                    aria-label='like'
                    className={classes.delete}
                    onClick={handleDelete.bind(this, item)}
                  >
                    <CloseIcon fontSize='small' />
                  </Fab>
                  )
                : (
                  <>
                  </>
                  )}
            </>
            )
          : (
            <>
              {hasEditable && <InputGroup>
                <Input
                  name={`${props.field.id}_${item.name}`}
                  value={item.textInput}
                  disabled={!hasEditable}
                  innerRef={props.register}
                  onChange={handleInputChange.bind(this, item)}
                />
                <InputGroupAddon
                  addonType='append'

                  onClick={handleAdd.bind(this, item)}
                >
                  <InputGroupText className={classes.addSocial}>
                    {t('general>agregar', 'Agregar')}
                  </InputGroupText>
                </InputGroupAddon>
              </InputGroup>}
            </>
            )}
      </>
    )
  }

  return (
    <List className={classes.root}>
      {socialNetworks.map((item) => {
        if (hideUndefinedSocialNetworks && !item?.text) {
          return <></>
        }
        return (
          <ListItem>
            <ListItemIcon>{getSocial(item.id)}</ListItemIcon>
            <ListItemText id={item.name} primary={getSocialContent(item)} />
          </ListItem>
        )
      })}
    </List>
  )
}

export default Redes
