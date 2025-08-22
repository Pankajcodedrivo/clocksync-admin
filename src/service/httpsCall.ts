import axios from "axios";
import toast from "react-hot-toast";
import { logOut } from "../store/auth.store";
import {store} from '../store/store'

axios.interceptors.request.use(async (config:any) => {
  config.baseURL = import.meta.env.VITE_API_BASE_URL;

  const token = localStorage.getItem("access_token") ?? "";

  if (token) {
    config.headers["authorization"] = `Bearer ${token}`;
  } else if (axios.defaults.headers.common["authorization"]) {
    config.headers["authorization"] =
      axios.defaults.headers.common["authorization"];
  }
  return config;
});

let retryCount = 0;
const MAX_RETRIES = 3;
let isLoggingOut = false;

axios.interceptors.response.use(
  async (response) => {
    return response; 
  },
  async (error) => {
    const tokenExpired = error.response?.data?.tokenExpired || false;
    const isUnauthorized = error.response?.status === 401;

    if (tokenExpired && isUnauthorized && retryCount < MAX_RETRIES) {
      const refreshToken = localStorage.getItem("refresh_token");

      if (refreshToken) {
        try {
          const refreshResponse = await axios.post("/admin/refresh-tokens", {
            token: refreshToken,
          });

          const { access, refresh } = refreshResponse.data.tokens || {};
          if (access && refresh) {
            localStorage.setItem("access_token", access);
            localStorage.setItem("refresh_token", refresh);

            error.config.headers["Authorization"] = `Bearer ${access}`;
            retryCount++;
            return axios(error.config); 
          }
        } catch (refreshError) {
          toast.error("Session expired. Please login again.");
          retryCount = 0; 
        }
      } else {
        toast.error("No refresh token found. Please login again.");
      }
      if (isUnauthorized && !isLoggingOut) {
        isLoggingOut = true;
        const getstore = store;
        getstore.dispatch(logOut());
      }
    }

    toast.error(error.response?.data?.message || "Something went wrong.");
    retryCount = 0;
    let duplicateEmailerror = false
    if(error.response?.data?.message)
    {
        duplicateEmailerror = error.response && error.response?.data?.message && 
        typeof error.response?.data?.message === 'string'? /duplicate key/.test(error.response?.data?.message) 
        && /email:/.test(error.response?.data?.message): false;
    }
    if(!duplicateEmailerror)                    
    {  
      if(error.response?.data?.message==="Token blacklisted" || error.response?.data?.message==="Please authenticate")
      { 
        import("../store/store").then(({ store }) => {
          import("../store/auth.store").then(({ logOut }) => {
            store.dispatch(logOut());
          });
        });
      }
    }
    return Promise.reject(error);
  }
);

// Exporting axios call methods
const httpsCall = {
  get: axios.get,
  post: axios.post,
  put: axios.put,
  delete: axios.delete,
  patch: axios.patch,
  interceptors: axios.interceptors,
};

export default httpsCall;
