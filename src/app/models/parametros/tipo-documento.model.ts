export class TipoDocumento {

    constructor(
        public asistencial_centro_medico_id:    number,
        public nombre:                          string,
        public consecutivo:                     number,
        public estado?:                         number,
        public id?:                             number,
        public slug?:                           string,
    ){}
    
}