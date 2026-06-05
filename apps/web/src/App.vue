<script setup lang="ts">
import { Briefcase } from '@element-plus/icons-vue';
</script>

<template>
  <el-config-provider>
    <el-container class="app-shell">
      <el-header class="app-header">
        <RouterLink class="brand" to="/">
          <span class="brand-mark">
            <el-icon><Briefcase /></el-icon>
          </span>
          <span>JobForge</span>
        </RouterLink>
        <el-menu mode="horizontal" router :ellipsis="false" class="nav">
          <el-menu-item index="/">岗位池</el-menu-item>
          <el-menu-item index="/delivery">投递管理</el-menu-item>
          <el-menu-item index="/interviews">面试管理</el-menu-item>
          <el-menu-item index="/assets">内容资产</el-menu-item>
          <el-menu-item index="/analytics">数据分析</el-menu-item>
        </el-menu>
      </el-header>

      <el-main class="app-main">
        <RouterView />
      </el-main>
    </el-container>
  </el-config-provider>
</template>
