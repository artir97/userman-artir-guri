// warning due to not having a https link - can't do anything about it
const BASE_URL = 'http://userman.mni.thm.de';
let users = new Map();
let formEdit;
let inputFirstName;
let inputLastName;
let inputEmail;
let inputPass;
let inputEditFName;
let inputEditLName;
let tableUser;
tableUser = document.querySelector("#tableUser");
formEdit = document.querySelector("#formEdit");
inputFirstName = document.querySelector("#formInput [name='firstname']");
inputLastName = document.querySelector("#formInput [name='lastname']");
inputEmail = document.querySelector("#formInput [name='email']");
inputPass = document.querySelector("#formInput [name='password']");
inputEditFName = document.querySelector("#formEdit [name='firstname']");
inputEditLName = document.querySelector("#formEdit [name='lastname']");
document.querySelector("#formInput").addEventListener("submit", addUser);
formEdit.addEventListener("submit", editUser);
document.querySelector("#editClose").addEventListener("click", stopEdit);
tableUser.addEventListener("click", (event) => {
    // Da das Klickziel die Tabelle an sich ist, muss das genaue Ziel im DOM noch bestimmt werden
    let target = event.target;
    target = target.closest("button");
    if (target.matches(".delete")) {
        deleteUser(target);
    }
    else if (target.matches(".edit")) {
        startEdit(target);
    }
});
init().catch((err) => {
    console.error('init failed, no user loaded: ', err);
});
// currently called in the body with an onload
async function init() {
    await fetchUsers();
}
async function fetchUsers() {
    const res = await fetch(`${BASE_URL}/user`);
    if (res.ok) {
        const userMails = await res.json();
        for (const user of userMails) {
            const res = await fetch(`${BASE_URL}/user/${user}`);
            const completeUser = await res.json();
            users.set(completeUser.email, completeUser);
        }
        renderUserList(users);
    }
}
async function addUser(event) {
    event.preventDefault();
    const firstName = inputFirstName.value;
    const lastName = inputLastName.value;
    const email = inputEmail.value;
    const password = inputPass.value;
    try {
        const res = await fetch(`${BASE_URL}/user`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                firstName: firstName,
                lastName: lastName,
                email: email,
                password: password
            })
        });
        if (res.ok) {
            const createdUser = await res.json();
            users.set(createdUser.email, createdUser);
            resetInputs();
            await fetchUsers();
        }
    }
    catch (err) {
        console.log('Network or unexpected error: ', err);
    }
}
function resetInputs() {
    inputFirstName.value = "";
    inputLastName.value = "";
    inputEmail.value = "";
    inputPass.value = "";
}
function startEdit(target) {
    const email = target.dataset.email;
    const user = users.get(email);
    inputEditFName.value = user.firstName;
    inputEditLName.value = user.lastName;
    formEdit.dataset.email = email;
    formEdit.style.display = "block";
}
function stopEdit() {
    formEdit.style.display = "none";
}
function editUser(event) {
    event.preventDefault();
    const email = formEdit.dataset.email;
    const user = users.get(email);
    user.firstName = inputEditFName.value;
    user.lastName = inputEditLName.value;
    formEdit.style.display = "none";
    renderUserList(users);
}
function deleteUser(target) {
    const email = target.dataset.email;
    users.delete(email);
    renderUserList(users);
}
function renderUserList(userList) {
    tableUser.innerHTML = "";
    for (const u of userList.values()) {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${u.email}</td>
            <td>${u.lastName}</td>
            <td>${u.firstName}</td>

            <td>
                 <button class="btn btn-primary delete" data-email="${u.email}"><i class="fas fa-trash"></i></button>
                 <button class="btn btn-primary edit" data-email="${u.email}"><i class="fas fa-pen"></i></button>
            </td>
        `;
        tableUser.append(tr);
    }
}
//# sourceMappingURL=userman.js.map