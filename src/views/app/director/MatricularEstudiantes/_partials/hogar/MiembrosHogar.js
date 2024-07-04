import React, { useState, useEffect } from 'react'
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
} from '../../../../../../redux/miembros/actions'
import { connect, useSelector } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { getCatalogs } from '../../../../../../redux/selects/actions'
import { catalogsEnumObj } from '../../../../../../utils/catalogsEnum'
import styled from 'styled-components'
import Loader from '../../../../../../components/Loader'
import { useWindowSize } from 'react-use'
import { withIdentification } from '../../../../../../Hoc/Identification'
import { useForm } from 'react-hook-form'
import useNotification from '../../../../../../hooks/useNotification'
import { useActions } from '../../../../../../hooks/useActions'
import { mapOption, parseOptions } from '../../../../../../utils/mapeoCatalogos'
import { Modal, ModalBody, Button, Row, Col, ModalHeader } from 'reactstrap'
import ConfirmModal from '../../../../../../components/common/ConfirmModal'

import { getDiscapacidades } from '../../../../../../redux/apoyos/actions'
import Grid from '@material-ui/core/Grid'
import { makeStyles } from '@material-ui/core/styles'
import ModalRegistrarPersona from '../../ModalRegistrarPersona'
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline'
import HTMLTable from '../../../../../../components/HTMLTable'
import moment from 'moment'
import { useTranslation } from 'react-i18next'

const MiembrosHogar = (props) => {
  const { t } = useTranslation()
  const imageInitialState = { preview: '', raw: '', edited: false }
  const { register, control, handleSubmit, reset, setValue } = useForm()
  const [memberDetailOpen, setMemberDetailOpen] = useState(false)
  const [registarPersona, setRegistrarPersona] = useState(false)
  const [warningRegistrarPersona, setWarningRegistrarPersona] = useState(false)
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

  const [dataEliminar, setDataEliminar] = useState(null)
  const [confirmModalOpen, setConfirmModalOpen] = useState(false)

  const [snackBar, handleClick] = useNotification()
  const classes = useStyles()

  const actions = useActions({
    cleanCurrentMember,
    addMember,
    updateMember,
    getFamilyMember,
    updateMemberResources,
    deleteMemberResources
  })

  const columns = [

    { column: 'nombreCompleto', label: 'Nombre Completo', width: 20 },
    { column: 'parentesco', label: <>Relación con el <br /> estudiante</>, width: 20 },
    { column: 'encargado', label: 'Encargado', width: 20 },
    { column: 'autorizado', label: 'Representante Legal', width: 20 },
    { column: 'telefono', label: 'Teléfono', width: 20 }
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
        setDataEliminar(e)
        setConfirmModalOpen(true)
      }
    }
  ]

  const actionRow = [
    {
      actionName: 'button.remove',
      actionFunction: (e) => {
        setDataEliminar([e.id])
        setConfirmModalOpen(true)
      },
      actionDisplay: () => true
    },
    {
      actionName: 'label.edit',
      actionFunction: (e) => {
        // setEditable(true)
        setMemberDetailOpen(true)
        props.loadCurrentMember(e)
        setLoading(true)
      },
      actionDisplay: () => true
    }
  ]

  const confirmarEliminar = async (data) => {
    setConfirmModalOpen(false)
    await props.deleteMembers(dataEliminar)
    setDataEliminar(null)
  }

  const closeConfirmModal = () => {
    setConfirmModalOpen(false)
    setDataEliminar(null)
  }

  useEffect(() => {
    const loadData = async () => {
      await props.getFamilyMembers(props.data.id)
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
    if (memberData.idIdentidad && memberData.idMiembro) {
      if (memberData.idType?.codigo == '01') {
        setDisableFields(true)
      } else {
        setDisableFields(false)
        setDisableIds(true)
      }
    } else {
      setDisableIds(false)
    }
  }, [memberData])

  useEffect(() => {
    if (!editable && !memberData.idMiembro && clearfields) {
      clearData()
      setDisableFields(false)
      setEditable(true)
    } else if (!editable && memberData.idMiembro) {
      loadDataFromState()
      memberData.idType?.codigo == '01' && setDisableFields(true)
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
      'nationalityId'
      // 'sexo',
      // 'condicionTrabajo',
      // 'escolaridad',
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
    if (memberData.idIdentidad === null || memberData.idIdentidad === 0) {
      setSnackbarContent({
        msg: 'La identificación ingresada no existe.',
        variant: 'error'
      })

      handleClick()

      return
    }

    if (memberData.identificacion && memberData.identificacion !== '') {
      if (memberData.identificacion === props.data.identificacion) {
        setSnackbarContent({
          msg: 'El estudiante no puede ser encardado de sí mismo.',
          variant: 'error'
        })

        handleClick()

        return
      }
    }
    const datos = parseOptions(memberData, [

      'genero'
    //  'idType',
      // 'nationalityId',
      // 'relacion',
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
      encargado: memberData.encargado,
      representanteLegal: memberData.representanteLegal,
      emergencia: true,
      relacionId: memberData.relacion && memberData.relacion.value,
      estudianteId: props.data.id,
      nombre: memberData.nombre,
      primerApellido: memberData.primerApellido,
      segundoApellido: memberData.segundoApellido,
      conocidoComo: memberData.conocidoComo,
      fechaNacimiento: memberData.fechaNacimiento,
      telefono: memberData.telefono,
      telefonoSecundario: memberData.telefonoSecundario,
      email: memberData.email,
      foto: memberData.foto ? memberData.foto : '',
      identificacion: memberData.identificacion || '',
      idIdentidad: memberData.idIdentidad || 0,
      elementosIds: datos,
      elementosNoRequiridosIds: datos,
      tipoIdentificacionId: memberData.idType && memberData.idType.value,
      nacionalidadId:
        memberData.nationalityId && memberData.nationalityId.value,
      sexoId: memberData.sexo === undefined ? 0 : memberData.sexo.value ? memberData.sexo.value : 0,
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

    if (!data.idMiembro) {
      if (response.error) {
        setSnackbarContent({
          msg: 'Ha ocurrido un error al guardar el registro. Debe completar la información obligatoria.',
          variant: 'error'
        })
        if (response.error.includes('ya esta relacionado')) {
          setLoadingOnSave(false)
        }
      } else {
        setClearFields(false)
        setSnackbarContent({
          msg: 'El contenido se ha enviado exitosamente',
          variant: 'success'
        })
        setEditable(false)
        setMemberDetailOpen(false)
        props.toggleNavigationStep()
      }
      handleClick()
    } else {
      if (response.error) {
        setSnackbarContent({
          msg: 'Ha ocurrido un error al modificar el registro. Debe completar la información obligatoria.',
          variant: 'error'
        })
        if (response.error.includes('ya esta relacionado')) {
          setLoadingOnSave(false)
        }
      } else {
        setClearFields(false)
        setSnackbarContent({
          msg: 'El contenido se ha enviado exitosamente',
          variant: 'success'
        })
        setEditable(false)
        setMemberDetailOpen(false)
        props.toggleNavigationStep()
      }
      handleClick()
    }
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
  /*  if (data.id || data.estado === false) {
      await props.getDiscapacidades(data.id)
      await props.loadCurrentMember(data)
      data.idType?.codigo == '01' && setDisableFields(true)
    } else {
      props.loadCurrentMember(data)
      setDisableFields(false)
    } */

    if (data === null) {
      setWarningRegistrarPersona(true) // Se muestra modal para crear identidad
    } else {
      if (data.id || data.estado === false) {
        await props.getDiscapacidades(data.id)
        await props.loadCurrentMember(data)
        data.idType?.codigo == '01' && setDisableFields(true)
      } else {
        props.loadCurrentMember(data)
        setDisableFields(false)
      }
    }
  }

  useEffect(() => {
    if (props.miembro.members[0]) {
      const newData = props.miembro.members.map((item) => {
        return {
          ...item,
          img: item.foto || '/assets/img/profile-pic-generic.png',
          autorizado: item.encargadoLegal ? 'Si' : 'No',
          encargado: item.encargado ? 'Si' : 'No',
          nombreCompleto:
            item.nombre +
            ' ' +
            item.primerApellido +
            ' ' +
            item.segundoApellido,
          telefono: item.telefono
        }
      })
      setData(newData)
    } else if (data[0]) {
      setData([])
    }
  }, [props.miembro.members])

  const toggleAddNewModal = (e) => {
    setMemberDetailOpen(true)
    props.toggleNavigationStep()
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
    props.toggleNavigationStep()
    props.loadCurrentMember(member)
    setLoading(!loading)
  }
  const onCancel = (canceled) => {
    setMemberDetailOpen(canceled)
  }

  const onRegistrarPersona = async (data) => {
    setRegistrarPersona(false)

    await props.getDiscapacidades(data.id)
    await props.loadCurrentMember(data)
    /*  props.history.push(
          `/director/matricular-estudiantes/${data.identificacion}`,
        ) */
  }

  return (
    <Grid container className={classes.root}>
      <div>
        <h3>
          {t('estudiantes>matricula_estudiantil>matricular_estudiante>encargados>info_encargado', 'Información del encargado')}
        </h3>

      </div>

      <Grid item md={12} xs={12} spacing={1}>
        {snackBar(snackbarContent.variant, snackbarContent.msg)}
        {!memberDetailOpen && (
          <HTMLTable
            columns={width > 800 ? columns : mobileColumns}
            selectDisplayMode='datalist'
            data={data}
            actions={tableActions}
            isBreadcrumb={false}
            actionRow={actionRow}
            match={props.match}
            tableName='menu.matricula'
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
            dataListView
            imageListView={false}

            listPageHeading={false}
            handleCardClick={handleSelectViewItem}
            disableSearch
            fromMatricula
          />
        )}
        {memberDetailOpen && (
          <Miembro
            {...props}
            loading={loading}
            editable={editable}
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
            loadingOnSave={loadingOnSave}
            files={files}
            handleCloseFiles={handleCloseFiles}
            handleResourceDelete={handleResourceDelete}
            setMemberData={setMemberData}
            actions={actions}
            setLoading={setLoading}
            setDisableFields={setDisableFields}
            onCancelBtn={onCancel}
            toggleNavigationStep={props.toggleNavigationStep}
          />
        )}
      </Grid>

      {confirmModalOpen && (
        <ConfirmModal
          openDialog={confirmModalOpen}
          msg='¿Está seguro que desea eliminar el registro seleccionado?'
          title='Confirmación de eliminación'
          onClose={closeConfirmModal}
          onConfirm={confirmarEliminar}
        />
      )}

      <ModalRegistrarPersona
        open={registarPersona}
        onClose={setRegistrarPersona}
        onRegistrarPersona={onRegistrarPersona}
        encargado
      />

      <Modal isOpen={warningRegistrarPersona}>
        <ModalHeader toggle={() => { setWarningRegistrarPersona(false) }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>  <ErrorOutlineIcon />{' '}Identificación no encontrada </div>
        </ModalHeader>
        <ModalBody>
          <div className='container-success-modal'>

            <p>No se ha encontrado el número de identificación proporcionado, verifique que el número sea el correcto.</p>
            <p>Si el número de identificación está correcto, posiblemente esta persona no se encuentra registrada en el sistema, si desea registrarla:</p>
          </div>
          <Row>
            <CenteredRow xs='12'>
              <Button
                onClick={() => {
                  setWarningRegistrarPersona(false)
                }}
                color='primary'
                outline
              >
                Cancelar
              </Button>
              <Button
                style={{ marginLeft: 20 }}
                color='primary'
                onClick={() => {
                  setWarningRegistrarPersona(false)
                  setRegistrarPersona(true)
                }}
              >
                Registrar
              </Button>
            </CenteredRow>
          </Row>
        </ModalBody>
      </Modal>
    </Grid>
  )
}

const CenteredRow = styled(Col)`
  display: flex;
  justify-content: center;
  align-items: center;
`

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    '& > *': {}
  }
}))

const mapStateToProps = (state) => {
  return {
    miembro: state.miembro,
    identification: state.matricula,
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

export default withIdentification(
  withRouter(connect(mapStateToProps, mapDispatchToProps)(MiembrosHogar))
)
