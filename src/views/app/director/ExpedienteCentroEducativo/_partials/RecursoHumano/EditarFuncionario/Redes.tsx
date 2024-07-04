import React, { useState } from 'react'
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

import colors from '../../../../../../../assets/js/colors'
import { useTranslation } from 'react-i18next'

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    backgroundColor: theme.palette.background.paper
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
  const { t } = useTranslation()
  const classes = useStyles()
  const { hasEditable, socialNetworks, handleAdd, handleDelete } = props
  const [socials, setSocials] = useState(socialNetworks)

  const handleText = (item, event) => {
    const { name, value } = event.target
    const socialLink = getSocialLink(item.id)

    if (value.length === 1) {
      item.textInput = `${socialLink}${value}`
    } else if (value.length > 1) {
      item.textInput = value
    } else {
      item.textInput = `${socialLink}`
    }

    const newSocials = socials.map((social) =>
      item.id === social.id ? item : social
    )

    setSocials(newSocials)
  }

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

  const getSocialLink = (id) => {
    switch (id) {
      case 1: return 'https://facebook.com/'
      case 2: return 'https://instagram.com/'
      case 3: return 'https://wa.me/'
      case 4: return 'https://twitter.com/'
    }
  }

  const getSocialContent = (item) => {
    return (
      <>
        {item.text.trim().length > 0
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
                  name={item.name}
                  value={item.textInput}
                  disabled={!hasEditable}
                  onChange={handleText.bind(this, item)}
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
      {socials.map((item) => {
        return (
          <ListItem>
            <ListItemIcon>{getSocial(item.id)}</ListItemIcon>
            {item.name === 'facebook' ? <div>{props.data?.facebook}</div> : null}
            {item.name === 'instagram' ? <div>{props.data?.instagram}</div> : null}
            {item.name === 'whatsapp' ? <div>{props.data?.whatsapp}</div> : null}
            {item.name === 'twitter' ? <div>{props.data?.twitter}</div> : null}
            <ListItemText id={item.name} primary={getSocialContent(item)} />
          </ListItem>
        )
      })}
    </List>
  )
}

export default Redes
