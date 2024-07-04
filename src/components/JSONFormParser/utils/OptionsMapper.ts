export const OptionsMapper = {
  terrenos: item => {
    const solucion = JSON.parse(item.solucion)
    return {
      ...item,
      solucion,
      nroFinca: solucion.Numero_finca,
      nroPlano: solucion.Numero_de_plano_catastro,
      descripcion: solucion.descripcion,
      ubicacionGeografica: `${solucion.Provincia}/${solucion.Canton}/${solucion.Distrito}`
    }
  }
}
