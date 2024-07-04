import React from 'react'
import { injectIntl } from 'react-intl'

const FinalizarSolicitud = (props) => {
  const { nombre, telefono, correo, codigoCentro, centro } =
    props.director?.director || {}

  return (
    <>
      {props.modalConfirmacion == 'modalInfo'
        ? (
          <div>
            <p>{props.intl.messages['traslado.confirmMessage']}</p>
            {nombre
              ? (
                <p className='studentInfo'>
                  Director: <span>{nombre}</span>
                  <br />
                  Teléfono: <span>{telefono}</span>
                  <br />
                  Correo electrónico: <span>{correo}</span>
                  <br />
                  Centro educativo: <span>{`${codigoCentro} - ${centro}`}</span>
                </p>
                )
              : (
                <p style={{ textAlign: 'center' }}>Información no disponible</p>
                )}
          </div>
          )
        : (
          <div>
            <p>El traslado del estudiante se ha realizado con éxito</p>
          </div>
          )}
    </>
  )
}

export default injectIntl(FinalizarSolicitud)
