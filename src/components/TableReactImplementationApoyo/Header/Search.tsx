import React, { FC } from 'react'
import { InputGroupAddon, Input, CustomInput } from 'reactstrap'
import styled from 'styled-components'
import { Button } from 'Components/CommonComponents'
import { useTranslation } from 'react-i18next'

interface IProps {
	onSearch: Function
}
const Search: FC<IProps> = props => {
	const { t } = useTranslation()

	const { onSearch } = props
	const [text, setText] = React.useState<string>('')

	const yearList = [
		{ id: 1, name: '2022' },
		{ id: 2, name: '2023' },
		{ id: 3, name: '2024' }
	]

	const handleChangeSelectAll = e => {}

	return (
		<SearchContainer className='mr-4'>
			<InputSearchDiv>
				<Input
					type='text'
					name='keyword'
					id='search'
					value={text}
					onKeyPress={e => {
						if (e.key === 'Enter') {
							onSearch(e.target.value)
						}
					}}
					onChange={e => {
						setText(e.target.value)
					}}
					placeholder={t('place_holder>general>buscar_en_tabla', 'Buscar en tabla')}
				/>
				<StyledInputGroupAddon style={{ zIndex: 2 }} addonType='append'>
					<Button
						color='primary'
						className='buscador-table-btn-search'
						onClick={() => onSearch(text)}
						id='buttonSearchTable'
					>
						{t('general>buscar', 'Buscar')}
					</Button>
					<CustomInput
						style={{
							width: 125,
							backgroundColor: '#145388',
							borderRadius: '50px',
							color: '#ffffff',
							marginLeft: 10
						}}
						className='custom-checkbox mb-0 d-inline-block'
						type='select'
						id='checkAll'
						onClick={e => {
							handleChangeSelectAll(!e.target.checked)
						}}
					>
						<option value={null}>{'Filtrar por año'}</option>
						{yearList.map(tipo => {
							return <option value={tipo.id}>{tipo.name}</option>
						})}
					</CustomInput>
				</StyledInputGroupAddon>
				<StyledInputGroupAddon addonType='append'></StyledInputGroupAddon>
			</InputSearchDiv>
		</SearchContainer>
	)
}

const StyledInputGroupAddon = styled(InputGroupAddon)`
	top: 0;
	right: 0;
	position: absolute;
	height: 100%;
	display: flex;
	align-items: center;
	button {
		cursor: pointer;
	}
`

const SearchContainer = styled.div`
	width: 32vw;
`
const InputSearchDiv = styled.div`
	position: relative;

	input {
		background: none;
		outline: initial !important;
		border: 0;
		border-radius: 10px !important;
		background: #ffffff !important;
		box-shadow: 0 0 2px 1px rgba(0, 0, 0, 0.2);
		padding: 0.25rem 0.75rem 0.25rem 0.75rem;
		font-size: 0.76rem;
		line-height: 1.3;
		/*color: ${props => props.theme.primary};*/
		height: 40px;
		padding-left: 45px;
		width: 100%;
	}

	&:before {
		font-family: 'simple-line-icons';
		content: '\\e090';
		font-size: 14px;
		border-top-left-radius: 10px;
		border-bottom-left-radius: 10px;
		color: ${props => props.theme.secondary};
		position: absolute;
		width: 40px;
		height: 40px;
		right: 4px;
		display: flex;
		align-items: center;
		justify-content: center;
		text-align: center;
		top: 0;
		left: 0;
		background-color: ${props => props.theme.primary};
		color: white;
	}
`
export default Search
