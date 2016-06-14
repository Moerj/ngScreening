/**
 * ngScreening v0.1.6
 *
 * @license: MIT
 * Designed and built by Moer
 * github   https://github.com/Moerj/ngScreening
 *
 */

!(function(angular) {

var m = angular.module('ngScreening',[]);

// 筛选服务
m.service('ngScreening',function () {
    return{
        getChecked: function (data) {
            var newArray = [];
            angular.forEach(data,function (key) {
                if (key.isChecked && !key.isHidden) {
                    newArray.push(key)
                }
            })
            return newArray;
        },
        resize: function (el) { //重置 screening 中 container高度，触发按钮隐藏显示
            if (el) {
                el._screening_resize();
            }else{
                var els = document.getElementsByClassName('screening');
                angular.forEach(els,function (el) {
                    if (el._screening_resize) {
                        el._screening_resize();
                    }
                })
            }
        }
    }
})

// 筛选器外壳
m.directive('ngScreening',function () {
    return{
        restrict: 'E',
        scope: {
            callback:'&',
            initrows:'@'
        },
        replace: true,
        transclude: true,
        template: '<div class="ngScreening">' +
                    '<div class="ngScreening-container" ng-transclude></div>' +
                    '<div class="ngScreening-switch"><b><</b><i class="ngScreening-hide">></i></div>' +
                '</div>',
        controller: ['$scope', function ($scope) {
            this.callback = function () {
                //执行控制器中的callback，通知控制器，数据已改变
                return $scope.callback();
            }
        }],
        link: function (scope, el ) {
            var initrows = scope.initrows;
            var container = angular.element(el[0].querySelector('.ngScreening-container'));//填充checkbox的部分
            var button = container.next();//控制容器尺寸的按钮

            // 设置初始显示行为固定模式
            if (!initrows || initrows<0) {
                button.remove();
                return;
            }

            var buttonArrow1 = button.find('b');//按钮中的上箭头
            var buttonArrow2 = button.find('i');//下箭头
            var rows = container.children();
            var hasInit = initrows>0 && initrows<rows.length;//设置了初始行数

            // 设置初始显示的行
            if (hasInit) {
                // 使用timeout延迟隐藏筛选行，避免隐藏情况行内组件初始化错误
                setTimeout(function () {
                    buttonArrow1.toggleClass('ngScreening-hide');
                    buttonArrow2.toggleClass('ngScreening-hide');
                    for (var i = initrows; i < rows.length; i++) {
                        angular.element(rows[i]).addClass('ngScreening-hide');
                    }
                },200)
            }
            // 面板收缩伸展
            button.on('click',function () {
                if (hasInit) {
                    hasInit=false;
                    buttonArrow1.toggleClass('ngScreening-hide');
                    buttonArrow2.toggleClass('ngScreening-hide');
                    container.children().removeClass('ngScreening-hide')
                }else{
                    container.toggleClass('ngScreening-hide');
                    buttonArrow1.toggleClass('ngScreening-hide');
                    buttonArrow2.toggleClass('ngScreening-hide');
                }
                return false;
            })

        }
    }
})

// 筛选器容器
m.directive('screening', function () {
    return{
        restrict: 'AE',
        scope: {
            label: "@",
            initrows:'@'
        },
        replace: true,
        transclude: true,
        require: '^ngScreening',
        template: '<div class="screening">'+
                    '<div class="screening-name">{{label}}</div>'+
                    '<div class="screening-container" ng-transclude></div>'+
                    '<div class="screening-switch ngScreening-hide"><b class="ngScreening-hide"><</b><i>></i></div>'+
                '</div>'
        ,
        link: function (scope, el) {
            var initrows = scope.initrows;

            // 设置初始化行数
            if (!initrows || initrows<=0) {
                return;
            }
            // ---- 没有传入参数则不配置尺寸按钮

            var openState = false;
            var container = angular.element(el[0].querySelector('.screening-container'));
            var switchbtn = angular.element(el[0].querySelector('.screening-switch'));
            var btnArrow1 = switchbtn.find('b');
            var btnArrow2 = switchbtn.find('i');
            var initHeight = el[0].offsetHeight;

            // 给按钮绑定收缩事件
            switchbtn.on('click',function () {
                if (openState) {
                    el.css({height:initHeight*initrows+'px', overflow:'hidden'})
                }else{
                    el.css({height:'', overflow:''})
                }
                btnArrow1.toggleClass('ngScreening-hide');
                btnArrow2.toggleClass('ngScreening-hide');
                openState = !openState;
                return false;
            })


            // 给元素绑定一个resize方法，决定什么时候显示和隐藏右侧尺寸按钮可以在服务
            function resize() {
                // 容器宽度改变，控制尺寸按钮和容器行数
                setTimeout(function () {
                    if (container[0].offsetHeight >= initHeight*initrows) {
                        switchbtn.removeClass('ngScreening-hide')
                        el.css({height:initHeight*initrows+'px', overflow:'hidden'})
                        if (openState) {
                            el.css({height:'', overflow:''})
                        }
                    }
                    else{
                        switchbtn.addClass('ngScreening-hide')
                        el.css({height:'', overflow:''})
                    }
                })
            }

            // 将重置尺寸的方法绑定只元素，这样服务中可以直接使用。
            el[0]._screening_resize = resize;

            // 初始化数据 重置一次尺寸，用于显示尺寸按钮
            var watch = scope.$watch(function () {
                return container[0].offsetHeight;
            },function (newVal, oldVal) {
                if (newVal!=oldVal) {
                    watch();//销毁watch
                    resize(el[0]);//重置容器尺寸
                }
            })

            // 窗口尺寸改变，重置容器
            var resizeing = false;
            angular.element(window).on('resize',function () {
                if (!resizeing) {
                    resizeing = true;
                    setTimeout(function () {
                        resize(el[0]);//重置容器尺寸
                        resizeing = false;
                    },500)
                }
            })

        }
    }
})

// 自定义筛选组件
m.directive('screeningDiv',function () {
    return{
        restrict:'E',
        scope:{
            width:'@',
            label:'@'
        },
        transclude: true,
        template: '<span style="margin:0 10px 0 10px">{{label}}</span><div class="screening-div" style="width:{{styleWidth}}" ng-transclude></div>',
        controller:['$scope', function ($scope) {
            if ($scope.width) {
                var hasUnit = $scope.width.indexOf('p') + $scope.width.indexOf('em') >= 0;
                if (!hasUnit) {
                    $scope.styleWidth = $scope.width + 'px';
                }
            }
        }]
    }
})

// checkbox and radio
function checkbox_radio(isCheckbox) {
    return{
        restrict: 'AE',
        scope:{
            data:'=',
            multiName:'@'
        },
        // replace: true,
        require: '^ngScreening',
        template: // 多选或单选按钮
                '<input type="button" class="screening-item btn"'  +
                "ng-class=\"{'screening-item-checked':mulitiActive}\" /> | " +
                // checkItemes
                '<input type="button"' +
                'ng-repeat="item in data"' +
                "ng-class=\"{'screening-item-checked':item.isChecked}\"" +
                'ng-click="checkItem()"' +
                'ng-if="!item.isHidden"' +
                'ng-value="item.name"' +
                'class="screening-item btn"' +
                'index="{{$index}}">' ,
        controller: ['$scope', function ($scope) {
            $scope.mulitiActive = false;
            $scope.checkItem = function () {
                this.item.isChecked = !this.item.isChecked;
                if (!isCheckbox) { // radio单选
                    angular.forEach($scope.data,function (val) {
                        if (val != this.item) {
                            val.isChecked = false;
                        }
                    }.bind(this));
                }
                this.pCtrl.callback();
                return false;
            }
            $scope.mulitiToggle = function () {
                $scope.mulitiActive = !$scope.mulitiActive;
                angular.forEach(this.data,function (val) {
                    val.isChecked = $scope.mulitiActive
                })
                this.pCtrl.callback();
            }
        }],
        link: function (scope, el , attrs, pCtrl) {
            scope.pCtrl = pCtrl;
            // 多选或单选按钮
            var multiCtrl = el.children().eq(0)
            if (isCheckbox) {
                scope.multiName ? multiCtrl.val(scope.multiName) : multiCtrl.val('全选')
                scope.mulitiActive = false;
                multiCtrl.on('click',function () {
                    scope.mulitiToggle();
                    scope.$apply()
                    return false;
                })
            }else{
                scope.multiName ? multiCtrl.val(scope.multiName) : multiCtrl.val('单选')
            }
        }
    }
}
m.directive('screeningCheckbox',function () {
    return checkbox_radio(true);//多选指令
})
m.directive('screeningRadio',function () {
    return checkbox_radio();//单选
})

// watch modle
m.directive('screeningWatch',function () {
    return{
        restrict:'E',
        scope:{
            watch:'='
        },
        require: '^ngScreening',
        link: function (scope, el , attrs, pCtrl) {
            el.remove();
            scope.$watch('watch',function (newVal,oldVal) {
                if (oldVal != newVal && newVal) {
                    pCtrl.callback();
                }
            })
        }
    }
})

// DOM event listening
m.directive('screeningEvent',function () {
    return{
        restrict:'A',
        scope:{
            screeningEvent:'@'
        },
        require: '^ngScreening',
        replace: true,
        link: function (scope, el , attrs, pCtrl) {
            var event = 'change';
            if (scope.screeningEvent) {
                event = scope.screeningEvent;
            }
            el.on(event,function () {
                pCtrl.callback();
                return false;
            })
        }
    }
})


})(angular)
