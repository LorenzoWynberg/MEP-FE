import React, { FunctionComponent } from 'react'
import { Modal, Container } from 'reactstrap'
import { Layout, PageData } from '../Interfaces.ts'

import styled from 'styled-components'

type Props = {
    currentLayout: Layout;
    parentIsRow: boolean;
    register: any;
    setValue(): void;
    watch(): any;
    currentItem: object;
    errors: object;
    pageData: PageData;
    openLayout: string | number;
};

const ModalLayout: FunctionComponent<Props> = props => {
  const { currentLayout, children, pageData, openLayout } = props

  return (
    <Modal isOpen={openLayout === currentLayout.id} size='lg'>
      <StyledContainer>{children}</StyledContainer>
    </Modal>
  )
}

const StyledContainer = styled(Container)`
    min-height: 450px;
`

export default ModalLayout
