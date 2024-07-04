import React, { useState, useEffect } from 'react'
import { Colxx } from 'Components/common/CustomBootstrap'
import SearchIcon from '@material-ui/icons/Search'
import Table from 'Components/table'

import {
  Button,
  Row,
  Container,
  Col,
  InputGroup, InputGroupText, InputGroupAddon, Input,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from 'reactstrap'

const BuscadorTable = (props) => {
  const { rows, columns, offset, filters, cleanIdentity, cleanFilter, showSearch, showPreferences, showFilters, getDataFilter, changeColumn, changeFilterOption, onSelectRow, createResource, resourceTitle, color, handleResource } = props
  const [filterText, setFilterText] = useState()
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)

  const [dropdownOpenPreferences, setDropdownOpenPreferences] = useState(false)
  const [dropdownOpenFilters, setDropdownOpenFilters] = useState(false)

  const togglePreferences = () => setDropdownOpenPreferences(prevState => !prevState)
  const toggleFilters = () => setDropdownOpenFilters(prevState => !prevState)

  useEffect(() => {
    cleanIdentity()
    setData(rows)
  }, [cleanIdentity, rows])

  useEffect(() => {
    return () => {
      cleanFilter()
    }
  }, [cleanFilter])

  const handleChange = (e) => {
    const { value } = e.target
    setFilterText(value)
  }

  const onSearch = async () => {
    const _filterType = filters.find(x => x.isSelected)
    setLoading(true)
    await getDataFilter(filterText, _filterType.column)
    setLoading(false)
  }

  const handleKeyPress = (e) => {
    if (e.charCode === 13) {
      onSearch()
      return false
    }
  }

  const filterOnTable = (e) => {
    const _text = e.target.value.toLowerCase()
    const _filters = filters

    if (_text !== '') {
      const _newData = data.filter(row => {
        let _textToFilter = ''
        _filters.map(f => {
          _textToFilter += row[f.column]
        })
        return _textToFilter.toLowerCase().indexOf(_text) !== -1
      })
      setData(_newData)
    } else {
      setData(rows)
    }
  }

  return (
    <Container>
      <Row>
        <Colxx xxs='12' className='px-3'>
          <Row>
            <Col sm='5' md={{ size: 5, offset: props.offset ? 0 : 1 }}>
              <InputGroup size='lg'>
                <Input className='input-main-search' placeholder='Escriba aquí las palabras claves que desea buscar...' value={filterText} onChange={handleChange} onKeyPress={handleKeyPress} />
                <InputGroupAddon addonType='prepend' className='prepend-search'>
                  <InputGroupText className='icon-buscador-expediente-before'>
                    <SearchIcon />
                  </InputGroupText>
                </InputGroupAddon>
                {loading && <span className='loadingInput' />}
                <InputGroupAddon addonType='append'><Button color='primary' className='buscador-table-btn-search' onClick={onSearch}>Buscar</Button></InputGroupAddon>
              </InputGroup>
            </Col>
            <Col sm='3' md={{ size: 3 }}>
              <Dropdown isOpen={dropdownOpenFilters} toggle={toggleFilters}>
                <DropdownToggle caret>
                  {filters.find(x => x.isSelected).label}
                </DropdownToggle>
                <DropdownMenu>
                  {filters.map((item) => {
                    return (
                        <DropdownItem id={item.id} onClick={changeFilterOption}>{item.label}</DropdownItem>
                    );
                  })}
                </DropdownMenu>
              </Dropdown>
            </Col>

            {
                            // create resource
                            createResource
                              ? <Col sm='4' md={{ size: 4 }}>
                                <div className='d-flex justify-content-end'>
                                  <Button
                                    color={color}
                                    className='btn-shadow m-0 edit-btn-cancelar'
                                    type='button'
                                    onClick={handleResource}
                                  >
                                    {resourceTitle}
                                  </Button>
                                  {
                                        rows.length > 0
                                          ? <Dropdown isOpen={dropdownOpenPreferences} toggle={togglePreferences} isMultiple>
                                            <DropdownToggle color='primary' caret>
                                              Preferencias
                                            </DropdownToggle>
                                            <DropdownMenu>
                                              {columns.map((item) => {
                                                return (
                                                  <DropdownItem disabled><input type='checkbox' id={item.column} checked={item.isSelected} onChange={changeColumn} /> {item.label} </DropdownItem>
                                                )
                                              })}
                                            </DropdownMenu>
                                          </Dropdown>
                                          : null
                                    }
                                </div>
                              </Col>
                              : null
                        }
          </Row>
          <hr />
          <Row>
            <Col sm='12' md={{ size: props.offset ? 12 : 10, offset: props.offset ? 0 : 1 }}>
              <Table
                columns={columns.filter(x => x.isSelected)}
                selectDisplayMode='datalist'
                data={data}
                tableName='label.buscador'
                showHeaders
                loading={false}
                actionRow={[{ actionName: '', actionFunction: onSelectRow, actionDisplay: false }]}
                PageHeading={false}
                hideMultipleOptions
                showHeadersCenter={false}
                esBuscador={false}
              />
            </Col>
          </Row>
        </Colxx>
      </Row>
    </Container>
  )
}

BuscadorTable.defaultProps = {
  rows: [],
  columns: [],
  filters: [],
  showSearch: true,
  showPreferences: true,
  showFilters: true,
  changeColumn: () => {},
  changeFilterOption: () => {}
}

export default BuscadorTable
