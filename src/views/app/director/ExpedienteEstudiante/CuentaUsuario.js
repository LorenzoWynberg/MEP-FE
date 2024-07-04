import React, { useState } from 'react'
import HeaderTab from 'Components/Tab/Header'
import ContentTab from 'Components/Tab/Content'
import CuentaCorreo from './CuentaCorreo'
import CuentaSaber from './CuentaSaber'

const CuentaUsuarios = (props) => {
  const [activeTab, setActiveTab] = useState(0)
  const optionsTab = ['Cuenta de correo', 'Cuenta de Saber']
  return (
    <>
      <h4>Cuentas de usuario</h4>
      <br />
      <HeaderTab
        options={optionsTab}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />
      <ContentTab activeTab={activeTab} numberId={activeTab}>
        {activeTab === 0 && <CuentaCorreo />}
        {activeTab === 1 && <CuentaSaber {...props} />}
      </ContentTab>
    </>
  )
}

export default CuentaUsuarios
