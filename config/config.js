module.exports = {
  // PushPlus配置
  pushplus: {
    token: process.env.PUSHPLUS_TOKEN || '1ae8603093e64da0836cab82ef57783d'
  },

  // NewsAPI配置
  newsapi: {
    apiKey: process.env.NEWSAPI_KEY || 'b115efb222574a589d539260c4965ddf'
  },

  // 定时任务配置
  cron: {
    schedule: '*/30 6-23 * * *'
  },

  // 数据采集配置
  sources: [
    {
      name: 'Al Jazeera',
      url: 'https://www.aljazeera.com/tag/middle-east/',
      selector: '.article-list .article-card'
    },
    {
      name: 'Reuters Middle East',
      url: 'https://www.reuters.com/world/middle-east/',
      selector: '.story-content'
    },
    {
      name: 'BBC Middle East',
      url: 'https://www.bbc.com/news/world/middle_east',
      selector: '.gs-c-promo'
    }
  ],

  // 关键词配置 - 增强版，确保聚焦中东局势
  keywords: [
    // 中东地区地理实体
    '中东', '以色列', '巴勒斯坦', '伊朗', '沙特阿拉伯', '也门', '叙利亚', '黎巴嫩', '约旦', '伊拉克', '埃及', '阿联酋', '卡塔尔', '科威特', '巴林', '阿曼', '加沙', '耶路撒冷', '约旦河西岸',
    // 中东相关组织和人物
    '真主党', '哈马斯', '内塔尼亚胡',
    // 核心词汇
    '冲突', '战争', '和平', '谈判', '袭击', '导弹', '军队', '政治', '经济', '人道主义',
    // 英文关键词
    'Middle East', 'Israel', 'Palestine', 'Iran', 'Saudi Arabia', 'Yemen', 'Syria', 'Lebanon', 'Jordan', 'Iraq', 'Egypt', 'UAE', 'Qatar', 'Kuwait', 'Bahrain', 'Oman', 'Gaza', 'Jerusalem', 'West Bank',
    'Hezbollah', 'Hamas', 'Netanyahu',
    'conflict', 'war', 'peace', 'negotiation', 'attack', 'missile', 'military', 'political', 'economy', 'humanitarian'
  ]
};
