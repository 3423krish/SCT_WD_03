document.addEventListener('DOMContentLoaded', () => {
    const board = document.querySelector('.board');
    const cells = document.querySelectorAll('.cell');
    const status = document.getElementById('status');
    const vsComputerBtn = document.getElementById('vsComputer');
    const vsPlayerBtn = document.getElementById('vsPlayer');
    const resetBtn = document.getElementById('reset');
    const playerXScoreEl = document.getElementById('playerXScore');
    const playerOScoreEl = document.getElementById('playerOScore');
    const tieScoreEl = document.getElementById('tieScore');
    
    let currentPlayer = 'O';
    let gameBoard = ['', '', '', '', '', '', '', '', ''];
    let gameActive = true;
    let vsComputer = false;
    let scores = { X: 0, O: 0, tie: 0 };
    
    // Winning combinations
    const winningConditions = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
        [0, 4, 8], [2, 4, 6] // diagonals
    ];
    
    // Initialize the game
    function initGame() {
        gameBoard = ['', '', '', '', '', '', '', '', ''];
        gameActive = true;
        currentPlayer = 'O';
        
        // Update status with animation
        status.innerHTML = `Player <span class="player-o">O</span>'s turn`;
        status.classList.remove('animate_animated', 'animate_bounceIn');
        void status.offsetWidth; // Trigger reflow
        status.classList.add('animate_animated', 'animate_bounceIn');
        
        cells.forEach(cell => {
            cell.textContent = '';
            cell.className = 'cell';
            cell.style.backgroundColor = '';
        });
    }
    
    // Handle cell click
    function handleCellClick(e) {
        const cell = e.target;
        const cellIndex = parseInt(cell.getAttribute('data-index'));
        
        if (gameBoard[cellIndex] !== '' || !gameActive) return;
        
        updateCell(cell, cellIndex);
        checkResult();
        
        if (vsComputer && gameActive && currentPlayer === 'X') {
            setTimeout(computerMove, 800); // Slight delay for better UX
        }
    }
    
    // Update cell with animation
    function updateCell(cell, index) {
        gameBoard[index] = currentPlayer;
        cell.textContent = currentPlayer;
        cell.classList.add(currentPlayer.toLowerCase());
        cell.classList.add('animate_animated', 'animate_flipInY');
    }
    
    // Change player with animation
    function changePlayer() {
        currentPlayer = currentPlayer === 'O' ? 'X' : 'O';
        
        const playerClass = currentPlayer === 'O' ? 'player-o' : 'player-x';
        status.innerHTML = `Player <span class="${playerClass}">${currentPlayer}</span>'s turn`;
        
        status.classList.remove('animate_animated', 'animate_pulse');
        void status.offsetWidth; // Trigger reflow
        status.classList.add('animate_animated', 'animate_pulse');
    }
    
    // Check for win or draw
    function checkResult() {
        let roundWon = false;
        
        for (let i = 0; i < winningConditions.length; i++) {
            const [a, b, c] = winningConditions[i];
            
            if (gameBoard[a] === '' || gameBoard[b] === '' || gameBoard[c] === '') continue;
            
            if (gameBoard[a] === gameBoard[b] && gameBoard[b] === gameBoard[c]) {
                roundWon = true;
                highlightWinningCells(a, b, c);
                break;
            }
        }
        
        if (roundWon) {
            status.innerHTML = `Player <span class="${currentPlayer === 'O' ? 'player-o' : 'player-x'}">${currentPlayer}</span> wins!`;
            gameActive = false;
            updateScore(currentPlayer);
            createConfetti();
            return;
        }
        
        if (!gameBoard.includes('')) {
            status.textContent = 'Game ended in a draw!';
            gameActive = false;
            updateScore('tie');
            return;
        }
        
        changePlayer();
    }
    
    // Highlight winning cells with animation
    function highlightWinningCells(a, b, c) {
        [a, b, c].forEach(index => {
            cells[index].classList.add('winner');
        });
    }
    
    // Computer move with "thinking" delay
    function computerMove() {
        if (!gameActive) return;
        
        // Simple AI - first look for winning move, then blocking move, then random
        let move = findWinningMove('X') || findWinningMove('O') || findRandomMove();
        
        if (move !== null) {
            setTimeout(() => {
                const cell = cells[move];
                updateCell(cell, move);
                checkResult();
            }, 500); // Simulate "thinking"
        }
    }
    
    // Find a winning move for the specified player
    function findWinningMove(player) {
        for (let i = 0; i < winningConditions.length; i++) {
            const [a, b, c] = winningConditions[i];
            const cells = [gameBoard[a], gameBoard[b], gameBoard[c]];
            
            // If two cells are player's and one is empty
            if (cells.filter(c => c === player).length === 2 && cells.includes('')) {
                return [a, b, c][cells.indexOf('')];
            }
        }
        return null;
    }
    
    // Find a random empty cell
    function findRandomMove() {
        let emptyCells = [];
        gameBoard.forEach((cell, index) => {
            if (cell === '') emptyCells.push(index);
        });
        
        if (emptyCells.length > 0) {
            return emptyCells[Math.floor(Math.random() * emptyCells.length)];
        }
        return null;
    }
    
    // Update scoreboard
    function updateScore(winner) {
        if (winner === 'X') {
            scores.X++;
            playerXScoreEl.textContent = scores.X;
            playerXScoreEl.classList.add('animate_animated', 'animate_tada');
            setTimeout(() => playerXScoreEl.classList.remove('animate_animated', 'animate_tada'), 1000);
        } else if (winner === 'O') {
            scores.O++;
            playerOScoreEl.textContent = scores.O;
            playerOScoreEl.classList.add('animate_animated', 'animate_tada');
            setTimeout(() => playerOScoreEl.classList.remove('animate_animated', 'animate_tada'), 1000);
        } else {
            scores.tie++;
            tieScoreEl.textContent = scores.tie;
            tieScoreEl.classList.add('animate_animated', 'animate_tada');
            setTimeout(() => tieScoreEl.classList.remove('animate_animated', 'animate_tada'), 1000);
        }
    }
    
    // Create confetti effect
    function createConfetti() {
        const colors = ['var(--neon-pink)', 'var(--neon-blue)', 'var(--neon-green)', 'var(--light-lavender)'];
        
        for (let i = 0; i < 100; i++) {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.style.left = Math.random() * 100 + 'vw';
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.width = Math.random() * 10 + 5 + 'px';
            confetti.style.height = Math.random() * 10 + 5 + 'px';
            confetti.style.animationDuration = Math.random() * 3 + 2 + 's';
            confetti.style.animationDelay = Math.random() * 2 + 's';
            
            document.body.appendChild(confetti);
            
            // Remove confetti after animation
            setTimeout(() => {
                confetti.remove();
            }, 5000);
        }
    }
    
    // Event listeners
    cells.forEach(cell => cell.addEventListener('click', handleCellClick));
    
    vsComputerBtn.addEventListener('click', () => {
        vsComputer = true;
        vsComputerBtn.disabled = true;
        vsPlayerBtn.disabled = false;
        initGame();
    });
    
    vsPlayerBtn.addEventListener('click', () => {
        vsComputer = false;
        vsPlayerBtn.disabled = true;
        vsComputerBtn.disabled = false;
        initGame();
    });
    
    resetBtn.addEventListener('click', () => {
        initGame();
        resetBtn.classList.add('animate_animated', 'animate_rubberBand');
        setTimeout(() => resetBtn.classList.remove('animate_animated', 'animate_rubberBand'), 1000);
    });
    
    // Initialize the game
    initGame();
});