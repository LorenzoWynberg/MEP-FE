import React from 'react'
import Edit from './Edit'
import View from './View'
import Navigation from './Navigation'
import Themes from './Themes/index'
import withRouter from 'react-router-dom/withRouter'
import Responses from './Responses'

const index = (props) => {
  const renderContent = () => {
    if (props.match.params.formId) {
      return (
        <Edit.Edit
          formId={props.match.params.formId}
          manual={props.match.params.manual}
        />
      )
    }
    switch (props.match.params.section) {
      case 'creator':
        return <Edit.Edit create {...props} />
      case 'editor':
        return <Edit.Edit {...props} />
      case 'list':
        return <View {...props} />
      case 'responses':
        return <Responses {...props} />
      case 'themes':
        return <Themes />
      default:
        return <Navigation {...props} />
    }
  }

  return <div className='dashboard-wrapper'>{renderContent()}</div>
}

export default withRouter(index)
