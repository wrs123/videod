<template>
  <div>
    <Row style="margin-top: 10px;">
       <Col span="18" offset="2"><Input search enter-button placeholder="Enter something..."  @on-search="search" v-model="value"/></Col>
      <!-- <Button type="primary" @click="startProxy">开启</Button> -->
    </Row>
    <Row style="margin-top: 15px;">
       <Col span="18" offset="2"> 
       <Card :padding=10>
         <span>{{item.title}}</span>
         <div class="download_detail">
           <div class="progress">
             <Progress :percent="item.progress" :stroke-width="5"  status="active" />
           </div>
           <div class="buttonGroup" style="width: 88px;">
             <ButtonGroup size="small" >
                <Button><Icon type="md-play" /> 
                <!-- <Icon type="md-pause" /> -->
                </Button>
                <Button @click="openFolder"><Icon type="md-folder" /></Button>
                <Button><Icon type="md-trash" /></Button>
            </ButtonGroup>
           </div>
         </div>
        </Card>
      </Col>
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
  const shell = require('electron').shell
  const os = require('os')

  export default {
    name: 'index-page',
    methods: {
      
    }, 
    data(){
      return {
        value: '',
        status: 0,
        item: {
          title: '学妹真骚 穿着男朋友送的高跟鞋和我啪啪',
          progress: 35,
          type: 0,
          path: "D:\\code\\electron\\videod\\download\\570450\\"
        }
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
      },
       openFolder(){
         console.log(this.$data.item.path)
          shell.showItemInFolder(this.$data.item.path)
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
