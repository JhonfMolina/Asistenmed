export class Medico {
 
    constructor(
        public asistencial_centro_medico_id:    number,
        public utilidad_tipo_identificacion_id: number,
        public identificacion:                  string,
        public rethus:                          string,
        public especialidades:                  Array<any>,
        public primer_nombre:                   string,
        public primer_apellido:                 string,
        public sexo:                            string,
        public utilidad_departamento_id:        number,
        public utilidad_ciudad_id:              number,
        public segundo_nombre?:                 string,
        public segundo_apellido?:               string,
        public fecha_nacimiento?:               string,
        public direccion?:                      string,
        public contactos?:                      string,
        public correo?:                         string,
        public universidad?:                    string,
        public user_id?:                        number,
        public estado?:                         number,
        public id?:                             number,
        public tags?:                           Array<any>,
    ){ }
    
}