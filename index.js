const https = require('https');
const cheerio = require('cheerio');
const cron = require('node-cron');
const config = require('./config/config');
const Analyzer = require('./src/analyzer');

// 封装https请求函数
function fetch(url, options = {}) {
  return new Promise((resolve, reject) => {
    https.get(url, options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        resolve(data);
      });
    }).on('error', (error) => {
      reject(error);
    });
  });
}

// 封装https POST请求函数
function post(url, data) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify(data);
    
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': postData.length
      }
    };
    
    const req = https.request(url, options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          resolve(data);
        }
      });
    });
    
    req.on('error', (error) => {
      reject(error);
    });
    
    req.write(postData);
    req.end();
  });
}

class MiddleEastIntelligence {
  constructor() {
    this.analyzer = new Analyzer();
  }

  async start() {
    console.log('中东局势情报系统启动中...');
    console.log('系统配置:');
    console.log('- 国际新闻源: Al Jazeera, Reuters, BBC');
    console.log('- 国内新闻源: 新华网, 环球网');
    console.log('- NewsAPI: 已配置');
    console.log('- 翻译功能: 已启用 (仅处理英文文档)');
    console.log('- 推送方式: PushPlus');
    console.log('- 运行频率: 智能调度 (6:00-23:59每30分钟一次)');

    // 启动智能调度任务
    this.startSmartScheduler();

    // 立即执行一次
    await this.executeTask();
  }

  startSmartScheduler() {
    // 每30分钟检查一次是否需要执行
    cron.schedule('*/30 * * * *', async () => {
      const now = new Date();
      const hour = now.getHours();
      
      // 6:00-23:59 执行推送
      if (hour >= 6 && hour < 24) {
        await this.executeTask();
      }
    });

    console.log('启动智能调度任务，每30分钟检查一次，仅在6:00-23:59执行推送');
  }

  async executeTask() {
    console.log(`执行情报收集任务: ${new Date().toLocaleString()}`);
    
    try {
      const articles = await this.collectArticles();
      const analysisResult = this.analyzer.analyze(articles);
      
      console.log(`共采集到 ${analysisResult.totalArticles} 篇文章, 其中 ${analysisResult.recentArticles} 篇是2026年4月20日之后的, ${analysisResult.relevantArticles} 篇与中东相关`);
      console.log(`过滤重复后: ${analysisResult.uniqueArticles} 篇`);
      
      if (analysisResult.articles.length > 0) {
        await this.sendPushPlus(analysisResult.summary);
        console.log('推送完成');
      } else {
        console.log('没有找到相关情报');
      }
    } catch (error) {
      console.error('执行任务时出错:', error.message);
    }
  }

  async collectArticles() {
    const articles = [];
    
    // 尝试从NewsAPI获取新闻（优先）
    try {
      const newsApiArticles = await this.fetchFromNewsAPI();
      articles.push(...newsApiArticles);
      console.log(`从NewsAPI获取到 ${newsApiArticles.length} 篇文章`);
    } catch (error) {
      console.error('从NewsAPI获取新闻失败:', error.message);
    }
    
    // 尝试从其他来源获取新闻
    try {
      const webScrapedArticles = await this.fetchFromWebSources();
      articles.push(...webScrapedArticles);
      console.log(`从网页源获取到 ${webScrapedArticles.length} 篇文章`);
    } catch (error) {
      console.error('从网页源获取新闻失败:', error.message);
    }
    
    return articles;
  }

  async fetchFromNewsAPI() {
    const articles = [];
    const keywords = config.keywords.join(' OR ');
    const fromDate = '2026-04-20';
    
    // 中文新闻
    try {
      const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(keywords)}&language=zh&from=${fromDate}&sortBy=publishedAt&apiKey=${config.newsApiKey}`;
      const responseData = await fetch(url);
      const zhResponse = JSON.parse(responseData);
      
      zhResponse.articles.forEach(article => {
        if (article.title && article.description) {
          articles.push({
            title: article.title,
            summary: article.description,
            link: article.url,
            publishDate: article.publishedAt,
            source: `NewsAPI (zh)`,
            language: 'zh'
          });
        }
      });
    } catch (error) {
      console.error('获取中文新闻失败:', error.message);
    }
    
    // 英文新闻
    try {
      const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(keywords)}&language=en&from=${fromDate}&sortBy=publishedAt&apiKey=${config.newsApiKey}`;
      const responseData = await fetch(url);
      const enResponse = JSON.parse(responseData);
      
      enResponse.articles.forEach(article => {
        if (article.title && article.description) {
          articles.push({
            title: article.title,
            summary: article.description,
            link: article.url,
            publishDate: article.publishedAt,
            source: `NewsAPI (en)`,
            language: 'en'
          });
        }
      });
    } catch (error) {
      console.error('获取英文新闻失败:', error.message);
    }
    
    return articles;
  }

  async fetchFromWebSources() {
    const articles = [];
    
    // 尝试从Al Jazeera获取新闻
    try {
      const alJazeeraArticles = await this.scrapeAlJazeera();
      articles.push(...alJazeeraArticles);
    } catch (error) {
      console.error('Error scraping Al Jazeera:', error.message);
    }
    
    // 尝试从Reuters获取新闻
    try {
      const reutersArticles = await this.scrapeReuters();
      articles.push(...reutersArticles);
    } catch (error) {
      console.error('Error scraping Reuters Middle East:', error.message);
    }
    
    // 尝试从BBC获取新闻
    try {
      const bbcArticles = await this.scrapeBBC();
      articles.push(...bbcArticles);
    } catch (error) {
      console.error('Error scraping BBC Middle East:', error.message);
    }
    
    // 尝试从新华网获取新闻
    try {
      const xinhuaArticles = await this.scrapeXinhua();
      articles.push(...xinhuaArticles);
    } catch (error) {
      console.error('Error scraping Xinhua:', error.message);
    }
    
    // 尝试从环球网获取新闻
    try {
      const huanqiuArticles = await this.scrapeHuanQiu();
      articles.push(...huanqiuArticles);
    } catch (error) {
      console.error('Error scraping HuanQiu:', error.message);
    }
    
    return articles;
  }

  async scrapeAlJazeera() {
    const url = 'https://www.aljazeera.com/news/middleeast/';
    const responseData = await fetch(url);
    const $ = cheerio.load(responseData);
    const articles = [];
    
    $('article').each((index, element) => {
      const title = $(element).find('h3').text().trim();
      const link = $(element).find('a').attr('href');
      const summary = $(element).find('p').text().trim();
      
      if (title && link) {
        articles.push({
          title,
          summary,
          link: link.startsWith('http') ? link : `https://www.aljazeera.com${link}`,
          publishDate: new Date().toISOString(),
          source: 'Al Jazeera',
          language: 'en'
        });
      }
    });
    
    return articles;
  }

  async scrapeReuters() {
    const url = 'https://www.reuters.com/world/middle-east/';
    const responseData = await fetch(url);
    const $ = cheerio.load(responseData);
    const articles = [];
    
    $('article').each((index, element) => {
      const title = $(element).find('h3').text().trim();
      const link = $(element).find('a').attr('href');
      const summary = $(element).find('p').text().trim();
      
      if (title && link) {
        articles.push({
          title,
          summary,
          link: link.startsWith('http') ? link : `https://www.reuters.com${link}`,
          publishDate: new Date().toISOString(),
          source: 'Reuters Middle East',
          language: 'en'
        });
      }
    });
    
    return articles;
  }

  async scrapeBBC() {
    const url = 'https://www.bbc.com/news/world/middle_east';
    const responseData = await fetch(url);
    const $ = cheerio.load(responseData);
    const articles = [];
    
    $('article').each((index, element) => {
      const title = $(element).find('h3').text().trim();
      const link = $(element).find('a').attr('href');
      const summary = $(element).find('p').text().trim();
      
      if (title && link) {
        articles.push({
          title,
          summary,
          link: link.startsWith('http') ? link : `https://www.bbc.com${link}`,
          publishDate: new Date().toISOString(),
          source: 'BBC Middle East',
          language: 'en'
        });
      }
    });
    
    return articles;
  }

  async scrapeXinhua() {
    const url = 'http://www.xinhuanet.com/world/middleeast.htm';
    const responseData = await fetch(url);
    const $ = cheerio.load(responseData);
    const articles = [];
    
    $('a').each((index, element) => {
      const title = $(element).text().trim();
      const link = $(element).attr('href');
      
      if (title && link && link.includes('xinhuanet.com') && title.length > 10) {
        articles.push({
          title,
          summary: title,
          link,
          publishDate: new Date().toISOString(),
          source: '新华网',
          language: 'zh'
        });
      }
    });
    
    return articles;
  }

  async scrapeHuanQiu() {
    const url = 'https://world.huanqiu.com/area/middleeast';
    const responseData = await fetch(url);
    const $ = cheerio.load(responseData);
    const articles = [];
    
    $('a').each((index, element) => {
      const title = $(element).text().trim();
      const link = $(element).attr('href');
      
      if (title && link && link.includes('huanqiu.com') && title.length > 10) {
        articles.push({
          title,
          summary: title,
          link,
          publishDate: new Date().toISOString(),
          source: '环球网',
          language: 'zh'
        });
      }
    });
    
    return articles;
  }

  async sendPushPlus(content) {
    try {
      const response = await post('http://www.pushplus.plus/send', {
        token: config.pushPlusToken,
        title: '中东局势情报摘要',
        content: content.replace(/\n/g, '<br>'),
        template: 'html'
      });
      
      if (response.code === 200) {
        console.log('PushPlus推送成功');
      } else {
        console.error('PushPlus推送失败:', response.msg);
      }
    } catch (error) {
      console.error('发送PushPlus通知失败:', error.message);
    }
  }
}

// 启动系统
const intelligenceSystem = new MiddleEastIntelligence();
intelligenceSystem.start();
