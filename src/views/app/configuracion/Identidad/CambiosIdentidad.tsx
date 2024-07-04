import colors from 'Assets/js/colors'
import ConfirmModal from 'Components/Modal/ConfirmModal'
import { useActions } from 'Hooks/useActions'
import useNotification from 'Hooks/useNotification'
import { cloneDeep } from 'lodash'
import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import {
  actualizarIdentidad,
  cambiarEstadoFallecido,
  cambiarIdentificacion,
  getIdentificacionPersona,
  setWizardDataStore
} from 'Redux/identidad/actions'
import styled from 'styled-components'
import swal from 'sweetalert'

import IdentidadForm from './IdentidadForm'
import CambiarIdentification from './modals/CambiarIdentificacion'
import RegistrarFallecimiento from './modals/RegistrarFallecimiento'
import WizardRegistrar from './wizardRegistrar'
import { useForm } from 'react-hook-form'
import { getCantidadTrasladosByIdentidadId } from 'Redux/traslado/actions'
import { Button } from 'reactstrap'
import { useTranslation } from 'react-i18next'

type IProps = {}

type IState = {
	registro: any
	identidad: any
	selects: any
	authUser:any
}

type SnackbarConfig = {
	variant: string
	msg: string
}
const ROLES_HABILITADOS_PARA_REVERTIR_FALLECIDOS = [
  1, //	ADMIN
  // 2,//	DIRECTOR
  5, // Supervisor Circuital
  6, //	DIRECTOR REGIONAL
  19 //	SA
]
const CambiosIdentidad: React.FC<IProps> = (props) => {
  const {t} = useTranslation()

  const [search, setSearch] = React.useState<string>('')
  const [show, setShow] = React.useState<boolean>(false)
  const [requesting, setRequesting] = React.useState<boolean>(false)
  const [requestingIdentification, setRequestingIdentification] =
		React.useState<boolean>(false)
  const [editResource, setEditResource] = React.useState<boolean>(false)
  const [modalIdentification, setModalIdentification] =
		React.useState<boolean>(false)
  const [modalFallecimiento, setModalFallecimiento] =
		React.useState<boolean>(false)
  const [previewUser, setPreviewUser] = React.useState<any>(null)
  const [snackbar, handleClick] = useNotification()
  const [selectedType, setSelectedType] = React.useState<any>(null)
  const [dataResponse, setDataResponse] = React.useState<any>({})
  const [informationStateModal, setInformationStateModal] =
		React.useState<boolean>(false)
  const [identificationChange, setIdentificationChange] =
		React.useState<boolean>(false)
  const [filesTodelete, setFilesTodelete] = React.useState<any[]>([])
  const [showFallecidoModal, setShowFallecidoModal] = React.useState(false)

  const [snackBarContent, setSnackbarContent] =
		React.useState<SnackbarConfig>({
		  variant: '',
		  msg: ''
		})
  const tieneAccesoARevertir = useSelector((store: any) => {
    const roles = store?.authUser?.authObject?.user?.rolesOrganizaciones
    if (roles && roles.length > 0) {
      const ids = roles.map((i) => i.rolId)
      return ROLES_HABILITADOS_PARA_REVERTIR_FALLECIDOS.find((i) =>
        ids.includes(i)
      )
    }
    // return store?.authUser?.authObject?.user?.rolesOrganizaciones
  })
  const { handleSubmit } = useForm()

  const actions = useActions({
    getIdentificacionPersona,
    cambiarIdentificacion,
    actualizarIdentidad,
    cambiarEstadoFallecido,
    setWizardDataStore,
    getCantidadTrasladosByIdentidadId
  })

  const state = useSelector((store: IState) => {
    return {
      currentUser: store.registro.currentUser,
      user: store.identidad.data,
      selects: store.selects,
      authUser: store.authUser.currentRoleOrganizacion.accessRole
    }
  })

  useEffect(() => {
    const fetch = async () => {
      await actions.setWizardDataStore({ data: previewUser })
    }
    fetch()
  }, [previewUser])

  const showSnackBar = (variant: string, msg: string) => {
    setSnackbarContent({ variant, msg })
    handleClick()
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value)
  }

  const handleInputSearch = async () => {
    setPreviewUser(null)

    if (search === '') {
      showSnackBar('error', t('general>error_id_no_found', 'Oops! Por favor ingrese una identidad'))
      return
    }
    setRequesting(true)

    const { data, error } = await actions.getIdentificacionPersona(search)
    error && showSnackBar('error', t('general>error', 'Oops! Algo salió mal'))
    setRequesting(false)

    if (Object.keys(data).length === 0) {
      swal({
        title: t('general>error>siento', '¡Lo siento!'),
        text: t('general>error>no_register', 'Esta persona no se encuentra registrada'),
        icon: 'warning',
        buttons: {
          ok: {
            text: 'Ok',
            value: true
          }
        }
      })
    }
    /* Si la persona esta fallecida muestra el modal explicando que no puede realizar modificaciones */
    if (data?.identidadDatos?.esFallecido) {
      setShowFallecidoModal(true)
    }
  }

  const toggleEdit = async () => {
    setEditResource(!editResource)
    const userPreview = cloneDeep(state.user)

    let type: any = null

    userPreview.datos.forEach((item) => {
      if (item.codigoCatalogo === 1) {
        type = state.selects.idTypes.find(
          (x) => x.id === item.elementoId && item.codigoCatalogo === 1
        )
      }
    })
    let name = 'cedula'
    switch (type.id) {
      case 1:
        name = 'cedula'
        break
      case 3:
        name = 'dimex'
        break
      case 4:
        name = 'yisro'
        break

      default:
        name = 'cedula'
        break
    }

    setSelectedType({ ...type, name })
    setPreviewUser(userPreview)
    setShow(true)
  }

  const cancelPreview = async () => {
    setEditResource(!editResource)
    setPreviewUser(state.user)

    setShow(false)
  }

  const toggleModalIdentification = async () => {
    previewUser && cancelPreview()
    setModalIdentification(!modalIdentification)
  }

  const toggleModalFallecimiento = async () => {
    const trasladosCount = await actions.getCantidadTrasladosByIdentidadId(
      state.user.id
    )

    if (trasladosCount > 0) {
      setSnackbarContent({
        msg: 'No puede registrar como fallecido a estudiantes que tiene traslados activos',
        variant: 'error'
      })
      handleClick()
      return
    }
    previewUser && cancelPreview()
    setModalFallecimiento(!modalFallecimiento)
  }

  const handleFallecimiento = async (
    value: boolean,
    date: string,
    showFallecimientoModal?: boolean
  ) => {
    try {
      setRequesting(true)
      const response = await actions.cambiarEstadoFallecido({
        id: state.user.id,
        fallecio: value,
        fechaFallecio: date
      })
      setRequesting(false)
      if (response.error) throw response.data
      if (showFallecimientoModal) { setModalFallecimiento(!modalFallecimiento) }
      showSnackBar(
        'success',
        'Estado de fallecimiento actualizado correctamente'
      )
    } catch (e) {
      setRequesting(false)
      showSnackBar('error', `El estudiante pertenece a la dirección regional: ${state.authUser.organizacionNombre}, no puede revertir el fallecimiento`)
      // showSnackBar('error', 'Oops! Algo ha salido mal, Intentelo luego')
    }
  }
  const handleIdentidad = async (values: any) => {
    try {
      setRequestingIdentification(true)
      const res = await actions.getIdentificacionPersona(
        values.identification,
        true
      )

      setRequestingIdentification(false)
      if (res.exists) {
        return showSnackBar(
          'warning',
          'Ya existe una persona registrada con esta identificación'
        )
      } else {
        let name = 'cedula'
        switch (values.type_identification?.id) {
          case 1:
            name = 'cedula'
            break
          case 3:
            name = 'dimex'
            break
          case 4:
            name = 'yisro'
            break

          default:
            name = 'cedula'
            break
        }
        setIdentificationChange(true)
        setSelectedType({ ...values.type_identification, name })
        setModalIdentification(!modalIdentification)
        const userPreview = cloneDeep(state.user)
        const _datos = userPreview.datos.map((item) => {
          if (item.catalogoId === 1) {
            return {
              ...item,
              elementoId: values.type_identification?.id
            }
          } else {
            return {
              ...item
            }
          }
        })

        setPreviewUser({
          ...userPreview,
          datos: _datos,
          type_identification: values.type_identification?.id,
          identificacion: values.identification
        })
        setShow(true)
      }
    } catch (error) {
      setRequestingIdentification(false)
      showSnackBar('error', 'Oops! Algo ha salido mal, Intentelo luego')
    }
  }

  const handleUpdate = async (values: any, photo: string, files: any[]) => {
    try {
      setRequesting(true)
      const _data = {
        ...values,
        id: state.user.id,
        tipoIdentificacionId: values.tipoIdentificacionId,
        identificacion: values.identificacion,
        nacionalidadId: values.nacionalidadId || values.nationality.id,
        nombre: values.nombre,
        primerApellido: values.primerApellido,
        segundoApellido: values.segundoApellido,
        conocidoComo: values.conocidoComo,
        fechaNacimiento: values.fechaNacimiento,
        sexoId: values.sexoId || values.sexo.id,
        generoId: values.generoId || values.genero.id,
        tipoDimexId:
					values.tipoIdentificacionId === 3
					  ? values.tipoDimex?.id
					  : null,
        forzar: true,

        imagenBase64: photo ? photo.split(',')[1] : '',
        documentosAprobatoriosToAdd:
					filesTodelete.length < 0 ? files : [],
        documentosAprobatoriosToDelete: filesTodelete
      }

      const res = await actions.actualizarIdentidad(_data)

      setRequesting(false)
      if (!res.error) {
        setIdentificationChange(false)
      }
      setDataResponse(res.data)
      setInformationStateModal(true)
      setEditResource(!editResource)
      setPreviewUser(null)
      return { ...res }
    } catch (error) {
      setRequesting(false)
      return { error: true }
    }
  }

  const clear = () => {
    setInformationStateModal(false)
  }
  const RevertirFallecimiento = () => {
    handleFallecimiento(false, null, false).then((_) => {
      setShowFallecidoModal(false)
    })
  }
  /*
{tieneAccesoARevertir && props.user.esFallecido  ?
        <ActionButton
          onClick={props.toggleFallecimiento}
          color={'primary'}
        >
          Revertir fallecimiento
        </ActionButton>: ''
        }
*/
  return (
    <Wrapper>
      {snackbar(snackBarContent.variant, snackBarContent.msg)}
      <ConfirmModal
        openDialog={showFallecidoModal}
        onClose={() => setShowFallecidoModal(false)}
        onConfirm={() => setShowFallecidoModal(false)}
        actions={false}
        title='Identidad'
      >
        <span style={{ marginTop: '2.5rem' }}>
          La persona estudiante que está consultando se encuentra
          registrada como FALLECIDA, por lo cual hay funcionalidades
          en el sistema que solamente son de consulta.
        </span>
        <div
          style={{
					  display: 'flex',
					  justifyContent: 'space-around',
					  marginTop: '2.5rem',
					  marginBottom: '1rem'
          }}
        >
          <Button
            color='primary'
            onClick={() => setShowFallecidoModal(false)}
          >
           {t("boton>general>cancelar", "Cancelar")}
          </Button>
          {tieneAccesoARevertir && state.user.esFallecido
            ? (
              <Button
                onClick={RevertirFallecimiento}
                color='primary'
              >
                {t('general>boton>revertir_fallecimiento','Revertir fallecimiento')}
              </Button>
              )
            : (
					  ''
              )}
        </div>
      </ConfirmModal>
      <Title>{t('estudiantes>indentidad_per>aplicar_camb>titulo', 'Aplicar cambios a la identidad de la persona')}</Title>
      <Form onSubmit={handleSubmit(() => {})}>
        <FormRow>
          <FormInline>
            <Label>{t('estudiantes>indentidad_per>aplicar_camb>num_id', 'Número de identificación')}</Label>
            <Input
              type='text'
              value={search}
              onChange={handleChange}
            />
          </FormInline>
          <Search>
            <Button
              onClick={() => {
							  handleInputSearch()
              }}
              disable={requesting}
              color='primary'
            >
              {requesting
                ? (
                  <span className='single-loading mx-2' />
                  )
                : (
							  t('general>buscar', 'Buscar')
                  )}
            </Button>
          </Search>
        </FormRow>
      </Form>
      <ContentForms>
        {Object.keys(state.user).length !== 0
          ? (
            <IdentidadForm
              title={t('estudiantes>indentidad_per>aplicar_camb>identidad_actual_sl', 'Identidad actual de la persona')}
              subtitle={t('estudiantes>indentidad_per>aplicar_camb>solo_lec', 'Solo lectura')}
              disabled
              user={state.user}
              toggleEdit={toggleEdit}
              toggleIdentificacion={toggleModalIdentification}
              toggleFallecimiento={toggleModalFallecimiento}
            />
            )
          : null}
        {previewUser !== null && show
          ? (
            <Card className='bg-white__radius'>
              <CardTitle>
                {t('estudiantes>indentidad_per>aplicar_camb>propuesta_camb_identidad', 'Propuesta de cambios en la identidad')}
              </CardTitle>
              <WizardRegistrar
                filesTodelete={filesTodelete}
                setFilesTodelete={setFilesTodelete}
                identificationChange={identificationChange}
                sendData={handleUpdate}
                editResource={editResource}
                show={show}
                cancelPreview={cancelPreview}
                selectedType={selectedType}
                setSelectedType={setSelectedType}
                isAplicar
                setIdentificationChange
              />
            </Card>
            )
          : null}
      </ContentForms>

      {Object.keys(state.user).length > 0
        ? (
          <CambiarIdentification
            setPreviewUser={setPreviewUser}
            showSnackBar={showSnackBar}
            previewUser={previewUser}
            visible={modalIdentification}
            handleModal={() =>
					  setModalIdentification(!modalIdentification)}
            user={state.user}
            requesting={requestingIdentification}
            handleConfirm={handleIdentidad}
          />
          )
        : null}

      <RegistrarFallecimiento
        visible={modalFallecimiento}
        handleModal={toggleModalFallecimiento}
        user={state.user}
        requesting={requesting}
        handleConfirm={handleFallecimiento}
      />
      <ConfirmModal
        openDialog={informationStateModal}
        onClose={clear}
        title={t('general>modal>cambio_aplicado_con_extio','Cambio aplicado con éxito')}
        actions={false}
      >
        <Container>
          <h5
            className={`${
							selectedType?.id === 4
								? 'mt-3 text-left'
								: 'my-5 text-center'
						} mt-3 w-100 `}
          >
            {t('general>modal>cambio_aplicado_con_exito','El cambio se aplicó a la persona con éxito en la plataforma')}
          </h5>
          {selectedType?.id === 4 && (
            <Yisro>
              <h5 className='m-0 w-100 text-left'>
                {t("general>calendar>error", "El número Yís Rö - Identificación MEP de la persona es:")}
              </h5>
              <label className=' w-100 text-center'>
                {dataResponse?.identificacion}
              </label>
            </Yisro>
          )}
          <Actions>
            <Button onClick={() => clear()} color='primary'>
              {t("general>boton>entendido", "Entendido")}
            </Button>
          </Actions>
        </Container>
      </ConfirmModal>
    </Wrapper>
  )
}
const Card = styled.div`
	background: #fff;
	margin-top: 30px;
	position: relative;
	height: 100%;
`

const CardTitle = styled.h5`
	color: #000;
	margin-bottom: 10px;
`

const Wrapper = styled.div`
	margin-top: 20px;
	margin-bottom: 30px;
`

const ContentForms = styled.div`
	display: grid;
	grid-template-columns: 47% 47%;
	justify-content: space-between;
	align-items: center;
	position: relative;
`
const Title = styled.h4`
	color: #000;
`

const Form = styled.form`
	margin-top: 30px;
	width: 40%;
`

const FormRow = styled.div`
	display: grid;
	grid-template-columns: 50% 30%;
	align-items: flex-end;
	grid-column-gap: 10px;
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

const Actions = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
	width: 100%;
	margin-top: 50px;
`
const Yisro = styled.div`
	display: flex;
	justify-content: center;
	flex-flow: row;
	flex-wrap: wrap;
	width: 100%;

	label {
		margin-top: 15px;
		width: 100%;
		padding: 20px;
		background: ${colors.gray};
		font-size: 30px;
		font-weight: 800;
	}
`
const Container = styled.div`
	display: flex;
	flex-flow: row;
	flex-wrap: wrap;
	gap: 20px;
`

export default CambiosIdentidad
