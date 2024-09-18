import React from 'react'
import styled from 'styled-components'
import { BsPersonFill } from 'react-icons/bs'

const Avatar = props => {
	return (
		<>
			<AvatarContainer>
				<label style={{ marginBottom: 0 }} htmlFor="file-input">
					{props.value ? (
						<img
							src={props.value.src}
							style={{ height: '200px', width: '200px' }}
							alt="img"
						/>
					) : (
						<Icon size="150px" />
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
`
const Icon = styled(BsPersonFill)`
	margin: 1rem;
	color: white;
`

export default Avatar
