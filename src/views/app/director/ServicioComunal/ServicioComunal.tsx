import React, { useEffect, useState, useMemo } from 'react'
import styled from 'styled-components'
import AppLayout from 'Layout/AppLayout'
import directorItems from 'Constants/directorMenu'
import { Row, Col, ModalBody, ModalHeader, Modal, Input as ReactstrapInput } from 'reactstrap'
import colors from '../../../../assets/js/colors'
import withRouter from 'react-router-dom/withRouter'
import Grid from '@material-ui/core/Grid'
import { Checkbox } from '@material-ui/core'
import StyledMultiSelect from '../../../../components/styles/StyledMultiSelect'
import { GetResponseByInstitutionAndFormName } from '../../../../redux/formularioCentroResponse/actions'
import NavigationContainer from '../../../../components/NavigationContainer'
import axios from 'axios'
import { envVariables } from 'Constants/enviroment'
import { useTranslation } from 'react-i18next'
import Tooltip from '@mui/material/Tooltip'
import { IoEyeSharp } from 'react-icons/io5'
import BarLoader from 'Components/barLoader/barLoader'

type IProps = {}

type IState = {
	expedienteCentro: any
}


export const ServicioComunal: React.FC<IProps> = (props) => {
  const { t } = useTranslation()
  const [locationForm, setLocationForm] = React.useState({})
  const [data, setData] = React.useState([])
  const [total, setTotal] = React.useState([])
  const [currentExtentions, setCurrentExtentions] = React.useState()
  const [search, setSearch] = React.useState(null)
  const [showMap, setShowMap] = React.useState(false)
  const [institutionImage, setInstitutionImage] = React.useState(null)
  const [loading, setLoading] = React.useState<boolean>(false)
  // const actions = useActions({
  
  // })

  return (
    <AppLayout items={directorItems}>
      {loading && <BarLoader />}
      <NavigationContainer
        goBack={() => {
				  props.history.push('/director/buscador/centro')
        }}
      />
      <Wrapper>
        <Title>
          {t(
					  'buscador_ce>ver_centro',
					  'Servicio Comunal'
          )}
        </Title>
        <Row>
          <Col sm={12}>
          <Card className='bg-white__radius'>
        <CardTitle>
          {t(
					  'buscador_ce>ver_centro>centro_educativo',
					  'Servicio Comunal'
          )}
        </CardTitle>
        <Form>
          <FormGroup>
            <Label>
              {t(
							  'buscador_ce>ver_centro>centro_educativo>nombre',
							  'Nombre oficial'
              )}
            </Label>
            <Input
              name='i'
              value={ ''}
              readOnly
            />
          </FormGroup>
          <Row>
            <Col
              md={5}
              className='d-flex align-items-center justify-content-center'
            >
              <Avatar
                src={
									institutionImage ||
									'/assets/img/centro-educativo.png'
								}
                alt='Profile picture'
              />
            </Col>
            <Col md={7}>
              <FormGroup>
                <Label>
                  {t(
									  'buscador_ce>ver_centro>centro_educativo>codigo',
									  'Código'
                  )}
                </Label>
                <Input
                  name='codigo'
                  value={
										 ''
									}
                  readOnly
                />
              </FormGroup>
              <FormGroup>
                <Label>
                  {t(
									  'buscador_ce>ver_centro>centro_educativo>tipo_institucion',
									  'Tipo de institución'
                  )}
                </Label>
                <Input
                  name='tipo_centro'
                  value={''}
                  readOnly
                />
              </FormGroup>
              <FormGroup>
                <Label>
                  {t(
									  'buscador_ce>ver_centro>centro_educativo>estado_centro',
									  'Estado del centro educativo'
                  )}
                </Label>
                <Input
                  name='estado_centro'
                  value={
										 ''
									}
                  readOnly
                />
              </FormGroup>
            </Col>
          </Row>
          <FormGroup>
            <Label>
              {t(
							  'buscador_ce>ver_centro>centro_educativo>conocido_como',
							  'Conocido como'
              )}
            </Label>
            <Input
              name='conocidoComo'
              value={ ''}
              autoComplete='off'
              readOnly
            />
          </FormGroup>
          <FormGroup>
            <Label>
              {t(
							  'buscador_ce>ver_centro>centro_educativo>fecha_fundacion',
							  'Fecha de fundación'
              )}
            </Label>
            <Input
              name='fundacion'
              autoComplete='off'
              value={''}
              readOnly
              style={{ width: '30%' }}
            />
          </FormGroup>
          <FormGroup>
            <Label>
              {t(
							  'buscador_ce>ver_centro>centro_educativo>categorias',
							  'Categorías vinculadas a la institución'
              )}
            </Label>
            <StyledMultiSelect
              options={[]}
              selectedOptions={[]}
              editable={false}
            />
          </FormGroup>
        </Form>
      </Card>
          </Col>
        
          
        </Row>
      </Wrapper>
    </AppLayout>
  )
}

const Wrapper = styled.div``

const Title = styled.h3`
	color: #000;
	margin: 5px 3px 25px;
`

const StyledTable = styled.table`
	border-spacing: 1.8rem;
	width: 100%;
`

const Card = styled.div`
	background: #fff;
	position: relative;
`

const CardTitle = styled.h5`
	color: #000;
	margin-bottom: 10px;
`

const Form = styled.form`
	margin-bottom: 20px;
`

const FormGroup = styled.div`
	margin-bottom: 10px;
`

const Label = styled.label`
	color: #000;
	display: block;
`

const MapContainer = styled(Grid)`
	@media (max-width: 870px) {
		height: 29rem;
	}
`

const Input = styled(ReactstrapInput)`
	padding: 10px;
	width: 100%;
	border: 1px solid #d7d7d7;
	background-color: #e9ecef;
	outline: 0;
	&:focus {
		background: #fff;
	}
`

const Avatar = styled.img`
	width: 120px;
	height: 120px;
	border-radius: 50%;
`

const CardLink = styled.a`
	color: ${colors.primary};
`

const SectionTable = styled.div`
	margin-top: 20px;
`

export default withRouter(ServicioComunal)
