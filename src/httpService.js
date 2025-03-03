import axios from "axios";
import { NotifyPlugin } from "tdesign-vue-next";

// 不加loading名单
const noLoadingUrl = ["/component/captcha"];

let baseURL = "";
const env = import.meta.env.MODE || "development";
if (env === "development") {
  baseURL = import.meta.env.VITE_API_URL_PREFIX;
} else if (env === "production") {
  baseURL = import.meta.env.VITE_API_URL + import.meta.env.VITE_API_URL_PREFIX;
}

// Create a CustomEvent object with a detail property
const customStorageEvent = new CustomEvent("customStorageEvent", {
  detail: {
    httpCount: 0, // Initialize the httpCount property with a default value
  },
});
// 自定义sessionStorage
const setSessionItem = function (key, newVal) {
  // Set the value in the session storage
  sessionStorage.setItem(key, newVal);

  // Update the detail property of the custom event with the new value
  customStorageEvent.detail.httpCount = newVal;

  // Dispatch the custom event with the updated value
  window.dispatchEvent(customStorageEvent);
};

const counter = {
  httpCount: 0,
  http_increment() {
    this.httpCount = this.httpCount + 1;
    setSessionItem("httpCount", this.httpCount);
  },
  http_decrement() {
    this.httpCount = this.httpCount - 1;
    setSessionItem("httpCount", this.httpCount);
  },
};

const getAxiosInstance = () => {
  const instance = axios.create({
    baseURL: baseURL,
  });

  // Add a request interceptor
  instance.interceptors.request.use(
    (config) => {
      // Do something before request is sent
      let token = localStorage.getItem("token");
      if (token) config.headers["Authorization"] = token;
      if (counter && !noLoadingUrl.includes(config.url))
        counter.http_increment();
      return config;
    },
    (error) => {
      // Do something with request error
      if (counter && !noLoadingUrl.includes(error.config.url))
        counter.http_decrement();
      return Promise.reject(error);
    },
  );

  // Add a response interceptor
  instance.interceptors.response.use(
    (response) => {
      // Any status code that lie within the range of 2xx cause this function to trigger
      // Do something with response data
      if (counter && !noLoadingUrl.includes(response.config.url))
        counter.http_decrement();
      if (
        [401].includes(response.data.code) &&
        location.pathname !== "/login"
      ) {
        localStorage.removeItem("token"); // 清除 token
        NotifyPlugin("error", {
          title: response.data.message || "登录信息已过期，请重新登录！",
        });
        setTimeout(() => {
          location.href = "/login";
        }, 1500);
      }
      return response;
    },
    (error) => {
      // Any status codes that falls outside the range of 2xx cause this function to trigger
      // Do something with response error
      if (counter && !noLoadingUrl.includes(error.config.url))
        counter.http_decrement();
      return Promise.reject(error);
    },
  );

  return instance;
};

const axiosIns = getAxiosInstance();

export { axiosIns };
