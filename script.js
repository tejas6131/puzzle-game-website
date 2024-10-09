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

// Track moves for undo functionality
let moveHistory = [];
let currentMoveIndex = -1;

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
    const extraSlot = document.createElement('div');
    extraSlot.classList.add('drop-zone');
    extraSlot.style.width = `${pieceSize}px`;
    extraSlot.style.height = `${pieceSize}px`;
    extraSlot.style.position = 'relative';
    extraSlot.dataset.index = 'extra'; // Assign a unique index for the extra slot

    // Add specific styles for the extra slot
    extraSlot.style.border = '1px dashed #007bff'; // Blue border
    extraSlot.style.borderRadius = '1px'; // Rounded corners
    extraSlot.style.backgroundColor = 'lightgrey'; // Light blue background
    extraSlot.style.display = 'flex'; // Flexbox to center text
    extraSlot.style.alignItems = 'center'; // Center vertically
    extraSlot.style.justifyContent = 'center'; // Center horizontally
    extraSlot.style.marginLeft = '50px'; // Space between the extra slot and the puzzle image
    extraSlot.style.color = 'lightred'; // Text color
    extraSlot.innerText = 'Extra Slot'; // Set text content

    extraSlot.ondragover = (e) => {
        e.preventDefault();
    };

    extraSlot.ondrop = (e) => {
        e.preventDefault();
        const pieceIndex = e.dataTransfer.getData('text/plain');
        const piece = document.querySelector(`.puzzle-piece[data-index="${pieceIndex}"]`);

        // Check if the drop zone already has a piece
        if (extraSlot.childElementCount === 0 && piece) {
            extraSlot.appendChild(piece);
            piece.style.position = 'absolute';
            piece.style.left = '0';
            piece.style.top = '0';
        }
    };

    puzzleImageDiv.parentElement.prepend(extraSlot); // Add extra slot before puzzle image

    // Create drop zones for the puzzle grid
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
            }
        };

        puzzleImageDiv.appendChild(dropZone);
    }

    // For mobile users: Move pieces below puzzle container
    if (window.innerWidth <= 768) {
        // Ensure piecesContainer is styled to come below puzzleImageDiv
        piecesContainer.style.display = 'flex';
        piecesContainer.style.flexWrap = 'wrap';
        piecesContainer.style.marginTop = '20px';

        // Move piecesContainer below puzzleImageDiv in the DOM
        puzzleImageDiv.parentElement.appendChild(piecesContainer);
    }
}

// Add touch event listeners for mobile devices
function addTouchListeners() {
    const pieces = document.querySelectorAll('.puzzle-piece');

    pieces.forEach(piece => {
        piece.addEventListener('touchstart', (e) => {
            e.preventDefault();
            const touch = e.touches[0];
            piece.style.position = 'absolute';
            piece.style.left = `${touch.pageX - pieceSize / 2}px`;
            piece.style.top = `${touch.pageY - pieceSize / 2}px`;

            // Allow tapping and dropping
            piece.ontouchmove = (e) => {
                const touch = e.touches[0];
                piece.style.left = `${touch.pageX - pieceSize / 2}px`;
                piece.style.top = `${touch.pageY - pieceSize / 2}px`;
            };

            piece.ontouchend = (e) => {
                const dropZones = document.querySelectorAll('.drop-zone');
                dropZones.forEach(dropZone => {
                    const rect = dropZone.getBoundingClientRect();
                    if (touch.pageX >= rect.left && touch.pageX <= rect.right &&
                        touch.pageY >= rect.top && touch.pageY <= rect.bottom) {
                        dropZone.appendChild(piece);
                        piece.style.position = 'absolute';
                        piece.style.left = '0';
                        piece.style.top = '0';
                    }
                });
            };
        });
    });
}

// Call the functions to create pieces and grid
createPuzzlePieces();
createPuzzleGrid();
addTouchListeners();
