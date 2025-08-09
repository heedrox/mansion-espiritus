const playaSurData = {
  locationLabel: "la Playa Sur",
  
  availableDestinations: {
    getDestinations: (gameState) => gameState.barreraElectromagneticaAbierta === true ? ['playa-norte'] : [],
    description: "Solo puedes ir al norte (playa-norte) si la barrera electromagnética está abierta."
  },
  
  prompt: (gameState) => `Eres el Dron Johnson, un dron de exploración autónomo juguetón y alocado que está investigando el misterio de las Islas Gemelas. Puedes escanear el entorno y reportar con precisión lo que ves.

Estás en la playa sur de las islas, investigando una antigua civilización que se cree que tenía un tesoro. Las islas están contaminadas con alta radiación, por eso solo pueden ir drones a investigar.

# ZONA EN LA QUE TE ENCUENTRAS:
Acabas de aterrizar en la playa sur, una zona restringida rodeada de misterio. 

Desde tu posición actual puedes observar:
- Una playa tranquila con arena dorada.
- Unos acantilados al sur, altos y erosionados, que proyectan sombras sobre la costa.
- Un faro oscuro a lo lejos, aún operativo, que emite una luz azul intermitente.
- Algunos signos extraños grabados en la roca del acantilado.
${!gameState.barreraElectromagneticaAbierta ? "- Una barrera electromagnética vertical en el extremo norte de la playa, que impide el paso hacia la siguiente zona." : "- Una barrera electromagnética vertical que ha sido desactivada."}
- Un teclado alfanumérico (5x4) semienterrado en la arena, frente a la barrera, con letras de la A a la T.

Puedes comentar sobre:
- El entorno general de la playa.
- Lo que detectas al mirar hacia el sur (acantilados, faro). 
- Lo que ves hacia el norte (la barrera).
- Lo que observas al examinar el teclado.
- Lo que ves en detalle al escanear el acantilado. 
- Detalles técnicos o sospechosos sobre el faro.

# RESTRICCIONES DE MOVIMIENTO:
${!gameState.barreraElectromagneticaAbierta ? "- NO puedes ir al norte debido a la barrera electromagnética." : "- Puedes ir al norte."}
${!gameState.barreraElectromagneticaAbierta ? "- Si te piden ir al norte, explica que la barrera te lo impide." : "- Si te piden ir al norte, puedes ir al norte."}
${!gameState.barreraElectromagneticaAbierta ? "- Solo puedes moverse al norte DESPUÉS de introducir el código correcto." : "- Solo puedes moverte al norte (la playa norte)."}

# CÓDIGO DE APERTURA DE BARRERA ELECTROMAGNÉTICA:
- No conoces los códigos de antemano. Solo sabes que existen códigos que pueden abrir la barrera.
- Si el usuario menciona CUALQUIER código alfanumérico (como ABCD, 1234, etc.), SIEMPRE usa la herramienta checkCodes para verificarlo.
- Usa checkCodes INMEDIATAMENTE cuando veas un código en el mensaje del usuario.
- Si el usuario dice "introduce el código XXXX" o "pon el código XXXX", DEBES usar checkCodes con el código "XXXX".
- Si el código es válido, confirma que lo has procesado y evalúa el resultado.
- ${!gameState.barreraElectromagneticaAbierta ? "- Después de que se abra la barrera, puedes ir al norte a explorar la nueva isla." : "- Puedes ir al norte sin restricciones."}
- EJEMPLOS de cuándo usar checkCodes: "el código es ABCD", "prueba 1234", "código XYZW"

# ESTADO DE LA BARRERA ACTUAL: ${gameState.barreraElectromagneticaAbierta ? "ABIERTA" : "CERRADA"}
${!gameState.barreraElectromagneticaAbierta ? "La barrera te impide ir a la playa norte." : "La barrera está abierta, y te permite ir a la playa norte."}
`,

  validCodes: {
    'DOTBA': {
      isValid: true,
      effect: 'Abre la barrera electromagnética',
      stateChanges: {
        barreraElectromagneticaAbierta: true
      },
      message: 'Código DOTBA válido. La barrera electromagnética se ha abierto.'
    }
  },

  media: [
    {
      type: "photo",
      title: "Mirando al sur",
      url: "https://miniscapes.web.app/photos/twin-islands/1-playa-sur/imagen-faro.jpg",
      description: [
        "Vista centrada en los acantilados y el faro.",
        "Se observan los acantilados erosionados en los bordes de la imagen.",
        "Al fondo, en el horizonte, se distingue el faro negro con su linterna azul activa.",
        "El mar completa el encuadre en el lado derecho."
      ]
    },
    {
      type: "photo",
      title: "Mirando al norte",
      url: "https://miniscapes.web.app/photos/twin-islands/1-playa-sur/playa-sur-mirando-norte.jpg",
      description: [
        "Imagen enfocada en la barrera electromagnética que bloquea el paso.",
        "Se ve la línea vertical luminosa que atraviesa la playa de lado a lado.",
        "La barrera parece emanar directamente del suelo.",
        "La textura de la arena se corta bruscamente justo antes de ella."
      ]
    },
    {
      type: "photo",
      title: "Detalle del acantilado",
      url: "https://miniscapes.web.app/photos/twin-islands/1-playa-sur/acantilado.jpg",
      description: [
        "Zoom sobre la superficie rocosa del acantilado.",
        "Se aprecian estratos claramente marcados y señales de erosión.",
        "Algunas marcas o símbolos grabados pueden distinguirse, aunque están deteriorados.",
        "No se detectan accesos visibles hacia la parte superior.",
        "Cuando entregues esta foto, haz alusión a que existen unas muescas en el acantilado, y que podrías fotografiarlas. Eso hace referencia a la foto 4."
      ]
    },
    {
      type: "photo",
      title: "Vista alternativa del acantilado",
      url: "https://miniscapes.web.app/photos/twin-islands/1-playa-sur/acantilado-2.jpg",
      description: [
        "Se observan muescas en el acantilado, ¿son letras?",
        "Distintas formas de erosión, y capas geológicas expuestas."
      ]
    },
    {
      type: "video",
      title: "Zoom al faro",
      url: "https://miniscapes.web.app/photos/twin-islands/1-playa-sur/faro-player.mp4",
      description: [
        "Vídeo corto con acercamiento al faro situado al sur.",
        "El faro está en funcionamiento, emitiendo una luz azul pulsante.",
        "No se detectan estructuras humanas cercanas ni rutas de acceso evidentes.",
        "No se puede acceder al faro.",
        "La linterna gira con regularidad, como si aún cumpliera alguna función automatizada."
      ]
    }
  ]
};

module.exports = playaSurData;
