import { DetalleOrdenMedica } from "./detalle-orden-medica.model";

export class OrdenMedica {

    constructor(
        public asistencial_centro_medico_id:        number,
        public asistencial_tipo_documento_id:       number,
        public asistencial_paciente_id:             number,
        public asistencial_medico_id:               number,
        public asistencial_evolucion_id:            number,
        public consecutivo:                         number,
        public fecha:                               string,
        public detalles:                            Array<DetalleOrdenMedica>,
        public _id?:                                number,
    ){}
}