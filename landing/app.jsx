/* eslint-disable */
const { useState, useEffect, useRef, useMemo } = React;

/* ============ HOOKS ============ */
function useInView(threshold = 0.15){
  const ref = useRef(null);
  const [seen, setSeen] = useState(false);
  useEffect(()=>{
    if(!ref.current) return;
    const io = new IntersectionObserver((entries)=>{
      entries.forEach(e => {
        if(e.isIntersecting){ setSeen(true); io.disconnect(); }
      });
    },{threshold});
    io.observe(ref.current);
    return ()=> io.disconnect();
  },[]);
  return [ref, seen];
}

function CountUp({ to, duration = 1400, suffix = "", prefix = "" }){
  const [val, setVal] = useState(0);
  const [ref, seen] = useInView(0.4);
  useEffect(()=>{
    if(!seen) return;
    const start = performance.now();
    let raf;
    const tick = (t) => {
      const p = Math.min(1, (t - start) / duration);
      const eased = 1 - Math.pow(1-p, 3);
      setVal(Math.round(to * eased));
      if(p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return ()=> cancelAnimationFrame(raf);
  },[seen, to, duration]);
  return <span ref={ref}>{prefix}{val.toLocaleString()}{suffix}</span>;
}

function FadeUp({ children, delay = 0, as: Tag = 'div', className = '', ...rest }){
  const [ref, seen] = useInView();
  return (
    <Tag ref={ref} className={`fade-up d${delay} ${seen?'in':''} ${className}`} {...rest}>
      {children}
    </Tag>
  );
}

/* ============ NAV ============ */
function Nav({ onCmdK }){
  const [scrolled, setScrolled] = useState(false);
  useEffect(()=>{
    const h = ()=> setScrolled(window.scrollY > 30);
    h();
    window.addEventListener('scroll', h, { passive: true });
    return ()=> window.removeEventListener('scroll', h);
  },[]);
  return (
    <nav className={`nav ${scrolled?'scrolled':''}`}>
      <div className="nav-inner">
        <a className="brand" href="#top">
          <span className="brand-mark">语</span>
          <span className="brand-name">AI 不止语</span>
          <span className="brand-sub">/ jnMetaCode</span>
        </a>
        <div className="nav-links" style={{display:'none'}} />
        <div style={{display:'flex',gap:18,alignItems:'center'}}>
          <a className="nav-link-d" href="#products">内容产品</a>
          <a className="nav-link-d" href="#repos">开源矩阵</a>
          <a className="nav-link-d" href="#standards">内容标准</a>
          <a className="nav-link-d" href="#channels">渠道</a>
          <a className="nav-link-d" href="#about">关于</a>
          <button className="nav-kbd" onClick={onCmdK} aria-label="搜索">
            搜索 <kbd>⌘ K</kbd>
          </button>
        </div>
      </div>
      <style>{`
        .nav-link-d{
          font-size: 13.5px; color: var(--ink-2);
          text-decoration: none; transition: color .2s;
          font-family: var(--sans);
        }
        .nav-link-d:hover{color: var(--accent)}
        @media (max-width: 880px){
          .nav-link-d{display:none}
        }
      `}</style>
    </nav>
  );
}

/* ============ HERO ============ */
function SplitTitle({ html }){
  // splits text into spans; preserves <span class> wrappers from html string.
  // Simple parser: handles top level text + <span class="X">text</span> + <br/>
  const ref = useRef(null);
  useEffect(()=>{
    if(!ref.current) return;
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    ref.current.innerHTML = '';
    let i = 0;
    const walk = (node, parent) => {
      node.childNodes.forEach(n => {
        if(n.nodeType === 3){
          [...n.textContent].forEach(ch => {
            const s = document.createElement('span');
            s.className = 'char';
            s.style.animationDelay = (i*38) + 'ms';
            s.textContent = ch === ' ' ? '\u00a0' : ch;
            parent.appendChild(s);
            i++;
          });
        } else if(n.nodeName === 'BR'){
          parent.appendChild(document.createElement('br'));
        } else {
          const wrap = document.createElement(n.nodeName.toLowerCase());
          wrap.className = n.className;
          parent.appendChild(wrap);
          walk(n, wrap);
        }
      });
    };
    walk(tmp, ref.current);
  },[html]);
  return <h1 ref={ref}/>;
}

function Terminal(){
  const lines = [
    { p: '~/ai-bzy', c: 'whoami' },
    { o: 'jnMetaCode · 全栈 / AI 编程方法论' },
    { p: '~/ai-bzy', c: 'cat ./manifesto.md | head -3' },
    { o: '工具会过时，方法论不会。' },
    { o: '少发，但每篇都能跑。' },
    { o: '不卖课，不收徒，不带货。' },
    { p: '~/ai-bzy', c: 'gh repo list --limit 6' },
    { o: 'agency-agents-zh    ★ 8.2k', cls: 'ok' },
    { o: 'superpowers-zh      ★ 1.4k', cls: 'ok' },
    { o: 'agency-orchestrator ★  476', cls: 'ok' },
    { o: 'shellward           ★   71', cls: 'ok' },
    { p: '~/ai-bzy', c: 'echo "下一篇见。"' },
    { o: '下一篇见。', cls: 'accent' },
  ];
  const [shown, setShown] = useState(0);
  const [typed, setTyped] = useState('');
  const [phase, setPhase] = useState(0); // 0 typing 1 output
  useEffect(()=>{
    if(shown >= lines.length){
      // restart after a pause
      const t = setTimeout(()=>{ setShown(0); setTyped(''); setPhase(0); }, 4000);
      return ()=> clearTimeout(t);
    }
    const ln = lines[shown];
    if(ln.c !== undefined){
      // typing animation
      if(typed.length < ln.c.length){
        const t = setTimeout(()=> setTyped(ln.c.slice(0, typed.length+1)), 45 + Math.random()*40);
        return ()=> clearTimeout(t);
      } else {
        const t = setTimeout(()=>{ setShown(shown+1); setTyped(''); }, 320);
        return ()=> clearTimeout(t);
      }
    } else {
      // output line — appear instantly with delay
      const t = setTimeout(()=> setShown(shown+1), 180);
      return ()=> clearTimeout(t);
    }
  },[shown, typed]);
  return (
    <div className="terminal">
      <div className="terminal-bar">
        <span className="dot r"/><span className="dot y"/><span className="dot g"/>
        <span className="ttl">jnMetaCode@ai-bzy — zsh</span>
      </div>
      <div className="terminal-body">
        {lines.slice(0, shown).map((ln, i) => (
          <span key={i} className="line">
            {ln.p ? <><span className="prompt">{ln.p} ›</span><span className="cmd">{ln.c}</span></>
                  : <span className={`out ${ln.cls||''}`}>{ln.o}</span>}
          </span>
        ))}
        {shown < lines.length && lines[shown].c !== undefined && (
          <span className="line">
            <span className="prompt">{lines[shown].p} ›</span>
            <span className="cmd">{typed}</span>
            <span className="cursor-blink"/>
          </span>
        )}
      </div>
    </div>
  );
}

function Hero(){
  return (
    <section className="hero" id="top">
      <div className="container">
        <div className="hero-grid">
          <div>
            <FadeUp className="hero-meta">
              <div className="hero-id">
                <span><i className="dot" /> jnMetaCode · 全栈开发者</span>
                <span>/ 写作 · 开源 · 教学</span>
                <span>/ Coding Since 2018 · Brand 2024</span>
              </div>
            </FadeUp>
            <SplitTitle html={'AI <span class="accent">不止</span><br/><span class="stroke">于</span>语。'}/>
            <FadeUp delay={2}>
              <p className="hero-sub">
                AI 编程工具迭代极快，方法论永生。
                <strong>记录踩过的坑、能复用的工作流，</strong>
                把好东西整理成书、做成开源、写成清单。
                给真心想用 AI 把活儿干好的人。
              </p>
            </FadeUp>
            <FadeUp delay={3} className="hero-cta">
              <a href="/book/" className="btn btn-primary">
                开始读三卷书 <span className="arr">→</span>
              </a>
              <a href="https://github.com/jnMetaCode" target="_blank" rel="noreferrer" className="btn btn-ghost">
                浏览 GitHub <span className="arr">↗</span>
              </a>
            </FadeUp>
          </div>
          <div className="hero-side">
            <FadeUp delay={2} className="stat-card">
              <div className="stat-num"><CountUp to={109}/><span className="plus">+</span></div>
              <div className="stat-label"><span className="k">Repos</span>开源仓库</div>
            </FadeUp>
            <FadeUp delay={3} className="stat-card">
              <div className="stat-num"><CountUp to={10300}/><span className="plus">+</span></div>
              <div className="stat-label"><span className="k">Stars</span>社区累计星标</div>
            </FadeUp>
            <FadeUp delay={4} className="stat-card">
              <div className="stat-num"><CountUp to={211}/><span className="plus">+</span></div>
              <div className="stat-label"><span className="k">Agents</span>专家角色矩阵</div>
            </FadeUp>
            <FadeUp delay={4}>
              <Terminal/>
            </FadeUp>
          </div>
        </div>

        <FadeUp delay={4} className="hero-status">
          <div className="hero-status-item">
            <div className="lbl">在做</div>
            <div className="val">AI 编程方法论</div>
          </div>
          <div className="hero-status-item">
            <div className="lbl">主要平台</div>
            <div className="val">公众号 · GitHub · X</div>
          </div>
          <div className="hero-status-item">
            <div className="lbl">在线书</div>
            <div className="val"><a href="/book/">aibuzhiyu.com/book</a></div>
          </div>
          <div className="hero-status-item">
            <div className="lbl">坐标</div>
            <div className="val">中国 · 远程</div>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}

/* ============ TRILOGY (三卷书) ============ */
/* 跟 ai-coding-guide/book/ 实际 mdbook 内容保持一致 */
const TRILOGY = [
  {
    num: '01',
    tab: '入门',
    title: '三卷书 · 卷一·入门',
    pitch: 'AI 编程零基础 / 只用过 Tab 补全的读者从这里开始 — 30 秒选工具、提示词四元素、4 款主流工具速通，独立完成日常任务。',
    toc: ['9 工具速查表','提示词工程','需求拆解','上下文管理','Cursor 速通','GitHub Copilot 速通','Claude Code 速通','OpenAI Codex CLI 速通'],
    meta: [['形态','在线 + PDF'],['章数','8 章'],['进度','v1.0 已发布']]
  },
  {
    num: '02',
    tab: '工作流',
    title: '三卷书 · 卷二·工作流',
    pitch: '已经会用 1-2 款工具想把效率往上拔。代码审查 / 调试 / 测试三大方法论 + 多工具协作 + 31 个深度陷阱（症状 / 根因 / 出坑 / 预防）。',
    toc: ['代码审查','调试方法论','测试策略','多工具选型','实战场景脚本','Claude Code + Cursor','Claude Code + Copilot','31 个陷阱合集','Aider / Gemini CLI / Windsurf / Trae / Kiro'],
    meta: [['形态','在线 + PDF'],['章数','17 章'],['配套','ai-coding-guide']]
  },
  {
    num: '03',
    tab: '架构',
    title: '三卷书 · 卷三·架构',
    pitch: '团队 lead / 平台工程师 / CTO。把 AI 编程接进 CI / 安全策略 / 企业治理 / MCP 生态选型 — 个人能力升级到组织能力。',
    toc: ['安全注意事项','OpenClaw Agent 框架','延伸学习资源（20+ 高质量外部仓库）'],
    meta: [['形态','在线 + PDF'],['章数','3 章'],['进度','v1.0 · 持续扩展中']]
  }
];

function Trilogy(){
  const [i, setI] = useState(0);
  const t = TRILOGY[i];
  return (
    <section id="products">
      <div className="container">
        <div className="section-head">
          <div className="left">
            <div className="eyebrow">Section · 01 · Books</div>
            <h2>不是教程，<span className="em">是路线图。</span></h2>
            <p className="desc">
              整理三本可以一直翻的内容产品 — 不堆术语、不灌输工具崇拜，回答"我下一步该做什么"。
            </p>
          </div>
          <div className="right">
            03 / VOLUMES<br/>
            EST. 2024 — NOW
          </div>
        </div>

        <FadeUp className="trilogy">
          <div className="tri-tabs">
            {TRILOGY.map((x, idx) => (
              <button key={x.num} className={`tri-tab ${i===idx?'active':''}`} onClick={()=>setI(idx)}>
                <span className="num">VOL · {x.num}</span>
                <span className="ttl">{x.tab}</span>
              </button>
            ))}
          </div>
          <div className="tri-panel" key={i} style={{animation:'panelIn .5s ease'}}>
            <h3>{t.title}</h3>
            <p className="pitch">{t.pitch}</p>
            <ul className="toc">
              {t.toc.map((c, ix) => (
                <li key={c}><span className="ix">{String(ix+1).padStart(2,'0')}</span>{c}</li>
              ))}
            </ul>
            <div className="meta">
              {t.meta.map(([k,v])=>(
                <span key={k}>{k} · <span className="v">{v}</span></span>
              ))}
            </div>
          </div>
        </FadeUp>
        <style>{`@keyframes panelIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}`}</style>
      </div>
    </section>
  );
}

/* ============ REPO MATRIX ============ */
/* Stars 截止 2026-05-02 实测；过几个月会变，建议下次升级换 shields.io 实时 badge */
const REPOS = [
  {
    name: 'agency-agents-zh',
    title: '211 专家角色 · 中文版',
    desc: '即插即用的 AI 专家角色矩阵 — 覆盖工程/设计/营销/金融 18 个部门，含 46 个中国市场原创智能体（小红书/抖音/微信/飞书/钉钉）。',
    star: '9.4k', lang: 'Shell', langColor: 'oklch(0.7 0.12 130)',
    flagship: true,
    href: 'https://github.com/jnMetaCode/agency-agents-zh'
  },
  {
    name: 'superpowers-zh',
    title: 'AI 编程超能力 · 中文增强',
    desc: '让 16 款 AI 编程工具真正会干活 — Skills 体系完整汉化 + 6 个原创 skills。',
    star: '1.8k', lang: 'Shell', langColor: 'oklch(0.7 0.12 130)',
    href: 'https://github.com/jnMetaCode/superpowers-zh'
  },
  {
    name: 'agency-orchestrator',
    title: '一句话 → 多 AI 协作',
    desc: '一句话调度 211+ 专家角色，几分钟交付完整方案。9 家 LLM / 6 家免费，零代码 YAML。',
    star: '634', lang: 'TypeScript', langColor: 'oklch(0.65 0.14 240)',
    href: 'https://github.com/jnMetaCode/agency-orchestrator'
  },
  {
    name: 'ai-coding-guide',
    title: 'AI 编程实战指南',
    desc: '66 个 Claude Code 技巧 + 10 款工具最佳实践 + 可复制的配置模板。',
    star: '141', lang: 'Markdown', langColor: 'oklch(0.6 0.02 60)',
    href: 'https://github.com/jnMetaCode/ai-coding-guide'
  },
  {
    name: 'ai-coding-trilogy',
    title: '三卷书 · PDF 发布仓',
    desc: 'ai-coding-guide 内容按读者画像重组的产品形态：入门 / 工作流 / 架构。中英双语 PDF，CC BY-NC-SA 4.0。',
    star: 'NEW', lang: 'Markdown', langColor: 'oklch(0.6 0.02 60)',
    href: 'https://github.com/jnMetaCode/ai-coding-trilogy'
  },
  {
    name: 'shellward',
    title: 'AI Agent 安全中间件',
    desc: '8 层防御 / DLP 数据流 / 提示注入检测 / 零依赖。SDK + MCP server，接入 Claude Code、Cursor、LangChain。',
    star: '78', lang: 'TypeScript', langColor: 'oklch(0.65 0.14 240)',
    href: 'https://github.com/jnMetaCode/shellward'
  }
];

function RepoCard({ r }){
  const ref = useRef(null);
  const handleMove = (e) => {
    const el = e.currentTarget;
    const b = el.getBoundingClientRect();
    const px = (e.clientX - b.left) / b.width;
    const py = (e.clientY - b.top) / b.height;
    el.style.setProperty('--mx', px*100 + '%');
    el.style.setProperty('--my', py*100 + '%');
    if(document.body.dataset.motion !== 'off' && !r.flagship){
      const rx = (py - .5) * -8;
      const ry = (px - .5) * 10;
      el.style.transform = `perspective(1000px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-4px)`;
    }
  };
  const handleLeave = (e) => {
    e.currentTarget.style.transform = '';
  };
  return (
    <a className={`repo ${r.flagship?'flagship':''}`} data-tilt="1" href={r.href} target="_blank" rel="noreferrer" onMouseMove={handleMove} onMouseLeave={handleLeave}>
      <div className="repo-head">
        <i className="pulse"/> jnMetaCode / <strong>{r.name}</strong>
      </div>
      <h3>{r.title}</h3>
      <p className="desc">{r.desc}</p>
      <div className="repo-foot">
        <span className="star">★ {r.star}</span>
        <span className="lang" style={{'--lang-color': r.langColor}}>{r.lang}</span>
        <span className="arrow">↗</span>
      </div>
    </a>
  );
}

function Repos(){
  return (
    <section id="repos" style={{background: 'var(--bg-soft)'}}>
      <div className="container">
        <div className="section-head">
          <div className="left">
            <div className="eyebrow">Section · 02 · Open Source</div>
            <h2>不止于<span className="em">写</span>，<br/>还要<span className="em">能跑。</span></h2>
            <p className="desc">每个项目都解决一个具体问题。学习工具 → 让 AI 干活 → 多 Agent 协作 → 安全保护。</p>
          </div>
          <div className="right">
            06 / FLAGSHIPS<br/>
            10,300+ ⭐ TOTAL
          </div>
        </div>
        <FadeUp className="repo-grid">
          {REPOS.map(r => <RepoCard key={r.name} r={r}/>)}
        </FadeUp>
      </div>
    </section>
  );
}

/* ============ STANDARDS ============ */
function Standards(){
  return (
    <section id="standards">
      <div className="container">
        <div className="section-head">
          <div className="left">
            <div className="eyebrow">Section · 03 · Editorial</div>
            <h2>内容标准 — <span className="em">写慢一点。</span></h2>
            <p className="desc">AI 时代，内容生产的边际成本接近为零，所以反而要更慢、更克制。</p>
          </div>
          <div className="right">
            CODE OF CONTENT<br/>
            v2024.11
          </div>
        </div>

        <FadeUp className="standards">
          <div className="standards-text">
            <p>
              每一篇推敲后再发布。
              <strong>不堆 SEO 关键词，不为了字数注水，</strong>
              不写"X 大技巧 + 收藏不亏"那种标题。
            </p>
            <p>
              工具会过时，但<strong>方法论与场景化的思考方式不会</strong>。
              所以我宁愿少发，也要把每一篇都当成可以三个月后还能查的笔记来写。
            </p>
            <p>
              所有开源仓库都附带可复制的配置模板与 README，
              <strong>而非"看着很对，跑不起来"的空架子</strong>。
              如果你发现哪一篇写崩了，欢迎在 issue 里指出 — 一定改。
            </p>
          </div>
          <div className="checklist">
            <h4><span className="num">— DO</span> 我会做的</h4>
            <ul>
              <li><span className="check">✓</span><span><b>真实跑过</b>才写。截图、命令、报错都尽量原样保留。</span></li>
              <li><span className="check">✓</span><span>每篇文章<b>给出可复用的配置文件</b>或脚本。</span></li>
              <li><span className="check">✓</span><span>关键判断<b>注明日期</b>。模型/工具一周一变。</span></li>
              <li><span className="check">✓</span><span>遇到坑就更新原文，<b>带 changelog</b>。</span></li>
              <li><span className="check">✓</span><span>读者来信<b>当周回</b>，不收徒、不带货、不卖课。</span></li>
            </ul>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}

/* ============ PARTNERS ============ */
function Partners(){
  return (
    <section id="partner" style={{background: 'var(--bg-soft)'}}>
      <div className="container">
        <div className="section-head">
          <div className="left">
            <div className="eyebrow">Section · 04 · Collab</div>
            <h2>商业合作<br/><span className="em">— 偶尔接一次。</span></h2>
            <p className="desc">只接和 AI 编程 / 开发者工具相关、且自己用过的产品。其他一律说不。</p>
          </div>
          <div className="right">
            ON DEMAND<br/>偶尔开放
          </div>
        </div>

        <FadeUp className="partners">
          <div className="partner">
            <span className="tag">公众号 · 软文 / 评测</span>
            <h4>「AI 不止语」头条 / 次条 / 专访</h4>
            <p>面向 AI 编程从业者、独立开发者、技术管理者。读者偏理性、反感纯广告、要求结合真实使用场景。</p>
            <div className="price">
              <span>形式与价格 · <b>一事一议</b></span>
            </div>
          </div>
          <div className="partner">
            <span className="tag">GitHub · 推荐 / 联合发布</span>
            <h4>开源仓库联合推广</h4>
            <p>在合适的开源项目里以原生方式接入；或针对你的工具撰写实战指南章节，纳入《AI 编程实战三卷书》。</p>
            <div className="price">
              <span>README 推荐 · <b>项目制</b></span>
              <span>联合章节 · <b>项目制</b></span>
            </div>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}

/* ============ CHANNELS ============ */
const CHANNELS = [
  { p: 'WeChat 公众号', h: 'AI 不止语', s: '搜索 AI_BuZhiYu', href: '#' },
  { p: 'GitHub', h: '@jnMetaCode', s: '109 repos · 10.3k★', href: 'https://github.com/jnMetaCode' },
  { p: 'X / Twitter', h: '@aibuzhiyu', s: 'AI 编程随笔（中英）', href: 'https://twitter.com/aibuzhiyu' },
  { p: '在线书', h: 'aibuzhiyu.com/book', s: '三卷书 + 速查别册', href: '/book/' },
  { p: 'PDF 下载', h: 'ai-coding-trilogy', s: '三卷书产品仓', href: 'https://github.com/jnMetaCode/ai-coding-trilogy' },
  { p: 'QQ 群', h: '1071280067', s: '日常交流', href: 'https://qm.qq.com/q/EeNQA9xCxy' },
  { p: '微信群', h: '回复"群"加入', s: '关注公众号', href: '#' }
];

function Channels(){
  return (
    <section id="channels">
      <div className="container">
        <div className="section-head">
          <div className="left">
            <div className="eyebrow">Section · 05 · Channels</div>
            <h2>在哪儿找到我。</h2>
            <p className="desc">写得最长的在公众号；最短的在 X；可执行的在 GitHub。挑你顺手的。</p>
          </div>
          <div className="right">
            08 / PLATFORMS
          </div>
        </div>
        <FadeUp className="channels">
          {CHANNELS.map((c, i) => (
            <a key={i} href={c.href} className="channel" target="_blank" rel="noreferrer">
              <span className="platform">{c.p}</span>
              <span className="handle">{c.h}</span>
              <span style={{fontFamily:'var(--mono)', fontSize: 12, color:'var(--ink-3)'}}>{c.s}</span>
              <span className="arrow">↗</span>
            </a>
          ))}
        </FadeUp>
      </div>
    </section>
  );
}

/* ============ ABOUT ============ */
function About(){
  return (
    <section id="about" style={{background:'var(--bg-soft)'}}>
      <div className="container">
        <div className="section-head">
          <div className="left">
            <div className="eyebrow">Section · 06 · About</div>
            <h2>关于<span className="em">主理人。</span></h2>
          </div>
          <div className="right">jnMetaCode<br/>BRAND EST. 2024</div>
        </div>

        <FadeUp className="about">
          <div className="about-portrait">
            <span className="frame-cnr tl"/><span className="frame-cnr tr"/>
            <span className="frame-cnr bl"/><span className="frame-cnr br"/>
            <div className="label"><span>BRAND MARK</span><span>v1</span></div>
            <div className="center" style={{padding: 0, alignItems: 'stretch'}}>
              <img
                src="/brand-mark.png"
                alt="AI 不止语 · 印章"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  objectPosition: 'center',
                  display: 'block'
                }}
              />
            </div>
            <div className="label"><span>aibuzhiyu.com</span><span>丙午 · 2026</span></div>
          </div>
          <div className="about-body">
            <h3>把"会用 AI 写代码"做成可复制的事。</h3>
            <p>
              全栈开发者，AI 与开源实践者。从 2018 年开始写技术内容，2024 年起把重心移到
              <strong> AI 编程方法论</strong>这件事上。
              做过的产品包含 211 专家角色矩阵、AI Agent 安全中间件、多 LLM 编排器，
              累计 GitHub Stars 一万+。
            </p>
            <p>
              不卖课、不收徒、不带货。<strong>更愿意把时间花在工具的边界探索上</strong> —
              把每一次踩坑、每一份配置、每一个能复用的工作流，都尽量写下来留给后来人。
            </p>
            <div className="tags">
              {['Claude Code','Cursor','MCP','Agent 编排','TypeScript','Python','Shell','Skills','Prompt','开源维护','技术写作'].map(t=>(
                <span key={t} className="tag-chip">{t}</span>
              ))}
            </div>
            <div className="timeline">
              <div className="timeline-row">
                <span className="yr">2026 →</span>
                <span className="ev"><b>三卷书</b> v1.0 发布（aibuzhiyu.com）；<b>ai-coding-guide</b> 加入 Codex CLI 章节（6 轮源码核实）。</span>
              </div>
              <div className="timeline-row">
                <span className="yr">2025</span>
                <span className="ev">发布 <b>agency-agents-zh</b>（9.4k ★）、<b>agency-orchestrator</b>、<b>shellward</b>、<b>superpowers-zh</b>。</span>
              </div>
              <div className="timeline-row">
                <span className="yr">2024</span>
                <span className="ev">公众号「AI 不止语」开张；<b>ai-coding-guide</b> 上线，66 个 Claude Code 实操技巧。</span>
              </div>
              <div className="timeline-row">
                <span className="yr">2018 — 2023</span>
                <span className="ev">全栈开发与技术写作；积累为后续方法论的底层素材。</span>
              </div>
            </div>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}

/* ============ CTA ============ */
function CTA(){
  return (
    <section className="cta" style={{padding:0}}>
      <div className="cta">
        <div className="cta-inner">
          <FadeUp>
            <h2>下一篇，<span className="em">见。</span></h2>
            <p className="sub">关注公众号「AI 不止语」 · 回复 <b>"群"</b> 加入读者群 · 或在 GitHub 给个 ★。</p>
          </FadeUp>
          <FadeUp delay={1} className="cta-btns">
            <a className="btn btn-primary" href="#channels">关注公众号 <span className="arr">→</span></a>
            <a className="btn btn-ghost" href="https://github.com/jnMetaCode" target="_blank" rel="noreferrer">浏览 GitHub <span className="arr">↗</span></a>
          </FadeUp>
        </div>
      </div>
    </section>
  );
}

function Footer(){
  return (
    <footer className="foot">
      <div className="foot-inner">
        <span>© 2024 — 2026 「AI 不止语」 · jnMetaCode</span>
        <span>License · Apache 2.0 / CC BY 4.0</span>
        <span><a href="#top">↑ 回到顶部</a></span>
      </div>
    </footer>
  );
}

/* ============ CMD K ============ */
const CMDK_ITEMS = [
  { sec: '导航', items: [
    { l: '内容产品 · 三件套', k: 'G P', href: '#products' },
    { l: '开源项目矩阵', k: 'G R', href: '#repos' },
    { l: '内容标准', k: 'G S', href: '#standards' },
    { l: '商业合作', k: 'G B', href: '#partner' },
    { l: '渠道', k: 'G C', href: '#channels' },
    { l: '关于', k: 'G A', href: '#about' }
  ]},
  { sec: '外链', items: [
    { l: 'GitHub @jnMetaCode', k: '↗', href: 'https://github.com/jnMetaCode', ext: true },
    { l: 'agency-agents-zh', k: '↗', href: 'https://github.com/jnMetaCode/agency-agents-zh', ext: true },
    { l: 'superpowers-zh', k: '↗', href: 'https://github.com/jnMetaCode/superpowers-zh', ext: true }
  ]}
];
function CmdK({ open, onClose }){
  const [q, setQ] = useState('');
  const [sel, setSel] = useState(0);
  const inputRef = useRef(null);
  const flat = useMemo(()=>{
    const all = CMDK_ITEMS.flatMap(g => g.items.map(it => ({...it, sec: g.sec})));
    if(!q) return all;
    return all.filter(x => x.l.toLowerCase().includes(q.toLowerCase()));
  },[q]);
  useEffect(()=>{
    if(open) setTimeout(()=> inputRef.current?.focus(), 60);
    else { setQ(''); setSel(0); }
  },[open]);
  useEffect(()=>{
    if(!open) return;
    const h = (e)=>{
      if(e.key === 'Escape') onClose();
      else if(e.key === 'ArrowDown'){ e.preventDefault(); setSel(s => Math.min(flat.length-1, s+1)); }
      else if(e.key === 'ArrowUp'){ e.preventDefault(); setSel(s => Math.max(0, s-1)); }
      else if(e.key === 'Enter'){
        const it = flat[sel];
        if(it){
          if(it.ext) window.open(it.href, '_blank');
          else window.location.hash = it.href;
          onClose();
        }
      }
    };
    window.addEventListener('keydown', h);
    return ()=> window.removeEventListener('keydown', h);
  },[open, flat, sel, onClose]);
  return (
    <div className={`cmdk-overlay ${open?'open':''}`} onClick={onClose}>
      <div className="cmdk" onClick={e=>e.stopPropagation()}>
        <input ref={inputRef} placeholder="搜索板块、仓库、外链…" value={q} onChange={e=>{setQ(e.target.value); setSel(0)}}/>
        <div className="cmdk-list">
          {q ? (
            flat.length === 0 ? <div className="cmdk-section">无结果</div> :
            flat.map((it, i) => (
              <div key={it.l} className={`cmdk-item ${sel===i?'sel':''}`} onClick={()=>{
                if(it.ext) window.open(it.href,'_blank'); else window.location.hash = it.href;
                onClose();
              }}>
                {it.l} <span className="kk">{it.k}</span>
              </div>
            ))
          ) : (
            CMDK_ITEMS.map(g => (
              <div key={g.sec}>
                <div className="cmdk-section">{g.sec}</div>
                {g.items.map((it, i) => {
                  const idx = flat.findIndex(f => f.l === it.l);
                  return (
                    <div key={it.l} className={`cmdk-item ${sel===idx?'sel':''}`} onClick={()=>{
                      if(it.ext) window.open(it.href,'_blank'); else window.location.hash = it.href;
                      onClose();
                    }}>
                      {it.l} <span className="kk">{it.k}</span>
                    </div>
                  );
                })}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

/* ============ CURSOR GLOW + DOT ============ */
function CursorGlow(){
  const refG = useRef(null);
  const refD = useRef(null);
  const refR = useRef(null);
  useEffect(()=>{
    let raf;
    let tx=0, ty=0, rx=0, ry=0;
    const handle = (e) => {
      tx = e.clientX; ty = e.clientY;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(()=>{
        if(refG.current){ refG.current.style.left = tx+'px'; refG.current.style.top = ty+'px'; }
        if(refD.current){ refD.current.style.left = tx+'px'; refD.current.style.top = ty+'px'; }
      });
    };
    const ringTick = () => {
      rx += (tx - rx) * 0.18;
      ry += (ty - ry) * 0.18;
      if(refR.current){ refR.current.style.left = rx+'px'; refR.current.style.top = ry+'px'; }
      requestAnimationFrame(ringTick);
    };
    const onOver = (e) => {
      const link = e.target.closest('a, button');
      if(refR.current){
        refR.current.style.width = link ? '52px' : '36px';
        refR.current.style.height = link ? '52px' : '36px';
        refR.current.style.borderWidth = link ? '2px' : '1.5px';
      }
    };
    window.addEventListener('mousemove', handle);
    window.addEventListener('mouseover', onOver);
    ringTick();
    return ()=> {
      window.removeEventListener('mousemove', handle);
      window.removeEventListener('mouseover', onOver);
    };
  },[]);
  return <>
    <div className="aurora">
      <div className="blob b1"/><div className="blob b2"/><div className="blob b3"/>
    </div>
    <div ref={refG} className="cursor-glow"/>
    <div ref={refR} className="cursor-ring"/>
    <div ref={refD} className="cursor-dot"/>
  </>;
}

function ScrollProgress(){
  const ref = useRef(null);
  useEffect(()=>{
    const h = () => {
      const top = window.scrollY;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? top/max : 0;
      if(ref.current) ref.current.style.transform = `scaleX(${p})`;
    };
    h();
    window.addEventListener('scroll', h, { passive: true });
    window.addEventListener('resize', h);
    return ()=>{
      window.removeEventListener('scroll', h);
      window.removeEventListener('resize', h);
    };
  },[]);
  return <div ref={ref} className="scroll-progress"/>;
}

function Marquee(){
  const items = [
    <><span className="em">AI 不止语</span></>,
    <><span>Claude Code</span></>,
    <><span>Cursor</span></>,
    <><span>Copilot CLI</span></>,
    <><span>MCP Registry</span></>,
    <><span>Hermes Agent</span></>,
    <><span>211 Agents</span></>,
    <><span>Skills</span></>,
    <><span className="em">jnMetaCode</span></>,
    <><span>10.3k ★</span></>,
    <><span>Open Source</span></>,
    <><span>Methodology</span></>,
  ];
  const sep = <span className="sep">●</span>;
  const seq = items.flatMap((x, i) => [<span key={'a'+i}>{x}</span>, sep]);
  return (
    <div className="marquee">
      <div className="marquee-track">
        {seq}{seq}
      </div>
    </div>
  );
}

/* ============ TWEAKS ============ */
const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "accent": "#D9512C",
  "fontHeading": "Noto Serif SC",
  "density": "default",
  "motion": "on",
  "heroVariant": "v1"
}/*EDITMODE-END*/;

function Tweaks(){
  const { useTweaks, TweaksPanel, TweakSection, TweakRadio, TweakSelect, TweakColor } = window;
  const [tweaks, setTweak] = useTweaks(TWEAK_DEFAULTS);
  useEffect(()=>{
    const c = document.documentElement.style;
    // convert hex to oklch via css var (browser handles)
    c.setProperty('--accent', tweaks.accent);
    c.setProperty('--serif', `'${tweaks.fontHeading}', 'Source Han Serif SC', serif`);
    document.body.dataset.density = tweaks.density;
    document.body.dataset.motion = tweaks.motion;
  },[tweaks]);

  // hero variant override
  useEffect(()=>{
    const h1 = document.querySelector('.hero h1');
    if(!h1) return;
    let html;
    if(tweaks.heroVariant === 'v1'){
      html = 'AI <span class="accent">不止</span><br/><span class="stroke">于</span>语。';
    } else if(tweaks.heroVariant === 'v2'){
      html = '把 <span class="accent">AI</span><br/>用在<span class="stroke">刀刃</span>上。';
    } else {
      html = '工具会过时，<br/><span class="accent">方法论</span><span class="stroke">不会。</span>';
    }
    // re-split into chars
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    h1.innerHTML = '';
    let i = 0;
    const walk = (node, parent) => {
      node.childNodes.forEach(n => {
        if(n.nodeType === 3){
          [...n.textContent].forEach(ch => {
            const s = document.createElement('span');
            s.className = 'char';
            s.style.animationDelay = (i*38) + 'ms';
            s.textContent = ch === ' ' ? '\u00a0' : ch;
            parent.appendChild(s);
            i++;
          });
        } else if(n.nodeName === 'BR'){
          parent.appendChild(document.createElement('br'));
        } else {
          const wrap = document.createElement(n.nodeName.toLowerCase());
          wrap.className = n.className;
          parent.appendChild(wrap);
          walk(n, wrap);
        }
      });
    };
    walk(tmp, h1);
  },[tweaks.heroVariant]);

  return (
    <TweaksPanel title="Tweaks">
      <TweakSection title="主题">
        <TweakColor label="主色调" value={tweaks.accent} onChange={v=> setTweak('accent', v)}/>
        <TweakSelect label="标题字体" value={tweaks.fontHeading} options={[
          {value:'Noto Serif SC', label:'Noto Serif SC（衬线·默认）'},
          {value:'LXGW WenKai', label:'霞鹜文楷（书法体）'},
          {value:'Noto Sans SC', label:'Noto Sans SC（无衬线）'},
          {value:'JetBrains Mono', label:'JetBrains Mono（等宽）'}
        ]} onChange={v=> setTweak('fontHeading', v)}/>
      </TweakSection>
      <TweakSection title="布局与动效">
        <TweakRadio label="密度" value={tweaks.density} options={[
          {value:'tight', label:'紧凑'},
          {value:'default', label:'默认'},
          {value:'comfy', label:'舒适'}
        ]} onChange={v=> setTweak('density', v)}/>
        <TweakRadio label="动效" value={tweaks.motion} options={[
          {value:'on', label:'开启'},
          {value:'off', label:'关闭'}
        ]} onChange={v=> setTweak('motion', v)}/>
      </TweakSection>
      <TweakSection title="Hero 文案">
        <TweakRadio label="变体" value={tweaks.heroVariant} options={[
          {value:'v1', label:'AI 不止于语'},
          {value:'v2', label:'用在刀刃'},
          {value:'v3', label:'方法论'}
        ]} onChange={v=> setTweak('heroVariant', v)}/>
      </TweakSection>
    </TweaksPanel>
  );
}

/* ============ APP ============ */
function App(){
  const [cmdk, setCmdk] = useState(false);
  useEffect(()=>{
    const h = (e) => {
      if((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k'){
        e.preventDefault();
        setCmdk(o => !o);
      }
    };
    window.addEventListener('keydown', h);
    return ()=> window.removeEventListener('keydown', h);
  },[]);
  return (
    <>
      <ScrollProgress/>
      <CursorGlow/>
      <Nav onCmdK={()=>setCmdk(true)}/>
      <main>
        <Hero/>
        <Marquee/>
        <Trilogy/>
        <Repos/>
        <Standards/>
        {/* <Partners/> 暂时隐藏：粉丝基础起来再开放 */}
        <Channels/>
        <About/>
        <CTA/>
      </main>
      <Footer/>
      <CmdK open={cmdk} onClose={()=>setCmdk(false)}/>
      <Tweaks/>
    </>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App/>);
