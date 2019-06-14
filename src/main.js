import Vue from 'vue';
import App from './App.vue';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
//import citydata from './city.json'
//import universitydata from './city.json'




import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faCoffee } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

library.add(faCoffee)

Vue.component('font-awesome-icon', FontAwesomeIcon)

Vue.config.productionTip = false

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
