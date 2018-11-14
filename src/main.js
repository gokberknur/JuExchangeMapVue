import Vue from 'vue';
import App from './App.vue';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
//import citydata from './city.json'
//import universitydata from './city.json'


 
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

Vue.use(ElementUI);

new Vue({
  el: '#app',
  data:{
    city: []
    
  },
  methods:{

  },
  render: h => h(App)
  
})
