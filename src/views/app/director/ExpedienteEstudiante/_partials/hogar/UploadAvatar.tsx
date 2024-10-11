import React from 'react'
import { Avatar, IconButton, makeStyles } from '@material-ui/core'
import AddAPhotoIcon from '@material-ui/icons/AddAPhoto'
import styled from 'styled-components'
import PersonIcon from '@material-ui/icons/Person'
import colors from 'Assets/js/colors'
import { GoPerson } from 'react-icons/go'
import { BsPersonFill } from 'react-icons/bs'

const UploadAvatar = props => {
	const [error, setErrror] = React.useState(null)

	return (
		<>
			<AvatarContainer>
				<input
					id='file-input'
					onChange={props.onChange}
					type='file'
					accept='image/*'
					style={{ display: 'none' }}
					disabled={props.disabled}
				/>
				<label style={{ marginBottom: 0 }} htmlFor='file-input'>
					{props.value && error == null ? (
						<img
							onError={e => setErrror(e)}
							src={props.value.src}
							style={{ height: '200px', width: '200px' }}
							alt='img'
						/>
					) : (
						<Icon size='150px' />
					)}
				</label>
			</AvatarContainer>
		</>
	)
}
const AvatarContainer = styled.div`
	overflow: hidden;
	border-radius: 50%;
	display: flex;
	justify-content: center;
	background: grey;
	transition: background-color 150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
	&:hover {
		background-color: #f15c210a;
	}
`
const Icon = styled(BsPersonFill)`
	margin: 1rem;
	color: white;
	transition: color 150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
	&:hover {
		color: grey;
	}
`

export default UploadAvatar
