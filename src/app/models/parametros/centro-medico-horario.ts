export class CentroMedicoHorario {
    
    constructor(
        public asistencial_centro_medico_id:    number,
        public dia_semana:                      string,
        public hora_apertura:                   string,
        public hora_cierre:                     string,
        public hora_descanso_inicial?:          string,
        public hora_descanso_final?:            string,
        public estado?:                         number,
        public id?:                             number,
    ) {} 

}