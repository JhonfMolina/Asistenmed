export class Paciente {

    constructor(
        public asistencial_centro_medico_id:    number,
        public utilidad_tipo_identificacion_id: number,
        public identificacion:                  string,
        public primer_nombre:                   string,
        public primer_apellido:                 string,
        public fecha_nacimiento:                Date,
        public sexo:                            string,
        public utilidad_departamento_id:        number,
        public utilidad_ciudad_id:              number,
        public barrio?:                         string,
        public direccion?:                      string,
        public contactos?:                      string,
        public segundo_nombre?:                 string,
        public segundo_apellido?:               string,
        public estado_civil?:                   string,
        public grupo_sanguineo?:                string,
        public factor_sanguineo?:               string,
        public correo?:                         string,
        public estado?:                         string,
        public id?:                             number,
    ){}
    
}