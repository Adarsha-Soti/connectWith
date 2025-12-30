let cardContainer=document.getElementById("cardContainer");
let createUser= document.getElementById("createUser");
let formContainer =document.getElementById("formContainer");
const userForm= document.getElementById("userForm");
const closeBtn = document.getElementById("closeBtn");
let cardvalue=[];

createUser.addEventListener('click',(e)=>{
    e.preventDefault();
    createUser.addEventListener('click', () => {
        formContainer.style.display = "flex"; 
     });

     closeBtn.addEventListener('click', () => {
        formContainer.style.display = "none";
    });
    formContainer.style.display = (formContainer.style.display === "none") ? "block" : "none";
 });  

const fetchData=async()=>{
    try{
   let response= await fetch("http://localhost:4000/api/v1/users");
   result=await response.json();
    cardvalue=result.data;
    console.log(cardvalue);
        cardContainer.innerHTML="";
    cardvalue.forEach(items=>{
        cardContainer.innerHTML+=`<div class=" col-md-6 col-lg-4 mb-3">
                                    <div class="card h-100">
                                        <div class="row g-0 text-start">
                                            <div class="col-5">
                                                <img src="${items.img}" 
                                                    id="image" class="img-fluid rounded-start h-100" 
                                                    alt="user">
                                            </div>
                                            <div class="col-7">
                                                <div class="card-body h-100">
                                                    <h5 class="card-title">${items.title} </h5>
                                                    <p class="card-text">${items.description}</p>
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
userForm.addEventListener('submit',async(e)=>{
    e.preventDefault();

    const newUserData={
        title:document.getElementById('title').value,
        email:document.getElementById('email').value,
        img:document.getElementById("img").value,
        description: document.getElementById("description").value

    }
    try{
        const response=await fetch(('http://localhost:4000/api/v1/users'),{
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body: JSON.stringify(newUserData)
        })
        const result=await response.json();
        if (result.status==="success"){
            fetchData();
            userForm.reset();
            formContainer.style.display="none";
        }
        else {
            alert("there was a problem creating the user");
        }
    }catch(error){
        console("error posting data", error);
    };

});
    

   

