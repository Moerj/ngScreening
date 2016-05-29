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
        scope: false, //使用控制器的$scope
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
                return $scope.dataCallback();//执行控制器中的callback，通知控制器，数据已改变
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
            data: "=",
            title: "@"
        },
        replace: true,
        require: '^ngScreening',
        templateUrl: "../tpls/screening-tpl.html",
        controller: function ($scope) {
            $scope.checkItem = function () {
                this.item.isChecked = !this.item.isChecked;
                this.pCtrl.callback();
                return false;
            }
        },
        link: function (scope, el, attrs, pCtrl) {
            // 指令的渲染完成后，在这里获取总控制器上的$scope
            scope.pCtrl = pCtrl;
            // scope.res = scope.pScope.data; //返回控制器上的data数据
        }
    }
})





})(angular)
