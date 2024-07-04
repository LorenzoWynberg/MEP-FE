import React from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import Select, { Props } from 'react-select'
import { TIPO_CATALOGO } from 'types'

interface IProps extends Props {
	catalogo?: TIPO_CATALOGO
}
const SelectCatalogo: React.FC<IProps> = (props) => {
	const { catalogo } = props
	const { t } = useTranslation()
	const catalogos = useSelector((store: any) => {
		return store.selects
	})

	const isExistCatalogo = (catalogoName) => {
		const keys = Object.keys(catalogos)

		return keys.includes(catalogoName)
	}

	if (catalogo) {
		return (
			<Select
				{...props}
				placeholder={
					props.placeholder ||
					t('common>reactselect>seleccione', 'Seleccione')
				}
				options={catalogos[catalogo].map((i) => ({
					label: i.nombre,
					value: i.id
				}))}
			/>
		)
	} else {
		return (
			<Select
				placeholder={
					props.placeholder ||
					t('common>reactselect>seleccione', 'Seleccione')
				}
				{...props}
			/>
		)
	}
}

export default SelectCatalogo
