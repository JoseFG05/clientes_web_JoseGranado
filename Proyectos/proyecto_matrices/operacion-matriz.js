//Modulo principal de la calculadora  
class MatrixCalculator {
    constructor() {
        this.currentSize = 3;
        this.matrixA = [];
        this.matrixB = [];
        this.resultMatrix = [];
        
        this.initializeEventListeners();
        this.initializeExamples();
        this.generateMatrixInputs(this.currentSize);

        

    }

    //Inicializar event listeners
    initializeEventListeners() {
       
        // Configuración de tamaño
       
        document.getElementById('matrix-size').addEventListener('change', (e) => {
            this.currentSize = parseInt(e.target.value);
            this.generateMatrixInputs(this.currentSize);
        });

        // Botones de acción
        document.getElementById('generate-matrices').addEventListener('click', () => {
            this.generateMatrixInputs(this.currentSize);
        });

        document.getElementById('clear-matrices').addEventListener('click', () => {
            this.clearMatrices();
        });

        document.getElementById('random-matrices').addEventListener('click', () => {
            this.generateRandomMatrices();
        });

        // Botones de operaciones
        document.querySelectorAll('.operation-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const operation = e.target.dataset.operation;
                this.handleOperation(operation);
            });
        });

        // Operación escalar
        document.getElementById('apply-scalar').addEventListener('click', () => {
            this.performScalarMultiplication();
        });
    }

    // Generar inputs para matrices
    generateMatrixInputs(size) {
        this.generateMatrixGrid('matrix-a', size, 'A');
        this.generateMatrixGrid('matrix-b', size, 'B');
        this.clearResult();
    }

    // Generar grid de inputs para una matriz
    generateMatrixGrid(containerId, size, matrixName) {
        const container = document.getElementById(containerId);
        container.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
        container.innerHTML = '';

        for (let i = 0; i < size; i++) {
            for (let j = 0; j < size; j++) {
                const input = document.createElement('input');
                input.type = 'number';
                input.className = 'matrix-input-cell';
                input.dataset.row = i;
                input.dataset.col = j;
                input.dataset.matrix = matrixName;
                input.placeholder = '0';
                input.step = 'any';
                container.appendChild(input);
            }
        }
    }

    // Obtener valores de una matriz desde los inputs
    getMatrixValues(matrixName) {
        const inputs = document.querySelectorAll(`.matrix-input-cell[data-matrix="${matrixName}"]`);
        const size = Math.sqrt(inputs.length);
        const matrix = [];

        for (let i = 0; i < size; i++) {
            matrix[i] = [];
            for (let j = 0; j < size; j++) {
                const input = document.querySelector(`.matrix-input-cell[data-matrix="${matrixName}"][data-row="${i}"][data-col="${j}"]`);
                const value = parseFloat(input.value);
                if (isNaN(value)) {
                    throw new Error(`Por favor ingresa un valor numérico válido en la matriz ${matrixName} [${i+1},${j+1}]`);
                }
                matrix[i][j] = value;
            }
        }

        return matrix;
    }

    //Establece valores en una matriz
    setMatrixValues(matrixName, matrix) {
    console.log('setMatrixValues llamado para:', matrixName, matrix);
    
    const inputs = document.querySelectorAll(`.matrix-input-cell[data-matrix="${matrixName}"]`);
    const size = matrix.length;

    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            const input = document.querySelector(`.matrix-input-cell[data-matrix="${matrixName}"][data-row="${i}"][data-col="${j}"]`);
            if (input) {
                input.value = matrix[i][j];
            } else {
                console.error('Input no encontrado:', matrixName, i, j);
            }
        }
    }
    
    console.log('setMatrixValues completado');
}



    // Validar que una matriz esté completamente llena
    validateMatrixFilled(matrix, matrixName) {
        for (let i = 0; i < matrix.length; i++) {
            for (let j = 0; j < matrix[i].length; j++) {
                if (matrix[i][j] === undefined || matrix[i][j] === null) {
                    throw new Error(`La matriz ${matrixName} tiene celdas vacías`);
                }
            }
        }
    }

    // Limpiar todas las matrices
    clearMatrices() {
        document.querySelectorAll('.matrix-input-cell').forEach(input => {
            input.value = '';
        });
        this.clearResult();
    }

    // Generar matrices aleatorias
    generateRandomMatrices() {
        const size = this.currentSize;
        
        // Generar matriz A aleatoria
        for (let i = 0; i < size; i++) {
            for (let j = 0; j < size; j++) {
                const input = document.querySelector(`.matrix-input-cell[data-matrix="A"][data-row="${i}"][data-col="${j}"]`);
                input.value = Math.floor(Math.random() * 21) - 10; // -10 to 10
            }
        }

        // Generar matriz B aleatoria
        for (let i = 0; i < size; i++) {
            for (let j = 0; j < size; j++) {
                const input = document.querySelector(`.matrix-input-cell[data-matrix="B"][data-row="${i}"][data-col="${j}"]`);
                input.value = Math.floor(Math.random() * 21) - 10; // -10 to 10
            }
        }

        this.clearResult();
    }

    // Manejar operaciones
    handleOperation(operation) {
        try {
            this.clearResult();
            
            switch (operation) {
                case 'sum':
                    this.matrixA = this.getMatrixValues('A');
                    this.matrixB = this.getMatrixValues('B');
                    this.validateMatrixFilled(this.matrixA, 'A');
                    this.validateMatrixFilled(this.matrixB, 'B');
                    this.displayResult(this.matrixSum(this.matrixA, this.matrixB));
                    break;
                case 'subtract':
                    this.matrixA = this.getMatrixValues('A');
                    this.matrixB = this.getMatrixValues('B');
                    this.validateMatrixFilled(this.matrixA, 'A');
                    this.validateMatrixFilled(this.matrixB, 'B');
                    this.displayResult(this.matrixSubtract(this.matrixA, this.matrixB));
                    break;
                case 'multiply':
                    this.matrixA = this.getMatrixValues('A');
                    this.matrixB = this.getMatrixValues('B');
                    this.validateMatrixFilled(this.matrixA, 'A');
                    this.validateMatrixFilled(this.matrixB, 'B');
                    this.displayResult(this.matrixMultiply(this.matrixA, this.matrixB));
                    break;
                case 'scalar':
                    this.showScalarInput();
                    break;
                case 'transpose':
                    this.matrixA = this.getMatrixValues('A');
                    this.validateMatrixFilled(this.matrixA, 'A');
                    this.displayTransposeResult(this.matrixA);
                    break;
                case 'determinant':
                    this.matrixA = this.getMatrixValues('A');
                    this.validateMatrixFilled(this.matrixA, 'A');
                    this.displayDeterminant(this.matrixA);
                    break;
                case 'inverse':
                    this.matrixA = this.getMatrixValues('A');
                    this.validateMatrixFilled(this.matrixA, 'A');
                    this.displayResult(this.matrixInverse(this.matrixA));
                    break;
                case 'identity':
                    this.displayResult(this.matrixIdentity(this.currentSize));
                    break;
            }
        } catch (error) {
            this.displayError(error.message);
        }
    }

    // Mostrar entrada para escalar
    showScalarInput() {
        const scalarInput = document.getElementById('scalar-input');
        scalarInput.classList.remove('hidden');
    }

    // Realizar multiplicación por escalar
    performScalarMultiplication() {
        try {
            const scalarValue = parseFloat(document.getElementById('scalar-value').value);
            if (isNaN(scalarValue)) {
                throw new Error('Por favor ingresa un valor escalar válido');
            }

            this.matrixA = this.getMatrixValues('A');
            this.validateMatrixFilled(this.matrixA, 'A');
            const result = this.matrixScalarMultiply(this.matrixA, scalarValue);
            this.displayResult(result);
            
            // Ocultar entrada escalar
            document.getElementById('scalar-input').classList.add('hidden');
            document.getElementById('scalar-value').value = '';
        } catch (error) {
            this.displayError(error.message);
        }
    }

    

    // Suma de matrices
    matrixSum(matrixA, matrixB) {
        this.validateSameDimensions(matrixA, matrixB, 'suma');
        
        const result = [];
        const size = matrixA.length;

        for (let i = 0; i < size; i++) {
            result[i] = [];
            for (let j = 0; j < size; j++) {
                result[i][j] = matrixA[i][j] + matrixB[i][j];
            }
        }

        return result;
    }

    // Resta de matrices
    matrixSubtract(matrixA, matrixB) {
        this.validateSameDimensions(matrixA, matrixB, 'resta');
        
        const result = [];
        const size = matrixA.length;

        for (let i = 0; i < size; i++) {
            result[i] = [];
            for (let j = 0; j < size; j++) {
                result[i][j] = matrixA[i][j] - matrixB[i][j];
            }
        }

        return result;
    }

    // Multiplicación de matrices
    matrixMultiply(matrixA, matrixB) {
        this.validateMultiplicationCompatible(matrixA, matrixB);
        
        const result = [];
        const size = matrixA.length;

        for (let i = 0; i < size; i++) {
            result[i] = [];
            for (let j = 0; j < size; j++) {
                result[i][j] = 0;
                for (let k = 0; k < size; k++) {
                    result[i][j] += matrixA[i][k] * matrixB[k][j];
                }
            }
        }

        return result;
    }

    // Multiplicación por escalar
    matrixScalarMultiply(matrix, scalar) {
        const result = [];
        const size = matrix.length;

        for (let i = 0; i < size; i++) {
            result[i] = [];
            for (let j = 0; j < size; j++) {
                result[i][j] = matrix[i][j] * scalar;
            }
        }

        return result;
    }

//Tansposicion de una matriz (transpuesta)
    matrixTranspose(matrix) {
        const result = [];
        const size = matrix.length;

        for (let i = 0; i < size; i++) {
            result[i] = [];
            for (let j = 0; j < size; j++) {
                result[i][j] = matrix[j][i];
            }
        }

        return result;
    }

    // Mostrar matriz original y transpuesta simultáneamente
displayTransposeResult(matrix) {
    try {
        this.clearResult();
        
        const originalContainer = document.getElementById('original-matrix-container');
        const singleContainer = document.getElementById('single-result-container');
        
        // Calcular la transpuesta primero y verificar que funcione
        const transposeResult = this.matrixTranspose(matrix);
        
        // Verificar que se calculó correctamente
        if (!transposeResult || !Array.isArray(transposeResult)) {
            throw new Error('Error al calcular la matriz transpuesta');
        }
        
        // Ocultar contenedor único y mostrar comparación
        singleContainer.style.display = 'none';
        originalContainer.classList.remove('hidden');
        
        // Mostrar matriz original
        const originalMatrixElement = document.getElementById('original-matrix');
        const size = matrix.length;
        
        originalMatrixElement.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
        originalMatrixElement.innerHTML = '';
        
        for (let i = 0; i < size; i++) {
            for (let j = 0; j < size; j++) {
                const cell = document.createElement('div');
                cell.className = 'result-cell';
                cell.textContent = this.formatNumber(matrix[i][j]);
                originalMatrixElement.appendChild(cell);
            }
        }
        
        // Mostrar matriz transpuesta
        const transposeMatrixElement = document.getElementById('transpose-result');
        
        transposeMatrixElement.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
        transposeMatrixElement.innerHTML = '';
        
        for (let i = 0; i < size; i++) {
            for (let j = 0; j < size; j++) {
                const cell = document.createElement('div');
                cell.className = 'result-cell';
                cell.style.background = '#e8f4f8';
                cell.textContent = this.formatNumber(transposeResult[i][j]);
                transposeMatrixElement.appendChild(cell);
            }
        }
    } catch (error) {
        this.displayError('Error en transposición: ' + error.message);
    }
}

    // Determinante de matriz (método de eliminación gaussiana)
    matrixDeterminant(matrix) {
        const size = matrix.length;
        
        if (size === 1) {
            return matrix[0][0];
        }
        
        if (size === 2) {
            return matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0];
        }

        // Para matrices 3x3 o mayores, usar método de eliminación gaussiana
        return this.gaussianDeterminant(matrix);
    }

    // Método de eliminación gaussiana para determinante
    gaussianDeterminant(matrix) {
        const n = matrix.length;
        let det = 1;
        const tempMatrix = this.matrixCopy(matrix);

        for (let i = 0; i < n; i++) {
            // Encontrar pivote
            let pivot = i;
            for (let j = i + 1; j < n; j++) {
                if (Math.abs(tempMatrix[j][i]) > Math.abs(tempMatrix[pivot][i])) {
                    pivot = j;
                }
            }

            if (pivot !== i) {
                // Intercambiar filas
                [tempMatrix[i], tempMatrix[pivot]] = [tempMatrix[pivot], tempMatrix[i]];
                det *= -1; // Cambio de signo por intercambio de filas
            }

            if (Math.abs(tempMatrix[i][i]) < 1e-10) {
                return 0; // Matriz singular
            }

            det *= tempMatrix[i][i];

            // Eliminación
            for (let j = i + 1; j < n; j++) {
                const factor = tempMatrix[j][i] / tempMatrix[i][i];
                for (let k = i + 1; k < n; k++) {
                    tempMatrix[j][k] -= factor * tempMatrix[i][k];
                }
            }
        }

        return det;
    }

    // Matriz inversa (método de Gauss-Jordan)
    matrixInverse(matrix) {
        const det = this.matrixDeterminant(matrix);
        if (Math.abs(det) < 1e-10) {
            throw new Error('La matriz no es invertible (determinante = 0)');
        }

        const size = matrix.length;
        const augmented = this.createAugmentedMatrix(matrix);
        
        // Aplicar eliminación gaussiana
        for (let i = 0; i < size; i++) {
           
            // Hacer 1 en la diagonal
            const pivot = augmented[i][i];
            for (let j = 0; j < 2 * size; j++) {
                augmented[i][j] /= pivot;
            }

            // Hacer 0 en otras filas
            for (let k = 0; k < size; k++) {
                if (k !== i) {
                    const factor = augmented[k][i];
                    for (let j = 0; j < 2 * size; j++) {
                        augmented[k][j] -= factor * augmented[i][j];
                    }
                }
            }
        }

        // Extraer la matriz inversa
        const inverse = [];
        for (let i = 0; i < size; i++) {
            inverse[i] = [];
            for (let j = 0; j < size; j++) {
                inverse[i][j] = augmented[i][j + size];
            }
        }

        return inverse;
    }

    // Crear matriz aumentada [A|I] para Gauss-Jordan
    createAugmentedMatrix(matrix) {
        const size = matrix.length;
        const augmented = [];

        for (let i = 0; i < size; i++) {
            augmented[i] = [];
            for (let j = 0; j < size; j++) {
                augmented[i][j] = matrix[i][j];
            }
            for (let j = size; j < 2 * size; j++) {
                augmented[i][j] = (j - size === i) ? 1 : 0;
            }
        }

        return augmented;
    }

    // Matriz identidad
    matrixIdentity(size) {
        const result = [];
        for (let i = 0; i < size; i++) {
            result[i] = [];
            for (let j = 0; j < size; j++) {
                result[i][j] = i === j ? 1 : 0;
            }
        }
        return result;
    }

    

    validateSameDimensions(matrixA, matrixB, operation) {
        if (matrixA.length !== matrixB.length || matrixA[0].length !== matrixB[0].length) {
            throw new Error(`Las matrices deben tener las mismas dimensiones para la ${operation}`);
        }
    }

    validateMultiplicationCompatible(matrixA, matrixB) {
        if (matrixA[0].length !== matrixB.length) {
            throw new Error('El número de columnas de A debe ser igual al número de filas de B');
        }
    }

    // Copiar matriz
    matrixCopy(matrix) {
        return matrix.map(row => [...row]);
    }

    

    // Mostrar resultado para operaciones normales
displayResult(matrix) {
    this.clearResult();
    
    const originalContainer = document.getElementById('original-matrix-container');
    const singleContainer = document.getElementById('single-result-container');
    const resultContainer = document.getElementById('result-matrix');
    const size = matrix.length;
    
    // Ocultar comparación y mostrar contenedor único
    originalContainer.classList.add('hidden');
    singleContainer.style.display = 'block';
    
    resultContainer.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
    resultContainer.className = 'result-matrix';
    resultContainer.innerHTML = '';
    
    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            const cell = document.createElement('div');
            cell.className = 'result-cell';
            cell.textContent = this.formatNumber(matrix[i][j]);
            resultContainer.appendChild(cell);
        }
    }
}

    // Mostrar determinante
    displayDeterminant(matrix) {
        this.clearResult();
        
        const determinant = this.matrixDeterminant(matrix);
        const resultContainer = document.getElementById('result-matrix');
        
        resultContainer.innerHTML = `
            <div class="success">
                <strong>det(A) = ${this.formatNumber(determinant)}</strong>
            </div>
        `;
    }

    // Formatear número (evitar notación científica y decimales largos)
    formatNumber(num) {
        if (Math.abs(num) < 1e-10) return '0';
        if (Math.abs(num) < 1e-4 || Math.abs(num) > 1e4) {
            return num.toExponential(4);
        }
        return Math.round(num * 10000) / 10000;
    }

    // Mostrar error
    displayError(message) {
        this.clearResult();
        
        const errorElement = document.getElementById('error-message');
        errorElement.textContent = message;
        errorElement.classList.remove('hidden');
    }

   // Limpiar resultados
clearResult() {
    document.getElementById('result-matrix').innerHTML = '';
    document.getElementById('original-matrix').innerHTML = '';
    document.getElementById('transpose-result').innerHTML = '';
    document.getElementById('error-message').classList.add('hidden');
    document.getElementById('error-message').textContent = '';
    document.getElementById('scalar-input').classList.add('hidden');
    document.getElementById('original-matrix-container').classList.add('hidden');
    document.getElementById('single-result-container').style.display = 'block';
}

// Inicializar carga de ejemplos
initializeExamples() {
    const loadExamplesBtn = document.getElementById('load-examples');
    
    if (loadExamplesBtn) {
        loadExamplesBtn.addEventListener('click', () => {
            this.showExamplesMenu();
        });
    } else {
        console.error('Botón load-examples no encontrado');
    }
}

// Mostrar menú de ejemplos
showExamplesMenu() {
    // Crear menú directamente sin verificar si existe
    this.createExamplesMenu();
}

// Crear menú de ejemplos
createExamplesMenu() {
    
    // Crear contenedor del menú
    const menu = document.createElement('div');
    menu.id = 'examples-menu';
    menu.className = 'examples-menu show';
    menu.innerHTML = `
        <button class="example-option" data-example="identity-3">Matriz Identidad 3x3</button>
        <button class="example-option" data-example="invertible-2">Matriz Invertible 2x2</button>
        <button class="example-option" data-example="singular-2">Matriz Singular 2x2</button>
        <button class="example-option" data-example="symmetric-3">Matriz Simétrica 3x3</button>
        <button class="example-option" data-example="diagonal-3">Matriz Diagonal 3x3</button>
        <button class="example-option" data-example="multiplication-test">Prueba Multiplicación</button>
        <button class="example-option" data-example="determinant-test">Prueba Determinante</button>
    `;

    // Posicionar el menú debajo del botón
    const loadExamplesBtn = document.getElementById('load-examples');
    const rect = loadExamplesBtn.getBoundingClientRect();
    menu.style.position = 'absolute';
    menu.style.left = rect.left + 'px';
    menu.style.top = (rect.bottom + 5) + 'px';

    // Agregar al documento
    document.body.appendChild(menu);

    // Agregar event listeners
    menu.querySelectorAll('.example-option').forEach(option => {
        option.addEventListener('click', (e) => {
            const exampleType = e.target.dataset.example;
            this.loadExample(exampleType);
            this.hideExamplesMenu();
        });
    });

    
    setTimeout(() => {
        document.addEventListener('click', this.closeMenuOnClickOutside.bind(this));
    }, 100);
}

// Cerrar menú al hacer clic fuera
closeMenuOnClickOutside(e) {
    const menu = document.getElementById('examples-menu');
    const loadExamplesBtn = document.getElementById('load-examples');
    
    if (menu && !menu.contains(e.target) && e.target !== loadExamplesBtn) {
        this.hideExamplesMenu();
    }
}

// Ocultar menú de ejemplos
hideExamplesMenu() {
    const menu = document.getElementById('examples-menu');
    if (menu) {
        menu.remove();
        document.removeEventListener('click', this.closeMenuOnClickOutside);
    }
}

// Cargar ejemplo específico
loadExample(exampleType) {
    console.log('Intentando cargar ejemplo:', exampleType); // Debug
    
    try {
        this.clearMatrices();
        this.clearResult();

        let matrixA = [];
        let matrixB = [];

        console.log('Tipo de ejemplo:', exampleType); // Debug

        switch (exampleType) {
            case 'identity-3':
                console.log('Cargando identidad 3x3'); // Debug
                this.currentSize = 3;
                this.generateMatrixInputs(3);
                matrixA = this.matrixIdentity(3);
                this.setMatrixValues('A', matrixA);
                break;

            case 'invertible-2':
                console.log('Cargando invertible 2x2'); // Debug
                this.currentSize = 2;
                this.generateMatrixInputs(2);
                matrixA = [[2, 1], [1, 2]]; // det = 3
                this.setMatrixValues('A', matrixA);
                break;

            case 'singular-2':
                console.log('Cargando singular 2x2'); // Debug
                this.currentSize = 2;
                this.generateMatrixInputs(2);
                matrixA = [[1, 2], [2, 4]]; // det = 0
                this.setMatrixValues('A', matrixA);
                break;

            case 'symmetric-3':
                console.log('Cargando simétrica 3x3'); // Debug
                this.currentSize = 3;
                this.generateMatrixInputs(3);
                matrixA = [[1, 2, 3], [2, 4, 5], [3, 5, 6]];
                this.setMatrixValues('A', matrixA);
                break;

            case 'diagonal-3':
                console.log('Cargando diagonal 3x3'); // Debug
                this.currentSize = 3;
                this.generateMatrixInputs(3);
                matrixA = [[2, 0, 0], [0, 3, 0], [0, 0, 4]];
                this.setMatrixValues('A', matrixA);
                break;

            case 'multiplication-test':
                console.log('Cargando multiplicación test'); // Debug
                this.currentSize = 2;
                this.generateMatrixInputs(2);
                matrixA = [[1, 2], [3, 4]];
                matrixB = [[2, 0], [1, 2]];
                this.setMatrixValues('A', matrixA);
                this.setMatrixValues('B', matrixB);
                break;

            case 'determinant-test':
                console.log('Cargando determinante test'); // Debug
                this.currentSize = 3;
                this.generateMatrixInputs(3);
                matrixA = [[1, 2, 3], [0, 1, 4], [5, 6, 0]]; // det = 1
                this.setMatrixValues('A', matrixA);
                break;

            default:
                console.log('Ejemplo no reconocido:', exampleType); // Debug
                throw new Error('Tipo de ejemplo no reconocido');
        }

        // Actualizar selector de tamaño
        document.getElementById('matrix-size').value = this.currentSize;

        // Mostrar mensaje de éxito
        console.log('Ejemplo cargado exitosamente'); // Debug
        this.displaySuccess(`Ejemplo "${this.getExampleName(exampleType)}" cargado correctamente`);

    } catch (error) {
        console.error('Error al cargar ejemplo:', error); // Debug
        this.displayError('Error al cargar el ejemplo: ' + error.message);
    }
}

// Obtener nombre  del ejemplo
getExampleName(exampleType) {
    const names = {
        'identity-3': 'Matriz Identidad 3x3',
        'invertible-2': 'Matriz Invertible 2x2',
        'singular-2': 'Matriz Singular 2x2',
        'symmetric-3': 'Matriz Simétrica 3x3',
        'diagonal-3': 'Matriz Diagonal 3x3',
        'multiplication-test': 'Prueba de Multiplicación',
        'determinant-test': 'Prueba de Determinante'
    };
    return names[exampleType] || 'Ejemplo';
}

// Mostrar mensaje de éxito
displaySuccess(message) {
    this.clearResult();
    
    const resultContainer = document.getElementById('result-matrix');
    resultContainer.innerHTML = `
        <div class="success">
            <strong>${message}</strong>
        </div>
    `;
}

    

    

}

// Inicializar la calculadora cuando se carga la página
document.addEventListener('DOMContentLoaded', () => {
    new MatrixCalculator();
});