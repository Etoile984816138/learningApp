<template>
    <div class="detail-wrapper" id="explore">
        <!-- <v-layout row wrap>
            <v-flex xs10 offset-xs1>
                <article class="detail-content text-xs-center">
                    <header class="detail-title text-xs-center">
                        Detail {{$route.params.id}}
                    </header>
                    <router-link :to="{
                        name: 'detail',
                        params: {
                            id: Number($route.params.id) + 1
                        }
                    }">
                        Detail {{Number($route.params.id) + 1}}
                    </router-link>
                    <p>
                        Progressive Web Apps are user experiences that have the reach of the web, and are: Reliable - Load instantly and never show the downasaur, even in uncertain network conditions. Fast - Respond quickly to user interactions with silky smooth animations and no janky scrolling.
                    </p>
                </article>
            </v-flex>
        </v-layout> -->
        <div id="chart" ref="chart"></div>
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
    name: 'Explore',
    methods: {
        ...mapActions('appShell/appHeader', [
            'setAppHeader'
        ]),
        ...mapActions('appShell/appBottomNavigator', [
            'hideBottomNav'
        ]),
        d3Method() {
            const _self = this;
            console.log(document.body.clientHeight)
            console.log(window.screen.width)
            var width = 10000;
            var height = window.screen.height;

            //边界空白
            var padding = { left: 20, right: 20, top: 20, bottom: 20 };

            vue.nextTick(function() {
                console.log(_self.$refs.chart)
                var svg = d3.select(_self.$refs.chart)
                    .append("svg")
                    .append("g")
                    // .attr("width", width)
                    // .attr("height", height)
                    

                //树状图布局
                var tree = d3.layout.tree()
                    .size([height, width]);

                //对角线生成器
                var diagonal = d3.svg.diagonal()
                    .projection(function(d) { return [d.y, d.x]; });


                d3.json("/d3", function(error, root) {
                    console.log(root)
                    //给第一个节点添加初始坐标x0和x1
                    root.x0 = 100;
                    root.y0 = 100;

                    //以第一个节点为起始节点，重绘

                    root._children = root.children
                    root.children = null
                    redraw(root)
                    //重绘函数
                    function redraw(source) {
                        /*
                        （1） 计算节点和连线的位置
                        */

                        //应用布局，计算节点和连线
                        var nodes = tree.nodes(root);
                        var links = tree.links(nodes);

                        //重新计算节点的y坐标
                        nodes.forEach(function(d) { d.y = d.depth * 180; });

                        /*
                        （2） 节点的处理
                        */

                        //获取节点的update部分
                        var nodeUpdate = svg.selectAll(".node")
                            .data(nodes, function(d) { return d.name; });

                        //获取节点的enter部分
                        var nodeEnter = nodeUpdate.enter();

                        //获取节点的exit部分
                        var nodeExit = nodeUpdate.exit();

                        //1. 节点的 Enter 部分的处理办法
                        var enterNodes = nodeEnter.append("g")
                            .attr("class", "node")
                            .attr("transform", function(d) { return "translate(" + source.y0 + "," + source.x0 + ")"; })
                            .on("click", function(d) {
                                toggle(d);
                                redraw(d);
                            });

                        enterNodes.append("circle")
                            .attr("r", 0)
                            .style("fill", function(d) { return d._children ? "#8bc34a" : "#fff"; });

                        enterNodes.append("text")
                            .attr("x", function(d) { return d.children || d._children ? -14 : 14; })
                            .attr("dy", ".35em")
                            .attr("text-anchor", function(d) { return d.children || d._children ? "end" : "start"; })
                            .text(function(d) { return d.name; })
                            .style("fill-opacity", 0);


                        //2. 节点的 Update 部分的处理办法
                        var updateNodes = nodeUpdate.transition()
                            .duration(500)
                            .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; });

                        updateNodes.select("circle")
                            .attr("r", 10)
                            .style("fill", function(d) { return d._children ? "#8bc34a" : "#fff"; });

                        updateNodes.select("text")
                            .style("fill-opacity", 1);

                        //3. 节点的 Exit 部分的处理办法
                        var exitNodes = nodeExit.transition()
                            .duration(500)
                            .attr("transform", function(d) { return "translate(" + source.y + "," + source.x + ")"; })
                            .remove();

                        exitNodes.select("circle")
                            .attr("r", 0);

                        exitNodes.select("text")
                            .style("fill-opacity", 0);

                        /*
                        （3） 连线的处理
                        */

                        //获取连线的update部分
                        var linkUpdate = svg.selectAll(".link")
                            .data(links, function(d) { return d.target.name; });

                        //获取连线的enter部分
                        var linkEnter = linkUpdate.enter();

                        //获取连线的exit部分
                        var linkExit = linkUpdate.exit();

                        //1. 连线的 Enter 部分的处理办法
                        linkEnter.insert("path", ".node")
                            .attr("class", "link")
                            .attr("d", function(d) {
                                var o = { x: source.x0, y: source.y0 };
                                return diagonal({ source: o, target: o });
                            })
                            .transition()
                            .duration(500)
                            .attr("d", diagonal);

                        //2. 连线的 Update 部分的处理办法
                        linkUpdate.transition()
                            .duration(500)
                            .attr("d", diagonal);

                        //3. 连线的 Exit 部分的处理办法
                        linkExit.transition()
                            .duration(500)
                            .attr("d", function(d) {
                                var o = { x: source.x, y: source.y };
                                return diagonal({ source: o, target: o });
                            })
                            .remove();


                        /*
                        （4） 将当前的节点坐标保存在变量x0、y0里，以备更新时使用
                        */
                        nodes.forEach(function(d) {
                            d.x0 = d.x;
                            d.y0 = d.y;
                        });

                    }

                    //切换开关，d 为被点击的节点
                    function toggle(d) {
                        if (d.children) { //如果有子节点
                            d._children = d.children; //将该子节点保存到 _children
                            d.children = null; //将子节点设置为null
                            if (d._children) {
                                d._children.forEach(function(dchild) {
                                    dchild.children = dchild._children;
                                    dchild._children = null
                                })
                                document.getElementById('chart').scrollLeft -= 80
                            }

                        } else { //如果没有子节点
                            d.children = d._children; //从 _children 取回原来的子节点 
                            if (d.children) {
                                d.children.forEach(function(dchild) {
                                    dchild._children = dchild.children;
                                    dchild.children = null
                                })
                                document.getElementById('chart').scrollLeft += 80
                               
                                // /document.getElementsByTagName('body')[0].scrollLeft += 80
                                // console.log(document.getElementsByTagName('body')[0].scrollLeft)
                            }
                            // console.log(_self.$refs.chart)
                            
                            
                        }
                    }

                });
            })
            // console.log(d3.select())




        }
    },
    data() {
        return {
            mcpherTreeData: {}
        }
    },
    async asyncData() {
        await new Promise((resolve, reject) => {
            setTimeout(resolve, 500);
        });
    },
    created() {
        const _self = this
        this.setAppHeader({
            show: true,
            title: '知识图谱',
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

        // 章节
        this.d3Method()


        // });

    }
};

</script>
<style lang="stylus" >
#chart
    position:absolute;
    width:100vw;
    min-height:100vh;
    top:-52px;
    overflow-y: hidden;
#explore
    background:#eceff1
.touch-toggle
    display:none
.app-shell 
    .app-view-wrapper 
        .detail-wrapper.app-view.app-view-with-header
            overflow:hidden
svg
    position: absolute;
    top:0;
    bottom:0;
    left:0;
    right:0;
    min-width:1000px;
    height:100%;
    padding:2rem
    // min-width:100vw;
    // min-height:100vh;
    // transform:rotate(-90deg); 
text
    // transform:rotate(90deg); 
.node 
    circle
        cursor: pointer;
        fill: #fff;
        stroke: $theme.primary;
        stroke-width: 2px;
    text
        color:#b2b2b2;
        font-size: 12px;

.link
    fill: none;
    stroke: #ccc;
    stroke-width: 1px;



</style>
