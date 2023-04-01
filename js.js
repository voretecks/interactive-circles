const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const zoomInBtn = document.getElementById('zoom-in');
const zoomOutBtn = document.getElementById('zoom-out');
const resetBtn = document.getElementById('reset');

let circles = [];
let zoom = 1;
let offsetX = 0;
let offsetY = 0;

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

class Circle {
  constructor(x, y, radius, color) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius * zoom, 0, Math.PI * 2, false);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.closePath();
  }

  update(mouse) {
    const distanceX = this.x - mouse.x;
    const distanceY = this.y - mouse.y;
    const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);

    if (distance < 100) {
      this.x += distanceX * 0.01;
      this.y += distanceY * 0.01;
    }

    this.draw();
  }
}

function generateCircles() {
  circles = [];

  for (let i = 0; i < 5000; i++) {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    const radius = Math.random() * 20 + 10;
    const color = `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 0.7)`;

    circles.push(new Circle(x, y, radius, color));
  }
}

generateCircles();

const mouse = {
  x: undefined,
  y: undefined,
};

canvas.addEventListener('mousemove', (event) => {
  mouse.x = event.clientX - offsetX;
  mouse.y = event.clientY - offsetY;
});

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (const circle of circles) {
    circle.update(mouse);
  }

  requestAnimationFrame(animate);
}

animate();

zoomInBtn.addEventListener('click', () => {
  zoom += 0.1;
});

zoomOutBtn.addEventListener('click', () => {
  if (zoom > 0.2) {
    zoom -= 0.1;
  }
});

resetBtn.addEventListener('click', () => {
  offsetX = 0;
  offsetY = 0;
  zoom = 1;
  generateCircles();
});

window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  offsetX = canvas.width / 2;
  offsetY = canvas.height / 2;
});

canvas.addEventListener('mousedown', (event) => {
  canvas.style.cursor = 'grabbing';
  let startX = event.clientX;
  let startY = event.clientY;
  let startOffsetX = offsetX;
  let startOffsetY = offsetY;

  function move(event) {
    let deltaX = event.clientX - startX;
    let deltaY = event.clientY - startY;

    offsetX = startOffsetX + deltaX;
    offsetY = startOffsetY + deltaY;
  }

  function stop() {
    canvas.style.cursor = 'grab';
    canvas.removeEventListener('mousemove', move);
    canvas.removeEventListener('mouseup', stop);
  }

  canvas.addEventListener('mousemove', move);
  canvas.addEventListener('mouseup', stop);
});
