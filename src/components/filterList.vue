<template>
        
        <div class="filter-list-area">
            <ul class="filter-list-item-area"> 
              <li class="filter-list-item " v-for="(items, key) in list">
                <div>
                  <img class="fit_rating">
                </div>
                <div class="filter-list-item-info" >
                  <h3>{{items.name}}</h3>
                  <p>{{items.city}}</p>
                  <span>Match</span>
                </div>
              </li>
              <li class="filter-list-item">
              </li> 
            </ul>
        </div>
</template>

<script>
  import testdata from '../App.vue'

    export default {
        data (){
            return{
                testFilter: 'Sweden',
                testuni: testdata.universities,
            }
        },
        props: {
          title: String,
          likes: Number,
          isPublished: Boolean,
          commentIds: Array,
          author: Object,
          testuni: Array,
          list: Array,
        },
        
        methods:{
            afunction(){
            console.log("filterList.vue has loaded");
            }
        },
        mounted() {
          this.afunction();
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

