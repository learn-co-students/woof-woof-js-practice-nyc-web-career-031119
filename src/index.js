const DOG_URL = "http://localhost:3000/pups"

document.addEventListener('DOMContentLoaded',function(){
  const dogContainer = document.querySelector("#dog-bar")
  const infoContainer = document.querySelector("#dog-info")
  const goodDogFilter = document.getElementById('filter-div')
  // const dogContain = document.getElementById('dog-bar')
  let alldogs = [];
  let dog_id = ''



  runDogs()
  function runDogs(){
    fetch(DOG_URL)
    .then(function(res){
      return res.json()
    })
    .then(function(dogs){
      // debugger
      renderDogs(dogs)
      // renderFilter()
      alldogs.push(dogs);
    })
  }

  // **************************************************************************
  //Event Listeners
  // **************************************************************************
dogContainer.addEventListener('click',function(e) {
  const dog_class = e.target.className
  dog_id = parseInt(e.target.dataset.id)

  // debugger
  if (dog_class === "dogClass"){
    // debugger
    fetch(`${DOG_URL}/${dog_id}`)
    .then(function(res){
      return res.json()
    })
    .then(function(dog){
      renderDogInfo(dog)
    })
  }
})

//Listens for button to change good dog to bad and bad to good
infoContainer.addEventListener('click', e=>{
  const goodnessBtn = e.target.className
  if (goodnessBtn === 'goodness-Btn'){
  let isGoodDog = e.target.dataset.id

    if (isGoodDog === 'true'){
      isGoodDog = true
    }else{
        isGoodDog = false
    }
    // debugger
    fetch(`${DOG_URL}/${dog_id}`,{
      method:'PATCH',
      headers:{
        "Content-Type": "application/json",
        "Accpet": "application/json"
      },
      body: JSON.stringify({
        isGoodDog: !isGoodDog
      })
    })
    .then(function(res){
      return res.json()
    })
    .then(function(dog){
      renderDogInfo(dog)

      //repopulates the dogcontainer with only good dogs / kills the bad
      if(goodDogFilter.innerText === "Filter good dogs: ON"){
        dogFilter()
      }

    })
  }
})


//Good Dog Filter Button Listener
goodDogFilter.addEventListener('click',function(e){
  let filterButton = e.target
  if (filterButton.id === "good-dog-filter"){
    const isOn = "Filter good dogs: ON"
    const isOff = "Filter good dogs: OFF"

    if (filterButton.innerText === isOff){
      filterButton.innerText = isOn

      dogFilter()



    }else if(filterButton.innerText === isOn){

      filterButton.innerText = isOff
      runDogs()

    }
  }

})


// **************************************************************************
//Helper functions
// **************************************************************************



function dogFilter(){
  // debugger
  fetch(DOG_URL)
  .then(function(res){
    return res.json()
  })
  .then(function(dogs){
    // debugger
    renderGoodDogs(dogs)
    // debugger

  })
}





function renderGoodDogs(dogs){
  dogContainer.innerHTML = ''
  dogs.forEach(function(dog){
    // debugger
    if (dog.isGoodDog === true){
      dogContainer.innerHTML += `
      <span class="dogClass" data-id=${dog.id}>${dog.name}</span>
      `
    }
  })
}
// renderDogs
function renderDogs(dogs){
  dogContainer.innerHTML = ''
  dogs.forEach(function(dog){
    // debugger
    dogContainer.innerHTML += `
    <span class="dogClass" data-id=${dog.id}>${dog.name}</span>
    `
  })
}

function renderDogInfo(dog){
  infoContainer.innerHTML =`
  <img src=${dog.image}> <h2>${dog.name}</h2> <button data-id=${dog.isGoodDog} class='goodness-Btn'>${(dog.isGoodDog === true ? "Good Dog!" : "Bad Dog!")}</button>
  `
}



})//end of DOMContentLoaded
