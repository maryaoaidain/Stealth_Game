const canvas = document.getElementById("gameCanvas");
document.getElementById("overlay").classList.add("hidden");

const ctx = canvas.getContext("2d");
let gameOver = false;

const TILE = 60;
const ROWS = 10;
const COLS = 10;

const grid = [
 [0,0,0,0,1,0,0,0,0,0],
 [0,1,1,0,1,0,1,1,1,0],
 [0,0,0,0,0,0,0,0,1,0],
 [0,1,1,1,1,1,0,0,1,0],
 [0,0,0,0,0,0,0,0,0,0],
 [0,1,1,1,1,0,1,1,1,0],
 [0,0,0,0,0,0,0,0,0,0],
 [0,1,1,1,0,1,1,1,1,0],
 [0,0,0,0,0,0,0,0,0,0],
 [0,0,1,1,1,0,1,1,1,0],
];

let player, guard, goal;
let guardState = "PATROL";
let path = [];
let patrolPoints = [{x:9,y:9},{x:9,y:0},{x:0,y:5}];
let patrolIndex = 0;
let lastSeen = null;

function resetGame(){
    player = {x:0,y:0};
    guard = {x:9,y:9};
    goal = {x:0,y:9};
    guardState = "PATROL";
    path = [];
    gameOver = false; // ✅ إعادة تفعيل اللعبة
    document.getElementById("overlay").classList.add("hidden");
}

resetGame();

// ---------- A* ----------
function heuristic(a,b){
    return Math.abs(a.x-b.x) + Math.abs(a.y-b.y);
}

function astar(start, goal){
    let open = [{pos:start, f:0}];
    let came = {};
    let g = {};
    g[key(start)] = 0;

    while(open.length){
        open.sort((a,b)=>a.f-b.f);
        let current = open.shift().pos;

        if(key(current)===key(goal)){
            let res=[];
            while(key(current) in came){
                res.push(current);
                current = came[key(current)];
            }
            return res.reverse();
        }

        for(let d of dirs){
            let nx=current.x+d.x, ny=current.y+d.y;
            if(nx<0||ny<0||nx>=ROWS||ny>=COLS||grid[nx][ny]===1) continue;
            let temp = g[key(current)] + 1;
            let k = nx+","+ny;
            if(!(k in g) || temp < g[k]){
                g[k]=temp;
                came[k]=current;
                open.push({pos:{x:nx,y:ny}, f:temp+heuristic({x:nx,y:ny},goal)});
            }
        }
    }
    return [];
}

const dirs=[{x:1,y:0},{x:-1,y:0},{x:0,y:1},{x:0,y:-1}];
const key = p=>p.x+","+p.y;

// ---------- Vision ----------
function canSee(){
    if(player.x===guard.x){
        let step = player.y>guard.y?1:-1;
        for(let y=guard.y+step;y!==player.y;y+=step)
            if(grid[guard.x][y]===1) return false;
        return true;
    }
    if(player.y===guard.y){
        let step = player.x>guard.x?1:-1;
        for(let x=guard.x+step;x!==player.x;x+=step)
            if(grid[x][guard.y]===1) return false;
        return true;
    }
    return false;
}

// ---------- Game Loop ----------
document.addEventListener("keydown",e=>{
    let move=null;
    if(e.key==="ArrowUp") move={x:-1,y:0};
    if(e.key==="ArrowDown") move={x:1,y:0};
    if(e.key==="ArrowLeft") move={x:0,y:-1};
    if(e.key==="ArrowRight") move={x:0,y:1};

    if(move){
        let nx=player.x+move.x, ny=player.y+move.y;
        if(nx>=0&&ny>=0&&nx<ROWS&&ny<COLS&&grid[nx][ny]===0){
            player={x:nx,y:ny};
        }
    }
});

function updateAI(){
     if(gameOver) return;
    // رؤية اللاعب
    if(canSee()){
        guardState="CHASE";
        lastSeen={...player};
        path = []; // مهم جدًا
    }

    if(guardState==="PATROL"){
        let t=patrolPoints[patrolIndex];
        if(!path.length) path=astar(guard,t);
        if(key(guard)===key(t)) patrolIndex=(patrolIndex+1)%patrolPoints.length;
    }

    else if(guardState==="CHASE"){
        // 🔥 إعادة حساب المسار دائمًا
        path = astar(guard, player);
    }

    // حركة الحارس
    if(path.length) guard = path.shift();

    document.getElementById("state").innerText = guardState;

    // شروط النهاية
    if(key(player)===key(goal)){
        showResult("🎉 YOU ESCAPED!", "#00e676");
    }

    if(key(player)===key(guard)){
        showResult("💀 CAUGHT BY GUARD", "#ff1744");
    }
}

function draw(){
    ctx.clearRect(0,0,600,600);
    for(let r=0;r<ROWS;r++){
        for(let c=0;c<COLS;c++){
            ctx.strokeRect(c*TILE,r*TILE,TILE,TILE);
            if(grid[r][c]===1){
                ctx.fillStyle="#444";
                ctx.fillRect(c*TILE,r*TILE,TILE,TILE);
            }
        }
    }

    // goal
    ctx.fillStyle="green";
    ctx.fillRect(goal.y*TILE+15,goal.x*TILE+15,30,30);

    // player (person icon)
    ctx.fillStyle="#2196f3";
    ctx.beginPath();
    ctx.arc(player.y*TILE+30,player.x*TILE+25,10,0,Math.PI*2);
    ctx.fill();
    ctx.fillRect(player.y*TILE+23,player.x*TILE+35,14,18);

    // guard
    ctx.fillStyle=guardState==="PATROL"?"orange":"red";
    ctx.beginPath();
    ctx.arc(guard.y*TILE+30,guard.x*TILE+25,10,0,Math.PI*2);
    ctx.fill();
    ctx.fillRect(guard.y*TILE+23,guard.x*TILE+35,14,18);
}

setInterval(()=>{
    updateAI();
    draw();
},300);
function showResult(text, color){
    gameOver = true; // ⛔ توقف اللعبة
    const overlay = document.getElementById("overlay");
    const resultText = document.getElementById("resultText");
    resultText.innerText = text;
    resultText.style.color = color;
    overlay.classList.remove("hidden");}