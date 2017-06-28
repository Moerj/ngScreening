/**
 * ngScreening v1.0.2
 *
 * @license: MIT
 * Designed and built by Moer
 * github   https://github.com/Moerj/ngScreening
 *
 */


(function () {
    "use strict";

    var m = angular.module('ngScreening', []);

    // 筛选服务
    m.service('ngScreening', function () {
        return {
            // 获取选择组件的选中项
            getChecked: function (data) {
                var newArray = [];
                angular.forEach(data, function (key) {
                    if (key.isChecked && !key.isHidden) {
                        newArray.push(key)
                    }
                })
                return newArray;
            },

            //重置 screening 中 container高度，触发按钮隐藏显示
            resize: function (el) {
                // typeof el === domObj
                if (el)
                    el._screening_resize();
                else
                    _resizeAll();
            },

            // 收起、展开整个组件
            toggle: function (el) {
                if (el && el._dotoggle) {
                    el._dotoggle()
                } else {
                    var els = angular.element(document.querySelector('.ngScreening-start'))
                    for (var i = 0; i < els.length; i++) {
                        if (els[i]._dotoggle) {
                            els[i]._dotoggle();
                        }
                    }
                }
            }



        }
    })

    // 窗口尺寸改变，触发重置容器
    function _resizeAll() {
        setTimeout(function () {
            var screenings = document.getElementsByClassName('screening');
            for (var i = 0; i < screenings.length; i++) {
                if (screenings[i]._screening_resize) {
                    screenings[i]._screening_resize()
                }
            }
        })
    }
    var _resizeing = false;
    angular.element(window).on('resize', function () {
        if (!_resizeing) {
            _resizeing = true;

            // window resize触发重置，需要设置一个延迟，等待拖拽浏览器动作结束。
            setTimeout(function () {
                _resizeAll();
                _resizeing = false;
            }, 200)
        }
    })

    // 筛选器外壳
    m.directive('ngScreening', function () {
        return {
            restrict: 'EC',
            scope: {
                initrows: '@',
                callback: '&',
                search: '&',
                reset: '&'
            },
            replace: true,
            transclude: true,
            template: '<div class="ngScreening-start">\
                    <form class="ngScreening-container" ng-transclude></form>\
                    <div ng-if="hasControl" class="ngScreening-control">\
                        <button ng-click="dosearch()" ng-if="hasSearch" type="button" class="screening-btn screening-btn-search">查询</button>\
                        <button ng-click="doreset()" ng-if="hasReset" type="button" class="screening-btn">重置</button>\
                        <div ng-if="hasSwitch" ng-style="switchStyle" class="ngScreening-switch"><b></b><i class="ngScreening-hide"></i></div>\
                    </div>\
                </div>',
            controller: ['$scope', '$attrs', function ($scope, $attrs) {
                this.callback = function () {
                    //执行控制器中的callback，通知控制器，数据已改变
                    return $scope.callback();
                }
                $scope.dosearch = function () {
                    $scope.search();
                }
                $scope.doreset = function () {
                    $scope.$broadcast('ngScreening-reset'); // 通知组件内部重置数据
                    $scope.container[0].reset(); // form reset
                    $scope.reset();
                }

                // control 区域的按钮呈现逻辑
                if ($attrs.search) {
                    $scope.hasSearch = true
                }
                if ($attrs.reset !== undefined) {
                    $scope.hasReset = true
                }
                if (!$scope.hasSearch && !$scope.hasReset) {
                    // 没有 search 和 reset 按钮时，switch 按钮加大尺寸
                    $scope.switchStyle = {
                        width: '80px',
                        height: '46px'
                    }
                }
                if ($scope.initrows) {
                    $scope.hasSwitch = true
                }
                $scope.hasControl = $scope.hasSearch || $scope.hasReset || $scope.hasSwitch;
            }],
            link: function (scope, el) {
                setTimeout(function () {

                    var container = scope.container = angular.element(el[0].querySelector('.ngScreening-container'));
                    var button = angular.element(el[0].querySelector('.ngScreening-switch')); //控制外壳容器 展开/收起 的按钮
                    var buttonArrow1 = button.find('b'); //按钮中的上箭头
                    var buttonArrow2 = button.find('i'); //下箭头

                    //s1. initrows < 0 || undefined 显示所有行，隐藏 button
                    //s2. initrows > 0 && initrows < rows.length , 隐藏指定行数量，显示 button
                    //s3. initrows == rows.length , 显示所有行，显示 button
                    var initrows = scope.initrows; //初始显示的行数
                    var rows = container.children(); //实际的行数
                    var hasHideRows = initrows > 0 && initrows < rows.length; //需要初始隐藏

                    function loadFinish() {
                        // 使用<div class="ngScreening"></div>
                        // 防止真实DOM比指令渲染先完成导致页面结构跳动
                        el.removeClass('ngScreening');
                    }

                    // 整个筛选器的展开、收起
                    el[0]._dotoggle = function () {
                        if (hasHideRows) {
                            // 初始有隐藏行时，点击会先显示全部行
                            hasHideRows = false;
                            buttonArrow1.toggleClass('ngScreening-hide');
                            buttonArrow2.toggleClass('ngScreening-hide');
                            container.children().removeClass('ngScreening-hide');
                        } else {
                            // 隐藏所有行
                            angular.forEach(container.children(), function (row) {
                                if (row.attributes['important'] === undefined) {
                                    angular.element(row).toggleClass('ngScreening-hide');
                                    row._screening_resize();
                                }
                            });
                            buttonArrow1.toggleClass('ngScreening-hide');
                            buttonArrow2.toggleClass('ngScreening-hide');
                        }
                    }

                    // 面板收缩伸展
                    button.on('click', function () {
                        el[0]._dotoggle();
                        return false;
                    })

                    // 设置初始显示的行
                    if (hasHideRows) {
                        // s2
                        // 使用timeout延迟隐藏筛选行，避免隐藏情况行内第三方组件初始化尺寸错误，比如ui-select
                        setTimeout(function () {
                            buttonArrow1.toggleClass('ngScreening-hide');
                            buttonArrow2.toggleClass('ngScreening-hide');
                            for (var i = initrows; i < rows.length; i++) {
                                angular.element(rows[i]).addClass('ngScreening-hide');
                            }
                            loadFinish();
                        }, 300)

                    } else {

                        // s1 || s3
                        loadFinish();
                    }

                })
            }
        }
    })

    // 筛选器容器
    m.directive('screening', function () {
        return {
            restrict: 'AE',
            scope: {
                label: "@",
                initrows: "@"
            },
            replace: true,
            transclude: true,
            require: '^ngScreening',
            template: '<div class="screening" >\
                    <div class="screening-name" ng-hide="flexOnly">{{label}}</div>\
                    <div class="screening-container" ng-transclude></div>\
                    <div class="screening-switch ngScreening-hide"><b class="ngScreening-hide"></b><i></i></div>\
                </div>',
            controller: ['$scope', '$element', function ($scope, $element) {
                // 初始screening行容器高度，是由css控制的
                $scope.initHeight = $element[0].clientHeight;
            }],
            link: function (scope, el) {
                var initrows = scope.initrows || 1; //所有子行在宽度不够时，都会隐藏换行内容
                var container = angular.element(el[0].querySelector('.screening-container'));
                var isOpen = false; //当前行是否折叠
                var switchbtn = angular.element(el[0].querySelector('.screening-switch'));
                var btnArrow1 = switchbtn.find('b');
                var btnArrow2 = switchbtn.find('i');
                var initHeight = parseInt(scope.initHeight * initrows);
                var open = {
                    height: '',
                    overflow: 'visible'
                }
                var fold = {
                    height: initHeight + 'px',
                    overflow: 'hidden'
                }

                function resize() {
                    // 禁用当前行的折叠
                    if (scope.initrows=='-1') {
                        switchbtn.addClass('ngScreening-hide')
                        return
                    }

                    // 容器宽度改变，控制尺寸按钮和容器行数
                    var currHeight = parseInt(container[0].offsetHeight);
                    if (currHeight >= initHeight * 2) {
                        // 宽度不够，换行
                        switchbtn.removeClass('ngScreening-hide')
                        if (isOpen) {
                            el.css(open)
                        } else {
                            el.css(fold)
                        }
                    } else {
                        // 宽度足够，只显示一行
                        switchbtn.addClass('ngScreening-hide')
                        el.css(open)
                    }
                }

                // 检测容器中是否只有flex布局
                setTimeout(function () {
                    var containerChildren = container.children();
                    var flexOnly = true;
                    angular.forEach(containerChildren, function (dom) {
                        var child = angular.element(dom);
                        if (flexOnly && !child.hasClass('screening-flex')) {
                            flexOnly = false;
                        }
                    });
                    if (flexOnly) {
                        //禁用screening-name元素
                        scope.flexOnly = flexOnly;

                        //改变screening的样式
                        el.css('padding-left', '0');
                    } else {
                        // 混合布局时，flex容器默认水平排序为justify-content:center;
                        angular.forEach(container.children(), function (childDom) {
                            childDom = angular.element(childDom);
                            if (childDom.hasClass('screening-flex')) {
                                // 确保screening-flex指令渲染完成
                                setTimeout(function () {
                                    if (!childDom.css('justify-content')) {
                                        childDom.css('justify-content', 'center');
                                    }
                                })
                            }
                        })
                    }
                })


                // 将重置尺寸的方法绑定给元素，这样服务中可以直接使用。
                el[0]._screening_resize = resize;


                // 给按钮绑定收缩事件
                switchbtn.on('click', function () {
                    if (isOpen) {
                        el.css(fold)
                    } else {
                        el.css(open)
                    }
                    btnArrow1.toggleClass('ngScreening-hide');
                    btnArrow2.toggleClass('ngScreening-hide');
                    isOpen = !isOpen;
                    return false;
                })


                // 初始化数据 重置一次尺寸，用于显示尺寸按钮
                // 用 watch 监听高度变化，也就是里面的数据渲染完成了
                var watch = scope.$watch(function () {
                    return container[0].offsetHeight;
                }, function (newVal, oldVal) {
                    if (newVal != oldVal) {
                        watch(); //销毁watch
                        resize(); //重置容器尺寸
                    }
                })

            }
        }
    })

    // watch model
    m.directive('screeningWatch', function () {
        return {
            restrict: 'E',
            scope: {
                data: '='
            },
            require: '^ngScreening',
            link: function (scope, el, attrs, pCtrl) {
                el.remove();
                scope.$watch('data', function (newVal, oldVal) {
                    if (oldVal != newVal) {
                        pCtrl.callback();
                    }
                })
                scope.$on('ngScreening-reset', function () {
                    // 根据类型，清空数据
                    if (angular.isString(scope.data)) {
                        scope.data = '';
                    } else if (angular.isArray(scope.data)) {
                        scope.data = [];
                    } else {
                        scope.data = null;
                    }
                })
            }
        }
    })

    // DOM event listening
    m.directive('screeningEvent', function () {
        return {
            restrict: 'A',
            scope: {
                event: '@screeningEvent'
            },
            require: '^ngScreening',
            replace: true,
            link: function (scope, el, attrs, pCtrl) {
                var e = scope.event ? scope.event : 'change';
                el.on(e, function () {
                    pCtrl.callback();
                    return false;
                })
            }
        }
    })

    // checkbox and radio
    function checkbox_radio(isCheckbox) {
        return {
            restrict: 'AE',
            scope: {
                data: '=',
                multiName: '@'
            },
            replace: true,
            require: '^ngScreening',
            transclude: true,
            template: // 多选或单选按钮
                '<div class="screening-itembox">\
                <input type="button" class="screening-item screening-btn" value="{{multiName}}"\
                    ng-class="{\'screening-item-checked\':mulitiActive}" \
                    ng-click="mulitiToggle()"\
                /> | \
                <input type="button" class="screening-item screening-btn" value="{{multiName}}"\
                    ng-repeat="item in data"\
                    ng-class="{\'screening-item-checked\':item.isChecked}"\
                    ng-click="checkItem()"\
                    ng-if="!item.isHidden"\
                    ng-value="item.name"\
                    data-index="{{$index}}"\
                    data-this={{item}}\
                ><div ng-transclude class="itembox-other" style="display:inline-block"></div>\
                </div>',
            controller: ['$scope', function ($scope) {
                // 设置名称
                if (!$scope.multiName) {
                    $scope.multiName = isCheckbox ? '全选' : '单选';
                }

                // 按钮点选
                $scope.checkItem = function () {
                    this.item.isChecked = !this.item.isChecked;
                    if (!isCheckbox) { // radio单选
                        angular.forEach($scope.data, function (val) {
                            if (val != this.item) {
                                val.isChecked = false;
                            }
                        }.bind(this));
                    }
                    this.pCtrl.callback();
                    return false;
                }

                // 全选按钮的激活状态
                $scope.mulitiActive = false;

                // 全选按钮
                $scope.mulitiToggle = function () {
                    if (!isCheckbox) {
                        return; // 单选状态以下无效
                    }
                    $scope.mulitiActive = !$scope.mulitiActive;
                    angular.forEach(this.data, function (val) {
                        val.isChecked = $scope.mulitiActive
                    })
                    this.pCtrl.callback();
                }

                // 接收信号，重置全选按钮
                $scope.$on('ngScreening-reset', function () {
                    $scope.mulitiActive = false;
                    angular.forEach($scope.data, function (item) {
                        if (item.isChecked) {
                            item.isChecked = false;
                        }
                    })
                });
            }],
            link: function (scope, el, attrs, pCtrl) {
                scope.pCtrl = pCtrl;
            }
        }
    }
    m.directive('screeningCheckbox', function () {
        return checkbox_radio(true); //多选指令
    })
    m.directive('screeningRadio', function () {
        return checkbox_radio(); //单选
    })

    // 自定义筛选组件
    m.directive('screeningDiv', function () {
        return {
            restrict: 'E',
            scope: {
                width: '@',
                label: '@'
            },
            transclude: true,
            replace: true,
            template: '<div class="screening-div">\
            <span class="screening-div-name" style="margin:0 10px 0 10px" ng-if="label">{{label}}</span>\
            <div class="screening-div-contanier" style="width:{{width}};" ng-transclude></div>\
        </div>'
        }
    })

    // 自定义按钮容器
    m.directive('screeningFlex', function () {
        return {
            restrict: 'E',
            scope: {
                width: '@',
                label: '@',
                justifyContent: '@'
            },
            transclude: true,
            replace: true,
            template: '<div class="screening-flex" style="justify-content:{{justifyContent}}">\
            <span class="screening-name" style="position:relative" ng-if="label">{{label}}</span>\
            <div style="width:{{width}};display:flex;align-items:center;" ng-transclude></div>\
        </div>'
        }
    })

    m.directive('screeningToggle', ['ngScreening', function (ngScreening) {
        return {
            restrict: 'A',
            scope: {
                screeningToggle: '@'
            },
            link: function (scope, el, attrs) {
                el.on('click', function () {
                    var selectors = attrs.screeningToggle
                    var matchElement
                    if (selectors) {
                        matchElement = document.querySelector(selectors)
                    }
                    ngScreening.toggle(matchElement)

                })
            }
        }
    }])

})()