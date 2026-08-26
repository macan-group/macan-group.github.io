'use client';

import React, { useState, useEffect, useMemo } from 'react';

// --- TYPES & INTERFACES ---
type Language = 'en' | 'ar' | 'zh';
type PageView = 'index' | 'capital' | 'industrial' | 'trade';

interface ContentDictionary {
  dir: 'ltr' | 'rtl';
  nav: {
    brand: string;
    subBrand: string;
    index: string;
    capital: string;
    industrial: string;
    trade: string;
    ctaConsult: string;
  };
  ticker: {
    status: string;
    muscat: string;
    duqm: string;
    transit: string;
    ownership: string;
  };
  hero: {
    badge: string;
    titleMain: string;
    titleHighlight: string;
    subhead: string;
    ctaPrimary: string;
    ctaSecondary: string;
    crBadge: string;
  };
  pillars: {
    title: string;
    subtitle: string;
    capital: { tag: string; title: string; desc: string; b1: string; b2: string; b3: string; cta: string };
    industrial: { tag: string; title: string; desc: string; b1: string; b2: string; b3: string; cta: string };
    trade: { tag: string; title: string; desc: string; b1: string; b2: string; b3: string; cta: string };
  };
  advantages: {
    title: string;
    sub: string;
    item1Title: string; item1Desc: string;
    item2Title: string; item2Desc: string;
    item3Title: string; item3Desc: string;
  };
  corridor: {
    title: string;
    sub: string;
    nodes: Record<string, { title: string; desc: string; role: string }>;
  };
  capitalPage: {
    heroTitle: string;
    heroSub: string;
    service1Title: string; service1Desc: string;
    service2Title: string; service2Desc: string;
    service3Title: string; service3Desc: string;
    spotlightTitle: string;
    spotlightProject: string;
    spotlightSector: string;
    spotlightStatus: string;
    ctaProspectus: string;
  };
  industrialPage: {
    heroTitle: string;
    heroSub: string;
    cap1Title: string; cap1Desc: string;
    cap2Title: string; cap2Desc: string;
    cap3Title: string; cap3Desc: string;
    cap4Title: string; cap4Desc: string;
    formTitle: string;
    formProjectLabel: string;
    formLandLabel: string;
    formFreezoneLabel: string;
    formUploadBtn: string;
    formSubmitBtn: string;
  };
  tradePage: {
    heroTitle: string;
    heroSub: string;
    routeTitle: string;
    transitTimeLabel: string;
    originsLabel: string;
    destsLabel: string;
    modesLabel: string;
    calcTitle: string;
    calcContainerType: string;
    calcWeight: string;
    calcEstimateBtn: string;
    calcResultLabel: string;
  };
  calculator: {
    title: string;
    sub: string;
    typeLabel: string;
    typeOptions: { capital: string; industrial: string; logistics: string };
    locationLabel: string;
    metricLabel: string;
    calculateBtn: string;
    estTransit: string;
    estTax: string;
    estSupport: string;
  };
  footer: {
    hq: string;
    cr: string;
    rights: string;
    domainsTitle: string;
  };
}

const DICTIONARY_EN: ContentDictionary = {
  dir: 'ltr',
  nav: {
    brand: 'MACAN GROUP',
    subBrand: 'Muscat • Oman • GCC Corridor',
    index: 'Home Overview',
    capital: 'Macan Capital',
    industrial: 'Macan Industrial',
    trade: 'Trade Logistics',
    ctaConsult: 'Contact Advisory',
  },
  ticker: {
    status: 'Corridor Live:',
    muscat: 'Muscat HQ Port: ACTIVE',
    duqm: 'Duqm Freezone Hub: OPTIMIZED',
    transit: 'Ningbo-Salalah Transit: 14 Days Direct',
    ownership: 'Foreign Investor Equity: 100% Guaranteed',
  },
  hero: {
    badge: 'GCC-China Strategic Trade & Industrial Corridor',
    titleMain: 'Macan Group',
    titleHighlight: 'Built on Trust, Driven by Global Capital',
    subhead: 'Headquartered in Muscat, Macan bridges Middle Eastern investment, turnkey industrial plant setups, and cross-border logistics across the Sultanate of Oman.',
    ctaPrimary: 'Explore Investment Opportunities',
    ctaSecondary: 'Request Freight Quote',
    crBadge: 'Registered Sovereign Partner • Muscat HQ',
  },
  pillars: {
    title: 'Triple-Pillar Enterprise Architecture',
    subtitle: 'Unlocking bilateral economic synergy across capital, engineering infrastructure, and trade.',
    capital: {
      tag: 'PILLAR I',
      title: 'Macan Capital & Investment Hub',
      desc: 'Facilitating sovereign-grade FDI, cross-border joint ventures, and structured trade finance between Chinese industrial leaders and GCC sovereign wealth.',
      b1: 'Cross-Border Joint Venture Structuring',
      b2: 'Oman Sovereign Investment Tax Incentives',
      b3: 'Industrial Real Estate & Port Equity',
      cta: 'Capital Advisory Portal →',
    },
    industrial: {
      tag: 'PILLAR II',
      title: 'Macan Industrial Setup & Engineering',
      desc: 'Delivering end-to-end turnkey manufacturing plant commissioning, free zone land acquisition, and heavy machinery procurement in Sohar & Duqm.',
      b1: 'Ministry & Freezone Authority Licensing',
      b2: 'EPC Plant Construction & Structural Works',
      b3: 'Heavy Machinery Import & Commissioning',
      cta: 'Engineering Setup Portal →',
    },
    trade: {
      tag: 'PILLAR III',
      title: 'Macan Trade & Logistics Corridor',
      desc: 'Managing direct multimodal sea freight corridors connecting major East Asian industrial ports directly to Oman non-Hormuz deepwater terminals.',
      b1: 'Direct Ningbo / Shenzhen to Sohar Maritime',
      b2: 'FCL & LCL Heavy Project Breakbulk Cargo',
      b3: 'Door-to-Door GCC / CIS Customs Clearance',
      cta: 'Logistics Corridor Portal →',
    },
  },
  advantages: {
    title: 'Strategic Geopolitical Advantage of Oman',
    sub: 'Positioned outside the Strait of Hormuz, offering direct maritime access to global trade lanes.',
    item1Title: '0% Port Tax & Custom Incentives',
    item1Desc: 'Zero import tariff barriers for raw materials and re-export equipment within strategic economic zones.',
    item2Title: '100% Foreign Direct Ownership',
    item2Desc: 'Full investor control with regulatory protection under Oman Ministry of Commerce and Investment Promotion.',
    item3Title: 'Direct Deep-Water Sea Routes',
    item3Desc: 'Avoid maritime bottleneck congestion with direct transit lines to East Africa, India, and East Asia.',
  },
  corridor: {
    title: 'GCC-China Corridor Logistics Matrix',
    sub: 'Interactive network mapping key manufacturing hubs in China to Oman economic free zones.',
    nodes: {
      muscat: { title: 'Muscat HQ', desc: 'Sovereign financial gateway & executive governance center.', role: 'Capital Hub' },
      sohar: { title: 'Sohar Port & Freezone', desc: 'Heavy industrial manufacturing hub with direct GCC road link.', role: 'Industrial Zone' },
      duqm: { title: 'Duqm Special Economic Zone', desc: 'Deepwater maritime hub & heavy industrial fabrication center.', role: 'SEZ Maritime' },
      ningbo: { title: 'Ningbo-Zhoushan Port', desc: 'Primary East China cargo origin for heavy equipment & steel.', role: 'Export Gateway' },
      shenzhen: { title: 'Shenzhen Tech Hub', desc: 'Advanced electronic equipment & renewable machinery export hub.', role: 'Tech Export' },
    },
  },
  capitalPage: {
    heroTitle: 'Macan Capital & FDI Advisory',
    heroSub: 'Strategic capital allocation and high-yield venture structuring across the GCC-China economic corridor.',
    service1Title: '01. Joint Venture Structuring',
    service1Desc: 'Drafting compliant cross-border JVs between GCC institutional capital and Chinese manufacturing giants.',
    service2Title: '02. Sovereign Incentives Access',
    service2Desc: 'Unlocking 0% corporate tax holidays, subsidized energy tariffs, and full equity repatriation rights.',
    service3Title: '03. Financial & Escrow Advisory',
    service3Desc: 'Multi-currency trade finance, banking setup, and sovereign guarantee facilitation in Muscat.',
    spotlightTitle: 'FEATURED INVESTMENT OPPORTUNITY',
    spotlightProject: 'Duqm Heavy Fabrication & Assembly Hub',
    spotlightSector: 'Steel Fabrication, Modular Processing & Green Hydrogen Machinery',
    spotlightStatus: 'Feasibility Approved • 150,000 Sq. Meters Land Allocated',
    ctaProspectus: 'Download Investment Prospectus (PDF)',
  },
  industrialPage: {
    heroTitle: 'Turnkey Plant Setup & Engineering',
    heroSub: 'End-to-end industrial plant commissioning, civil engineering works, and machinery procurement in Oman Free Zones.',
    cap1Title: 'Industrial Licensing & Permits',
    cap1Desc: 'Full processing of Ministry of Commerce and Free Zone Authority operational licenses.',
    cap2Title: 'EPC Plant Construction',
    cap2Desc: 'Turnkey civil foundation works, heavy structural steel erection, and utility connections.',
    cap3Title: 'Machinery Procurement & Setup',
    cap3Desc: 'Direct import of CNC tools, production lines, and heavy machinery from East Asia.',
    cap4Title: 'Maintenance & Overhaul Programs',
    cap4Desc: '24/7 technical repair, spare parts fabrication, and overhaul services in Sohar & Muscat.',
    formTitle: 'Technical Specification Submission Form',
    formProjectLabel: 'Project Type / Sector',
    formLandLabel: 'Required Land Area (m²)',
    formFreezoneLabel: 'Target Oman Free Zone',
    formUploadBtn: 'Attach CAD Schematics / DWG / PDF',
    formSubmitBtn: 'Submit Engineering Consult Request',
  },
  tradePage: {
    heroTitle: 'GCC-China Freight & Supply Chain Corridor',
    heroSub: 'Direct ocean routes and multimodal logistics connecting China ports to Oman non-Hormuz deepwater terminals.',
    routeTitle: 'CHINA → OMAN DIRECT MARITIME ROUTE',
    transitTimeLabel: 'Transit Time',
    originsLabel: 'Origin Ports',
    destsLabel: 'Destination Ports',
    modesLabel: 'Transport Modes',
    calcTitle: 'Instant Ocean Freight Rate Estimator',
    calcContainerType: 'Cargo / Container Type',
    calcWeight: 'Total Weight (Metric Tons / TEU)',
    calcEstimateBtn: 'Calculate Freight Rate',
    calcResultLabel: 'Estimated Freight Cost (CIF Oman)',
  },
  calculator: {
    title: 'GCC-China Expansion Feasibility Calculator',
    sub: 'Simulate estimated transit timelines and sovereign tax benefits for your project.',
    typeLabel: 'Select Business Pillar',
    typeOptions: {
      capital: 'FDI & Joint Venture Capital',
      industrial: 'Freezone Plant Construction',
      logistics: 'Maritime Cargo & Freight Line',
    },
    locationLabel: 'Target Freezone Hub',
    metricLabel: 'Scale Factor (Project Budget / Container Volume)',
    calculateBtn: 'Calculate Corridor Metrics',
    estTransit: 'Est. Maritime Transit',
    estTax: 'Effective Corporate Tax',
    estSupport: 'Macan Facilitation Support',
  },
  footer: {
    hq: 'Muscat Headquarters: Al Bustan Executive Tower, P.O. Box 112, PC 100, Sultanate of Oman',
    cr: 'Oman Commercial Registration No: 10849202 | Tax Identification ID: OM-849201',
    rights: '© 2026 Macan Group. All Rights Reserved. Sovereign Accredited Enterprise.',
    domainsTitle: 'Macan Enterprise Network',
  },
};

const DICTIONARY_AR: ContentDictionary = {
  dir: 'rtl',
  nav: {
    brand: 'مجموعة ماكان',
    subBrand: 'مسقط • عمان • ممر الخليج',
    index: 'الرئيسية',
    capital: 'ماكان للاستثمار',
    industrial: 'ماكان للصناعة',
    trade: 'الخدمات اللوجستية',
    ctaConsult: 'التواصل مع الاستشارات',
  },
  ticker: {
    status: 'حالة الممر المباشرة:',
    muscat: 'ميناء مسقط: نشط ومباشر',
    duqm: 'المنطقة الاقتصادية بالدقم: جاهزية كاملة',
    transit: 'عبور نينغبو - صلالة: 14 يوماً فقط',
    ownership: 'تملك أجنبي بنسبة: 100% متاح',
  },
  hero: {
    badge: 'الممر الاستراتيجي للتجارة والصناعة بين دول الخليج والصين',
    titleMain: 'مجموعة ماكان',
    titleHighlight: 'صرح يُبنى على الثقة، وتدفّقٌ رأسمالي عالمي',
    subhead: 'مقرنا الرئيسي في مسقط، نربط الاستثمارات الشرق أوسطية بالتمكين الصناعي والخدمات اللوجستية عبر المناطق الاقتصادية والحرة في سلطنة عُمان.',
    ctaPrimary: 'استكشف الفرص الاستثمارية',
    ctaSecondary: 'طلب عرض سعر الشحن',
    crBadge: 'شريك سيادي معتمد • المقر الرئيسي بمسقط',
  },
  pillars: {
    title: 'الركائز الثلاث لمجموعة ماكان',
    subtitle: 'ربط الاستثمارات وتأسيس المصانع وشبكات اللوجستيات بين الخليج والصين.',
    capital: {
      tag: 'الركيزة الأولى',
      title: 'ماكان للاستثمار وتطوير الأعمال',
      desc: 'تسهيل الاستثمار الأجنبي المباشر والمشاريع المشتركة والتمويل التجاري بين كبار الصناعيين في الصين ورؤس الأموال الخليجية.',
      b1: 'هيكلة المشاريع الاستثمارية المشتركة',
      b2: 'الاستفادة من الحوافز الضريبية السيادية بعُمان',
      b3: 'الاستثمار في العقار الصناعي والموانئ',
      cta: 'بوابة الاستثمار ←',
    },
    industrial: {
      tag: 'الركيزة الثانية',
      title: 'ماكان للهندسة والتجهيز الصناعي',
      desc: 'تقديم خدمات متكاملة لتأسيس المصانع والمباني الصناعية وتوريد الآلات الثقيلة في صحار والدقم.',
      b1: 'تراخيص وزارة التجارة وإدارات المناطق الحرة',
      b2: 'أعمال الإنشاءات الهندسية للمصانع EPC',
      b3: 'استيراد وتشغيل خطوط الإنتاج والآلات',
      cta: 'بوابة التمكين الصناعي ←',
    },
    trade: {
      tag: 'الركيزة الثالثة',
      title: 'ماكان للتجارة والخدمات اللوجستية',
      desc: 'إدارة خطوط الملاحة البحرية المباشرة التي تربط أهم الموانئ الصينية بالموانئ العُمانية المحيطية خارج مضيق هرمز.',
      b1: 'خط بحري مباشر من نينغبو وشينزن إلى صحار',
      b2: 'شحن الشحنات المجمعة FCL/LCL والحمولات الثقيلة',
      b3: 'التخليص الجمركي وإعادة التصدير لدول الخليج',
      cta: 'بوابة اللوجستيات المباشرة ←',
    },
  },
  advantages: {
    title: 'الميزة الاستراتيجية لسلطنة عُمان',
    sub: 'موقع جغرافي استثنائي خارج مضيق هرمز يضمن وصولاً مباشراً لخطوط التجارة العالمية.',
    item1Title: 'إعفاءات ضريبية وجمركية 0%',
    item1Desc: 'صفر رسوم جمركية على استيراد المواد الخام وآلات إعادة التصدير في المناطق الاقتصادية.',
    item2Title: 'ملكيات أجنبية كاملة 100%',
    item2Desc: 'حقوق استثمارية كاملة محميّة بموجب قوانين استثمار رأس المال الأجنبي في سلطنة عُمان.',
    item3Title: 'خطوط بحرية للمياه العميقة',
    item3Desc: 'تجنب الاختناقات البحرية من خلال الربط المباشر بأسواق شرق أفريقيا والحافظة الآسيوية.',
  },
  corridor: {
    title: 'مصفوفة شبكة الممر اللوجستي (الخليج - الصين)',
    sub: 'خريطة تفاعلية تربط مراكز التصنيع الرئيسية في الصين بالمناطق الاقتصادية بالسلـطنة.',
    nodes: {
      muscat: { title: 'المقر الرئيسي بمسقط', desc: 'المركز الإداري والمالي للحوكمة الشاملة.', role: 'المركز الرئيسي' },
      sohar: { title: 'ميناء والمنطقة الحرة بصحار', desc: 'مركز التصنيع الصناعي مع ربط بري دولي.', role: 'المنطقة الصناعية' },
      duqm: { title: 'المنطقة الاقتصادية بالدقم', desc: 'مركز بحري للمياه العميقة والتصنيع الثقيل.', role: 'الميناء الرئيسي' },
      ningbo: { title: 'ميناء نينغبو-تشوشان', desc: 'منطلق الشحنات والآلات الثقيلة بشرق الصين.', role: 'بوابة التصدير' },
      shenzhen: { title: 'مركز شينزن التقني', desc: 'مركز تصدير المعدات الإلكترونية والطاقة المتجددة.', role: 'التصدير التكنولوجي' },
    },
  },
  capitalPage: {
    heroTitle: 'ماكان للاستثمار والاستشارات الخارجية',
    heroSub: 'توجيه رؤوس الأموال الاستراتيجية وهيكلة المشاريع المشتركة ذات العائد المرتفع عبر ممر الخليج والصين.',
    service1Title: '01. هيكلة المشاريع المشتركة (JV)',
    service1Desc: 'صياغة اتفاقيات قانونية بين الاستثمار السيادي بالخليج وعمالقة التصنيع بالصين.',
    service2Title: '02. الحوافز والإعفاءات الضريبية',
    service2Desc: 'الوصول إلى 0% ضريبة شركات، وتعرفة طاقة مدعومة، وحرية تحويل الأرباح بالكامل.',
    service3Title: '03. التمويل والضمانات البنكية',
    service3Desc: 'إدارة تمويل التجارة متعددة العملات والتسهيلات المصرفية من مسقط.',
    spotlightTitle: 'فرصة استثمارية بارزة',
    spotlightProject: 'مجمع الدقم للتصنيع والتجميع الثقيل',
    spotlightSector: 'التصنيع الهيكلي للصلب ومعدات الهيدروجين الأخضر',
    spotlightStatus: 'دراسة الجدوى معتمدة • تخصيص 150,000 متر مربع',
    ctaProspectus: 'تحميل نشرة الاستثمار (PDF)',
  },
  industrialPage: {
    heroTitle: 'التجهيز الهندسي وإنشاء المصانع',
    heroSub: 'تأسيس المصانع وتسليمها بالكامل، والأعمال الهندسية وتوريد الآلات في المناطق الحرة بعُمان.',
    cap1Title: 'التراخيص والموافقات الحكومية',
    cap1Desc: 'إنهاء كافة إجراءات وزارة التجارة وإدارات المناطق الاقتصادية الحرة.',
    cap2Title: 'أعمال الإنشاءات EPC',
    cap2Desc: 'تجهيز البنية التحتية والمباني الهيكلية وتوصيلات المرافق الرئيسية.',
    cap3Title: 'استيراد وتركيب المعدات',
    cap3Desc: 'استيراد مباشر لخطوط الإنتاج والآلات الثقيلة وآلات CNC من شرق آسيا.',
    cap4Title: 'الصيانة والدعم الفني',
    cap4Desc: 'خدمات صيانة على مدار 24/7 وتوفير قطع الغيار في صحار ومسقط.',
    formTitle: 'نموذج تقديم المواصفات الهندسية للمشروع',
    formProjectLabel: 'قطاع / نوع المشروع',
    formLandLabel: 'المساحة المطلوبة (متر مربع)',
    formFreezoneLabel: 'المنطقة الحرة المستهدفة',
    formUploadBtn: 'إرفاق مخططات CAD / DWG / PDF',
    formSubmitBtn: 'إرسال طلب الاستشارة الهندسية',
  },
  tradePage: {
    heroTitle: 'شبكة الشحن والخدمات اللوجستية (الخليج - الصين)',
    heroSub: 'خطوط بحرية مباشرة ولوجستيات متكاملة تربط الموانئ الصينية بالموانئ العُمانية المحيطية.',
    routeTitle: 'المسار البحري المباشر: الصين ← سلطنة عُمان',
    transitTimeLabel: 'مدة العبور البحرية',
    originsLabel: 'موانئ المغادرة (الصين)',
    destsLabel: 'موانئ الوصول (عُمان)',
    modesLabel: 'أنماط الشحن المتاحة',
    calcTitle: 'حاسبة أسعار الشحن البحري الفوري',
    calcContainerType: 'نوع الحاوية / البضاعة',
    calcWeight: 'الوزن الإجمالي (طن متري / TEU)',
    calcEstimateBtn: 'احسب تكلفة الشحن',
    calcResultLabel: 'التكلفة التقديرية للشحن (CIF عُمان)',
  },
  calculator: {
    title: 'حاسبة الجدوى للممر الاستثماري والتجاري',
    sub: 'قم بتقدير المهل الزمنية للشحن والمزايا الضريبية المتاحة لمشروعك.',
    typeLabel: 'حدد قطاع الأعمال',
    typeOptions: {
      capital: 'استثمار أجنبي ومشاريع مشتركة',
      industrial: 'إنشاء وتجهيز مصنع صناعي',
      logistics: 'خط شحن بحري ولوجستي',
    },
    locationLabel: 'المنطقة الحرة المستهدفة',
    metricLabel: 'حجم العمليات (ميزانية المشروع / عدد الحاويات)',
    calculateBtn: 'احسب المؤشرات',
    estTransit: 'المدة الزمنية المتوقعة للشحن',
    estTax: 'نسبة الضريبة الفعّالة',
    estSupport: 'مستوى التسهيلات من ماكان',
  },
  footer: {
    hq: 'المقر الرئيسي بمسقط: برج البستان التنفيذي، ص.ب 112، الرمز البريدي 100، سلطنة عُمان',
    cr: 'السجل التجاري السلطني رقم: 10849202 | الرقم الضريبي: OM-849201',
    rights: '© 2026 مجموعة ماكان. جميع الحقوق محفوظة. مؤسسة معتمدة سيادياً.',
    domainsTitle: 'شبكة نطاقات مجموعة ماكان',
  },
};

const DICTIONARY_ZH: ContentDictionary = {
  dir: 'ltr',
  nav: {
    brand: '麦肯集团',
    subBrand: '马斯喀特 • 阿曼 • 海湾走廊',
    index: '首页概览',
    capital: '麦肯资本',
    industrial: '麦肯工业',
    trade: '物流走廊',
    ctaConsult: '联系咨询',
  },
  ticker: {
    status: '走廊实时状态:',
    muscat: '马斯喀特总部港: 运行正常',
    duqm: '杜古姆自贸区枢纽: 深度优化',
    transit: '宁波-萨拉拉直航: 14天即达',
    ownership: '外资独资比例: 100% 权益保障',
  },
  hero: {
    badge: '海湾 - 中国战略贸易与工业走廊',
    titleMain: '麦肯集团',
    titleHighlight: '立足信任，驱动全球资本',
    subhead: '总部位于阿曼苏丹国马斯喀特，连接中东资本、阿曼自贸区交钥匙工业建设与中阿海运物流。',
    ctaPrimary: '探索投资机遇',
    ctaSecondary: '获取中阿物流报价',
    crBadge: '主权认证企业 • 马斯喀特总部',
  },
  pillars: {
    title: '麦肯三大核心业务柱',
    subtitle: '全方位释放中阿在资本、基础设施建设与跨境贸易方面的协同效应。',
    capital: {
      tag: '核心业务 I',
      title: '麦肯资本与投资中心',
      desc: '促进中国工业巨头与海湾主权基金之间的主权级外商直接投资 (FDI)、合资企业建立及贸易融资。',
      b1: '中阿跨境合资企业 (JV) 法律搭建',
      b2: '阿曼主权级投资免税优惠政策对接',
      b3: '工业地产与港口物流基础设施投资',
      cta: '进入资本咨询 Portal →',
    },
    industrial: {
      tag: '核心业务 II',
      title: '麦肯工业建设与工程服务',
      desc: '在苏哈尔和杜古姆自贸区提供工厂建厂交钥匙工程、土地审批及中国重型机械进口调试。',
      b1: '商务部与自贸区管理局全套执照办理',
      b2: 'EPC 工厂建设与钢结构工程施工',
      b3: '重型工业机械进口、安装与维保',
      cta: '进入工业建设 Portal →',
    },
    trade: {
      tag: '核心业务 III',
      title: '麦肯贸易与多式联运走廊',
      desc: '运营连接中国主要沿海港口至阿曼霍尔木兹海峡外深水港的直航集装箱与散货航线。',
      b1: '宁波 / 深圳至苏哈尔港直航航线',
      b2: '整柜 (FCL) 与拼箱 (LCL) 重型设备运输',
      b3: '海湾六国 (GCC) 及中亚门到门清关',
      cta: '进入物流走廊 Portal →',
    },
  },
  advantages: {
    title: '阿曼苏丹国的战略地理优势',
    sub: '位于霍尔木兹海峡之外，直接面向印度洋与全球主干航道。',
    item1Title: '0% 港口关税与税收激励',
    item1Desc: '自贸区内原材料进口与转口设备免征任何关税与进出口税。',
    item2Title: '100% 外资独资所有权',
    item2Desc: '受阿曼投资促进部与商务部法律保护，投资者享有完全控制权。',
    item3Title: '直航深水远洋航线',
    item3Desc: '避开海峡拥堵与航运风险，快捷通达东非、印度及东亚市场。',
  },
  corridor: {
    title: '海湾-中国物流走廊矩阵',
    sub: '连接中国主要制造中心与阿曼经济特区的可视化交互网络。',
    nodes: {
      muscat: { title: '马斯喀特总部', desc: '集团主权金融与行政决策中心。', role: '资本总部' },
      sohar: { title: '苏哈尔港与自贸区', desc: '重工业制造枢纽，具备直通海湾公路网。', role: '工业制造区' },
      duqm: { title: '杜古姆经济特区', desc: '深水港口与大型重型装备制造基地。', role: '深水特区' },
      ningbo: { title: '宁波舟山港', desc: '中国华东地区重型机械与钢材出口始发港。', role: '出口枢纽' },
      shenzhen: { title: '深圳科技枢纽', desc: '高端电子设备与新能源机械出口中心。', role: '科技出口' },
    },
  },
  capitalPage: {
    heroTitle: '麦肯资本与 FDI 咨询中心',
    heroSub: '在中阿经济走廊高效配置战略资本，搭建高收益产业合资项目。',
    service1Title: '01. 跨境合资企业搭建 (JV)',
    service1Desc: '在海湾机构资本与中国制造巨头之间提供合规法律架构搭建。',
    service2Title: '02. 主权级税收优惠申请',
    service2Desc: '协助获取0%企业所得税免税期、工业用电补贴及全额利润汇出保障。',
    service3Title: '03. 金融与贸易托管服务',
    service3Desc: '在马斯喀特总部提供多币种贸易融资、银行账户开立与主权担保。',
    spotlightTitle: '重点投资项目推荐',
    spotlightProject: '杜古姆重型装备制造与装配枢纽',
    spotlightSector: '钢结构加工、模块化设备与绿色氢能机械',
    spotlightStatus: '可行性研究已批准 • 已获批 150,000 平方米自贸区用地',
    ctaProspectus: '下载投资招股说明书 (PDF)',
  },
  industrialPage: {
    heroTitle: '交钥匙工厂建设与工程服务',
    heroSub: '在阿曼自贸区提供一站式工厂建设、土建施工及重型机械进口调试。',
    cap1Title: '工业执照与审批办理',
    cap1Desc: '全权办理阿曼商务部与自贸区管理局的运营许可证。',
    cap2Title: 'EPC 工厂建设与施工',
    cap2Desc: '包含土建基础、重型钢结构组装及公用设施接入。',
    cap3Title: '机械设备采购与安装',
    cap3Desc: '直接从中国及东亚进口 CNC 机床、自动化生产线及重型设备。',
    cap4Title: '运维与设备大修服务',
    cap4Desc: '在苏哈尔及马斯喀特提供24/7技术维修、零配件加工与设备保养。',
    formTitle: '工业项目技术规格提交表',
    formProjectLabel: '项目类型 / 行业',
    formLandLabel: '所需土地面积 (m²)',
    formFreezoneLabel: '目标阿曼自贸区',
    formUploadBtn: '上传 CAD 图纸 / DWG / PDF',
    formSubmitBtn: '提交工程咨询申请',
  },
  tradePage: {
    heroTitle: '海湾-中国航线与多式联运走廊',
    heroSub: '连接中国主要沿海港口与阿曼无海峡封锁风险的深水集装箱码头。',
    routeTitle: '中国 → 阿曼 直航远洋航线 Matrix',
    transitTimeLabel: '航程时效',
    originsLabel: '始发港口 (中国)',
    destsLabel: '目的港口 (阿曼)',
    modesLabel: '运输模式',
    calcTitle: '海运运费实时测算器',
    calcContainerType: '货物 / 集装箱类型',
    calcWeight: '货物总重 (公吨 / TEU)',
    calcEstimateBtn: '测算海运运费',
    calcResultLabel: '预估海运费用 (CIF 阿曼)',
  },
  calculator: {
    title: '中阿拓展可行性与物流测算器',
    sub: '实时测算您的项目航程时效及阿曼主权税收优惠。',
    typeLabel: '选择业务板块',
    typeOptions: {
      capital: 'FDI 投资与合资企业',
      industrial: '自贸区建厂工程',
      logistics: '海运物流与货物运输',
    },
    locationLabel: '目标自贸区',
    metricLabel: '规模指标 (投资预算万美元 / 集装箱柜数)',
    calculateBtn: '开始测算',
    estTransit: '预计海运航程时效',
    estTax: '实际有效企业税率',
    estSupport: '麦肯协助与协助级别',
  },
  footer: {
    hq: '马斯喀特总部：Al Bustan Executive Tower, P.O. Box 112, PC 100, Sultanate of Oman',
    cr: '阿曼商业注册号 (CR): 10849202 | 税务登记号: OM-849201',
    rights: '© 2026 麦肯集团. 保留所有权利。主权认证企业。',
    domainsTitle: '麦肯集团子品牌域名矩阵',
  },
};

const DICTIONARIES: Record<Language, ContentDictionary> = {
  en: DICTIONARY_EN,
  ar: DICTIONARY_AR,
  zh: DICTIONARY_ZH,
};

export default function MacanGlobalPlatform() {
  const [lang, setLang] = useState<Language>('en');
  const [activePage, setActivePage] = useState<PageView>('index');
  const [activePillar, setActivePillar] = useState<'capital' | 'industrial' | 'trade'>('capital');
  const [selectedNode, setSelectedNode] = useState<'muscat' | 'sohar' | 'duqm' | 'ningbo' | 'shenzhen'>('muscat');
  
  // Interactive Modal State
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [modalTitle, setModalTitle] = useState<string>('');
  const [modalSubmitted, setModalSubmitted] = useState<boolean>(false);

  // Global Calculator State
  const [calcPillar, setCalcPillar] = useState<'capital' | 'industrial' | 'logistics'>('capital');
  const [calcLocation, setCalcLocation] = useState<string>('Sohar Freezone');
  const [calcValue, setCalcValue] = useState<number>(50);
  const [calcResult, setCalcResult] = useState<{ transit: string; tax: string; support: string } | null>(null);

  // Logistics Freight Form State
  const [freightType, setFreightType] = useState<string>('40ft High Cube Container');
  const [freightQty, setFreightQty] = useState<number>(5);
  const [freightCost, setFreightCost] = useState<number | null>(null);

  const t = DICTIONARIES[lang];

  useEffect(() => {
    handleCalculate();
  }, [calcPillar, calcLocation, calcValue, lang]);

  const handleCalculate = () => {
    let transit = '12 - 14 Days Direct';
    let tax = '0% (Up to 25 Years Holiday)';
    let support = 'Sovereign Priority Facilitation';

    if (calcPillar === 'logistics') {
      transit = calcLocation.includes('Duqm') ? '12 Days Express' : '14 Days Direct';
      tax = '0% Customs Tariffs';
      support = 'Guaranteed Berth Allocation';
    } else if (calcPillar === 'industrial') {
      transit = 'N/A (Turnkey EPC)';
      tax = '0% Corporate Tax (25 Yrs)';
      support = 'Ministry License Fast-Track';
    } else {
      transit = 'N/A (FDI Structuring)';
      tax = '0% Capital Repatriation';
      support = 'Sovereign Wealth Co-Investment';
    }

    setCalcResult({ transit, tax, support });
  };

  const calculateFreightRate = (e: React.FormEvent) => {
    e.preventDefault();
    const baseRatePerUnit = freightType.includes('Breakbulk') ? 2800 : 1850;
    setFreightCost(baseRatePerUnit * freightQty);
  };

  const openActionModal = (title: string) => {
    setModalTitle(title);
    setModalSubmitted(false);
    setModalOpen(true);
  };

  return (
    <div className={`min-h-screen bg-[#0A192F] text-slate-100 font-sans selection:bg-[#D4AF37] selection:text-[#0A192F] ${t.dir === 'rtl' ? 'rtl' : 'ltr'}`} dir={t.dir}>
      
      {}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-[#0A192F]/90 border-b border-[#D4AF37]/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          {/* Logo Branding */}
          <div 
            onClick={() => setActivePage('index')}
            className="flex items-center space-x-3 rtl:space-x-reverse cursor-pointer group"
          >
            <div className="w-10 h-10 rounded bg-gradient-to-br from-[#D4AF37] to-[#AA7C11] p-0.5 flex items-center justify-center shadow-lg shadow-[#D4AF37]/20 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-[#0A192F] rounded-sm flex items-center justify-center font-bold text-[#D4AF37] text-xl">
                M
              </div>
            </div>
            <div>
              <div className="font-extrabold tracking-wider text-lg text-slate-100">
                MACAN <span className="text-[#D4AF37]">GROUP</span>
              </div>
              <div className="text-[10px] text-slate-400 tracking-widest uppercase">
                {t.nav.subBrand}
              </div>
            </div>
          </div>

          {/* Desktop Page Navigation Router */}
          <nav className="hidden md:flex items-center space-x-8 rtl:space-x-reverse text-sm font-medium text-slate-300">
            <button 
              onClick={() => setActivePage('index')}
              className={`hover:text-[#D4AF37] transition-colors ${activePage === 'index' ? 'text-[#D4AF37] border-b-2 border-[#D4AF37] pb-1' : ''}`}
            >
              {t.nav.index}
            </button>
            <button 
              onClick={() => setActivePage('capital')}
              className={`hover:text-[#D4AF37] transition-colors ${activePage === 'capital' ? 'text-[#D4AF37] border-b-2 border-[#D4AF37] pb-1' : ''}`}
            >
              {t.nav.capital}
            </button>
            <button 
              onClick={() => setActivePage('industrial')}
              className={`hover:text-[#D4AF37] transition-colors ${activePage === 'industrial' ? 'text-[#D4AF37] border-b-2 border-[#D4AF37] pb-1' : ''}`}
            >
              {t.nav.industrial}
            </button>
            <button 
              onClick={() => setActivePage('trade')}
              className={`hover:text-[#D4AF37] transition-colors ${activePage === 'trade' ? 'text-[#D4AF37] border-b-2 border-[#D4AF37] pb-1' : ''}`}
            >
              {t.nav.trade}
            </button>
          </nav>

          {/* Language Switcher & Action CTA */}
          <div className="flex items-center space-x-4 rtl:space-x-reverse">
            <div className="flex bg-[#1E293B] border border-[#334155] rounded-md p-1 text-xs">
              <button
                onClick={() => setLang('en')}
                className={`px-2.5 py-1 rounded transition-colors ${lang === 'en' ? 'bg-[#D4AF37] text-[#0A192F] font-bold' : 'text-slate-400 hover:text-white'}`}
              >
                EN
              </button>
              <button
                onClick={() => setLang('ar')}
                className={`px-2.5 py-1 rounded transition-colors ${lang === 'ar' ? 'bg-[#D4AF37] text-[#0A192F] font-bold' : 'text-slate-400 hover:text-white'}`}
              >
                العربية
              </button>
              <button
                onClick={() => setLang('zh')}
                className={`px-2.5 py-1 rounded transition-colors ${lang === 'zh' ? 'bg-[#D4AF37] text-[#0A192F] font-bold' : 'text-slate-400 hover:text-white'}`}
              >
                中文
              </button>
            </div>

            <button
              onClick={() => openActionModal(t.nav.ctaConsult)}
              className="hidden sm:inline-flex items-center justify-center px-4 py-2 text-xs font-semibold rounded bg-gradient-to-r from-[#D4AF37] to-[#B8962E] text-[#0A192F] hover:opacity-95 transition-opacity shadow-md"
            >
              {t.nav.ctaConsult}
            </button>
          </div>
        </div>
      </header>

      {}
      <div className="bg-[#0D3B36] border-y border-[#D4AF37]/20 py-2.5 overflow-hidden text-xs">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between font-mono text-emerald-300">
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="font-bold text-white uppercase tracking-wider">{t.ticker.status}</span>
          </div>
          <div className="hidden sm:flex items-center space-x-6 rtl:space-x-reverse text-slate-200">
            <span>• {t.ticker.muscat}</span>
            <span>• {t.ticker.duqm}</span>
            <span>• {t.ticker.transit}</span>
            <span className="text-[#D4AF37] font-semibold">• {t.ticker.ownership}</span>
          </div>
        </div>
      </div>

      {/* --- PAGE VIEW ROUTER --- */}
      {activePage === 'index' && (
        <main>
          {}
          <section className="relative pt-20 pb-24 overflow-hidden">
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-[#D4AF37]/10 blur-[140px] rounded-full pointer-events-none" />
            <div className="absolute top-1/3 right-10 w-[300px] h-[300px] bg-[#0D3B36]/30 blur-[100px] rounded-full pointer-events-none" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
              <div className="inline-flex items-center space-x-2 rtl:space-x-reverse px-3.5 py-1.5 rounded-full bg-[#1E293B]/80 border border-[#D4AF37]/40 text-xs text-[#D4AF37] mb-8 shadow-inner">
                <span className="font-medium tracking-wide">{t.hero.badge}</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight max-w-4xl mx-auto leading-tight">
                {t.hero.titleMain}: <br className="hidden sm:inline" />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#D4AF37] via-[#F3E5AB] to-[#D4AF37]">
                  {t.hero.titleHighlight}
                </span>
              </h1>

              <p className="mt-6 text-lg sm:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed font-normal">
                {t.hero.subhead}
              </p>

              <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                <button
                  onClick={() => setActivePage('capital')}
                  className="w-full sm:w-auto px-8 py-4 rounded-md bg-gradient-to-r from-[#D4AF37] to-[#AA7C11] text-[#0A192F] font-bold text-base hover:shadow-lg hover:shadow-[#D4AF37]/20 transition-all duration-200 text-center"
                >
                  {t.hero.ctaPrimary}
                </button>
                <button
                  onClick={() => setActivePage('trade')}
                  className="w-full sm:w-auto px-8 py-4 rounded-md bg-[#1E293B] border border-[#334155] text-white hover:bg-[#334155] font-semibold text-base transition-all duration-200 text-center"
                >
                  {t.hero.ctaSecondary}
                </button>
              </div>

              <div className="mt-8 text-xs text-slate-400 flex items-center justify-center space-x-2 rtl:space-x-reverse">
                <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
                <span>{t.hero.crBadge}</span>
              </div>
            </div>
          </section>

          {}
          <section className="py-20 bg-[#0A192F]/60 border-t border-[#1E293B]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center max-w-3xl mx-auto mb-16">
                <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
                  {t.pillars.title}
                </h2>
                <p className="mt-4 text-base text-slate-400">
                  {t.pillars.subtitle}
                </p>
              </div>

              <div className="flex justify-center mb-12">
                <div className="inline-flex p-1 bg-[#1E293B] rounded-lg border border-[#334155]">
                  <button
                    onClick={() => setActivePillar('capital')}
                    className={`px-5 py-2.5 rounded-md text-sm font-semibold transition-all ${
                      activePillar === 'capital' ? 'bg-[#D4AF37] text-[#0A192F] shadow' : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    Macan Capital
                  </button>
                  <button
                    onClick={() => setActivePillar('industrial')}
                    className={`px-5 py-2.5 rounded-md text-sm font-semibold transition-all ${
                      activePillar === 'industrial' ? 'bg-[#D4AF37] text-[#0A192F] shadow' : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    Macan Industrial
                  </button>
                  <button
                    onClick={() => setActivePillar('trade')}
                    className={`px-5 py-2.5 rounded-md text-sm font-semibold transition-all ${
                      activePillar === 'trade' ? 'bg-[#D4AF37] text-[#0A192F] shadow' : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    Trade Corridor
                  </button>
                </div>
              </div>

              <div className="bg-[#1E293B]/80 rounded-xl border border-[#D4AF37]/30 p-8 lg:p-12 shadow-2xl relative overflow-hidden">
                {activePillar === 'capital' && (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                    <div>
                      <span className="text-xs font-mono tracking-widest text-[#D4AF37] uppercase bg-[#D4AF37]/10 px-3 py-1 rounded border border-[#D4AF37]/30">
                        {t.pillars.capital.tag}
                      </span>
                      <h3 className="text-2xl sm:text-3xl font-bold text-white mt-4">{t.pillars.capital.title}</h3>
                      <p className="mt-4 text-slate-300 text-base leading-relaxed">{t.pillars.capital.desc}</p>
                      <ul className="mt-6 space-y-3 text-sm text-slate-200">
                        <li className="flex items-center space-x-3 rtl:space-x-reverse"><span className="text-[#D4AF37]">✔</span><span>{t.pillars.capital.b1}</span></li>
                        <li className="flex items-center space-x-3 rtl:space-x-reverse"><span className="text-[#D4AF37]">✔</span><span>{t.pillars.capital.b2}</span></li>
                        <li className="flex items-center space-x-3 rtl:space-x-reverse"><span className="text-[#D4AF37]">✔</span><span>{t.pillars.capital.b3}</span></li>
                      </ul>
                      <button 
                        onClick={() => setActivePage('capital')}
                        className="mt-8 px-6 py-3 rounded bg-[#D4AF37] text-[#0A192F] font-bold text-sm hover:opacity-90 transition-opacity"
                      >
                        {t.pillars.capital.cta}
                      </button>
                    </div>
                    <div className="bg-[#0A192F] p-6 rounded-lg border border-[#334155] font-mono text-xs text-slate-300 space-y-4">
                      <div className="text-[#D4AF37] font-bold border-b border-[#334155] pb-2">[ CAPITAL FEASIBILITY METRICS ]</div>
                      <div className="flex justify-between"><span>Oman Freezone Corporate Tax:</span><span className="text-emerald-400 font-bold">0% (Up to 25 Yrs)</span></div>
                      <div className="flex justify-between"><span>Foreign Equity Allowed:</span><span className="text-emerald-400 font-bold">100% Ownership</span></div>
                      <div className="flex justify-between"><span>Capital Repatriation Tax:</span><span className="text-emerald-400 font-bold">0% Restrictive Barrier</span></div>
                    </div>
                  </div>
                )}

                {activePillar === 'industrial' && (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                    <div>
                      <span className="text-xs font-mono tracking-widest text-[#D4AF37] uppercase bg-[#D4AF37]/10 px-3 py-1 rounded border border-[#D4AF37]/30">
                        {t.pillars.industrial.tag}
                      </span>
                      <h3 className="text-2xl sm:text-3xl font-bold text-white mt-4">{t.pillars.industrial.title}</h3>
                      <p className="mt-4 text-slate-300 text-base leading-relaxed">{t.pillars.industrial.desc}</p>
                      <ul className="mt-6 space-y-3 text-sm text-slate-200">
                        <li className="flex items-center space-x-3 rtl:space-x-reverse"><span className="text-[#D4AF37]">✔</span><span>{t.pillars.industrial.b1}</span></li>
                        <li className="flex items-center space-x-3 rtl:space-x-reverse"><span className="text-[#D4AF37]">✔</span><span>{t.pillars.industrial.b2}</span></li>
                        <li className="flex items-center space-x-3 rtl:space-x-reverse"><span className="text-[#D4AF37]">✔</span><span>{t.pillars.industrial.b3}</span></li>
                      </ul>
                      <button 
                        onClick={() => setActivePage('industrial')}
                        className="mt-8 px-6 py-3 rounded bg-[#D4AF37] text-[#0A192F] font-bold text-sm hover:opacity-90 transition-opacity"
                      >
                        {t.pillars.industrial.cta}
                      </button>
                    </div>
                    <div className="bg-[#0A192F] p-6 rounded-lg border border-[#334155] font-mono text-xs text-slate-300 space-y-4">
                      <div className="text-[#D4AF37] font-bold border-b border-[#334155] pb-2">[ INDUSTRIAL PLANT SPECS ]</div>
                      <div className="flex justify-between"><span>Key Industrial Zones:</span><span className="text-white">Sohar Port & Duqm SEZ</span></div>
                      <div className="flex justify-between"><span>Customs Duties on Plant Machinery:</span><span className="text-emerald-400 font-bold">0% Duty Exempt</span></div>
                      <div className="flex justify-between"><span>Industrial Power Rates:</span><span className="text-emerald-400 font-bold">Subsidized Tier</span></div>
                    </div>
                  </div>
                )}

                {activePillar === 'trade' && (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                    <div>
                      <span className="text-xs font-mono tracking-widest text-[#D4AF37] uppercase bg-[#D4AF37]/10 px-3 py-1 rounded border border-[#D4AF37]/30">
                        {t.pillars.trade.tag}
                      </span>
                      <h3 className="text-2xl sm:text-3xl font-bold text-white mt-4">{t.pillars.trade.title}</h3>
                      <p className="mt-4 text-slate-300 text-base leading-relaxed">{t.pillars.trade.desc}</p>
                      <ul className="mt-6 space-y-3 text-sm text-slate-200">
                        <li className="flex items-center space-x-3 rtl:space-x-reverse"><span className="text-[#D4AF37]">✔</span><span>{t.pillars.trade.b1}</span></li>
                        <li className="flex items-center space-x-3 rtl:space-x-reverse"><span className="text-[#D4AF37]">✔</span><span>{t.pillars.trade.b2}</span></li>
                        <li className="flex items-center space-x-3 rtl:space-x-reverse"><span className="text-[#D4AF37]">✔</span><span>{t.pillars.trade.b3}</span></li>
                      </ul>
                      <button 
                        onClick={() => setActivePage('trade')}
                        className="mt-8 px-6 py-3 rounded bg-[#D4AF37] text-[#0A192F] font-bold text-sm hover:opacity-90 transition-opacity"
                      >
                        {t.pillars.trade.cta}
                      </button>
                    </div>
                    <div className="bg-[#0A192F] p-6 rounded-lg border border-[#334155] font-mono text-xs text-slate-300 space-y-4">
                      <div className="text-[#D4AF37] font-bold border-b border-[#334155] pb-2">[ FREIGHT CORRIDOR SPECS ]</div>
                      <div className="flex justify-between"><span>Ningbo to Sohar Transit:</span><span className="text-emerald-400 font-bold">12 - 14 Days Direct</span></div>
                      <div className="flex justify-between"><span>Strait of Hormuz Avoidance:</span><span className="text-emerald-400 font-bold">100% Non-Hormuz Port Access</span></div>
                      <div className="flex justify-between"><span>Cargo Capabilities:</span><span className="text-white">FCL, LCL, Heavy Breakbulk</span></div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>

          {}
          <section className="py-20 bg-[#0A192F]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center max-w-3xl mx-auto mb-16">
                <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">{t.advantages.title}</h2>
                <p className="mt-4 text-base text-slate-400">{t.advantages.sub}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-[#1E293B]/60 border border-[#334155] p-8 rounded-lg">
                  <div className="w-12 h-12 rounded bg-[#D4AF37]/10 flex items-center justify-center text-[#D4AF37] font-bold text-xl mb-6">0%</div>
                  <h3 className="text-xl font-bold text-white mb-3">{t.advantages.item1Title}</h3>
                  <p className="text-sm text-slate-300 leading-relaxed">{t.advantages.item1Desc}</p>
                </div>
                <div className="bg-[#1E293B]/60 border border-[#334155] p-8 rounded-lg">
                  <div className="w-12 h-12 rounded bg-[#D4AF37]/10 flex items-center justify-center text-[#D4AF37] font-bold text-xl mb-6">100%</div>
                  <h3 className="text-xl font-bold text-white mb-3">{t.advantages.item2Title}</h3>
                  <p className="text-sm text-slate-300 leading-relaxed">{t.advantages.item2Desc}</p>
                </div>
                <div className="bg-[#1E293B]/60 border border-[#334155] p-8 rounded-lg">
                  <div className="w-12 h-12 rounded bg-[#0D3B36] flex items-center justify-center text-emerald-400 font-bold text-xl mb-6">⚓</div>
                  <h3 className="text-xl font-bold text-white mb-3">{t.advantages.item3Title}</h3>
                  <p className="text-sm text-slate-300 leading-relaxed">{t.advantages.item3Desc}</p>
                </div>
              </div>
            </div>
          </section>

          {}
          <section className="py-20 bg-[#0D3B36]/30 border-y border-[#D4AF37]/20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center max-w-3xl mx-auto mb-16">
                <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">{t.corridor.title}</h2>
                <p className="mt-4 text-base text-slate-400">{t.corridor.sub}</p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-8">
                {(['muscat', 'sohar', 'duqm', 'ningbo', 'shenzhen'] as const).map((nodeKey) => (
                  <button
                    key={nodeKey}
                    onClick={() => setSelectedNode(nodeKey)}
                    className={`py-3 px-4 rounded text-xs font-mono font-bold transition-all border ${
                      selectedNode === nodeKey
                        ? 'bg-[#D4AF37] text-[#0A192F] border-[#D4AF37] shadow-lg'
                        : 'bg-[#1E293B] text-slate-300 border-[#334155] hover:border-[#D4AF37]/40'
                    }`}
                  >
                    {t.corridor.nodes[nodeKey].title}
                  </button>
                ))}
              </div>

              <div className="bg-[#0A192F] p-8 rounded-xl border border-[#D4AF37]/40 flex flex-col md:flex-row items-center justify-between gap-6">
                <div>
                  <span className="text-xs font-mono text-[#D4AF37] tracking-widest uppercase">{t.corridor.nodes[selectedNode].role}</span>
                  <h3 className="text-2xl font-bold text-white mt-2">{t.corridor.nodes[selectedNode].title}</h3>
                  <p className="mt-2 text-slate-300 text-sm max-w-2xl">{t.corridor.nodes[selectedNode].desc}</p>
                </div>
                <div className="shrink-0 bg-[#1E293B] px-6 py-4 rounded border border-[#334155] text-center font-mono text-xs">
                  <span className="text-slate-400 block">MACAN CORRIDOR STATUS</span>
                  <span className="text-emerald-400 font-bold text-sm">OPERATIONAL & OPTIMIZED</span>
                </div>
              </div>
            </div>
          </section>
        </main>
      )}

      {}
      {activePage === 'capital' && (
        <main className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
            <div className="text-center max-w-3xl mx-auto">
              <span className="text-xs font-mono text-[#D4AF37] tracking-widest uppercase bg-[#D4AF37]/10 px-3 py-1 rounded">
                MACAN CAPITAL & FDI HUB
              </span>
              <h1 className="text-3xl sm:text-5xl font-extrabold text-white mt-4">{t.capitalPage.heroTitle}</h1>
              <p className="mt-4 text-base text-slate-300">{t.capitalPage.heroSub}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-[#1E293B] p-8 rounded-xl border border-[#334155]">
                <h3 className="text-xl font-bold text-[#D4AF37] mb-3">{t.capitalPage.service1Title}</h3>
                <p className="text-sm text-slate-300 leading-relaxed">{t.capitalPage.service1Desc}</p>
              </div>
              <div className="bg-[#1E293B] p-8 rounded-xl border border-[#334155]">
                <h3 className="text-xl font-bold text-[#D4AF37] mb-3">{t.capitalPage.service2Title}</h3>
                <p className="text-sm text-slate-300 leading-relaxed">{t.capitalPage.service2Desc}</p>
              </div>
              <div className="bg-[#1E293B] p-8 rounded-xl border border-[#334155]">
                <h3 className="text-xl font-bold text-[#D4AF37] mb-3">{t.capitalPage.service3Title}</h3>
                <p className="text-sm text-slate-300 leading-relaxed">{t.capitalPage.service3Desc}</p>
              </div>
            </div>

            <div className="bg-[#0D3B36]/40 p-8 sm:p-12 rounded-2xl border border-[#D4AF37]/40 space-y-6">
              <span className="text-xs font-mono text-emerald-400 tracking-widest">{t.capitalPage.spotlightTitle}</span>
              <h2 className="text-2xl sm:text-3xl font-bold text-white">{t.capitalPage.spotlightProject}</h2>
              <p className="text-sm text-slate-300">{t.capitalPage.spotlightSector}</p>
              <div className="font-mono text-xs text-[#D4AF37] bg-[#0A192F] p-4 rounded border border-[#334155]">
                {t.capitalPage.spotlightStatus}
              </div>
              <button
                onClick={() => openActionModal('Investment Prospectus Download')}
                className="px-6 py-3 bg-[#D4AF37] text-[#0A192F] font-bold rounded hover:opacity-90 text-sm"
              >
                {t.capitalPage.ctaProspectus}
              </button>
            </div>
          </div>
        </main>
      )}

      {}
      {activePage === 'industrial' && (
        <main className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
            <div className="text-center max-w-3xl mx-auto">
              <span className="text-xs font-mono text-[#D4AF37] tracking-widest uppercase bg-[#D4AF37]/10 px-3 py-1 rounded">
                MACAN INDUSTRIAL & EPC ENGINEERING
              </span>
              <h1 className="text-3xl sm:text-5xl font-extrabold text-white mt-4">{t.industrialPage.heroTitle}</h1>
              <p className="mt-4 text-base text-slate-300">{t.industrialPage.heroSub}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-[#1E293B] p-8 rounded-xl border border-[#334155]">
                <h3 className="text-lg font-bold text-white mb-2">{t.industrialPage.cap1Title}</h3>
                <p className="text-sm text-slate-300">{t.industrialPage.cap1Desc}</p>
              </div>
              <div className="bg-[#1E293B] p-8 rounded-xl border border-[#334155]">
                <h3 className="text-lg font-bold text-white mb-2">{t.industrialPage.cap2Title}</h3>
                <p className="text-sm text-slate-300">{t.industrialPage.cap2Desc}</p>
              </div>
              <div className="bg-[#1E293B] p-8 rounded-xl border border-[#334155]">
                <h3 className="text-lg font-bold text-white mb-2">{t.industrialPage.cap3Title}</h3>
                <p className="text-sm text-slate-300">{t.industrialPage.cap3Desc}</p>
              </div>
              <div className="bg-[#1E293B] p-8 rounded-xl border border-[#334155]">
                <h3 className="text-lg font-bold text-white mb-2">{t.industrialPage.cap4Title}</h3>
                <p className="text-sm text-slate-300">{t.industrialPage.cap4Desc}</p>
              </div>
            </div>

            {/* Industrial Spec Upload Form */}
            <div className="bg-[#1E293B] p-8 rounded-xl border border-[#D4AF37]/30 max-w-3xl mx-auto space-y-6">
              <h2 className="text-2xl font-bold text-white text-center">{t.industrialPage.formTitle}</h2>
              <form onSubmit={(e) => { e.preventDefault(); openActionModal('Technical Spec Upload'); }} className="space-y-4">
                <div>
                  <label className="block text-xs text-slate-300 mb-1">{t.industrialPage.formProjectLabel}</label>
                  <input type="text" placeholder="e.g. Steel Pipe Fabrication Plant" required className="w-full bg-[#0A192F] border border-[#334155] rounded px-4 py-2.5 text-sm text-white" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-slate-300 mb-1">{t.industrialPage.formLandLabel}</label>
                    <input type="number" placeholder="50000" required className="w-full bg-[#0A192F] border border-[#334155] rounded px-4 py-2.5 text-sm text-white" />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-300 mb-1">{t.industrialPage.formFreezoneLabel}</label>
                    <select className="w-full bg-[#0A192F] border border-[#334155] rounded px-4 py-2.5 text-sm text-white">
                      <option>Sohar Freezone</option>
                      <option>Duqm SEZ</option>
                      <option>Salalah Freezone</option>
                    </select>
                  </div>
                </div>
                <div className="border-2 border-dashed border-[#334155] p-6 rounded text-center cursor-pointer hover:border-[#D4AF37]/50">
                  <span className="text-xs text-slate-400 font-mono">{t.industrialPage.formUploadBtn}</span>
                </div>
                <button type="submit" className="w-full py-3.5 bg-gradient-to-r from-[#D4AF37] to-[#AA7C11] text-[#0A192F] font-bold rounded text-sm">
                  {t.industrialPage.formSubmitBtn}
                </button>
              </form>
            </div>
          </div>
        </main>
      )}

      {}
      {activePage === 'trade' && (
        <main className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
            <div className="text-center max-w-3xl mx-auto">
              <span className="text-xs font-mono text-[#D4AF37] tracking-widest uppercase bg-[#D4AF37]/10 px-3 py-1 rounded">
                MACAN TRADE & LOGISTICS LINE
              </span>
              <h1 className="text-3xl sm:text-5xl font-extrabold text-white mt-4">{t.tradePage.heroTitle}</h1>
              <p className="mt-4 text-base text-slate-300">{t.tradePage.heroSub}</p>
            </div>

            {/* Direct Route Specs Card */}
            <div className="bg-[#1E293B] p-8 rounded-xl border border-[#D4AF37]/30 space-y-6">
              <h2 className="text-xl font-bold text-[#D4AF37] font-mono">{t.tradePage.routeTitle}</h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 font-mono text-xs">
                <div className="bg-[#0A192F] p-4 rounded border border-[#334155]">
                  <span className="text-slate-400 block">{t.tradePage.transitTimeLabel}</span>
                  <span className="text-emerald-400 font-bold text-base">12 - 14 Days Direct</span>
                </div>
                <div className="bg-[#0A192F] p-4 rounded border border-[#334155]">
                  <span className="text-slate-400 block">{t.tradePage.originsLabel}</span>
                  <span className="text-white font-bold">Shanghai, Ningbo, Shenzhen</span>
                </div>
                <div className="bg-[#0A192F] p-4 rounded border border-[#334155]">
                  <span className="text-slate-400 block">{t.tradePage.destsLabel}</span>
                  <span className="text-white font-bold">Sohar Port, Duqm SEZ, Salalah</span>
                </div>
                <div className="bg-[#0A192F] p-4 rounded border border-[#334155]">
                  <span className="text-slate-400 block">{t.tradePage.modesLabel}</span>
                  <span className="text-[#D4AF37] font-bold">FCL, LCL, Breakbulk Cargo</span>
                </div>
              </div>
            </div>

            {/* Instant Freight Calculator */}
            <div className="bg-[#1E293B] p-8 rounded-xl border border-[#334155] max-w-3xl mx-auto space-y-6">
              <h2 className="text-2xl font-bold text-white text-center">{t.tradePage.calcTitle}</h2>
              <form onSubmit={calculateFreightRate} className="space-y-4">
                <div>
                  <label className="block text-xs text-slate-300 mb-1">{t.tradePage.calcContainerType}</label>
                  <select 
                    value={freightType} 
                    onChange={(e) => setFreightType(e.target.value)}
                    className="w-full bg-[#0A192F] border border-[#334155] rounded px-4 py-2.5 text-sm text-white"
                  >
                    <option value="40ft High Cube Container">40ft High Cube Dry Container (FCL)</option>
                    <option value="20ft Standard Container">20ft Standard Dry Container (FCL)</option>
                    <option value="Breakbulk Heavy Machinery">Heavy Machinery Breakbulk / Open Top</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-slate-300 mb-1">{t.tradePage.calcWeight}</label>
                  <input 
                    type="number" 
                    min="1" 
                    max="50" 
                    value={freightQty} 
                    onChange={(e) => setFreightQty(Number(e.target.value))}
                    className="w-full bg-[#0A192F] border border-[#334155] rounded px-4 py-2.5 text-sm text-white" 
                  />
                </div>
                <button type="submit" className="w-full py-3.5 bg-gradient-to-r from-[#D4AF37] to-[#AA7C11] text-[#0A192F] font-bold rounded text-sm">
                  {t.tradePage.calcEstimateBtn}
                </button>
              </form>

              {freightCost !== null && (
                <div className="bg-[#0A192F] p-6 rounded border border-emerald-500/40 text-center font-mono space-y-2">
                  <span className="text-xs text-slate-400">{t.tradePage.calcResultLabel}</span>
                  <div className="text-3xl font-extrabold text-emerald-400">${freightCost.toLocaleString()} USD</div>
                  <span className="text-[10px] text-slate-400 block">* Includes Oman Port Clearance & Direct Vessel Booking</span>
                </div>
              )}
            </div>
          </div>
        </main>
      )}

      {}
      <section id="calculator" className="py-20 bg-[#0A192F] border-t border-[#1E293B]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">{t.calculator.title}</h2>
            <p className="mt-3 text-sm text-slate-400">{t.calculator.sub}</p>
          </div>

          <div className="bg-[#1E293B] p-8 rounded-xl border border-[#334155] space-y-6">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-2">{t.calculator.typeLabel}</label>
              <select
                value={calcPillar}
                onChange={(e) => setCalcPillar(e.target.value as any)}
                className="w-full bg-[#0A192F] border border-[#334155] rounded px-4 py-2.5 text-sm text-white"
              >
                <option value="capital">{t.calculator.typeOptions.capital}</option>
                <option value="industrial">{t.calculator.typeOptions.industrial}</option>
                <option value="logistics">{t.calculator.typeOptions.logistics}</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-2">{t.calculator.locationLabel}</label>
              <select
                value={calcLocation}
                onChange={(e) => setCalcLocation(e.target.value)}
                className="w-full bg-[#0A192F] border border-[#334155] rounded px-4 py-2.5 text-sm text-white"
              >
                <option value="Sohar Freezone">Sohar Freezone (Industrial Port)</option>
                <option value="Duqm SEZ">Duqm Special Economic Zone (Deepwater Hub)</option>
                <option value="Salalah Freezone">Salalah Freezone (Southern GCC Corridor)</option>
              </select>
            </div>

            <div>
              <div className="flex justify-between text-xs text-slate-300 mb-2">
                <span>{t.calculator.metricLabel}</span>
                <span className="text-[#D4AF37] font-bold font-mono">{calcValue} Units / $M</span>
              </div>
              <input
                type="range"
                min="10"
                max="500"
                value={calcValue}
                onChange={(e) => setCalcValue(Number(e.target.value))}
                className="w-full accent-[#D4AF37] cursor-pointer"
              />
            </div>

            {calcResult && (
              <div className="bg-[#0A192F] p-6 rounded border border-[#D4AF37]/30 grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-xs">
                <div>
                  <span className="text-slate-400 block">{t.calculator.estTransit}</span>
                  <span className="text-white font-bold text-sm">{calcResult.transit}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">{t.calculator.estTax}</span>
                  <span className="text-emerald-400 font-bold text-sm">{calcResult.tax}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">{t.calculator.estSupport}</span>
                  <span className="text-[#D4AF37] font-bold text-sm">{calcResult.support}</span>
                </div>
              </div>
            )}

            <button
              onClick={handleCalculate}
              className="w-full py-3.5 rounded bg-gradient-to-r from-[#D4AF37] to-[#AA7C11] text-[#0A192F] font-bold text-sm hover:opacity-95 transition-opacity shadow-lg"
            >
              {t.calculator.calculateBtn}
            </button>
          </div>
        </div>
      </section>

      {}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-[#1E293B] border border-[#D4AF37]/50 p-8 rounded-xl max-w-md w-full relative space-y-6">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white font-mono text-lg"
            >
              ✕
            </button>
            <h3 className="text-xl font-bold text-white">{modalTitle}</h3>

            {modalSubmitted ? (
              <div className="text-center py-6 font-mono space-y-3">
                <div className="text-3xl">✅</div>
                <div className="text-emerald-400 font-bold text-sm">Request Transmitted to Muscat HQ</div>
                <p className="text-xs text-slate-300">A Macan Group sovereign investment advisor will contact you within 24 hours.</p>
              </div>
            ) : (
              <form onSubmit={(e) => { e.preventDefault(); setModalSubmitted(true); }} className="space-y-4">
                <div>
                  <label className="block text-xs text-slate-300 mb-1">Corporate Representative Name</label>
                  <input type="text" required className="w-full bg-[#0A192F] border border-[#334155] rounded px-3 py-2 text-sm text-white" />
                </div>
                <div>
                  <label className="block text-xs text-slate-300 mb-1">Corporate Email Address</label>
                  <input type="email" required className="w-full bg-[#0A192F] border border-[#334155] rounded px-3 py-2 text-sm text-white" />
                </div>
                <div>
                  <label className="block text-xs text-slate-300 mb-1">Company / Sovereign Fund Name</label>
                  <input type="text" required className="w-full bg-[#0A192F] border border-[#334155] rounded px-3 py-2 text-sm text-white" />
                </div>
                <button type="submit" className="w-full py-3 bg-[#D4AF37] text-[#0A192F] font-bold rounded text-sm hover:opacity-90">
                  Submit Official Request
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {}
      <footer className="bg-[#0A192F] border-t border-[#1E293B] py-16 text-slate-400 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-2 space-y-4">
              <div className="flex items-center space-x-3 rtl:space-x-reverse">
                <div className="w-8 h-8 rounded bg-[#D4AF37] flex items-center justify-center font-bold text-[#0A192F]">
                  M
                </div>
                <span className="font-bold text-white text-base">MACAN GROUP</span>
              </div>
              <p className="text-slate-300 max-w-md leading-relaxed">{t.footer.hq}</p>
              <div className="font-mono text-slate-400">{t.footer.cr}</div>
            </div>

            <div>
              <h4 className="text-white font-bold mb-3">{t.footer.domainsTitle}</h4>
              <ul className="space-y-2 font-mono text-slate-300">
                <li><button onClick={() => setActivePage('index')} className="hover:text-[#D4AF37]">macangroup.com</button></li>
                <li><button onClick={() => setActivePage('capital')} className="hover:text-[#D4AF37]">macancapital.com</button></li>
                <li><button onClick={() => setActivePage('industrial')} className="hover:text-[#D4AF37]">macanindustrial.com</button></li>
                <li><button onClick={() => setActivePage('trade')} className="hover:text-[#D4AF37]">macantrade.com</button></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold mb-3">Oman Port Terminals</h4>
              <ul className="space-y-2 text-slate-300">
                <li>Sohar Port & Freezone</li>
                <li>Duqm SEZ Deepwater Port</li>
                <li>Salalah Maritime Hub</li>
                <li>Sultan Qaboos Port Muscat</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-[#1E293B] pt-8 flex flex-col sm:flex-row items-center justify-between text-slate-500">
            <div>{t.footer.rights}</div>
            <div className="mt-4 sm:mt-0 space-x-6 rtl:space-x-reverse">
              <a href="#" className="hover:text-slate-300">Privacy Policy</a>
              <a href="#" className="hover:text-slate-300">Sovereign Compliance</a>
              <a href="#" className="hover:text-slate-300">Terms of Investment</a>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}