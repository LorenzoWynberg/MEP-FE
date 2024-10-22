import { useState } from "react";
import FormOrientacion from "./FormOrientacion"
import useLoadOrientacionSelects from 'Hooks/orientacion/useLoadOrientacionSelects'
import useLoadOrientacionHistorico from 'Hooks/orientacion/useLoadOrientacionHistorico';
import useLoadEstudianteColumns from 'Hooks/orientacion/useLoadEstudianteColumns';
import { TableReactImplementation } from 'Components/TableReactImplementation'



const AddOrientacion = props => {
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


    const { columns } = useLoadEstudianteColumns({
        setModalMode, // Callback para settear el modo ('add', 'edit', or 'view')
        setInitialData, // Callback para settear initial data
        setShowAgregarSesion, // Callback para abrir modal
        handleDelete: null, // Callback para borrar un registro
        tienePermiso: null // Permisos del usuario
    })


    const dataEstudiantes = []

    return (
        <div>
            <FormOrientacion />
            <div>
                <TableReactImplementation
                    data={dataEstudiantes}

                    msjButton="+ Agregar estudiante"
                    showAddButton={true}

                    onSubmitAddButton={() => {

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

        </div>
    )
}

export default AddOrientacion