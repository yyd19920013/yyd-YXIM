<template>
    <div class="nimAddressList">
        <div class="content scrollContainer">
            <ul class="addressList">
                <li class="notice">
                    <div class="title">
                        <span>通知</span>
                        <i v-if="sysMsgUnread.applyFriend>0">{{sysMsgUnread.applyFriend}}</i>
                    </div>
                    <div class="main">
                        <ul>
                            <li
                                v-if="item.type=='applyFriend'&&item.state=='init'&&!item.read"
                                v-for="(item,index) in sysMsgsList"
                            >
                                <div class="left">
                                    <h3>{{item.from}}</h3>
                                    <h4 class="overflow">{{item.ps}}</h4>
                                </div>
                                <div class="right">
                                    <a
                                        @click="passOrRejectFriendApply(1,item)"
                                    >
                                        同意
                                    </a>
                                    <a
                                        @click="passOrRejectFriendApply(0,item)"
                                    >
                                        拒绝
                                    </a>
                                </div>
                            </li>
                        </ul>

                        <ul>
                            <li
                                v-if="item.type=='teamInvite'&&item.state=='init'&&!item.read"
                                v-for="(item,index) in sysMsgsList"
                            >
                                <div class="left">
                                    <h3>{{item.from}}</h3>
                                    <h4 class="overflow">{{item.ps}}</h4>
                                </div>
                                <div class="right">
                                    <a
                                        @click="passOrRejectFriendApply(1,item)"
                                    >
                                        同意
                                    </a>
                                    <a
                                        @click="passOrRejectFriendApply(0,item)"
                                    >
                                        拒绝
                                    </a>
                                </div>
                            </li>
                        </ul>
                    </div>
                </li>
                <li>
                    <div
                        class="title"
                        @click="addFriend"
                    >
                        加好友
                    </div>
                </li>
                <li>
                    <div
                        class="title"
                        @click="createTeam"
                    >
                        创建群聊
                    </div>
                </li>
                <li class="friend">
                    <div class="title">
                        好友
                    </div>
                    <div class="main">
                        <ul>
                            <li
                                v-if="blacklistAcount.indexOf(item.account)==-1"
                                v-for="(item,index) in friendsList"
                            >
                                <span
                                    @click="toChat('p2p',item.account)"
                                >
                                    {{item.account}}
                                </span>
                                <div class="right">
                                    <a
                                        @click="addOrRemoveBlacklist(1,item.account,index)"
                                    >
                                        加入黑名单
                                    </a>
                                    <a
                                        @click="addOrRemoveMutelist(1,item.account,index)"
                                    >
                                        加入静音列表
                                    </a>
                                </div>
                            </li>
                        </ul>
                    </div>
                </li>
                <li>
                    <div class="title">
                        群聊
                    </div>
                    <div class="main">
                        <ul>
                            <li
                                v-for="(item,index) in teamsList"
                                @click="toChat('team',item.teamId)"
                            >
                                {{item.name}}
                            </li>
                        </ul>
                    </div>
                </li>
                <li class="blackList">
                    <div class="title">
                        黑名单
                    </div>
                    <div class="main">
                        <ul>
                            <li v-for="(item,index) in blacklist">
                                <span
                                    @click="toChat('p2p',item.account)"
                                >
                                    {{item.account}}
                                </span>
                                <div class="right">
                                    <a
                                        @click="addOrRemoveBlacklist(0,item.account,index)"
                                    >
                                        移除黑名单
                                    </a>
                                    <a
                                        @click="addOrRemoveMutelist(0,item.account,index)"
                                    >
                                        移除静音列表
                                    </a>
                                </div>
                            </li>
                        </ul>
                    </div>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
    import vm from 'src/main';
    import {sStore} from 'js/yydjs';

    export default{
        data(){
            return{
                friendsList:[],
                teamsList:[],
                blacklist:[],
                blacklistAcount:{},
                sysMsgsList:[],
                sysMsgUnread:{},
            }
        },

        /*

        */

        props:{

        },

        created(){
        	vm.$on('componentsUpdate',this.componentsUpdate);
            vm.$on('nimOnFriendsAll',this.getFriendsList);
            vm.$on('nimOnTeamsAll',this.getTeamsList);
            vm.$on('nimOnBlacklistAll',this.getBlacklist);
            vm.$on('nimOnSysMsgAll',this.getSysMsgsList);
            vm.$on('nimOnSysMsgUnreadAll',this.getSysMsgUnread);
        },

        beforeDestory(){
        	vm.$off('componentsUpdate',this.componentsUpdate);
            vm.$off('nimOnFriendsAll',this.getFriendsList);
            vm.$off('nimOnTeamsAll',this.getTeamsList);
            vm.$on('nimOnBlacklistAll',this.getBlacklist);
            vm.$off('nimOnSysMsgAll',this.getSysMsgsList);
            vm.$off('nimOnSysMsgUnreadAll',this.getSysMsgUnread);
        },

        methods:{
        	componentsUpdate(controlName){
            	if(controlName!='nimSearchFriend')return;
            	let {friends,teamMembers}=window.nimData;
            	
               	this.friendsList=friends;
                this.teamsList=teamMembers;
            },
            getFriendsList(res){
                this.friendsList=res;
            },
            getTeamsList(res){
                this.teamsList=res;
            },
            getBlacklist(res){
                this.blacklist=res;
                this.blacklistAcount=res.map((item,index)=>item.account);
            },
            getSysMsgsList(res){
                this.sysMsgsList=res;
            },
            getSysMsgUnread(res){
                this.sysMsgUnread=res;
            },
            toChat(scene,to){
                sStore.set('nimChat',{
                    scene,
                    to,
                });
                window.controlPage('nimChat','nimChatWrap',true);
            },
            addFriend(){
                window.controlPage('nimSearchFriend','nimSearchFriendWrap',true);
            },
            passOrRejectFriendApply(handleType,item){
                let {idServer,from}=item;

                nim[handleType==1?'passFriendApply':'rejectFriendApply']({
                    idServer,
                    account: from,
                    ps: handleType==1?'对方同意和你成为好友':'对方不想和你成为好友',
                    done: (error, obj)=>{
                        nim.getFriends({
                            done: (error, friends)=>{
                                if(!error){
                                    this.getFriendsList(friends);
                                }
                            },
                        });
                        nim.markSysMsgRead({
                            sysMsgs: item,
                            done: (error, obj)=>{
                                if(!error){
                                    alert(handleType==1?`你同意和【${from}】成为好友`:`你拒绝和【${from}】成为好友`);
                                }else{
                                    alert(error);
                                }
                            },
                        });
                    },
                });
            },
            addOrRemoveBlacklist(handleType,account,index){
                nim[handleType==1?'addToBlacklist':'removeFromBlacklist']({
                    account,
                    done: (error, obj)=>{
                        if(!error){
                            alert(handleType==1?`${account}已加入黑名单`:`${account}已移除黑名单`);
                            if(handleType==1){
                                this.blacklist.push({
                                    account,
                                });
                                this.blacklistAcount.push(account);
                            }else{
                                this.blacklist.splice(index,1);
                                this.blacklistAcount.splice(index,1);
                            }
                        }else{
                            alert(error);
                        }
                    },
                });
            },
            addOrRemoveMutelist(handleType,account,index){
                nim[handleType==1?'addToMutelist':'removeFromMutelist']({
                    account,
                    done: (error, obj)=>{
                        if(!error){
                            alert(handleType==1?`${account}已加入静音列表`:`${account}已移除静音列表`);
                        }else{
                            alert(error);
                        }
                    },
                });
            },
            createTeam(){
                window.controlPage('nimCreateTeam','nimCreateTeamWrap',true);
            },
        },
    }
</script>

<style lang="scss" scoped>
    @import '~css/public.scss';

    .nimAddressList{
        .content{
            .addressList{
                >li{
                    margin-bottom: 10px;
                    position: relative;
                    .title{
                        height: 40px;
                        line-height: 40px;
                        border-bottom: 1px solid #ddd;
                        span,i{
                            float: left;
                        }
                        i{
                            display: inline-block;
                            width: 20px;
                            margin: 10px;
                            height: 20px;
                            line-height: 20px;
                            text-align: center;
                            border-radius: 50%;
                            font-size: 12px;
                            background-color: #ff0000;
                            color: #fff;
                        }
                    }
                    .main{
                        ul{
                            padding: 0 20px;
                            >li{
                                padding: 10px 0;
                                line-height: 40px;
                                border-bottom: 1px solid #ddd;
                                position: relative;
                                &:last-of-type{
                                    border-bottom: none;
                                }
                                h3,h4{
                                    line-height: 20px;
                                }
                                h4{
                                    color: #999;
                                }
                            }
                        }
                    }
                }

                .notice{
                    .main{
                        ul{
                            li{
                                padding-right: 130px;
                                .right{
                                    width: 120px;
                                    height: 100%;
                                    line-height: 60px;
                                    text-align: center;
                                    position: absolute;
                                    right: 0;
                                    top: 0;
                                    a{
                                        float: left;
                                        width: 50%;
                                        color: #ff0000;
                                        &:last-of-type{
                                            color: #00ffff;
                                        }
                                    }
                                }
                            }
                        }
                    }
                }

                .friend,.blackList{
                    .main{
                        ul{
                            li{
                                overflow: hidden;
                                .right{
                                    float: right;
                                    a{
                                        margin-left: 10px;
                                        font-size: 12px;
                                        color: #ff0000;
                                        &:last-of-type{
                                            color: #00ffff;
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
</style>