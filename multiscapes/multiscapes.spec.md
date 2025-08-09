# multiscapes

## Descripción
Endpoint para procesar mensajes del jugador y generar respuestas del drone usando IA. Guarda el mensaje del jugador, genera una respuesta con IA y la guarda también.

## Endpoint
`POST /multiscapes`

## Casos de Prueba

### 1. Validación de Parámetros

#### 1.1 Código Inválido - Parámetro Faltante
- **Given**: Una solicitud POST sin el parámetro `code` en el body
- **When**: Llamando a la API multiscapes
- **Then**: Retorna 400 con error de validación específico
- **Request**:
```json
{
  "message": "Hola drone"
}
```
- **Response**:
```json
{
  "error": "El parámetro \"code\" es requerido"
}
```

#### 1.2 Mensaje Inválido - Parámetro Faltante
- **Given**: Una solicitud POST sin el parámetro `message` en el body
- **When**: Llamando a la API multiscapes
- **Then**: Retorna 400 con error de validación específico
- **Request**:
```json
{
  "code": "johnson"
}
```
- **Response**:
```json
{
  "error": "El parámetro \"message\" es requerido"
}
```

#### 1.3 Ambos Parámetros Faltantes
- **Given**: Una solicitud POST sin parámetros en el body
- **When**: Llamando a la API multiscapes
- **Then**: Retorna 400 con error de validación específico
- **Request**:
```json
{}
```
- **Response**:
```json
{
  "error": "El parámetro \"code\" es requerido"
}
```

#### 1.4 Parámetros Vacíos
- **Given**: Una solicitud POST con parámetros vacíos
- **When**: Llamando a la API multiscapes
- **Then**: Retorna 400 con error de validación específico
- **Request**:
```json
{
  "code": "",
  "message": ""
}
```
- **Response**:
```json
{
  "error": "El parámetro \"code\" es requerido"
}
```

### 2. Código Válido y Mensaje Válido

#### 2.1 Caso Básico - Respuesta Exitosa
- **Given**: Una solicitud POST con código y mensaje válidos
- **When**: Llamando a la API multiscapes
- **Then**: Retorna 200 con respuesta del drone
- **Request**:
```json
{
  "code": "johnson",
  "message": "Hola drone, ¿qué ves por aquí?"
}
```
- **Response**:
```json
{
  "message": "¡Hola operador! Veo una playa tranquila con arena dorada. Hay unos acantilados al sur y un faro con luz azul intermitente. ¡Es como estar en una película de misterio!",
  "photoUrls": [],
  "timestamp": "2024-01-01T10:00:00.000Z",
  "currentRoom": "Playa Sur"
}
```

#### 2.2 Códigos Válidos Conocidos
- **Given**: Una solicitud POST con códigos válidos específicos
- **When**: Llamando a la API multiscapes
- **Then**: Retorna 200 para cada código válido
- **Requests**:
  - `{"code": "test1", "message": "Hola"}`
  - `{"code": "test2", "message": "Hola"}`
  - `{"code": "test3", "message": "Hola"}`
- **Response**: Estructura válida con respuesta del drone

#### 2.3 Validación de Estructura de Respuesta
- **Given**: Una solicitud POST con parámetros válidos
- **When**: Llamando a la API multiscapes
- **Then**: La respuesta debe contener las propiedades requeridas
- **Request**:
```json
{
  "code": "test",
  "message": "Mensaje de prueba"
}
```
- **Response Structure**:
```json
{
  "message": "Respuesta del drone", // String (respuesta generada por IA)
  "photoUrls": [],                 // Array (URLs de fotos opcionales)
  "timestamp": "2024-01-01T10:00:00.000Z", // String ISO timestamp
  "currentRoom": "Playa Sur"       // String (título de la habitación actual)
}
```

## Notas de Implementación

### Funcionalidad Principal
- Recibe mensaje del jugador
- Valida parámetros requeridos
- Guarda mensaje del jugador en base de datos
- Genera respuesta del drone usando IA
- Guarda respuesta del drone en base de datos
- Retorna respuesta al cliente

### Dependencias
- `ProcessPlayerMessage`: Caso de uso principal
- `MessageStorer`: Almacenamiento de mensajes
- `DroneResponseGenerator`: Generación de respuestas con IA
- `MessageRepository`: Acceso a datos
- `DroneDataService`: Validación del juego
- `GameStateService`: Obtener estado actual del juego

### Nuevo Campo currentRoom
- **Propósito**: Indica el título de la habitación actual donde se encuentra el jugador
- **Origen**: Se obtiene desde `gameState.currentRoom` y se traduce al título desde los archivos en `multiscapes/games-data/`
- **Formato**: String con el título legible de la habitación (ej: "Playa Sur", "Playa Sur > Playa Norte")
- **Fallback**: Si no se puede cargar el archivo de datos, usa el nombre interno de la habitación
- **Implementación**: Se añade al endpoint después de obtener la respuesta del drone

### Configuración
- Proyecto: `mansion-espiritus-lkgoxs`
- Base de datos: `miniscapes` (desarrollo y producción)
- IA: OpenAI GPT-4o-mini
