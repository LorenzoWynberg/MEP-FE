import React, { useState } from 'react'
import HeaderTab from 'Components/Tab/Header'
import ContentTab from 'Components/Tab/Content'

import SocioeconomicoForm from './_partials/hogar/OtrosDatos'
import MiembrosHogar from './_partials/hogar/MiembrosHogar'

const Hogar = (props) => {
  const [activeTab, setActiveTab] = useState(0)

  const optionsTab = [
    'Otros datos del estudiante',
    'Miembros del hogar'
  ]

  return (
    <>
      <h4>Información del hogar</h4>
      <HeaderTab options={optionsTab} activeTab={activeTab} setActiveTab={setActiveTab} />
      <ContentTab activeTab={activeTab} numberId={activeTab}>
        {
                        {
                          0: <SocioeconomicoForm />,
                          1: <MiembrosHogar />
                        }[activeTab]
                    }

      </ContentTab>
    </>
  )
}

export default Hogar
