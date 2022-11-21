export class CentroMedicoParametro {
    
    constructor(
        public asistencial_centro_medico_id:                        number,
        public duracion_cita:                                       number,
        public asistencial_tipo_documento_historia_id:              number,
        public asistencial_tipo_documento_medicamento_id:           number,
        public asistencial_tipo_documento_imagenologia_id?:         number,
        public asistencial_tipo_documento_laboratorio_id?:          number,
        public estado?:                                             number,
        public id?:                                                number,
    ) {} 

}