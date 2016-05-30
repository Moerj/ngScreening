(function(){

// 使用ngVerify前，先依赖注入
var m = angular.module('APP',['ngScreening']);

// 测试用控制器,调用公共方法的地方注入ngVerify
m.controller('testCtrl',function ($scope, $timeout) {
    $scope._hellow = 'hellow scope!!!'

    // 初始化过滤组件的总数据
    $scope.data = {};

    // 过滤组件的第一组数据
    $scope.data.g1 =
    [
        {
            name:'香蕉',
            isChecked: false,
            isHidden: false
        },
        {
            name:'菠萝',
            isChecked: false,
            isHidden: false
        },
        {
            name:'梨子',
            isChecked: false,
            isHidden: false
        },{
            name:'火龙果',
            isChecked: false,
            isHidden: false
        },
        {
            name:'榴莲',
            isChecked: false,
            isHidden: false
        },
        {
            name:'猕猴桃',
            isChecked: false,
            isHidden: false
        },
        {
            index:1,
            name:'葡萄',
            isChecked: false,
            isHidden: false
        },
        {
            index:2,
            name:'樱桃',
            isChecked: false,
            isHidden: false
        },
        {
            index:3,
            name:'椰子',
            isChecked: false,
            isHidden: false
        },
        {
            index:1,
            name:'芒果',
            isChecked: false,
            isHidden: false
        },
        {
            index:2,
            name:'桂圆',
            isChecked: false,
            isHidden: false
        },
        {
            index:3,
            name:'桑葚',
            isChecked: false,
            isHidden: false
        }
    ]

    $scope.data.g2 =
    [
        {
            name:'桃子',
            isChecked: false,
            isHidden: false
        },
        {
            name:'苹果',
            isChecked: false,
            isHidden: false
        },
        {
            name:'西瓜',
            isChecked: false,
            isHidden: false
        }
    ]

    $scope.dataCallback = function () {
        // 输出数据
        console.log($scope.data);

        // 利用数据控制筛选器的联动逻辑
        // console.log('吃了梨子就不能吃苹果 !!');
        // $scope.data.g2[1].isHidden = $scope.data.g1[2].isChecked

    }

})




})()
