if (process.argv[2] == "-h"){
  help()
}
function help(){
  console.log("\nusage:\nnode zoomgraph.js [image file]\n-w  draws white last, usually recommended\n-v  displays debug info\n-s #  defines the line width as #, 2 is default (zoom line widths: 1, 2, 4, 6)\n-d #  sets the delay after releasing/pressing the mouse as #, default is 5 (use when lines are not drawn or at the wrong place)\n-h  show this dialog\n\nexample: node rick.js bob.png -w -s 1\n\nafter the program starts it will prompt you to first put your mouse on the button that will change the color, put it as close to the centre as you can. then put your mouse where you want the top left corner to be. as a failsafe you can quickly swipe your mouse to the right to abort\n")
  process.exit(0)
}
var r,Image;
try {
  r = require("robotjs")
  Image = require('image-js').Image
} catch(err){
  console.log("this requires \x1b[36mrobotjs\x1b[0m and \x1b[36mimage-js\x1b[0m to run.\ninstall them using\n\u001b[33mnpm i robotjs\nnpm i image-js\u001b[0m")
  process.exit(0)
}


const colors = [[255,255,255],[252,31,40],[254,220,71],[132,196,136],[53,143,251],[179,125,252],[252,65,197],[253,138,37],[80,212,50],[88,216,233],[0,0,0],[125,3,8],[118,68,18],[20,113,44],[26,83,192]]

var startpos
var colorpos

var spacing = 2
var delay = 5
var whitelast = false
var file = "img.jpg"
var verbose = false
if (process.argv.length >= 3){
  file = process.argv[2]
} else {
  help()
}

for (let i = 2; i < process.argv.length; i ++){
  if (process.argv[i] == "-w"){
    whitelast = true
  }
  if (process.argv[i] == "-v"){
    verbose = true
  }
  if (process.argv[i] == "-s" && i + 1 < process.argv.length){
    spacing = parseInt(process.argv[i+1])
  }
  if (process.argv[i] == "-d" && i + 1 < process.argv.length){
    delay = parseInt(process.argv[i+1])
  }
}
if (verbose){
  console.log("file: \x1b[36m"+file+"\x1b[0m\nwhitelast: \x1b[36m"+whitelast+"\x1b[0m\nspacing: \x1b[36m"+spacing+"\x1b[0m\ndelay: \x1b[36m"+delay+" ms\x1b[0m")
}
console.log("place your mouse on the color in 3s!")

setTimeout(async function() {
  colorpos = r.getMousePos()
  if (verbose){console.log("startpos: ", colorpos);}
  console.log("place your mouse on the start in 3s!")
  setTimeout(()=>{
    startpos = r.getMousePos()
    if (verbose){console.log("startpos: ", startpos);}
    draw()
  },3000)
},3000)

async function draw() {
  let colstats = []
  let colstatscopy = []
  let sortedcolors = []
  let sorted = []
  const img = await Image.load(file)
  let width = img.width
  let height = img.height
  for (let i = 0; i < colors.length; i ++){
    colstats.push(0)
    colstatscopy.push(0)
  }
  for (let y = 0; y < height; y ++){
    for (let x = 0; x < width; x ++){
      let closest  = colordiff([0,0,0],[255,255,255]);
      let closestI = -1
      if (img.getPixelXY(x,y).length < 4 || img.getPixelXY(x,y)[3]){
        for (let color = 0; color < colors.length; color ++){
          let diff = colordiff(img.getPixelXY(x,y),colors[color])
          if (diff < closest){
            closest = diff
            closestI = color
          }
        }
      }
      sorted.push(closestI)
      colstats[closestI] ++
      colstatscopy[closestI] ++
    }
  }
  if (whitelast) {
    colstatscopy[0] = -1
  }
  for (let i = 0; i < colors.length; i ++){
    let bigI = colstatscopy.indexOf(Math.max(...colstatscopy));
    sortedcolors.push(bigI)
    colstatscopy[bigI] = -2
  }
  if (verbose){console.log(img,colstats)}
  for (let index = 0; index < colors.length; index ++){
    if (colstats[sortedcolors[index]] == 0){continue;}
    var color = sortedcolors[index]
    await selectcol(color)
    for (let y = 0; y < height; y ++){
      let mousedown = false
      if (r.getMousePos().x>(startpos.x+width*spacing+10)){
        console.log("\u001b[31mterminated\u001b[0m")
        process.exit()
      }
      for (let x = 0; x < width; x ++){
        if (sorted[y*width + x] == color){
          if (!mousedown){
            r.moveMouse(x*spacing + startpos.x, y*spacing + startpos.y)
            r.mouseToggle("down", "left")
            mousedown = true
            await sleep(delay)
          }
        } else {
          if (mousedown){
            r.moveMouse(x*spacing + startpos.x, y*spacing + startpos.y)
            r.mouseToggle("up", "left")
            mousedown = false
            await sleep(delay)
          }
        }
      }
      if (mousedown){
        r.moveMouse(width*spacing + startpos.x, y*spacing + startpos.y)
        r.mouseToggle("up", "left")
        mousedown = false
        await sleep(delay)
      }
  }
  }
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function selectcol(c){
  r.mouseToggle("up", "left")
  await sleep(50)
  r.moveMouse(colorpos.x,colorpos.y)
  await sleep(50)
  r.mouseClick("left")
  await sleep(50)
  r.moveMouse(colorpos.x-64 + (c%5)*32,colorpos.y+50 + Math.floor(c/5)*32)
  await sleep(50)
  r.mouseClick("left")
  await sleep(50)
  r.mouseClick("left")
  await sleep(50)
  r.moveMouse(startpos.x,startpos.y)
}

function colordiff(a,a2){
  let dR = (a[0]-a2[0])**2
  let dG = (a[1]-a2[1])**2
  let dB = (a[2]-a2[2])**2
  return (dR + dG + dB)
}
