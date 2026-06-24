import { Scene } from '../types';

export const SCENES: Scene[] = [
  {
    id: 'ordering-coffee',
    title: 'Ordering Coffee at Starbucks',
    titleZh: '星巴克点咖啡',
    category: 'Daily Life',
    difficulty: 'Beginner',
    duration: '5 min',
    emoji: '☕',
    description: '练习在繁忙的纽约咖啡店点你喜欢的饮品、选杯型、加奶及结账。',
    aiRole: 'a friendly and fast-paced barista at a busy Starbucks in Manhattan',
    aiRoleZh: '热情而高效的星巴克咖啡师',
    aiFirstMessage: "Hi there! Welcome to Starbucks. What can I get started for you today?",
    sampleDialogue: [
      { role: 'ai', text: "Hi there! Welcome to Starbucks. What can I get started for you today?", translation: "你好！欢迎来到星巴克。今天想喝点什么？" },
      { role: 'user', text: "Hi, I'd like an iced oat milk latte, please.", translation: "你好，请给我来一杯冰燕麦拿铁。" },
      { role: 'ai', text: "Sure thing! What size would you like for that iced oat milk latte?", translation: "没问题！冰燕麦拿铁要什么杯型呢？" },
      { role: 'user', text: "Grande, please. And could you add an extra shot of espresso?", translation: "大杯，谢谢。可以再额外加一份浓缩咖啡吗？" },
      { role: 'ai', text: "Got it, Grande iced oat latte with an extra shot. That'll be $6.85. Are you paying with your phone or card?", translation: "好的，大杯冰燕麦拿铁加浓缩。一共6.85美元。手机支付还是刷卡？" },
      { role: 'user', text: "I'll pay with Apple Pay. Here you go.", translation: "我用 Apple Pay 支付。给你。" }
    ],
    vocabulary: [
      { word: 'oat milk', meaning: '燕麦奶', example: "Can I substitute dairy milk with oat milk?" },
      { word: 'Grande', meaning: '星巴克大杯（16盎司）', example: "I usually get a Grande cold brew." },
      { word: 'extra shot', meaning: '额外加一份浓缩咖啡', example: "I need an extra shot of espresso today." },
      { word: 'substitute', meaning: '替换 / 代替', example: "Can I substitute regular syrup with sugar-free syrup?" }
    ],
    hints: [
      "I'd like a medium Americano, please.",
      "Can I get an iced caramel macchiato with low fat milk?",
      "How much is extra vanilla syrup?"
    ]
  },
  {
    id: 'asking-directions',
    title: 'Asking for Directions in NYC',
    titleZh: '在纽约街头问路',
    category: 'Travel',
    difficulty: 'Beginner',
    duration: '5 min',
    emoji: '🗺️',
    description: '地铁站出口迷路了，向友善的本地路人询问如何走到帝国大厦或中央公园。',
    aiRole: 'a helpful New York local walking their dog on 5th Avenue',
    aiRoleZh: '在第五大道遛狗的热心纽约本地路人',
    aiFirstMessage: "Hey! You look a bit lost. Do you need help finding somewhere?",
    sampleDialogue: [
      { role: 'ai', text: "Hey! You look a bit lost. Do you need help finding somewhere?", translation: "嘿！你看起来有点迷路。需要帮忙找地方吗？" },
      { role: 'user', text: "Oh, hi! Yes, actually. I'm trying to find the Empire State Building.", translation: "哦，你好！是的，我正在找帝国大厦。" },
      { role: 'ai', text: "You're pretty close! Just walk straight down 5th Avenue for two blocks, then turn right on 34th Street.", translation: "离这很近！沿着第五大道直走两过两个街区，然后在34街右转。" },
      { role: 'user', text: "Two blocks straight, then right on 34th. About how long of a walk is that?", translation: "直走两个街区，然后34街右转。大概要走多久？" },
      { role: 'ai', text: "It's only about a five-minute walk. You can't miss it, it's the tallest building around here!", translation: "大概只需要走5分钟。你肯定不会错过，那是附近最高的楼！" },
      { role: 'user', text: "Thank you so much! Have a great day.", translation: "非常感谢！祝你今天愉快。" }
    ],
    vocabulary: [
      { word: 'walk straight', meaning: '直走', example: "Just walk straight down this street." },
      { word: 'block', meaning: '街区', example: "The museum is three blocks away." },
      { word: "You can't miss it", meaning: '你肯定能找到（非常醒目）', example: "It's right next to the big red statue, you can't miss it." },
      { word: 'landmark', meaning: '地标建筑', example: "The Empire State Building is a famous NYC landmark." }
    ],
    hints: [
      "Excuse me, is this the right way to Central Park?",
      "Could you show me on Google Maps?",
      "Which subway line should I take from here?"
    ]
  },
  {
    id: 'work-introduction',
    title: 'Introducing Yourself at a Meeting',
    titleZh: '职场会议自我介绍',
    category: 'Workplace',
    difficulty: 'Intermediate',
    duration: '7 min',
    emoji: '💼',
    description: '第一天加入跨国团队的线上协作周会，向新项目经理及同事介绍你的职责与背景。',
    aiRole: 'a welcoming American Senior Project Manager running a team sync meeting',
    aiRoleZh: '主持团队同步会的资深美籍项目经理',
    aiFirstMessage: "Welcome to our weekly sync everyone! I see we have our new software developer joining us today. Would you like to introduce yourself to the team?",
    sampleDialogue: [
      { role: 'ai', text: "Welcome to our weekly sync everyone! I see we have our new software developer joining us today. Would you like to introduce yourself to the team?", translation: "欢迎大家参加周会！今天有新加入的软件工程师。你想跟团队做个自我介绍吗？" },
      { role: 'user', text: "Thanks Sarah! Hi everyone, I'm Alex. I just joined as a frontend developer.", translation: "谢谢 Sarah！大家好，我是 Alex，刚作为前端工程师加入团队。" },
      { role: 'ai', text: "Awesome to have you here, Alex! Where are you dialing in from, and what were you working on before?", translation: "太棒了 Alex！你现在是从哪里连线的？之前主要负责什么工作呢？" },
      { role: 'user', text: "I'm based in Shanghai. Before this, I worked primarily on React e-commerce web applications.", translation: "我在上海办公。在此之前，我主要负责基于 React 的电商 Web 应用开发。" },
      { role: 'ai', text: "That React experience is going to be super valuable for our upcoming dashboard redesign. Looking forward to working with you!", translation: "React 经验对我们接下来的后台重构太有价值了。期待与你合作！" },
      { role: 'user', text: "Thank you! I'm really excited to dive in and collaborate with everyone.", translation: "谢谢！我很期待能尽快上手并和大家合作。" }
    ],
    vocabulary: [
      { word: 'weekly sync', meaning: '每周同步会', example: "Let's discuss this tomorrow during our weekly sync." },
      { word: 'dial in', meaning: '远程连线接入会议', example: "I will dial in from home today." },
      { word: 'primarily', meaning: '主要地', example: "Our team focuses primarily on mobile user experience." },
      { word: 'dive in', meaning: '迅速投入/开始做', example: "I'm ready to dive in and review the codebase." }
    ],
    hints: [
      "Hi everyone, I'm thrilled to be part of this team.",
      "My background is mainly in data analysis and product management.",
      "Please feel free to reach out to me anytime on Slack."
    ]
  },
  {
    id: 'hotel-checkin',
    title: 'Checking into a Hotel',
    titleZh: '酒店前台办理入住',
    category: 'Travel',
    difficulty: 'Beginner',
    duration: '5 min',
    emoji: '🏨',
    description: '长途飞行后到达洛杉矶酒店，办理入住登记、询问早餐时间及延迟退房政策。',
    aiRole: 'a polite front desk receptionist at a 4-star downtown hotel in Los Angeles',
    aiRoleZh: '洛杉矶市中心四星级酒店礼貌的前台接待员',
    aiFirstMessage: "Good afternoon! Welcome to the Grand Plaza Hotel. How can I assist you today?",
    sampleDialogue: [
      { role: 'ai', text: "Good afternoon! Welcome to the Grand Plaza Hotel. How can I assist you today?", translation: "下午好！欢迎来到格兰德广场酒店。今天有什么我可以帮您的？" },
      { role: 'user', text: "Hi, I have a reservation under the name David Wang.", translation: "你好，我预订了房间，名字是 David Wang。" },
      { role: 'ai', text: "Wonderful, let me pull that up. Yes, a king room for three nights. May I see your passport and a credit card for incidentals?", translation: "好的，我来查询一下。查到了，一张大床房住三晚。请问可以出示您的护照和杂费授权信用卡吗？" },
      { role: 'user', text: "Sure, here's my passport and Visa card. By the way, what time is breakfast served?", translation: "没问题，这是护照和 Visa 卡。顺便问下，早餐几点供应？" },
      { role: 'ai', text: "Breakfast is served from 6:30 to 10:00 AM on the second floor. Here are your room keys, you're in room 1408.", translation: "早餐早上6:30到10:00在二楼供应。这是您的房卡，房间号是1408。" },
      { role: 'user', text: "Great, thanks! Is it possible to request a late checkout on my last day?", translation: "太好了，谢谢！请问最后一天可以申请延迟退房吗？" }
    ],
    vocabulary: [
      { word: 'reservation', meaning: '预订', example: "I'd like to cancel my hotel reservation." },
      { word: 'incidentals', meaning: '杂费 / 押金授权', example: "We require a $50 deposit per night for incidentals." },
      { word: 'late checkout', meaning: '延迟退房', example: "As a member, you get complimentary late checkout until 2 PM." },
      { word: 'complimentary', meaning: '免费赠送的', example: "The hotel offers complimentary Wi-Fi for all guests." }
    ],
    hints: [
      "Could I get a room on a higher floor away from the elevator?",
      "Do you have a luggage storage service?",
      "What is the Wi-Fi password?"
    ]
  },
  {
    id: 'neighbor-smalltalk',
    title: 'Chatting with a Neighbor',
    titleZh: '电梯偶遇邻居闲聊',
    category: 'Social',
    difficulty: 'Beginner',
    duration: '5 min',
    emoji: '👋',
    description: '周末早上在公寓电梯里遇到搬来不久的邻居，轻松寒暄天气、周末计划与社区好店。',
    aiRole: 'a cheerful neighbor who loves cooking and hiking living on the same floor',
    aiRoleZh: '住在同一层、喜欢烹饪和徒步的开朗邻居',
    aiFirstMessage: "Morning! Gorgeous weather today, isn't it? Heading out for a walk?",
    sampleDialogue: [
      { role: 'ai', text: "Morning! Gorgeous weather today, isn't it? Heading out for a walk?", translation: "早上好！今天天气真棒，不是吗？打算出去散散步？" },
      { role: 'user', text: "Morning! Yes, finally some sunshine. I'm just heading to the grocery store.", translation: "早上好！是啊，总算算有阳光了。我正打算去趟杂货店。" },
      { role: 'ai', text: "Oh nice! Are you going to Trader Joe's around the corner? Their seasonal snacks right now are amazing.", translation: "太棒了！你是去转角那家 Trader Joe's 吗？他们现在的应季零食绝了。" },
      { role: 'user', text: "Actually I haven't been there yet! Anything specific you recommend?", translation: "其实我还没去过那家！你有什么特别推荐的吗？" },
      { role: 'ai', text: "Definitely try their dark chocolate peanut butter cups and the frozen croissants. You won't regret it!", translation: "一定要尝尝他们的黑巧花生酱杯和冷冻牛角包。绝对不会后悔！" },
      { role: 'user', text: "That sounds delicious, I'll definitely check them out. Thanks for the tip!", translation: "听起来太好吃了，我一定去看看。谢谢推荐！" }
    ],
    vocabulary: [
      { word: 'Gorgeous', meaning: '极其漂亮的 / 天气极好的', example: "What a gorgeous view from your balcony!" },
      { word: 'around the corner', meaning: '就在附近 / 转角处', example: "There is a great pharmacy just around the corner." },
      { word: 'tip', meaning: '实用建议 / 提示', example: "Do you have any insider tips for visiting Hawaii?" },
      { word: 'check out', meaning: '去看看 / 体验', example: "You should check out the new bakery downtown." }
    ],
    hints: [
      "Did you catch the basketball game last night?",
      "Do you know if the building gym is open 24/7?",
      "Have a wonderful weekend!"
    ]
  },
  {
    id: 'airport-checkin',
    title: 'Checking Baggage at Airport',
    titleZh: '机场柜台托运行李',
    category: 'Travel',
    difficulty: 'Intermediate',
    duration: '6 min',
    emoji: '✈️',
    description: '在国际出发航站楼办理登机牌，沟通托运行李超重处理及靠窗座位偏好。',
    aiRole: 'an airline check-in agent at San Francisco International Airport',
    aiRoleZh: '旧金山国际机场航空公司值机柜台专员',
    aiFirstMessage: "Hello, flying to Tokyo today? Please place your check-in luggage on the scale.",
    sampleDialogue: [
      { role: 'ai', text: "Hello, flying to Tokyo today? Please place your check-in luggage on the scale.", translation: "您好，今天飞往东京吗？请将托运行李放在称上。" },
      { role: 'user', text: "Hi, yes. Here is my booking reference. I have two bags to check in.", translation: "你好，是的。这是我的订票预订码。我有两件行李要托运。" },
      { role: 'ai', text: "Let's see... Your first bag is 22 kilograms, which is fine. But this second one is slightly over the limit at 25 kilos.", translation: "看一下... 第一件22公斤，没问题。但第二件稍微超重了，是25公斤。" },
      { role: 'user', text: "Oh really? Can I take a heavy jacket out and put it in my carry-on bag?", translation: "哦真的吗？我可以拿出一件厚外套放到随身登机包里吗？" },
      { role: 'ai', text: "Absolutely, take your time. Also, would you prefer an aisle seat or a window seat for the long flight?", translation: "当然可以，您慢慢弄。另外，长途飞行您更喜欢过道座还是靠窗座？" },
      { role: 'user', text: "I'd love an exit row window seat if there's any available.", translation: "如果有紧急出口靠窗位就太好了。" }
    ],
    vocabulary: [
      { word: 'scale', meaning: '称重称', example: "Put your suitcase on the scale, please." },
      { word: 'over the limit', meaning: '超过限额/重量', example: "Make sure your baggage isn't over the limit." },
      { word: 'carry-on', meaning: '随身行李 / 登机包', example: "Liquids over 100ml are not allowed in your carry-on." },
      { word: 'aisle seat', meaning: '靠过道的座位', example: "I prefer an aisle seat so I can stretch my legs." }
    ],
    hints: [
      "Can I tag this bag all the way to my final destination?",
      "Is flight UA888 departing on time?",
      "Where is the security check entrance?"
    ]
  },
  {
    id: 'doctor-visit',
    title: 'Seeing a Doctor for a Cold',
    titleZh: '诊所看诊感冒发烧',
    category: 'Daily Life',
    difficulty: 'Intermediate',
    duration: '6 min',
    emoji: '🩺',
    description: '喉咙痛伴随轻微咳嗽两天了，去社区诊所向全科医生描述症状并询问用药注意事项。',
    aiRole: 'a patient and gentle General Practitioner at an urgent care clinic',
    aiRoleZh: '急诊诊所耐心温和的全科医生',
    aiFirstMessage: "Hello, come on in and take a seat. What brings you to the clinic today?",
    sampleDialogue: [
      { role: 'ai', text: "Hello, come on in and take a seat. What brings you to the clinic today?", translation: "你好，请进坐下吧。今天哪方哪里不舒服？" },
      { role: 'user', text: "Doctor, I've had a sore throat and a runny nose since Monday morning.", translation: "医生，我从周一早上开始就喉咙痛还流鼻涕。" },
      { role: 'ai', text: "I see. Have you been running a fever or experiencing any body aches?", translation: "了解了。您有发烧或感到全身酸痛吗？" },
      { role: 'user', text: "I had a low fever last night around 37.8 degrees, but it went down after I took some Advil.", translation: "昨晚有37.8度左右的低烧，不过吃了布洛芬后退烧了。" },
      { role: 'ai', text: "That sounds like a typical seasonal viral infection. Let me check your throat... Yes, a bit red. Are you allergic to any medications?", translation: "听起来像典型的季节性病毒感染。检查下喉咙... 是有点红。您对什么药物过敏吗？" },
      { role: 'user', text: "No penicillin allergies that I know of. Should I take antibiotics?", translation: "据我所知不对青霉素过敏。我需要吃抗生素吗？" }
    ],
    vocabulary: [
      { word: 'sore throat', meaning: '喉咙痛', example: "Drinking warm honey water helps with a sore throat." },
      { word: 'runny nose', meaning: '流鼻涕', example: "My allergies give me a constant runny nose." },
      { word: 'run a fever', meaning: '发烧', example: "If you run a fever over 38.5, call the clinic." },
      { word: 'allergic', meaning: '过敏的', example: "Please let us know if you are allergic to peanuts." }
    ],
    hints: [
      "Do I need a prescription for this cough syrup?",
      "How many days should I rest at home?",
      "Can I get a sick leave note for my employer?"
    ]
  },
  {
    id: 'store-return',
    title: 'Returning an Item at a Store',
    titleZh: '商场客服台退换货',
    category: 'Daily Life',
    difficulty: 'Beginner',
    duration: '5 min',
    emoji: '🛍️',
    description: '刚买的外套尺码偏大且扣子松动，前往服装店客服台办理退款或更换合适尺码。',
    aiRole: 'a professional customer service representative at a retail clothing store',
    aiRoleZh: '服装零售店专业的客户服务代表',
    aiFirstMessage: "Hi there! Welcome to customer service. Are you making a return or an exchange today?",
    sampleDialogue: [
      { role: 'ai', text: "Hi there! Welcome to customer service. Are you making a return or an exchange today?", translation: "你好！欢迎来到客服台。今天是要办理退货还是换货？" },
      { role: 'user', text: "Hi, I'd like to return this jacket. It's a bit too baggy on me.", translation: "你好，我想退掉这件夹克。穿我身上有点太肥大了。" },
      { role: 'ai', text: "No problem at all! Do you happen to have the original receipt and the price tags attached?", translation: "完全没问题！请问您带了购物小票，吊牌还在衣服上吗？" },
      { role: 'user', text: "Yes, here is the receipt. I bought it three days ago.", translation: "带了，这是小票。三天前买的。" },
      { role: 'ai', text: "Perfect. Would you like a refund back to your credit card, or would you prefer store credit?", translation: "完美。您希望原路退款到信用卡，还是换成门店购物额度？" },
      { role: 'user', text: "Please refund it to my credit card. How long does the transaction take?", translation: "请退款到我的信用卡。退款转账大概需要多久到账？" }
    ],
    vocabulary: [
      { word: 'baggy', meaning: '宽松松垮的 / 肥大的', example: "Baggy jeans are very trendy right now." },
      { word: 'receipt', meaning: '购物收据小票', example: "Keep your receipt in case you need to return it." },
      { word: 'refund', meaning: '退款', example: "You are eligible for a full refund within 30 days." },
      { word: 'store credit', meaning: '门店购物卡额度', example: "They gave me store credit instead of cash." }
    ],
    hints: [
      "Can I exchange this for a medium size in black?",
      "The zipper got stuck the first time I wore it.",
      "Can you check if another branch has this in stock?"
    ]
  },
  {
    id: 'restaurant-ordering',
    title: 'Ordering Dinner at a Restaurant',
    titleZh: '餐厅点餐与询问推荐',
    category: 'Social',
    difficulty: 'Beginner',
    duration: '5 min',
    emoji: '🍽️',
    description: '与朋友去一家颇受欢迎的意式牛排餐厅吃晚餐，询问招牌主菜、忌口避雷与甜品。',
    aiRole: 'an energetic waiter at a popular Italian steakhouse',
    aiRoleZh: '人气的意大利牛排馆活力满满的服务生',
    aiFirstMessage: "Good evening folks! Are we ready to order, or do we need a few more minutes with the menu?",
    sampleDialogue: [
      { role: 'ai', text: "Good evening folks! Are we ready to order, or do we need a few more minutes with the menu?", translation: "晚上好各位！现在点餐还是再看几分钟菜单？" },
      { role: 'user', text: "We're ready! What is your signature dish for tonight?", translation: "我们看好了！今晚有什么招牌推荐菜吗？" },
      { role: 'ai', text: "Our truffle mushroom risotto is phenomenal tonight, and the ribeye steak is cooked to perfection.", translation: "今晚我们的松露蘑菇烩饭绝赞，肋眼牛排也烤得火候刚好。" },
      { role: 'user', text: "That ribeye sounds great. I'll have that medium-rare, please.", translation: "肋眼听起来不错。我要一份五分熟的，谢谢。" },
      { role: 'ai', text: "Medium-rare ribeye, excellent choice. Does that come with garlic mashed potatoes or grilled asparagus?", translation: "五分熟肋眼，极佳的选择。配菜选蒜香土豆泥还是烤芦笋呢？" },
      { role: 'user', text: "Let's go with the asparagus. Also, could we get a pitcher of tap water?", translation: "选芦笋吧。另外，可以给我们来一壶直饮自来水吗？" }
    ],
    vocabulary: [
      { word: 'signature dish', meaning: '招牌菜', example: "The Peking Duck is this restaurant's signature dish." },
      { word: 'medium-rare', meaning: '五分熟（牛排）', example: "I always order my steak medium-rare." },
      { word: 'pitcher', meaning: '大水壶', example: "We ordered a pitcher of iced tea for the table." },
      { word: 'phenomenal', meaning: '了不起的 / 非凡赞叹的', example: "The service at this resort was phenomenal." }
    ],
    hints: [
      "Could we get the dressing on the side?",
      "Does this pasta contain any dairy products?",
      "Can we split the bill evenly?"
    ]
  },
  {
    id: 'party-networking',
    title: 'Making Small Talk at a Party',
    titleZh: '社交聚会自来熟破冰',
    category: 'Social',
    difficulty: 'Intermediate',
    duration: '6 min',
    emoji: '🥂',
    description: '在朋友举办的周末屋顶露台派对上，端着饮料与站在餐台旁边的陌生嘉宾轻松搭讪。',
    aiRole: 'an outgoing marketing director standing by the snack table at a house party',
    aiRoleZh: '站在聚会派对零食台旁的开朗市场总监',
    aiFirstMessage: "Hey! These guacamole chips are dangerously addictive. I'm Mark, by the way. How do you know the host?",
    sampleDialogue: [
      { role: 'ai', text: "Hey! These guacamole chips are dangerously addictive. I'm Mark, by the way. How do you know the host?", translation: "嘿！这些牛油果酱脆片太让人上瘾了。顺便说下我是 Mark。你跟屋主是怎么认识的？" },
      { role: 'user', text: "Haha they really are! I'm Chris. Leo and I went to college together.", translation: "哈哈确实是！我是 Chris。我和 Leo 是大学同学。" },
      { role: 'ai', text: "No way, you went to NYU too? Small world! What do you do when you're not hanging out on rooftops?", translation: "不会吧，你也是纽大毕业的？世界真小！不逛屋顶派对的时候你平时做些什么？" },
      { role: 'user', text: "I work as a UI designer at a tech startup. What about you?", translation: "我在一家科技初创公司做 UI 设计师。你呢？" },
      { role: 'ai', text: "I do brand marketing for an outdoor gear company. We actually work with a lot of designers!", translation: "我在一家户外品牌做品牌营销。其实我们和很多设计师都有合作！" },
      { role: 'user', text: "That's awesome! I love hiking and camping whenever I get free time.", translation: "太棒了！只要有空闲时间我就喜欢徒步和露营。" }
    ],
    vocabulary: [
      { word: 'addictive', meaning: '令人上瘾的', example: "This mobile game is strangely addictive." },
      { word: 'Small world', meaning: '世界真小（巧遇感慨）', example: "You know my cousin Kevin? What a small world!" },
      { word: 'hang out', meaning: '日常放松聚会闲逛', example: "Where do college students hang out around here?" },
      { word: 'startup', meaning: '初创企业', example: "She left her corporate job to join an AI startup." }
    ],
    hints: [
      "Have you tried the special cocktail punch over there?",
      "How long have you lived in this city?",
      "Are you traveling anywhere exciting this summer?"
    ]
  }
];
