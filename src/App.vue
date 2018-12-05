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
          <div class="filter-header">
            
              
            
            <img class="ju-logo" src="src\assets\images\JU_A_neg_72.png">
          </div>
          <img class="filter_icon" src="src\assets\images\filter_icon_black.png">
          <div class="filter-selection-area">
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
             <label class="filter-selection-area-header">Programme</label>
             <multiselect 
              :multiple="true"
              v-model="selectedProgramme"
              :options="universityMenu"
              placeholder="select program"
              label="title" 
              track-by="title"
             >
             </multiselect>
            </div>
            <FilterList :list="filteredUniList"/>
          </div>  
        </el-col>
    </el-row>   
    <DetailView/>
      <div class="dev-box">
        <h2>Dev Box</h2>
        <div
          class="dev-list"
          v-for="layer in layers"
          :key="layer.id"
        >
        <label class="menu-list">
            <input
              class="form-check-input"
              type="checkbox"
              v-model="layer.active"
              @change="layerChanged(layer.id, layer.active)"
            />
            {{ layer.name }}
          </label>
        </div>
       </div> 
</div>       

</template>

<script>
  import data from './API/city.json'
  import L from 'leaflet'
  import 'leaflet/dist/leaflet.css'

  //test data
 // import universitydata from  './API/universities.json'
  import countrydata from     './API/country.json'
  import programdata from     './API/program.json'
  
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
    FilterList, Multiselect, DetailView
  },
  data () {
    return {

      selectedCountry: null,
      selectedUniversity: null,
      selectedProgramme: null,
      
      universityMenu: programdata.programme,

      countries: countrydata.countryArray,
      universities: [],
      programmes: programdata.programme,
      filteredUniList: [],
      currentMarkers: null,

    map: null,
    tileLayer: null,
    newdata: null,
    cities: data.city,
    
    apidata: [],
    layers: 
    
    [
      {
        id: 0,
        name: 'Universities',
        active: false,
        features: [
          {
            id: 0,
            name: 'Bogart\'s Smokehouse',
            type: 'marker',
            coords: [38.6109607, -90.2050322],
          },
          {
            Id: 1,
            city: 'Jönköping',
            country: 'Sweden',
            Country_Id: 1,
            type: 'marker',
            coords: [57.772805,14.1693235],
          },
          {
            "Id": "122",
            "city": "Salzburg",
            "country": "Austria",
            "Country_Id": "4",
            "type": 'marker',
            "coords": [77.772805,14.1693235],

          },
          {
            Id: 2,
            city: 'Salzburg',
            country: 'Austria',
            type: 'marker',
            Country_Id: 4,
            coords: [47.8027887,12.9863904],
          },
          {
            id: 3,
            name: 'Charlie Gitto\'s On the Hill',
            type: 'marker',
            coords: [38.617972, -90.2756436],
          },
          {
            id: 4,
            name: 'Sugarfire',
            type: 'marker',
            coords: [38.6304077, -90.1916921],
          },
          {
            id: 5,
            name: 'The Shaved Duck',
            type: 'marker',
            coords: [38.6036282, -90.2381407],
          },
          {
            id: 6,
            name: 'Mango Restaurant',
            type: 'marker',
            coords: [38.6313642, -90.1961267],
          },
          {
            id: 7,
            name: 'Zia\'s Restaurant',
            type: 'marker',
            coords: [38.6157376, -90.27716],
          },
          {
            id: 8,
            name: 'Anthonio\'s Taverna',
            type: 'marker',
            coords: [38.6143846, -90.280048],
          },
        ],
      },
      {
        id: 1,
        name: 'City/County Boundaries',
        active: false,
        features: [
          {
            id: 0,
            name: 'City of St. Louis',
            type: 'polygon',
            coords: [
              [38.770547, -90.168056],
              [38.753816, -90.177326],
              [38.747390, -90.183849],
              [38.731456, -90.206337],
              [38.719805, -90.212002],
              [38.706142, -90.210629],
              [38.692879, -90.202217],
              [38.680150, -90.189857],
              [38.665139, -90.182991],
              [38.646774, -90.179729],
              [38.630818, -90.179214],
              [38.615663, -90.183849],
              [38.601713, -90.190201],
              [38.587759, -90.204620],
              [38.577427, -90.219212],
              [38.564140, -90.232258],
              [38.545615, -90.248566],
              [38.531650, -90.257664],
              [38.538901, -90.270023],
              [38.548702, -90.273113],
              [38.561053, -90.294399],
              [38.574072, -90.309334],
              [38.596346, -90.320320],
              [38.614054, -90.314827],
              [38.632159, -90.304527],
              [38.651198, -90.302296],
              [38.664067, -90.293713],
              [38.683768, -90.278263],
              [38.700650, -90.265388],
              [38.717662, -90.253887],
              [38.722349, -90.238266],
              [38.729715, -90.221272],
              [38.742302, -90.203934],
              [38.754886, -90.191746],
              [38.764792, -90.184021],
              [38.771350, -90.183334],
            ],
          },{
            id: 1,
            name: 'St. Louis County',
            type: 'polygon',
            coords: [
              [38.771216, -90.169601],
              [38.786740, -90.144196],
              [38.799049, -90.124283],
              [38.813496, -90.118790],
              [38.829010, -90.141449],
              [38.827405, -90.170975],
              [38.821521, -90.186081],
              [38.824731, -90.204620],
              [38.850938, -90.257492],
              [38.863771, -90.271912],
              [38.888361, -90.294571],
              [38.892102, -90.327530],
              [38.873929, -90.343323],
              [38.856285, -90.342636],
              [38.833289, -90.352936],
              [38.821521, -90.374908],
              [38.827940, -90.413361],
              [38.828475, -90.441513],
              [38.788345, -90.477905],
              [38.763186, -90.484772],
              [38.740695, -90.510178],
              [38.726233, -90.535583],
              [38.705339, -90.532837],
              [38.686046, -90.538330],
              [38.679614, -90.587769],
              [38.682294, -90.606308],
              [38.679614, -90.617981],
              [38.683902, -90.646820],
              [38.684438, -90.661926],
              [38.672645, -90.676346],
              [38.658169, -90.683899],
              [38.645299, -90.704498],
              [38.640473, -90.731277],
              [38.468106, -90.735397],
              [38.481545, -90.726471],
              [38.477782, -90.717545],
              [38.471331, -90.712738],
              [38.471869, -90.696945],
              [38.463267, -90.692139],
              [38.453051, -90.684586],
              [38.446060, -90.683899],
              [38.446598, -90.669479],
              [38.454126, -90.655060],
              [38.466493, -90.659180],
              [38.480470, -90.659180],
              [38.488532, -90.650253],
              [38.483695, -90.633087],
              [38.474557, -90.624161],
              [38.472406, -90.611115],
              [38.485845, -90.598755],
              [38.502505, -90.592575],
              [38.503042, -90.407181],
              [38.492294, -90.406494],
              [38.484232, -90.409241],
              [38.478320, -90.416107],
              [38.472406, -90.422287],
              [38.465418, -90.422287],
              [38.454664, -90.413361],
              [38.454664, -90.401688],
              [38.458428, -90.392761],
              [38.450900, -90.390015],
              [38.452513, -90.374908],
              [38.457353, -90.348129],
              [38.451438, -90.337830],
              [38.439069, -90.340576],
              [38.428849, -90.346069],
              [38.418628, -90.347443],
              [38.408406, -90.347443],
              [38.396568, -90.345383],
              [38.391186, -90.336456],
              [38.414862, -90.311737],
              [38.424546, -90.293198],
              [38.453051, -90.282898],
              [38.492832, -90.273972],
              [38.510565, -90.268135],
              [38.531516, -90.258522],
              [38.537693, -90.270538],
              [38.544138, -90.272598],
              [38.552730, -90.272598],
              [38.559710, -90.293541],
              [38.568032, -90.304871],
              [38.577695, -90.311050],
              [38.586552, -90.314827],
              [38.597285, -90.319977],
              [38.609896, -90.311737],
              [38.635646, -90.305557],
              [38.649321, -90.301437],
              [38.701856, -90.264702],
              [38.714447, -90.255089],
              [38.721144, -90.249939],
              [38.724358, -90.237579],
              [38.727572, -90.227623],
              [38.734536, -90.214920],
              [38.740963, -90.204620],
              [38.747925, -90.198097],
              [38.756225, -90.189514],
              [38.763721, -90.185051],
              [38.771752, -90.184708],
            ],
          },
        ],
      }
    ]
  }
    },
  mounted() {
    this.initMap(

    );
    this.initLayers();
    // this.loadData();
    

    axios.get('http://localhost/exchange/public/api/universities')
    .then(response => (this.universities= response.data.data,  this.apidata = response.data)
    .then(this.addCoordsArray())
)
    
    
    
        //this.countries = this.universities.data.country;

    //this.universities =this.apidata;
  },
  methods: {
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

    updateProgrammeMenu(){

    },

    updateAfterCountry(valueOfSelectedCountry){
        if(valueOfSelectedCountry){
         this.filteredUniList = [];
        }
        else{
           this.filteredUniList = [];
           //this.filteredUniList= universitydata.university;
        }
      console.log(valueOfSelectedCountry);
      //we have to use arrow function here for using this keyword for accesing data.
      // without arrow function "this" keyword won't work. FUCKING JS
           this.selectedCountry.forEach((element) => {
            this.universities.forEach((unielement)=>{
              if(unielement.country == element.country) {
                this.filteredUniList.push(unielement)
              console.log("pass");
            }

          });
               console.log(this.filteredUniList);
      });
    },
    initUniversityMarkers() {
        //This function adds leaflet Object attribute to all universities
        // and clears the map for the filtering new markers
       
        this.universities.forEach((uni) => {  
        const unimarkers = this.universities.filter(unis => unis.type === "marker");
      
        unimarkers.forEach((element) => {
        element.leafletObject = L.marker(element.coords)
        .bindPopup(element.name);
           //element.leafletObject.removeFrom(this.map);   
           //console.log(this.map._layers);
         
          
           // element.leafletObject.addTo(this.map);
          });
        });

    },

    addMarkers(){
        
      if(this.currentMarkers == null){
         this.filteredUniList.forEach((uni) => {
           console.log(Math.random())
           if(uni.coords){
            uni.leafletObject = L.marker(uni.coords)
            .bindPopup(uni.name)
            this.layerGroup.addLayer(uni.leafletObject);
             //this.currentMarkers.push(uni.leafletObject);
             }
          }); 
            
        }
      else
      {
            /*this.currentMarkers.forEach((element) => {
            this.currentMarkers.removeFrom(this.map);
            console.log(this.currentMarkers);
        });*/
       
          //  this.currentMarkers = null;
        
      }
    },

    //API CALL whic is not working now
    /*loadData() {
         

      this.$http.get('http://localhost/exchange/public/api/universities', function(data, status, request){
        if(status == 200)
        {
          self.apidata = data;
          console.log(self.apidata);
        }
        else {
          console.log("it doesnt work");
        }
      });
  },*/ 

      layerChanged(layerId, active) {
      const layer = this.layers.find(layer => layer.id === layerId);
      
      layer.features.forEach((feature) => {
        if (active) {
          feature.leafletObject.addTo(this.map);
        } else {
          feature.leafletObject.removeFrom(this.map);
        }
      });
    },
    initLayers() {
      this.layers.forEach((layer) => {
        const markerFeatures = layer.features.filter(feature => feature.type === 'marker');
        const polygonFeatures = layer.features.filter(feature => feature.type === 'polygon');
        
        markerFeatures.forEach((feature) => {
          feature.leafletObject = L.marker(feature.coords)
            .bindPopup(feature.name);
        });
        
          polygonFeatures.forEach((feature) => {
          feature.leafletObject = L.polygon(feature.coords)
            .bindPopup(feature.name);
        });
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
  selectedCountry: 
            
            function(valueOfSelectedCountry){
            
            if(this.selectedCountry){
            this.updateAfterCountry(valueOfSelectedCountry);
            this.initUniversityMarkers();
           
            
            this.layerGroup.clearLayers();  
            this.addMarkers();
                  }
            else if(lenght.this.selectedCountry == 0) {
              // show all unis
              alert("something")
              console.log("its empty")
            }

                  
      //when selected country value changes, do the updates
      // change universities for example, according to their countries.
      
  },
  universityMenu: 
    function() {
        if(this.universityMenu){

        }
        
    },

 filteredUniList:
          function() {

          }
    
  
},
}
</script>

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
            font-size: 1.1vw;
            font-weight: 700;
            color: rgb(56, 56, 56);
          }

        }

        &:before{
          background-image: -moz-element();
        }

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
