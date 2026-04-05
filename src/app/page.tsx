"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion, motionValue, useTransform, useScroll, useSpring } from "framer-motion";
import { Mic, BookOpen, Search, Settings, Keyboard, ShieldCheck, ArrowRight } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { y: 20, opacity: 0 },
  show: { y: 0, opacity: 1 }
};

export default function Home() {
  const [hovered, setHovered] = React.useState(false);
  const { scrollYProgress } = useScroll();
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 1.1]);
  const y = useTransform(scrollYProgress, [0, 0.2], [0, -50]);
  
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <main id="main" className="min-h-screen selection:bg-primary selection:text-white overflow-x-hidden">
      {/* Immersive Background Reveal */}
      <motion.div 
        style={{ opacity: useTransform(smoothProgress, [0, 0.1], [1, 0.5]) }}
        className="fixed inset-0 bg-linear-to-b from-primary/5 via-background to-background pointer-events-none -z-20" 
      />

      {/* Hero Section */}
      <section className="relative pt-32 pb-44 overflow-hidden">
        <motion.div 
          style={{ scale, y }}
          className="absolute inset-0 -z-10"
        >
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_-20%,rgba(var(--primary-rgb),0.15),transparent_70%)]" />
        </motion.div>
        
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="max-w-2xl"
            >
              <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-primary/10 text-primary text-[10px] font-black border border-primary/20 mb-10 uppercase tracking-[0.3em]"
              >
                <ShieldCheck className="w-4 h-4" />
                Empowering Ability
              </motion.div>
              
              <h1 className="text-7xl md:text-8xl lg:text-9xl font-black tracking-tight mb-10 leading-[0.85]">
                <motion.span 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3, duration: 0.8 }}
                  className="block"
                >
                  Inclusive
                </motion.span>
                <motion.span 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4, duration: 0.8 }}
                  className="text-gradient block"
                >
                  learning
                </motion.span>
              </h1>
              
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 1 }}
                className="text-2xl text-muted-foreground mb-14 leading-relaxed font-medium max-w-xl"
              >
                Breaking linguistic and physical barriers with real-time AI assistance, built directly for students with hearing and visual impairments.
              </motion.p>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="flex flex-col sm:flex-row gap-6"
              >
                <Button asChild size="lg" className="rounded-2xl px-12 py-9 text-2xl h-auto shadow-[0_20px_50px_rgba(var(--primary-rgb),0.3)] hover:scale-105 transition-all group active:scale-95 bg-primary overflow-hidden relative">
                  <Link href="/captions" className="flex items-center gap-3 relative z-10">
                    Get Started Free
                    <Mic className="w-6 h-6 group-hover:animate-pulse" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="rounded-2xl px-12 py-9 text-2xl h-auto glass border-primary/10 hover:bg-primary/5 transition-all hover:scale-105 active:scale-95">
                  <Link href="/reader" className="flex items-center gap-3">
                    Watch Demo
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1" />
                  </Link>
                </Button>
              </motion.div>
              
              <div className="mt-20 flex flex-wrap items-center gap-10">
                 <StatItem value="5000+" label="Active Users" />
                 <div className="w-px h-12 bg-border/50 hidden md:block" />
                 <StatItem value="98%" label="STT Accuracy" />
                 <div className="w-px h-12 bg-border/50 hidden md:block" />
                 <StatItem value="15+" label="Languages" />
              </div>
            </motion.div>

            <motion.div 
              style={{ 
                rotateY: useTransform(smoothProgress, [0, 0.3], [0, 15]),
                rotateX: useTransform(smoothProgress, [0, 0.3], [0, -10]),
                z: 100
              }}
              initial={{ opacity: 0, scale: 0.8, x: 50 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              className="relative perspective-2000"
              onMouseEnter={() => setHovered(true)}
              onMouseLeave={() => setHovered(false)}
            >
              {/* Premium 3D Floating Frame */}
              <div className="relative group">
                <div className="absolute -inset-10 bg-linear-to-tr from-primary/40 to-blue-500/40 rounded-[5rem] blur-[100px] opacity-20 group-hover:opacity-40 transition-opacity duration-1000" />
                <motion.div 
                  animate={{ 
                    y: hovered ? -25 : 0,
                    rotateX: hovered ? 12 : 0,
                    rotateY: hovered ? -12 : 0,
                    scale: hovered ? 1.05 : 1
                  }}
                  transition={{ type: "spring", stiffness: 200, damping: 20 }}
                  className="relative aspect-square max-w-[650px] mx-auto rounded-[4rem] overflow-hidden shadow-[0_80px_150px_-30px_rgba(0,0,0,0.4)] border-[16px] border-white/40 glass z-10 preserve-3d"
                >
                  <Image
                    src="/hero-accessibility.png"
                    alt="Samavesh accessibility mission"
                    fill
                    className="object-cover transition-transform duration-[3000ms] group-hover:scale-110"
                    priority
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent p-12 flex flex-col justify-end">
                      <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1 }}
                        className="glass border-white/20 p-8 rounded-[2.5rem] backdrop-blur-3xl shadow-2xl relative overflow-hidden"
                      >
                         <div className="absolute top-0 left-0 w-2 h-full bg-primary" />
                         <span className="text-[11px] font-black tracking-[0.2em] text-primary uppercase mb-3 block">AI Live Captions — Active</span>
                         <p className="text-white text-2xl md:text-3xl font-bold italic leading-tight tracking-tight">
                             “...ensuring that every single person in this classroom moves forward together.”
                         </p>
                      </motion.div>
                  </div>
                </motion.div>
              </div>
              
              {/* Floating tech nodes */}
              <motion.div 
                animate={{ y: [0, -20, 0], x: [0, 10, 0] }} 
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-12 -right-6 px-8 py-4 glass rounded-3xl shadow-2xl border-white/30 hidden md:flex items-center gap-4 z-20"
              >
                 <div className="w-4 h-4 rounded-full bg-green-500 shadow-[0_0_15px_rgba(34,197,94,0.5)] animate-pulse" />
                 <span className="text-lg font-black">AI Voice Sync: 8ms</span>
              </motion.div>
            </motion.div>
          </div>
        </div>
        
        {/* Animated Scroll Indicator */}
        <motion.div 
          style={{ opacity: useTransform(smoothProgress, [0, 0.05], [1, 0]) }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
           <span className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/50">Scroll to Explore</span>
           <div className="w-px h-12 bg-linear-to-b from-primary to-transparent relative overflow-hidden">
              <motion.div 
                animate={{ y: [ -48, 48 ] }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="absolute top-0 left-0 w-full h-1/2 bg-white/50"
              />
           </div>
        </motion.div>
      </section>

      {/* Reveal Wrapper for scroll animations */}
      <RevealSection className="bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-24">
               <motion.h2 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="text-6xl md:text-7xl font-black mb-8"
                >
                  Designed for <br/>
                  <span className="text-gradient tracking-tight">Simplicity</span>
                </motion.h2>
               <p className="text-2xl text-muted-foreground font-medium">Getting started with Samavesh takes seconds, but the impact lasts a lifetime.</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-16 relative">
               <div className="absolute top-1/2 left-0 w-full h-px bg-linear-to-r from-transparent via-primary/30 to-transparent hidden md:block -translate-y-1/2" />
               <WorkflowStep 
                  number="01" 
                  title="Choose Your Mode" 
                  desc="Whether you need live speech-to-text or digital reading for PDFs, select the specialized tool for your specific ability."
               />
               <WorkflowStep 
                  number="02" 
                  title="Connect Audio" 
                  desc="Focus your microphone on the speaker. Our advanced vocal-processing AI automatically filters out noisy classroom chatter."
               />
               <WorkflowStep 
                  number="03" 
                  title="Engage Fully" 
                  desc="Read, hear, or feel the lecture in real-time. Save your transcripts or OCR scans directly to your local library."
               />
            </div>
        </div>
      </RevealSection>

      {/* Features Reveal */}
      <RevealSection>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-end mb-24 gap-8">
            <div className="max-w-3xl">
              <h2 className="text-6xl md:text-7xl font-black mb-8 leading-tight">Built for <br/><span className="text-gradient">Inclusivity</span></h2>
              <p className="text-2xl text-muted-foreground font-medium leading-relaxed">
                 Every feature is developed in collaboration with educators and students to ensure maximum educational impact.
              </p>
            </div>
          </div>

          <motion.div 
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12"
          >
            <FeatureCard 
              icon={<Mic className="w-12 h-12 text-primary" />}
              title="Deaf/Hard of Hearing" 
              desc="Transform classroom vocals into high-accuracy live text with multi-language translation support." 
            />
            <FeatureCard 
              icon={<BookOpen className="w-12 h-12 text-primary" />}
              title="Blind & Low Vision" 
              desc="Haptic-driven UI and AI-powered image descriptions that narrate the blackboard in real-time." 
            />
            <FeatureCard 
              icon={<Search className="w-12 h-12 text-primary" />}
              title="Cognitive Support" 
              desc="Reduce cognitive load with distraction-free focus modes and specialized typography for Dyslexia." 
            />
          </motion.div>
        </div>
      </RevealSection>
      
      {/* Testimonials Reveal */}
      <RevealSection className="bg-primary/[0.03]">
         <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-24">
               <h2 className="text-6xl md:text-7xl font-black mb-6">Voices of <span className="text-gradient">Change</span></h2>
            </div>
            
            <div className="grid md:grid-cols-2 gap-16 max-w-5xl mx-auto">
               <TestimonialCard 
                  quote="Samavesh isn't just an app, it's my ears in the front row. I can finally look at my teacher's face without missing a single word."
                  author="Aarav Sharma"
                  role="Higher Secondary Student"
                  avatar="https://i.pravatar.cc/150?u=a"
               />
               <TestimonialCard 
                  quote="The OCR feature is a game-changer for my blind students. They can finally 'see' my diagrams through audio descriptors."
                  author="Dr. Priya Verma"
                  role="Special Educator"
                  avatar="https://i.pravatar.cc/150?u=p"
               />
            </div>
         </div>
      </RevealSection>

      {/* FAQ Reveal */}
      <RevealSection>
         <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-5xl md:text-6xl font-black mb-16 text-center text-gradient">Frequently Asked</h2>
            <Accordion type="single" collapsible className="w-full glass rounded-[3rem] p-8 border-white/30 shadow-2xl">
               <AccordionItem value="item-1" className="border-b-0 px-6">
                  <AccordionTrigger className="text-2xl font-bold text-left py-8 hover:text-primary transition-colors">Is it really free for students?</AccordionTrigger>
                  <AccordionContent className="text-xl text-muted-foreground pb-8 leading-relaxed">
                     Yes, Samavesh is committed to digital equity. The core accessibility tools will always remain free for students worldwide to ensure no one is left behind.
                  </AccordionContent>
               </AccordionItem>
               <AccordionItem value="item-2" className="border-b-0 px-6">
                  <AccordionTrigger className="text-2xl font-bold text-left py-8 hover:text-primary transition-colors">How private is my lecture data?</AccordionTrigger>
                  <AccordionContent className="text-xl text-muted-foreground pb-8 leading-relaxed">
                     Extremely. All audio processing for transcripts and OCR happens locally in your browser. We never record, store, or transmit your voice data to external servers.
                  </AccordionContent>
               </AccordionItem>
               <AccordionItem value="item-3" className="border-b-0 px-6">
                  <AccordionTrigger className="text-2xl font-bold text-left py-8 hover:text-primary transition-colors">Does it support regional languages?</AccordionTrigger>
                  <AccordionContent className="text-xl text-muted-foreground pb-8 leading-relaxed">
                     Absolutely. We currently support Hindi, Bengali, Tamil, Telugu, and 10+ other regional Indian languages with specialized vocal models for regional accents.
                  </AccordionContent>
               </AccordionItem>
            </Accordion>
         </div>
      </RevealSection>

      {/* Final CTA Section */}
      <section className="py-44 px-6 relative overflow-hidden">
         <div className="absolute inset-0 -z-10 bg-primary opacity-[0.05]" />
         <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="mx-auto max-w-6xl glass rounded-[5rem] p-16 md:p-32 text-center border-white/30 shadow-2xl relative overflow-hidden"
         >
            <div className="absolute -top-24 -left-24 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
            <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl" />
            
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-primary rounded-full flex items-center justify-center shadow-3xl shadow-primary/50">
               <Mic className="w-12 h-12 text-white" />
            </div>
            <h2 className="text-6xl md:text-8xl font-black mb-10 leading-tight">Ready for a <br/><span className="text-gradient">better classroom?</span></h2>
            <p className="text-2xl md:text-3xl text-muted-foreground mb-16 max-w-3xl mx-auto font-medium">
               Join thousands of students and teachers who are breaking educational barriers today.
            </p>
            <div className="flex flex-col sm:flex-row gap-8 justify-center">
               <Button asChild size="lg" className="rounded-3xl px-16 py-10 text-2xl h-auto shadow-2xl shadow-primary/40 active:scale-95 transition-all">
                  <Link href="/register">Get Started Free</Link>
               </Button>
               <Button asChild variant="outline" size="lg" className="rounded-3xl px-16 py-10 text-2xl h-auto glass active:scale-95 transition-all">
                  <Link href="/login">Watch Demo</Link>
               </Button>
            </div>
         </motion.div>
      </section>
    </main>
  );
}

function StatItem({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col">
      <span className="text-4xl font-black text-primary tracking-tighter">{value}</span>
      <span className="text-xs font-bold text-muted-foreground uppercase tracking-[0.2em]">{label}</span>
    </div>
  );
}

function RevealSection({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <section className={`py-44 relative overflow-hidden ${className}`}>
      <motion.div
        initial={{ opacity: 0, y: 100 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-150px" }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
      >
        {children}
      </motion.div>
    </section>
  );
}

function WorkflowStep({ number, title, desc }: { number: string; title: string; desc: string }) {
   return (
      <div className="relative z-10 flex flex-col items-center text-center group">
         <motion.div 
            initial={{ scale: 0.5, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            className="text-8xl font-black text-primary/10 absolute -top-16 group-hover:text-primary/20 transition-all duration-500 select-none"
          >
            {number}
          </motion.div>
         <div className="w-8 h-8 rounded-full bg-primary border-4 border-white shadow-xl mb-10 relative z-10" />
         <h3 className="text-3xl font-black mb-6 group-hover:text-primary transition-colors">{title}</h3>
         <p className="text-xl text-muted-foreground leading-relaxed font-medium">{desc}</p>
      </div>
   );
}

function TestimonialCard({ quote, author, role, avatar }: { quote: string; author: string; role: string; avatar: string }) {
   return (
      <div className="glass p-12 rounded-[3.5rem] border-white/30 shadow-2xl relative hover:-translate-y-3 transition-all duration-500 group">
         <div className="text-6xl text-primary/20 font-serif absolute top-10 left-10 group-hover:text-primary/40 transition-colors">“</div>
         <p className="mt-8 mb-12 text-xl font-bold leading-relaxed italic relative z-10">"{quote}"</p>
         <div className="flex items-center gap-6 border-t pt-10 border-white/10">
            <Avatar className="w-16 h-16 border-2 border-primary/20 shadow-xl">
               <AvatarImage src={avatar} />
               <AvatarFallback className="bg-primary/10 text-primary font-black">{author[0]}</AvatarFallback>
            </Avatar>
            <div className="text-left">
               <p className="font-black text-xl leading-none mb-2">{author}</p>
               <p className="text-xs font-black uppercase tracking-[0.2em] text-primary/60">{role}</p>
            </div>
         </div>
      </div>
   );
}

function FeatureCard({ title, desc, icon }: { title: string; desc: string; icon: React.ReactNode }) {
  const mouseX = motionValue(0);
  const mouseY = motionValue(0);

  const rotateX = useTransform(mouseY, [ -100, 100 ], [ 10, -10 ]);
  const rotateY = useTransform(mouseX, [ -100, 100 ], [ -10, 10 ]);

  function handleMouseMove(e: React.MouseEvent) {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    mouseX.set(x);
    mouseY.set(y);
  }

  function handleMouseLeave() {
    mouseX.set(0);
    mouseY.set(0);
  }

  return (
    <motion.div 
      variants={item}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ perspective: 2000 }}
    >
      <motion.div
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        className="h-full"
      >
        <Card className="h-full border-none glass hover:bg-card/70 transition-all duration-500 group shadow-[0_40px_80px_-20px_rgba(0,0,0,0.2)] rounded-[3rem] overflow-hidden">
          <CardHeader style={{ transform: "translateZ(50px)" }} className="pt-12 px-12">
            <div className="mb-8 p-6 rounded-3xl bg-primary/5 w-fit group-hover:scale-110 transition-all duration-500 shadow-inner group-hover:bg-primary/10">
              {icon}
            </div>
            <CardTitle className="text-3xl font-black tracking-tight group-hover:text-primary transition-colors">{title}</CardTitle>
          </CardHeader>
          <CardContent style={{ transform: "translateZ(30px)" }} className="px-12 pb-12">
            <p className="text-muted-foreground text-xl leading-relaxed font-medium">{desc}</p>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}