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
const TikTokIcon = ({ color = "#000000" }) => {
  return (
    <svg
      fill={color}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 50 50"
      width="100%"
      height="100%"
    >
      <path d="M41,4H9C6.243,4,4,6.243,4,9v32c0,2.757,2.243,5,5,5h32c2.757,0,5-2.243,5-5V9C46,6.243,43.757,4,41,4z M37.006,22.323 c-0.227,0.021-0.457,0.035-0.69,0.035c-2.623,0-4.928-1.349-6.269-3.388c0,5.349,0,11.435,0,11.537c0,4.709-3.818,8.527-8.527,8.527 s-8.527-3.818-8.527-8.527s3.818-8.527,8.527-8.527c0.178,0,0.352,0.016,0.527,0.027v4.202c-0.175-0.021-0.347-0.053-0.527-0.053 c-2.404,0-4.352,1.948-4.352,4.352s1.948,4.352,4.352,4.352s4.527-1.894,4.527-4.298c0-0.095,0.042-19.594,0.042-19.594h4.016 c0.378,3.591,3.277,6.425,6.901,6.685V22.323z" />
    </svg>
  );
};
const Redes = (props) => {
  console.log('Redes log', props)
  const { t } = useTranslation()

  const classes = useStyles()
  const { hasEditable, setRedesParent, redes,redesTemp } = props




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
            <FacebookIcon fontSize='small' />,
          </Fab>
        </ListItemIcon>
        {!hasEditable && <ListItemText id={1} primary={redes.facebook} />}
        {hasEditable && <Input value={redesTemp.facebook} onChange={e => setRedesParent('facebook', e.target.value)}/>}
      </ListItem>
      <ListItem>
        <ListItemIcon>
          <Fab disabled aria-label='like' className={classes.social}>
            <InstagramIcon fontSize='small' />
          </Fab>
        </ListItemIcon>
        {!hasEditable && <ListItemText id={1} primary={redes.instagram} />}
        {hasEditable && <Input value={redesTemp.instagram} onChange={e => setRedesParent('instagram', e.target.value)}/>}

      </ListItem>
      <ListItem>
        <ListItemIcon>
          <Fab disabled aria-label='like' className={classes.social}>
            <WhatsAppIcon fontSize='small' />
          </Fab></ListItemIcon>
        {!hasEditable && <ListItemText id={1} primary={redes.whatsapp} />}
        {hasEditable && <Input value={redesTemp.whatsapp} onChange={e => setRedesParent('whatsapp', e.target.value)}/>}

      </ListItem>
      <ListItem>
        <ListItemIcon>
          <Fab disabled aria-label='like' className={classes.social}>
            <TwitterIcon fontSize='small' />
          </Fab></ListItemIcon>
        {!hasEditable && <ListItemText id={1} primary={redes.twitter} />}
        {hasEditable && <Input value={redesTemp.twitter} onChange={e => setRedesParent('twitter', e.target.value)}/>}

      </ListItem>
      <ListItem>
        <ListItemIcon>
          <Fab disabled aria-label='like' className={classes.social}>
            <TikTokIcon fontSize='small' />
          </Fab></ListItemIcon>
        {!hasEditable && <ListItemText id={1} primary={redes.tiktok} />}
        {hasEditable && <Input value={redesTemp.tiktok} onChange={e => setRedesParent('tiktok', e.target.value)}/>}

      </ListItem>

    </List >
  )
}

export default Redes
