# Adición de Nueva Foto de Acantilados

## Problema
El usuario solicitó añadir una nueva foto de acantilados (`acantilado-2.jpg`) a las fotos disponibles cuando se exploren los acantilados.

## Solución
Se ha añadido la nueva foto `acantilado-2.jpg` a la lista de fotos disponibles en el prompt del dron Johnson.

## Cambios Realizados

### 1. Nueva Foto de Acantilados
- **Archivo**: `multiscapes/domain/DroneResponseGenerator.js`
- **Cambio**: Añadida Foto 4 con URL `https://miniscapes.web.app/photos/twin-islands/1-playa-sur/acantilado-2.jpg`
- **Descripción**: Vista alternativa del acantilado desde otro ángulo

### 2. Actualización de Numeración
- **Vídeo**: Cambiado de "Vídeo 4" a "Vídeo 5" para mantener la secuencia correcta
- **Razón**: Ahora tenemos 4 fotos + 1 vídeo = 5 elementos totales

## Detalles de la Nueva Foto

### Foto 4: Vista alternativa del acantilado
- **URL**: `https://miniscapes.web.app/photos/twin-islands/1-playa-sur/acantilado-2.jpg`
- **Descripción**: Perspectiva diferente de los acantilados desde otro ángulo
- **Características**:
  - Formaciones rocosas más pronunciadas y grietas profundas
  - Erosión marina más evidente en esta vista
  - Diferentes capas geológicas expuestas

## Fotos Disponibles Ahora

1. **Foto 1**: Mirando al sur - `imagen-faro.jpg`
2. **Foto 2**: Mirando al norte - `playa-sur-mirando-norte.jpg`
3. **Foto 3**: Detalle del acantilado - `acantilado.jpg`
4. **Foto 4**: Vista alternativa del acantilado - `acantilado-2.jpg` ⭐ **NUEVA**
5. **Vídeo 5**: Zoom al faro - `faro-player.mp4`

## Comportamiento del Dron

Cuando el usuario explore los acantilados, el dron ahora puede elegir entre:
- La foto original del acantilado (`acantilado.jpg`)
- La nueva foto alternativa (`acantilado-2.jpg`)

Esto proporciona más variedad en las respuestas y permite mostrar diferentes perspectivas de los acantilados.

## Compatibilidad
- ✅ Mantiene todas las fotos existentes
- ✅ No afecta el comportamiento actual
- ✅ Añade más opciones para el dron
- ✅ Mejora la experiencia del usuario con más variedad visual
