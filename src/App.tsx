import { useEffect, useState, useRef, useMemo } from 'react';
import { motion, AnimatePresence, useScroll, useSpring } from 'motion/react';
import { 
  Moon, 
  Sun, 
  Mail, 
  Github, 
  Globe, 
  ChevronDown, 
  ArrowUpRight, 
  Code2, 
  Activity, 
  FolderGit2, 
  BookOpen, 
  Sparkles, 
  ArrowUp,
  Terminal as TerminalIcon,
  Radio,
  ExternalLink,
  Flame,
  Star,
  Send,
  Volume2,
  VolumeX,
  Compass,
  User,
  Target,
  Trophy,
  CheckCircle2
} from 'lucide-react';
import Markdown from 'react-markdown';
import Lenis from 'lenis';
import { siteConfig } from './config';

// ----------------------------------------------------
// Sound FX (Native Web Audio API)
// ----------------------------------------------------
class SoundFX {
  private ctx: AudioContext | null = null;
  public enabled = false;

  private init() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) this.ctx = new AudioCtx();
    }
  }

  playPop(freq = 880, duration = 0.08) {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    try {
      if (this.ctx.state === 'suspended') this.ctx.resume();
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(freq * 0.4, this.ctx.currentTime + duration);

      gain.gain.setValueAtTime(0.05, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch {}
  }
}

const sfx = new SoundFX();

// ----------------------------------------------------
// Python Interactive Terminal HUD (Line-by-Line Streaming Execution)
// ----------------------------------------------------
interface PythonTerminalLine {
  text: string;
  type: 'cmd' | 'comment' | 'code' | 'output' | 'success';
}

const PYTHON_BOOT_SCRIPT: PythonTerminalLine[] = [
  { type: 'cmd', text: '$ python3 -m upxuu.core.boot' },
  { type: 'comment', text: '# [Python 3.12.2] Initializing UpXuu Space on Linux x86_64...' },
  { type: 'code', text: 'from upxuu import Developer, Life, Dreams' },
  { type: 'code', text: 'me = Developer(name="UpXuu")' },
  { type: 'code', text: 'me.location = "Hebei, China"' },
  { type: 'code', text: 'me.stacks = ["Python", "Astro", "React", "TailwindCSS", "Linux"]' },
  { type: 'code', text: 'me.motto = "逐光而上！Keep learning, keep building."' },
  { type: 'code', text: 'me.target = "2027中考775/800 🎯"' },
  { type: 'output', text: '>>> me.initialize_workspace()' },
  { type: 'output', text: '[+] Edge routing: i.upxuu.com (Vercel Anycast) ... [OK]' },
  { type: 'output', text: '[+] Fetching RSS posts from https://upxuu.com ... [OK]' },
  { type: 'output', text: '[+] Syncing GitHub repositories for @ImUpXuu ... [OK]' },
  { type: 'success', text: '[✓] All core modules loaded. Welcome to UpXuu Space!' }
];

function CyberTerminal() {
  const [isOpen, setIsOpen] = useState(true);
  const [visibleLines, setVisibleLines] = useState(0);
  const [inputVal, setInputVal] = useState('');
  const [interactiveLogs, setInteractiveLogs] = useState<Array<{ expr: string; result: string }>>([]);
  const terminalBodyRef = useRef<HTMLDivElement>(null);

  // Line-by-line execution streaming
  useEffect(() => {
    if (visibleLines < PYTHON_BOOT_SCRIPT.length) {
      const delay = visibleLines === 0 ? 120 : visibleLines < 3 ? 100 : 75;
      const timer = setTimeout(() => {
        setVisibleLines((prev) => prev + 1);
        sfx.playPop(750 + visibleLines * 25, 0.02);
      }, delay);
      return () => clearTimeout(timer);
    }
  }, [visibleLines]);

  // Scroll to bottom when new line prints
  useEffect(() => {
    if (terminalBodyRef.current) {
      terminalBodyRef.current.scrollTop = terminalBodyRef.current.scrollHeight;
    }
  }, [visibleLines, interactiveLogs]);

  const handleReplay = () => {
    setVisibleLines(0);
    sfx.playPop(1100, 0.06);
  };

  const quickPythonCmds = ['me.target', 'me.stacks', 'me.motto', 'whoami', 'clear', 'replay'];

  const executePythonCmd = (rawCmd: string) => {
    const cmd = rawCmd.trim();
    if (!cmd) return;

    if (cmd === 'clear') {
      setInteractiveLogs([]);
      setInputVal('');
      return;
    }

    if (cmd === 'replay' || cmd === 'python3' || cmd === 'python3 upxuu.py') {
      handleReplay();
      setInputVal('');
      return;
    }

    let res = '';
    switch (cmd.toLowerCase()) {
      case 'me.target':
        res = "'2027中考775/800 🎯'";
        break;
      case 'me.stacks':
        res = "['Python', 'Astro', 'React', 'TailwindCSS', 'Linux']";
        break;
      case 'me.motto':
        res = "'逐光而上！Keep learning, keep building.'";
        break;
      case 'me.location':
        res = "'Hebei, China'";
        break;
      case 'me.name':
        res = "'UpXuu'";
        break;
      case 'whoami':
        res = "'UpXuu · 独立开发者、初中生创作者。博客: upxuu.com'";
        break;
      case 'ping':
        res = "64 bytes from i.upxuu.com: time=4.8ms (Vercel Anycast Edge)";
        break;
      case 'help()':
      case 'help':
        res = "Available: me.target, me.stacks, me.motto, me.location, whoami, replay, clear";
        break;
      default:
        res = `SyntaxError: name '${cmd}' is not defined. Try: me.target, me.stacks, me.motto`;
    }

    setInteractiveLogs((prev) => [...prev, { expr: cmd, result: res }]);
    setInputVal('');
    sfx.playPop(850, 0.04);
  };

  // Python syntax highlighting renderer for line-by-line printing
  const renderLine = (line: PythonTerminalLine) => {
    if (line.type === 'cmd') {
      return (
        <div className="text-[#0284c7] dark:text-[#38bdf8] font-bold flex items-center gap-1.5">
          <span className="text-[#f59e0b]">upxuu@host:~$</span>
          <span>{line.text.replace('$ ', '')}</span>
        </div>
      );
    }
    if (line.type === 'comment') {
      return <div className="text-slate-400 dark:text-slate-500 italic font-mono">{line.text}</div>;
    }
    if (line.type === 'success') {
      return (
        <div className="text-emerald-700 dark:text-emerald-300 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/25 inline-block my-0.5">
          {line.text}
        </div>
      );
    }
    if (line.type === 'output') {
      return (
        <div className="text-sky-600 dark:text-sky-400 font-mono font-medium pl-1">
          {line.text}
        </div>
      );
    }

    // Python code highlighting
    const code = line.text;
    const parts = code.split(/(".*?"|\b(?:from|import|class|def|return)\b)/g);
    return (
      <div className="font-mono text-slate-800 dark:text-slate-100 pl-1">
        {parts.map((p, i) => {
          if (/^".*?"$/.test(p)) {
            return <span key={i} className="text-emerald-600 dark:text-emerald-400 font-semibold">{p}</span>;
          }
          if (['from', 'import', 'class', 'def', 'return'].includes(p)) {
            return <span key={i} className="text-pink-600 dark:text-pink-400 font-bold">{p}</span>;
          }
          if (['Developer', 'Life', 'Dreams'].includes(p)) {
            return <span key={i} className="text-amber-600 dark:text-amber-300 font-bold">{p}</span>;
          }
          return <span key={i}>{p}</span>;
        })}
      </div>
    );
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ type: 'spring', damping: 18, stiffness: 200 }}
      className="w-full mt-12 scroll-mt-24"
    >
      <div className="flex items-center justify-between mb-3 px-1">
        <button
          onClick={() => {
            setIsOpen(!isOpen);
            sfx.playPop(1000, 0.05);
          }}
          className="px-3 py-1 bg-[#fde68a] dark:bg-slate-800 border-2 border-[#0284c7] font-black text-xs text-[#0284c7] dark:text-[#38bdf8] shadow-[2px_2px_0px_0px_#0284c7] dark:shadow-[2px_2px_0px_0px_#38bdf8] flex items-center gap-2 hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all cursor-pointer rounded-sm transform -skew-x-3"
        >
          <TerminalIcon className="w-3.5 h-3.5" />
          <span>{isOpen ? '[- 收起 Python 终端]' : '[+ 打开 Python 终端]'}</span>
        </button>
        <span className="text-xs font-mono font-bold text-slate-500">Python 3.12 // upxuu_boot</span>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            {/* Neo-Brutalist Natural Card Background: Not forced pitch black! */}
            <div className="neo-box rounded-xl p-4 sm:p-5 font-mono text-xs sm:text-sm bg-white/95 dark:bg-slate-900/95 border-2 border-[#0284c7] shadow-[4px_4px_0px_0px_#0284c7]">
              {/* Terminal Window Bar */}
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2.5 mb-3 text-slate-500">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-[#ef4444] border border-[#b91c1c]"></span>
                  <span className="w-3 h-3 rounded-full bg-[#f59e0b] border border-[#d97706]"></span>
                  <span className="w-3 h-3 rounded-full bg-[#10b981] border border-[#059669]"></span>
                  <span className="ml-2 font-bold text-[#0284c7] dark:text-[#38bdf8] flex items-center gap-1">
                    <span>🐍</span>
                    <span>upxuu_boot.py — CPython 3.12</span>
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleReplay}
                    className="px-2 py-0.5 rounded text-[11px] font-bold bg-[#fde68a] text-[#0284c7] hover:bg-white border border-[#0284c7] transition-all cursor-pointer"
                    title="重新一行行执行启动脚本"
                  >
                    ▶ 重新运行
                  </button>
                  <div className="flex items-center gap-1.5 text-[11px] text-emerald-600 dark:text-emerald-400 font-bold">
                    <Radio className="w-3.5 h-3.5 animate-pulse" />
                    <span>ONLINE</span>
                  </div>
                </div>
              </div>

              {/* Quick Python Pills */}
              <div className="flex flex-wrap items-center gap-1.5 mb-3 pb-2 border-b border-slate-200/80 dark:border-slate-800/80">
                <span className="text-slate-500 dark:text-slate-400 text-xs font-bold">Python 快速执行:</span>
                {quickPythonCmds.map((q) => (
                  <button
                    key={q}
                    onClick={() => executePythonCmd(q)}
                    className="px-2.5 py-0.5 rounded-sm bg-[#faf8f5] dark:bg-slate-800 hover:bg-[#0284c7] hover:text-white border border-[#0284c7]/40 text-[#0284c7] dark:text-[#38bdf8] text-xs font-bold transition-all cursor-pointer shadow-[1px_1px_0px_0px_#fde68a]"
                  >
                    {q}
                  </button>
                ))}
              </div>

              {/* Line-by-Line Python Execution Stream Body */}
              <div
                ref={terminalBodyRef}
                className="space-y-1.5 max-h-64 overflow-y-auto no-scrollbar py-1 leading-relaxed"
              >
                {PYTHON_BOOT_SCRIPT.slice(0, visibleLines).map((line, idx) => (
                  <div key={idx}>{renderLine(line)}</div>
                ))}

                {/* Interactive logs */}
                {interactiveLogs.map((item, idx) => (
                  <div key={`log-${idx}`} className="space-y-0.5 pt-1">
                    <div className="text-[#0284c7] dark:text-[#38bdf8] font-bold flex items-center gap-1.5">
                      <span className="text-[#f59e0b]">{'>>>'}</span>
                      <span>{item.expr}</span>
                    </div>
                    <div className="text-slate-700 dark:text-slate-300 pl-4 font-mono font-medium">
                      {item.result}
                    </div>
                  </div>
                ))}

                {/* Blinking Cursor */}
                <div className="flex items-center gap-1 pt-0.5 text-sky-500">
                  <span className="text-[#f59e0b] font-bold">{'>>>'}</span>
                  <span className="w-2 h-3.5 bg-[#0284c7] animate-pulse inline-block"></span>
                </div>
              </div>

              {/* Interactive Python Input Form */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  executePythonCmd(inputVal);
                }}
                className="mt-3 pt-2.5 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2"
              >
                <span className="text-[#f59e0b] font-bold">{'>>>'}</span>
                <input
                  type="text"
                  value={inputVal}
                  onChange={(e) => setInputVal(e.target.value)}
                  placeholder="键入 Python 表达式 (如 me.target, me.stacks, me.motto, whoami)..."
                  className="flex-1 bg-transparent border-none outline-none text-slate-800 dark:text-slate-100 placeholder-slate-400 font-mono text-xs sm:text-sm font-medium"
                />
                <button
                  type="submit"
                  className="p-1 text-[#0284c7] dark:text-[#38bdf8] hover:text-[#0369a1] transition-colors cursor-pointer"
                  title="运行"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ----------------------------------------------------
// Mouse Particles (Hearts & Sparkles)
// ----------------------------------------------------
function MouseEffects() {
  const [particles, setParticles] = useState<{
    id: number;
    x: number;
    y: number;
    char: string;
    color: string;
    isClick?: boolean;
    angle?: number;
  }[]>([]);

  useEffect(() => {
    let lastTime = 0;
    const colors = [
      'text-[#0284c7]',
      'text-[#f59e0b]',
      'text-[#ec4899]',
      'text-[#0ea5e9]',
      'text-[#10b981]'
    ];
    const heartIcons = ['♥', '♡', '✦', '✧', '★'];

    const handleMouseMove = (e: MouseEvent) => {
      const now = Date.now();
      if (now - lastTime > 40) {
        lastTime = now;
        const newParticle = {
          id: Date.now() + Math.random(),
          x: e.clientX,
          y: e.clientY,
          char: heartIcons[Math.floor(Math.random() * heartIcons.length)],
          color: colors[Math.floor(Math.random() * colors.length)],
        };
        setParticles((prev) => [...prev.slice(-35), newParticle]);
        setTimeout(() => {
          setParticles((prev) => prev.filter((p) => p.id !== newParticle.id));
        }, 850);
      }
    };

    const handleClick = (e: MouseEvent) => {
      sfx.playPop(1200, 0.12);
      const sparks = Array.from({ length: 10 }).map((_, i) => ({
        id: Date.now() + Math.random() + i,
        x: e.clientX,
        y: e.clientY,
        char: i % 2 === 0 ? '♥' : '★',
        color: colors[Math.floor(Math.random() * colors.length)],
        isClick: true,
        angle: (i * Math.PI * 2) / 10,
      }));
      setParticles((prev) => [...prev.slice(-30), ...sparks]);
      setTimeout(() => {
        setParticles((prev) => prev.filter((p) => !sparks.find((s) => s.id === p.id)));
      }, 900);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('click', handleClick);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('click', handleClick);
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-[100] overflow-hidden select-none">
      <AnimatePresence>
        {particles.map((p) => (
          <motion.div
            key={p.id}
            initial={{
              opacity: 0.9,
              scale: p.isClick ? 0.3 : 0.5,
              x: p.x,
              y: p.y
            }}
            animate={{
              opacity: 0,
              scale: p.isClick ? 1.8 : 1.4,
              y: p.isClick ? p.y + Math.sin(p.angle || 0) * 95 : p.y - 65,
              x: p.isClick ? p.x + Math.cos(p.angle || 0) * 95 : p.x + (Math.random() - 0.5) * 45,
              rotate: p.isClick ? (Math.random() - 0.5) * 180 : (Math.random() - 0.5) * 60
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: p.isClick ? 0.9 : 0.8, ease: 'easeOut' }}
            className={`absolute -translate-x-1/2 -translate-y-1/2 ${p.color} ${p.isClick ? 'text-2xl font-black' : 'text-lg font-bold'} drop-shadow-[1.5px_1.5px_0px_#fde68a]`}
            style={{ left: 0, top: 0 }}
          >
            {p.char}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

// ----------------------------------------------------
// Neo-Brutalist Card with Spotlight & Pop
// ----------------------------------------------------
interface NeoCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  as?: any;
  href?: string;
  target?: string;
  rel?: string;
}

function NeoCard({ children, className = '', as: Component = 'div', ...props }: NeoCardProps) {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0, opacity: 0 });
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      opacity: 1
    });
  };

  const handleMouseEnter = () => {
    sfx.playPop(950, 0.04);
  };

  const handleMouseLeave = () => {
    setMousePos((prev) => ({ ...prev, opacity: 0 }));
  };

  return (
    <Component
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`neo-box rounded-xl p-5 sm:p-6 relative overflow-hidden ${className}`}
      {...props}
    >
      {/* Dynamic Cursor Spotlight */}
      <div
        className="pointer-events-none absolute -inset-px transition-opacity duration-300 z-10"
        style={{
          opacity: mousePos.opacity,
          background: `radial-gradient(400px circle at ${mousePos.x}px ${mousePos.y}px, rgba(2, 132, 199, 0.12), transparent 70%)`
        }}
      />
      {children}
    </Component>
  );
}



// ----------------------------------------------------
// Blog Feed from RSS
// ----------------------------------------------------
interface BlogPost {
  title: string;
  link: string;
  pubDate: string;
  description: string;
}

const BlogFeed = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('https://upxuu.com/latest.xml')
      .then((res) => res.text())
      .then((str) => new window.DOMParser().parseFromString(str, 'text/xml'))
      .then((data) => {
        const items = data.querySelectorAll('item');
        const parsedPosts: BlogPost[] = [];
        items.forEach((item, index) => {
          if (index >= 8) return;
          const title = item.querySelector('title')?.textContent || '';
          const link = item.querySelector('link')?.textContent || '';
          const pubDateStr = item.querySelector('pubDate')?.textContent || '';
          let description = item.querySelector('description')?.textContent || '';

          const temp = document.createElement('div');
          temp.innerHTML = description;
          description = temp.textContent || temp.innerText || '';
          if (description.length > 90) description = description.substring(0, 90) + '...';

          const date = new Date(pubDateStr);
          const formattedDate = !isNaN(date.getTime())
            ? `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
            : pubDateStr;

          parsedPosts.push({ title, link, pubDate: formattedDate, description });
        });
        setPosts(parsedPosts);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to fetch feed:', err);
        setLoading(false);
      });
  }, []);

  return (
    <div id="blog" className="space-y-6 mt-16 w-full relative z-10 scroll-mt-24">
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ type: 'spring', damping: 15, stiffness: 200 }}
        className="flex items-end justify-between px-1"
      >
        <div>
          <span className="px-2 py-0.5 bg-[#fde68a] text-[#0284c7] font-black text-xs uppercase tracking-wider rounded-sm shadow-[1.5px_1.5px_0px_0px_#0284c7] border border-[#0284c7] inline-block -skew-x-6 mb-1">
            Latest Articles
          </span>
          <h2 className="text-2xl sm:text-3xl font-black font-display tracking-tight text-slate-900 dark:text-white">
            最新动态 / 博客归档
          </h2>
        </div>
        <a
          href="https://upxuu.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="neo-tag px-3 py-1 bg-white dark:bg-slate-800 text-xs sm:text-sm font-bold text-[#0284c7] dark:text-[#38bdf8] hover:bg-[#0284c7] hover:text-white transition-all flex items-center gap-1 cursor-pointer rounded-sm -skew-x-3"
        >
          <span>完整博客</span>
          <ArrowUpRight className="w-4 h-4" />
        </a>
      </motion.div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="neo-box rounded-xl p-5 animate-pulse space-y-3">
              <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/3"></div>
              <div className="h-5 bg-slate-200 dark:bg-slate-700 rounded w-3/4"></div>
              <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-full"></div>
            </div>
          ))}
        </div>
      ) : posts.length === 0 ? (
        <div className="neo-box rounded-xl p-8 text-center text-slate-500">
          暂无动态，请直接前往主博客查阅。
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {posts.map((post, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 35, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{
                type: 'spring',
                damping: 18,
                stiffness: 220,
                delay: (i % 2) * 0.1
              }}
            >
              <NeoCard
                as="a"
                href={post.link}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col justify-between h-full"
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-500 font-mono mb-2">
                    <span className="font-bold text-[#0284c7] dark:text-[#38bdf8] flex items-center gap-1">
                      <Flame className="w-3.5 h-3.5 text-[#f59e0b]" />
                      {post.pubDate}
                    </span>
                    <ArrowUpRight className="w-4 h-4 opacity-0 -translate-x-1 translate-y-1 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0 text-[#0284c7] transition-all duration-300" />
                  </div>
                  <h3 className="text-base sm:text-lg font-black text-slate-800 dark:text-slate-100 group-hover:text-[#0284c7] dark:group-hover:text-[#38bdf8] transition-colors line-clamp-2 mb-2 leading-snug">
                    {post.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-2">
                    {post.description}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center text-xs font-black text-[#0284c7] dark:text-[#38bdf8] group-hover:translate-x-1 transition-transform">
                  阅读全文 →
                </div>
              </NeoCard>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

// ----------------------------------------------------
// Markdown Custom Renderer
// ----------------------------------------------------
const markdownComponents: any = {
  h2: () => null,
  p: ({ node, ...props }: any) => (
    <p
      className="text-slate-700 dark:text-slate-300 leading-relaxed text-sm sm:text-base font-medium mb-3 last:mb-0"
      {...props}
    />
  ),
  ul: ({ node, ...props }: any) => (
    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 my-2" {...props} />
  ),
  li: ({ node, ...props }: any) => (
    <li
      className="neo-tag bg-white/90 dark:bg-slate-800/90 rounded-lg p-2.5 sm:p-3 text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2 transition-transform hover:-translate-y-0.5"
    >
      <span className="w-2 h-2 rounded-full bg-[#0284c7] shrink-0"></span>
      <span className="leading-snug">{props.children}</span>
    </li>
  ),
  strong: ({ node, ...props }: any) => (
    <strong className="font-black text-[#0284c7] dark:text-[#38bdf8] bg-[#fde68a]/50 dark:bg-[#0284c7]/20 px-1.5 py-0.5 rounded-sm" {...props} />
  )
};

// ----------------------------------------------------
// Modular About Me Bento Section
// ----------------------------------------------------
function ModularAboutMe() {
  const sections = useMemo(() => {
    const raw = siteConfig.aboutMe.trim();
    const parts = raw.split(/\n(?=## )/);
    return parts.map((part, index) => {
      const trimmed = part.trim();
      if (trimmed.startsWith('## ')) {
        const firstLineEnd = trimmed.indexOf('\n');
        if (firstLineEnd === -1) {
          return { title: trimmed.replace('## ', '').trim(), content: '', index };
        }
        const title = trimmed.slice(0, firstLineEnd).replace('## ', '').trim();
        const content = trimmed.slice(firstLineEnd).trim();
        return { title, content, index };
      } else {
        return { title: 'Hello World', content: trimmed, index };
      }
    });
  }, []);

  const getSectionIcon = (title: string) => {
    const lower = title.toLowerCase();
    if (lower.includes('who')) return <User className="w-5 h-5 text-[#0284c7]" />;
    if (lower.includes('what') || lower.includes('do')) return <Code2 className="w-5 h-5 text-[#10b981]" />;
    if (lower.includes('philosophy')) return <Flame className="w-5 h-5 text-[#f59e0b]" />;
    if (lower.includes('currently')) return <Activity className="w-5 h-5 text-[#0ea5e9]" />;
    if (lower.includes('goal')) return <Target className="w-5 h-5 text-[#ec4899]" />;
    return <Sparkles className="w-5 h-5 text-[#f59e0b]" />;
  };

  const getGridSpan = (title: string, index: number) => {
    const lower = title.toLowerCase();
    if (index === 0 || lower.includes('hello')) return 'col-span-1 md:col-span-2';
    if (lower.includes('goal')) return 'col-span-1 md:col-span-2';
    return 'col-span-1';
  };

  return (
    <div id="about" className="w-full mt-16 scroll-mt-24">
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ type: 'spring', damping: 15, stiffness: 200 }}
        className="px-1 mb-5"
      >
        <span className="px-2 py-0.5 bg-[#fde68a] text-[#0284c7] font-black text-xs uppercase tracking-wider rounded-sm shadow-[1.5px_1.5px_0px_0px_#0284c7] border border-[#0284c7] inline-block -skew-x-6 mb-1">
          Profile & Bio
        </span>
        <h2 className="text-2xl sm:text-3xl font-black font-display tracking-tight text-slate-900 dark:text-white">
          关于我 / 多维档案
        </h2>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sections.map((sec, idx) => (
          <motion.div
            key={sec.title}
            initial={{ opacity: 0, y: 35, scale: 0.95 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{
              type: 'spring',
              damping: 18,
              stiffness: 220,
              delay: idx * 0.08
            }}
            className={getGridSpan(sec.title, idx)}
          >
            <NeoCard className={`h-full flex flex-col justify-between ${
              sec.title.toLowerCase().includes('philosophy')
                ? 'bg-[#fde68a]/30 dark:bg-amber-950/20 border-[#f59e0b]'
                : ''
            }`}>
              <div>
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-200 dark:border-slate-800">
                  <div className="flex items-center gap-2.5">
                    <div className="p-1.5 rounded-md bg-[#fde68a] border-2 border-[#0284c7] shadow-[1.5px_1.5px_0px_0px_#0284c7]">
                      {getSectionIcon(sec.title)}
                    </div>
                    <h3 className="font-black text-base sm:text-lg text-slate-900 dark:text-white tracking-tight">
                      {sec.title === 'Hello World' ? '👋 你好，世界！' : sec.title}
                    </h3>
                  </div>
                  <span className="text-[11px] font-mono font-bold text-slate-500 dark:text-slate-400 uppercase px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                    0{idx + 1}
                  </span>
                </div>

                <div className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed">
                  <Markdown components={markdownComponents}>
                    {sec.content}
                  </Markdown>
                </div>
              </div>
            </NeoCard>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// ----------------------------------------------------
// GitHub Projects Horizontal Marquee
// ----------------------------------------------------
function GithubProjects() {
  const [repos, setRepos] = useState<any[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    fetch('https://api.github.com/users/ImUpXuu/repos?sort=updated&per_page=8')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setRepos(data);
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el || repos.length === 0 || isHovered) return;

    let animationId: number;
    let lastTime = performance.now();

    const scroll = (time: number) => {
      const dt = time - lastTime;
      lastTime = time;

      if (el) {
        el.scrollLeft += dt * 0.045;
        if (el.scrollLeft >= el.scrollWidth / 2) {
          el.scrollLeft = 0;
        }
      }
      animationId = requestAnimationFrame(scroll);
    };

    animationId = requestAnimationFrame(scroll);
    return () => cancelAnimationFrame(animationId);
  }, [repos, isHovered]);

  if (repos.length === 0) return null;

  return (
    <motion.div
      id="projects"
      initial={{ opacity: 0, y: 35 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ type: 'spring', damping: 18, stiffness: 200 }}
      className="w-full mt-16 scroll-mt-24"
    >
      <div className="flex items-end justify-between px-1 mb-5">
        <div>
          <span className="px-2 py-0.5 bg-[#fde68a] text-[#0284c7] font-black text-xs uppercase tracking-wider rounded-sm shadow-[1.5px_1.5px_0px_0px_#0284c7] border border-[#0284c7] inline-block -skew-x-6 mb-1">
            Open Source
          </span>
          <h2 className="text-2xl sm:text-3xl font-black font-display tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            开源项目
          </h2>
        </div>
        <a
          href="https://github.com/ImUpXuu"
          target="_blank"
          rel="noopener noreferrer"
          className="neo-tag px-3 py-1 bg-white dark:bg-slate-800 text-xs sm:text-sm font-bold text-[#0284c7] dark:text-[#38bdf8] hover:bg-[#0284c7] hover:text-white transition-all flex items-center gap-1 cursor-pointer rounded-sm -skew-x-3"
        >
          <span>GitHub 仓库</span>
          <ArrowUpRight className="w-4 h-4" />
        </a>
      </div>

      <div
        ref={scrollRef}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onTouchStart={() => setIsHovered(true)}
        onTouchEnd={() => setIsHovered(false)}
        className="flex gap-4 overflow-x-auto no-scrollbar py-2 -mx-2 px-2 cursor-grab active:cursor-grabbing"
      >
        {[...repos, ...repos].map((repo, i) => (
          <NeoCard
            key={`${repo.id}-${i}`}
            as="a"
            href={repo.html_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-shrink-0 w-72 sm:w-80 flex flex-col justify-between group"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2.5">
                <div className="flex items-center gap-2 truncate">
                  <div className="p-1 rounded bg-[#fde68a] border border-[#0284c7] text-[#0284c7] shrink-0">
                    <Github className="w-4 h-4" />
                  </div>
                  <span className="font-black text-sm sm:text-base text-slate-900 dark:text-white group-hover:text-[#0284c7] transition-colors truncate">
                    {repo.name}
                  </span>
                </div>
                <ArrowUpRight className="w-4 h-4 text-[#0284c7] shrink-0" />
              </div>

              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-2 h-9 mb-4">
                {repo.description || '探索编程与独立开发的个人项目'}
              </p>
            </div>

            <div className="flex items-center gap-3 text-xs font-mono font-bold text-slate-600 dark:text-slate-400 pt-3 border-t border-slate-200 dark:border-slate-800">
              <span className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-sky-100 dark:bg-sky-950/60 text-[#0284c7] dark:text-[#38bdf8]">
                <span>{repo.language || 'Code'}</span>
              </span>
              <span className="flex items-center gap-1 text-[#f59e0b]">
                <span>★</span>
                <span>{repo.stargazers_count}</span>
              </span>
              <span className="flex items-center gap-1">
                <span>⑂</span>
                <span>{repo.forks_count}</span>
              </span>
            </div>
          </NeoCard>
        ))}
      </div>
    </motion.div>
  );
}

// ----------------------------------------------------
// Main App Component
// ----------------------------------------------------
export default function App() {
  const [bgImage, setBgImage] = useState<string>('');
  const [isDark, setIsDark] = useState(false);
  const [isLoaded, setIsLoaded] = useState(true);

  // Scroll Progress
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const [descIndex, setDescIndex] = useState(0);
  const [descText, setDescText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [hearts, setHearts] = useState<{ id: number; x: number }[]>([]);
  const [isAtBottom, setIsAtBottom] = useState(false);
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      const { scrollY } = window;
      const { scrollHeight, clientHeight } = document.documentElement;
      if (scrollY + clientHeight >= scrollHeight - 60) {
        setIsAtBottom(true);
      } else {
        setIsAtBottom(false);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Smooth Lenis Scroll
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.8,
    });
    lenisRef.current = lenis;

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  // Typewriter effect
  useEffect(() => {
    if (!siteConfig.descriptions || siteConfig.descriptions.length === 0) return;

    const currentFullText = siteConfig.descriptions[descIndex];
    const typingSpeed = isDeleting ? 28 : 85;

    if (!isDeleting && descText === currentFullText) {
      const timeout = setTimeout(() => setIsDeleting(true), 2400);
      return () => clearTimeout(timeout);
    }

    if (isDeleting && descText === '') {
      setIsDeleting(false);
      setDescIndex((prev) => (prev + 1) % siteConfig.descriptions.length);
      return;
    }

    const timeout = setTimeout(() => {
      setDescText(currentFullText.slice(0, descText.length + (isDeleting ? -1 : 1)));

      if (!isDeleting && Math.random() > 0.45) {
        const newHeart = { id: Date.now() + Math.random(), x: (Math.random() - 0.5) * 36 };
        setHearts((prev) => [...prev, newHeart]);
        setTimeout(() => {
          setHearts((prev) => prev.filter((h) => h.id !== newHeart.id));
        }, 900);
      }
    }, typingSpeed);

    return () => clearTimeout(timeout);
  }, [descText, isDeleting, descIndex]);

  useEffect(() => {
    const randomBg = siteConfig.backgrounds[Math.floor(Math.random() * siteConfig.backgrounds.length)];
    setBgImage(randomBg);

    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setIsDark(true);
    }
  }, []);

  const toggleTheme = () => {
    sfx.playPop(isDark ? 800 : 1200, 0.06);
    setIsDark(!isDark);
  };

  const scrollToSection = (id: string) => {
    sfx.playPop(900, 0.05);
    const el = document.getElementById(id);
    if (el && lenisRef.current) {
      lenisRef.current.scrollTo(el, { offset: -80, duration: 1.2 });
    }
  };

  const getSiteIcon = (index: number) => {
    switch (index) {
      case 0: return <BookOpen className="w-5 h-5 text-[#0284c7]" />;
      case 1: return <Code2 className="w-5 h-5 text-[#f59e0b]" />;
      case 2: return <Activity className="w-5 h-5 text-[#10b981]" />;
      default: return <FolderGit2 className="w-5 h-5 text-[#ec4899]" />;
    }
  };

  const getSocialIcon = (iconName: string) => {
    switch (iconName) {
      case 'github': return <Github size={18} />;
      case 'mail': return <Mail size={18} />;
      case 'globe': return <Globe size={18} />;
      default: return <ExternalLink size={18} />;
    }
  };

  return (
    <div className={`min-h-screen w-full selection:bg-[#fde68a] selection:text-[#0284c7] ${isDark ? 'dark' : ''}`}>
      <MouseEffects />

      {/* UpXuu signature Top Scroll Progress Line */}
      <div className="fixed top-0 left-0 w-full h-[4.5px] bg-transparent z-[120] pointer-events-none">
        <motion.div
          className="h-full bg-gradient-to-r from-[#0284c7] via-[#0ea5e9] to-[#f59e0b] origin-left"
          style={{ scaleX }}
        />
      </div>

      {/* Fixed Ambient Background */}
      <div className="fixed inset-0 w-full h-full bg-[#faf8f5] dark:bg-slate-900 transition-colors duration-700 z-0 overflow-hidden">
        <AnimatePresence>
          {bgImage && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.2 }}
              className="absolute inset-0 z-0"
            >
              <img
                src={bgImage}
                alt="Cover"
                className="w-full h-full object-cover opacity-60 dark:opacity-25 filter blur-[1.5px] transform scale-[1.03]"
              />
              <div className="absolute inset-0 bg-white/45 dark:bg-slate-900/80 bg-dot-pattern" />
              <div className="absolute inset-0 bg-gradient-to-b from-[#faf8f5]/20 via-transparent to-[#faf8f5]/80 dark:from-slate-900/40 dark:via-transparent dark:to-slate-900/90" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* UpXuu Style Top Bar */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b-4 border-[#0284c7] px-3 py-2.5 sm:px-6 sm:py-3 shadow-[0px_4px_0px_0px_rgba(2,132,199,0.15)]">
        <div className="max-w-[1200px] mx-auto flex justify-between items-center gap-2">
          {/* Logo with signature Skewed Avatar box */}
          <button 
            onClick={() => lenisRef.current?.scrollTo(0)}
            className="flex items-center gap-2 sm:gap-2.5 text-left cursor-pointer group"
          >
            <div className="w-8 h-8 flex items-center justify-center bg-[#fde68a] border-2 border-[#0284c7] font-black transform -skew-x-12 shadow-[2px_2px_0px_0px_#0284c7] overflow-hidden shrink-0 group-hover:scale-105 transition-transform">
              <img src={siteConfig.avatar} alt="Logo" className="w-full h-full object-cover transform skew-x-12" />
            </div>
            <div className="flex flex-col">
              <span className="font-black font-display tracking-widest text-sm sm:text-base text-[#0284c7] dark:text-[#38bdf8] uppercase leading-none">
                {siteConfig.name}
              </span>
              <span className="text-[10px] font-mono text-slate-500 font-bold tracking-tight">I.UPXUU.COM</span>
            </div>
          </button>

          {/* Nav links with UpXuu Signature Skewed Buttons */}
          <div className="flex items-center gap-1.5 sm:gap-2.5">
            <button
              onClick={() => scrollToSection('sites')}
              className="px-2 py-1 sm:px-3 sm:py-1 border-2 border-[#0284c7] font-black uppercase text-xs tracking-wider rounded-sm text-[#0284c7] dark:text-[#38bdf8] shadow-[1.5px_1.5px_0px_0px_#fde68a] hover:bg-[#0284c7] hover:text-white transition-all cursor-pointer transform -skew-x-3 hidden xs:block"
            >
              站点
            </button>
            <button
              onClick={() => scrollToSection('projects')}
              className="px-2 py-1 sm:px-3 sm:py-1 border-2 border-[#0284c7] font-black uppercase text-xs tracking-wider rounded-sm text-[#0284c7] dark:text-[#38bdf8] shadow-[1.5px_1.5px_0px_0px_#fde68a] hover:bg-[#0284c7] hover:text-white transition-all cursor-pointer transform -skew-x-3 hidden sm:block"
            >
              开源
            </button>
            <button
              onClick={() => scrollToSection('about')}
              className="px-2 py-1 sm:px-3 sm:py-1 border-2 border-[#0284c7] font-black uppercase text-xs tracking-wider rounded-sm text-[#0284c7] dark:text-[#38bdf8] shadow-[1.5px_1.5px_0px_0px_#fde68a] hover:bg-[#0284c7] hover:text-white transition-all cursor-pointer transform -skew-x-3 hidden sm:block"
            >
              关于
            </button>
            <button
              onClick={() => scrollToSection('blog')}
              className="px-2 py-1 sm:px-3 sm:py-1 border-2 border-[#0284c7] font-black uppercase text-xs tracking-wider rounded-sm text-[#0284c7] dark:text-[#38bdf8] shadow-[1.5px_1.5px_0px_0px_#fde68a] hover:bg-[#0284c7] hover:text-white transition-all cursor-pointer transform -skew-x-3"
            >
              动态
            </button>

            {/* Dark Mode */}
            <button
              onClick={toggleTheme}
              className="p-1.5 rounded border-2 border-[#0284c7] bg-white dark:bg-slate-800 shadow-[1.5px_1.5px_0px_0px_#0284c7] text-[#0284c7] transition-all cursor-pointer"
            >
              {isDark ? <Sun size={15} className="text-[#f59e0b]" /> : <Moon size={15} />}
            </button>

            {/* External Blog Direct Link */}
            <a
              href="https://upxuu.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="px-2.5 py-1 sm:px-3 sm:py-1 bg-[#0284c7] text-white font-black text-xs uppercase tracking-wider rounded-sm border-2 border-[#0284c7] shadow-[2px_2px_0px_0px_#f59e0b] hover:bg-[#0369a1] hover:shadow-[3px_3px_0px_0px_#fde68a] transition-all flex items-center gap-1 transform -skew-x-6"
            >
              <span>主站博客</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="relative z-10 w-full flex flex-col items-center pt-16">
        
        {/* Hero Section with Explosive Entrance Animations */}
        <section className="min-h-screen w-full flex flex-col items-center justify-center p-4 sm:p-6 relative pt-20 pb-16">
          <div className="w-full max-w-2xl mx-auto flex flex-col items-center text-center">
            <AnimatePresence>
              {isLoaded && (
                <motion.div
                  initial="hidden"
                  animate="visible"
                  variants={{
                    hidden: { opacity: 0 },
                    visible: {
                      opacity: 1,
                      transition: { staggerChildren: 0.12, delayChildren: 0.1 }
                    }
                  }}
                  className="flex flex-col items-center w-full"
                >
                  {/* Avatar: Bouncy Pop & Rotate In */}
                  <motion.div
                    variants={{
                      hidden: { opacity: 0, scale: 0.2, rotate: -25 },
                      visible: { 
                        opacity: 1, 
                        scale: 1, 
                        rotate: 0,
                        transition: { type: 'spring', damping: 12, stiffness: 180 }
                      }
                    }}
                    className="relative mb-6 sm:mb-8 group"
                  >
                    {/* Shadow Block Backdrop */}
                    <div className="absolute inset-0 bg-[#fde68a] border-4 border-[#0284c7] rounded-3xl transform rotate-6 shadow-[5px_5px_0px_0px_#0284c7] group-hover:rotate-12 transition-transform duration-300"></div>
                    
                    <div className="relative p-1 bg-white border-4 border-[#0284c7] rounded-3xl shadow-[5px_5px_0px_0px_#f59e0b] overflow-hidden">
                      <img
                        src={siteConfig.avatar}
                        alt={siteConfig.name}
                        className="w-32 h-32 sm:w-40 sm:h-40 rounded-2xl object-cover transform group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>

                    {/* Skewed Status Badge */}
                    <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-[#fde68a] border-2 border-[#0284c7] px-3 py-0.5 rounded-sm shadow-[2px_2px_0px_0px_#0284c7] flex items-center gap-1.5 font-black text-xs text-[#0284c7] transform -skew-x-6 whitespace-nowrap">
                      <span className="w-2 h-2 rounded-full bg-[#10b981] animate-ping"></span>
                      <span>ONLINE · UPXUU</span>
                    </div>
                  </motion.div>

                  {/* Greeting & Headline */}
                  <motion.div
                    variants={{
                      hidden: { opacity: 0, y: 30, scale: 0.8 },
                      visible: { 
                        opacity: 1, 
                        y: 0, 
                        scale: 1,
                        transition: { type: 'spring', damping: 14, stiffness: 200 }
                      }
                    }}
                    className="mb-2"
                  >
                    <span className="neo-tag px-3 py-1 bg-white dark:bg-slate-800 text-[#0284c7] font-black text-xs sm:text-sm uppercase tracking-widest inline-block -skew-x-6">
                      ✨ WELCOME TO MY CORNER
                    </span>
                  </motion.div>

                  <motion.h1
                    variants={{
                      hidden: { opacity: 0, y: 40, scale: 0.9 },
                      visible: { 
                        opacity: 1, 
                        y: 0, 
                        scale: 1,
                        transition: { type: 'spring', damping: 12, stiffness: 180 }
                      }
                    }}
                    className="text-4xl sm:text-6xl font-black font-display tracking-tight text-slate-900 dark:text-white mb-3"
                  >
                    HI, I'M <span className="text-[#0284c7] dark:text-[#38bdf8] drop-shadow-[2px_2px_0px_#fde68a]">{siteConfig.name}</span>
                  </motion.h1>

                  {/* Title pill */}
                  <motion.div
                    variants={{
                      hidden: { opacity: 0, scale: 0.5 },
                      visible: { 
                        opacity: 1, 
                        scale: 1,
                        transition: { type: 'spring', damping: 15, stiffness: 220 }
                      }
                    }}
                    className="mb-6"
                  >
                    <div className="neo-box px-4 py-1.5 rounded-md text-xs sm:text-sm font-mono font-black text-[#0284c7] dark:text-[#38bdf8] inline-flex items-center gap-2">
                      <span className="w-2 h-2 bg-[#f59e0b] rounded-full"></span>
                      <span>{siteConfig.title}</span>
                    </div>
                  </motion.div>

                  {/* Typewriter with Floating Hearts */}
                  <motion.div
                    variants={{
                      hidden: { opacity: 0, y: 25 },
                      visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
                    }}
                    className="mb-8 max-w-lg px-3 w-full min-h-[4rem] flex items-center justify-center"
                  >
                    <div className="neo-tag px-4 py-2.5 rounded-lg bg-white/90 dark:bg-slate-800/90 text-slate-800 dark:text-slate-100 leading-relaxed text-sm sm:text-lg font-bold text-center relative inline-flex items-center flex-wrap justify-center font-mono">
                      <span>{descText}</span>
                      <span className="inline-block w-[3px] h-[1.15em] ml-1 bg-[#0284c7] animate-[pulse_1s_step-end_infinite] align-middle rounded-full relative">
                        <AnimatePresence>
                          {hearts.map((h) => (
                            <motion.span
                              key={h.id}
                              initial={{ opacity: 1, y: 0, scale: 0.6, x: h.x / 2 }}
                              animate={{ opacity: 0, y: -42, scale: 1.6, x: h.x }}
                              exit={{ opacity: 0 }}
                              transition={{ duration: 0.8, ease: 'easeOut' }}
                              className="absolute bottom-full left-1/2 -translate-x-1/2 text-[#ec4899] text-sm pointer-events-none drop-shadow-[1px_1px_0px_#fde68a]"
                            >
                              ♥
                            </motion.span>
                          ))}
                        </AnimatePresence>
                      </span>
                    </div>
                  </motion.div>

                  {/* Social Buttons: Staggered spring bounce */}
                  <motion.div
                    variants={{
                      hidden: { opacity: 0 },
                      visible: {
                        opacity: 1,
                        transition: { staggerChildren: 0.08 }
                      }
                    }}
                    className="flex flex-wrap justify-center gap-3"
                  >
                    {siteConfig.socials.map((social) => (
                      <motion.a
                        key={social.label}
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        variants={{
                          hidden: { opacity: 0, y: 25, scale: 0.7 },
                          visible: { 
                            opacity: 1, 
                            y: 0, 
                            scale: 1,
                            transition: { type: 'spring', damping: 14, stiffness: 220 }
                          }
                        }}
                        className="neo-box flex items-center gap-2 px-4 py-2.5 rounded-md text-xs sm:text-sm font-black text-[#0284c7] dark:text-[#38bdf8] hover:text-white hover:bg-[#0284c7] transition-all cursor-pointer transform -skew-x-3"
                        aria-label={social.label}
                      >
                        {getSocialIcon(social.icon)}
                        <span>{social.label}</span>
                      </motion.a>
                    ))}
                  </motion.div>

                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </section>

        {/* Content Section Container */}
        <section className="w-full max-w-4xl mx-auto px-4 sm:px-6 pb-28">

          {/* My Sites (我的站点) */}
          {siteConfig.sites && siteConfig.sites.length > 0 && (
            <div id="sites" className="w-full scroll-mt-24">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ type: 'spring', damping: 15, stiffness: 200 }}
                className="flex items-end justify-between px-1 mb-5"
              >
                <div>
                  <span className="px-2 py-0.5 bg-[#fde68a] text-[#0284c7] font-black text-xs uppercase tracking-wider rounded-sm shadow-[1.5px_1.5px_0px_0px_#0284c7] border border-[#0284c7] inline-block -skew-x-6 mb-1">
                    Web Services
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-black font-display tracking-tight text-slate-900 dark:text-white">
                    我的站点 / 服务导航
                  </h2>
                </div>
              </motion.div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {siteConfig.sites.map((site, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 40, scale: 0.92 }}
                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                    viewport={{ once: true, margin: '-40px' }}
                    transition={{
                      type: 'spring',
                      damping: 18,
                      stiffness: 220,
                      delay: index * 0.08
                    }}
                  >
                    <NeoCard
                      as="a"
                      href={site.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex flex-col justify-between h-full"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-3 mb-3">
                          <div className="p-2.5 rounded-lg bg-[#fde68a] border-2 border-[#0284c7] shadow-[2px_2px_0px_0px_#0284c7] group-hover:scale-110 transition-transform">
                            {getSiteIcon(index)}
                          </div>
                          <span className="p-1 rounded text-[#0284c7] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform">
                            <ArrowUpRight className="w-5 h-5 font-black" />
                          </span>
                        </div>
                        <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white group-hover:text-[#0284c7] transition-colors">
                          {site.name}
                        </h3>
                        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed mt-1">
                          {site.description}
                        </p>
                      </div>

                      <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800 text-[11px] font-mono font-bold text-slate-500 truncate flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-[#10b981]"></span>
                        <span>{site.url.replace(/^https?:\/\//, '')}</span>
                      </div>
                    </NeoCard>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* GitHub Open Source Projects Carousel */}
          <GithubProjects />

          {/* Modular About Me Section */}
          <ModularAboutMe />

          {/* Cyber Terminal Easter Egg HUD */}
          <CyberTerminal />

          {/* RSS Blog Feed */}
          <BlogFeed />

          {/* UpXuu Style Footer */}
          <footer className="mt-24 pt-8 border-t-2 border-[#0284c7] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono font-bold text-slate-600 dark:text-slate-400 text-center sm:text-left">
            <div>
              <span>© {new Date().getFullYear()} {siteConfig.name}</span>
              <span className="mx-2">·</span>
              <span className="text-[#0284c7] dark:text-[#38bdf8]">逐光而上，笃行致远</span>
            </div>
            <button
              onClick={() => {
                sfx.playPop(1100, 0.08);
                lenisRef.current?.scrollTo(0, { duration: 1.2 });
              }}
              className="neo-tag px-3 py-1 bg-white dark:bg-slate-800 text-[#0284c7] dark:text-[#38bdf8] hover:bg-[#0284c7] hover:text-white transition-all cursor-pointer rounded-sm flex items-center gap-1.5 -skew-x-3"
            >
              <span>回到顶部</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </footer>

        </section>

        {/* Floating Scroll Down Indicator */}
        <AnimatePresence>
          {!isAtBottom && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, y: [0, 8, 0] }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{
                opacity: { duration: 0.3 },
                y: { repeat: Infinity, duration: 1.8, ease: 'easeInOut' }
              }}
              className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 p-2.5 rounded-full bg-[#fde68a] border-2 border-[#0284c7] shadow-[2px_2px_0px_0px_#0284c7] text-[#0284c7] hover:bg-[#0284c7] hover:text-white cursor-pointer transition-all"
              onClick={() => scrollToSection('sites')}
              aria-label="Scroll down"
            >
              <ChevronDown size={22} className="stroke-[3]" />
            </motion.div>
          )}
        </AnimatePresence>

      </main>
    </div>
  );
}
