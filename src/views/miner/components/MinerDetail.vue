<template>
  <div class="createPost-container">
    <el-form ref="postForm" :model="postForm" :rules="postFormRules" class="form-container">
      <div class="createPost-main-container">
        <el-form-item v-if="isEdit" style="margin-bottom: 40px;" prop="minerId" label="矿工Id" class="postInfo-container-item">
          <el-input ref="minerId" v-model="postForm.minerId" readOnly="true" />
        </el-form-item>
        <el-form-item style="margin-bottom: 40px;" prop="deviceFingerprint" label="设备指纹" class="postInfo-container-item">
          <el-input ref="deviceFingerprint" v-model="postForm.deviceFingerprint" name="deviceFingerprint" type="text" />
        </el-form-item>
        <el-form-item style="margin-bottom: 40px;" prop="deviceInfo" label="设备信息" class="postInfo-container-item">
          <el-input ref="deviceInfo" v-model="postForm.deviceInfo" name="deviceInfo" type="text" />
        </el-form-item>
        <el-form-item style="margin-bottom: 40px;" prop="publicKey" label="矿工公钥" class="postInfo-container-item">
          <el-input ref="publicKey" v-model="postForm.publicKey" name="publicKey" type="text" />
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
import { getMiner, createMiner, updateMiner } from '@/api/miner'

const defaultForm = {
  minerId: undefined,
  status: '0',
  deviceFingerprint: '',
  deviceInfo: '',
  publicKey: '',
  createTime: undefined
}

export default {
  name: 'MinerDetail',
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
          { required: true, message: '请输入设备指纹', trigger: 'blur' },
          { min: 1, max: 200, message: '长度在 200 个字以内', trigger: 'blur' }
        ],
        deviceInfo: [
          { required: true, message: '请输入设备信息', trigger: 'blur' },
          { min: 1, max: 500, message: '长度在 500 个字以内', trigger: 'blur' }
        ],
        publicKey: [
          { required: true, message: '请输入矿工公钥', trigger: 'blur' },
          { min: 1, max: 500, message: '长度在 500 个字以内', trigger: 'blur' }
        ]
      },
      loading: false,
      userListOptions: [],
      tempRoute: {}
    }
  },
  computed: {
    createTime: {
      get() {
        return (+new Date(this.postForm.createTime))
      },
      set(val) {
        this.postForm.createTime = new Date(val)
      }
    }
  },
  created() {
    if (this.isEdit) {
      const deviceId = this.$route.params && this.$route.params.id
      console.info('xid:' + deviceId)
      this.fetchData(deviceId)
    } else {
      this.postForm = Object.assign({}, defaultForm)
    }

    this.tempRoute = Object.assign({}, this.$route)
  },
  methods: {
    fetchData(minerId) {
      getMiner(minerId).then(response => {
        this.postForm = response.data

        this.postForm.title += `   Miner Id:${this.postForm.minerId}`
        this.postForm.content_short += `   Miner Id:${this.postForm.minerId}`

        this.setPageTitle()
      }).catch(err => {
        console.log(err)
      })
    },
    setPageTitle() {
      if (this.isEdit) {
        const title = 'Edit Miner'
        document.title = `${title} - ${this.postForm.minerId}`
      } else {
        const title = 'Add Miner'
        document.title = `${title} `
      }
    },
    submitForm() {
      console.log(this.postForm)
      this.$refs.postForm.validate(valid => {
        if (valid) {
          if (this.isEdit) {
            updateMiner(this.postForm).then(response => {
              this.list = response.data.content
              this.total = response.data.totalSize
              this.$notify({
                title: '成功',
                message: '更新矿工成功',
                type: 'success',
                duration: 2000
              })
            })
          } else {
            createMiner(this.postForm).then(response => {
              this.list = response.data.content
              this.total = response.data.totalSize
              this.$notify({
                title: '成功',
                message: '新建矿工成功',
                type: 'success',
                duration: 2000
              })
            })
          }

          this.loading = true

          this.postForm.status = 'active'
          this.loading = false
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    onCancel() {
      this.$message({
        message: 'cancel!',
        type: 'warning'
      })
    }
  }
}
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
