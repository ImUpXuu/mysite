import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Moon, Sun, Mail, Github, Twitter, ChevronDown, Globe } from 'lucide-react';
import Markdown from 'react-markdown';
import Lenis from 'lenis';
import { siteConfig } from './config';

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
      .then(res => res.text())
      .then(str => new window.DOMParser().parseFromString(str, "text/xml"))
      .then(data => {
        const items = data.querySelectorAll("item");
        const parsedPosts: BlogPost[] = [];
        items.forEach((item, index) => {
          if (index >= 10) return;
          const title = item.querySelector("title")?.textContent || "";
          const link = item.querySelector("link")?.textContent || "";
          const pubDateStr = item.querySelector("pubDate")?.textContent || "";
          let description = item.querySelector("description")?.textContent || "";
          
          const temp = document.createElement("div");
          temp.innerHTML = description;
          description = temp.textContent || temp.innerText || "";
          if (description.length > 80) description = description.substring(0, 80) + "...";

          const date = new Date(pubDateStr);
          const formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

          parsedPosts.push({ title, link, pubDate: formattedDate, description });
        });
        setPosts(parsedPosts);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch feed:", err);
        setLoading(false);
      });
  }, []);

  if (loading) return (
    <div className="flex justify-center items-center py-12">
      <div className="w-8 h-8 border-4 border-sky-200 border-t-sky-500 rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="space-y-6 mt-8 w-full relative z-10">
        <motion.h2 
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="text-2xl sm:text-3xl md:text-4xl font-black font-display tracking-tight text-slate-800 dark:text-white mt-12 sm:mt-16 mb-6 sm:mb-8 flex items-center gap-3 sm:gap-4 before:content-[''] before:block before:w-1.5 sm:before:w-2 before:h-6 sm:before:h-8 before:bg-sky-400 before:rounded-full px-1 sm:px-2"
      >
        最新动态
      </motion.h2>
      <div className="grid grid-cols-1 gap-4 sm:gap-6 px-1 sm:px-2">
        {posts.map((post, i) => (
          <motion.a
            key={i}
            href={post.link}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="group flex flex-col gap-2 sm:gap-3 p-5 sm:p-6 rounded-[1.25rem] sm:rounded-[1.5rem] border border-slate-300/60 dark:border-slate-700/60 hover:border-sky-400 dark:hover:border-sky-400 hover:-translate-y-1 transition-all cursor-pointer relative overflow-hidden"
          >
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline gap-2 sm:gap-4">
              <h3 className="text-lg sm:text-xl font-bold text-slate-800 dark:text-white group-hover:text-sky-500 transition-colors line-clamp-2">
                {post.title}
              </h3>
              <span className="text-xs sm:text-sm font-mono text-slate-400 whitespace-nowrap">
                {post.pubDate}
              </span>
            </div>
            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed line-clamp-2">
              {post.description}
            </p>
          </motion.a>
        ))}
      </div>
    </div>
  );
};

const markdownComponents: any = {
  h2: ({node, ...props}: any) => (
    <motion.h2 
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="text-2xl sm:text-3xl md:text-4xl font-black font-display tracking-tight text-slate-800 dark:text-white mt-12 sm:mt-16 mb-6 sm:mb-8 flex items-center gap-3 sm:gap-4 before:content-[''] before:block before:w-1.5 sm:before:w-2 before:h-6 sm:before:h-8 before:bg-sky-400 before:rounded-full" 
      {...props} 
    />
  ),
  p: ({node, ...props}: any) => (
    <motion.p
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="text-slate-700 dark:text-slate-200 leading-relaxed text-base sm:text-lg font-medium mb-6 sm:mb-8 px-1 sm:px-2" 
      {...props} 
    />
  ),
  ul: ({node, ...props}: any) => <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-6 mb-8 sm:mb-12 px-1 sm:px-2" {...props} />,
  li: ({node, ...props}: any) => (
    <motion.li 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="flex items-start group p-4 sm:p-6 rounded-[1.25rem] sm:rounded-[1.5rem] border border-slate-300/60 dark:border-slate-700/60 hover:border-sky-400 dark:hover:border-sky-400 hover:-translate-y-1 transition-all relative overflow-hidden"
    >
      <span className="mr-3 text-sky-400 group-hover:scale-125 transition-transform mt-1 sm:mt-1.5 text-sm shrink-0">✧</span>
      <span className="text-slate-700 dark:text-slate-200 font-medium leading-relaxed text-base sm:text-lg">{props.children}</span>
    </motion.li>
  ),
  strong: ({node, ...props}: any) => <strong className="font-bold text-sky-500 dark:text-sky-400 bg-sky-50 dark:bg-sky-900/30 px-3 py-1 rounded-md" {...props} />,
};

function MouseEffects() {
  const [trails, setTrails] = useState<{ id: number; x: number; y: number; color: string; isClick?: boolean; angle?: number }[]>([]);

  useEffect(() => {
    let lastTime = 0;
    const colors = ['text-pink-400', 'text-sky-400', 'text-yellow-400', 'text-purple-400'];
    
    const handleMouseMove = (e: MouseEvent) => {
      const now = Date.now();
      if (now - lastTime > 60) {
        lastTime = now;
        const newTrail = { 
          id: Date.now() + Math.random(), 
          x: e.clientX, 
          y: e.clientY,
          color: colors[Math.floor(Math.random() * colors.length)]
        };
        setTrails(prev => [...prev, newTrail]);
        setTimeout(() => {
          setTrails(prev => prev.filter(t => t.id !== newTrail.id));
        }, 800);
      }
    };

    const handleClick = (e: MouseEvent) => {
      const sparks = Array.from({ length: 6 }).map((_, i) => ({
        id: Date.now() + Math.random() + i,
        x: e.clientX,
        y: e.clientY,
        color: colors[Math.floor(Math.random() * colors.length)],
        isClick: true,
        angle: (i * Math.PI * 2) / 6
      }));
      setTrails(prev => [...prev, ...sparks]);
      setTimeout(() => {
        setTrails(prev => prev.filter(t => !sparks.find(s => s.id === t.id)));
      }, 800);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('click', handleClick);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('click', handleClick);
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-[100] overflow-hidden">
      <AnimatePresence>
        {trails.map(trail => (
          <motion.div
            key={trail.id}
            initial={{ opacity: 0.8, scale: trail.isClick ? 0.5 : 0.5, x: trail.x, y: trail.y }}
            animate={{ 
              opacity: 0, 
              scale: trail.isClick ? 1.5 : 1.5, 
              y: trail.isClick ? trail.y + Math.sin(trail.angle!) * 80 : trail.y - 50,
              x: trail.isClick ? trail.x + Math.cos(trail.angle!) * 80 : trail.x + (Math.random() - 0.5) * 40,
              rotate: trail.isClick ? Math.random() * 180 : 0
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className={`absolute -translate-x-1/2 -translate-y-1/2 ${trail.color} ${trail.isClick ? 'text-2xl' : 'text-xl'} drop-shadow-md`}
            style={{ left: 0, top: 0 }}
          >
            {trail.isClick ? '✦' : '♥'}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

function GithubProjects() {
  const [repos, setRepos] = useState<any[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    fetch('https://api.github.com/users/ImUpXuu/repos?sort=updated&per_page=6')
      .then(res => res.json())
      .then(data => {
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
        el.scrollLeft += (dt * 0.05);
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
    <div className="w-full mt-8 sm:mt-12 overflow-hidden">
      <motion.h2 
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="text-2xl sm:text-3xl md:text-4xl font-black font-display tracking-tight text-slate-800 dark:text-white mb-6 sm:mb-8 flex items-center gap-3 sm:gap-4 before:content-[''] before:block before:w-1.5 sm:before:w-2 before:h-6 sm:before:h-8 before:bg-sky-400 before:rounded-full"
      >
        开源项目
      </motion.h2>
      <div 
        ref={scrollRef}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onTouchStart={() => setIsHovered(true)}
        onTouchEnd={() => setIsHovered(false)}
        className="flex gap-4 sm:gap-6 overflow-x-auto no-scrollbar px-1 sm:px-2 pb-4"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {[...repos, ...repos].map((repo, i) => (
          <a
            key={`${repo.id}-${i}`}
            href={repo.html_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-shrink-0 w-72 sm:w-80 group p-5 sm:p-6 rounded-[1.25rem] sm:rounded-[1.5rem] border border-slate-300/60 dark:border-slate-700/60 hover:border-sky-400 dark:hover:border-sky-400 hover:-translate-y-1 transition-all flex flex-col gap-2 sm:gap-3 relative overflow-hidden bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm"
          >
            <h3 className="text-lg sm:text-xl font-bold text-slate-800 dark:text-white group-hover:text-sky-500 transition-colors flex items-center gap-2 truncate">
              <Github className="w-5 h-5 shrink-0" />
              <span className="truncate">{repo.name}</span>
            </h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed line-clamp-2 h-10 whitespace-normal">
              {repo.description || '无描述信息'}
            </p>
            <div className="flex items-center gap-4 mt-2 text-xs font-mono text-slate-400">
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-sky-400"></span>
                {repo.language || 'Unknown'}
              </span>
              <span className="flex items-center gap-1">
                ⭐ {repo.stargazers_count}
              </span>
              <span className="flex items-center gap-1">
                🍴 {repo.forks_count}
              </span>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}

export default function App() {
  const [bgImage, setBgImage] = useState<string>('');
  const [isDark, setIsDark] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

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
      if (scrollY + clientHeight >= scrollHeight - 50) {
        setIsAtBottom(true);
      } else {
        setIsAtBottom(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
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

  useEffect(() => {
    if (!siteConfig.descriptions || siteConfig.descriptions.length === 0) return;
    
    const currentFullText = siteConfig.descriptions[descIndex];
    let typingSpeed = isDeleting ? 30 : 100;

    if (!isDeleting && descText === currentFullText) {
      const timeout = setTimeout(() => setIsDeleting(true), 2500);
      return () => clearTimeout(timeout);
    }

    if (isDeleting && descText === '') {
      setIsDeleting(false);
      setDescIndex((prev) => (prev + 1) % siteConfig.descriptions.length);
      return;
    }

    const timeout = setTimeout(() => {
      setDescText(currentFullText.slice(0, descText.length + (isDeleting ? -1 : 1)));
      
      if (!isDeleting && Math.random() > 0.4) {
        const newHeart = { id: Date.now() + Math.random(), x: (Math.random() - 0.5) * 40 };
        setHearts(prev => [...prev, newHeart]);
        setTimeout(() => {
          setHearts(prev => prev.filter(h => h.id !== newHeart.id));
        }, 1000);
      }
    }, typingSpeed);

    return () => clearTimeout(timeout);
  }, [descText, isDeleting, descIndex]);

  useEffect(() => {
    // Select a random background on mount
    const randomBg = siteConfig.backgrounds[Math.floor(Math.random() * siteConfig.backgrounds.length)];
    setBgImage(randomBg);

    // Check system preference for dark mode (though we prefer day mode aesthetically)
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setIsDark(true);
    }
    
    // Simulate slight loading delay for silky entrance
    setTimeout(() => setIsLoaded(true), 150);
  }, []);

  const toggleTheme = () => setIsDark(!isDark);

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'twitter': return <Twitter size={20} />;
      case 'github': return <Github size={20} />;
      case 'mail': return <Mail size={20} />;
      case 'globe': return <Globe size={20} />;
      default: return null;
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 1, ease: [0.16, 1, 0.3, 1] }
    }
  };

  return (
    <div className={`min-h-screen w-full selection:bg-sky-200 selection:text-sky-900 ${isDark ? 'dark' : ''}`}>
      <MouseEffects />
      {/* Fixed Background Layer */}
      <div className="fixed inset-0 w-full h-full bg-sky-50 dark:bg-slate-900 transition-colors duration-1000 ease-in-out z-0">
        <AnimatePresence>
          {bgImage && (
            <motion.div
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1.0001 }}
              transition={{ duration: 1.5, ease: 'easeOut' }}
              className="absolute inset-0 z-0 origin-center"
            >
              <img src={bgImage} alt="Background" className="w-full h-full object-cover" />
              {/* Overlay to ensure text readability with pattern */}
              <div className="absolute inset-0 bg-white/40 dark:bg-slate-900/80 bg-pattern transition-colors duration-1000" />
              {/* Sketch elements layer */}
              <div className="absolute top-0 left-0 w-full h-full opacity-30 dark:opacity-40 pointer-events-none z-0">
                <svg width="100%" height="100%" viewBox="0 0 1024 768" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
                  <path d="M100 150 Q 150 100 200 150 T 300 150" stroke="currentColor" className="text-blue-400" strokeWidth="4" fill="none"/>
                  <circle cx="80%" cy="15%" r="40" stroke="currentColor" className="text-yellow-400" strokeWidth="3" fill="none"/>
                  <path d="M90% 80% L 95% 85% M 95% 80% L 90% 85%" stroke="currentColor" className="text-blue-400" strokeWidth="4"/>
                  <path d="M5% 70% Q 10% 75% 5% 80%" stroke="currentColor" className="text-yellow-400" strokeWidth="3" fill="none"/>
                </svg>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Scrollable Content Layer */}
      <div className="relative z-10 w-full flex flex-col font-sans text-slate-800 dark:text-slate-100">
        
        {/* Theme Toggle Button */}
        <motion.button
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          onClick={toggleTheme}
          className="fixed top-6 right-6 z-50 p-3.5 rounded-full bg-white/60 dark:bg-slate-800/60 backdrop-blur-lg shadow-[0_8px_32px_rgba(0,0,0,0.05)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.2)] hover:bg-white/90 dark:hover:bg-slate-700 hover:scale-105 transition-all cursor-pointer text-sky-600 dark:text-sky-300 border border-white/40 dark:border-slate-700/50"
          aria-label="Toggle Dark Mode"
        >
          {isDark ? <Sun size={22} /> : <Moon size={22} />}
        </motion.button>

        {/* Hero Section */}
        <section className="min-h-screen w-full flex items-center justify-center p-4 sm:p-6 relative">
          <div className="w-full max-w-2xl mx-auto flex flex-col items-center text-center">
            <AnimatePresence>
              {isLoaded && (
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="flex flex-col items-center w-full px-2"
                >
                  
                  {/* Avatar */}
                  <motion.div variants={itemVariants} className="mb-8 sm:mb-10 relative group">
                    <div className="absolute inset-0 bg-sky-300/40 dark:bg-sky-500/20 rounded-full blur-2xl transform scale-125 transition-transform duration-700 group-hover:scale-150" />
                    <div className="relative p-2 bg-white/70 dark:bg-slate-800/70 backdrop-blur-md rounded-full shadow-2xl border border-white/50 dark:border-slate-700/50">
                      <img 
                        src={siteConfig.avatar} 
                        alt={siteConfig.name} 
                        className="w-32 h-32 sm:w-36 sm:h-36 md:w-44 md:h-44 rounded-full object-cover border-4 border-white/90 dark:border-slate-800"
                      />
                    </div>
                  </motion.div>

                  {/* Name & Title */}
                  <motion.h1 variants={itemVariants} className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black font-display tracking-tight text-slate-800 dark:text-white mb-4 sm:mb-6 leading-tight">
                    HI! I am <span className="text-sky-500">{siteConfig.name}</span>
                  </motion.h1>
                  
                  <motion.div variants={itemVariants} className="mb-6 sm:mb-8">
                    <div className="px-5 sm:px-6 py-2 sm:py-2.5 rounded-full bg-white/70 dark:bg-slate-800/70 backdrop-blur-lg shadow-sm border border-white/50 dark:border-slate-700/50 text-sky-600 dark:text-sky-300 text-sm md:text-base font-bold tracking-wide">
                      {siteConfig.title}
                    </div>
                  </motion.div>

                  {/* Description */}
                  <motion.div variants={itemVariants} className="mb-10 sm:mb-12 max-w-xl px-2 w-full min-h-[5rem] sm:min-h-[4rem] flex items-center justify-center">
                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-base sm:text-lg md:text-xl font-medium text-center relative inline-flex items-center flex-wrap justify-center">
                      {descText}
                      <span className="inline-block w-[3px] h-[1.1em] ml-1 bg-sky-500 dark:bg-sky-400 animate-[pulse_1s_step-end_infinite] align-middle rounded-full relative">
                        <AnimatePresence>
                          {hearts.map(h => (
                            <motion.span
                              key={h.id}
                              initial={{ opacity: 1, y: 0, scale: 0.5, x: h.x / 2 }}
                              animate={{ opacity: 0, y: -40, scale: 1.5, x: h.x }}
                              exit={{ opacity: 0 }}
                              transition={{ duration: 0.8, ease: "easeOut" }}
                              className="absolute bottom-full left-1/2 -translate-x-1/2 text-pink-400 text-sm pointer-events-none"
                            >
                              ❤️
                            </motion.span>
                          ))}
                        </AnimatePresence>
                      </span>
                    </p>
                  </motion.div>

                  {/* Social Links */}
                  <motion.div variants={itemVariants} className="flex flex-wrap justify-center gap-3 sm:gap-4">
                    {siteConfig.socials.map((social) => (
                      <motion.a
                        key={social.label}
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ y: -5 }}
                        whileTap={{ scale: 0.95 }}
                        className="group flex items-center p-3 sm:p-3.5 md:p-4 rounded-full bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg shadow-[0_8px_24px_rgba(0,0,0,0.06)] dark:shadow-[0_8px_24px_rgba(0,0,0,0.2)] hover:shadow-[0_12px_32px_rgba(14,165,233,0.15)] text-slate-600 dark:text-slate-300 hover:text-sky-500 dark:hover:text-sky-400 transition-all border border-white/60 dark:border-slate-700/60"
                        aria-label={social.label}
                      >
                        {getIcon(social.icon)}
                        <span className="max-w-0 opacity-0 overflow-hidden group-hover:max-w-xs group-hover:opacity-100 group-hover:ml-2 sm:group-hover:ml-2.5 transition-all duration-300 ease-out whitespace-nowrap font-bold text-xs sm:text-sm">
                          {social.label}
                        </span>
                      </motion.a>
                    ))}
                  </motion.div>

                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </section>

        {/* About Me Section */}
        <section id="about" className="min-h-screen w-full flex flex-col items-center justify-start p-4 sm:p-6 relative pt-20 sm:pt-24 pb-28 sm:pb-32">
          <div className="w-full max-w-4xl mx-auto flex flex-col gap-6 sm:gap-8 relative z-10">
               
            {/* My Sites */}
            {siteConfig.sites && siteConfig.sites.length > 0 && (
              <div className="w-full">
                <motion.h2 
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  className="text-2xl sm:text-3xl md:text-4xl font-black font-display tracking-tight text-slate-800 dark:text-white mt-12 sm:mt-16 mb-6 sm:mb-8 flex items-center gap-3 sm:gap-4 before:content-[''] before:block before:w-1.5 sm:before:w-2 before:h-6 sm:before:h-8 before:bg-sky-400 before:rounded-full"
                >
                  我的站点
                </motion.h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 px-1 sm:px-2">
                  {siteConfig.sites.map((site, index) => (
                    <motion.a
                      key={index}
                      href={site.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-50px" }}
                      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                      className="group p-5 sm:p-6 rounded-[1.25rem] sm:rounded-[1.5rem] border border-slate-300/60 dark:border-slate-700/60 hover:border-sky-400 dark:hover:border-sky-400 hover:-translate-y-1 transition-all flex flex-col gap-2 sm:gap-3 relative overflow-hidden"
                    >
                      <h3 className="text-lg sm:text-xl font-bold text-slate-800 dark:text-white group-hover:text-sky-500 transition-colors flex items-center gap-2">
                        {site.name}
                        <span className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-sky-500">
                          <ChevronDown className="-rotate-90" size={20} />
                        </span>
                      </h3>
                      <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                        {site.description}
                      </p>
                    </motion.a>
                  ))}
                </div>
              </div>
            )}

            {/* Github Projects */}
            <GithubProjects />

            <div className="text-left w-full">
              <Markdown
                components={markdownComponents}
              >
                {siteConfig.aboutMe}
              </Markdown>
            </div>
            
            {/* Blog Feed */}
            <BlogFeed />

          </div>
        </section>
        
        {/* Fixed Scroll Down Indicator */}
        <AnimatePresence>
          {!isAtBottom && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, y: [0, 15, 0] }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.5, y: { delay: 0, duration: 2, repeat: Infinity, ease: "easeInOut" } }}
              className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 p-4 rounded-full bg-white/60 dark:bg-slate-800/60 backdrop-blur-lg text-sky-500 dark:text-sky-400 hover:bg-white/90 dark:hover:bg-slate-700/90 hover:scale-110 transition-all cursor-pointer shadow-md border border-white/50 dark:border-slate-700/50"
              onClick={(e) => {
                e.preventDefault();
                const aboutSection = document.getElementById('about');
                const currentScroll = window.scrollY;
                if (aboutSection && currentScroll < aboutSection.offsetTop - 100) {
                  lenisRef.current?.scrollTo('#about', { duration: 1.5, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
                } else {
                  lenisRef.current?.scrollTo(currentScroll + window.innerHeight * 0.6, { duration: 1.2, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
                }
              }}
            >
              <ChevronDown size={32} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
