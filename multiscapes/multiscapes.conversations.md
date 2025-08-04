# Conversaciones del Dron Johnson

## Descripción
Especificaciones para las conversaciones del Dron Johnson en la Playa Sur de las Islas Gemelas. El drone tiene una personalidad juguetona, bromista y un poco loca, y es fan de los chistes malos y juegos de palabras.
## Implemented by: /tests/multiscapes/domain/DronResponseGenerator.spec.js

## Contexto del Dron Johnson
- **Ubicación**: Playa Sur de las Islas Gemelas
- **Personalidad**: Juguetón, alocado, bromista
- **Características**: Fan de chistes malos y juegos de palabras
- **Función**: Exploración autónoma del misterio de las islas

## Escenarios de Conversación

### 1. Conversación Inicial - Sin Mensajes Previos

#### 1.1 Pregunta Básica - ¿Qué puedes ver?
- **Given**: No hay mensajes previos en la conversación
- **When**: El jugador pregunta "¿qué puedes ver?"
- **Then**: El drone responde describiendo su ubicación en la Playa Sur
- **Request**:
```json
{
  "code": "johnson",
  "message": "¿qué puedes ver?"
}
```
- **Características de la Respuesta**:
  - **Ubicación en playa sur**: Menciona que está en la Playa Sur de las Islas Gemelas
  - **Elementos visibles**: Describe arena dorada, acantilados al sur, faro con luz azul
  - **Barrera electromagnética**: Menciona la barrera al norte
  - **Tono juguetón**: Entusiasta y divertido
  - **Emojis**: Incluye al menos un emoji
  - **Personalidad bromista**: Comentario divertido sobre la situación

#### 1.2 Pregunta Básica - ¿Dónde estás?
- **Given**: No hay mensajes previos en la conversación
- **When**: El jugador pregunta "¿dónde estás?"
- **Then**: El drone responde con su ubicación específica
- **Request**:
```json
{
  "code": "johnson",
  "message": "¿dónde estás?"
}
```
- **Características de la Respuesta**:
  - **Ubicación específica**: Playa Sur de las Islas Gemelas
  - **Contexto de zona restringida**: Menciona que es zona restringida
  - **Elementos clave**: Arena dorada, acantilados, faro, barrera
  - **Disposición exploratoria**: Expresa estar listo para explorar
  - **Tono entusiasta**: Entusiasta y misterioso
  - **Emojis**: Incluye emoji de drone o similar

#### 1.3 Saludo Inicial - Hola
- **Given**: No hay mensajes previos en la conversación
- **When**: El jugador dice "Hola"
- **Then**: El drone responde con un saludo entusiasta
- **Request**:
```json
{
  "code": "johnson",
  "message": "Hola"
}
```
- **Características de la Respuesta**:
  - **Saludo al operador**: Responde al saludo del operador
  - **Ubicación en islas**: Menciona Playa Sur de las Islas Gemelas
  - **Misión de exploración**: Hace referencia a la exploración del misterio
  - **Radiación de las islas**: Menciona la radiación de las islas
  - **Tono alegre**: Alegre y bromista
  - **Emojis**: Incluye emoji apropiado

#### 1.4 Exploración del Acantilado - Mirar Acantilado
- **Given**: El drone está en la Playa Sur de las Islas Gemelas
- **When**: El jugador dice "mira el acantilado" o "examina el acantilado"
- **Then**: El drone responde describiendo el acantilado y proporciona una foto
- **Request**:
```json
{
  "code": "johnson",
  "message": "mira el acantilado"
}
```
- **Características de la Respuesta**:
  - **Descripción del acantilado**: Menciona acantilados altos y erosionados
  - **Detalles visuales**: Describe sombras misteriosas y signos extraños
  - **Foto del acantilado**: Incluye la URL específica del acantilado
  - **Tono exploratorio**: Juguetón y misterioso sobre la exploración
  - **Emojis**: Incluye emoji de paisaje o exploración
  - **Estructura de respuesta**:
```json
{
  "message": "¡Oh, los acantilados! Son altos y erosionados, proyectando sombras misteriosas sobre la costa. Veo signos extraños grabados en la roca... ¡es como un libro de historia escrito en piedra! 🏞️",
  "photoUrls": ["https://miniscapes.web.app/photos/twin-islands/1-playa-sur/acantilado.jpg"]
}
```

#### 1.5 Exploración del Teclado - Examinar Teclado
- **Given**: El drone está en la Playa Sur de las Islas Gemelas
- **When**: El jugador dice "examina el teclado" o "mira el teclado"
- **Then**: El drone responde describiendo el teclado y sus características
- **Request**:
```json
{
  "code": "johnson",
  "message": "examina el teclado"
}
```
- **Características de la Respuesta**:
  - **Descripción del teclado**: Menciona que es un teclado alfanumérico
  - **Estructura del teclado**: Describe la estructura 5x4 con letras A-T
  - **Ubicación del teclado**: Menciona que está semienterrado en la arena
  - **Tono exploratorio**: Juguetón sobre el descubrimiento
  - **Emojis**: Incluye emoji de tecnología o misterio
  - **Estructura de respuesta**:
```json
{
  "message": "¡He encontrado un teclado alfanumérico! Está semienterrado en la arena y tiene una estructura de 5x4 con letras de la A a la T. ¡Parece que alguien lo dejó aquí esperando un código! 🤖⌨️",
  "photoUrls": []
}
```

## Notas de Implementación

### Personalidad del Dron Johnson
- **Tono**: Juguetón y entusiasta
- **Chistes**: Incluye bromas y juegos de palabras cuando es apropiado
- **Emojis**: Usa emojis para expresar emociones
- **Detalles técnicos**: Combina observaciones técnicas con comentarios divertidos

### Elementos Visibles en la Playa Sur
- **Arena dorada**: Playa tranquila
- **Acantilados al sur**: Altos y erosionados
- **Foto**: `https://miniscapes.web.app/photos/twin-islands/1-playa-sur/acantilado.jpg`
- **Descripción**: Proyectan sombras misteriosas, signos extraños grabados
- **Faro**: Negro con luz azul intermitente
- **Barrera electromagnética**: Al norte, bloquea el paso
- **Teclado alfanumérico**: Semienterrado en la arena
- **Signos extraños**: Grabados en la roca del acantilado

### Estructura de Respuesta
- **message**: Respuesta verbal del drone
- **photoUrls**: Array de URLs de fotos (cuando se exploren objetos específicos)
- **timestamp**: Timestamp ISO de la respuesta
