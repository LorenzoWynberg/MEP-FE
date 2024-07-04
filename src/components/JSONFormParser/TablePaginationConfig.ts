import { pageQuantityTypes } from './types'
class TablePaginationConfig {
  private totalRegistros: number
  private page: number
  private cantidadPagina: number

  public constructor (page: number, perPage: pageQuantityTypes, totalRegistrosFromBackend: number) {
    this.page = page
    this.totalRegistros = totalRegistrosFromBackend
    this.cantidadPagina = perPage
  }

  get total () {
    return this.totalRegistros
  }

  get currentPage () {
    return this.page
  }

  public async handleAddOne (data) {
    try {
      // try to add the register
      const response = await Promise.resolve({ data: { total: this.totalRegistros + 1 } })
      this.totalRegistros = response.data.total
      this.handlePagination(this.page, cantidadPagina)

      return { error: false }
    } catch (e) {
      return { error: e.response.data.error }
    }
  }

  public handlePagination = (): boolean => {
    return true
  }

  public handleSearch = (): boolean => {
    return true
  }
}

export default TablePaginationConfig
