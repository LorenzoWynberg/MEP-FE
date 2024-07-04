import React from 'react'
import styled from 'styled-components'
import { useSelector } from 'react-redux'
import { useActions } from '../../../../../../hooks/useActions'
import {
  getDirectores,
  buscarDirectores,
  asignarDirector,
  getDatosDirector
} from '../../../../../../redux/configuracion/actions'
import ModalUsuarios, { TIPO_USUARIO } from './ModalUsuarios'
import useNotification from '../../../../../../hooks/useNotification'
import HTMLTable from 'Components/HTMLTable'
import { parseISO, format } from 'date-fns'
import { Button } from 'reactstrap'

import { TooltipLabel } from '../../../../../../components/JSONFormParser/styles'

const columns = [
  { column: 'identificacion', label: 'Identificación' },
  { column: 'nombreCompleto', label: 'Nombre completo' },
  { column: 'email', label: 'Correo electrónico' },
  { column: 'fechaInsercion', label: 'Fecha rige saber' },
  { column: 'fechaActualizacion', label: 'Fecha vence saber' }
]

type CurrentUser = {
	usuarioId: string
	identificacion: string
	nombre: string
	apellido: string
	segundoApellido: string
	emailUsuario: string
}

type IProps = {
	currentUser: CurrentUser
}

type IState = {
	configuracion: any
}

type SnackbarConfig = {
	variant: string
	msg: string
}

const AsignarDirector = (props: IProps) => {
  const [data, setData] = React.useState<Array<any>>([])
  const [search, setSearch] = React.useState<string>('')
  const [modal, setModal] = React.useState<boolean>(false)
  const [currentUser, setCurrentUser] = React.useState<Partial<CurrentUser>>(
    {}
  )
  const [showButton, setShowButton] = React.useState(false)
  const [clearValues, setClearValues] = React.useState(false)
  const [paginationData, setPaginationData] = React.useState({
    pagina: 1,
    cantidad: 6
  })
  const [snackBarContent, setSnackbarContent] =
		React.useState<SnackbarConfig>({
		  variant: '',
		  msg: ''
		})
  const [snackbar, handleClick] = useNotification()
  const actions = useActions({
    getDirectores,
    buscarDirectores,
    asignarDirector,
    getDatosDirector
  })

  const { hasEditAccess = true } = props

  const state = useSelector((store: IState) => {
    return {
      currentInstitution: store.configuracion.currentInstitution,
      currentDirector: store.configuracion.currentDirector,
      configuracion: store.configuracion,
      usuarios: store.configuracion.usuarios
    }
  })

  React.useEffect(() => {
    directores()
  }, [])

  React.useEffect(() => {
    if (state.currentDirector) {
      setCurrentUser(state.currentDirector)
      setSearch(state.currentDirector.identificacion)
    }
  }, [state.currentDirector])

  React.useEffect(() => {
    if (state.currentDirector) {
      setCurrentUser(state.currentDirector)
      setSearch(state.currentDirector.identificacion)
    }
  }, [clearValues])

  const directores = async () => {
    const institucionId = state.currentInstitution.id
    await actions.getDatosDirector(institucionId)
    await actions.getDirectores({
      institucionId,
      pagina: paginationData.pagina,
      cantidad: paginationData.cantidad,
      keyword: ''
    })
  }

  React.useEffect(() => {
    setData(
      state.configuracion.directores.entityList.map((director: any) => {
        return {
          ...director,
          nombreCompleto: `${director.nombre} ${director.primerApellido} ${director.segundoApellido}`,
          fechaInsercion: format(
            parseISO(director.fechaInsercion),
            'dd/MM/yyyy'
          ),
          fechaActualizacion:
						director.usuarioId !== currentUser.usuarioId
						  ? format(
						    parseISO(director.fechaActualizacion),
						    'dd/MM/yyyy'
							  )
						  : ''
        }
      }) || []
    )
  }, [state.configuracion.directores])

  const showsnackBar = (variant, msg) => {
    setSnackbarContent({ variant, msg })
    handleClick()
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value)
  }

  const handleInputSearch = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    e.preventDefault()
    setModal(true)
    /* let result = await actions.buscarDirectores({
      pagina: paginationData.pagina,
      cantidad: paginationData.cantidad,
      keyword: search,
    })
    if (result.data.entityList.length === 0) {
      showsnackBar('error', 'El director que busca no cuenta con usuario');
      setModal(!modal);
    }

    if (!result.error) {
      if (result.data.entityList.length === 0) {
        setModal(!modal)
      } else {
        let user = result.data.entityList.find(
          (item: any) => item.identificacion == search,
        )
        setSearch(user.identificacion)
        setCurrentUser(user || {})
      }
    } */
  }

  const handleAddDirector = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    e.preventDefault()
    try {
      const data = {
        institucionId: state.currentInstitution.id,
        usuarioId: currentUser.usuarioId,
        observaciones: currentUser.observaciones
      }
      const res = await actions.asignarDirector(data)
      if (!res.error) {
        showsnackBar(
          'success',
          'Se ha agregado el director correctamente'
        )
        setSearch('')
        setCurrentUser({})
        await directores()
        setShowButton(false)
      }
    } catch (error) {
      showsnackBar(
        'error',
        'Algo ha salido mal, Por favor intentelo luego'
      )
    }
  }

  const actionRow = [
    {
      actionName: 'Visualizar',
      actionFunction: (item) => {},
      actionDisplay: () => true
    }
  ]

  const handlePagination = async (pagina: number, cantidadPagina: number) => {
    setPaginationData({ pagina, cantidad: 6 })
    await actions.getDirectores({
      institucionId: state.currentInstitution.id,
      pagina: paginationData.pagina,
      cantidad: paginationData.cantidad,
      keyword: ''
    })
  }

  const handleSearch = async (
    filterText: string,
    cantidadPagina: number,
    pagina: number
  ) => {
    setPaginationData({ pagina, cantidad: 6 })
    await actions.getDirectores({
      institucionId: state.currentInstitution.id,
      pagina: 1,
      cantidad: 6,
      keyword: filterText
    })
  }

  const handleSelection = (item) => {
    setCurrentUser(item)
    setSearch(item.identificacion)
    setModal(!modal)
  }

  return (
    <Wrapper>
      {snackbar(snackBarContent.variant, snackBarContent.msg)}
      <Title>Asignar un director al centro educativo</Title>
      <Card className='bg-white__radius'>
        <CardTitle>Datos del director (activo)</CardTitle>
        <Form>
          <FormRow>
            <FormInline>
              <Label>Identificación</Label>
              <Input
                type='text'
                value={search}
                onChange={handleChange}
              />
            </FormInline>
            {showButton && (
              <Search>
                <Button
                  color='primary'
                  onClick={handleInputSearch}
                >
                  Buscar
                </Button>
              </Search>
            )}
          </FormRow>
          <FormGroup>
            <Label>Nombre</Label>
            <Input
              type='text'
              value={currentUser.nombre || ''}
              readOnlye
            />
          </FormGroup>
          <FormGroup>
            <Label>Primer apellido</Label>
            <Input
              type='text'
              value={
								currentUser.apellido ||
								currentUser.primerApellido ||
								''
							}
              readOnlye
            />
          </FormGroup>
          <FormGroup>
            <Label>Segundo apellido</Label>
            <Input
              type='text'
              value={currentUser.segundoApellido || ''}
              readOnlye
            />
          </FormGroup>
          <FormGroup>
            <Label>Correo electrónico</Label>
            <Input
              type='text'
              value={
								currentUser.emailUsuario ||
								currentUser.email ||
								''
							}
              readOnlye
            />
          </FormGroup>
          <FormGroup>
            <Label>Observaciones</Label>
            <Input
              type='text'
              value={currentUser.observaciones}
              maxLenght={250}
              disabled={!showButton}
              onChange={(e) => {
							  setCurrentUser({
							    ...currentUser,
							    observaciones: e.target.value
							  })
              }}
            />
          </FormGroup>
          <div style={{ width: '100%', display: 'flex' }}>
            {showButton && (
              <Button
                outline
                onClick={(e) => {
								  e.preventDefault()
								  setClearValues(!clearValues)
								  setShowButton(false)
                }}
                style={{ marginRight: '0.5rem' }}
                color='primary'
              >
                Cancelar
              </Button>
            )}
            {showButton && Object.keys(currentUser).length !== 0
              ? (
                <Button color='primary' onClick={handleAddDirector}>
                  Guardar
                </Button>
                )
              : null}
          </div>
        </Form>
      </Card>
      {!showButton && hasEditAccess && (
        <Button
          color='primary'
          onClick={() => {
					  setShowButton(true)
					  setSearch('')
					  setCurrentUser({})
          }}
        >
          Cambiar director
        </Button>
      )}

      <SectionTable>
        <Row>
          <Title>Directores anteriores</Title>
          <TooltipLabel
            field={{
						  label: '',
						  config: {
						    tooltipText:
									'Para buscar por fecha, debe tener en cuenta el formato DD/MM/AAAA'
						  }
            }}
          />
        </Row>
        <HTMLTable
          columns={columns}
          selectDisplayMode='thumblist'
          data={data}
          actions={[]}
          isBreadcrumb={false}
          actionRow={actionRow}
          match={props.match}
          tableName='label.asignDirector'
          toggleEditModal={() => null}
          toggleModal={() => null}
          modalOpen={false}
          selectedOrderOption={{
					  column: 'detalle',
					  label: 'Nombre Completo'
          }}
          showHeadersr
          editModalOpen={false}
          modalfooter
          loading={state.configuracion.directores.loading}
          orderBy={false}
          totalRegistro={state.configuracion.directores.totalCount}
          labelSearch=''
          handlePagination={handlePagination}
          handleSearch={handleSearch}
          handleResource={false}
          handleCardClick={(item) => null}
          hideMultipleOptions
          readOnly
          backendPaginated
        />
      </SectionTable>
      {modal && (
        <ModalUsuarios
          visible={modal}
          handleSelection={handleSelection}
          handleCancel={() => setModal(!modal)}
          tipoUsuario={TIPO_USUARIO.DIRECTOR}
        />
      )}
    </Wrapper>
  )
}

const Wrapper = styled.div`
	background: transparent;
	padding-top: 20px;
`

const Title = styled.h4`
	color: #000;
`

const Card = styled.div`
	background: #fff;
	margin-top: 30px;
	width: 50%;
`

const CardTitle = styled.h5`
	color: #000;
	margin-bottom: 10px;
`

const Form = styled.form`
	color: #000;
`

const FormRow = styled.div`
	display: grid;
	grid-template-columns: 50% 30%;
	align-items: flex-end;
	grid-column-gap: 10px;
	margin-bottom: 13px;
`

const FormGroup = styled.div`
	flex-direction: column;
	margin-bottom: 13px;
`

const FormInline = styled.div`
	flex-direction: column;
`

const Label = styled.label`
	color: #000;
	display: block;
`

const Input = styled.input`
	padding: 10px;
	width: 100%;
	border: 1px solid #d7d7d7;
	background-color: #e9ecef;
	outline: 0;
	&:focus {
		background: #fff;
	}
`

const Search = styled.div``

const SectionTable = styled.div`
	margin-top: 80px;
`
const Row = styled.div`
	display: flex;
`

export default AsignarDirector
