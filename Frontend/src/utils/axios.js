import axios from "axios"

export const axiosInstance = axios.create({
    baseURL: "http://localhost:7000/user",
    withCredentials:true
})

export const axiosCandidate = axios.create({
    baseURL: "http://localhost:7000/candidate",
    withCredentials:true
})

// export const axiosCnic = axios.create({
//     baseURL: "http://localhost:7000/cnic",
//     withCredentials:true
// })

