import React from 'react'
import colors from 'assets/js/colors'
import { UncontrolledTooltip } from 'reactstrap'

function RequiredSpan() {
	return (
		<>
			{' '}
			<span style={{ color: colors.error }} id="tooltipRef">
				*
			</span>
			<UncontrolledTooltip
				style={{ color: colors.error }}
				placement="top"
				target="tooltipRef"
			>
				Requerido
			</UncontrolledTooltip>
		</>
	)
}

export default RequiredSpan
