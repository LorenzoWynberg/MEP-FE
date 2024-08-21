import React, { useEffect, useState } from 'react'
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
import { envVariables } from '../../../../../../../constants/enviroment'
import axios from 'axios'
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
  const { hasEditable, setRedesParent, redes, redesTemp } = props




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
                    onClick={() => { }}
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
                  onChange={() => { }}
                />
                <InputGroupAddon
                  addonType='append'

                  onClick={() => { }}
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

      <ListItem>
        <ListItemIcon>
          <Fab disabled aria-label='like' className={classes.social}>
            <FacebookIcon fontSize='small' />
          </Fab>
        </ListItemIcon>
        {!hasEditable && <ListItemText id={1} primary={redes.facebook} />}
        {hasEditable && <Input value={redesTemp.facebook} onChange={e => setRedesParent('facebook', e.target.value)} />}
      </ListItem>
      <ListItem>
        <ListItemIcon>
          <Fab disabled aria-label='like' className={classes.social}>
            <InstagramIcon fontSize='small' />
          </Fab>
        </ListItemIcon>
        {!hasEditable && <ListItemText id={1} primary={redes.instagram} />}
        {hasEditable && <Input value={redesTemp.instagram} onChange={e => setRedesParent('instagram', e.target.value)} />}

      </ListItem>
      <ListItem>
        <ListItemIcon>
          <Fab disabled aria-label='like' className={classes.social}>
            <WhatsAppIcon fontSize='small' />
          </Fab></ListItemIcon>
        {!hasEditable && <ListItemText id={1} primary={redes.whatsapp} />}
        {hasEditable && <Input value={redesTemp.whatsapp} onChange={e => setRedesParent('whatsapp', e.target.value)} />}

      </ListItem>
      <ListItem>
        <ListItemIcon>
          <Fab disabled aria-label='like' className={classes.social}><i class="fa-brands fa-x-twitter"></i>
          </Fab></ListItemIcon>
        {!hasEditable && <ListItemText id={1} primary={redes.twitter} />}
        {hasEditable && <Input value={redesTemp.twitter} onChange={e => setRedesParent('twitter', e.target.value)} />}

      </ListItem>
      <ListItem>
        <ListItemIcon>

          <Fab disabled aria-label='like' className={classes.social}><i class="fab fa-tiktok"></i></Fab></ListItemIcon>
        {!hasEditable && <ListItemText id={1} primary={redes.tiktok} />}
        {hasEditable && <Input value={redesTemp.tiktok} onChange={e => setRedesParent('tiktok', e.target.value)} />}

      </ListItem>

    </List >
  )
}

export default Redes
