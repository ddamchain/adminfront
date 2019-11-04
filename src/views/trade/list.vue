<template>
  <div class="app-container">
    <el-row style="margin-bottom:20px;">
      <el-col :span="4">
        <el-input placeholder="矿工地址" clearable v-model="listQuery.blockAddress"></el-input>
      </el-col>
      <el-col :span="4" style="margin-left:30px;">
        <el-input placeholder="设备指纹" clearable v-model="listQuery.deviceFingerprint"></el-input>
      </el-col>
      <el-col :span="4" style="margin-left:30px;">
        <el-select placeholder="处理状态" clearable v-model="listQuery.handleStatus">
          <el-option value="1" label="已处理">已处理</el-option>
          <el-option value="0" label="未处理">未处理</el-option>
        </el-select>
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
      <el-table-column align="center" sortable="custom" prop="id" label="编号" width="90">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column
        min-width="100px"
        align="center"
        sortable="custom"
        prop="create_time"
        label="申请时间"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.createTime | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
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
        prop="sender_block_address"
        label="出售者地址"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.senderBlockAddress }}</span>
        </template>
      </el-table-column>
      <el-table-column
        min-width="100px"
        align="center"
        sortable="custom"
        prop="block_address"
        label="购买者地址"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.blockAddress }}</span>
        </template>
      </el-table-column>
      <el-table-column
        min-width="100px"
        align="center"
        sortable="custom"
        prop="request_type"
        label="申请类型"
      >
        <template slot-scope="{row}">
          <el-tag :type="row.requestType | statusFilter">{{ row.requestType | formatType }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column
        class-name="status-col"
        align="center"
        sortable="custom"
        prop="handle_status"
        label="处理状态"
        min-width="80"
      >
        <template slot-scope="{row}">
          <el-tag :type="row.handleStatus | statusFilter">{{ row.handleStatus | formatStatus }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="120">
        <template slot-scope="scope">
          <el-button
            type="primary"
            size="small"
            icon="el-icon-check"
            @click="doPass(scope.row)"
            v-if="scope.row.handleStatus==0"
          >通过</el-button>
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
import { fetchList, requestPass, requestPass2 } from "@/api/trade";
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
        handleStatus: "",
        deviceFingerprint: "",
        blockAddress: "",
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
    doPass(row) {
      this.$confirm(`是否确认通过此申请?`, "提示", {
        type: "warning"
      })
        .then(() => {
          if (row.requestType == 1) {
            requestPass({ id: row.id }).then(response => {
              this.getList();
            });
          } else {
            requestPass2({ id: row.id }).then(response => {
              this.getList();
            });
          }
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
