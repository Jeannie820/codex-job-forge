import { defineStore } from 'pinia';

export type JobStatus = 'saved' | 'applied' | 'interviewing' | 'offer' | 'rejected' | 'archived';

export interface Job {
  id: number;
  title: string;
  company: string;
  location: string;
  salary: string;
  source: string;
  status: JobStatus;
  match: number;
  requirements: string[];
  description: string;
  note: string;
  appliedAt: string;
}

export interface NewJobInput {
  title: string;
  company: string;
  location: string;
  salary: string;
  source: string;
  status: JobStatus;
  match: number;
  requirements: string[];
  description: string;
  note: string;
}

export const useJobsStore = defineStore('jobs', {
  state: () => ({
    jobs: [
      {
        id: 1,
        title: '高级前端工程师',
        company: '字节跳动',
        location: '北京·海淀',
        salary: '35-55K·15薪',
        source: 'BOSS直聘',
        status: 'interviewing',
        match: 88,
        requirements: ['5年以上前端经验', '精通React/Vue', '有大型项目架构经验', '+1'],
        description: '二面已通过，等待三面安排',
        note: '',
        appliedAt: '2026-05-12'
      },
      {
        id: 2,
        title: '高级产品经理',
        company: '小红书',
        location: '上海·黄浦',
        salary: '35-50K·14薪',
        source: '脉脉',
        status: 'offer',
        match: 85,
        requirements: ['5年以上产品经验', '有内容/社区产品经验', '数据驱动决策', '+1'],
        description: '已收到Offer，薪资谈判中',
        note: '',
        appliedAt: '2026-05-01'
      },
      {
        id: 3,
        title: '全栈开发工程师',
        company: '阿里云',
        location: '杭州·余杭',
        salary: '30-50K·16薪',
        source: '内推',
        status: 'applied',
        match: 82,
        requirements: ['3年以上全栈经验', '熟悉Node.js和React', '了解云原生技术', '+1'],
        description: '简历已投递，等待反馈',
        note: '',
        appliedAt: '2026-05-11'
      },
      {
        id: 4,
        title: 'React Native工程师',
        company: '滴滴出行',
        location: '北京·昌平',
        salary: '28-45K·15薪',
        source: 'BOSS直聘',
        status: 'interviewing',
        match: 80,
        requirements: ['3年以上移动端经验', '精通React Native', '有性能优化经验', '+1'],
        description: '一面完成，面试官反馈技术扎实',
        note: '',
        appliedAt: '2026-05-10'
      },
      {
        id: 5,
        title: '前端架构师',
        company: '腾讯',
        location: '深圳·南山',
        salary: '40-65K·16薪',
        source: '官网',
        status: 'rejected',
        match: 79,
        requirements: ['6年以上前端经验', '有架构设计经验', '精通工程化工具', '+1'],
        description: '简历筛选未通过，分析原因：项目描述不够突出',
        note: '',
        appliedAt: '2026-05-07'
      },
      {
        id: 6,
        title: '技术负责人',
        company: '美团',
        location: '北京·朝阳',
        salary: '50-80K·15薪',
        source: '猎聘',
        status: 'saved',
        match: 75,
        requirements: ['8年以上技术经验', '3年以上团队管理经验', '精通分布式系统', '+1'],
        description: '岗位很匹配，准备优化简历再投递',
        note: '',
        appliedAt: '2026-05-06'
      }
    ] as Job[]
  }),
  getters: {
    total: (state) => state.jobs.length,
    savedCount: (state) => state.jobs.filter((job) => job.status === 'saved').length,
    appliedCount: (state) => state.jobs.filter((job) => job.status === 'applied').length,
    interviewingCount: (state) => state.jobs.filter((job) => job.status === 'interviewing').length,
    offerCount: (state) => state.jobs.filter((job) => job.status === 'offer').length,
    rejectedCount: (state) => state.jobs.filter((job) => job.status === 'rejected').length
  },
  actions: {
    addJob(input: NewJobInput) {
      const id = Date.now();
      this.jobs.unshift({
        id,
        ...input,
        appliedAt: new Date().toISOString().slice(0, 10)
      });
      return id;
    },
    updateJobStatus(id: number, status: JobStatus) {
      const job = this.jobs.find((item) => item.id === id);
      if (job) {
        job.status = status;
      }
    }
  }
});
