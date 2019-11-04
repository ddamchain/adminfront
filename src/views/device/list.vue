<template>
  <div class="app-container">
    <el-row style="margin-bottom:20px;">
      <el-col :span="4">
        <el-input placeholder="设备指纹" clearable v-model="listQuery.deviceFingerprint"></el-input>
      </el-col>
      <el-col :span="4" style="margin-left:30px;">
        <el-input placeholder="设备配置" clearable v-model="listQuery.deviceInfo"></el-input>
      </el-col>
      <el-col :span="4" style="margin-left:30px;">
        <el-button type="primary" @click="getList">搜索</el-button>
      </el-col>
    </el-row>

    <el-table
      v-loading="listLoading"
      @sort-change="sortChange"
      :data="list"
      border
      fit
      highlight-current-row
    >
      <el-table-column align="center" sortable="custom" prop="id" label="ID" width="70">
        <template slot-scope="scope">
          <span>{{ scope.row.deviceId }}</span>
        </template>
      </el-table-column>

      <el-table-column
        min-width="100px"
        align="center"
        sortable="custom"
        prop="device_fingerprint"
        label="设备指纹"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.deviceFingerprint }}</span>
        </template>
      </el-table-column>

      <el-table-column
        min-width="100px"
        align="center"
        sortable="custom"
        prop="device_info"
        label="设备配置"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.deviceInfo }}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="100px" align="center" sortable="custom" prop="id" label="设备公钥">
        <template slot-scope="scope">
          <span>{{ scope.row.publicKey }}</span>
        </template>
      </el-table-column>

      <el-table-column
        class-name="status-col"
        align="center"
        sortable="custom"
        prop="status"
        label="状态"
        min-width="60"
      >
        <template slot-scope="{row}">
          <el-tag :type="row.deviceStatus | statusFilter">{{ row.deviceStatus | formatStatus }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column width="100px" align="center" sortable="custom" prop="id" label="时长">
        <template slot-scope="scope">
          <span>{{ scope.row.duration }}</span>
        </template>
      </el-table-column>

      <el-table-column
        min-width="100px"
        align="center"
        sortable="custom"
        prop="gmt_activate"
        label="激活时间"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.activateTime | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column
        min-width="100px"
        align="center"
        sortable="custom"
        prop="gmt_create"
        label="创建时间"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.createTime | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column min-width="100px" align="center"  sortable=custom label="备注">
        <template slot-scope="scope">
          <span>{{ scope.row.remark}}</span>
        </template>
      </el-table-column>-->
      <el-table-column align="center" label="操作" width="200">
        <template slot-scope="scope">
          <router-link :to="'/device/edit/'+scope.row.deviceId" v-if="scope.row.deviceStatus!=2">
            <el-button type="primary" size="small" icon="el-icon-edit">编辑</el-button>
          </router-link>
          <el-button
            type="danger"
            size="small"
            icon="el-icon-delete"
            @click="(id)=>doDelete(scope.row.deviceId)"
            v-if="scope.row.deviceStatus!=2"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.pageNum"
      :limit.sync="listQuery.pageSize"
      @pagination="getList"
    />
  </div>
</template>

<script>
import { fetchList, deleteDevice } from "@/api/device";
import Pagination from "@/components/Pagination"; // Secondary package based on el-pagination
export default {
  name: "DeviceList",
  components: { Pagination },
  filters: {
    statusFilter(status) {
      const statusMap = {
        1: "success",
        0: "failure",
        2: "danger",
        null: "failure"
      };
      return statusMap[status];
    },
    formatStatus(status) {
      const statusMap = {
        0: "未绑定",
        1: "已绑定",
        2: "已作废",
        null: "未绑定"
      };
      return statusMap[status];
    }
  },
  data() {
    return {
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        pageNum: 1,
        pageSize: 10,
        deviceFingerprint: "",
        deviceInfo: "",
        field: "id",
        duration: "desc"
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    getList() {
      this.listLoading = true;
      fetchList(this.listQuery).then(response => {
        this.list = response.data.content;
        this.total = response.data.totalSize;
        this.listLoading = false;
      });
    },
    doDelete(deviceId) {
      this.$confirm(`此操作将作废该数据, 是否继续?`, "提示", {
        type: "warning"
      })
        .then(() => {
          deleteDevice({ deviceId }).then(response => {
            this.getList();
          });
        })
        .catch(() => {});
    },
    sortChange({ column, prop, order }) {
      this.listQuery.field = prop;
      this.listQuery.duration = order.replace("ending", "");
      this.getList();
    }
  }
};
</script>

<style scoped>
.edit-input {
  padding-right: 100px;
}

.cancel-btn {
  position: absolute;
  right: 15px;
  top: 10px;
}
</style>
