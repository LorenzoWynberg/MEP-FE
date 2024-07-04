import React from 'react'
import { Col } from 'reactstrap'
import { TooltipSimple } from '../../../utils/tooltip.tsx'

class Container extends React.Component {
  render () {
    const children = React.Children.map(this.props.children, child => {
      // checking isValidElement is the safe way and avoids a typescript error too
      const props = {
        active: this.props.active,
        direction: this.props.direction,
        register: this.props.register,
        setValue: this.props.setValue,
        watch: this.props.watch,
        errors: this.props.errors,
        currentItem: this.props.currentItem,
        pageData: this.props.pageData,
        editable: this.props.editable,
        getValues: this.props.getValues,
        ...child.props
      }
      if (React.isValidElement(child)) {
        return React.cloneElement(child, props)
      }
      return child
    })
    return (
      <Col xs={12} md={this.props.editing ? this.props.field.config.size : (this.props.field.config.size || 6)} className={this.props.field.config.relleno && 'bg-white__radius'}>
        <h4>
          {this.props.field.config.titulo}
          {this.props.field.config.tooltipText?.length > 0
            ? (
              <TooltipSimple title={this.props.field.config.tooltipText} />
              )
            : null}
        </h4>
        <p>
          {this.props.field.config.subtitle}
        </p>
        {children}
      </Col>
    )
  }
}

export default Container
