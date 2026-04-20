const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const TILE_SIZE = 32;
const TUTORIAL_STAGE_INDEX = 0;

// --- STAGE & ROOM DATA ---
let currentStageIndex = 0;
let currentRoomX = 0;
let currentRoomY = 0;
let map = []; 
let gameState = "menu";
let activeCheckpoint = null;
let activeSignText = null;
let keysCollected = 0;
let totalKeysInRoom = 0;
const CRUMBLE_TILE = 16;
const DASH_THROUGH_TILE = 17;
const DASH_DRAIN_TILE = 18;
const CRUMBLE_DURATION = 30;
let crumbleTimers = Object.create(null);
let activeDashDrainTile = null;

const stages = [
    {
        title: "Tutorial",
        rooms: {
            "0,0": [[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[1,3,11,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,2,0,0,1,1],[1,1,1,0,0,0,0,0,0,0,0,2,0,0,1,1,0,0,1,1],[1,1,1,0,0,0,0,2,0,0,1,1,0,0,1,1,0,0,1,1],[1,1,1,0,0,1,1,1,0,0,1,1,0,0,1,1,0,0,1,1],[1,1,1,9,9,1,1,1,9,9,1,1,9,9,1,1,9,9,1,1]],
            "1,0": [[1,2,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],[1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],[1,1,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],[0,0,0,1,1,0,0,0,4,0,2,0,0,0,0,0,0,1,0,0],[11,4,2,1,1,0,0,0,1,1,1,0,0,0,0,0,0,1,0,0],[1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1],[1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,2,2,1,1,1],[1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1],[1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1],[1,1,1,1,1,9,9,9,9,9,9,9,9,9,9,9,9,1,1,1]],
            "2,0": [[1,2,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],[1,1,2,0,0,0,0,0,0,2,0,0,2,0,0,4,0,0,0,1],[1,1,1,0,0,0,0,0,1,1,1,1,1,1,1,1,1,0,2,1],[0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,1,1],[0,4,0,0,11,0,0,2,0,0,0,0,0,0,0,0,0,2,1,1],[1,1,1,1,1,1,1,1,0,0,0,1,1,1,1,1,1,1,1,1],[1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1],[1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1],[1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1],[1,1,1,9,9,9,9,9,9,9,9,9,9,9,9,9,9,1,1,1]],
            "1,-1": [[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,2,1],[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1],[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,0,1,1],[1,0,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,1,1,1],[1,0,0,0,0,0,0,0,0,2,0,0,0,1,1,0,0,1,1,1],[1,0,0,0,0,2,0,0,0,1,1,0,0,1,1,0,0,1,1,1],[1,0,0,2,0,1,1,0,0,1,1,0,0,1,1,0,0,1,1,1],[1,0,0,0,0,1,1,0,0,1,1,0,0,1,1,0,0,1,1,1],[1,0,2,0,11,1,1,0,0,1,1,0,0,1,1,0,0,1,1,1],[1,10,10,1,1,1,1,9,9,1,1,9,9,1,1,9,9,1,1,1]],
            "1,-2": [[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],[1,4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],[1,1,2,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,1],[1,1,2,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0],[1,1,1,2,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0],[1,1,1,2,0,0,0,0,0,0,0,0,0,0,2,0,1,1,1,1],[1,1,1,1,2,0,0,0,0,0,0,0,0,0,1,0,0,0,0,1],[1,1,1,1,2,0,0,0,0,0,0,0,0,0,1,2,4,0,0,1],[1,1,1,1,1,1,1,9,9,9,9,9,9,9,1,1,1,10,10,1]],
            "2,-2": [[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,1,1,0,0,1,1,0,0,1,1,0,0,0,0],[0,0,0,0,0,0,1,1,0,0,1,1,0,0,1,1,0,0,0,0],[1,1,1,1,0,0,1,1,0,0,1,1,0,0,0,0,0,0,0,0],[0,0,0,1,0,0,1,1,1,1,1,1,0,0,1,1,0,0,0,0],[0,0,0,1,0,0,1,1,1,1,1,1,0,0,1,1,0,0,0,0],[1,0,0,1,0,0,1,1,0,0,1,1,0,0,1,1,0,0,0,0],[1,0,0,1,0,0,1,1,0,0,1,1,0,0,1,1,0,0,0,0],[1,0,0,1,0,0,1,1,0,0,1,1,0,0,1,1,0,0,0,0],[1,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]],
            "2,-1": [[1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0],[1,0,0,2,0,0,0,0,0,11,0,0,0,0,4,0,0,1,0,0],[1,1,1,1,0,0,1,1,1,1,1,0,0,0,1,1,2,1,0,1],[1,0,0,0,0,2,1,0,0,0,1,0,0,0,0,0,2,1,0,1],[1,0,0,0,1,1,1,0,0,0,1,0,0,0,0,0,2,1,0,1],[1,4,2,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,1],[1,1,1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,1],[1,0,0,0,2,0,0,0,0,0,1,0,0,0,0,0,0,0,0,1],[1,10,10,1,1,1,9,9,9,9,1,9,9,9,9,9,1,1,1,1]],
            "3,-1": [[1,1,2,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],[0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,2,2,0,1],[0,0,1,2,0,1,1,1,1,0,0,0,2,0,0,0,1,1,0,1],[1,4,1,1,1,1,0,0,0,0,0,0,1,1,0,0,1,1,0,1],[1,0,1,1,1,0,0,0,0,2,0,0,1,1,0,0,0,0,0,1],[1,0,1,1,1,0,0,1,1,1,0,0,0,0,0,0,0,0,0,1],[1,0,1,1,1,0,0,1,1,1,0,0,0,0,0,0,0,0,0,1],[1,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0,0,1],[1,0,0,0,11,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],[1,1,1,1,1,1,1,1,1,1,9,9,9,9,9,9,9,9,9,1]],
            "3,-2": [[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,2,1],[1,0,0,0,0,0,0,0,0,0,0,4,0,0,0,0,0,0,1,1],[1,0,0,0,0,2,0,0,2,0,1,1,1,0,0,0,2,0,1,1],[1,0,0,0,0,0,0,0,1,0,0,0,1,2,0,1,1,0,0,1],[1,0,0,0,0,2,0,0,0,0,0,0,1,0,0,1,1,0,0,1],[1,0,0,2,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,1],[1,0,1,1,1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,1],[1,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,1],[1,0,4,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,1],[1,1,10,10,1,9,9,9,9,9,9,9,1,9,9,9,9,9,9,1]],
            "3,-3": [[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],[1,0,8,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,10,10,1]]
        },
        roomNames: {},
        signs: {
            "0,0": "Collect the green jump potions to gain jumps.",
            "1,0": "Big squares are checkpoints, press R to reset.",
            "2,0": "You can jump after falling off platforms.",
            "1,-1":"You found the secret pathway!",
            "2,-1": "Press Left Shift to Dash!",
            "3,-1": "Hold the up arrow while dashing to dash upwards!",
        }
    },
    {
        title: "Stage 1",
        rooms: {
            "0,0": [[1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],[1,0,0,8,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[1,1,1,1,0,0,0,0,11,0,0,0,0,0,0,0,0,0,0,0],[1,0,0,0,0,0,0,1,1,1,1,1,0,0,0,0,0,1,1,1],[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],[1,3,2,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],[1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],[1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],[1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],[1,1,1,1,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,1]],
            "1,0": [[1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1],[0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,1],[4,0,11,0,0,0,0,7,1,0,0,0,0,0,0,0,0,0,0,1],[1,1,1,0,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,1],[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[1,0,0,0,0,0,0,0,0,0,0,0,0,7,0,0,0,0,0,0],[1,0,0,0,0,0,1,1,1,0,0,0,1,1,1,0,0,0,1,1],[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],[1,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,1]],
            "1,-1": [[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],[1,0,0,0,0,0,0,0,0,0,0,14,0,0,0,0,0,0,0,1],[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],[1,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,1],[1,0,0,0,0,1,1,1,1,0,0,0,0,0,0,1,1,15,15,1],[1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,1,1,0,0,0],[1,0,4,0,0,11,0,0,1,0,0,0,0,0,0,1,1,0,0,0],[1,1,1,1,1,1,10,10,1,9,9,9,9,9,9,1,1,1,1,1]],
            "2,0": [[1,2,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],[1,1,0,0,0,0,0,5,0,0,0,6,0,0,0,0,0,0,0,1],[1,1,0,2,0,0,0,5,0,2,0,6,0,2,0,0,0,0,0,1],[1,1,1,1,1,5,5,5,1,1,1,6,1,1,1,0,0,0,0,1],[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,0,1],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1],[0,4,0,11,0,0,2,0,0,2,0,0,0,0,0,0,0,0,0,1],[1,1,1,1,1,5,5,5,6,6,6,1,1,1,0,0,0,0,0,1],[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],[1,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,1]],
            "2,-1": [[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1],[1,7,0,0,0,0,0,0,0,0,15,0,0,0,0,0,0,0,0,1],[1,5,5,0,0,0,0,14,0,0,15,0,0,0,0,0,0,0,7,1],[1,2,0,0,0,0,0,0,0,0,15,0,0,0,0,0,0,1,1,1],[1,6,6,0,0,0,0,0,0,0,15,0,0,0,0,2,0,0,0,1],[1,2,0,0,0,0,0,0,0,0,15,0,0,2,0,0,0,0,0,1],[1,10,10,1,0,0,0,0,0,0,15,0,0,0,0,0,0,0,0,1],[0,0,0,1,0,0,0,0,0,0,15,0,2,0,0,0,0,0,0,1],[0,4,0,1,0,0,0,0,0,0,15,1,1,1,0,0,0,0,0,1],[1,10,10,1,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,1]],
            "2,-2": [[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],[1,0,0,0,0,0,0,0,0,0,0,0,0,0,2,0,0,1,1,1],[1,0,0,0,0,0,0,0,0,0,2,0,0,1,1,1,0,0,0,1],[1,0,0,0,0,0,2,0,0,1,1,1,0,0,0,0,0,0,0,1],[1,0,2,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0],[1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[1,0,0,0,0,0,0,0,0,0,4,0,0,0,11,0,0,0,0,1],[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,10,10,1]],
            "3,-2": [[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],[1,0,0,0,0,2,0,0,0,0,0,0,0,0,0,2,14,0,0,1],[1,0,0,0,0,6,0,0,0,0,2,0,0,0,0,6,6,0,0,1],[1,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],[1,5,5,5,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,7,0,0,0,1],[0,0,0,0,0,0,0,0,0,0,0,2,14,0,0,0,0,0,0,1],[0,4,0,11,0,0,0,0,0,0,0,5,5,0,0,0,0,0,0,1],[1,5,5,5,15,15,0,0,0,0,0,0,0,0,0,0,0,0,0,1],[1,9,9,9,0,0,9,9,9,9,9,9,9,9,9,9,9,9,9,1]],
            "3,-1": [[1,1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1],[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1],[1,0,0,0,4,0,0,0,0,0,0,0,7,0,0,0,0,0,1,1],[1,0,0,0,1,1,0,0,0,0,2,0,0,0,0,0,0,2,1,1],[1,0,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,15,0],[1,0,0,0,0,0,0,0,7,0,14,0,0,0,0,0,0,0,15,0],[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1],[1,0,0,0,0,0,0,0,0,2,0,0,2,0,0,0,1,1,1,1],[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1],[1,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,1,1,1,1]],
            "4,-1": [[1,0,2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],[1,10,10,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],[1,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],[1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],[1,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,1]],
            "4,-2": [[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,2,1],[1,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,1,1],[1,0,0,0,0,0,0,2,0,0,0,0,0,2,0,0,0,2,1,1],[1,0,0,0,0,0,0,5,0,0,0,0,0,0,0,0,2,1,1,1],[1,0,0,0,0,0,0,5,0,0,0,0,0,0,0,0,0,1,1,1],[1,0,0,0,0,2,0,5,0,0,7,0,0,0,0,0,0,1,1,1],[1,2,6,6,6,6,6,0,0,5,5,5,0,0,0,0,0,1,1,1],[1,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1],[1,0,4,1,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1],[1,10,10,1,9,9,9,9,9,9,9,9,9,9,9,9,9,1,1,1]],
            "4,-3": [[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],[0,0,0,0,0,0,0,0,13,13,0,0,0,0,0,0,0,0,0,1],[1,0,0,0,0,0,0,0,1,2,0,0,0,0,0,0,0,0,0,1],[1,0,0,0,0,0,0,0,13,13,13,0,0,2,0,4,0,0,0,1],[1,0,0,0,0,0,0,0,0,0,0,0,0,12,12,12,0,0,0,1],[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,11,2,0,1],[1,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,1,10,10,1]],
            "3,-3": [[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,0,0],[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,12,12,12,1],[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],[1,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,1]],
            "2,-3": [[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],[1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],[1,1,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],[1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[1,1,1,1,1,0,2,0,0,0,4,0,0,0,0,0,0,0,0,0],[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]],
            "1,-3": [[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],[0,0,0,5,0,0,6,0,0,5,0,0,0,6,0,5,0,0,0,1],[0,0,0,5,0,0,6,0,0,5,0,0,0,6,0,5,0,0,0,1],[1,1,0,5,0,2,6,2,0,5,0,0,0,6,2,5,0,0,0,0],[1,1,0,5,0,0,6,0,0,5,2,0,4,6,0,5,0,2,0,4],[1,1,0,5,0,0,6,0,0,5,1,1,1,6,0,5,0,1,1,1],[1,1,0,0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,1],[1,1,0,0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,1],[1,1,0,0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,1],[1,1,9,9,9,9,9,9,9,9,1,1,1,9,9,9,9,9,9,1]],
            "0,-3": [[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0],[1,0,1,1,1,1,1,0,0,0,1,0,0,0,0,0,1,0,0,0],[1,0,1,0,0,0,0,0,0,0,1,0,0,0,0,0,1,0,0,12],[1,0,1,0,0,0,0,0,0,0,1,0,0,0,0,0,1,0,0,1],[1,0,1,0,0,1,1,0,0,0,1,0,0,0,0,0,1,0,0,1],[1,0,1,0,0,0,1,0,0,0,1,0,0,0,0,0,1,0,0,1],[1,0,1,1,1,1,1,0,0,0,1,1,1,1,1,0,1,0,0,1],[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,4,4,1],[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1]],
            "0,-2": [[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1],[1,14,0,0,0,6,0,0,5,0,0,6,0,0,0,0,6,0,0,1],[1,2,2,0,2,6,0,2,5,0,2,6,0,2,0,0,6,2,0,1],[1,5,5,0,0,6,0,0,5,0,0,6,6,6,6,0,6,1,1,1],[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],[1,0,0,0,0,2,0,0,0,2,0,0,0,2,0,0,0,14,0,1],[1,12,13,0,13,12,13,0,12,13,12,0,13,12,13,0,1,1,0,1],[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],[1,0,0,0,0,0,0,0,0,0,0,1,15,1,0,0,0,1,1,1],[1,9,9,9,9,9,9,9,9,9,9,9,0,9,9,9,9,9,9,1]],
            "0,-1": [[1,1,1,1,1,1,1,1,1,1,1,0,0,0,1,1,1,1,1,1],[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1],[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1],[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1],[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1],[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,12,12,12,1,1],[1,0,0,0,0,0,0,0,0,0,0,0,12,12,12,1,1,1,1,1],[1,0,0,0,0,0,0,0,0,12,12,12,1,1,1,1,1,1,1,1],[1,0,0,0,0,0,12,12,12,1,1,1,1,1,1,1,1,1,1,1],[1,0,0,12,12,12,1,1,1,1,1,1,1,1,1,1,1,1,1,1]],
        },
        roomNames: {},
        signs: {
            "0,0": "Hold two directions at once to dash diagonally!","1,0": "Blue crystals will refill your dash when collected.",
            "2,0": "Red and blue blocks will swap when you jump","2,-2":"You're halfway through the stage!",
            "1,-1":"Keys will open locked doors when collected!","3,-2": "You have to collect all keys in a level to move on",
            "4,-3":"Converyor belts push you in the direction they point!"
        },
    },
    {
        title: "Stage 2",
        rooms: {
        "0,0": [      
        [1,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,1,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,0,0,0,0,0,0,0,0,0,16,16,16,16,16,16,0,0,0,0],
        [1,3,0,11,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,0],
        [1,1,1,1,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,1],
        ],
        "0,-1": [      
        [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1],
        [1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0],
        [1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0],
        [1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1],
        [1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,1,14,0,0,0,0,0,11,7,0,0,0,2,0,0,0,0,14,1],
        [0,15,16,16,16,16,16,1,10,10,1,16,16,16,16,16,16,16,16,1],
        [0,15,0,0,0,16,16,1,4,2,1,0,0,0,0,0,0,0,0,1],
        [1,9,9,9,9,9,9,9,10,10,9,9,9,9,9,9,9,9,9,1],
        ],
        "-1,-1": [      
        [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,0,14,0,0,0,0,2,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,0,16,0,0,0,0,16,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,16,1],
        [1,0,0,0,0,0,0,0,2,0,0,0,0,0,0,2,0,0,2,1],
        [1,16,16,16,16,0,0,0,16,0,0,0,0,0,0,16,0,0,16,0],
        [1,15,15,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,4],
        [1,5,5,9,9,9,9,9,9,9,9,9,9,9,9,9,9,1,1,1],
        ],
        "-1,0": [      
        [1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,4,0,0,0,0,0,0,0,2,2,0,0,0,0,0,0,0,14,1],
        [1,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,9,9,9,9,0,0,0,0,0,0,0,0,0,0,9,9,9,9,1],
        [0,15,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [0,15,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,1],
        ],
        "-2,0": [      
        [1,1,1,1,1,1,1,1,1,2,0,1,1,1,1,1,1,1,1,1],
        [1,0,0,0,0,0,0,0,0,10,10,0,0,0,0,0,0,0,0,1],
        [1,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,1],
        [1,0,0,0,0,0,0,0,0,10,10,0,0,0,0,0,0,0,0,1],
        [1,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,1],
        [1,0,0,0,0,0,0,0,0,10,10,0,0,0,0,0,0,0,0,1],
        [1,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,1],
        [0,0,0,0,0,0,0,0,0,10,10,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0],
        [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
        ],
        "-2,-1": [      
        [1,2,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
        [1,10,10,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,10,10,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,10,10,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,10,10,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,1,1,1,1,1,1,1,1,10,10,1,1,1,1,1,1,1,1,1],
        ],
        "1,0": [      
        [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [0,4,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,14,0,1],
        [1,1,1,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,9,9,9,9,9,9,9,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,0,0,0,0,0,0,0,16,16,16,0,0,16,16,16,16,15,15,1],
        [1,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,0,0,1],
        ],
        "1,1": [      
        [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,14,0,2,0,0,0,0,0,0,0,0,0,0,0,0,11,2,4,1],
        [1,1,1,1,16,16,16,16,16,16,16,16,16,16,16,16,1,10,10,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,0,0,1],
        [0,15,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [0,15,0,0,0,0,0,0,0,7,0,0,0,0,16,16,16,16,16,1],
        [1,16,16,16,0,0,0,16,16,16,16,16,0,0,0,0,0,0,0,1],
        [1,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,1],
        ],
        "0,1": [      
        [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
        [0,5,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [0,5,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,16,16,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,1],
        [1,0,0,0,2,0,0,0,0,0,0,0,0,0,16,0,0,0,0,1],
        [1,0,0,16,16,16,16,16,16,0,0,0,0,0,2,0,0,0,0,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,16,0,0,0,0,0],
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,4,0],
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,16,16,16,16,16,1],
        [1,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,1],
        ],
       "-1,1": [     
       [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
       [1,0,0,0,1,0,0,0,0,0,0,0,0,2,0,1,0,0,0,0],
       [1,0,0,0,1,0,7,0,0,0,0,0,0,0,0,1,0,0,0,4],
       [1,1,1,1,1,16,16,16,0,0,0,0,0,0,0,1,16,16,16,1],
       [1,0,0,0,0,0,0,0,0,0,0,0,0,7,0,0,0,0,0,1],
       [1,0,0,0,0,0,0,0,0,0,0,0,16,16,16,0,0,0,0,1],
       [0,0,0,0,0,9,9,9,0,0,0,0,0,2,0,0,0,0,0,1],
       [0,0,0,0,0,1,1,1,0,0,0,0,16,16,16,0,9,9,9,1],
       [1,16,16,0,0,1,1,1,0,0,0,0,0,0,0,0,1,1,1,1],
       [1,9,9,9,9,1,1,1,9,9,9,9,9,9,9,9,1,1,1,1],
       ],
       "-2,1": [     
       [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
       [1,0,0,0,5,0,6,0,0,0,0,0,0,0,0,0,0,0,0,1],
       [1,0,0,0,5,2,6,0,2,0,0,0,0,0,0,16,16,16,0,1],
       [1,0,0,0,5,0,6,16,16,16,0,0,0,0,0,0,0,2,0,1],
       [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,12,0,1],
       [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,1],
       [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,12,0],
       [1,16,16,16,0,0,0,0,0,0,0,0,0,0,0,0,0,2,0,4],
       [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1],
       [1,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,1,1,1],
       ],
       "-3,1": [     
       [1,1,1,1,1,1,1,1,1,2,0,1,1,1,1,1,1,1,1,1],
       [1,0,0,0,0,0,0,0,0,10,10,0,0,0,0,0,0,0,0,1],
       [1,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,1],
       [1,0,0,0,0,0,0,0,0,10,10,0,0,0,0,0,0,0,0,1],
       [1,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,1],
       [1,0,0,0,0,0,0,0,0,10,10,0,0,0,0,0,0,0,0,0],
       [1,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0],
       [1,0,0,0,0,0,0,0,0,10,10,0,0,0,0,0,0,0,0,1],
       [1,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,1],
       [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
       ],
       "-3,0": [     
       [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
       [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
       [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
       [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
       [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
       [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
       [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
       [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
       [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
       [1,1,1,1,1,1,1,1,1,10,10,1,1,1,1,1,1,1,1,1],
       ],
       "-2,-2": [     
       [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
       [1,0,0,0,0,0,0,0,0,17,0,0,0,0,0,0,0,0,0,1],
       [1,0,0,0,0,0,0,0,0,17,0,0,0,0,0,0,0,0,0,1],
       [1,0,0,0,0,0,0,0,0,17,0,0,0,0,0,0,0,0,0,1],
       [1,0,0,0,0,0,0,0,0,17,0,0,0,0,0,0,0,0,0,0],
       [1,0,0,0,0,0,0,0,0,17,0,0,0,0,0,0,0,0,0,0],
       [1,0,0,0,0,0,0,0,0,17,0,0,0,0,0,0,0,1,1,1],
       [1,0,0,0,0,0,0,0,0,17,0,0,0,0,0,0,0,1,1,1],
       [1,0,0,4,0,0,11,0,0,17,0,0,0,0,0,7,0,1,1,1],
       [1,10,10,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
       ],
       "-1,-2": [     
       [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
       [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,17,0],
       [1,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,17,0],
       [1,0,0,0,0,0,0,0,0,0,0,2,0,1,1,0,0,0,1,1],
       [0,0,0,0,0,0,2,0,0,0,1,1,1,1,1,0,0,0,0,1],
       [4,0,2,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,0,1],
       [1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
       [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
       [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
       [1,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,1],
       ],
       "0,-2": [     
       [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
       [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,7,0,1],
       [4,0,11,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,1],
       [1,1,1,9,9,9,1,1,1,0,0,0,0,0,0,0,0,0,0,1],
       [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
       [1,0,2,0,0,2,0,0,0,0,0,0,0,0,0,0,0,2,0,1],
       [1,0,13,13,0,13,13,0,13,13,0,0,0,0,0,0,0,0,0,1],
       [1,0,0,0,0,7,0,0,0,0,2,0,0,0,0,0,0,0,0,1],
       [1,16,16,16,16,16,0,0,0,16,16,16,0,0,0,0,0,0,0,1],
       [1,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,17,17,1],
       ],
       "1,-1": [     
       [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
       [0,0,0,0,0,0,0,0,0,17,0,0,0,0,0,0,0,0,0,1],
       [0,4,0,0,0,0,0,0,0,17,0,0,0,0,0,0,0,0,7,1],
       [1,1,1,0,0,0,0,0,0,17,0,2,0,0,0,0,0,0,0,1],
       [1,0,0,0,0,0,0,0,0,17,0,0,0,0,0,0,0,0,0,1],
       [1,0,16,16,16,0,0,0,0,17,0,2,0,0,0,0,0,0,0,1],
       [1,2,0,0,0,0,0,0,0,17,0,0,0,0,0,0,0,0,0,1],
       [1,0,0,0,0,0,0,0,0,17,0,2,0,0,0,0,0,0,0,17],
       [1,0,16,16,16,0,0,0,0,17,16,16,16,0,0,0,0,0,0,17],
       [1,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,1],
       ],
       "2,-1": [     
       [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
       [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
       [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
       [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
       [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
       [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
       [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
       [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
       [0,0,11,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
       [1,1,1,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,1],
       ],

        },
        roomNames: {},
        signs: {
            "0,0": "These platforms crumble under your feet!",
            "1,1": "Press the down arrow to drop through thin platforms!",
            "0,-1": "Press the down arrow to drop through thin platforms!",
            "-2,-2": "Try dashing through these new blocks!",
            "0,-2": "You can dash downwards also!",
            "2,-1": "Coming Soon!"
        },
    }
];

// --- TIMER STATE ---
let timerMode = localStorage.getItem("timerMode") || "none"; 
let startTime = 0;
let elapsed = 0;
let isTimerRunning = false;
let activeTimerRecordKey = null;
let isWholeGameRun = false;
let bestTimes = JSON.parse(localStorage.getItem("bestTimes")) || {}; 
let completedStages = JSON.parse(localStorage.getItem("completedStages")) || {};
const stageButtons = [];

const hudTimer = document.getElementById("hudTimer");
const hudLevelName = document.getElementById("hudLevelName");
const timeTooltip = document.getElementById("timeTooltip"); 
const timerSelect = document.getElementById("timerSelect");
timerSelect.value = timerMode;

const player = {
    x: 0, y: 0, width: 24, height: 24, 
    vx: 0, vy: 0,
    friction: 0.8, gravity: 0.4, jumpPower: -8,
    potions: 0, facing: 1, hasDash: true, isDashing: false, dashTimer: 0, dashDuration: 12, dashSpeed: 10
};

// --- KEYBINDINGS ---
const defaultBinds = { up: "ArrowUp", down: "ArrowDown", left: "ArrowLeft", right: "ArrowRight", jump: "Space", dash: "ShiftLeft" };
let userBinds = JSON.parse(localStorage.getItem("spacebarBinds")) || { ...defaultBinds };
let rebindingAction = null; 
const keys = { right: false, left: false, up: false, down: false };
let jumpPressed = false; 
let dashPressed = false;

// --- TIMER FORMATTING & HOVER ---
function formatTime(ms) {
    let totalSeconds = ms / 1000;
    let mins = Math.floor(totalSeconds / 60);
    let secs = Math.floor(totalSeconds % 60);
    let millis = Math.floor(ms % 1000);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}.${millis.toString().padStart(3, '0')}`;
}

function persistBestTimes() {
    localStorage.setItem("bestTimes", JSON.stringify(bestTimes));
}

function persistCompletedStages() {
    localStorage.setItem("completedStages", JSON.stringify(completedStages));
}

function hasBestTime(key) {
    return Object.prototype.hasOwnProperty.call(bestTimes, key);
}

function hasCompletedStage(stageIndex) {
    return Boolean(completedStages[stageIndex]);
}

function getStageBestKey(stageIndex) {
    return `stage_${stageIndex}`;
}

function getVisibleBestTimeKey() {
    if (gameState !== "playing") return null;
    if (timerMode === "stages") return getStageBestKey(currentStageIndex);
    return activeTimerRecordKey;
}

function sanitizeBestTimes() {
    if (!hasBestTime("full_game")) return;

    const hasInvalidWholeGameTime = stages.some((stage, index) => {
        const stageKey = getStageBestKey(index);
        return hasBestTime(stageKey) && bestTimes.full_game < bestTimes[stageKey];
    });

    if (hasInvalidWholeGameTime) {
        delete bestTimes.full_game;
        persistBestTimes();
    }
}

sanitizeBestTimes();

function syncCompletedStages() {
    let changed = false;

    if (hasBestTime("full_game")) {
        for (let i = 0; i < stages.length; i++) {
            if (!hasCompletedStage(i)) {
                completedStages[i] = true;
                changed = true;
            }
        }
    }

    for (let i = 0; i < stages.length; i++) {
        if (!hasBestTime(getStageBestKey(i))) continue;

        for (let completedIndex = 0; completedIndex <= i; completedIndex++) {
            if (!hasCompletedStage(completedIndex)) {
                completedStages[completedIndex] = true;
                changed = true;
            }
        }
    }

    if (changed) persistCompletedStages();
}

function isStageUnlocked(stageIndex) {
    return stageIndex === TUTORIAL_STAGE_INDEX || hasCompletedStage(stageIndex - 1);
}

function markStageCompleted(stageIndex) {
    if (hasCompletedStage(stageIndex)) return;

    completedStages[stageIndex] = true;
    persistCompletedStages();
}

syncCompletedStages();

function saveBestTime() {
    if (!activeTimerRecordKey) return;

    let key = activeTimerRecordKey;
    if (!hasBestTime(key) || elapsed < bestTimes[key]) {
        bestTimes[key] = elapsed;
        persistBestTimes();
    }
}

hudTimer.addEventListener("mouseenter", () => {
    let key = getVisibleBestTimeKey();
    let best = key ? bestTimes[key] : null;
    timeTooltip.innerText = key && hasBestTime(key) ? `Best: ${formatTime(best)}` : "Best: --:--.---";
    timeTooltip.classList.remove("hidden");
});

hudTimer.addEventListener("mousemove", (e) => {
    timeTooltip.style.left = (e.clientX - 80) + "px"; 
    timeTooltip.style.top = (e.clientY + 20) + "px";
});

hudTimer.addEventListener("mouseleave", () => {
    timeTooltip.classList.add("hidden");
});

// --- INPUT HANDLING ---
window.addEventListener("keydown", (e) => {
    if (rebindingAction) {
        e.preventDefault();
        userBinds[rebindingAction] = e.code;
        localStorage.setItem("spacebarBinds", JSON.stringify(userBinds));
        let btn = document.getElementById("bind-" + rebindingAction);
        btn.innerText = e.code;
        btn.classList.remove("waiting");
        rebindingAction = null; 
        return;
    }

    if (gameState !== "playing") return;
    if (Object.values(userBinds).includes(e.code)) e.preventDefault();

    if (e.code === userBinds.right) { keys.right = true; player.facing = 1; }
    if (e.code === userBinds.left) { keys.left = true; player.facing = -1; }
    if (e.code === userBinds.up) keys.up = true;
    if (e.code === userBinds.down) keys.down = true;
    if (e.code === "KeyR") die();
    if (e.code === "Escape") endGameplay(false);

    if (e.code === userBinds.jump && !jumpPressed) {
        jumpPressed = true;
        if (player.potions > 0) {
            player.vy = player.jumpPower;
            player.potions--;
            swapPhantomBlocks();
        }
    }

    if (e.code === userBinds.dash && !dashPressed) {
        dashPressed = true;
        if (player.hasDash && !player.isDashing) startDash();
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

// --- CORE LOGIC ---
function loadRoom(rx, ry, entrance = 'spawn') {
    const roomKey = `${rx},${ry}`;
    const currentStage = stages[currentStageIndex];
    if (!currentStage.rooms[roomKey]) return false;

    currentRoomX = rx;
    currentRoomY = ry;
    map = JSON.parse(JSON.stringify(currentStage.rooms[roomKey]));
    crumbleTimers = Object.create(null);
    activeDashDrainTile = null;

    player.vx = 0; 
    player.isDashing = false;
    player.hasDash = true;
    player.potions = 0; 

    keysCollected = 0;
    totalKeysInRoom = 0;
    for (let y = 0; y < map.length; y++) {
        for (let x = 0; x < map[y].length; x++) {
            if (map[y][x] === 14) totalKeysInRoom++;
        }
    }

    if (entrance === 'spawn') {
        player.vy = 0;
        keysCollected = 0; // Reset keys
        totalKeysInRoom = 0; 
        
        for (let y = 0; y < map.length; y++) {
            for (let x = 0; x < map[y].length; x++) {
                if (map[y][x] === 3) {
                    player.x = x * TILE_SIZE + 4; 
                    player.y = y * TILE_SIZE + 4;
                    map[y][x] = 0; 
                    if (!activeCheckpoint) activeCheckpoint = { rx, ry, px: player.x, py: player.y, cx: x, cy: y };
                }
                // Count the keys in the newly loaded room
                if (map[y][x] === 14) {
                    totalKeysInRoom++;
                }
            }
        }
    } else if (entrance === 'checkpoint' && activeCheckpoint) {
        player.vy = 0;
        player.x = activeCheckpoint.px;
        player.y = activeCheckpoint.py;
    } else if (entrance === 'left') player.x = 1;
    else if (entrance === 'right') player.x = canvas.width - player.width - 1;
    else if (entrance === 'top') player.y = 1;
    else if (entrance === 'bottom') player.y = canvas.height - player.height - 1;

    hudLevelName.innerText = currentStage.roomNames[roomKey] || "";
    return true;
}

function die() {
    if (activeCheckpoint) loadRoom(activeCheckpoint.rx, activeCheckpoint.ry, 'checkpoint');
    else loadRoom(0, 0, 'spawn');
}

function startDash() {
    let dx = 0, dy = 0;
    if (keys.right) dx += 1;
    if (keys.left) dx -= 1;
    if (keys.down) dy += 1;
    if (keys.up) dy -= 1;

    if (dx === 0 && dy === 0) dx = player.facing;
    let length = Math.sqrt(dx * dx + dy * dy);
    dx /= length; dy /= length;

    player.vx = dx * player.dashSpeed;
    player.vy = dy * player.dashSpeed;
    player.hasDash = false;
    player.isDashing = true;
    player.dashTimer = player.dashDuration;
}

function isSolidTile(tile) {
    if (tile === DASH_THROUGH_TILE) return !player.isDashing;
    return tile === 1 || tile === 5 || tile === 12 || tile === 13 || tile === 15 || tile === DASH_DRAIN_TILE;
}

function isTouchingTile(px, py, targetTile) {
    let left = Math.floor(px / TILE_SIZE);
    let right = Math.floor((px + player.width - 0.1) / TILE_SIZE);
    let top = Math.floor(py / TILE_SIZE);
    let bottom = Math.floor((py + player.height - 0.1) / TILE_SIZE);

    for (let y = top; y <= bottom; y++) {
        for (let x = left; x <= right; x++) {
            let checkX = Math.max(0, Math.min(x, 19));
            if (map[y] && map[y][checkX] === targetTile) {
                return true;
            }
        }
    }

    return false;
}

function checkCollision(px, py) {
    let left = Math.floor(px / TILE_SIZE);
    let right = Math.floor((px + player.width - 0.1) / TILE_SIZE);
    let top = Math.floor(py / TILE_SIZE);
    let bottom = Math.floor((py + player.height - 0.1) / TILE_SIZE);

    for (let y = top; y <= bottom; y++) {
        for (let x = left; x <= right; x++) {
            let checkX = Math.max(0, Math.min(x, 19)); 
            if (map[y] && isSolidTile(map[y][checkX])) {
                return true;
            }
        }
    }
    return false;
}

function checkHazards(px, py) {
    let margin = 4;
    let left = Math.floor((px + margin) / TILE_SIZE);
    let right = Math.floor((px + player.width - margin) / TILE_SIZE);
    let top = Math.floor((py + margin) / TILE_SIZE);
    let bottom = Math.floor((py + player.height - margin) / TILE_SIZE);

    for (let y = top; y <= bottom; y++) {
        for (let x = left; x <= right; x++) {
            if (map[y] && map[y][x] === 9) { die(); return; }
        }
    }
}

function checkInteractions(px, py) {
    let cx = Math.floor((px + player.width / 2) / TILE_SIZE);
    let cy = Math.floor((py + player.height / 2) / TILE_SIZE);
    if (!map[cy]) return;
    let tile = map[cy][cx];

    activeSignText = null;

    // CHECK FOR SIGNS (The simple version!)
    if (tile === 11) {
        const currentStage = stages[currentStageIndex];
        const roomKey = `${currentRoomX},${currentRoomY}`;
        
        // Just check if the current room has a sign message, and display it!
        if (currentStage.signs && currentStage.signs[roomKey]) {
            activeSignText = currentStage.signs[roomKey];
        }
    }

    if (tile === 2) { map[cy][cx] = 0; player.potions++; }
    else if (tile === 7 && !player.hasDash) { map[cy][cx] = 0; player.hasDash = true; }
    else if (tile === 4) activeCheckpoint = { rx: currentRoomX, ry: currentRoomY, px: cx * TILE_SIZE + 4, py: cy * TILE_SIZE + 4, cx, cy };
    else if (tile === 8) { finishStage(); return; }
    else if (tile === 14) {
        map[cy][cx] = 0; // Remove the key from the map
        keysCollected++;
        if (keysCollected >= totalKeysInRoom) {
            unlockBlocks(); // Open the doors!
        }
    }
}

function swapPhantomBlocks() {
    for (let y = 0; y < map.length; y++) {
        for (let x = 0; x < map[y].length; x++) {
            if (map[y][x] === 5) map[y][x] = 6;
            else if (map[y][x] === 6) map[y][x] = 5;
        }
    }
    if (checkCollision(player.x, player.y)) die(); 
}

function unlockBlocks() {
    for (let y = 0; y < map.length; y++) {
        for (let x = 0; x < map[y].length; x++) {
            if (map[y][x] === 15) {
                map[y][x] = 0; // Turn the locked block into empty space
            }
        }
    }
}

function getTileKey(x, y) {
    return `${x},${y}`;
}

function activateCrumblePlatform(x, y) {
    if (!map[y] || map[y][x] !== CRUMBLE_TILE) return;

    const tileKey = getTileKey(x, y);
    if (!crumbleTimers[tileKey]) {
        crumbleTimers[tileKey] = CRUMBLE_DURATION;
    }
}

function updateCrumblePlatforms() {
    for (const tileKey of Object.keys(crumbleTimers)) {
        crumbleTimers[tileKey]--;

        if (crumbleTimers[tileKey] > 0) continue;

        const [x, y] = tileKey.split(",").map(Number);
        if (map[y] && map[y][x] === CRUMBLE_TILE) {
            map[y][x] = 0;
        }

        delete crumbleTimers[tileKey];
    }
}

function getSteppedOnTile(targetTile) {
    let footY = Math.floor((player.y + player.height + 0.1) / TILE_SIZE);
    let left = Math.floor((player.x + 4) / TILE_SIZE);
    let right = Math.floor((player.x + player.width - 4) / TILE_SIZE);

    for (let x = left; x <= right; x++) {
        let checkX = Math.max(0, Math.min(x, 19));
        if (map[footY] && map[footY][checkX] === targetTile) {
            return getTileKey(checkX, footY);
        }
    }

    return null;
}

function handleDashDrainBlocks() {
    const steppedTile = getSteppedOnTile(DASH_DRAIN_TILE);
    if (!steppedTile) {
        activeDashDrainTile = null;
        return false;
    }

    if (steppedTile === activeDashDrainTile) {
        return false;
    }

    activeDashDrainTile = steppedTile;

    if (player.hasDash) {
        player.hasDash = false;
        return false;
    }

    die();
    return true;
}

// --- GAME LOOP ---
function update() {
    updateCrumblePlatforms();

    // TIMER TICKING HAPPENS HERE!
    if (isTimerRunning && timerMode !== "none") {
        elapsed = performance.now() - startTime;
        hudTimer.innerText = formatTime(elapsed);
    }

    let dashJustExpired = false;
    if (player.isDashing) {
        player.dashTimer--;
        if (player.dashTimer <= 0) {
            player.isDashing = false;
            player.vx *= 0.5;
            player.vy *= 0.5;
            dashJustExpired = true;
        }
    } else {
        if (keys.right) player.vx += 1;
        if (keys.left) player.vx -= 1;
        player.vx *= player.friction; 
        player.vy += player.gravity;
    }

    let bottomY = Math.floor((player.y + player.height + 0.1) / TILE_SIZE);
    let centerX = Math.floor((player.x + player.width / 2) / TILE_SIZE);

    // Only apply push if falling/standing, not while jumping up
    if (player.vy >= 0 && map[bottomY]) {
        let floorTile = map[bottomY][centerX];
        if (floorTile === 12) {
            player.vx -= 0.6; // Push Left
        } else if (floorTile === 13) {
            player.vx += 0.6; // Push Right
        }
    }

    player.x += player.vx;
    if (dashJustExpired && isTouchingTile(player.x, player.y, DASH_THROUGH_TILE)) {
        die();
        return;
    }
    if (checkCollision(player.x, player.y)) {
        if (player.vx > 0) player.x = Math.floor((player.x + player.width) / TILE_SIZE) * TILE_SIZE - player.width - 0.1;
        else if (player.vx < 0) player.x = Math.floor(player.x / TILE_SIZE) * TILE_SIZE + TILE_SIZE + 0.1;
        player.vx = 0;
    }

    let oldY = player.y; // Remember where we were before falling
    player.y += player.vy;
    if (dashJustExpired && isTouchingTile(player.x, player.y, DASH_THROUGH_TILE)) {
        die();
        return;
    }

    if (checkCollision(player.x, player.y)) {
        // Standard solid wall/floor collision
        if (player.vy > 0) player.y = Math.floor((player.y + player.height) / TILE_SIZE) * TILE_SIZE - player.height - 0.1;
        else if (player.vy < 0) player.y = Math.floor(player.y / TILE_SIZE) * TILE_SIZE + TILE_SIZE + 0.1;
        player.vy = 0;
    } else if (player.vy > 0) { 
        // ONE-WAY PLATFORM LOGIC (Only check if we are falling down)
        let left = Math.floor(player.x / TILE_SIZE);
        let right = Math.floor((player.x + player.width - 0.1) / TILE_SIZE);
        let bottom = Math.floor((player.y + player.height - 0.1) / TILE_SIZE);
        let crumbleTilesToActivate = new Set();
        
        for (let x = left; x <= right; x++) {
            let checkX = Math.max(0, Math.min(x, 19));
            let tile = map[bottom] ? map[bottom][checkX] : null;
            
            if (tile === 10 || tile === CRUMBLE_TILE) {
                let platformTop = bottom * TILE_SIZE;
                
                // Only snap to the platform if our feet were previously ABOVE the platform's top edge
                // AND we aren't holding the DOWN key (Bonus: allows dropping through!)
                if (oldY + player.height <= platformTop + 0.5 && !keys.down) {
                    player.y = platformTop - player.height - 0.1;
                    player.vy = 0;
                    if (tile === CRUMBLE_TILE) crumbleTilesToActivate.add(getTileKey(checkX, bottom));
                }
            }
        }

        for (const tileKey of crumbleTilesToActivate) {
            const [x, y] = tileKey.split(",").map(Number);
            activateCrumblePlatform(x, y);
        }
    }

    if (handleDashDrainBlocks()) {
        return;
    }

    checkHazards(player.x, player.y);
    checkInteractions(player.x, player.y);
    
    if (player.x > canvas.width) { if (!loadRoom(currentRoomX + 1, currentRoomY, 'left')) player.x = canvas.width - player.width; } 
    else if (player.x + player.width < 0) { if (!loadRoom(currentRoomX - 1, currentRoomY, 'right')) player.x = 0; }
    else if (player.y > canvas.height) { if (!loadRoom(currentRoomX, currentRoomY + 1, 'top')) die(); }
    else if (player.y + player.height < 0) { if (!loadRoom(currentRoomX, currentRoomY - 1, 'bottom')) { player.y = 0; player.vy = 0; } }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let y = 0; y < map.length; y++) {
        for (let x = 0; x < map[y].length; x++) {
            let tile = map[y][x];
            if (tile === 1) { ctx.fillStyle = "#666"; ctx.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE); }
            else if (tile === 2) { ctx.fillStyle = "#00ff88"; ctx.fillRect(x * TILE_SIZE + 8, y * TILE_SIZE + 8, 16, 16); }
            else if (tile === 4) {
                let active = activeCheckpoint && activeCheckpoint.rx === currentRoomX && activeCheckpoint.ry === currentRoomY && activeCheckpoint.cx === x && activeCheckpoint.cy === y;
                ctx.fillStyle = active ? "#00ff88" : "#ffd700";
                ctx.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
            }
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

            else if (tile === 10) { 
                ctx.fillStyle = "#999999"; // Lighter gray so it stands out
                ctx.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE / 4); 
            }
            else if (tile === CRUMBLE_TILE) {
                const timer = crumbleTimers[getTileKey(x, y)];
                const progress = timer ? 1 - (timer / CRUMBLE_DURATION) : 0;
                const top = y * TILE_SIZE;
                const left = x * TILE_SIZE;

                ctx.fillStyle = `rgba(194, 145, 87, ${1 - progress * 0.35})`;
                ctx.fillRect(left, top, TILE_SIZE, TILE_SIZE / 4);

                ctx.strokeStyle = "#6e4d2f";
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.moveTo(left + 3, top + 4);
                ctx.lineTo(left + 11, top + 6);
                ctx.lineTo(left + 18, top + 3);
                ctx.lineTo(left + 26, top + 7);
                ctx.stroke();

                if (progress > 0.35) {
                    ctx.beginPath();
                    ctx.moveTo(left + 8, top + 1);
                    ctx.lineTo(left + 14, top + 7);
                    ctx.lineTo(left + 21, top + 2);
                    ctx.stroke();
                }

                if (progress > 0.7) {
                    ctx.fillStyle = "#a56d3a";
                    ctx.fillRect(left + 5, top + 7, 4, 2);
                    ctx.fillRect(left + 19, top + 6, 5, 2);
                }
            }
            else if (tile === DASH_THROUGH_TILE) {
                const top = y * TILE_SIZE;
                const left = x * TILE_SIZE;

                ctx.fillStyle = "#8a8a8a";
                ctx.fillRect(left, top, TILE_SIZE, TILE_SIZE);
            }
            else if (tile === DASH_DRAIN_TILE) {
                const top = y * TILE_SIZE;
                const left = x * TILE_SIZE;

                ctx.fillStyle = "#666";
                ctx.fillRect(left, top, TILE_SIZE, TILE_SIZE);

                ctx.fillStyle = "#00ccff";
                ctx.beginPath();
                ctx.arc(left + 16, top + 16, 4, 0, Math.PI * 2);
                ctx.fill();
            }

            else if (tile === 11) { 
                ctx.fillStyle = "#8B4513"; // Brown post
                ctx.fillRect(x * TILE_SIZE + 12, y * TILE_SIZE + 16, 8, 16);
                ctx.fillStyle = "#D2B48C"; // Tan board
                ctx.fillRect(x * TILE_SIZE + 2, y * TILE_SIZE + 6, 28, 14);
            }
            else if (tile === 12) { 
                // Left Conveyor
                ctx.fillStyle = "#444"; 
                ctx.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE); 
                ctx.fillStyle = "#ffdd00"; // Yellow Arrow
                ctx.beginPath(); 
                ctx.moveTo(x * TILE_SIZE + 24, y * TILE_SIZE + 8); 
                ctx.lineTo(x * TILE_SIZE + 8, y * TILE_SIZE + 16); 
                ctx.lineTo(x * TILE_SIZE + 24, y * TILE_SIZE + 24); 
                ctx.fill(); 
            }
            else if (tile === 13) { 
                // Right Conveyor
                ctx.fillStyle = "#444"; 
                ctx.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE); 
                ctx.fillStyle = "#ffdd00"; // Yellow Arrow
                ctx.beginPath(); 
                ctx.moveTo(x * TILE_SIZE + 8, y * TILE_SIZE + 8); 
                ctx.lineTo(x * TILE_SIZE + 24, y * TILE_SIZE + 16); 
                ctx.lineTo(x * TILE_SIZE + 8, y * TILE_SIZE + 24); 
                ctx.fill(); 
            }
            else if (tile === 14) { 
                // Key
                ctx.fillStyle = "#FFD700"; // Gold
                ctx.beginPath();
                ctx.arc(x * TILE_SIZE + 10, y * TILE_SIZE + 16, 6, 0, Math.PI * 2); // Key head
                ctx.fill();
                ctx.fillRect(x * TILE_SIZE + 10, y * TILE_SIZE + 14, 14, 4); // Key shaft
                ctx.fillRect(x * TILE_SIZE + 20, y * TILE_SIZE + 18, 4, 4); // Key tooth
            }
            else if (tile === 15) { 
                // Locked Block
                ctx.fillStyle = "#5c3a21"; // Dark wood
                ctx.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
                ctx.strokeStyle = "#382212"; // Wood border
                ctx.lineWidth = 2;
                ctx.strokeRect(x * TILE_SIZE + 1, y * TILE_SIZE + 1, TILE_SIZE - 2, TILE_SIZE - 2);
                
                ctx.fillStyle = "#FFD700"; // Gold lock plate
                ctx.fillRect(x * TILE_SIZE + 10, y * TILE_SIZE + 10, 12, 12);
                
                ctx.fillStyle = "#222"; // Keyhole
                ctx.beginPath(); 
                ctx.arc(x * TILE_SIZE + 16, y * TILE_SIZE + 14, 2, 0, Math.PI * 2);
                ctx.fill();
                ctx.fillRect(x * TILE_SIZE + 15, y * TILE_SIZE + 15, 2, 4);
            }
        }

        if (activeSignText) {
        // Draw a dark background box for readability
        ctx.fillStyle = "rgba(0, 0, 0, 0.75)";
        ctx.fillRect(canvas.width / 2 - 200, canvas.height - 40, 400, 30);
        
        // Draw the text
        ctx.fillStyle = "white";
        ctx.font = "16px sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(activeSignText, canvas.width / 2, canvas.height - 25);
    }
    }

    ctx.fillStyle = player.hasDash ? "#ff3366" : "#00ccff"; 
    ctx.fillRect(player.x, player.y, player.width, player.height);

    if (player.potions > 0) {
        let size = Math.min(player.potions * 6, player.width - 4); 
        ctx.fillStyle = "#00ff88"; 
        ctx.fillRect(player.x + (player.width / 2) - (size / 2), player.y + (player.height / 2) - (size / 2), size, size);
    }
}

// --- TIME STEP VARIABLES ---
const FPS = 60; // Target frames per second
const TIME_STEP = 1000 / FPS; // How many milliseconds each update should take (~16.67ms)
let lastTime = 0;
let accumulator = 0;

function loop(timestamp) {
    if (!lastTime) lastTime = timestamp;

    let deltaTime = timestamp - lastTime;
    lastTime = timestamp;

    if (deltaTime > 250) {
        deltaTime = 250;
    }

    if (gameState === "playing") {
        // Add the passed time to our accumulator
        accumulator += deltaTime;

        while (accumulator >= TIME_STEP) {
            update();
            accumulator -= TIME_STEP;
        }
        
        draw();
    }
    
    requestAnimationFrame(loop);
}

// --- UI & MENUS ---
const uiLayer = document.getElementById("uiLayer");
const stageGrid = document.getElementById("stageGrid");
const bestTimesList = document.getElementById("bestTimesList");
const menus = {
    main: document.getElementById("mainMenu"),
    settings: document.getElementById("settingsMenu"),
    stageSelect: document.getElementById("stageSelectMenu"),
    bestTimes: document.getElementById("bestTimesMenu")
};

function showScreen(screenName) {
    Object.values(menus).forEach(m => { if (m) m.classList.add("hidden"); });
    if (menus[screenName]) menus[screenName].classList.remove("hidden");
    if (screenName === "stageSelect") refreshStageButtons();
}

function getSavedTimeLabel(key) {
    return hasBestTime(key) ? formatTime(bestTimes[key]) : "no time";
}

function renderBestTimes() {
    bestTimesList.innerHTML = "";

    stages.forEach((stage, index) => {
        let row = document.createElement("div");
        row.className = "record-row";
        row.innerHTML = `<span>${stage.title}</span><span>${getSavedTimeLabel(`stage_${index}`)}</span>`;
        bestTimesList.appendChild(row);
    });

    let fullGameRow = document.createElement("div");
    fullGameRow.className = "record-row";
    fullGameRow.innerHTML = `<span>Whole Game</span><span>${getSavedTimeLabel("full_game")}</span>`;
    bestTimesList.appendChild(fullGameRow);
}

function refreshStageButtons() {
    stageButtons.forEach(({ button, index, title }) => {
        const unlocked = isStageUnlocked(index);
        button.disabled = !unlocked;
        button.innerText = unlocked ? title : `${title} (Locked)`;
    });
}

function loadStage(stageIndex) {
    currentStageIndex = stageIndex;
    activeCheckpoint = null;
    activeSignText = null;
    loadRoom(0, 0, 'spawn');
}

function startGameplay(stageIndex) {
    gameState = "playing";
    uiLayer.style.display = "none";
    hudLevelName.classList.remove("hidden"); 

    isWholeGameRun = timerMode === "game" && stageIndex === TUTORIAL_STAGE_INDEX;
    activeTimerRecordKey = timerMode === "stages"
        ? getStageBestKey(stageIndex)
        : (isWholeGameRun ? "full_game" : null);

    if (timerMode === "stages" || isWholeGameRun) {
        hudTimer.classList.remove("hidden");
        startTime = performance.now();
        elapsed = 0;
        isTimerRunning = true;
    } else {
        hudTimer.classList.add("hidden");
        isTimerRunning = false;
        elapsed = 0;
    }

    loadStage(stageIndex);
}

function finishStage() {
    markStageCompleted(currentStageIndex);
    refreshStageButtons();

    if (isWholeGameRun && currentStageIndex < stages.length - 1) {
        loadStage(currentStageIndex + 1);
        return;
    }

    endGameplay(true);
}

function endGameplay(completed = false) {
    if (isTimerRunning) {
        if (completed) saveBestTime();
        isTimerRunning = false;
    }

    activeTimerRecordKey = null;
    isWholeGameRun = false;
    gameState = "menu";
    uiLayer.style.display = "flex";
    hudLevelName.classList.add("hidden"); 
    hudTimer.classList.add("hidden");
    timeTooltip.classList.add("hidden");
    showScreen(timerMode === "game" ? "main" : "stageSelect"); 
}

// Init Stage Select
stages.forEach((stage, index) => {
    let btn = document.createElement("button");
    btn.innerText = stage.title;
    btn.style.width = "auto"; btn.style.padding = "10px 15px";
    btn.onclick = () => startGameplay(index);
    stageGrid.appendChild(btn);
    stageButtons.push({ button: btn, index, title: stage.title });
});

// Menu Logic
document.getElementById("btnStartGame").onclick = () => {
    if (timerMode === "game") startGameplay(TUTORIAL_STAGE_INDEX);
    else showScreen("stageSelect");
};
document.getElementById("btnBestTimes").onclick = () => { renderBestTimes(); showScreen("bestTimes"); };
document.getElementById("btnStageBack").onclick = () => showScreen("main");
document.getElementById("btnBestTimesBack").onclick = () => showScreen("main");
document.getElementById("btnSettings").onclick = () => { refreshBindUI(); showScreen("settings"); };
document.getElementById("btnSettingsBack").onclick = () => { if (rebindingAction) document.getElementById(`bind-${rebindingAction}`).classList.remove("waiting"); rebindingAction = null; showScreen("main"); };
document.getElementById("btnResetBinds").onclick = () => { userBinds = { ...defaultBinds }; localStorage.setItem("spacebarBinds", JSON.stringify(userBinds)); refreshBindUI(); };
document.getElementById("btnResetData").onclick = () => { if (confirm("Erase all best times and controls?")) { localStorage.clear(); location.reload(); } };

timerSelect.onchange = (e) => { timerMode = e.target.value; localStorage.setItem("timerMode", timerMode); };

function refreshBindUI() { for (const action in userBinds) { let btn = document.getElementById(`bind-${action}`); if (btn) btn.innerText = userBinds[action]; } }

document.querySelectorAll(".bind-btn").forEach(btn => {
    if (btn.id === "timerSelect") return; 
    btn.onclick = () => {
        if (rebindingAction) document.getElementById(`bind-${rebindingAction}`).classList.remove("waiting");
        rebindingAction = btn.id.split("-")[1];
        btn.innerText = "Press key...";
        btn.classList.add("waiting");
    };
});

showScreen("main");
loop();
