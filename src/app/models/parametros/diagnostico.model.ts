export class Diagnostico {

    constructor(
        public asistencial_centro_medico_id:            number,
        public asistencial_categoria_diagnostico_id:    number,
        public codigo:                                  string,
        public nombre:                                  string,
        public asistencial_categoria_diagnostico_nombre?: string,
        public estado?:                                 number,
        public id?:                                     number,
    ){}
    
}