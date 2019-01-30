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
              @select="input_handler_programme"
              placeholder="select your level"
              label="level"               
             >
             </multiselect>
            <label class="filter-selection-area-header">Programme</label>
             <multiselect 
              :multiple="false"
              v-model="selectedProgramme"
              :options="programmeDropdownMenu"
              @select="input_handler_country"
              placeholder="select program"
              label="title" 
              track-by="title"
             >
             </multiselect>

            <label class="filter-selection-area-header">Country</label>
             <multiselect 
              :multiple="false"
              v-model="selectedCountry"
              @select="input_handler_uni"
              :options="countries"
              placeholder="select country"
              label="country" 
              track-by="country" 
                   
             >
             </multiselect>

            <label class="filter-selection-area-header">University</label>
             <multiselect 
              :multiple="false"
              v-model="selectedUniversity"
              :options="filteredUniList"
              placeholder="select Uni"
              label="name" 
              track-by="name"
              sort-by ="name"
             >
             </multiselect>
             
            </div>

            <FilterList 
            :universities="filteredUniList" 
            :coursePackage="coursePackage"
            :packages="filteredPackageList"

            :courses="courses"
            :availableCourses="availableCourses"
           />
            />
            
            
          </div>  
        </el-col>
    </el-row>   
    
    <DetailView 
            
    />
    
</div>       

</template>
<style>
 .courses-enter {
   opacity: 0;
 } 

 .courses-enter-active{
   transition: opacity 0.3s;
 }

 .courses-leave {

 }
 .courses-leave-active{
   transition: opacity 0.3s;
   opacity: 0;
 }
</style>
<script>


  import L from 'leaflet'
  import 'leaflet/dist/leaflet.css'

  
 import _ from 'lodash';    


  
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
    FilterList, Multiselect
  },
  data () {
    return {
      selectedCountry: [],
      selectedUniversity: [],
      selectedProgramme: [],
      selectedStudyLevel: [],
        showMoreText: [],
      

      studyLevelMenu: [{
        level:'Bachelor'},
        {level: 'Master'}],

      
      // defining required variables for API calls 
      availableCourses: [],
      coursePackage: [],
      packages: [],
      universities: [],
      countries: [],
      courses: [],
      countriesRestore :[],
      programmes:[],
      filteredUniList: [],
      filteredPackageList: [],
      programmeDropdownMenu: [],
      programmeDropdownMenuRestore: [],
      
      //show: false,
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
    .then(response => (
        this.universities= response.data.data, 
        this.filteredUniList =response.data.data))
      .then( addcords => {
      return this.addCoordsArray()
      })
      .then( showmarkers => {
      return this.addMarkers()
   })
   
    /// add courses
    // http://localhost/exchange/public/api/courses

    axios.get('http://localhost/exchange/public/api/courses')
    .then(response =>(this.courses = response.data.data))

    axios.get('http://localhost/exchange/public/api/coursepackage')
    .then(response => (this.coursePackage= response.data.data))

    axios.get('http://localhost/exchange/public/api/packages')
    .then(response => (this.packages= response.data.data))
    
     axios.get('http://localhost/exchange/public/api/country')
    .then(response => (
      this.countries= response.data.data,
      this.countriesRestore = response.data.data
      ))

     axios.get('http://localhost/exchange/public/api/programmes')
    .then(response => (
          this.programmes= response.data.data,
          this.programmeDropdownMenu = response.data.data,
          this.programmeDropdownMenuRestore = response.data.data))

    this.input_handler_programme()
    //this.addshow()
  },

  methods: {
    applyButton(items, key){

       // alert("you have applied to\n" + this.filteredPackageList[key].partner_university)

    },
    showCourses(index) {
        /*
          Adds a property to a reactive object, ensuring the new property is
          also reactive, so triggers view updates.
          https://vuejs.org/v2/api/#Vue-set
         */
        this.$set(this.showMoreText, index, ! this.showMoreText[index])
      },
    
    
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

    getMatchedCourses(filteredPackages){
      // getting courses that related university provides
      // matching filteredpackage list id with coursepackageid in here
      this.availableCourses = []

      filteredPackages.forEach((id) => {
        this.coursePackage.forEach((coursePacks) => { 
        if(id.Id == coursePacks.Package_Id)
           this.availableCourses.push(coursePacks)
           console.log(this.availableCourses.Course_name)
           //console.log(coursePacks.Course_name)

          });
      });
    },


    // filtering university according to programme selection
    // first step getting related packages and put into array called filteredPackageList
    updateProgrammeSelection(){
        this.filteredPackageList = [];
             this.packages.forEach((pack) =>{
            if(this.selectedProgramme.Id == pack.programme_Id){
              this.filteredPackageList.push(pack)
              }
           });
        //

       
        this.getMatchedCourses(this.filteredPackageList)
        
        


    },
   updateUniversityDropDownMenu(){
    // updating university dropdown menu
          
          this.filteredPackageList.forEach((element) => {
              this.universities.forEach((university) => {
              if(university.Id == element.pu_Id){
              this.filteredUniList.push(university)        
              console.log(university.Id)
              }
            });
         });
   },

   
    
    // input handlers for selections

    // reset programme menu after level selection
    input_handler_programme(){
      this.$nextTick(() => {
        	this.selectedProgramme = null
          this.selectedUniversity = null
          this.selectedCountry = null        
        })
    },
    // reset country value after programme selection
      input_handler_country(){
        this.$nextTick(() => {
        this.selectedCountry = null
        this.selectedUniversity = null          
        })
      },

      //reset uni value after country selection
      input_handler_uni(){
        // empty select university value after country selection
          this.$nextTick(() => {
        	this.selectedUniversity = null          
        })

      },
      

    applyFilter(){
        this.filteredUniList = this.universities
        
        if(this.selectedProgramme != null){
            this.updateProgrammeSelection()
            this.getMatchedCourses(this.filteredPackageList)
            
            this.filteredUniList =[]
            this.filteredPackageList.forEach((packages) => {
              this.universities.forEach((university) => {
                if(university.Id == packages.pu_Id){
                this.filteredUniList.push(university)        
                //console.log(university.Id)
                }
              })
            })
            
            this.countries = this.filteredUniList.filter(el =>
              el.country) 

             
              //removing duplicates thanks to lodash
              this.countries = _.uniqBy(this.countries, 'country')
             

        }
        if(this.selectedCountry != null){
            
           this.filteredUniList = this.filteredUniList.filter(el => 
              this.selectedCountry.country ===  el.country ) 
             

              // FUCK YES
              let newarray = this.filteredPackageList.filter( el => {
                return this.filteredUniList.some(f => {
                  return el.pu_Id === f.Id
                })
              })
              this.filteredPackageList = newarray
                
        }

        if(this.selectedUniversity != null) {
          this.filteredUniList = this.filteredUniList.filter(el=>
              el.name === this.selectedUniversity.name)
              
              // FUCK YES
              let newarray = this.filteredPackageList.filter( el => {
                return this.filteredUniList.some(f => {
                  return el.pu_Id === f.Id
                })
              })
              this.filteredPackageList = newarray
        }
        

    },

    addMarkers(){

        this.layerGroup.clearLayers() //Clears current layers on map (markers)
        this.filteredUniList.forEach((uni) => {
            if(uni.coords){ //if coords object(which is an array) exists in filteredUniList, run following
            uni.leafletObject = L.marker(uni.coords).on('click',  markerclick => {
             console.log(uni.coords) 
            }) //Create marker for selected coordinates
            .bindPopup(uni.name) //Adds popup attribute to Leaflet Object
            this.layerGroup.addLayer(uni.leafletObject)

            
             
            // Adds layers to map (markers)
            }
        }); 
       //this.layerGroup.on('click',
       //this.layerGroup.on('click', this.markerclick()) 

    },
   
   markerclick(){

     console.log('hello marker clicked')
     console.log()
   },

    initMap() {
      this.map = L.map('map').setView([38.63, -90.23], 3)
      this.map.zoomControl.setPosition('bottomleft')
      this.layerGroup = L.featureGroup()
      this.map.addLayer(this.layerGroup)

      
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
 filteredPackageList:
        function(){
        this.getMatchedCourses(this.filteredPackageList)
        this.showMoreText =[]


        },
  filteredUniList:
    function (){
    this.addMarkers()

    },
  selectedStudyLevel:

        function(){
              if(this.selectedStudyLevel != null) {
              this.updateLevelSelection();
              }
              else{
                this.programmeDropdownMenu = this.programmeDropdownMenuRestore
                // reset programme selection menu
               
              }
        },

  selectedCountry: 
            
            function(){
            
            if(this.selectedCountry != null){
              this.applyFilter()
            }
            else {
              this.applyFilter()
             this.input_handler_uni()

            }
      
  },


  selectedProgramme: 
       function () {
          if(this.selectedProgramme !=null){
            this.applyFilter()

          }
          else{
            this.filteredPackageList =[]
            this.countries = this.countriesRestore
            this.applyFilter()
            this.input_handler_programme()
          }
          


       },
  selectedUniversity:
    function (){
        if(this.selectedUniversity != null){
        this.applyFilter()
        }
        else{
          this.applyFilter()
        }
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
        max-width: 5%;
        max-height: 5%;
      }

        .filter-selection-area{
          display: flex;
          flex-direction: column;
          justify-content: space-evenly;
          padding: 25px;
          height: 300px;
          width: 100%;
          box-shadow: 0 8px 6px -6px rgba(0, 0, 0, 0.25);
          z-index: 99999999;

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
   .filter-list-area{
    position: relative;
    right: 0;
    top: 0;
    width: 100%;
    height: 60%;
    padding: 15px;
    overflow-y: scroll;

    .added-filter{
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;  
      justify-content: space-between;
      width: 100%;
      height: 150px;
      padding: 15px;
      /*grid-template-columns: fit-content(400px) fit-content(400px) 1fr;*/
      background-color: #fff;
      border-radius: 15px;
      box-shadow: 0px 0px 41px -2px rgba(0,0,0,0.5);
    }

    .filter-list-item-area{
      display: flex;
      flex-direction: column;
      /*overflow-y: scroll;*/
      width: inherit;
      padding: 0 30px 0 15px;
      margin: 15px 0;
      list-style-type: none;
      
      .filter-list-item{  
        display: flex;
        flex-direction: row;
        width: 100%;
        height: 120px;
        padding: 10px;
        margin: 15px 0;
        background-color: #fff;
        border-radius: 5px;
        box-shadow: 0px 0px 20px 0 rgba(0,0,0,0.4);

        &> div{

            .fit_rating{
            width: 30px;
            height: 30px;
            background-color: #888;
          }
        }
        .filter-list-item-info{
          text-align: left;
          padding-left: 5px;
          
          h3{
            font-weight: bold;
            font-size: 18px;
          }
        }
      }
    }

  }

   /*Custom Element UI */ 
  .el-tag{
    border-radius: 15px;
    background-color: #774299 !important;
    border:none;
    color: #fff;

    .el-icon-close{
      color:#fff !important;
    }
    .el-icon-close:hover{
      background-color: #522e69 !important;
    }
  }
 
  
</style>
