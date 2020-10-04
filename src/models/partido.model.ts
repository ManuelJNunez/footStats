export enum Resultado {
    Acertado,
    Fallido
}

export enum Tipo {
    Ataque,
    Defensa
}

export interface IPartido {
    fechaIni: Date,
    fechaFin: Date,
    jugadas: [{
        jugada: Tipo,
        resultado: Resultado,
        comentario: string
    }]
}