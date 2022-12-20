export class ConsultaMedica {

    constructor(
        public asistencial_centro_medico_id:        number,
        public asistencial_medico_id:               number,
        public asistencial_paciente_id:             number,
        public fecha:                               string,
        public hora:                                string,
        public valor:                               string,
        public observacion:                         string,
        public _id?:                                number
    ){}
}