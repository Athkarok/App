import httpClient from '../helpers/httpClient';
import {
    isEmail, isUserName,
    setErrorFor, setSuccessFor,
    showErrorMessage, hideErrorMessage
} from './form_helper';
import { addLoader, removeLoaders } from '../global';


export default function signIn() {
    form();
    signinGoogle();
}


const loginUser = async ({ handle, password }) => {

    const resp = await httpClient.post("/user/login", {
        handle,
        password,
    });

    const data = resp.data;
    if (data.code != 0) {
        showErrorMessage(data.error);
    }
    else {
        localStorage.setItem("token", data.token);
        window.location = "/";
    }

};


function form() {
    const form = document.querySelector("#signinForm");
    const handle = document.querySelector("#handle");
    const password = document.querySelector("#password");

    let wait = false;

    const submit = async (e) => {
        e.preventDefault();

        if (!wait) {
            wait = true;
            await checkInputs(handle, password, async ({ handle, password, type }) => {
                addLoader(e.target);

                await loginUser({ handle: handle, password: password });

                removeLoaders();
                wait = false;
            });
        }
    };
    form.addEventListener("submit", submit);
}


function checkInputs(handle, password, callback) {
    let handleValue = handle.value.trim().toLowerCase();
    let passwordValue = password.value.trim();
    let email = false;

    if (handleValue === "") {
        setErrorFor(handle, "من فضلك ادخل اسم المستخدم أو البريد.");
    }
    else if (isEmail(handleValue)) {
        setSuccessFor(handle);
        email = true;
    }
    else if (isUserName(handleValue)) {
        setSuccessFor(handle);
    }
    else {
        setErrorFor(handle, "من فضلك ادخل بيانات صحيحة.");
    }

    if (passwordValue === "") {
        setErrorFor(password, "برجاء إدخال كلمة المرور.");
    }
    else {
        setSuccessFor(password);
    }

    if (!handle.parentElement.classList.contains("error") && !password.parentElement.classList.contains("error")) {
        hideErrorMessage();
        if (email) {
            callback(
                {
                    handle: handleValue,
                    password: passwordValue,
                    type: "email"
                });
        }
        else {
            callback(
                {
                    handle: handleValue,
                    password: passwordValue,
                    type: "username"
                });
        }
    }
}

const signinGoogle = async () => {
    const btn = document.querySelector(".g-sign-in-button");

    const sign = () => {
        btn.removeEventListener("click", sign);

        addLoader(btn);
        gapi.load("auth2", async () => {
            await gapi.auth2.init();
            const auth = await gapi.auth2.getAuthInstance();
            const googleUser = await auth.signIn();
            const id_token = googleUser.getAuthResponse().id_token;
            
            try {
                const resp = await httpClient.post("/user/sign_google",
                    {
                        id_token
                    });
                localStorage.setItem("token", resp.data.token);
                window.location = "/";
            }
            catch (err) {
                showErrorMessage(err.response.data.error);
                removeLoaders();
            }
            btn.addEventListener("click", sign);
        });
    };

    btn.addEventListener("click", sign);
};
