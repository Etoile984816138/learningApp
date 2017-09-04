<template>
    <div class="app-user-page">
        <div class="timetable" id="timetable" ref="timetable"></div>
        <div class="btn-wrapper">
            <mu-float-button icon="add" class="add-task" />
        </div>
    </div>
</template>
<script>
import { mapActions } from 'vuex';
import vue from 'vue'
// import Timetable from 'components/timetable.js'
export default {
    name: 'Timetable',
    data() {
        return {
            items: [{
                    title: '离线中心',
                    icon: 'get_app',
                    url: '/download'
                },
                {
                    title: '我的学习',
                    icon: 'import_contacts',
                    url: '#'
                },
                {
                    title: '观看历史',
                    icon: 'donut_large',
                    url: '#'
                },
                {
                    title: '我的收藏',
                    icon: 'favorite',
                    url: '#'
                },
                {
                    title: '我的笔记',
                    icon: 'note_add',
                    url: '#'
                },
                {
                    title: '我的消息',
                    icon: 'message',
                    url: '#'
                }
            ]
        };
    },
    methods: {
        ...mapActions('appShell/appHeader', [
            'setAppHeader'
        ]),
        ...mapActions('appShell/appBottomNavigator', [
            'hideBottomNav'
        ])
    },
    activated() {
        this.setAppHeader({
            show: true,
            title: '我的课表',
            showMenu: true,
            showBack: false,
            showLogo: true,
            actions: [{
                icon: 'search',
                route: '/search'
            }]
        });

        // 设置当前 bottom navigator 显示的 item
        // this.activateBottomNav('user');
        this.hideBottomNav();
    },
    async asyncData({ store, route }) {
        await new Promise(resolve => {
            setTimeout(resolve, 1000);
        });
    },
    created() {
        var Timetable = function() {
            this.scope = {
                hourStart: 9,
                hourEnd: 17
            };
            this.locations = [];
            this.events = [];
        };

        Timetable.Renderer = function(tt) {
            if (!(tt instanceof Timetable)) {
                throw new Error('Initialize renderer using a Timetable');
            }
            this.timetable = tt;
        };

        (function() {
            function isValidHourRange(start, end) {
                return isValidHour(start) && isValidHour(end);
            }

            function isValidHour(number) {
                return isInt(number) && isInHourRange(number);
            }

            function isInt(number) {
                return number === parseInt(number, 10);
            }

            function isInHourRange(number) {
                return number >= 0 && number < 24;
            }

            function locationExistsIn(loc, locs) {
                return locs.indexOf(loc) !== -1;
            }

            function isValidTimeRange(start, end) {
                var correctTypes = start instanceof Date && end instanceof Date;
                var correctOrder = start < end;
                return correctTypes && correctOrder;
            }

            function getDurationHours(startHour, endHour) {
                return endHour >= startHour ? endHour - startHour : 24 + endHour - startHour;
            }

            Timetable.prototype = {
                setScope: function(start, end) {
                    if (isValidHourRange(start, end)) {
                        this.scope.hourStart = start;
                        this.scope.hourEnd = end;
                    } else {
                        throw new RangeError('Timetable scope should consist of (start, end) in whole hours from 0 to 23');
                    }

                    return this;
                },
                addLocations: function(newLocations) {
                    function hasProperFormat() {
                        return newLocations instanceof Array;
                    }

                    var existingLocations = this.locations;

                    if (hasProperFormat()) {
                        newLocations.forEach(function(loc) {
                            if (!locationExistsIn(loc, existingLocations)) {
                                existingLocations.push(loc);
                            } else {
                                throw new Error('Location already exists');
                            }
                        });
                    } else {
                        throw new Error('Tried to add locations in wrong format');
                    }

                    return this;
                },
                addEvent: function(name, location, start, end, options) {
                    if (!locationExistsIn(location, this.locations)) {
                        throw new Error('Unknown location');
                    }
                    if (!isValidTimeRange(start, end)) {
                        throw new Error('Invalid time range: ' + JSON.stringify([start, end]));
                    }

                    var optionsHasValidType = Object.prototype.toString.call(options) === '[object Object]';

                    this.events.push({
                        name: name,
                        location: location,
                        startDate: start,
                        endDate: end,
                        options: optionsHasValidType ? options : undefined
                    });

                    return this;
                }
            };

            function emptyNode(node) {
                while (node.firstChild) {
                    node.removeChild(node.firstChild);
                }
            }

            function prettyFormatHour(hour) {
                var prefix = hour < 10 ? '0' : '';
                return prefix + hour + ':00';
            }

            Timetable.Renderer.prototype = {
                draw: function(selector) {
                    function checkContainerPrecondition(container) {
                        if (container === null) {
                            throw new Error('Timetable container not found');
                        }
                    }

                    function appendTimetableAside(container) {
                        var asideNode = container.appendChild(document.createElement('aside'));
                        var asideULNode = asideNode.appendChild(document.createElement('ul'));
                        appendRowHeaders(asideULNode);
                    }

                    function appendRowHeaders(ulNode) {
                        for (var k = 0; k < timetable.locations.length; k++) {
                            var liNode = ulNode.appendChild(document.createElement('li'));
                            var spanNode = liNode.appendChild(document.createElement('span'));
                            spanNode.className = 'row-heading';
                            spanNode.textContent = timetable.locations[k];
                        }
                    }

                    function appendTimetableSection(container) {
                        var sectionNode = container.appendChild(document.createElement('section'));
                        var timeNode = sectionNode.appendChild(document.createElement('time'));
                        appendColumnHeaders(timeNode);
                        appendTimeRows(timeNode);
                    }

                    function appendColumnHeaders(node) {
                        var headerNode = node.appendChild(document.createElement('header'));
                        var headerULNode = headerNode.appendChild(document.createElement('ul'));

                        var completed = false;
                        var looped = false;

                        for (var hour = timetable.scope.hourStart; !completed;) {
                            var liNode = headerULNode.appendChild(document.createElement('li'));
                            var spanNode = liNode.appendChild(document.createElement('span'));
                            spanNode.className = 'time-label';
                            spanNode.textContent = prettyFormatHour(hour);

                            if (hour === timetable.scope.hourEnd && (timetable.scope.hourStart !== timetable.scope.hourEnd || looped)) {
                                completed = true;
                            }
                            if (++hour === 24) {
                                hour = 0;
                                looped = true;
                            }
                        }
                    }

                    function appendTimeRows(node) {
                        var ulNode = node.appendChild(document.createElement('ul'));
                        ulNode.className = 'room-timeline';
                        for (var k = 0; k < timetable.locations.length; k++) {
                            var liNode = ulNode.appendChild(document.createElement('li'));
                            appendLocationEvents(timetable.locations[k], liNode); /**/
                        }
                    }

                    function appendLocationEvents(location, node) {
                        for (var k = 0; k < timetable.events.length; k++) {
                            var event = timetable.events[k];
                            if (event.location === location) {
                                appendEvent(event, node);
                            }
                        }
                    }

                    function appendEvent(event, node) {
                        var hasOptions = event.options !== undefined;
                        var hasURL, hasAdditionalClass, hasDataAttributes = false;

                        if (hasOptions) {
                            hasURL = (event.options.url !== undefined) ? true : false;
                            hasAdditionalClass = (event.options.class !== undefined) ? true : false;
                            hasDataAttributes = (event.options.data !== undefined) ? true : false;
                        }

                        var elementType = hasURL ? 'a' : 'span';
                        var aNode = node.appendChild(document.createElement(elementType));
                        var smallNode = aNode.appendChild(document.createElement('small'));
                        aNode.title = event.name;

                        if (hasURL) {
                            aNode.href = event.options.url;
                        }
                        if (hasDataAttributes) {
                            for (var key in event.options.data) {
                                aNode.setAttribute('data-' + key, event.options.data[key]);
                            }
                        }

                        aNode.className = hasAdditionalClass ? 'time-entry ' + event.options.class : 'time-entry';
                        aNode.style.width = computeEventBlockWidth(event);
                        aNode.style.left = computeEventBlockOffset(event);
                        smallNode.textContent = event.name;
                    }

                    function computeEventBlockWidth(event) {
                        var start = event.startDate;
                        var end = event.endDate;
                        var durationHours = computeDurationInHours(start, end);
                        return durationHours / scopeDurationHours * 100 + '%';
                    }

                    function computeDurationInHours(start, end) {
                        return (end.getTime() - start.getTime()) / 1000 / 60 / 60;
                    }

                    function computeEventBlockOffset(event) {
                        var scopeStartHours = timetable.scope.hourStart;
                        var eventStartHours = event.startDate.getHours() + (event.startDate.getMinutes() / 60);
                        var hoursBeforeEvent = getDurationHours(scopeStartHours, eventStartHours);
                        return hoursBeforeEvent / scopeDurationHours * 100 + '%';
                    }

                    var timetable = this.timetable;
                    var scopeDurationHours = getDurationHours(timetable.scope.hourStart, timetable.scope.hourEnd);
                    var container = document.getElementById(selector);
                    checkContainerPrecondition(container);
                    emptyNode(container);
                    appendTimetableAside(container);
                    appendTimetableSection(container);
                }
            };

        })();


        var timetable = new Timetable();

        timetable.setScope(9, 3)

        timetable.addLocations(['周一', '周二', '周三', '周四', '周五', '周六', '周日']);

        timetable.addEvent('', '周一', new Date(2015, 7, 17, 9), new Date(2015, 7, 17, 10), { url: '#'  });
        timetable.addEvent('从零开始学VR', '周二', new Date(2015, 7, 17, 10), new Date(2015, 7, 17, 11), { url: '#',class: 'vip-only'  });
        timetable.addEvent('', '周二', new Date(2015, 7, 17, 14), new Date(2015, 7, 17, 16), { url: '#'  });
        timetable.addEvent('', '周三', new Date(2015, 7, 17, 10), new Date(2015, 7, 17, 12), { url: '#'  });
        timetable.addEvent('从零开始学VR', '周三', new Date(2015, 7, 17, 16), new Date(2015, 7, 17, 17), { url: '#',class: 'vip-only'  });
        timetable.addEvent('', '周四', new Date(2015, 7, 17, 13), new Date(2015, 7, 17, 14), { url: '#'  });
        timetable.addEvent('APP应用私人订制', '周四', new Date(2015, 7, 17, 9), new Date(2015, 7, 17, 10), { url: '#' ,class: 'vip-only' });
        timetable.addEvent('', '周五', new Date(2015, 7, 17, 11), new Date(2015, 7, 17, 12), { url: '#'  });
        timetable.addEvent('从零开始学VR', '周五', new Date(2015, 7, 17, 14), new Date(2015, 7, 17, 16), { url: '#',class: 'vip-only'   });
        timetable.addEvent('', '周六', new Date(2015, 7, 17, 10), new Date(2015, 7, 17, 24), { url: '#'});
        timetable.addEvent('', '周日', new Date(2015, 7, 17, 11), new Date(2015, 7, 17, 24), { url: '#'});

      

        var renderer = new Timetable.Renderer(timetable);
        try {
            vue.nextTick(function() {
                renderer.draw('timetable');
            })
        } catch (e) {
            console.log(e)
        }






    }
};

</script>
<style lang="stylus">
.timetable 
  box-sizing border-box
  &::after 
    clear both
    content ""
    display table
  aside 
    width 25%
    padding 0!important
    margin-top 46px
    border-right 5px solid transparent
    li 
      padding 0 15px
      background-color #efefef
      line-height 46px
      &:not(:last-of-type) 
        border-bottom 1px solid #fff
    .row-heading 
      display inline-block
      max-width 100%
      overflow hidden
      text-overflow ellipsis
      white-space nowrap
      word-wrap normal
  ul 
    list-style-type none
    margin 0
    &.room-timeline 
      li 
        position relative
        background-color #f4f4f4
        &:nth-of-type(odd) 
          background-color #fdfdfd
        &:first-of-type 
          border-top 1px solid #e5e5e5
        &:last-of-type 
          border-bottom 1px solid #e5e5e5
        &:not(:last-of-type) 
          border-bottom none
        &:first-child 
          .time-entry 
            height 44px
        &:before 
          background-image linear-gradient(to right,#e5e5e5 1px,transparent 1px)
          background-size 24px auto
        &:after 
          background-image linear-gradient(to right,#e5e5e5,#e5e5e5 1px,#f4f4f4 1px,#f4f4f4 2px,#e5e5e5 2px,#e5e5e5 3px,transparent 3px,transparent)
          background-size 96px auto
          background-position -2px 0
  section 
    width 75%
    padding 0!important
    overflow-x scroll
    time 
      white-space nowrap
      display inline-block
    header 
      height 46px
      transform-style preserve-3d
      font-size 0
      &::after 
        clear both
        content ""
        display table
      li 
        display inline-block
        font-size 1rem
        overflow visible
        width 0
        line-height 46px
        display inline-block
        position relative
        &:not(:last-of-type) 
          width 96px
        .time-label 
          display block
          position absolute
          left 0
        &:not(:first-of-type) 
          .time-label 
            transform translateX(-50%)
        &:last-of-type 
          .time-label 
            transform translateX(-100%)
  .time-entry 
    background-color #8bc34a
    transition 200ms background-color
    height 45px
    display block
    position absolute
    z-index 2
    padding 0 10px
    white-space normal
    overflow hidden
    color #fff
    transform-style preserve-3d
    small 
      position relative
      top 50%
      transform translateY(-50%)
      display block
    &:hover 
      background-color #e74030
.timetable *,.timetable *:before,.timetable *:after 
  box-sizing inherit
.timetable ul,.timetable li 
  margin 0
  padding 0
  list-style-type none
.timetable aside,.timetable section 
  float left
.timetable aside li,.timetable time li 
  height 46px

.timetable ul.room-timeline li:after,.timetable ul.room-timeline li:before 
  content ""
  position absolute
  z-index 1
  left 0
  top 0
  right 0
  bottom 0

body 
  background #fcfcfc
  font-family 'Helvetica Neue',Helvetica,Arial,sans-serif
  color #333
  font-size 15px
a 
  text-decoration none
.row-heading 
  font-weight 500
  font-size .7em
  text-transform uppercase
.timetable 
  .time-label 
    font-size .8em
    font-weight 500
  .time-entry 
    &.vip-only 
      background-color #e91e63
      &:hover 
        background-color #ae67f0
.btn-wrapper
    margin-top:5rem
    .mu-float-button-wrapper
        background:$theme.primary
        border:none
</style>
