"use client"

import { useState, useEffect } from "react"
import { motion } from "motion/react"
import { Gift, Cake } from "lucide-react"

export default function Countdown({ birthdayDate, onComplete }) {
    const [timeLeft, setTimeLeft] = useState({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
    })
    const [isCountdownActive, setIsCountdownActive] = useState(true)

    useEffect(() => {
        const updateCountdown = () => {
            const now = new Date().getTime()
            const distance = birthdayDate.getTime() - now

            if (distance <= 0) {
                setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 })
                setIsCountdownActive(false)
                if (onComplete) {
                    onComplete()
                }
                return
            }

            const days = Math.floor(distance / (1000 * 60 * 60 * 24))
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
            const seconds = Math.floor((distance % (1000 * 60)) / 1000)

            setTimeLeft({ days, hours, minutes, seconds })
        }

        // Update immediately
        updateCountdown()

        // Set up interval only if countdown is still active
        if (isCountdownActive) {
            const timer = setInterval(updateCountdown, 1000)
            return () => clearInterval(timer)
        }
    }, [birthdayDate, onComplete, isCountdownActive])

    const timeUnits = [
        { label: "Days", value: timeLeft.days, color: "from-pink-500 to-rose-500" },
        { label: "Hours", value: timeLeft.hours, color: "from-purple-500 to-pink-500" },
        { label: "Minutes", value: timeLeft.minutes, color: "from-indigo-500 to-purple-500" },
        { label: "Seconds", value: timeLeft.seconds, color: "from-blue-500 to-indigo-500" },
    ]

    // Calculate total time for progress indication
    const totalTime = timeLeft.days * 24 * 60 * 60 + 
                     timeLeft.hours * 60 * 60 + 
                     timeLeft.minutes * 60 + 
                     timeLeft.seconds

    return (
        <motion.div
            className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.8 }}
        >
            <motion.div
                className="text-center mb-12"
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
            >
                <motion.div
                    className="mb-6"
                    animate={{
                        rotate: [0, 5, -5, 0],
                        scale: [1, 1.05, 1],
                    }}
                    transition={{ duration: 4, repeat: Infinity }}
                >
                    <Cake className="w-16 h-16 text-pink-400 mx-auto" />
                </motion.div>

                <motion.h1
                    className="text-4xl md:text-6xl py-1 md:py-2 font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 mb-4"
                    style={{
                        filter: "drop-shadow(0 0 25px rgba(236, 72, 153, 0.3))",
                    }}
                >
                    Birthday Countdown
                </motion.h1>
                <p className="text-lg text-purple-300">The magical moment approaches...</p>
                
                {/* Debug info - remove in production */}
                <div className="text-sm text-purple-400 mt-2 opacity-70">
                    Target: {birthdayDate.toLocaleString()}
                </div>
                <div className="text-sm text-purple-400 opacity-70">
                    Current: {new Date().toLocaleString()}
                </div>
            </motion.div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 max-w-4xl w-full">
                {timeUnits.map((unit, index) => {
                    return (
                        <motion.div
                            key={unit.label}
                            className="text-center"
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{
                                delay: 0.5 + index * 0.1,
                                type: "spring",
                                stiffness: 200,
                            }}
                        >
                            <motion.div
                                className={`relative bg-gradient-to-br ${unit.color} rounded-2xl p-6 md:p-8 shadow-xl border border-white/10`}
                                style={{
                                    boxShadow: "0 8px 32px rgba(0,0,0,0.3), 0 0 20px rgba(236, 72, 153, 0.2)",
                                }}
                                // Add a subtle pulse when time changes
                                animate={{ 
                                    scale: unit.value !== timeLeft[unit.label.toLowerCase()] ? [1, 1.05, 1] : 1 
                                }}
                                transition={{ duration: 0.3 }}
                            >
                                <motion.div
                                    className="text-3xl md:text-5xl font-bold text-white mb-2 mt-2"
                                    key={`${unit.label}-${unit.value}`}
                                    initial={{ scale: 1.2, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    {unit.value.toString().padStart(2, "0")}
                                </motion.div>
                                <div className="text-white/90 text-sm md:text-base font-medium uppercase tracking-wider">
                                    {unit.label}
                                </div>
                            </motion.div>
                        </motion.div>
                    )
                })}
            </div>

            <motion.div
                className="mt-12 text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5 }}
            >
                <Gift className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                <p className="text-purple-300 text-base">
                    {totalTime > 86400 ? "The surprise is just days away💖" : 
                     totalTime > 3600 ? "The surprise is just hours away💖" :
                     totalTime > 60 ? "The surprise is just minutes away💖" :
                     "The surprise is just seconds away💖"}
                </p>
                
                {/* Add a test button for development - remove in production */}
                {process.env.NODE_ENV === 'development' && (
                    <button 
                        onClick={() => onComplete()} 
                        className="mt-4 px-4 py-2 bg-red-500 text-white rounded text-sm"
                    >
                        Test Complete (Dev Only)
                    </button>
                )}
            </motion.div>
        </motion.div>
    )
}