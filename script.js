const canvas = document.getElementById('paintCanvas');
const ctx = canvas.getContext('2d');
canvas.width = canvas.offsetWidth;
canvas.height = canvas.offsetHeight;

let painting = false;
let erasing = false;
let shape = null;
let color = 'black';
let startX, startY;
let canvasData;

document.querySelector('.lucide-palette').style.color=color

function startPosition(e) {
    painting = true;
    startX = e.clientX - canvas.offsetLeft;
    startY = e.clientY - canvas.offsetTop;
    if (shape === 'circle' || shape === 'square') {
        ctx.beginPath();
    } else {
        draw(e);
    }
    canvasData = ctx.getImageData(0, 0, canvas.width, canvas.height);
}

function endPosition(e) {
    painting = false;
    ctx.beginPath();
    if (shape === 'circle') {
        drawCircle(e);
    } else if (shape === 'square') {
        drawSquare(e);
    }
}

function limpar(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function draw(e) {
    if (!painting) return;

    if (erasing) {
        ctx.globalCompositeOperation = 'destination-out';
        ctx.lineWidth = 10;
    } else {
        ctx.globalCompositeOperation = 'source-over';
        ctx.lineWidth = 5;
        ctx.strokeStyle = color;
    }
    
    ctx.lineCap = 'round';
    ctx.lineTo(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop);
}

function drawCircle(e) {
    const radius = Math.sqrt(Math.pow(e.clientX - canvas.offsetLeft - startX, 2) + Math.pow(e.clientY - canvas.offsetTop - startY, 2));
    restoreCanvasState();
    ctx.beginPath();
    ctx.arc(startX, startY, radius, 0, Math.PI * 2);
    ctx.lineWidth = 5;
    ctx.strokeStyle = color;
    ctx.stroke();
    ctx.closePath();
    ctx.beginPath();
}

function drawSquare(e) {
    const width = e.clientX - canvas.offsetLeft - startX;
    const height = e.clientY - canvas.offsetTop - startY;

    restoreCanvasState();
    ctx.beginPath();
    ctx.rect(startX, startY, width, height);
    ctx.strokeStyle = color;
    ctx.lineWidth = 5;
    ctx.stroke();
    ctx.closePath();
    ctx.beginPath();
}

function restoreCanvasState() {
    ctx.putImageData(canvasData, 0, 0);
}

function selectColor() {
    const colorInput = document.createElement('input');
    colorInput.type = 'color';
    colorInput.addEventListener('input', (e) => {
        color = e.target.value;
        document.querySelector('.lucide-palette').style.color=color
        erasing = false;
    });
    colorInput.click();
}

document.querySelector('.lucide-eraser').parentElement.addEventListener('click', () => {
    erasing = true;
    shape = null;
});
document.querySelector('.lucide-pencil-line').parentElement.addEventListener('click', () => {
    erasing = false;
    shape = null;
});
document.querySelector('.lucide-palette').parentElement.addEventListener('click', selectColor);
document.querySelector('.lucide-circle').parentElement.addEventListener('click', () => {
    shape = 'circle';
    erasing = false;
});
document.querySelector('.lucide-square').parentElement.addEventListener('click', () => {
    shape = 'square';
    erasing = false;
});

canvas.addEventListener('mousedown', startPosition);
canvas.addEventListener('mouseup', endPosition);
canvas.addEventListener('mousemove', (e) => {
    if (shape === 'circle' || shape === 'square') {
        if (painting) {
            if (shape === 'circle') drawCircle(e);
            if (shape === 'square') drawSquare(e);
        }
    } else {
        draw(e);
    }
});
