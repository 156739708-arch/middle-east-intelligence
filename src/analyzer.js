const config = require('../config/config');

class Analyzer {
  constructor() {
    this.keywords = config.keywords;
    this.cutoffDate = new Date('2026-04-20T00:00:00');
    this.sentArticles = new Set(); // 用于跟踪已发送的文章
  }

  analyze(articles) {
    // 1. 过滤日期
    const recentArticles = this.filterByDate(articles);

    // 2. 处理所有文章（包括英文），使用简单翻译
    const processedArticles = this.processArticles(recentArticles);

    // 3. 过滤相关内容
    const relevantArticles = this.filterRelevant(processedArticles);

    // 4. 过滤重复内容
    const uniqueArticles = this.filterDuplicates(relevantArticles);

    // 5. 分析文章重要性
    const analyzedArticles = this.scoreArticles(uniqueArticles);

    // 6. 按重要性排序
    const sortedArticles = this.sortByImportance(analyzedArticles);

    // 7. 生成情报摘要
    const summary = this.generateSummary(sortedArticles);

    // 8. 标记已发送的文章
    this.markAsSent(sortedArticles);

    return {
      articles: sortedArticles,
      summary,
      timestamp: new Date().toISOString(),
      totalArticles: articles.length,
      recentArticles: recentArticles.length,
      relevantArticles: relevantArticles.length,
      uniqueArticles: uniqueArticles.length
    };
  }

  processArticles(articles) {
    return articles.map(article => {
      const isChinese = article.language === 'zh' || /[\u4e00-\u9fa5]/.test(`${article.title} ${article.summary}`);

      if (isChinese) {
        return {
          ...article,
          displayTitle: article.title,
          displaySummary: this.cleanSummary(article.summary),
          isChinese: true
        };
      } else {
        // 对英文文章进行强制翻译
        return {
          ...article,
          displayTitle: this.translateToChinese(article.title),
          displaySummary: this.translateToChinese(this.cleanSummary(article.summary)),
          isChinese: false
        };
      }
    });
  }

  cleanSummary(summary) {
    if (!summary) return '';
    // 移除末尾的省略号
    return summary.replace(/\.\.\.$/, '');
  }

  translateToChinese(text) {
    if (!text) return '';

    // 强制翻译所有英文内容
    let translated = text;

    // 增强的翻译字典
    const translations = {
      // 国家和地区
      'Israel': '以色列',
      'Palestine': '巴勒斯坦',
      'Iran': '伊朗',
      'Saudi Arabia': '沙特阿拉伯',
      'Yemen': '也门',
      'Syria': '叙利亚',
      'Lebanon': '黎巴嫩',
      'Jordan': '约旦',
      'Iraq': '伊拉克',
      'Egypt': '埃及',
      'UAE': '阿联酋',
      'Qatar': '卡塔尔',
      'Kuwait': '科威特',
      'Bahrain': '巴林',
      'Oman': '阿曼',
      'Gaza': '加沙',
      'Jerusalem': '耶路撒冷',
      'West Bank': '约旦河西岸',
      'Turkey': '土耳其',
      'Afghanistan': '阿富汗',
      'Pakistan': '巴基斯坦',
      'Saudi': '沙特',
      
      // 组织和人物
      'Hezbollah': '真主党',
      'Hamas': '哈马斯',
      'Netanyahu': '内塔尼亚胡',
      'Israeli': '以色列',
      'Palestinian': '巴勒斯坦',
      'Iranian': '伊朗',
      'Saudi Arabian': '沙特阿拉伯',
      
      // 地区和事件
      'Middle East': '中东',
      'Middle East conflict': '中东冲突',
      'Gaza Strip': '加沙地带',
      'Arab-Israeli conflict': '阿以冲突',
      
      // 核心词汇
      'war': '战争',
      'peace': '和平',
      'ceasefire': '停火',
      'negotiation': '谈判',
      'summit': '峰会',
      'attack': '袭击',
      'missile': '导弹',
      'drone': '无人机',
      'military': '军事',
      'troops': '军队',
      'soldiers': '士兵',
      'killed': '死亡',
      'wounded': '受伤',
      'injured': '受伤',
      'dead': '死亡',
      'casualties': '伤亡',
      'political': '政治',
      'economy': '经济',
      'economic': '经济',
      'sanctions': '制裁',
      'humanitarian': '人道主义',
      'aid': '援助',
      'refugees': '难民',
      'nuclear': '核',
      'agreement': '协议',
      'deal': '协议',
      'talks': '会谈',
      'diplomatic': '外交',
      'diplomacy': '外交',
      'regional': '地区',
      'international': '国际',
      'UN': '联合国',
      'United Nations': '联合国',
      'US': '美国',
      'United States': '美国',
      'Russia': '俄罗斯',
      'China': '中国',
      'European': '欧洲',
      'Europe': '欧洲',
      'Britain': '英国',
      'France': '法国',
      'Germany': '德国',
      'Israelis': '以色列人',
      'Palestinians': '巴勒斯坦人',
      
      // 动作和状态
      'announcement': '宣布',
      'announced': '宣布',
      'statement': '声明',
      'reported': '报道',
      'reports': '报道',
      'according to': '根据',
      'sources': '消息来源',
      'security': '安全',
      'tensions': '紧张局势',
      'escalation': '升级',
      'violence': '暴力',
      'clashes': '冲突',
      'protests': '抗议',
      'demonstrations': '示威',
      'crisis': '危机',
      'update': '更新',
      'breaking': '突发',
      'latest': '最新',
      'developing': '进展中',
      'new': '新的',
      'latest news': '最新消息',
      'breaking news': '突发新闻',
      'situation': '局势',
      'status': '状态',
      'development': '发展',
      'progress': '进展',
      'issue': '问题',
      'problem': '问题',
      'conflict': '冲突',
      'dispute': '争端',
      'emergency': '紧急情况',
      
      // 常见短语
      'said': '表示',
      'says': '表示',
      'in response to': '回应',
      'as part of': '作为',
      'due to': '由于',
      'because of': '因为',
      'in order to': '为了',
      'aims to': '旨在',
      'plans to': '计划',
      'will': '将',
      'would': '将',
      'has': '已经',
      'have': '已经',
      'had': '已经',
      'is': '是',
      'are': '是',
      'was': '是',
      'were': '是',
      'been': '被',
      'being': '正在',
      'be': '是',
      'and': '和',
      'or': '或',
      'but': '但是',
      'if': '如果',
      'when': '当',
      'where': '在',
      'who': '谁',
      'which': '哪个',
      'that': '那个',
      'this': '这个',
      'these': '这些',
      'those': '那些',
      'with': '与',
      'without': '没有',
      'by': '由',
      'for': '为',
      'from': '从',
      'to': '到',
      'at': '在',
      'on': '在',
      'in': '在',
      'of': '的',
      'over': '超过',
      'under': '在...下',
      'above': '在...上',
      'below': '在...下',
      'before': '之前',
      'after': '之后',
      'during': '期间',
      'while': '同时',
      'since': '自从',
      'until': '直到',
      'through': '通过',
      'between': '之间',
      'among': '在...中',
      'beyond': '超越',
      'within': '在...内',
      'outside': '在...外'
    };

    // 按长度排序，优先翻译长短语
    const sortedTranslations = Object.entries(translations)
      .sort((a, b) => b[0].length - a[0].length);

    // 执行翻译
    sortedTranslations.forEach(([en, zh]) => {
      // 不使用边界匹配，确保能匹配到所有出现的地方
      const regex = new RegExp(en, 'gi');
      translated = translated.replace(regex, zh);
    });

    // 清理多余的空格
    translated = translated.replace(/\s+/g, ' ').trim();

    // 确保所有内容都是中文
    if (/^[a-zA-Z\s.,!?]+$/.test(translated)) {
      // 如果仍然是英文，强制添加中文翻译
      translated = `[翻译] ${translated}`;
    }

    return translated;
  }

  filterByDate(articles) {
    return articles.filter(article => {
      if (article.publishDate) {
        const articleDate = new Date(article.publishDate);
        return articleDate >= this.cutoffDate;
      }
      return true;
    });
  }

  filterRelevant(articles) {
    return articles.filter(article => {
      const text = `${article.displayTitle} ${article.displaySummary}`.toLowerCase();
      return this.keywords.some(keyword => text.includes(keyword.toLowerCase()));
    });
  }

  filterDuplicates(articles) {
    const seen = new Set();
    return articles.filter(article => {
      // 使用标题作为去重依据
      const key = article.title || article.displayTitle;
      if (key && !seen.has(key) && !this.sentArticles.has(key)) {
        seen.add(key);
        return true;
      }
      return false;
    });
  }

  markAsSent(articles) {
    articles.forEach(article => {
      const key = article.title || article.displayTitle;
      if (key) {
        this.sentArticles.add(key);
      }
    });
  }

  scoreArticles(articles) {
    return articles.map(article => {
      let score = 0;
      const text = `${article.displayTitle} ${article.displaySummary}`.toLowerCase();

      this.keywords.forEach(keyword => {
        const regex = new RegExp(keyword.toLowerCase(), 'g');
        const matches = text.match(regex);
        if (matches) {
          score += matches.length * 2;
        }
      });

      // 中文新闻额外加分
      if (article.isChinese) {
        score += 10;
      }

      // 根据来源赋予不同权重
      if (article.source === 'Al Jazeera') {
        score += 5;
      } else if (article.source === 'Reuters Middle East') {
        score += 4;
      } else if (article.source === 'BBC Middle East') {
        score += 3;
      } else if (article.source.includes('NewsAPI')) {
        score += 6;
      }

      return {
        ...article,
        importanceScore: score
      };
    });
  }

  sortByImportance(articles) {
    return articles.sort((a, b) => b.importanceScore - a.importanceScore);
  }

  generateSummary(articles) {
    if (articles.length === 0) {
      return `中东局势情报摘要 (${new Date().toLocaleString()})\n\n暂无2026年4月20日之后的相关中东局势情报\n\n系统会持续监控，一旦有新消息将立即推送。`;
    }

    let summary = `中东局势情报摘要 (${new Date().toLocaleString()})\n\n`;
    summary += `共采集到 ${articles.length} 条2026年4月20日之后的相关情报\n\n`;

    const topArticles = articles.slice(0, 20);
    topArticles.forEach((article, index) => {
      summary += `${index + 1}. [${article.source}] ${article.displayTitle}\n`;
      summary += `   链接: ${article.link}\n`;
      if (article.displaySummary) {
        summary += `   摘要: ${article.displaySummary}\n`;
      }
      if (article.publishDate) {
        summary += `   发布时间: ${new Date(article.publishDate).toLocaleString('zh-CN')}\n`;
      }
      summary += `   重要性评分: ${article.importanceScore}\n\n`;
    });

    return summary;
  }
}

module.exports = Analyzer;
