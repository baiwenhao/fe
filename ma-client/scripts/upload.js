/*
  静态文件上传obs
 */
const Bucket = 'obs-rtg-service-nprod-01'
const conf = {
  access_key_id: 'ONEPJRX4B8CGPB14XE9L',
  secret_access_key: 'kB3bwFeiVf0BT2yD1cv7KS2cXPsgpkxnSx0iDVi2',
  server: 'obs.cn-north-4.myhuaweicloud.com'
}
const ObsClient = require('esdk-obs-nodejs')
const client = new ObsClient(conf)
const fs = require('fs')
const axios = require('axios')
const path = require('path')
const rootPath = (dir) => path.join(__dirname, '../../', dir || '')
const distUrl = rootPath('client/dist')
const tpl = distUrl + '/main.html'
const tail = new Date().getTime()
// const inquirer = require('inquirer')
let env = 'rtg-local'

const sd = (url, arr) => {
  if (!arr) arr = []
  const __list = fs.readdirSync(url)
  for (let i = 0; i < __list.length; i++) {
    const __url = path.join(url, __list[i])
    const state = fs.statSync(__url)
    if (state.isFile()) {
      arr.push(__url)
    } else if (state.isDirectory()) {
      sd(__url, arr)
    }
  }
  return arr
}

const postFile = async (arr) => {
  if (!arr || arr.length === 0) {
    fs.readFile(tpl, function(err, data){
      if (err) {
          console.log(err);
      } else {
        fs.writeFileSync(rootPath('server/app/view/home.nj'), data.toString())
        console.log('--- completed upload ---')
      }
    })
    // updata config
    // const result = await axios.get('https://service-rtg-noprod-cdn.maezia.com/config/' + env + '.json?n=' + tail)
    // if (result && result.data && result.data.static === false) {
    //   result.data.static = true
    //   client.putObject({
    //     Bucket,
    //     Key: 'config/' + env + '.json',
    //     Body: JSON.stringify(result.data),
    //   }, (err, result) => {
    //     if (err) {
    //       console.error('Error-->' + err)
    //     } else {
    //       console.log('completed')
    //     }
    //   })
    // }
  } else {
    const SourceFile = arr.shift(0)
    const Key = 'rtg' + SourceFile.replace(distUrl, '')
    console.log(SourceFile)
    client.putObject({
      Bucket,
      Key,
      SourceFile
    }, (err, result) => {
      if (err) {
        console.error('Error-->' + err)
      } else {
        // console.log('Status-->' + result.CommonMsg.Status)
        postFile(arr)
      }
    })
  }
}

env = 'rtg-uat' // UAT 生产环境标识
const isExist = fs.existsSync(distUrl)
if (!isExist) return false
const files = sd(distUrl)
console.log('--- ready files ---')
postFile(files)


