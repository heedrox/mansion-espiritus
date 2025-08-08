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

### 🔄 Fase 3: Implementar Comando de Movimiento
- ⏳ Crear herramienta `moveTo` para procesar comandos de movimiento
- ⏳ Actualizar `currentRoom` en el estado del juego
- ⏳ Crear tests para verificar el funcionamiento del movimiento

## Tests

### ✅ Test 1: availableDestinations-barrera-cerrada.spec.js
- ✅ Verificar que cuando `barreraElectromagneticaAbierta = false`, no hay destinos disponibles

### ✅ Test 2: availableDestinations-barrera-abierta.spec.js
- ✅ Verificar que cuando `barreraElectromagneticaAbierta = true`, "playa-norte" está disponible

### ✅ Test 3: destinations-prompt-integration.spec.js
- ✅ Verificar que la información de destinos se integra correctamente en el prompt del dron

### ✅ Test 4: drone-destinations-response.spec.js
- ✅ Verificar que la funcionalidad de destinos disponibles funciona correctamente

### ⏳ Test 5: movement-command.spec.js
- ⏳ Verificar que el comando de movimiento funciona correctamente (pendiente de implementar)
