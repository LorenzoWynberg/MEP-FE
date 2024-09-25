import React from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from 'reactstrap'
import Loader from './Loader'

export const EditButton = ({
	editable,
	setEditable,
	sendData,
	loading,
	goBack,
	disabledSubmit = false,
	disabledCancel = false,
	marginY = 'mb-2'
}) => {
	const { t } = useTranslation()
	return (
		<>
			{loading ? (
				<div className={`${marginY}`}>
					<Loader formLoader />
				</div>
			) : editable ? (
				<>
					<Button
						color="primary"
						className={`btn-shadow ${marginY} edit-btn-cancelar`}
						outline
						type="button"
						disabled={disabledCancel}
						onClick={() => {
							setEditable(false)
						}}
					>
						{goBack
							? t('edit_button>regresar', 'Regresar')
							: t('edit_button>cancelar', 'Cancelar')}
					</Button>
					<Button
						color="primary"
						className={`btn-shadow ${marginY}`}
						type="submit"
						disabled={disabledSubmit}
					>
						{t('edit_button>guardar', 'Guardar')}
					</Button>
				</>
			) : (
				<Button
					color="primary"
					className={`btn-shadow ${marginY}`}
					type="button"
					onClick={() => {
						setEditable(true)
					}}
				>
					{t('edit_button>editar', 'Editar')}
				</Button>
			)}
		</>
	)
}
