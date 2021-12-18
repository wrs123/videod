<template>
  <Row justify="center"> 
      <Col span="18" offset="2"><Input search enter-button placeholder="Enter something..."  @on-search="search" v-model="value"/></Col>
      <!-- <Button type="primary" @click="startProxy">开启</Button> -->
      <span>{{status == 1 ? '下载中': '已完成'}}</span>
    </Row>
    
</template>

<script>

  import {ipcRenderer} from 'electron';
  export default {
    name: 'index-page',
    methods: {
      
    }, 
    data(){
      return {
        value: '',
        status: 0
      }
    },
    created(){
      ipcRenderer.on('re_do', (event, arg) => {
        if(arg.code == 0){
          console.log(arg)
          this.$data.status = 0
        }
      })
    },
    methods: {
      search(e){
         this.$data.status = 1
        let url = 'https://www.91porn.com/view_video.php?viewkey=1309503227&page=&viewtype=&category='
        ipcRenderer.send('do', url);
      },
      startProxy(){
       
        ipcRenderer.send("set_proxy", {
          http_proxy: "127.0.0.1:7890"
        });
      }
    }
  }
</script>

<style lang="scss" scoped>
  
</style>
