import React, { FunctionComponent } from 'react'
import { Tooltip, withStyles } from '@material-ui/core'
import { Label, FormGroup } from 'reactstrap'
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined'
import styled from 'styled-components'
import { Field, Layout } from './Interfaces.ts'

import colors from 'Assets/js/colors'

const HtmlTooltip = withStyles((theme) => ({
  tooltip: {
    backgroundColor: '#fff',
    color: 'rgba(0, 0, 0, 0.87)',
    maxWidth: 220,
    fontSize: theme.typography.pxToRem(12),
    border: `2px solid ${colors.primary}`

  }
}))(Tooltip)

type TooltipLabelProps = {
  field: Field;
};

type TooltipHeaderProps = {
  layout: Layout;
};

type TooltipSimpleProps = {
  element?: Any;
  title: String;
};

export const TooltipSimple: FunctionComponent<TooltipSimpleProps> = (props) => {
  return (
    <>
      {props.title && (
        <HtmlTooltip title={props.title} placement='right'>
          {props.element ? <div>{props.element}</div> : <InfoOutlinedIcon />}
        </HtmlTooltip>
      )}
    </>
  )
}

export const TooltipLabel: FunctionComponent<TooltipLabelProps> = (props) => {
  return (
    <>
      <Label>{props.field.label}</Label>
      {props.field.config && props.field.config.tooltipText && (
        <HtmlTooltip title={props.field.config.tooltipText} placement='right'>
          <StyledInfoOutlinedIcon className='position-absolute' />
        </HtmlTooltip>
      )}
    </>
  )
}

export const TooltipHeader: FunctionComponent<TooltipHeaderProps> = (props) => {
  return (
    <>
      {props.layout.config && (
        <HtmlTooltip title={props.layout.config.tooltipText} placement='right'>
          <StyledInfoOutlinedIcon className='position-absolute' />
        </HtmlTooltip>
      )}
    </>
  )
}

export const StyledFormGroup = styled(FormGroup)`
  width: 100%;
`

const StyledInfoOutlinedIcon = styled(InfoOutlinedIcon)`
  font-size: 1.3rem;
  top: -2px;
  margin-left: 5px;
`
