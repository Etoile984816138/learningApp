<template>
    <div class="app-user-page">
        <div class="app-user-title text-xs-center">
            <div class="user-avatar">
                <p>
                    <v-icon class="user-avatar-icon user-icon">face</v-icon>
                </p>
                <p>{{user.name}}</p>
            </div>
            <v-list two-line>
                <v-list-item v-for="item in items" :key="item.title" >
                    <v-list-tile avatar :href="item.url">
                        <v-list-tile-avatar>
                            <v-icon class="user-icon">{{ item.icon }}</v-icon>
                        </v-list-tile-avatar>
                        <v-list-tile-content>
                            <v-list-tile-title>{{ item.title }}</v-list-tile-title>
                        </v-list-tile-content>
                    </v-list-tile>
                </v-list-item>
            </v-list>
        </div>
    </div>
</template>

<script>
import {mapActions} from 'vuex';

export default {
    name: 'user',
    data() {
        return {
            user:{},
            items: [
                {
                    title: '离线中心',
                    icon: 'get_app',
                    url:'/download'
                },
                {
                    title: '我的课表',
                    icon: 'event_note',
                    url:'/timetable'
                },
                {
                    title: '我的学习',
                    icon: 'import_contacts',
                    url:'#'
                },
                {
                    title: '观看历史',
                    icon: 'donut_large',
                    url:'#'
                },
                {
                    title: '我的收藏',
                    icon: 'favorite',
                    url:'#'
                },
                {
                    title: '我的笔记',
                    icon: 'note_add',
                    url:'#'
                },
                {
                    title: '我的消息',
                    icon: 'message',
                    url:'#'
                }
            ]
        };
    },
    methods: {
        ...mapActions('appShell/appHeader', [
            'setAppHeader'
        ]),
        ...mapActions('appShell/appBottomNavigator', [
            'showBottomNav',
            'activateBottomNav'
        ]),
    },
    created() {
        this.$http.get('/user').then((response) => {
            response = response.body
                // console.log(response)
                if (response.failure.length === 0) {
                    this.user = response.success

                } else {
                    alert(response.failure[0])
                }
           
        })
    },
    activated() {
        this.setAppHeader({
            show: true,
            title: '个人中心',
            showMenu: true,
            showBack: false,
            showLogo: true,
            actions: [
                {
                    icon: 'search',
                    route: '/search'
                }
            ]
        });

        // 设置当前 bottom navigator 显示的 item
        this.activateBottomNav('user');
        this.showBottomNav();
    },
    async asyncData({store, route}) {
        await new Promise(resolve => {
            setTimeout(resolve, 1000);
        });
    }
};
</script>

<style lang="stylus" scoped>

$user-icon-inactive-color := rgba($material-theme.text-color, $material-theme.inactive-icon-percent)
$user-icon-active-color := rgba($material-theme.text-color, $material-theme.active-icon-percent)

.user-icon
    color: $user-icon-inactive-color
    
.user-avatar
    color: $user-icon-active-color
    margin 50px auto 20px
    display flex
    justify-content center
    flex-direction column

    &-icon
        width 80px
        height 80px
        border-radius 50%
        background: $user-icon-inactive-color
        font-size 70px

</style>
