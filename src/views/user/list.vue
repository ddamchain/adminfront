<template>
  <div class="app-container">
    <el-row style="margin-bottom:20px;">
      <el-col :span="4">
        <el-input placeholder="用户名" clearable v-model="listQuery.userName"></el-input>
      </el-col>
      <el-col :span="4" style="margin-left:30px;">
        <el-input placeholder="姓名" clearable v-model="listQuery.name"></el-input>
      </el-col>
      <el-col :span="4" style="margin-left:30px;">
        <el-input placeholder="电话" clearable v-model="listQuery.phone"></el-input>
      </el-col>
      <el-col :span="4" style="margin-left:30px;">
        <el-button type="primary" @click="getList">搜索</el-button>
      </el-col>
    </el-row>
    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row>
      <el-table-column align="center" label="ID" width="70">
        <template slot-scope="scope">
          <span>{{ scope.row.userId }}</span>
        </template>
      </el-table-column>

      <el-table-column min-width="100px" align="center" label="用户名">
        <template slot-scope="scope">
          <span>{{ scope.row.userName }}</span>
        </template>
      </el-table-column>

      <el-table-column min-width="100px" align="center" label="姓名">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="100px" align="center" label="电话">
        <template slot-scope="scope">
          <span>{{ scope.row.phone }}</span>
        </template>
      </el-table-column>
      <!--<el-table-column min-width="100px" align="center" label="创建时间">-->
      <!--<template slot-scope="scope">-->
      <!--<span>{{ scope.row.createTime | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>-->
      <!--</template>-->
      <!--</el-table-column>-->

      <el-table-column align="center" label="操作" width="200">
        <template slot-scope="scope">
          <router-link :to="'/user/edit/'+scope.row.userId">
            <el-button type="primary" size="small" icon="el-icon-edit">编辑</el-button>
          </router-link>
          <el-button
            type="danger"
            size="small"
            icon="el-icon-delete"
            @click="(id)=>doDelete(scope.row.userId)"
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
import { fetchList, deleteUser } from "@/api/user";
import Pagination from "@/components/Pagination"; // Secondary package based on el-pagination
export default {
  name: "AdminList",
  components: { Pagination },
  filters: {
    statusFilter(status) {
      const statusMap = {
        active: "success",
        inactive: "info"
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
        userName: "",
        name: "",
        phone: ""
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
    doDelete(userId) {
      this.$confirm(`此操作将永久删除该数据, 是否继续?`, "提示", {
        type: "warning"
      })
        .then(() => {
          deleteUser({ userId }).then(response => {
            this.getList();
          });
        })
        .catch(() => {});
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
