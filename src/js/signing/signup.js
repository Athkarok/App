import httpClient from '../helpers/httpClient';
import {
    isEmail, isUserName,
    setErrorFor, setSuccessFor,
    showErrorMessage, hideErrorMessage,
    validPassword
} from './form_helper';

import { addLoader, removeLoaders } from '../global';

export default function signup() {
    form();
}


const singupUser = async ({ email, username, password, fname, lname, phone_number }) => {

    try {
        const resp = await httpClient.post("/user/register", {
            email, username, password, fname, lname, phone_number
        });
        const data = resp.data;
        if (data.code != 0) {
            showErrorMessage(data.error);
        }
        else {
            localStorage.setItem("token", data.token);
            window.location = "/";
        }

    }
    catch (error) {
        showErrorMessage(error.response.data.error);
    }

};

function form() {
    const form = document.querySelector("#signupForm");

    let wait = false;

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        if (!wait) {
            wait = true;
            await checkInputs(async (email, userName, password, fname, lname, phoneNumber) => {
                addLoader(e.target);
                await singupUser({
                    email: email,
                    username: userName,
                    password: password,
                    fname: fname,
                    lname: lname,
                    phone_number: phoneNumber
                });
                removeLoaders();
                wait = false;
            });
        }
    });
}

const checkInputs = (callback) => {
    // Elements
    const fname = document.querySelector("#fname");
    const lname = document.querySelector("#lname");
    const email = document.querySelector("#email");
    const userName = document.querySelector("#user_name");
    const phoneNumber = document.querySelector("#phone_number");
    const password = document.querySelector("#password");
    const password2 = document.querySelector("#password2");

    // Values
    const fnameValue = fname.value.trim();
    const lnameValue = lname.value.trim();
    const emailValue = email.value.trim();
    const userNameValue = userName.value.trim();
    const phoneNumberValue = phoneNumber.value.trim();
    const passwordValue = password.value.trim();
    const password2Value = password2.value.trim();

    // fname
    if (fnameValue === "") {
        setErrorFor(fname, "يجب ادخال الاسم الأول.");
    }
    else {
        setSuccessFor(fname);
    }

    // email validation
    if (emailValue === "") {
        setErrorFor(email, "يجب ادخال البريد الإلكتروني.");
    }
    else if (!isEmail(emailValue)) {
        setErrorFor(email, "يجب ادخال بريد إلكتروني صحيح.");
    }
    else {
        setSuccessFor(email);
    }

    // userNmae validation 
    if (userNameValue === "") {
        setErrorFor(userName, "يجب ادخال اسم المستخدم.");
    }
    else if (!isUserName(userNameValue)) {
        setErrorFor(userName, "يجب أن يكون اسم المستخدم اكثر من 8 خانات مكون من حروف وأرقام انجليزية.");
    }
    else {
        setSuccessFor(userName);
    }

    // password validation 
    if (passwordValue === "") {
        setErrorFor(password, "يجب ادخال كلمة مرور.");
    }
    else {
        setSuccessFor(password);
        if (password2Value === "") {
            setErrorFor(password2, "يجب تأكيد كلمة المرور.");
        }
        else {
            setSuccessFor(password2);

            if (!(passwordValue == password2Value)) {
                setErrorFor(password, "");
                setErrorFor(password2, "");
                showErrorMessage("كلمة المرور غير متطابقة.");
            }
            else {
                if (!validPassword(passwordValue)) {
                    setErrorFor(password, "");
                    setErrorFor(password2, "");
                    showErrorMessage("يجب أن تكون كلمة المرور 8 خانات على الأقل متضمنة أحرف صغيرة وكبيرة وأرقام.");
                }
                else {
                    setSuccessFor(password);
                    setSuccessFor(password2);
                }
            }
        }
    }

    if (
        !fname.parentElement.classList.contains("error") &&
        !email.parentElement.classList.contains("error") &&
        !userName.parentElement.classList.contains("error") &&
        !password.parentElement.classList.contains("error") &&
        !password2.parentElement.classList.contains("error")
    ) {
        hideErrorMessage();
        callback(emailValue, userNameValue, passwordValue, fnameValue, lnameValue, phoneNumberValue);
    }
};
