import React from 'react'
import PropTypes from 'prop-types'

import {
  Row,
  TabContent,
  TabPane,
  Container
} from 'reactstrap'

const TabContainer = (props) => {
  const { children, activeTab, numberId } = props
  return (
    <Container>
      <Row className='mt-2'>
        <TabContent activeTab={activeTab} style={{ width: '100%' }}>
          <TabPane tabId={numberId}>
            {children}
          </TabPane>
        </TabContent>
      </Row>
    </Container>
  )
}
TabContainer.propTypes = {
  activeTab: PropTypes.number,
  numberId: PropTypes.number
}
TabContainer.defaultProps = {
  activeTab: 0,
  numberId: 0
}
export default TabContainer
