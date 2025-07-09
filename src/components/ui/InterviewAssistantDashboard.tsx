"use client";

import React, { useState, createContext, useContext } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { 
  Menu, 
  X, 
  LayoutDashboard, 
  Users, 
  MessageSquare, 
  Settings, 
  Activity, 
  Clock, 
  CheckCircle, 
  Send,
  FileText,
  BarChart3,
  Zap,
  Brain,
  User
} from "lucide-react";
import { cn } from "@/lib/utils";
import MigrationTest from "@/components/MigrationTest";

/**
 * Utility function for combining CSS classes
 * This helps us merge multiple className strings together cleanly
 */
const cnUtil = (...classes: (string | undefined | null | false)[]) => classes.filter(Boolean).join(" ");

/**
 * Loading spinner component that shows a rotating animation
 * Used to indicate when the AI is processing or loading content
 */
interface SpinnerProps {
  size?: number;
  color?: string;
}

// These are the individual bars that make up the spinning animation
const bars = [
  { animationDelay: "-1.2s", transform: "rotate(.0001deg) translate(146%)" },
  { animationDelay: "-1.1s", transform: "rotate(30deg) translate(146%)" },
  { animationDelay: "-1.0s", transform: "rotate(60deg) translate(146%)" },
  { animationDelay: "-0.9s", transform: "rotate(90deg) translate(146%)" },
  { animationDelay: "-0.8s", transform: "rotate(120deg) translate(146%)" },
  { animationDelay: "-0.7s", transform: "rotate(150deg) translate(146%)" },
  { animationDelay: "-0.6s", transform: "rotate(180deg) translate(146%)" },
  { animationDelay: "-0.5s", transform: "rotate(210deg) translate(146%)" },
  { animationDelay: "-0.4s", transform: "rotate(240deg) translate(146%)" },
  { animationDelay: "-0.3s", transform: "rotate(270deg) translate(146%)" },
  { animationDelay: "-0.2s", transform: "rotate(300deg) translate(146%)" },
  { animationDelay: "-0.1s", transform: "rotate(330deg) translate(146%)" }
];

const Spinner = ({ size = 20, color = "#8f8f8f" }: SpinnerProps) => {
  return (
    <div style={{ width: size, height: size }}>
      <style jsx>
        {`
          @keyframes spin {
              0% {
                  opacity: 0.15;
              }
              100% {
                  opacity: 1;
              }
          }
        `}
      </style>
      <div className="relative top-1/2 left-1/2" style={{ width: size, height: size }}>
        {bars.map((item) => (
          <div
            key={item.transform}
            className="absolute h-[8%] w-[24%] -left-[10%] -top-[3.9%] rounded-[5px]"
            style={{ backgroundColor: color, animation: "spin 1.2s linear infinite", ...item }}
          />
        ))}
      </div>
    </div>
  );
};

/**
 * Button component with different sizes, types, and states
 * This provides consistent styling across the application
 */
const sizes = [
  {
    tiny: "px-1.5 h-6 text-sm",
    small: "px-1.5 h-8 text-sm",
    medium: "px-2.5 h-10 text-sm",
    large: "px-3.5 h-12 text-base"
  },
  {
    tiny: "w-6 h-6 text-sm",
    small: "w-8 h-8 text-sm",
    medium: "w-10 h-10 text-sm",
    large: "w-12 h-12 text-base"
  }
];

// Different button styles for different purposes
const types = {
  primary: "bg-blue-600 hover:bg-blue-700 text-white",
  secondary: "bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600",
  tertiary: "bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-900 dark:text-gray-100",
  error: "bg-red-600 hover:bg-red-700 text-white",
  warning: "bg-yellow-500 hover:bg-yellow-600 text-black"
};

// Button shape variations
const shapes = {
  square: {
    tiny: "rounded",
    small: "rounded-md",
    medium: "rounded-md",
    large: "rounded-lg"
  },
  circle: {
    tiny: "rounded-full",
    small: "rounded-full",
    medium: "rounded-full",
    large: "rounded-full"
  },
  rounded: {
    tiny: "rounded-full",
    small: "rounded-full",
    medium: "rounded-full",
    large: "rounded-full"
  }
};

interface ButtonProps {
  size?: keyof typeof sizes[0];
  variant?: keyof typeof types;
  shape?: keyof typeof shapes;
  svgOnly?: boolean;
  children?: React.ReactNode;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  shadow?: boolean;
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  onClick?: () => void;
  className?: string;
}

const Button = ({
  size = "medium",
  variant = "primary",
  shape = "square",
  svgOnly = false,
  children,
  prefix,
  suffix,
  shadow = false,
  loading = false,
  disabled = false,
  fullWidth = false,
  onClick,
  className,
  ...rest
}: ButtonProps) => {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      tabIndex={0}
      className={cnUtil(
        `flex justify-center items-center gap-0.5 duration-150 ${sizes[+svgOnly][size]} ${(disabled || loading) ? "bg-gray-200 dark:bg-gray-700 text-gray-500 cursor-not-allowed" : types[variant]} ${shapes[shape][size]}${shadow ? " shadow-lg" : ""}${fullWidth ? " w-full" : ""} focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`,
        className
      )}
      {...rest}
    >
      {loading ? (
        <Spinner size={size === "large" ? 24 : 16} />
      ) : prefix}
      <span className={`overflow-hidden whitespace-nowrap overflow-ellipsis font-sans${size === "tiny" ? "" : " px-1.5"}`}>
        {children}
      </span>
      {!loading && suffix}
    </button>
  );
};


/**
 * Sidebar navigation components that handle collapsing and expanding
 * Provides navigation links and user context
 */
interface Links {
  label: string;
  href: string;
  icon: React.JSX.Element | React.ReactNode;
}

interface SidebarContextProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  animate: boolean;
}

const SidebarContext = createContext<SidebarContextProps | undefined>(
  undefined
);

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
};

export const SidebarProvider = ({
  children,
  open: openProp,
  setOpen: setOpenProp,
  animate = true,
}: {
  children: React.ReactNode;
  open?: boolean;
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  animate?: boolean;
}) => {
  const [openState, setOpenState] = useState(false);

  const open = openProp !== undefined ? openProp : openState;
  const setOpen = setOpenProp !== undefined ? setOpenProp : setOpenState;

  return (
    <SidebarContext.Provider value={{ open, setOpen, animate }}>
      {children}
    </SidebarContext.Provider>
  );
};

export const Sidebar = ({
  children,
  open,
  setOpen,
  animate,
}: {
  children: React.ReactNode;
  open?: boolean;
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  animate?: boolean;
}) => {
  return (
    <SidebarProvider open={open} setOpen={setOpen} animate={animate}>
      {children}
    </SidebarProvider>
  );
};

export const SidebarBody = (props: React.ComponentProps<typeof motion.div>) => {
  return (
    <>
      <DesktopSidebar {...props} />
      <MobileSidebar {...(props as React.ComponentProps<"div">)} />
    </>
  );
};

export const DesktopSidebar = ({
  className,
  children,
  ...props
}: React.ComponentProps<typeof motion.div>) => {
  const { open, setOpen, animate } = useSidebar();
  return (
    <motion.div
      className={cn(
        "h-full px-4 py-4 hidden md:flex md:flex-col bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 w-[300px] flex-shrink-0",
        className
      )}
      animate={{
        width: animate ? (open ? "300px" : "60px") : "300px",
      }}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export const MobileSidebar = ({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) => {
  const { open, setOpen } = useSidebar();
  return (
    <>
      <div
        className={cn(
          "h-10 px-4 py-4 flex flex-row md:hidden items-center justify-between bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 w-full"
        )}
        {...props}
      >
        <div className="flex justify-end z-20 w-full">
          <Menu
            className="text-gray-900 dark:text-gray-100 cursor-pointer"
            onClick={() => setOpen(!open)}
          />
        </div>
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ x: "-100%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "-100%", opacity: 0 }}
              transition={{
                duration: 0.3,
                ease: "easeInOut",
              }}
              className={cn(
                "fixed h-full w-full inset-0 bg-white dark:bg-gray-900 p-10 z-[100] flex flex-col justify-between",
                className
              )}
            >
              <div
                className="absolute right-10 top-10 z-50 text-gray-900 dark:text-gray-100 cursor-pointer"
                onClick={() => setOpen(!open)}
              >
                <X />
              </div>
              {children}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export const SidebarLink = ({
  link,
  className,
  ...props
}: {
  link: Links;
  className?: string;
  props?: unknown;
}) => {
  const { open, animate } = useSidebar();
  return (
    <div
      className={cn(
        "flex items-center justify-start gap-2 group/sidebar py-2 cursor-pointer",
        className
      )}
      {...props}
    >
      {link.icon}
      <motion.span
        animate={{
          display: animate ? (open ? "inline-block" : "none") : "inline-block",
          opacity: animate ? (open ? 1 : 0) : 1,
        }}
        className="text-gray-900 dark:text-gray-100 text-sm group-hover/sidebar:translate-x-1 transition duration-150 whitespace-pre inline-block !p-0 !m-0"
      >
        {link.label}
      </motion.span>
    </div>
  );
};

/**
 * Main Dashboard Component
 * This is the central component that brings together all the features:
 * - Sidebar navigation
 * - Question interface for AI interaction
 * - System status monitoring
 * - Analytics and metrics
 * - Quick actions
 */
const InterviewAssistantDashboard = () => {
  const [open, setOpen] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Navigation links for the sidebar
  const sidebarLinks = [
    {
      label: "Dashboard",
      href: "#",
      icon: <LayoutDashboard className="text-gray-700 dark:text-gray-300 h-5 w-5 flex-shrink-0" />,
    },
    {
      label: "Candidates",
      href: "#",
      icon: <Users className="text-gray-700 dark:text-gray-300 h-5 w-5 flex-shrink-0" />,
    },
    {
      label: "Questions",
      href: "#",
      icon: <MessageSquare className="text-gray-700 dark:text-gray-300 h-5 w-5 flex-shrink-0" />,
    },
    {
      label: "Analytics",
      href: "#",
      icon: <BarChart3 className="text-gray-700 dark:text-gray-300 h-5 w-5 flex-shrink-0" />,
    },
    {
      label: "Settings",
      href: "#",
      icon: <Settings className="text-gray-700 dark:text-gray-300 h-5 w-5 flex-shrink-0" />,
    },
  ];

  // Sample data for recent questions asked during interviews
  const recentQuestions = [
    { id: 1, question: "Tell me about your experience with React", category: "Technical", difficulty: "Medium" },
    { id: 2, question: "How do you handle conflict in a team?", category: "Behavioral", difficulty: "Easy" },
    { id: 3, question: "Explain the concept of closures in JavaScript", category: "Technical", difficulty: "Hard" },
    { id: 4, question: "Describe your leadership style", category: "Leadership", difficulty: "Medium" },
  ];

  // System performance metrics displayed on the dashboard
  const systemMetrics = [
    { label: "Active Sessions", value: 12, change: "+3", color: "text-green-500" },
    { label: "Questions Asked", value: 847, change: "+24", color: "text-blue-500" },
    { label: "Candidates Evaluated", value: 156, change: "+8", color: "text-purple-500" },
    { label: "Success Rate", value: "94%", change: "+2%", color: "text-emerald-500" },
  ];

  /**
   * Handles sending a question to the AI assistant
   * Simulates AI processing with a loading state
   */
  const handleSendQuestion = (message: string) => {
    setCurrentQuestion(message);
    setIsLoading(true);
    
    // Simulate AI processing time
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  };

  /**
   * Question Interface Component
   * This is where users interact with the AI assistant
   * Shows conversation history and allows sending new questions
   */
  const QuestionInterface = () => (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">AI Question Assistant</h3>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
            <span className="text-sm text-gray-600 dark:text-gray-400">Online</span>
          </div>
        </div>
      </div>

      {/* Conversation area showing user questions and AI responses */}
      <div className="space-y-4 mb-6 min-h-[200px]">
        {currentQuestion && (
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
            <div className="flex items-start gap-3">
              <User className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">You asked:</p>
                <p className="text-gray-900 dark:text-gray-100 mt-1">{currentQuestion}</p>
              </div>
            </div>
          </div>
        )}

        {isLoading && (
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Brain className="w-5 h-5 text-gray-600 dark:text-gray-400 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">AI is thinking...</p>
                <div className="flex items-center gap-2 mt-2">
                  <Spinner size={16} />
                  <span className="text-sm text-gray-600 dark:text-gray-400">Generating response</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {currentQuestion && !isLoading && (
          <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Brain className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">AI Assistant:</p>
                <p className="text-gray-900 dark:text-gray-100 mt-1">
                  That&apos;s an excellent question for evaluating a candidate&apos;s technical knowledge and problem-solving approach. 
                  I recommend following up with specific examples and asking them to walk through their thought process.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input area for sending new questions */}
      <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
        <div className="flex items-center gap-2 mb-3">
          <MessageSquare className="w-4 h-4 text-gray-600 dark:text-gray-400" />
          <span className="text-sm text-gray-600 dark:text-gray-400">Ask for question suggestions or evaluation help</span>
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Type your question or ask for suggestions..."
            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                handleSendQuestion(e.currentTarget.value);
                e.currentTarget.value = '';
              }
            }}
          />
          <Button
            onClick={() => {
              const input = document.querySelector('input') as HTMLInputElement;
              if (input?.value.trim()) {
                handleSendQuestion(input.value);
                input.value = '';
              }
            }}
            className="px-4"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );

  /**
   * System Status Component
   * Shows the health and performance of various system components
   */
  const SystemStatus = () => (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">System Status</h3>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-green-500" />
            <span className="text-sm text-gray-900 dark:text-gray-100">Database</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-500" />
            <span className="text-sm text-green-500">Connected</span>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-blue-500" />
            <span className="text-sm text-gray-900 dark:text-gray-100">Response Time</span>
          </div>
          <span className="text-sm text-gray-600 dark:text-gray-400">1.2s avg</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-purple-500" />
            <span className="text-sm text-gray-900 dark:text-gray-100">Uptime</span>
          </div>
          <span className="text-sm text-gray-600 dark:text-gray-400">99.9%</span>
        </div>

        <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-900 dark:text-gray-100">Data Migration</span>
          </div>
          <MigrationTest />
        </div>
      </div>
    </div>
  );

  /**
   * Recent Questions Component
   * Shows a list of recently asked interview questions
   */
  const RecentQuestions = () => (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Recent Questions</h3>
      <div className="space-y-3">
        {recentQuestions.map((item) => (
          <div key={item.id} className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors cursor-pointer">
            <MessageSquare className="w-4 h-4 text-blue-600 dark:text-blue-400 mt-1 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-900 dark:text-gray-100 font-medium truncate">{item.question}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs px-2 py-1 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400">{item.category}</span>
                <span className="text-xs text-gray-600 dark:text-gray-400">{item.difficulty}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  /**
   * Quick Actions Component
   * Provides shortcuts to common tasks
   */
  const QuickActions = () => (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Quick Actions</h3>
      <div className="grid grid-cols-2 gap-3">
        <Button className="h-auto p-4 flex-col gap-2" variant="secondary">
          <Users className="w-5 h-5" />
          <span className="text-sm">New Interview</span>
        </Button>
        <Button className="h-auto p-4 flex-col gap-2" variant="secondary">
          <FileText className="w-5 h-5" />
          <span className="text-sm">Generate Report</span>
        </Button>
        <Button className="h-auto p-4 flex-col gap-2" variant="secondary">
          <MessageSquare className="w-5 h-5" />
          <span className="text-sm">Question Bank</span>
        </Button>
        <Button className="h-auto p-4 flex-col gap-2" variant="secondary">
          <BarChart3 className="w-5 h-5" />
          <span className="text-sm">Analytics</span>
        </Button>
      </div>
    </div>
  );

  /**
   * Metrics Grid Component
   * Displays key performance indicators at the top of the dashboard
   */
  const MetricsGrid = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {systemMetrics.map((metric, index) => (
        <div key={index} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">{metric.label}</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-1">{metric.value}</p>
            </div>
            <div className={cn("text-sm font-medium", metric.color)}>
              {metric.change}
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  // Main dashboard render with sidebar and content areas
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="flex h-screen">
        <Sidebar open={open} setOpen={setOpen}>
          <SidebarBody className="justify-between gap-10">
            <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
              {/* Logo and app name */}
              <div className="flex items-center gap-2 py-2">
                <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Brain className="h-5 w-5 text-white" />
                </div>
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="font-semibold text-gray-900 dark:text-gray-100 whitespace-pre"
                >
                  Interview AI
                </motion.span>
              </div>
              
              {/* Navigation links */}
              <div className="mt-8 flex flex-col gap-2">
                {sidebarLinks.map((link, idx) => (
                  <SidebarLink key={idx} link={link} />
                ))}
              </div>
            </div>
            
            {/* User profile at bottom */}
            <div>
              <SidebarLink
                link={{
                  label: "John Interviewer",
                  href: "#",
                  icon: (
                    <div className="h-7 w-7 bg-blue-600 rounded-full flex items-center justify-center">
                      <User className="h-4 w-4 text-white" />
                    </div>
                  ),
                }}
              />
            </div>
          </SidebarBody>
        </Sidebar>

        {/* Main content area */}
        <div className="flex-1 overflow-auto">
          <div className="p-6 md:p-8">
            {/* Page header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Interview Assistant Dashboard</h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">AI-powered candidate evaluation and interview assistance</p>
            </div>

            {/* Metrics overview */}
            <MetricsGrid />

            {/* Main dashboard layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main content - Question interface takes up 2/3 of space */}
              <div className="lg:col-span-2 space-y-8">
                <QuestionInterface />
              </div>
              
              {/* Sidebar content - System status and quick actions take up 1/3 */}
              <div className="space-y-6">
                <SystemStatus />
                <QuickActions />
                <RecentQuestions />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterviewAssistantDashboard; 