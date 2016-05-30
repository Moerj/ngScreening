(function(){

// 使用ngVerify前，先依赖注入
var m = angular.module('APP',['ngScreening']);

// 测试用控制器,调用公共方法的地方注入ngVerify
m.controller('testCtrl',function ($scope, $timeout) {
    $scope._hellow = 'hellow scope!!!'

    // ui-select
    $scope.selectData = [{"id":"1","name":"张三"},{"id":"2","name":"李四"},{
			"id":"3",
			"name":"王二"
		},{
			"id":"4",
			"name":"麻子"
		},{
			"id":"5",
			"name":"麻子的哥哥"
		},{
			"id":"6",
			"name":"麻子的姐姐"
		},{
			"id":"7",
			"name":"麻子的姐姐1"
		},{
			"id":"8",
			"name":"麻子的姐姐2"
		}
	];

    // 初始化过滤组件的总数据
    $scope.data = {};

    // 过滤组件的第一组数据
    $scope.data.g1 =
    [
        {
            index:1,
            name:'香蕉',
            isChecked: false,
            isHidden: false
        },
        {
            index:2,
            name:'菠萝',
            isChecked: false,
            isHidden: false
        },
        {
            index:3,
            name:'梨子',
            isChecked: false,
            isHidden: false
        }
    ]

    $scope.data.g2 =
    [
        {
            index:1,
            name:'桃子',
            isChecked: false,
            isHidden: false
        },
        {
            index:2,
            name:'苹果',
            isChecked: false,
            isHidden: false
        },
        {
            index:3,
            name:'西瓜',
            isChecked: false,
            isHidden: false
        }
    ]

    $scope.dataCallback = function () {
        // 输出数据
        // console.log('吃了梨子就不能吃苹果 !!');
        console.log($scope.data);

        // 利用数据控制筛选器的联动逻辑
        $scope.data.g2[1].isHidden = $scope.data.g1[2].isChecked

    }

})




})()
