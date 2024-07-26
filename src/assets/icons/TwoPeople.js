import React from 'react'
import styled from 'styled-components'

const TwoPeople = props => {
	return (
		<svg xmlns='http://www.w3.org/2000/svg' width='48' height='48' viewBox='0 0 55 55' space='preserve' {...props}>
			<g transform='translate(-358 2009)'>
				<StyledA className='a' d='M0,0H59.882V59.882H0Z' transform='translate(358 -2009)' />
				<g transform='translate(892.274 -1959.56)'>
					<StyledBPath
						d='M-490.432-35.458a3.115,3.115,0,0,0-3.115,3.115v25.11c-.055,1.016-.773,8.466-10.211,8.466h-1.013c-9.188,0-10.12-7.108-10.211-8.479v-25.1a3.115,3.115,0,0,0-3.115-3.115,3.115,3.115,0,0,0-3.115,3.115V-7.161l0,.124c.19,4.776,3.873,13.808,16.439,13.808h1.013c12.566,0,16.249-9.032,16.44-13.808l0-25.306A3.115,3.115,0,0,0-490.432-35.458Z'
						transform='translate(0 -2.608)'
					/>
					<StyledBRect width='6.584' height='26.163' rx='2.797' transform='translate(-502.992 -33.393)' />
					<StyledBRect width='6.584' height='17.899' rx='2.797' transform='translate(-512.122 -25.129)' />
					<StyledBCircle cx='2.794' cy='2.794' r='2.794' transform='translate(-511.624 -32.466)' />
					<StyledBCircle
						cx='3.292'
						cy='3.292'
						r='3.292'
						transform='translate(-504.356 -39.278) rotate(-45)'
					/>
				</g>
			</g>
		</svg>
	)
}

const StyledA = styled.path`
	fill: none;
`

const StyledBPath = styled.path`
	fill: #fff;
`

const StyledBRect = styled.rect`
	fill: #fff;
`

const StyledBCircle = styled.circle`
	fill: #fff;
`

export default TwoPeople
