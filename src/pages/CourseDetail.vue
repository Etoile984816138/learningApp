<template>
    <div id="courseDetail">
        <div class="cover-wrapper">
            <img :src="detail.cover">
        </div>
        <div class="body-wrapper">
            <div class="tab-warpper">
                <mu-tabs :value="activeTab" @change="handleTabChange">
                    <mu-tab value="introduction" title="介绍" titleClass="" />
                    <mu-tab value="catalog" title="目录" />
                    <mu-tab value="discussion" title="讨论区" />
                </mu-tabs>
            </div>
            <div class="tab-body-warpper">
                <div v-if="activeTab === 'introduction'">
                    <div class="introduction-title-wrapper">
                        <h1>{{detail.title}}</h1>
                        <p class="star-wrapper">
                        评分：
                        <mu-icon-button icon="grade" v-for="item in detail.star" :key="detail.id"/>
                        <mu-icon-button icon="star_border" v-for="item in star_num" :key="detail.id"/>
                    </span>
                        </p>
                    </div>
                    <p class="introduction-text">
                        虚拟现实技术是仿真技术的一个重要方向，是仿真技术与计算机图形学人机接口技术多媒体技术传感技术网络技术等多种技术的集合，是一门富有挑战性的交叉技术前沿学科和研究领域。虚拟现实技术(VR)主要包括模拟环境、感知、自然技能和传感设备等方面。模拟环境是由计算机生成的、实时动态的三维立体逼真图像。感知是指理想的VR应该具有一切人所具有的感知。除计算机图形技术所生成的视觉感知外，还有听觉、触觉、力觉、运动等感知，甚至还包括嗅觉和味觉等，也称为多感知。自然技能是指人的头部转动，眼睛、手势、或其他人体行为动作，由计算机来处理与参与者的动作相适应的数据，并对用户的输入作出实时响应，并分别反馈到用户的五官。传感设备是指三维交互设备。
                    </p>
                    <div class="introduction-bottom-wrapper">
                        <mu-raised-button :label="detail.hasCollect===false?'收藏':'取消收藏'" class="save-btn" icon="star_border" @click="saveCourse"/>
                        <mu-raised-button :label="detail.hasjoin===false?'加入课程':'已加入'" class="join-btn" @click="joinCourse"/>
                    </div>
                </div>
                <div v-if="activeTab === 'catalog'">
                    <mu-list class="chapter-list">
                        <mu-list-item v-for="(section, sectionIndex) in chapter.chapters" :title="'第'+(sectionIndex+1)+'章：'+section.title" :key="section.id" titleClass="section-title" toggleNested>
                            <mu-list-item titleClass="chapter-title" v-for="(chapter,chapterIndex) in section.lessons" :title="'第'+(chapterIndex+1)+'课时：'+chapter.title" :key="chapter.id" slot="nested" >
                                <mu-list-item slot="left" disabled v-if="chapter.material.type === 0" :to="'/player/'+id+'/0/video/'+chapter.id">
                                    <mu-icon value="live_tv" />
                                </mu-list-item>
                                <mu-list-item slot="left" disabled v-else-if="chapter.material.type === 1" :to="'/player/'+id+'/0/audio/'+chapter.id">
                                    <mu-icon value="settings_voice" />
                                </mu-list-item>
                                <mu-list-item slot="left" disabled v-else :to="'/player/'+id+'/0/page/'+chapter.id">
                                    <mu-icon value="filter_none" />
                                </mu-list-item>
                            </mu-list-item>
                        </mu-list-item>
                    </mu-list>
                </div>
                <div v-if="activeTab === 'discussion'">
                    <mu-list class="discussion-wrapper">
                        <div class="button-wrapper">
                            <mu-raised-button class="demo-raised-button" :label="discussiontype === 1?'前往老师答疑区':'前往课堂讨论区'" labelPosition="before" icon="call_missed_outgoing" secondary @click="setDiscussionType"/>
                        </div>
                        <mu-list-item :title="item.employee.name" v-for="(item,index) in discusionData" :key="index">
                            <mu-avatar :src="item.employee.port" slot="leftAvatar" />
                            <span slot="describe">
                                {{item.title}}
                            </span>
                            <mu-list-item :title="item.time" slot="right" class="date"></mu-list-item>
                        </mu-list-item>
                    </mu-list>
                    <div class="send-discussion-wrapper">
                        <mu-raised-button label="发帖" class="send-discussion-btn" fullWidth icon="edit"/>
                        
                    </div>
                    
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { mapActions } from 'vuex'
// import mobileTearSheet from '../../../components/mobileTearSheet'
export default {
    name: 'CourseDetail',
    methods: {
        ...mapActions('appShell/appHeader', [
            'setAppHeader'
        ]),
        ...mapActions('appShell/appBottomNavigator', [
            'hideBottomNav'
        ]),
        handleTabChange(val) {
            this.activeTab = val
        },
        setDiscussion() {
            const _self = this;
            this.$http.get('/discuss/' + this.id + '/course/' + this.discussiontype, {
                params: {
                    "pageNum": 1,
                    "pageSize": 10
                }
            }).then((response) => {
                response = response.body
                if (response.failure.length === 0) {
                    _self.discusionData = response.success;
                    // _self.pageTotal = response.total;
                } else {
                    alert(response.failure[0])
                }

            })
        },
        setDiscussionType(){
            console.log(this.discussiontype)
            console.log(this.discussion_go)
            if(this.discussiontype == 1){
                this.discussiontype = 2
            }else{
                this.discussiontype = 1
            }
            this.setDiscussion()
            
        },
        setDetail(){
            const _self = this;
            this.$http.get('/course/' + _self.id).then((response) => {
                response = response.body
                if (response.failure.length === 0) {
                    _self.detail = response.success

                }
            })
        },
        saveCourse(){
            const _self = this;
            this.$http.post('/collection/' + _self.id).then((response) => {
                response = response.body
                if (response.failure.length === 0) {
                    _self.setDetail()
                }
            })
        },
        joinCourse(){
            const _self = this;
            this.$http.get('/course/add/' +  _self.id).then((response) => {
                response = response.body
                if (response.failure.length === 0 && ! _self.detail.hasjoin) {
                     _self.setDetail()
                }
            })
        }

    },
    data() {
        return {
            id: 0,
            detail: {},
            chapter: {},
            activeTab: 'introduction',
            discussiontype:1,
            discusionData:[]
        }
    },
    created() {
        // alert(this.$route.params.cid)
        this.id = this.$route.params.cid;
        this.setDiscussion();
        // 课程详情
        this.setDetail();
        // 章节
        this.$http.get('/course/' + this.id + '/section').then((response) => {
            response = response.body
            if (response.failure.length === 0) {
                this.chapter = response.success
            } else {
                alert(response.failure[0])
            }

        });
    },
    activated() {
        this.setAppHeader({
            title: '课程详情',
            show: true,
            showMenu: false,
            showBack: true,
            showLogo: false,
            actions: [],
            detailType: 1
        });
        this.hideBottomNav();
    },
    components: {
        // 'mobile-tear-sheet': mobileTearSheet
    },
    computed: {
        star_num() {
            if (isNaN(this.detail.star)) {
                return 0;
            } else {
                return (5 - this.detail.star);
            }
        }
    }
};

</script>
<style lang="stylus" scoped>
#courseDetail
    .app-not-found-title
        margin-top 50px
        color #666
        font-size 24px
        font-weight bold

    .not-found-avatar-icon
        width 120px
        height 120px
        font-size 100px
    .cover-wrapper
        width:100%
        height:10rem
        img
            width:100%
            height:100%
    .mu-tabs
        background:#fff
        border-bottom:2px solid #ccc
        .mu-tab-link
            color:#666
    .introduction-text
        padding:1.5rem
        color:#666
        line-height:2
        text-align:left
    .introduction-title-wrapper
        text-align:left
        padding:1.5rem
        box-shadow: 0 2px 5px #ccc;
        h1
            font-size:2rem
            font-weight:700
    .chapter-list
        text-align:left
    .discussion-wrapper
        text-align:left
        .date
            padding-right:6rem
            white-space:nowrap
    .button-wrapper
        display:flex
        justify-content:flex-end
        margin:1rem 0;
        button
            background:$theme.primary
    .send-discussion-wrapper
        position: fixed
        bottom:0
        width:100%
        button
            padding:1.5rem
            text-align:center
            background:$theme.primary
            color:#fff
            font-size:1.4rem
    .star-wrapper 
        display: inline-block
        .mu-icon-button
            position: relative
            top: 5px
            width: 1.4rem
            height: 1.4rem
            font-size: 2rem
            color: #ffc107
    .introduction-text
        padding-bottom:4rem
    .introduction-bottom-wrapper
        position: fixed
        display:flex
        bottom:0
        width:100% 
        color:#fff
        box-shadow: 0 -2px 5px #ccc;
        button
            padding:2rem
            color:#fff
            border:none
        .join-btn
            background:#607d8b
            width:60%
        .save-btn
            background:#ffc107
            width:40%
           
</style>