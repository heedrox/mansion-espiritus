# Especificación: Sistema de Movimiento del Dron

## Objetivo
Implementar un sistema de movimiento para el dron que permita navegar entre diferentes ubicaciones (rooms) del juego.

## Funcionalidad Principal

### 1. Destinos Disponibles (availableDestinations)
Cada ubicación debe tener una propiedad `availableDestinations` que indique a qué destinos puede moverse el dron desde esa ubicación.

#### Estructura de availableDestinations
```javascript
availableDestinations: {
  getDestinations: (gameState) => string[],
  description: string
}
```

### 2. Comportamiento por Ubicación

#### Playa Sur (playa-sur)
- **Destinos disponibles**: Solo "playa-norte" si `gameState.barreraElectromagneticaAbierta === true`
- **Si barrera cerrada**: No hay destinos disponibles
- **Si barrera abierta**: Puede ir a "playa-norte"

### 3. Integración con el Sistema Actual
- Los destinos disponibles se incluyen en el prompt del dron
- El dron puede informar sobre destinos disponibles cuando se le pregunte
- El sistema debe ser extensible para futuras ubicaciones

### 4. Campo currentRoomTitle en Base de Datos
Cuando el dron se mueve a una nueva ubicación, además de actualizar `currentRoom` con el código de la habitación, se debe actualizar también el campo `currentRoomTitle` con el valor del campo `title` del archivo de datos de la habitación.

#### Estructura de actualización
```javascript
// En lugar de solo:
await gameStateService.applyStateChanges({
    currentRoom: destination
});

// Se debe hacer:
await gameStateService.applyStateChanges({
    currentRoom: destination,
    currentRoomTitle: roomData.title
});
```

#### Beneficios
- El frontend puede usar directamente `currentRoomTitle` sin necesidad de cargar archivos de datos
- Mejor rendimiento al evitar consultas adicionales
- Consistencia en la presentación de la información al usuario

## Casos de Uso

### Caso 1: Barrera Cerrada
- Usuario pregunta: "¿A dónde puedo ir?"
- Dron responde: "Actualmente no puedo ir a ningún lado. La barrera electromagnética me bloquea el paso al norte."

### Caso 2: Barrera Abierta
- Usuario pregunta: "¿A dónde puedo ir?"
- Dron responde: "¡Perfecto! Ahora que la barrera está abierta, puedo ir al norte hacia la playa norte."

### Caso 3: Comando de Movimiento
- Usuario dice: "Ve al norte" o "Ve a playa-norte"
- Sistema procesa el movimiento y cambia la ubicación actual
- **Nuevo**: Se actualiza tanto `currentRoom` como `currentRoomTitle` en la base de datos

## Implementación

### ✅ Fase 1: Añadir availableDestinations a playa-sur.js
- ✅ Añadida la propiedad `availableDestinations` al objeto `playaSurData`
- ✅ Implementada la lógica condicional basada en `barreraElectromagneticaAbierta`
- ✅ Tests creados y pasando: `availableDestinations-barrera-cerrada.spec.js` y `availableDestinations-barrera-abierta.spec.js`

### ✅ Fase 2: Integrar en DroneResponseGenerator
- ✅ Modificado `_getRoomPrompt` para incluir información de destinos disponibles
- ✅ Añadido método `_composeDestinationsSection` para generar la sección de destinos
- ✅ Integración completa con el prompt del sistema
- ✅ Test creado y pasando: `destinations-prompt-integration.spec.js`

### ✅ Fase 3: Implementar Comando de Movimiento
- ✅ Creada herramienta `moveTo` para procesar comandos de movimiento
- ✅ Actualizado `currentRoom` en el estado del juego
- ✅ Creados tests para verificar el funcionamiento del movimiento
- ✅ Integrada la herramienta en `DroneResponseGenerator`
- ✅ Añadidas instrucciones de movimiento al prompt del dron

### ✅ Fase 4: Añadir Campo currentRoomTitle
- ✅ Modificar `moveTo.js` para actualizar también `currentRoomTitle`
- ✅ Cargar el título de la habitación de destino desde el archivo de datos
- ✅ Test creado y pasando: `currentRoomTitle-update.spec.js`

## Tests

### ✅ Test 1: availableDestinations-barrera-cerrada.spec.js
- ✅ Verificar que cuando `barreraElectromagneticaAbierta = false`, no hay destinos disponibles

### ✅ Test 2: availableDestinations-barrera-abierta.spec.js
- ✅ Verificar que cuando `barreraElectromagneticaAbierta = true`, "playa-norte" está disponible

### ✅ Test 3: destinations-prompt-integration.spec.js
- ✅ Verificar que la información de destinos se integra correctamente en el prompt del dron

### ✅ Test 4: drone-destinations-response.spec.js
- ✅ Verificar que la funcionalidad de destinos disponibles funciona correctamente

### ✅ Test 5: moveTo-function.spec.js
- ✅ Verificar que la función `MoveTo` funciona correctamente
- ✅ Verificar movimiento exitoso cuando barrera está abierta
- ✅ Verificar movimiento denegado cuando barrera está cerrada
- ✅ Verificar movimiento denegado para destinos inválidos

### ⏳ Test 6: movement-command.spec.js
- ⏳ Verificar que el comando de movimiento funciona correctamente con la AI (pendiente de API key)

### ✅ Test 7: currentRoomTitle-update.spec.js
- ✅ Verificar que cuando se mueve el dron, se actualiza tanto `currentRoom` como `currentRoomTitle`
- ✅ Verificar que `currentRoomTitle` contiene el valor del campo `title` del archivo de datos
- ✅ Verificar que el título se actualiza correctamente al moverse entre diferentes habitaciones
