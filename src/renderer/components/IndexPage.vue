<template>
  <div>
    <Input v-model="value" placeholder="Enter something..." style="width: 300px" />
    <Icon type="ios-checkmark" />
  </div> 
</template>

<script>

  export default {
    name: 'index-page',
    methods: {
      
    },
    data(){
      return {
        value: 1
      }
    }
  }
</script>

<style>

  
</style>
