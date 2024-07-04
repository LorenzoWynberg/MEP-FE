import React, { Component } from 'react'
import {
  Card,
  CardBody,
  CustomInput,
  Table
} from 'reactstrap'
import { Wizard, Steps, Step } from 'react-albus'
import { injectIntl } from 'react-intl'
import { BottomNavigation } from '../../components/wizard/BottomNavigation'
import { TopNavigation } from '../../components/wizard/TopNavigation'
import { Formik } from 'formik'
import InputWrapper from '../../components/wrappers/InputWrapper'
import AddNewModal from '../pages/AddNewModal'
import CustomTable from '../../components/table/CustomTable'
import { NavLink } from 'react-router-dom'

const getInstitutionData = (institution, offer) =>
  new Promise((resolve, reject) =>
    resolve({
      data: [
        {
          offer: 'preescolar',
          level: 'kinder',
          quantity: {
            registered: 15,
            total: 40,
            male: 15,
            female: 25
          },
          students: [
            {
              _id: 1,
              id: 'jajsd',
              idType: 'cedula',
              name: 'juan',
              lastName1: 'perez',
              lastName2: 'perez',
              birthDate: '04/09/2001',
              edLvl: 'med',
              year: 3,
              nationality: 'venezuelan',
              gender: 'M',
              refugee: false,
              repeating: false
            },
            {
              _id: 1,
              id: 'jajsd',
              idType: 'cedula',
              name: 'pablo',
              lastName1: 'perez',
              lastName2: 'perez',
              birthDate: '04/09/2001',
              edLvl: 'med',
              year: 5,
              nationality: 'venezuelan',
              gender: 'M',
              refugee: false,
              repeating: false
            }
          ]
        }
      ]
    })
  )

class Validation extends Component {
  constructor (props) {
    super(props)
    this.onClickNext = this.onClickNext.bind(this)
    this.onClickPrev = this.onClickPrev.bind(this)
    this.toggleModal = this.toggleModal.bind(this)

    this.form0 = React.createRef()
    this.form1 = React.createRef()
    this.form2 = React.createRef()

    this.state = {
      bottomNavHidden: false,
      topNavDisabled: false,
      loadRequest: false,
      fields: [
        {
          valid: false,
          name: 'confirmation',
          value: ''
        },
        {
          valid: false,
          name: 'email',
          value: ''
        },
        {
          valid: false,
          name: 'password',
          value: ''
        }
      ],
      registerd: false,
      veracity: false,
      isPossible: null,
      report: false,
      isOpen: false,
      isOpenEditModal: false,
      item: {},
      currentOffer: {}
    }
  }

  async componentDidMount () {
    this.setState({
      fields: [
        { ...this.state.fields[0], form: this.form0 },
        { ...this.state.fields[1], form: this.form1 },
        { ...this.state.fields[2], form: this.form2 }
      ]
    })
    const response = await getInstitutionData()
    this.setState({ ...this.state, items: response.data })
  }

  hideNavigation () {
    this.setState({ bottomNavHidden: true, topNavDisabled: true })
  }

  asyncLoading () {
    this.setState({ loading: true })
    setTimeout(() => {
      this.setState({ loading: false })
    }, 3000)
  }

  onClickNext (goToNext, steps, step) {
    if (steps.length - 1 <= steps.indexOf(step)) {
      return
    }
    const formIndex = steps.indexOf(step)
    const form = this.state.fields[formIndex].form.current
    const name = this.state.fields[formIndex].name
    form.submitForm().then(() => {
      if (this.state.isPossible) {
        this.setState({ ...this.state, report: false })
        const fields = this.state.fields
        fields[formIndex].value = form.state.values[name]
        fields[formIndex].valid = !form.state.errors[name]
        this.setState({ fields })
        if (!form.state.errors[name]) {
          goToNext()
          step.isDone = true
          if (steps.length <= steps.indexOf(step)) {
            this.hideNavigation()
          }
        }
      } else {
        this.setState({ report: true })
      }
    })
  }

  onClickPrev (goToPrev, steps, step) {
    if (steps.indexOf(step) <= 0) {
      return
    }
    goToPrev()
  }

  toggleModal (item) {
    if (this.state.isOpen) {
      this.setState({ isOpen: false, currentOffer: item })
    } else {
      this.setState({ isOpen: true, currentOffer: item })
    }
  }

  printButton (loading, error, data, loaded) {
    if (loading) {
      return <div className='loading' />
    } else if (error || data.status !== 200) {
      return <p>There was an error try again later</p>
    } else if (loaded && data.status === 200) {
      return (
        <NavLink
          to={`/report/${this.props.periodLoad.id}/${this.props?.currentInstitution?.id}/${this.props?.currentInstitution?.codPresupuesto}`}
          target='_blank'
        >
          <button className='button button--grey'>
            <h1>IMPRIMIR</h1>
          </button>
        </NavLink>
      )
    }
  }

  async getStudentsModalData (item) {
    const offer = this.props.ofertas.find((i) => i.nombre === item.oferta)
    let _oferta
    this.props.ofertasDirector.forEach((item) => {
      if (item.ofertasId === offer.id) {
        _oferta = item
      }
    })
    const levelSplit = item.espServNiveles.split('')
    let _level
    levelSplit.forEach((i) => {
      if (i === '/') {
        _level = item.espServNiveles.split('/')[1]
      }
    })
    const level = _level
      ? this.props.levels.find((i) => i.nombre === _level)
      : this.props.levels.find((i) => i.nombre === item.espServNiveles)
    await this.props.getAllStudents(
      _oferta.id,
      level.id,
      this.props.currentInstitution.id
    )
    this.toggleModal(item)
  }

  render () {
    const { messages } = this.props.intl
    return (
      <Card>
        <CardBody className='wizard wizard-default'>
          <Wizard>
            <TopNavigation
              className='justify-content-center mb-5'
              disableNav
            />
            <div className='mb-5'>
              <Steps>
                <Step
                  id='step1'
                  name={messages['wizard.step-name-1']}
                  desc={messages['wizard.step-desc-1']}
                >
                  <div className='wizard-basic-step'>
                    <InputWrapper>
                      <Formik
                        ref={this.form0}
                        onSubmit={() => {
                          if (this.state.registered && this.state.veracity) {
                            this.setState({ ...this.state, isPossible: true })
                          } else {
                            this.setState({ ...this.state, isPossible: false })
                          }
                        }}
                      >
                        {({ errors, touched }) => {
                          return (
                            <div className='send-data__container'>
                              <div className='send-data__input-box'>
                                <CustomInput
                                  type='checkbox'
                                  name='register'
                                  required
                                  label='He registrado a todos los alumnos matriculados en el centro educativo'
                                  checked={this.state.registered}
                                  onChange={(e) =>
                                    this.setState({
                                      registered: !this.state.registered
                                    })}
                                />
                              </div>
                              <div className='send-data__input-box'>
                                <CustomInput
                                  type='checkbox'
                                  name='veracity'
                                  label='He confirmado que la información es fidedigna'
                                  required
                                  checked={this.state.veracity}
                                  onChange={(e) =>
                                    this.setState({
                                      veracity: !this.state.veracity
                                    })}
                                />
                              </div>
                              {(!this.state.registered ||
                                !this.state.veracity ||
                                !this.state.checkedInfo) &&
                                this.state.report && (
                                  <div className='invalid-feedback d-block'>
                                    Los campos deben estar seleccionados
                                  </div>
                              )}
                            </div>
                          )
                        }}
                      </Formik>
                    </InputWrapper>
                  </div>
                </Step>
                <Step
                  id='step2'
                  name={messages['wizard.step-name-2']}
                  desc={messages['wizard.step-desc-2']}
                >
                  <div className='wizard-basic-step'>
                    <div className='send-data__container'>
                      <div className='send-data__input-box--table'>
                        <Formik ref={this.form1} onSubmit={() => {}}>
                          {({ errors, touched }) => (
                            <>
                              <Table responsive className='border-line'>
                                <thead>
                                  <tr>
                                    <th>Oferta</th>
                                    <th>Modalidad</th>
                                    <th>Nivel</th>
                                    <th>Estudiantes</th>
                                    <th>M</th>
                                    <th>F</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {this.props.ofertasResumen.length > 0
                                    ? this.props.ofertasResumen.map(
                                      (item, index) => {
                                        return (
                                          <tr key={index}>
                                            <td scope='row'>{item.oferta}</td>
                                            <td>{item.modalidad}</td>
                                            <td>{item.espServNiveles}</td>
                                            <td>{item.total}</td>
                                            <td className='male'>
                                              {item.hombres}
                                            </td>
                                            <td className='female'>
                                              {item.mujeres}
                                            </td>
                                          </tr>
                                        )
                                      }
                                    )
                                    : null}
                                </tbody>
                              </Table>
                              <AddNewModal
                                title='Estudiantes Registrados'
                                modalOpen={this.state.isOpen}
                                centerOrientation
                                toggleModal={this.toggleModal}
                              >
                                {this.props.loadingEstudents
                                  ? (
                                    <div className='loading' />
                                    )
                                  : (
                                    <>
                                      <CustomTable
                                        items={this.props.estudiantes}
                                        toggleModal={this.toggleEditModal}
                                      />
                                    </>
                                    )}
                              </AddNewModal>
                              <p>Total: {this.props.totalGeneral}</p>
                            </>
                          )}
                        </Formik>
                      </div>
                    </div>
                  </div>
                </Step>
                <Step
                  id='step3'
                  name={messages['wizard.step-name-3']}
                  desc={messages['wizard.step-desc-3']}
                >
                  <div className='wizard-basic-step'>
                    <div className='send-data__container'>
                      <Formik onSubmit={() => {}}>
                        {({ errors, touched }) =>
                          !this.state.loadRequest
                            ? (
                              <button
                                disabled={
                                !!JSON.parse(
                                  localStorage.getItem(
                                    'persist:auth-roleId'
                                  ) === '2'
                                )
                              }
                                className='button button--blue'
                                onClick={() => {
                                  this.props.loadData()
                                  this.setState({ loadRequest: true })
                                  this.hideNavigation()
                                }}
                              >
                                <h1>Enviar</h1>
                              </button>
                              )
                            : (
                                this.printButton(
                                  this.props.loading,
                                  this.props.error,
                                  this.props.data,
                                  this.props.loaded
                                )
                              )}
                      </Formik>
                    </div>
                  </div>
                </Step>
              </Steps>
            </div>
            <BottomNavigation
              onClickNext={this.onClickNext}
              onClickPrev={this.onClickPrev}
              className={
                'justify-content-center ' +
                (this.state.bottomNavHidden && 'invisible')
              }
              prevLabel={messages['wizard.prev']}
              nextLabel={messages['wizard.next']}
            />
          </Wizard>
        </CardBody>
      </Card>
    )
  }
}
export default injectIntl(Validation)
