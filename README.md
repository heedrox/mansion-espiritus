# La Mansión de los Espíritus

Cierra la puerta del infierno antes de que los demonios se apoderen de esta dimensión. Explora la Mansión, resuelve puzzles y salva a la humanidad.

Un juego aventura conversacional en desarrollo que utiliza IA.
Anteriormente, usaba Google Assistant dialogflow, pero está todo deprecado.

## Desarrollo

Desarrollado a través del sistema SCURE: ¡Define todo el juego a través de un JSON en javascript!

En este caso, el JSON es: https://github.com/heedrox/mansion-espiritus/blob/master/app/data/data-es.js

SCURE: https://github.com/heedrox/scure

## Testing

El proyecto incluye tests unitarios y tests de IA para validar el comportamiento del sistema.

### Tests Rápidos
```bash
npm test                    # Todos los tests
npm run single-test -- archivo.spec.js # un unico test
npm run test:ai            # Solo tests de IA
npm run test:ci            # Script de CI/CD
```

### Tests de IA
Los tests de IA validan el comportamiento del `DroneResponseGenerator` usando validación de características:

```javascript
await DroneResponseValidator.validateCharacteristic(
    response, 
    'Menciona estar en la playa sur'
);
```

Ver [docs/TESTING.md](docs/TESTING.md) para más detalles.

## CI/CD

- **Tests**: Se ejecutan automáticamente en cada PR
- **Deploy**: Automático a Firebase Functions en `master`
- **AI Tests**: Se ejecutan si hay `OPEN_AI_KEY` configurado

