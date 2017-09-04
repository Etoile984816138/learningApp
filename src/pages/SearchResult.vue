<template>
    <div id="searchResult">
        <header>
            <v-btn light icon class="search-btn" @click.native="$router.go(-1)">
                <v-icon class="search-icon">arrow_back</v-icon>
            </v-btn>
            <form @submit.prevent="search">
                <input class="search-input" v-model="query" type="search" autocomplete="off" placeholder="请输入搜索词" autocapitalize="off" />
            </form>
            <v-btn light icon class="search-btn" @click.native="query = ''">
                <v-icon class="search-icon">close</v-icon>
            </v-btn>
        </header>
        <div v-if="loading" class="search-loading">
            <v-progress-circular indeterminate v-bind:size="70" class="primary--text"></v-progress-circular>
        </div>
        <!-- <div v-if="data && data.length" class="search-content">
            <v-list two-line>
                <v-list-item v-for="(item, index) in data" v-bind:key="item.title">
                    <v-list-tile avatar ripple>
                        <v-list-tile-content>
                            <v-list-tile-title>{{ item.title }}</v-list-tile-title>
                            <v-list-tile-sub-title class="grey--text text--darken-4">{{ item.headline }}</v-list-tile-sub-title>
                            <v-list-tile-sub-title>{{ item.subtitle }}</v-list-tile-sub-title>
                        </v-list-tile-content>
                        <v-list-tile-action>
                            <v-list-tile-action-text>{{ item.action }}</v-list-tile-action-text>
                            <v-icon class="grey--text text--lighten-1">star_border</v-icon>
                        </v-list-tile-action>
                    </v-list-tile>
                    <v-divider light v-if="index + 1 < data.length"></v-divider>
                </v-list-item>
            </v-list>
        </div> -->
        <div class="container-wrapper">
            <div class="left-container-wrapper">
                <mu-paper class="sider-menu">
                    <mu-menu :value="activeMenu" @change="handleMenuChange">
                        <mu-menu-item title="全部" :value="zero" @click="choiseStyle(0)" />
                        <mu-menu-item :title="item.name" v-for="(item,index) in style" :key="index" @click="choiseStyle(item.s_id,item.name)" :value="item.s_id" />
                    </mu-menu>
                </mu-paper>
            </div>
            <div class="right-container-wrapper" ref="coursewrapper">
                <v-courseList :search_text="query" :d_id="d_id" :g_id="g_id" :s_id="s_id" :url="url"></v-courseList>
            </div>
        </div>
    </div>
</template>
<script>
import { mapActions } from 'vuex';
import courseList from 'components/courseList.vue'
import EventBus from '@/event-bus';
export default {
    name: 'searchResult',
    data() {
        return {
            query: '',
            loading: false,
            data: [],
            d_id: 0,
            g_id: 0,
            style: [],
            s_id: 0,
            activeMenu: 0,
            url: '/course/new',
            zero:0
        };
    },
    methods: {
        ...mapActions('appShell/appHeader', [
            'setAppHeader'
        ]),
        ...mapActions('appShell/appBottomNavigator', [
            'hideBottomNav'
        ]),
        async search() {

            // // 显示加载动画
            // this.loading = true;

            // // 让当前输入框失去焦点
            // this.$el.querySelector('.search-input').blur();

            // // 等待 1s，模拟加载中的效果
            // await new Promise(resolve => {
            //     setTimeout(resolve, 1000);
            // });

            const _self = this;
            const eventData = {
                d_id:_self.d_id,
                g_id:_self.g_id,
                s_id:_self.s_id,
                query:_self.query,
                url:'/course/new'

            }
            //获取课程
            EventBus.$emit('seacrch-course', eventData);


            // this.loading = false;
        },
        choiseStyle(val, name) {
            this.s_id = val;
            this.activeMenu = val;
            console.log(this.s_id)
        },
        handleMenuChange() {
            const _self = this;
            const eventData = {
                d_id:_self.d_id,
                g_id:_self.g_id,
                s_id:_self.s_id,
                query:_self.query,
                url:'/course/new'

            }
            //获取课程
            EventBus.$emit('seacrch-course', eventData);
        },
        _initScroll() {
            console.log(this.$refs)
            const _self = this
            let scroll = new BScroll(_self.$refs.coursewrapper, {
                click:true,
                probeType:3
            })
            
            // scroll.$on('scroll', (pos) => {
            //   console.log(pos.x + '~' + pos.y)
            // })
            // scroll.scrollTo(0, 500)

            
        }
    },
    activated() {
        this.setAppHeader({ show: false });
        this.hideBottomNav();
    },
    created() {
        const _self = this;
        this.d_id = parseInt(this.$route.params.d_id);
        this.g_id = parseInt(this.$route.params.g_id);
        // 获取所有类型
        this.$http.get('/generic/' + this.g_id).then((response) => {
                response = response.body
                // console.log(response)
                if (response.failure.length === 0) {
                    console.log('success')
                    this.style = response.success
                } else {
                    alert(response.failure[0])
                }
        })

        // vue.nextTick(function () {
        //     console.log('-----')
        //     console.log(_self.$refs)
        //   // DOM 更新了
        //   _self._initScroll()
        // })
        
    },
    components: {
        'v-courseList': courseList
    }
};

</script>
<style lang="stylus" scoped>
#searchResult
    header
        // position:fixed
        display flex
        align-items center
        height 52px
        box-shadow 0 2px 4px -1px rgba(0,0,0,.2), 0 4px 5px rgba(0,0,0,.14), 0 1px 10px rgba(0,0,0,.12)
        background:#fff

    form
        flex 1

    .search-input
        width 100%
        outline none
        font-size 16px
        height 50px

    .search-btn
        color #959595

    .search-loading
        margin-top 30%
        display flex
        justify-content center

    .search-content
        margin-top 20px

    li
        list-style-type none
    .container-wrapper
        margin-top:5px
        // margin-top:$app-header-height
        display:flex
        .left-container-wrapper
            // position: fixed
            background:rgba(0,0,0,0.03)
            .mu-menu
                background:rgba(0,0,0,0.02)
                border:none
        .right-container-wrapper
            height:40rem
            overflow:auto
            overflow-x:hidden
            padding:1rem
            font-size:0.8rem
            text-align:left
            .mu-chip
                background:#fff
                color:#666
                border:1px solid #ccc
                line-height:2
                margin:0.8rem 0.3rem
                // padding:0 0.5rem
                &.active 
                    background:$theme.primary
                    color:#fff
                    border:none
</style>
