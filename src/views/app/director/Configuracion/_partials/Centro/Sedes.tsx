import React, { useEffect, useMemo } from 'react'
import styled from 'styled-components'
import { useSelector } from 'react-redux'
import { useActions } from '../../../../../../hooks/useActions'
import { getSedes, deleteSedes } from 'Redux/configuracion/actions'
import HTMLTable from 'Components/HTMLTable'
import { searchCenterById } from '../../../../../../redux/configuracion/actions'
import { TableReactImplementation } from 'Components/TableReactImplementation'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import { IoMdTrash } from 'react-icons/io'
import { useTranslation } from 'react-i18next'
import swal from 'sweetalert'

type IState = {
	configuracion: any
}

const Sedes = (props: any) => {
  const { t } = useTranslation()

  const [loading, setLoading] = React.useState<boolean>(false)
  const [data, setData] = React.useState<Array<any>>([])
  const [centroPrimario, setCentroPrimario] = React.useState({})
  const actions = useActions({ getSedes, deleteSedes })
  const configuracion = useSelector((state: IState) => state.configuracion)
  const { currentInstitution } = useSelector((state) => state.authUser)
  const state = useSelector((store) => {
    return {
      currentInstitution: store.configuracion.currentInstitution,
      estados: store.institucion.institutionStates
    }
  })
  const columns = useMemo(() => {
    return [
      {
        Header: t('configuracion>centro_educativo>ver_centro_educativo>sedes>codigo', 'Código'),
        column: 'codigo',
        accessor: 'codigo',
        label: ''
      },
      {
        Header: t('configuracion>centro_educativo>ver_centro_educativo>sedes>centro_educativo', 'Centro educativo'),
        column: 'nombre',
        accessor: 'nombre',
        label: ''
      },
      {
        Header: t('configuracion>centro_educativo>ver_centro_educativo>sedes>ubicacion_administrativa', 'Ubicación administrativa'),
        column: 'ubicacionAdministrativaP',
        accessor: 'ubicacionAdministrativaP',
        label: ''
      },
      {
        Header: t('configuracion>centro_educativo>ver_centro_educativo>sedes>tipo_asociacion', 'Tipo asociación'),
        column: 'tipoAsociacion',
        accessor: 'tipoAsociacion',
        label: ''
      },
      {
        Header: t('configuracion>centro_educativo>ver_centro_educativo>sedes>estado', 'Estado'),
        column: 'estadoP',
        accessor: 'estadoP',
        label: ''
      },
      {
        Header: t('configuracion>centro_educativo>ver_centro_educativo>sedes>acciones', 'Acciones'),
        column: '',
        accessor: '',
        label: '',
        Cell: ({ cell, row, data }) => {
          const fullRow = data[row.index]
          return hasDeleteAccess
            ? (
              <div
                style={{
							  display: 'flex',
							  justifyContent: 'center',
							  alignItems: 'center',
							  alignContent: 'center'
                }}
              >
                <button
                  style={{
								  border: 'none',
								  background: 'transparent',
								  cursor: 'pointer',
								  color: 'grey'
                  }}
                  onClick={() => {
								  swal({
								    title: 'Eliminar sede',
								    text: '¿Está seguro de eliminar la sede?',
								    icon: 'warning',
								    className: 'text-alert-modal',
								    buttons: {
								      cancel: 'Cancelar',
										  ok: {
								        text: 'Si, eliminar',
								        value: true,
								        className: 'btn-primary'
										  }
                      }
								  }).then(async (res) => {
								    if (res) {
								      const response = await actions.deleteSedes([fullRow.id], configuracion.currentInstitution.id)
								      if (!response.error) {
								        swal({
								          title: 'Sede eliminada',
								          text: 'La sede ha sido eliminada con éxito',
								          icon: 'success',
								          className: 'text-alert-modal',
								          buttons: {
													  ok: {
								              text: 'Cerrrar',
								              value: true,
								              className: 'btn-primary'
													  }
								          }
								        })
								      } else {
								        swal({
								          title: 'Sede eliminada',
								          text: 'Ha ocurrido un error',
								          icon: 'error',
								          className: 'text-alert-modal',
								          buttons: {
													  ok: {
								              text: 'Cerrar',
								              value: true,
								              className: 'btn-primary'
													  }
								          }
								        })
								      }
								    }
								  })
                  }}
                >
                  <Tooltip title='Eliminar'>
                    <IconButton>
                      <IoMdTrash style={{ fontSize: 30 }} />
                    </IconButton>
                  </Tooltip>
                </button>
              </div>
              )
            : (
              <></>
              )
        }
      }
    ]
  }, [data, t])
  React.useEffect(() => {
    buscarSedes()
  }, [])

  /* const buscarSedes = async () => {
		let institucionId =
			configuracion.currentInstitution.centroPrimario &&
			configuracion.currentInstitution.centroPrimario !== 0
				? configuracion.currentInstitution.centroPrimario
				: configuracion.currentInstitution.id
		await actions.getSedes(institucionId)
		if (configuracion.currentInstitution.centroPrimario) {
			const center = await searchCenterById(
				configuracion.currentInstitution.centroPrimario
			)
			setCentroPrimario(center.data)
		}
	} */
  // useEffect(() => {
  // 	actions.getSedes(693)
  // }, [])
  const buscarSedes = async () => {
    const institucionId = configuracion.currentInstitution.id
    const response = await actions.getSedes(institucionId)
    console.log(response, 'CENTER')
    if (configuracion.currentInstitution.centroPrimario) {
      const center = await searchCenterById(
        configuracion.currentInstitution.centroPrimario
      )
      setCentroPrimario(center.data)
      console.log(center.data, 'CENTERDATA')
      const estadoFinded = state.estados?.find(
        (x) => x.id == center.data.estadoId
      )

      setData([
        ...data,
        {
          id: center.data?.id,
          codigo: center.data?.codigo,
          nombre: center.data?.nombre,
          tipoAsociacion: 'CENTRO EDUCATIVO PRINCIPAL',
          estadoP: estadoFinded?.nombre,
          ubicacionAdministrativaP:
						center.data?.regionNombre +
						'/' +
						center.data?.circuitoNombre
        }
      ])
    }
  }

  React.useEffect(() => {
    setData(
      configuracion.sedes.map((sede: any) => {
        return {
          ...sede,
          tipoAsociacion:
						sede.id ===
						configuracion.currentInstitution.centroPrimario
						  ? 'PRIMARIO'
						  : sede.tipoAsociacion,
          estadoP: sede.estado,
          ubicacionAdministrativaP:
						sede.ubicacionAdministrativa.replace(',', '/')
        }
      }) || []
    )
  }, [configuracion.sedes])

  const { hasDeleteAccess = true } = props

  const handlePagination = () => {}
  console.log(data, 'DATA')
  return (
    <Wrapper>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Title>{t('configuracion>centro_educativo>ver_centro_educativo>sedes>sedes_asociadas_centro_educativo', 'Sedes asociadas al centro educativo')}</Title>
        {/* {configuracion.currentInstitution.centroPrimario && */}
        <div>
          <h3 />
        </div>
      </div>
      <SectionTable>
        <TableReactImplementation
          data={data}
          handleGetData={() => {}}
          columns={columns}
          orderOptions={[]}
          mensajeSinRegistros={
						t('configuracion>centro_educativo>ver_centro_educativo>sedes>mensaje_no_registros', 'Este centro educativo no cuenta con sedes asociadas.')
					}
        />
        {/*
				<HTMLTable
					columns={columns}
					selectDisplayMode="thumblist"
					data={data}
					actions={hasDeleteAccess ? actionsTable : []}
					isBreadcrumb={false}
					match={props.match}
					tableName="label.sedes"
					modalOpen={false}
					selectedOrderOption={{ column: 'detalle', label: 'Nombre Completo' }}
					showHeaders={true}
					editModalOpen={false}
					modalfooter={true}
					loading={loading}
					orderBy={false}
					totalRegistro={0}
					labelSearch={''}
					handlePagination={() => null}
					handleSearch={handleSearch}
					handleCardClick={(_: any) => null}
					hideMultipleOptions={true}
					readOnly={true}
					/>
				*/}
      </SectionTable>
    </Wrapper>
  )
}

const Wrapper = styled.div`
	padding-top: 20px;
`

const Title = styled.h4`
	color: #000;
`

const SectionTable = styled.div`
	margin-top: 10px;
`

export default Sedes
