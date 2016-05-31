/**
 * ngScreening v0.1.1
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
            var container = angular.element(el[0].querySelector('.ngScreening-container'));//填充checkbox的部分
            var button = container.next();//控制容器收缩的按钮
            var buttonArrow1 = button.find('b');//按钮中的上箭头
            var buttonArrow2 = button.find('i');//下箭头
            // 设置初始显示的行
            if (scope.initrows>0) {
                // 使用timeout延迟隐藏筛选行，避免隐藏情况行内组件初始化错误
                setTimeout(function () {
                    var rows = container.children();
                    if (rows.length > scope.initrows) {
                        buttonArrow1.toggleClass('ngScreening-hide');
                        buttonArrow2.toggleClass('ngScreening-hide');
                        for (var i = scope.initrows; i < rows.length; i++) {
                            angular.element(rows[i]).addClass('ngScreening-hide');
                        }
                    }
                },200)
            }
            // 面板收缩伸展
            button.on('click',function (e) {
                e.preventDefault();
                if (scope.initrows>0) {
                    scope.initrows=0;
                    buttonArrow1.toggleClass('ngScreening-hide');
                    buttonArrow2.toggleClass('ngScreening-hide');
                    container.children().removeClass('ngScreening-hide')
                }else{
                    container.toggleClass('ngScreening-hide');
                    buttonArrow1.toggleClass('ngScreening-hide');
                    buttonArrow2.toggleClass('ngScreening-hide');
                }
            })

        }
    }
})

// 筛选器容器
m.directive('screening',function () {
    return{
        restrict: 'AE',
        scope: {
            label: "@"
        },
        replace: true,
        transclude: true,
        require: '^ngScreening',
        template: '<div class="screening">'+
                    '<div class="screening-name">{{label}}</div>'+
                    '<div class="screening-container" ng-transclude></div>'+
                    '<div class="screening-switch"><b class="ngScreening-hide"><</b><i>></i></div>'+
                '</div>'
        ,
        link: function (scope, el) {
            var switchbtn = angular.element(el[0].querySelector('.screening-switch'));
            var btnArrow1 = switchbtn.find('b');
            var btnArrow2 = switchbtn.find('i');

            // 给按钮绑定收缩事件
            switchbtn.on('click',function () {
                el.toggleClass('screening-fixed');
                btnArrow1.toggleClass('ngScreening-hide');
                btnArrow2.toggleClass('ngScreening-hide');
                return false;
            })
            // 根据内容高度显示收缩菜单按钮
            angular.element(document).ready(function() {
                if (el[0].offsetHeight > 48) {
                    switchbtn.css('display','block');
                    el.addClass('screening-fixed')
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
        template: '<span style="margin:0 10px 0 10px">{{label}}</span><div class="screening-div" style="width:{{width}}" ng-transclude></div>'
    }
})

// checkbox and radio
var checkbox_radio = function (isCheckbox) {
    return{
        restrict: 'AE',
        scope:{
            data:'=',
            multiName:'@'
        },
        // replace: true,
        require: '^ngScreening',
        template:// 多选或单选按钮
                '<input type="button"'  +
                "ng-class=\"{'btn':true,'btn-sm':true,'btn-default':true,'btn-primary':mulitiActive}\" /> | " +
                // checkItemes
                '<input type="button"' +
                'ng-repeat="item in data"' +
                "ng-class=\"{'btn':true,'btn-sm':true,'btn-default':!item.isChecked, 'btn-primary':item.isChecked}\"" +
                'ng-click="checkItem()"' +
                'ng-if="!item.isHidden"' +
                'ng-value="item.name"' +
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
                angular.forEach(this.data,function (val, key) {
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
        replace: true,
        template: '<i>ngScreening watch</i>',
        link: function (scope, el , attrs, pCtrl) {
            el.css('display','none')
            scope.$watch('watch',function (newVal,oldVal) {
                if (oldVal != newVal && oldVal) {
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
