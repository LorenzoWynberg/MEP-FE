import { makeStyles } from '@material-ui/core/styles'

import { useForm } from 'react-hook-form'

import useNotification from '../../../../../../hooks/useNotification'

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1
  },
  control: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2)
  },
  periodo: {
    paddingLeft: theme.spacing(2)
  },
  paper: {
    minHeight: 475,
    padding: 20,
    marginLeft: 10,
    marginBottom: 20,
    marginTop: 20
  }
}))

interface InvitacionesProps {
    data: any,
    tipos: any,
    loading: boolean,
    dependencias: any,
    handleSearch: Function,
    handlePagination: Function,
    totalRegistros: number
}

const InvitacionesTable = (props : InvitacionesProps) => {
  const {
    data,
    tipos,
    loading,
    dependencias,
    handleSearch,
    handlePagination,
    totalRegistros
  } = props

  const [snackbar, handleClick] = useNotification()
  const { register, handleSubmit, reset, watch, setValue } = useForm()
}
