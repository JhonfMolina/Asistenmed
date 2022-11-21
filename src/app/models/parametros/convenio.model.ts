export class Convenio {
    
    constructor(
        public asistencial_centro_medico_id: number,
        public codigo:                       string,
        public nombre:                       string,
        public fecha_inicio?:                Date,
        public fecha_fin?:                   Date,
        public estado?:                      number,
        public id?:                          number,
    ) {}

}