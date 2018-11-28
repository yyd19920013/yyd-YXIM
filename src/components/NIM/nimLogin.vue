<template>
    <div class="nimLogin">
        <nimHeader
            :parent="parent"
            :controlPageName="'nimLogin'"
            :title="'登录'"
        />

        <section class="content">
            <ul class="loginInfo">
                <li>
                    <span>账号：</span>
                    <div class="right">
                        <select v-model="accountIndex">
                            <option
                                v-for="(item,index) in accountArr"
                                :value="index"
                            >
                                {{item}}
                            </option>
                        </select>
                    </div>
                </li>
                <li>
                    <span>令牌：</span>
                    <div class="right">
                        <input :value="tokenArr[accountIndex]" readonly="true" type="text" />
                    </div>
                </li>
            </ul>

            <button
                class="login"
                type="button"
                @click="login"
            >
                登录
            </button>
        </section>
    </div>
</template>

<script>
    import nimHeader from './nimHeader';
    import nimInit from './nimInit';
    import {lStore} from 'js/yydjs';

    export default{
        data(){
            return{
                accountIndex:0,
                accountArr:[
                    'yyd1',
                    'yyd2',
                    'yyd3',
                    'yyd4',
                    'yyd5',
                    '68dce8785829403298f366b29bd4d3c7',
                    '806b88ab8037468c9cd1ef343cac2ed7',
                    'f4316656777b4b2a8fc8a41c527673da',
                ],
                tokenArr:[
                    'a7a1145cc852fd504e4e16d33d45323b',
                    'bc671970b28ed82b408acf473944b572',
                    'fd6733a5c421c5700e20e8af115f1744',
                    'ee0ddfda5d81fb7b1f8e7cc67aefb418',
                    'ae5bf35afeb0b1dba808bd68a2e700b5',
                    'effdea0dc947f71653a0c980301feb8f',
                    '93207138b2f5a55298090d502b7b1f81',
                    'ddb2591b72e0233e593ffd496f938eef',
                ],
            }
        },

        /*

        */

        props:{
            parent:{
                required:true,
                type:Object,
                default:null,
            },
        },

        methods:{
            login(){
                lStore.set('account',this.accountArr[this.accountIndex]);
                lStore.set('token',this.tokenArr[this.accountIndex]);

                window.controlPage('nimLogin','nimLoginWrap',false);

                nimInit();
            },
        },

        components:{
            nimHeader,
        },
    }
</script>

<style lang="scss" scoped>
    @import '~css/public.scss';

    .nimLogin{
        .content{
            .loginInfo{
                padding-top: 100px;
                li{
                    height: 40px;
                    line-height: 40px;
                    margin-bottom: 20px;
                    >span{
                        float: left;
                        width: 50px;
                    }
                    .right{
                        overflow: hidden;
                        height: 100%;
                        select,input{
                            width: 100%;
                            height: 100%;
                        }
                    }
                }
            }
            .login{
                width: 100%;
                margin-top: 50px;
                height: 40px;
            }
        }
    }
</style>