<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  ChatLineSquare,
  Collection,
  Document,
  EditPen,
  Files,
  Plus,
  Search,
  Timer
} from '@element-plus/icons-vue';
import { assetTypeLabels, type AssetItem, type AssetType, useAssetsStore } from '../stores/assets';

interface AssetForm {
  type: AssetType;
  title: string;
  tags: string;
  content: string;
}

const searchText = ref('');
const sortBy = ref('usage');
const addDialogVisible = ref(false);
const drawerVisible = ref(false);
const selectedAsset = ref<AssetItem | null>(null);
const isEditingContent = ref(false);
const editingContent = ref('');
const assetsStore = useAssetsStore();

const createDefaultForm = (): AssetForm => ({
  type: 'resume',
  title: '',
  tags: '',
  content: ''
});

const form = ref<AssetForm>(createDefaultForm());

const typeMap: Record<AssetType, { label: string; className: string; icon: typeof Document }> = {
  resume: { label: assetTypeLabels.resume, className: 'asset-resume', icon: Document },
  story: { label: assetTypeLabels.story, className: 'asset-story', icon: Collection },
  portfolio: { label: assetTypeLabels.portfolio, className: 'asset-portfolio', icon: Files },
  question: { label: assetTypeLabels.question, className: 'asset-question', icon: ChatLineSquare },
  ai: { label: assetTypeLabels.ai, className: 'asset-ai', icon: Files }
};

const typeOptions = [
  { label: '简历', value: 'resume' },
  { label: '项目故事', value: 'story' },
  { label: '作品集', value: 'portfolio' },
  { label: '面试题库', value: 'question' },
  { label: 'AI相关', value: 'ai' }
] as const;

const assets = computed(() => assetsStore.assets);

onMounted(() => {
  void assetsStore.loadAssets();
});

const metrics = computed(() => [
  { label: '全部资产', value: assets.value.length, active: true },
  { label: '简历', value: assets.value.filter((asset) => asset.type === 'resume').length },
  { label: '项目故事', value: assets.value.filter((asset) => asset.type === 'story').length },
  { label: '题库', value: assets.value.filter((asset) => asset.type === 'question').length },
  { label: '作品集', value: assets.value.filter((asset) => asset.type === 'portfolio').length },
  { label: '总使用', value: assets.value.reduce((total, asset) => total + asset.usage, 0) }
]);

const filteredAssets = computed(() => {
  const keyword = searchText.value.trim().toLowerCase();
  const list = keyword
    ? assets.value.filter((asset) =>
        [asset.title, typeMap[asset.type].label, ...asset.tags].some((value) => value.toLowerCase().includes(keyword))
      )
    : assets.value;

  return [...list].sort((first, second) => {
    if (sortBy.value === 'date') {
      return new Date(second.updatedAt).getTime() - new Date(first.updatedAt).getTime();
    }
    return second.usage - first.usage;
  });
});

const openAddDialog = () => {
  form.value = createDefaultForm();
  addDialogVisible.value = true;
};

const submitAsset = async () => {
  const title = form.value.title.trim();
  if (!title) {
    return;
  }

  await assetsStore.addAsset({
    title,
    type: form.value.type,
    tags: form.value.tags
      .split(/[,，]/)
      .map((tag) => tag.trim())
      .filter(Boolean),
    content: form.value.content
  });

  addDialogVisible.value = false;
};

const openAssetDrawer = (asset: AssetItem) => {
  selectedAsset.value = asset;
  editingContent.value = asset.content ?? '';
  isEditingContent.value = false;
  drawerVisible.value = true;
};

const startEditContent = () => {
  editingContent.value = selectedAsset.value?.content ?? '';
  isEditingContent.value = true;
};

const saveContent = async () => {
  if (!selectedAsset.value) {
    return;
  }

  const updatedAsset = await assetsStore.updateAsset(selectedAsset.value.id, {
    content: editingContent.value
  });
  selectedAsset.value = updatedAsset;
  editingContent.value = updatedAsset.content ?? '';
  isEditingContent.value = false;
};
</script>

<template>
  <section class="assets-header">
    <div>
      <h1>内容资产</h1>
      <p>简历库、项目故事、题库 — 迭代打磨你的求职武器库</p>
    </div>
    <el-button class="add-job-button" :icon="Plus" @click="openAddDialog">添加资产</el-button>
  </section>

  <section class="assets-metrics">
    <article v-for="metric in metrics" :key="metric.label" class="asset-metric" :class="{ active: metric.active }">
      <strong>{{ metric.value }}</strong>
      <span>{{ metric.label }}</span>
    </article>
  </section>

  <section class="toolbar assets-toolbar">
    <el-input v-model="searchText" :prefix-icon="Search" placeholder="搜索资产名称、标签..." size="large" />
    <el-select v-model="sortBy" size="large" class="sort-select">
      <el-option label="按使用次数" value="usage" />
      <el-option label="按更新时间" value="date" />
    </el-select>
  </section>

  <section class="assets-grid">
    <article v-for="asset in filteredAssets" :key="asset.id" class="asset-card" @click="openAssetDrawer(asset)">
      <div class="asset-card-main">
        <div class="asset-icon" :class="typeMap[asset.type].className">
          <el-icon><component :is="typeMap[asset.type].icon" /></el-icon>
        </div>
        <div class="asset-content">
          <div class="asset-title-row">
            <span class="asset-type" :class="typeMap[asset.type].className">{{ typeMap[asset.type].label }}</span>
          </div>
          <h2>{{ asset.title }}</h2>
          <div class="asset-tags">
            <el-tag v-for="tag in asset.tags" :key="tag" round>{{ tag }}</el-tag>
          </div>
        </div>
      </div>

      <footer class="asset-card-footer">
        <span><el-icon><Timer /></el-icon>使用 {{ asset.usage }} 次</span>
        <span><el-icon><Timer /></el-icon>{{ asset.updatedAt }}</span>
        <el-button text :icon="ArrowRight" @click.stop="openAssetDrawer(asset)" />
      </footer>
    </article>
  </section>

  <el-drawer v-model="drawerVisible" size="38%" direction="rtl" class="asset-detail-drawer" :with-header="false">
    <template v-if="selectedAsset">
      <section class="asset-detail-hero">
        <el-button text :icon="ArrowLeft" class="asset-back-button" @click="drawerVisible = false" />

        <div class="asset-detail-title-row">
          <span class="asset-type" :class="typeMap[selectedAsset.type].className">
            <el-icon><component :is="typeMap[selectedAsset.type].icon" /></el-icon>{{ typeMap[selectedAsset.type].label }}
          </span>
        </div>
        <h1>{{ selectedAsset.title }}</h1>
        <div class="asset-detail-meta">
          <span><el-icon><Timer /></el-icon>使用 {{ selectedAsset.usage }} 次</span>
          <span><el-icon><Timer /></el-icon>最近使用 {{ selectedAsset.updatedAt }}</span>
          <span><el-icon><Calendar /></el-icon>创建于 {{ selectedAsset.createdAt }}</span>
        </div>
        <div class="asset-detail-tags">
          <el-tag v-for="tag in selectedAsset.tags" :key="tag" round>{{ tag }}</el-tag>
        </div>
      </section>

      <el-tabs model-value="content" class="asset-detail-tabs">
        <el-tab-pane label="内容" name="content" />
        <el-tab-pane label="使用记录" name="usage" disabled />
      </el-tabs>

      <section class="asset-detail-body">
        <div class="asset-detail-toolbar">
          <span>上次更新：{{ selectedAsset.updatedAt }}</span>
          <div class="asset-edit-actions">
            <template v-if="isEditingContent">
              <el-button @click="isEditingContent = false">取消</el-button>
              <el-button class="confirm-button" @click="saveContent">保存内容</el-button>
            </template>
            <el-button v-else :icon="EditPen" @click="startEditContent">编辑内容</el-button>
          </div>
        </div>

        <el-input
          v-if="isEditingContent"
          v-model="editingContent"
          type="textarea"
          :rows="20"
          class="asset-content-editor"
        />
        <pre v-else class="asset-content-preview">{{ selectedAsset.content || '暂无内容' }}</pre>
      </section>
    </template>
  </el-drawer>

  <el-dialog v-model="addDialogVisible" title="添加资产" width="780px" class="delivery-dialog asset-dialog" align-center>
    <el-form label-position="top" class="job-form">
      <div class="form-grid">
        <el-form-item label="资产类型">
          <el-select v-model="form.type" size="large">
            <el-option v-for="option in typeOptions" :key="option.value" :label="option.label" :value="option.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="标题">
          <el-input v-model="form.title" placeholder="如：技术岗通用简历 v3.0" size="large" />
        </el-form-item>
      </div>

      <el-form-item label="标签（用逗号分隔）">
        <el-input v-model="form.tags" placeholder="如：前端, React, 架构" size="large" />
      </el-form-item>

      <el-form-item label="内容">
        <el-input v-model="form.content" type="textarea" :rows="12" placeholder="输入资产内容..." />
      </el-form-item>
    </el-form>

    <template #footer>
      <el-button size="large" @click="addDialogVisible = false">取消</el-button>
      <el-button size="large" class="confirm-button" :disabled="!form.title.trim()" @click="submitAsset">
        添加资产
      </el-button>
    </template>
  </el-dialog>
</template>
