<template>
  <div class="ivu-table-header inlay-table-header">
    <table
      cellspacing="0"
      cellpadding="0"
      border="0"
    >
      <thead>
        <tr>
          <th v-for="(o, index) in tableColumns" :key="index" :style="{width: o.width + 'px', textAlign: o.align}">
            <div class="ivu-table-cell"><span class="">{{o.title}}</span>
            </div>
          </th>
        </tr>
      </thead>
    </table>
  </div>
</template>

<script>
import { closeNowTag } from "@/libs/util";
export default {
  name: "InlayTableHeader",
  props: {
      columns: Array
  },
  watch: {
    columns: {
      handler(newVal, oldVal) {
        this.tableColumns = newVal;
      }
    }
  },
  data() {
    return {
        tableColumns: JSON.parse(JSON.stringify(this.columns))
    };
  },
  mounted() {
    this.tableColumns = this.columns;
  }
};
</script>

<style lang="less" scoped>
.inlay-table-header table { table-layout: fixed;}
.inlay-table-header table tr th { box-sizing: border-box; border-bottom: 0;}
.inlay-table-header table tr th:last-child { border-width: 0;}
</style>
