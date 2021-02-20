
console.log($response.body)

var body = {
  "retcode" : 0,
  "errmsg" : "",
  "data" : {
    "signed" : 1,
    "groups" : [
      {
        "minup" : "0",
        "gicon" : "V0",
        "gname" : "游客",
        "play_daynum" : 15,
        "down_daynum" : 0,
        "comment_daynum" : 0
      },
      {
        "minup" : "0",
        "gicon" : "V1",
        "gname" : "VIP1",
        "play_daynum" : 25,
        "down_daynum" : 4,
        "comment_daynum" : 5
      },
      {
        "minup" : "2",
        "gicon" : "V2",
        "gname" : "VIP2",
        "play_daynum" : 50,
        "down_daynum" : 10,
        "comment_daynum" : 10
      },
      {
        "minup" : "5",
        "gicon" : "V3",
        "gname" : "VIP3",
        "play_daynum" : 100,
        "down_daynum" : 20,
        "comment_daynum" : 15
      },
      {
        "minup" : "10",
        "gicon" : "V4",
        "gname" : "VIP4",
        "play_daynum" : 200,
        "down_daynum" : 40,
        "comment_daynum" : 20
      },
      {
        "minup" : "20",
        "gicon" : "V5",
        "gname" : "尊贵VIP",
        "play_daynum" : 999,
        "down_daynum" : 100,
        "comment_daynum" : 30
      }
    ],
    "uinfo" : {
      "curr_group" : {
        "minup" : "20",
        "gicon" : "V5",
        "gid" : "5",
        "gname" : "尊贵VIP"
      },
      "next_group" : {
        "minup" : "65535",
        "gicon" : "",
        "gid" : "6",
        "gname" : "禁止发言"
      },
      "next_upgrade_need" : 65535,
      "down_daily_remainders" : 100,
      "play_daily_remainders" : 999,
      "goldcoin" : "1"
    },
    "reqplay_addnum" : "0",
    "reqdown_addnum" : "0",
    "user" : {
      "duetime" : "2039-02-24 00:36:54",
      "sysgid" : "5",
      "uid" : "8344655",
      "uniqkey" : "JZIHJQ",
      "gids" : null,
      "avatar_url" : "https://img.ynkmjj.com/sysavatar/noavatar.png",
      "newmsg" : "1",
      "gicon" : "V5",
      "gid" : "1",
      "avatar" : "",
      "dueday" : "9999天后过期",
      "mobi" : "86.18065988029",
      "username" : "~小小影迷-JZIHJQ",
      "goldcoin" : 1,
      "regtime" : "2021-02-21 00:36:54",
      "nickname" : "",
      "email" : "~1208506454",
      "isvip" : 1,
      "gender" : "0"
    }
  }
};
$done({body:JSON.stringify(body)});
