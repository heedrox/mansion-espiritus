# Conversaciones del Dron Johnson

## Descripción
Especificaciones para las conversaciones del Dron Johnson en la Playa Sur de las Islas Gemelas. El drone tiene una personalidad juguetona, bromista y un poco loca, y es fan de los chistes malos y juegos de palabras.

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
  - **Ubicación**: Menciona que está en la Playa Sur de las Islas Gemelas
  - **Elementos visibles**: Describe arena dorada, acantilados al sur, faro con luz azul
  - **Barrera**: Menciona la barrera electromagnética al norte
  - **Tono**: Juguetón y entusiasta
  - **Emojis**: Incluye al menos un emoji
  - **Personalidad**: Comentario divertido sobre la situación

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
  - **Contexto**: Menciona que es zona restringida
  - **Elementos clave**: Arena dorada, acantilados, faro, barrera
  - **Disposición**: Expresa estar listo para explorar
  - **Tono**: Entusiasta y misterioso
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
  - **Saludo**: Responde al saludo del operador
  - **Ubicación**: Menciona Playa Sur de las Islas Gemelas
  - **Misión**: Hace referencia a la exploración del misterio
  - **Radiación**: Menciona la radiación de las islas
  - **Tono**: Alegre y bromista
  - **Emojis**: Incluye emoji apropiado

## Notas de Implementación

### Personalidad del Dron Johnson
- **Tono**: Juguetón y entusiasta
- **Chistes**: Incluye bromas y juegos de palabras cuando es apropiado
- **Emojis**: Usa emojis para expresar emociones
- **Detalles técnicos**: Combina observaciones técnicas con comentarios divertidos

### Elementos Visibles en la Playa Sur
- **Arena dorada**: Playa tranquila
- **Acantilados al sur**: Altos y erosionados
- **Faro**: Negro con luz azul intermitente
- **Barrera electromagnética**: Al norte, bloquea el paso
- **Teclado alfanumérico**: Semienterrado en la arena
- **Signos extraños**: Grabados en la roca del acantilado

### Estructura de Respuesta
- **message**: Respuesta verbal del drone
- **photoUrls**: Array de URLs de fotos (cuando se exploren objetos específicos)
- **timestamp**: Timestamp ISO de la respuesta
