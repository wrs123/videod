import Network from './utils/network'
import * as cheerio from 'cheerio'
import { ipcMain, ipcRenderer } from 'electron'
import Tools from './utils/tools'
// const ffmpeg = require('fluent-ffmpeg');
const {resolve} = require('path')
const fs = require('fs')
const path = require('path')
const child_process = require('child_process');
const fsextra = require('fs-extra');

// const r = request.defaults({'proxy':'http://127.0.0.1:7890'})
export default class VideoDownload {

    constructor(){
      this.netMo = new Network(),
      this.downloadRoot = resolve('./')+'\\download'
    }


    async download(url) {
      console.log(url)
      let html = '',
          vid,title,src,
          durl = 'https://la.killcovid2021.com/m3u8/'

      let tools = new Tools()

      try{
        let data = await this.netMo.get(url)
            
        console.log("wangluo121212p")
        html = data.toString()
        
  
          let $ = cheerio.load(html)
          vid = $("div#VID").html()
          title = $("h4.login_register_header").html().split(">")[1].replace(/\s+/g,"")
          src = durl+vid+'/'+vid+'.m3u8'
          
          console.log(src)
          let result = await this.getM3u8(src, vid, '.m3u8', title, url)
          if(result.code == 0){
            
            let uriList = await tools.readM3U8(result.data, durl+'/'+vid),
            videoList = []
            videoList.push("ffconcat version 1.0")
            for(let i=0; i<uriList.length; i++){
              let v = uriList[i],
                  fullUri = durl+vid+'/'+v,
                  fileName = v.split('.')[0],
                  type = v.split('.')[1]
        
              await this.netMo.downloadFile({
                uri: fullUri,
                path: this.downloadRoot+'\\'+vid+'\\.file',
                name: fileName,
                type: '.'+type
              })
              videoList.push('file  '+ fileName+'.'+type)
            }
            try{
              fs.writeFileSync(this.downloadRoot+'\\'+vid+'\\.file\\input.txt',videoList.join('\n'), undefined, 'utf-8')
            }catch(e){
                console.log("写入配置出错--",e);
                return ;
            }
            
            //开始依赖配置合成
            console.log("开始合成-----");
            child_process.exec(`cd `+this.downloadRoot+'/'+vid+`/.file &&  ffmpeg -i input.txt -acodec copy -vcodec copy -absf aac_adtstoasc ../${title}.mp4`,function(error, stdout, stderr){
                if(error){
                    console.error("合成失败---",error);
                }else{
                    console.log("合成成功--",stdout);
                    try{
                      fs.rmSync('./download/'+vid+`/.file`, {recursive: true})
                      // return {code: 0}
                  }catch (e) {
                      console.error(e)
                  }
                    
                }
            });
          }
          
      }catch(e){
        console.log(e)
      }
      
    }

    async getM3u8(url, name, type, title, courceAdd){
      
      let tools = new Tools()
      let result = await this.netMo.downloadFile({
        uri: url,
        name: name,
        type: type,
        path: this.downloadRoot+'\\'+name,
      })
      // if(result.code == 0){
      //   let results =  await tools.cerateConfigFile({uri: url, path: path, id: name, title: title, courceAdd: courceAdd})
      //   if(results.code == 0) result.setData(dest)
  
      //   return results
      // }
      if(result.code == 0) result.setData(this.downloadRoot+'\\'+name+'\\'+name+type)
      return result
    }
}