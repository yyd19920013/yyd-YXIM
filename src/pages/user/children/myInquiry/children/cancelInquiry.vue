<template>
    <div class="cancelInquiry">
        <header1
            title="取消问诊"
        />

        <section class="content">
            <div class="hint">
                为什么取消本次问诊预约
            </div>
            <ul class="causeList">
                <li v-for="(item,index) in causeList">
                    <a
                        :class="{
                            active:cIndex==index,
                        }"
                    >
                        {{item}}
                    </a>
                    <label :for="createId(index)" class="labelFor">
                        <input v-model="cIndex" :value="index" type="radio" :id="createId(index)" />
                    </label>
                </li>
            </ul>
            <div class="buttonWrap">
                <button
                    :class="{
                        button:true,
                        active:cIndex!=-1,
                    }"
                    type="button"
                >
                    确认取消
                </button>
            </div>
        </section>
    </div>
</template>

<script>
    export default{
        data(){
            return{
                query:this.$router.currentRoute.query,
                causeList:['已前往线下医院就诊','病情已经好转，不需要问诊','有事情，无法按时问诊','其他原因'],
                cIndex:-1,
            }
        },

        mounted(){

        },

        methods:{
            createId(index){
                return `cancelInquiry${index}`;
            },
        },

        components:{

        },
    }
</script>

<style lang="scss" scoped>
    @import '~css/public.scss';

    .cancelInquiry{
        .content{
            .hint{
                padding: 0 $padding;
                height: $height1;
                line-height: $height1;
                color: #999;
            }
            .causeList{
                background-color: #fff;
                >li{
                    padding: 0 $padding;
                    height: $height1;
                    line-height: $height1;
                    border-bottom: $border1;
                    position: relative;
                    &:last-of-type{
                        border-bottom: none;
                    }
                    a{
                        display: block;
                        background: url('../../../../../images/icon/ic_checkbox_nor.png') no-repeat right center;
                        background-size: 20px;
                        &.active{
                            background-image: url('../../../../../images/icon/ic_checkbox_sel.png');
                        }
                    }
                }
            }
            .buttonWrap{
                padding: 0 38px;
                padding-top: 30px;
                >button{
                    width: 100%;
                    height: $height1;
                    line-height: $height1;
                    border: none;
                    border-radius: 5px;
                    background-color: $gray;
                    color: #fff;
                    &.active{
                        background-color: $main;
                    }
                }
            }
        }
    }
</style>