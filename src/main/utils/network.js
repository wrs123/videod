import {net} from 'electron'
import BaseResult from '../domain/baseResult'
import Tools from './tools'
const fs = require('fs')
const path = require("path")

export default class Network{

    get(url, options) {
        
        let data = ''
        options = options == null ? {} : options
        

        return new Promise(function(resolve, reject){
            const requs = net.request(url)

            requs.on('response',(response)=>{  //监听响应
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
            requs.end(); 
            console.log("wangluop"+url)
        })
    }
    
   /**
    * 下载文件
    * @param {*} uri  下载路径
    * @param {*} paths 保存路径
    * @param {*} name 文件名
    * @param {*} title 视频标题
    * @param {*} courceAdd 视频源网址
    * @param {*} options 
    * @returns 
    */
    async downloadFile({uri, paths}, options){
        console.log(paths,uri)
        let data = '',
            dir = path.dirname(paths)
        options = options == null ? {} : options
        const tools = new Tools()
      
        await tools.pathAccess(dir)
        let file = fs.createWriteStream(paths)

        return new Promise((res, rej) => {
            console.log(uri)
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
                    res(new BaseResult({}))
                  }).on('error', (err)=>{
                    fs.unlink(dest);
                  });
                
                response.pipe(file);
            })
            request.end(); 
        })
        
    }
}


