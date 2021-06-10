
const rootStyle = document.documentElement.style
const cookies = document.cookie.split('; ')
var stylea = cookies.find(row => row.startsWith('style--a='))
var stylem = cookies.find(row => row.startsWith('style--m='))
var stylet = cookies.find(row => row.startsWith('style--t='))
var stylet2 = cookies.find(row => row.startsWith('style--t2='))

var specialStyle = cookies.find(row => row.startsWith('specialStyle='));
if (specialStyle != undefined){
  specialStyle = parseInt(specialStyle.split('=')[1])
} else {
  specialStyle = 0
}
if (stylea != undefined){
  rootStyle.setProperty("--a",stylea.split('=')[1])
}
if (stylem != undefined){
  rootStyle.setProperty("--m",stylem.split('=')[1])
}
if (stylet != undefined){
  rootStyle.setProperty("--t",stylet.split('=')[1])
  if(getBrightness(stylet.split('=')[1]) > 0.5){
   rootStyle.setProperty("--pkgBG","#111")
  }
}
if (stylet2 != undefined){
  rootStyle.setProperty("--t2",stylet2.split('=')[1])
}

function getBrightness(hex) {
  if (hex.length == 4){
    return (parseInt(hex[1],16) + parseInt(hex[2],16) + parseInt(hex[3],16))/45
  }
  return (parseInt(hex[1] + hex[2],16) + parseInt(hex[3]+hex[4],16) + parseInt(hex[5]+hex[6],16))/90
}


if (specialStyle == 2){
  rootStyle.setProperty("--a",`hsl(${Math.random()*360},100%,50%)`)
}
window.setInterval(() => {
  if (specialStyle == 1){
    rootStyle.setProperty("--a",`hsl(${Date.now()/100%360},100%,50%)`)
  }
  if (specialStyle == 3) {
    rootStyle.setProperty("--bruh","url("+document.getElementById('bruh').value+")")
  }
},20)

async function setStyle(style){
  let colorinp = document.getElementById('colorinp')
  colorinp.children[0].value = ""
  colorinp.children[0].placeholder = "#"+Math.floor(Math.random()*16777215).toString(16)
  colorinp.style.display = "block"
  colorinp.children[1].onclick = ()=>{
    let col = document.getElementById('colorinp').children[0].value
    if (col[0]!="#"){col = "#"+col}
    if(col.length != 4 && col.length != 7){return}
    document.cookie = "style"+style+"="+col+";path=/"
    rootStyle.setProperty(style,col)
    if (style=="--t"){
      stylet = "style--t="+col
    } else if (style=="--a" && specialStyle == 1){
      specialStyle = 0
    }
  }
}
async function setSpecialStyle(id) {
  document.cookie = "specialStyle="+id+";path=/"
  specialStyle = id
  if (id == 0) {
    document.cookie = "specialStyle=0;path=/"
    location.reload()
    return
  }
  if (id == 2) {
    rootStyle.setProperty("--a",`hsl(${Math.random()*360},100%,50%)`)
  }
}
async function setTheme(id) {
  if (id == 0){
    document.cookie = "style--m=;path=/"
    document.cookie = "style--a=;path=/"
    document.cookie = "style--t=;path=/"
    document.cookie = "style--t2=;path=/"
    document.cookie = "specialStyle=0;path=/"
    location.reload()
    return
  }
  document.cookie = "specialStyle=0;path=/"
  specialStyle = 0
  if (id == 1){
    setStyles(["#111","#07def2","#fff","#fff"])
  }
  if (id == 2){
    setStyles(["#111","#f2b807","#fff","#fff"])
  }
}
function setStyles(arrc){
  document.cookie = "style--m=" +arrc[0]+";path=/"
  document.cookie = "style--a=" +arrc[1]+";path=/"
  document.cookie = "style--t=" +arrc[2]+";path=/"
  document.cookie = "style--t2="+arrc[3]+";path=/"
  rootStyle.setProperty("--m" ,arrc[0])
  rootStyle.setProperty("--a" ,arrc[1])
  rootStyle.setProperty("--t" ,arrc[2])
  rootStyle.setProperty("--t2",arrc[3])
}
