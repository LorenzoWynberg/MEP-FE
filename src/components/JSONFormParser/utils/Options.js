import {
  sino,
  zona,
  valoracionPatrimonial,
  elevacionSuelo,
  territorio,
  topografiaPredomiante,
  climaPredomiante,
  caracteristicaAcceso,
  regionSocioEconomica,
  estado,
  cerramientoPerimetral,
  estadoCerramientoPerimetral,
  estacinamientos,
  casetaVigilancia,
  estado2,
  pasosTechados,
  estadoPasosTechados,
  estadoRampas,
  estaoEscalerasComplementarias,
  numeroDe1A5,
  estadoGeneralMuros,
  estadoSiNoParcial,
  duenioRegistral,
  indiceDesarrolloSocial,
  direccionDeLaPendiente,
  alturaRespectoNivelDeCalle,
  regionClimatica,
  otrasAfectacionesTerreno,
  pisosEdificacion,
  MaterialesPrincipales
} from './opciones'

import { cloneDeep } from 'lodash'

const setDescripcionOpcion = (id, options, descripcion) => {
  return [...options].map((item, i) => {
    if (item.id == id) {
      item.descripcion = descripcion
    }

    return item
  })
}

export const listasPredefinidas = [
  {
    id: 'sino',
    label: 'Si o No',
    options: sino
  },
  {
    id: 'zona',
    label: 'Zona',
    options: zona
  },
  {
    id: 'valoracionPatrimonial',
    label: 'Valoración patrimonial',
    options: valoracionPatrimonial
  },
  {
    id: 'elevacionSuelo',
    label: 'Elevación de suelo',
    options: elevacionSuelo
  },
  {
    id: 'territorio',
    label: 'Territorio', // Tipos de Territorio
    options: territorio
  },
  {
    id: 'topografiaPredomiante',
    label: 'Topografia predominante',
    options: topografiaPredomiante
  },
  {
    id: 'climaPredomiante',
    label: 'Clima predominante',
    options: climaPredomiante
  },
  {
    id: 'caracteristicaAcceso',
    label: 'Caracteristica de acceso',
    options: caracteristicaAcceso
  },
  {
    id: 'regionSocioEconomica',
    label: 'Región socioeconómica',
    options: regionSocioEconomica
  },
  {
    id: 'estado',
    label: 'Estado',
    options: estado
  },
  {
    id: 'cerramientoPerimetral',
    label: 'Cerramiento perimetral',
    options: cerramientoPerimetral
  },
  {
    id: 'estadoCerramientoPerimetral',
    label: 'Estado general de cerramiento perimetral',
    options: estadoCerramientoPerimetral
  },
  {
    id: 'estacinamientos',
    label: 'Estacionamientos',
    options: estacinamientos
  },
  {
    id: 'casetaVigilancia',
    label: 'Caseta de vigilancia',
    options: casetaVigilancia
  },
  {
    id: 'estado2',
    label: 'Estado 2', // Estado de la(s) caseta(s), Estado de elevadores o platafor, Estado Tanque elevado
    options: estado2
  },
  {
    id: 'pasosTechados',
    label: 'Pasos techados / cubiertos',
    options: pasosTechados
  },
  {
    id: 'estadoPasosTechados',
    label: 'Estado actual de los pasos techados',
    options: estadoPasosTechados
  },
  {
    id: 'estadoRampas',
    label: 'Estado de rampas',
    options: estadoRampas
  },
  {
    id: 'estaoEscalerasComplementarias',
    label: 'Estado de escaleras complementarias',
    options: estaoEscalerasComplementarias
  },
  {
    id: 'numeroDe1A5',
    label: 'Número del 1 al 5 o más', // Muros de Contención,  Tanque Elevado
    options: numeroDe1A5
  },
  {
    id: 'estadoGeneralMuros',
    label: 'Estado general de los muros',
    options: estadoGeneralMuros
  },
  {
    id: 'estadoSistemaCamaraCircuito',
    label: 'Estado sistema de cámaras y circuito cerrado',
    options: setDescripcionOpcion(
      3,
      cloneDeep(estadoSiNoParcial),
      'Cuando se considera que no todo centro educativo esta cubierto por un sistema de cámaras'
    )
  },
  {
    id: 'alarmaContraIncendio',
    label: 'Alarma contra incendio',
    options: setDescripcionOpcion(
      3,
      cloneDeep(estadoSiNoParcial),
      'Cuando se considera que no todo centro educativo esta cubierto por una alarma contra incendio'
    )
  },
  {
    id: 'iluminacionEmergencia',
    label: 'Iluminación emergencia',
    options: setDescripcionOpcion(
      3,
      cloneDeep(estadoSiNoParcial),
      'Cuando se considera que no todo centro educativo esta cubierto con luces de emergencia'
    )
  },
  {
    id: 'rutasEvacuacion',
    label: 'Señalización de rutas de evacuación',
    options: setDescripcionOpcion(
      3,
      cloneDeep(estadoSiNoParcial),
      'Cuando se considera que no todo centro educativo esta cubierto con señalización de rutas de evacuación'
    )
  },
  {
    id: 'duenioRegistral',
    label: 'Dueño registral',
    options: duenioRegistral
  },
  {
    id: 'indiceDesarrolloSocial',
    label: 'Índice de desarrollo social',
    options: indiceDesarrolloSocial
  },
  {
    id: 'direccionDeLaPendiente',
    label: 'Dirección de la pendiente',
    options: direccionDeLaPendiente
  },
  {
    id: 'alturaRespectoNivelDeCalle',
    label: 'Altura respecto nivel de calle',
    options: alturaRespectoNivelDeCalle
  },
  {
    id: 'regionClimatica',
    label: 'Región climática',
    options: regionClimatica
  },
  {
    id: 'otrasAfectacionesTerreno',
    label: 'Otras afectaciones al terreno',
    options: otrasAfectacionesTerreno
  },
  {
    id: 'pisosEdificacion',
    label: 'Pisos de la edificación',
    options: pisosEdificacion
  },
  {
    id: 'pisosMaterialPrincipal',
    label: 'Pisos - Material principal',
    options: MaterialesPrincipales.pisos
  },
  {
    id: 'paredesMaterialPrincipal',
    label: 'Paredes - Material principal',
    options: MaterialesPrincipales.paredes
  },
  {
    id: 'cielorasosMaterialPrincipal',
    label: 'Cieloraso - Material principal',
    options: MaterialesPrincipales.cielorasos
  },
  {
    id: 'estructurasTechosMaterialPrincipal',
    label: 'Estructura de techos - Material principal',
    options: MaterialesPrincipales.estructurasTechos
  },
  {
    id: 'techoMaterialPrincipal',
    label: 'Techos (cubiertas) - Material principal',
    options: MaterialesPrincipales.techos
  },
  {
    id: 'canoasBajantesMaterialPrincipal',
    label: 'Canoas y bajantes - Material principal',
    options: MaterialesPrincipales.canoasBajantes
  },
  {
    id: 'puertasVentanasMaterialPrincipal',
    label: 'Puertas y ventanas - Material principal',
    options: MaterialesPrincipales.puertasVentanas
  },
  {
    id: 'estadosElementosMaterialPrincipal',
    label: 'Estado de los elementos - Edificaciones',
    options: MaterialesPrincipales.estadosElementos
  }
]

export const fromDbListOptionsURLS = {
  terrenos: (state) => {
    return `api/ExpedienteCentroEducativo/FormularioCentro/GetAllByInstitucionAndFormName/${state.authUser.currentInstitution.id}/terreno`
  }
}

export const fromDbListOptionsColumns = {
  terrenos: [
    {
      column: 'nroFinca',
      label: 'N. de Finca'
    },
    {
      column: 'nroPlano',
      label: 'N. Plano'
    },
    {
      column: 'descripcion',
      label: 'Descripcion'
    },
    {
      column: 'ubicacionGeografica',
      label: 'Ubicacion Geografica'
    }
  ]
}
