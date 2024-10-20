const urlParams = new URLSearchParams(window.location.search);
const selectedImage = urlParams.get('img');

const imagePath = `images/${selectedImage}.jpg`;

// Puzzle setup
const piecesContainer = document.getElementById('pieces-container');
const puzzleImageDiv = document.getElementById('puzzle-image');
const referenceImage = document.getElementById('referenceImage');

// Grid dimensions
const gridSize = 2; // Adjust as needed (e.g., 2 for a 2x2 puzzle)
const totalPieces = gridSize * gridSize; // Total number of pieces
const pieceSize = 200; // Size of each piece (width and height)

// Shuffle array
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}


// Load completion status from localStorage when the page loads
document.addEventListener("DOMContentLoaded", () => {
    for (let i = 1; i <= 24; i++) {
        const puzzleKey = `image${i}-completed`;
        const completed = localStorage.getItem(puzzleKey);

        if (completed) {
            const completedDiv = document.querySelector(`a[href="puzzle.html?img=image${i}"] .completed`);
            const hiddenSymbol = document.querySelector(`a[href="puzzle.html?img=image${i}"] .hidden-symbol`);
            if (completedDiv && hiddenSymbol) {
                completedDiv.style.display = 'block'; // Show the completed indicator
                hiddenSymbol.style.display = 'none'; // Hide the hidden symbol
            }
        }
    }
});





// Create puzzle pieces
function createPuzzlePieces() {
    const indices = Array.from(Array(totalPieces).keys());
    const shuffledIndices = shuffleArray(indices);

    shuffledIndices.forEach(i => {
        const piece = document.createElement('div');
        piece.classList.add('puzzle-piece');
        piece.style.width = `${pieceSize}px`;
        piece.style.height = `${pieceSize}px`;
        piece.style.backgroundImage = `url(${imagePath})`;
        piece.style.backgroundSize = `${gridSize * pieceSize}px ${gridSize * pieceSize}px`;
        piece.style.backgroundPosition = `-${(i % gridSize) * pieceSize}px -${Math.floor(i / gridSize) * pieceSize}px`;
        piece.setAttribute('draggable', true);
        piece.dataset.index = i;

        piece.ondragstart = (e) => {
            e.dataTransfer.setData('text/plain', piece.dataset.index);
        };

        piecesContainer.appendChild(piece);
    });
}

function checkPuzzleCompletion() {
    const dropZones = document.querySelectorAll('.drop-zone'); // Select all drop zones
    let correctPlacementCount = 0; // Counter for correctly placed pieces

    // Loop through each drop zone to check pieces
    for (let i = 0; i < totalPieces; i++) {
        const piece = dropZones[i].querySelector('.puzzle-piece'); // Get the piece in the drop zone

        if (piece && piece.dataset.index == i) {
            correctPlacementCount++; // Increment counter if piece is correctly placed
        }
    }

    // Check if all pieces are correctly placed
    if (correctPlacementCount === totalPieces) {
        // Optionally, check if the extra slot is empty
        const extraSlot = document.querySelector('.drop-zone[data-index="extra"]');
        if (extraSlot && extraSlot.childElementCount > 0) {
            return false; // Not complete if the extra slot is occupied
        }

        console.log("🎉 Congratulations! You've completed the puzzle! 🎉"); // Log completion message
        return true; // Return true for completion
    }

    return false; // Return false if not all pieces are placed correctly
}





// Show celebration message
// Show celebration message and store completion
function showCelebration() {
    const celebrationMessage = document.createElement('div');
    celebrationMessage.innerText = "🎉 Congratulations! You've completed the puzzle! 🎉";
    celebrationMessage.style.position = 'fixed';
    celebrationMessage.style.top = '50%';
    celebrationMessage.style.left = '50%';
    celebrationMessage.style.transform = 'translate(-50%, -50%)';
    celebrationMessage.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
    celebrationMessage.style.padding = '20px';
    celebrationMessage.style.borderRadius = '10px';
    celebrationMessage.style.zIndex = '1000';
    celebrationMessage.style.fontSize = '24px';
    celebrationMessage.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.5)';

    document.body.appendChild(celebrationMessage);

    setTimeout(() => {
        celebrationMessage.remove();
    }, 3000);

    // Store completion status in localStorage
    const puzzleName = selectedImage; // Use the selected image name as the puzzle identifier
    localStorage.setItem(`${puzzleName}-completed`, 'true'); // Set completion status

    const completedDiv = document.querySelector(`a[href="puzzle.html?img=${selectedImage}"] .completed`);
    const hiddenSymbol = document.querySelector(`a[href="puzzle.html?img=${selectedImage}"] .hidden-symbol`);
    if (completedDiv && hiddenSymbol) {
        completedDiv.style.display = 'block'; // Show the completed indicator
        hiddenSymbol.style.display = 'none'; // Hide the hidden symbol
    }

}

// Assuming you have a variable `selectedImage` containing the path to the chosen image
document.getElementById('reference-image').src = imagePath;


// Create puzzle grid with an extra slot
// Function to create the puzzle grid
function createPuzzleGrid() {
    // Create a container for the puzzle pieces
    const puzzleContainer = document.createElement('div');
    puzzleContainer.classList.add('puzzle-container');

    // Create the main drop zones for the puzzle pieces
    for (let i = 0; i < totalPieces; i++) {
        const dropZone = document.createElement('div');
        dropZone.classList.add('drop-zone');
        dropZone.style.width = `${pieceSize}px`;
        dropZone.style.height = `${pieceSize}px`;
        dropZone.dataset.index = i;

        dropZone.ondragover = (e) => {
            e.preventDefault();
        };

        dropZone.ondrop = (e) => {
            e.preventDefault();
            const pieceIndex = e.dataTransfer.getData('text/plain');
            const piece = document.querySelector(`.puzzle-piece[data-index="${pieceIndex}"]`);

            if (dropZone.childElementCount === 0 && piece) {
                dropZone.appendChild(piece);
                piece.style.position = 'absolute';
                piece.style.left = '0';
                piece.style.top = '0';
                checkForCompletion(); // Check for completion
            }
        };

        puzzleContainer.appendChild(dropZone); // Add drop zone to the puzzle container
    }

    // Append the puzzle container to the main puzzle area
    puzzleImageDiv.appendChild(puzzleContainer);

    // Create and style the extra slot outside the main grid
    const extraSlot = document.createElement('div');
    extraSlot.classList.add('drop-zone');
    extraSlot.style.width = `${pieceSize}px`;
    extraSlot.style.height = `${pieceSize}px`;
    extraSlot.style.position = 'relative';
    extraSlot.dataset.index = 'extra';
    extraSlot.style.border = '1px dashed #007bff';
    extraSlot.style.borderRadius = '1px';
    extraSlot.style.backgroundColor = 'lightgrey';
    extraSlot.style.display = 'flex';
    extraSlot.style.alignItems = 'center';
    extraSlot.style.justifyContent = 'center';
    extraSlot.style.marginLeft = '50px';
    extraSlot.style.marginRight = '50px';
    extraSlot.style.color = 'lightred';
    extraSlot.innerText = 'Extra Slot';

    // Allow dropping into the extra slot
    extraSlot.ondragover = (e) => {
        e.preventDefault();
    };

    extraSlot.ondrop = (e) => {
        e.preventDefault();
        const pieceIndex = e.dataTransfer.getData('text/plain');
        const piece = document.querySelector(`.puzzle-piece[data-index="${pieceIndex}"]`);

        if (extraSlot.childElementCount === 0 && piece) {
            extraSlot.appendChild(piece);
            piece.style.position = 'absolute';
            piece.style.left = '0';
            piece.style.top = '0';
            checkForCompletion(); // Check for completion
        }
    };

    // Append the extra slot to the puzzle area, outside the main grid
    puzzleImageDiv.parentElement.appendChild(extraSlot);
}


// Check for completion
function checkForCompletion() {
    if (checkPuzzleCompletion()) {
        showCelebration();
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
                        checkForCompletion(); // Check for completion after dropping
                    }
                });
            };
        });
    });
}



function checkAllPuzzlesSolved() {
    // console.log("Iam Running");
    let allSolved = true;
    for (let i = 1; i <= 24; i++) {
        console.log("Running");
        if (!localStorage.getItem(`image${i}-completed`)) {
            allSolved = false;
            break;
        }
    }

    if (allSolved) {
        const mainContent = document.querySelector('.main-content'); // Use a specific container
        mainContent.classList.add('fade-out'); // Apply fade-out only to the main content
        
        // document.body.classList.add('fade-out');
        setTimeout(displayGiftBox, 1000);
        // console.log("Complete");
    }
}

function displayGiftBox() {
    const giftBox = document.createElement('div');
    giftBox.className = 'gift-box';
    document.body.appendChild(giftBox);
    giftBox.addEventListener('click', displayLetter);
}

// Function to create confetti
function createConfetti() {
    const colors = ['#FF0B00', '#00FF00', '#00A1FF', '#FFEB3B', '#FF4081'];
    const numConfetti = 100; // Number of confetti pieces

    for (let i = 0; i < numConfetti; i++) {
        const confetti = document.createElement('div');
        confetti.classList.add('confetti');
        confetti.style.position = 'fixed';
        confetti.style.width = '10px';
        confetti.style.height = '10px';
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.opacity = Math.random();
        confetti.style.left = Math.random() * window.innerWidth + 'px';
        confetti.style.top = Math.random() * window.innerHeight + 'px';
        confetti.style.transition = 'transform 1s, opacity 1s';
        document.body.appendChild(confetti);

        // Animate confetti falling
        setTimeout(() => {
            confetti.style.transform = `translateY(${window.innerHeight}px) rotate(${Math.random() * 360}deg)`;
            confetti.style.opacity = 0;
        }, 100);

        // Remove confetti after animation
        setTimeout(() => {
            confetti.remove();
        }, 2000);
    }
}




function displayLetter() {
    const letter = document.createElement('div');
    letter.className = 'letter';
    const message = `Hello maziii Birthday Girl…….
I hope your day is spent well. And yes,, Congratulations on solving all the puzzles correctly 😂😂<br>
Okay now coming to the point…..<br>
Happy to you to yoouuuuuuuuuuuuuu…..<br>
Happy to you to yoouuuuuuuuuuuuuu…..<br>
Aaaaayyyyyyyyyyy..<br>
Happy to you to yoouuuuuuuuuuuuuu…..<br>
Mazyaaa thabduuuu cha birthday hayeeeee🥳🥳<br>
<br>
Dear Dabdu, I hope this letter finds you well , I am writing on behalf of myself 🤣🤣<br>
<br>
Bokya dodkyaa…<br>
How’s the gift???🎁<br>
<br>
Chalo lets come to the point...<br>
I was wandering since a long time ki kay karu kay karu.. and then finally I thought ki je yetai te karuya ki…..<br>
Mg I thought a lot and came up with this idea…<br>
I have worked a lottt on this ok …<br>
So mg avadla nasla tari pn avadla mhanaicha🙃<br>
<br>
Well the complete motto behind this gift ,,,, is this particular letter…….<br>
This is not just a letter……<br>
But….<br>
Ig someone wanted a unique proposal 🤷‍♂️🤷‍♂️<br>
<br>
<br>
So here we go…….<br>
<br>
This was just a gift to grab your attention….<br>
Its been a long time since I have been planning to tell you this…<br>
You mean the world to me…. And there is nothing that can replace the feelings that I have for you…. I love you to the moon and back…<br>
All the moments that we have spent together were the best moments in my life….<br>
Well as you already know I’m not that good in this all (writing stuff)…<br>
But still finally I would like to ask you the actual traditional question that you always expect me asking ……….<br><br><br>
Miss Pranjali Pandharinath Patil….<br><br>
Will you Marry me ???
<br><br>
<button class="yes-button">YES</button>
<button class="no-button">NO </button>
`
    letter.innerHTML =message;
    document.body.appendChild(letter);

    // Add event listener to the YES button
    const yesButton = letter.querySelector('.yes-button');
    yesButton.addEventListener('click', () => {
        createConfetti(); // Trigger confetti animation
        // letter.remove(); // Remove letter after clicking YES
    });

    // Add event listener to the NO button (optional)
    const noButton = letter.querySelector('.no-button');
    noButton.addEventListener('click', () => {
        createConfetti();
        // letter.remove(); // Remove letter without action
    });

}



// Initialize puzzle
createPuzzlePieces();
createPuzzleGrid();
addTouchListeners();


