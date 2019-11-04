<template>
  <div class="app-container">
    <el-row style="margin-bottom:20px;">
      <el-col :span="4">
        <el-input placeholder="矿工地址" clearable v-model="listQuery.publicKey"></el-input>
      </el-col>
      <el-col :span="4" style="margin-left:30px;">
        <el-input placeholder="设备指纹" clearable v-model="listQuery.deviceFingerprint"></el-input>
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
      <el-table-column align="center" label="操作" width="120" fixed="right">
        <template slot-scope="scope">
          <el-button
            v-if="scope.row.isOnChain==1 && scope.row.deviceStatus==1"
            type="primary"
            size="small"
            icon="el-icon-edit"
            @click="doReset(scope.row)"
          >解绑</el-button>
          <el-button
            v-if="scope.row.isOnChain==99 "
            type="primary"
            size="small"
            icon="el-icon-edit"
            @click="doApply(scope.row)"
          >重新申请</el-button>
        </template>
        <!-- <template slot-scope="scope">
          <router-link :to="'/miner/edit/'+scope.row.minerId">
            <el-button type="primary" size="small" icon="el-icon-edit">编辑</el-button>
          </router-link>
        </template>-->
      </el-table-column>
      <el-table-column align="center" label="矿工ID" sortable="custom" prop="a.id" width="90">
        <template slot-scope="scope">
          <span>{{ scope.row.minerId }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="设备ID" sortable="custom" prop="a.device_id" width="90">
        <template slot-scope="scope">
          <span>{{ scope.row.deviceId }}</span>
        </template>
      </el-table-column>

      <el-table-column
        min-width="200px"
        align="center"
        sortable="custom"
        prop="b.device_fingerprint"
        label="设备指纹"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.deviceFingerprint }}</span>
        </template>
      </el-table-column>

      <el-table-column
        min-width="150px"
        align="center"
        sortable="custom"
        prop="b.device_info"
        label="设备配置"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.deviceInfo }}</span>
        </template>
      </el-table-column>
      <el-table-column
        min-width="200px"
        align="center"
        sortable="custom"
        prop="a.public_key"
        label="矿工地址"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.publicKey }}</span>
        </template>
      </el-table-column>

      <el-table-column
        class-name="status-col"
        align="center"
        sortable="custom"
        prop="a.status"
        label="设备状态"
        min-width="120px"
      >
        <template slot-scope="{row}">
          <el-tag :type="row.deviceStatus | statusFilter">{{ row.deviceStatus | formatStatus }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column
        class-name="status-col"
        align="center"
        sortable="custom"
        prop="a.is_on_chain"
        label="上链状态"
        min-width="120px"
      >
        <template slot-scope="{row}">
          <el-tag
            :type="row.isOnChain | statusOnCHainFilter"
          >{{ row.isOnChain | formatOnCHainStatus }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column min-width="200px" align="center" sortable="custom" prop="a.id" label="申请哈希">
        <template slot-scope="scope">
          <span>{{ scope.row.hash }}</span>
        </template>
      </el-table-column>
      <el-table-column width="100px" align="center" sortable="custom" prop="a.id" label="绑定状态">
        <template slot-scope="{row}">
          <el-tag
            :type="row.unbindStatus | statusBindFilter"
          >{{ row.unbindStatus | formatBindStatus }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column min-width="200px" align="center" sortable="custom" prop="a.id" label="绑定哈希">
        <template slot-scope="scope">
          <span>{{ scope.row.unbindHash }}</span>
        </template>
      </el-table-column>
      <el-table-column width="150px" align="center" sortable="custom" prop="a.id" label="在线时长(小时)">
        <template slot-scope="scope">
          <span>{{ scope.row.duration }}</span>
        </template>
      </el-table-column>

      <el-table-column
        min-width="120px"
        align="center"
        sortable="custom"
        prop="a.gmt_activate"
        label="激活时间"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.activateTime | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column
        min-width="120px"
        align="center"
        sortable="custom"
        prop="a.gmt_last_activate"
        label="最后活跃时间"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.lastActivateTime | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
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
import { fetchList, resetMiner, applyMiner } from "@/api/miner";
import Pagination from "@/components/Pagination"; // Secondary package based on el-pagination
export default {
  name: "MinerList",
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
    },
    getHash(publicKey) {
      const statusMap = {
        0: "未绑定",
        1: "已绑定",
        2: "已作废",
        null: "未绑定"
      };
      return "";
    },
    statusOnCHainFilter(status) {
      const statusMap = {
        1: "success",
        0: "failure",
        99: "danger",
        null: "failure"
      };
      return statusMap[status];
    },
    formatOnCHainStatus(status) {
      const statusMap = {
        0: "未上链",
        1: "已上链",
        99: "上链失败",
        null: "未上链"
      };
      return statusMap[status];
    },
    statusBindFilter(status) {
      const statusMap = {
        1: "success",
        0: "failure",
        99: "danger",
        null: "failure"
      };
      return statusMap[status];
    },
    formatBindStatus(status) {
      const statusMap = {
        0: "未解绑",
        1: "解绑成功",
        2: "解绑中",
        99: "解绑失败",
        null: "解绑中"
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
        publicKey: "",
        deviceFingerprint: "",
        field: "a.id",
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
    doReset(row) {
      this.$confirm(`此操作将解绑该矿工, 是否继续?`, "提示", {
        type: "warning"
      })
        .then(() => {
          resetMiner,
            resetMiner({ minerId: row.minerId }).then(response => {
              this.getList();
            });
        })
        .catch(() => {});
    },
    doApply(row) {
      this.$confirm(`是否重新申请上链?`, "提示", {
        type: "warning"
      })
        .then(() => {
          applyMiner({ minerId: row.minerId }).then(response => {
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
