const canvas = document.getElementById("editorCanvas");
const ctx = canvas.getContext("2d");
const textarea = document.getElementById("ioTextarea");

const TILE_SIZE = 32;
const ROWS = 10;
const COLS = 20;

// Initialize empty map
let map = Array.from({ length: ROWS }, () => Array(COLS).fill(0));

let selectedTile = 1;
let isDrawing = false;

// Tile dictionary corresponding to game.js logic
const tiles = [
    { id: 0, name: "Eraser (Empty)", color: "#2a2a2a" },
    { id: 1, name: "Solid Wall", color: "#666" },
    { id: 2, name: "Jump Potion", color: "#00ff88" },
    { id: 3, name: "Player Spawn", color: "#ff3366" },
    { id: 4, name: "Checkpoint", color: "#ffd700" },
    { id: 5, name: "Phantom Red", color: "#ff4444" },
    { id: 6, name: "Phantom Blue", color: "#4444ff" },
    { id: 7, name: "Dash Crystal", color: "#00ccff" },
    { id: 8, name: "Level Finish", color: "#0044ff" },
    { id: 9, name: "Spike", color: "#ff0000" },
    { id: 10, name: "One-Way Plat", color: "#999999" },
    { id: 11, name: "Signpost", color: "#8B4513" },
    { id: 12, name: "Conveyor Left", color: "#444" },
    { id: 13, name: "Conveyor Right", color: "#444" },
    { id: 14, name: "Key", color: "#FFD700" },
    { id: 15, name: "Locked Block", color: "#5c3a21" },
    { id: 16, name: "Crumble Plat", color: "#c29157" },
    { id: 17, name: "Dash-Through", color: "#8a8a8a" },
    { id: 18, name: "Dash Drain", color: "#666" },
    { id: 19, name: "Escort Key", color: "#ff9f1c" },
    { id: 20, name: "Escort Lock", color: "#24465a" },
    { id: 21, name: "Portal (max 2/room)", color: "#74f7ff" },
    { id: 22, name: "Bouncy Block", color: "#ff4fa3" },
    { id: 23, name: "Wind Left", color: "#2f4658" },
    { id: 24, name: "Wind Right", color: "#2f4658" },
    { id: 25, name: "Wind Up", color: "#2f4658" },
    { id: 26, name: "Wind Down", color: "#2f4658" }
];

// --- SETUP PALETTE ---
const paletteContainer = document.getElementById("palette");
tiles.forEach(tile => {
    let btn = document.createElement("button");
    btn.className = "tile-btn";
    if (tile.id === selectedTile) btn.classList.add("selected");
    
    btn.innerHTML = `<span class="tile-preview" style="background-color: ${tile.color};"></span> ${tile.id}: ${tile.name}`;
    btn.onclick = () => {
        selectedTile = tile.id;
        document.querySelectorAll(".tile-btn").forEach(b => b.classList.remove("selected"));
        btn.classList.add("selected");
    };
    paletteContainer.appendChild(btn);
});

// --- RENDER LOGIC (Copied & adapted from game.js) ---
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw grid lines
    ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
    ctx.lineWidth = 1;
    for (let x = 0; x <= canvas.width; x += TILE_SIZE) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke(); }
    for (let y = 0; y <= canvas.height; y += TILE_SIZE) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke(); }

    // Draw tiles
    for (let y = 0; y < map.length; y++) {
        for (let x = 0; x < map[y].length; x++) {
            let tile = map[y][x];
            if (tile === 0) continue;

            if (tile === 1) { ctx.fillStyle = "#666"; ctx.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE); }
            else if (tile === 2) { ctx.fillStyle = "#00ff88"; ctx.fillRect(x * TILE_SIZE + 8, y * TILE_SIZE + 8, 16, 16); }
            else if (tile === 3) { ctx.fillStyle = "#ff3366"; ctx.fillRect(x * TILE_SIZE + 4, y * TILE_SIZE + 4, 24, 24); } // Player visualization
            else if (tile === 4) { ctx.fillStyle = "#ffd700"; ctx.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE); }
            else if (tile === 5) { ctx.fillStyle = "#ff4444"; ctx.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE); }
            else if (tile === 6) {
                ctx.fillStyle = "rgba(68, 68, 255, 0.2)"; ctx.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
                ctx.strokeStyle = "#4444ff"; ctx.lineWidth = 2; ctx.strokeRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
            }
            else if (tile === 7) {
                ctx.fillStyle = "#00ccff"; ctx.beginPath(); ctx.moveTo(x * TILE_SIZE + 16, y * TILE_SIZE + 4); ctx.lineTo(x * TILE_SIZE + 28, y * TILE_SIZE + 16); ctx.lineTo(x * TILE_SIZE + 16, y * TILE_SIZE + 28); ctx.lineTo(x * TILE_SIZE + 4, y * TILE_SIZE + 16); ctx.fill();
            }
            else if (tile === 8) { ctx.fillStyle = "#0044ff"; ctx.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE); ctx.fillStyle = "#00ccff"; ctx.fillRect(x * TILE_SIZE + 8, y * TILE_SIZE + 8, 16, 16); }
            else if (tile === 9) { ctx.fillStyle = "#ff0000"; ctx.beginPath(); ctx.moveTo(x * TILE_SIZE + 16, y * TILE_SIZE + 8); ctx.lineTo(x * TILE_SIZE + 32, y * TILE_SIZE + 32); ctx.lineTo(x * TILE_SIZE, y * TILE_SIZE + 32); ctx.fill(); }
            else if (tile === 10) { ctx.fillStyle = "#999999"; ctx.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE / 4); }
            else if (tile === 11) { 
                ctx.fillStyle = "#8B4513"; ctx.fillRect(x * TILE_SIZE + 12, y * TILE_SIZE + 16, 8, 16);
                ctx.fillStyle = "#D2B48C"; ctx.fillRect(x * TILE_SIZE + 2, y * TILE_SIZE + 6, 28, 14);
            }
            else if (tile === 12) { 
                ctx.fillStyle = "#444"; ctx.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE); 
                ctx.fillStyle = "#ffdd00"; ctx.beginPath(); ctx.moveTo(x * TILE_SIZE + 24, y * TILE_SIZE + 8); ctx.lineTo(x * TILE_SIZE + 8, y * TILE_SIZE + 16); ctx.lineTo(x * TILE_SIZE + 24, y * TILE_SIZE + 24); ctx.fill(); 
            }
            else if (tile === 13) { 
                ctx.fillStyle = "#444"; ctx.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE); 
                ctx.fillStyle = "#ffdd00"; ctx.beginPath(); ctx.moveTo(x * TILE_SIZE + 8, y * TILE_SIZE + 8); ctx.lineTo(x * TILE_SIZE + 24, y * TILE_SIZE + 16); ctx.lineTo(x * TILE_SIZE + 8, y * TILE_SIZE + 24); ctx.fill(); 
            }
            else if (tile === 14) { 
                ctx.fillStyle = "#FFD700"; ctx.beginPath(); ctx.arc(x * TILE_SIZE + 10, y * TILE_SIZE + 16, 6, 0, Math.PI * 2); ctx.fill();
                ctx.fillRect(x * TILE_SIZE + 10, y * TILE_SIZE + 14, 14, 4); ctx.fillRect(x * TILE_SIZE + 20, y * TILE_SIZE + 18, 4, 4); 
            }
            else if (tile === 15) { 
                ctx.fillStyle = "#5c3a21"; ctx.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
                ctx.strokeStyle = "#382212"; ctx.lineWidth = 2; ctx.strokeRect(x * TILE_SIZE + 1, y * TILE_SIZE + 1, TILE_SIZE - 2, TILE_SIZE - 2);
                ctx.fillStyle = "#FFD700"; ctx.fillRect(x * TILE_SIZE + 10, y * TILE_SIZE + 10, 12, 12);
                ctx.fillStyle = "#222"; ctx.beginPath(); ctx.arc(x * TILE_SIZE + 16, y * TILE_SIZE + 14, 2, 0, Math.PI * 2); ctx.fill();
                ctx.fillRect(x * TILE_SIZE + 15, y * TILE_SIZE + 15, 2, 4);
            }
            else if (tile === 16) {
                let top = y * TILE_SIZE, left = x * TILE_SIZE;
                ctx.fillStyle = "rgba(194, 145, 87, 1)"; ctx.fillRect(left, top, TILE_SIZE, TILE_SIZE / 4);
                ctx.strokeStyle = "#6e4d2f"; ctx.lineWidth = 2; ctx.beginPath();
                ctx.moveTo(left + 3, top + 4); ctx.lineTo(left + 11, top + 6); ctx.lineTo(left + 18, top + 3); ctx.lineTo(left + 26, top + 7); ctx.stroke();
            }
            else if (tile === 17) { ctx.fillStyle = "#8a8a8a"; ctx.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE); }
            else if (tile === 18) { 
                ctx.fillStyle = "#666"; ctx.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
                ctx.fillStyle = "#00ccff"; ctx.beginPath(); ctx.arc(x * TILE_SIZE + 16, y * TILE_SIZE + 16, 4, 0, Math.PI * 2); ctx.fill();
            }
            else if (tile === 19) {
                ctx.fillStyle = "#ff9f1c";
                ctx.beginPath();
                ctx.arc(x * TILE_SIZE + 10, y * TILE_SIZE + 16, 6, 0, Math.PI * 2);
                ctx.fill();
                ctx.fillRect(x * TILE_SIZE + 10, y * TILE_SIZE + 14, 14, 4);
                ctx.fillRect(x * TILE_SIZE + 20, y * TILE_SIZE + 18, 4, 4);
                ctx.fillStyle = "#0fd3ff";
                ctx.fillRect(x * TILE_SIZE + 5, y * TILE_SIZE + 14, 4, 4);
                ctx.fillRect(x * TILE_SIZE + 14, y * TILE_SIZE + 12, 5, 2);
            }
            else if (tile === 20) {
                const left = x * TILE_SIZE;
                const top = y * TILE_SIZE;
                ctx.fillStyle = "#24465a";
                ctx.fillRect(left + 10, top + 12, 12, 18);
                ctx.fillStyle = "#17303d";
                ctx.fillRect(left + 7, top + 6, 18, 14);
                ctx.strokeStyle = "#0fd3ff";
                ctx.lineWidth = 2;
                ctx.strokeRect(left + 7, top + 6, 18, 14);
                ctx.fillStyle = "#ff9f1c";
                ctx.fillRect(left + 11, top + 10, 10, 8);
                ctx.fillStyle = "#0fd3ff";
                ctx.beginPath();
                ctx.arc(left + 16, top + 13, 2, 0, Math.PI * 2);
                ctx.fill();
                ctx.fillRect(left + 15, top + 13, 2, 5);
            }
            else if (tile === 21) {
                const left = x * TILE_SIZE;
                const top = y * TILE_SIZE;
                ctx.fillStyle = "#14162b";
                ctx.beginPath();
                ctx.arc(left + 16, top + 16, 11, 0, Math.PI * 2);
                ctx.fill();
                ctx.strokeStyle = "#74f7ff";
                ctx.lineWidth = 3;
                ctx.beginPath();
                ctx.arc(left + 16, top + 16, 11, 0, Math.PI * 2);
                ctx.stroke();
                ctx.fillStyle = "#090b16";
                ctx.beginPath();
                ctx.arc(left + 16, top + 16, 6, 0, Math.PI * 2);
                ctx.fill();
            }
            else if (tile === 22) {
                const left = x * TILE_SIZE;
                const top = y * TILE_SIZE;
                ctx.fillStyle = "#ff4fa3";
                ctx.fillRect(left, top, TILE_SIZE, TILE_SIZE);
                ctx.strokeStyle = "#c81b74";
                ctx.lineWidth = 2;
                ctx.strokeRect(left + 1, top + 1, TILE_SIZE - 2, TILE_SIZE - 2);
            }
            else if (tile >= 23 && tile <= 26) {
                const left = x * TILE_SIZE;
                const top = y * TILE_SIZE;
                const direction = tile === 23
                    ? { dx: -1, dy: 0 }
                    : tile === 24
                        ? { dx: 1, dy: 0 }
                        : tile === 25
                            ? { dx: 0, dy: -1 }
                            : { dx: 0, dy: 1 };

                ctx.fillStyle = "#2f4658";
                ctx.fillRect(left, top, TILE_SIZE, TILE_SIZE);
                ctx.strokeStyle = "#8fe8ff";
                ctx.lineWidth = 2;
                ctx.strokeRect(left + 1, top + 1, TILE_SIZE - 2, TILE_SIZE - 2);

                ctx.fillStyle = "#8fe8ff";
                ctx.beginPath();
                if (direction.dx < 0) {
                    ctx.moveTo(left + 8, top + 16);
                    ctx.lineTo(left + 22, top + 9);
                    ctx.lineTo(left + 22, top + 23);
                } else if (direction.dx > 0) {
                    ctx.moveTo(left + 24, top + 16);
                    ctx.lineTo(left + 10, top + 9);
                    ctx.lineTo(left + 10, top + 23);
                } else if (direction.dy < 0) {
                    ctx.moveTo(left + 16, top + 8);
                    ctx.lineTo(left + 9, top + 22);
                    ctx.lineTo(left + 23, top + 22);
                } else {
                    ctx.moveTo(left + 16, top + 24);
                    ctx.lineTo(left + 9, top + 10);
                    ctx.lineTo(left + 23, top + 10);
                }
                ctx.fill();

                if (direction.dx < 0) {
                    ctx.fillRect(left + 23, top + 9, 3, 3);
                    ctx.fillRect(left + 23, top + 15, 5, 3);
                    ctx.fillRect(left + 23, top + 21, 3, 3);
                } else if (direction.dx > 0) {
                    ctx.fillRect(left + 6, top + 9, 3, 3);
                    ctx.fillRect(left + 4, top + 15, 5, 3);
                    ctx.fillRect(left + 6, top + 21, 3, 3);
                } else if (direction.dy < 0) {
                    ctx.fillRect(left + 9, top + 23, 3, 3);
                    ctx.fillRect(left + 15, top + 23, 3, 5);
                    ctx.fillRect(left + 21, top + 23, 3, 3);
                } else {
                    ctx.fillRect(left + 9, top + 6, 3, 3);
                    ctx.fillRect(left + 15, top + 4, 3, 5);
                    ctx.fillRect(left + 21, top + 6, 3, 3);
                }
            }
        }
    }
}

// --- MOUSE INTERACTIONS ---
function paint(e) {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    const x = Math.floor(((e.clientX - rect.left) * scaleX) / TILE_SIZE);
    const y = Math.floor(((e.clientY - rect.top) * scaleY) / TILE_SIZE);

    if (x >= 0 && x < COLS && y >= 0 && y < ROWS) {
        map[y][x] = selectedTile;
        draw();
    }
}

canvas.addEventListener("mousedown", (e) => {
    isDrawing = true;
    paint(e);
});

canvas.addEventListener("mousemove", (e) => {
    if (isDrawing) paint(e);
});

window.addEventListener("mouseup", () => {
    isDrawing = false;
});

// --- TOOL BUTTONS ---
document.getElementById("btnClear").onclick = () => {
    map = Array.from({ length: ROWS }, () => Array(COLS).fill(0));
    draw();
};

document.getElementById("btnFill").onclick = () => {
    map = Array.from({ length: ROWS }, () => Array(COLS).fill(selectedTile));
    draw();
};

// --- IMPORT & EXPORT ---
document.getElementById("btnExport").onclick = () => {
    // Format nicely like your game.js arrays
    let output = "[\n";
    for (let y = 0; y < ROWS; y++) {
        output += "  [" + map[y].join(",") + "]";
        if (y < ROWS - 1) output += ",\n";
        else output += "\n";
    }
    output += "]";
    textarea.value = output;
};

document.getElementById("btnImport").onclick = () => {
    try {
        let input = textarea.value.trim();
        // Fallback parsing just in case
        if (!input.startsWith("[")) throw new Error("Does not look like an array");
        
        let newMap = JSON.parse(input);
        if (newMap.length === ROWS && newMap[0].length === COLS) {
            map = newMap;
            draw();
            alert("Level Imported!");
        } else {
            alert(`Map dimensions incorrect! Expected ${COLS}x${ROWS}. Got ${newMap[0]?.length}x${newMap.length}.`);
        }
    } catch (e) {
        alert("Invalid array code! Make sure you are pasting a valid [ [0,0...], [0,0...] ] format.");
        console.error(e);
    }
};

// Initial draw
draw();
