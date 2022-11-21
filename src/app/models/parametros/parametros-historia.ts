
export class EstadoIngreso {
    constructor(
        public asistencial_centro_medico_id:            number,
        public nombre:                                  string,
        public estado?:                                 number,
        public id?:                                     number,
    ){}
}

export class ExamenFisico {
    constructor(
        public asistencial_centro_medico_id:            number,
        public nombre:                                  string,
        public estado?:                                 number,
        public id?:                                     number,
    ){}
}

export class Antecedentes {
    constructor(
        public asistencial_centro_medico_id:            number,
        public nombre:                                  string,
        public estado?:                                 number,
        public id?:                                     number,
    ){}
}