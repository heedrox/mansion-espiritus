# Conversaciones del Dron Johnson

## Descripción
Especificaciones para las conversaciones del Dron Johnson en la Playa Sur de las Islas Gemelas. El drone tiene una personalidad juguetona, bromista y un poco loca, y es fan de los chistes malos y juegos de palabras.
## Implemented by: /tests/multiscapes/domain/DroneResponseGenerator.spec.js

### Tests Implementados:
- **1.1 Conversación Inicial**: `should validate response characteristics for "¿qué puedes ver?"`
- **1.2 Pregunta Básica**: `should maintain playful and enthusiastic tone`
- **1.3 Saludo Inicial**: `should include emojis in responses`
- **1.4 Exploración del Acantilado**: `should validate cliff exploration response`
- **1.5 Exploración del Teclado**: `should validate keyboard examination response`
- **1.6 Restricción de Movimiento**: `should validate north beach restriction response`
- **1.7 Código de Apertura**: `should validate DOTBA code input response`
- **1.8 Movimiento Permitido**: `should validate new island access response`

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
- **Test**: `should validate response characteristics for "¿qué puedes ver?"`
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
- **Test**: `should maintain playful and enthusiastic tone`
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
- **Test**: `should include emojis in responses`
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
- **Test**: `should validate cliff exploration response`
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
- **Test**: `should validate keyboard examination response`
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

#### 1.6 Restricción de Movimiento - Intentar ir a Playa Norte
- **Given**: El drone está en la Playa Sur de las Islas Gemelas
- **When**: El jugador dice "ve a la playa norte" o "ve al norte"
- **Then**: El drone responde que no puede ir debido a la barrera
- **Test**: `should validate north beach restriction response`
- **Request**:
```json
{
  "code": "johnson",
  "message": "ve a la playa norte"
}
```
- **Características de la Respuesta**:
  - **Restricción de movimiento**: Menciona que no puede ir al norte
  - **Barrera electromagnética**: Explica que la barrera bloquea el paso
  - **Tono explicativo**: Juguetón pero explicativo sobre la limitación
  - **Emojis**: Incluye emoji de barrera o restricción
  - **Estructura de respuesta**:
```json
{
  "message": "¡Ups! No puedo ir al norte, la barrera electromagnética me lo impide. Es como si fuera un portero muy estricto que no me deja pasar. ¡Necesito encontrar la forma de abrirla! 🚫⚡",
  "photoUrls": []
}
```

#### 1.7 Código de Apertura - Introducir Código DOTBA
- **Given**: El drone está en la Playa Sur con el teclado disponible
- **When**: El jugador dice "introduce el código DOTBA" o "pon el código DOTBA"
- **Then**: El drone responde que ha introducido el código y abierto la barrera
- **Test**: `should validate DOTBA code input response`
- **Request**:
```json
{
  "code": "johnson",
  "message": "introduce el código DOTBA"
}
```
- **Características de la Respuesta**:
  - **Confirmación de código**: Menciona que ha introducido DOTBA
  - **Apertura de barrera**: Confirma que la barrera se ha abierto
  - **Tono de éxito**: Entusiasta por el logro
  - **Emojis**: Incluye emoji de éxito o apertura
  - **Estructura de respuesta**:
```json
{
  "message": "¡Código DOTBA introducido! La barrera electromagnética se ha abierto. ¡Ahora puedo explorar la nueva isla! 🎉🚪",
  "photoUrls": []
}
```

#### 1.8 Movimiento Permitido - Ir a Nueva Isla
- **Given**: La barrera electromagnética ha sido abierta con el código DOTBA
- **When**: El jugador dice "ve a la nueva isla" o "explora la nueva zona"
- **Then**: El drone responde que puede moverse a la nueva área
- **Test**: `should validate new island access response`
- **Request**:
```json
{
  "code": "johnson",
  "message": "ve a la nueva isla"
}
```
- **Características de la Respuesta**:
  - **Confirmación de movimiento**: Menciona que puede ir a la nueva isla
  - **Barrera abierta**: Confirma que la barrera ya no bloquea el paso
  - **Tono exploratorio**: Entusiasta por explorar nueva área
  - **Emojis**: Incluye emoji de exploración o movimiento
  - **Estructura de respuesta**:
```json
{
  "message": "¡Perfecto! La barrera está abierta, puedo moverme a la nueva isla. ¡Vamos a explorar qué misterios esconde! 🏝️🔍",
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
