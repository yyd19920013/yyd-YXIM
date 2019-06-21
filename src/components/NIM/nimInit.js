import SDK from './SDKs/NIM_Web_SDK_v5.7.0';
import Netcall from './SDKs/NIM_Web_Netcall_v5.7.0';
import WebRTC from './SDKs/NIM_Web_WebRTC_v5.7.0';
import vm from 'src/main';
import {lStore,copyJson} from 'js/yydjs';

window.Netcall=Netcall;
window.WebRTC=WebRTC;
window.nimData={};

/*
    使用此SDKs之前需要在webpack.base.conf.js文件中的babel-loader中忽略NIM_Web_为前缀的js文件
    {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /NIM_Web_*.*\.js/,
        include: [resolve('src'), resolve('test')]
    },
*/

const nimInit=(account,token)=>{
    reconnection();
    function reconnection(){
        if(window.nim){
            return;
            window.nim.destroy({
                done:function(err){
                    window.nim=nimInitFn(account,token);
                }
            });
        }else{
            window.nim=nimInitFn(account,token);
        }
    };

    function onTeamMembers(obj){
        var teamId=obj.teamId;
        var members=obj.members;

        window.nimData.teamMembers=window.nimData.teamMembers||{};
        window.nimData.teamMembers[teamId]=nim.mergeTeamMembers(window.nimData.teamMembers[teamId],members);
        window.nimData.teamMembers[teamId]=nim.cutTeamMembers(window.nimData.teamMembers[teamId],members.invalid);
    };

    function pushMsg(msgs){
        if(!Array.isArray(msgs)){
            msgs=[msgs];
        }

        for(var i=0;i<msgs.length;i++){
            msgs[i].content=safeParse(msgs[i].content);
            msgs[i].custom=safeParse(msgs[i].custom);
            msgs[i].pushPayload=safeParse(msgs[i].pushPayload);
        }

        var sessionId=msgs[0].sessionId;

        window.nimData.msgs=window.nimData.msgs||{};
        window.nimData.msgs[sessionId]=nim.mergeMsgs(window.nimData.msgs[sessionId],msgs);
    };

    function pushSysMsgs(sysMsgs){
        window.nimData.sysMsgs=nim.mergeSysMsgs(window.nimData.sysMsgs,sysMsgs);
    };

    function nimInitFn(account,token){
        var appKeyArr=[
            'd6d808f3f7906a037b35e79395c6c4e0',//自己
            '2969cb2602b021155eaee040df91367d',//测试环境
        ];
        var appKey=appKeyArr[1];
        var account=account||lStore.get('nimAccount');
        var token=token||lStore.get('nimToken');

        return SDK.NIM.getInstance({
            //基本配置
            debug:false,//是否打开调试模式
            appKey:appKey,//在云信管理后台查看应用的appKey
            account:account,//登录账户
            token:token,//登录账户令牌
            db:false,//是否使用数据库
            syncSessionUnread:true,//是否同步会话的未读数，默认不同步
            syncRobots:true,//是否同步机器人
            autoMarkRead:false,//是否自动标记消息为已收到，默认为true，关闭之后收不到session

            //连接与重连
            onconnect(res){//连接建立后的回调, 会传入一个对象, 包含登录的信息
                vm.$emit('nimOnConnect',res);
            },
            onerror(error){//发生错误的回调, 会传入错误对象
                vm.$emit('nimOnError',error);
            },
            onwillreconnect(res){//即将重连的回调
                vm.$emit('nimOnWillReconnect',res);
            },
            ondisconnect(error){//断开连接后的回调
                /*
                    code: 出错时的错误码, 可能为空
                    302: 账号或者密码错误, 请跳转到登录页面并提示错误
                    417: 重复登录, 已经在其它端登录了, 请跳转到登录页面并提示错误
                    'kicked': 被踢
                    当code为'kicked'的时候, 此对象会有以下字段
                    reason: 被踢的原因
                    samePlatformKick: 不允许同一个帐号在多个地方同时登录
                    serverKick: 被服务器踢了
                    otherPlatformKick: 被其它端踢了
                */
                vm.$emit('nimOnDisconnect',error);
            },

            //多端登录
            onloginportschange(loginPorts){//多端登录状态变化的回调,会收到登录端列表,以下情况会收到此回调，登录时其它端在线，登录后其它端上线或者下线
                vm.$emit('nimOnLoginPortsChange',loginPorts);
            },


            //用户关系
            onblacklist(blacklist){//同步黑名单的回调, 会传入黑名单列表blacklist
                window.nimData.blacklist=nim.mergeRelations(window.nimData.blacklist,blacklist);
                window.nimData.blacklist=nim.cutRelations(window.nimData.blacklist,blacklist.invalid);

                vm.$emit('nimOnBlacklist',window.nimData.blacklist);
                vm.$emit('nimOnBlacklistAll',window.nimData.blacklist);
            },
            onsyncmarkinblacklist(obj){//当前登录用户在其它端加入黑名单/从黑名单移除后的回调
                /*
                    会传入一个参数,包含两个字段
                    account: 要加入黑名单/从黑名单移除的账号
                    isAdd: true表示加入黑名单, false表示从黑名单移除
                */
                if(obj.isAdd){
                    addToBlacklist(obj);
                }else{
                    removeFromBlacklist(obj);
                }

                function addToBlacklist(obj){
                    window.nimData.blacklist=nim.mergeRelations(window.nimData.blacklist,obj.record);
                };

                function removeFromBlacklist(obj){
                    window.nimData.blacklist=nim.cutRelations(window.nimData.blacklist,obj.record);
                };

                vm.$emit('nimOnMarkInBlacklist',window.nimData.blacklist);
                vm.$emit('nimOnBlacklistAll',window.nimData.blacklist);
            },
            onmutelist(mutelist){//同步静音列表的回调, 会传入静音列表mutelist
                window.nimData.mutelist=nim.mergeRelations(window.nimData.mutelist,mutelist);
                window.nimData.mutelist=nim.cutRelations(window.nimData.mutelist,mutelist.invalid);

                vm.$emit('nimOnMutelist',window.nimData.mutelist);
                vm.$emit('nimOnMutelistAll',window.nimData.mutelist);
            },
            onsyncmarkinmutelist(obj){//当前登录用户在其它端加入静音列表/从静音列表移除后的回调
                /*
                    会传入一个参数, 包含两个字段
                    account: 要加入黑名单/从黑名单移除的账号
                    isAdd: true表示加入静音列表, false表示从静音列表移除
                */

                if (obj.isAdd){
                    addToMutelist(obj);
                }else{
                    removeFromMutelist(obj);
                }

                function addToMutelist(obj){
                    window.nimData.mutelist=nim.mergeRelations(window.nimData.mutelist,obj.record);
                };

                function removeFromMutelist(obj) {
                    window.nimData.mutelist=nim.cutRelations(window.nimData.mutelist,obj.record);
                };

                vm.$emit('nimOnMarkInMutelist',window.nimData.mutelist);
                vm.$emit('nimOnMutelistAll',window.nimData.mutelist);
            },

            //好友关系
            onfriends(friends){//同步好友列表的回调,会传入好友列表
                window.nimData.friends=nim.mergeFriends(window.nimData.friends,friends);
                window.nimData.friends=nim.cutFriends(window.nimData.friends,friends.invalid);

                vm.$emit('nimOnFriends',window.nimData.friends);
                vm.$emit('nimOnFriendsAll',window.nimData.friends);
            },
            onsyncfriendaction(obj){//当前登录用户在其它端进行好友相关的操作后的回调
                switch (obj.type){
                    case 'addFriend'://你在其它端直接加了一个好友
                            onAddFriend(obj.friend);
                        break;
                    case 'applyFriend'://你在其它端申请加了一个好友

                        break;
                    case 'passFriendApply'://你在其它端通过了一个好友申请
                            onAddFriend(obj.friend);
                        break;
                    case 'rejectFriendApply'://你在其它端拒绝了一个好友申请

                        break;
                    case 'deleteFriend'://你在其它端删了一个好友
                            onDeleteFriend(obj.account);
                        break;
                    case 'updateFriend'://你在其它端更新了一个好友
                            onUpdateFriend(obj.friend);
                        break;
                }

                function onAddFriend(friend){
                    window.nimData.friends=nim.mergeFriends(window.nimData.friends,friend);
                };

                function onDeleteFriend(account){
                    window.nimData.friends=nim.cutFriendsByAccounts(window.nimData.friends,account);
                };

                function onUpdateFriend(friend){
                    window.nimData.friends=nim.mergeFriends(window.nimData.friends,friend);
                };

                vm.$emit('nimOnSyncFriendAction',window.nimData.friends);
                vm.$emit('nimOnFriendsAll',window.nimData.friends);
            },

            //用户名片
            onmyinfo(user){//同步登录用户名片的回调, 会传入用户名片
                window.nimData.myInfo=user;

                vm.$emit('nimOnMyInfo',window.nimData.myInfo);
                vm.$emit('nimOnMyInfoAll',window.nimData.myInfo);
            },
            onupdatemyinfo(user){//当前登录用户在其它端修改自己的个人名片之后的回调,会传入用户名片
                window.nimData.myInfo=NIM.util.merge(window.nimData.myInfo,user);

                vm.$emit('nimOnUpdateMyInfo',window.nimData.myInfo);
                vm.$emit('nimOnMyInfoAll',window.nimData.myInfo);
            },
            onusers(users){//同步好友用户名片的回调,会传入用户名片数组
                window.nimData.users=nim.mergeUsers(window.nimData.users,users);

                vm.$emit('nimOnUsers',window.nimData.users);
                vm.$emit('nimOnUsersAll',window.nimData.users);
            },
            onupdateuser(user){//用户名片更新后的回调,会传入用户名片
                window.nimData.users=nim.mergeUsers(window.nimData.users,user);

                vm.$emit('nimOnUpdateUser',window.nimData.users);
                vm.$emit('nimOnUsersAll',window.nimData.users);
            },

            //机器人列表的回调
            onrobots(robots){//客户私有化方案不支持
                window.nimData.robots=robots;

                vm.$emit('nimOnRobots',window.nimData.robots);
            },

            //群组
            onteams(teams){//同步群列表的回调,会传入群数组teams
                window.nimData.teams=nim.mergeTeams(window.nimData.teams,teams);

                onInvalidTeams(teams.invalid);
                function onInvalidTeams(teams){
                    window.nimData.teams=nim.cutTeams(window.nimData.teams,teams);
                    window.nimData.invalidTeams=nim.mergeTeams(window.nimData.invalidTeams,teams);
                };

                vm.$emit('nimOnTeams',window.nimData.teams);
                vm.$emit('nimOnTeamsAll',window.nimData.teams);
            },
            onsynccreateteam(team){//当前登录用户在其它端创建群后的回调,会传入群对象
                window.nimData.teams=nim.mergeTeams(window.nimData.teams,team);

                onTeamMembers({
                    teamId:team.teamId,
                    members:owner,
                });

                vm.$emit('nimOnCreateTeam',window.nimData.teams);
                vm.$emit('nimOnTeamsAll',window.nimData.teams);
            },
            onUpdateTeam(team){//更新群的回调,此方法接收一个参数,更新后的群信息
                vm.$emit('nimOnUpdateTeam',team);
            },
            onteammembers(obj){//同步群成员的回调,一个群对应一个回调,会传入群成员数组
                onTeamMembers(obj);

                vm.$emit('nimOnTeamMembers',window.nimData.teamMembers);
                vm.$emit('nimOnTeamMembersAll',window.nimData.teamMembers);
            },
            onsyncteammembersdone(){//当syncTeams和syncTeamMembers同时为true时,会同步所有群的群成员,当所有群的群成员同步结束时,会调用此回调
                vm.$emit('nimOnSyncTeamMembersDone');
            },
            onupdateteammember(teamMember){//群成员信息更新后的回调,会传入群成员对象,不过此时的信息是不完整的,只会包括被更新的字段。当前登录帐号在其它端修改自己在群里面的昵称时也会收到此回调。
                onTeamMembers({
                    teamId:teamMember.teamId,
                    members:teamMember,
                });

                vm.$emit('nimOnUpdateTeamMember',window.nimData.teamMembers);
                vm.$emit('nimOnTeamMembersAll',window.nimData.teamMembers);
            },

            //群消息业务已读通知
            onTeamMsgReceipt(teamMsgReceipts){
                vm.$emit('nimOnTeamMsgReceipt',teamMsgReceipts);
            },

            //会话
            onsessions(sessions){//同步最近会话列表回调,会传入会话列表,按时间正序排列,即最近聊过天的放在列表的最后面。
                window.nimData.sessions=nim.mergeSessions(window.nimData.sessions,sessions);

                vm.$emit('nimOnSessions',window.nimData.sessions);
                vm.$emit('nimOnSessionsAll',window.nimData.sessions);
            },
            onupdatesession(session){//更新会话的回调
                /*
                    会传入会话,以下情况会收到此回调
                    收到消息
                    发送消息
                    设置当前会话
                    重置会话未读数
                */
                window.nimData.sessions=nim.mergeSessions(window.nimData.sessions,session);

                vm.$emit('nimOnUpdateSession',window.nimData.sessions);
                vm.$emit('nimOnSessionsAll',window.nimData.sessions);
            },

            //消息
            onroamingmsgs(obj){//同步漫游消息的回调,每个会话对应一个回调,会传入消息数组
                pushMsg(obj.msgs);

                vm.$emit('nimOnRoamingMsgs',obj.msgs);
                vm.$emit('nimOnMsgAll',window.nimData.msgs);
            },
            onofflinemsgs(obj){//同步离线消息的回调,每个会话对应一个回调,会传入消息数组
                pushMsg(obj.msgs);

                vm.$emit('nimOnOfflineMsgs',obj.msgs);
                vm.$emit('nimOnMsgAll',window.nimData.msgs);
            },
            onmsg(msg){//收到消息的回调,会传入消息对象
                pushMsg(msg);
                let lastMsgJson={};

                setTimeout(function(){
                    for(let attr in window.nimData.msgs){
                        lastMsgJson[attr]=window.nimData.msgs[attr][window.nimData.msgs[attr].length-1];
                    }

                    vm.$emit('nimOnMsg',lastMsgJson);
                    vm.$emit('nimOnMsgAll',window.nimData.msgs);
                },300);
            },

            //系统通知
            onofflinesysmsgs(sysMsgs){//同步离线系统通知的回调, 会传入系统通知数组
                pushSysMsgs(sysMsgs);

                vm.$emit('nimOnOfflineSysMsgs',sysMsgs);
                vm.$emit('nimOnSysMsgAll',window.nimData.sysMsgs);
            },
            onsysmsg(sysMsgs){//收到系统通知的回调, 会传入系统通知
                pushSysMsgs(sysMsgs);

                vm.$emit('nimOnSysMsg',window.nimData.sysMsgs[window.nimData.sysMsgs.length-1]);
                vm.$emit('nimOnSysMsgAll',window.nimData.sysMsgs);
            },
            onupdatesysmsg(sysMsg){//更新系统通知未读数的回调
                pushSysMsgs(sysMsg);

                vm.$emit('nimOnUpdateSysMsg',window.nimData.sysMsgs);
                vm.$emit('nimOnSysMsgAll',window.nimData.sysMsgs);
            },
            onsysmsgunread(obj){//收到系统通知未读数的回调
                window.nimData.sysMsgUnread=obj;

                vm.$emit('nimOnSysMsgUnread',window.nimData.sysMsgUnread);
                vm.$emit('nimOnSysMsgUnreadAll',window.nimData.sysMsgUnread);
            },
            onupdatesysmsgunread(obj){//更新系统通知未读数的回调
                window.nimData.sysMsgUnread=obj;

                vm.$emit('nimOnUpdateSysMsgUnread',window.nimData.sysMsgUnread);
                vm.$emit('nimOnSysMsgUnreadAll',window.nimData.sysMsgUnread);
            },
            onofflinecustomsysmsgs(sysMsgs){//同步离线自定义系统通知的回调, 会传入系统通知数组
                vm.$emit('nimOnOfflineCustomSysMsgs',sysMsgs);
            },
            oncustomsysmsg(sysMsg){//收到自定义系统通知的回调, 会传入系统通知
                console.log(sysMsg);
                vm.$emit('nimOnCustomSysMsg',sysMsg);
            },

            //收到广播消息
            onbroadcastmsg(msg){//收到广播消息
                vm.$emit('nimOnBroadcastMsg',msg);
            },
            onbroadcastmsgs(msgs){//收到广播消息列表
                vm.$emit('nimOnBroadcastMsgs',msgs);
            },

            //同步完成
            onsyncdone(){//当上面各个同步（不包括下面的同步群成员）完成后, 会调用此回调；注意, SDK保证在onsyncdone调用的时候上面的同步肯定完成了, 但是不保证各个同步回调的顺序。
                vm.$emit('nimOnsyncdone');
                console.log(copyJson(window.nimData));
            },
        });
    };
};

function safeParse(json){
    var json=json;

    if(json){
        try{
            json=JSON.parse(json);
        }catch(e){}
    }

    return json;
};

export default nimInit;
export {
    safeParse,//安全执行JSON.parse
};