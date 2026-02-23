const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
ctx.imageSmoothingEnabled = false;

// --- 1. ASSET LOADING ---
const images = {
    front: new Image(), back: new Image(), left: new Image(), right: new Image(),
    npc: new Image()
};
images.front.src = "assets/player_front.png";
images.back.src = "assets/player_back.png";
images.left.src = "assets/player_left.png";
images.right.src = "assets/player_right.png";
images.npc.src = "assets/npc.png"; 

// Create the moving GIF element (Top Left Overlay)
const gifOverlay = document.createElement("img");
gifOverlay.src = "assets/consequence.gif"; 
gifOverlay.style = "position:fixed; top:20px; left:20px; width:400px; display:none; z-index:1000;";
document.body.appendChild(gifOverlay);

const treeImg = new Image(); treeImg.src = "assets/tree.png"; 
const houseImg = new Image(); houseImg.src = "assets/house.png"; 

// --- 2. PLAYER & GANDALF ---
let gameState = "play"; 

const player = {
    x: 120, y: 250, width: 72, height: 144, frameX: 0, speed: 5, moving: false, facing: 'front'

};

const gandalf = { x: 600, y: 500, width: 64, height: 98, range: 100 };

const worldObjects = [
    { x: 400, y: 120, width: 100, height: 130, type: 'tree' },
    { x: 589, y: 218, width: 100, height: 130, type: 'tree' },
    { x: 705, y: 40, width: 100, height: 130, type: 'tree' },
    { x: 897, y: 425, width: 100, height: 130, type: 'tree' },
    { x: 820, y: 10, width: 100, height: 130, type: 'tree' },
    { x: 384, y: 32, width: 100, height: 130, type: 'tree' },
    { x: 900, y: 150, width: 220, height: 200, type: 'house'},
    { x: 30, y: 150, width: 220, height: 200, type: 'house'}
];

const keys = {};
window.onkeydown = (e) => { 
    keys[e.key] = true; 
    if (e.key.toLowerCase() === 'e' && isNearNPC() && gameState === "play") startDialogue();
};
window.onkeyup = (e) => { keys[e.key] = false; };

// --- 3. THE MAP ENGINE (Keeping your edited noise details) ---
const ts = 32;
function getNoise(c, r, seed) {
    let val = Math.sin(c * 12.9898 + r * 78.233 + seed) * 43758.5453;
    return val - Math.floor(val);
}

function drawMap() {
    const rows = Math.ceil(canvas.height / ts);
    const cols = Math.ceil(canvas.width / ts);
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            const roadWobble = getNoise(c, r, 1) * 2;
            const isPath = (r >= 9 + roadWobble && r <= 11 + roadWobble) || 
                           (c >= 14 + roadWobble && c <= 16 + roadWobble);

            if (isPath) {
                ctx.fillStyle = "#c2a37d"; 
                ctx.fillRect(c * ts, r * ts, ts, ts);
                if (getNoise(c, r, 2) > 0.8) { ctx.fillStyle = "#a88a66"; ctx.fillRect(c * ts + 4, r * ts + 6, 12, 4); }
            } else {
                const grassType = getNoise(c, r, 4);
                ctx.fillStyle = grassType > 0.5 ? "#5cb34d" : "#54a144";
                ctx.fillRect(c * ts, r * ts, ts, ts);

                if (grassType > 0.92) {
                    ctx.fillStyle = "#2d5a27"; ctx.fillRect(c * ts + 4, r * ts + 4, 24, 24);
                } else if (grassType < 0.08) {
                    ctx.fillStyle = getNoise(c, r, 5) > 0.5 ? "#ff5e5e" : "#f1c40f"; 
                    ctx.fillRect(c * ts + 12, r * ts + 12, 6, 6);
                }
            }
        }
    }
}

// --- 4. LOGIC & UNFREEZE TIMER ---
function isNearNPC() {
    let dx = player.x - gandalf.x;
    let dy = player.y - gandalf.y;
    return Math.sqrt(dx*dx + dy*dy) < gandalf.range;
}

function isColliding(nx, ny) {
    if (nx < 0 || nx + player.width > canvas.width || ny < 0 || ny + player.height > canvas.height) return true;
    for (let obj of worldObjects) {
        const pFeetY = ny + (player.height * 0.8);
        const oBaseY = obj.y + (obj.height * 0.7);
        if (nx < obj.x + obj.width && nx + player.width > obj.x &&
            pFeetY < oBaseY + (obj.height * 0.3) && pFeetY + 20 > oBaseY) return true;
    }
    return false;
}

function startDialogue() {
    gameState = "dialogue";
    const box = document.createElement("div");
    box.id = "ui";
    
    // UI Container: Background is fully transparent, text is white
    box.style = `
        position: fixed; 
        bottom: 20px; 
        left: 50%; 
        transform: translateX(-50%); 
        width: 600px; 
        background: transparent; 
        color: white; 
        padding: 20px; 
        border: 1px solid rgba(255, 255, 255, 0.3); 
        font-family: sans-serif; 
        text-align: center; 
        z-index: 100;
    `;

    box.innerHTML = `
        <p style="margin-bottom: 20px; text-shadow: 2px 2px 4px rgba(0,0,0,0.8);">
            Dwarf: Hi! I am Gandalf, may I know your name?
        </p>
        
        <button onclick="nextDialog()" class="dialogue-btn">
            I am Bilbo Baggins, What can I do for you?
        </button>
        
        <button onclick="nextDialog()" class="dialogue-btn">
            What do you want?
        </button>

        <style>
            .dialogue-btn {
                background: transparent; /* See-through background */
                color: white;            /* Visible text */
                border: none;              /* No border */
                box-shadow: 0 2px 4px rgba(0,0,0,0.8); /* Text shadow for readability */
                background: rgba(87, 81, 81, 0.46); /* Subtle background for better visibility */
                padding: 10px 20px;
                margin: 0 10px;
                cursor: pointer;
                font-family: sans-serif;
                transition: background 0.2s;
            }
            .dialogue-btn:hover {
                background: rgba(255, 255, 255, 0.1); /* Subtle highlight on hover */
            }
        </style>
    `;
    document.body.appendChild(box);
}

window.nextDialog = () => {
    document.getElementById("ui").innerHTML = `
        <p>"I am looking for someone to share in an adventure..."</p>
        <button onclick="startConsequences()" class="dialogue-btn">Join</button>
        <button onclick="startConsequences()" class="dialogue-btn">Ignore</button>

        
        <style>
            .dialogue-btn {
                background: transparent; /* See-through background */
                color: white;            /* Visible text */
                border: none;              /* No border */
                box-shadow: 0 2px 4px rgba(0,0,0,0.8); /* Text shadow for readability */
                background: rgba(87, 81, 81, 0.46); /* Subtle background for better visibility */
                padding: 10px 20px;
                margin: 0 10px;
                cursor: pointer;
                font-family: sans-serif;
                transition: background 0.2s;
            }
            .dialogue-btn:hover {
                background: rgba(255, 255, 255, 0.1); /* Subtle highlight on hover */
            }
        </style>       
    `;
};

window.startConsequences = () => {
    document.getElementById("ui").remove();
    gameState = "consequences"; 
    gifOverlay.style.display = "block"; // Show moving GIF

    // TIMER: Unfreeze game after 5 seconds
    setTimeout(() => {
        gameState = "play";
        gifOverlay.style.display = "none";
    }, 5000); 
};

window.onkeydown = (e) => { 
    keys[e.key] = true; 

    // THE CONDITION: Redirects to book.html when Escape is pressed
    if (e.key === 'Escape') {
        window.location.href = "/pages/book.html?id=3";
    }

    if (e.key.toLowerCase() === 'e' && isNearNPC() && gameState === "play") {
        startDialogue();
    }
};

// --- 5. CORE LOOP ---
let gameFrame = 0;
function animate() {
    if (gameState === "play") {
        player.moving = false;
        let nextX = player.x, nextY = player.y;
        if (keys["w"]) { nextY -= player.speed; player.facing = 'back'; player.moving = true; }
        else if (keys["s"]) { nextY += player.speed; player.facing = 'front'; player.moving = true; }
        else if (keys["a"]) { nextX -= player.speed; player.facing = 'left'; player.moving = true; }
        else if (keys["d"]) { nextX += player.speed; player.facing = 'right'; player.moving = true; }

        if (player.moving && !isColliding(nextX, nextY)) { player.x = nextX; player.y = nextY; }
        if (player.moving) {
            gameFrame++;
            if (gameFrame % 10 === 0) player.frameX = (player.frameX + 1) % 4;
        } else { player.frameX = 0; }
    }

    if (gameState !== "consequences") {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawMap();

        const renderList = [
            ...worldObjects,
            { ...player, isPlayer: true },
            { ...gandalf, isNPC: true }
        ].sort((a, b) => (a.y + (a.height || 0)) - (b.y + (b.height || 0)));

        renderList.forEach(item => {
            let img;
            if (item.isPlayer) {
                img = images[player.facing];
                if (img.complete && img.naturalWidth > 0) {
                    const sw = img.width / 4;
                    const sx = player.frameX * sw;
                    ctx.drawImage(img, sx, 0, sw, img.height, item.x, item.y, item.width, item.height);
                }
            } else if (item.isNPC) {
                img = images.npc;
                if (img.complete && img.naturalWidth > 0) {
                    // Gandalf uses the full image, no slicing
                    ctx.drawImage(img, 0, 0, img.width, img.height, item.x, item.y, item.width, item.height);
                }
            } else {
                img = (item.type === 'tree' ? treeImg : houseImg);
                if (img.complete && img.naturalWidth > 0) {
                    ctx.drawImage(img, 0, 0, img.width, img.height, item.x, item.y, item.width, item.height);
                }
            }
        });
    }
    requestAnimationFrame(animate);
}

animate();

window.onresize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };