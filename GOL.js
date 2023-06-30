<div style="width: 560px; height: 315px; position: relative;">
    <style>
        #game {
            border: 1px solid #fff;
        }
        .controls {
            position: absolute; 
            top: 100%; 
            left: 0;
            width: 100%;
            background-color: rgba(255, 255, 255, 0.7);
            padding: 5px;
            border-radius: 5px;
        }
        #input {
            width: 100%;
            resize: none;
            box-sizing: border-box;
        }
    </style>
    <canvas id="game"></canvas>
    <div class="controls">
        <textarea id="input" rows="1"></textarea>
        <button id="play">Play</button>
    </div>
    <script>
        const canvas = document.getElementById('game');
        const ctx = canvas.getContext('2d');

        const CHARACTERS = {
            'A': [
                '01110',
                '10001',
                '10001',
                '11111',
                '10001',
                '10001'
            ],
            'B': [
                '11110',
                '10001',
                '11110',
                '10001',
                '10001',
                '11110'
            ],
            'C': [
                '01111',
                '10000',
                '10000',
                '10000',
                '10000',
                '01111'
            ],
            'D': [
                '11110',
                '10001',
                '10001',
                '10001',
                '10001',
                '11110'
            ],
            'E': [
                '11111',
                '10000',
                '11110',
                '10000',
                '10000',
                '11111'
            ],
            'F': [
                '11111',
                '10000',
                '11100',
                '10000',
                '10000',
                '10000'
            ],
            'G': [
                '01111',
                '10000',
                '10011',
                '10001',
                '10001',
                '01110'
            ],
            'H': [
                '10001',
                '10001',
                '11111',
                '10001',
                '10001',
                '10001'
            ],
            'I': [
                '01110',
                '00100',
                '00100',
                '00100',
                '00100',
                '01110'
            ],
            'J': [
                '00001',
                '00001',
                '00001',
                '10001',
                '10001',
                '01110'
            ],
            'K': [
                '10001',
                '10010',
                '11100',
                '10010',
                '10001',
                '10001'
            ],
            'L': [
                '10000',
                '10000',
                '10000',
                '10000',
                '10000',
                '11111'
            ],
            'M': [
                '10001',
                '11011',
                '10101',
                '10001',
                '10001',
                '10001'
            ],
            'N': [
                '10001',
                '11001',
                '10101',
                '10011',
                '10001',
                '10001'
            ],
            'O': [
                '01110',
                '10001',
                '10001',
                '10001',
                '10001',
                '01110'
            ],
            'P': [
                '11110',
                '10001',
                '10001',
                '11110',
                '10000',
                '10000'
            ],
            'Q': [
                '01110',
                '10001',
                '10001',
                '10001',
                '10011',
                '01111'
            ],
            'R': [
                '11110',
                '10001',
                '10001',
                '11110',
                '10001',
                '10001'
            ],
            'S': [
                '01111',
                '10000',
                '01110',
                '00001',
                '00001',
                '11110'
            ],
            'T': [
                '11111',
                '00100',
                '00100',
                '00100',
                '00100',
                '00100'
            ],
            'U': [
                '10001',
                '10001',
                '10001',
                '10001',
                '10001',
                '01110'
            ],
            'V': [
                '10001',
                '10001',
                '10001',
                '10001',
                '01010',
                '00100'
            ],
            'W': [
                '10001',
                '10001',
                '10001',
                '10101',
                '11011',
                '10001'
            ],
            'X': [
                '10001',
                '10001',
                '01110',
                '01110',
                '10001',
                '10001'
            ],
            'Y': [
                '10001',
                '10001',
                '01110',
                '00100',
                '00100',
                '00100'
            ],
            'Z': [
                '11111',
                '00001',
                '00110',
                '01000',
                '10000',
                '11111'
            ],
            ' ': [
                '00000',
                '00000',
                '00000',
                '00000',
                '00000',
                '00000'
            ],
            '\n': []
        };


        let grid;
        let intervalId;
        let isPlaying = false;

        function initializeGrid(str) {
            grid = []; // do not redeclare, just assign
            let words = str.split('\n');
            for(let word of words) {
                const lines = [];
                for(let i = 0; i < 6; i++) {
                    let line = '';
                    for(const char of word.toUpperCase()) {
                        if(CHARACTERS[char]) {
                            line += CHARACTERS[char][i];
                        }
                    }
                    lines.push(line);
                }

                let wordGrid = lines.map(line => line.split('').map(char => char === '1' ? 1 : 0));
                        
                if (grid.length == 0) {
                    grid = wordGrid;
                } else {
                    // attach wordGrid to grid
                    let maxCols = Math.max(grid[0].length, wordGrid[0].length);
                    for (let i = 0; i < 6; i++) {
                        // extend grid rows and wordGrid rows to maxCols
                        while(grid[i].length < maxCols) grid[i].push(0);
                        while(wordGrid[i].length < maxCols) wordGrid[i].push(0);

                        // add wordGrid rows to grid
                        grid.push(wordGrid[i]);
                    }
                }
            }

            // To ensure a space between lines, push a line of zeros
            if (grid[0]) {
                grid.push(new Array(grid[0].length).fill(0));
            }
        }

        function drawGrid() {
            if (!grid || grid.length === 0 || !grid[0]) {
                return;
            }
            
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            const cellSize = Math.min(canvas.width / grid[0].length, canvas.height / grid.length);

            for(let i = 0; i < grid.length; i++) {
                for(let j = 0; j < grid[i].length; j++) {
                    if(grid[i][j] === 1) {
                        ctx.fillRect(j * cellSize, i * cellSize, cellSize, cellSize);
                    }
                }
            }
        }

        function evolve() {
            if (!grid) {
                console.error('Grid is not initialized.');
                return;
            }
            const newGrid = JSON.parse(JSON.stringify(grid)); // Deep copy of the grid

            for(let i = 0; i < grid.length; i++) {
                for(let j = 0; j < grid[i].length; j++) {
                    const neighbors = countNeighbors(i, j);

                    if(grid[i][j] === 1 && (neighbors < 2 || neighbors > 3)) {
                        newGrid[i][j] = 0; // Dies
                    } else if(grid[i][j] === 0 && neighbors === 3) {
                        newGrid[i][j] = 1; // Becomes alive
                    }
                }
            }

            grid = newGrid;
        }

        function countNeighbors(x, y) {
            let count = 0;

            for(let i = -1; i <= 1; i++) {
                for(let j = -1; j <= 1; j++) {
                    if(i === 0 && j === 0) continue;
                    if(x + i < 0 || x + i >= grid.length || y + j < 0 || y + j >= grid[0].length) continue;

                    count += grid[x + i][y + j];
                }
            }

            return count;
        }

        const minCanvasSize = 200; // Minimum canvas size in pixels

        const inputElement = document.getElementById('input');
        inputElement.addEventListener('input', function() {
            this.rows = (this.value.match(/\n/g) || []).length + 1;

            initializeGrid(this.value);
            drawGrid();
        });

        document.getElementById('play').addEventListener('click', () => {
            if(!isPlaying) {
                intervalId = setInterval(() => {
                    evolve();
                    drawGrid();
                }, 300);
                isPlaying = true;
            } else {
                clearInterval(intervalId);
                isPlaying = false;
            }
        });

    </script>
</div>
