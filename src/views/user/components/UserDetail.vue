<template>
  <div class="createPost-container">
    <el-form ref="postForm" :model="postForm" :rules="postFormRules" class="form-container">
      <div class="createPost-main-container">
        <el-form-item
          v-if="isEdit"
          style="margin-bottom: 40px;"
          prop="userId"
          label="用户ID"
          class="postInfo-container-item"
        >
          <el-input ref="userId" v-model="postForm.userId" readonly="true" />
        </el-form-item>
        <el-form-item
          style="margin-bottom: 40px;"
          prop="userName"
          label="用户名"
          class="postInfo-container-item"
        >
          <el-input ref="userName" v-model="postForm.userName" :type="text" />
        </el-form-item>
        <el-form-item
          v-if="isEdit"
          style="margin-bottom: 40px;"
          prop="password"
          label="老密码"
          class="postInfo-container-item"
        >
          <el-input ref="oldPassword" v-model="postForm.oldPassword" type="password" />
        </el-form-item>
        <el-form-item
          style="margin-bottom: 40px;"
          prop="password"
          label="密码"
          class="postInfo-container-item"
        >
          <el-input ref="password" v-model="postForm.password" type="password" />
        </el-form-item>
        <el-form-item
          style="margin-bottom: 40px;"
          prop="repeatpassword"
          label="重复密码"
          class="postInfo-container-item"
        >
          <el-input ref="repeatpassword" v-model="postForm.repeatpassword" type="password" />
        </el-form-item>
        <el-form-item
          style="margin-bottom: 40px;"
          prop="name"
          label="姓名"
          class="postInfo-container-item"
        >
          <el-input ref="name" v-model="postForm.name" />
        </el-form-item>
        <el-form-item
          style="margin-bottom: 40px;"
          prop="phone"
          label="电话"
          class="postInfo-container-item"
        >
          <el-input ref="phone" v-model="postForm.phone" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm">提交</el-button>
          <el-button @click="onCancel">取消</el-button>
        </el-form-item>
      </div>
    </el-form>
  </div>
</template>

<script>
import { getUser, createUser, updateUser } from "@/api/user";

const defaultForm = {
  userId: undefined,
  userName: "",
  oldPassword: "",
  password: "",
  repeatpassword: "",
  name: "",
  phone: "",
  role: 0
};

export default {
  name: "UserDetail",
  props: {
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        if (this.postForm.checkPass !== "") {
          this.$refs.postForm.validateField("checkPass");
        }
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.postForm.password) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      postForm: Object.assign({}, defaultForm),
      postFormRules: {
        userName: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 1, max: 30, message: "长度在 30 个字以内", trigger: "blur" }
        ],
        oldPassword: [
          { required: true, message: "请输入老密码", trigger: "blur" },
          { min: 1, max: 50, message: "长度在 50 个字以内", trigger: "blur" }
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 6, max: 50, message: "长度在 6~50 个字符", trigger: "blur" },
          { validator: validatePass, trigger: "blur" }
        ],
        repeatpassword: [
          { required: true, message: "请输入重复密码", trigger: "blur" },
          { min: 6, max: 50, message: "长度在 6~50 个字符", trigger: "blur" },
          { validator: validatePass2, trigger: "blur" }
        ],
        name: [
          { required: true, message: "请输入姓名", trigger: "blur" },
          { min: 1, max: 50, message: "长度在 50 个字以内", trigger: "blur" }
        ],
        phone: [
          { required: true, message: "电话", trigger: "blur" },
          { min: 1, max: 20, message: "长度在 20 个字以内", trigger: "blur" }
        ]
      },
      loading: false,
      userListOptions: [],
      tempRoute: {}
    };
  },

  created() {
    if (this.isEdit) {
      const id = this.$route.params && this.$route.params.id;
      console.info("xid:" + id);
      this.fetchData(id);
    } else {
      this.postForm = Object.assign({}, defaultForm);
    }

    this.tempRoute = Object.assign({}, this.$route);
  },
  methods: {
    fetchData(userId) {
      console.log("userId:" + userId);
      getUser(userId)
        .then(response => {
          this.postForm = response.data;

          this.postForm.title += `   User Id:${this.postForm.userId}`;
          this.postForm.content_short += `   User Id:${this.postForm.userId}`;

          this.setPageTitle();
        })
        .catch(err => {
          console.log(err);
        });
    },
    setPageTitle() {
      if (this.isEdit) {
        const title = "Edit User";
        document.title = `${title} - ${this.postForm.userId}`;
      } else {
        const title = "Add Device";
        document.title = `${title} `;
      }
    },
    submitForm() {
      console.log(this.postForm);
      this.$refs.postForm.validate(valid => {
        if (valid) {
          if (this.isEdit) {
            updateUser(this.postForm).then(response => {
              this.list = response.data.content;
              this.total = response.data.totalSize;
              this.$notify({
                title: "成功",
                message: "更新用户成功",
                type: "success",
                duration: 2000
              });
              this.$router.push("/user/list");
            });
          } else {
            createUser(this.postForm).then(response => {
              this.list = response.data.content;
              this.total = response.data.totalSize;
              this.$notify({
                title: "成功",
                message: "新建用户成功",
                type: "success",
                duration: 2000
              });
              this.$router.push("/user/list");
            });
          }

          this.loading = true;
          this.postForm.status = "active";
          this.loading = false;
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    onCancel() {
      // this.$message({
      //   message: "cancel!",
      //   type: "warning"
      // });
      this.$router.push("/user/list");
    }
  }
};
</script>

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";

.createPost-container {
  position: relative;

  .createPost-main-container {
    padding: 40px 45px 20px 50px;

    .postInfo-container {
      position: relative;
      @include clearfix;
      margin-bottom: 10px;

      .postInfo-container-item {
        float: left;
      }
    }
  }

  .word-counter {
    width: 40px;
    position: absolute;
    right: 10px;
    top: 0px;
  }
}
</style>
