import Vue from 'vue'
import App from './App.vue'
//import citydata from './city.json'
//import universitydata from './city.json'


 
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

new Vue({
  el: '#app',
  data:{
    city: []
    
  },
  methods:{

  },
  render: h => h(App)
  
})
