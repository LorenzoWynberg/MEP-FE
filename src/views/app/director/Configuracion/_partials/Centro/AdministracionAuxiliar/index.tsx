import React from 'react'
import styled from 'styled-components'
import { useSelector } from 'react-redux'

import JuntasEducacion from './JuntasEducacion'
import CentrosPrivados from './CentrosPrivados'

type IState = {
    configuracion: any
}

const AdministracionAuxiliar = (props: any) => {
  const { currentInstitution } = useSelector((state: IState) => state.configuracion)
  const { hasEditAccess = true, hasAddAccess = true } = props

  return (
    <Wrapper>
      {
                !currentInstitution.esPrivado
                  ? <JuntasEducacion
                      {...props}
                      hasEditAccess={hasEditAccess}
                      hasAddAccess={hasAddAccess}
                    />
                  : <CentrosPrivados {...props} />
            }
    </Wrapper>
  )
}

const Wrapper = styled.div`
    background: transparent;
`

export default AdministracionAuxiliar
