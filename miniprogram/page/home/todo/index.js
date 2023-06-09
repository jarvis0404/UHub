// 1. 完成页面结构、布局、样式
// 2. 设计数据结构
// 3. 完成数据绑定
// 4. 设计交互操作事件
// 5. 数据存储
Page({
  // ===== 页面数据对象 =====
  data: {
    input: '',
    todos: [],
    leftCount: 0,
    allCompleted: false,
    logs: [],
    addOneLoading: false,
    loadingHidden: true,
    loadingText: '',
    toastHidden: true,
    toastText: '',
    clearAllLoading: false
  },
  save: function () {
    wx.setStorageSync('todo_list', this.data.todos)
    wx.setStorageSync('todo_logs', this.data.logs)
    //close loading and toggle button loading status
    var self = this;
    setTimeout( function() {
      self.setData( {
          loadingHidden: true,
          addOneLoading: false,
          loadingText: ''
      });
    }, 100);
  },
  // ===== 页面生命周期方法 =====
  onLoad: function () {
    var todos = wx.getStorageSync('todo_list') // 调用 WX API 从本地缓存中获取数据
    if (todos) {
      var leftCount = todos.filter(function (item) {
        return !item.completed
      }).length
      this.setData({ todos: todos, leftCount: leftCount })
    }
    var logs = wx.getStorageSync('todo_logs')
    if (logs) {
      this.setData({ logs: logs })
    }
  },
  // ===== 事件处理函数 =====
  inputChangeHandle: function (e) {
    this.setData({ input: e.detail.value })
  },
  addTodoHandle: function (e) {
    if (!this.data.input || !this.data.input.trim()) return
    this.setData( {
        addOneLoading: true
    });

    //open loading
    this.setData( {
        loadingHidden: false,
        loadingText: 'Waiting...'
    });
    var todos = this.data.todos
    todos.push({ name: this.data.input, completed: false })
    var logs = this.data.logs
    logs.push({ timestamp: new Date().toLocaleString(), action: '新增', name: this.data.input })
    this.setData({
      input: '',
      todos: todos,
      leftCount: this.data.leftCount + 1,
      logs: logs
    })
    this.save()
  },
  toggleTodoHandle: function (e) {
    var index = e.currentTarget.dataset.index
    var todos = this.data.todos
    todos[index].completed = !todos[index].completed
    var logs = this.data.logs
    logs.push({
      timestamp: new Date().toLocaleString(),
      action: todos[index].completed ? '标记完成' : '标记未完成',
      name: todos[index].name
    })
    this.setData({
      todos: todos,
      leftCount: this.data.leftCount + (todos[index].completed ? -1 : 1),
      logs: logs
    })
    this.save()
  },
  removeTodoHandle: function (e) {
    var index = e.currentTarget.dataset.index
    var todos = this.data.todos
    var remove = todos.splice(index, 1)[0]
    var logs = this.data.logs
    logs.push({ timestamp: new Date().toLocaleString(), action: '移除', name: remove.name })
    this.setData({
      todos: todos,
      leftCount: this.data.leftCount - (remove.completed ? 0 : 1),
      logs: logs
    })
    this.save()
  },
  toggleAllHandle: function (e) {
    this.data.allCompleted = !this.data.allCompleted
    var todos = this.data.todos
    for (var i = todos.length - 1; i >= 0; i--) {
      todos[i].completed = this.data.allCompleted
    }
    var logs = this.data.logs
    logs.push({
      timestamp: new Date().toLocaleString(),
      action: this.data.allCompleted ? '标记完成' : '标记未完成',
      name: '全部任务'
    })
    this.setData({
      todos: todos,
      leftCount: this.data.allCompleted ? 0 : todos.length,
      logs: logs
    })
    this.save()
  },
  clearCompletedHandle: function (e) {
    var todos = this.data.todos
    var isCompleteCount = 0;
    var remains = []
    for (var i = 0; i < todos.length; i++) {
      todos[i].completed || remains.push(todos[i])
      isCompleteCount += todos[i].completed?1:0;
    }
    if(isCompleteCount == 0) {
      return;
    }
    var logs = this.data.logs
    logs.push({
      timestamp: new Date().toLocaleString(),
      action: '清空',
      name: '已完成任务'
    })
    this.setData({ todos: remains, logs: logs })
    this.save()
    this.setData({
      toastHidden: false,
      toastText: 'Success'
    });
  },
  loadingChange: function() {
    this.setData({
      loadingHidden: true,
      loadingText: ''
    });
  },
  toastChange: function() {
    this.setData( {
        toastHidden: true,
        toastText: ''
    });
  }
})