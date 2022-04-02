
export function isEmail(email) {
    return String(email)
        .toLowerCase()
        .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
}

export function isUserName(userName) {
    return String(userName)
        .match(/^[A-Za-z][A-Za-z0-9_]{7,29}$/);
}

export function validPassword(password) {
    return String(password)
        .match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/);
}

export function setErrorFor(input, message) {
    input.parentElement.classList.add("error");
    showErrorMessage(message);
}

export function setSuccessFor(input) {
    input.parentElement.classList.remove("error");
}

export function showErrorMessage(message) {
    let messageBox = document.querySelector(".ui.error.message");
    messageBox.classList.add("block");
    messageBox.children[1].innerHTML = message;
}

export function hideErrorMessage() {
    let messageBox = document.querySelector(".ui.error.message");
    messageBox.classList.remove("block");
}
