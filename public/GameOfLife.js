import { Rand, Lerp } from './utils.js';

window.addEventListener('keydown', (event) => {
  if(event.key == ' ') event.preventDefault();
});


class Color{
  constructor(r = 255, g = 255, b = 255, a = 1){
    this.r = r
    this.g = g
    this.b = b
    this.a = a
  }

  static LerpColors(ColorA, ColorB, LerpValue){ 
    let r = Lerp(ColorA.r, ColorB.r, LerpValue);
    let g = Lerp(ColorA.g, ColorB.g, LerpValue);
    let b = Lerp(ColorA.b, ColorB.b, LerpValue);
    let a = Lerp(ColorA.a, ColorB.a, LerpValue);

    return new Color(r, g, b, a);
  }

  static Rand(){
    return new Color(Rand(0, 255), Rand(0, 255), Rand(0, 255), 1);
  }

  toString(){
    return `rgba(${this.r}, ${this.g}, ${this.b}, ${this.a})`;
  }
};


class Cell{
  constructor(id, position, size){
    this.id = id
    this.state = 0
    this.aliveNeighbors = 0
    this.color = new Color()

    this.body = document.createElement('div')
    this.body.style.width = `${size}px`
    this.body.style.height = `${size}px`
    this.body.style.gridColumn = `${position[0] + 1}`
    this.body.style.gridRow = `${position[1] + 1}`
    this.body.style.border = 'solid .5px black'

    this.body.addEventListener('click', () => {
      this.state = this.state == 1 ? 0 : 1
    })
  }
}


class Grid{
  constructor(width, height, cellSize){
    this.width = width
    this.height = height;
    this.cellSize = cellSize;
    this.pause = false;
    this.cells = [];
    this.gen = 0
    this.prev = Date.now()
    this.current
    this.elapsed
    this.lag = 0.0
    this.fps = 10
    this.fpsInt = 1000 / this.fps
    
    this.aliveColor = new Color(Rand(175, 255), Rand(170, 255), Rand(170, 255), .8)
    this.deadColor = new Color(Rand(0, 255), Rand(0, 255), Rand(0, 255), 1)

    this.body = document.createElement('div')
    this.body.style.display = 'grid'
    this.body.tabIndex = '0'
    this.body.style.width = `${this.width * this.cellSize}px`
    this.body.style.height = `${this.height * this.cellSize}px`
    this.body.style.gridTemplateColumns = `repeat(${this.width}, ${this.cellSize}px)`
    this.body.style.gridTemplateRows = `repeat(${this.height}, ${this.cellSize}px)`
    document.body.appendChild(this.body)

    document.addEventListener('keydown', (event) => {
      if(document.activeElement){
        if(event.key == 'r') this.Randomize()
        if(event.key == 'v') this.Clear()
        if(event.key == 'c') this.ColorChange()
        if(event.key == ' ') this.pause = !this.pause
      }
    })
    
    for(let col = 0; col < this.width; col++){
      for(let row = 0; row < this.height; row++){
        const cell = new Cell(this.cells.length, [col, row], this.cellSize)
        this.cells.push(cell)
        this.body.appendChild(cell.body)
      }
    }

    this.Logic()
    this.Randomize()
    this.MainLoop()
  }

  MainLoop(){
    this.current = Date.now()
    this.elapsed = this.current - this.prev
    this.prev = this.current
    this.lag += this.elapsed

    if(this.lag >= this.fpsInt){
      this.Logic()
      this.lag -= this.fpsInt
    }
    requestAnimationFrame(this.MainLoop.bind(this))
  }

  Logic(){
    this.CheckNeighbors()
    for(const cell of this.cells){
      if(this.gen % 40 == 0) this.ColorChange()
      if(!this.pause){
      if(cell.aliveNeighbors == 2){}
      else if(cell.aliveNeighbors == 3)
      {cell.state = 1} else(cell.state = 0)

      if(this.gen % 40 == 0) this.Randomize()
      }
      cell.color =
      Color.LerpColors(cell.color, cell.state == 0 ? this.deadColor : this.aliveColor, cell.state == 1 ? .25 : .5)
      cell.body.style.backgroundColor = cell.color.toString()
    }
    this.gen++
  }

  CheckNeighbors(){
    const top = -1
    const right = this.height 
    const bottom = 1
    const left = -this.height

    for(const cell of this.cells){
      cell.aliveNeighbors = 0
      const hasTop = cell.id % this.height != 0
      const hasRight = cell.id < (this.cells.length - this.height)
      const hasBottom = (cell.id + 1) % this.height != 0
      const hasLeft = cell.id > (this.height - 1)

      if(hasTop) cell.aliveNeighbors += this.cells[cell.id + top].state
      if(hasRight) cell.aliveNeighbors += this.cells[cell.id + right].state
      if(hasBottom) cell.aliveNeighbors += this.cells[cell.id + bottom].state
      if(hasLeft) cell.aliveNeighbors += this.cells[cell.id + left].state
      if(hasTop && hasRight) cell.aliveNeighbors += this.cells[cell.id + top + right].state
      if(hasTop && hasLeft) cell.aliveNeighbors += this.cells[cell.id + top + left].state
      if(hasBottom && hasRight) cell.aliveNeighbors += this.cells[cell.id + bottom + right].state
      if(hasBottom && hasLeft) cell.aliveNeighbors += this.cells[cell.id + bottom + left].state
    }
  }

  Randomize(){
    for(const cell of this.cells){
      cell.state = Rand(0, 100) > 50 ? 1 : 0
    }
  }

  Clear(){
    for(const cell of this.cells){
      cell.state = 0
    }
  }

  ColorChange(){
    this.aliveColor = new Color(Rand(175, 255), Rand(170, 255), Rand(170, 255), 1)
    this.deadColor = new Color(Rand(0, 100), Rand(0, 100), Rand(0, 100), 1)
  }
}

new Grid(Math.floor(window.innerWidth / 20), Math.floor(window.innerHeight / 20), 20);