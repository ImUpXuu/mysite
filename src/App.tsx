import { useEffect, useState, useRef, useMemo } from 'react';
import { motion, AnimatePresence, useScroll, useSpring, useInView } from 'motion/react';
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
  Compass,
  User,
  Target,
  Trophy,
  CheckCircle2
} from 'lucide-react';
import Markdown from 'react-markdown';
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
// Text Reveal Animation Component (Blur + Fade + Slide)
// ----------------------------------------------------
function TextReveal({
  children,
  className = '',
  delay = 0,
  y = 20
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  y?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y, filter: 'blur(4px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      exit={{ opacity: 0, y: -y, filter: 'blur(3px)' }}
      viewport={{ once: false, amount: 0.15 }}
      transition={{ duration: 0.55, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ----------------------------------------------------
// Python Terminal Script Definitions
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

// ----------------------------------------------------
// Interactive Python Terminal (In-View Typewriter Engine)
// ----------------------------------------------------
function CyberTerminal() {
  const terminalRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(terminalRef, { once: true, margin: '-60px' });
  const [isOpen, setIsOpen] = useState(true);

  // Live Typing Engine State
  const [completedLines, setCompletedLines] = useState<PythonTerminalLine[]>([]);
  const [activeLineIdx, setActiveLineIdx] = useState(0);
  const [activeTypedChars, setActiveTypedChars] = useState('');
  const [isTypingScript, setIsTypingScript] = useState(false);
  const [inputVal, setInputVal] = useState('');
  const [interactiveLogs, setInteractiveLogs] = useState<Array<{ expr: string; result: string }>>([]);
  const terminalBodyRef = useRef<HTMLDivElement>(null);

  // Trigger typing ONLY when scrolled into view
  useEffect(() => {
    if (isInView && !isTypingScript && activeLineIdx === 0 && completedLines.length === 0) {
      setIsTypingScript(true);
    }
  }, [isInView, isTypingScript, activeLineIdx, completedLines.length]);

  // Character-by-character typewriter execution for boot script
  useEffect(() => {
    if (!isTypingScript) return;
    if (activeLineIdx >= PYTHON_BOOT_SCRIPT.length) {
      setIsTypingScript(false);
      return;
    }

    const targetLine = PYTHON_BOOT_SCRIPT[activeLineIdx];
    const fullText = targetLine.text;

    // For commands & code, type out character by character!
    if (targetLine.type === 'cmd' || targetLine.type === 'code') {
      if (activeTypedChars.length < fullText.length) {
        const timeout = setTimeout(() => {
          setActiveTypedChars(fullText.slice(0, activeTypedChars.length + 1));
          if (activeTypedChars.length % 3 === 0) {
            sfx.playPop(780 + (activeTypedChars.length % 5) * 40, 0.015);
          }
        }, 22);
        return () => clearTimeout(timeout);
      } else {
        // Line typing finished, pause briefly as if hitting Enter
        const timeout = setTimeout(() => {
          setCompletedLines((prev) => [...prev, targetLine]);
          setActiveTypedChars('');
          setActiveLineIdx((prev) => prev + 1);
        }, 120);
        return () => clearTimeout(timeout);
      }
    } else {
      // Comments, outputs, success badges appear after a brief natural pause
      const timeout = setTimeout(() => {
        setCompletedLines((prev) => [...prev, targetLine]);
        setActiveTypedChars('');
        setActiveLineIdx((prev) => prev + 1);
        sfx.playPop(700, 0.02);
      }, 70);
      return () => clearTimeout(timeout);
    }
  }, [isTypingScript, activeLineIdx, activeTypedChars]);

  // Keep auto-scrolling terminal body as new characters arrive
  useEffect(() => {
    if (terminalBodyRef.current) {
      terminalBodyRef.current.scrollTop = terminalBodyRef.current.scrollHeight;
    }
  }, [completedLines, activeTypedChars, interactiveLogs]);

  const handleReplay = () => {
    setCompletedLines([]);
    setActiveTypedChars('');
    setActiveLineIdx(0);
    setIsTypingScript(true);
    sfx.playPop(1100, 0.06);
  };

  const quickPythonCmds = ['me.target', 'me.stacks', 'me.motto', 'whoami', 'clear', 'replay'];

  // Simulated code typing effect into the input field when clicking quick buttons
  const simulateTypeAndExecute = (command: string) => {
    let currentIdx = 0;
    setInputVal('');
    const interval = setInterval(() => {
      currentIdx++;
      setInputVal(command.slice(0, currentIdx));
      sfx.playPop(850 + currentIdx * 20, 0.015);
      if (currentIdx >= command.length) {
        clearInterval(interval);
        setTimeout(() => {
          executePythonCmd(command);
        }, 140);
      }
    }, 30);
  };

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
    sfx.playPop(900, 0.04);
  };

  // Python syntax highlighting renderer
  const renderPythonLine = (line: PythonTerminalLine, isCurrentTyping = false, partialText = '') => {
    const textToRender = isCurrentTyping ? partialText : line.text;

    if (line.type === 'cmd') {
      return (
        <div className="text-[#0284c7] dark:text-[#38bdf8] font-bold flex items-center gap-1.5 flex-wrap">
          <span className="text-[#f59e0b]">upxuu@host:~$</span>
          <span>{textToRender.replace('$ ', '')}</span>
          {isCurrentTyping && <span className="w-1.5 h-3.5 bg-[#0284c7] animate-pulse inline-block" />}
        </div>
      );
    }
    if (line.type === 'comment') {
      return <div className="text-slate-400 dark:text-slate-500 italic font-mono">{textToRender}</div>;
    }
    if (line.type === 'success') {
      return (
        <div className="text-emerald-700 dark:text-emerald-300 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/25 inline-block my-0.5">
          {textToRender}
        </div>
      );
    }
    if (line.type === 'output') {
      return (
        <div className="text-sky-600 dark:text-sky-400 font-mono font-medium pl-1">
          {textToRender}
        </div>
      );
    }

    // Python code highlighting
    const parts = textToRender.split(/(".*?"|\b(?:from|import|class|def|return)\b)/g);
    return (
      <div className="font-mono text-slate-800 dark:text-slate-100 pl-1 flex items-center flex-wrap">
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
        {isCurrentTyping && <span className="w-1.5 h-3.5 bg-[#0284c7] ml-0.5 animate-pulse inline-block" />}
      </div>
    );
  };

  const currentTypingLine = activeLineIdx < PYTHON_BOOT_SCRIPT.length ? PYTHON_BOOT_SCRIPT[activeLineIdx] : null;

  return (
    <motion.div 
      id="terminal"
      ref={terminalRef}
      initial={{ opacity: 0, y: 35, scale: 0.96 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.96 }}
      viewport={{ once: false, amount: 0.15 }}
      transition={{ type: 'spring', damping: 18, stiffness: 200 }}
      className="w-full mt-10 sm:mt-16 scroll-mt-24"
    >
      <div className="flex items-center justify-between mb-2.5 px-1">
        <button
          onClick={() => {
            setIsOpen(!isOpen);
            sfx.playPop(1000, 0.05);
          }}
          className="px-2.5 py-1 bg-[#fde68a] dark:bg-slate-800 border-2 border-[#0284c7] font-black text-xs text-[#0284c7] dark:text-[#38bdf8] shadow-[1.5px_1.5px_0px_0px_#0284c7] dark:shadow-[1.5px_1.5px_0px_0px_#38bdf8] flex items-center gap-1.5 hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all cursor-pointer rounded-sm transform -skew-x-3"
        >
          <TerminalIcon className="w-3.5 h-3.5" />
          <span>{isOpen ? '[- 收起 Python 终端]' : '[+ 打开 Python 终端]'}</span>
        </button>
        <span className="text-[11px] font-mono font-bold text-slate-500">Python 3.12 // upxuu_boot</span>
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
            <div className="neo-box rounded-xl p-3 sm:p-5 font-mono text-xs sm:text-sm bg-white/95 dark:bg-slate-900/95 border-2 border-[#0284c7] shadow-[3.5px_3.5px_0px_0px_#0284c7]">
              {/* Terminal Window Bar */}
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2 mb-2.5 text-slate-500">
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#ef4444] border border-[#b91c1c]"></span>
                  <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#f59e0b] border border-[#d97706]"></span>
                  <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#10b981] border border-[#059669]"></span>
                  <span className="ml-1.5 font-bold text-[#0284c7] dark:text-[#38bdf8] text-xs flex items-center gap-1">
                    <span>🐍</span>
                    <span className="truncate max-w-[140px] sm:max-w-none">upxuu_boot.py — CPython 3.12</span>
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleReplay}
                    className="px-2 py-0.5 rounded text-[10px] sm:text-[11px] font-bold bg-[#fde68a] text-[#0284c7] hover:bg-white border border-[#0284c7] transition-all cursor-pointer"
                    title="重新一行行执行启动脚本"
                  >
                    ▶ 重新运行
                  </button>
                  <div className="flex items-center gap-1 text-[10px] sm:text-[11px] text-emerald-600 dark:text-emerald-400 font-bold">
                    <Radio className="w-3 h-3 animate-pulse" />
                    <span>ONLINE</span>
                  </div>
                </div>
              </div>

              {/* Quick Python Pills */}
              <div className="flex flex-wrap items-center gap-1.5 mb-2.5 pb-2 border-b border-slate-200/80 dark:border-slate-800/80">
                <span className="text-slate-500 dark:text-slate-400 text-[11px] font-bold">Python 快速执行:</span>
                {quickPythonCmds.map((q) => (
                  <button
                    key={q}
                    onClick={() => simulateTypeAndExecute(q)}
                    className="px-2 py-0.5 rounded-sm bg-[#faf8f5] dark:bg-slate-800 hover:bg-[#0284c7] hover:text-white border border-[#0284c7]/40 text-[#0284c7] dark:text-[#38bdf8] text-[11px] font-bold transition-all cursor-pointer shadow-[1px_1px_0px_0px_#fde68a]"
                  >
                    {q}
                  </button>
                ))}
              </div>

              {/* Line-by-Line Python Execution Stream Body */}
              <div
                ref={terminalBodyRef}
                className="space-y-1 max-h-56 sm:max-h-64 overflow-y-auto no-scrollbar py-1 leading-relaxed text-[11px] sm:text-xs"
              >
                {/* Completed lines */}
                {completedLines.map((line, idx) => (
                  <div key={idx}>{renderPythonLine(line)}</div>
                ))}

                {/* Currently typing line */}
                {isTypingScript && currentTypingLine && (
                  <div>{renderPythonLine(currentTypingLine, true, activeTypedChars)}</div>
                )}

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
                {!isTypingScript && (
                  <div className="flex items-center gap-1 pt-0.5 text-sky-500">
                    <span className="text-[#f59e0b] font-bold">{'>>>'}</span>
                    <span className="w-1.5 h-3.5 bg-[#0284c7] animate-pulse inline-block"></span>
                  </div>
                )}
              </div>

              {/* Interactive Python Input Form */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  executePythonCmd(inputVal);
                }}
                className="mt-2.5 pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2"
              >
                <span className="text-[#f59e0b] font-bold">{'>>>'}</span>
                <input
                  type="text"
                  value={inputVal}
                  onChange={(e) => setInputVal(e.target.value)}
                  placeholder="键入 Python 指令 (如 me.target, me.stacks, me.motto)..."
                  className="flex-1 bg-transparent border-none outline-none text-slate-800 dark:text-slate-100 placeholder-slate-400 font-mono text-[11px] sm:text-xs font-medium"
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
      if (now - lastTime < 45) return;
      lastTime = now;

      const newP = {
        id: now + Math.random(),
        x: e.clientX,
        y: e.clientY,
        char: heartIcons[Math.floor(Math.random() * heartIcons.length)],
        color: colors[Math.floor(Math.random() * colors.length)]
      };

      setParticles((prev) => [...prev.slice(-18), newP]);
      setTimeout(() => {
        setParticles((prev) => prev.filter((p) => p.id !== newP.id));
      }, 750);
    };

    const handleClick = (e: MouseEvent) => {
      sfx.playPop(1250, 0.05);
      const burstCount = 6;
      const newBurst = Array.from({ length: burstCount }).map((_, i) => ({
        id: Date.now() + i + Math.random(),
        x: e.clientX,
        y: e.clientY,
        char: heartIcons[Math.floor(Math.random() * heartIcons.length)],
        color: colors[Math.floor(Math.random() * colors.length)],
        isClick: true,
        angle: (i * 2 * Math.PI) / burstCount
      }));

      setParticles((prev) => [...prev, ...newBurst]);
      setTimeout(() => {
        setParticles((prev) => prev.filter((p) => !newBurst.find((b) => b.id === p.id)));
      }, 850);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('click', handleClick);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('click', handleClick);
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-[100] overflow-hidden">
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
      className={`neo-box rounded-xl p-3.5 sm:p-5 relative overflow-hidden ${className}`}
      {...props}
    >
      {/* Dynamic Cursor Spotlight */}
      <div
        className="pointer-events-none absolute -inset-px transition-opacity duration-300 z-10"
        style={{
          opacity: mousePos.opacity,
          background: `radial-gradient(350px circle at ${mousePos.x}px ${mousePos.y}px, rgba(2, 132, 199, 0.12), transparent 70%)`
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
    <div id="blog" className="space-y-4 sm:space-y-6 mt-10 sm:mt-16 w-full relative z-10 scroll-mt-24">
      <div className="flex items-end justify-between px-1">
        <div>
          <TextReveal>
            <span className="px-2 py-0.5 bg-[#fde68a] text-[#0284c7] font-black text-xs uppercase tracking-wider rounded-sm shadow-[1.5px_1.5px_0px_0px_#0284c7] border border-[#0284c7] inline-block -skew-x-6 mb-1">
              Latest Articles
            </span>
          </TextReveal>
          <TextReveal delay={0.06}>
            <h2 className="text-xl sm:text-3xl font-black font-display tracking-tight text-slate-900 dark:text-white">
              最新动态 / 博客归档
            </h2>
          </TextReveal>
        </div>
        <a
          href="https://upxuu.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="neo-tag px-2.5 py-1 bg-white dark:bg-slate-800 text-xs sm:text-sm font-bold text-[#0284c7] dark:text-[#38bdf8] hover:bg-[#0284c7] hover:text-white transition-all flex items-center gap-1 cursor-pointer rounded-sm -skew-x-3 shrink-0"
        >
          <span>完整博客</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </a>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="neo-box rounded-xl p-4 sm:p-5 animate-pulse space-y-3">
              <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/3"></div>
              <div className="h-5 bg-slate-200 dark:bg-slate-700 rounded w-3/4"></div>
              <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-full"></div>
            </div>
          ))}
        </div>
      ) : posts.length === 0 ? (
        <div className="neo-box rounded-xl p-6 sm:p-8 text-center text-slate-500 text-xs sm:text-sm">
          暂无动态，请直接前往主博客查阅。
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
          {posts.map((post, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30, scale: 0.96 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.96 }}
              viewport={{ once: false, amount: 0.15 }}
              transition={{
                type: 'spring',
                damping: 18,
                stiffness: 220,
                delay: (i % 2) * 0.08
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
                  <div className="flex items-center justify-between text-xs text-slate-500 font-mono mb-1.5">
                    <span className="font-bold text-[#0284c7] dark:text-[#38bdf8] flex items-center gap-1 text-[11px] sm:text-xs">
                      <Flame className="w-3.5 h-3.5 text-[#f59e0b]" />
                      {post.pubDate}
                    </span>
                    <ArrowUpRight className="w-4 h-4 opacity-0 -translate-x-1 translate-y-1 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0 text-[#0284c7] transition-all duration-300" />
                  </div>
                  <h3 className="text-sm sm:text-base font-black text-slate-800 dark:text-slate-100 group-hover:text-[#0284c7] dark:group-hover:text-[#38bdf8] transition-colors line-clamp-2 mb-1.5 leading-snug">
                    {post.title}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-2">
                    {post.description}
                  </p>
                </div>
                <div className="mt-3 pt-2.5 border-t border-slate-200 dark:border-slate-800 flex items-center text-xs font-black text-[#0284c7] dark:text-[#38bdf8] group-hover:translate-x-1 transition-transform">
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
      className="text-slate-700 dark:text-slate-300 leading-relaxed text-xs sm:text-sm font-medium mb-2.5 last:mb-0"
      {...props}
    />
  ),
  ul: ({ node, ...props }: any) => (
    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 my-1.5" {...props} />
  ),
  li: ({ node, ...props }: any) => (
    <li
      className="neo-tag bg-white/90 dark:bg-slate-800/90 rounded-lg p-2 sm:p-2.5 text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2 transition-transform hover:-translate-y-0.5"
    >
      <span className="w-1.5 h-1.5 rounded-full bg-[#0284c7] shrink-0"></span>
      <span className="leading-snug">{props.children}</span>
    </li>
  ),
  strong: ({ node, ...props }: any) => (
    <strong className="font-black text-[#0284c7] dark:text-[#38bdf8] bg-[#fde68a]/50 dark:bg-[#0284c7]/20 px-1 py-0.5 rounded-sm" {...props} />
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
    if (lower.includes('who')) return <User className="w-4 h-4 sm:w-5 sm:h-5 text-[#0284c7]" />;
    if (lower.includes('what') || lower.includes('do')) return <Code2 className="w-4 h-4 sm:w-5 sm:h-5 text-[#10b981]" />;
    if (lower.includes('philosophy')) return <Flame className="w-4 h-4 sm:w-5 sm:h-5 text-[#f59e0b]" />;
    if (lower.includes('currently')) return <Activity className="w-4 h-4 sm:w-5 sm:h-5 text-[#0ea5e9]" />;
    if (lower.includes('goal')) return <Target className="w-4 h-4 sm:w-5 sm:h-5 text-[#ec4899]" />;
    return <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-[#f59e0b]" />;
  };

  const getGridSpan = (title: string, index: number) => {
    const lower = title.toLowerCase();
    if (index === 0 || lower.includes('hello')) return 'col-span-1 md:col-span-2';
    if (lower.includes('goal')) return 'col-span-1 md:col-span-2';
    return 'col-span-1';
  };

  return (
    <div id="about" className="w-full mt-10 sm:mt-16 scroll-mt-24">
      <div className="px-1 mb-4">
        <TextReveal>
          <span className="px-2 py-0.5 bg-[#fde68a] text-[#0284c7] font-black text-xs uppercase tracking-wider rounded-sm shadow-[1.5px_1.5px_0px_0px_#0284c7] border border-[#0284c7] inline-block -skew-x-6 mb-1">
            Profile & Bio
          </span>
        </TextReveal>
        <TextReveal delay={0.06}>
          <h2 className="text-xl sm:text-3xl font-black font-display tracking-tight text-slate-900 dark:text-white">
            关于我 / 多维档案
          </h2>
        </TextReveal>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 sm:gap-4">
        {sections.map((sec, idx) => (
          <motion.div
            key={sec.title}
            initial={{ opacity: 0, y: 30, scale: 0.96 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.96 }}
            viewport={{ once: false, amount: 0.15 }}
            transition={{
              type: 'spring',
              damping: 18,
              stiffness: 220,
              delay: (idx % 2) * 0.08
            }}
            className={getGridSpan(sec.title, idx)}
          >
            <NeoCard className="h-full flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2 sm:mb-3 pb-2 border-b border-slate-200 dark:border-slate-800">
                  <div className="p-1 rounded bg-[#fde68a] border border-[#0284c7]">
                    {getSectionIcon(sec.title)}
                  </div>
                  <h3 className="font-black text-sm sm:text-base text-slate-900 dark:text-white tracking-wide">
                    {sec.title}
                  </h3>
                </div>

                <div className="text-slate-600 dark:text-slate-300">
                  <Markdown components={markdownComponents}>
                    {sec.content}
                  </Markdown>
                </div>
              </div>

              {sec.title.toLowerCase().includes('goal') && (
                <div className="mt-3 pt-2.5 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs font-mono font-bold text-[#0284c7] dark:text-[#38bdf8]">
                  <span className="flex items-center gap-1">
                    <Trophy className="w-3.5 h-3.5 text-[#f59e0b]" />
                    <span>目标设定 · 笃行致远</span>
                  </span>
                  <span className="text-[11px] bg-[#fde68a] dark:bg-slate-800 text-[#0284c7] px-2 py-0.5 rounded border border-[#0284c7]">
                    PROGRESSING
                  </span>
                </div>
              )}
            </NeoCard>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// ----------------------------------------------------
// GitHub Repos Horizontal Carousel
// ----------------------------------------------------
interface Repo {
  id: number;
  name: string;
  description: string;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  language: string;
}

const FALLBACK_REPOS: Repo[] = [
  {
    id: 1,
    name: "astro-theme-pure",
    description: "一个基于 Astro 的轻量、干净的高性能个人站点主题",
    html_url: "https://github.com/ImUpXuu",
    stargazers_count: 42,
    forks_count: 8,
    language: "Astro"
  },
  {
    id: 2,
    name: "upxuu-workspace",
    description: "个人工作台与多站点边缘路由反代配置",
    html_url: "https://github.com/ImUpXuu",
    stargazers_count: 19,
    forks_count: 3,
    language: "Python"
  },
  {
    id: 3,
    name: "mini-dock-scripts",
    description: "Linux 与轻量云服务器自动化维护与监控脚本",
    html_url: "https://github.com/ImUpXuu",
    stargazers_count: 15,
    forks_count: 2,
    language: "Shell"
  },
  {
    id: 4,
    name: "neo-personal-page",
    description: "波普新野兽派个人交互主页 SPA",
    html_url: "https://github.com/ImUpXuu",
    stargazers_count: 31,
    forks_count: 5,
    language: "TypeScript"
  }
];

function GithubProjects() {
  const [repos, setRepos] = useState<Repo[]>(FALLBACK_REPOS);
  const [isHovered, setIsHovered] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch('https://api.github.com/users/ImUpXuu/repos?sort=updated&per_page=8')
      .then((res) => {
        if (!res.ok) throw new Error('API limit or network error');
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setRepos(data);
        }
      })
      .catch(() => {
        setRepos(FALLBACK_REPOS);
      });
  }, []);

  // Smooth continuous marquee scroll
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    let animationId: number;
    let lastTimestamp: number = 0;

    const scroll = (time: number) => {
      if (!lastTimestamp) lastTimestamp = time;
      const dt = time - lastTimestamp;
      lastTimestamp = time;

      if (!isHovered && el) {
        el.scrollLeft += dt * 0.045;
        if (el.scrollLeft >= el.scrollWidth / 2) {
          el.scrollLeft = 0;
        }
      }
      animationId = requestAnimationFrame(scroll);
    };

    animationId = requestAnimationFrame(scroll);
    return () => cancelAnimationFrame(animationId);
  }, [isHovered]);

  return (
    <motion.div
      id="projects"
      initial={{ opacity: 0, y: 35, scale: 0.96 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.96 }}
      viewport={{ once: false, amount: 0.15 }}
      transition={{ type: 'spring', damping: 18, stiffness: 200 }}
      className="w-full mt-10 sm:mt-16 scroll-mt-24"
    >
      <div className="flex items-end justify-between px-1 mb-4">
        <div>
          <TextReveal>
            <span className="px-2 py-0.5 bg-[#fde68a] text-[#0284c7] font-black text-xs uppercase tracking-wider rounded-sm shadow-[1.5px_1.5px_0px_0px_#0284c7] border border-[#0284c7] inline-block -skew-x-6 mb-1">
              Open Source
            </span>
          </TextReveal>
          <TextReveal delay={0.06}>
            <h2 className="text-xl sm:text-3xl font-black font-display tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
              开源项目
            </h2>
          </TextReveal>
        </div>
        <a
          href="https://github.com/ImUpXuu"
          target="_blank"
          rel="noopener noreferrer"
          className="neo-tag px-2.5 py-1 bg-white dark:bg-slate-800 text-xs sm:text-sm font-bold text-[#0284c7] dark:text-[#38bdf8] hover:bg-[#0284c7] hover:text-white transition-all flex items-center gap-1 cursor-pointer rounded-sm -skew-x-3 shrink-0"
        >
          <span>GitHub 仓库</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </a>
      </div>

      <div
        ref={scrollRef}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onTouchStart={() => setIsHovered(true)}
        onTouchEnd={() => setIsHovered(false)}
        className="flex gap-3 sm:gap-4 overflow-x-auto no-scrollbar py-2 -mx-2 px-2 cursor-grab active:cursor-grabbing"
      >
        {[...repos, ...repos].map((repo, i) => (
          <NeoCard
            key={`${repo.id}-${i}`}
            as="a"
            href={repo.html_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-shrink-0 w-64 sm:w-80 flex flex-col justify-between group"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2 truncate">
                  <div className="p-1 rounded bg-[#fde68a] border border-[#0284c7] text-[#0284c7] shrink-0">
                    <Github className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </div>
                  <span className="font-black text-xs sm:text-base text-slate-900 dark:text-white group-hover:text-[#0284c7] transition-colors truncate">
                    {repo.name}
                  </span>
                </div>
                <ArrowUpRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#0284c7] shrink-0" />
              </div>

              <p className="text-[11px] sm:text-xs text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-2 h-8 sm:h-9 mb-3">
                {repo.description || '探索编程与独立开发的个人项目'}
              </p>
            </div>

            <div className="flex items-center gap-2.5 text-[11px] font-mono font-bold text-slate-600 dark:text-slate-400 pt-2.5 border-t border-slate-200 dark:border-slate-800">
              <span className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-sky-100 dark:bg-sky-950/60 text-[#0284c7] dark:text-[#38bdf8]">
                <span>{repo.language || 'Code'}</span>
              </span>
              <span className="flex items-center gap-0.5 text-[#f59e0b]">
                <span>★</span>
                <span>{repo.stargazers_count}</span>
              </span>
              <span className="flex items-center gap-0.5">
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

  // 100% Reliable Native Smooth Scrolling
  const scrollToSection = (id: string) => {
    sfx.playPop(900, 0.05);
    const el = document.getElementById(id);
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 75;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  // Smart floating scroll down button: jumps sequentially through all sections
  const handleScrollDownNext = () => {
    sfx.playPop(1000, 0.06);
    const sectionIds = ['sites', 'projects', 'about', 'terminal', 'blog'];
    const currentY = window.scrollY;

    for (const id of sectionIds) {
      const el = document.getElementById(id);
      if (el) {
        const top = el.getBoundingClientRect().top + window.scrollY;
        if (top > currentY + 90) {
          window.scrollTo({ top: top - 75, behavior: 'smooth' });
          return;
        }
      }
    }
    // If at the end, scroll to footer
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
  };

  const getSiteIcon = (index: number) => {
    switch (index) {
      case 0: return <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-[#0284c7]" />;
      case 1: return <Code2 className="w-4 h-4 sm:w-5 sm:h-5 text-[#f59e0b]" />;
      case 2: return <Activity className="w-4 h-4 sm:w-5 sm:h-5 text-[#10b981]" />;
      default: return <FolderGit2 className="w-4 h-4 sm:w-5 sm:h-5 text-[#ec4899]" />;
    }
  };

  const getSocialIcon = (iconName: string) => {
    switch (iconName) {
      case 'github': return <Github size={16} />;
      case 'mail': return <Mail size={16} />;
      case 'globe': return <Globe size={16} />;
      default: return <ExternalLink size={16} />;
    }
  };

  return (
    <div className={`min-h-screen w-full selection:bg-[#fde68a] selection:text-[#0284c7] ${isDark ? 'dark' : ''}`}>
      <MouseEffects />

      {/* UpXuu signature Top Scroll Progress Line */}
      <div className="fixed top-0 left-0 w-full h-[4px] bg-transparent z-[120] pointer-events-none">
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
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b-4 border-[#0284c7] px-3 py-2 sm:px-6 sm:py-2.5 shadow-[0px_3px_0px_0px_rgba(2,132,199,0.15)]">
        <div className="max-w-[1200px] mx-auto flex justify-between items-center gap-2">
          {/* Logo with signature Skewed Avatar box */}
          <button 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center gap-2 text-left cursor-pointer group"
          >
            <div className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center bg-[#fde68a] border-2 border-[#0284c7] font-black transform -skew-x-12 shadow-[2px_2px_0px_0px_#0284c7] overflow-hidden shrink-0 group-hover:scale-105 transition-transform">
              <img src={siteConfig.avatar} alt="Logo" className="w-full h-full object-cover transform skew-x-12" />
            </div>
            <div className="flex flex-col">
              <span className="font-black font-display tracking-widest text-xs sm:text-base text-[#0284c7] dark:text-[#38bdf8] uppercase leading-none">
                {siteConfig.name}
              </span>
              <span className="text-[9px] sm:text-[10px] font-mono text-slate-500 font-bold tracking-tight">I.UPXUU.COM</span>
            </div>
          </button>

          {/* Nav links with UpXuu Signature Skewed Buttons */}
          <div className="flex items-center gap-1.5 sm:gap-2.5">
            <button
              onClick={() => scrollToSection('sites')}
              className="px-2 py-0.5 sm:px-3 sm:py-1 border-2 border-[#0284c7] font-black uppercase text-xs tracking-wider rounded-sm text-[#0284c7] dark:text-[#38bdf8] shadow-[1.5px_1.5px_0px_0px_#fde68a] hover:bg-[#0284c7] hover:text-white transition-all cursor-pointer transform -skew-x-3 hidden xs:block"
            >
              站点
            </button>
            <button
              onClick={() => scrollToSection('projects')}
              className="px-2 py-0.5 sm:px-3 sm:py-1 border-2 border-[#0284c7] font-black uppercase text-xs tracking-wider rounded-sm text-[#0284c7] dark:text-[#38bdf8] shadow-[1.5px_1.5px_0px_0px_#fde68a] hover:bg-[#0284c7] hover:text-white transition-all cursor-pointer transform -skew-x-3 hidden sm:block"
            >
              开源
            </button>
            <button
              onClick={() => scrollToSection('about')}
              className="px-2 py-0.5 sm:px-3 sm:py-1 border-2 border-[#0284c7] font-black uppercase text-xs tracking-wider rounded-sm text-[#0284c7] dark:text-[#38bdf8] shadow-[1.5px_1.5px_0px_0px_#fde68a] hover:bg-[#0284c7] hover:text-white transition-all cursor-pointer transform -skew-x-3 hidden sm:block"
            >
              关于
            </button>
            <button
              onClick={() => scrollToSection('terminal')}
              className="px-2 py-0.5 sm:px-3 sm:py-1 border-2 border-[#0284c7] font-black uppercase text-xs tracking-wider rounded-sm text-[#0284c7] dark:text-[#38bdf8] shadow-[1.5px_1.5px_0px_0px_#fde68a] hover:bg-[#0284c7] hover:text-white transition-all cursor-pointer transform -skew-x-3 hidden md:block"
            >
              终端
            </button>
            <button
              onClick={() => scrollToSection('blog')}
              className="px-2 py-0.5 sm:px-3 sm:py-1 border-2 border-[#0284c7] font-black uppercase text-xs tracking-wider rounded-sm text-[#0284c7] dark:text-[#38bdf8] shadow-[1.5px_1.5px_0px_0px_#fde68a] hover:bg-[#0284c7] hover:text-white transition-all cursor-pointer transform -skew-x-3"
            >
              动态
            </button>

            {/* Dark Mode */}
            <button
              onClick={toggleTheme}
              className="p-1 sm:p-1.5 rounded border-2 border-[#0284c7] bg-white dark:bg-slate-800 shadow-[1.5px_1.5px_0px_0px_#0284c7] text-[#0284c7] transition-all cursor-pointer"
            >
              {isDark ? <Sun size={14} className="text-[#f59e0b]" /> : <Moon size={14} />}
            </button>

            {/* External Blog Direct Link */}
            <a
              href="https://upxuu.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="px-2 py-0.5 sm:px-3 sm:py-1 bg-[#0284c7] text-white font-black text-xs uppercase tracking-wider rounded-sm border-2 border-[#0284c7] shadow-[2px_2px_0px_0px_#f59e0b] hover:bg-[#0369a1] hover:shadow-[3px_3px_0px_0px_#fde68a] transition-all flex items-center gap-1 transform -skew-x-6"
            >
              <span>主站博客</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="relative z-10 w-full flex flex-col items-center pt-14 sm:pt-16">
        
        {/* Hero Section with Explosive Entrance Animations */}
        <section className="min-h-[72vh] sm:min-h-screen w-full flex flex-col items-center justify-center p-3 sm:p-6 relative pt-14 sm:pt-20 pb-10 sm:pb-16">
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
                      transition: { staggerChildren: 0.1, delayChildren: 0.05 }
                    }
                  }}
                  className="flex flex-col items-center w-full"
                >
                  {/* Avatar: Bouncy Pop & Rotate In */}
                  <motion.div
                    variants={{
                      hidden: { scale: 0, rotate: -25 },
                      visible: { 
                        scale: 1, 
                        rotate: 0, 
                        transition: { type: 'spring', damping: 12, stiffness: 240 } 
                      }
                    }}
                    className="relative mb-4 sm:mb-6 group cursor-pointer"
                    onClick={() => sfx.playPop(1200, 0.08)}
                  >
                    <div className="w-20 h-20 sm:w-28 sm:h-28 rounded-2xl p-1 bg-[#fde68a] border-4 border-[#0284c7] shadow-[5px_5px_0px_0px_#0284c7] group-hover:shadow-[7px_7px_0px_0px_#f59e0b] group-hover:-translate-x-1 group-hover:-translate-y-1 transition-all overflow-hidden rotate-[-2deg] group-hover:rotate-0">
                      <img
                        src={siteConfig.avatar}
                        alt={siteConfig.name}
                        className="w-full h-full object-cover rounded-xl"
                      />
                    </div>
                    {/* Status Pill Badge */}
                    <div className="absolute -bottom-2 -right-2 px-2 py-0.5 bg-emerald-400 text-slate-900 border-2 border-[#0284c7] text-[10px] font-black uppercase rounded-md shadow-[1.5px_1.5px_0px_0px_#0284c7] flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping"></span>
                      <span>ONLINE</span>
                    </div>
                  </motion.div>

                  {/* Title & Badge */}
                  <motion.div
                    variants={{
                      hidden: { opacity: 0, y: 25 },
                      visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
                    }}
                    className="space-y-2 mb-4 sm:mb-6"
                  >
                    <div className="inline-block px-3 py-1 bg-white/90 dark:bg-slate-800/90 border-2 border-[#0284c7] rounded shadow-[2px_2px_0px_0px_#0284c7] transform -skew-x-6">
                      <span className="text-xs sm:text-sm font-black text-[#0284c7] dark:text-[#38bdf8] tracking-widest uppercase">
                        {siteConfig.title}
                      </span>
                    </div>

                    <h1 className="text-3xl sm:text-5xl md:text-6xl font-black font-display tracking-tight text-slate-900 dark:text-white leading-none">
                      HI, I'M <span className="text-[#0284c7] dark:text-[#38bdf8] drop-shadow-[2px_2px_0px_#fde68a]">{siteConfig.name}</span>
                    </h1>
                  </motion.div>

                  {/* Typewriter with Floating Hearts */}
                  <motion.div
                    variants={{
                      hidden: { opacity: 0, y: 25 },
                      visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
                    }}
                    className="mb-5 sm:mb-8 max-w-lg px-2 w-full min-h-[3.2rem] sm:min-h-[4rem] flex items-center justify-center"
                  >
                    <div className="neo-tag px-3 sm:px-4 py-2 rounded-lg bg-white/90 dark:bg-slate-800/90 text-slate-800 dark:text-slate-100 leading-relaxed text-xs sm:text-base font-bold text-center relative inline-flex items-center flex-wrap justify-center font-mono">
                      <span>{descText}</span>
                      <span className="inline-block w-[2.5px] h-[1.15em] ml-1 bg-[#0284c7] animate-[pulse_1s_step-end_infinite] align-middle rounded-full relative">
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
                    className="flex flex-wrap justify-center gap-2 sm:gap-3"
                  >
                    {siteConfig.socials.map((social) => (
                      <motion.a
                        key={social.label}
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        variants={{
                          hidden: { opacity: 0, y: 20, scale: 0.7 },
                          visible: { 
                            opacity: 1, 
                            y: 0, 
                            scale: 1, 
                            transition: { type: 'spring', damping: 14, stiffness: 220 } 
                          }
                        }}
                        className="neo-box flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-md text-xs sm:text-sm font-black text-[#0284c7] dark:text-[#38bdf8] hover:text-white hover:bg-[#0284c7] transition-all cursor-pointer transform -skew-x-3"
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
        <section className="w-full max-w-4xl mx-auto px-3 sm:px-6 pb-24">

          {/* My Sites (我的站点) - Highly Optimized for Mobile 2-Column */}
          {siteConfig.sites && siteConfig.sites.length > 0 && (
            <div id="sites" className="w-full scroll-mt-24">
              <div className="flex items-end justify-between px-1 mb-3 sm:mb-4">
                <div>
                  <TextReveal>
                    <span className="px-2 py-0.5 bg-[#fde68a] text-[#0284c7] font-black text-xs uppercase tracking-wider rounded-sm shadow-[1.5px_1.5px_0px_0px_#0284c7] border border-[#0284c7] inline-block -skew-x-6 mb-1">
                      Web Services
                    </span>
                  </TextReveal>
                  <TextReveal delay={0.06}>
                    <h2 className="text-xl sm:text-3xl font-black font-display tracking-tight text-slate-900 dark:text-white">
                      我的站点 / 服务导航
                    </h2>
                  </TextReveal>
                </div>
              </div>

              {/* 2-column on mobile, 4-column on desktop */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
                {siteConfig.sites.map((site, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30, scale: 0.95 }}
                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -20, scale: 0.95 }}
                    viewport={{ once: false, amount: 0.15 }}
                    transition={{
                      type: 'spring',
                      damping: 18,
                      stiffness: 220,
                      delay: index * 0.06
                    }}
                  >
                    <NeoCard
                      as="a"
                      href={site.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex flex-col justify-between h-full p-3 sm:p-4"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-2 sm:mb-3">
                          <div className="p-1.5 sm:p-2 rounded-lg bg-[#fde68a] border-2 border-[#0284c7] shadow-[1.5px_1.5px_0px_0px_#0284c7] group-hover:scale-110 transition-transform">
                            {getSiteIcon(index)}
                          </div>
                          <span className="p-0.5 text-[#0284c7] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform">
                            <ArrowUpRight className="w-4 h-4 font-black" />
                          </span>
                        </div>
                        <h3 className="text-xs sm:text-base font-black text-slate-900 dark:text-white group-hover:text-[#0284c7] transition-colors truncate">
                          {site.name}
                        </h3>
                        <p className="text-[11px] sm:text-xs text-slate-600 dark:text-slate-400 leading-relaxed mt-1 line-clamp-1 sm:line-clamp-2">
                          {site.description}
                        </p>
                      </div>

                      <div className="mt-3 pt-2 border-t border-slate-200 dark:border-slate-800 text-[10px] sm:text-[11px] font-mono font-bold text-slate-500 truncate flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#10b981] shrink-0"></span>
                        <span className="truncate">{site.url.replace(/^https?:\/\//, '')}</span>
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

          {/* Python Terminal HUD (Scroll In-View Typewriter Engine) */}
          <CyberTerminal />

          {/* RSS Blog Feed */}
          <BlogFeed />

          {/* UpXuu Style Footer */}
          <footer className="mt-16 sm:mt-24 pt-6 sm:pt-8 border-t-2 border-[#0284c7] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono font-bold text-slate-600 dark:text-slate-400 text-center sm:text-left">
            <div>
              <span>© {new Date().getFullYear()} {siteConfig.name}</span>
              <span className="mx-2">·</span>
              <span className="text-[#0284c7] dark:text-[#38bdf8]">逐光而上，笃行致远</span>
            </div>
            <button
              onClick={() => {
                sfx.playPop(1100, 0.08);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="neo-tag px-3 py-1 bg-white dark:bg-slate-800 text-[#0284c7] dark:text-[#38bdf8] hover:bg-[#0284c7] hover:text-white transition-all cursor-pointer rounded-sm flex items-center gap-1.5 -skew-x-3"
            >
              <span>回到顶部</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </footer>

        </section>

        {/* Floating Scroll Down Indicator with Smart Sequential Section Jumping */}
        <AnimatePresence>
          {!isAtBottom && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, y: [0, 8, 0] }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{
                opacity: { duration: 0.3 },
                y: { repeat: Infinity, duration: 1.8, ease: 'easeInOut' }
              }}
              className="fixed bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-40 p-2 sm:p-2.5 rounded-full bg-[#fde68a] border-2 border-[#0284c7] shadow-[2px_2px_0px_0px_#0284c7] text-[#0284c7] hover:bg-[#0284c7] hover:text-white cursor-pointer transition-all"
              onClick={handleScrollDownNext}
              aria-label="Scroll to next section"
              title="向下滚动到下一区域"
            >
              <ChevronDown size={20} className="stroke-[3]" />
            </motion.button>
          )}
        </AnimatePresence>

      </main>
    </div>
  );
}
