export class Laboratorio {

    constructor(
        public asistencial_centro_medico_id:            number,
        public utilidad_tipo_identificacion_id:         number,
        public identificacion:                          string,
        public razon_social:                            string,
        public utilidad_departamento_id:                number,
        public utilidad_ciudad_id:                      number,
        public direccion?:                              string,
        public telefonos?:                              string,
        public descripcion?:                            string,
        public estado?:                                 number,
        public id?:                                     number,
    ){}
    
}