"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadialBarChart,
  RadialBar,
  Legend,
  AreaChart,
  Area,
} from "recharts";
import Head from "next/head";
import Image from "next/image";

// Types
type Habit = {
  id: string;
  name: string;
  icon: string;
  target: number;
  unit: string;
  frequency: "daily" | "weekly";
  streak: number;
  progress: number;
  color: string;
  history: {
    date: string;
    value: number;
  }[];
};

type Sleep = {
  date: string;
  hours: number;
  quality: number;
};

type Water = {
  date: string;
  glasses: number;
};

type ScreenTime = {
  date: string;
  hours: number;
  categories: {
    name: string;
    hours: number;
    color: string;
  }[];
};

type User = {
  name: string;
  avatar: string;
  joinDate: string;
  streakRecord: number;
  completionRate: number;
};

// Mock Data
const generateMockData = () => {
  const today = new Date();
  const pastDays = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(today.getDate() - i);
    return date.toISOString().split("T")[0];
  }).reverse();

  const mockHabits: Habit[] = [
    {
      id: "1",
      name: "Exercise",
      icon: "🏃‍♂️",
      target: 30,
      unit: "minutes",
      frequency: "daily",
      streak: 5,
      progress: 25,
      color: "#4F46E5",
      history: pastDays.map((date) => ({
        date,
        value: Math.floor(Math.random() * 45) + 10,
      })),
    },
    {
      id: "2",
      name: "Meditation",
      icon: "🧘‍♀️",
      target: 15,
      unit: "minutes",
      frequency: "daily",
      streak: 12,
      progress: 15,
      color: "#10B981",
      history: pastDays.map((date) => ({
        date,
        value: Math.floor(Math.random() * 20) + 5,
      })),
    },
    {
      id: "3",
      name: "Reading",
      icon: "📚",
      target: 20,
      unit: "pages",
      frequency: "daily",
      streak: 3,
      progress: 15,
      color: "#F59E0B",
      history: pastDays.map((date) => ({
        date,
        value: Math.floor(Math.random() * 30) + 5,
      })),
    },
    {
      id: "4",
      name: "Journaling",
      icon: "✏️",
      target: 1,
      unit: "entry",
      frequency: "daily",
      streak: 7,
      progress: 1,
      color: "#EC4899",
      history: pastDays.map((date) => ({
        date,
        value: Math.random() > 0.2 ? 1 : 0,
      })),
    },
  ];

  const mockSleepData: Sleep[] = pastDays.map((date) => ({
    date,
    hours: Math.floor(Math.random() * 3) + 6,
    quality: Math.floor(Math.random() * 40) + 60,
  }));

  const mockWaterData: Water[] = pastDays.map((date) => ({
    date,
    glasses: Math.floor(Math.random() * 5) + 4,
  }));

  const mockScreenTimeData: ScreenTime[] = pastDays.map((date) => {
    const totalHours = Math.floor(Math.random() * 4) + 2;
    return {
      date,
      hours: totalHours,
      categories: [
        {
          name: "Social Media",
          hours: (Math.random() * 0.4 * totalHours).toFixed(1),
          color: "#4F46E5",
        },
        {
          name: "Productivity",
          hours: (Math.random() * 0.3 * totalHours).toFixed(1),
          color: "#10B981",
        },
        {
          name: "Entertainment",
          hours: (Math.random() * 0.3 * totalHours).toFixed(1),
          color: "#F59E0B",
        },
      ],
    };
  });

  const mockUser: User = {
    name: "Bismay Dey",
    avatar:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTfmTZBHuhahcds79zbq-Qsc38Pf5akSjdvqQ&s",
    joinDate: "2025-05-03",
    streakRecord: 1,
    completionRate: 78,
  };

  return {
    habits: mockHabits,
    sleepData: mockSleepData,
    waterData: mockWaterData,
    screenTimeData: mockScreenTimeData,
    user: mockUser,
  };
};

export default function HabitTracker() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [showSettings, setShowSettings] = useState(false);
  const [showAddHabit, setShowAddHabit] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [mockData, setMockData] = useState(() => generateMockData());
  const [habits, setHabits] = useState<Habit[]>([]);
  const [sleepData, setSleepData] = useState<Sleep[]>([]);
  const [waterData, setWaterData] = useState<Water[]>([]);
  const [screenTimeData, setScreenTimeData] = useState<ScreenTime[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedHabit, setSelectedHabit] = useState<Habit | null>(null);
  const [showHabitDetail, setShowHabitDetail] = useState(false);

  // Initialize data
  useEffect(() => {
    // Simulate loading data
    setTimeout(() => {
      const data = generateMockData();
      setHabits(data.habits);
      setSleepData(data.sleepData);
      setWaterData(data.waterData);
      setScreenTimeData(data.screenTimeData);
      setUser(data.user);
      setLoading(false);
    }, 1000);
  }, []);

  // Update habit progress
  const updateHabitProgress = (habitId: string, newProgress: number) => {
    setHabits((prevHabits) =>
      prevHabits.map((habit) =>
        habit.id === habitId
          ? {
              ...habit,
              progress: newProgress,
              streak:
                newProgress >= habit.target ? habit.streak + 1 : habit.streak,
              history: [
                ...habit.history,
                {
                  date: new Date().toISOString().split("T")[0],
                  value: newProgress,
                },
              ].slice(-7),
            }
          : habit
      )
    );
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  // Get short day name
  const getShortDay = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { weekday: "short" });
  };

  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  // View habit details
  const viewHabitDetails = (habit: Habit) => {
    setSelectedHabit(habit);
    setShowHabitDetail(true);
  };

  // Add a new habit
  const addNewHabit = (habitData: Partial<Habit>) => {
    const today = new Date().toISOString().split("T")[0];
    const pastDays = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(new Date().getDate() - i);
      return date.toISOString().split("T")[0];
    }).reverse();

    const newHabit: Habit = {
      id: Date.now().toString(),
      name: habitData.name || "New Habit",
      icon: habitData.icon || "🎯",
      target: habitData.target || 1,
      unit: habitData.unit || "times",
      frequency: habitData.frequency || "daily",
      streak: 0,
      progress: 0,
      color: habitData.color || "#4F46E5",
      history: pastDays.map((date) => ({
        date,
        value: 0,
      })),
    };

    setHabits((prevHabits) => [...prevHabits, newHabit]);
    setShowAddHabit(false);
  };

  // Loading state
  if (loading) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center ${
          darkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"
        }`}
      >
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-t-blue-500 border-b-blue-500 border-l-transparent border-r-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-lg font-medium">Loading your habits...</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen ${
        darkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"
      }`}
    >
      <Head>
        <title>Habit Tracker | Personal Analytics</title>
        <meta
          name="description"
          content="Track your daily habits and personal stats"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Navbar */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 ${
          darkMode ? "bg-gray-800" : "bg-white"
        } shadow-md`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="flex-shrink-0 flex items-center"
              >
                <span className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
                  Go Healthy
                </span>
              </motion.div>
              <div className="hidden md:ml-6 md:flex md:space-x-8">
                <button
                  onClick={() => setActiveTab("dashboard")}
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                    activeTab === "dashboard"
                      ? "border-blue-500 text-blue-500"
                      : `border-transparent ${
                          darkMode
                            ? "text-gray-300 hover:text-gray-200"
                            : "text-gray-500 hover:text-gray-700"
                        }`
                  }`}
                >
                  Dashboard
                </button>
                <button
                  onClick={() => setActiveTab("habits")}
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                    activeTab === "habits"
                      ? "border-blue-500 text-blue-500"
                      : `border-transparent ${
                          darkMode
                            ? "text-gray-300 hover:text-gray-200"
                            : "text-gray-500 hover:text-gray-700"
                        }`
                  }`}
                >
                  My Habits
                </button>
                <button
                  onClick={() => setActiveTab("stats")}
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                    activeTab === "stats"
                      ? "border-blue-500 text-blue-500"
                      : `border-transparent ${
                          darkMode
                            ? "text-gray-300 hover:text-gray-200"
                            : "text-gray-500 hover:text-gray-700"
                        }`
                  }`}
                >
                  Statistics
                </button>
              </div>
            </div>
            <div className="flex items-center">
              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-full text-gray-500 hover:text-gray-700 focus:outline-none"
              >
                {darkMode ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-yellow-300"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                    />
                  </svg>
                )}
              </button>
              <div className="ml-3 relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="p-2 rounded-full text-gray-500 hover:text-gray-700 focus:outline-none"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                    />
                  </svg>
                  <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500"></span>
                </button>
                {showNotifications && (
                  <div
                    className={`origin-top-right absolute right-0 mt-2 w-80 rounded-md shadow-lg ${
                      darkMode ? "bg-gray-800" : "bg-white"
                    } ring-1 ring-black ring-opacity-5 focus:outline-none`}
                  >
                    <div
                      className="py-1"
                      role="menu"
                      aria-orientation="vertical"
                      aria-labelledby="options-menu"
                    >
                      <div className="px-4 py-2 border-b border-gray-200">
                        <h3 className="text-sm font-medium">Notifications</h3>
                      </div>
                      <div
                        className={`px-4 py-3 border-b ${
                          darkMode ? "border-gray-700" : "border-gray-200"
                        }`}
                      >
                        <p className="text-sm font-medium">
                          Reminder: Complete your meditation
                        </p>
                        <p className="text-xs text-gray-500">5 minutes ago</p>
                      </div>
                      <div
                        className={`px-4 py-3 border-b ${
                          darkMode ? "border-gray-700" : "border-gray-200"
                        }`}
                      >
                        <p className="text-sm font-medium">
                          You've achieved a 5-day streak in Exercise!
                        </p>
                        <p className="text-xs text-gray-500">2 hours ago</p>
                      </div>
                      <div
                        className={`px-4 py-3 border-b ${
                          darkMode ? "border-gray-700" : "border-gray-200"
                        }`}
                      >
                        <p className="text-sm font-medium">
                          Don't forget to log your water intake
                        </p>
                        <p className="text-xs text-gray-500">Yesterday</p>
                      </div>
                      <div className="px-4 py-2 text-center">
                        <button className="text-sm text-blue-500 hover:text-blue-700">
                          View all notifications
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div className="ml-3 relative">
                <div>
                  <button
                    onClick={() => setShowSettings(!showSettings)}
                    className="flex text-sm rounded-full focus:outline-none"
                  >
                    <span className="sr-only">Open user menu</span>
                    <Image
                      className="h-8 w-8 rounded-full"
                      src={
                        user?.avatar ||
                        "https://randomuser.me/api/portraits/women/44.jpg"
                      }
                      alt="User avatar"
                      width={32}
                      height={32}
                    />
                  </button>
                </div>
                {showSettings && (
                  <div
                    className={`origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg ${
                      darkMode ? "bg-gray-800" : "bg-white"
                    } ring-1 ring-black ring-opacity-5 focus:outline-none`}
                  >
                    <div
                      className="py-1"
                      role="menu"
                      aria-orientation="vertical"
                      aria-labelledby="options-menu"
                    >
                      <button
                        onClick={() => {
                          setShowSettings(false);
                          setActiveTab("profile");
                        }}
                        className={`block w-full text-left px-4 py-2 text-sm ${
                          darkMode
                            ? "text-gray-300 hover:bg-gray-700"
                            : "text-gray-700 hover:bg-gray-100"
                        }`}
                        role="menuitem"
                      >
                        Your Profile
                      </button>
                      <button
                        onClick={() => {
                          setShowSettings(false);
                          setActiveTab("settings");
                        }}
                        className={`block w-full text-left px-4 py-2 text-sm ${
                          darkMode
                            ? "text-gray-300 hover:bg-gray-700"
                            : "text-gray-700 hover:bg-gray-100"
                        }`}
                        role="menuitem"
                      >
                        Settings
                      </button>
                      <button
                        className={`block w-full text-left px-4 py-2 text-sm ${
                          darkMode
                            ? "text-gray-300 hover:bg-gray-700"
                            : "text-gray-700 hover:bg-gray-100"
                        }`}
                        role="menuitem"
                      >
                        Sign out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white shadow-lg border-t border-gray-200">
        <div className="flex justify-around">
          <button
            onClick={() => setActiveTab("dashboard")}
            className={`flex flex-col items-center py-2 px-4 ${
              activeTab === "dashboard" ? "text-blue-500" : "text-gray-500"
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
            <span className="text-xs">Dashboard</span>
          </button>
          <button
            onClick={() => setActiveTab("habits")}
            className={`flex flex-col items-center py-2 px-4 ${
              activeTab === "habits" ? "text-blue-500" : "text-gray-500"
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
            <span className="text-xs">Habits</span>
          </button>
          <button
            onClick={() => setActiveTab("stats")}
            className={`flex flex-col items-center py-2 px-4 ${
              activeTab === "stats" ? "text-blue-500" : "text-gray-500"
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
            <span className="text-xs">Stats</span>
          </button>
          <button
            onClick={() => setActiveTab("profile")}
            className={`flex flex-col items-center py-2 px-4 ${
              activeTab === "profile" ? "text-blue-500" : "text-gray-500"
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
            <span className="text-xs">Profile</span>
          </button>
        </div>
      </div>

      {/* Main content */}
      <main className="pt-16 pb-16 md:pb-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Dashboard */}
          {activeTab === "dashboard" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Today's Overview</h1>
                <p className="text-sm font-medium">
                  {new Date().toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>

              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className={`rounded-lg shadow-md p-6 ${
                    darkMode ? "bg-gray-800" : "bg-white"
                  }`}
                >
                  <div className="flex items-center">
                    <div className="p-3 rounded-full bg-blue-100 text-blue-500">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <h2 className="text-lg font-semibold">Completion Rate</h2>
                      <p className="text-3xl font-bold">
                        {user?.completionRate}%
                      </p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className="bg-blue-500 h-2.5 rounded-full"
                        style={{ width: `${user?.completionRate}%` }}
                      ></div>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className={`rounded-lg shadow-md p-6 ${
                    darkMode ? "bg-gray-800" : "bg-white"
                  }`}
                >
                  <div className="flex items-center">
                    <div className="p-3 rounded-full bg-green-100 text-green-500">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 10V3L4 14h7v7l9-11h-7z"
                        />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <h2 className="text-lg font-semibold">Current Streak</h2>
                      <p className="text-3xl font-bold">
                        {Math.max(...habits.map((h) => h.streak))} days
                      </p>
                    </div>
                  </div>
                  <p className="mt-4 text-sm text-gray-500">
                    Your longest streak is {user?.streakRecord} days
                  </p>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className={`rounded-lg shadow-md p-6 ${
                    darkMode ? "bg-gray-800" : "bg-white"
                  }`}
                >
                  <div className="flex items-center">
                    <div className="p-3 rounded-full bg-purple-100 text-purple-500">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <h2 className="text-lg font-semibold">Active Habits</h2>
                      <p className="text-3xl font-bold">{habits.length}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowAddHabit(true)}
                    className="mt-4 w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                  >
                    Add New Habit
                  </button>
                </motion.div>
              </div>

              {/* Today's Habits */}
              <div
                className={`rounded-lg shadow-md p-6 ${
                  darkMode ? "bg-gray-800" : "bg-white"
                }`}
              >
                <h2 className="text-xl font-semibold mb-4">Today's Habits</h2>
                <div className="space-y-4">
                  {habits.map((habit) => (
                    <motion.div
                      key={habit.id}
                      whileHover={{ scale: 1.01 }}
                      className={`p-4 rounded-lg border ${
                        darkMode ? "border-gray-700" : "border-gray-200"
                      } hover:shadow-md transition-shadow`}
                    >
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <span className="text-2xl mr-3">{habit.icon}</span>
                          <div>
                            <h3 className="font-medium">{habit.name}</h3>
                            <p className="text-sm text-gray-500">
                              Target: {habit.target} {habit.unit}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <div className="mr-4">
                            <p className="text-sm font-medium">
                              {habit.progress}/{habit.target} {habit.unit}
                            </p>
                            <div className="w-32 bg-gray-200 rounded-full h-2.5 mt-1">
                              <div
                                className="h-2.5 rounded-full"
                                style={{
                                  width: `${Math.min(
                                    100,
                                    (habit.progress / habit.target) * 100
                                  )}%`,
                                  backgroundColor: habit.color,
                                }}
                              ></div>
                            </div>
                          </div>
                          <button
                            onClick={() => viewHabitDetails(habit)}
                            className="p-2 rounded-full hover:bg-gray-100"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5 text-gray-500"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                            </svg>
                          </button>
                        </div>
                      </div>
                      <div className="mt-4">
                        <input
                          type="range"
                          min="0"
                          max={habit.target * 1.5}
                          value={habit.progress}
                          onChange={(e) =>
                            updateHabitProgress(
                              habit.id,
                              Number.parseInt(e.target.value)
                            )
                          }
                          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                          style={{
                            background: `linear-gradient(to right, ${
                              habit.color
                            } 0%, ${habit.color} ${
                              (habit.progress / (habit.target * 1.5)) * 100
                            }%, #e5e7eb ${
                              (habit.progress / (habit.target * 1.5)) * 100
                            }%, #e5e7eb 100%)`,
                          }}
                        />
                        <div className="flex justify-between mt-1">
                          <span className="text-xs text-gray-500">0</span>
                          <span className="text-xs text-gray-500">
                            {habit.target}
                          </span>
                          <span className="text-xs text-gray-500">
                            {habit.target * 1.5}
                          </span>
                        </div>
                      </div>
                      <div className="mt-2 flex justify-between items-center">
                        <div className="flex items-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 text-yellow-500 mr-1"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM14 11a1 1 0 011 1v1h1a1 1 0 110 2h-1v1a1 1 0 11-2 0v-1h-1a1 1 0 110-2h1v-1a1 1 0 011-1z" />
                          </svg>
                          <span className="text-sm font-medium">
                            {habit.streak} day streak
                          </span>
                        </div>
                        <button
                          onClick={() =>
                            updateHabitProgress(habit.id, habit.target)
                          }
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            habit.progress >= habit.target
                              ? "bg-green-100 text-green-800"
                              : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {habit.progress >= habit.target
                            ? "Completed"
                            : "Mark Complete"}
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Weekly Progress */}
              <div
                className={`rounded-lg shadow-md p-6 ${
                  darkMode ? "bg-gray-800" : "bg-white"
                }`}
              >
                <h2 className="text-xl font-semibold mb-4">Weekly Progress</h2>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={habits[0]?.history.map((item) => ({
                        date: getShortDay(item.date),
                        Exercise:
                          habits[0]?.history.find((h) => h.date === item.date)
                            ?.value || 0,
                        Meditation:
                          habits[1]?.history.find((h) => h.date === item.date)
                            ?.value || 0,
                        Reading:
                          habits[2]?.history.find((h) => h.date === item.date)
                            ?.value || 0,
                      }))}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="Exercise" fill="#4F46E5" />
                      <Bar dataKey="Meditation" fill="#10B981" />
                      <Bar dataKey="Reading" fill="#F59E0B" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Health Stats */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Sleep Tracking */}
                <motion.div
                  whileHover={{ scale: 1.01 }}
                  className={`rounded-lg shadow-md p-6 ${
                    darkMode ? "bg-gray-800" : "bg-white"
                  }`}
                >
                  <h2 className="text-xl font-semibold mb-4">Sleep Tracking</h2>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart
                        data={sleepData}
                        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                      >
                        <defs>
                          <linearGradient
                            id="colorSleep"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                          >
                            <stop
                              offset="5%"
                              stopColor="#8884d8"
                              stopOpacity={0.8}
                            />
                            <stop
                              offset="95%"
                              stopColor="#8884d8"
                              stopOpacity={0}
                            />
                          </linearGradient>
                        </defs>
                        <XAxis dataKey="date" tickFormatter={getShortDay} />
                        <YAxis domain={[0, 12]} />
                        <CartesianGrid strokeDasharray="3 3" />
                        <Tooltip
                          formatter={(value, name) => [
                            `${value} hours`,
                            "Sleep Duration",
                          ]}
                          labelFormatter={(label) => formatDate(label)}
                        />
                        <Area
                          type="monotone"
                          dataKey="hours"
                          stroke="#8884d8"
                          fillOpacity={1}
                          fill="url(#colorSleep)"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="mt-4 flex justify-between items-center">
                    <div>
                      <p className="text-sm text-gray-500">Average Sleep</p>
                      <p className="text-xl font-bold">
                        {(
                          sleepData.reduce((acc, curr) => acc + curr.hours, 0) /
                          sleepData.length
                        ).toFixed(1)}{" "}
                        hours
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Sleep Quality</p>
                      <p className="text-xl font-bold">
                        {Math.round(
                          sleepData.reduce(
                            (acc, curr) => acc + curr.quality,
                            0
                          ) / sleepData.length
                        )}
                        %
                      </p>
                    </div>
                    <button className="px-4 py-2 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
                      Log Sleep
                    </button>
                  </div>
                </motion.div>

                {/* Water Intake */}
                <motion.div
                  whileHover={{ scale: 1.01 }}
                  className={`rounded-lg shadow-md p-6 ${
                    darkMode ? "bg-gray-800" : "bg-white"
                  }`}
                >
                  <h2 className="text-xl font-semibold mb-4">Water Intake</h2>
                  <div className="flex items-center justify-center mb-4">
                    <div className="relative w-40 h-40">
                      <svg viewBox="0 0 100 100" className="w-full h-full">
                        <circle
                          cx="50"
                          cy="50"
                          r="45"
                          fill="#EBF8FF"
                          stroke="#90CDF4"
                          strokeWidth="2"
                        />
                        <path
                          d="M50,5 a45,45 0 0,1 0,90 a45,45 0 0,1 0,-90"
                          fill="#3B82F6"
                          opacity="0.7"
                          transform={`rotate(180 50 50) translate(0 ${
                            100 -
                            (waterData[waterData.length - 1]?.glasses / 8) * 100
                          })`}
                        />
                        <text
                          x="50"
                          y="50"
                          textAnchor="middle"
                          dominantBaseline="middle"
                          fill="#1E40AF"
                          fontSize="16"
                          fontWeight="bold"
                        >
                          {waterData[waterData.length - 1]?.glasses}/8
                        </text>
                        <text
                          x="50"
                          y="65"
                          textAnchor="middle"
                          dominantBaseline="middle"
                          fill="#1E40AF"
                          fontSize="10"
                        >
                          glasses
                        </text>
                      </svg>
                    </div>
                    <div className="ml-6">
                      <div className="space-y-2">
                        {[8, 6, 4, 2].map((level) => (
                          <div key={level} className="flex items-center">
                            <div
                              className={`w-4 h-4 rounded-full ${
                                waterData[waterData.length - 1]?.glasses >=
                                level
                                  ? "bg-blue-500"
                                  : "bg-gray-200"
                              }`}
                            ></div>
                            <span className="ml-2 text-sm">
                              {level} glasses
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-center space-x-2 mt-4">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                      <button
                        key={num}
                        onClick={() => {
                          const newWaterData = [...waterData];
                          newWaterData[newWaterData.length - 1].glasses = num;
                          setWaterData(newWaterData);
                        }}
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                          waterData[waterData.length - 1]?.glasses >= num
                            ? "bg-blue-500 text-white"
                            : `${
                                darkMode ? "bg-gray-700" : "bg-gray-100"
                              } text-gray-500`
                        }`}
                      >
                        {num}
                      </button>
                    ))}
                  </div>
                </motion.div>
              </div>

              {/* Screen Time */}
              <div
                className={`rounded-lg shadow-md p-6 ${
                  darkMode ? "bg-gray-800" : "bg-white"
                }`}
              >
                <h2 className="text-xl font-semibold mb-4">Screen Time</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={screenTimeData}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" tickFormatter={getShortDay} />
                        <YAxis />
                        <Tooltip
                          formatter={(value, name) => [
                            `${value} hours`,
                            "Screen Time",
                          ]}
                          labelFormatter={(label) => formatDate(label)}
                        />
                        <Line
                          type="monotone"
                          dataKey="hours"
                          stroke="#EC4899"
                          activeDot={{ r: 8 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium mb-3">
                      Today's Breakdown
                    </h3>
                    <div className="space-y-4">
                      {screenTimeData[
                        screenTimeData.length - 1
                      ]?.categories.map((category, index) => (
                        <div key={index}>
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm font-medium">
                              {category.name}
                            </span>
                            <span className="text-sm">
                              {category.hours} hrs
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div
                              className="h-2.5 rounded-full"
                              style={{
                                width: `${
                                  (Number(category.hours) /
                                    screenTimeData[screenTimeData.length - 1]
                                      ?.hours) *
                                  100
                                }%`,
                                backgroundColor: category.color,
                              }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-6">
                      <p className="text-sm text-gray-500">Daily Average</p>
                      <p className="text-xl font-bold">
                        {(
                          screenTimeData.reduce(
                            (acc, curr) => acc + curr.hours,
                            0
                          ) / screenTimeData.length
                        ).toFixed(1)}{" "}
                        hours
                      </p>
                      <p className="text-sm text-gray-500 mt-2">
                        {screenTimeData[screenTimeData.length - 1]?.hours > 4
                          ? "Try to reduce your screen time for better health."
                          : "You're maintaining a healthy screen time balance."}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Habits Tab */}
          {activeTab === "habits" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">My Habits</h1>
                <button
                  onClick={() => setShowAddHabit(true)}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                >
                  Add New Habit
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {habits.map((habit) => (
                  <motion.div
                    key={habit.id}
                    whileHover={{ scale: 1.02 }}
                    className={`rounded-lg shadow-md p-6 ${
                      darkMode ? "bg-gray-800" : "bg-white"
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex items-center">
                        <span className="text-3xl mr-3">{habit.icon}</span>
                        <div>
                          <h2 className="text-xl font-semibold">
                            {habit.name}
                          </h2>
                          <p className="text-sm text-gray-500">
                            {habit.target} {habit.unit} {habit.frequency}
                          </p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => viewHabitDetails(habit)}
                          className="p-2 rounded-full hover:bg-gray-100"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 text-gray-500"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                            />
                          </svg>
                        </button>
                        <button className="p-2 rounded-full hover:bg-gray-100">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 text-gray-500"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>

                    <div className="mt-6">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium">
                          Current Progress
                        </span>
                        <span className="text-sm font-medium">
                          {habit.progress}/{habit.target} {habit.unit}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div
                          className="h-2.5 rounded-full"
                          style={{
                            width: `${Math.min(
                              100,
                              (habit.progress / habit.target) * 100
                            )}%`,
                            backgroundColor: habit.color,
                          }}
                        ></div>
                      </div>
                    </div>

                    <div className="mt-6">
                      <h3 className="text-sm font-medium mb-2">
                        Weekly History
                      </h3>
                      <div className="flex justify-between">
                        {habit.history.map((day, index) => (
                          <div
                            key={index}
                            className="flex flex-col items-center"
                          >
                            <div
                              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs ${
                                day.value >= habit.target
                                  ? "bg-green-500 text-white"
                                  : day.value > 0
                                  ? "bg-yellow-200 text-yellow-800"
                                  : `${
                                      darkMode ? "bg-gray-700" : "bg-gray-100"
                                    } text-gray-400`
                              }`}
                            >
                              {day.value >= habit.target
                                ? "✓"
                                : day.value > 0
                                ? "·"
                                : "·"}
                            </div>
                            <span className="text-xs mt-1">
                              {getShortDay(day.date).substring(0, 1)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="mt-6 flex justify-between items-center">
                      <div className="flex items-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 text-yellow-500 mr-1"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM14 11a1 1 0 011 1v1h1a1 1 0 110 2h-1v1a1 1 0 11-2 0v-1h-1a1 1 0 110-2h1v-1a1 1 0 011-1z" />
                        </svg>
                        <span className="text-sm font-medium">
                          {habit.streak} day streak
                        </span>
                      </div>
                      <button
                        onClick={() =>
                          updateHabitProgress(habit.id, habit.target)
                        }
                        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                      >
                        Check In
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Stats Tab */}
          {activeTab === "stats" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              <h1 className="text-2xl font-bold">Statistics & Insights</h1>

              {/* Overall Progress */}
              <div
                className={`rounded-lg shadow-md p-6 ${
                  darkMode ? "bg-gray-800" : "bg-white"
                }`}
              >
                <h2 className="text-xl font-semibold mb-4">Overall Progress</h2>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadialBarChart
                      cx="50%"
                      cy="50%"
                      innerRadius="10%"
                      outerRadius="80%"
                      barSize={20}
                      data={habits.map((habit) => ({
                        name: habit.name,
                        value: Math.min(
                          100,
                          (habit.progress / habit.target) * 100
                        ),
                        fill: habit.color,
                      }))}
                    >
                      <RadialBar
                        label={{ position: "insideStart", fill: "#fff" }}
                        background
                        dataKey="value"
                      />
                      <Legend
                        iconSize={10}
                        layout="vertical"
                        verticalAlign="middle"
                        align="right"
                      />
                      <Tooltip
                        formatter={(value) => [
                          `${value.toFixed(0)}%`,
                          "Completion",
                        ]}
                      />
                    </RadialBarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Monthly Trends */}
              <div
                className={`rounded-lg shadow-md p-6 ${
                  darkMode ? "bg-gray-800" : "bg-white"
                }`}
              >
                <h2 className="text-xl font-semibold mb-4">Monthly Trends</h2>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={[
                        { month: "Jan", completion: 65 },
                        { month: "Feb", completion: 70 },
                        { month: "Mar", completion: 62 },
                        { month: "Apr", completion: 75 },
                        { month: "May", completion: 80 },
                        { month: "Jun", completion: 78 },
                      ]}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis domain={[0, 100]} />
                      <Tooltip />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="completion"
                        name="Completion Rate (%)"
                        stroke="#8884d8"
                        activeDot={{ r: 8 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Habit Comparison */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div
                  className={`rounded-lg shadow-md p-6 ${
                    darkMode ? "bg-gray-800" : "bg-white"
                  }`}
                >
                  <h2 className="text-xl font-semibold mb-4">
                    Habit Consistency
                  </h2>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={habits.map((habit) => ({
                          name: habit.name,
                          consistency:
                            (habit.history.filter(
                              (day) => day.value >= habit.target
                            ).length /
                              7) *
                            100,
                        }))}
                        layout="vertical"
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" domain={[0, 100]} />
                        <YAxis dataKey="name" type="category" />
                        <Tooltip
                          formatter={(value) => [
                            `${value.toFixed(0)}%`,
                            "Consistency",
                          ]}
                        />
                        <Bar dataKey="consistency" fill="#8884d8" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div
                  className={`rounded-lg shadow-md p-6 ${
                    darkMode ? "bg-gray-800" : "bg-white"
                  }`}
                >
                  <h2 className="text-xl font-semibold mb-4">Streak Records</h2>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={habits}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip
                          formatter={(value, name) => [value, "Current Streak"]}
                        />
                        <Bar dataKey="streak" fill="#82ca9d" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* Insights */}
              <div
                className={`rounded-lg shadow-md p-6 ${
                  darkMode ? "bg-gray-800" : "bg-white"
                }`}
              >
                <h2 className="text-xl font-semibold mb-4">
                  Insights & Recommendations
                </h2>
                <div className="space-y-4">
                  <div
                    className={`p-4 rounded-lg ${
                      darkMode ? "bg-gray-700" : "bg-blue-50"
                    } border border-blue-200`}
                  >
                    <h3 className="font-medium text-blue-800">
                      Consistency Pattern
                    </h3>
                    <p
                      className={`mt-1 ${
                        darkMode ? "text-gray-300" : "text-gray-600"
                      }`}
                    >
                      You're most consistent with meditation. Keep up the good
                      work with this habit and consider applying similar
                      techniques to other habits.
                    </p>
                  </div>
                  <div
                    className={`p-4 rounded-lg ${
                      darkMode ? "bg-gray-700" : "bg-yellow-50"
                    } border border-yellow-200`}
                  >
                    <h3 className="font-medium text-yellow-800">
                      Improvement Opportunity
                    </h3>
                    <p
                      className={`mt-1 ${
                        darkMode ? "text-gray-300" : "text-gray-600"
                      }`}
                    >
                      Your reading habit has the lowest consistency. Try setting
                      a specific time each day for reading to improve this
                      habit.
                    </p>
                  </div>
                  <div
                    className={`p-4 rounded-lg ${
                      darkMode ? "bg-gray-700" : "bg-green-50"
                    } border border-green-200`}
                  >
                    <h3 className="font-medium text-green-800">Achievement</h3>
                    <p
                      className={`mt-1 ${
                        darkMode ? "text-gray-300" : "text-gray-600"
                      }`}
                    >
                      You've maintained a 12-day streak for meditation! This is
                      your longest current streak.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Profile Tab */}
          {activeTab === "profile" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              <h1 className="text-2xl font-bold">Your Profile</h1>

              <div
                className={`rounded-lg shadow-md p-6 ${
                  darkMode ? "bg-gray-800" : "bg-white"
                }`}
              >
                <div className="flex flex-col md:flex-row items-center">
                  <div className="mb-4 md:mb-0 md:mr-6">
                    <Image
                      src={
                        user?.avatar ||
                        "https://randomuser.me/api/portraits/women/44.jpg"
                      }
                      alt="User avatar"
                      width={120}
                      height={120}
                      className="rounded-full"
                    />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">{user?.name}</h2>
                    <p className="text-gray-500">
                      Member since{" "}
                      {new Date(user?.joinDate || "").toLocaleDateString()}
                    </p>
                    <div className="mt-4 flex space-x-4">
                      <div>
                        <p className="text-sm text-gray-500">Habits</p>
                        <p className="text-xl font-bold">{habits.length}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Longest Streak</p>
                        <p className="text-xl font-bold">
                          {user?.streakRecord} days
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Completion Rate</p>
                        <p className="text-xl font-bold">
                          {user?.completionRate}%
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div
                  className={`rounded-lg shadow-md p-6 ${
                    darkMode ? "bg-gray-800" : "bg-white"
                  }`}
                >
                  <h2 className="text-xl font-semibold mb-4">
                    Your Achievements
                  </h2>
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <div className="p-3 rounded-full bg-yellow-100 text-yellow-700">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"
                          />
                        </svg>
                      </div>
                      <div className="ml-4">
                        <h3 className="font-medium">Early Bird</h3>
                        <p className="text-sm text-gray-500">
                          Completed 5 habits before 9 AM
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className="p-3 rounded-full bg-green-100 text-green-700">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13 10V3L4 14h7v7l9-11h-7z"
                          />
                        </svg>
                      </div>
                      <div className="ml-4">
                        <h3 className="font-medium">Streak Master</h3>
                        <p className="text-sm text-gray-500">
                          Maintained a 10+ day streak
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className="p-3 rounded-full bg-purple-100 text-purple-700">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </div>
                      <div className="ml-4">
                        <h3 className="font-medium">Habit Collector</h3>
                        <p className="text-sm text-gray-500">
                          Created 5+ habits
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div
                  className={`rounded-lg shadow-md p-6 ${
                    darkMode ? "bg-gray-800" : "bg-white"
                  }`}
                >
                  <h2 className="text-xl font-semibold mb-4">
                    Account Settings
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Email Notifications
                      </label>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          defaultChecked
                        />
                        <span className="ml-2 text-sm">Daily reminders</span>
                      </div>
                      <div className="flex items-center mt-2">
                        <input
                          type="checkbox"
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          defaultChecked
                        />
                        <span className="ml-2 text-sm">Weekly reports</span>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Theme
                      </label>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => setDarkMode(false)}
                          className={`px-3 py-1 rounded-md text-sm ${
                            !darkMode
                              ? "bg-blue-500 text-white"
                              : "bg-gray-200 text-gray-800"
                          }`}
                        >
                          Light
                        </button>
                        <button
                          onClick={() => setDarkMode(true)}
                          className={`px-3 py-1 rounded-md text-sm ${
                            darkMode
                              ? "bg-blue-500 text-white"
                              : "bg-gray-200 text-gray-800"
                          }`}
                        >
                          Dark
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Language
                      </label>
                      <select
                        className={`mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md ${
                          darkMode ? "bg-gray-700" : "bg-white"
                        }`}
                      >
                        <option>English</option>
                        <option>Spanish</option>
                        <option>French</option>
                        <option>German</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              <div
                className={`rounded-lg shadow-md p-6 ${
                  darkMode ? "bg-gray-800" : "bg-white"
                }`}
              >
                <h2 className="text-xl font-semibold mb-4">Export Data</h2>
                <p className="text-sm text-gray-500 mb-4">
                  Download your habit tracking data in various formats for your
                  records or to use in other applications.
                </p>
                <div className="flex space-x-4">
                  <button className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors">
                    Export as CSV
                  </button>
                  <button className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors">
                    Export as JSON
                  </button>
                  <button className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors">
                    Export as PDF
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Settings Tab */}
          {activeTab === "settings" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              <h1 className="text-2xl font-bold">Settings</h1>

              <div
                className={`rounded-lg shadow-md p-6 ${
                  darkMode ? "bg-gray-800" : "bg-white"
                }`}
              >
                <h2 className="text-xl font-semibold mb-4">Preferences</h2>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-2">Appearance</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          Theme
                        </label>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => setDarkMode(false)}
                            className={`px-3 py-1 rounded-md text-sm ${
                              !darkMode
                                ? "bg-blue-500 text-white"
                                : "bg-gray-200 text-gray-800"
                            }`}
                          >
                            Light
                          </button>
                          <button
                            onClick={() => setDarkMode(true)}
                            className={`px-3 py-1 rounded-md text-sm ${
                              darkMode
                                ? "bg-blue-500 text-white"
                                : "bg-gray-200 text-gray-800"
                            }`}
                          >
                            Dark
                          </button>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          Color Scheme
                        </label>
                        <div className="flex space-x-2">
                          <button className="w-8 h-8 rounded-full bg-blue-500"></button>
                          <button className="w-8 h-8 rounded-full bg-purple-500"></button>
                          <button className="w-8 h-8 rounded-full bg-green-500"></button>
                          <button className="w-8 h-8 rounded-full bg-red-500"></button>
                          <button className="w-8 h-8 rounded-full bg-yellow-500"></button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-2">Notifications</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Daily Reminders</span>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            className="sr-only peer"
                            defaultChecked
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Weekly Reports</span>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            className="sr-only peer"
                            defaultChecked
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Achievement Alerts</span>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            className="sr-only peer"
                            defaultChecked
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-2">Time & Date</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          Time Format
                        </label>
                        <div className="flex space-x-2">
                          <button className="px-3 py-1 rounded-md text-sm bg-blue-500 text-white">
                            12-hour
                          </button>
                          <button className="px-3 py-1 rounded-md text-sm bg-gray-200 text-gray-800">
                            24-hour
                          </button>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          First Day of Week
                        </label>
                        <select
                          className={`mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md ${
                            darkMode ? "bg-gray-700" : "bg-white"
                          }`}
                        >
                          <option>Sunday</option>
                          <option>Monday</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div
                className={`rounded-lg shadow-md p-6 ${
                  darkMode ? "bg-gray-800" : "bg-white"
                }`}
              >
                <h2 className="text-xl font-semibold mb-4">Account</h2>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-2">
                      Profile Information
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          Name
                        </label>
                        <input
                          type="text"
                          className={`mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                            darkMode ? "bg-gray-700" : "bg-white"
                          }`}
                          defaultValue={user?.name}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          Email
                        </label>
                        <input
                          type="email"
                          className={`mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                            darkMode ? "bg-gray-700" : "bg-white"
                          }`}
                          defaultValue="alex.johnson@example.com"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-2">Password</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          Current Password
                        </label>
                        <input
                          type="password"
                          className={`mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                            darkMode ? "bg-gray-700" : "bg-white"
                          }`}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          New Password
                        </label>
                        <input
                          type="password"
                          className={`mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                            darkMode ? "bg-gray-700" : "bg-white"
                          }`}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          Confirm New Password
                        </label>
                        <input
                          type="password"
                          className={`mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                            darkMode ? "bg-gray-700" : "bg-white"
                          }`}
                        />
                      </div>
                      <button className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors">
                        Change Password
                      </button>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-2">Data & Privacy</h3>
                    <div className="space-y-4">
                      <button className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors">
                        Export All Data
                      </button>
                      <button className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors">
                        Delete Account
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </main>

      {/* Add Habit Modal */}
      <AnimatePresence>
        {showAddHabit && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 overflow-y-auto"
          >
            <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
              <div
                className="fixed inset-0 transition-opacity"
                aria-hidden="true"
              >
                <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
              </div>
              <span
                className="hidden sm:inline-block sm:align-middle sm:h-screen"
                aria-hidden="true"
              >
                &#8203;
              </span>
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className={`inline-block align-bottom rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full ${
                  darkMode ? "bg-gray-800" : "bg-white"
                }`}
              >
                <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <h3 className="text-lg font-medium leading-6">
                    Add New Habit
                  </h3>
                  <div className="mt-4 space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Habit Name
                      </label>
                      <input
                        type="text"
                        className={`mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                          darkMode ? "bg-gray-700" : "bg-white"
                        }`}
                        placeholder="e.g., Morning Run"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Icon
                      </label>
                      <div className="grid grid-cols-8 gap-2">
                        {["🏃‍♂️", "🧘‍♀️", "📚", "💧", "🍎", "💪", "🧠", "✏️"].map(
                          (icon) => (
                            <button
                              key={icon}
                              className={`w-10 h-10 flex items-center justify-center text-xl rounded-md ${
                                darkMode
                                  ? "hover:bg-gray-700"
                                  : "hover:bg-gray-100"
                              }`}
                            >
                              {icon}
                            </button>
                          )
                        )}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          Target
                        </label>
                        <input
                          type="number"
                          className={`mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                            darkMode ? "bg-gray-700" : "bg-white"
                          }`}
                          placeholder="30"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          Unit
                        </label>
                        <input
                          type="text"
                          className={`mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                            darkMode ? "bg-gray-700" : "bg-white"
                          }`}
                          placeholder="minutes"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Frequency
                      </label>
                      <div className="flex space-x-2">
                        <button className="px-3 py-1 rounded-md text-sm bg-blue-500 text-white">
                          Daily
                        </button>
                        <button className="px-3 py-1 rounded-md text-sm bg-gray-200 text-gray-800">
                          Weekly
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Color
                      </label>
                      <div className="flex space-x-2">
                        <button className="w-8 h-8 rounded-full bg-blue-500"></button>
                        <button className="w-8 h-8 rounded-full bg-green-500"></button>
                        <button className="w-8 h-8 rounded-full bg-yellow-500"></button>
                        <button className="w-8 h-8 rounded-full bg-red-500"></button>
                        <button className="w-8 h-8 rounded-full bg-purple-500"></button>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="button"
                    onClick={() => {
                      addNewHabit({
                        name: "New Habit",
                        icon: "🎯",
                        target: 30,
                        unit: "minutes",
                        frequency: "daily",
                        color: "#4F46E5",
                      });
                    }}
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-500 text-base font-medium text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Add Habit
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddHabit(false)}
                    className={`mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 ${
                      darkMode
                        ? "bg-gray-700 text-gray-300"
                        : "bg-white text-gray-700"
                    } text-base font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:w-auto sm:text-sm`}
                  >
                    Cancel
                  </button>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Habit Detail Modal */}
      <AnimatePresence>
        {showHabitDetail && selectedHabit && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 overflow-y-auto"
          >
            <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
              <div
                className="fixed inset-0 transition-opacity"
                aria-hidden="true"
              >
                <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
              </div>
              <span
                className="hidden sm:inline-block sm:align-middle sm:h-screen"
                aria-hidden="true"
              >
                &#8203;
              </span>
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className={`inline-block align-bottom rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full ${
                  darkMode ? "bg-gray-800" : "bg-white"
                }`}
              >
                <div className="absolute top-0 right-0 pt-4 pr-4">
                  <button
                    type="button"
                    onClick={() => setShowHabitDetail(false)}
                    className="bg-transparent rounded-md text-gray-400 hover:text-gray-500 focus:outline-none"
                  >
                    <span className="sr-only">Close</span>
                    <svg
                      className="h-6 w-6"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
                <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="flex items-center mb-4">
                    <span className="text-3xl mr-3">{selectedHabit.icon}</span>
                    <h3 className="text-2xl font-bold">{selectedHabit.name}</h3>
                  </div>
                  <div className="mt-4 space-y-6">
                    <div>
                      <h4 className="text-lg font-medium mb-2">
                        Progress Today
                      </h4>
                      <div className="flex items-center">
                        <div className="w-full">
                          <div className="flex justify-between mb-1">
                            <span className="text-sm font-medium">
                              {selectedHabit.progress}/{selectedHabit.target}{" "}
                              {selectedHabit.unit}
                            </span>
                            <span className="text-sm font-medium">
                              {Math.min(
                                100,
                                (selectedHabit.progress /
                                  selectedHabit.target) *
                                  100
                              ).toFixed(0)}
                              %
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div
                              className="h-2.5 rounded-full"
                              style={{
                                width: `${Math.min(
                                  100,
                                  (selectedHabit.progress /
                                    selectedHabit.target) *
                                    100
                                )}%`,
                                backgroundColor: selectedHabit.color,
                              }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-lg font-medium mb-2">
                        Weekly History
                      </h4>
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart
                            data={selectedHabit.history}
                            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" tickFormatter={getShortDay} />
                            <YAxis domain={[0, selectedHabit.target * 1.5]} />
                            <Tooltip
                              formatter={(value, name) => [
                                `${value} ${selectedHabit.unit}`,
                                selectedHabit.name,
                              ]}
                              labelFormatter={(label) => formatDate(label)}
                            />
                            <Bar dataKey="value" fill={selectedHabit.color} />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-lg font-medium mb-2">Stats</h4>
                      <div className="grid grid-cols-3 gap-4">
                        <div
                          className={`p-4 rounded-lg ${
                            darkMode ? "bg-gray-700" : "bg-gray-100"
                          }`}
                        >
                          <p className="text-sm text-gray-500">
                            Current Streak
                          </p>
                          <p className="text-xl font-bold">
                            {selectedHabit.streak} days
                          </p>
                        </div>
                        <div
                          className={`p-4 rounded-lg ${
                            darkMode ? "bg-gray-700" : "bg-gray-100"
                          }`}
                        >
                          <p className="text-sm text-gray-500">
                            Completion Rate
                          </p>
                          <p className="text-xl font-bold">
                            {Math.round(
                              (selectedHabit.history.filter(
                                (day) => day.value >= selectedHabit.target
                              ).length /
                                selectedHabit.history.length) *
                                100
                            )}
                            %
                          </p>
                        </div>
                        <div
                          className={`p-4 rounded-lg ${
                            darkMode ? "bg-gray-700" : "bg-gray-100"
                          }`}
                        >
                          <p className="text-sm text-gray-500">Average</p>
                          <p className="text-xl font-bold">
                            {(
                              selectedHabit.history.reduce(
                                (acc, day) => acc + day.value,
                                0
                              ) / selectedHabit.history.length
                            ).toFixed(1)}{" "}
                            {selectedHabit.unit}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="button"
                    onClick={() => {
                      updateHabitProgress(
                        selectedHabit.id,
                        selectedHabit.target
                      );
                      setShowHabitDetail(false);
                    }}
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-500 text-base font-medium text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Mark Complete
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowHabitDetail(false)}
                    className={`mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 ${
                      darkMode
                        ? "bg-gray-700 text-gray-300"
                        : "bg-white text-gray-700"
                    } text-base font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:w-auto sm:text-sm`}
                  >
                    Close
                  </button>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer
        className={`py-6 ${
          darkMode ? "bg-gray-800" : "bg-white"
        } border-t mt-12`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center">
              <span className="text-xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
                Go Healthy
              </span>
              <span className="ml-2 text-sm text-gray-500">
                © {new Date().getFullYear()}
              </span>
            </div>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-sm text-gray-500 hover:text-gray-700">
                Privacy Policy
              </a>
              <a href="#" className="text-sm text-gray-500 hover:text-gray-700">
                Terms of Service
              </a>
              <a href="#" className="text-sm text-gray-500 hover:text-gray-700">
                Contact Us
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
