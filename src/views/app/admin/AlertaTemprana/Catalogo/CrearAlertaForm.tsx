import React from 'react'
import styled from 'styled-components'
import { Row, Col, Input, Button } from 'reactstrap'
import Select from 'react-select'
import { useForm, Controller } from 'react-hook-form'
import StyledMultiSelect from '../../../../../components/styles/StyledMultiSelect'

type IProps = {
    alertsContext: Array<any>,
    alertsDimension: Array<any>,
    alertsResponisble: Array<any>,
    getDimensionsByContext: Function,
    handleCreateAlert: Function,
    editable: boolean,
    handleEditable: Function,
    handleForm: Function
};

const CrearAlertaForm: React.FC<IProps> = (props) => {
  const {
    register,
    errors,
    control,
    getValues,
    setValue,
    reset,
    watch,
    handleSubmit
  } = useForm({ mode: 'onChange' })
  const [selectedLevels, setSelectedLevels] = React.useState<Array<any>>([])
  const [stagedLevelsOptions, setStagedLevelsOptions] = React.useState<Array<any>>([])
  const [isOpenLevels, setIsOpenLevels] = React.useState<boolean>(false)

  const recordatorios : any[] = [{ value: 24, label: '24h' }, { value: 48, label: '48h' }, { value: 72, label: '72h' }]
  const prioridad : any[] = [{ value: 1, label: '1' }, { value: 2, label: '2' }, { value: 3, label: '3' }, { value: 4, label: '4' }]

  React.useEffect(() => {
    const context = watch('contextId')
    if (context) {
      props.getDimensionsByContext(context.id)
    }
  }, [watch('contextId')])

  const onSubmit = (values: any) => {
    props.handleCreateAlert(values, selectedLevels)
  }

  const toggleLevels = (e: React.ChangeEvent<HTMLInputElement>, save: boolean = false) => {
    if (save) {
      setSelectedLevels(stagedLevelsOptions)
    } else {
      setStagedLevelsOptions(selectedLevels)
    }
    setIsOpenLevels(!isOpenLevels)
  }

  const handleChangeLevel = (item) => {
    if (stagedLevelsOptions.includes(item.id)) return setStagedLevelsOptions(stagedLevelsOptions.filter(el => el !== item.id))
    setStagedLevelsOptions([...stagedLevelsOptions, item.id])
  }

  const handleCancel = () => {
    reset()
    setValue('contextId', '')
    setValue('DimensionId', '')
    setValue('recordatorio', '')
    setValue('esCompuesta', '')
    setValue('nivelPrioridad', '')
    props.handleEditable()
  }

  const esCompuesta = watch('esCompuesta')

  return (
    <Content>
      <Card className='bg-white__radius'>
        <CardTitle>Creación de alerta nueva</CardTitle>
        <Form>
          <FormGroup>
            <Label>Nombre de la alerta</Label>
            <Input name='nombre' innerRef={register({ required: true })} readOnly={!props.editable} autoComplete='off' />
            {errors.nombre && <ErrorFeedback>Campo requerido</ErrorFeedback>}
          </FormGroup>
          <Row>
            <Col md={6}>
              <FormGroup>
                <Label>Seleccione el contexto</Label>
                <Controller
                  as={<Select
                    className='react-select'
                    classNamePrefix='react-select'
                    placeholder=''
                    options={props.alertsContext}
                    getOptionLabel={(option: any) => option.nombre}
                    getOptionValue={(option: any) => option.id}
                    isDisabled={!props.editable}
                      />}
                  name='contextId'
                  control={control}
                  rules={{ required: true }}
                />
                {errors.contextId && <ErrorFeedback>Campo requerido</ErrorFeedback>}
              </FormGroup>
            </Col>
            <Col md={6}>
              <Label>Seleccione la dimensión</Label>
              <FormGroup>
                <Controller
                  as={<Select
                    className='react-select'
                    classNamePrefix='react-select'
                    placeholder=''
                    options={props.alertsDimension}
                    getOptionLabel={(option: any) => option.nombre}
                    getOptionValue={(option: any) => option.id}
                    isDisabled={!props.editable}
                      />}
                  name='DimensionId'
                  control={control}
                  rules={{ required: true }}
                />
                {errors.DimensionId && <ErrorFeedback>Campo requerido</ErrorFeedback>}
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <FormRadio>
                <label className='control-label' htmlFor='atencionInmediata'>¿Requiere atención inmediata?<br />
                  <ContentRadios>
                    <GroupRadio>
                        <input
                            type='radio'
                            name='atencionInmediata'
                            id='atencionInmediata-1'
                            value='Sí'
                            ref={register({ required: true })}
                            disabled={!props.editable}
                          />
                        <OptionsLabel>Sí</OptionsLabel>
                      </GroupRadio>

                    <GroupRadio>
                        <input
                            type='radio'
                            name='atencionInmediata'
                            id='atencionInmediata-2'
                            value='No'
                            ref={register({ required: true })}
                            disabled={!props.editable}
                          />
                        <OptionsLabel class='radio'>No</OptionsLabel>
                      </GroupRadio>
                  </ContentRadios>
                </label>
                {errors.atencionInmediata && <ErrorFeedback>Campo requerido</ErrorFeedback>}
              </FormRadio>
            </Col>
            <Col md={6}>
              <ContentRadios>
                <GroupRadio>
                  <RadioLabel>La alerta es compuesta</RadioLabel>
                  <input
                    type='radio'
                    name='esCompuesta'
                    value='Sí'
                    ref={register({ required: false })}
                    disabled={!props.editable}
                  />
                </GroupRadio>
              </ContentRadios>
              {
                                esCompuesta
                                  ? <>
                                    <RadioLabel>Seleccione el nivel de prioridad</RadioLabel>
                                    <Controller
                                      as={<Select
                                        className='react-select'
                                        classNamePrefix='react-select'
                                        placeholder=''
                                        options={prioridad}
                                        isDisabled={!props.editable}
                                        style={{ width: '30%' }}
                                          />}
                                      name='nivelPrioridad'
                                      control={control}
                                      rules={{ required: true }}
                                    />
                                    {errors.nivelPrioridad && <ErrorFeedback>Campo requerido</ErrorFeedback>}
                                  </>
                                  : null
                            }
            </Col>
          </Row>
          <FormGroup>
            <Label>Responsable de recibir la alerta</Label>
            <StyledMultiSelect
              toggle={toggleLevels}
              selectedOptions={selectedLevels}
              isOpen={isOpenLevels}
              editable={props.editable}
              stagedOptions={stagedLevelsOptions}
              options={props.alertsResponisble || []}
              handleChangeItem={handleChangeLevel}
              height='3rem'
            />
          </FormGroup>
          <FormGroup>
            <Label>Descripción</Label>
            <Textarea name='descripcion' ref={register({ required: true })} readOnly={!props.editable} />
            {errors.descripcion && <ErrorFeedback>Campo requerido</ErrorFeedback>}
          </FormGroup>
          <FormGroup>
            <Label>Recordatorio</Label>
            <Controller
              as={<Select
                className='react-select'
                classNamePrefix='react-select'
                placeholder=''
                options={recordatorios}
                isDisabled={!props.editable}
                  />}
              name='recordatorio'
              control={control}
              rules={{ required: true }}
            />
            {errors.recordatorio && <ErrorFeedback>Campo requerido</ErrorFeedback>}
          </FormGroup>
        </Form>
      </Card>
      <FormGroup>
        {
                    !props.editable
                      ? <>
                        <Button onClick={props.handleForm} color='primary' className='mr-2' outline>Cancelar</Button>
                        <Button onClick={props.handleEditable} color='primary'>Editar</Button>
                      </>
                      : <>
                        <Button onClick={handleCancel} color='primary' className='mr-2' outline>Cancelar</Button>
                        <Button onClick={handleSubmit(onSubmit)} color='primary'>Guardar</Button>
                      </>
                }
      </FormGroup>
    </Content>
  )
}

const Content = styled.div`
  
`

const Card = styled.div`
  background: #fff;
  border-radius: calc(0.85rem - 1px);
  box-shadow: 0 1px 15px rgba(0, 0, 0, 0.04), 0 1px 6px rgba(0, 0, 0, 0.04);
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
    position: relative;
`

const ContentRadios = styled.div`
    display: flex;
    align-items: center;
    margin-top: 7px;
`

const GroupRadio = styled.div`
    padding-right: 10px;
`

const OptionsLabel = styled.label`
    padding-left: 8px;
    position: relative;
    top: -2px;
`

const RadioLabel = styled.label`
    padding-right: 8px;
    position: relative;
    top: -3px;
`

const Label = styled.label`
  color: #000;
  display: block;
`

const Textarea = styled.textarea`
    padding: 10px;
    width: 100%;
    border: 1px solid #d7d7d7;
    background-color: #fff;
    outline: 0;
    &:focus {
        background: #fff;
    }
`
const FormRadio = styled.div`
    display: block;
    margin-top: 18px;
    margin-bottom: 15px;
    position: relative;
`

const CustomSelect = styled.select`
    display: block;
    width: 10%;
    padding: 5px;
    border: 1px solid #d7d7d7;
`

const ErrorFeedback = styled.span`
    position: absolute;
    color: #bd0505;
    right: 0;
    font-weight: bold;
    font-size: 10px;
    bottom: -19px;
`

export default CrearAlertaForm
