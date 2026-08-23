const canvas = document.getElementById("canvas");
const c = canvas.getContext("2d");

function reSizeCanvas() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    c.setTransform(dpr, 0, 0, dpr, 0, 0);
    drow();
}
reSizeCanvas();
window.addEventListener("resize", reSizeCanvas);
document.addEventListener("wheel", e => {
    if (e.ctrlKey) e.preventDefault();
}, { passive: false });

document.addEventListener("keydown", e => {
    if (e.ctrlKey && ["+", "-", "=", "0"].includes(e.key)) {
        e.preventDefault();
    }
});

let folderHandle = null;
document.getElementById("folder_loading").addEventListener("click", async () => {
    try {
        folderHandle = await window.showDirectoryPicker();
        alert("フォルダを選択しました");
        document.getElementById("folder_loading").style.display = "none";
    } catch (error) {
        alert("フォルダ選択をキャンセルしました");
    }
})

let mouse_x = 0;
let mouse_y = 0;
let grid_x = window.innerWidth/2;
let grid_y = window.innerHeight/2;
let camera_x = 0;
let camera_y = 0;
let mouseDown = false;
let zoom_size = 1;
document.addEventListener("mousedown", (e) => {
    mouseDown = true;
    mouse_x = e.clientX;
    mouse_y = e.clientY;
});
document.addEventListener("mouseup", () => {mouseDown = false;});
document.addEventListener("mousemove", (e) => {
    if(mouseDown) {
        grid_x += e.clientX - mouse_x;
        grid_y += e.clientY - mouse_y;
        mouse_x = e.clientX;
        mouse_y = e.clientY;
    }
});
document.addEventListener("wheel", (e) => {
    if(e.deltaY < 0) {
        zoom_size *= 1.05;
    }
    if(e.deltaY > 0 && zoom_size > 0.1) {
        zoom_size /= 1.05;
    }
})


function loop() {
    clear();
    requestAnimationFrame(loop);
}
loop();

function drow() {
}

function clear() {
    c.save();
    c.setTransform(1, 0, 0, 1, 0, 0);
    c.clearRect(0, 0, canvas.width, canvas.height);
    c.restore();
    drow();
    grid();
    document.getElementById("debug").innerHTML = "camera-x : " + camera_x + "<br>camera-y : " + camera_y + "<br>zoom_size : " + zoom_size;
}

function grid() {
    let screen_width_size = 28.3;//cm
    let screen_height_size = 13.9;//cm
    let line_thickness = 0.2;
    const px_times = window.innerWidth/screen_width_size*zoom_size;//1cmにおける必要なpxの数
    camera_x = grid_x/px_times;
    camera_y = grid_y/px_times;
    for(let i = -1; i < Math.ceil(screen_width_size/zoom_size); i++) {
        const line_x = px_times*i+grid_x%px_times;
            if((i-Math.floor(camera_x))%5 === 0) {line_thickness = 0.5;} else {line_thickness = 0.2;}
            if((i-Math.floor(camera_x)) === 0) {line_thickness = 1.8;}
        line(line_x,0,line_x,window.innerHeight,"black",line_thickness);//縦軸
    };
    for(let i = 0; i <= Math.ceil(screen_height_size/zoom_size); i++) {
        const line_y = px_times*i+grid_y%px_times;
            if((i-Math.floor(camera_y))%5 === 0) {line_thickness = 0.5;} else {line_thickness = 0.2;}
            if((i-Math.floor(camera_y)) === 0) {line_thickness = 1.8;}
        line(0,line_y,window.innerWidth,line_y,"black",line_thickness);//横軸
    }
}

function line(x1,y1,x2,y2,color = "black",thickness = 1) {
    c.beginPath();
    c.strokeStyle = `${color}`;
    c.lineWidth = thickness;
    c.moveTo(x1,y1);
    c.lineTo(x2,y2);
    c.stroke();
}

function circle(x1,y1,r,color = "black",fillcolor = "black",thickness = 1) {
    c.beginPath();
    c.arc(x1, y1, r, 0, 2*Math.PI);
    c.lineWidth = thickness;
    c.strokeStyle = `${color}`;
    if(fillcolor) {
        c.fillStyle = `${fillcolor}`;
        c.fill();
    }
    c.stroke();
}

function square(x1,y1,width,height,color = "black",fillcolor = "",thickness = 1) {
    c.beginPath();
    c.lineWidth = thickness;
    c.strokeStyle = color;
    c.rect(x1,y1,width,height);
    if(fillcolor) {
        c.fillStyle = fillcolor;
        c.fill();
    }
    c.stroke();
}

function text(text,x1,y1,fontsize = 16,fontcolor = "black",color = "black",thickness = 1) {
    c.beginPath();
    c.font = `${fontsize}`;
    if(color) {
        c.strokeStyle = color;
        c.lineWidth = thickness;
        c.strokeText(`${text}`,x1,y1)
    } else {
        c.fillText(`${text}`,x1,y1)
    }
}
