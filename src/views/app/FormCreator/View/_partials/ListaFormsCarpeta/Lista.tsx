import React, { useEffect, useState } from 'react'
import HTMLTable from 'Components/HTMLTable'
import {
  getForms,
  loadCurrentForm,
  getFormsByCategory
} from '../../../../../../redux/FormCreatorV2/actions'
import { useActions } from 'Hooks/useActions'
import { useSelector } from 'react-redux'
import { Modal, ModalBody, ModalHeader } from 'reactstrap'
import withRouter from 'react-router-dom/withRouter'
import moment from 'moment'
import '../../../../../../assets/css/sass/containerStyles/Carpetas.scss'
import swal from 'sweetalert'

const Lista = (props) => {
  const [modalItem, setModalItem] = useState(null)
  const actions = useActions({
    getForms,
    loadCurrentForm,
    getFormsByCategory
  })
  const state = useSelector((store) => store.creadorFormularios)
  const [forms, setForms] = useState([])
  useEffect(() => {
    actions.getFormsByCategory(props.category)
  }, [])

  const toggleModal = () => {
    setModalItem(null)
  }

  useEffect(() => {
    setForms(
      state.forms.map((el) => {
        return {
          ...el,
          fechaCreacion: moment(el.fechaInsercion).format(
            'DD/MM/YYYY'
          )
        }
      })
    )
  }, [state.forms])

  return (
    <div>
      <span>Detalle de Categoría: {props.categoryName}</span>
      <HTMLTable
        columns={[
				  {
				    column: 'titulo',
				    label: 'Nombre del formulario'
				  },
				  {
				    column: 'cantidadRespuestas',
				    label: 'Formularios completados'
				  },
				  {
				    column: 'estado',
				    label: 'Estado'
				  },
				  {
				    column: 'fechaCreacion',
				    label: 'Fecha de Creación'
				  }
        ]}
        actionRow={[
				  {
				    actionName: 'Editar',
				    actionFunction: (el) => {
				      actions.loadCurrentForm({
				        ...el,
				        formulario: el.autoguardadoFormulario
				      })
				      props.history.push(`/forms/edit/${el.id}`)
				    },
				    actionDisplay: () => true
				  },
				  {
				    actionName: 'Respuestas',
				    actionFunction: (el) => {
				      props.history.push(`/forms/responses/${el.id}`)
				    },
				    actionDisplay: () => true
				  },
				  {
				    actionName: 'Duplicar',
				    actionFunction: (el) => {
				      swal({
				        title: '¿Está seguro que quiere duplicar el formulario?',
				        icon: 'warning',
				        buttons: {
				          ok: {
				            text: 'Aceptar',
				            value: true
				          },
				          cancel: 'Cancelar'
				        }
				      }).then((result) => {
				        if (result) {
				          props.setOpenDuplicated(el.id)
				        }
				      })
				    },
				    actionDisplay: () => true
				  },
				  {
				    actionName: 'Eliminar',
				    actionFunction: (el) => {
				      swal({
				        title: '¿Está seguro que quiere eliminar el formulario y todas las respuestas asociadas?',
				        icon: 'warning',
				        buttons: {
				          ok: {
				            text: 'Aceptar',
				            value: true
				          },
				          cancel: 'Cancelar'
				        }
				      }).then((result) => {
				        if (result) {
				          actions.deleteForm(el.id)
				        }
				      })
				    },
				    actionDisplay: () => true
				  }
        ]}
        data={forms}
        tableName='label.buscador'
        showHeaders
        loading={false}
        toggleEditModal={(el) => {
				  actions.loadCurrentForm({
				    ...el,
				    formulario: el.autoguardadoFormulario
				  })
				  props.history.push(`/forms/edit/${el.id}`)
        }}
        PageHeading={false}
        hideMultipleOptions
        showHeadersCenter={false}
        esBuscador
      />

      <Modal isOpen={Boolean(modalItem)} size='lg' toggle={toggleModal}>
        <ModalHeader toggle={toggleModal}>Versiones</ModalHeader>
        <ModalBody>
          <div>
            {Boolean(modalItem) && (
              <HTMLTable
                columns={[
								  {
								    column: 'tipoGuardado',
								    label: 'Tipo de guardado'
								  },
								  {
								    column: 'fehaModificacion',
								    label: 'Fecha de modificación'
								  },
								  {
								    column: 'horaModificacion',
								    label: 'Hora de modificación'
								  }
                ]}
                selectDisplayMode='datalist'
                data={[
								  {
								    id: 1,
								    itemId: modalItem.id,
								    tipoGuardado: 'Manual',
								    formulario: modalItem.formulario,
								    fehaModificacion: moment(
								      modalItem.fechaActualizacion
								    ).format('DD/MM/YYYY'),
								    horaModificacion: moment(
								      modalItem.fechaActualizacion
								    ).format('HH:mm')
								  },
								  {
								    id: 2,
								    itemId: modalItem.id,
								    tipoGuardado: 'Automático',
								    formulario:
											modalItem.autoguardadoFormulario,
								    fehaModificacion: moment(
								      modalItem.fechaActualizado
								    ).format('DD/MM/YYYY'),
								    horaModificacion: moment(
								      modalItem.fechaActualizado
								    ).format('HH:mm')
								  }
                ]}
                tableName='label.buscador'
                showHeaders
                hidePageSizes
                loading={false}
                toggleEditModal={(el) => {
								  if (el.tipoGuardado === 'Manual') {
								    actions.loadCurrentForm({
								      ...modalItem,
								      id: modalItem.id,
								      formulario: el.formulario
								    })
								    props.history.push(
											`/forms/edit/${el.itemId}`
								    )
								  } else {
								    actions.loadCurrentForm({
								      ...modalItem,
								      id: modalItem.id,
								      formulario: el.formulario
								    })
								    props.history.push(
											`/forms/edit/${el.itemId}`
								    )
								  }
                }}
                PageHeading={false}
                hideMultipleOptions
                showHeadersCenter={false}
              />
            )}
          </div>
        </ModalBody>
      </Modal>
    </div>
  )
}

export default withRouter(Lista)
