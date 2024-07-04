import React from 'react'
import styled from 'styled-components'
import { Button, InputGroupAddon } from 'reactstrap'
interface IProps {
  onSearch?: Function
}
const SearchComp: React.FC<IProps> = ({ onSearch }) => {
  return (
    <SearchContainer className='mr-4'>
      <div className='search-sm--rounded'>
        <input
          type='text'
          name='keyword'
          id='search'
          onInput={(e) => onSearch(e)}
          onKeyPress={(e) => onSearch(e)}
          autoComplete='off'
          placeholder='Buscar estudiante'
        />
        <StyledInputGroupAddon addonType='append'>
          <Button
            color='primary'
            onClick={onSearch}
            className='buscador-table-btn-search'
          >
            Buscar
          </Button>
        </StyledInputGroupAddon>
      </div>
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
  }
`
const SearchContainer = styled.div`
  width: 32vw;
`
export default SearchComp
