const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const TILE_SIZE = 32;

// --- LEVEL DATA ---
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
        [0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4,0],
        [1,1,1,0,0,0,0,0,1,1,1,0,0,0,0,0,1,1,1,1],
        [0,0,1,0,0,0,0,0,1,0,1,0,0,0,0,0,1,0,0,0],
        [0,0,1,0,0,0,0,0,1,0,1,0,0,0,0,0,1,0,0,0],
        [0,0,1,0,2,0,2,0,1,0,1,0,0,0,0,0,1,0,0,0],
        [0,0,1,1,1,1,1,1,1,0,1,0,0,0,0,0,1,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,1,0,2,2,2,0,1,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,0,0,0],
    ],
    [// T-4
        [0,0,0,0,0,0,0,1,0,0,0,0,0,0,1,1,1,0,0,0],
        [0,0,0,0,0,0,0,1,0,0,0,0,0,0,1,1,1,0,0,0],
        [0,0,0,0,0,0,0,1,0,0,0,0,0,0,1,1,1,0,0,0],
        [0,0,0,0,0,0,0,1,0,0,0,0,0,0,1,1,1,0,0,0],
        [0,0,0,0,0,0,0,1,0,0,0,0,0,0,1,1,1,0,0,0],
        [0,3,0,0,2,0,0,0,0,0,2,2,0,0,0,0,0,0,0,4],
        [1,1,1,1,1,1,0,0,0,1,1,1,1,0,0,0,0,0,1,1],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    ],
    [// T-5
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,3,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [1,1,1,1,1,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,1,1,1,0,0,0,4,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4],
        [0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    ],
    [// 1-1
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0],
        [0,3,0,0,0,0,0,0,2,0,0,0,0,0,0,0,1,0,4,0],
        [1,1,1,1,0,0,0,1,1,1,0,0,0,1,1,1,1,1,1,1],
        [0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
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
        [0,0,0,0,0,0,0,0,0,0,0,2,0,0,2,0,0,0,0,0],
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
    [// 1-9
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,2,0,0,0,0,7,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4,0,0],
        [0,0,0,2,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,4,0,0,0,0,0,0,0,0,2,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0],
        [0,3,0,0,0,0,1,1,1,0,2,0,0,0,0,0,4,0,0,0],
        [1,1,1,0,0,0,0,0,0,1,1,1,0,4,0,1,1,1,0,0],
    ],
    [// 1-10
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,3,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0],
        [1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,2,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4,0],
        [0,4,0,0,0,0,0,0,4,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,7,0,0,0,2],
        [0,0,0,0,0,0,0,2,0,0,0,7,0,0,0,0,0,0,0,0],
        [0,7,0,2,0,0,0,0,0,0,0,0,0,2,0,0,0,2,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    ],
    [// 2-1
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,5,0,0,0,0,6,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,5,0,0,0,0,6,0,0,0,0,0,0,0],
        [3,0,0,0,0,2,0,5,0,0,2,0,6,0,0,0,0,0,4,0],
        [1,0,0,0,1,1,1,1,1,1,1,1,6,6,6,6,1,1,1,1],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    ],
    [// 2-2
        [0,3,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,4,0,0],
        [1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,5,0,0,0,0,0,0,0,0,0,7,0,0,0,0,0],
        [0,0,0,2,6,0,0,0,0,0,0,0,0,0,6,0,0,0,0,0],
        [0,4,0,0,5,0,0,0,0,0,0,0,0,2,6,0,0,0,0,0],
        [0,0,0,0,6,0,0,0,0,0,0,0,0,5,0,0,0,2,0,0],
        [0,0,2,0,5,0,0,0,0,0,0,0,2,5,0,0,0,0,0,0],
        [0,0,0,0,6,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0],
        [0,0,0,0,5,0,0,0,0,0,0,0,0,0,0,7,0,0,0,0],
        [0,0,0,0,1,1,1,1,0,0,0,0,4,0,0,0,0,0,0,0],
    ],
    [// 2-3
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,3,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,7,0,0],
        [1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,1,4,0],
        [0,0,4,0,0,0,0,5,5,0,0,0,0,0,0,1,1,1,1,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [2,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,4,0,0,0],
        [0,0,0,0,0,0,0,0,5,0,0,0,7,0,0,0,0,0,0,0],
        [0,0,2,0,0,0,7,0,5,0,0,0,6,6,0,0,0,0,0,2],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    ],
    [// 2-4
        [0,3,0,0,0,2,0,6,0,2,0,5,0,2,0,0,4,0,0,0],
        [1,1,1,0,1,1,1,0,5,5,5,0,6,6,6,1,1,1,1,1],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,0],
        [1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,1,1,1],
        [2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4,0],
        [1,1,0,0,5,0,0,0,0,0,0,0,0,0,0,5,5,5,2,0],
        [0,0,7,0,5,0,4,0,0,0,0,0,0,0,4,0,0,0,0,7],
        [0,6,6,6,0,2,5,5,0,0,0,0,0,0,0,0,0,0,2,0],
        [4,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0],
    ],
    [// 2-5
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,4,0,0,0,0,0,0,0,0,4,0,0,0,2,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,2,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,2],
        [0,0,0,0,0,0,5,0,0,0,0,0,0,0,0,0,2,0,0,0],
        [0,0,0,0,0,0,5,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,2,0,0,5,0,0,0,0,0,0,0,0,0,0,0,2,0],
        [1,6,6,6,6,0,5,0,0,7,0,0,0,0,7,0,0,4,0,0],
        [3,0,0,2,0,0,0,0,5,5,5,0,0,0,0,0,0,0,2,0],
        [1,0,5,5,5,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0],
    ],
    [// 2-6
        [0,6,0,2,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0],
        [0,6,0,6,0,0,0,0,0,0,2,0,0,0,0,6,0,0,0,0],
        [2,6,0,6,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [6,6,6,6,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4,0],
        [0,7,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [5,5,5,5,0,4,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,7,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,2,4,0,0,0,0,0,0,0,0,0],
        [0,3,0,0,0,0,0,0,5,5,5,5,0,0,0,0,0,0,0,0],
        [5,5,5,4,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    ],
    [// 2-7
        [1,1,0,5,0,6,0,5,0,6,0,0,0,0,0,0,0,0,0,0],
        [3,0,2,5,2,6,2,5,2,6,2,0,0,2,2,2,0,0,0,0],
        [1,0,1,5,0,6,0,5,0,6,0,0,0,6,6,6,0,0,0,4],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,0,0],
        [0,0,0,0,0,0,0,0,5,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,7,4,0,0,5,0,0,0,0,0,0,0,4,0,0,0],
        [0,5,5,5,5,5,5,0,5,0,0,0,0,2,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,6,6,0,0,0,0,0,0,0,0,0],
        [0,0,0,4,0,0,0,0,0,0,0,0,0,0,0,5,5,5,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    ],
    [// 2-8
        [1,1,6,6,6,6,0,2,0,0,0,2,0,0,0,2,0,7,0,0],
        [3,0,0,2,0,6,0,6,0,0,0,0,0,0,0,6,6,6,0,0],
        [1,0,5,5,5,6,0,6,0,0,0,0,0,0,0,0,0,0,0,2],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0],
        [4,0,0,0,0,6,1,1,0,0,2,0,0,0,0,0,0,0,0,0],
        [6,0,0,6,0,6,2,0,0,0,0,0,0,0,0,0,0,0,2,0],
        [0,0,6,6,0,6,5,0,5,0,0,0,0,0,0,0,0,0,0,0],
    ],
    [// 2-9
        [1,1,1,6,0,0,0,0,2,0,6,0,0,5,0,6,0,0,5,0],
        [3,0,2,6,0,6,0,0,6,0,6,0,2,5,2,6,2,0,5,4],
        [1,0,1,6,0,6,6,0,0,0,6,0,0,5,0,6,0,0,5,1],
        [4,1,1,0,0,0,0,0,0,0,0,0,0,7,5,0,0,6,0,0],
        [0,0,0,0,0,0,0,0,2,0,0,0,0,0,5,2,0,6,0,2],
        [0,2,0,0,0,0,0,0,1,1,0,0,0,0,5,0,0,6,0,1],
        [0,1,1,5,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0],
        [7,0,2,5,0,5,0,0,5,0,0,0,0,0,0,0,0,0,0,4],
        [6,0,6,5,0,5,5,0,0,0,0,0,0,0,0,2,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    ],
    [//2-10
        [4,1,0,0,5,0,0,0,0,0,4,0,0,0,0,0,0,0,0,0],
        [1,3,2,0,5,0,0,0,0,0,0,0,0,0,0,7,0,0,0,0],
        [5,5,5,0,5,0,0,0,0,0,2,0,0,2,0,0,0,0,5,0],
        [7,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,5,4],
        [6,6,6,6,6,6,0,0,0,2,0,0,0,0,0,0,2,0,5,2],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,5,0,5,6],
        [6,6,6,5,0,0,0,0,4,0,0,7,0,0,0,0,5,0,5,0],
        [7,0,2,5,0,5,0,0,5,0,0,0,0,0,0,0,0,0,0,0],
        [6,0,6,5,0,5,5,0,0,2,0,0,0,0,0,0,2,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4,0],
    ],
];

const levelNames = [
    "Why is my Spacebar not working?!", "What are these for?", "Double Jumps? Triple Jumps?",
    "Jumping on Air", "Hitting Multiple Doors", "Dashing with Shift", "Where to go now?",
    "Blue crystals and Upwards Dashing", "Chaining Dashes and Jumps", "Different Pathways",
    "What's the Plan Now?", "Is this jump possible?", "Aimlabs 2.0", "You are not ready for the next level...",
    "Absolute Hell", "Colored Platforms", "Different Sections", "There and Back",
    "Out of the Screen", "Precise Jumps", "Precise Jumps 2", "Timing your Movements",
    "Super Precise Jump", "Extreme Difficultly", "Everything Everywhere"
];

let currentLevelText = "";
let currentLevelIndex = 0;
let highestUnlockedLevel = parseInt(localStorage.getItem("spacebarSaveData")) || 0; 
let map = []; 
let gameState = "menu";

// --- SPEEDRUN TIMER DATA ---
let timerConfig = localStorage.getItem("spacebarTimerConfig") || "none";
let bestTimes = JSON.parse(localStorage.getItem("spacebarBestTimes")) || { levels: {}, stages: {}, game: null };
let activeTimerType = null;
let runStartTime = 0;
let isTiming = false;

const player = {
    x: 0, y: 0, width: 24, height: 24, 
    vx: 0, vy: 0,
    friction: 0.8, gravity: 0.4, jumpPower: -8,
    potions: 0, facing: 1, hasDash: true, isDashing: false, dashTimer: 0, dashDuration: 12, dashSpeed: 10
};

// --- KEYBINDING SYSTEM ---
const defaultBinds = {
    up: "ArrowUp", down: "ArrowDown", left: "ArrowLeft", right: "ArrowRight", jump: "Space", dash: "ShiftLeft"
};
let userBinds = JSON.parse(localStorage.getItem("spacebarBinds")) || { ...defaultBinds };
let rebindingAction = null; 

const keys = { right: false, left: false, up: false, down: false };
let jumpPressed = false; 
let dashPressed = false; 

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
    
    if (e.code === "KeyR") loadLevel(currentLevelIndex);
    if (e.code === "Escape") endGameplay();

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

// --- HELPER FUNCTIONS FOR TIMERS ---
function formatTime(ms) {
    let totalSeconds = ms / 1000;
    let mins = Math.floor(totalSeconds / 60);
    let secs = Math.floor(totalSeconds % 60);
    let millis = Math.floor((totalSeconds - Math.floor(totalSeconds)) * 1000);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}.${millis.toString().padStart(3, '0')}`;
}

function recordTime(type, key, timeMs) {
    if (!bestTimes[type][key] || timeMs < bestTimes[type][key]) {
        bestTimes[type][key] = timeMs;
        localStorage.setItem("spacebarBestTimes", JSON.stringify(bestTimes));
    }
}

function getStageForLevel(levelIndex) {
    let count = 0;
    for (let i = 0; i < stageConfigs.length; i++) {
        count += stageConfigs[i].levelCount;
        if (levelIndex < count) return i;
    }
    return 0;
}

function getFirstLevelOfStage(stageIndex) {
    let startIdx = 0;
    for (let i = 0; i < stageIndex; i++) startIdx += stageConfigs[i].levelCount;
    return startIdx;
}

function getLastLevelOfStage(stageIndex) {
    return getFirstLevelOfStage(stageIndex) + stageConfigs[stageIndex].levelCount - 1;
}

// --- LEVEL MANAGEMENT ---
function loadLevel(index) {
    if (index >= levels.length) {
        alert("Level under construction! Returning to Stage Select.");
        endGameplay();
        return;
    }

    map = JSON.parse(JSON.stringify(levels[index]));

    player.vx = 0; player.vy = 0; player.potions = 0;
    player.hasDash = true; player.isDashing = false;

    // Reset individual level timer if they restarted manually
    if (gameState === "playing" && activeTimerType === "levels") {
        runStartTime = performance.now();
    }

    for (let y = 0; y < map.length; y++) {
        for (let x = 0; x < map[y].length; x++) {
            if (map[y][x] === 3) {
                player.x = x * TILE_SIZE + 4; 
                player.y = y * TILE_SIZE + 4;
                map[y][x] = 0; 
            }
        }
    }

    let customName = levelNames[index] || "Unnamed Level";
    hudLevelName.innerText = `${customName}`;
}

function startDash() {
    let dx = 0; let dy = 0;
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

// --- COLLISION & INTERACTION LOGIC ---
function checkCollision(px, py) {
    let left = Math.floor(px / TILE_SIZE);
    let right = Math.floor((px + player.width - 0.1) / TILE_SIZE);
    let top = Math.floor(py / TILE_SIZE);
    let bottom = Math.floor((py + player.height - 0.1) / TILE_SIZE);

    for (let y = top; y <= bottom; y++) {
        for (let x = left; x <= right; x++) {
            if (map[y] && (map[y][x] === 1 || map[y][x] === 5)) return true;
        }
    }
    return false;
}

function checkPotions(px, py) {
    let cx = Math.floor((px + player.width / 2) / TILE_SIZE);
    let cy = Math.floor((py + player.height / 2) / TILE_SIZE);
    
    if (map[cy] && map[cy][cx] === 2) {
        map[cy][cx] = 0; 
        player.potions++;
    }
}

function checkCrystals(px, py) {
    let cx = Math.floor((px + player.width / 2) / TILE_SIZE);
    let cy = Math.floor((py + player.height / 2) / TILE_SIZE);
    
    if (map[cy] && map[cy][cx] === 7 && !player.hasDash) {
        map[cy][cx] = 0; 
        player.hasDash = true; 
    }
}

function checkGoal(px, py) {
    let cx = Math.floor((px + player.width / 2) / TILE_SIZE);
    let cy = Math.floor((py + player.height / 2) / TILE_SIZE);
    
    if (map[cy] && map[cy][cx] === 4) {
        map[cy][cx] = 0; 
        
        let doorsRemaining = false;
        for (let y = 0; y < map.length; y++) {
            for (let x = 0; x < map[y].length; x++) {
                if (map[y][x] === 4) { doorsRemaining = true; break; }
            }
            if (doorsRemaining) break; 
        }

        if (!doorsRemaining) {
            
            // Speedrun Timer Resolution logic
            if (isTiming) {
                let stageIdx = getStageForLevel(currentLevelIndex);
                let isLastInStage = currentLevelIndex === getLastLevelOfStage(stageIdx);
                let isLastInGame = currentLevelIndex === levels.length - 1;

                if (activeTimerType === "levels") {
                    recordTime("levels", currentLevelIndex, performance.now() - runStartTime);
                    if (currentLevelIndex + 1 > highestUnlockedLevel) {
                        highestUnlockedLevel = currentLevelIndex + 1;
                        localStorage.setItem("spacebarSaveData", highestUnlockedLevel);
                    }
                    endGameplay();
                    showScreen("levelSelect"); 
                    return; 
                } else if (activeTimerType === "stages" && isLastInStage) {
                    recordTime("stages", stageIdx, performance.now() - runStartTime);
                    if (currentLevelIndex + 1 > highestUnlockedLevel) {
                        highestUnlockedLevel = currentLevelIndex + 1;
                        localStorage.setItem("spacebarSaveData", highestUnlockedLevel);
                    }
                    endGameplay();
                    showScreen("stageSelect");
                    return; 
                } else if (activeTimerType === "game" && isLastInGame) {
                    recordTime("game", "game", performance.now() - runStartTime);
                    endGameplay();
                    showScreen("stageSelect"); 
                    return;
                }
            }

            // Normal progression
            currentLevelIndex++;
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
            if (map[y][x] === 5) map[y][x] = 6;
            else if (map[y][x] === 6) map[y][x] = 5;
        }
    }
    if (checkCollision(player.x, player.y)) loadLevel(currentLevelIndex);
}

// --- GAME LOOP ---
function update() {
    if (player.isDashing) {
        player.dashTimer--;
        if (player.dashTimer <= 0) {
            player.isDashing = false;
            player.vx *= 0.5; player.vy *= 0.5; 
        }
    } else {
        if (keys.right) player.vx += 1;
        if (keys.left) player.vx -= 1;
        player.vx *= player.friction; 
        player.vy += player.gravity;
    }

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
        } else if (player.vy < 0) {
            player.y = Math.floor(player.y / TILE_SIZE) * TILE_SIZE + TILE_SIZE + 0.1;
        }
        player.vy = 0;
    }

    checkPotions(player.x, player.y);
    checkCrystals(player.x, player.y); 
    checkGoal(player.x, player.y);
    
    if (player.y > map.length * TILE_SIZE) loadLevel(currentLevelIndex); 
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let y = 0; y < map.length; y++) {
        for (let x = 0; x < map[y].length; x++) {
            if (map[y][x] === 1) {
                ctx.fillStyle = "#666";
                ctx.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
            } else if (map[y][x] === 2) {
                ctx.fillStyle = "#00ff88"; 
                ctx.fillRect(x * TILE_SIZE + 8, y * TILE_SIZE + 8, 16, 16);
            } else if (map[y][x] === 4) {
                ctx.fillStyle = "#ffd700"; 
                ctx.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
            } else if (map[y][x] === 5) {
                ctx.fillStyle = "#ff4444"; 
                ctx.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
            } else if (map[y][x] === 6) {
                ctx.fillStyle = "rgba(68, 68, 255, 0.2)";
                ctx.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
                ctx.strokeStyle = "#4444ff"; 
                ctx.lineWidth = 2; 
                ctx.strokeRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
            } else if (map[y][x] === 7) {
                ctx.fillStyle = "#00ccff"; 
                ctx.beginPath();
                ctx.moveTo(x * TILE_SIZE + 16, y * TILE_SIZE + 4);  
                ctx.lineTo(x * TILE_SIZE + 28, y * TILE_SIZE + 16); 
                ctx.lineTo(x * TILE_SIZE + 16, y * TILE_SIZE + 28); 
                ctx.lineTo(x * TILE_SIZE + 4, y * TILE_SIZE + 16);  
                ctx.fill();
            }

            ctx.font = "16px sans-serif";
            ctx.textAlign = "center";
            ctx.fillText(currentLevelText, canvas.width / 2, 24);
        }
    }

    ctx.fillStyle = player.hasDash ? "#ff3366" : "#00ccff"; 
    ctx.fillRect(player.x, player.y, player.width, player.height);

    if (player.potions > 0) {
        let maxInnerSize = player.width - 4; 
        let innerSize = Math.min(player.potions * 6, maxInnerSize); 
        
        let innerX = player.x + (player.width / 2) - (innerSize / 2);
        let innerY = player.y + (player.height / 2) - (innerSize / 2);

        ctx.fillStyle = "#00ff88"; 
        ctx.fillRect(innerX, innerY, innerSize, innerSize);
    }

    // Process HUD Timer Overlay
    if (isTiming) {
        hudTimer.innerText = formatTime(performance.now() - runStartTime);
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
const hudLevelName = document.getElementById("hudLevelName");
const hudTimer = document.getElementById("hudTimer");
const timeTooltip = document.getElementById("timeTooltip");

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

function handleHover(btn, type, target) {
    btn.onmouseenter = (e) => {
        let time = (type === "game") ? bestTimes.game : bestTimes[type][target];
        if (time) {
            timeTooltip.innerText = "Best: " + formatTime(time);
            timeTooltip.classList.remove("hidden");
        }
    };
    btn.onmousemove = (e) => {
        let containerRect = document.getElementById("gameContainer").getBoundingClientRect();
        timeTooltip.style.left = (e.clientX - containerRect.left + 15) + "px";
        timeTooltip.style.top = (e.clientY - containerRect.top - 25) + "px";
    };
    btn.onmouseleave = () => timeTooltip.classList.add("hidden");
}

function startGameplay(absoluteIndex) {
    currentLevelIndex = absoluteIndex;
    gameState = "playing";
    uiLayer.style.display = "none";
    hudLevelName.classList.remove("hidden"); 
    
    // Evaluate validity of timer mode and start
    if (timerConfig === "levels") {
        activeTimerType = "levels";
        runStartTime = performance.now();
        isTiming = true;
        hudTimer.classList.remove("hidden");
    } else if (timerConfig === "stages") {
        let stageIdx = getStageForLevel(absoluteIndex);
        if (absoluteIndex === getFirstLevelOfStage(stageIdx)) {
            activeTimerType = "stages";
            runStartTime = performance.now();
            isTiming = true;
            hudTimer.classList.remove("hidden");
        } else {
            isTiming = false;
            hudTimer.classList.add("hidden");
        }
    } else if (timerConfig === "game") {
        if (absoluteIndex === 0) {
            activeTimerType = "game";
            runStartTime = performance.now();
            isTiming = true;
            hudTimer.classList.remove("hidden");
        } else {
            isTiming = false;
            hudTimer.classList.add("hidden");
        }
    } else {
        isTiming = false;
        hudTimer.classList.add("hidden");
    }
    
    keys.right = false; keys.left = false; keys.up = false; keys.down = false;
    loadLevel(currentLevelIndex);
}

function endGameplay() {
    gameState = "menu";
    uiLayer.style.display = "flex";
    hudLevelName.classList.add("hidden"); 
    hudTimer.classList.add("hidden");
    isTiming = false;
    showScreen("stageSelect");
}

const stageConfigs = [
    { title: "Tutorial", levelCount: 5 },
    { title: "Stage 1", levelCount: 10 },
    { title: "Stage 2", levelCount: 10 }
];

stageGrid.innerHTML = "";
stageConfigs.forEach((stage, index) => {
    let btn = document.createElement("button");
    btn.innerText = stage.title;
    btn.style.width = "auto"; 
    btn.style.padding = "10px 15px";
    btn.onclick = () => buildLevelSelect(index);
    handleHover(btn, "stages", index);
    stageGrid.appendChild(btn);
});

function buildLevelSelect(stageIndex) {
    let stage = stageConfigs[stageIndex];
    levelSelectTitle.innerText = stage.title;
    levelGrid.innerHTML = "";
    
    let startIdx = getFirstLevelOfStage(stageIndex);
    
    for (let i = 1; i <= stage.levelCount; i++) {
        let btn = document.createElement("button");
        let absoluteIndex = startIdx + (i - 1);
        
        if (absoluteIndex >= levels.length) {
            btn.innerText = "X"; 
            btn.disabled = true; 
        } else if (absoluteIndex > highestUnlockedLevel) {
            btn.innerText = "🔒"; 
            btn.disabled = true;
        } else {
            btn.innerText = i;
            btn.onclick = () => startGameplay(absoluteIndex);
            handleHover(btn, "levels", absoluteIndex);
        }
        
        levelGrid.appendChild(btn);
    }
    showScreen("levelSelect");
}

// --- KEYBINDING & SETTINGS MENU LOGIC ---
function refreshBindUI() {
    for (const action in userBinds) {
        const btn = document.getElementById(`bind-${action}`);
        if (btn) btn.innerText = userBinds[action];
    }
}

document.querySelectorAll(".bind-btn").forEach(btn => {
    if (btn.id === "timerSelect") return; 
    btn.onclick = () => {
        if (rebindingAction) {
            document.getElementById(`bind-${rebindingAction}`).classList.remove("waiting");
            refreshBindUI(); 
        }

        const action = btn.id.split("-")[1]; 
        rebindingAction = action;
        
        btn.innerText = "Press key...";
        btn.classList.add("waiting");
    };
});

const timerSelect = document.getElementById("timerSelect");
timerSelect.value = timerConfig;
timerSelect.onchange = (e) => {
    timerConfig = e.target.value;
    localStorage.setItem("spacebarTimerConfig", timerConfig);
};

const btnStartGame = document.getElementById("btnStartGame");
btnStartGame.onclick = () => showScreen("stageSelect");
handleHover(btnStartGame, "game", "game"); // Whole Game Best Time Tracker

document.getElementById("btnSettings").onclick = () => {
    refreshBindUI();
    showScreen("settings");
};
document.getElementById("btnSettingsBack").onclick = () => {
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
    if(confirm("Are you sure you want to erase all level progress and best times?")) {
        localStorage.removeItem("spacebarSaveData");
        localStorage.removeItem("spacebarBestTimes");
        highestUnlockedLevel = 0;
        bestTimes = { levels: {}, stages: {}, game: null };
        alert("Progress and times reset!");
    }
};

// Init
showScreen("main");
loop();
