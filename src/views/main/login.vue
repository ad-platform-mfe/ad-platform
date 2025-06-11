<script setup>
import { useRouter } from 'vue-router';
import { reactive, ref, computed, getCurrentInstance } from 'vue';
import loginApi from '@/api/loginApi';
import microApp from '@micro-zoe/micro-app';

const router = useRouter();
const { proxy } = getCurrentInstance();

// --- 状态管理 ---
const formMode = ref('login');
const loginFormRef = ref(null);
const registerFormRef = ref(null);
const forgotFormRef = ref(null);

// --- 表单数据模型 ---
const loginForm = reactive({
  account: '',
  password: '',
});
const registerForm = reactive({
  account: '',
  password: '',
  confirmPassword: '',
});
const forgotForm = reactive({
  account: '',
});

// --- 表单标题 ---
const formTitle = computed(() => {
  switch (formMode.value) {
    case 'register':
      return '创建新账号';
    case 'forgot':
      return '重置密码';
    default:
      return '欢迎登录';
  }
});

// --- 表单验证规则 ---
const validatePass = (rule, value, callback) => {
  if (value !== registerForm.password) {
    callback(new Error('两次输入的密码不一致!'));
  } else {
    callback();
  }
};
const loginRules = {
  account: [{ required: true, message: '请输入帐号', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
};
const registerRules = {
  account: [{ required: true, message: '请输入帐号', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
  confirmPassword: [
    { required: true, message: '请再次输入密码', trigger: 'blur' },
    { validator: validatePass, trigger: 'blur' },
  ],
};
const forgotRules = {
  account: [{ required: true, message: '请输入您的帐号', trigger: 'blur' }],
};

// --- 提交处理函数 ---
const onLogin = async () => {
  if (!loginFormRef.value) return;
  await loginFormRef.value.validate((valid) => {
    if (valid) {
      loginApi.accountLogin(loginForm).then((res) => {
        const { success, data, message } = res;
        if (success) {
          let { token } = data;
          proxy.$message.success('登录成功');
          microApp.setGlobalData({ token: token });
          router.push('/main/HomeView');
        } else {
          proxy.$message.error(message);
        }
      });
    }
  });
};

const onRegister = async () => {
  if (!registerFormRef.value) return;
  await registerFormRef.value.validate((valid) => {
    if (valid) {
      // 假设 loginApi 有 register 方法
      // loginApi.register(registerForm).then(...)
      proxy.$message.success('注册成功，请登录！');
      formMode.value = 'login';
    }
  });
};

const onForgotPassword = async () => {
  if (!forgotFormRef.value) return;
  await forgotFormRef.value.validate((valid) => {
    if (valid) {
      // 假设 loginApi 有 forgotPassword 方法
      // loginApi.forgotPassword(forgotForm).then(...)
      proxy.$message.success('密码重置邮件已发送，请注意查收！');
      formMode.value = 'login';
    }
  });
};
</script>

<template>
  <div class="login-page-redesigned">
    <main class="login-main-content">
      <div class="login-panel-redesigned">
        <div class="panel-l-redesigned">
          <div class="info-section">
            <h3>星链矩阵</h3>
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
          <h2>{{ formTitle }}</h2>

          <!-- 登录表单 -->
          <el-form
            v-if="formMode === 'login'"
            ref="loginFormRef"
            :model="loginForm"
            :rules="loginRules"
            size="large"
            class="login-form-redesigned"
          >
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
                @keyup.enter="onLogin"
              ></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" class="login-btn-redesigned" @click="onLogin"
                >登 录</el-button
              >
            </el-form-item>
            <div class="form-footer">
              <el-link type="primary" @click="formMode = 'forgot'">忘记密码?</el-link>
              <el-link type="primary" @click="formMode = 'register'">注册新账号</el-link>
            </div>
          </el-form>

          <!-- 注册表单 -->
          <el-form
            v-if="formMode === 'register'"
            ref="registerFormRef"
            :model="registerForm"
            :rules="registerRules"
            size="large"
            class="login-form-redesigned"
          >
            <el-form-item prop="account">
              <el-input
                v-model="registerForm.account"
                placeholder="请输入帐号"
                prefix-icon="User"
              ></el-input>
            </el-form-item>
            <el-form-item prop="password">
              <el-input
                type="password"
                v-model="registerForm.password"
                placeholder="请输入密码"
                show-password
                prefix-icon="Lock"
              ></el-input>
            </el-form-item>
            <el-form-item prop="confirmPassword">
              <el-input
                type="password"
                v-model="registerForm.confirmPassword"
                placeholder="请再次输入密码"
                show-password
                prefix-icon="Lock"
                @keyup.enter="onRegister"
              ></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" class="login-btn-redesigned" @click="onRegister"
                >注 册</el-button
              >
            </el-form-item>
            <div class="form-footer">
              <el-link type="primary" @click="formMode = 'login'">已有账号？返回登录</el-link>
            </div>
          </el-form>

          <!-- 忘记密码表单 -->
          <el-form
            v-if="formMode === 'forgot'"
            ref="forgotFormRef"
            :model="forgotForm"
            :rules="forgotRules"
            size="large"
            class="login-form-redesigned"
          >
            <p class="form-description">请输入您的帐号，我们将向关联邮箱发送密码重置指引。</p>
            <el-form-item prop="account">
              <el-input
                v-model="forgotForm.account"
                placeholder="请输入帐号"
                prefix-icon="User"
                @keyup.enter="onForgotPassword"
              ></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" class="login-btn-redesigned" @click="onForgotPassword"
                >发送重置邮件</el-button
              >
            </el-form-item>
            <div class="form-footer">
              <el-link type="primary" @click="formMode = 'login'">返回登录</el-link>
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
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background-color: #f0f2f5;
  font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
  color: #303133;
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
  min-height: 600px;
  display: flex;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.panel-l-redesigned {
  width: 50%;
  padding: 60px 40px;
  background-color: #1677ff;
  color: #ffffff;
  display: flex;
  flex-direction: column;
  justify-content: center;

  .info-section {
    h3 {
      font-weight: 500;
      font-size: 22px;
      opacity: 0.9;
      letter-spacing: 1px;
    }
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
  .form-description {
    font-size: 14px;
    color: #606266;
    margin-bottom: 25px;
    text-align: center;
    line-height: 1.5;
  }
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
  background-color: #1677ff;
  border-color: #1677ff;
  &:hover {
    background-color: #409eff;
    border-color: #409eff;
  }
  &:active {
    background-color: #0052cc;
    border-color: #0052cc;
  }
}

.form-footer {
  display: flex;
  justify-content: space-between;
  margin-top: 15px;
  font-size: 14px;
}

// 响应式设计
@media (max-width: 1000px) {
  .login-panel-redesigned {
    flex-direction: column;
    width: 90%;
    max-width: 500px;
  }
  .panel-l-redesigned,
  .panel-r-redesigned {
    width: 100%;
    padding: 40px;
  }
  .panel-l-redesigned {
    .promo-image-container {
      display: none;
    }
  }
}

@media (max-width: 600px) {
  .panel-l-redesigned,
  .panel-r-redesigned {
    padding: 30px 20px;
  }
  .panel-l-redesigned .info-section h2 {
    font-size: 24px;
  }
  .panel-l-redesigned .info-section p,
  .panel-l-redesigned .info-section ul li {
    font-size: 14px;
  }
  .panel-r-redesigned h2 {
    font-size: 22px;
  }
}
</style>
