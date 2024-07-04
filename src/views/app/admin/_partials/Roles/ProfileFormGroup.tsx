import React, { useState } from 'react'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import { Checkbox, FormGroup } from '@material-ui/core'
import styled from 'styled-components'
import { accessRoles } from './profilesAccess.ts'
import Loader from 'Components/Loader'

export const ProfileFormGroup = (props) => {
  const [loading, setLoading] = useState(false)
  return (
    <>
      {loading && <Loader formLoader />}
      <StyledFormGroup>
        {accessRoles(props.sectionName).map((name) => {
          return (
            <FormControlLabel
              color='primary'
              control={
                <Checkbox
                  color='primary'
                  checked={props.data[props.sectionName] ? props.data[props.sectionName][name] : false}
                  disabled={loading}
                  name={`${name}_${props.sectionName}`}
                  onClick={async () => {
                    setLoading(true)
                    const response = await props.updateRole(props.currentRole.id, props.perfil.id, { ...props.data[props.sectionName], perfilId: props.perfil.id, [name]: !props.data[props.sectionName][name] })
                    if (!response.data.error) {
                      props.handleChange({ nombre: props.sectionName }, name)
                    }
                    setLoading(false)
                  }}
                />
                    }
              label={name.toUpperCase()}
            />
          )
        })}
      </StyledFormGroup>
    </>
  )
}

const StyledFormGroup = styled(FormGroup)`
    display: flex;
    flex-direction: row !important;
`
