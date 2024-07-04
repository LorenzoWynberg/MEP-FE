import React, { useState, useEffect } from 'react'
import Table from 'components/table'
import Miembro from './Miembro'
import {
  getFamilyMembers,
  loadCurrentMember,
  deleteMembers
  ,
  cleanCurrentMember,
  addMember,
  getFamilyMember,
  updateMember,
  updateMemberResources,
  deleteMemberResources
} from '../../../../../../../redux/miembros/actions'

import { connect, useSelector } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { getCatalogs } from '../../../../../../../redux/selects/actions'
import { catalogsEnumObj } from '../../../../../../../utils/catalogsEnum'
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos'
import IntlMessages from '../../../../../../../helpers/IntlMessages'
import styled from 'styled-components'
import Loader from '../../../../../../../components/Loader'
import { useWindowSize } from 'react-use'
import { withIdentification } from '../../../../../../../Hoc/Identification'
import { useForm } from 'react-hook-form'
import useNotification from '../../../../../../../hooks/useNotification'
import { useActions } from '../../../../../../../hooks/useActions'
import {
  mapOption,
  parseOptions
} from '../../../../../../../utils/mapeoCatalogos'

import { getDiscapacidades } from '../../../../../../../redux/apoyos/actions'
import moment from 'moment'
import withAuthorization from '../../../../../../../Hoc/withAuthorization'
import { useTranslation } from 'react-i18next'

const MiembrosHogar = (props) => {
  const { t } = useTranslation()

  const imageInitialState = { preview: '', raw: '', edited: false }
  const { register, control, handleSubmit, reset, setValue, clearErrors } =
    useForm()
  const [memberDetailOpen, setMemberDetailOpen] = useState(false)
  const [data, setData] = useState([{}])
  const [editable, setEditable] = useState(false)
  const { width } = useWindowSize()
  const [memberData, setMemberData] = useState({})
  const [loading, setLoading] = useState(true)
  const [loadingId, setLoadingId] = useState(false)
  const [loadingOnSave, setLoadingOnSave] = useState(false)
  const [image, setImage] = useState(imageInitialState)
  const [files, setFiles] = useState([])
  const [openFilesModal, setOpenFilesModal] = useState(false)
  const [loadingProgress, setLoadingProgress] = useState(0)
  const [itemsToLoad, setItemsToLoad] = useState([])
  const [displayingModalFiles, setDisplayingModalFiles] = useState(null)
  const [clearfields, setClearFields] = useState(true)
  const [disableFields, setDisableFields] = useState(false)
  const [disableIds, setDisableIds] = useState(false)
  const [addNewModalOpen, setAddNewModalOpen] = useState(false)
  const [snackbarContent, setSnackbarContent] = useState({
    msg: 'welcome',
    variant: 'info'
  })
  const [snackBar, handleClick] = useNotification()
  const [calledBefore, setCalledBefore] = useState(false)
  const [authorizeSendData, setAuthorizeSendData] = useState(() => {})
  const actions = useActions({
    cleanCurrentMember,
    addMember,
    updateMember,
    getFamilyMember,
    updateMemberResources,
    deleteMemberResources
  })

  const columns = [
    { column: 'parentesco', label: 'Relación con el estudiante' },
    { column: 'nombre', label: 'Nombre' },
    { column: 'primerApellido', label: 'Primer apellido' },
    { column: 'segundoApellido', label: 'Segundo apellido' },
    { column: 'autorizado', label: 'Rol' },
    { column: 'encargado', label: 'Representante legal' }
  ]

  const mobileColumns = [
    { column: 'nombre', label: '' },
    { column: 'primerApellido', label: '' },
    { column: 'segundoApellido', label: '' }
  ]

  const tableActions = [
    {
      actionName: 'button.remove',
      actionFunction: (e) => {
        props.authHandler('eliminar', props.deleteMembers(e))
      }
    }
  ]

  const actionRow = [
    {
      actionName: 'button.remove',
      actionFunction: (e) => {
        props.authHandler('eliminar', props.deleteMembers([e.id]))
      },
      actionDisplay: () => true
    },
    {
      actionName: 'label.edit',
      actionFunction: (e) => {
        props.authHandler('modificar', () => {
          setMemberDetailOpen(true)
          props.loadCurrentMember(e)
          setLoading(true)
        })
      },
      actionDisplay: () => true
    }
  ]

  useEffect(() => {
    const loadData = async () => {
      await props.getFamilyMembers(props.identification.data.id)
      !props.selects[catalogsEnumObj.DISCAPACIDADES.name][0] &&
        (await props.getCatalogs(catalogsEnumObj.DISCAPACIDADES.id))
      !props.selects[catalogsEnumObj.OCUPACIONES.name][0] &&
        (await props.getCatalogs(catalogsEnumObj.OCUPACIONES.id))

      !props.selects[catalogsEnumObj.ESCOLARIDADES.name][0] &&
        (await props.getCatalogs(catalogsEnumObj.ESCOLARIDADES.id))

      !props.selects[catalogsEnumObj.RELACIONESTUDIANTE.name][0] &&
        (await props.getCatalogs(catalogsEnumObj.RELACIONESTUDIANTE.id))
      !props.selects[catalogsEnumObj.IDENTIFICATION.name][0] &&
        (await props.getCatalogs(catalogsEnumObj.IDENTIFICATION.id))

      !props.selects[catalogsEnumObj.SEXO.name][0] &&
        (await props.getCatalogs(catalogsEnumObj.SEXO.id))

      !props.selects[catalogsEnumObj.GENERO.name][0] &&
        (await props.getCatalogs(catalogsEnumObj.GENERO.id))

      !props.selects[catalogsEnumObj.ESTADOCIVIL.name][0] &&
        (await props.getCatalogs(catalogsEnumObj.ESTADOCIVIL.id))

      !props.selects[catalogsEnumObj.CONDICIONLABORAL.name][0] &&
        (await props.getCatalogs(catalogsEnumObj.CONDICIONLABORAL.id))

      setLoading(false)
    }
    loadData()
  }, [])

  const state = useSelector((store) => {
    return {
      miembro: store.miembro,
      errors: store.miembro.errors,
      fields: store.miembro.fields
    }
  })

  useEffect(() => {
    setLoadingOnSave(state.miembro.loading)
  }, [state.miembro.loading])

  useEffect(() => {
    // state.miembro.currentMember.id ? props.authHandler("modificar",sendData) : props.authHandler("crear",sendData)
    if (
      props.selects[catalogsEnumObj.RELACIONESTUDIANTE.name][0] &&
      (state.miembro.currentMember.id ||
        state.miembro.currentMember.identificacion)
    ) {
      loadDataFromState()
    }
    setImage({
      preview:
        state.miembro.currentMember.foto ||
        state.miembro.currentMember.fotografiaUrl
    })
  }, [
    props.selects[catalogsEnumObj.RELACIONESTUDIANTE.name][0],
    state.miembro.currentMember,
    editable
  ])

  useEffect(() => {
    if (memberData.idType?.codigo && !memberData.idIdentidad) {
      if (memberData.idType?.codigo == '01') {
        setDisableFields(true)
      } else {
        setDisableIds(false)
        setDisableFields(false)
      }
    } else if (
      memberData.idIdentidad ||
      memberData.idMiembro ||
      memberData.id
    ) {
      setDisableIds(true)
      setDisableFields(true)
    }
  }, [memberData])

  useEffect(() => {
    setCalledBefore(true)
    if (calledBefore) {
      if (!editable && !memberData.idMiembro && clearfields) {
        clearData()
        setDisableFields(false)
        setEditable(true)
      } else if (!editable && memberData.idMiembro) {
        loadDataFromState()
        memberData.idType?.codigo == '01' && setDisableFields(true)
      }
    }
  }, [editable])

  const getByTSE = (catalogoId) => {
    // catalogoId 1=Tipo de identificacion, 2= Nacionalidad
    if (![1, 2].includes(catalogoId)) return null

    if (
      !state.miembro.currentMember.id === 0 &&
      !state.miembro.currentMember.nombre.toString().length > 0
    ) { return null }

    const catalogo =
      catalogoId === 1 ? props.selects.idTypes : props.selects.nationalities

    const dataItem = catalogo.filter((item) => {
      const itemCodigo = catalogoId === 1 ? '01' : '15'
      return item.codigo == itemCodigo
    })[0]

    return {
      ...dataItem,
      label: dataItem.nombre,
      value: dataItem.id,
      catalogId: catalogoId
    }
  }
  const loadDataFromState = () => {
    const sexoIdFromTSE = state.miembro.currentMember.sexo
    const sexoObj = props.selects.sexoTypes.filter(
      (item) => item.codigo == sexoIdFromTSE
    )[0]
    const discapacidad = props.discapacidades.map((item) => {
      const _item = props.selects.discapacidades.find(
        (element) => element.id == item.elementosCatalogosId
      )
      if (_item) return { ...item, label: _item.nombre, value: _item.id }
      return item
    })

    setMemberData({
      ...memberData,
      ...state.miembro.currentMember,
      sexo: state.miembro.currentMember.datos
        ? mapOption(
          state.miembro.currentMember.datos,
          props.selects,
          catalogsEnumObj.SEXO.id,
          catalogsEnumObj.SEXO.name
        )
        : [1, 2].includes(sexoIdFromTSE)
            ? { ...sexoObj, label: sexoObj.nombre, value: sexoObj.id, catalogId: 3 }
            : null,
      genero: state.miembro.currentMember.datos
        ? mapOption(
          state.miembro.currentMember.datos,
          props.selects,
          catalogsEnumObj.GENERO.id,
          catalogsEnumObj.GENERO.name
        )
        : null,
      escolaridad: state.miembro.currentMember.datos
        ? mapOption(
          state.miembro.currentMember.datos,
          props.selects,
          catalogsEnumObj.ESCOLARIDADES.id,
          catalogsEnumObj.ESCOLARIDADES.name
        )
        : null,
      condicionTrabajo: state.miembro.currentMember.datos
        ? mapOption(
          state.miembro.currentMember.datos,
          props.selects,
          catalogsEnumObj.CONDICIONLABORAL.id,
          catalogsEnumObj.CONDICIONLABORAL.name
        )
        : null,
      discapacidades: discapacidad,
      nationalityId: state.miembro.currentMember.datos
        ? mapOption(
          state.miembro.currentMember.datos,
          props.selects,
          catalogsEnumObj.NATIONALITIES.id,
          catalogsEnumObj.NATIONALITIES.name
        )
        : getByTSE(catalogsEnumObj.NATIONALITIES.id),
      idType: state.miembro.currentMember.datos
        ? mapOption(
          state.miembro.currentMember.datos,
          props.selects,
          catalogsEnumObj.IDENTIFICATION.id,
          catalogsEnumObj.IDENTIFICATION.name
        )
        : getByTSE(catalogsEnumObj.IDENTIFICATION.id),
      relacion: state.miembro.currentMember.datos
        ? mapOption(
          state.miembro.currentMember.datos,
          props.selects,
          catalogsEnumObj.RELACIONESTUDIANTE.id,
          catalogsEnumObj.RELACIONESTUDIANTE.name
        )
        : null,
      fechaNacimiento: state.miembro.currentMember.fechaNacimiento
        ? state.miembro.currentMember.fechaNacimiento.split('T')[0]
        : null,
      idIdentidad:
        state.miembro.currentMember.id ||
        state.miembro.currentMember.idIdentidad,
      identificacion: state.miembro.currentMember.identificacion,
      recursosIdsEncargado:
        (state.miembro.currentMember.recursos &&
          state.miembro.currentMember.recursos.filter(
            (item) => item.elementoCodigo === 1
          )) ||
        [],
      recursosIdsRepresentante:
        (state.miembro.currentMember.recursos &&
          state.miembro.currentMember.recursos.filter(
            (item) => item.elementoCodigo === 2
          )) ||
        []
    })
  }

  const clearData = async (idType = null, nationalityId = null) => {
    await actions.cleanCurrentMember()
    setMemberData({
      sexo: null,
      genero: null,
      escolaridad: null,
      condicionTrabajo: null,
      discapacidad: null,
      nationalityId,
      idType,
      relacion: null,
      fechaNacimiento: null,
      idIdentidad: null,
      identificacion: '',
      recursosIdsEncargado: null,
      recursosIdsRepresentante: null,
      nombre: '',
      primerApellido: '',
      segundoApellido: '',
      conocidoComo: '',
      telefono: '',
      telefonoSecundario: '',
      email: ''
    })
  }

  const handleOpenFiles = (filesArray = []) => {
    setFiles(filesArray)
    setOpenFilesModal(!openFilesModal)
  }

  const handleCloseFiles = () => {
    setFiles([])
    setOpenFilesModal(false)
    setDisplayingModalFiles(null)
  }

  const validateNotOptionalData = (data) => {
    const fields = [
      'relacion',
      'idType',
      'nationalityId',
      'sexo',
      'condicionTrabajo',
      'escolaridad',
      'relacion'
    ]
    let failed
    fields.forEach((field) => {
      if (!data[field]) {
        failed = true
      }
    })
    return failed
  }

  const sendData = async () => {
    const datos = parseOptions(memberData, [
      'sexo',
      'genero',
      'escolaridad',
      'condicionTrabajo',
      'idType',
      'nationalityId',
      'relacion'
    ])

    const respurcesToload = image.raw ? 1 : 0
    const recursosIdsEncargadoL = memberData.recursosIdsEncargado
      ? memberData.recursosIdsEncargado.length
      : 0
    const recursosIdsRepresentanteL = memberData.recursosIdsRepresentante
      ? memberData.recursosIdsRepresentante.length
      : 0

    const valid = !validateNotOptionalData(memberData)

    const data = {
      idMiembro: memberData.idMiembro || 0,
      viveHogar: memberData.viveHogar || false,
      encargado: memberData.encargado || false,
      representanteLegal: memberData.representanteLegal || false,
      emergencia: true,
      relacionId: memberData.relacion && memberData.relacion.value,
      estudianteId: props.identification.data.id,
      autorizado: memberData.autorizado || false,
      dependenciaEconomica: memberData.dependenciaEconomica || false,
      nombre: memberData.nombre,
      primerApellido: memberData.primerApellido,
      segundoApellido: memberData.segundoApellido,
      conocidoComo: memberData.conocidoComo,
      fechaNacimiento: memberData.fechaNacimiento,
      telefono: memberData.telefono || '',
      telefonoSecundario: memberData.telefonoSecundario,
      email: memberData.email || '',
      foto: memberData.foto ? memberData.foto : '',
      identificacion: memberData.identificacion || '',
      idIdentidad: memberData.idIdentidad || 0,
      elementosIds: datos,
      elementosNoRequiridosIds: datos,
      tipoIdentificacionId: memberData.idType && memberData.idType.value,
      nacionalidadId:
        memberData.nationalityId && memberData.nationalityId.value,
      sexoId: memberData.sexo ? memberData.sexo.value : 0,
      condicionLaboralId:
        memberData.condicionTrabajo && memberData.condicionTrabajo.value,
      escolaridadId: memberData.escolaridad && memberData.escolaridad.value,
      parentescoId: memberData.relacion && memberData.relacion.value,
      discapacidades: memberData.discapacidades
    }

    const anios = moment().diff(data.fechaNacimiento, 'years', false)

    if (data.encargado && anios < 18) {
      setSnackbarContent({
        msg: 'El encargado del estudiante no debe ser un menor de edad.',
        variant: 'error'
      })

      handleClick()

      return
    }

    let response
    setItemsToLoad(
      respurcesToload + recursosIdsEncargadoL + recursosIdsRepresentanteL
    )
    if (!data.idMiembro) {
      response = await actions.addMember(data)
      if (!response.error && response.data !== undefined) {
        const miembroId = response.data.idMiembro
        if (memberData.recursosIdsEncargado !== null) {
          for (let j = 0; j < memberData.recursosIdsEncargado.length; j++) {
            const _file = memberData.recursosIdsEncargado[j]
            await actions.updateMemberResources(
              _file,
              miembroId,
              1,
              handleUpload
            )
          }
        }

        if (memberData.recursosIdsRepresentante !== null) {
          for (let m = 0; m < memberData.recursosIdsRepresentante.length; m++) {
            const _file = memberData.recursosIdsRepresentante[m]
            await actions.updateMemberResources(
              _file,
              miembroId,
              2,
              handleUpload
            )
          }
        }
      }
    } else {
      if (image.edited) {
        response = await actions.updateMember(
          valid,
          data,
          image.raw,
          handleUpload
        )
      } else {
        response = await actions.updateMember(valid, data, null, handleUpload)
      }
    }
    if (response.error) {
      setSnackbarContent({
        msg: response.error || 'El contenido no se pudo modificar',
        variant: 'error'
      })
      if (response.error.includes('ya esta relacionado')) {
        setLoadingOnSave(false)
      }
    } else {
      setClearFields(false)
      setSnackbarContent({
        msg: 'Contenido enviado exitosamente',
        variant: 'success'
      })
      setEditable(false)
      setMemberDetailOpen(false)
    }
    handleClick()
  }

  const handleChange = (e, select = '') => {
    let loadData = true
    let _data = {}
    if (e.target && e.target.name === 'identificacion') {
      _data = { ...memberData, identificacion: e.target.value.trim() }
    } else if (select && select !== 'idType') {
      _data = { ...memberData, [select]: e }
    } else if (select === 'idType') {
      if (Array.isArray(e)) {
        clearData(e[1], e[0])
      } else {
        clearData(e)
      }
      loadData = false
    } else {
      _data = {
        ...memberData,
        [e.target.name]: e.target.value
      }
    }
    loadData && setMemberData(_data)
  }

  const handleFile = async (e, encargado = false) => {
    setItemsToLoad(1)

    let file = {}
    if (!memberData.idMiembro) {
      file = e.target.files[0]
    } else {
      file = await actions.updateMemberResources(
        e.target.files[0],
        memberData.idMiembro,
        encargado ? 1 : 2,
        handleUpload
      )
    }

    if (encargado) {
      setMemberData({
        ...memberData,
        recursosIdsEncargado: memberData.recursosIdsEncargado
          ? [...memberData.recursosIdsEncargado, file]
          : [file]
      })
    } else {
      setMemberData({
        ...memberData,
        recursosIdsRepresentante: memberData.recursosIdsRepresentante
          ? [...memberData.recursosIdsRepresentante, file]
          : [file]
      })
    }
  }

  const handleUpload = (progressEvent) => {
    const percentCompleted = Math.round(
      (progressEvent.loaded * 100) / progressEvent.total
    )
    setLoadingProgress(percentCompleted)
    if (percentCompleted === 100 && itemsToLoad <= 1) {
      setLoadingProgress()
    }
    if (percentCompleted === 100 && itemsToLoad > 1) {
      setItemsToLoad(itemsToLoad - 1)
    }
  }

  const handleResourceDelete = async (item) => {
    let response
    let property = ''
    if (!memberData.idMiembro) {
      property = 'name'
    } else {
      response = await actions.deleteMemberResources(item.id)
      response.error ? (property = null) : (property = 'id')
    }

    let _files = []
    if (!property) {
      setSnackbarContent({
        msg: response.message,
        variant: 'error'
      })
      return handleClick()
    }
    if (displayingModalFiles === 'encargado') {
      _files = memberData.recursosIdsEncargado.filter(
        (element) => element[property] !== item[property]
      )
      setMemberData({ ...memberData, recursosIdsEncargado: _files })
    } else {
      _files = memberData.recursosIdsRepresentante.filter(
        (element) => element[property] !== item[property]
      )
      setMemberData({ ...memberData, recursosIdsRepresentante: _files })
    }
    setFiles(_files)
  }

  const handleLoadMember = async (data) => {
    if (data.id || data.estado === false) {
      await props.getDiscapacidades(data.id)
      await props.loadCurrentMember(data) // <--------------------------- EL ERROR SE PRODUCE AQUI
      data.idType?.codigo == '01' && setDisableFields(true)
    } else {
      props.loadCurrentMember(data)
      setDisableFields(false)
    }
  }

  useEffect(() => {
    if (props.miembro.members[0]) {
      const newData = props.miembro.members.map((item) => {
        return {
          ...item,
          img: item.foto || '/assets/img/profile-pic-generic.png',
          autorizado: item.autorizado ? 'Si' : 'No',
          encargado: item.encargadoLegal ? 'Si' : 'No'
        }
      })
      setData(newData)
    } else if (data[0]) {
      setData([])
    }
  }, [props.miembro.members])

  const toggleAddNewModal = (e) => {
    setMemberDetailOpen(true)
    setMemberData({})
    setAddNewModalOpen(!addNewModalOpen)
    setEditable(true)
    setDisableFields(false)
  }

  if (
    (props.miembro.loading || loading) &&
    !memberDetailOpen &&
    !addNewModalOpen
  ) {
    return <Loader />
  }

  const handleSelectViewItem = (member) => {
    props.getDiscapacidades(member.idIdentidad)
    setMemberDetailOpen(true)
    props.loadCurrentMember(member)
    setLoading(!loading)
  }

  return (
    <>
      {memberDetailOpen && (
        <NavigationContainer
          className='cursor-pointer'
          onClick={(e) => {
            setMemberDetailOpen(false)
          }}
        >
          <ArrowBackIosIcon />
          <h4>
            {t('edit_button>regresar', 'REGRESAR')}
          </h4>
        </NavigationContainer>
      )}
      {snackBar(snackbarContent.variant, snackbarContent.msg)}
      {!memberDetailOpen && (
        <Table
          columns={width > 800 ? columns : mobileColumns}
          selectDisplayMode='thumblist'
          data={data}
          actions={tableActions}
          isBreadcrumb={false}
          actionRow={actionRow}
          match={props.match}
          tableName='label.users'
          toggleModal={toggleAddNewModal}
          modalOpen={false}
          editModalOpen={false}
          selectedOrderOption={{ column: 'nombre', label: 'Nombre Completo' }}
          showHeaders={false}
          showHeadersCenter
          modalfooter
          loading={false}
          orderBy={false}
          labelSearch={false}
          totalRegistro={0}
          listView={false}
          dataListView={false}
          imageListView
          customThumbList={width > 800}
          listPageHeading={false}
          handleCardClick={handleSelectViewItem}
          disableSearch
        />
      )}
      {memberDetailOpen && (
        <Miembro
          {...props}
          loading={loading}
          editable={editable}
          clearErrors={clearErrors}
          setEditable={setEditable}
          handleChange={handleChange}
          handleLoadMember={handleLoadMember}
          memberData={memberData}
          disableFields={disableFields}
          image={image}
          setImage={setImage}
          loadingId={loadingId}
          setLoadingId={setLoadingId}
          state={state}
          itemsToLoad={itemsToLoad}
          loadingProgress={loadingProgress}
          disableIds={disableIds}
          handleFile={handleFile}
          openFilesModal={openFilesModal}
          handleOpenFiles={handleOpenFiles}
          setDisplayingModalFiles={setDisplayingModalFiles}
          sendData={sendData}
          authHandler={props.authHandler}
          miembro={state.miembro}
          loadingOnSave={loadingOnSave}
          files={files}
          handleCloseFiles={handleCloseFiles}
          handleResourceDelete={handleResourceDelete}
          setMemberData={setMemberData}
          setDisableIds={setDisableIds}
          actions={actions}
          setLoading={setLoading}
          setDisableFields={setDisableFields}
        />
      )}
    </>
  )
}

const NavigationContainer = styled.span`
  display: flex;
`

const mapStateToProps = (state) => {
  return {
    miembro: state.miembro,
    identification: state.identification,
    selects: state.selects,
    discapacidades: state.apoyos.discapacidadesIdentidad
  }
}

const mapDispatchToProps = {
  getFamilyMembers,
  loadCurrentMember,
  getCatalogs,
  deleteMembers,
  getDiscapacidades
}

export default withAuthorization({
  id: 1,
  Modulo: 'Expediente Estudiantil',
  Apartado: 'Informacion del Hogar',
  Seccion: 'Miembros del hogar'
})(
  withIdentification(
    withRouter(connect(mapStateToProps, mapDispatchToProps)(MiembrosHogar))
  )
)
