'use client';

import { motion } from 'framer-motion';
import { BookOpen, Terminal, Code, Settings, Server, Brain, Zap } from 'lucide-react';

const SECTIONS = [
  { title: 'Getting Started', desc: 'Initialize NeuralisOS and configure your first environment.', icon: <Terminal className='w-5 h-5' /> },
  { title: 'Agents API', desc: 'Deploy cognitive workflows via Python SDK & LangGraph.', icon: <Code className='w-5 h-5' /> },
  { title: 'Memory System', desc: 'Working with Mem0, Qdrant, and Neo4j architectures.', icon: <Brain className='w-5 h-5' /> },
  { title: 'Deployment', desc: 'Docker, Vercel, and CI/CD best practices.', icon: <Server className='w-5 h-5' /> },
  { title: 'Configuration', desc: 'Environment variables and system tuning.', icon: <Settings className='w-5 h-5' /> },
  { title: 'RL Infrastructure', desc: 'Reinforcement learning feedback loops.', icon: <Zap className='w-5 h-5' /> },
];

export default function DocsPage() {
  return (
    <div className='min-h-screen bg-[#0A0A0A] font-sans selection:bg-primary/30 relative text-zinc-100'>
      <div className='absolute inset-0 bg-[radial-gradient(circle_at_15%_50%,rgba(124,58,237,0.05),transparent_25%),radial-gradient(circle_at_85%_30%,rgba(50,150,255,0.05),transparent_25%)] pointer-events-none' />
      
      <header className='border-b border-white/[0.05] bg-black/40 backdrop-blur-2xl sticky top-0 z-50 shadow-[4px_0_24px_rgba(0,0,0,0.2)]'>
        <div className='max-w-6xl mx-auto flex items-center h-16 px-6'>
          <a href='/' className='flex items-center gap-2.5 group'>
             <div className='w-7 h-7 rounded-xl bg-gradient-to-br from-primary via-purple-500 to-indigo-500 p-[1px] group-hover:shadow-[0_0_15px_rgba(124,58,237,0.5)] transition-all duration-300'>
                <div className='w-full h-full bg-black/50 rounded-[10px] flex items-center justify-center backdrop-blur-sm'>
                  <BookOpen className='w-3.5 h-3.5 text-white' />
                </div>
             </div>
             <span className='font-semibold tracking-wide text-sm bg-clip-text text-transparent bg-gradient-to-r from-white to-zinc-400'>NeuralisOS Specs</span>
          </a>
          <nav className='ml-auto flex gap-6 text-[13px] text-zinc-400 font-medium tracking-wide'>
             <a href='http://localhost:3000' className='hover:text-white transition-colors'>Platform</a>
             <a href='https://github.com' className='hover:text-white transition-colors'>GitHub</a>
          </nav>
        </div>
      </header>

      <main className='max-w-6xl mx-auto px-6 py-20 relative z-10'>
        <motion.div initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} transition={{duration:0.6}}>
           <h1 className='text-5xl md:text-6xl font-bold tracking-tight mb-6 text-white bg-clip-text text-transparent bg-gradient-to-br from-white via-zinc-200 to-zinc-600'>Platform Documentation</h1>
           <p className='text-xl text-zinc-400 font-light max-w-2xl mb-14 tracking-wide leading-relaxed'>Architect, scale, and optimize autonomous AI workforces. Explore our guides, API references, and infrastructure patterns.</p>
        </motion.div>

        <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {SECTIONS.map((sec, i) => (
             <motion.div key={sec.title} initial={{opacity:0, y:12}} animate={{opacity:1, y:0}} transition={{delay: i*0.1}} className='group relative bg-black/40 backdrop-blur-xl border border-white/[0.05] rounded-2xl p-8 hover:border-purple-500/30 transition-all cursor-pointer shadow-sm overflow-hidden'>
               <div className='absolute inset-0 bg-gradient-to-br from-white/[0.04] to-transparent rounded-2xl pointer-events-none' />
               <div className='w-12 h-12 rounded-xl bg-white/[0.04] border border-white/[0.05] flex items-center justify-center text-zinc-400 mb-6 group-hover:text-purple-400 group-hover:scale-110 transition-transform duration-500 ease-out shadow-inner relative z-10'>
                 <div className='absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500' />
                 {sec.icon}
               </div>
               <h3 className='text-lg font-semibold text-white/90 mb-2 relative z-10 tracking-tight'>{sec.title}</h3>
               <p className='text-sm font-light text-zinc-400 leading-relaxed relative z-10 group-hover:text-zinc-300 transition-colors'>{sec.desc}</p>
             </motion.div>
          ))}
        </div>
      </main>
    </div>
  );
}
