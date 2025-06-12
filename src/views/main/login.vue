<script setup>
import { useRouter } from 'vue-router';
import { reactive, ref, computed, getCurrentInstance } from 'vue';
import loginApi from '@/api/loginApi';
import microApp from '@micro-zoe/micro-app';

const router = useRouter();
const { proxy } = getCurrentInstance();

// --- 状态管理 ---
const formMode = ref('login'); // 'login', 'register', 'forgot', 'reset'
const loginMethod = ref('account'); // 'account', 'email'

// --- 表单引用 ---
const accountFormRef = ref(null);
const emailLoginFormRef = ref(null);
const registerFormRef = ref(null);
const forgotFormRef = ref(null);
const resetPasswordFormRef = ref(null);

// --- 表单数据模型 ---
const accountLoginForm = reactive({
  username: '',
  password: '',
});
const emailLoginForm = reactive({
  email: '',
  code: '',
});
const registerForm = reactive({
  email: '',
  password: '',
  confirmPassword: '',
});
const forgotForm = reactive({
  email: '',
});
const resetPasswordForm = reactive({
  email: '',
  code: '',
  password: '',
  confirmPassword: '',
});

// --- 动态标题 ---
const formTitle = computed(() => {
  switch (formMode.value) {
    case 'register':
      return '创建新账号';
    case 'forgot':
      return '忘记密码';
    case 'reset':
      return '重置密码';
    default:
      return '欢迎登录';
  }
});

// --- 验证码发送状态 ---
const isSendingCode = ref(false);
const countdown = ref(60);
let timer = null;

const startCountdown = () => {
  isSendingCode.value = true;
  timer = setInterval(() => {
    if (countdown.value > 1) {
      countdown.value--;
    } else {
      clearInterval(timer);
      isSendingCode.value = false;
      countdown.value = 60;
    }
  }, 1000);
};

// --- 表单验证规则 ---
const validatePass = (form, value, callback) => {
  const targetPassword = form === 'register' ? registerForm.password : resetPasswordForm.password;
  if (value !== targetPassword) {
    callback(new Error('两次输入的密码不一致!'));
  } else {
    callback();
  }
};

const accountLoginRules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
};

const emailLoginRules = {
  email: [
    { required: true, message: '请输入邮箱地址', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] },
  ],
  code: [{ required: true, message: '请输入验证码', trigger: 'blur' }],
};

const registerRules = {
  email: [
    { required: true, message: '请输入邮箱地址', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] },
  ],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
  confirmPassword: [
    { required: true, message: '请再次输入密码', trigger: 'blur' },
    {
      validator: (rule, value, callback) => validatePass('register', value, callback),
      trigger: 'blur',
    },
  ],
};

const forgotRules = {
  email: [
    { required: true, message: '请输入您的邮箱地址', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] },
  ],
};

const resetPasswordRules = {
  code: [{ required: true, message: '请输入验证码', trigger: 'blur' }],
  password: [{ required: true, message: '请输入新密码', trigger: 'blur' }],
  confirmPassword: [
    { required: true, message: '请再次输入新密码', trigger: 'blur' },
    {
      validator: (rule, value, callback) => validatePass('reset', value, callback),
      trigger: 'blur',
    },
  ],
};

// --- 提交处理函数 ---
const handleLoginSuccess = (data) => {
  const { token } = data;
  proxy.$message.success('登录成功');
  microApp.setGlobalData({ token: token });
  router.push('/');
};

const onAccountLogin = async () => {
  if (!accountFormRef.value) return;
  await accountFormRef.value.validate((valid) => {
    if (valid) {
      loginApi.accountLogin(accountLoginForm).then((res) => {
        if (!res.code) handleLoginSuccess(res.data);
        else proxy.$message.error(res.message);
      });
    }
  });
};

const onSendCode = async () => {
  if (!emailLoginFormRef.value || isSendingCode.value) return;
  emailLoginFormRef.value.validateField('email', (isValid) => {
    if (isValid) {
      loginApi.sendLoginCode({ email: emailLoginForm.email }).then((res) => {
        if (!res.code) {
          proxy.$message.success('验证码已发送，请注意查收');
          startCountdown();
        } else {
          proxy.$message.error(res.message);
        }
      });
    }
  });
};

const onEmailLogin = async () => {
  if (!emailLoginFormRef.value) return;
  await emailLoginFormRef.value.validate((valid) => {
    if (valid) {
      loginApi.loginWithCode(emailLoginForm).then((res) => {
        if (!res.code) handleLoginSuccess(res.data);
        else proxy.$message.error(res.message);
      });
    }
  });
};

const onRegister = async () => {
  if (!registerFormRef.value) return;
  await registerFormRef.value.validate((valid) => {
    if (valid) {
      loginApi.register(registerForm).then((res) => {
        const { code, message } = res;
        if (!code) {
          proxy.$message.success('注册成功，请登录！');
          formMode.value = 'login';
        } else {
          proxy.$message.error(message);
        }
      });
    }
  });
};

const onForgotPassword = async () => {
  if (!forgotFormRef.value) return;
  await forgotFormRef.value.validate((valid) => {
    if (valid) {
      loginApi.forgotPassword({ email: forgotForm.email }).then((res) => {
        const { code, message } = res;
        if (!code) {
          proxy.$message.success('验证码已发送，请查收邮件并重置密码。');
          resetPasswordForm.email = forgotForm.email;
          formMode.value = 'reset';
        } else {
          proxy.$message.error(message);
        }
      });
    }
  });
};

const onResetPassword = async () => {
  if (!resetPasswordFormRef.value) return;
  await resetPasswordFormRef.value.validate((valid) => {
    if (valid) {
      loginApi.resetPassword(resetPasswordForm).then((res) => {
        const { code, message } = res;
        if (!code) {
          proxy.$message.success('密码重置成功，请使用新密码登录。');
          formMode.value = 'login';
        } else {
          proxy.$message.error(message);
        }
      });
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
          <div v-if="formMode === 'login'">
            <el-tabs v-model="loginMethod" class="login-tabs" stretch>
              <el-tab-pane label="账号密码登录" name="account"></el-tab-pane>
              <el-tab-pane label="邮箱验证码登录" name="email"></el-tab-pane>
            </el-tabs>

            <!-- 账号密码登录表单 -->
            <el-form
              v-if="loginMethod === 'account'"
              ref="accountFormRef"
              :model="accountLoginForm"
              :rules="accountLoginRules"
              size="large"
              class="login-form-redesigned"
            >
              <el-form-item prop="username">
                <el-input
                  v-model="accountLoginForm.username"
                  placeholder="请输入用户名"
                  prefix-icon="User"
                />
              </el-form-item>
              <el-form-item prop="password">
                <el-input
                  type="password"
                  v-model="accountLoginForm.password"
                  placeholder="请输入密码"
                  show-password
                  prefix-icon="Lock"
                  @keyup.enter="onAccountLogin"
                />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" class="login-btn-redesigned" @click="onAccountLogin"
                  >登 录</el-button
                >
              </el-form-item>
              <div class="form-footer">
                <el-link type="primary" @click="formMode = 'forgot'">忘记密码?</el-link>
                <el-link type="primary" @click="formMode = 'register'">注册新账号</el-link>
              </div>
            </el-form>

            <!-- 邮箱验证码登录表单 -->
            <el-form
              v-if="loginMethod === 'email'"
              ref="emailLoginFormRef"
              :model="emailLoginForm"
              :rules="emailLoginRules"
              size="large"
              class="login-form-redesigned"
            >
              <el-form-item prop="email">
                <el-input
                  v-model="emailLoginForm.email"
                  placeholder="请输入邮箱地址"
                  prefix-icon="Message"
                >
                  <template #append>
                    <el-button @click="onSendCode" :disabled="isSendingCode">
                      {{ isSendingCode ? `${countdown}s 后重发` : '获取验证码' }}
                    </el-button>
                  </template>
                </el-input>
              </el-form-item>
              <el-form-item prop="code">
                <el-input
                  v-model="emailLoginForm.code"
                  placeholder="请输入6位验证码"
                  prefix-icon="Key"
                  @keyup.enter="onEmailLogin"
                />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" class="login-btn-redesigned" @click="onEmailLogin"
                  >登 录</el-button
                >
              </el-form-item>
            </el-form>
          </div>

          <!-- 注册表单 -->
          <el-form
            v-if="formMode === 'register'"
            ref="registerFormRef"
            :model="registerForm"
            :rules="registerRules"
            size="large"
            class="login-form-redesigned"
          >
            <el-form-item prop="email">
              <el-input
                v-model="registerForm.email"
                placeholder="请输入邮箱"
                prefix-icon="Message"
              ></el-input>
            </el-form-item>
            <el-form-item prop="password">
              <el-input
                type="password"
                v-model="registerForm.password"
                placeholder="请输入密码"
                show-password
                prefix-icon="Lock"
                @keyup.enter="onRegister"
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
            <p class="form-description">请输入您的注册邮箱，我们将向该邮箱发送密码重置验证码。</p>
            <el-form-item prop="email">
              <el-input
                v-model="forgotForm.email"
                placeholder="请输入邮箱"
                prefix-icon="Message"
                @keyup.enter="onForgotPassword"
              ></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" class="login-btn-redesigned" @click="onForgotPassword"
                >发送验证码</el-button
              >
            </el-form-item>
            <div class="form-footer">
              <el-link type="primary" @click="formMode = 'login'">返回登录</el-link>
            </div>
          </el-form>

          <!-- 重置密码表单 -->
          <el-form
            v-if="formMode === 'reset'"
            ref="resetPasswordFormRef"
            :model="resetPasswordForm"
            :rules="resetPasswordRules"
            size="large"
            class="login-form-redesigned"
          >
            <p class="form-description">
              验证码已发送至 <strong>{{ resetPasswordForm.email }}</strong>
            </p>
            <el-form-item prop="code">
              <el-input
                v-model="resetPasswordForm.code"
                placeholder="请输入邮箱验证码"
                prefix-icon="Key"
              ></el-input>
            </el-form-item>
            <el-form-item prop="password">
              <el-input
                type="password"
                v-model="resetPasswordForm.password"
                placeholder="请输入新密码"
                show-password
                prefix-icon="Lock"
              ></el-input>
            </el-form-item>
            <el-form-item prop="confirmPassword">
              <el-input
                type="password"
                v-model="resetPasswordForm.confirmPassword"
                placeholder="请再次输入新密码"
                show-password
                prefix-icon="Lock"
                @keyup.enter="onResetPassword"
              ></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" class="login-btn-redesigned" @click="onResetPassword"
                >确认重置密码</el-button
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
    display: none;
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

.login-tabs {
  margin-bottom: 25px;
  :deep(.el-tabs__header) {
    margin: 0;
  }
  :deep(.el-tabs__nav-wrap::after) {
    height: 1px;
  }
  :deep(.el-tabs__item) {
    font-size: 16px;
  }
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
