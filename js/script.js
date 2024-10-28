// Get Category name form API 
const getCategory = async () => {
    fetch('https://openapi.programming-hero.com/api/peddy/categories')
      .then(response => response.json())
      .then(json => loadCategory(json.categories))
}
getCategory()

// display category name in UI 
const loadCategory = (category) => {
    const categoryContainer = document.getElementById('buttonContainer')
    category.forEach(name => {
        const btn = document.createElement('button');
        btn.innerHTML = `
        <button id="btn-${name.category}" onclick="loadCategoryVideos('${name.category}')" class="border rounded-md py-5 px-12 lg:px-16 font-semibold text-xl flex justify-center items-center gap-3 petCategoryBtn"><img class="w-10 h-10" src="${name.category_icon}"/> ${name.category}</button>
        `
        categoryContainer.append(btn)           
    });    
}

// load all pets
const loadAllPets = async () => {
    const url = ('https://openapi.programming-hero.com/api/peddy/pets')
    const res = await fetch(url)
    const data = await res.json()
    displayPets(data.pets); 
}
loadAllPets()

// display All Pets in UI 
const displayPets = async (pets) => {
    const petCardContainer = document.getElementById('petCardContainer');
    petCardContainer.innerHTML = '';
    petCardContainer.classList.remove("grid")
    if (pets.length === 0) {
        petCardContainer.innerHTML = `
        <div class="w-full mx-auto justify-center mt-10">
        <img class="w-52 mx-auto pb-5" src="./assets/error.webp"/>
        <h1 class="font-bold text-3xl text-center text-red-600">NO PETS AVAILABLE <br> IN THIS CATEGORY</h1>
        </div>
        `
    } else {
        petCardContainer.classList.add("grid")
    }
    pets.forEach(pet => {
        const div = document.createElement('div')
        div.innerHTML = `
        <div class="card bg-base-100 border">
                        <figure class="px-5 pt-5">
                          <img
                            src="${pet.image}"
                            class="rounded-xl w-full object-cover h-48" />
                        </figure>
                        <div class="card-body px-5 pt-5 pb-3">                         
                            <div class="border-b pb-2">
                            <h2 class="card-title">${pet.pet_name}</h2>
                            <p>Breed: ${pet.breed?pet.breed:'N/A'}</p>
                            <p>Birth: ${pet.date_of_birth?pet.date_of_birth:'N/A'}</p>
                            <p>Gender: ${pet.gender?pet.gender:'N/A'}</p>
                            <p>Price: ${pet.price?pet.price:'Stock Out'}$</p>
                          </div>
                          <div class="justify-between flex pt-1">
                            <button class="py-1 px-3 border rounded-lg"><i class="fa-regular fa-thumbs-up"></i></button>
                            <button class="py-1 px-3 border rounded-lg text-[#0E7A81] font-semibold">Adopt</button>
                            <button onclick="loadDetails('${pet.petId}')" class="py-1 px-3 border rounded-lg text-[#0E7A81] font-semibold">Details</button>
                          </div>                           
                        </div>
                    </div>
        `
        petCardContainer.append(div)
    })
}

// show pets category wise 
const loadCategoryVideos = async(id)=>{
    const url = (`https://openapi.programming-hero.com/api/peddy/category/${id}`)
    const res = await fetch(url)
    const data = await res.json()
    loadSpiner(`btn-${id}`)
    displayPets(data.data);
    removeActive()
    const btnid = document.getElementById(`btn-${id}`);
    btnid.classList.add("active")
    
}

// show active button in categories
const removeActive = ()=>{
    const buttons = document.getElementsByClassName('petCategoryBtn');
    for (let btn of buttons) {
        btn.classList.remove('active')
    }
}

// load pets details
const loadDetails = async (petId) => {
    const url = (`https://openapi.programming-hero.com/api/peddy/pet/${petId}`)
    const res = await fetch(url)
    const data = await res.json()
    showDetails(data.petData);
}


// show details in modal
const showDetails = (pet)=>{
    const modalContainer = document.getElementById('modalContent');
    modalContainer.innerHTML = `
    <div class="card-body px-5 pt-5 pb-3">
                            <img src="${pet.image}" class="rounded-xl w-full object-cover h-52" />
                            <h2 class="card-title">${pet.pet_name?pet.pet_name:'N/A'}</h2>
                            <div class="flex justify-between border-b pb-3">
                                <div>
                                    <p>Breed: ${pet.breed?pet.breed:'N/A'}</p>
                                    <p>Gender: ${pet.gender?pet.gender:'N/A'}</p>
                                    <p>Vaccinated Status: ${pet.vaccinated_status?pet.vaccinated_status:'Not Yet'}</p>
                                </div>
                                <div>
                                    <p>Birth: ${pet.date_of_birth?pet.date_of_birth:'N/A'}</p>
                                    <p>Price: ${pet.price?pet.price:'N/A'}$</p>
                                </div>
                            </div>
                            <p class="mt-3">Details:${pet.pet_details?pet.pet_details:'N/A'}</p>
                        </div>
    
                        <div class="modal-action">
                            <form method="dialog" class="w-full px-5 mb-5">
                                <button
                                    class="btn btn-block bg-teal-50 border-none hover:bg-teal-100 text-teal-900 text-xl font-semibold px-5">Cancel</button>
                            </form>
                        </div>
    `
    document.getElementById('showModalData').click();
}


// load spiner 
const makeSpiner = () => {
    document.getElementById('loadSpan').classList.add('hidden')
}
const loadSpiner = (id) => {
    document.getElementById('loadSpan').classList.remove('hidden')
    document.getElementById('petsSection').style.display = 'none';
    setTimeout(() => {
        makeSpiner()
        document.getElementById('petsSection').style.display = 'block';
    }, 2000);
}

// Sort By Price
let sortDescending = true;
const sortPetsByPrice = async () => {
    const url = 'https://openapi.programming-hero.com/api/peddy/pets';
    const res = await fetch(url);
    const data = await res.json();
    const sortedPets = data.pets.sort((a, b) => sortDescending ? b.price - a.price : a.price - b.price);
    sortDescending = !sortDescending;
    displayPets(sortedPets);
}
document.getElementById('sortByPrice').addEventListener('click', sortPetsByPrice);
