# Calculadora de Matrices Interactiva

##  Descripción del Proyecto

Calculadora web interactiva que permite realizar operaciones matemáticas con matrices cuadradas de tamaño n×n (donde 2 ≤ n ≤ 10). Desarrollada con HTML, CSS y JavaScript vanilla, implementando algoritmos matemáticos precisos y proporcionando una interfaz de usuario intuitiva y responsive.

##  Características

### Operaciones Implementadas
-  **Suma de matrices (A + B)** - Con validación de dimensiones
-  **Resta de matrices (A - B)** - Con validación de dimensiones  
-  **Multiplicación de matrices (A × B)** - Con validación de compatibilidad
-  **Multiplicación por escalar (k × A)** - Soporta enteros y decimales
- **Transposición de matriz (Aᵀ)** - Muestra matriz original y transpuesta
-  **Determinante de matriz (det(A))** - Para matrices 2×2 hasta 10×10
-  **Matriz inversa (A⁻¹)** - Con método de Gauss-Jordan
-  **Matriz identidad (Iₙ)** - Generación automática

### Funcionalidades de Entrada
-  **Entrada manual** - Campos organizados en grid
-  **Generación aleatoria** - Números entre -10 y 10
-  **Carga de ejemplos** - 7 ejemplos predefinidos
-  **Limpieza** - Botón para resetear todas las entradas

### Validaciones
-  **Validación numérica** - Enteros y decimales
-  **Validación de dimensiones** - Para operaciones compatibles
-  **Manejo de errores** - Mensajes claros al usuario



##  Instrucciones de Uso

### Configuración Inicial
1. Selecciona el tamaño de matriz deseado (2×2 a 10×10)
2. Haz clic en "Generar Matrices" para crear los inputs

### Entrada de Datos
**Método Manual:**
- Ingresa valores numéricos en los campos de Matriz A y/o Matriz B
- Soporta números enteros y decimales

**Método Rápido:**
- **Matrices Aleatorias:** Genera valores aleatorios entre -10 y 10
- **Cargar Ejemplos:** Selecciona entre 7 ejemplos predefinidos

### Realizar Operaciones
1. **Operaciones básicas:** Haz clic en los botones de operación (A+B, A-B, A×B)
2. **Operaciones unarias:** Selecciona solo Matriz A para transpuesta, determinante o inversa
3. **Multiplicación escalar:** 
   - Haz clic en "k × A"
   - Ingresa el valor escalar
   - Haz clic en "Aplicar"

### Ejemplos Predefinidos
- **Matriz Identidad 3×3** - Para operaciones básicas
- **Matriz Invertible 2×2** - Para probar matriz inversa (det ≠ 0)
- **Matriz Singular 2×2** - Para probar manejo de no-invertibles (det = 0)
- **Matriz Simétrica 3×3** - Para probar propiedades especiales
- **Matriz Diagonal 3×3** - Para operaciones con matrices diagonales
- **Prueba Multiplicación** - Ejemplo específico para verificar A×B
- **Prueba Determinante** - Ejemplo con determinante conocido (=1)

##  Ejemplos de Uso

### Ejemplo 1: Suma de Matrices
Matriz A = [1, 2] Matriz B = [5, 6]
[3, 4] [7, 8]

A + B = [6, 8]
[10, 12]


### Ejemplo 2: Determinante

Matriz A = [1, 2]
[3, 4]

det(A) = (1×4) - (2×3) = -2


### Ejemplo 3: Matriz Inversa

Matriz A = [2, 1]
[1, 2]

A⁻¹ = [ 2/3, -1/3]
[-1/3, 2/3]


##  Estructura de Archivos

### index.html

- Secciones organizadas: configuración, entrada, operaciones, resultados
- Formularios accesibles y responsive

### style.css
- Diseño  con CSS Grid y Flexbox
- Estilos modernos con efectos hover y focus
- Compatibilidad con telefonos


### operaciones-matriz.js
- **Clase MatrixCalculator** - Lógica principal de la aplicación
- **Algoritmos matemáticos** - Implementaciones eficientes
- **Manejo de eventos** - Interacción con el usuario
- **Validaciones** - Control de errores y entradas

Autor: Jose Granado CI:27.714.265



