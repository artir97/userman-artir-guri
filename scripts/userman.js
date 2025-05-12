const BASE_URL = 'http://userman.mni.thm.de';
/**
 * Definition der globalen Variablen
 * Hier sind es die benötigten HTML-Elemente und das User-Array.
 */
let formEdit;
let inputFName;
let inputLName;
let inputEmail;
let inputPass;
let inputEditFName;
let inputEditLName;
let tableUser;
/**
 * Die Callback-Funktion initialisiert nach dem Laden des DOMs die globalen Variablen
 * und registriert die Eventhandler.
 */
document.addEventListener("DOMContentLoaded", () => {
    tableUser = document.querySelector("#tableUser");
    formEdit = document.querySelector("#formEdit");
    inputFName = document.querySelector("#formInput [name='firstname']");
    inputLName = document.querySelector("#formInput [name='lastname']");
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
});
// currently called in the body with an onload
async function fetchUsers() {
    const res = await fetch(`${BASE_URL}/user`);
    if (res.ok) {
        const userMails = await res.json();
        const usersWithInfo = [];
        for (const user of userMails) {
            const res = await fetch(`${BASE_URL}/user/${user}`);
            const completeUser = await res.json();
            usersWithInfo.push(completeUser);
        }
        renderUserList(usersWithInfo);
    }
}
/**
 * Die Funktion liest die benötigten Werte aus den Inputfeldern.
 * Es wird ein neuer User erzeugt und der Map hinzugefügt.
 * @param event zum Unterdrücken des Standardverhaltens (Neuladen der Seite)
 */
function addUser(event) {
    event.preventDefault();
    const fName = inputFName.value;
    const lName = inputLName.value;
    const email = inputEmail.value;
    const password = inputPass.value;
    users.set(email, new User(fName, lName, email, password));
    renderUserList();
}
/**
 * Die Funktion wird zu Beginn des Editiervorgangs aufgerufen.
 * Sie überträgt die Daten des aktuellen Elements in den Editierbereich und zeigt ihn an.
 * @param target das angeklickte Element
 */
function startEdit(target) {
    const email = target.dataset.email;
    const user = users.get(email);
    inputEditFName.value = user.fName;
    inputEditLName.value = user.lName;
    formEdit.dataset.email = email;
    formEdit.style.display = "block";
}
function stopEdit() {
    formEdit.style.display = "none";
}
/**
 * Die Funktion wird aufgerufen, wenn das Editieren quittiert wird.
 * Die benötigten Felder werden ausgelesen und das Formular ausgeblendet.
 * @param event zum Unterdrücken des Standardverhaltens (Neuladen der Seite)
 */
function editUser(event) {
    event.preventDefault();
    const email = formEdit.dataset.email;
    const user = users.get(email);
    user.fName = inputEditFName.value;
    user.lName = inputEditLName.value;
    formEdit.style.display = "none";
    renderUserList();
}
/**
 * Entfernt das aktuelle Element aus dem Array.
 * @param target das angeklickte Element
 */
function deleteUser(target) {
    const email = target.dataset.email;
    users.delete(email);
    renderUserList();
}
/**
 * Löscht die Inhalte der Tabelle und baut sie auf Grundlage des Arrays neu auf.
 */
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