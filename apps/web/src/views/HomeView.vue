<script setup lang="ts">
import { computed, reactive, ref } from 'vue';
import { Check, Close, DataAnalysis, Document, EditPen, Memo, Plus, Search, Warning } from '@element-plus/icons-vue';
import { useJobsStore } from '../stores/jobs';
import type { Job, JobStatus, NewJobInput } from '../stores/jobs';

const jobsStore = useJobsStore();

const statusOptions: Record<JobStatus, { label: string; className: string }> = {
  saved: { label: '已收藏', className: 'status-saved' },
  applied: { label: '已投递', className: 'status-applied' },
  interviewing: { label: '面试中', className: 'status-interviewing' },
  offer: { label: '已拿Offer', className: 'status-offer' },
  rejected: { label: '未通过', className: 'status-rejected' },
  archived: { label: '已归档', className: 'status-archived' }
};

const metrics = computed(() => [
  { label: '全部', value: jobsStore.total, active: true },
  { label: '已收藏', value: jobsStore.savedCount },
  { label: '已投递', value: jobsStore.appliedCount },
  { label: '面试中', value: jobsStore.interviewingCount },
  { label: '已拿Offer', value: jobsStore.offerCount },
  { label: '未通过', value: jobsStore.rejectedCount }
]);

const searchText = ref('');
const sortBy = ref('match');
const dialogVisible = ref(false);
const drawerVisible = ref(false);
const requirementInput = ref('');
const pinnedJobId = ref<number | null>(null);
const selectedJobId = ref<number | null>(null);
const detailTab = ref('jd');

const initialForm = (): NewJobInput => ({
  title: '',
  company: '',
  location: '',
  salary: '',
  source: '',
  status: 'saved',
  match: 70,
  requirements: [],
  description: '',
  note: ''
});

const form = reactive<NewJobInput>(initialForm());

const filteredJobs = computed(() => {
  const keyword = searchText.value.trim().toLowerCase();
  const list = keyword
    ? jobsStore.jobs.filter((job) =>
        [job.title, job.company, job.location].some((value) => value.toLowerCase().includes(keyword))
      )
    : jobsStore.jobs;

  if (sortBy.value === 'match') {
    return [...list].sort((first, second) => {
      if (first.id === pinnedJobId.value) return -1;
      if (second.id === pinnedJobId.value) return 1;
      return second.match - first.match;
    });
  }

  return list;
});

const selectedJob = computed(() => jobsStore.jobs.find((job) => job.id === selectedJobId.value) ?? null);

const drawerStatusItems = computed(() =>
  Object.entries(statusOptions).map(([value, option]) => ({
    value: value as JobStatus,
    label: option.label
  }))
);

const matchBreakdown = computed(() => {
  if (!selectedJob.value) return [];
  return [
    {
      title: '技能匹配',
      description: '你的技能与岗位要求的重合度',
      value: Math.max(0, selectedJob.value.match - 28)
    },
    {
      title: '经验匹配',
      description: '工作年限和项目经验的匹配程度',
      value: selectedJob.value.match
    },
    {
      title: '岗位评分',
      description: '基于JD分析的人工评估分数',
      value: Math.min(100, selectedJob.value.match + 8)
    }
  ];
});

const resetForm = () => {
  Object.assign(form, initialForm());
  requirementInput.value = '';
};

const addRequirement = () => {
  const value = requirementInput.value.trim();
  if (!value) return;
  form.requirements.push(value);
  requirementInput.value = '';
};

const removeRequirement = (index: number) => {
  form.requirements.splice(index, 1);
};

const submitJob = () => {
  if (!form.title || !form.company) return;
  pinnedJobId.value = jobsStore.addJob({
    ...form,
    requirements: form.requirements.length ? [...form.requirements] : ['待补充岗位要求']
  });
  dialogVisible.value = false;
  resetForm();
};

const openDialog = () => {
  resetForm();
  dialogVisible.value = true;
};

const openJobDrawer = (job: Job) => {
  selectedJobId.value = job.id;
  detailTab.value = 'jd';
  drawerVisible.value = true;
};

const updateSelectedStatus = (status: JobStatus) => {
  if (!selectedJob.value) return;
  jobsStore.updateJobStatus(selectedJob.value.id, status);
};
</script>

<template>
  <section class="pool-header">
    <div class="pool-title">
      <h1>岗位池</h1>
      <p>收藏、分析、匹配、投递 — 你的目标岗位作战地图</p>
    </div>
    <el-button class="add-job-button" :icon="Plus" @click="openDialog">添加岗位</el-button>
  </section>

  <section class="metric-grid">
    <button
      v-for="metric in metrics"
      :key="metric.label"
      class="metric-card"
      :class="{ active: metric.active }"
      type="button"
    >
      <strong>{{ metric.value }}</strong>
      <span>{{ metric.label }}</span>
    </button>
  </section>

  <section class="toolbar">
    <el-input v-model="searchText" :prefix-icon="Search" placeholder="搜索岗位、公司、地点..." size="large" />
    <el-select v-model="sortBy" size="large" class="sort-select">
      <el-option label="按匹配度" value="match" />
      <el-option label="按添加时间" value="date" />
    </el-select>
  </section>

  <section class="job-grid">
    <article v-for="job in filteredJobs" :key="job.id" class="job-card" @click="openJobDrawer(job)">
      <div class="job-card-top">
        <div class="company-lockup">
          <span class="company-avatar">{{ job.company.slice(0, 1) }}</span>
          <div>
            <h2>{{ job.company }}</h2>
            <p>{{ job.location }}</p>
          </div>
        </div>
        <span class="status-pill" :class="statusOptions[job.status].className">
          {{ statusOptions[job.status].label }}
        </span>
      </div>

      <h3>{{ job.title }}</h3>
      <p class="salary">{{ job.salary }} <span>· {{ job.source }}</span></p>

      <div class="match-row">
        <span>匹配度</span>
        <strong>{{ job.match }}%</strong>
      </div>
      <el-progress
        :percentage="job.match"
        :stroke-width="6"
        :show-text="false"
        :color="job.match >= 80 ? '#b6f223' : '#f2a15b'"
      />

      <div class="tag-row">
        <el-tag v-for="requirement in job.requirements" :key="requirement" type="info" effect="plain" round>
          {{ requirement }}
        </el-tag>
      </div>

      <p class="job-description">{{ job.description || job.note || '暂无备注' }}</p>
      <p class="applied-at">投递于 {{ job.appliedAt }}</p>
    </article>
  </section>

  <el-dialog v-model="dialogVisible" title="添加岗位" width="640px" class="job-dialog" align-center>
    <el-form label-position="top" class="job-form">
      <div class="form-grid">
        <el-form-item label="岗位名称 *">
          <el-input v-model="form.title" placeholder="如：高级前端工程师" size="large" />
        </el-form-item>
        <el-form-item label="公司 *">
          <el-input v-model="form.company" placeholder="如：字节跳动" size="large" />
        </el-form-item>
        <el-form-item label="地点">
          <el-input v-model="form.location" placeholder="如：北京·海淀" size="large" />
        </el-form-item>
        <el-form-item label="薪资范围">
          <el-input v-model="form.salary" placeholder="如：30-50K·15薪" size="large" />
        </el-form-item>
        <el-form-item label="来源">
          <el-input v-model="form.source" placeholder="如：BOSS直聘" size="large" />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="form.status" size="large">
            <el-option
              v-for="(option, value) in statusOptions"
              :key="value"
              :label="option.label"
              :value="value"
            />
          </el-select>
        </el-form-item>
      </div>

      <el-form-item :label="`匹配度 (${form.match}%)`">
        <el-slider v-model="form.match" :min="0" :max="100" />
      </el-form-item>

      <el-form-item label="岗位要求">
        <div class="requirement-input">
          <el-input
            v-model="requirementInput"
            placeholder="输入要求后按回车添加"
            size="large"
            @keyup.enter="addRequirement"
          />
          <el-button size="large" @click="addRequirement">添加</el-button>
        </div>
        <div v-if="form.requirements.length" class="dialog-tags">
          <el-tag
            v-for="(requirement, index) in form.requirements"
            :key="requirement"
            closable
            @close="removeRequirement(index)"
          >
            {{ requirement }}
          </el-tag>
        </div>
      </el-form-item>

      <el-form-item label="岗位描述（JD）">
        <el-input v-model="form.description" type="textarea" :rows="5" placeholder="粘贴完整的岗位描述..." />
      </el-form-item>

      <el-form-item label="备注">
        <el-input v-model="form.note" type="textarea" :rows="3" placeholder="记录你的想法、面试进度等..." />
      </el-form-item>
    </el-form>

    <template #footer>
      <el-button size="large" @click="dialogVisible = false">取消</el-button>
      <el-button size="large" class="confirm-button" :disabled="!form.title || !form.company" @click="submitJob">
        添加岗位
      </el-button>
    </template>
  </el-dialog>

  <el-drawer v-model="drawerVisible" :with-header="false" size="39%" class="job-detail-drawer">
    <template v-if="selectedJob">
      <section class="drawer-hero">
        <div class="drawer-company">
          <span class="drawer-avatar">{{ selectedJob.company.slice(0, 1) }}</span>
          <div>
            <h2>{{ selectedJob.company }}</h2>
            <p>{{ selectedJob.location }}</p>
          </div>
        </div>
        <div class="drawer-actions">
          <el-button text :icon="EditPen" aria-label="编辑岗位" />
          <el-button text :icon="Close" aria-label="关闭详情" @click="drawerVisible = false" />
        </div>

        <h1>{{ selectedJob.title }}</h1>
        <p class="drawer-salary">
          {{ selectedJob.salary }}
          <span :class="statusOptions[selectedJob.status].className">{{ statusOptions[selectedJob.status].label }}</span>
          <small>· {{ selectedJob.source }}</small>
        </p>
      </section>

      <section class="status-update">
        <p>快速更新状态</p>
        <div class="status-button-row">
          <button
            v-for="item in drawerStatusItems"
            :key="item.value"
            class="drawer-status-button"
            :class="{ active: selectedJob.status === item.value }"
            type="button"
            @click="updateSelectedStatus(item.value)"
          >
            {{ item.label }}
          </button>
        </div>
      </section>

      <el-tabs v-model="detailTab" class="detail-tabs">
        <el-tab-pane name="jd">
          <template #label>
            <span class="tab-label"><el-icon><Document /></el-icon>JD分析</span>
          </template>

          <section class="drawer-panel">
            <h3><el-icon><DataAnalysis /></el-icon> JD 关键词提取</h3>
            <p class="muted">未识别到明确关键词</p>
            <div class="keyword-grid">
              <div>
                <span>经验要求</span>
                <strong>{{ selectedJob.requirements[0] ?? '未明确' }}</strong>
              </div>
              <div>
                <span>学历要求</span>
                <strong>未明确</strong>
              </div>
            </div>
          </section>

          <section class="drawer-panel">
            <h3>完整岗位描述</h3>
            <div class="soft-box">{{ selectedJob.description || '暂无岗位描述' }}</div>
          </section>

          <section class="drawer-panel">
            <h3>岗位要求</h3>
            <ul class="requirement-list">
              <li v-for="requirement in selectedJob.requirements.filter((item) => !item.startsWith('+'))" :key="requirement">
                <el-icon><Check /></el-icon>{{ requirement }}
              </li>
            </ul>
          </section>
        </el-tab-pane>

        <el-tab-pane name="match">
          <template #label>
            <span class="tab-label"><el-icon><DataAnalysis /></el-icon>匹配度</span>
          </template>

          <section class="overall-match">
            <div>
              <h3>综合匹配度</h3>
              <el-progress :percentage="selectedJob.match" :stroke-width="10" :show-text="false" color="#b6f223" />
            </div>
            <strong>{{ selectedJob.match }}%</strong>
          </section>

          <section v-for="item in matchBreakdown" :key="item.title" class="match-panel">
            <div>
              <h3>{{ item.title }}</h3>
              <p>{{ item.description }}</p>
            </div>
            <strong>{{ item.value }}%</strong>
            <el-progress :percentage="item.value" :stroke-width="8" :show-text="false" color="#b6f223" />
          </section>

          <section class="drawer-panel">
            <h3 class="icon-heading"><el-icon><Check /></el-icon>你的优势</h3>
            <p class="muted">暂无明确匹配项，建议深入了解岗位要求</p>
          </section>

          <section class="drawer-panel">
            <h3 class="icon-heading warning"><el-icon><Warning /></el-icon>待补差距</h3>
            <div class="gap-tags">
              <el-tag v-for="requirement in selectedJob.requirements.slice(0, 3)" :key="requirement" effect="plain">
                {{ requirement }}
              </el-tag>
            </div>
          </section>

          <section class="advice-box">
            <h3>投递建议</h3>
            <p>匹配度较低，建议先积累相关经验再投递</p>
            <p>或者寻找要求更匹配的岗位</p>
          </section>
        </el-tab-pane>

        <el-tab-pane name="note">
          <template #label>
            <span class="tab-label"><el-icon><Memo /></el-icon>备注</span>
          </template>

          <section class="drawer-panel">
            <h3>备注记录</h3>
            <div class="note-box">{{ selectedJob.note || selectedJob.description || '暂无备注' }}</div>
          </section>

          <section class="timeline-card">
            <h3>时间线</h3>
            <div class="timeline-item green">
              <strong>添加岗位</strong>
              <span>{{ selectedJob.appliedAt }}</span>
            </div>
            <div v-if="selectedJob.status !== 'saved'" class="timeline-item blue">
              <strong>{{ selectedJob.status === 'offer' ? '收到Offer' : '完成投递' }}</strong>
              <span>{{ selectedJob.appliedAt }}</span>
            </div>
          </section>
        </el-tab-pane>
      </el-tabs>
    </template>
  </el-drawer>
</template>
