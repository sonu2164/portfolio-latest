import React, { useState, useRef, useEffect, useMemo } from 'react';
import * as THREE from 'three';
import {
  Shield,
  Terminal,
  Globe,
  Github,
  Mail,
  Award,
  Zap,
  ChevronRight,
  Trophy,
  Medal,
  Linkedin,
  Play,
  MessageSquare,
  Volume2,
  VolumeX,
  FastForward,
  Compass,
  Sparkles,
  Stars,
} from 'lucide-react';

const App = () => {
  const scrollContainerRef = useRef(null);
  const canvasContainerRef = useRef(null);
  const [activeLevel, setActiveLevel] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const [isBikeHovered, setIsBikeHovered] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);

  const audioRef = useRef(null);
  const vroomRef = useRef(null);
  const threeRef = useRef({ scene: null, renderer: null, camera: null, objects: {} });

  const levels = useMemo(
    () => [
      { id: 'start', title: 'Awakening', icon: <Play />, lore: 'Initiating Warrior Protocol v4.0' },
      { id: 'edu', title: 'The Trials', icon: <Shield />, lore: 'The conquest of Kurukshetra' },
      { id: 'skills', title: 'The Forge', icon: <Terminal />, lore: 'Synthesizing digital arsenal' },
      { id: 'yamaha', title: 'The Chariot', icon: <FastForward />, lore: 'Yamaha enterprise odyssey' },
      { id: 'projects', title: 'Astras', icon: <Zap />, lore: 'Deploying legendary artifacts' },
      { id: 'achieve', title: 'Summit', icon: <Trophy />, lore: 'Hall of glorious victories' },
    ],
    []
  );

  useEffect(() => {
    if (!canvasContainerRef.current) return;

    const width = window.innerWidth;
    const height = window.innerHeight;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x050505, 0.03);

    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1200);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    canvasContainerRef.current.appendChild(renderer.domElement);

    scene.add(new THREE.AmbientLight(0xffffff, 0.7));

    const frontLight = new THREE.PointLight(0x00f2ff, 2, 100);
    frontLight.position.set(8, 8, 10);
    scene.add(frontLight);

    const rimLight = new THREE.PointLight(0x9333ea, 1.4, 120);
    rimLight.position.set(-12, -4, -6);
    scene.add(rimLight);

    const objects = {};

    const heroGroup = new THREE.Group();
    const core = new THREE.Mesh(
      new THREE.IcosahedronGeometry(2.2, 1),
      new THREE.MeshStandardMaterial({ color: 0x22d3ee, wireframe: true })
    );
    heroGroup.add(core);

    for (let i = 0; i < 3; i += 1) {
      const ring = new THREE.Mesh(
        new THREE.TorusGeometry(3 + i * 0.7, 0.04, 16, 120),
        new THREE.MeshStandardMaterial({
          color: i % 2 ? 0x8b5cf6 : 0x22d3ee,
          transparent: true,
          opacity: 0.35 - i * 0.06,
        })
      );
      ring.rotation.set(Math.PI / (3 + i), Math.PI / (4 - i * 0.4), 0);
      heroGroup.add(ring);
    }

    scene.add(heroGroup);
    objects.hero = heroGroup;

    const eduGroup = new THREE.Group();
    const wheelMat = new THREE.MeshStandardMaterial({ color: 0xff8c00, metalness: 0.8, roughness: 0.2 });
    eduGroup.add(new THREE.Mesh(new THREE.TorusGeometry(3.2, 0.2, 16, 42), wheelMat));
    for (let i = 0; i < 12; i += 1) {
      const spoke = new THREE.Mesh(new THREE.BoxGeometry(0.1, 6.4, 0.1), wheelMat);
      spoke.rotation.z = (i * Math.PI) / 6;
      eduGroup.add(spoke);
    }
    eduGroup.position.set(25, 0, 0);
    scene.add(eduGroup);
    objects.edu = eduGroup;

    const bikeGroup = new THREE.Group();
    const bikeMat = new THREE.MeshStandardMaterial({ color: 0xff0000, metalness: 0.9 });
    const body = new THREE.Mesh(new THREE.BoxGeometry(2.8, 0.42, 0.6), bikeMat);
    body.position.y = 0.55;
    bikeGroup.add(body);

    const wheelMatBlack = new THREE.MeshStandardMaterial({ color: 0x111111 });
    [-1.1, 1.1].forEach((x) => {
      const wheel = new THREE.Mesh(new THREE.TorusGeometry(0.5, 0.15, 16, 32), wheelMatBlack);
      wheel.position.set(x, 0, 0);
      wheel.rotation.y = Math.PI / 2;
      bikeGroup.add(wheel);
    });

    bikeGroup.position.set(50, 0, 0);
    scene.add(bikeGroup);
    objects.bike = bikeGroup;

    const stars = new THREE.BufferGeometry();
    const starCount = 9500;
    const starPositions = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount * 3; i += 1) starPositions[i] = (Math.random() - 0.5) * 260;
    stars.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    scene.add(new THREE.Points(stars, new THREE.PointsMaterial({ size: 0.05, color: 0xffffff })));

    const nebula = new THREE.Mesh(
      new THREE.SphereGeometry(35, 24, 24),
      new THREE.MeshBasicMaterial({ color: 0x1d4ed8, transparent: true, opacity: 0.05, side: THREE.BackSide })
    );
    scene.add(nebula);

    camera.position.z = 10;
    threeRef.current = { scene, renderer, camera, objects };

    const animate = () => {
      requestAnimationFrame(animate);
      const t = Date.now() * 0.001;
      heroGroup.rotation.y = t * 0.25;
      heroGroup.position.y = Math.sin(t) * 0.35;
      eduGroup.rotation.z = t * 0.16;
      bikeGroup.rotation.y = Math.sin(t * 0.5) * 0.25;
      nebula.rotation.y = t * 0.03;
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      if (canvasContainerRef.current) canvasContainerRef.current.innerHTML = '';
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (!scrollContainerRef.current || !threeRef.current.camera) return;
      const scrollLeft = scrollContainerRef.current.scrollLeft;
      const totalWidth = scrollContainerRef.current.scrollWidth - window.innerWidth;
      const progress = scrollLeft / window.innerWidth;

      setScrollProgress(scrollLeft / totalWidth);
      threeRef.current.camera.position.x = progress * 25;

      const newLevel = Math.round(progress);
      if (newLevel !== activeLevel) setActiveLevel(newLevel);
    };

    const container = scrollContainerRef.current;
    container?.addEventListener('scroll', handleScroll);
    return () => container?.removeEventListener('scroll', handleScroll);
  }, [activeLevel]);

  useEffect(() => {
    audioRef.current = new Audio('https://assets.mixkit.co/music/preview/mixkit-tech-house-vibes-130.mp3');
    vroomRef.current = new Audio('https://www.soundjay.com/transportation/motorcycle-rev-01.mp3');
    audioRef.current.loop = true;
    return () => {
      audioRef.current?.pause();
      vroomRef.current?.pause();
    };
  }, []);

  useEffect(() => {
    if (!audioRef.current || !gameStarted) return;
    if (isMuted) audioRef.current.pause();
    else audioRef.current.play().catch(() => {});
  }, [gameStarted, isMuted]);

  const handleLevelChange = (index) => {
    if (!scrollContainerRef.current) return;
    scrollContainerRef.current.scrollTo({ left: window.innerWidth * index, behavior: 'smooth' });
    setActiveLevel(index);
  };

  return (
    <div className="fixed inset-0 bg-[#050505] text-white overflow-hidden select-none font-sans">
      <div
        className="absolute inset-0 pointer-events-none opacity-40"
        style={{
          background:
            'radial-gradient(circle at 20% 20%, rgba(34,211,238,.16), transparent 30%), radial-gradient(circle at 80% 10%, rgba(139,92,246,.16), transparent 28%), radial-gradient(circle at 50% 80%, rgba(236,72,153,.12), transparent 32%)',
        }}
      />

      <div ref={canvasContainerRef} className="fixed inset-0 z-0 pointer-events-none" />

      <div className="fixed top-6 left-6 z-[110] rounded-2xl border border-cyan-500/30 bg-black/60 backdrop-blur-xl px-4 py-3 text-xs font-mono tracking-wider">
        <p className="text-cyan-300 uppercase flex items-center gap-2">
          <Sparkles className="w-4 h-4" /> Quest HUD
        </p>
        <p className="text-gray-400 mt-1">Progress: {(scrollProgress * 100).toFixed(0)}%</p>
        <p className="text-gray-400">Active Realm: {levels[activeLevel]?.title}</p>
      </div>

      {!gameStarted && (
        <div className="fixed inset-0 z-[300] bg-black/95 flex flex-col items-center justify-center p-6 text-center">
          <Stars className="w-20 h-20 text-cyan-400 mb-8 animate-pulse" />
          <h1 className="text-5xl md:text-8xl font-black italic mb-4 tracking-tighter bg-gradient-to-r from-cyan-400 via-white to-purple-600 bg-clip-text text-transparent uppercase">
            SONU SINGH
          </h1>
          <h2 className="text-lg md:text-2xl font-mono text-gray-500 mb-10 tracking-[0.35em] uppercase">The Tech Warrior Odyssey</h2>
          <button
            onClick={() => {
              setGameStarted(true);
              setIsMuted(false);
            }}
            className="px-14 py-5 bg-white text-black font-black rounded-full hover:bg-cyan-400 transition-all flex items-center gap-4 group shadow-[0_0_40px_rgba(6,182,212,0.3)]"
          >
            Start Quest <ChevronRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
          </button>
        </div>
      )}

      <div className="fixed top-8 right-8 z-[100]">
        <button
          onClick={() => setIsMuted(!isMuted)}
          className={`p-4 rounded-full border-2 transition-all backdrop-blur-2xl ${
            !isMuted
              ? 'bg-cyan-500/20 border-cyan-400 text-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.4)]'
              : 'bg-white/5 border-white/20 text-red-500'
          }`}
        >
          {isMuted ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6 animate-pulse" />}
        </button>
      </div>

      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] bg-black/80 backdrop-blur-3xl border border-white/10 rounded-full px-10 py-5 flex items-center gap-8 shadow-2xl overflow-x-auto max-w-[95vw] scrollbar-hide">
        {levels.map((level, idx) => (
          <React.Fragment key={level.id}>
            <button
              onClick={() => handleLevelChange(idx)}
              className={`relative flex flex-col items-center transition-all duration-500 shrink-0 ${
                activeLevel === idx ? 'scale-125 mx-5' : 'opacity-25 hover:opacity-100 hover:scale-110'
              }`}
            >
              <div
                className={`w-14 h-14 rounded-full flex items-center justify-center border-2 transition-all ${
                  activeLevel === idx
                    ? 'bg-gradient-to-br from-cyan-400 to-blue-600 border-white shadow-[0_0_30px_rgba(6,182,212,0.6)]'
                    : 'bg-gray-800 border-gray-700'
                }`}
              >
                {React.cloneElement(level.icon, { className: 'w-6 h-6' })}
              </div>
              <span
                className={`absolute -top-12 text-[10px] font-black uppercase tracking-[0.3em] whitespace-nowrap transition-all ${
                  activeLevel === idx ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
                }`}
              >
                {level.title}
              </span>
            </button>
            {idx < levels.length - 1 && <div className="w-8 h-1 bg-white/5 rounded-full shrink-0" />}
          </React.Fragment>
        ))}
      </div>

      <div ref={scrollContainerRef} className="flex h-screen w-screen overflow-x-auto snap-x snap-mandatory scroll-smooth scrollbar-hide relative z-10">
        <section className="min-w-full h-full snap-start relative flex flex-col items-center justify-center overflow-hidden">
          <div className="text-center pointer-events-none px-6 mt-[-5vh]">
            <h2 className="text-cyan-400 font-mono tracking-[0.8em] mb-4 text-[10px] animate-pulse font-bold">LEVEL 1: THE AWAKENING</h2>
            <h1 className="text-8xl md:text-[12rem] font-black tracking-tighter leading-[0.85] mb-8 italic uppercase">
              SONU
              <br />
              <span className="text-transparent border-t border-white/10 opacity-50">SINGH</span>
            </h1>
            <p className="text-gray-500 max-w-2xl mx-auto italic text-sm md:text-xl font-medium tracking-wide">
              Associate Software Engineer @ Yamaha Solutions | CSE @ NIT KKR
            </p>
            <div className="mt-8 flex justify-center gap-4">
              <Compass className="text-cyan-500 w-8 h-8 animate-spin-slow" />
              <span className="font-mono text-xs text-gray-600 uppercase tracking-widest self-center">Scroll to begin the odyssey</span>
            </div>
          </div>
        </section>

        <section className="min-w-full h-full snap-start relative flex items-center justify-center">
          <div className="max-w-6xl w-full px-12 grid lg:grid-cols-2 gap-20 items-center">
            <div className="space-y-6">
              <h3 className="text-orange-500 font-serif text-2xl tracking-[0.5em] font-bold uppercase">LEVEL 2: THE TRIALS</h3>
              <h2 className="text-7xl md:text-9xl font-serif text-white leading-[1.1] font-black italic uppercase">Kurukshetra Conquest</h2>
            </div>
            <div className="p-16 bg-black/60 border border-orange-500/20 backdrop-blur-3xl rounded-[4rem] shadow-3xl">
              <Shield className="w-16 h-16 text-orange-500 mb-8" />
              <h4 className="text-4xl font-serif text-white mb-3 italic uppercase">National Institute of Technology</h4>
              <p className="text-orange-300/40 text-[10px] mb-8 uppercase tracking-[0.4em] font-mono font-bold">B.Tech CSE • 2021-2025</p>
              <div className="flex items-baseline gap-4">
                <div className="text-9xl font-black text-orange-500 leading-none">9.1</div>
                <span className="text-2xl text-orange-900 font-serif italic">Warrior Grade</span>
              </div>
            </div>
          </div>
        </section>

        <section
          className="min-w-full h-full snap-start relative flex flex-col items-center justify-center transition-all duration-1000 overflow-hidden"
          onMouseEnter={() => {
            setIsBikeHovered(true);
            if (!isMuted && vroomRef.current) {
              vroomRef.current.currentTime = 0;
              vroomRef.current.play().catch(() => {});
            }
          }}
          onMouseLeave={() => setIsBikeHovered(false)}
        >
          <div className="z-10 text-center px-8">
            <h2 className="text-cyan-400 font-mono tracking-[0.8em] mb-4 text-[10px] animate-pulse font-bold">LEVEL 3: THE CHARIOT</h2>
            <h2 className="text-7xl md:text-[10rem] font-black italic tracking-tighter mb-4 transition-all text-red-600 leading-none uppercase">
              YAMAHA MOTOR
            </h2>
            {isBikeHovered && <div className="text-red-500 text-5xl font-black italic animate-bounce mb-6">VROOM VROOM!</div>}
            <div className="max-w-4xl mx-auto bg-white/[0.03] p-10 md:p-14 rounded-[4rem] border border-white/5 backdrop-blur-3xl">
              <h4 className="text-3xl font-bold mb-6 text-white uppercase">Associate Software Engineer</h4>
              <p className="text-gray-400 text-base md:text-xl italic leading-relaxed font-light">
                Modernizing HRIS flows and shipping robust backend systems with Spring Boot, Hibernate, and enterprise JS.
              </p>
            </div>
          </div>
        </section>

        <section className="min-w-full h-full snap-start flex items-center justify-center p-8">
          <div className="max-w-7xl w-full">
            <h2 className="text-center text-cyan-400 font-mono tracking-[0.8em] mb-12 text-[10px] animate-pulse font-bold">LEVEL 4: THE ARMORY</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
              {[
                { title: 'Deepfake Vision', type: 'AI ASTRA', icon: <Award />, desc: 'Ensemble with ViT, YOLOv8, Grad-CAM interpretability.' },
                { title: 'Dining Venue', type: 'WEB ASTRA', icon: <Globe />, desc: 'Ordering platform with OTP, WhatsApp sync, payments.' },
                { title: 'HomeCrew', type: 'SOCIAL ASTRA', icon: <MessageSquare />, desc: 'Hyperlocal network + realtime socket chat.' },
              ].map((p) => (
                <div key={p.title} className="group p-12 rounded-[4rem] bg-white/[0.02] border border-white/5 hover:border-cyan-500/40 transition-all hover:-translate-y-6">
                  <div className="w-20 h-20 rounded-3xl bg-cyan-500/10 flex items-center justify-center mb-10 text-cyan-400 mx-auto">{p.icon}</div>
                  <h4 className="text-[11px] font-mono text-cyan-500 mb-4 tracking-[0.4em] uppercase font-bold">{p.type}</h4>
                  <h3 className="text-3xl font-bold mb-6 text-white tracking-tight italic uppercase">{p.title}</h3>
                  <p className="text-gray-500 text-lg leading-relaxed opacity-80">{p.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="min-w-full h-full snap-start flex items-center justify-center p-8 text-center">
          <div className="max-w-6xl w-full">
            <Trophy className="w-28 h-28 text-yellow-500 mx-auto mb-10 animate-bounce" />
            <h2 className="text-7xl md:text-9xl font-black tracking-tighter mb-16 italic bg-gradient-to-r from-white to-gray-600 bg-clip-text text-transparent uppercase">
              The Summit
            </h2>
            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <div className="p-10 bg-white/5 rounded-[3rem] border border-white/10">
                <Medal className="w-14 h-14 text-yellow-500 mb-5 mx-auto" />
                <h4 className="text-3xl font-bold">LeetCode Mastery</h4>
                <p className="text-gray-500 mt-2">800+ solved • Top 7.6%</p>
              </div>
              <div className="p-10 bg-white/5 rounded-[3rem] border border-white/10">
                <Award className="w-14 h-14 text-orange-500 mb-5 mx-auto" />
                <h4 className="text-3xl font-bold">CodeRush Rank</h4>
                <p className="text-gray-500 mt-2">Global rank #82</p>
              </div>
            </div>
            <div className="flex justify-center gap-8">
              <a href="mailto:sonu037singh@gmail.com" className="p-5 bg-white/5 rounded-full hover:bg-cyan-500 hover:text-black transition-all"><Mail className="w-7 h-7" /></a>
              <a href="https://linkedin.com/in/sonu2164" className="p-5 bg-white/5 rounded-full hover:bg-blue-600 transition-all"><Linkedin className="w-7 h-7" /></a>
              <a href="https://github.com/sonu2164" className="p-5 bg-white/5 rounded-full hover:bg-purple-600 transition-all"><Github className="w-7 h-7" /></a>
            </div>
          </div>
        </section>
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
          @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@700;900&family=JetBrains+Mono:wght@400;700&display=swap');
          body { margin: 0; overflow: hidden; background: #050505; color: white; }
          .font-serif { font-family: 'Cinzel', serif; }
          .font-mono { font-family: 'JetBrains Mono', monospace; }
          section { scroll-snap-align: start; scroll-snap-stop: always; }
          ::-webkit-scrollbar { width: 0; height: 0; background: transparent; }
          .scrollbar-hide::-webkit-scrollbar { display: none; }
          .shadow-3xl { box-shadow: 0 40px 80px -20px rgba(0,0,0,.8), 0 30px 60px -30px rgba(0,0,0,.8); }
          @keyframes spin-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
          .animate-spin-slow { animation: spin-slow 10s linear infinite; }
        `,
        }}
      />
    </div>
  );
};

export default App;
