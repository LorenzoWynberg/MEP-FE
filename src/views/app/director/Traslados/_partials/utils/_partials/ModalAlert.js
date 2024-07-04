import React from 'react'
import SimpleModal from 'Components/Modal/simple'

const ModalAlert = (props) => {
  const { estudiante, openModalAlert, validadorTraslado, closeModalAlert } =
    props

  const getOfertaFull = () => {
    return estudiante?.oferta
      ? `${estudiante?.oferta}${
          estudiante?.modalidad ? '/' + estudiante?.modalidad : ''
        }${estudiante?.servicio ? '/' + estudiante?.servicio : ''}${
          estudiante?.especialidad ? '/' + estudiante?.especialidad : ''
        }`
      : ''
  }

  return (
    <SimpleModal
      openDialog={openModalAlert}
      onClose={() => closeModalAlert()}
      title='No se puede continuar con la solicitud'
      btnCancel={false}
      icon
      textoAceptar='Aceptar'
      onConfirm={() => closeModalAlert()}
    >
      <div>
        <p>
          Usted ha iniciado el proceso de solicitud de traslado del estudiante:
        </p>
        <br />
        <p className='studentInfo'>
          Identificación: <span>{estudiante?.identificacion}</span>
          <br />
          Nombre completo: <span>{estudiante?.nombre}</span>
          <br />
          Centro educativo: <span>{estudiante?.centro}</span>
          <br />
          Oferta educativa: <span>{getOfertaFull()}</span>
          <br />
          Nivel: <span>{estudiante?.nivel}</span>
        </p>
        <br />
        <p>
          El sistema registra la siguiente condición, que NO permite proceder
          con el traslado:
        </p>
        <br />
        <p className='studentInfo'>
          <ul>
            {validadorTraslado.inactivo
              ? (
                <li>
                  {' '}
                  Estado del estudiante: <span>Inactivo</span>
                </li>
                )
              : null}
            {validadorTraslado.fallecido
              ? (
                <li>
                  {' '}
                  Fallecido: <span>Si</span>
                </li>
                )
              : null}
            {validadorTraslado.condicion
              ? (
                <li>
                  {' '}
                  Condición: <span>Excluido</span>
                </li>
                )
              : null}
            {validadorTraslado.condicionFinal
              ? (
                <li>
                  {' '}
                  Condición final: <span>Aplazado</span>
                </li>
                )
              : null}
            {validadorTraslado.conSolicitud
              ? (
                <li>
                  {' '}
                  Posee una solicitud de traslado: <span>Pendiente</span>
                </li>
                )
              : null}
          </ul>
        </p>
        <br />
        <br />
        <br />
      </div>
    </SimpleModal>
  )
}

export default ModalAlert
