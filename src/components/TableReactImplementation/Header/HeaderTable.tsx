import React, { FC, useState } from 'react'
import styled from 'styled-components'
import { useTranslation } from 'react-i18next'
import Search from './Search'
import CloseIcon from '@mui/icons-material/Close'
import IconButton from '@mui/material/IconButton'
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap'

interface OptionFilter {
	label: string
	value: string | number
}
interface IProps {
	onSearch: Function
	onFilter: Function
	selectedFilter: any
	optionsFilter: OptionFilter[]
}
const HeaderTable: FC<IProps> = props => {
	const { t } = useTranslation()

	const { onSearch, optionsFilter, onFilter } = props
	const [filterSelected, setFilterSelected] = useState(null)
	const [dropdownOpen, setDropdownOpen] = React.useState<boolean>(false)

	const toggleDropDown = () => {
		setDropdownOpen(!dropdownOpen)
	}
	return (
		<CustomRow>
			<Search onSearch={onSearch} />
			<Dropdown
				className='btn-search-table-heading'
				isOpen={dropdownOpen}
				toggle={() => {
					toggleDropDown()
				}}
			>
				<DropdownToggleStyled color={`${filterSelected ? 'primary' : 'secondary'} dropdown-toggle-split`}>
					Filtrar por: {filterSelected?.toLowerCase()} <span className='caret-down' />
				</DropdownToggleStyled>
				<DropdownMenu>
					{optionsFilter.map((filter, i) => {
						return (
							<>
								<DropdownItemStyled
									onClick={() => {
										setFilterSelected(filter.label)
										onFilter(filter.value)
									}}
									key={i}
								>
									{filter.label.toLowerCase()}
								</DropdownItemStyled>
								{i < optionsFilter.length - 1 && <DropdownItem divider />}
							</>
						)
					})}
				</DropdownMenu>
				{filterSelected && (
					<IconButton
						aria-label='clear-filter'
						size='small'
						onClick={() => {
							setFilterSelected(null)
							onFilter(1)
						}}
					>
						<CloseIcon fontSize='inherit' />
					</IconButton>
				)}
			</Dropdown>
		</CustomRow>
	)
}

const CustomRow = styled.div`
	display: flex;
	align-items: center;
`

const DropdownToggleStyled = styled(DropdownToggle)`
	text-transform: uppercase !important;
`
const DropdownItemStyled = styled(DropdownItem)`
	text-transform: uppercase !important;
`
export default HeaderTable
