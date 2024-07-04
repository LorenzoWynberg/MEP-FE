import React from 'react'
import styled from 'styled-components'
import { Row, Container } from 'reactstrap'

import AppLayout from '../../../../layout/AppLayout'

import catalogoBreadCrumb from '../../../../constants/catalogoBreadCrumb'
import adminItems from '../../../../constants/adminMenu'

// import RoleList from "../Roles";
import PlantillasCorreo from './PlantillasCorreo'
import Mensajes from './Mensajes'

import HeaderTab from 'components/Tab/Header'
import ContentTab from 'components/Tab/Content'
import CatalogoList from './Catalogos'

/* const ContenedorPrincipal = (props: { active: React.SetStateAction<number>; }) => {
    const [activeTab, setActiveTab] = React.useState<number>(0)
    const [visibleForm, setVisibleForm] = React.useState<boolean>(false);
     */
// const [loading, setLoading] = useState(false)

/* const options: Array<string> = [
        "Catálogos",
        "Plantillas de correo",
        "Mensajes",
    ];
 */

const optionsTab: Array<string> = [
  'Catálogos',
  'Plantillas de correo',
  'Mensajes'
]

const Main = (props) => {
  catalogoBreadCrumb.map((item, idx) => {
    item.active = props.active === idx
    return item
  })

  const [activeTab, setActiveTab] = React.useState<number>(0)

  return (
    <AppLayout items={adminItems}>
      <Container>
        <TitleBread>Gestor de Catálogos</TitleBread>
        <HeaderTab
          options={optionsTab}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
        <Row>
          <ContentTab activeTab={activeTab} numberId={activeTab}>
            {
                            {
                              0: <CatalogoList {...props} />,
                              1: <PlantillasCorreo {...props} />,
                              2: <Mensajes {...props} />
                            }[activeTab]
                        }
          </ContentTab>
        </Row>
      </Container>
    </AppLayout>
  )
}

const TitleBread = styled.h2`
    color: #000;
    margin-bottom: 15px;
`

export default Main
