import React from 'react'
import colors from 'Assets/js/colors'
import moment from 'moment'

const OutOfTime = (props) => {
  return (
    <div style={{ backgroundColor: colors.primary, width: '100vw', height: '100vh', position: 'relative' }}>
      <div style={{ height: '5rem', width: '100%', backgroundColor: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingLeft: '3rem', paddingRight: '3rem' }}>
        <img src='/assets/img/LogoMep.jpg' style={{ width: '5rem' }} />
        <img src='/assets/img/saber-logo-nocaption.svg' style={{ height: '2rem' }} />
      </div>
      <div style={{ backgroundColor: 'white', borderRadius: '15px', padding: '2rem', width: 'fit-content', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', position: 'absolute', left: '40%', top: '29%' }}>
        <h5 style={{ width: '100%', fontWeight: 'bold' }}>
          Formulario no disponible
        </h5>
        <br />
        {moment().isBefore(moment(props.fomrConfig.fechaHoraInicio))
          ? <p>
            El formulario al que está tratando de ingresar aún no está
            <br />
            disponible. La fecha de disponibilidad del mismo es:
            <br />
            <br />
            Inicio: {moment(props.fomrConfig.fechaHoraInicio).format('DD/MM/YYYY - hh:mm A')}hs
            <br />
            Finalización: {moment(props.fomrConfig.fechaHoraFin).format('DD/MM/YYYY - hh:mm A')}hs
            <br />
            <br />
            Si tiene alguna duda por favor contacte al administrador del formulario:
            <br />
            <br />
            {props.fomrConfig.contactoCorreo && `Nombre: ${props.fomrConfig.contactoNombre} Correo: ${props.fomrConfig.contactoCorreo}`}

            </p>
          : <p>
            El formulario al que está tratando de ingresar ya ha finalizado.
            <br />
            La fecha y hora de cierre del mismo fue:
            <br />
            <br />
            Fecha: {moment(props.fomrConfig.fechaHoraFin).format('DD/MM/YYYY')}
            <br />
            Hora: {moment(props.fomrConfig.fechaHoraFin).format('hh:mm A')}hs
            <br />
            <br />
            Si tiene alguna duda por favor contacte al administrador del formulario:
            <br />
            <br />
            {props.fomrConfig.contactoCorreo && `Nombre: ${props.fomrConfig.contactoNombre} Correo: ${props.fomrConfig.contactoCorreo}`}
            </p>}
      </div>
    </div>
  )
}

export default OutOfTime
