const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const TILE_SIZE = 32;

// --- LEVEL DATA ---
// 0 = Empty, 1 = Wall, 2 = Potion, 3 = Spawn Point, 4 = Finish Line 5 = Active Phantom Block, 6 = Inactive Phantom Block, 7 = Dash Crystal
const levels = [
    [// T-1
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4,0],
        [0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    ],
    [// T-2
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0],
        [3,0,0,0,0,0,0,0,0,0,0,0,2,0,1,0,0,0,4,0],
        [1,1,1,1,1,1,1,0,0,0,1,1,1,1,1,1,1,1,1,1],
        [0,0,0,0,0,0,1,0,2,0,1,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,1,1,1,1,1,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    ],
    [// T-3
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,1,0,0,0,0,0,0,1,1,1,0,0,0],
        [0,0,0,0,0,0,0,1,0,0,0,0,0,0,1,1,1,0,0,0],
        [0,3,0,0,2,0,0,0,0,0,2,2,0,0,0,0,0,0,0,4],
        [1,1,1,1,1,1,0,0,0,1,1,1,1,0,0,0,0,0,1,1],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    ],
    [// T-4
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4,0],
        [1,1,1,0,0,0,0,0,1,1,1,0,0,0,0,0,1,1,1,1],
        [0,0,1,0,0,0,0,0,1,0,1,0,0,0,0,0,1,0,0,0],
        [0,0,1,0,0,0,0,0,1,0,1,0,0,0,0,0,1,0,0,0],
        [0,0,1,0,2,0,2,0,1,0,1,0,0,0,0,0,1,0,0,0],
        [0,0,1,1,1,1,1,1,1,0,1,0,0,0,0,0,1,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,1,0,2,2,2,0,1,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,0,0,0],
    ],
    [// T-5
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,3,0,2,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,0],
        [1,1,1,1,1,0,0,0,0,0,0,0,0,4,0,0,0,0,0,0],
        [0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,1,1,1,0,0,0,0,1,1,1,0,0,0,0,4],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    ],
    [// 1-1
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0],
        [0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,4,0],
        [1,1,1,1,0,0,0,1,1,1,0,0,0,1,1,1,1,1,1,1],
        [0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,2,0,0,0,0,0,1,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    ],
    [// 1-2
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,4,0,0,0,0,0,0,0,4],
        [0,3,0,0,0,2,0,0,0,0,1,1,1,0,0,0,0,0,1,1],
        [1,1,1,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0],
        [0,2,0,0,0,0,0,0,1,0,0,0,0,1,1,1,0,0,0,0],
        [1,1,1,0,0,0,2,0,1,0,0,0,0,1,0,0,0,0,0,0],
        [0,0,0,0,0,1,1,1,1,0,0,2,0,0,0,2,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,1,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4],
    ],
    [// 1-3
        [0,0,0,0,0,0,7,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,2,0,0,0,2,0,0,0,0,0,0,0,0,0,0,4],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0],
        [0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0],
        [0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,1,0,0,0],
        [0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0],
        [1,1,1,0,0,0,0,0,2,0,0,0,0,0,2,0,1,0,4,0],
        [0,0,0,0,0,0,0,1,1,1,0,0,0,1,1,1,1,0,0,0],
    ],
    [// 1-4
        [0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [1,1,1,0,0,0,0,0,0,7,0,0,0,0,0,7,0,0,0,0],
        [0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,0,0],
        [0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,4,0,0,0,0,0,0,0,0,0,0,1,1,1,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    ],
    [// 1-5
        [0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,2,0,1,0,0,0,0,0,0,0,0,1,1,1,0,0,0,0,0],
        [0,0,0,1,0,0,0,0,2,0,0,0,0,0,0,0,0,4,0,0],
        [2,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,1,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0],
        [0,0,2,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,7,0],
        [0,0,0,1,4,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0],
        [2,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [3,0,0,1,7,0,0,0,0,2,0,4,0,0,2,0,0,0,0,0],
        [1,1,1,1,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0],
    ],
    [// 1-6
        [3,0,2,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0],
        [1,1,1,0,0,0,0,0,0,1,0,0,0,0,0,0,4,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,4,0,0,0,0,0,0,0,4,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [2,2,2,0,0,0,0,0,0,7,0,0,0,0,0,0,0,0,0,0],
        [1,1,1,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,4,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    ],
    [// 1-7
        [3,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [1,0,0,2,0,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,7,0,0,0,0,0,0,0],
        [0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,4,0,0,0,0,0,2,0,0],
        [0,0,0,4,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,2,0,0,0,0,2,0,0,0,0,0],
        [0,0,0,7,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,4,0,0],
    ],
        [// 1-8
        [0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,4,0,2,0,4,0,0,0,0,0,0,0,4,0,2,0,4,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,2,0,0,0,3,0,0,0,2,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0],
        [0,4,0,2,0,4,0,2,0,0,0,2,0,4,0,2,0,4,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,2,0,0,0,2,0,0,0,2,0,0,0,2,0,0,0,2,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    ],

    
];

// Add this near the top with your other data!
const levelNames = [
    "Why is my Spacebar not working?!", 
    "What are these for?", 
    "Jumping on Air",
    "Double Jumps? Triple Jumps?",
    "Hitting Multiple Doors",
    "Directional Shifting",
    "Strategic Dashing",
    "Blue crystals?",
    "Chaining Dashes and Jumps",
    "Different Pathways",
    "What's the Plan Now?",
    "Is this jump possible?",
    "Aimlabs 2.0",
];

let currentLevelText = ""; // We will store the final formatted string here

let currentLevelIndex = 0;
let highestUnlockedLevel = parseInt(localStorage.getItem("spacebarSaveData")) || 0; 
let map = []; 
let gameState = "menu";

const player = {
    x: 0, y: 0, width: 24, height: 24, 
    vx: 0, vy: 0,
    friction: 0.8, gravity: 0.4, jumpPower: -8,
    potions: 0,
    facing: 1,         // 1 for right, -1 for left
    hasDash: true,     // Starts the level with a dash
    isDashing: false,  // Is currently mid-dash
    dashTimer: 0,      // How long the dash lasts
    dashDuration: 12,  // Frames the dash lasts (about 0.2 seconds)
    dashSpeed: 10      // How fast the dash is
};

// --- KEYBINDING SYSTEM ---
const defaultBinds = {
    up: "ArrowUp",
    down: "ArrowDown",
    left: "ArrowLeft",
    right: "ArrowRight",
    jump: "Space",
    dash: "ShiftLeft"
};

// Load saved binds from local storage, or use defaults
let userBinds = JSON.parse(localStorage.getItem("spacebarBinds")) || { ...defaultBinds };
let rebindingAction = null; // Tracks which action is currently waiting for a key press

const keys = { right: false, left: false, up: false, down: false };
let jumpPressed = false; // Renamed from spacePressed
let dashPressed = false; // Renamed from shiftPressed

// --- INPUT HANDLING ---
window.addEventListener("keydown", (e) => {
    // 1. Check if we are currently rebinding a key in the settings menu
    if (rebindingAction) {
        e.preventDefault(); // Stop page scroll
        userBinds[rebindingAction] = e.code;
        localStorage.setItem("spacebarBinds", JSON.stringify(userBinds));
        
        // Update UI
        let btn = document.getElementById("bind-" + rebindingAction);
        btn.innerText = e.code;
        btn.classList.remove("waiting");
        
        rebindingAction = null; // Finish rebinding
        return;
    }

    if (gameState !== "playing") return;

    // Prevent default browser scrolling for ANY key that is currently bound
    if (Object.values(userBinds).includes(e.code)) {
        e.preventDefault();
    }

    if (e.code === userBinds.right) { keys.right = true; player.facing = 1; }
    if (e.code === userBinds.left) { keys.left = true; player.facing = -1; }
    if (e.code === userBinds.up) keys.up = true;
    if (e.code === userBinds.down) keys.down = true;
    
    // Restart Level (Press R)
    if (e.code === "KeyR") loadLevel(currentLevelIndex);

    // Escape to Menu
    if (e.code === "Escape") endGameplay();

    // Using a Potion / Jumping
    if (e.code === userBinds.jump && !jumpPressed) {
        jumpPressed = true;
        if (player.potions > 0) {
            player.vy = player.jumpPower;
            player.potions--;
            swapPhantomBlocks();
        }
    }

    // Dashing
    if (e.code === userBinds.dash && !dashPressed) {
        dashPressed = true;
        if (player.hasDash && !player.isDashing) {
            startDash();
        }
    }
});

window.addEventListener("keyup", (e) => {
    if (e.code === userBinds.right) keys.right = false;
    if (e.code === userBinds.left) keys.left = false;
    if (e.code === userBinds.up) keys.up = false;
    if (e.code === userBinds.down) keys.down = false;
    if (e.code === userBinds.jump) jumpPressed = false;
    if (e.code === userBinds.dash) dashPressed = false;
});
// --- LEVEL MANAGEMENT ---
function loadLevel(index) {
    if (index >= levels.length) {
        alert("Level under construction! Returning to Stage Select.");
        endGameplay();
        return;
    }

    map = JSON.parse(JSON.stringify(levels[index]));

    player.vx = 0;
    player.vy = 0;
    player.potions = 0;
    player.hasDash = true;
    player.isDashing = false;

    for (let y = 0; y < map.length; y++) {
        for (let x = 0; x < map[y].length; x++) {
            if (map[y][x] === 3) {
                player.x = x * TILE_SIZE + 4; 
                player.y = y * TILE_SIZE + 4;
                map[y][x] = 0; 
            }
        }
    }

    // --- NEW: Calculate Level Name Text ---
    let stageTitle = "Unknown Stage";
    let levelNumInStage = 1;
    let levelCounter = 0;
    
    // Figure out which stage we are in based on the index
    for (let i = 0; i < stageConfigs.length; i++) {
        if (index < levelCounter + stageConfigs[i].levelCount) {
            stageTitle = stageConfigs[i].title;
            levelNumInStage = (index - levelCounter) + 1;
            break;
        }
        levelCounter += stageConfigs[i].levelCount;
    }

// (Inside loadLevel, right at the bottom)
    let customName = levelNames[index] || "Unnamed Level";
    
    // Push the text directly into the HTML!
    hudLevelName.innerText = `${customName}`;
}

function startDash() {
    let dx = 0;
    let dy = 0;
    
    if (keys.right) dx += 1;
    if (keys.left) dx -= 1;
    if (keys.down) dy += 1;
    if (keys.up) dy -= 1;

    // If no keys are pressed, dash straight in the direction they are facing
    if (dx === 0 && dy === 0) {
        dx = player.facing;
    }

    // Normalize for diagonals (so diagonal dashes aren't way faster than straight ones)
    let length = Math.sqrt(dx * dx + dy * dy);
    dx /= length;
    dy /= length;

    player.vx = dx * player.dashSpeed;
    player.vy = dy * player.dashSpeed;

    player.hasDash = false;
    player.isDashing = true;
    player.dashTimer = player.dashDuration;
}

// --- COLLISION & INTERACTION LOGIC ---
function checkCollision(px, py) {
    let left = Math.floor(px / TILE_SIZE);
    let right = Math.floor((px + player.width - 0.1) / TILE_SIZE);
    let top = Math.floor(py / TILE_SIZE);
    let bottom = Math.floor((py + player.height - 0.1) / TILE_SIZE);

    for (let y = top; y <= bottom; y++) {
        for (let x = left; x <= right; x++) {
            // UPDATED: Now checks for 1 (Wall) AND 5 (Active Phantom Block)
            if (map[y] && (map[y][x] === 1 || map[y][x] === 5)) return true;
        }
    }
    return false;
}

function checkPotions(px, py) {
    let cx = Math.floor((px + player.width / 2) / TILE_SIZE);
    let cy = Math.floor((py + player.height / 2) / TILE_SIZE);
    
    if (map[cy] && map[cy][cx] === 2) {
        map[cy][cx] = 0; // Consume potion
        player.potions++;
    }
}

function checkCrystals(px, py) {
    let cx = Math.floor((px + player.width / 2) / TILE_SIZE);
    let cy = Math.floor((py + player.height / 2) / TILE_SIZE);
    
    // If we touch a crystal (7) and don't currently have a dash, pick it up!
    if (map[cy] && map[cy][cx] === 7 && !player.hasDash) {
        map[cy][cx] = 0; // Consume crystal
        player.hasDash = true; // Refill Dash!
    }
}

function checkGoal(px, py) {
    let cx = Math.floor((px + player.width / 2) / TILE_SIZE);
    let cy = Math.floor((py + player.height / 2) / TILE_SIZE);
    
    if (map[cy] && map[cy][cx] === 4) {
        // 1. "Consume" the door so it disappears
        map[cy][cx] = 0; 
        
        // 2. Scan the map to see if any doors (tile 4) are left
        let doorsRemaining = false;
        for (let y = 0; y < map.length; y++) {
            for (let x = 0; x < map[y].length; x++) {
                if (map[y][x] === 4) {
                    doorsRemaining = true;
                    break; // Stop checking early since we found at least one!
                }
            }
            if (doorsRemaining) break; // Break out of the outer loop too
        }

        // 3. If no doors are left, beat the level!
        if (!doorsRemaining) {
            currentLevelIndex++;
            
            // Save Progress
            if (currentLevelIndex > highestUnlockedLevel) {
                highestUnlockedLevel = currentLevelIndex;
                localStorage.setItem("spacebarSaveData", highestUnlockedLevel);
            }
            
            loadLevel(currentLevelIndex);
        }
    }
}

function swapPhantomBlocks() {
    for (let y = 0; y < map.length; y++) {
        for (let x = 0; x < map[y].length; x++) {
            if (map[y][x] === 5) {
                map[y][x] = 6;
            } else if (map[y][x] === 6) {
                map[y][x] = 5;
            }
        }
    }
    
    // If the player gets caught inside a newly solid block, crush them! (Reset level)
    if (checkCollision(player.x, player.y)) {
        loadLevel(currentLevelIndex);
    }
}

// --- GAME LOOP ---
function update() {
    // --- STATE MACHINE ---
    if (player.isDashing) {
        player.dashTimer--;
        if (player.dashTimer <= 0) {
            player.isDashing = false;
            // Cut velocity slightly when the dash ends so they don't slide forever
            player.vx *= 0.5; 
            player.vy *= 0.5; 
        }
    } else {
        // Normal Horizontal Movement
        if (keys.right) player.vx += 1;
        if (keys.left) player.vx -= 1;
        player.vx *= player.friction; 
        
        // Normal Vertical Movement (Gravity)
        player.vy += player.gravity;
    }

    // --- APPLY VELOCITIES & COLLISIONS ---
    player.x += player.vx;
    if (checkCollision(player.x, player.y)) {
        if (player.vx > 0) player.x = Math.floor((player.x + player.width) / TILE_SIZE) * TILE_SIZE - player.width - 0.1;
        else if (player.vx < 0) player.x = Math.floor(player.x / TILE_SIZE) * TILE_SIZE + TILE_SIZE + 0.1;
        player.vx = 0;
    }

    player.y += player.vy;
    if (checkCollision(player.x, player.y)) {
        if (player.vy > 0) {
            player.y = Math.floor((player.y + player.height) / TILE_SIZE) * TILE_SIZE - player.height - 0.1;
            // The line that used to refill the dash here has been removed!
        } else if (player.vy < 0) {
            player.y = Math.floor(player.y / TILE_SIZE) * TILE_SIZE + TILE_SIZE + 0.1;
        }
        player.vy = 0;
    }

    // --- INTERACTIONS ---
    checkPotions(player.x, player.y);
    checkCrystals(player.x, player.y); // Add our new crystal check!
    checkGoal(player.x, player.y);
    
    // Death pit check
    if (player.y > map.length * TILE_SIZE) {
        loadLevel(currentLevelIndex); 
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw Map
    for (let y = 0; y < map.length; y++) {
        for (let x = 0; x < map[y].length; x++) {
            if (map[y][x] === 1) {
                ctx.fillStyle = "#666"; // Walls
                ctx.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
            } else if (map[y][x] === 2) {
                ctx.fillStyle = "#00ff88"; // Potions
                ctx.fillRect(x * TILE_SIZE + 8, y * TILE_SIZE + 8, 16, 16);
            } else if (map[y][x] === 4) {
                ctx.fillStyle = "#ffd700"; // Finish Line
                ctx.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
            } else if (map[y][x] === 5) {
                ctx.fillStyle = "#ff4444"; // Active Phantom Block (Solid Red)
                ctx.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
            } else if (map[y][x] === 6) {
                ctx.fillStyle = "rgba(68, 68, 255, 0.2)"; // Inactive Phantom Block (Faint Blue)
                ctx.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
                ctx.strokeStyle = "#4444ff"; // Blue Outline
                ctx.lineWidth = 2; // Make the outline a bit crisper
                ctx.strokeRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
            } else if (map[y][x] === 7) {
                ctx.fillStyle = "#00ccff"; // Blue Crystal
                // Draw a diamond shape for the crystal
                ctx.beginPath();
                ctx.moveTo(x * TILE_SIZE + 16, y * TILE_SIZE + 4);  // Top
                ctx.lineTo(x * TILE_SIZE + 28, y * TILE_SIZE + 16); // Right
                ctx.lineTo(x * TILE_SIZE + 16, y * TILE_SIZE + 28); // Bottom
                ctx.lineTo(x * TILE_SIZE + 4, y * TILE_SIZE + 16);  // Left
                ctx.fill();
            }

                ctx.font = "16px sans-serif";
                ctx.textAlign = "center";

                ctx.fillText(currentLevelText, canvas.width / 2, 24);
        }
    }

    // Draw the Player Base
    // If they have a dash, they are blue. If they used it, they are pink/red.
    ctx.fillStyle = player.hasDash ? "#ff3366" : "#00ccff"; 
    ctx.fillRect(player.x, player.y, player.width, player.height);

    // Draw the Diegetic Potion UI (Green Inner Square)
    if (player.potions > 0) {
        let maxInnerSize = player.width - 4; 
        let innerSize = Math.min(player.potions * 6, maxInnerSize); 
        
        let innerX = player.x + (player.width / 2) - (innerSize / 2);
        let innerY = player.y + (player.height / 2) - (innerSize / 2);

        ctx.fillStyle = "#00ff88"; 
        ctx.fillRect(innerX, innerY, innerSize, innerSize);
    }
}

function loop() {
    if (gameState === "playing") {
        update();
        draw();
    }
    requestAnimationFrame(loop);
}

// --- UI & MENU LOGIC ---
const uiLayer = document.getElementById("uiLayer");
const hudLevelName = document.getElementById("hudLevelName"); // NEW
const menus = {
    main: document.getElementById("mainMenu"),
    settings: document.getElementById("settingsMenu"),
    stageSelect: document.getElementById("stageSelectMenu"),
    levelSelect: document.getElementById("levelSelectMenu")
};
const stageGrid = document.getElementById("stageGrid");
const levelGrid = document.getElementById("levelGrid");
const levelSelectTitle = document.getElementById("levelSelectTitle");

function showScreen(screenName) {
    Object.values(menus).forEach(m => m.classList.add("hidden"));
    if (menus[screenName]) menus[screenName].classList.remove("hidden");
}

function startGameplay(absoluteIndex) {
    currentLevelIndex = absoluteIndex;
    gameState = "playing";
    uiLayer.style.display = "none";
    hudLevelName.classList.remove("hidden"); // NEW: Show the HUD
    
    keys.right = false;
    keys.left = false;
    keys.up = false;
    keys.down = false;
    
    loadLevel(currentLevelIndex);
}

function endGameplay() {
    gameState = "menu";
    uiLayer.style.display = "flex";
    hudLevelName.classList.add("hidden"); // NEW: Hide the HUD
    showScreen("stageSelect");
}

// --- NEW DYNAMIC STAGE CONFIGURATION ---
// Define your stages and how many levels are inside them here!
const stageConfigs = [
    { title: "Tutorial", levelCount: 5 },
    { title: "Stage 1", levelCount: 10 },
    { title: "Stage 2", levelCount: 10 }
];

// Build Stage Select Menu
stageGrid.innerHTML = "";
stageConfigs.forEach((stage, index) => {
    let btn = document.createElement("button");
    btn.innerText = stage.title;
    btn.style.width = "auto"; // Overrides the 45px width in CSS so "Tutorial" fits
    btn.style.padding = "10px 15px";
    btn.onclick = () => buildLevelSelect(index);
    stageGrid.appendChild(btn);
});

// Build Level Select Menu
function buildLevelSelect(stageIndex) {
    let stage = stageConfigs[stageIndex];
    levelSelectTitle.innerText = stage.title;
    levelGrid.innerHTML = "";
    
    // Calculate the starting absolute index for this stage
    let startIdx = 0;
    for(let i = 0; i < stageIndex; i++) {
        startIdx += stageConfigs[i].levelCount;
    }
    
    for (let i = 1; i <= stage.levelCount; i++) {
        let btn = document.createElement("button");
        let absoluteIndex = startIdx + (i - 1);
        
        if (absoluteIndex >= levels.length) {
            // Level doesn't exist in the code yet
            btn.innerText = "X"; 
            btn.disabled = true; 
        } else if (absoluteIndex > highestUnlockedLevel) {
            // Level exists, but the player hasn't reached it yet
            btn.innerText = "🔒"; // Lock emoji!
            btn.disabled = true;
        } else {
            // Unlocked and playable
            btn.innerText = i;
            btn.onclick = () => startGameplay(absoluteIndex);
        }
        
        levelGrid.appendChild(btn);
    }
    showScreen("levelSelect");
}

// --- KEYBINDING MENU LOGIC ---
// Function to update the text on all keybind buttons
function refreshBindUI() {
    for (const action in userBinds) {
        const btn = document.getElementById(`bind-${action}`);
        if (btn) btn.innerText = userBinds[action];
    }
}

// Set up rebinding listeners for each button
document.querySelectorAll(".bind-btn").forEach(btn => {
    btn.onclick = () => {
        // Cancel any existing rebinding
        if (rebindingAction) {
            document.getElementById(`bind-${rebindingAction}`).classList.remove("waiting");
            refreshBindUI(); 
        }

        const action = btn.id.split("-")[1]; // gets "up", "jump", etc.
        rebindingAction = action;
        
        btn.innerText = "Press key...";
        btn.classList.add("waiting");
    };
});

// Button Listeners
document.getElementById("btnStartGame").onclick = () => showScreen("stageSelect");
document.getElementById("btnSettings").onclick = () => {
    refreshBindUI();
    showScreen("settings");
};
document.getElementById("btnSettingsBack").onclick = () => {
    // Cancel rebinding if they hit back
    if (rebindingAction) {
        document.getElementById(`bind-${rebindingAction}`).classList.remove("waiting");
        rebindingAction = null;
    }
    showScreen("main");
};

document.getElementById("btnStageBack").onclick = () => showScreen("main");
document.getElementById("btnLevelBack").onclick = () => showScreen("stageSelect");

document.getElementById("btnResetBinds").onclick = () => {
    userBinds = { ...defaultBinds };
    localStorage.setItem("spacebarBinds", JSON.stringify(userBinds));
    refreshBindUI();
};

document.getElementById("btnResetData").onclick = () => {
    if(confirm("Are you sure you want to erase all level progress?")) {
        localStorage.removeItem("spacebarSaveData");
        highestUnlockedLevel = 0;
        alert("Progress reset!");
    }
};

// Init
showScreen("main");
loop();