document.addEventListener("DOMContentLoaded", function (e) {

  const dogDiv = document.getElementById("dog-bar")
  const dogInfo = document.getElementById("dog-info")
  const dogBtn = document.querySelector("#dog-summary-container")
  const goodBtn = document.querySelector("#good-dog-filter")

  function dogInterp(pup){
    if (pup.isGoodDog === true) {
      return "Good Dog!"
    }
    else {
      return "Bad Dog!"
    }
  }

  fetch("http://localhost:3000/pups")
  .then(res => res.json())
  .then(function(json) {
    json.forEach(function(el) {
      const span = document.createElement("span")
      span.innerHTML = `${el.name}`
      dogDiv.appendChild(span)
    })
  })

  document.addEventListener("click", function(e) {
    if (e.target.nodeName === "SPAN") {
      dogInfo.innerHTML = ""
      fetch("http://localhost:3000/pups")
      .then(res => res.json())
      .then(function(json){
        var puppy = json.find(function(el) {
          return el.name === e.target.innerHTML
        })
        dogInfo.dataset.id = puppy.id

        const h2 = document.createElement("h2")
        h2.innerHTML = `${puppy.name}`
        dogInfo.appendChild(h2)

        const img = document.createElement("img")
        img.src = `${puppy.image}`
        dogInfo.appendChild(img)

        const btn = document.createElement("button")
        btn.id = "boy-status"
        btn.innerHTML = dogInterp(puppy)
        dogInfo.appendChild(btn)
      })

    }
  })

  dogBtn.addEventListener("click", function(e){
    if (e.target.id === "boy-status"){
      let status
      if (e.target.innerHTML === "Good Dog!"){
        status = {isGoodDog: false}
      } else {
        status = {isGoodDog: true}
      }

      e.preventDefault()

      fetch(`http://localhost:3000/pups/${e.target.parentElement.dataset.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify(status)
      })
      .then(function(response){
        return response.json()
      })
      .then(function(json){
        console.log(json)
        const btn = document.getElementById("boy-status")
        btn.innerHTML = dogInterp(json)
      })
    }
  })

  goodBtn.addEventListener("click", function(e){
    if (e.target.innerHTML === "Filter good dogs: OFF"){
      e.target.innerHTML = "Filter good dogs: ON"

      fetch("http://localhost:3000/pups")
      .then(res => res.json())
      .then(function(json){
        dogDiv.innerHTML = ""
        json.forEach(function(el) {
          if (el.isGoodDog === true) {
            const span = document.createElement("span")
            span.innerHTML = `${el.name}`
            dogDiv.appendChild(span)
          }
        })
      })
    } else {
      e.target.innerHTML = "Filter good dogs: OFF"

      fetch("http://localhost:3000/pups")
      .then(res => res.json())
      .then(function(json){
        dogDiv.innerHTML = ""
        json.forEach(function(el) {
          const span = document.createElement("span")
          span.innerHTML = `${el.name}`
          dogDiv.appendChild(span)
        })
      })
    }

  })



});
