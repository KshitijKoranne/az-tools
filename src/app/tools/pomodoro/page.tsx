"use client";

import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { MobileNav } from "@/components/mobile-nav";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Input } from "@/components/ui/input";
import { Pause, Play, RotateCcw, Settings } from "lucide-react";
import { useState, useEffect, useRef } from "react";

type TimerMode = "work" | "shortBreak" | "longBreak";

export default function PomodoroPage() {
  // Timer settings
  const [workDuration, setWorkDuration] = useState(25);
  const [shortBreakDuration, setShortBreakDuration] = useState(5);
  const [longBreakDuration, setLongBreakDuration] = useState(15);
  const [sessionsBeforeLongBreak, setSessionsBeforeLongBreak] = useState(4);

  // Timer state
  const [mode, setMode] = useState<TimerMode>("work");
  const [timeLeft, setTimeLeft] = useState(workDuration * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [completedSessions, setCompletedSessions] = useState(0);
  const [showSettings, setShowSettings] = useState(false);

  // Refs
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize audio
  useEffect(() => {
    audioRef.current = new Audio("/notification.mp3"); // This would be a real sound file in production
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // Update timer when settings change
  useEffect(() => {
    resetTimer();
  }, [workDuration, shortBreakDuration, longBreakDuration]);

  // Timer logic
  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            // Timer completed
            clearInterval(timerRef.current!);
            playNotification();
            handleTimerComplete();
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning]);

  const handleTimerComplete = () => {
    if (mode === "work") {
      const newCompletedSessions = completedSessions + 1;
      setCompletedSessions(newCompletedSessions);

      // Determine next break type
      if (newCompletedSessions % sessionsBeforeLongBreak === 0) {
        switchMode("longBreak");
      } else {
        switchMode("shortBreak");
      }
    } else {
      // After any break, go back to work mode
      switchMode("work");
    }
  };

  const switchMode = (newMode: TimerMode) => {
    setMode(newMode);
    setIsRunning(false);

    // Set appropriate time based on mode
    if (newMode === "work") {
      setTimeLeft(workDuration * 60);
    } else if (newMode === "shortBreak") {
      setTimeLeft(shortBreakDuration * 60);
    } else {
      setTimeLeft(longBreakDuration * 60);
    }
  };

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setIsRunning(false);
    if (mode === "work") {
      setTimeLeft(workDuration * 60);
    } else if (mode === "shortBreak") {
      setTimeLeft(shortBreakDuration * 60);
    } else {
      setTimeLeft(longBreakDuration * 60);
    }
  };

  const playNotification = () => {
    // Play notification sound
    if (audioRef.current) {
      audioRef.current
        .play()
        .catch((e) => console.log("Audio play failed:", e));
    }

    // Show browser notification if supported and permitted
    if ("Notification" in window && Notification.permission === "granted") {
      new Notification("Pomodoro Timer", {
        body: mode === "work" ? "Time for a break!" : "Time to focus!",
        icon: "/favicon.ico",
      });
    }
  };

  const requestNotificationPermission = () => {
    if ("Notification" in window && Notification.permission !== "granted") {
      Notification.requestPermission();
    }
  };

  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Get progress percentage for the circular timer
  const getProgress = () => {
    let totalSeconds;
    if (mode === "work") {
      totalSeconds = workDuration * 60;
    } else if (mode === "shortBreak") {
      totalSeconds = shortBreakDuration * 60;
    } else {
      totalSeconds = longBreakDuration * 60;
    }

    return ((totalSeconds - timeLeft) / totalSeconds) * 100;
  };

  // Get color based on current mode
  const getModeColor = () => {
    switch (mode) {
      case "work":
        return "text-red-500";
      case "shortBreak":
        return "text-green-500";
      case "longBreak":
        return "text-blue-500";
      default:
        return "text-primary";
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1 py-8">
        <Container>
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Pomodoro Timer</h1>
            <p className="text-muted-foreground">
              Boost productivity with timed work sessions and breaks.
            </p>
          </div>

          <div className="border rounded-lg p-6 mb-6 max-w-md mx-auto">
            <div className="flex justify-between items-center mb-6">
              <div className="flex space-x-2">
                <Button
                  variant={mode === "work" ? "default" : "outline"}
                  onClick={() => switchMode("work")}
                  className="px-3 py-1 h-8"
                >
                  Focus
                </Button>
                <Button
                  variant={mode === "shortBreak" ? "default" : "outline"}
                  onClick={() => switchMode("shortBreak")}
                  className="px-3 py-1 h-8"
                >
                  Short Break
                </Button>
                <Button
                  variant={mode === "longBreak" ? "default" : "outline"}
                  onClick={() => switchMode("longBreak")}
                  className="px-3 py-1 h-8"
                >
                  Long Break
                </Button>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowSettings(!showSettings)}
              >
                <Settings className="h-5 w-5" />
              </Button>
            </div>

            {showSettings && (
              <div className="mb-6 p-4 border rounded-md bg-muted/10">
                <h3 className="text-sm font-medium mb-3">Timer Settings</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs block mb-1">
                      Focus (minutes)
                    </label>
                    <Input
                      type="number"
                      min="1"
                      max="60"
                      value={workDuration}
                      onChange={(e) =>
                        setWorkDuration(parseInt(e.target.value) || 25)
                      }
                      className="h-8"
                    />
                  </div>
                  <div>
                    <label className="text-xs block mb-1">
                      Short Break (minutes)
                    </label>
                    <Input
                      type="number"
                      min="1"
                      max="30"
                      value={shortBreakDuration}
                      onChange={(e) =>
                        setShortBreakDuration(parseInt(e.target.value) || 5)
                      }
                      className="h-8"
                    />
                  </div>
                  <div>
                    <label className="text-xs block mb-1">
                      Long Break (minutes)
                    </label>
                    <Input
                      type="number"
                      min="1"
                      max="60"
                      value={longBreakDuration}
                      onChange={(e) =>
                        setLongBreakDuration(parseInt(e.target.value) || 15)
                      }
                      className="h-8"
                    />
                  </div>
                  <div>
                    <label className="text-xs block mb-1">
                      Sessions before Long Break
                    </label>
                    <Input
                      type="number"
                      min="1"
                      max="10"
                      value={sessionsBeforeLongBreak}
                      onChange={(e) =>
                        setSessionsBeforeLongBreak(
                          parseInt(e.target.value) || 4,
                        )
                      }
                      className="h-8"
                    />
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-3 w-full"
                  onClick={requestNotificationPermission}
                >
                  Enable Notifications
                </Button>
              </div>
            )}

            <div className="flex flex-col items-center justify-center py-6">
              <div className="relative w-64 h-64 mb-6">
                {/* Circular progress background */}
                <div className="absolute inset-0 rounded-full border-8 border-muted"></div>

                {/* Circular progress indicator */}
                <svg
                  className="absolute inset-0 w-full h-full"
                  viewBox="0 0 100 100"
                >
                  <circle
                    cx="50"
                    cy="50"
                    r="46"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="8"
                    strokeDasharray="289.27"
                    strokeDashoffset={289.27 - (289.27 * getProgress()) / 100}
                    transform="rotate(-90 50 50)"
                    className={getModeColor()}
                  />
                </svg>

                {/* Timer display */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className={`text-5xl font-bold ${getModeColor()}`}>
                    {formatTime(timeLeft)}
                  </div>
                  <div className="text-sm mt-2 capitalize">
                    {mode.replace(/([A-Z])/g, " $1").trim()}
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={resetTimer}
                  className="rounded-full h-12 w-12"
                >
                  <RotateCcw className="h-5 w-5" />
                </Button>
                <Button
                  variant="default"
                  size="icon"
                  onClick={toggleTimer}
                  className="rounded-full h-12 w-12"
                >
                  {isRunning ? (
                    <Pause className="h-5 w-5" />
                  ) : (
                    <Play className="h-5 w-5" />
                  )}
                </Button>
              </div>
            </div>

            <div className="mt-4 text-center">
              <p className="text-sm text-muted-foreground">
                Completed sessions:{" "}
                <span className="font-medium">{completedSessions}</span>
              </p>
            </div>
          </div>

          <div className="border rounded-lg p-6 max-w-md mx-auto">
            <h2 className="text-xl font-semibold mb-4">How to use</h2>
            <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
              <li>
                Set your preferred work and break durations in the settings.
              </li>
              <li>Click the play button to start the timer.</li>
              <li>Focus on your task until the timer ends.</li>
              <li>Take a short break when prompted.</li>
              <li>
                After completing several work sessions, take a longer break.
              </li>
              <li>Repeat the cycle to maintain productivity.</li>
            </ol>
            <div className="mt-4 p-4 bg-muted/30 rounded-md">
              <p className="text-sm text-muted-foreground">
                <strong>The Pomodoro Technique:</strong> This time management
                method uses focused work sessions (typically 25 minutes)
                followed by short breaks to improve mental agility and prevent
                burnout.
              </p>
            </div>
          </div>
        </Container>
      </main>
      <Footer />
      <MobileNav />
    </div>
  );
}
