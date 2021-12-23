<template>
  <div>
    <Row style="margin-top: 10px;">
       <Col span="18" offset="2"><Input search enter-button placeholder="Enter something..."  @on-search="search" v-model="value"/></Col>
      <!-- <Button type="primary" @click="startProxy">开启</Button> -->
    </Row>
    <Row style="margin-top: 15px;" v-for="(item, i) in downloadItems" :key="i">
       <Col span="18" offset="2"> 
       <Card :padding=10>
         <Row>
           <Col flex="auto"><span>{{item.title}}</span></Col>
           <Col flex="100px">{{item.status==0?'解析中':item.status==1?'解析完成':item.status==2?'下载中':item.status==1?'暂停':item.status==1?'下载失败':'下载完成'}}</Col>
         </Row>
         <div class="download_detail">
           <div class="progress">
             <Progress :percent="item.progress" :stroke-width="5"  status="active" />
           </div>
           <div class="buttonGroup" style="width: 88px;">
             <ButtonGroup size="small" >
                <Button><Icon type="md-play" /> 
                <!-- <Icon type="md-pause" /> -->
                </Button>
                <Button @click="openFolder(item.dir)"><Icon type="md-folder" /></Button>
                <Button><Icon type="md-trash" /></Button>
            </ButtonGroup>
           </div>
         </div>
        </Card>
      </Col>
      <!-- <Col span="18" offset="2">
        <Alert type="success" v-if='status == 0' show-icon>
            下载完成
        </Alert>
        <Alert type="warning" v-if='status == 1' show-icon>
            下载中
        </Alert>
      </Col> -->
    </Row> 
    <Row v-if="downloadItems.length == 0" type="flex" style="margin-top: 10px;" justify="center">
      <Col span="auto">
        <span>无下载内容</span>
      </Col>
    </Row>
  </div>
    
</template>

<script>

  import {ipcRenderer} from 'electron';
  const shell = require('electron').shell
  const os = require('os')
  const path = require("path")

  export default {
    name: 'index-page',
    methods: {
      
    }, 
    data(){
      return {
        value: '',
        status: 0,
        progress: 0,
        downloadItems: []
      }
    },
    created(){
      // this.fileInfo()
    },
    methods: {
      search(e){
        let item = {
          id: this.$data.downloadItems.length,
          title: '--', 
          progress: 0,
          url: 'https://www.91porn.com/view_video.php?viewkey=1309503227&page=&viewtype=&category=',
          status: 0, //0解析 1解析完成 2下载  3暂停  4失败  5完成
          dir: ""
        },
        message = {
          do: 'new_mission',
          item: item
        }
        // let url = 'https://www.91porn.com/view_video.php?viewkey=1309503227&page=&viewtype=&category='
        this.$data.downloadItems.push(item)
        let that = this
    
        const socket = new WebSocket('ws://127.0.0.1:7381/'); 
        // 打开Socket   
        socket.onopen = function(event) { 
          // 发送一个初始化消息
          socket.send(JSON.stringify(message)); 

          // 监听消息
          socket.onmessage = function(event) {
            item = JSON.parse(event.data)
            console.log(that.$data.downloadItems[item.id])
            that.$data.downloadItems[item.id].title = item.title
            that.$data.downloadItems[item.id].status = item.status
            that.$data.downloadItems[item.id].dir = item.dir
            console.log(that.$data)
          }; 

          // 监听Socket的关闭
          socket.onclose = function(event) { 
            console.log('Client notified socket has closed',event); 
          }; 

          //socket.close() 
        };  

        // ipcRenderer.invoke('start_do', this.$data.value).then(res => {
        //   if(res.code == 0){
        //   console.log(res)
        //   this.$data.status = 0
        // }
        // });
      },
       openFolder(url){
         console.log(url)
          shell.showItemInFolder(url)
      },
      /**
       * 文件数据状态
       */
      fileInfo(){
         var that = this
        // 打开Socket 
        socket.onopen = function(event) { 

          // 发送一个初始化消息
          // socket.send('I am the client and I\'m listening!'); 

          // 监听消息
          socket.onmessage = function(event) { 
            console.log('Client received a message',event); 
            if(event.data > 100){
              socket.close() 
            }
            that.$data.progress = parseInt(event.data)
          }; 

          // 监听Socket的关闭
          socket.onclose = function(event) { 
            console.log('Client notified socket has closed',event); 
          }; 

          // 关闭Socket.... 
          //socket.close() 
        };

      }
    }
   
  }
</script>

<style lang="scss" scoped>
  .download_detail{
    width: 100%;
    display: flex;

  }

  .download_detail .progress{
    width: calc(100% - 88px);
  }
</style>
