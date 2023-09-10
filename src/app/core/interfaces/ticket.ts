export interface Ticket {
  id: null | string | number
  status: string
  username: null | string
  C_NRO_SERIE: string
  C_NRO_DOC: string
  C_APAMNO_RAZON_SOCIAL_ADQUIRIENTE: string
  C_TIP_DOC_ADQUIRIENTE: string | number
  C_NRO_DOC_ADQUIRIENTE: string | number
  C_MONEDA: string
  C_TOTAL_OPERACIONES_GRAV: string | number
  C_MONTO_TOTAL_IGV: string | number
  C_MONTO_PAGAR: string | number
  C_FEC_CREA_FACE: string
  C_ID_ITEM: string | number
  C_DESRIP_ITEM: string
  created_date?: Date
  serviceName: string;
}
