import api from './request'
import apiJson from './requestJson'
import Ping from './ping'

const signal = {
    get: config => api('/v1/web/task/list', 'post', config),
    post: config => api('/v1/web/task/create', 'post', config),
    delete: config => api('/v1/web/task/delete', 'post', config),
    update: config => api('/v1/web/task/status', 'post', config),
    datail_for_page: config => apiJson('/v1/web/base/list/detail/page/get', 'post', config)
}
/* --- config --- */
const base = {
    list: config => api('/v1/web/config/baseList', 'post', config),
    detail: config => api('/v1/web/config/signalList', 'post', config),
    ini: config => api('/v1/web/config/ini', 'post', config),
    version: config => api('/v1/web/config/version', 'post', config),
    create: config => api('/v1/web/config/create', 'post', config),
    register: config => api('/v1/web/config/register', 'post', config),
    privacy: config => api('/v1/web/config/privacy', 'post', config),
    getDetail: config => api('/v1/web/config/get', 'post', config),
    datail_for_page: config => api('/v1/web/base/list/detail/page/get', 'post', config),
    upload_base_list: config => api('/v1/web/base/list/upload', 'post', config),
    // uploadToOBS: config => api('/v1/web/base/list/uploadToOBS', 'post', config),
    downloadOBS: config => api('/v1/web/base/list/downloadOBS', 'post', config),
    trigger: config => api('/v1/web/config/trigger', 'post', config)
}
/* --- consent --- */
const consent = {
    get: config => api('/v1/web/consent/get', 'post', config),
    getCompleteTest: config => api('/v1/web/consent/query', 'post', config),
    create: config => apiJson('/v1/web/consent/create', 'post', config),
    bind: config => apiJson('/v1/web/consent/vehicles/bind', 'post', config),
    unbind: config => apiJson('/v1/web/consent/vehicles/unbind', 'post', config),
    query: config => api('/v1/web/consent/vehicles/query', 'post', config),
    delete: config => api('/v1/web/consent/delete', 'post', config),
    edit: config => api('/v1/web/consent/update', 'post', config),
    update: config => api('/v1/web/configuration/consent/update', 'post', config)
}
/* --- dashboard --- */
const dashboard = {
    get: config => apiJson('/v1/web/configuration/flow/status/get', 'post', config),
    update: config => apiJson('/v1/web/configuration/flow/status/update', 'post', config),
    delete: config => apiJson('/v1/web/configuration/delete', 'post', config),
    update_process: config => apiJson('/v1/web/configuration/status/update', 'post', config)
}

export { base, consent, Ping, signal, dashboard }
