import React, { useState } from 'react'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import Paper from '@material-ui/core/Paper'
import Draggable from 'react-draggable'

import { makeStyles } from '@material-ui/core/styles'
import BottomNavigation from '@material-ui/core/BottomNavigation'
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction'
import FormatShapesIcon from '@material-ui/icons/FormatShapes'
import GradientIcon from '@material-ui/icons/Gradient'
import StorageIcon from '@material-ui/icons/Storage'

import Personalizada from './sources/Personalizada.tsx'
import Predefinida from './sources/Predefinida.tsx'
import FromDB from './sources/FromDB.tsx'
import Divider from '@material-ui/core/Divider'

import { cloneDeep } from 'lodash'

import '../../../../../styles.scss'

import { listasPredefinidas } from 'Components/JSONFormParser/utils/Options'

function PaperComponent (props) {
  return (
    <Draggable
      handle='#draggable-dialog-title'
      cancel={'[class*="MuiDialogContent-root"]'}
    >
      <Paper {...props} />
    </Draggable>
  )
}
const useStyles = makeStyles({
  root: {
    width: 500
  }
})

const getOptionValue = (options) => {
  if (options.length == 0) return 0

  if (Array.isArray(options)) return 0

  return options.toLowerCase().endsWith('fromdb') ? 2 : 1
}

const getOptions = (options, option, optionsDB = null) => {
  switch (option) {
    case 'personalizada': return Array.isArray(options) ? options : []
    case 'predefinida':
      if (options.length == 0) return {}

      if (typeof options === 'string') {
        if (!options.toLowerCase().endsWith('fromdb')) return listasPredefinidas.find(item => item.id == options)
        else return {}
      } else return {}

    case 'fromdb':
      if (options.length == 0) return {}

      if (typeof options === 'string') {
        if (options.toLowerCase().endsWith('fromdb')) return listasPredefinidas.find(item => item.id == options)
        else return {}
      } else return {}
  }
}

export default function DefinirFuenteLista (props) {
  const classes = useStyles()
  const [value, setValue] = React.useState(getOptionValue(props.field.options))
  const [newOptions, setNewOptions] = useState(getOptions(props.field.options, 'personalizada'))
  const [optionSelected, setOptionSelected] = useState(getOptions(props.field.options, 'predefinida'))
  const [optionSelectedDB, setOptionSelectedDB] = useState(getOptions(props.field.options, 'fromdb', props.selects))

  const handleOptionsChange = (action, data, value) => {
    if (action === 'add') {
      const newOpts = cloneDeep(newOptions)
      const newOption = {
        id: `${newOpts.length + 1}_${props.field.type}`,
        value: '',
        label: ''
      }
      newOpts.push(newOption)

      setNewOptions(newOpts)
    } else if (action === 'delete') {
      setNewOptions(newOptions.filter((element) => element.id !== data))
    } else if (action == 'changetext') {
      data.value = value
      data.label = value

      setNewOptions(
        newOptions.map((element) => (element.id === data.id ? data : element))
      )
    } else if (action == 'define') {
      setOptionSelected(data)
    } else if (action == 'definedb') {
      setOptionSelectedDB(data)
    }
  }

  const handleClose = () => {
    props.toggleModal()
  }

  const handleSave = async () => {
    let optionsToSave = []
    // Validar que halla opciones si es personalizadas
    if (value == 0) {
      const getValidOptions = newOptions.filter((item) => item.value != '')
      optionsToSave = {
        options: getValidOptions,
        numOptions: getValidOptions.length / 2
      }
      if (optionsToSave.length === 0) {
        return
      }
    }

    // Validar si es predefinida o de base de datos que se selecciono lista
    if (value == 1 && Object.keys(optionSelected).length === 0) {
      return
    } else if (value == 1) {
      optionsToSave = {
        options: optionSelected.id,
        numOptions: optionSelected.options.length / 2
      }
    }

    if (value == 2 && Object.keys(optionSelectedDB).length === 0) {
      return
    } else if (value == 2) {
      optionsToSave = {
        options: `${optionSelectedDB.id}FromDB`,
        numOptions: optionSelectedDB.options.length / 2
      }
    }

    // Obtener source en texto
    const source =
      value == 0 ? 'personalizada' : value == 1 ? 'predefinida' : 'fromdb'

    await props.handleChange('options', optionsToSave, false)

    props.setValueDefined(
      value === 0
        ? 'Personalizada'
        : value === 1
          ? optionSelected.label
          : optionSelectedDB.label
    )

    props.toggleModal()
  }

  return (
    <div>
      <Dialog
        open={props.modalOpen}
        onClose={handleClose}
        PaperComponent={PaperComponent}
        aria-labelledby='draggable-dialog-title'
      >
        <DialogTitle>
          <h4>
            Lista de opciones{' '}
            {value == 0
              ? ' "Personalizada"'
              : value == 1
                ? ' "Predefinida"'
                : ' "desde base de datos"'}
          </h4>
        </DialogTitle>
        <DialogContent>
          <div className='difinir-fuente-content'>
            {
              {
                0: (
                  <Personalizada
                    options={newOptions}
                    handleOptionsChange={handleOptionsChange}
                  />
                ),
                1: (
                  <Predefinida
                    options={props.field.options}
                    handleOptionsChange={handleOptionsChange}
                    optionSelected={optionSelected}
                    listasPredefinidas={listasPredefinidas}
                  />
                ),
                2: (
                  <FromDB
                    options={props.field.options}
                    handleOptionsChange={handleOptionsChange}
                    selects={props.selects}
                    optionSelected={optionSelectedDB}
                  />
                )
              }[value]
            }
          </div>
          <Divider light />
          <BottomNavigation
            value={value}
            onChange={(event, newValue) => {
              setValue(newValue)
            }}
            showLabels
            className={classes.root}
          >
            <BottomNavigationAction
              label='Personalizada'
              icon={<FormatShapesIcon />}
            />
            <BottomNavigationAction
              label='Predefinida'
              icon={<GradientIcon />}
            />
            <BottomNavigationAction
              label='Desde base de datos'
              icon={<StorageIcon />}
            />
          </BottomNavigation>
        </DialogContent>
        <Divider light />
        <DialogActions>
          <Button autoFocus onClick={handleClose} color='primary'>
            Cancel
          </Button>
          <Button onClick={handleSave} color='primary'>
            Continuar
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}
