// import axios from '@ma-dev/request';
// 业务自定义配置
// 合并default的,生成一个新的config
// const service = axios.create({
//     // baseURL: 'http://localhost:7002', // url = base url + request url
//     withCredentials: true // send cookies when cross-domain requests, 暂时没用到
// });

import axios from "axios";
import { Message } from 'element-ui'

const instance = axios.create({
    // baseURL: '/',
    baseURL: process.env.VUE_APP_BASE_API,
    timeout: 300000,
    withCredentials: true,
    headers: { "Content-Type": "application/json" }
});

instance.interceptors.request.use(
    conf => {
        if (!window.navigator.onLine) return Message.warning('Network error, please try again later')
        if (window.config.user) conf.headers.appid = window.config.user;
        if (window.config.role) conf.headers.role = window.config.role;
        return conf;
    },
    err => {
        return Promise.reject(err);
    }
);

instance.interceptors.response.use(
    res => {
        res = res.data;
        // if (res.status !== '0') {
        //   return Promise.reject(res)
        // }
        return res;
    },
    err => {
        return Promise.reject(err);
    }
);

const api = (url, method, config = {}) => {
    const conf = { url, method };
    if (method === "post" || method === "patch" || method === "put") {
        // conf.transformRequest = [
        //     d => {
        //         let v = "";
        //         for (const i in d) {
        //             if (typeof d[i] === "object") d[i] = JSON.stringify(d[i]); // object to str
        //             v +=
        //                 encodeURIComponent(i) +
        //                 "=" +
        //                 encodeURIComponent(d[i]) +
        //                 "&";
        //         }
        //         v = v.slice(0, -1);
        //         return v;
        //     }
        // ];
        // conf.headers = { "Content-Type": "application/x-www-form-urlencoded" }; // raw
        conf.data = config;
    } else {
        conf.params = config;
    }
    return instance(conf);
};

const apiJson = (url, method, config = {}) => {
    const conf = { url, method };
    if (method === "post" || method === "patch" || method === "put") {
        conf.transformRequest = [
            d => {
                let v = "";
                for (const i in d) {
                    if (typeof d[i] === "object") d[i] = JSON.stringify(d[i]); // object to str
                    v +=
                        encodeURIComponent(i) +
                        "=" +
                        encodeURIComponent(d[i]) +
                        "&";
                }
                v = v.slice(0, -1);
                return v;
            }
        ];
        conf.headers = { "Content-Type": "application/json" }; // raw
        conf.data = config;
    } else {
        conf.params = config;
    }
    return instance(conf);
};

export default api;
