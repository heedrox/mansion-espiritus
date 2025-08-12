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
 
 },
 
 media: [
     
 ]
}
 
module.exports = data;