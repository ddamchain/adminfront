<template>
  <div class="createPost-container">
    <el-form ref="postForm" :model="postForm" :rules="postFormRules" class="form-container">
      <div class="createPost-main-container">
        <el-form-item
          v-if="isEdit"
          style="margin-bottom: 40px;"
          prop="deviceId"
          label="设备ID"
          class="postInfo-container-item"
        >
          <el-input ref="deviceId" v-model="postForm.deviceId" readonly="true" disabled />
        </el-form-item>
        <el-form-item
          style="margin-bottom: 40px;"
          prop="deviceFingerprint"
          label="设备指纹"
          class="postInfo-container-item"
        >
          <el-input
            ref="deviceFingerprint"
            v-model="postForm.deviceFingerprint"
            name="deviceFingerprint"
            type="text"
            :disabled="isEdit"
            :readonly="isEdit"
          />
        </el-form-item>
        <el-form-item
          style="margin-bottom: 40px;"
          prop="deviceInfo"
          label="设备配置"
          class="postInfo-container-item"
        >
          <el-input ref="deviceInfo" v-model="postForm.deviceInfo" name="deviceInfo" type="text" />
        </el-form-item>
        <el-form-item style="margin-bottom: 40px;" label="备注" class="postInfo-container-item">
          <el-input
            ref="remark"
            v-model="postForm.remark"
            name="remark"
            type="textarea"
            :autosize="{ minRows: 4, maxRows: 8 }"
          />
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
import { getDevice, createDevice, updateDevice } from "@/api/device";

const defaultForm = {
  deviceId: undefined,
  status: "0",
  deviceFingerprint: "",
  deviceInfo: "",
  createTime: undefined
};

export default {
  name: "DeviceDetail",
  props: {
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      postForm: Object.assign({}, defaultForm),
      postFormRules: {
        deviceFingerprint: [
          { required: true, message: "请输入设备指纹", trigger: "blur" },
          { min: 1, max: 200, message: "长度在 200 个字以内", trigger: "blur" },
          {
            type: "string",
            pattern: /^[0-9A-Za-z]+$/,
            message: "设备指纹格式异常，请检查后重新输入",
            trigger: "blur"
          }
        ],
        deviceInfo: [
          { required: true, message: "请输入设备信息", trigger: "blur" },
          { min: 1, max: 500, message: "长度在 500 个字以内", trigger: "blur" }
        ]
      },
      loading: false,
      userListOptions: [],
      tempRoute: {}
    };
  },
  computed: {
    createTime: {
      get() {
        return +new Date(this.postForm.createTime);
      },
      set(val) {
        this.postForm.createTime = new Date(val);
      }
    }
  },
  created() {
    if (this.isEdit) {
      const deviceId = this.$route.params && this.$route.params.id;
      console.info("xid:" + deviceId);
      this.fetchData(deviceId);
    } else {
      this.postForm = Object.assign({}, defaultForm);
    }

    this.tempRoute = Object.assign({}, this.$route);
  },
  methods: {
    fetchData(deviceId) {
      getDevice(deviceId)
        .then(response => {
          this.postForm = response.data;

          this.postForm.title += `   Device Id:${this.postForm.deviceId}`;
          this.postForm.content_short += `   Device Id:${this.postForm.deviceId}`;

          this.setPageTitle();
        })
        .catch(err => {
          console.log(err);
        });
    },
    setPageTitle() {
      if (this.isEdit) {
        const title = "Edit Device";
        document.title = `${title} - ${this.postForm.deviceId}`;
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
            updateDevice(this.postForm).then(response => {
              this.list = response.data.content;
              this.total = response.data.totalSize;
              this.$notify({
                title: "成功",
                message: "更新设备成功",
                type: "success",
                duration: 2000
              });
              this.$router.push("/device/list");
            });
          } else {
            createDevice(this.postForm).then(response => {
              this.list = response.data.content;
              this.total = response.data.totalSize;
              this.$notify({
                title: "成功",
                message: "新建设备成功",
                type: "success",
                duration: 2000
              });
              this.$router.push("/device/list");
            });
          }

          this.loading = true;

          this.postForm.status = "active";
          this.loading = false;
        } else {
          console.log("提交错误!!");
          return false;
        }
      });
    },
    onCancel() {
      // console.log("取消");
      // this.$message({
      //   message: "取消!",
      //   type: "warning"
      // });
      this.$router.push("/device/list");
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
