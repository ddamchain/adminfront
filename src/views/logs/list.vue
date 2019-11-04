<template>
  <div class="app-container">
    <el-row style="margin-bottom:20px;">
      <el-col :span="4">
        <el-date-picker
          v-model="listQuery.startTime"
          value-format="timestamp"
          type="date"
          placeholder="开始时间"
        ></el-date-picker>
      </el-col>
      <el-col :span="4" style="margin-left:30px;">
        <el-date-picker
          v-model="listQuery.endTime"
          value-format="timestamp"
          type="date"
          placeholder="结束时间"
        ></el-date-picker>
      </el-col>

      <el-col :span="4" style="margin-left:30px;">
        <el-button type="primary" @click="getList">搜索</el-button>
      </el-col>
    </el-row>
    <el-table
      v-loading="listLoading"
      :data="list"
      @sort-change="sortChange"
      border
      fit
      highlight-current-row
    >
      <el-table-column align="center" label="编号" width="90">
        <template slot-scope="scope">
          <span>{{ scope.row.logId }}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="100px" align="center" label="操作时间">
        <template slot-scope="scope">
          <span>{{ scope.row.createTime | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>

      <el-table-column min-width="100px" align="center" label="操作类型">
        <template slot-scope="scope">
          <span>{{ scope.row.operateType }}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="100px" align="center" label="操作模块">
        <template slot-scope="scope">
          <span>{{ scope.row.module }}</span>
        </template>
      </el-table-column>

      <el-table-column min-width="100px" align="center" label="IP">
        <template slot-scope="scope">
          <span>{{ scope.row.ipAddress }}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="200px" align="center" label="日志内容">
        <template slot-scope="scope">
          <span>{{ scope.row.detail }}</span>
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
import { getLogList } from "@/api/user";
import Pagination from "@/components/Pagination"; // Secondary package based on el-pagination
export default {
  name: "TradeList",
  components: { Pagination },
  filters: {
    statusFilter(status) {
      const statusMap = {
        1: "success",
        0: "failure",
        null: "failure"
      };
      return statusMap[status];
    },
    formatStatus(status) {
      const statusMap = {
        0: "未处理",
        1: "已处理",
        null: "未处理"
      };
      return statusMap[status];
    },
    formatType(type) {
      const statusMap = {
        1: "绑定",
        2: "转绑"
      };
      return statusMap[type];
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
        startTime: "",
        endTime: "",
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
      getLogList(this.listQuery).then(response => {
        this.list = response.data.content;
        this.total = response.data.totalSize;
        this.listLoading = false;
      });
    },
    doPass(transactionId) {
      this.$confirm(`是否确认通过此申请?`, "提示", {
        type: "warning"
      })
        .then(() => {
          requestPass({ id: transactionId }).then(response => {
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
