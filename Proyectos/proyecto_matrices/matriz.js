// Módulo principal de la calculadora de matrices
class MatrixCalculator {
    constructor() {
        this.currentSize = 3;
        this.matrixA = [];
        this.matrixB = [];
        this.resultMatrix = [];
        
        this.initializeEventListeners();
        this.generateMatrixInputs(this.currentSize);
    }

    // Inicializar event listeners
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
                const value = parseFloat(input.value) || 0;
                matrix[i][j] = value;
            }
        }

        return matrix;
    }

    // Establecer valores en una matriz
    setMatrixValues(matrixName, matrix) {
        const inputs = document.querySelectorAll(`.matrix-input-cell[data-matrix="${matrixName}"]`);
        const size = matrix.length;

        for (let i = 0; i < size; i++) {
            for (let j = 0; j < size; j++) {
                const input = document.querySelector(`.matrix-input-cell[data-matrix="${matrixName}"][data-row="${i}"][data-col="${j}"]`);
                if (input) {
                    input.value = matrix[i][j];
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
            this.matrixA = this.getMatrixValues('A');
            this.matrixB = this.getMatrixValues('B');

            switch (operation) {
                case 'sum':
                    this.displayResult(this.matrixSum(this.matrixA, this.matrixB));
                    break;
                case 'subtract':
                    this.displayResult(this.matrixSubtract(this.matrixA, this.matrixB));
                    break;
                case 'multiply':
                    this.displayResult(this.matrixMultiply(this.matrixA, this.matrixB));
                    break;
                case 'scalar':
                    this.showScalarInput();
                    break;
                case 'transpose':
                    this.displayResult(this.matrixTranspose(this.matrixA));
                    break;
                case 'determinant':
                    this.displayDeterminant(this.matrixA);
                    break;
                case 'inverse':
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
            const result = this.matrixScalarMultiply(this.matrixA, scalarValue);
            this.displayResult(result);
            
            // Ocultar entrada escalar
            document.getElementById('scalar-input').classList.add('hidden');
            document.getElementById('scalar-value').value = '';
        } catch (error) {
            this.displayError(error.message);
        }
    }

    // OPERACIONES BÁSICAS DE MATRICES (para implementar en commits posteriores)

    matrixSum(matrixA, matrixB) {
        // Validar dimensiones
        if (matrixA.length !== matrixB.length || matrixA[0].length !== matrixB[0].length) {
            throw new Error('Las matrices deben tener las mismas dimensiones para la suma');
        }

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

    matrixSubtract(matrixA, matrixB) {
        // Validar dimensiones
        if (matrixA.length !== matrixB.length || matrixA[0].length !== matrixB[0].length) {
            throw new Error('Las matrices deben tener las mismas dimensiones para la resta');
        }

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

    matrixMultiply(matrixA, matrixB) {
        // Validar dimensiones
        if (matrixA[0].length !== matrixB.length) {
            throw new Error('El número de columnas de A debe ser igual al número de filas de B');
        }

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

    matrixDeterminant(matrix) {
        // Implementación básica para 2x2 y 3x3
        const size = matrix.length;
        
        if (size === 2) {
            return matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0];
        } else if (size === 3) {
            return matrix[0][0] * (matrix[1][1] * matrix[2][2] - matrix[1][2] * matrix[2][1]) -
                   matrix[0][1] * (matrix[1][0] * matrix[2][2] - matrix[1][2] * matrix[2][0]) +
                   matrix[0][2] * (matrix[1][0] * matrix[2][1] - matrix[1][1] * matrix[2][0]);
        } else {
            // Para matrices más grandes, devolver 0 por ahora
            // Se implementará en commits posteriores
            return 0;
        }
    }

    matrixInverse(matrix) {
        const det = this.matrixDeterminant(matrix);
        if (det === 0) {
            throw new Error('La matriz no es invertible (determinante = 0)');
        }

        // Por ahora, devolver matriz identidad como placeholder
        // Se implementará completamente en commits posteriores
        return this.matrixIdentity(matrix.length);
    }

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

    // Mostrar resultado
    displayResult(matrix) {
        this.clearResult();
        
        const resultContainer = document.getElementById('result-matrix');
        const size = matrix.length;
        
        resultContainer.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
        resultContainer.className = 'result-matrix';
        
        for (let i = 0; i < size; i++) {
            for (let j = 0; j < size; j++) {
                const cell = document.createElement('div');
                cell.className = 'result-cell';
                cell.textContent = matrix[i][j].toFixed(4);
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
                <strong>det(A) = ${determinant.toFixed(4)}</strong>
            </div>
        `;
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
        document.getElementById('error-message').classList.add('hidden');
        document.getElementById('error-message').textContent = '';
    }
}

// Inicializar la calculadora cuando se carga la página
document.addEventListener('DOMContentLoaded', () => {
    new MatrixCalculator();
});
