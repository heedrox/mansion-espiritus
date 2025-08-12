const data = {
 title: "Playa Sur > Playa Norte > Interior de la Pirámide",
 locationLabel: "el interior de la pirámide",
 
 availableDestinations: {
     getDestinations: () => [],
     description: "No hay más lugares a los que acceder."
 },
 
 prompt: (gameState) => `Te encuentras en el interior de la pirámide. El ambiente es frío y silencioso.\n\n# LO QUE VES:\n- Pasillos de piedra con inscripciones antiguas.\n- Dos estatuas a ambos lados de una sala, con marcas de quemaduras.\n- Un pedestal central con un hueco para colocar un objeto.\n\n# ACCIONES DISPONIBLES:\n- Si el usuario te dice que use la antorcha para iluminar las estatuas, ejecuta la acción 'ILUMINAR_ESTATUAS' con la herramienta executeAction.\n- Si el usuario te indica colocar el escudo en el pedestal, ejecuta la acción 'COLOCAR_ESCUDO' con la herramienta executeAction.\n\n# ESTADO ACTUAL:\n${gameState.estatuasIluminadas ? '- Las estatuas están iluminadas.' : '- Las estatuas están a oscuras.'}\n${gameState.escudoColocado ? '- El escudo está colocado en el pedestal.' : '- El pedestal está vacío.'}`,
 
 actions: {
   ILUMINAR_ESTATUAS: {
     trigger: "al usar la antorcha para iluminar las estatuas",
     gameStateUpdate: {
       estatuasIluminadas: true
     },
     successMessage: "Las estatuas se iluminan con un brillo tenue, revelando símbolos ocultos."
   },
   COLOCAR_ESCUDO: {
     trigger: "al colocar el escudo en el pedestal",
     gameStateUpdate: {
       escudoColocado: true
     },
     successMessage: "Colocas el escudo en el pedestal. Se escucha un mecanismo activarse en el interior de la pirámide."
   }
 },
 
 validCodes: {
    '2598': {
        isValid: true,
        effect: 'Abre la puerta al tesoro.',
        stateChanges: {
            tesoroAbierto: true,
            gameOver: true
        },
        message: 'Código válido. La puerta que refulge luz se abre. ¿Qué tesoros habrá dentro? ¿Qué habrá detrás? Pues el juego termina aquí. ¡Felicidades! Has llegado al final.'
    }
    },
    
    media: [
        {
            type: "photo",
            title: "Estatuas",
            url: "https://miniscapes.web.app/photos/twin-islands/3-interior-piramide/estatuas.jpg",
            description: "Cuatro estatuas pueden verse en una de las paredes."
          },      
    {
        type: "photo", 
        title: "Entrada con antorcha",
        url: "https://miniscapes.web.app/photos/twin-islands/3-interior-piramide/puerta-entrada-antorcha.jpg",
        description: [
            "La entrada de la pirámide, iluminada por una antorcha. Hemos entrado por aquí, por esa claraboya."
        ]
    },
    {
        type: "photo",
        title: "Puerta de salida",
        url: "https://miniscapes.web.app/photos/twin-islands/3-interior-piramide/puerta-salida.jpg", 
        description: [
            "La puerta que conduce al secreto oculto de la civilización antigua. ¿un tesoro? ¿por qué refulge luz? ¡pronto lo descubiremos! Se pueden ver unas estatuas a la izquierda, pero casi no se pueden ver..."
        ]
    },
    {
        type: "photo",
        title: "Teclado numérico",
        url: "https://miniscapes.web.app/photos/twin-islands/3-interior-piramide/teclado.jpg",
        description: [
            "Un antiguo teclado numérico incrustado en la pared. Parece que hay que introducir un código para abrir la puerta. La radiación parece que afecta a mi capacidad de enviaros la foto."
        ]
    }
    ]
    
}
 
module.exports = data;