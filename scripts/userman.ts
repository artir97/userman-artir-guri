const BASE_URL: string = 'http://userman.mni.thm.de';

interface User {
    email: string,
    firstName: string,
    lastName: string,
    password: string
}

let users: Map<string, User> = new Map();
/**
 * Definition der globalen Variablen
 * Hier sind es die benötigten HTML-Elemente und das User-Array.
 */
let formEdit: HTMLFormElement;
let inputFirstName: HTMLInputElement;
let inputLastName: HTMLInputElement;
let inputEmail: HTMLInputElement;
let inputPass: HTMLInputElement;
let inputEditFName: HTMLInputElement;
let inputEditLName: HTMLInputElement;
let tableUser: HTMLElement;

/**
 * Die Callback-Funktion initialisiert nach dem Laden des DOMs die globalen Variablen
 * und registriert die Eventhandler.
 */
document.addEventListener("DOMContentLoaded", () => { //Soll das noch mit DOMContentLoaded gemacht werden, oder mit defer im HTML-Head
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
    tableUser.addEventListener("click", (event: Event) => {
        // Da das Klickziel die Tabelle an sich ist, muss das genaue Ziel im DOM noch bestimmt werden
        let target: HTMLElement = event.target as HTMLElement;
        target = target.closest("button");
        if (target.matches(".delete")) {
            deleteUser(target);
        } else if (target.matches(".edit")) {
            startEdit(target);
        }
    });
});

// currently called in the body with an onload
async function fetchUsers(): Promise<void> {
    const res: Response = await fetch(`${BASE_URL}/user`);
    if (res.ok) {
        const userMails = await res.json();
        const usersWithInfo: User[] = [];

        for (const user of userMails) {
            const res: Response = await fetch(`${BASE_URL}/user/${user}`);
            const completeUser = await res.json();
            users.set(completeUser.email, completeUser);
            usersWithInfo.push(completeUser);
        }
        renderUserList(users);
    }
}

/**
 * Die Funktion liest die benötigten Werte aus den Inputfeldern.
 * Es wird ein neuer User erzeugt und der Map hinzugefügt.
 * @param event zum Unterdrücken des Standardverhaltens (Neuladen der Seite)
 */
async function addUser(event: Event): Promise<void> {
    event.preventDefault();

    const firstName: string = inputFirstName.value;
    const lastName: string = inputLastName.value;
    const email: string = inputEmail.value;
    const password: string = inputPass.value;

    try {
        const res: Response = await fetch(`${BASE_URL}/user`, {
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
        if(res.ok) {
            const createdUser = await res.json();
            users.set(createdUser.email, createdUser);

            inputFirstName.value = "";
            inputLastName.value = "";
            inputEmail.value = "";
            inputPass.value = "";

            await fetchUsers();
        }
    } catch (err) {
        console.log('Network or unexpected error: ', err);
    }
}

/**
 * Die Funktion wird zu Beginn des Editiervorgangs aufgerufen.
 * Sie überträgt die Daten des aktuellen Elements in den Editierbereich und zeigt ihn an.
 * @param target das angeklickte Element
 */
function startEdit(target: HTMLElement) {
    const email: string = target.dataset.email;
    const user: User = users.get(email);

    inputEditFName.value = user.firstName;
    inputEditLName.value = user.lastName;
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
function editUser(event: Event) {
    event.preventDefault();
    const email: string = formEdit.dataset.email;
    const user: User = users.get(email);

    user.firstName = inputEditFName.value;
    user.lastName = inputEditLName.value;
    formEdit.style.display = "none";
    renderUserList(users);
}

/**
 * Entfernt das aktuelle Element aus dem Array.
 * @param target das angeklickte Element
 */
function deleteUser(target: HTMLElement) {
    const email: string = target.dataset.email;
    users.delete(email);
    renderUserList(users);
}

/**
 * Löscht die Inhalte der Tabelle und baut sie auf Grundlage des Arrays neu auf.
 */
function renderUserList(userList) {
    tableUser.innerHTML = "";

    for (const u of userList.values()) {
        const tr: HTMLElement = document.createElement("tr");
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
