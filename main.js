async function genProj(){
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