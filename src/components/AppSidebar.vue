<template>
    <sidebar v-model="sidebarStatus">
        <!-- sidebar 内容部分 -->
        <div class="app-sidebar-content">
            <!-- 头部 -->
            <div v-if="title" class="app-sidebar-title" @click.stop="closeAndGo('/')">
                <span class="app-sidebar-title-left-icon">
                    <img v-if="title.imageLeft" :src="title.imageLeft" :alt="title.altLeft"></img>
                    <icon v-else-if="title.svgLeft" :name="title.svgLeft"></icon>
                    <v-icon light v-else-if="title.iconLeft">{{ title.iconLeft }}</v-icon>
                </span>
                <span>{{ title.text }}</span>
                <slot name="logo" class="app-sidebar-title-right-logo">
                    <span class="app-sidebar-title-right-logo">
                        <img v-if="title.imageRight" :src="title.imageRight" :alt="title.altRight"></img>
                        <icon v-else-if="title.svgRight" :name="title.svgRight"></icon>
                        <v-icon v-else-if="title.iconRight">{{ title.iconRight }}</v-icon>
                    </span>
                </slot>
            </div>
            <!-- 用户信息 -->
            <div v-if="user" class="app-sidebar-user">
                <div class="user-avatar">
                    <v-icon light class="user-avatar-icon">face</v-icon>
                </div>
                <div class="user-info">
                    <div class="user-name">
                        <v-icon>person</v-icon>{{user.name}}</div>
                    <div class="user-location">
                        <v-icon>room</v-icon>{{user.location}}</div>
                    <div class="user-email">
                        <v-icon>email</v-icon>{{user.email}}</div>
                </div>
            </div>
            <!-- 导航列表分区块 -->
            <div v-if="blocks" class="app-sidebar-blocks">
                <h1>{{titleText}}</h1>
                <p>你想学多久，选择时间为你智能推荐</p>
                <ul class="time-list" @click="search" v-show="!isResult">
                    <li><span>15min</span>
                        <mu-icon value="chevron_right" />
                    </li>
                    <li><span>30min</span>
                        <mu-icon value="chevron_right" />
                    </li>
                    <li><span>45min</span>
                        <mu-icon value="chevron_right" />
                    </li>
                    <li><span>60min</span>
                        <mu-icon value="chevron_right" />
                    </li>
                    <li><span>90min</span>
                        <mu-icon value="chevron_right" />
                    </li>
                    <li><span>120min以上</span>
                        <mu-icon value="chevron_right" />
                    </li>
                </ul>
                <div v-if="loading" class="search-loading">
                    <v-progress-circular indeterminate v-bind:size="70" class="primary--text"></v-progress-circular>
                </div>
                <div>
                    <ul>
                        <li v-for="item in data" class="course-list">
                            <div class="img-wrapper">
                                <img :src="item.cover">
                                <p>{{item.time}}</p>
                            </div>
                            <div class="text-wrapper">
                                <p class="title">{{item.title}}</p>
                                <p class="description">{{item.description}}</p>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </sidebar>
</template>
<script>
import { mapState } from 'vuex';
import Sidebar from './Sidebar';

export default {
    data() {
        return {
            loading: false,
            data:[],
            isResult:false,
            titleText:"智能推荐"
        }
    },
    components: {
        Sidebar
    },
    computed: {
        ...mapState('appShell/appSidebar', [
            'show',
            'title',
            'user',
            'blocks'
        ]),
        sidebarStatus: {
            get() {
                return this.show;
            },
            set(val) {
                if (val) {
                    this.$emit('show-sidebar');
                } else {
                    this.$emit('hide-sidebar');
                }
            }
        }
    },
    methods: {
        close() {
            this.sidebarStatus = false;
        },
        closeAndGo(route) {
            this.$router.push(route);
            this.close();
        },
        async search() {

            // 把数据清空
            this.data = [];

            // 显示加载动画
            this.loading = true;
            this.titleText = "15min"

            // 是否为结果
            this.isResult = true;

            // 等待 1s，模拟加载中的效果
            await new Promise(resolve => {
                setTimeout(resolve, 1000);
            });

            // 设置搜索结果数据
            this.data = [{
                    "id": 2,
                    "description": "第1章第1课时",
                    "title": "APP应用私人订制",
                    "cover": "/static/img/app.jpg",
                    "time":"03:12"
                },
                {
                    "id": 2,
                    "description": "第2章第3课时",
                    "title": "Axure入门宝典",
                    "cover": "/static/img/axure.jpg",
                    "time":"04:23"
                },
                {
                    "id": 2,
                    "description": "第1章第3课时",
                    "title": "68Qh680c3r",
                    "cover": "/static/img/VR_cover.jpg",
                    "time":"03:09"
                },
                {
                    "id": 2,
                    "description": "第2章第1课时",
                    "title": "68Qh680c3r",
                    "cover": "/static/img/VR_cover.jpg",
                    "time":"8页 预计用时4min"
                }
            ];

            this.loading = false;
        }
    }
};

</script>
<style lang="stylus">
// 左侧触发滑动宽度
$swipe-width = 20px

ul,li
    padding 0
    margin 0
    list-style none
a
    text-decoration none
    color #333

.app-sidebar-content
    &.app-sidebar-content-right
        box-shadow -3px 0 8px 1px rgba(0, 0, 0, 0.4)

        &.app-sidebar-title,
        &.app-sidebar-blocks
            text-align right

    .app-sidebar-title-left-icon,
    .app-sidebar-block-left-icon
        display inline-block
        width ($app-sidebar-left-icon-size + 10)px
        height 100%

        img
            vertical-align middle
            width ($app-sidebar-left-icon-size)px
            height ($app-sidebar-left-icon-size)px
        svg
            position relative
            left 0
            top 0
            transform none
            vertical-align middle
            height ($app-sidebar-left-icon-size)px
            width ($app-sidebar-left-icon-size)px

        .material-icons
            font-size ($app-sidebar-left-icon-size)px

    .app-sidebar-block-text
        display inline-block
        height 100%
        vertical-align middle

    .app-sidebar-title-right-logo,
    .app-sidebar-block-right-logo
        float right

        img
            width 20px
            height 20px
            margin-right 10px


    .app-sidebar-title
        color #fff
        padding 0 10px
        font-size 16px
        font-weight bold
        height $app-sidebar-title-height
        line-height $app-sidebar-title-height
        background: $theme.primary
        text-align left

    .app-sidebar-user
        padding 0 10px
        font-size 16px
        .user-avatar
            margin 30px auto 0 auto
            height 100px
            width 100px
            i
                font-size 100px
                color #666
        .user-info
            padding 20px 0
            text-align center
            border-bottom 1px solid #e0e0e0
            >div
                margin 5px 0
                i
                    font-size 18px
                    margin-right 5px

    .app-sidebar-blocks
        padding 1rem
        text-align left

        .app-sidebar-block
            padding 10px 0
            border-bottom 1px solid #e0e0e0
            color #333

            .sub-list-title
                height $app-sidebar-nav-height
                line-height $app-sidebar-nav-height
                text-indent ($app-sidebar-left-icon-size)px
                font-weight bold
                color #888

            li
                padding 1rem
                height $app-sidebar-nav-height
                line-height $app-sidebar-nav-height


                &:last-child
                    border none

            &:last-child
                border-bottom none
.time-list
    li
        display:flex
        justify-content:space-between
        font-size:1.2rem
        padding:1rem
        border-top: 1px solid #eee
        &:last-child
            border-bottom:1px solid #eee
.search-loading
    margin-top 30%
    display flex
    justify-content center
.course-list
    display:flex
    padding:1rem
    border-top: 1px solid #eee
    &:last-child
        border-bottom:1px solid #eee
    .img-wrapper
        width:5rem
        height:4rem
        img
            width 100%
            height 100%
    .text-wrapper
        padding-left:1rem
        .description
            font-size:1.2rem
            color:#b2b2b2
               

</style>
