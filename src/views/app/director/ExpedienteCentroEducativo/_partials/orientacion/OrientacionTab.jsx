import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import Loader from 'Components/Loader'
import useNotification from 'Hooks/useNotification'
import { TableReactImplementation } from 'Components/TableReactImplementation'
import useLoadOrientacionSelects from 'Hooks/orientacion/useLoadOrientacionSelects'
import useLoadOrientacionHistorico from 'Hooks/orientacion/useLoadOrientacionHistorico';
import useLoadOrientacionColumns from 'Hooks/orientacion/useLoadOrientacionColumns';
import AddOrientacion from './AddOrientacion'

const OrientacionTab = props => {


    const { selects, loading: selectsLoading } = useLoadOrientacionSelects()
    const { data, loading: historicoLoading, refetch } = useLoadOrientacionHistorico(props.tipoIntervencion.id)
    const [snackbar, handleClick] = useNotification()
    const [loading, setLoading] = useState(true)
    const [showAgregarSesion, setShowAgregarSesion] = useState(false);
    const [modalMode, setModalMode] = useState('add')
    const [initialData, setInitialData] = useState(null)
    const [pagination, setPagination] = useState({
        page: 1,
        selectedPageSize: 10,
        selectedColumn: '',
        searchValue: '',
        orderColumn: '',
        orientation: ''
    })

    const [snackbarContent, setSnackbarContent] = useState({
        msg: '',
        type: ''
    })

    const { t } = useTranslation()

    const { columns } = useLoadOrientacionColumns({
        setModalMode, // Callback para settear el modo ('add', 'edit', or 'view')
        setInitialData, // Callback para settear initial data
        setShowAgregarSesion, // Callback para abrir modal
        handleDelete: null, // Callback para borrar un registro
        tienePermiso: null // Permisos del usuario
    })


    return (

        <div>
            {
                !historicoLoading && !selectsLoading ? (
                    <>
                        {snackbar(snackbarContent.type, snackbarContent.msg)}
                        <div>
                            {
                                showAgregarSesion && (
                                    <div>
                                        {props.title}
                                        <p>{props.tipoIntervencion.id}</p>
                                        <p>{props.tipoIntervencion.nombre}</p>
                                        <AddOrientacion />
                                    </div>

                                )
                            }

                            {
                                !showAgregarSesion && (
                                    <div>
                                        <TableReactImplementation
                                            data={data}

                                            showAddButton={true}

                                            onSubmitAddButton={() => {
                                                setModalMode('add') // Set mode to "add"
                                                setInitialData(null) // No initial data for adding
                                                setShowAgregarSesion(true)
                                            }}
                                            handleGetData={async (searchValue, _, pageSize, page, column) => {
                                                setPagination({
                                                    ...pagination,
                                                    page,
                                                    pageSize,
                                                    column,
                                                    searchValue
                                                })
                                                setFilterText(searchValue ? searchValue : null)
                                            }}
                                            columns={columns}
                                            orderOptions={[]}
                                            paginationObject={pagination}
                                            pageSize={pagination.pageSize}
                                        />
                                    </div>
                                )
                            }

                        </div>
                    </>

                ) : (
                    <Loader />
                )
            }
        </div>

    )
}

export default OrientacionTab;


