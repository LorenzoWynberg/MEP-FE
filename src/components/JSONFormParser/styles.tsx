import React, { FunctionComponent } from 'react'
import { Tooltip, withStyles } from '@material-ui/core'
import { Label, FormGroup } from 'reactstrap'
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined'
import styled from 'styled-components'
import { Field, Layout } from './Interfaces.ts'

import colors from 'Assets/js/colors'
import { useTranslation } from 'react-i18next'

export const HtmlTooltip = withStyles((theme) => ({
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
    title: boolean;
};

type TooltipHeaderProps = {
    layout: Layout;
};

export const TooltipLabel: FunctionComponent<TooltipLabelProps> = props => {
  const { t } = useTranslation()
  return (
    <>
      {props.title
        ? <h3>{t(props.field.langKey || '', props.field.label)}</h3>
        : <Label style={props.field.style}>{t(props.field.langKey || '', props.field.label)} {props.field.config.required ? '*' : ''}{props.field.config && props.field.config.tooltipText && (
          <HtmlTooltip title={props.field.config.tooltipText} placement='right' className='position-absolute'>
            <StyledInfoOutlinedIcon />
          </HtmlTooltip>
        )}
          </Label>}

    </>
  )
}

export const TooltipHeader: FunctionComponent<TooltipHeaderProps> = props => {
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
    font-size: 1.2rem;
    margin-left: 5px;
`
