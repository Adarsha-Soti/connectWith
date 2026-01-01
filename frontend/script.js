let cardContainer=document.getElementById("cardContainer");
let createUser= document.getElementById("createUser");
let formContainer =document.getElementById("formContainer");
const userForm= document.getElementById("userForm");
const closeBtn = document.getElementById("closeBtn");
let cardvalue=[];
let currentEditId= null;

createUser.addEventListener('click',(e)=>{
    e.preventDefault();
    formContainer.style.display = "flex"; 
});   

closeBtn.addEventListener('click', () => {
formContainer.style.display = "none";
userForm(reset);
});
formContainer.addEventListener('click',(e)=>{
    if(e.target==formContainer){
        formContainer.style.display="none";
    }
})


const fetchData=async()=>{
    try{
   let response= await fetch("http://localhost:4000/api/v1/users");
   result=await response.json();
    cardvalue=result.data;
        cardContainer.innerHTML="";
    cardvalue.forEach(items=>{
        cardContainer.innerHTML+=`<div  class=" col-md-6 col-lg-4 mb-3">
                                    <div onclick="userEdit('${items._id}')" class="card h-100">
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

const userEdit=(targetUserId)=>{
    let clickedUser=cardvalue.find((item)=>item._id==targetUserId);

   if(clickedUser){
   currentEditId=targetUserId;
    
    formContainer.style.display="flex";
    userForm.querySelector('h3').innerText="Edit User";

    document.getElementById('title').value=clickedUser.title;
    document.getElementById('email').value=clickedUser.email;
    document.getElementById('img').value=clickedUser.img;
    document.getElementById('description').value=clickedUser.description;
   }else return;   
}

userForm.addEventListener('submit',async(e)=>{
    e.preventDefault();

    const newUserData={
        title:document.getElementById('title').value,
        email:document.getElementById('email').value,
        img:document.getElementById("img").value,
        description: document.getElementById("description").value

    }
    const isEditing=currentEditId!==null;
    const urlMethod=isEditing?"PATCH":"POST";
    const url=isEditing?`http://localhost:4000/api/v1/users/${currentEditId}`:"http://localhost:4000/api/v1/users"
    try{
        const response=await fetch((url),{
            method:urlMethod,
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
            currentEditId=null;
            userForm.querySelector('h3').innerText="Add New User";
        }
        else {
            alert("there was a problem creating the user");
            userForm.reset();
        }
    }catch(error){
        console("error posting data", error);
    };

});

    

   

