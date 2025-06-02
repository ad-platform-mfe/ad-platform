<script setup>
import { useRouter } from 'vue-router'
import { reactive, getCurrentInstance } from 'vue'
import loginApi from '@/api/loginApi'
import md5 from 'js-md5'
import microApp from '@micro-zoe/micro-app'

const router = useRouter()
const loginForm = reactive({
  account: 13277081267,
  password: 'a123456'
})
const { proxy } = getCurrentInstance()

function onSubmit() {
  let params = loginForm
  params.password = md5(params.password)
  loginApi.accountLogin(params).then((res) => {
    console.log(res)
    const { success, data, message } = res
    if (success) {
      let { accessToken } = data
      proxy.$message.success('登录成功')
      microApp.setGlobalData({
        token: accessToken
      })
      router.push('/main/childHome')
    } else {
      proxy.$message.error(message)
    }
  })
}
</script>

<template>
  <div class="login-page-redesigned">
    <main class="login-main-content">
      <div class="login-panel-redesigned">
        <div class="panel-l-redesigned">
          <div class="info-section">
            <h2>高效触达，精准投放</h2>
            <p>新一代数字化广告平台，助力您的业务增长。</p>
            <ul>
              <li><i class="icon-feature">🎯</i> 精准用户画像</li>
              <li><i class="icon-feature">📈</i> 实时数据分析</li>
              <li><i class="icon-feature">💡</i> 智能投放策略</li>
              <li><i class="icon-feature">🌐</i> 多渠道覆盖</li>
            </ul>
          </div>
          <div class="promo-image-container">
            <img src="../../assets/images/trial_banner.png" alt="Platform Promotion" />
          </div>
        </div>
        <div class="panel-r-redesigned">
          <h2>欢迎登录</h2>
          <el-form :model="loginForm" size="large" class="login-form-redesigned">
            <el-form-item prop="account">
              <el-input
                v-model="loginForm.account"
                placeholder="请输入帐号"
                maxlength="11"
                clearable
                prefix-icon="User"
              ></el-input>
            </el-form-item>
            <el-form-item prop="password">
              <el-input
                type="password"
                v-model="loginForm.password"
                placeholder="请输入密码"
                clearable
                show-password
                prefix-icon="Lock"
              ></el-input>
            </el-form-item>
            <el-form-item>
              <el-button
                type="primary"
                class="login-btn-redesigned"
                @click="onSubmit('loginForm')"
                >登 录</el-button
              >
            </el-form-item>
            <div class="form-footer">
              <el-link type="primary">忘记密码?</el-link>
              <el-link type="primary">注册新账号</el-link>
            </div>
          </el-form>
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped lang="scss">
.login-page-redesigned {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  min-height: 100vh;
  background-color: #f0f2f5; 
  font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
  color: #303133;
}

.logo-redesigned {
  font-size: 28px;
  font-weight: bold;
  color: #1677FF; 
  cursor: pointer;
}

.login-main-content {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-grow: 1; 
  width: 100%;
  padding: 40px 20px;
}

.login-panel-redesigned {
  width: 1000px;
  max-width: 1100px;
  display: flex;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  overflow: hidden; 
}

.panel-l-redesigned {
  width: 50%;
  padding: 60px 40px;
  background-color: #1677FF; 
  color: #ffffff;
  display: flex;
  flex-direction: column;
  justify-content: center;

  .info-section {
    h2 {
      font-size: 28px;
      font-weight: 600;
      margin-bottom: 15px;
    }
    p {
      font-size: 16px;
      margin-bottom: 30px;
      line-height: 1.6;
    }
    ul {
      list-style: none;
      padding: 0;
      li {
        font-size: 15px;
        margin-bottom: 12px;
        display: flex;
        align-items: center;
        .icon-feature {
          margin-right: 10px;
          font-style: normal;
        }
      }
    }
  }
  .promo-image-container {
    margin-top: 40px;
    text-align: center;
    img {
      max-width: 100%;
      border-radius: 6px;
      max-height: 250px; 
      object-fit: cover;
    }
  }
}

.panel-r-redesigned {
  width: 50%;
  padding: 60px 50px;
  display: flex;
  flex-direction: column;
  justify-content: center;

  h2 {
    font-size: 24px;
    font-weight: 600;
    color: #303133;
    margin-bottom: 30px;
    text-align: center;
  }
}

.login-form-redesigned {
  .el-form-item {
    margin-bottom: 25px;
  }
  .el-input {
    :deep(.el-input__wrapper) {
      border-radius: 4px;
      padding: 2px 12px; 
    }
    :deep(.el-input__inner) {
      height: 42px;
      line-height: 42px;
    }
  }
}

.login-btn-redesigned {
  width: 100%;
  height: 44px;
  font-size: 16px;
  border-radius: 4px;
  background-color: #1677FF;
  border-color: #1677FF;
  &:hover {
    background-color: #409EFF;
    border-color: #409EFF;
  }
  &:active {
    background-color: #0052CC;
    border-color: #0052CC;
  }
}

.form-footer {
  display: flex;
  justify-content: space-between;
  margin-top: 15px;
  font-size: 14px;
}

@media (max-width: 900px) {
  .login-panel-redesigned {
    flex-direction: column;
    width: 90%;
    max-width: 500px; 
  }
  .panel-l-redesigned, .panel-r-redesigned {
    width: 100%;
    padding: 40px 30px;
  }
  .panel-l-redesigned {
    .promo-image-container {
        display: none; 
    }
  }
}

@media (max-width: 600px) {
    .login-header {
        padding: 15px 20px;
    }
    .logo-redesigned {
        font-size: 24px;
    }
    .panel-l-redesigned, .panel-r-redesigned {
        padding: 30px 20px;
    }
     .panel-l-redesigned .info-section h2 {
        font-size: 24px;
    }
    .panel-l-redesigned .info-section p, .panel-l-redesigned .info-section ul li {
        font-size: 14px;
    }
    .panel-r-redesigned h2 {
        font-size: 22px;
    }
}
</style>
