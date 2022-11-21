export class Regimen {

    constructor(
        public asistencial_centro_medico_id:            number,
        public asistencial_convenio_id:                 number,
        public nombre:                                  string,
        public estado?:                                 number,
        public id?:                                     number,
    ){}
    
}