<template>
    <div class="detail-view-container">
        <div class="detial-view-uni_info">
            <h3 class="university-name">Jönköping university</h3>
            <span class="university-location">Jönköping, Swden</span>
            <img class="univeristy-img">
            <p>Programme:</p>
            <p>Academic Level:</p>
            <p>Fit:</p>
            <p>Contact:</p>
            <p>Webpage:</p>
        </div>
        <div class="detial-view-course-info">
            <h3>Courses Covered</h3>
            <div class="course-box">
                <div class="guest-univerity-course">Hello</div>
                <div class="home-univerity-course">Is it my me?</div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        data(){
            return{
                testData: "Sweden"
            }
        },
        methods:{

        }
    }
</script>

<style lang="scss" >

    .detail-view-container{
        display: flex;
        flex-direction: row;
        position: fixed;
        top: 60%;
        left: 55%;
        transform: translate(-50%, -50%);
        height: 70vh;
        width: 100vh;
        padding: 15px;
        background-color: rgba(255, 255, 255, 0.7);
        box-shadow: 0px 0px 30px 0 rgba(0,0,0,0.5);
        border-radius: 15px;
        z-index: 1;

        .detial-view-uni_info{
            display: flex;
            flex-direction: column;
            justify-content: space-evenly;
            width: 39%;
            height: 100%;
            margin: 0 10px;
            padding: 15px;
            background-color: #fff;
            border-radius: 15px;
            box-shadow: 0px 0px 10px 0 rgba(0,0,0,0.5);
            z-index: 2;

            .university-name{
                font-size: 1.2em;
                font-weight: 500;
                text-align: center;
            }

            .university-location{
                font-size: 0.8em;
                font-weight: 200;
                text-align: center
            }

            .univeristy-img{
                width: 100%;
                height: 100px;
                background-color: grey;
                margin: 20px 0;
            }

            p {
                font-size: 0.7em;
                font-weight: normal;
                text-align: left;
            }
        }

        .detial-view-course-info{
            display: flex;
            flex-direction: column; 
            width: 61%;
            height: 100%;
            margin: 0 10px;
            padding: 15px;
            background-color: #fff;
            border-radius: 15px;
            box-shadow: 0px 0px 10px 0 rgba(0,0,0,0.5);
            z-index: 2;

            h3{
                font-size: 1.2em;
                font-weight: 500;
                text-align: center;
            }

            .course-box{
                display: flex;
                flex-direction: row;
                justify-content: space-around;
                margin: 10px 0;
                padding: 10px;
                width: 100%;
                height: 25%;
                background-color: #c7c7c7;
                border-radius: 15px;
                box-shadow: 0px 0px 10px 0 rgba(0,0,0,0.7);
                z-index: 3;

                .guest-univerity-course{
                    font-size: 0.7em;
                    font-weight: normal;
                    text-align: left;
                }

                .home-univerity-course{
                    font-size: 0.7em;
                    font-weight: normal;
                    text-align: left;
                }
            }
        }

    }


</style>