export class HistoriaClinica {

    constructor(
        public asistencial_centro_medico_id:        number,
        public asistencial_paciente_id:             number,
        public asistencial_convenio_id:             number,
        public asistencial_regimen_id:              number,
        public asistencial_tipo_documento_id:       number,
        public consecutivo:                         string,
        public antecedentes_normales:               string,
        public fecha_emision:                       string,
        public _id?:                                number
    ){}
}

export interface Evolucion {
    
    asistencial_centro_medico_id:        number,
    asistencial_historia_clinica_id:     number,
    asistencial_tipo_documento_id:       number,
    asistencial_via_ingreso_id:          number,
    consecutivo:                         string,
    fecha_emision:                       string,
    diagnostico_presuntivo:              string,
    plan:                                string,
    motivo_consulta:                     string,
    enfermedad_actual:                   string,
    inspeccion_general:                  string,
    diagnosticos:                        Array<any>,
    estado_ingresos:                     Array<any>,
    examen_fisico:                       Array<any>,
    antecedentes_personales:             Array<any>,
    _id?:                                number        
    
}
