import { TableReactImplementation } from 'Components/TableReactImplementation'
import React, { useEffect, useMemo, useState } from 'react'
import {
  Button,
  ButtonDropdown,
  Col,
  CustomInput,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  InputGroupAddon
} from 'reactstrap'
import styled from 'styled-components'
import search from 'Utils/search'
import { Edit } from '@material-ui/icons'
import { Tooltip } from '@material-ui/core'
import colors from 'Assets/js/colors'
import { useTranslation } from 'react-i18next'

import TouchAppIcon from '@material-ui/icons/TouchApp'
import BookDisabled from 'Assets/icons/bookDisabled'
import BookAvailable from 'Assets/icons/bookAvailable'
import { useSelector } from 'react-redux'

const TablaMiembros = (props) => {
  const { t } = useTranslation()

  const { hasAddAccess = true, hasEditAccess = true, onlyView } = props
  const [searchValue, setSearchValue] = useState('')
  const [openDropdown, setOpenDropdown] = useState(false)
  const [selectedMembers, setSelectedMembers] = useState([])

  const { currentInstitution } = useSelector((state) => state.configuracion)

  const data = useMemo(() => {
    if (!props.members) return []
    const filtered = onlyView
      ? props.members.filter((x) => x.estadoMiembro !== 'Inactivo')
      : props.members
    return filtered.map((item) => {
      return {
        ...item,
        estado: item.estadoMiembro,
        statusColor: item.miembroActivo ? 'success' : 'danger',
        img: item.fotografiaUrl
      }
    })
  }, [props.members, selectedMembers])

  const [items, setItems] = useState(data)
  const columnsRepetidas = [
    {
      label: '',
      column: 'id',
      accessor: 'id',
      Header: '',
      Cell: ({ row }) => {
        return (
          <div
            style={{
						  textAlign: 'center',
						  display: 'flex',
						  justifyContent: 'center',
						  alignItems: 'center'
            }}
          >
            <input
              checked={selectedMembers.includes(row.original.id)}
              className='custom-checkbox mb-0 d-inline-block'
              type='checkbox'
              style={{
							  width: '1rem',
							  height: '1rem',
							  marginRight: '1rem'
              }}
              onClick={(e) => {
							  if (selectedMembers.includes(row.original.id)) {
							    setSelectedMembers(
							      selectedMembers.filter(
							        (el) => el !== row.original.id
							      )
							    )
							  } else {
							    setSelectedMembers([
							      ...selectedMembers,
							      row.original.id
							    ])
							  }
              }}
            />
          </div>
        )
      }
    },
    {
      column: 'nombre',
      label: 'Nombre',
      Header: t('configuracion>centro_educativo>ver_centro_educativo>administracion_auxiliar>columna_nombre', 'Nombre'),
      accessor: 'nombre'
    },
    {
      column: 'primerApellido',
      label: 'Primer Apellido',
      Header: t('configuracion>centro_educativo>ver_centro_educativo>administracion_auxiliar>columna_primer_apellido', 'Primer Apellido'),
      accessor: 'primerApellido'
    },
    {
      column: 'segundoApellido',
      label: 'Segundo Apellido',
      Header: t('configuracion>centro_educativo>ver_centro_educativo>administracion_auxiliar>columna_segundo_apellido', 'Segundo Apellido'),
      accessor: 'segundoApellido'
    },
    {
      column: 'puesto',
      label: 'Puesto',
      Header: t('configuracion>centro_educativo>ver_centro_educativo>administracion_auxiliar>agregar>puesto', 'Puesto'),
      accessor: 'puesto'
    },
    {
      column: 'estado',
      label: 'Estado',
      Header: t('configuracion>centro_educativo>ver_centro_educativo>administracion_auxiliar>columna_estado', 'Estado'),
      accessor: 'estado',
      style: {
        width: '6rem'
      },
      Cell: ({ row }) => renderStateTable(row)
    },
    {
      column: 'checked',
      accessor: 'checked',
      label: '',
      Cell: ({ row }) => renderActionsTable(row)
    }
  ]

  /* const columnsRepetidas = [
    {
      column: 'nombre',
      label: 'Nombre',
      Header: t('configuracion>centro_educativo>ver_centro_educativo>administracion_auxiliar>columna_nombre', 'Nombre'),
      accessor: 'nombre'
    },
    {
      column: 'primerApellido',
      label: 'Primer Apellido',
      Header: t('configuracion>centro_educativo>ver_centro_educativo>administracion_auxiliar>columna_primer_apellido', 'Primer Apellido'),
      accessor: 'primerApellido'
    },
    {
      column: 'segundoApellido',
      label: 'Segundo Apellido',
      Header: t('configuracion>centro_educativo>ver_centro_educativo>administracion_auxiliar>columna_segundo_apellido', 'Segundo Apellido'),
      accessor: 'segundoApellido'
    },
    {
      column: 'puesto',
      label: 'Puesto',
      Header: t('configuracion>centro_educativo>ver_centro_educativo>administracion_auxiliar>agregar>puesto', 'Puesto'),
      accessor: 'puesto'
    },
    {
      column: 'estado',
      label: 'Estado',
      Header: t('configuracion>centro_educativo>ver_centro_educativo>administracion_auxiliar>columna_estado', 'Estado'),
      accessor: 'estado',
      style: {
        width: '6rem'
      },
      Cell: ({ row }) => renderStateTable(row)
    },
    {
      column: 'checked',
      accessor: 'checked',
      label: '',
      Cell: ({ row }) => renderActionsTable(row)
    }
  ] */

  const renderStateTable = (row) => {
    return (
      <div
        style={{
				  padding: '.5rem',
				  borderRadius: '1rem',
				  background:
						row.original.estadoMiembro === 'Activo'
						  ? '#3e884f'
						  : row.original.estadoMiembro === 'Inactivo'
						    ? '#c43d4b'
						    : '#ff9225',
          color: '#fff',
          width: 'fit-content'
        }}
      >
        {row.original.estado}
      </div>
    )
  }
  const renderActionsTable = (row) => {
    return (
      <div
        style={{
				  textAlign: 'center',
				  display: 'flex',
				  justifyContent: 'center',
				  alignItems: 'center'
        }}
      >
        {/* <input
					checked={selectedMembers.includes(row.original.id)}
					className="custom-checkbox mb-0 d-inline-block"
					type="checkbox"
					style={{
						width: '1rem',
						height: '1rem',
						marginRight: '1rem'
					}}
					onClick={(e) => {
						if (selectedMembers.includes(row.original.id)) {
							setSelectedMembers(
								selectedMembers.filter(
									(el) => el !== row.original.id
								)
							)
						} else {
							setSelectedMembers([
								...selectedMembers,
								row.original.id
							])
						}
					}}
				/> */}
        <Tooltip title={t("estudiantes>expediente>buscador>col_acciones>ver", "Ver")}>
          <TouchAppIcon
            className='mr-2'
            style={{
						  cursor: 'pointer',
						  color: colors.darkGray
            }}
            onClick={async (e) => {
						  props.toggleAddNewModal(false)
						  await props.setMember(row.original)
            }}
          />
        </Tooltip>
        <Tooltip title={t("boton>general>editar", "Editar")}>
          <Edit
            className='mr-2'
            style={{
						  cursor: 'pointer',
						  color: colors.darkGray
            }}
            onClick={async (e) => {
						  await props.setMember(row.original)
						  props.toggleAddNewModal()
            }}
          />
        </Tooltip>
        {row.original.estado === 'Activo'
          ? (
            <Tooltip title={t("boton>general>deshabilitar","Deshabilitar")}>
              <div
                style={{
							  color: colors?.darkGray,
							  cursor: 'pointer'
                }}
                onClick={() => {
							  props.activarInactivarMiembro(
							    [row.original?.id],
							    'Inactivo',
							    props.esPrivado
							  )
                }}
              >
                <BookDisabled />
              </div>
            </Tooltip>
            )
          : (
            <Tooltip title={t("general>habilitar", "Habilitar")}>
              <div
                style={{
							  color: colors?.darkGray,
							  cursor: 'pointer'
                }}
                onClick={() => {
							  props.activarInactivarMiembro(
							    [row.original?.id],
							    'Activo',
							    props.esPrivado
							  )
                }}
              >
                <BookAvailable />
              </div>
            </Tooltip>
            )}
      </div>
    )
  }

  const columns = useMemo(() => {
    let _columns = [...columnsRepetidas]

    const _hasEditAccess = !onlyView && hasEditAccess

    if (!_hasEditAccess) {
      _columns = columnsRepetidas.filter((x) => x.accessor !== 'checked')
    }
    if (props.esPrivado) {
      _columns = columnsRepetidas.filter((x) => x.accessor !== 'puesto')
    }

    return _columns
  }, [props.esPrivado, selectedMembers, data, items, t])

  useEffect(() => {
    setItems(data)
  }, [data])

  const toggleModal = async () => {
    await props.setMember({})
    props.toggleAddNewModal()
  }

  const onSearch = () => {
    setItems(search(searchValue).in(data, Object.keys(data[0])))
  }
  console.log(columns)

  return (
    <>
      <div className='mb-5'>
        <div className='d-flex justify-content-between align-items-center'>
          <div
            className='search-sm--rounded'
            style={{
						  width: '40rem'
            }}
          >
            <input
              type='text'
              name='keyword'
              id='search'
              onInput={(e) => onSearch()}
              onKeyPress={(e) => {
							  if (e.key === 'Enter' || e.keyCode === 13) {
							    onSearch()
							  }
              }}
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder={t('general>buscar', 'Buscar')}
            />

            <StyledInputGroupAddon
              style={{ zIndex: 2 }}
              addonType='append'
            >
              <Button
                color='primary'
                className='buscador-table-btn-search'
                onClick={onSearch}
                id='buttonSearchTable'
              >
                {t('general>buscar', 'Buscar')}
              </Button>
            </StyledInputGroupAddon>
          </div>
          <Col style={{ display: 'flex', justifyContent: 'right' }}>
            {!onlyView && hasAddAccess && (
              <Button
                color='primary'
                className='mr-2'
                onClick={() => {
								  toggleModal()
                }}
              >
                {t('general>agregar', 'Agregar')}
              </Button>
            )}
            {!onlyView && hasEditAccess && (
              <ButtonDropdown
                isOpen={openDropdown}
                toggle={() => {
								  setOpenDropdown(!openDropdown)
                }}
              >
                <div className='btn btn-primary btn-lg pl-4 pr-0 check-button check-all'>
                  <CustomInput
                    className='custom-checkbox mb-0 d-inline-block'
                    type='checkbox'
                    id='checkAll'
                    onClick={() => {
										  if (
										    selectedMembers.length <
												data.length
										  ) {
										    setSelectedMembers(
										      data.map((el) => el?.id)
										    )
										  } else if (
										    selectedMembers.length ===
												data.length
										  ) {
										    setSelectedMembers([])
										  }
                    }}
                    checked={
											selectedMembers.length ===
											data.length
										}
                  />
                </div>
                <DropdownToggle
                  caret
                  color='primary'
                  className='dropdown-toggle-split btn-lg'
                />
                <DropdownMenu right>
                  <DropdownItem
                    onClick={async () => {
										  await props.activarInactivarMiembro(
										    selectedMembers,
										    'Activo'
										  )
										  setSelectedMembers([])
                    }}
                  >
                    <div>{t('general>activar', 'Activar')}</div>
                  </DropdownItem>
                </DropdownMenu>
              </ButtonDropdown>
            )}
          </Col>
        </div>
        <TableReactImplementation
          avoidSearch
          columns={columns}
          data={items}
        />
      </div>
    </>
  )
}

const StyledInputGroupAddon = styled(InputGroupAddon)`
	top: 0;
	right: 0;
	position: absolute;
	height: 100%;
	display: flex;
	align-items: center;
`

export default TablaMiembros
