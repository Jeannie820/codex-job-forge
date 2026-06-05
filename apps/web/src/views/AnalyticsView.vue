<script setup lang="ts">
import { computed, ref } from 'vue';
import { Connection, DataAnalysis, Document, Promotion, Timer, Warning } from '@element-plus/icons-vue';

type AnalyticsTab = 'funnel' | 'failure' | 'ai';
type ScoreLevel = 'good' | 'warning' | 'danger';

interface FunnelStep {
  id: number;
  title: string;
  count: number;
  rate?: string;
  days?: string;
  width: number;
  industry: string;
  className: string;
}

interface TrendWeek {
  label: string;
  delivery: number;
  interview: number;
  offer: number;
}

interface FailureCase {
  company: string;
  title: string;
  result: string;
  date: string;
  match: number;
  reasons: number;
}

interface DiagnosisItem {
  title: string;
  score: number;
  level: ScoreLevel;
  summary: string;
  suggestions: string[];
}

const activeTab = ref<AnalyticsTab>('funnel');

const tabs = [
  { key: 'funnel', title: '漏斗分析', desc: '投递到 Offer 的转化路径', icon: DataAnalysis },
  { key: 'failure', title: '失败归因', desc: '复盘失败案例找到根因', icon: Warning },
  { key: 'ai', title: 'AI 诊断', desc: '五维策略评估与建议', icon: Connection }
] satisfies Array<{ key: AnalyticsTab; title: string; desc: string; icon: typeof DataAnalysis }>;

const funnelSteps: FunnelStep[] = [
  { id: 1, title: '投递简历', count: 16, width: 100, industry: '行业 100%', className: 'blue' },
  { id: 2, title: '简历被查看', count: 12, rate: '转化率 75%', days: '+2.3天', width: 75, industry: '行业 55%', className: 'teal' },
  { id: 3, title: '收到回复/约面', count: 8, rate: '转化率 67%', days: '+4.1天', width: 50, industry: '行业 40%', className: 'cyan' },
  { id: 4, title: '进入面试环节', count: 7, rate: '转化率 88%', days: '+6.5天', width: 44, industry: '行业 35%', className: 'green' },
  { id: 5, title: '收到Offer', count: 1, rate: '转化率 14%', days: '+12天', width: 17, industry: '行业 18%', className: 'lime' }
];

const funnelMetrics = [
  { label: '总投递', value: '16', icon: Promotion },
  { label: '进入面试', value: '7', icon: Connection },
  { label: '平均约面周期', value: '4.1天', icon: Timer },
  { label: 'Offer转化率', value: '6.3%', icon: Document }
];

const trendWeeks: TrendWeek[] = [
  { label: 'W1', delivery: 6, interview: 2, offer: 1 },
  { label: 'W2', delivery: 8, interview: 3, offer: 1 },
  { label: 'W3', delivery: 4, interview: 4, offer: 1 },
  { label: 'W4', delivery: 6, interview: 4, offer: 3 },
  { label: 'W5', delivery: 8, interview: 4, offer: 1 },
  { label: 'W6', delivery: 1, interview: 1, offer: 1 }
];

const failureCases: FailureCase[] = [
  { company: '腾讯', title: '前端架构师', result: '简历筛选 未通过', date: '2026-05-14', match: 79, reasons: 2 },
  { company: '拼多多', title: '高级前端工程师', result: '一面 未通过', date: '2026-05-10', match: 76, reasons: 2 },
  { company: '美团', title: '技术负责人', result: '二面 未通过', date: '2026-04-28', match: 75, reasons: 2 },
  { company: '阿里云', title: '全栈开发工程师', result: '简历筛选 未通过', date: '2026-04-22', match: 72, reasons: 3 }
];

const diagnosisItems: DiagnosisItem[] = [
  {
    title: '简历质量',
    score: 78,
    level: 'warning',
    summary: '项目描述有量化数据，但缺少业务价值层面的叙事。简历通过率为 75%，处于行业平均水平。',
    suggestions: ['将「做了什么」升级为「带来多少业务价值」', '增加与目标岗位 JD 的关键词匹配度', '补充技术影响力指标：开源 Star 数、团队规模、系统覆盖用户数']
  },
  {
    title: '面试表现',
    score: 85,
    level: 'good',
    summary: '技术面表现优秀，平均评分 86.5 分。架构类问题回答思路清晰，但算法题耗时偏长。',
    suggestions: ['保持项目故事的准备深度', '每天 20 分钟算法热身，重点优化常见题型的解题速度', '补充系统设计高频场景：短链服务、IM 消息系统、秒杀系统']
  },
  {
    title: '岗位匹配度',
    score: 81,
    level: 'good',
    summary: '整体匹配度 81 分，高于投递岗位的平均要求。但部分高薪岗位（50K+）的匹配度在 75 左右，存在经验差距。',
    suggestions: ['针对高薪岗位补充分布式系统设计经验', '在简历中突出团队管理和跨部门协作经历', '考虑先从「高级工程师」切入，积累管理经验后再冲击「技术负责人」']
  },
  {
    title: '投递效率',
    score: 62,
    level: 'warning',
    summary: 'Offer 转化率仅 14%，低于行业平均 20%。简历查看率 75% 良好，但约面率仅 67% 偏低。',
    suggestions: ['优化求职信定制化程度，当前 80% 使用通用模板', '扩大内推渠道比例，内推转化率比官网投递高 2.3x', '避开周二上午投递高峰，选择周三下午投递可提升查看率 15%']
  },
  {
    title: '内容资产迭代',
    score: 72,
    level: 'warning',
    summary: '资产库共有 8 条，题库版本迭代最活跃（v5），但项目故事仅迭代 2 次。使用记录显示简历 v3.0 的投递通过率为 75%。',
    suggestions: ['根据面试反馈高频更新项目故事，建议每次面试后补充新 QA', '建立「面试 -> 复盘 -> 更新资产」的标准化闭环流程', '将高频被问到的项目细节提取为独立的「问题应答卡片」']
  }
];

const activeTabLabel = computed(() => tabs.find((tab) => tab.key === activeTab.value)?.title ?? '');

const trendMax = Math.max(...trendWeeks.flatMap((week) => [week.delivery, week.interview, week.offer]));

const barHeight = (value: number) => `${Math.max((value / trendMax) * 158, 6)}px`;
</script>

<template>
  <section class="analytics-page">
    <header class="analytics-header">
      <h1>数据分析</h1>
      <p>用数据驱动决策 · 漏斗分析发现问题 · 失败归因找到根因 · AI 诊断给出策略</p>
    </header>

    <section class="analytics-tabs" :aria-label="activeTabLabel">
      <button
        v-for="tab in tabs"
        :key="tab.key"
        class="analytics-tab"
        :class="{ active: activeTab === tab.key }"
        type="button"
        @click="activeTab = tab.key"
      >
        <el-icon><component :is="tab.icon" /></el-icon>
        <strong>{{ tab.title }}</strong>
        <span>{{ tab.desc }}</span>
      </button>
    </section>

    <section v-if="activeTab === 'funnel'" class="analytics-panel funnel-panel">
      <div class="analytics-section-title">
        <div>
          <h2>投递漏斗分析</h2>
          <p>从投递到 Offer 的完整转化路径 · 平均转化周期 12 天</p>
        </div>
        <div class="chart-legend">
          <span class="current"></span>当前漏斗
          <span class="average"></span>行业平均
        </div>
      </div>

      <section class="analytics-summary-grid">
        <article v-for="metric in funnelMetrics" :key="metric.label" class="analytics-summary-card">
          <el-icon><component :is="metric.icon" /></el-icon>
          <span>{{ metric.label }}</span>
          <strong>{{ metric.value }}</strong>
        </article>
      </section>

      <div class="funnel-steps">
        <article v-for="step in funnelSteps" :key="step.id" class="funnel-step" :class="step.className">
          <div class="funnel-box" :style="{ width: `${step.width}%` }">
            <span class="step-number">{{ step.id }}</span>
            <div>
              <h3>{{ step.title }}</h3>
              <strong>{{ step.count }}</strong>
              <small v-if="step.rate">{{ step.rate }}</small>
            </div>
            <em v-if="step.days">{{ step.days }}</em>
            <b v-else>0</b>
          </div>
          <div class="funnel-bar-row">
            <div class="funnel-current-bar" :style="{ width: `${step.width}%` }"></div>
            <span>{{ step.industry }}</span>
          </div>
          <div v-if="step.id < funnelSteps.length" class="funnel-arrow">↓</div>
        </article>
      </div>
    </section>

    <section v-else-if="activeTab === 'failure'" class="analytics-panel failure-panel">
      <div class="analytics-section-title">
        <div>
          <h2>求职趋势</h2>
          <p>近 6 周投递 / 面试 / Offer 走势</p>
        </div>
      </div>

      <section class="trend-card">
        <div class="trend-chart">
          <div v-for="week in trendWeeks" :key="week.label" class="trend-group">
            <div class="trend-bars">
              <span class="delivery" :style="{ height: barHeight(week.delivery) }"></span>
              <span class="interview" :style="{ height: barHeight(week.interview) }"></span>
              <span class="offer" :style="{ height: barHeight(week.offer) }"></span>
            </div>
            <small>{{ week.label }}</small>
          </div>
        </div>
        <div class="trend-legend">
          <span class="delivery"></span>投递
          <span class="interview"></span>面试
          <span class="offer"></span>Offer
        </div>
      </section>

      <div class="analytics-section-title compact">
        <div>
          <h2>失败归因分析</h2>
          <p>4 次失败案例的深度复盘 · 找到根因才能精准改进</p>
        </div>
      </div>

      <section class="failure-list">
        <article v-for="item in failureCases" :key="`${item.company}-${item.date}`" class="failure-card">
          <span class="failure-icon">×</span>
          <div>
            <h3>{{ item.company }} <small>·</small> {{ item.title }}</h3>
            <p>{{ item.date }} <span>匹配度 {{ item.match }}</span> <span>{{ item.reasons }} 个表层原因</span></p>
          </div>
          <em>{{ item.result }}</em>
          <span class="failure-arrow">⌄</span>
        </article>
      </section>
    </section>

    <section v-else class="analytics-panel ai-panel">
      <section class="ai-diagnosis-hero">
        <div class="score-ring">
          <strong>76</strong>
          <span>综合评分</span>
        </div>
        <div>
          <h2>AI 求职策略诊断</h2>
          <p>基于你的投递数据、面试反馈、资产迭代情况，生成 5 个维度的综合评估</p>
          <div class="ai-badges">
            <span class="good">良好 2 项</span>
            <span class="warning">警告 2 项</span>
            <span class="danger">危险 1 项</span>
          </div>
        </div>
      </section>

      <section class="diagnosis-list">
        <article v-for="(item, index) in diagnosisItems" :key="item.title" class="diagnosis-card" :class="item.level">
          <div class="diagnosis-score">
            <strong>{{ item.score }}</strong>
            <span>/100</span>
          </div>
          <div class="diagnosis-content">
            <h3>{{ index + 1 }}. {{ item.title }} <em>{{ item.level === 'good' ? '良好' : '警告' }}</em></h3>
            <div class="diagnosis-bar">
              <span :style="{ width: `${item.score}%` }"></span>
            </div>
            <p>{{ item.summary }}</p>
            <div class="diagnosis-advice">
              <h4>改进建议</h4>
              <ol>
                <li v-for="suggestion in item.suggestions" :key="suggestion">{{ suggestion }}</li>
              </ol>
            </div>
          </div>
        </article>
      </section>

      <button class="expert-button" type="button">还有复杂问题需要真人专家一对一解答?</button>
    </section>
  </section>
</template>
