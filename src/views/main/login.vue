<script setup>
import { useRouter } from 'vue-router';
import { reactive, ref, computed } from 'vue';
import { message } from 'ant-design-vue';
import { UserOutlined, LockOutlined, MailOutlined, KeyOutlined } from '@ant-design/icons-vue';
import loginApi from '@/api/loginApi';
import microApp from '@micro-zoe/micro-app';

const router = useRouter();

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
  localStorage.setItem('token', token);
  microApp.setGlobalData({ token: token });
  message.success('登录成功');
  router.push('/');
};

const onAccountLogin = async () => {
  try {
    await accountFormRef.value.validate();
    const res = await loginApi.accountLogin(accountLoginForm);
    if (!res.code) handleLoginSuccess(res.data);
    else message.error(res.message);
  } catch (error) {
    console.error('账号登录失败:', error);
    message.error('登录失败，请稍后重试');
  }
};

const onSendCode = async () => {
  if (isSendingCode.value) return;
  try {
    await emailLoginFormRef.value.validateFields(['email']);
    isSendingCode.value = true;
    const res = await loginApi.sendLoginCode({ email: emailLoginForm.email });
    if (!res.code) {
      message.success('验证码已发送，请注意查收');
      startCountdown();
    } else {
      message.error(res.message);
      isSendingCode.value = false;
    }
  } catch (error) {
    isSendingCode.value = false;
    console.error('发送验证码失败:', error);
    message.error('发送验证码失败，请稍后重试。');
  }
};

const onEmailLogin = async () => {
  try {
    await emailLoginFormRef.value.validate();
    const res = await loginApi.loginWithCode(emailLoginForm);
    if (!res.code) handleLoginSuccess(res.data);
    else message.error(res.message);
  } catch (error) {
    console.error('邮箱登录失败:', error);
    message.error('登录失败，请稍后重试');
  }
};

const onRegister = async () => {
  try {
    await registerFormRef.value.validate();
    const res = await loginApi.register(registerForm);
    if (!res.code) {
      message.success('注册成功，请登录！');
      formMode.value = 'login';
    } else {
      message.error(res.message);
    }
  } catch (error) {
    console.error('注册失败:', error);
    message.error('注册失败，请稍后重试');
  }
};

const onForgotPassword = async () => {
  try {
    await forgotFormRef.value.validate();
    const res = await loginApi.forgotPassword({ email: forgotForm.email });
    if (!res.code) {
      message.success('验证码已发送，请查收邮件并重置密码。');
      resetPasswordForm.email = forgotForm.email;
      formMode.value = 'reset';
    } else {
      message.error(res.message);
    }
  } catch (error) {
    console.error('请求忘记密码失败:', error);
    message.error('操作失败，请稍后重试');
  }
};

const onResetPassword = async () => {
  try {
    await resetPasswordFormRef.value.validate();
    const res = await loginApi.resetPassword(resetPasswordForm);
    if (!res.code) {
      message.success('密码重置成功，请使用新密码登录。');
      formMode.value = 'login';
    } else {
      message.error(res.message);
    }
  } catch (error) {
    console.error('重置密码失败:', error);
    message.error('密码重置失败，请稍后重试');
  }
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
          <!-- 主登录/注册/忘记密码容器 -->
          <div v-if="formMode === 'login'" class="form-container">
            <a-tabs v-model:activeKey="loginMethod" centered class="login-tabs">
              <a-tab-pane key="account" tab="账号密码登录"></a-tab-pane>
              <a-tab-pane key="email" tab="邮箱验证码登录"></a-tab-pane>
            </a-tabs>

            <!-- 账号密码登录表单 -->
            <a-form
              v-if="loginMethod === 'account'"
              ref="accountFormRef"
              :model="accountLoginForm"
              :rules="accountLoginRules"
              class="login-form"
              @finish="onAccountLogin"
            >
              <a-form-item name="username">
                <a-input
                  v-model:value="accountLoginForm.username"
                  placeholder="请输入用户名"
                  size="large"
                >
                  <template #prefix> <UserOutlined /> </template>
                </a-input>
              </a-form-item>
              <a-form-item name="password">
                <a-input-password
                  v-model:value="accountLoginForm.password"
                  placeholder="请输入密码"
                  size="large"
                >
                  <template #prefix> <LockOutlined /> </template>
                </a-input-password>
              </a-form-item>
              <a-form-item>
                <a-button type="primary" html-type="submit" size="large" class="login-btn">
                  登 录
                </a-button>
              </a-form-item>
              <div class="form-footer">
                <a-button type="link" @click="formMode = 'forgot'">忘记密码?</a-button>
                <a-button type="link" @click="formMode = 'register'">注册新账号</a-button>
              </div>
            </a-form>

            <!-- 邮箱验证码登录表单 -->
            <a-form
              v-if="loginMethod === 'email'"
              ref="emailLoginFormRef"
              :model="emailLoginForm"
              :rules="emailLoginRules"
              class="login-form"
              @finish="onEmailLogin"
            >
              <a-form-item name="email">
                <a-input
                  v-model:value="emailLoginForm.email"
                  placeholder="请输入邮箱地址"
                  size="large"
                >
                  <template #prefix> <MailOutlined /> </template>
                </a-input>
              </a-form-item>
              <a-form-item name="code">
                <a-input-group compact>
                  <a-input
                    v-model:value="emailLoginForm.code"
                    placeholder="请输入验证码"
                    size="large"
                    style="width: calc(100% - 130px)"
                  />
                  <a-button
                    size="large"
                    @click="onSendCode"
                    :disabled="isSendingCode"
                    :loading="isSendingCode"
                    style="width: 130px"
                  >
                    {{ isSendingCode ? `${countdown}s` : '获取验证码' }}
                  </a-button>
                </a-input-group>
              </a-form-item>
              <a-form-item>
                <a-button type="primary" html-type="submit" size="large" class="login-btn">
                  登 录
                </a-button>
              </a-form-item>
            </a-form>
          </div>

          <!-- 注册和忘记密码等其他表单 -->
          <div v-else class="form-container">
            <h2 class="form-title-standalone">{{ formTitle }}</h2>
            <!-- 注册表单 -->
            <a-form
              v-if="formMode === 'register'"
              ref="registerFormRef"
              :model="registerForm"
              :rules="registerRules"
              class="login-form"
              @finish="onRegister"
            >
              <a-form-item name="email">
                <a-input v-model:value="registerForm.email" placeholder="请输入邮箱" size="large">
                  <template #prefix> <MailOutlined /> </template>
                </a-input>
              </a-form-item>
              <a-form-item name="password">
                <a-input-password
                  v-model:value="registerForm.password"
                  placeholder="请输入密码"
                  size="large"
                >
                  <template #prefix> <LockOutlined /> </template>
                </a-input-password>
              </a-form-item>
              <a-form-item name="confirmPassword">
                <a-input-password
                  v-model:value="registerForm.confirmPassword"
                  placeholder="请再次输入密码"
                  size="large"
                >
                  <template #prefix> <LockOutlined /> </template>
                </a-input-password>
              </a-form-item>
              <a-form-item>
                <a-button type="primary" html-type="submit" size="large" class="login-btn">
                  注 册
                </a-button>
              </a-form-item>
              <div class="form-footer">
                <a-button type="link" @click="formMode = 'login'">已有账号？返回登录</a-button>
              </div>
            </a-form>

            <!-- 忘记密码表单 -->
            <a-form
              v-if="formMode === 'forgot'"
              ref="forgotFormRef"
              :model="forgotForm"
              :rules="forgotRules"
              class="login-form"
              @finish="onForgotPassword"
            >
              <p class="form-description">请输入您的注册邮箱，我们将向该邮箱发送密码重置验证码。</p>
              <a-form-item name="email">
                <a-input v-model:value="forgotForm.email" placeholder="请输入邮箱" size="large">
                  <template #prefix> <MailOutlined /> </template>
                </a-input>
              </a-form-item>
              <a-form-item>
                <a-button type="primary" html-type="submit" size="large" class="login-btn">
                  发送验证码
                </a-button>
              </a-form-item>
              <div class="form-footer">
                <a-button type="link" @click="formMode = 'login'">返回登录</a-button>
              </div>
            </a-form>

            <!-- 重置密码表单 -->
            <a-form
              v-if="formMode === 'reset'"
              ref="resetPasswordFormRef"
              :model="resetPasswordForm"
              :rules="resetPasswordRules"
              class="login-form"
              @finish="onResetPassword"
            >
              <p class="form-description">
                验证码已发送至 <strong>{{ resetPasswordForm.email }}</strong>
              </p>
              <a-form-item name="code">
                <a-input
                  v-model:value="resetPasswordForm.code"
                  placeholder="请输入邮箱验证码"
                  size="large"
                >
                  <template #prefix> <KeyOutlined /> </template>
                </a-input>
              </a-form-item>
              <a-form-item name="password">
                <a-input-password
                  v-model:value="resetPasswordForm.password"
                  placeholder="请输入新密码"
                  size="large"
                >
                  <template #prefix> <LockOutlined /> </template>
                </a-input-password>
              </a-form-item>
              <a-form-item name="confirmPassword">
                <a-input-password
                  v-model:value="resetPasswordForm.confirmPassword"
                  placeholder="请再次输入新密码"
                  size="large"
                >
                  <template #prefix> <LockOutlined /> </template>
                </a-input-password>
              </a-form-item>
              <a-form-item>
                <a-button type="primary" html-type="submit" size="large" class="login-btn">
                  确认重置密码
                </a-button>
              </a-form-item>
              <div class="form-footer">
                <a-button type="link" @click="formMode = 'login'">返回登录</a-button>
              </div>
            </a-form>
          </div>
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
}

.login-tabs {
  margin-bottom: 25px;
}

.login-form {
  .ant-form-item {
    margin-bottom: 25px;
  }
}

.form-title-standalone {
  font-size: 24px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 30px;
  text-align: center;
}

.form-description {
  font-size: 14px;
  color: #606266;
  margin-bottom: 25px;
  text-align: center;
  line-height: 1.5;
}

.login-btn {
  width: 100%;
}

.form-footer {
  display: flex;
  justify-content: space-between;
  margin-top: -10px;
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
  .form-title-standalone {
    font-size: 22px;
  }
}
</style>
