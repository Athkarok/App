import axios from 'axios';

export default axios.create({
    baseURL: "https://api.athkarok.tech/v1",
    headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
});
