<template>
    <div id="download">
        <mu-tabs :value="activeTab" @change="handleTabChange">
            <mu-tab value="tab1" title="已下载" @active="getCourse" />
            <mu-tab value="tab2" title="下载中" @active="getCourse2" />
        </mu-tabs>
        <div v-for="(course,index) in list" :key="index" @click="toDetail(course.id)" v-show="activeTab == 'tab1'">
            <mu-row gutter class="row">
                <mu-col width="40" tablet="40" desktop="40">
                    <div class="course-list-left">
                        <img :src="course.cover">
                    </div>
                </mu-col>
                <mu-col width="60" tablet="60" desktop="60" class="course-list-right">
                    <h1>{{course.title}}</h1>
                    <p class="introduction-text">{{course.description}}</p>
                    <mu-flat-button label="删除" class="del-btn" secondary/>
                </mu-col>
            </mu-row>
        </div>
        <div v-for="(course,index) in list2" :key="index" @click="toDetail(course.id)" v-show="activeTab == 'tab2'">
            <mu-row gutter class="row">
                <mu-col width="40" tablet="40" desktop="40">
                    <div class="course-list-left">
                        <img :src="course.cover">
                    </div>
                </mu-col>
                <mu-col width="60" tablet="60" desktop="60" class="course-list-right">
                    <h1>{{course.title}}</h1>
                    <p class="introduction-text">{{course.description}}</p>
                    <mu-linear-progress mode="determinate" :value="value" />
                    <div style="height:5rem"></div>
                    <mu-flat-button label="移除" class="del-btn" secondary/>
                    <mu-flat-button label="暂停" class="del-btn" secondary/>
                </mu-col>
            </mu-row>
        </div>
        <mu-infinite-scroll :scroller="scroller" :loading="loading" @load="loadMore" />
    </div>
</template>
<!-- <script src="./d3.js"></script> -->
<script>
import { mapActions } from 'vuex';

import * as d3 from 'd3'

console.log(d3)
// import * as d3 from "d3";
// import test from 'components/jsapi.js'
// import $ from 'jquery'
import vue from 'vue'
export default {
    name: 'Download',
    methods: {
        ...mapActions('appShell/appHeader', [
            'setAppHeader'
        ]),
        ...mapActions('appShell/appBottomNavigator', [
            'hideBottomNav'
        ]),
        loadMore() {
            const _self = this
            this.loading = true
            setTimeout(() => {
                _self.getCourse()
                this.loading = false
            }, 2000)
        },
        getCourse() {
            const _self = this
            this.$http.get('/course/commendations/2', {
                params: {
                    pageNum: _self.pageNum,
                    pageSize: _self.pageSize,
                }
            }).then((response) => {
                response = response.body
                if (response.failure.length === 0) {
                    if (this.list.length === 0) {
                        this.list = response.success
                    } else {
                        this.list = this.list.concat(response.success)
                    }
                    if (parseInt(_self.pageNum) < parseInt(response.total)) {
                        _self.pageNum++
                    }

                }
            })
        },
        getCourse2() {
            const _self = this
            this.$http.get('/course/download', {
                params: {
                    pageNum: _self.pageNum,
                    pageSize: _self.pageSize,
                }
            }).then((response) => {
                response = response.body
                if (response.failure.length === 0) {
                    if (this.list2.length === 0) {
                        this.list2 = response.success
                    } else {
                        this.list2 = this.list.concat(response.success)
                    }
                    if (parseInt(_self.pageNum) < parseInt(response.total)) {
                        _self.pageNum++
                    }

                }
            })
        },
        toDetail(cid) {
            window.location.href = '/CourseDetail/' + cid
        },
        handleTabChange(val) {
            this.activeTab = val
        }
    },
    data() {
        return {
            list: [],
            num: 10,
            loading: false,
            scroller: null,
            pageSize: 20,
            pageNum: 1,
            activeTab: 'tab1',
            list2: [],
            value: 0
        }
    },
    mounted() {
        this.scroller = this.$el;
        this.timer = setInterval(() => {
            
            if (this.value < 100){
                this.value += 5
            } 
        }, 1000)
    },
    async asyncData() {
        await new Promise((resolve, reject) => {
            setTimeout(resolve, 500);
        });
    },
    created() {
        this.setAppHeader({
            show: true,
            title: '离线中心',
            showMenu: false,
            showBack: true,
            showLogo: false,
            actions: [{
                icon: 'home',
                route: {
                    name: 'home'
                }
            }]
        });
        this.hideBottomNav();
        const _self = this
        this.getCourse();


        // });

    },
    beforeDestroy() {
        clearInterval(this.timer)
    }
};

</script>
<style lang="stylus">
#download 
    .mu-tabs
        background:#fff
        .mu-tab-text
            color:#666
        .mu-tab-link.mu-tab-active
            .mu-tab-text
                color:#000

    .row
        padding:2rem 1rem
        border-bottom:1px solid #ddd
        .course-list-left 
            // position: relative;
            width: 100%
            height: 8rem
            cursor: pointer
            img 
                width: 100%
                height: 100%
        .course-list-right
            text-align:left
            h1
                padding:0
                margin:0
                font-size:1.5rem
                line-height:1.5
                font-weight:700
            p
                position: relative
                line-height: 20px
                max-height: 5rem
                font-size:1.1rem
                line-height:1.5
                overflow: hidden
                font-weight:500
                &::after
                    content: "..."
                    position: absolute
                    bottom: 0
                    right: 0
                    padding-left: 3rem
                    background: -webkit-linear-gradient(left, transparent, #fff 55%)
                    background: -o-linear-gradient(right, transparent, #fff 55%)
                    background: -moz-linear-gradient(right, transparent, #fff 55%)
                    background: linear-gradient(to right, transparent, #fff 55%)
                    color:#666
        .introduction-text
            color:#ccc
.demo-infinite-container
    width: 256px
    height: 300px
    overflow: auto
    -webkit-overflow-scrolling: touch
    border: 1px solid #d9d9d9
.del-btn 
    float:right
      
</style>
