const data = {
 title: "Playa Sur > Playa Norte > Interior de la Pirámide",
 locationLabel: "el interior de la pirámide",
 
 availableDestinations: {
     getDestinations: () => [],
     description: "No hay más lugares a los que acceder."
 },
 
 prompt: (gameState) => `Te encuentras en el interior de la pirámide.
 El ambiente es frío y silencioso.
 
 # LO QUE VES:
   - Una puerta que refulge luz, que parece cerrada.
   - Una pared al lado de la puerta, en el que se perciben unas estatuas. Están demasiado oscuras.
   - La claraboya de la entrada de la pirámide, que está abierta, y es por donde has entrado.
   ${!gameState.estatuasIluminadas ? `- Una antorcha, bajo la claraboya.` : ''}

 # ACCIONES DISPONIBLES:
 ${!gameState.estatuasIluminadas? `- Si el usuario te dice que use la antorcha para iluminar las estatuas, ejecuta la acción 'ILUMINAR_ESTATUAS' con la herramienta executeAction.` : '' }
 - Si el usuario te dice que quiere coger la antorcha, indícale, con un chiste, que no sabes para qué las necesitas, y que debe ser más explícito.

 `, 
 
 actions: {
   ILUMINAR_ESTATUAS: {
     trigger: "al usar la antorcha para iluminar las estatuas",
     gameStateUpdate: {
       estatuasIluminadas: true
     },
     successMessage: "Las estatuas se iluminan con un brillo tenue, revelando símbolos ocultos."
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
    
    media: (gameState) => {
        const mediaItems = [];
        
        // Siempre mostrar las estatuas
        mediaItems.push({
            type: "photo",
            title: "Estatuas",
            url: "https://miniscapes.web.app/photos/twin-islands/3-interior-piramide/estatuas.jpg",
            description: "Cuatro estatuas pueden verse en una de las paredes."
        });
        
        // Siempre mostrar la entrada con antorcha
        mediaItems.push({
            type: "photo", 
            title: "Entrada con antorcha",
            url: "https://miniscapes.web.app/photos/twin-islands/3-interior-piramide/puerta-entrada-antorcha.jpg",
            description: [
                "La entrada de la pirámide, iluminada por una antorcha. Hemos entrado por aquí, por esa claraboya."
            ]
        });
        
        // Solo mostrar la puerta de salida si las estatuas están iluminadas
        if (gameState.estatuasIluminadas) {
            mediaItems.push({
                type: "photo",
                title: "Puerta de salida",
                url: "https://miniscapes.web.app/photos/twin-islands/3-interior-piramide/puerta-salida.jpg", 
                description: [
                    "La puerta que conduce al secreto oculto de la civilización antigua. ¿un tesoro? ¿por qué refulge luz? ¡pronto lo descubriremos! Se pueden ver unas estatuas a la izquierda, pero casi no se pueden ver..."
                ]
            });
        }
        
        // Solo mostrar el teclado si las estatuas están iluminadas
        if (gameState.estatuasIluminadas) {
            mediaItems.push({
                type: "photo",
                title: "Teclado numérico",
                url: "https://miniscapes.web.app/photos/twin-islands/3-interior-piramide/teclado.jpg",
                description: [
                    "Un antiguo teclado numérico incrustado en la pared. Parece que hay que introducir un código para abrir la puerta. La radiación parece que afecta a mi capacidad de enviaros la foto."
                ]
            });
        }
        
        return mediaItems;
    }
}
 
module.exports = data;