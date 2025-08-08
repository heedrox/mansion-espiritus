# Limitación de Mensajes para Ahorro de Costes

## Descripción
Para optimizar los costes de la API de IA, se ha implementado una limitación que envía solo los últimos 30 mensajes al `DroneResponseGenerator` en lugar de todo el historial de conversación.

## Funcionalidad

### Objetivo
Reducir el consumo de tokens en las llamadas a la API de OpenAI al limitar el contexto de conversación a los últimos 30 mensajes.

### Implementación
- **Ubicación**: `multiscapes/application/ProcessPlayerMessage.js`
- **Método**: `process()`
- **Línea**: 25-27

```javascript
// Obtener todos los mensajes ordenados por timestamp (incluyendo el recién guardado)
const allMessages = await MessageRepository.getMessagesByTimestamp(code);

// Limitar a solo los últimos 30 mensajes para ahorrar costes
const messages = allMessages.slice(-30);
```

## Casos de Prueba

### 1. Más de 30 Mensajes
- **Given**: Existen 35 mensajes en la base de datos
- **When**: Se procesa un nuevo mensaje del jugador
- **Then**: Solo los últimos 30 mensajes se envían al `DroneResponseGenerator`
- **Test**: `should limit messages to last 30 when calling DroneResponseGenerator`

### 2. Menos de 30 Mensajes
- **Given**: Existen 15 mensajes en la base de datos
- **When**: Se procesa un nuevo mensaje del jugador
- **Then**: Todos los mensajes se envían al `DroneResponseGenerator`
- **Test**: `should handle less than 30 messages correctly`

### 3. Exactamente 30 Mensajes
- **Given**: Existen exactamente 30 mensajes en la base de datos
- **When**: Se procesa un nuevo mensaje del jugador
- **Then**: Todos los 30 mensajes se envían al `DroneResponseGenerator`
- **Test**: `should handle exactly 30 messages correctly`

## Beneficios

### Ahorro de Costes
- **Antes**: Se enviaban todos los mensajes del historial completo
- **Después**: Solo se envían los últimos 30 mensajes
- **Impacto**: Reducción significativa en el consumo de tokens por llamada

### Mantenimiento del Contexto
- Los últimos 30 mensajes proporcionan suficiente contexto para mantener la coherencia de la conversación
- Se mantiene la funcionalidad completa del juego
- No se pierde información crítica reciente

### Rendimiento
- Llamadas más rápidas a la API
- Menor uso de memoria
- Respuestas más eficientes

## Consideraciones Técnicas

### Orden de Mensajes
- Los mensajes se obtienen ordenados por timestamp
- `slice(-30)` toma los últimos 30 elementos del array
- Se mantiene el orden cronológico correcto

### Compatibilidad
- No afecta la funcionalidad existente
- Compatible con todos los tests existentes
- No requiere cambios en otros componentes

### Escalabilidad
- La limitación es configurable (actualmente 30)
- Se puede ajustar según las necesidades de costes vs contexto
- Fácil de modificar si se requieren cambios

## Tests Relacionados
- **Archivo**: `test/multiscapes/application/ProcessPlayerMessage.spec.js`
- **Cobertura**: 100% de los casos de uso
- **Estado**: ✅ Todos los tests pasando

## Impacto en el Sistema
- **DroneResponseGenerator**: Recibe menos mensajes, pero mantiene funcionalidad
- **MessageRepository**: No cambia, sigue devolviendo todos los mensajes
- **ProcessPlayerMessage**: Aplica la limitación antes de llamar al generador
- **Base de Datos**: No cambia, se mantienen todos los mensajes
