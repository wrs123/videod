import BaseResult from '../domain/baseResult';

const fs = require('fs');

export default class Tools{
    /**
     * 文件目录判断  不存在则创建目录
     * @param {} path 
     * @returns 
     */
     async pathAccess(path){
        return new Promise((res, rej) => {
            let paths = path.split('\\');
            let index = 1
            function next(index) {
                    //递归结束判断
                    if(index>paths.length) return res();

                    let newPath = paths.slice(0,index).join('/');
                
                    fs.access(newPath,function (err) {
                        if(err){//如果文件不存在，就创建这个文件
                            fs.mkdir(newPath,function (err) {
                            next(index+1);
                            });
                        }else{
                        //如果这个文件已经存在，就进入下一个循环
                            next(index+1);
                        }
                    })
                }
            next(index)
        })
    }


    /**
     * 创建视频的配置文件
     * @param {*} path 
     */
    async cerateConfigFile({uri, path, id, title, courceAdd}){
        let content = {
            courceAdd: courceAdd,
            uri: uri,
            vid: id,
            title: title
        },
        streamPath = path+'\\.vconfig'

        console.log(content)
        return new Promise((res, rej) => {
            let writerStream = fs.createWriteStream(streamPath)
            writerStream.write(JSON.stringify(content), 'UTF8'),
             //标记文件末尾  结束写入流，释放资源  
            writerStream.on( 'finish',  function() {
                res(new BaseResult({}))
            });
            writerStream.on( 'error',  function(error){
                rej(new BaseResult({code: 1, message: error.stack, status: err}))
            })
            writerStream.end(); 
        })
    }

    /**
     * 解析m3u8文件
     * @param {String} path 
     */
    async readM3U8(path, uri){

        return new Promise((rev, rej) => {
            fs.readFile(path,"utf-8", (err, data) => {
                if(err){
                    return rej(err)
                }
                 console.log(data)
                 var arr = data.split("\n");
                 arr = arr.filter((item)=>{
                     return item.match(/\.ts$/);
                 });
 
                 return rev(arr)
            }); //读取 m3u8
        } )
        
       
    }
}