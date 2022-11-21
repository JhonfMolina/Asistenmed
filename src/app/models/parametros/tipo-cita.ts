export class TipoCita {

    constructor(
        public asistencial_centro_medico_id:    number,
        public nombre:                          string,
        public resolucion:                      string,
        public reasignacion:                    number,
        public estado?:                         number,
        public id?:                             number,
    ){}
    
}