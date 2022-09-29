const canvasSketch = require('canvas-sketch');
const { random } = require('canvas-sketch-util');
const Tweakpane = require('tweakpane');

const settings = {
  animate: true,
  dimensions: [ 1080, 1080 ]
};

const CONFIG = {
  SPEED: 1,
}

class Coordinate {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

class Node {
  constructor(position, color) {
    this.color = color;
    this.position = position;
    this.vector = new Coordinate(0.5, 0.5);
  }

  draw(context) {
    context.save();
    context.strokeStyle = this.color;
    context.translate(this.position.x, this.position.y);
    context.beginPath();
    context.arc(0, 0, 10, 0, Math.PI * 2);
    context.closePath();
    context.stroke();
    context.restore();
  }

  bounce(width, height) {
    if (this.position.x <= 0 || this.position.x >= width) this.vector.x *= -1;
    if (this.position.y <= 0 || this.position.y >= height) this.vector.y *= -1;
  }

  update() {
    this.position.x += this.vector.x * CONFIG.SPEED;
    this.position.y += this.vector.y * CONFIG.SPEED;
  }
}

const sketch = ({ context, width, height }) => {
  context.fillStyle = 'white';
  context.fillRect(0, 0, width, height);

  const nodes = [];
  for (let i = 0; i < 50; i++) {
    const color = i % 2
      ? 'rgba(200, 50, 50, 0.25)'
      : 'rgba(50, 50, 200, 0.25)';
    const x = random.range(0, width);
    const y = random.range(0, height);
    const position = new Coordinate(x, y);
    const node = new Node(position, color);
    nodes.push(node);
  }

  return ({ context, width, height }) => {
    nodes.forEach((node) => {
      node.bounce(width, height);
      node.update();
      node.draw(context);
    });
  };
};

const createPane = () => {
  const pane = new Tweakpane.Pane();

  const folder = pane.addFolder({ title: 'OPTIONS' });
  folder.addInput(CONFIG, 'SPEED', { min: 0.25, max: 5, step: 0.25 });
};

createPane();

canvasSketch(sketch, settings);
