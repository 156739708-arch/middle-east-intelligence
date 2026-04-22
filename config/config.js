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
  // 关键词配置
  keywords: [
    '冲突', '战争', '和平', '谈判', '袭击', '导弹', '军队', '政治', '经济', '人道主义',
    'conflict', 'war', 'peace', 'negotiation', 'attack', 'missile', 'military', 'political', 'economy', 'humanitarian'
  ]
};
