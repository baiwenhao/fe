import router from "../../router";
import { base } from "@/api"

export function handleJumpToCreate(type, id, status) {
    router.push({
        path: "detail",
        query: {
            type: type,
            id: id,
            status: status
        }
    });
}

export async function downloadJson(row) {
    let res = await base.getDetail({
        configId: row.configId
    })
    let result = JSON.stringify(res)
    let fileName = row.configName
    let blob = new Blob([result], {
        type: 'application/json'
    })
    if (window.navigator.msSaveOrOpenBlob) {
        navigator.msSaveBlob(blob, fileName)
    } else {
        var link = document.createElement('a')
        link.href = window.URL.createObjectURL(blob)
        link.download = fileName
        link.click()
        window.URL.revokeObjectURL(link.href)
    }
}