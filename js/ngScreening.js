/**
 * ngScreening v0.0.1
 *
 * @license: MIT
 * Designed and built by Moer
 * github   https://github.com/Moerj/ngScreening
 *
 */

!(function(angular) {

var m = angular.module('ngScreening',[]);

/* m.service('ngScreening',function () {
    return{

    }
}) */

// 筛选器外壳
m.directive('ngScreening',function () {
    return{
        restrict: 'E',
        scope: {
            callback:'&'
        },
        replace: true,
        transclude: true,
        template: '<div class="ngScreening">' +
                    '<div class="ngScreening-container" ng-transclude></div>' +
                    '<div class="ngScreening-switch"><b>></b><i class="ngScreening-hide">></i></div>' +
                '</div>',
        controller: function ($scope) {
            // console.log($scope); //这里的还是控制器里的scope

            this.getScope = function () {
                return $scope
            }
            this.callback = function () {
                //执行控制器中的callback，通知控制器，数据已改变
                return $scope.callback();
            }
        },
        link: function (scope, el , attrs) {
            var container = angular.element(el[0].querySelector('.ngScreening-container'));//填充checkbox的部分
            var button = container.next();//控制容器收缩的按钮
            var buttonArrow1 = button.find('b');//按钮中的上箭头
            var buttonArrow2 = button.find('i');//下箭头
            button.on('click',function (e) {
                e.preventDefault();
                container.toggleClass('ngScreening-hide');
                buttonArrow1.toggleClass('ngScreening-hide');
                buttonArrow2.toggleClass('ngScreening-hide');
            })
        }
    }
})

// 筛选器容器
m.directive('screening',function () {
    return{
        restrict: 'AE',
        scope: {
            title: "@"
        },
        replace: true,
        transclude: true,
        require: '^ngScreening',
        template: '<div class="screening">'+
                    '<div class="screening-name">{{title}}:</div>'+
                    '<div class="screening-container" ng-transclude></div>'+
                    '<div class="screening-switch"><b class="ngScreening-hide">></b><i>></i></div>'+
                '</div>'
        ,
        link: function (scope, el, attrs, pCtrl) {
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

// checkbox
m.directive('screeningCheckbox',function () {
    return{
        restrict: 'AE',
        scope:{
            data:'=',
            multi:'@'
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
        controller:function ($scope) {
            $scope.mulitiActive = false;
            $scope.checkItem = function () {
                this.item.isChecked = !this.item.isChecked;
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
        },
        link: function (scope, el , attrs, pCtrl) {
            scope.pCtrl = pCtrl;
            // 多选或单选按钮
            var multiCtrl = el.children().eq(0)
            if (attrs.multi!=undefined) {
                multiCtrl.val('全选')
                scope.mulitiActive = false;
                multiCtrl.on('click',function () {
                    scope.mulitiToggle();
                    scope.$apply()
                    return false;
                })
            }else{
                multiCtrl.val('单选')
            }
        }
    }
})




})(angular)
