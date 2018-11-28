<template>
    <div class="addressAdminIndex">
        <header1
            title="地址管理"
        />

        <section class="content">
            <ul class="addressList">
                <li v-for="(item,index) in addressList">
                    <div class="main">
                        <h3>吴彦祖 1825777777</h3>
                        <h4>浙江省杭州市滨江区长河街道越达巷92号</h4>
                    </div>
                    <div class="end">
                        <label>
                            <input type="radio" />
                            默认地址
                        </label>
                        <div class="handleWrap">
                            <a>编辑</a>
                            <a>删除</a>
                        </div>
                    </div>
                </li>
            </ul>
        </section>
    </div>
</template>

<script>
    export default{
        data(){
            return{
                query:this.$router.currentRoute.query,
                addressList:[1,2,3],
            }
        },

        mounted(){

        },

        methods:{

        },

        components:{

        },
    }
</script>

<style lang="scss" scoped>
    @import '~css/public.scss';

    .addressAdminIndex{
        .content{
            .addressList{
                >li{
                    padding-left: $padding;
                    margin-bottom: 10px;
                    background-color: #fff;
                    .main{
                        padding: 10px 0;
                        padding-right: $padding;
                        border-bottom: $border1;
                        h3{
                            font-size: 16px;
                        }
                        h4{
                            color: #999;
                        }
                    }
                    .end{
                        display: flex;
                        justify-content: space-between;
                    }
                }
            }
        }
    }
</style>