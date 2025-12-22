let cardContainer=document.getElementById("cardContainer");
let cardvalue=[];
const fetchData=async()=>{
    try{
   let response= await fetch("https://randomuser.me/api/?results=10");
   data=await response.json();
    cardvalue=data.results;
    console.log(cardvalue);

    cardvalue.forEach(items=>{
        cardContainer.innerHTML+=`<div class=" col-md-6 col-lg-4 mb-3">
                                    <div class="card h-100">
                                        <div class="row g-0 text-start">
                                            <div class="col-5">
                                                <img src="${items.picture.large}" 
                                                    id="image" class="img-fluid rounded-start h-100" 
                                                    alt="user">
                                            </div>
                                            <div class="col-7">
                                                <div class="card-body h-100">
                                                    <h5 class="card-title">${items.name.first} ${items.name.last}</h5>
                                                    <p class="card-text">On his way out, a station wagon pulled in. There was a roofrack on top</p>
                                                    <p class="card-text fw-bolder">${items.email}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>`;
    })
    }catch(error){
    console.log("error fetching data")
    }
}
fetchData();

   

