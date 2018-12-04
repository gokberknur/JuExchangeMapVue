<template>
<div id="app">
  <div class="map" id="map"></div>
     <el-row class=" top-area">
        <el-col 
        class="logo-area"
        :span="6"> 
        <img class="exchange_logo" src="src\assets\images\go_exchange_logo_medium.png">           
        </el-col>
        <el-col 
        :span="18"
        >
          <div 
          class="filter-area">
          <div class="filter-header"><img class="ju-logo" src="src\assets\images\JU_A_neg_72.png"></div>
          <img class="filter_icon" src="src\assets\images\filter_icon_black.png">
          <div class="filter-selection-area">
            <label class="filter-selection-area-header">Level</label>
             <multiselect 
              :multiple="false"
              v-model="selectedStudyLevel"
              :options="studyLevelMenu"
              placeholder="select your level"
              label="level"               
             >
             </multiselect>
            <label class="filter-selection-area-header">Programme</label>
             <multiselect 
              :multiple="true"
              v-model="selectedProgramme"
              :options="programmeDropdownMenu"
              placeholder="select program"
              label="title" 
              track-by="title"
             >
             </multiselect>

            <label class="filter-selection-area-header">Country</label>
             <multiselect 
              :multiple="true"
              v-model="selectedCountry"
              :options="countries"
              placeholder="select country"
              label="country" 
              track-by="country"            
             >
             </multiselect>

            <label class="filter-selection-area-header">University</label>
             <multiselect 
              :multiple="true"
              v-model="selectedUniversity"
              :options="universities"
              placeholder="select Uni"
              label="name" 
              track-by="name"
              sort-by ="name"
             >
             </multiselect>
             
            </div>
            <FilterList :list="filteredUniList"/>
          </div>  
        </el-col>
    </el-row>   
    <DetailView/>
    
</div>       

</template>

<script>
  import data from './API/city.json'
  import L from 'leaflet'
  import 'leaflet/dist/leaflet.css'

  

  
  //Components
  import FilterList from './components/filterList.vue'
  import DetailView from './components/detailView.vue'
  import Multiselect from 'vue-multiselect'

  import axios from 'axios';

  
  delete L.Icon.Default.prototype._getIconUrl

L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png')
})


export default {
  name: 'app',
  components:{
    FilterList, Multiselect,
  },
  data () {
    return {
      selectedCountry: null,
      selectedUniversity: null,
      selectedProgramme: null,
      selectedStudyLevel: null,

      

      studyLevelMenu: [{
        level:'Bachelor'},
        {level: 'Master'}],

      
      // defining required variables for API calls 
      coursePackage: [],
      packages: [],
      universities: [],
      countries: [],
      programmes:[],
      filteredUniList: [],
      programmeDropdownMenu: [],
      programmeDropdownMenuRestore: [],
      

      map: null,
      tileLayer: null,
      newdata: null,
    
      apidata: [],
      
  }
    },
  mounted() {
    this.initMap();
    
    
    // API calls below
    axios.get('http://localhost/exchange/public/api/universities')
    .then(response => (this.universities= response.data.data, this.filteredUniList = this.universities))
      .then( addcords => {
      return this.addCoordsArray()
      })
      .then( showmarkers => {
      return this.addMarkers()
   })
   
    
    axios.get('http://localhost/exchange/public/api/coursepackage')
    .then(response => (this.coursePackage= response.data.data))

    axios.get('http://localhost/exchange/public/api/packages')
    .then(response => (this.packages= response.data.data))
    
     axios.get('http://localhost/exchange/public/api/country')
    .then(response => (this.countries= response.data.data))

     axios.get('http://localhost/exchange/public/api/programmes')
    .then(response => (
          this.programmes= response.data.data,
          this.programmeDropdownMenu = response.data.data,
          this.programmeDropdownMenuRestore = response.data.data))

    
  },

  methods: {
    
        //without  coords object in array its not possible to add markes on map
        // so this function adds coords object and type attribute to our array which we get from universities api endpoint
    addCoordsArray(){
        // adds coords array to api object          
        this.universities.forEach((element) => {
        element.type ="marker";
         //this is important otherwise adding markers function will crash
        if(element.latitude && element.longitude){
        element.coords =[];
        element.coords[0]= element.latitude;
        element.coords[1]= element.longitude;
        }
      })
      
     },

    updateLevelSelection(){
            // This function filters course programme menu according to study level selection
            let level = this.selectedStudyLevel.level;
            this.programmeDropdownMenu = [];
            this.programmes.forEach((programme) => {
                if(programme.level == level){
                  this.programmeDropdownMenu.push(programme)
                }
            });
    },

    applyFilters(valueOfSelectedCountry){
        if(valueOfSelectedCountry ){
         this.filteredUniList = [];
        }
        else{
          this.filteredUniList = [];
        }
        console.log(valueOfSelectedCountry);
        console.log(this.selectedCountry.length)
      //we have to use arrow function here for using this keyword for accesing data.
      // without arrow function "this" keyword won't work.
          if(this.selectedCountry.length != 0) {
            
            this.selectedCountry.forEach((countryfilter) => {
                this.universities.forEach((unielement) => {
                  if(unielement.country == countryfilter.country) {
                  this.filteredUniList.push(unielement)
                  }
                });
            });
          }
          else {
        //show all ?
          }
    },

    addMarkers(){

        this.layerGroup.clearLayers() //Clears current layers on map (markers)
        this.filteredUniList.forEach((uni) => {
            if(uni.coords){ //if coords object(which is an array) exists in filteredUniList, run following
            uni.leafletObject = L.marker(uni.coords) //Create marker for selected coordinates
            .bindPopup(uni.name) //Adds popup attribute to Leaflet Object
            this.layerGroup.addLayer(uni.leafletObject); // Adds layers to map (markers)
            }
        }); 
       
    },
   
    initMap() {

      this.map = L.map('map').setView([38.63, -90.23], 3);
      this.map.zoomControl.setPosition('bottomleft');
      this.layerGroup = L.layerGroup([]);
      this.map.addLayer(this.layerGroup);
      this.tileLayer = L.tileLayer(
        'https://cartodb-basemaps-{s}.global.ssl.fastly.net/rastertiles/voyager/{z}/{x}/{y}.png',
        {
          maxZoom: 18,
          attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, &copy; <a href="https://carto.com/attribution">CARTO</a>',
        }
      );
        
      this.tileLayer.addTo(this.map);
    },
  },
  watch: {
        // Here we are checking if any filtering applied by user

  selectedStudyLevel:

        function(){
              if(this.selectedStudyLevel != null) {
              this.updateLevelSelection();
              }
              else{
                // reset programme selection menu
                this.programmeDropdownMenu = this.programmeDropdownMenuRestore;
                
              }
        },

  selectedCountry: 
            
            function(valueOfSelectedCountry){
            
            if(this.selectedCountry != null){
            this.applyFilters(valueOfSelectedCountry);
                      
            //this.layerGroup.clearLayers();  
            this.addMarkers();
                  }
            else  {
              // show all unis maybe?
              alert("something")
              console.log("its empty")
            }

                  
      //when selected country value changes, do the updates
      // change universities for example, according to their countries.
      
  },
  
},
}

</script>
<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>

<style lang="scss" scoped>
/*@import './assets/scss/variables.scss';*/

  #map{
    position: fixed;
    left: 0;
    top: 0;
    height: 100vh;
    width: 100vw;
  }

  .dev-box{
    display: flex;
    flex-direction: column;
    position: fixed;
    bottom: 1%;
    left: 1%;
    height: fit-content;
    width: 250px;
    padding: 15px;
    background-color: rgba(255, 255, 255, 0.7);
    border-radius: 15px;
    box-shadow: 0px 0px 41px -2px rgba(0,0,0,0.5);

    h2{
      font-size: 18px;
      font-weight: bold;
    }
    .dev-list{
      margin: 10px 25px;
    }
  }

  .top-area{
    position: fixed;
    left: 1%;
    top: 1%;
    height: fit-content;
    width: 100vw;
  }

  .exchange_logo{
    position: fixed;
    top: 1%;
    left: 1%;
    max-width: 17%;
    max-height: 17%;
  }


    .filter-area{
      position: fixed;
      right: 0;
      top:0;
      display: flex;
      flex-direction: column;
      width: 23%; 
      height: 100vw;
      background-color:rgba(255, 255, 255, 0.9);
      box-shadow: -12px 0px 6px rgba(0, 0, 0, 0.25);
      color: #000;

      .filter-header{
        position: relative;
        top: 0;
        right: 0;
        width: 100%;
        height: 4%;
        background-color: #774299;
        margin-bottom: 5px;

        .ju-logo{
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          max-width: 50%;
          max-height: 50%
        }
      }

      .filter_icon{
        position: absolute;
        top: 5%;
        right: 5%;
        max-width: 7%;
        max-height: 7%;
      }

        .filter-selection-area{
          display: flex;
          flex-direction: column;
          justify-content: space-evenly;
          padding: 25px;
          height: 300px;
          width: 100%;
          box-shadow: 0 8px 6px -6px rgba(0, 0, 0, 0.25);

          &:before{
            content: "";
            position: absolute;
            top: 0;
            right: 0;
            width: 60px;
            height: 60px;
            background-size: 50%;
            background-repeat: no-repeat;

          }

          .filter-selection-area-header{
            margin-bottom: 0 !important;
            font-size: 1.2em;
            font-weight: 700;
            color: rgb(56, 56, 56);
          }

        }

        &:before{
          background-image: -moz-element();
        }

    }
   

/*Custom Scollbar*/
  ::-webkit-scrollbar {
      width: 10px;
  }
  ::-webkit-scrollbar-track {
      background: #f1f1f1;
      border-radius: 10px;
  }
  ::-webkit-scrollbar-thumb {
      background: #774299; 
      border-radius: 10px;
  }
  ::-webkit-scrollbar-thumb:hover {
      background-color: #522e69 !important;
  }
  

  /*Element UI custom styling*/
  .el-dropdown-menu{
    top: 100px !important;
    background-color: #774299 !important;
  }

  .el-dropdown-menu__item{
    color: #fff !important;
  }

  .el-dropdown-menu__item:hover{
    background-color: #522e69 !important;
  }  
  
 
  
</style>
