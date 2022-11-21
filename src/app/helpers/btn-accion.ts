export class Botones {

    botones: btn = {
        btnGuardar: false,
        btnActualizar: false,
        btnListado: false
    }

    constructor() {}

    ctaInicial = () => (
        this.botones = {
            btnGuardar: true,
            btnActualizar: false,
            btnListado: true
        }
    )

    ctaActualizar= () => (
        this.botones = {
            btnGuardar: false,
            btnActualizar: true,
            btnListado: true
        }
    )

    
}

interface btn {
    btnGuardar: boolean,
    btnActualizar: boolean,
    btnListado: boolean
}