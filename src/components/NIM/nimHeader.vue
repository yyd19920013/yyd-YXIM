<template>
    <header class="nimHeader">
        <div class="nimHeaderWrap">
            <a
                class="arrow"
                @click="closePage"
            >
            </a>
            <h2 class="title overflow">{{title}}</h2>
        </div>
    </header>
</template>

<script>
    export default{
        data(){
            return{

            }
        },

        /*
            <nimHeader
                :parent="parent"
                :controlPageName="'nimLogin'"
                :title="'登录'"
            />
        */

        props:{
            parent:{
                required:true,
                type:Object,
                default:null,
            },
            controlPageName:{
                required:true,
                type:String,
                default:'',
            },
            title:{
                type:String,
                default:'标题',
            },
        },

        methods:{
            closePage(){
                let {parent,controlPageName}=this;

                if(parent&&controlPageName){
                    parent.pageControl[controlPageName]=false;
                }
            },
        },
    }
</script>

<style lang="scss" scoped>
    @import '~css/public.scss';

    .nimHeader{
    	width: 100%;
        height: 40px;
        line-height: 40px;
        border-bottom: 1px solid #ddd;
        background-color: #fff;
        position: fixed;
        left: 0;
        top: 0;
        z-index: 1000;
        .nimHeaderWrap{
            width: 100%;
            height: 100%;
            line-height: 40px;
            background-color: #fff;
            position: absolute;
            .arrow{
                width: 50px;
                padding: 5px 0;
                padding-left: 20px;
                height: 100%;
                position: absolute;
                left: 0;
                top: 0;
                z-index: 10;
                &:before{
                    display: inline-block;
                    content: "";
                    width: 20px;
                    height: 20px;
                    border: 2px solid #999;
                    border-right: none;
                    border-bottom: none;
                    transform: rotate3d(0,0,1,-45deg) scale(.8,.8);
                }
            }
            .title{
                padding: 0 50px;
                height: 100%;
                text-align: center;
            }
        }
    }
</style>