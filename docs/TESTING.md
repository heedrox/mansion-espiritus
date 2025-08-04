# Testing Guide

## Overview

Este proyecto incluye tests unitarios y tests de IA para validar el comportamiento del sistema, especialmente el `DroneResponseGenerator`.

## Test Structure

### Tests Unitarios
- **Ubicación**: `test/**/*.spec.js`
- **Framework**: Mocha + Chai
- **Ejecución**: `npm test`

### Tests de IA
- **Ubicación**: `test/multiscapes/domain/DroneResponseGenerator.spec.js`
- **Validador**: `test/multiscapes/domain/DroneResponseValidator.js`
- **Ejecución**: `npm run test:ai`

## AI Testing

### DroneResponseValidator

El `DroneResponseValidator` usa IA para validar características de las respuestas del drone:

```javascript
// Validación simple
await DroneResponseValidator.validateCharacteristic(
    response, 
    'Menciona estar en la playa sur'
);

// Validación múltiple
await DroneResponseValidator.validateResponse(response, [
    'Menciona arena dorada',
    'Describe acantilados',
    'Tiene tono juguetón'
]);
```

### Características de Validación

- **Location**: Verifica que mencione la ubicación correcta
- **Environment**: Valida elementos del entorno (arena, acantilados, faro)
- **Personality**: Comprueba el tono y personalidad del drone
- **Objects**: Verifica que mencione objetos específicos

### Configuración

```bash
# Variable de entorno requerida
export OPEN_AI_KEY="tu-api-key-aqui"

# Ejecutar tests de IA
npm run test:ai

# Ejecutar todos los tests
npm test
```

## CI/CD Integration

### GitHub Actions

El proyecto incluye workflows de GitHub Actions:

- **`.github/workflows/test.yml`**: Ejecuta todos los tests
- **`.github/workflows/deploy.yml`**: Tests + Deploy a Firebase

### Script de CI

```bash
# Ejecutar script de CI localmente
npm run test:ci
```

El script de CI:
- Ejecuta tests no-AI primero
- Ejecuta tests de IA si hay API key
- Maneja timeouts automáticamente
- Continúa aunque fallen los tests de IA

### Variables de Entorno en CI

```yaml
env:
  OPEN_AI_KEY: ${{ secrets.OPEN_AI_KEY }}
  timeout: 120000
```

## Troubleshooting

### Timeouts
- Los tests de IA pueden tardar hasta 60 segundos
- Si fallan por timeout, se saltan automáticamente
- Usar `continue-on-error: true` en CI

### API Key
- Sin API key, los tests de IA se saltan
- Los tests unitarios siguen ejecutándose
- Configurar `OPEN_AI_KEY` en GitHub Secrets

### Hilos Colgados
- El script de CI incluye cleanup automático
- Usa `process.exit(0)` después de 1 segundo
- Incluye garbage collection forzado

## Best Practices

1. **Tests Unitarios Primero**: Ejecutar tests no-AI antes que los de IA
2. **Timeouts Generosos**: 60+ segundos para tests de IA
3. **Validación Flexible**: Usar características en lugar de texto exacto
4. **Cleanup Automático**: Incluir cleanup en todos los tests de IA
5. **CI Resiliente**: Continuar aunque fallen tests de IA

## Ejemplos

### Test de Característica Simple
```javascript
it('should mention keyboard', async function() {
    this.timeout(60000);
    
    const result = await DroneResponseGenerator.generateResponse(messages);
    const validation = await DroneResponseValidator.validateCharacteristic(
        result.message, 
        'Menciona un teclado'
    );
    
    expect(validation.isValid).to.be.true;
});
```

### Test de Múltiples Características
```javascript
it('should validate environment', async function() {
    this.timeout(60000);
    
    const result = await DroneResponseGenerator.generateResponse(messages);
    const validation = await DroneResponseValidator.validateEnvironment(result.message);
    
    expect(validation.isValid).to.be.true;
});
``` 