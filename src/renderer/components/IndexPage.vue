<template>
  <div>
    <Row>
       <Col span="18" offset="2"><Input search enter-button placeholder="Enter something..."  @on-search="search" v-model="value"/></Col>
      <!-- <Button type="primary" @click="startProxy">开启</Button> -->
    </Row>
    <Row >
      <Col span="18" offset="2">
        <Alert type="success" v-if='status == 0' show-icon>
            下载完成
        </Alert>
        <Alert type="warning" v-if='status == 1' show-icon>
            下载中
        </Alert>
      </Col>
    </Row> 
  </div>
    
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
        status: 0,
      }
    },
    created(){
      // ipcRenderer.on('re_do', (event, arg) => {
      //   if(arg.code == 0){
      //     console.log(arg)
      //     this.$data.status = 0
      //   }
      // })
    },
    methods: {
      search(e){
        console.log("kaishishi")
         this.$data.status = 1
        let url = 'https://www.91porn.com/view_video.php?viewkey=1309503227&page=&viewtype=&category='
        
        ipcRenderer.invoke('start_do', this.$data.value).then(res => {
          if(res.code == 0){
          console.log(res)
          this.$data.status = 0
        }
        });
      }
     
    }
  }
</script>

<style lang="scss" scoped>
  
</style>
