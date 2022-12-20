export class DetalleOrdenMedica {

    constructor(
        public asistencial_centro_medico_id:        number,
        public descripcion:                         string,
        public cantidad:                            number,
        public asistencial_medicamento_id?:         string,
        public asistencial_examen_id?:              string,
        public asistencial_imagenologia_id?:        string,
        public asistencial_medicamento_nombre?:     string,
        public asistencial_examen_nombre?:          string,
        public asistencial_imagenologia_nombre?:    string,
        public asistencial_farmacia_id?:            string,
        public asistencial_laboratorio_id?:         string,
        public asistencial_centro_imagen_id?:       string,
    ){}

}