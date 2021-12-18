import Network from './utils/network'
import * as cheerio from 'cheerio'
import { ipcMain, ipcRenderer } from 'electron'
const {resolve} = require('path')

// const r = request.defaults({'proxy':'http://127.0.0.1:7890'})
export default class VideoDownload {

    constructor(){
      this.net = new Network()
    }


    async download(url) {
      console.log(url)
      let html = '',
          vid,title,src,
          durl = 'https://la.killcovid2021.com/m3u8/';

      try{
        let data = await this.net.get(url)
        html = data.toString()
  
          let $ = cheerio.load(html)
          vid = $("div#VID").html()
          title = $('title').html()
          src = durl+vid+'/'+vid+'.m3u8'
          console.log(src)
          let result = await this.getM3u8(src, vid, title, url)
          
          return result
      }catch(e){
        console.log(e)
      }
      
    }

    async getM3u8(url, name, title, sadd){
        return this.net.downloadFile({
          uri: url,
          name: name,
          path: resolve('./')+'\\download',
          title: title,
          sadd: sadd
        })

    }

    

}
