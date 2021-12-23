<template>
  <div>
    <Row style="margin-top: 10px;">
       <Col span="18" offset="2"><Input search enter-button placeholder="Enter something..."  @on-search="search" v-model="value"/></Col>
      <!-- <Button type="primary" @click="startProxy">开启</Button> -->
    </Row>
    <Row style="margin-top: 15px;" v-for="(item, i) in downloadItems" :key="i">
       <Col span="18" offset="2"> 
       <Card :padding=10>
         <Row style="margin-bottom: 5px;">
           <Col flex="auto"><span>{{item.title}}</span></Col>
           <Col flex="88px" 
           style="text-align: right; font-size: 13px;" 
           :class="item.status==1 || item.status==5 ? 'font-success' : ''"
           >
           {{item.status==0?'解析中':item.status==1?'解析完成':item.status==2?'下载中':item.status==3?'下载暂停':item.status==4?'下载失败': item.status==6?'解析失败': '下载完成'}}
           </Col>
         </Row>
         <Row>
           <Col flex="auto">
             <Progress 
             :percent="item.status== 0 || item.status== 6 ? 100 : item.progress" 
             :stroke-width="5" 
             :stroke-color="item.status==0?'#2db7f5':item.status==3?'#808695':item.status==4?'#ed4014':item.status==5?'#19be6b':item.status==6?'#ff9900':'#2d8cf0'"  
             status="active"  
             >
               <Icon type="checkmark-circled"></Icon>
               <span v-if="item.status == 2">{{item.progress+'%'}}</span>
             </Progress>
           </Col>
           <Col flex="88px">
                <ButtonGroup size="small" >
                    <Button><Icon type="md-play" /> 
                    <!-- <Icon type="md-pause" /> -->
                    </Button>
                    <Button @click="openFolder(item.dir)"><Icon type="md-folder" /></Button>
                    <Button><Icon type="md-trash" /></Button>
                </ButtonGroup>
           </Col>
         </Row>
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
      /**
       * 下载
       */
      search(e){
        let item = {
          id: this.$data.downloadItems.length,
          title: '--', 
          progress: 0,
          url: 'https://www.91porn.com/view_video.php?viewkey=1309503227&page=&viewtype=&category=',
          status: 0, //0解析 1解析完成 2下载  3下载暂停  4下载失败  5下载完成 6解析失败
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
          // 发送地址解析请求
          socket.send(JSON.stringify(message)); 

          // 监听消息
          socket.onmessage = function(event) {
            console.log(event)
            item = JSON.parse(event.data)
            if(item.do === 'new_mission'){
              that.$data.downloadItems[item.item.id].title = item.item.title
              that.$data.downloadItems[item.item.id].status = item.item.status
              that.$data.downloadItems[item.item.id].dir = item.item.dir
              console.log(that.$data)
              // if(){

              // }
            }
          }; 

          // 监听Socket的关闭
          // socket.onclose = function(event) { 
          //   console.log('Client notified socket has closed',event); 
          // }; 

          //socket.close() 
        };  

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
  .font-success{
    color: #19be6b;
  }
  .font-normal{
    color: #515a6e;
  }
</style>
