# ngScreening v0.3.7

angular筛选器组件
通过控制器定义数据，screening帮你完成数据的渲染、监听、过滤等功能。 
 

## DEMO
http://moerj.com/Github/ngScreening/
  

## Getting Started
在使用前，你需要引入 angular

```javascript

require('angular');

require('ngScreening');

angular.module('yourProject',['ngScreening']);

```

  
## How to use
1. <a href="#step1">布局</a> 在html页面上定义好容器
2. <a href="#step2">数据操作</a> 传入数据，开启监听
3. <a href="#step3">callback</a> 响应筛选数据变化

  



<h2 id="step1">布局</h2>

### ng-screening
筛选器的整体容器框
```html
<!-- 创建一个筛选器的外壳 -->
<ng-screening>
    ...
</ng-screening>

<!-- 创建一个筛选器外壳 -->
<!-- 这种方式可以解决：初始化页面时内部的真实dom暴露，导致页面结构跳动 -->
<div class="ngScreening">
    ...
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

### screening-flex
弹性容器布局，flex中的元素会均分screening行剩余部分  
  
而当screening中只有flex布局时，screening的label参数会被禁用

#### justify-content
screening-flex指令可以接收的参数，设置flex的均分方式，具体参数同css-flex  
  
当screening有混合布局时，默认justify-content:center

```html
<screening>
    <screening-flex label="flex容器1">
        <input type="text">
    </screening-flex>
    <screening-flex label="flex容器2">
        <input type="text">
    </screening-flex>
    <screening-flex label="flex容器3">
        <input type="text">
    </screening-flex>
</screening>
```


  

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

### isChecked  
defualt: undefined    
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

### isHidden  
defualt: undefined  
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

  

## 监听

### screening-event   
default: 'change'  
监听dom元素事件，事件触发时会执行callback
```html
<!-- 定义一个搜索功能 -->
<screening-div label="搜索:">
    <!-- 监听监听输入框change事件 -->
    <input screening-event type="text" ></input>

    <!-- 监听监听按钮click事件 -->
    <button screening-event="click" type="button" >搜索</button>
</screening-div>
```

### screening-watch
监听数据模型，模型改变时会执行callback
```html
<input type="text" ng-model="yourData">

<!-- screening-watch 可以在筛选器内任意位置 -->
<screening-watch data="yourData"></screening-watch>
```

  

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

### serarch
定义搜索回调函数，界面会生成一个搜索按钮
```html
<ng-screening search="yourSearch()" >
    ...
</ng-screening>
```
```javascript
app.controller('yourCtrl',function ($scope) {
    $scope.yourSearch = function () {
        // 按钮点击后，会执行这个函数
    }
})
```

### reset
定义重置回调函数，界面会生成一个重置按钮。  
点击按钮会重置组件内的数据。包括：单选组、多选组的选中状态，原生dom的输入值，screening-watch的ngModel
```html
<ng-screening reset="yourReset()" >
    ...
</ng-screening>
```
```javascript
app.controller('yourCtrl',function ($scope) {
    $scope.yourReset = function () {
        // 按钮点击后，会执行这个函数
    }
})
```
  
  
当然，如果你不需要 reset 的回调，这样写就可以了。
```html
<ng-screening reset >
    ...
</ng-screening>
```
  

## API - 服务

### getChecked()
过滤掉未选择的数据，返回一个新数据
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

### resize()
重置screening尺寸，自动显示或隐藏伸缩按钮
```javascript
app.controller('yourCtrl',function ($scope, ngScreening) {
    // 重置页面上所有screening容器
    ngScreening.resize()

    // 重置指定的screening容器，参数为DOM对象
    var DOM = document.getElementById('yourScreening');
    ngScreening.resize(DOM)

})
```

  


## OPTIONS 配置参数

### label
设置筛选行标题
```html
<screening label="标题:">
    ...
</screening>
```

### initrows  
defualt: undefined    
初始化显示的 screening screening-checkbox screening-radio 的行数
```html
<!-- 默认显示3行筛选器，其余的会收起隐藏 -->
<ng-screening initrows="3">
    ... 1 ...
    ... 2 ...
    ... 3 ...
    ... 被隐藏 ... 
</ng-screening>

<!-- 固定初始化行数，隐藏组件伸缩按钮 -->
<ng-screening>
    <!-- checkbox组默认全部显示，没有伸缩按钮 -->
    <screening>
        <screening-checkbox data="yourData" ></screening-checkbox>
    </screening>
</ng-screening>

<!-- initrows == 最大行数 或 参数'all'，初始显示所有行，伸缩按钮显示 -->
<ng-screening initrows="all">
    ...
</ng-screening>
```

### multi-name  
default: checkbox-全选, radio-单选  
全选的控制按钮名称
```html
<!-- 控制按钮点击后可以全部选中或反选 -->
<screening-checkbox multi-name="全选"></screening-checkbox>

<!-- 单选的只有样式没有实际功能 -->
<screening-radio multi-name="单选"></screening-radio>
```

### width
screening-div设置宽度
```html
<!-- 设置容器为500像素 -->
<screening-div width="500px"></screening-div>
```

### important
让行常驻显示，不受外框隐藏控制
```html
<screening important>
</screening>
```

### overflow
定义一行在宽度不够时的显示方式，默认auto(行高度不够时出现滚动条)  
如果有下拉菜单等元素放在行内，可以设置overflow="visible"，这样保证下拉时正常显示。

  

## Support
- IE 9+
- angular 1.x
