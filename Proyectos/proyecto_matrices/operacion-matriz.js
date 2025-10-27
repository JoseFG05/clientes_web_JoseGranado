 
class MatrixCalculator {
    constructor() {
        this.currentSize = 3;
        this.matrixA = [];
        this.matrixB = [];
        this.resultMatrix = [];
        
        this.initializeEventListeners();
        this.generateMatrixInputs(this.currentSize);
    }

    
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
}

// Inicializar la calculadora cuando se carga la página
document.addEventListener('DOMContentLoaded', () => {
    new MatrixCalculator();
});