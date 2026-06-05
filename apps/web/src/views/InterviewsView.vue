<script setup lang="ts">
import { computed, ref } from 'vue';
import { ArrowLeft, Calendar, Check, EditPen, Location, Plus, Search, Timer } from '@element-plus/icons-vue';
import { assetTypeLabels, type AssetItem, type AssetType, useAssetsStore } from '../stores/assets';
import { useJobsStore } from '../stores/jobs';

type InterviewStatus = 'notStarted' | 'done' | 'cancelled';
type InterviewType = 'phone' | 'technical' | 'video' | 'onsite' | 'hr';
type AssetCascaderPath = Array<string | number>;

interface Interview {
  id: number;
  interviewAt: string;
  type: InterviewType;
  status: InterviewStatus;
  round: number;
  title: string;
  company: string;
  location: string;
  score?: number;
  companyResearch?: string;
  roleMatch?: string;
  questions?: string;
  projectStories?: string;
  preparedQuestions?: string[];
  preparedProjectStories?: string[];
  usedAssetIds?: number[];
  strengths?: string;
  improvements?: string;
  followUp?: string;
}

interface InterviewForm {
  jobId: number | '';
  round: number;
  type: InterviewType;
  status: InterviewStatus;
  interviewAt: string;
  companyResearch: string;
  roleMatch: string;
  questions: string;
  projectStories: string;
  reviewScore: number;
  usedAssets: AssetCascaderPath[];
  strengths: string;
  improvements: string;
  followUp: string;
}

const jobsStore = useJobsStore();
const assetsStore = useAssetsStore();
const searchText = ref('');
const sortBy = ref('time');
const addDialogVisible = ref(false);
const drawerVisible = ref(false);
const activeDetailTab = ref<'battlecard' | 'review'>('battlecard');
const selectedInterview = ref<Interview | null>(null);
const editingInterviewId = ref<number | null>(null);
type PrepKind = 'questions' | 'projectStories';
type PrepField = 'preparedQuestions' | 'preparedProjectStories';

const createDefaultForm = (): InterviewForm => ({
  jobId: '',
  round: 1,
  type: 'phone',
  status: 'notStarted',
  interviewAt: '',
  companyResearch: '',
  roleMatch: '',
  questions: '',
  projectStories: '',
  reviewScore: 85,
  usedAssets: [],
  strengths: '',
  improvements: '',
  followUp: ''
});

const form = ref<InterviewForm>(createDefaultForm());

const typeMap: Record<InterviewType, { label: string; className: string }> = {
  phone: { label: '电话面试', className: 'interview-phone' },
  technical: { label: '技术面试', className: 'interview-technical' },
  video: { label: '视频面试', className: 'interview-video' },
  onsite: { label: '现场面试', className: 'interview-onsite' },
  hr: { label: 'HR面试', className: 'interview-hr' }
};

const statusMap: Record<InterviewStatus, { label: string; className: string }> = {
  notStarted: { label: '未开始', className: 'interview-upcoming' },
  done: { label: '已完成', className: 'interview-done' },
  cancelled: { label: '已取消', className: 'interview-cancelled' }
};

const typeOptions = [
  { label: '视频面试', value: 'video' },
  { label: '电话面试', value: 'phone' },
  { label: '现场面试', value: 'onsite' },
  { label: 'HR面试', value: 'hr' }
] as const;

const statusOptions = [
  { label: '未开始', value: 'notStarted' },
  { label: '已完成', value: 'done' },
  { label: '已取消', value: 'cancelled' }
] as const;

const assetTypeOrder: AssetType[] = ['resume', 'story', 'portfolio', 'question', 'ai'];
const assetCascaderProps = {
  multiple: true,
  emitPath: true,
  value: 'value',
  label: 'label',
  children: 'children'
} as const;

const fallbackCompanyResearch =
  '字节跳动 2012 年成立，旗下有抖音、TikTok、今日头条等产品。技术栈以 React + TypeScript 为主，前端团队约 2000 人。近期重点在 AI 应用和创作者生态。面试看重技术深度和业务理解。';
const fallbackRoleMatch =
  '5 年前端经验，3 年 React 深度使用，有微前端改造实战。在前一家公司主导过前端架构升级，团队 8 人。与“高级前端工程师”岗位要求的“架构设计经验”和“性能优化”高度匹配。';
const fallbackQuestions = ['自我介绍（重点突出架构经验）', '为什么离开上一家公司', '未来的职业规划', '对字节跳动产品的看法', '如何处理跨团队协作'];
const fallbackProjectStories = [
  '微前端架构改造项目：从单体应用到微前端，首屏加载时间从 4.2s 降到 1.1s，团队效率提升 40%',
  '性能优化专项：通过代码分割、懒加载、缓存策略，将核心页面性能评分从 45 提升到 92',
  '技术选型决策：对比 Webpack/Vite，最终选择 Vite，构建时间从 3min 降到 15s'
];
const fallbackStrengths = ['表达清晰有条理', '技术基础扎实，React 原理回答准确', '项目描述有数据支撑', '对业务有一定理解'];
const fallbackImprovements = ['对字节跳动具体业务线了解不够深入', 'AI 相关应用经验较少提及'];
const fallbackFollowUp = '补充阅读字节跳动 2026 年战略方向报道，准备 AI 在产品中的应用案例。';

const interviews = ref<Interview[]>([
  {
    id: 1,
    interviewAt: '2026-05-18T14:00:00',
    type: 'phone',
    status: 'done',
    round: 1,
    title: '高级前端工程师 · 第 1 轮',
    company: '字节跳动',
    location: '北京·海淀',
    score: 85,
    companyResearch: fallbackCompanyResearch,
    roleMatch: fallbackRoleMatch,
    questions: fallbackQuestions.join('\n'),
    projectStories: fallbackProjectStories.join('\n'),
    usedAssetIds: [1, 2, 3],
    strengths: fallbackStrengths.join('\n'),
    improvements: fallbackImprovements.join('\n'),
    followUp: fallbackFollowUp
  },
  {
    id: 2,
    interviewAt: '2026-05-20T10:00:00',
    type: 'technical',
    status: 'done',
    round: 2,
    title: '高级前端工程师 · 第 2 轮',
    company: '字节跳动',
    location: '北京·海淀',
    score: 88,
    companyResearch: fallbackCompanyResearch,
    roleMatch: fallbackRoleMatch,
    questions: fallbackQuestions.join('\n'),
    projectStories: fallbackProjectStories.join('\n'),
    usedAssetIds: [1, 4],
    strengths: ['架构类问题回答完整', '性能优化指标明确', '能把技术决策连接到业务目标'].join('\n'),
    improvements: ['系统设计边界条件可以再展开', '团队协作冲突案例准备不足'].join('\n'),
    followUp: '复盘二面追问点，补充大型活动流量治理和监控告警案例。'
  },
  {
    id: 3,
    interviewAt: '2026-05-22T15:00:00',
    type: 'video',
    status: 'notStarted',
    round: 1,
    title: 'React Native工程师 · 第 1 轮',
    company: '滴滴出行',
    location: '北京·昌平',
    questions: ['React Native 性能优化经验', '原生模块桥接实践', '移动端稳定性治理'].join('\n'),
    projectStories: ['移动端性能优化：列表滑动帧率从 45 提升到 58', '跨端组件库建设：统一 20 个核心业务组件'].join('\n'),
    usedAssetIds: [7]
  },
  {
    id: 4,
    interviewAt: '2026-05-25T09:30:00',
    type: 'video',
    status: 'notStarted',
    round: 1,
    title: '全栈开发工程师 · 第 1 轮',
    company: '阿里云',
    location: '杭州·余杭',
    questions: ['Node.js 服务治理', '云原生部署链路', 'React + NestJS 全栈协作'].join('\n')
  },
  {
    id: 5,
    interviewAt: '2026-05-28T14:00:00',
    type: 'onsite',
    status: 'notStarted',
    round: 3,
    title: '高级前端工程师 · 第 3 轮',
    company: '字节跳动',
    location: '北京·海淀',
    companyResearch: fallbackCompanyResearch,
    roleMatch: fallbackRoleMatch,
    questions: fallbackQuestions.join('\n'),
    projectStories: fallbackProjectStories.join('\n')
  }
]);

const availableJobs = computed(() => jobsStore.jobs.filter((job) => job.status !== 'saved'));
const dialogTitle = computed(() => (editingInterviewId.value ? '编辑面试' : '添加面试'));
const dialogConfirmText = computed(() => (editingInterviewId.value ? '保存修改' : '添加面试'));
const assetCascaderOptions = computed(() =>
  assetTypeOrder
    .map((type) => ({
      value: type,
      label: assetTypeLabels[type],
      children: assetsStore.assets
        .filter((asset) => asset.type === type)
        .map((asset) => ({
          value: asset.id,
          label: asset.title
        }))
    }))
    .filter((group) => group.children.length > 0)
);

const metrics = computed(() => [
  { label: '全部面试', value: interviews.value.length, active: true },
  { label: '即将到来', value: interviews.value.filter((item) => item.status === 'notStarted').length },
  { label: '已完成', value: interviews.value.filter((item) => item.status === 'done').length },
  { label: '本周面试', value: 0 },
  { label: '平均评分', value: '87分' }
]);

const filteredInterviews = computed(() => {
  const keyword = searchText.value.trim().toLowerCase();
  const list = keyword
    ? interviews.value.filter((item) =>
        [item.title, item.company, typeMap[item.type].label].some((value) => value.toLowerCase().includes(keyword))
      )
    : interviews.value;

  return [...list].sort((first, second) =>
    sortBy.value === 'time'
      ? new Date(first.interviewAt).getTime() - new Date(second.interviewAt).getTime()
      : first.company.localeCompare(second.company)
  );
});

const weekdayLabels = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];

const formatDate = (value: string) => {
  const date = new Date(value);
  return `${date.getMonth() + 1}月${date.getDate()}日`;
};

const formatWeekday = (value: string) => weekdayLabels[new Date(value).getDay()];

const formatFullDate = (value: string) => {
  const date = new Date(value);
  return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日${formatWeekday(value)}`;
};

const formatTime = (value: string) => {
  const date = new Date(value);
  return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
};

const splitLines = (value: string | undefined, fallback: string[]) =>
  (value?.trim() ? value : fallback.join('\n'))
    .split('\n')
    .map((item) => item.trim())
    .filter(Boolean);

const getPrepItems = (interview: Interview, kind: PrepKind) =>
  kind === 'questions'
    ? splitLines(interview.questions, fallbackQuestions)
    : splitLines(interview.projectStories, fallbackProjectStories);

const getPrepField = (kind: PrepKind): PrepField =>
  kind === 'questions' ? 'preparedQuestions' : 'preparedProjectStories';

const getPreparedItems = (interview: Interview, kind: PrepKind) => interview[getPrepField(kind)] ?? [];

const assetPathsToIds = (paths: AssetCascaderPath[]) =>
  paths
    .map((path) => Number(path[path.length - 1]))
    .filter((id) => Number.isFinite(id));

const assetIdsToPaths = (ids: number[] | undefined): AssetCascaderPath[] =>
  (ids ?? []).reduce<AssetCascaderPath[]>((paths, id) => {
    const asset = assetsStore.assets.find((item) => item.id === id);
    if (asset) {
      paths.push([asset.type, asset.id]);
    }
    return paths;
  }, []);

const getUsedAssets = (interview: Interview) =>
  (interview.usedAssetIds ?? [])
    .map((id) => assetsStore.assets.find((asset) => asset.id === id))
    .filter((asset): asset is AssetItem => Boolean(asset));

const getPrepProgress = (interview: Interview, kind: PrepKind) => {
  const items = getPrepItems(interview, kind);
  const preparedItems = getPreparedItems(interview, kind);
  return {
    completed: items.filter((item) => preparedItems.includes(item)).length,
    total: items.length
  };
};

const isPrepCompleted = (interview: Interview, kind: PrepKind, item: string) =>
  getPreparedItems(interview, kind).includes(item);

const togglePrepItem = (interview: Interview, kind: PrepKind, item: string) => {
  const field = getPrepField(kind);
  const preparedItems = interview[field] ?? [];
  interview[field] = preparedItems.includes(item)
    ? preparedItems.filter((preparedItem) => preparedItem !== item)
    : [...preparedItems, item];
};

const baseTitle = (interview: Interview) => interview.title.replace(/\s*·\s*第\s*\d+\s*轮$/, '');

const getInterviewJobId = (interview: Interview) =>
  jobsStore.jobs.find((job) => job.company === interview.company && interview.title.startsWith(job.title))?.id ?? '';

const openDetail = (interview: Interview) => {
  selectedInterview.value = interview;
  activeDetailTab.value = 'battlecard';
  drawerVisible.value = true;
};

const openAddDialog = () => {
  editingInterviewId.value = null;
  form.value = createDefaultForm();
  addDialogVisible.value = true;
};

const openEditDialog = (interview: Interview) => {
  editingInterviewId.value = interview.id;
  selectedInterview.value = interview;
  form.value = {
    jobId: getInterviewJobId(interview),
    round: interview.round,
    type: interview.type,
    status: interview.status,
    interviewAt: interview.interviewAt,
    companyResearch: interview.companyResearch ?? fallbackCompanyResearch,
    roleMatch: interview.roleMatch ?? fallbackRoleMatch,
    questions: splitLines(interview.questions, fallbackQuestions).join('\n'),
    projectStories: splitLines(interview.projectStories, fallbackProjectStories).join('\n'),
    reviewScore: interview.score ?? 85,
    usedAssets: assetIdsToPaths(interview.usedAssetIds),
    strengths: splitLines(interview.strengths, fallbackStrengths).join('\n'),
    improvements: splitLines(interview.improvements, fallbackImprovements).join('\n'),
    followUp: interview.followUp ?? fallbackFollowUp
  };
  addDialogVisible.value = true;
};

const completeInterview = (interview: Interview) => {
  interview.status = 'done';
  interview.score = interview.score ?? 85;
};

const closeDialog = () => {
  addDialogVisible.value = false;
  editingInterviewId.value = null;
};

const submitInterview = () => {
  const selectedJob = jobsStore.jobs.find((job) => job.id === form.value.jobId);
  const editingInterview = interviews.value.find((item) => item.id === editingInterviewId.value) ?? null;
  if ((!selectedJob && !editingInterview) || !form.value.interviewAt) {
    return;
  }

  const source = selectedJob ?? editingInterview;
  const nextQuestions = splitLines(form.value.questions, fallbackQuestions);
  const nextProjectStories = splitLines(form.value.projectStories, fallbackProjectStories);
  const nextInterview: Interview = {
    id: editingInterview?.id ?? Date.now(),
    interviewAt: form.value.interviewAt,
    type: form.value.type,
    status: form.value.status,
    round: form.value.round || 1,
    title: `${selectedJob ? selectedJob.title : baseTitle(editingInterview as Interview)} · 第 ${form.value.round || 1} 轮`,
    company: source?.company ?? '',
    location: source?.location ?? '',
    score: form.value.status === 'done' ? form.value.reviewScore : undefined,
    companyResearch: form.value.companyResearch,
    roleMatch: form.value.roleMatch,
    questions: form.value.questions,
    projectStories: form.value.projectStories,
    preparedQuestions: editingInterview?.preparedQuestions?.filter((item) => nextQuestions.includes(item)) ?? [],
    preparedProjectStories:
      editingInterview?.preparedProjectStories?.filter((item) => nextProjectStories.includes(item)) ?? [],
    usedAssetIds: assetPathsToIds(form.value.usedAssets),
    strengths: form.value.strengths,
    improvements: form.value.improvements,
    followUp: form.value.followUp
  };

  if (editingInterview) {
    Object.assign(editingInterview, nextInterview);
    selectedInterview.value = editingInterview;
  } else {
    interviews.value.unshift(nextInterview);
  }

  addDialogVisible.value = false;
  editingInterviewId.value = null;
};
</script>

<template>
  <section class="interview-header">
    <div>
      <h1>面试管理</h1>
      <p>日程管理、作战卡准备、复盘迭代 — 每一场面试都是一次升级</p>
    </div>
    <el-button class="add-job-button" :icon="Plus" @click="openAddDialog">添加面试</el-button>
  </section>

  <section class="interview-metrics">
    <article v-for="metric in metrics" :key="metric.label" class="interview-metric" :class="{ active: metric.active }">
      <strong>{{ metric.value }}</strong>
      <span>{{ metric.label }}</span>
    </article>
  </section>

  <section class="toolbar interview-toolbar">
    <el-input v-model="searchText" :prefix-icon="Search" placeholder="搜索岗位、公司、面试类型..." size="large" />
    <el-select v-model="sortBy" size="large" class="sort-select">
      <el-option label="按面试时间" value="time" />
      <el-option label="按公司名称" value="company" />
    </el-select>
  </section>

  <section class="interview-grid">
    <article v-for="interview in filteredInterviews" :key="interview.id" class="interview-card" @click="openDetail(interview)">
      <el-button class="interview-card-edit" :icon="EditPen" plain @click.stop="openEditDialog(interview)">编辑</el-button>
      <div class="interview-date">
        <strong>{{ formatDate(interview.interviewAt) }}</strong>
        <span>{{ formatWeekday(interview.interviewAt) }}</span>
      </div>

      <div class="interview-main">
        <div class="interview-tags">
          <span :class="typeMap[interview.type].className">{{ typeMap[interview.type].label }}</span>
          <span :class="statusMap[interview.status].className">{{ statusMap[interview.status].label }}</span>
        </div>
        <h2>{{ interview.title }}</h2>
        <p class="interview-company">{{ interview.company }}</p>
        <div class="interview-meta">
          <span><el-icon><Timer /></el-icon>{{ formatTime(interview.interviewAt) }}</span>
          <span><el-icon><Location /></el-icon>{{ interview.location }}</span>
        </div>

        <template v-if="interview.score">
          <div class="interview-score">
            <span>综合评分</span>
            <strong>{{ interview.score }} 分</strong>
            <el-progress :percentage="interview.score" :stroke-width="7" :show-text="false" color="#2f9e8f" />
          </div>
        </template>
      </div>
    </article>
  </section>

  <el-drawer v-model="drawerVisible" :with-header="false" size="38%" direction="rtl" class="interview-detail-drawer">
    <template v-if="selectedInterview">
      <section class="interview-detail-hero">
        <el-button class="interview-detail-back" :icon="ArrowLeft" text @click="drawerVisible = false" />
        <div class="interview-detail-actions">
          <el-button plain @click="openEditDialog(selectedInterview)">编辑</el-button>
          <el-button
            v-if="selectedInterview.status === 'notStarted'"
            class="restart-button"
            @click="completeInterview(selectedInterview)"
          >
            已完成
          </el-button>
        </div>

        <div class="interview-detail-tags">
          <span :class="typeMap[selectedInterview.type].className">{{ typeMap[selectedInterview.type].label }}</span>
          <span class="round-badge">第 {{ selectedInterview.round }} 轮</span>
          <span :class="statusMap[selectedInterview.status].className">{{ statusMap[selectedInterview.status].label }}</span>
        </div>
        <h1>{{ baseTitle(selectedInterview) }}</h1>
        <p>{{ selectedInterview.company }} · {{ selectedInterview.location }}</p>
        <div class="interview-detail-meta">
          <span><el-icon><Calendar /></el-icon>{{ formatFullDate(selectedInterview.interviewAt) }}</span>
          <span><el-icon><Timer /></el-icon>{{ formatTime(selectedInterview.interviewAt) }}</span>
        </div>
      </section>

      <section class="interview-detail-tabs">
        <button :class="{ active: activeDetailTab === 'battlecard' }" @click="activeDetailTab = 'battlecard'">作战卡</button>
        <button :class="{ active: activeDetailTab === 'review' }" @click="activeDetailTab = 'review'">复盘记录</button>
      </section>

      <section v-if="activeDetailTab === 'battlecard'" class="interview-detail-body">
        <article class="prep-section">
          <h3><span>01</span>公司研究</h3>
          <p>{{ selectedInterview.companyResearch || fallbackCompanyResearch }}</p>
        </article>
        <article class="prep-section">
          <h3><span>02</span>角色匹配分析</h3>
          <p>{{ selectedInterview.roleMatch || fallbackRoleMatch }}</p>
        </article>
        <article class="prep-list-section">
          <div class="prep-title-row">
            <h3><span>03</span>预测问题清单</h3>
            <strong>
              {{ getPrepProgress(selectedInterview, 'questions').completed }}/{{
                getPrepProgress(selectedInterview, 'questions').total
              }}
              已准备
            </strong>
          </div>
          <button
            v-for="question in getPrepItems(selectedInterview, 'questions')"
            :key="question"
            class="prep-check-item"
            :class="{ completed: isPrepCompleted(selectedInterview, 'questions', question) }"
            type="button"
            role="checkbox"
            :aria-checked="isPrepCompleted(selectedInterview, 'questions', question)"
            @click="togglePrepItem(selectedInterview, 'questions', question)"
          >
            <span class="prep-check-box">
              <el-icon v-if="isPrepCompleted(selectedInterview, 'questions', question)"><Check /></el-icon>
            </span>
            <span class="prep-check-text">{{ question }}</span>
          </button>
        </article>
        <article class="prep-list-section">
          <div class="prep-title-row">
            <h3><span>04</span>项目故事准备</h3>
            <strong>
              {{ getPrepProgress(selectedInterview, 'projectStories').completed }}/{{
                getPrepProgress(selectedInterview, 'projectStories').total
              }}
              已准备
            </strong>
          </div>
          <button
            v-for="story in getPrepItems(selectedInterview, 'projectStories')"
            :key="story"
            class="prep-check-item"
            :class="{ completed: isPrepCompleted(selectedInterview, 'projectStories', story) }"
            type="button"
            role="checkbox"
            :aria-checked="isPrepCompleted(selectedInterview, 'projectStories', story)"
            @click="togglePrepItem(selectedInterview, 'projectStories', story)"
          >
            <span class="prep-check-box">
              <el-icon v-if="isPrepCompleted(selectedInterview, 'projectStories', story)"><Check /></el-icon>
            </span>
            <span class="prep-check-text">{{ story }}</span>
          </button>
        </article>
      </section>

      <section v-else class="interview-detail-body">
        <article class="review-score-panel">
          <div class="score-ring">{{ selectedInterview.score ?? 85 }}</div>
          <div>
            <h3>综合评分</h3>
            <strong>{{ selectedInterview.score ?? 85 }} <span>/ 100</span></strong>
            <p>表现出色，继续保持！</p>
          </div>
        </article>
        <article v-if="getUsedAssets(selectedInterview).length" class="review-section">
          <h3 class="review-heading">使用内容</h3>
          <div class="used-asset-list">
            <span v-for="asset in getUsedAssets(selectedInterview)" :key="asset.id" class="used-asset-chip">
              {{ assetTypeLabels[asset.type] }} · {{ asset.title }}
            </span>
          </div>
        </article>
        <article class="review-section">
          <h3 class="review-heading">表现亮点</h3>
          <p v-for="item in splitLines(selectedInterview.strengths, fallbackStrengths)" :key="item" class="review-good-item">
            <el-icon><Check /></el-icon>{{ item }}
          </p>
        </article>
        <article class="review-section">
          <h3 class="review-heading">待改进项</h3>
          <p v-for="item in splitLines(selectedInterview.improvements, fallbackImprovements)" :key="item" class="review-warn-item">
            <span>!</span>{{ item }}
          </p>
        </article>
        <article class="review-section">
          <h3 class="review-heading">后续行动计划</h3>
          <div class="follow-up-card">{{ selectedInterview.followUp || fallbackFollowUp }}</div>
        </article>
      </section>
    </template>
  </el-drawer>

  <el-dialog
    v-model="addDialogVisible"
    :title="dialogTitle"
    width="780px"
    class="delivery-dialog interview-dialog"
    align-center
    @closed="editingInterviewId = null"
  >
    <el-form label-position="top" class="job-form">
      <h3 class="dialog-section-title">基本信息</h3>
      <div class="form-grid">
        <el-form-item label="关联岗位">
          <el-select v-model="form.jobId" placeholder="选择岗位" size="large" filterable>
            <el-option
              v-for="job in availableJobs"
              :key="job.id"
              :label="`${job.company} - ${job.title}`"
              :value="job.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="面试轮次">
          <el-input-number v-model="form.round" :min="1" :max="10" size="large" controls-position="right" />
        </el-form-item>
        <el-form-item label="面试类型">
          <el-select v-model="form.type" size="large">
            <el-option v-for="option in typeOptions" :key="option.value" :label="option.label" :value="option.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="form.status" size="large">
            <el-option
              v-for="option in statusOptions"
              :key="option.value"
              :label="option.label"
              :value="option.value"
            />
          </el-select>
        </el-form-item>
      </div>

      <el-form-item label="面试时间">
        <el-date-picker
          v-model="form.interviewAt"
          type="datetime"
          value-format="YYYY-MM-DDTHH:mm:ss"
          format="YYYY/MM/DD HH:mm"
          placeholder="年 / 月 / 日 --:--"
          size="large"
        />
      </el-form-item>

      <h3 class="dialog-section-title with-divider">作战卡内容</h3>
      <el-form-item label="公司研究">
        <el-input v-model="form.companyResearch" type="textarea" :rows="4" placeholder="记录公司背景、技术栈、近期动态..." />
      </el-form-item>
      <el-form-item label="角色匹配分析">
        <el-input v-model="form.roleMatch" type="textarea" :rows="4" placeholder="分析自身经历与岗位要求的匹配点..." />
      </el-form-item>
      <el-form-item label="预测问题清单（每行一个）">
        <el-input v-model="form.questions" type="textarea" :rows="4" placeholder="自我介绍&#10;离职原因&#10;职业规划..." />
      </el-form-item>
      <el-form-item label="项目故事准备（每行一个）">
        <el-input
          v-model="form.projectStories"
          type="textarea"
          :rows="4"
          placeholder="项目1：背景、方案、成果&#10;项目2：背景、方案、成果..."
        />
      </el-form-item>

      <h3 class="dialog-section-title with-divider">复盘记录</h3>
      <el-form-item label="综合评分（0-100）">
        <div class="review-score-field">
          <el-slider v-model="form.reviewScore" :min="0" :max="100" />
          <strong>{{ form.reviewScore }}</strong>
        </div>
      </el-form-item>
      <el-form-item label="使用内容">
        <el-cascader
          v-model="form.usedAssets"
          :options="assetCascaderOptions"
          :props="assetCascaderProps"
          placeholder="按资产类型选择内容资产"
          size="large"
          collapse-tags
          collapse-tags-tooltip
          clearable
          filterable
          class="full-width-cascader"
        />
      </el-form-item>
      <el-form-item label="表现亮点（每行一个）">
        <el-input
          v-model="form.strengths"
          type="textarea"
          :rows="4"
          placeholder="表达清晰有条理&#10;技术基础扎实..."
        />
      </el-form-item>
      <el-form-item label="待改进项（每行一个）">
        <el-input
          v-model="form.improvements"
          type="textarea"
          :rows="4"
          placeholder="对业务线了解不够深入&#10;AI 相关应用经验较少提及..."
        />
      </el-form-item>
      <el-form-item label="后续行动计划">
        <el-input
          v-model="form.followUp"
          type="textarea"
          :rows="3"
          placeholder="记录下一步补强计划..."
        />
      </el-form-item>
    </el-form>

    <template #footer>
      <el-button size="large" @click="closeDialog">取消</el-button>
      <el-button
        size="large"
        class="confirm-button"
        :disabled="(!form.jobId && !editingInterviewId) || !form.interviewAt"
        @click="submitInterview"
      >
        {{ dialogConfirmText }}
      </el-button>
    </template>
  </el-dialog>
</template>
