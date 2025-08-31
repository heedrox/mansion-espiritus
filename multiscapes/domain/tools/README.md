# Tools Refactorizadas

Este directorio contiene las tools refactorizadas del `DroneResponseGenerator.js` para mejorar la organización y mantenibilidad del código.

## Estructura

```
tools/
├── index.js                 # Exporta todas las tools
├── checkCodesTool.js        # Tool para verificar códigos
├── moveToTool.js           # Tool para movimiento entre ubicaciones
├── executeActionTool.js    # Tool para ejecutar acciones del juego
└── README.md               # Este archivo
```

## Tools Disponibles

### 1. checkCodesTool
- **Función**: `createCheckCodesTool({ roomName, code })`
- **Descripción**: Verifica si un código es válido y retorna sus efectos
- **Parámetros**:
  - `roomName`: Nombre de la habitación actual
  - `code`: Código del juego
- **Retorna**: Tool configurada para verificar códigos

### 2. moveToTool
- **Función**: `createMoveToTool({ roomName, code, destinationSchema })`
- **Descripción**: Mueve el dron a una ubicación específica si está disponible
- **Parámetros**:
  - `roomName`: Nombre de la habitación actual
  - `code`: Código del juego
  - `destinationSchema`: Schema de zod para validar destinos
- **Retorna**: Tool configurada para movimiento

### 3. executeActionTool
- **Función**: `createExecuteActionTool({ roomName, code, allowedActions })`
- **Descripción**: Ejecuta una acción del juego definida en la habitación actual
- **Parámetros**:
  - `roomName`: Nombre de la habitación actual
  - `code`: Código del juego
  - `allowedActions`: Lista de acciones permitidas
- **Retorna**: Tool configurada para ejecutar acciones

## Uso

```javascript
const { 
    createCheckCodesTool, 
    createMoveToTool, 
    createExecuteActionTool 
} = require('./tools');

// Crear tools con configuración específica
const checkCodesTool = createCheckCodesTool({ roomName: 'playa-sur', code: 'test' });
const moveToTool = createMoveToTool({ 
    roomName: 'playa-sur', 
    code: 'test', 
    destinationSchema: z.enum(['playa-norte']) 
});
const executeActionTool = createExecuteActionTool({ 
    roomName: 'playa-sur', 
    code: 'test', 
    allowedActions: ['examinar', 'tocar'] 
});
```

## Beneficios de la Refactorización

1. **Separación de responsabilidades**: Cada tool tiene su propio archivo
2. **Reutilización**: Las tools pueden ser reutilizadas en otros contextos
3. **Mantenibilidad**: Es más fácil mantener y modificar cada tool individualmente
4. **Testabilidad**: Cada tool puede ser testeada de forma independiente
5. **Organización**: Código más limpio y organizado en el `DroneResponseGenerator.js`

## Migración

La refactorización mantiene la compatibilidad hacia atrás. El `DroneResponseGenerator.js` ahora usa las tools refactorizadas pero mantiene la misma funcionalidad externa.
