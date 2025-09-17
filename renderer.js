/**
 * This file is loaded via the <script> tag in the index.html file and will
 * be executed in the renderer process for that window. No Node.js APIs are
 * available in this process because `nodeIntegration` is turned off and
 * `contextIsolation` is turned on. Use the contextBridge API in `preload.js`
 * to expose Node.js functionality from the main process.
 */

const { V2NIMClient } = require('node-nim')

window.onload = () => {
  const client = new V2NIMClient()
  document.getElementById('init').onclick = () => {
    const appkey = document.getElementById('appkey').value
    const result = client.init({ appkey })
    if (result) {
      console.error(`[nim] failed to initialize NIM SDK, result: ${result}`)
    } else {
      client.loginService.on('loginStatus', (status) => {
        // 登录状态变更回调
        console.log(`[nim] login status changed: ${status}`)
      })
      client.loginService.on('loginFailed', (error) => {
        // 登陆失败状态回调
        console.error(`[nim] login failed: ${JSON.stringify(error)}`)
      })
      client.loginService.on('kickedOffline', (details) => {
        // 被踢下线回调
        console.warn(`[nim] kicked offline: ${details}`)
      })
      client.loginService.on('connectStatus', (connectStatus) => {
        // 连接状态变更回调
        console.log(`[nim] connect status changed: ${connectStatus}`)
      })
      client.loginService.on('disconnected', (error) => {
        // 断开连接回调
        console.warn(`[nim] disconnected: ${JSON.stringify(error)}`)
      })
      client.loginService.on('connectFailed', (error) => {
        // 连接失败回调
        console.error(`[nim] connect failed: ${JSON.stringify(error)}`)
      })
      client.loginService.on('dataSync', (syncType, syncState, error) => {
        // 数据同步回调
        console.log(`[nim] data sync: ${syncType}, ${syncState}, ${JSON.stringify(error)}`)
      })
      console.log('[nim] init success')
    }
  }
  document.getElementById('uninit').onclick = () => {
    const result = client.uninit()
    if (result) {
      console.error(`[nim] failed to uninitialize NIM SDK, result: ${result}`)
    } else {
      console.log('[nim] uninit success')
    }
  }
  document.getElementById('login').onclick = async () => {
    const account = document.getElementById('account').value
    const password = document.getElementById('password').value
    try {
        await client.loginService.login(account, password, {})
    } catch (error) {
        console.error(`[nim] failed to login, error: ${JSON.stringify(error)}`)
    }
  }
  document.getElementById('logout').onclick = async () => {
    try {
        await client.loginService.logout()
    } catch (error) {
        console.error(`[nim] failed to logout, error: ${JSON.stringify(error)}`)
    }
  }
}
