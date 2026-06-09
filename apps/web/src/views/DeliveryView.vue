<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue';
import { Calendar, Connection, Plus, Search, WarningFilled } from '@element-plus/icons-vue';
import {
  createApplication,
  fetchApplications,
  type DeliveryRecord,
  type DeliveryStatus
} from '../api/applications';
import { useJobsStore } from '../stores/jobs';

interface DeliveryForm {
  jobId: number | null;
  resume: string;
  channel: string;
  status: DeliveryStatus;
  date: string;
  response: string;
  note: string;
}

const jobsStore = useJobsStore();
const searchText = ref('');
const sortBy = ref('time');
const addDialogVisible = ref(false);

const statusMap: Record<DeliveryStatus, { label: string; className: string; color: string }> = {
  submitted: { label: '已投递', className: 'delivery-submitted', color: '#9ca3af' },
  viewed: { label: '已查看', className: 'delivery-viewed', color: '#60a5fa' },
  contacted: { label: '已联系', className: 'delivery-contacted', color: '#fbbf24' },
  interviewing: { label: '面试中', className: 'delivery-interviewing', color: '#b6f223' },
  offer: { label: '已拿Offer', className: 'delivery-offer', color: '#2f9e8f' },
  rejected: { label: '未通过', className: 'delivery-rejected', color: '#fb6b6b' }
};

const statusOptions = [
  { label: '已投递', value: 'submitted' },
  { label: '已查看', value: 'viewed' },
  { label: '已联系', value: 'contacted' },
  { label: '面试中', value: 'interviewing' },
  { label: '未通过', value: 'rejected' },
  { label: '已拿offer', value: 'offer' }
] satisfies Array<{ label: string; value: DeliveryStatus }>;

const today = new Date().toISOString().slice(0, 10);

const initialForm = (): DeliveryForm => ({
  jobId: null,
  resume: '',
  channel: '',
  status: 'submitted',
  date: today,
  response: '',
  note: ''
});

const form = reactive<DeliveryForm>(initialForm());

const records = ref<DeliveryRecord[]>([
  {
    id: 1,
    company: '字节跳动',
    title: '高级前端工程师',
    channel: '内推',
    resume: '技术岗通用简历 v3.0',
    date: '2026-05-20',
    response: '等待中',
    status: 'submitted',
    description: '通过前同事二进宫内推到另一个部门，简历相同但岗位侧重点不同，正在等待反馈。'
  },
  {
    id: 2,
    company: '美团',
    title: '技术负责人',
    channel: '猎聘',
    resume: '管理岗简历 v1.0',
    date: '2026-05-15',
    response: '2 天',
    status: 'contacted',
    description: '猎聘顾问推荐，HR 已电话沟通基本情况，等待安排技术面。团队管理经验需要更具体的案例支撑。'
  },
  {
    id: 3,
    company: '字节跳动',
    title: '高级前端工程师',
    channel: '官网',
    resume: '技术岗通用简历 v3.0',
    date: '2026-05-12',
    response: '1 天',
    status: 'interviewing',
    description: '内推效率很高，HR 2 小时内查看简历，当天安排了一面。简历重点突出了架构治理和性能优化数据。'
  },
  {
    id: 4,
    company: '阿里云',
    title: '全栈开发工程师',
    channel: '内推',
    resume: '全栈方向简历 v2.0',
    date: '2026-05-11',
    response: '5 小时',
    status: 'viewed',
    description: '通过前同事内推，简历已被查看但还未收到反馈。简历中 Node.js 项目经验可能不够突出。'
  },
  {
    id: 5,
    company: '滴滴出行',
    title: 'React Native 工程师',
    channel: 'BOSS直聘',
    resume: '移动端简历 v2.0',
    date: '2026-05-10',
    response: '1 天',
    status: 'interviewing',
    description: '主动投递，HR 次日联系安排面试。React Native 经验匹配度高，简历中的移动端性能优化数据吸引了面试官。'
  },
  {
    id: 6,
    company: '阿里云',
    title: '全栈开发工程师',
    channel: 'BOSS直聘',
    resume: '全栈方向简历 v2.0',
    date: '2026-05-08',
    response: '已结束',
    status: 'rejected',
    description: '',
    alert: '简历投递后无查看记录，可能被系统过滤。分析原因：关键词匹配度低，云原生经验描述不够明确。'
  },
  {
    id: 7,
    company: '腾讯',
    title: '前端架构师',
    channel: '官网',
    resume: '技术岗通用简历 v2.5',
    date: '2026-05-07',
    response: '已结束',
    status: 'rejected',
    description: '',
    alert: '简历筛选未通过。分析原因：项目描述不够突出，缺少量化的成果数据。已根据反馈优化简历到 v3.0。'
  },
  {
    id: 8,
    company: '小红书',
    title: '高级产品经理',
    channel: '脉脉',
    resume: '社区产品经理内推',
    date: '2026-05-01',
    response: '已拿Offer',
    status: 'offer',
    description: '通过脉脉认识的小红书产品经理内推。简历重点突出创作者生态和数据驱动产品经验，与岗位高度匹配。3 轮面试后拿到 Offer。'
  }
]);

onMounted(async () => {
  await jobsStore.loadJobs();
  records.value = await fetchApplications();
});

const metrics = computed(() => [
  { label: '全部投递', value: records.value.length },
  { label: '已查看', value: records.value.filter((item) => item.status === 'viewed').length },
  { label: '已联系', value: records.value.filter((item) => item.status === 'contacted').length },
  { label: '面试中', value: records.value.filter((item) => item.status === 'interviewing').length },
  { label: '已拿Offer', value: records.value.filter((item) => item.status === 'offer').length },
  { label: '未通过', value: records.value.filter((item) => item.status === 'rejected').length },
  { label: '转化率', value: '38%' }
]);

const filteredRecords = computed(() => {
  const keyword = searchText.value.trim().toLowerCase();
  const list = keyword
    ? records.value.filter((item) =>
        [item.company, item.title, item.channel, item.resume].some((value) => value.toLowerCase().includes(keyword))
      )
    : records.value;

  return [...list].sort((first, second) =>
    sortBy.value === 'time' ? second.date.localeCompare(first.date) : first.company.localeCompare(second.company)
  );
});

const funnelItems = computed(() => [
  { key: 'submitted', count: 1, rate: '100%', width: 50, sub: '' },
  { key: 'viewed', count: 1, rate: '13%', width: 50, sub: '转化率 100%' },
  { key: 'contacted', count: 1, rate: '13%', width: 50, sub: '转化率 100%' },
  { key: 'interviewing', count: 2, rate: '25%', width: 100, sub: '转化率 200%' },
  { key: 'offer', count: 1, rate: '13%', width: 50, sub: '转化率 50%' },
  { key: 'rejected', count: 2, rate: '25%', width: 100, sub: '流失率 25%' }
] as const);

const issueCards = [
  {
    title: '简历量化数据不足',
    level: '高',
    className: 'high',
    body: '3 次未通过或长时间无反馈的投递，简历中缺少具体的数字指标（性能提升百分比、用户增长数据等）',
    action: '在每个项目故事中加入「背景-行动-量化成果」三段式描述，至少包含 2 个具体数字'
  },
  { title: '关键词匹配度偏低', level: '高', className: 'high' },
  { title: '投递渠道分布不均', level: '中', className: 'medium' },
  { title: '响应时间管理', level: '低', className: 'low' }
];

const resetForm = () => {
  Object.assign(form, initialForm());
};

const openAddDialog = () => {
  resetForm();
  addDialogVisible.value = true;
};

const submitRecord = async () => {
  const job = jobsStore.jobs.find((item) => item.id === form.jobId);
  if (!job) return;

  const record = await createApplication({
    jobId: job.id,
    resume: form.resume,
    channel: form.channel,
    status: form.status,
    date: form.date,
    response: form.response,
    note: form.note
  });

  records.value = [record, ...records.value.filter((item) => item.id !== record.id)].sort((first, second) =>
    second.date.localeCompare(first.date)
  );

  sortBy.value = 'time';
  addDialogVisible.value = false;
  resetForm();
};
</script>

<template>
  <section class="delivery-header">
    <div>
      <h1>投递管理</h1>
      <p>投递记录、漏斗分析、AI 诊断 — 用数据驱动每一次迭代</p>
    </div>
    <el-button class="add-job-button" :icon="Plus" @click="openAddDialog">添加投递</el-button>
  </section>

  <section class="delivery-metrics">
    <article v-for="metric in metrics" :key="metric.label" class="delivery-metric">
      <strong>{{ metric.value }}</strong>
      <span>{{ metric.label }}</span>
    </article>
  </section>

  <section class="toolbar delivery-toolbar">
    <el-input v-model="searchText" :prefix-icon="Search" placeholder="搜索公司、岗位、渠道、简历版本..." size="large" />
    <el-select v-model="sortBy" size="large" class="sort-select">
      <el-option label="按投递时间" value="time" />
      <el-option label="按公司名称" value="company" />
    </el-select>
  </section>

  <section class="delivery-layout">
    <div class="delivery-list-column">
      <div class="section-title-row">
        <h2>投递记录 <span>（{{ filteredRecords.length }}）</span></h2>
        <p>平均响应 23h</p>
      </div>

      <article v-for="record in filteredRecords" :key="record.id" class="delivery-card">
        <div class="delivery-card-head">
          <div class="company-lockup">
            <span class="company-avatar">{{ record.company.slice(0, 1) }}</span>
            <div>
              <h2>{{ record.company }}</h2>
              <p>{{ record.title }}</p>
            </div>
          </div>
          <span class="delivery-status" :class="statusMap[record.status].className">
            {{ statusMap[record.status].label }}
          </span>
        </div>

        <div class="delivery-meta">
          <span><el-icon><Connection /></el-icon>{{ record.channel }}</span>
          <span>{{ record.resume }}</span>
        </div>

        <div class="delivery-date-row">
          <span><el-icon><Calendar /></el-icon>{{ record.date }}</span>
          <span>响应: {{ record.response }}</span>
        </div>

        <p v-if="record.description" class="delivery-description">{{ record.description }}</p>
        <p v-if="record.alert" class="delivery-alert">
          <el-icon><WarningFilled /></el-icon>{{ record.alert }}
        </p>
      </article>
    </div>

    <aside class="delivery-side">
      <section class="analysis-card">
        <div class="analysis-card-head">
          <h2>投递漏斗</h2>
          <span>共 8 次投递</span>
        </div>
        <div class="funnel-list">
          <div v-for="item in funnelItems" :key="item.key" class="funnel-item">
            <div class="funnel-label">
              <span :style="{ background: statusMap[item.key].color }"></span>
              {{ statusMap[item.key].label }}
              <strong>{{ item.count }}次 <small>{{ item.sub }}</small></strong>
            </div>
            <div class="funnel-track">
              <div :style="{ width: `${item.width}%`, background: statusMap[item.key].color }"></div>
              <b>{{ item.rate }}</b>
            </div>
          </div>
        </div>

        <div class="mini-stat-grid">
          <div>
            <span>平均响应时间</span>
            <strong>23h</strong>
            <small>收到反馈</small>
          </div>
          <div>
            <span>内推占比</span>
            <strong>25%</strong>
            <small>内推 vs 直投</small>
          </div>
        </div>
      </section>

      <section class="analysis-card ai-card">
        <div class="ai-score">
          <span>72</span>
        </div>
        <div>
          <h2>AI 诊断分析</h2>
          <p>基于 4 个关键因子分析</p>
        </div>
        <div class="ai-summary">
          基于 8 次投递数据分析，你的投递转化率为 25%（2 次面试 + 1 次 Offer），低于行业平均 35%。主要问题在于：简历关键词匹配度不足、项目描述缺少量化数据、部分投递渠道效率偏低。
        </div>

        <h3>失败原因</h3>
        <div class="issue-list">
          <article v-for="issue in issueCards" :key="issue.title" class="issue-card" :class="issue.className">
            <div class="issue-title">
              <span></span>
              <strong>{{ issue.title }}</strong>
              <em>{{ issue.level }}</em>
            </div>
            <template v-if="issue.body">
              <p>{{ issue.body }}</p>
              <small>{{ issue.action }}</small>
            </template>
          </article>
        </div>

        <h3>行动计划</h3>
        <div class="plan-list">
          <p><b>1</b>本周完成简历 v3.1 升级：为每个项目补充量化数据（3 个数字/项目）</p>
          <p><b>3</b>补充渠道覆盖：每周新增 3 个内推触点，并记录响应效率</p>
          <p><b>5</b>准备 2 个新版本的「项目故事」用于高频问题</p>
        </div>

        <h3>内容资产更新建议</h3>
        <div class="asset-list">
          <article>
            <strong>技术岗通用简历 v3.0</strong>
            <p>项目描述缺少量化数据，3 个核心项目均无性能指标</p>
            <p>补充：微前端改造后首屏加载 4.2s→1.1s，组件库复用率 90%</p>
          </article>
          <article>
            <strong>前端面试高频题库</strong>
            <p>缺少「算法题专项」，近期 2 次面试算法环节表现一般</p>
            <p>新增 LeetCode 高频 50 题分类整理，重点攻克二叉树、动态规划、链表</p>
          </article>
          <article>
            <strong>项目故事库</strong>
            <p>故事覆盖不足，仅有 3 个，无法覆盖不同岗位的侧重点</p>
            <p>新增 2 个故事：跨团队协作、技术选型决策</p>
          </article>
        </div>

        <el-button class="rerun-button">重新运行 AI 诊断</el-button>
      </section>
    </aside>
  </section>

  <el-dialog v-model="addDialogVisible" title="添加投递记录" width="630px" class="delivery-dialog" align-center>
    <el-form label-position="top" class="job-form">
      <el-form-item label="关联岗位">
        <el-select v-model="form.jobId" placeholder="选择岗位" size="large" filterable>
          <el-option
            v-for="job in jobsStore.jobs"
            :key="job.id"
            :label="`${job.company} - ${job.title}`"
            :value="job.id"
          />
        </el-select>
      </el-form-item>

      <div class="form-grid">
        <el-form-item label="简历版本">
          <el-input v-model="form.resume" placeholder="如：技术岗简历 v3.0" size="large" />
        </el-form-item>
        <el-form-item label="投递渠道">
          <el-input v-model="form.channel" placeholder="如：BOSS直聘" size="large" />
        </el-form-item>
        <el-form-item label="当前状态">
          <el-select v-model="form.status" size="large">
            <el-option v-for="option in statusOptions" :key="option.value" :label="option.label" :value="option.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="投递日期">
          <el-date-picker
            v-model="form.date"
            type="date"
            value-format="YYYY-MM-DD"
            format="YYYY/MM/DD"
            size="large"
          />
        </el-form-item>
      </div>

      <el-form-item label="响应时间（小时，可选）">
        <el-input v-model="form.response" placeholder="如：24" size="large" />
      </el-form-item>

      <el-form-item label="备注">
        <el-input v-model="form.note" type="textarea" :rows="5" placeholder="记录投递细节、反馈、失败原因等..." />
      </el-form-item>
    </el-form>

    <template #footer>
      <el-button size="large" @click="addDialogVisible = false">取消</el-button>
      <el-button size="large" class="confirm-button" :disabled="!form.jobId || !form.date" @click="submitRecord">
        添加记录
      </el-button>
    </template>
  </el-dialog>
</template>
