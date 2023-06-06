import versionUtil from './utils/version-util';
App({
  onLaunch: function() {
    wx.cloud.init({
        env: 'cloud-1gockrq93404066e',
        traceUser: true
    })
    
    // 检查更新
    versionUtil.checkUpdate();
  },
  globalData: {
  }
});
