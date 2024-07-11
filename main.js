async function genProj(){
    updateSize();
    let projects = (await (await fetch('projects.json')).json()).projects
    projects.forEach(element => {
        let div = document.createElement("div")
        let h1 = document.createElement("h1")

        h1.innerText = element.name
        div.style.backgroundImage = `url("${element.img}")`
        div.setAttribute("onclick",`window.location.href='${element.url}'`)

        div.appendChild(h1)

        document.getElementById("projects").appendChild(div)
    });
}

function updateSize(){
    let fnum = Math.min(Math.ceil(window.innerWidth/100),8)
    let size = 3.8/fnum
    document.body.style.setProperty("--flexnum", fnum)
    document.body.style.setProperty("--size", `${size}vw`)
    if (size*110 + 0.6 > 90){
        document.body.classList.add("mobile")
    } else {
        document.body.classList.remove("mobile")
    }
    console.log(size)
}

window.onload = genProj;
window.onresize = updateSize;