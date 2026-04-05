"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, MicOff, Trash2, Download, Play, Pause, Languages } from "lucide-react";

export default function CaptionsPage() {
  const [listening, setListening] = React.useState(false);
  const [transcript, setTranscript] = React.useState("");
  const [interimTranscript, setInterimTranscript] = React.useState("");
  const [lang, setLang] = React.useState<string>("en-IN");
  const recognitionRef = React.useRef<any>(null);

  const startListening = React.useCallback(() => {
    const SR: typeof window & { webkitSpeechRecognition?: any } = window as any;
    const SpeechRecognition = SR.SpeechRecognition || SR.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      toast.error("Speech Recognition is not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = lang;
    recognition.interimResults = true;
    recognition.continuous = true;

    recognition.onresult = (event: any) => {
      let finalForThisEvent = "";
      let interimForThisEvent = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcriptText = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalForThisEvent += transcriptText + " ";
        } else {
          interimForThisEvent += transcriptText;
        }
      }

      if (finalForThisEvent) {
        setTranscript((prev) => (prev + " " + finalForThisEvent).trim());
        setInterimTranscript(""); // Clear interim once finalized
      } else {
        setInterimTranscript(interimForThisEvent);
      }
    };

    recognition.onend = () => {
      setListening(false);
    };

    recognition.onerror = (e: any) => {
      if (e.error !== "no-speech") {
        toast.error(e.error || "Speech recognition error");
      }
      setListening(false);
    };

    recognitionRef.current = recognition;
    try {
        recognition.start();
        setListening(true);
        toast.success("Mic active. Start speaking!");
    } catch (e) {
        console.error(e);
    }
  }, [lang]);

  const stopListening = React.useCallback(() => {
    if (recognitionRef.current) {
        recognitionRef.current.stop();
    }
    setListening(false);
    setInterimTranscript("");
  }, []);

  const downloadTxt = () => {
    if (!transcript) {
        toast.error("Nothing to download.");
        return;
    }
    const blob = new Blob([transcript], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `lecture-transcript-${lang}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Transcript downloaded!");
  };

  return (
    <main id="main" className="mx-auto max-w-7xl px-4 py-12 space-y-8" aria-labelledby="captions-heading">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-4 border-b border-primary/10"
      >
        <div>
          <h1 id="captions-heading" className="text-4xl md:text-5xl font-black tracking-tight text-gradient">
            Live Captions
          </h1>
          <p className="text-muted-foreground mt-2 text-lg">Real-time AI speech processing for inclusive learning.</p>
        </div>
        
        <div className="flex items-center gap-3 glass p-2 rounded-2xl border-white/20 shadow-sm">
           <Languages className="w-5 h-5 text-primary ml-2" />
           <Select value={lang} onValueChange={setLang}>
                <SelectTrigger className="w-[180px] border-none bg-transparent font-semibold focus:ring-0">
                  <SelectValue placeholder="Choose language" />
                </SelectTrigger>
                <SelectContent className="glass">
                  <SelectItem value="en-IN">English (India)</SelectItem>
                  <SelectItem value="hi-IN">Hindi (India)</SelectItem>
                  <SelectItem value="bn-IN">Bengali (India)</SelectItem>
                  <SelectItem value="ta-IN">Tamil (India)</SelectItem>
                  <SelectItem value="te-IN">Telugu (India)</SelectItem>
                  <SelectItem value="mr-IN">Marathi (India)</SelectItem>
                </SelectContent>
            </Select>
        </div>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative group h-full"
          >
            <div className="absolute -inset-1 bg-linear-to-r from-primary/20 to-blue-400/20 rounded-[2.2rem] blur-xl opacity-50 group-hover:opacity-100 transition-opacity" />
            <div className="relative h-full glass rounded-[2rem] p-6 border-white/20 shadow-2xl flex flex-col group">
              <div className="flex items-center justify-between mb-4 px-2">
                 <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${listening ? "bg-red-500 animate-pulse" : "bg-muted"}`} />
                    <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                        {listening ? "Processing Audio..." : "Ready"}
                    </span>
                 </div>
                 <div className="flex gap-2">
                    <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => { setTranscript(""); setInterimTranscript(""); }} 
                        className="rounded-full hover:bg-destructive/10 hover:text-destructive transition-colors"
                        title="Clear Transcript"
                    >
                        <Trash2 className="w-5 h-5" />
                    </Button>
                    <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={downloadTxt}
                        className="rounded-full hover:bg-primary/10 hover:text-primary transition-colors"
                        title="Export TXT"
                    >
                        <Download className="w-5 h-5" />
                    </Button>
                 </div>
              </div>
              
              <div className="flex-1 bg-white/40 rounded-2xl p-6 min-h-[50vh] overflow-hidden flex flex-col">
                <Textarea 
                  value={transcript} 
                  onChange={(e) => setTranscript(e.target.value)} 
                  className="flex-1 border-none bg-transparent text-xl md:text-2xl leading-relaxed font-medium focus-visible:ring-0 p-0 resize-none placeholder:text-muted-foreground/30" 
                  placeholder="Start speaking and I'll capture every word..."
                  aria-label="Live transcript" 
                />
                <AnimatePresence>
                  {interimTranscript && (
                    <motion.div 
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="text-primary/60 text-xl md:text-2xl italic font-medium mt-2 pb-4"
                    >
                      {interimTranscript}...
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="space-y-6">
           <Card className="glass border-white/20 rounded-[2rem] shadow-xl overflow-hidden">
              <CardHeader className="bg-primary/5 pb-4">
                 <CardTitle className="flex items-center gap-2">
                    <Play className="w-5 h-5" /> Session Controls
                 </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-6">
                 <div className="p-4 rounded-2xl bg-white/50 border border-white/20 flex items-center justify-center min-h-[150px]">
                    {!listening ? (
                      <motion.div 
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Button 
                            onClick={startListening} 
                            className="w-24 h-24 rounded-full bg-primary shadow-xl shadow-primary/40 flex flex-col gap-1 transition-all"
                        >
                            <Mic className="w-8 h-8" />
                            <span className="text-[10px] font-bold">START</span>
                        </Button>
                      </motion.div>
                    ) : (
                      <motion.div 
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Button 
                            onClick={stopListening} 
                            className="w-24 h-24 rounded-full bg-destructive shadow-xl shadow-destructive/40 flex flex-col gap-1 transition-all"
                        >
                            <MicOff className="w-8 h-8 font-bold" />
                            <span className="text-[10px] font-bold">STOP</span>
                        </Button>
                      </motion.div>
                    )}
                 </div>
                 
                 <div className="space-y-4">
                    <div className="flex items-center justify-between px-2">
                        <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Word Count</span>
                        <span className="text-lg font-black text-primary">{transcript.split(/\s+/).filter(Boolean).length}</span>
                    </div>
                    <div className="h-px bg-border" />
                    <p className="text-xs text-muted-foreground leading-relaxed italic px-2">
                        💡 Tip: Processing happens in your browser. Your voice data is never sent to our servers.
                    </p>
                 </div>
              </CardContent>
           </Card>
           
           <Card className="glass border-white/20 rounded-[2rem] shadow-lg opacity-80 hover:opacity-100 transition-opacity overflow-hidden">
              <CardHeader className="bg-muted/30 pb-2">
                 <p className="text-[10px] font-black uppercase tracking-widest text-primary">Micro-Training</p>
              </CardHeader>
              <CardContent className="pt-4">
                 <h4 className="font-bold text-sm mb-2">Better Captions</h4>
                 <p className="text-[13px] text-muted-foreground">Keep your device in a quiet environment and speak clearly towards the microphone for the highest accuracy.</p>
              </CardContent>
           </Card>
        </div>
      </div>
    </main>
  );
}