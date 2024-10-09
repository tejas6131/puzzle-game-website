const urlParams = new URLSearchParams(window.location.search);
const selectedImage = urlParams.get('img');

const imagePath = `images/${selectedImage}.jpg`;

// Puzzle setup
const piecesContainer = document.getElementById('pieces-container');
const puzzleImageDiv = document.getElementById('puzzle-image');

// Grid dimensions
const gridSize = 6; // 6 rows and 6 columns
const totalPieces = gridSize * gridSize; // Total number of pieces
const pieceSize = 80; // Size of each piece (width and height)

// Create a shuffled array of indices
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]]; // Swap elements
    }
    return array;
}

// Create puzzle pieces
function createPuzzlePieces() {
    const indices = Array.from(Array(totalPieces).keys()); // Create an array of indices [0, 1, 2, ..., 35]
    const shuffledIndices = shuffleArray(indices); // Shuffle the indices

    shuffledIndices.forEach(i => {
        const piece = document.createElement('div');
        piece.classList.add('puzzle-piece');
        piece.style.width = `${pieceSize}px`;
        piece.style.height = `${pieceSize}px`;
        piece.style.backgroundImage = `url(${imagePath})`;
        piece.style.backgroundSize = `${gridSize * pieceSize}px ${gridSize * pieceSize}px`; // Set background size to original image
        piece.style.backgroundPosition = `-${(i % gridSize) * pieceSize}px -${Math.floor(i / gridSize) * pieceSize}px`;
        piece.setAttribute('draggable', true);
        piece.dataset.index = i; // Store index for placement

        piece.ondragstart = (e) => {
            e.dataTransfer.setData('text/plain', piece.dataset.index);
        };

        piecesContainer.appendChild(piece);
    });
}

// Create grid for the puzzle
function createPuzzleGrid() {
    for (let i = 0; i < totalPieces; i++) {
        const dropZone = document.createElement('div');
        dropZone.classList.add('drop-zone');
        dropZone.style.width = `${pieceSize}px`;
        dropZone.style.height = `${pieceSize}px`;
        dropZone.style.position = 'relative';
        dropZone.dataset.index = i; // Store correct index for each drop zone

        dropZone.ondragover = (e) => {
            e.preventDefault();
        };

        dropZone.ondrop = (e) => {
            e.preventDefault();
            const pieceIndex = e.dataTransfer.getData('text/plain');
            const piece = document.querySelector(`.puzzle-piece[data-index="${pieceIndex}"]`);

            // Check if the drop zone already has a piece
            if (dropZone.childElementCount === 0 && piece) {
                dropZone.appendChild(piece);
                piece.style.position = 'absolute';
                piece.style.left = '0';
                piece.style.top = '0';

                checkCompletion();
            }
        };

        puzzleImageDiv.appendChild(dropZone);
    }
}

// Check for completion
function checkCompletion() {
    const pieces = document.querySelectorAll('.puzzle-piece');
    let allInPlace = true;

    pieces.forEach(piece => {
        const pieceIndex = piece.dataset.index;
        const dropZone = piece.parentNode;

        // Check if the piece is in the correct drop zone
        if (dropZone.dataset.index !== pieceIndex) {
            allInPlace = false;
        }
    });

    if (allInPlace) {
        document.getElementById('message').innerText = "Congratulations! You've completed the puzzle!";
        celebrate();
        // Remove gaps from the grid
        puzzleImageDiv.classList.add('completed');
    }
}

// Celebration animation function
function celebrate() {
    document.body.style.backgroundColor = "yellow"; // Change background color
    setTimeout(() => {
        document.body.style.backgroundColor = "#f4f4f4"; // Reset after a while
    }, 2000);
}

// Call the functions to create pieces and grid
createPuzzlePieces();
createPuzzleGrid();
