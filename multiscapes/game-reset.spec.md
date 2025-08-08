# Endpoint de Reset de Juego

## Descripción
Endpoint para resetear completamente un juego específico, eliminando todos los datos existentes y creando un nuevo estado inicial con un mensaje de introducción.

## Endpoint
`POST /multiscapesReset`

## Parámetros
- `code` (body parameter, requerido): El código del juego a resetear

## Funcionalidad

### 1. Eliminación Completa
- Elimina el documento `twin-islands/{code}` si existe
- Elimina todas las subcolecciones del documento (messages, etc.)
- Maneja correctamente el caso donde el documento no existe

### 2. Creación de Estado Inicial
- Crea un nuevo documento `twin-islands/{code}`
- Establece `barreraElectromagneticaAbierta: false`
- Establece `start: "1"`
- Agrega timestamps de creación y reset

### 3. Mensaje de Introducción
- Crea un mensaje en la subcolección `messages`
- El mensaje es del usuario "drone"
- Contiene una introducción completa del juego
- Explica el objetivo y los elementos visibles
- Incluye emojis y formato atractivo

## Respuesta de Éxito
```json
{
  "success": true,
  "message": "Juego reseteado exitosamente para código: {code}",
  "code": "{code}",
  "timestamp": "2024-01-01T12:00:00.000Z",
  "resetInfo": {
    "endpoint": "multiscapesReset",
    "action": "game_reset"
  }
}
```

## Respuesta de Error
```json
{
  "error": "Error interno del servidor",
  "details": "Detalles del error",
  "resetInfo": {
    "endpoint": "multiscapesReset",
    "errorOccurred": true
  }
}
```

## Ejemplo de Uso
```
POST /multiscapesReset
Content-Type: application/json

{
  "code": "test-game"
}
```

## Tests Relacionados
- `test/multiscapes/infrastructure/GameResetService.spec.js`
  - `should reset game successfully`
  - `should handle reset of non-existent game`

## Archivos Relacionados
- `multiscapes/infrastructure/GameResetService.js` - Lógica de reset
- `multiscapes/index.js` - Endpoint HTTP
- `index.js` - Exportación del endpoint
