/**
 * Definition der User-Klasse bestehend aus den Attributen Vor- und Zunamen, Emailadresse sowie Passwort.
 */
class User {
    email: string;
    fName: string;
    lName: string;
    password: string;

    constructor(fName: string, lName: string, email: string, password: string) {
        this.fName = fName;
        this.lName = lName;
        this.email = email;
        this.password = password;
    }
}

/**
 * Definition der globalen Variablen
 * Hier sind es die benötigten HTML-Elemente und das User-Array.
 */
let formEdit: HTMLFormElement;
let inputFName: HTMLInputElement;
let inputLName: HTMLInputElement;
let inputEmail: HTMLInputElement;
let inputPass: HTMLInputElement;
let inputEditFName: HTMLInputElement;
let inputEditLName: HTMLInputElement;
let tableUser: HTMLElement;
const users: Map<string, User> = new Map<string, User>();

/**
 * Die Callback-Funktion initialisiert nach dem Laden des DOMs die globalen Variablen
 * und registriert die Eventhandler.
 */
document.addEventListener("DOMContentLoaded", () => { //Soll das noch mit DOMContentLoaded gemacht werden, oder mit defer im HTML-Head
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

/**
 * Die Funktion liest die benötigten Werte aus den Inputfeldern.
 * Es wird ein neuer User erzeugt und der Map hinzugefügt.
 * @param event zum Unterdrücken des Standardverhaltens (Neuladen der Seite)
 */
function addUser(event: Event): void {
    event.preventDefault();

    const fName: string = inputFName.value;
    const lName: string = inputLName.value;
    const email: string = inputEmail.value;
    const password: string = inputPass.value;

    users.set(email, new User(fName, lName, email, password));
    renderUserList();
}

/**
 * Die Funktion wird zu Beginn des Editiervorgangs aufgerufen.
 * Sie überträgt die Daten des aktuellen Elements in den Editierbereich und zeigt ihn an.
 * @param target das angeklickte Element
 */
function startEdit(target: HTMLElement) {
    const email: string = target.dataset.email;
    const user: User = users.get(email);

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
function editUser(event: Event) {
    event.preventDefault();
    const email: string = formEdit.dataset.email;
    const user: User = users.get(email);

    user.fName = inputEditFName.value;
    user.lName = inputEditLName.value;
    formEdit.style.display = "none";
    renderUserList();
}

/**
 * Entfernt das aktuelle Element aus dem Array.
 * @param target das angeklickte Element
 */
function deleteUser(target: HTMLElement) {
    const email: string = target.dataset.email;
    users.delete(email);
    renderUserList();
}

/**
 * Löscht die Inhalte der Tabelle und baut sie auf Grundlage des Arrays neu auf.
 */
function renderUserList() {
    tableUser.innerHTML = "";

    for (const u of users.values()) {
        const tr: HTMLElement = document.createElement("tr");
        tr.innerHTML = `
            <td>${u.email}</td>
            <td>${u.lName}</td>
            <td>${u.fName}</td>

            <td>
                 <button class="btn btn-primary delete" data-email="${u.email}"><i class="fas fa-trash"></i></button>
                 <button class="btn btn-primary edit" data-email="${u.email}"><i class="fas fa-pen"></i></button>
            </td>
        `;
        tableUser.append(tr);
    }
}
