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
import { Input  } from 'reactstrap'
import colors from '../../../../../../../assets/js/colors'
import { useTranslation } from 'react-i18next'

const useStyles = makeStyles(theme => ({
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

const Redes = props => {
	const { t } = useTranslation()
	const classes = useStyles()
	const { hasEditable, handleInputChange, formState } = props

	return (<> 
		<List className={classes.root} >
			<ListItem>
				<ListItemIcon>
					<Fab disabled aria-label="like" className={classes.social}>
						<FacebookIcon fontSize="small" />
					</Fab>
				</ListItemIcon>
				{!hasEditable && (
					<ListItemText id={1} primary={formState.facebook || ''} />
				)}
				{hasEditable && (
					<Input
						value={formState.facebook || ''}
						name="facebook"
						onChange={handleInputChange}
					/>
				)}
			</ListItem>
			<ListItem>
				<ListItemIcon>
					<Fab disabled aria-label="like" className={classes.social}>
						<InstagramIcon fontSize="small" />
					</Fab>
				</ListItemIcon>
				{!hasEditable && (
					<ListItemText id={1} primary={formState.instagram || ''} />
				)}
				{hasEditable && (
					<Input
						value={formState.instagram || ''}
						name="instagram"
						onChange={handleInputChange}
					/>
				)}
			</ListItem>
			<ListItem>
				<ListItemIcon>
					<Fab disabled aria-label="like" className={classes.social}>
						<WhatsAppIcon fontSize="small" />
					</Fab>
				</ListItemIcon>
				{!hasEditable && (
					<ListItemText id={1} primary={formState.whatsapp || ''} />
				)}
				{hasEditable && (
					<Input
						value={formState.whatsapp || ''}
						name="whatsapp"
						onChange={handleInputChange}
					/>
				)}
			</ListItem>
			<ListItem>
				<ListItemIcon>
					<Fab disabled aria-label="like" className={classes.social}>
						<i className="fa-brands fa-x-twitter"></i>
					</Fab>
				</ListItemIcon>
				{!hasEditable && (
					<ListItemText id={1} primary={formState.twitter || ''} />
				)}
				{hasEditable && (
					<Input
						value={formState.twitter || ''}
						name="twitter"
						onChange={handleInputChange}
					/>
				)}
			</ListItem>
			<ListItem>
				<ListItemIcon>
					<Fab disabled aria-label="like" className={classes.social}>
						<i className="fab fa-tiktok"></i>
					</Fab>
				</ListItemIcon>
				{!hasEditable && (
					<ListItemText id={1} primary={formState.tiktok || ''} />
				)}
				{hasEditable && (
					<Input
						value={formState.tiktok || ''}
						name="tiktok"
						onChange={handleInputChange}
					/>
				)}
			</ListItem>
		</List></>
	)
}

export default Redes
