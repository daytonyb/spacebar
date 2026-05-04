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
const KEY_TILE = 14;
const LOCKED_BLOCK_TILE = 15;
const CRUMBLE_TILE = 16;
const DASH_THROUGH_TILE = 17;
const DASH_DRAIN_TILE = 18;
const ESCORT_KEY_TILE = 19;
const ESCORT_LOCK_TILE = 20;
const PORTAL_TILE = 21;
const BOUNCE_TILE = 22;
const LEFT_WIND_TILE = 23;
const RIGHT_WIND_TILE = 24;
const UP_WIND_TILE = 25;
const DOWN_WIND_TILE = 26;
const CRUMBLE_DURATION = 30;
const BOUNCE_DASH_MULTIPLIER = 2;
const WIND_RANGE = 4;
const WIND_STRENGTH = 0.35;
const WIND_SPREAD = 1;
let crumbleTimers = Object.create(null);
let activeDashDrainTile = null;
let hasEscortKey = false;
let activeRoomPortals = [];
let lockedPortalKey = null;
const KEYCAP_TILE = 27;
let permanentlyCollectedKeycaps = JSON.parse(localStorage.getItem("collectedKeycaps")) || {};
let currentlyHeldKeycaps = [];
let collectParticles = [];

const stages = [
    {
        title: "Tutorial",
        rooms: {
"0,0": [
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [1,1,1,1,1,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0],
  [1,1,1,1,1,0,0,0,0,0,0,1,1,0,0,1,1,0,0,0],
  [1,1,1,1,1,3,0,11,0,2,0,1,1,0,0,1,1,0,0,0],
  [1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,1,1],
  [1,1,1,1,1,1,1,1,1,1,1,1,1,9,9,1,1,1,1,1]
],
"-1,0": [
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,2,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,2,0],
  [0,0,1,1,0,0,0,0,1,1,1,0,0,0,0,0,0,1,1,1],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,1,1,1],
  [0,27,0,0,0,0,0,0,0,0,0,0,0,0,0,2,0,1,1,1],
  [0,0,2,0,0,0,0,0,2,0,0,0,0,2,0,0,0,1,1,1],
  [0,0,0,0,0,2,0,0,0,1,1,1,0,0,0,0,0,1,1,1],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1],
  [9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,1,1,1]
],
"-2,0":[
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9]
],
"1,0": [
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,27,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1],
  [0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0],
  [0,0,0,0,4,0,0,2,0,0,0,0,0,2,0,0,0,0,0,0],
  [0,0,0,1,1,1,1,1,1,0,0,0,1,1,1,0,0,0,1,1],
  [0,2,0,1,1,1,1,1,1,0,0,0,1,1,1,0,0,0,1,1],
  [1,1,1,1,1,1,1,1,1,0,0,0,1,1,1,0,0,0,1,1],
  [1,1,1,1,1,1,1,1,1,9,9,9,1,1,1,9,9,9,1,1]
],
"2,0": [
  [0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,2,0,1,1],
  [2,2,0,0,0,0,0,0,1,1,1,0,0,0,0,10,10,10,1,1],
  [1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,0,1,1],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1],
  [0,4,0,2,0,0,0,0,0,0,2,2,0,0,0,1,1,1,1,1],
  [1,1,1,1,1,0,0,0,0,1,1,1,1,0,0,1,1,1,1,1],
  [1,1,1,1,1,0,0,0,0,1,1,1,1,0,0,1,1,1,1,1],
  [1,1,1,1,1,0,0,0,0,1,1,1,1,0,0,1,1,1,1,1],
  [1,1,1,1,1,9,9,9,9,1,1,1,1,9,9,1,1,1,1,1]
], 
"2,-1": [
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [9,9,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [1,1,0,0,0,0,0,2,0,0,0,0,0,0,2,0,0,0,0,1],
  [1,1,0,0,0,0,1,1,1,0,0,0,0,1,1,1,0,0,0,1],
  [1,1,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,1,0,2,0,0,4,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,1,0,0,0,1,1,0,0,0,0,0,0,1,1,0,0,0,0,1],
  [1,1,2,0,0,1,1,0,0,0,2,0,0,1,1,0,2,0,0,1],
  [1,1,10,10,10,1,1,10,10,10,10,10,10,1,1,10,10,10,10,1]
],
"3,-1": [
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1],
  [1,1,1,0,0,0,2,0,0,0,11,0,0,0,0,0,2,0,1,1],
  [1,1,1,0,0,0,0,0,0,1,1,1,0,0,0,1,1,1,1,1],
  [1,1,1,0,0,0,0,0,0,1,1,1,0,0,0,1,1,1,1,1],
  [1,1,1,0,0,0,0,0,0,1,1,1,0,0,0,1,1,1,1,1],
  [1,1,1,9,9,9,9,9,9,1,1,1,9,9,9,1,1,1,1,1]
],
"4,-1": [
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,0,1],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,0,1,1,1],
  [0,4,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1],
  [1,1,1,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0],
  [1,1,1,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0],
  [1,1,1,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [1,1,1,0,0,0,0,0,0,11,0,0,0,0,0,0,0,0,0,0],
  [1,1,1,0,0,0,0,0,1,1,1,1,1,0,0,0,0,0,0,0],
  [1,1,1,9,9,9,9,9,1,1,1,1,1,9,9,9,9,9,9,9]
],
"4,-2": [
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [0,0,0,0,0,0,0,11,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,1,1,1,0,0],
  [0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [0,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,1],
  [0,0,0,0,0,0,1,1,1,0,0,0,2,0,0,0,0,0,0,1],
  [0,0,0,0,0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,1],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,0,4,1],
  [9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,1,10,10,1]
],
"5,-2": [
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [4,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,1],
  [1,1,1,0,0,0,0,0,0,2,0,0,0,0,0,1,1,0,0,1],
  [1,1,1,0,0,0,0,0,1,1,1,0,0,0,0,1,1,0,0,1],
  [1,1,1,0,0,0,0,0,1,1,1,0,0,0,0,1,1,0,0,1],
  [1,1,1,0,0,0,0,0,1,1,1,0,0,0,0,1,1,0,0,1],
  [1,1,1,0,0,0,0,0,1,1,1,0,0,0,0,1,1,0,0,1],
  [1,1,1,9,9,9,9,9,1,1,1,9,9,9,9,1,1,0,0,1]
],
"1,-1": [
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,27,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0],
  [0,0,0,0,2,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0],
  [9,0,0,9,1,1,9,9,9,9,1,1,9,9,9,9,9,9,9,9]
],
"5,-1": [
  [1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,1,1,0,0,0,0,0,0,2,0,0,0,0,0,0,2,0,4,1],
  [1,1,1,0,0,0,0,0,0,1,1,0,0,0,0,0,1,1,1,1],
  [0,0,1,0,9,9,9,9,9,1,1,9,9,9,9,9,1,1,1,1],
  [0,0,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  [0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,1,0,2,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0],
  [4,27,1,1,1,0,0,0,0,0,1,1,0,0,0,0,0,0,1,1],
  [1,1,1,1,1,9,9,9,9,9,1,1,9,9,9,9,9,9,1,1]
],
"4,-3": [
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
],
"5,-3":[
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1]
],
"6,-1":[
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,0],
  [0,0,0,0,0,0,0,0,2,0,0,1,0,0,0,0,0,0,0,0],
  [0,0,2,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,2],
  [0,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0],
  [4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [1,1,1,1,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9]
],
"7,-1": [
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9]
],
"3,-2": [
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [1,0,0,0,0,0,0,0,0,0,27,0,0,0,0,0,0,0,0,0],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [1,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [1,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [1,10,10,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
],
"6,-2": [
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,8,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,10,10,10,10,10,1]
],
},
        roomNames: {},
        signs: {
            "0,0": "Press Spacebar to Jump",
            "3,-1": "Press Left Shift to Dash",
            "4,-1": "Hold the Up Arrow to Dash Upwards",
            "4,-2": "Hold two directions to Dash Diagonally",
        }
    },
];

// --- TIMER STATE ---
const storedTimerVisibility = localStorage.getItem("timerVisibility");
const legacyTimerMode = localStorage.getItem("timerMode");
let isTimerVisible = storedTimerVisibility
    ? storedTimerVisibility === "visible"
    : legacyTimerMode !== "none";
let startTime = 0;
let elapsed = 0;
let isTimerRunning = false;
let activeTimerRecordKey = null;
let isWholeGameRun = false;
let bestTimes = JSON.parse(localStorage.getItem("bestTimes")) || {}; 
let deathCounts = JSON.parse(localStorage.getItem("deathCounts")) || {};
let completedStages = JSON.parse(localStorage.getItem("completedStages")) || {};
const stageButtons = [];

const hudTimer = document.getElementById("hudTimer");
const hudLevelName = document.getElementById("hudLevelName");
const timeTooltip = document.getElementById("timeTooltip"); 
const timerVisibilitySelect = document.getElementById("timerVisibilitySelect");
timerVisibilitySelect.value = isTimerVisible ? "visible" : "hidden";

const player = {
    x: 0, y: 0, width: 24, height: 24, 
    vx: 0, vy: 0,
    friction: 0.8, gravity: 0.4, jumpPower: -8,
    potions: 0, facing: 1, hasDash: true, isDashing: false, dashTimer: 0, dashDuration: 12, dashSpeed: 10
};

let deathParticles = [];
let deathTimer = 0;
const DEATH_DURATION = 30; // How many frames the animation lasts (0.5 seconds)

// --- KEYBINDINGS ---
const defaultBinds = { up: "ArrowUp", down: "ArrowDown", left: "ArrowLeft", right: "ArrowRight", jump: "Space", dash: "ShiftLeft" };
let userBinds = JSON.parse(localStorage.getItem("spacebarBinds")) || { ...defaultBinds };
let rebindingAction = null; 
const keys = { right: false, left: false, up: false, down: false };
let jumpPressed = false; 
let dashPressed = false;

function resetGameplayInputs() {
    keys.right = false;
    keys.left = false;
    keys.up = false;
    keys.down = false;
    jumpPressed = false;
    dashPressed = false;
}

function clearPendingRebind() {
    if (!rebindingAction) return;

    const bindButton = document.getElementById(`bind-${rebindingAction}`);
    if (bindButton) {
        bindButton.classList.remove("waiting");
        bindButton.innerText = userBinds[rebindingAction];
    }

    rebindingAction = null;
}

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

function persistDeathCounts() {
    localStorage.setItem("deathCounts", JSON.stringify(deathCounts));
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

function getStageDeathCount(stageIndex) {
    return deathCounts[getStageBestKey(stageIndex)] || 0;
}

function getDeathLabel(count) {
    return `${count} death${count === 1 ? "" : "s"}`;
}

function getTotalDeathCount() {
    return stages.reduce((sum, _stage, index) => sum + getStageDeathCount(index), 0);
}

function getTotalKeycapsInStage(stageIndex) {
    let total = 0;
    const stage = stages[stageIndex];
    if (!stage || !stage.rooms) return 0;
    
    // Scan every room in this stage for the Keycap tile (27)
    for (const roomKey in stage.rooms) {
        const roomMap = stage.rooms[roomKey];
        for (let y = 0; y < roomMap.length; y++) {
            for (let x = 0; x < roomMap[y].length; x++) {
                if (roomMap[y][x] === KEYCAP_TILE) total++;
            }
        }
    }
    return total;
}

function getCollectedKeycapsInStage(stageIndex) {
    let count = 0;
    // Our save keys look like "0_0,0_4_5", so checking if it starts with "0_" matches Stage 0
    let prefix = `${stageIndex}_`;
    for (const keyId in permanentlyCollectedKeycaps) {
        if (keyId.startsWith(prefix)) count++;
    }
    return count;
}

function getTotalKeycapsInGame() {
    let total = 0;
    for (let i = 0; i < stages.length; i++) {
        total += getTotalKeycapsInStage(i);
    }
    return total;
}

function recordDeath(stageIndex = currentStageIndex) {
    const stageKey = getStageBestKey(stageIndex);
    deathCounts[stageKey] = (deathCounts[stageKey] || 0) + 1;
    persistDeathCounts();
}

function getVisibleBestTimeKey() {
    if (gameState !== "playing" && gameState !== "paused" && gameState !== "dying") return null;
    return activeTimerRecordKey;
}

function refreshTimerVisibility() {
    const shouldShowTimer = (gameState === "playing" || gameState === "paused" || gameState === "dying") && isTimerVisible;
    hudTimer.classList.toggle("hidden", !shouldShowTimer);

    if (!shouldShowTimer) {
        timeTooltip.classList.add("hidden");
    }
}

function startTimer(recordKey) {
    activeTimerRecordKey = recordKey;
    startTime = performance.now();
    elapsed = 0;
    isTimerRunning = true;
    hudTimer.innerText = formatTime(elapsed);
}

function pauseTimer() {
    if (!isTimerRunning) return;

    elapsed = performance.now() - startTime;
    isTimerRunning = false;
    hudTimer.innerText = formatTime(elapsed);
}

function resumeTimer() {
    if (isTimerRunning || !activeTimerRecordKey) return;

    startTime = performance.now() - elapsed;
    isTimerRunning = true;
    hudTimer.innerText = formatTime(elapsed);
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

    if (e.code === "Escape") {
        if (gameState === "playing") {
            e.preventDefault();
            pauseGameplay();
            return;
        }

        if (gameState === "paused") {
            e.preventDefault();
            if (activeScreen === "settings") {
                showScreen("pause");
            } else {
                resumeGameplay();
            }
            return;
        }
    }

    if (gameState !== "playing") return;
    if (Object.values(userBinds).includes(e.code)) e.preventDefault();

    if (e.code === userBinds.right) { keys.right = true; player.facing = 1; }
    if (e.code === userBinds.left) { keys.left = true; player.facing = -1; }
    if (e.code === userBinds.up) keys.up = true;
    if (e.code === userBinds.down) keys.down = true;
    if (e.code === "KeyR") {
        e.preventDefault();
        die();
    }

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
    lockedPortalKey = null;

    player.vx = 0; 
    player.isDashing = false;
    player.hasDash = true;
    player.potions = 0; 

    keysCollected = 0;
    totalKeysInRoom = 0;
    refreshRoomPortals();
    for (let y = 0; y < map.length; y++) {
        for (let x = 0; x < map[y].length; x++) {
            if (map[y][x] === KEY_TILE) totalKeysInRoom++;
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
                if (map[y][x] === KEY_TILE) {
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
    if (gameState === "dying") return; // Prevent dying multiple times at once
    
    recordDeath();
    hasEscortKey = false; // Drop the escort key on death
    currentlyHeldKeycaps = [];
    gameState = "dying";
    deathTimer = DEATH_DURATION;
    
    // Spawn 8 expanding orbs in a circle
    deathParticles = [];
    for (let i = 0; i < 8; i++) {
        let angle = (i / 8) * Math.PI * 2;
        let speed = 6;
        deathParticles.push({
            x: player.x + player.width / 2,
            y: player.y + player.height / 2,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            radius: 8
        });
    }
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
    return tile === 1 || tile === 5 || tile === 12 || tile === 13 || tile === LOCKED_BLOCK_TILE || tile === DASH_DRAIN_TILE || tile === BOUNCE_TILE || isWindTile(tile);
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

function getHorizontalCollisionTile(px, py, direction) {
    if (direction === 0) return null;

    const edgeX = direction > 0
        ? Math.floor((px + player.width) / TILE_SIZE)
        : Math.floor(px / TILE_SIZE);
    const checkX = Math.max(0, Math.min(edgeX, 19));
    const top = Math.floor(py / TILE_SIZE);
    const bottom = Math.floor((py + player.height - 0.1) / TILE_SIZE);
    let collidedTile = null;

    for (let y = top; y <= bottom; y++) {
        const tile = map[y] ? map[y][checkX] : null;
        if (!isSolidTile(tile)) continue;
        if (tile === BOUNCE_TILE) return tile;
        collidedTile = tile;
    }

    return collidedTile;
}

function getVerticalCollisionTile(px, py, direction) {
    if (direction === 0) return null;

    const edgeY = direction > 0
        ? Math.floor((py + player.height) / TILE_SIZE)
        : Math.floor(py / TILE_SIZE);
    const left = Math.floor(px / TILE_SIZE);
    const right = Math.floor((px + player.width - 0.1) / TILE_SIZE);
    let collidedTile = null;

    for (let x = left; x <= right; x++) {
        const checkX = Math.max(0, Math.min(x, 19));
        const tile = map[edgeY] ? map[edgeY][checkX] : null;
        if (!isSolidTile(tile)) continue;
        if (tile === BOUNCE_TILE) return tile;
        collidedTile = tile;
    }

    return collidedTile;
}

function getBounceVelocity(velocity) {
    const multiplier = player.isDashing ? BOUNCE_DASH_MULTIPLIER : 1;
    return -velocity * multiplier;
}

function isWindTile(tile) {
    return tile === LEFT_WIND_TILE || tile === RIGHT_WIND_TILE || tile === UP_WIND_TILE || tile === DOWN_WIND_TILE;
}

function getWindDirection(tile) {
    if (tile === LEFT_WIND_TILE) return { dx: -1, dy: 0 };
    if (tile === RIGHT_WIND_TILE) return { dx: 1, dy: 0 };
    if (tile === UP_WIND_TILE) return { dx: 0, dy: -1 };
    if (tile === DOWN_WIND_TILE) return { dx: 0, dy: 1 };
    return null;
}

function doesPlayerOverlapTile(tileX, tileY) {
    const left = Math.floor(player.x / TILE_SIZE);
    const right = Math.floor((player.x + player.width - 0.1) / TILE_SIZE);
    const top = Math.floor(player.y / TILE_SIZE);
    const bottom = Math.floor((player.y + player.height - 0.1) / TILE_SIZE);
    return tileX >= left && tileX <= right && tileY >= top && tileY <= bottom;
}

function forEachWindBeamCell(callback) {
    for (let sourceY = 0; sourceY < map.length; sourceY++) {
        for (let sourceX = 0; sourceX < map[sourceY].length; sourceX++) {
            const direction = getWindDirection(map[sourceY][sourceX]);
            if (!direction) continue;

            for (let lane = -WIND_SPREAD; lane <= WIND_SPREAD; lane++) {
                for (let step = 1; step <= WIND_RANGE; step++) {
                    const targetX = sourceX + direction.dx * step + (direction.dy !== 0 ? lane : 0);
                    const targetY = sourceY + direction.dy * step + (direction.dx !== 0 ? lane : 0);
                    if (!map[targetY] || targetX < 0 || targetX >= map[targetY].length) break;
                    if (isSolidTile(map[targetY][targetX])) break;

                    callback({ sourceX, sourceY, targetX, targetY, direction, lane, step });
                }
            }
        }
    }
}

function applyWindForces() {
    let windX = 0;
    let windY = 0;
    const activeWindSources = new Set();

    forEachWindBeamCell(({ sourceX, sourceY, targetX, targetY, direction }) => {
        if (!doesPlayerOverlapTile(targetX, targetY)) return;

        const sourceKey = `${sourceX},${sourceY}`;
        if (activeWindSources.has(sourceKey)) return;

        activeWindSources.add(sourceKey);
        windX += direction.dx * WIND_STRENGTH;
        windY += direction.dy * WIND_STRENGTH;
    });

    player.vx += windX;
    player.vy += windY;
}

function drawWindBeamEffects() {
    const windTime = performance.now() * 0.004;

    forEachWindBeamCell(({ targetX, targetY, direction, lane, step }) => {
        const left = targetX * TILE_SIZE;
        const top = targetY * TILE_SIZE;
        const baseFlow = windTime + step * 0.23 + lane * 0.11;
        const flowA = baseFlow - Math.floor(baseFlow);
        const flowB = (flowA + 0.5) % 1;

        ctx.fillStyle = "rgba(143, 232, 255, 0.12)";
        ctx.fillRect(left, top, TILE_SIZE, TILE_SIZE);

        ctx.strokeStyle = "rgba(143, 232, 255, 0.25)";
        ctx.lineWidth = 1;
        ctx.strokeRect(left + 0.5, top + 0.5, TILE_SIZE - 1, TILE_SIZE - 1);

        ctx.fillStyle = "rgba(143, 232, 255, 0.75)";

        if (direction.dx !== 0) {
            const streakStart = direction.dx > 0 ? left + 4 : left + 22;
            const streakAX = direction.dx > 0 ? streakStart + flowA * 16 : streakStart - flowA * 16;
            const streakBX = direction.dx > 0 ? streakStart + flowB * 16 : streakStart - flowB * 16;

            ctx.fillRect(streakAX, top + 10, 6, 2);
            ctx.fillRect(streakBX, top + 20, 6, 2);
        } else {
            const streakStart = direction.dy > 0 ? top + 4 : top + 22;
            const streakAY = direction.dy > 0 ? streakStart + flowA * 16 : streakStart - flowA * 16;
            const streakBY = direction.dy > 0 ? streakStart + flowB * 16 : streakStart - flowB * 16;

            ctx.fillRect(left + 10, streakAY, 2, 6);
            ctx.fillRect(left + 20, streakBY, 2, 6);
        }
    });
}

function checkHazards(px, py) {
    // INCREASE THESE MARGINS to make spikes much more forgiving
    let marginX = 8; // Shaves 8px off the left and right (16px total)
    let marginY = 8; // Shaves 8px off the top and bottom 

    let left = Math.floor((px + marginX) / TILE_SIZE);
    let right = Math.floor((px + player.width - marginX) / TILE_SIZE);
    let top = Math.floor((py + marginY) / TILE_SIZE);
    let bottom = Math.floor((py + player.height - marginY) / TILE_SIZE);

    for (let y = top; y <= bottom; y++) {
        for (let x = left; x <= right; x++) {
            if (map[y] && map[y][x] === 9) { die(); return; }
        }
    }
}

function checkInteractions(px, py) {
    // 1. Center-based interactions (Doors, Portals, Signs, Checkpoints, Locks!)
    let cx = Math.floor((px + player.width / 2) / TILE_SIZE);
    let cy = Math.floor((py + player.height / 2) / TILE_SIZE);
    
    if (map[cy]) {
        let centerTile = map[cy][cx];
        activeSignText = null;
        if (centerTile !== PORTAL_TILE) lockedPortalKey = null;

        if (centerTile === 11) {
            const currentStage = stages[currentStageIndex];
            const roomKey = `${currentRoomX},${currentRoomY}`;
            if (currentStage.signs && currentStage.signs[roomKey]) {
                activeSignText = currentStage.signs[roomKey];
            }
        }
        else if (centerTile === 4) activeCheckpoint = { rx: currentRoomX, ry: currentRoomY, px: cx * TILE_SIZE + 4, py: cy * TILE_SIZE + 4, cx, cy };
        else if (centerTile === 8) { finishStage(); return true; }
        else if (centerTile === PORTAL_TILE) { return tryUsePortal(cx, cy); }
        
        // FIX: Escort Locks are center-based interactions, not magnetized collectibles!
        else if (centerTile === ESCORT_LOCK_TILE && hasEscortKey) {
            map[cy][cx] = 0;
            hasEscortKey = false;
            unlockBlocks();
        }
    }

    // 2. TRUE MAGNETIZED COLLECTIBLES (AABB Sprite Collision)
    let scanMargin = 16; 
    let left = Math.floor((px - scanMargin) / TILE_SIZE);
    let right = Math.floor((px + player.width + scanMargin) / TILE_SIZE);
    let top = Math.floor((py - scanMargin) / TILE_SIZE);
    let bottom = Math.floor((py + player.height + scanMargin) / TILE_SIZE);

    for (let y = top; y <= bottom; y++) {
        for (let x = left; x <= right; x++) {
            if (!map[y] || x < 0 || x >= 20) continue;
            let tile = map[y][x];

            // If it's a collectible, do a pixel-perfect check against its actual sprite
            if (tile === 2 || tile === 7 || tile === KEY_TILE || tile === ESCORT_KEY_TILE || tile === KEYCAP_TILE) {
                
                // The actual visual box of the item (16x16 in the center of the 32x32 tile)
                let itemX = x * TILE_SIZE + 8;
                let itemY = y * TILE_SIZE + 8;
                let itemW = 16;
                let itemH = 16;

                // The player's box, expanded by the magnet reach
                let reach = 2; 
                let pX = px - reach;
                let pY = py - reach;
                let pW = player.width + (reach * 2);
                let pH = player.height + (reach * 2);

                // True AABB Collision check
                if (pX < itemX + itemW && pX + pW > itemX && pY < itemY + itemH && pY + pH > itemY) {
                    // Collect it!
                    if (tile === 2) { map[y][x] = 0; player.potions++; }
                    else if (tile === 7 && !player.hasDash) { map[y][x] = 0; player.hasDash = true; }
                    else if (tile === KEY_TILE) {
                        map[y][x] = 0;
                        keysCollected++;
                        if (keysCollected >= totalKeysInRoom) unlockBlocks();
                    }
                    else if (tile === ESCORT_KEY_TILE && !hasEscortKey) {
                        map[y][x] = 0;
                        hasEscortKey = true;
                    }
                    else if (tile === KEYCAP_TILE) {
                        map[y][x] = 0; // Remove from map
                        let keycapId = `${currentStageIndex}_${currentRoomX},${currentRoomY}_${x}_${y}`;
                        let isGhost = permanentlyCollectedKeycaps[keycapId];
                        
                        // NEW: Spawn 6 little explosion particles!
                        // If it's a ghost keycap, make the particles dark grey. If new, make them bright white.
                        let pColor = isGhost ? "#888" : "#fff"; 
                        for (let i = 0; i < 6; i++) {
                            let angle = (i / 6) * Math.PI * 2;
                            let speed = 2 + Math.random() * 2; // Random speed outward
                            collectParticles.push({
                                x: x * TILE_SIZE + 16, // Center of the tile
                                y: y * TILE_SIZE + 16,
                                vx: Math.cos(angle) * speed,
                                vy: Math.sin(angle) * speed,
                                radius: 4,
                                alpha: 1,
                                color: pColor
                            });
                        }
                        let alreadyHolding = currentlyHeldKeycaps.some(k => k.id === keycapId);
                        if (!alreadyHolding) {
                            currentlyHeldKeycaps.push({ id: keycapId, isGhost: isGhost });
                        }
                    }
                }
            }
        }
    }

    return false;
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
            if (map[y][x] === LOCKED_BLOCK_TILE) {
                map[y][x] = 0; // Turn the locked block into empty space
            }
        }
    }
}

function getPortalKey(x, y) {
    return `${x},${y}`;
}

function refreshRoomPortals() {
    activeRoomPortals = [];
    let totalPortalCount = 0;

    for (let y = 0; y < map.length; y++) {
        for (let x = 0; x < map[y].length; x++) {
            if (map[y][x] !== PORTAL_TILE) continue;
            totalPortalCount++;
            if (activeRoomPortals.length < 2) {
                activeRoomPortals.push({ x, y });
            }
        }
    }

    if (totalPortalCount > 2) {
        console.warn(`Room ${currentRoomX},${currentRoomY} has ${totalPortalCount} portals. Only the first two will be linked.`);
    }
}

function getLinkedPortal(sourceX, sourceY) {
    if (activeRoomPortals.length !== 2) return null;

    const [firstPortal, secondPortal] = activeRoomPortals;
    if (firstPortal.x === sourceX && firstPortal.y === sourceY) {
        return secondPortal;
    }
    if (secondPortal.x === sourceX && secondPortal.y === sourceY) {
        return firstPortal;
    }

    return null;
}

function tryUsePortal(cx, cy) {
    const sourcePortalKey = getPortalKey(cx, cy);
    if (lockedPortalKey === sourcePortalKey) return false;

    const destination = getLinkedPortal(cx, cy);
    if (!destination) return false;

    player.x = destination.x * TILE_SIZE + (TILE_SIZE - player.width) / 2;
    player.y = destination.y * TILE_SIZE + (TILE_SIZE - player.height) / 2;
    lockedPortalKey = getPortalKey(destination.x, destination.y);
    return true;
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
    collectParticles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.85; // Friction so they slow down quickly
        p.vy *= 0.85;
        p.radius *= 0.92; // Shrink
        p.alpha -= 0.04;  // Fade out
    });
    // Remove particles that have completely faded away
    collectParticles = collectParticles.filter(p => p.alpha > 0);

    updateCrumblePlatforms();

    if (isTimerRunning) {
        elapsed = performance.now() - startTime;
        hudTimer.innerText = formatTime(elapsed);
    }

    // --- NEW: DEATH ANIMATION LOGIC ---
    if (gameState === "dying") {
        deathTimer--;
        
        // Move and shrink particles
        deathParticles.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;
            p.vx *= 0.85; // Friction so they slow down
            p.vy *= 0.85;
            p.radius *= 0.9; // Shrink over time
        });

        // When the timer is up, actually reset the room
        if (deathTimer <= 0) {
            gameState = "playing";
            if (activeCheckpoint) loadRoom(activeCheckpoint.rx, activeCheckpoint.ry, 'checkpoint');
            else loadRoom(0, 0, 'spawn');
        }
        return; // Don't run any other physics!
    }

    let dashJustExpired = false;
    if (player.isDashing) {
        // Allow the player to correct their dash direction within the first 3 frames 
        if (player.dashTimer >= player.dashDuration - 3) {
            let dx = 0, dy = 0;
            if (keys.right) dx += 1;
            if (keys.left) dx -= 1;
            if (keys.down) dy += 1;
            if (keys.up) dy -= 1;

            // If they are pressing a direction, override the current dash velocity
            if (dx !== 0 || dy !== 0) {
                let length = Math.sqrt(dx * dx + dy * dy);
                player.vx = (dx / length) * player.dashSpeed;
                player.vy = (dy / length) * player.dashSpeed;
            }
        }
        // ---------------------------------------

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

    applyWindForces();

    const horizontalVelocity = player.vx;
    player.x += horizontalVelocity;
    if (dashJustExpired && isTouchingTile(player.x, player.y, DASH_THROUGH_TILE)) {
        die();
        return;
    }
    if (checkCollision(player.x, player.y)) {
        const horizontalCollisionTile = getHorizontalCollisionTile(player.x, player.y, horizontalVelocity);
        if (player.vx > 0) player.x = Math.floor((player.x + player.width) / TILE_SIZE) * TILE_SIZE - player.width - 0.1;
        else if (player.vx < 0) player.x = Math.floor(player.x / TILE_SIZE) * TILE_SIZE + TILE_SIZE + 0.1;

        if (horizontalCollisionTile === BOUNCE_TILE) {
            player.vx = getBounceVelocity(horizontalVelocity);
        } else {
            player.vx = 0;
        }
    }

    let oldY = player.y; // Remember where we were before falling
    const verticalVelocity = player.vy;
    player.y += verticalVelocity;
    if (dashJustExpired && isTouchingTile(player.x, player.y, DASH_THROUGH_TILE)) {
        die();
        return;
    }

    if (checkCollision(player.x, player.y)) {
        const verticalCollisionTile = getVerticalCollisionTile(player.x, player.y, verticalVelocity);
        
        // --- CELESTE-STYLE CORNER CORRECTION ---
        let cornerCorrected = false;
        
        // Only trigger if we are moving UPWARDS (hitting our head on a ceiling)
        if (player.vy < 0) { 
            let nudgeAmount = 5; // How many pixels we allow the game to shift the player
            
            // Check if sliding to the RIGHT slightly clears the collision
            if (!checkCollision(player.x + nudgeAmount, player.y)) {
                player.x += nudgeAmount; // Teleport them right
                cornerCorrected = true;  // Prevent Y-velocity from being killed
            } 
            // Check if sliding to the LEFT slightly clears the collision
            else if (!checkCollision(player.x - nudgeAmount, player.y)) {
                player.x -= nudgeAmount; // Teleport them left
                cornerCorrected = true;  // Prevent Y-velocity from being killed
            }
        }
        // ----------------------------------------

        // If we didn't magically corner correct them, handle the collision normally
        if (!cornerCorrected) {
            // Standard solid wall/floor collision
            if (player.vy > 0) player.y = Math.floor((player.y + player.height) / TILE_SIZE) * TILE_SIZE - player.height - 0.1;
            else if (player.vy < 0) player.y = Math.floor(player.y / TILE_SIZE) * TILE_SIZE + TILE_SIZE + 0.1;

            if (verticalCollisionTile === BOUNCE_TILE) {
                player.vy = getBounceVelocity(verticalVelocity);
            } else {
                player.vy = 0;
            }
        }
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
    if (checkInteractions(player.x, player.y)) {
        return;
    }
    
    if (player.x > canvas.width) { if (!loadRoom(currentRoomX + 1, currentRoomY, 'left')) player.x = canvas.width - player.width; } 
    else if (player.x + player.width < 0) { if (!loadRoom(currentRoomX - 1, currentRoomY, 'right')) player.x = 0; }
    else if (player.y > canvas.height) { if (!loadRoom(currentRoomX, currentRoomY + 1, 'top')) die(); }
    else if (player.y + player.height < 0) { if (!loadRoom(currentRoomX, currentRoomY - 1, 'bottom')) { player.y = 0; player.vy = 0; } }

// --- NEW: CELESTE STRAWBERRY SAVE LOGIC ---
    if (currentlyHeldKeycaps.length > 0) {
        // Are we safely on solid ground? (Y-velocity is 0, not dashing, and touching a floor)
        let isGrounded = player.vy === 0 && !player.isDashing && (checkCollision(player.x, player.y + 1));
        
        // Also check if we are standing on a one-way platform
        if (!isGrounded && player.vy === 0) {
            let left = Math.floor(player.x / TILE_SIZE);
            let right = Math.floor((player.x + player.width - 0.1) / TILE_SIZE);
            let checkBottom = Math.floor((player.y + player.height) / TILE_SIZE);
            for (let cx = left; cx <= right; cx++) {
                let checkX = Math.max(0, Math.min(cx, 19));
                let t = map[checkBottom] ? map[checkBottom][checkX] : null;
                // If touching a one-way or crumble plat exactly on top
                if ((t === 10 || t === CRUMBLE_TILE) && Math.abs((player.y + player.height) - (checkBottom * TILE_SIZE)) < 1) {
                    isGrounded = true;
                }
            }
        }

        // If safe, save all held keycaps!
        if (isGrounded) {
            currentlyHeldKeycaps.forEach((keycap, index) => {
                permanentlyCollectedKeycaps[keycap.id] = true;
                
                // NEW: Spawn a satisfying "Saved!" particle burst
                // Calculate roughly where this specific keycap was floating above the player
                const keyX = player.x + (player.width / 2);
                const keyY = player.y - 25 - (index * 22);

                // Gold for brand new keycaps, Light Grey for ghost keycaps
                const burstColor = keycap.isGhost ? "#aaaaaa" : "#ffd700"; 

                for (let i = 0; i < 8; i++) {
                    let angle = (i / 8) * Math.PI * 2;
                    let speed = 1 + Math.random() * 3;
                    collectParticles.push({
                        x: keyX,
                        y: keyY,
                        vx: Math.cos(angle) * speed,
                        vy: Math.sin(angle) * speed - 1, // Slight upward float
                        radius: 3 + Math.random() * 2,
                        alpha: 1,
                        color: burstColor
                    });
                }
            });
            
            localStorage.setItem("collectedKeycaps", JSON.stringify(permanentlyCollectedKeycaps));
            currentlyHeldKeycaps = []; // Empty our hands
        }
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // 1. DRAW THE MAP AND TILES
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
                ctx.fillStyle = "#999999"; 
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
                ctx.fillStyle = "#8B4513"; 
                ctx.fillRect(x * TILE_SIZE + 12, y * TILE_SIZE + 16, 8, 16);
                ctx.fillStyle = "#D2B48C"; 
                ctx.fillRect(x * TILE_SIZE + 2, y * TILE_SIZE + 6, 28, 14);
            }
            else if (tile === 12) { 
                ctx.fillStyle = "#444"; 
                ctx.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE); 
                ctx.fillStyle = "#ffdd00"; 
                ctx.beginPath(); 
                ctx.moveTo(x * TILE_SIZE + 24, y * TILE_SIZE + 8); 
                ctx.lineTo(x * TILE_SIZE + 8, y * TILE_SIZE + 16); 
                ctx.lineTo(x * TILE_SIZE + 24, y * TILE_SIZE + 24); 
                ctx.fill(); 
            }
            else if (tile === 13) { 
                ctx.fillStyle = "#444"; 
                ctx.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE); 
                ctx.fillStyle = "#ffdd00"; 
                ctx.beginPath(); 
                ctx.moveTo(x * TILE_SIZE + 8, y * TILE_SIZE + 8); 
                ctx.lineTo(x * TILE_SIZE + 24, y * TILE_SIZE + 16); 
                ctx.lineTo(x * TILE_SIZE + 8, y * TILE_SIZE + 24); 
                ctx.fill(); 
            }
            else if (tile === KEY_TILE) { 
                ctx.fillStyle = "#FFD700"; 
                ctx.beginPath();
                ctx.arc(x * TILE_SIZE + 10, y * TILE_SIZE + 16, 6, 0, Math.PI * 2); 
                ctx.fill();
                ctx.fillRect(x * TILE_SIZE + 10, y * TILE_SIZE + 14, 14, 4); 
                ctx.fillRect(x * TILE_SIZE + 20, y * TILE_SIZE + 18, 4, 4); 
            }
            else if (tile === LOCKED_BLOCK_TILE) { 
                ctx.fillStyle = "#5c3a21"; 
                ctx.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
                ctx.strokeStyle = "#382212"; 
                ctx.lineWidth = 2;
                ctx.strokeRect(x * TILE_SIZE + 1, y * TILE_SIZE + 1, TILE_SIZE - 2, TILE_SIZE - 2);
                
                ctx.fillStyle = "#FFD700"; 
                ctx.fillRect(x * TILE_SIZE + 10, y * TILE_SIZE + 10, 12, 12);
                
                ctx.fillStyle = "#222"; 
                ctx.beginPath(); 
                ctx.arc(x * TILE_SIZE + 16, y * TILE_SIZE + 14, 2, 0, Math.PI * 2);
                ctx.fill();
                ctx.fillRect(x * TILE_SIZE + 15, y * TILE_SIZE + 15, 2, 4);
            }
            else if (tile === ESCORT_KEY_TILE) {
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
            else if (tile === ESCORT_LOCK_TILE) {
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
            else if (tile === PORTAL_TILE) {
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
            else if (tile === BOUNCE_TILE) {
                const left = x * TILE_SIZE;
                const top = y * TILE_SIZE;

                ctx.fillStyle = "#ff4fa3";
                ctx.fillRect(left, top, TILE_SIZE, TILE_SIZE);

                ctx.strokeStyle = "#c81b74";
                ctx.lineWidth = 2;
                ctx.strokeRect(left + 1, top + 1, TILE_SIZE - 2, TILE_SIZE - 2);
            }
            else if (isWindTile(tile)) {
                const left = x * TILE_SIZE;
                const top = y * TILE_SIZE;
                const direction = getWindDirection(tile);

                ctx.fillStyle = "#2f4658";
                ctx.fillRect(left, top, TILE_SIZE, TILE_SIZE);

                ctx.strokeStyle = "#8fe8ff";
                ctx.lineWidth = 2;
                ctx.strokeRect(left + 1, top + 1, TILE_SIZE - 2, TILE_SIZE - 2);

                ctx.fillStyle = "#8fe8ff";
                ctx.beginPath();
                if (direction.dx < 0) {
                    ctx.moveTo(left + 8, top + 16); ctx.lineTo(left + 22, top + 9); ctx.lineTo(left + 22, top + 23);
                } else if (direction.dx > 0) {
                    ctx.moveTo(left + 24, top + 16); ctx.lineTo(left + 10, top + 9); ctx.lineTo(left + 10, top + 23);
                } else if (direction.dy < 0) {
                    ctx.moveTo(left + 16, top + 8); ctx.lineTo(left + 9, top + 22); ctx.lineTo(left + 23, top + 22);
                } else {
                    ctx.moveTo(left + 16, top + 24); ctx.lineTo(left + 9, top + 10); ctx.lineTo(left + 23, top + 10);
                }
                ctx.fill();

                if (direction.dx < 0) {
                    ctx.fillRect(left + 23, top + 9, 3, 3); ctx.fillRect(left + 23, top + 15, 5, 3); ctx.fillRect(left + 23, top + 21, 3, 3);
                } else if (direction.dx > 0) {
                    ctx.fillRect(left + 6, top + 9, 3, 3); ctx.fillRect(left + 4, top + 15, 5, 3); ctx.fillRect(left + 6, top + 21, 3, 3);
                } else if (direction.dy < 0) {
                    ctx.fillRect(left + 9, top + 23, 3, 3); ctx.fillRect(left + 15, top + 23, 3, 5); ctx.fillRect(left + 21, top + 23, 3, 3);
                } else {
                    ctx.fillRect(left + 9, top + 6, 3, 3); ctx.fillRect(left + 15, top + 4, 3, 5); ctx.fillRect(left + 21, top + 6, 3, 3);
                }
            }
            else if (tile === KEYCAP_TILE) {
                // Drawing the actual item waiting to be collected on the map
                let keycapId = `${currentStageIndex}_${currentRoomX},${currentRoomY}_${x}_${y}`;
                let isGhost = permanentlyCollectedKeycaps[keycapId];
                
                const floatOffset = Math.sin(performance.now() / 250) * 3;
                const left = x * TILE_SIZE + 6;
                const top = y * TILE_SIZE + 6 + floatOffset;

                if (isGhost) {
                    ctx.fillStyle = "rgba(40, 40, 40, 0.7)"; 
                    ctx.fillRect(left, top, 20, 20);
                    ctx.fillStyle = "rgba(80, 80, 80, 0.7)"; 
                    ctx.fillRect(left + 2, top, 16, 16);
                    ctx.fillStyle = "rgba(150, 150, 150, 0.5)";
                } else {
                    ctx.fillStyle = "#888"; 
                    ctx.fillRect(left, top, 20, 20);
                    ctx.fillStyle = "#ddd"; 
                    ctx.fillRect(left + 2, top, 16, 16);
                    ctx.fillStyle = "#555";
                }
                
                ctx.font = "bold 12px monospace";
                ctx.textAlign = "center";
                ctx.textBaseline = "middle";
                ctx.fillText("?", left + 10, top + 8);
            }
        }
    }

    // 2. DRAW ENVIRONMENTAL EFFECTS
    drawWindBeamEffects();

    if (activeSignText) {
        ctx.fillStyle = "rgba(0, 0, 0, 0.75)";
        ctx.fillRect(canvas.width / 2 - 200, canvas.height - 40, 400, 30);

        ctx.fillStyle = "white";
        ctx.font = "16px sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(activeSignText, canvas.width / 2, canvas.height - 25);
    }

    // 3. DRAW ENTITIES (Player, Particles, Trails)
    if (gameState === "dying") {
        // Draw the exploding particles
        ctx.fillStyle = player.hasDash ? "#ff3366" : "#00ccff"; 
        deathParticles.forEach(p => {
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fill();
        });
    } else {
        // Draw the normal player
        ctx.fillStyle = player.hasDash ? "#ff3366" : "#00ccff"; 
        ctx.fillRect(player.x, player.y, player.width, player.height);

        // Draw double jump potions inside player
        if (player.potions > 0) {
            let size = Math.min(player.potions * 6, player.width - 4); 
            ctx.fillStyle = "#00ff88"; 
            ctx.fillRect(player.x + (player.width / 2) - (size / 2), player.y + (player.height / 2) - (size / 2), size, size);
        }

        // Draw Escort Key
        if (hasEscortKey) {
            const keyX = player.x + player.width - 8;
            const keyY = player.y - 8;

            ctx.fillStyle = "#ff9f1c";
            ctx.beginPath();
            ctx.arc(keyX, keyY, 4, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillRect(keyX, keyY - 1.5, 10, 3);
            ctx.fillRect(keyX + 7, keyY + 1.5, 3, 3);

            ctx.fillStyle = "#0fd3ff";
            ctx.fillRect(keyX - 2, keyY - 1.5, 2, 3);
        }

        // --- TRAILING KEYCAPS ---
        currentlyHeldKeycaps.forEach((keycap, index) => {
            // Offset them so they form a vertical floating stack above the player!
            const floatOffset = Math.sin((performance.now() / 200) + index) * 4;
            const keyX = player.x + (player.width / 2) - 10;
            const keyY = player.y - 25 - (index * 22) + floatOffset;

            if (keycap.isGhost) {
                // Ghost Keycap Trail
                ctx.fillStyle = "rgba(40, 40, 40, 0.7)"; 
                ctx.fillRect(keyX, keyY, 20, 20);
                ctx.fillStyle = "rgba(80, 80, 80, 0.7)"; 
                ctx.fillRect(keyX + 2, keyY, 16, 16);
                ctx.fillStyle = "rgba(150, 150, 150, 0.5)";
            } else {
                // Bright New Keycap Trail
                ctx.fillStyle = "#888"; 
                ctx.fillRect(keyX, keyY, 20, 20);
                ctx.fillStyle = "#ddd"; 
                ctx.fillRect(keyX + 2, keyY, 16, 16);
                ctx.fillStyle = "#555";
            }
            
            ctx.font = "bold 12px monospace";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText("?", keyX + 10, keyY + 8);
        });
    }

    // 4. DRAW COLLECTION SPARKLES ON TOP OF EVERYTHING
    collectParticles.forEach(p => {
        ctx.globalAlpha = Math.max(0, p.alpha); // Prevent negative alpha errors
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
    });
    ctx.globalAlpha = 1.0; // Reset alpha
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

    // --- CHANGE IS HERE ---
    if (gameState === "playing" || gameState === "dying") {
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
const pauseQuitButton = document.getElementById("btnPauseQuit");
let activeScreen = "main";
const menus = {
    main: document.getElementById("mainMenu"),
    pause: document.getElementById("pauseMenu"),
    settings: document.getElementById("settingsMenu"),
    stageSelect: document.getElementById("stageSelectMenu"),
    bestTimes: document.getElementById("bestTimesMenu")
};

function showScreen(screenName) {
    Object.values(menus).forEach(m => { if (m) m.classList.add("hidden"); });
    if (menus[screenName]) menus[screenName].classList.remove("hidden");
    activeScreen = screenName;
    if (screenName === "stageSelect") refreshStageButtons();
}

function updatePauseQuitButtonLabel() {
    pauseQuitButton.innerText = isWholeGameRun ? "Quit to Main Menu" : "Quit to Stage Select";
}

function pauseGameplay() {
    if (gameState !== "playing") return;

    pauseTimer();
    gameState = "paused";
    timeTooltip.classList.add("hidden");
    refreshBindUI();
    updatePauseQuitButtonLabel();
    uiLayer.style.display = "flex";
    uiLayer.classList.add("in-game-menu");
    refreshTimerVisibility();
    showScreen("pause");
}

function resumeGameplay() {
    if (gameState !== "paused") return;

    clearPendingRebind();
    gameState = "playing";
    uiLayer.style.display = "none";
    uiLayer.classList.remove("in-game-menu");
    resumeTimer();
    refreshTimerVisibility();
}

function getSavedTimeLabel(key) {
    return hasBestTime(key) ? formatTime(bestTimes[key]) : "no time";
}

function renderBestTimes() {
    bestTimesList.innerHTML = "";

    // 1. Draw individual stage rows
    stages.forEach((stage, index) => {
        const stageTimeKey = getStageBestKey(index);
        
        // NEW: Calculate Collectible String
        const totalKeycaps = getTotalKeycapsInStage(index);
        const collectedKeycaps = getCollectedKeycapsInStage(index);
        // Only show the keycap string if there are actually keycaps in this level
        const keycapString = totalKeycaps > 0 ? ` | ${collectedKeycaps}/${totalKeycaps} Keycaps` : "";

        let row = document.createElement("div");
        row.className = "record-row";
        row.innerHTML = `<span>${stage.title}</span><span style="font-size: 14px;">${getSavedTimeLabel(stageTimeKey)} | ${getDeathLabel(getStageDeathCount(index))}${keycapString}</span>`;
        bestTimesList.appendChild(row);
    });

    // 2. Draw the Whole Game row
    let fullGameRow = document.createElement("div");
    fullGameRow.className = "record-row";
    
    // NEW: Calculate Whole Game Collectible String
    const totalGameKeycaps = getTotalKeycapsInGame();
    const totalCollectedGame = Object.keys(permanentlyCollectedKeycaps).length;
    const fullKeycapString = totalGameKeycaps > 0 ? ` | ${totalCollectedGame}/${totalGameKeycaps} Keycaps` : "";

    fullGameRow.innerHTML = `<span>Whole Game</span><span style="font-size: 14px;">${getSavedTimeLabel("full_game")} | ${getDeathLabel(getTotalDeathCount())}${fullKeycapString}</span>`;
    fullGameRow.style.marginTop = "10px";
    fullGameRow.style.borderTop = "1px solid #555";
    fullGameRow.style.paddingTop = "10px";
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
    hasEscortKey = false;
    lockedPortalKey = null;
    loadRoom(0, 0, 'spawn');
}

function startGameplay(stageIndex, { wholeGameRun = false } = {}) {
    clearPendingRebind();
    resetGameplayInputs();
    gameState = "playing";
    uiLayer.style.display = "none";
    uiLayer.classList.remove("in-game-menu");
    hudLevelName.classList.remove("hidden"); 

    isWholeGameRun = wholeGameRun;
    startTimer(isWholeGameRun ? "full_game" : getStageBestKey(stageIndex));
    refreshTimerVisibility();

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
    const returningFromWholeGameRun = isWholeGameRun;

    if (isTimerRunning) {
        if (completed) saveBestTime();
        isTimerRunning = false;
    }

    activeTimerRecordKey = null;
    isWholeGameRun = false;
    gameState = "menu";
    hasEscortKey = false;
    activeRoomPortals = [];
    lockedPortalKey = null;
    clearPendingRebind();
    resetGameplayInputs();
    uiLayer.style.display = "flex";
    uiLayer.classList.remove("in-game-menu");
    hudLevelName.classList.add("hidden"); 
    timeTooltip.classList.add("hidden");
    refreshTimerVisibility();
    showScreen(returningFromWholeGameRun ? "main" : "stageSelect"); 
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
document.getElementById("btnStartGame").onclick = () => showScreen("stageSelect");
document.getElementById("btnSpeedrun").onclick = () => startGameplay(TUTORIAL_STAGE_INDEX, { wholeGameRun: true });
document.getElementById("btnBestTimes").onclick = () => { renderBestTimes(); showScreen("bestTimes"); };
document.getElementById("btnLegacyVersion").onclick = () => { window.location.href = "legacy.html"; };
document.getElementById("btnStageBack").onclick = () => showScreen("main");
document.getElementById("btnBestTimesBack").onclick = () => showScreen("main");
document.getElementById("btnPauseResume").onclick = () => resumeGameplay();
document.getElementById("btnPauseSettings").onclick = () => { refreshBindUI(); showScreen("settings"); };
document.getElementById("btnPauseQuit").onclick = () => endGameplay(false);
document.getElementById("btnSettingsBack").onclick = () => {
    clearPendingRebind();
    showScreen(gameState === "paused" ? "pause" : "main");
};
document.getElementById("btnResetBinds").onclick = () => {
    clearPendingRebind();
    userBinds = { ...defaultBinds };
    localStorage.setItem("spacebarBinds", JSON.stringify(userBinds));
    refreshBindUI();
};
document.getElementById("btnResetData").onclick = () => { if (confirm("Erase all stats, progress, and controls?")) { localStorage.clear(); location.reload(); } };

timerVisibilitySelect.onchange = (e) => {
    isTimerVisible = e.target.value === "visible";
    localStorage.setItem("timerVisibility", e.target.value);
    refreshTimerVisibility();
};

function refreshBindUI() { for (const action in userBinds) { let btn = document.getElementById(`bind-${action}`); if (btn) btn.innerText = userBinds[action]; } }

document.querySelectorAll(".bind-btn").forEach(btn => {
    if (btn.id === "timerVisibilitySelect") return; 
    btn.onclick = () => {
        clearPendingRebind();
        rebindingAction = btn.id.split("-")[1];
        btn.innerText = "Press key...";
        btn.classList.add("waiting");
    };
});

showScreen("main");
loop();
