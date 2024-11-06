const urlParams = new URLSearchParams(window.location.search);
const selectedImage = urlParams.get('img');
const selectedType = urlParams.get('type');
const imagePath = `images/${selectedType}/${selectedImage}.jpg`;

// Puzzle setup
const piecesContainer = document.getElementById('pieces-container');
const puzzleImageDiv = document.getElementById('puzzle-image');
const referenceImage = document.getElementById('referenceImage');

// Grid dimensions
const gridSize = 1; // Adjust as needed (e.g., 2 for a 2x2 puzzle)
const totalPieces = gridSize * gridSize; // Total number of pieces
const pieceSize = 400; // Size of each piece (width and height)

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
    for (let i = 1; i <= 10; i++) {
        const puzzleKey = `${selectedType}-image${i}-completed`;
        const completed = localStorage.getItem(puzzleKey);


        if (completed) {
            const completedDiv = document.querySelector(`a[href="puzzle.html?img=image${i}&type=${selectedType}"] .completed`);
            const hiddenSymbol = document.querySelector(`a[href="puzzle.html?img=image${i}&type=${selectedType}"] .hidden-symbol`);
             
            console.log(completedDiv);
            console.log(hiddenSymbol);



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
    const puzzleType = selectedType; // Use the selected type (e.g., 'animals')
    
    const puzzleName = selectedImage; // Use the selected image name as the puzzle identifier
    const completionKey = `${puzzleType}-${puzzleName}-completed`; // Unique key with type and image
    
    localStorage.setItem(completionKey, 'true'); // Set completion status
    console.log(`LocalStorage updated: ${completionKey} = true`); 


    const completedDiv = document.querySelector(`a[href="puzzle.html?img=${selectedImage}&type=${selectedType}"] .completed`);
    const hiddenSymbol = document.querySelector(`a[href="puzzle.html?img=${selectedImage}&type=${selectedType}"] .hidden-symbol`);





    console.log('Completed Div:', completedDiv);
    console.log('Hidden Symbol:', hiddenSymbol);




    if (completedDiv && hiddenSymbol) {
        completedDiv.style.display = 'block'; // Show the completed indicator
        hiddenSymbol.style.display = 'none'; // Hide the hidden symbol
    }

    // Create and display the completed image
    const completedImage = document.createElement('img');
    completedImage.src = imagePath; // Use the same path as the puzzle pieces
    completedImage.alt = "Completed Puzzle";
    completedImage.style.position = 'fixed';
    completedImage.style.top = '50%';
    completedImage.style.left = '50%';
    completedImage.style.transform = 'translate(-50%, -50%)';
    completedImage.style.maxWidth = '90%'; // Responsive size
    completedImage.style.maxHeight = '90%';
    completedImage.style.zIndex = '1000';
    completedImage.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.5)';

    document.body.appendChild(completedImage);


    // Remove the completed image after a few seconds
    setTimeout(() => {
        completedImage.remove();
    }, 3000);

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
    // Check completion status for each puzzle option
    const imageOptions = document.querySelectorAll('.image-options a');

    imageOptions.forEach(option => {
        const img = option.querySelector('.puzzle-image');
        const imgSrc = img.src; // Get the source of the image
        const imgName = imgSrc.split('/').pop().split('.')[0]; // Get the image name without extension
        const puzzleType = option.href.split('=')[1]; // Get puzzle type from URL

        // Check if the puzzle is completed in localStorage
        const completionKey = `${puzzleType}-${imgName}-completed`;
        if (localStorage.getItem(completionKey) === 'true') {
            const completedDiv = option.querySelector('.completed');
            const hiddenSymbol = option.querySelector('.hidden-symbol');

            // Show the completed indicator
            completedDiv.style.display = 'inline-block'; 
            hiddenSymbol.style.display = 'none'; // Hide the hidden symbol
        }
    });
}


// function checkAllPuzzlesSolved() {
//     const types = ["animals", "cars", "landscapes"]; // List all puzzle types
//     let allSolved = true;

//     // Loop through each type and each image within that type
//     types.forEach((type) => {
//         for (let i = 1; i <= 10; i++) {
//             const completionKey = `${type}-image${i}-completed`; // Unique key with type and image
//             console.log(`Checking: ${completionKey}`);
            
//             // If any puzzle is not completed, set allSolved to false and break out of loops
//             if (!localStorage.getItem(completionKey)) {
//                 allSolved = false;
//                 break;
//             }
//         }
        
//         // Exit if any unsolved puzzle found
//         if (!allSolved) {
//             return;
//         }
//     });

//     // If all puzzles across all types are solved, trigger the celebration
//     if (allSolved) {
//         const mainContent = document.querySelector('.main-content'); // Use a specific container
//         mainContent.classList.add('fade-out'); // Apply fade-out only to the main content

//         setTimeout(displayGiftBox, 1000); // Display the gift box after fade-out
//         console.log("All puzzles completed!");
//     }
// }







// function checkAllPuzzlesSolved() {
//     // console.log("Iam Running");
//     let allSolved = true;
//     for (let i = 1; i <= 10; i++) {
//         console.log("Running");
//         if (!localStorage.getItem(`image${i}-completed`)) {
//             allSolved = false;
//             break;
//         }
//     }

//     if (allSolved) {
//         const mainContent = document.querySelector('.main-content'); // Use a specific container
//         mainContent.classList.add('fade-out'); // Apply fade-out only to the main content
        
//         // document.body.classList.add('fade-out');
//         setTimeout(displayGiftBox, 1000);
//         // console.log("Complete");
//     }
// }

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
    const message = `Congratulations.... You have solved all the puzzles 🥳🥳
    <br><br>
<button class="yes-button">Celebrate</button>`
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

function navigateTo(page) {
    window.location.href = page;
}






// Initialize puzzle
createPuzzlePieces();
createPuzzleGrid();
addTouchListeners();


