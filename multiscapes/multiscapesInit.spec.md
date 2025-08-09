# multiscapesInit

## Descripción
Endpoint para obtener el estado inicial de un juego específico, incluyendo todos los mensajes históricos ordenados por timestamp.

## Endpoint
`GET /multiscapesInit?code={code}`

## Casos de Prueba

### 1. Validación de Parámetros

#### 1.1 Código Inválido - Parámetro Faltante
- **Given**: Una solicitud GET sin el parámetro `code` en la query string
- **When**: Llamando a la API multiscapesInit
- **Then**: Retorna 400 con error de validación específico
- **Request**: `GET /multiscapesInit`
- **Response**:
```json
{
  "error": "El parámetro \"code\" es requerido"
}
```

#### 1.2 Código Inválido - Parámetro Vacío
- **Given**: Una solicitud GET con el parámetro `code` vacío
- **When**: Llamando a la API multiscapesInit
- **Then**: Retorna 400 con error de validación específico
- **Request**: `GET /multiscapesInit?code=`
- **Response**:
```json
{
  "error": "El parámetro \"code\" es requerido"
}
```

#### 1.3 Código Inválido - Parámetro con Espacios
- **Given**: Una solicitud GET con el parámetro `code` que solo contiene espacios
- **When**: Llamando a la API multiscapesInit
- **Then**: Retorna 400 con error de validación específico
- **Request**: `GET /multiscapesInit?code=%20%20%20`
- **Response**:
```json
{
  "error": "El parámetro \"code\" es requerido"
}
```

### 2. Código Válido

#### 2.1 Código Válido - Caso Básico
- **Given**: Una solicitud GET con un código válido
- **When**: Llamando a la API multiscapesInit
- **Then**: Retorna 200 con estructura de respuesta válida
- **Request**: `GET /multiscapesInit?code=johnson`
- **Response**:
```json
{
  "messages": [],
  "count": 0,
  "timestamp": "2024-01-01T10:00:00.000Z",
  "currentRoom": "Playa Sur"
}
```

#### 2.2 Código Válido - Códigos Conocidos
- **Given**: Una solicitud GET con códigos válidos específicos
- **When**: Llamando a la API multiscapesInit
- **Then**: Retorna 200 para cada código válido
- **Requests**:
  - `GET /multiscapesInit?code=johnson`
  - `GET /multiscapesInit?code=jackson`
  - `GET /multiscapesInit?code=common`
- **Response**: Estructura válida (puede estar vacía si no hay mensajes)

#### 2.3 Código Válido - Validación de Estructura
- **Given**: Una solicitud GET con código válido
- **When**: Llamando a la API multiscapesInit
- **Then**: La respuesta debe contener las propiedades requeridas
- **Request**: `GET /multiscapesInit?code=test`
- **Response Structure**:
```json
{
  "messages": [], // Array (puede estar vacío)
  "count": 0,     // Number (número de mensajes)
  "timestamp": "2024-01-01T10:00:00.000Z", // String ISO timestamp
  "currentRoom": "Playa Sur" // String (título de la habitación actual)
}
```

### 3. Respuestas Exitosas

#### 3.1 Juego con Mensajes Existentes - Caso Básico
- **Given**: Un código válido con mensajes en la base de datos
- **When**: Llamando a la API multiscapesInit
- **Then**: Retorna 200 con todos los mensajes ordenados por timestamp
- **Request**: `GET /multiscapesInit?code=johnson`
- **Response**:
```json
{
  "messages": [
    {
      "id": "msg1",
      "message": "Bienvenido al juego",
      "timestamp": "2024-01-01T10:00:00.000Z",
      "type": "system"
    },
    {
      "id": "msg2", 
      "message": "Has entrado en la mansión",
      "timestamp": "2024-01-01T10:01:00.000Z",
      "type": "game"
    }
  ],
  "count": 2,
  "timestamp": "2024-01-01T10:02:00.000Z",
  "currentRoom": "Playa Sur"
}
```

#### 3.2 Juego con Mensajes - Ordenamiento
- **Given**: Un código válido con múltiples mensajes en diferentes timestamps
- **When**: Llamando a la API multiscapesInit
- **Then**: Los mensajes deben estar ordenados por timestamp ASC (más antiguos primero)
- **Request**: `GET /multiscapesInit?code=jackson`
- **Response**:
```json
{
  "messages": [
    {
      "id": "msg1",
      "message": "Primer mensaje",
      "timestamp": "2024-01-01T09:00:00.000Z"
    },
    {
      "id": "msg2",
      "message": "Segundo mensaje", 
      "timestamp": "2024-01-01T10:00:00.000Z"
    },
    {
      "id": "msg3",
      "message": "Tercer mensaje",
      "timestamp": "2024-01-01T11:00:00.000Z"
    }
  ],
  "count": 3,
  "timestamp": "2024-01-01T11:30:00.000Z",
  "currentRoom": "Playa Sur"
}
```

#### 3.3 Juego con Mensajes - Estructura Completa
- **Given**: Un código válido con mensajes que incluyen todos los campos opcionales
- **When**: Llamando a la API multiscapesInit
- **Then**: Retorna mensajes con estructura completa incluyendo campos opcionales
- **Request**: `GET /multiscapesInit?code=common`
- **Response**:
```json
{
  "messages": [
    {
      "id": "msg1",
      "message": "Mensaje con foto",
      "timestamp": "2024-01-01T10:00:00.000Z",
      "type": "game",
      "photoUrls": ["https://example.com/photo1-4815.jpg"],
      "user": "player"
    },
    {
      "id": "msg2",
      "message": "Respuesta del drone",
      "timestamp": "2024-01-01T10:01:00.000Z", 
      "type": "drone",
      "user": "drone"
    }
  ],
  "count": 2,
  "timestamp": "2024-01-01T10:02:00.000Z",
  "currentRoom": "Playa Sur"
}
```

#### 3.4 Juego Sin Mensajes
- **Given**: Un código válido sin mensajes en la base de datos
- **When**: Llamando a la API multiscapesInit
- **Then**: Retorna 200 con array vacío
- **Request**: `GET /multiscapesInit?code=newgame`
- **Response**:
```json
{
  "messages": [],
  "count": 0,
  "timestamp": "2024-01-01T10:00:00.000Z",
  "currentRoom": "Playa Sur"
}
```

## Notas de Implementación

### Base de Datos
- Colección: `twin-islands`
- Documento: `{code}`
- Subcolección: `messages`
- Ordenamiento: `timestamp ASC`

### Configuración
- Proyecto: `mansion-espiritus-lkgoxs`
- Base de datos: `miniscapes` (desarrollo y producción)

### Dependencias
- `GetInitialStatus`: Caso de uso principal
- `MessageRepository`: Acceso a datos
- `GameStateService`: Obtener estado actual del juego
- `DatabaseConfig`: Configuración de Firestore

### Nuevo Campo currentRoom
- **Propósito**: Indica el título de la habitación actual donde se encuentra el jugador
- **Origen**: Se obtiene desde `gameState.currentRoom` y se traduce al título desde los archivos en `multiscapes/games-data/`
- **Formato**: String con el título legible de la habitación (ej: "Playa Sur", "Playa Sur > Playa Norte")
- **Fallback**: Si no se puede cargar el archivo de datos, usa el nombre interno de la habitación

