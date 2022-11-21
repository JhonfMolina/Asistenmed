export class CategoriaDiagnostico {
    
    constructor(
        public asistencial_centro_medico_id: number,
        public codigo:                       string,
        public nombre:                       string,
        public estado?:                      number,
        public id?:                          number,
    ) {} 
    
}