import Network from './utils/network'
import * as cheerio from 'cheerio'
import { ipcMain, ipcRenderer } from 'electron'
import Tools from './utils/tools'
import BaseResult from './domain/baseResult'
// const ffmpeg = require('fluent-ffmpeg');
const {resolve} = require('path')
const fs = require('fs')
const path = require('path')


// const r = request.defaults({'proxy':'http://127.0.0.1:7890'})
export default class VideoDownload {

    constructor(){
      this.netMo = new Network(),
      this.downloadRoot = path.join(resolve('./'),'/download')
    }

    /**
     * 视频地址解析
     * @param {Object} data 
     * @returns 
     */
    async analysis(data){
      let html = '',
          vid,title,src,
          durl = 'https://la.killcovid2021.com/m3u8/',
          url = data.url
      
      try{
        let html = await this.netMo.get(url)
        html = html.toString()
  
          let $ = cheerio.load(html)
          vid = $("div#VID").html()
          title = $("title").html().replace(/\s+/g,"").replace("Chinesehomemadevideo","")
          src = durl+vid+'/'+vid+'.m3u8'
          
          console.log(src)
          let result = await this.getM3u8(src, vid, '.m3u8', path.join(this.downloadRoot, vid))
          if(result.code == 0){
             data.title = title
             data.status = 1
             data.dir = path.join(this.downloadRoot, vid)
             return data
          }
          
      }catch(e){
        console.log(e)
      }

    }

    async download(url) {
      console.log(url)
      let html = '',
          vid,title,src,
          durl = 'https://la.killcovid2021.com/m3u8/'

      let tools = new Tools()

      try{
        let data = await this.netMo.get(url)
            
        console.log(data)
        html = data.toString()
  
          let $ = cheerio.load(html)
          vid = $("div#VID").html()
          title = $("title").html().replace(/\s+/g,"").replace("Chinesehomemadevideo","")
          src = durl+vid+'/'+vid+'.m3u8'
          
          console.log(src)
          let result = await this.getM3u8(src, vid, '.m3u8', title, url)
          if(result.code == 0){
            
            let uriList = await tools.readM3U8(result.data, path.join(durl+'/'+vid)),
            videoList = []
            videoList.push("ffconcat version 1.0")
            for(let i=0; i<uriList.length; i++){
              let v = uriList[i],
                  fullUri = durl+vid+'/'+v,
                  fileName = v.split('.')[0],
                  type = v.split('.')[1]
        
              await this.netMo.downloadFile({
                uri: fullUri,
                paths: path.join(this.downloadRoot, vid, '/.file') ,
                name: fileName,
                type: '.'+type
              })
              videoList.push('file  '+ fileName+'.'+type)
            }
            try{
              fs.writeFileSync(path.join(this.downloadRoot, vid, '/.file/input.txt') ,videoList.join('\n'), undefined, 'utf-8')
            }catch(e){
                console.log("写入配置出错--",e);
                // return ;
            }
            
            //开始依赖配置合成
            console.log("开始合成-----");
            let re = await tools.mixTsVideo(path.join(this.downloadRoot, vid, '/.file'), title)
            return re
          }
          
      }catch(e){
        console.log(e)
      }
      
    }

    async getM3u8(url, name, type, paths){
      
      let tools = new Tools()
      let result = await this.netMo.downloadFile({
        uri: url,
        name: name,
        type: type,
        paths: paths,
      })
      // if(result.code == 0){
      //   let results =  await tools.cerateConfigFile({uri: url, path: path, id: name, title: title, courceAdd: courceAdd})
      //   if(results.code == 0) result.setData(dest)
  
      //   return results
      // }
      if(result.code == 0) result.setData(path.join(this.downloadRoot, name, name+type))
      return result
    }
}