<template>
    <el-row>
      <el-col>
        <div class="filter-list-area">
            <div class="added-filter">
                <el-tag
                 closable
                >
                  {{ testFilters }}
                </el-tag>
                 <el-tag
                 closable
                  >
                  Filter ABCDEF
                </el-tag>
                 <el-tag
                 closable
                  >
                  Filter ABCDEF
                </el-tag>
            </div>
            <ul class="filter-list-item-area"> 
              <li class="filter-list-item">
                <div>
                  <img class="fit_rating">
                </div>
                <div class="filter-list-item-info">
                  <h3>Jönköping University</h3>
                  <p>Jönköping , Sweden</p>
                  <span>Match</span>
                </div>
              </li>
              <li class="filter-list-item">
              </li> 
            </ul>
        </div>
      </el-col>
    </el-row>
</template>

<script>
  import testdata from '../App.vue'

    export default {
        data (){
            return{
                testFilter: 'Sweden',
                testuni: this.universities
            }
        },
        
        methods:{
            afunction(){
            console.log("IAm BIG");
            }
        },
        mounted() {
          this.afunction();
        },
        
       
    }
</script>

<style lang="scss" >
    .filter-list-area{
    position: absolute;
    left: 1%;
    top: 120px;
    width: 300px;
    height: 80vh;
    background-color: rgba(255, 255, 255, 0.7);
    box-shadow: 0px 0px 30px 0 rgba(0,0,0,0.5);
    border-radius: 15px;
    padding: 15px;

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
        border-radius: 10px;
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

