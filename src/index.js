document.addEventListener("DOMContentLoaded", function() {
  const PUPS_URL = 'http://localhost:3000/pups';
  const dogBar = document.getElementById('dog-bar');
  const filterDiv = document.getElementById('filter-div');
  const infoDiv = document.querySelector("#dog-info");
  let puppies = [];
  let goodPuppies = [];

  function fetchDogs(url) {
    fetch(url)
    .then(res => res.json())
    .then(json => {
      puppies = [];
      goodPuppies = [];
      json.forEach(dog => {
        puppies.push(dog);
        if (dog.isGoodDog) {
          goodPuppies.push(dog)
        }
        let filterButton = document.getElementById("good-dog-filter");
        if (filterButton.dataset.filter === "on") {
          renderDogs(goodPuppies);
        } else {
          renderDogs(puppies);
        }
      })
    })
    .catch(error => {
      alert(error.message);
      console.log(error.message);
    })
  }

  function renderDogs(json) {
    dogBar.innerHTML = "";
    json.forEach(dog => {
      const dogSpan = document.createElement('span');
      dogSpan.dataset.dogId = `${dog.id}`
      dogSpan.textContent = `${dog.name}`
      dogSpan.dataset.isGood = `${dog.isGoodDog}`
      dogSpan.dataset.pic = `${dog.image}`
      dogBar.appendChild(dogSpan);
    })
  }

  function renderInfo(dog) {
    infoDiv.innerHTML = "";
    let btnText = "";
    btnText = dog.isGoodDog === true ? "Good Dog!" : "Bad Dog!"
    infoDiv.innerHTML = `
      <img src=${dog.image} />
      <h1>${dog.name}</h1>
      <button data-good="${dog.isGoodDog}" data-dog-id="${dog.id}">${btnText}</button>
    `;
  }

  const submitData = function(dogStatus, dogId) {
    let formData = {
      isGoodDog: dogStatus
    }

    let configObj = {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify(formData)
    }

      fetch(PUPS_URL + `/${dogId}`, configObj)
        .then(res => res.json())
        .then(dog => {
          console.log(dog, "has been updated")
        })
        .catch(error => {
          alert(error.message);
          console.log(error.message);
        })
  }


  fetchDogs(PUPS_URL);


  // let filteredDogs = function(dogs) {
  //   return dogs.filter(function(dog) {
  //     return dog.isGoodDog === true;
  //   });
  // }

  filterDiv.addEventListener('click', function(e) {
    if (e.target.id === "good-dog-filter" && e.target.dataset.filter === "off") {
      e.target.dataset.filter = "on"
      e.target.textContent = "Filter good dogs: ON"
      fetchDogs(PUPS_URL);
    } else if (e.target.id === "good-dog-filter" && e.target.dataset.filter === "on") {
      e.target.dataset.filter = "off"
      e.target.textContent = "Filter good dogs: OFF"
      fetchDogs(PUPS_URL);
    }
  });

  dogBar.addEventListener('click', function(e) {
    if (e.target.hasAttribute("data-dog-id")) {
      let clickedDog = puppies.find(function(puppy) {
        return e.target.dataset.dogId === puppy.id.toString();
      });
      renderInfo(clickedDog);
    }
  });

  infoDiv.addEventListener('click', function(e) {
    if (e.target.hasAttribute("data-good")) {
      let status = e.target.dataset.good
      if (status === "true") {
        let newStatus = false;
        e.target.dataset.good = 'false';
        e.target.textContent = "Bad Dog!";
        submitData(newStatus, parseInt(e.target.dataset.dogId))
        fetchDogs(PUPS_URL);
      } else if (status === "false") {
        let newStatus = true;
        e.target.dataset.good = "true";
        e.target.textContent = "Good Dog!";
        submitData(newStatus, parseInt(e.target.dataset.dogId))
        fetchDogs(PUPS_URL);
      }
    }
  });
});
