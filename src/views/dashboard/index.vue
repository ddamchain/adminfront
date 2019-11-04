<template>
  <div class="dashboard-container">
    <div class="card-container">
      <el-card class="box-card" style="color:#f78989">
        <div class="text item">{{'设备数量(个) ' }}</div>
        <div class="text num">{{deviceNum }}</div>
      </el-card>
      <el-card class="box-card" style="color:#b0f566">
        <div class="text item">{{'矿工数量(个) ' }}</div>
        <div class="text num">{{activedDevice }}</div>
      </el-card>
      <el-card class="box-card" style="color:#6638f0">
        <div class="text item">{{'申请数量(个) ' }}</div>
        <div class="text num">{{bindedRequest }}</div>
      </el-card>
    </div>
    <el-row
      style="text-align:center;margin-top:200px;color:red"
    >当前管理员的上次登录时间： {{lastLoginTime}}， 登录地点： {{lastLoginAddress}}</el-row>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { report } from "@/api/user.js";

export default {
  name: "Dashboard",
  computed: {
    ...mapGetters(["name"])
  },
  data() {
    return {
      bindedRequest: "0",
      activedDevice: "0",
      deviceNum: "0",
      lastLoginTime: "",
      lastLoginAddress: ""
    };
  },
  methods: {
    loadData() {
      report().then(res => {
        this.deviceNum = res.data.deviceNum;
        this.activedDevice = res.data.activedDevice;
        this.bindedRequest = res.data.bindedRequest;
        this.lastLoginTime = res.data.lastLoginTime;
        this.lastLoginAddress = res.data.lastLoginAddress;
      });
    }
  },
  created() {
    this.loadData();
  }
};
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 50px;
    .card-container {
      margin-top: 30px;
      display: flex;
      justify-content: space-around;
      .box-card {
        height: 150px;
        width: 250px;
        border-radius: 12px;
        .text {
          text-align: center;
        }

        .num {
          margin-top: 20px;
          font-size: 48px;
          font-weight: bold;
        }
      }
    }
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
