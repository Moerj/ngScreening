# ngScreening v0.1.1

angular筛选器组件

<br>
## DEMO

<br>
## Getting Started
在使用前，你需要引入angular

```javascript

require('angular');

require('ngScreening');

angular.module('yourProject',['ngScreening']);

```

<br>
## How to use
1. <a href="#step1">布局</a> 在html页面上定义好容器
2. <a href="#step2">数据操作</a> 传入数据，开启监听
3. <a href="#step3">callback</a> 响应筛选数据变化

<br>



<h2 id="step1">布局</h2>

### ng-screening
筛选器的整体容器框
```html
<!-- 确保你的控制器包裹指令 -->
<div ng-controller="yourCtrl">
    <ng-screening>
        ...
    </ng-screening>
</div>
```

### screening
定义一个筛选行
```html
<ng-screening>

    <screening>
        <!-- 第一行 -->
    </screening>

    <screening>
        <!-- 第二行 -->
    </screening>

</ng-screening>
```



### screening-checkbox
多选筛选器
```html
<screening>
    <!-- 生成checkbox类型的筛选器 -->
    <screening-checkbox data="yourData"></screening-checkbox>
</screening>
```

### screening-radio
单选筛选器
```html
<screening>
    <!-- radio -->
    <screening-radio data="yourData"></screening-radio>
</screening>
```


### screening-div
自定义筛选容器
```html
<screening>
    <screening-div label="自定义筛选:">
        <input type="text" placeholder="查询数据">
    </screening-div>
</screening>
```


<br>

<h2 id="step2">数据操作</h2>

### data
传入数据，自动渲染，自动绑定
```html
<screening-radio data="yourData"></screening-radio>
```
```javascript
app.controller('yourCtrl',function ($scope) {
    $scope.yourData = [
        {
            name:'香蕉'
        },
        {
            name:'菠萝'
        },
        {
            name:'梨子'
        }
    ]
})
```

### isChecked (defualt: undefined)
设置数据，视图上会响应已选中的数据
```javascript
app.controller('yourCtrl',function ($scope) {
    $scope.yourData = [
        {
            name:'香蕉',
            isChecked: true //视图上香蕉将会选中
        },
        {
            name:'菠萝'
        },
        {
            name:'梨子'
        }
    ]
})
```

### isHidden (defualt: undefined)
设置一个选择项隐藏
```javascript
app.controller('yourCtrl',function ($scope) {
    $scope.yourData = [
        {
            name:'香蕉',
            isHidden: true //视图上香蕉将会隐藏
        },
        {
            name:'菠萝'
        },
        {
            name:'梨子'
        }
    ]
})
```

<br>

## 监听

### screening-event
监听dom元素事件，事件触发时会执行callback
```html
<!-- 定义一个搜索功能 -->
<screening-div label="搜索:">
    <!-- 监听监听输入框change事件 -->
    <input screening-event="change" type="text" ></input>

    <!-- 监听监听按钮click事件 -->
    <button screening-event="click" type="button" >搜索</button>
</screening-div>
```

### screening-watch
监听数据模型，模型改变时会执行callback
```html
<input type="text" ng-model="data">

<!-- screening-watch 可以在筛选器内任意位置 -->
<screening-watch watch="data"></screening-watch>
```

<br>

## 数据更新
<h3 id="step3">callback</h3>
定义一个你的回调函数，它会在数据更新时通知你
```html
<!-- callback 只能定义在 ng-screening 上 -->
<ng-screening callback="yourCallback()">
    ...
</ng-screening>
```
```javascript
app.controller('yourCtrl',function ($scope) {
    $scope.yourCallback = function () {
        // 每次数据更新会执行这个函数
    }
})
```

<br>

## 过滤数据
```javascript
// 别忘了依赖注入 ngScreening
app.controller('yourCtrl',function ($scope, ngScreening) {
    // 初始数据
    $scope.yourData = [
        {
            name:'香蕉',
            isChecked: true
        },
        {
            name:'菠萝',
            isChecked: true
        },
        {
            name:'梨子'
        }
    ]
    // 每次数据更新会执行这个函数
    $scope.yourCallback = function () {
        // 将选中的数据筛选出来，返回一个新的数据
        var newData = ngScreening.getChecked($scope.yourData);
        console.log(newData);
    }
})
```

<br>


## 配置参数

### label
设置筛选行标题
```html
<screening label="标题:">
    ...
</screening>
```

### initrows (defualt: undefined)
初始化显示的screening行数
```html
<!-- 默认显示3行筛选器，其余的会收起隐藏 -->
<ng-screening initrows="3">
    ...
</ng-screening>

<!-- 固定初始化行数，并隐藏伸缩按钮 -->
<ng-screening initrows="-1 || fixed">
    ...
</ng-screening>
```

### multi-name (defulat: checkbox-全选, radio-单选)
全选的控制按钮名称
```html
<!-- 控制按钮点击后可以全部选中或反选 -->
<screening-checkbox multi-name="全选"></screening-checkbox>

<!-- 单选的只有样式没有实际功能 -->
<screening-radio multi-name="单选"></screening-radio>
```
