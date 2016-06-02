(function(){

// 使用ngVerify前，先依赖注入
var m = angular.module('APP',['ngScreening', 'ui.select']);

// 测试用控制器,调用公共方法的地方注入ngVerify
m.controller('testCtrl',function ($scope, ngScreening) {

    // 初始化过滤组件的总数据
    $scope.data = {};

    // 过滤组件的第一组数据
    $scope.data.g1 =
    [
        {
            name:'香蕉'
        },
        {
            name:'菠萝'
        },
        {
            name:'梨子'
        },
        {
            name:'火龙果'
        },
        {
            name:'榴莲'
        },
        {
            name:'猕猴桃'
        },
        {
            name:'葡萄'
        },
        {
            name:'樱桃'
        },
        {
            name:'椰子'
        },
        {
            name:'芒果'
        },
        {
            name:'桂圆'
        },
        {
            name:'桑葚'
        }
    ]

    $scope.data.g2 =
    [
        {
            name:'桃子',
            // isChecked: false,
            // isHidden: false
        },
        {
            name:'苹果',
            // isChecked: false,
            // isHidden: false
        },
        {
            name:'西瓜',
            // isChecked: false,
            // isHidden: false
        }
    ]


    // select
    $scope.colors = [
      {name:'black', shade:'dark'},
      {name:'white', shade:'light', notAnOption: true},
      {name:'red', shade:'dark'},
      {name:'blue', shade:'dark', notAnOption: true},
      {name:'yellow', shade:'light', notAnOption: false}
    ];


    $scope.dataCallback = function () {
        console.log('callback has run.');
        // 筛选数据，只会输出选中的数据
        /* console.log('第一组数据：');
        console.log(ngScreening.getChecked($scope.data.g1));
        console.log('第二组数据：');
        console.log(ngScreening.getChecked($scope.data.g2)); */

        // 输出数据
        // console.log($scope.data);

        // 输出ui-select数据
        // console.log($scope.selected);

        // 利用数据控制筛选器的联动逻辑
        // console.log('吃了梨子就不能吃苹果 !!');
        // $scope.data.g2[1].isHidden = $scope.data.g1[2].isChecked

    }


})



})()
