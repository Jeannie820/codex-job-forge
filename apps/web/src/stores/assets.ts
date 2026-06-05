import { defineStore } from 'pinia';

export type AssetType = 'resume' | 'story' | 'portfolio' | 'question' | 'ai';

export interface AssetItem {
  id: number;
  title: string;
  type: AssetType;
  version?: string;
  tags: string[];
  usage: number;
  updatedAt: string;
  createdAt: string;
  content?: string;
}

export interface NewAssetInput {
  title: string;
  type: AssetType;
  tags: string[];
  content: string;
}

export const assetTypeLabels: Record<AssetType, string> = {
  resume: '简历',
  story: '项目故事',
  portfolio: '作品集',
  question: '面试题库',
  ai: 'AI相关'
};

const initialAssets: AssetItem[] = [
  {
    id: 1,
    title: '前端面试高频题集',
    type: 'question',
    version: 'v5',
    tags: ['面试', 'React', '基础', '+2'],
    usage: 12,
    updatedAt: '2026-05-16',
    createdAt: '2026-04-18',
    content:
      '## React 基础\n\n### 1. Hooks 为什么不能写在条件语句里\n**思路**：Hooks 依赖调用顺序建立状态索引，条件调用会导致顺序错位。\n\n### 2. React.memo 的使用场景\n**思路**：适合 props 稳定、渲染成本较高的组件，避免无意义重渲染。\n\n### 3. useMemo 和 useCallback 的区别\n**思路**：useMemo 缓存计算结果，useCallback 缓存函数引用。'
  },
  {
    id: 2,
    title: '微前端架构改造项目',
    type: 'story',
    version: 'v2',
    tags: ['架构', '微前端', '性能优化', '+1'],
    usage: 11,
    updatedAt: '2026-06-05',
    createdAt: '2026-04-30',
    content:
      '## 项目背景\n\n公司多个业务线独立迭代，前端仓库、权限、发布链路分散，跨团队协作成本较高。\n\n## 方案\n\n基于主应用 + 子应用拆分运行时边界，统一登录态、路由协议和构建发布规范。\n\n## 成果\n\n页面首屏加载时间降低 28%，跨业务复用组件沉淀 16 个，发布回滚时间缩短到 5 分钟内。'
  },
  {
    id: 3,
    title: '技术岗通用简历 v3.0',
    type: 'resume',
    version: 'v3',
    tags: ['前端', 'React', '架构', '+1'],
    usage: 8,
    updatedAt: '2026-05-15',
    createdAt: '2026-04-22',
    content:
      '## 个人优势\n\n8 年前端开发经验，长期负责复杂中后台、性能优化和工程化体系建设。\n\n## 核心经历\n\n- 主导组件库与设计系统落地，支撑 6 条业务线统一体验\n- 推动构建链路升级，平均构建耗时下降 42%\n- 负责大规模表格、权限、流程编排等复杂交互模块'
  },
  {
    id: 4,
    title: '算法面试高频题集',
    type: 'question',
    version: 'v3',
    tags: ['算法', 'LeetCode', '面试'],
    usage: 6,
    updatedAt: '2026-05-14',
    createdAt: '2026-04-20',
    content:
      '## 数组与字符串\n\n### 1. 两数之和（Two Sum）\n**题目**：给定数组和目标和，找出和为目标值的两个数下标\n**思路**：哈希表，遍历一次，O(n) 时间\n**代码**：```\nfunction twoSum(nums, target) {\n  const map = new Map();\n  for (let i = 0; i < nums.length; i++) {\n    const complement = target - nums[i];\n    if (map.has(complement)) return [map.get(complement), i];\n    map.set(nums[i], i);\n  }\n}\n```\n\n## 链表\n\n### 2. 反转链表\n**思路**：三指针迭代\n**代码**：```\nfunction reverseList(head) {\n  let prev = null, curr = head;\n  while (curr) {\n    const next = curr.next;\n    curr.next = prev;\n    prev = curr;\n    curr = next;\n  }\n  return prev;\n}\n```'
  },
  {
    id: 5,
    title: '全栈方向简历 v2.0',
    type: 'resume',
    version: 'v2',
    tags: ['全栈', 'Node.js', '后端'],
    usage: 4,
    updatedAt: '2026-05-11',
    createdAt: '2026-04-25',
    content:
      '## 定位\n\n面向全栈工程师岗位，突出 Node.js、前端架构、接口治理和业务交付能力。\n\n## 项目表达\n\n强调从需求拆解、技术方案、服务端接口、前端体验到上线复盘的完整闭环。'
  },
  {
    id: 6,
    title: '大厂求职自荐信模板',
    type: 'portfolio',
    tags: ['求职信', '模板', '字节跳动'],
    usage: 3,
    updatedAt: '2026-05-08',
    createdAt: '2026-04-28',
    content:
      '您好，我关注到贵团队正在招聘前端方向岗位。我的经历主要集中在复杂业务系统、工程化提效和跨团队协作，和岗位要求中的性能优化、架构治理、业务交付比较匹配。\n\n期待有机会进一步沟通。'
  },
  {
    id: 7,
    title: '移动端跨端方案落地',
    type: 'story',
    tags: ['移动端', 'React Native', '跨端'],
    usage: 3,
    updatedAt: '2026-05-10',
    createdAt: '2026-04-26',
    content:
      '## 背景\n\n业务需要同时覆盖 iOS、Android 与 H5，原生与 Web 团队重复开发严重。\n\n## 方案\n\n基于 React Native 建立核心业务模块，统一状态管理、埋点协议和灰度发布能力。\n\n## 结果\n\n双端需求交付周期缩短 35%，核心页面崩溃率下降 18%。'
  },
  {
    id: 8,
    title: '阿里云求职自荐信',
    type: 'portfolio',
    tags: ['求职信', '阿里云', '全栈'],
    usage: 2,
    updatedAt: '2026-05-11',
    createdAt: '2026-04-29',
    content:
      '您好，我对云产品与开发者工具方向非常感兴趣。过去我在前后端协同、性能优化、权限系统和工程治理上积累较多，希望把这些经验用于提升云产品的开发者体验。'
  }
];

export const useAssetsStore = defineStore('assets', {
  state: () => ({
    assets: initialAssets
  }),
  actions: {
    addAsset(input: NewAssetInput) {
      const today = new Date().toISOString().slice(0, 10);
      this.assets.unshift({
        id: Date.now(),
        usage: 0,
        updatedAt: today,
        createdAt: today,
        ...input
      });
    }
  }
});
