<template>
           <div class="filter-list-area">
              <div class="floating-item">Available Universities</div>
            <ul class="filter-list-item-area"> 
             
              <li class="filter-list-item " v-for="(items, key) in packages" >
                <div>
                  <span class="match_rating"><p>{{items.match_value}}</p></span>
                </div>
                <div class="filter-list-item-info" >
                  <h3>{{items.partner_university}}</h3>
                  
                  <button class="show-courses" v-on:click="showCourses(key)"> {{"Show Courses"}} <font-awesome-icon icon="angle-down" /></button>
                    <div class="available-courses-box">
                      <div class="available-courses" v-for="availableCoursesList in availableCourses" > 
                        <div v-for="courseList in courses">
                        <transition name="courses">  
                          <div class="courses2" v-show="showMoreText[key]">              
                          <p v-if="availableCoursesList.Pu_Id == items.pu_Id && courseList.Id == availableCoursesList.Course_Id">
                            {{courseList.name}}                       
                          </p>                         
                          </div>
                        </transition>
                       </div>  
                      </div>
                    </div>
                 

                  <button class="apply-button" v-on:click="applyButton(items,key)"> {{"Apply"}} </button>
  
                      
                      
                         
                 </div>
               </li>
               
             </ul>
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

  import testdata from '../App.vue'

    export default {
      
        data (){
            return{
                text: 'Show Courses',
                show: true,
                showMoreText: [],


            }
        },
        props: {
          title: String,
          likes: Number,
          isPublished: Boolean,
          commentIds: Array,
          author: Object,
          testuni: Array,
          courses: Array,
          university: Array,
          packages: Array,
          availableCourses: Array,
          coursePackage: Array,
        },
        
        methods:{
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
            afunction(){
            console.log(this.show);
            },
          changeText(){
            let box = document.getElementsByClassName("available-courses-box");

            if(this.show){
              this.text = 'Hide Courses'
              box.classList.remove("box-show-style");
            }
            else{
             this.text = "Show Courses"
             box.classList.add("box-show-style"); 
            }
          }
            

        },
        mounted() {
          this.afunction();
        },

       watch: {
         show: 
         function() {
         this.afunction()
         this.changeText()
         }
       },
       
    }
</script>

<style lang="scss" >
    .filter-list-area{
    position: relative;
    right: 0;
    top: 0;
    width: 100%;
    height: 60%;
    padding: 15px;
    overflow-y: scroll;

    .floating-item{
      position: fixed;
      right: 50px;
      transform: translate(-50%);
      width: 200px;
      height: 50px;
      border-radius: 25px;
      padding: 5px 10px;
      background: #DDDDDD;
      color: #522e69;
      text-align: center;
      font-weight: bold;
      box-shadow: 0px 0px 20px 0 rgba(0,0,0,0.4);
      z-index: 99999;
    } 

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
      padding: 30px 30px 0 15px;
      margin: 15px 0;
      list-style-type: none;

      
      
      .filter-list-item{  
        display: flex;
        flex-direction: row;
        width: 100%;
        height: fit-content;
        padding: 15px 10px;
        margin: 30px 0  ;
        background-color: #fff;
        border-radius: 5px;
        box-shadow: 0px 0px 20px 0 rgba(0,0,0,0.4);

        &> div{

            .match_rating{
            display: block;
            width: 40px;
            height: 40px;
            background-color: #888;
            border-radius: 50%;

            p{
              text-align: center;
              vertical-align: middle;
              color: #fff;
              font-weight: bold;
              margin: 0 !important;
              padding-top: 20%;
            }
          }
        }
        .filter-list-item-info{
          position: relative;
          text-align: left;
          padding-left: 5px;
          
          h3{
            font-weight: bold;
            font-size: 18px;
          }

          .show-courses{
            border: none;
            background: none; 
            color: #262626;
            font-weight: bold;

            &:hover{
              color: #565656;
            }
          }

          .box-show-style{
            background: rgb(217,217,217);
              background: linear-gradient(180deg, rgba(217,217,217,1) 0%, rgba(255,255,255,1) 100%, rgba(0,212,255,1) 100%);
              box-shadow: 
                inset 0px 11px 8px -10px #CCC,
                inset 0px -11px 8px -10px #CCC;

          }

          .available-courses-box{
              height: fit-content;
              width: 150%;
              padding: 5px 10px;
              
              
            .available-courses{
                color: #565656;

            }
          }


          .apply-button{
            position: relative;
            left: 175%;
            height: 35px;
            width: fit-content;
            padding: 5px 10px;
            background-color: #774299;
            border-radius: 3px;
            border: none;
            color: #fff;

            &:hover{
              background-color: #522e69;  
            }
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

