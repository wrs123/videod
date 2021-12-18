import {net} from 'electron'
import BaseResult from '../domain/baseResult'
import Tools from './tools'
const fs = require('fs')

export default class Network{

    get(url, options) {
        let data = ''
        options = options == null ? {} : options

        return new Promise(function(resolve, reject){
            let request=net.request(url)

            request.on('response',(response)=>{  //监听响应
                response.on('data',(chunk)=>{  //获取返回数据
                    // console.log(chunk.toString());
                    data += chunk
                })
                //监听结束
                response.on('end',()=>{
                    resolve(data);
                })

                response.on('error', (error) => {
                    reject(error)
                })
            })
            request.end(); 
        })
    }

    async downloadFile({uri, path, name, title, sadd}, options){
        let data = ''
        options = options == null ? {} : options
        path = path+'\\'+name
        const dest = path+'\\'+name+'.m3u8'
        const tools = new Tools()
        console.log(dest,path)
        await tools.pathAccess(path)
        let file = fs.createWriteStream(dest)

        return new Promise((res, rej) => {
            let request=net.request(uri)
            request.on('response',(response)=>{  //监听响应
                response.on('data',(chunk)=>{  //获取返回数据
                    // console.log(chunk.toString());
                    data += chunk
                })
    
                response.on('error', (error) => {
                    rej(new BaseResult({code: 1, message: error})) 
                })
    
                file.on('finish', async ()=>{
                    file.close();
                    console.log("下载完成")
                    let result =  await tools.cerateConfigFile({uri: uri, path: path, id: name, title: title, sadd: sadd})
                    res(result)
                  }).on('error', (err)=>{
                    fs.unlink(dest);
                  });
                
                response.pipe(file);
            })
            request.end(); 
        })
        
    }
}


