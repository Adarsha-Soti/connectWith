let cardContainer = document.getElementById("cardContainer");
let createUser = document.getElementById("createUser");
let formContainer = document.getElementById("formContainer");
const userForm = document.getElementById("userForm");
let cardvalue = [];
let currentEditId = null;//value will be asigned in edit user
const originalFormHTML = userForm.innerHTML;

//point to be noted:single form is used for edit ass well as create

createUser.addEventListener('click', (e) => {
    e.preventDefault();
    currentEditId = null;//because of creating user not editing 
    userForm.innerHTML = originalFormHTML;//saving inner html of form globally,coz it gave issue
    userForm.querySelector('h3').innerText = "Add New User";
    userForm.reset();
    formContainer.style.display = "flex";
});
//hide the form
formContainer.addEventListener('click', (e) => {
    if (e.target == formContainer) {
        formContainer.style.display = "none";
    }
});
//to show card 
const fetchData = async () => {
    try {
        let response = await fetch("http://localhost:4000/api/v1/users");
        let result = await response.json();
        cardvalue = result.data;//data asigned ot card value array globally
        cardContainer.innerHTML = "";
        cardvalue.forEach(items => {
            //here clickUser in line 36, opens two options edit and delete,edit use same form of create just data changed
            cardContainer.innerHTML += `
                <div class="col-md-6 col-lg-4 mb-3">
                    <div onclick="clickedUser('${items._id}')" class="card" style="height:200px; cursor:pointer">
                        <div class="row g-0 text-start">
                            <div class="col-5">
                                <img src="${items.img}" class="img-fluid rounded-start" style="height:200px; object-fit:cover">
                            </div>
                            <div class="col-7">
                                <div class="card-body">
                                    <h5 class="card-title">${items.title}</h5>
                                    <p class="card-text small">${items.description}</p>
                                    <p class="card-text fw-bolder small">${items.email}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>`;
        });
    } catch (error) {
        console.error("error fetching data", error);
    }
}
fetchData();//function call fetching cards 

//card id  is passed form clicking event and stored in targetuserid
const clickedUser = (targetUserId) => {
    formContainer.style.display = "flex";//opens the formcard,not exactly form tho
    userForm.innerHTML = `
        <div class="text-center p-3">
            <h5>Select Operation</h5>
            <button id="editChoice" class="btn btn-primary me-2">Edit</button>
            <button id="deleteChoice" class="btn btn-danger">Delete</button>
        </div>`;
//when button is clicked card id  is assigned to respective functions:line 64& 65
    document.getElementById("editChoice").onclick = () => userEdit(targetUserId);
    document.getElementById("deleteChoice").onclick = () => deleteUser(targetUserId);
}
//this function will take cardid,opens editform and fills details there
const userEdit = (targetUserId) => {
    currentEditId = targetUserId;//this send card id to global currentEditid which was null
    let user = cardvalue.find((item) => item._id == targetUserId);
    userForm.innerHTML = originalFormHTML;
    userForm.querySelector('h3').innerText = "Edit User";

    document.getElementById('title').value = user.title;
    document.getElementById('email').value = user.email;
    document.getElementById('img').value = user.img;
    document.getElementById('description').value = user.description;
}

userForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const newUserData = { //either its edit or create data is taken from form
        title: document.getElementById('title').value,
        email: document.getElementById('email').value,
        img: document.getElementById("img").value,
        description: document.getElementById("description").value
    };
//here if currentedituesrid has value send form line 73,then do patch if null do post user
    const isEditing = currentEditId !== null;
    const url = isEditing ? `http://localhost:4000/api/v1/users/${currentEditId}` : "http://localhost:4000/api/v1/users";
    const method = isEditing ? "PATCH" : "POST";

    try {
        const response = await fetch(url, { //simple feching url post||patch
            method: method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newUserData)
        });
        const result = await response.json();
        if (result.status === "success") {
            fetchData();//show data to cards refress fetching
            formContainer.style.display = "none";//closes the form
            currentEditId = null;//if it was  editing will chnage editid null for future
        }
    } catch (error) {
        console.error("error submitting form", error);
    }
});

//value of id is given by line 69 (noice), targeteduserId
const deleteUser = async (id) => {
    if (confirm("Delete this user?")) {
        try {
            const response = await fetch(`http://localhost:4000/api/v1/users/${id}`, { method: "DELETE" });
            if (response.ok) {
                fetchData();
                formContainer.style.display = "none";
            }
        } catch (error) {
            console.error(error);
        }
    }
}