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
      this.tools = new Tools()
    }

    /**
     * 视频地址解析
     * @param {Object} data 
     * @returns 
     */
    async analysis(data){
      let vid,title,src,
          durl = 'https://la.killcovid2021.com/m3u8/',
          url = data.url
      
      try{
        let html = await this.netMo.get(url)
        html = html.toString()
  
          let $ = cheerio.load(html)
          vid = $("div#VID").html()
          title = $("title").html().replace(/\s+/g,"").replace("Chinesehomemadevideo","")
          src = durl+vid+'/'+vid+'.m3u8'
          
          console.log('src:'+src)
          let m3u8Result = await this.getM3u8(path.join(this.downloadRoot, vid, vid+'.m3u8'), src)
          if(m3u8Result.code == 0){
             data.title = title
             data.status = 1
             data.dir = path.join(this.downloadRoot, vid)
             return data
          }
          
      }catch(e){
        console.log(e)
      }

    }

    /**
     * 下载视频
     * @param {*} data 
     * @returns 
     */
    async download(data, callback) {
      console.log("开始下载")
      data.status = 2
      let dir = data.dir,
          filename = path.basename(dir),
          fileType = '.m3u8',
          m3u8Path = path.join(dir, filename+fileType),
          downloadHead = 'https://la.killcovid2021.com/m3u8/',
          progress = 0

      try{  
        let uriList = await this.tools.readM3U8(m3u8Path),
            videoList = []

        videoList.push("ffconcat version 1.0")
        for(let i=0; i<uriList.length; i++){
          let v = uriList[i],
              tsUri = downloadHead+filename+'/'+v,
              extname = path.extname(tsUri),
              fileName = path.basename(tsUri, extname)
              // console.log('11'+v)

          await this.netMo.downloadFile({
            uri: tsUri,
            paths: path.join(dir, '/.file',v) ,
          })
          videoList.push('file  '+fileName+extname)
          console.log(i/uriList.length*100)
          progress = parseInt(i/uriList.length *100)
          data.progress = progress
          callback(data)
        }

        //下载完成
        data.progress = 100
        data.status = 5
        callback(data)
        // try{
        //   fs.writeFileSync(path.join(this.downloadRoot, vid, '/.file/input.txt') ,videoList.join('\n'), undefined, 'utf-8')
        // }catch(e){
        //     console.log("写入配置出错--",e);
        //     // return ;
        // }
        
        // //开始依赖配置合成
        // console.log("开始合成-----");
        // let re = await this.tools.mixTsVideo(path.join(this.downloadRoot, vid, '/.file'), title)
        // return re
          
      }catch(e){
        console.log(e)
      }
      
    }

    async getM3u8(dir, url){
      console.log(dir, url)
      let result = await this.netMo.downloadFile({
        uri: url,
        paths: dir,
      })
      // if(result.code == 0){
      //   let results =  await tools.cerateConfigFile({uri: url, path: path, id: name, title: title, courceAdd: courceAdd})
      //   if(results.code == 0) result.setData(dest)
  
      //   return results
      // }
      if(result.code == 0) result.setData(dir)
      return result
    }
}