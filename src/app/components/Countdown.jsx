"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Gift, Cake, Key, X } from "lucide-react"

export default function Countdown({ birthdayDate, onComplete }) {
    const [timeLeft, setTimeLeft] = useState({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
    })
    const [isCountdownActive, setIsCountdownActive] = useState(true)
    const [showPasswordModal, setShowPasswordModal] = useState(false)
    const [passwordInput, setPasswordInput] = useState("")
    const [passwordError, setPasswordError] = useState("")

    const correctPassword = "285976"

    useEffect(() => {
        const updateCountdown = () => {
            if (!birthdayDate) return;
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

        updateCountdown()

        if (isCountdownActive) {
            const timer = setInterval(updateCountdown, 1000)
            return () => clearInterval(timer)
        }
    }, [birthdayDate, onComplete, isCountdownActive])

    const handlePasswordSubmit = (e) => {
        e.preventDefault()
        if (passwordInput === correctPassword) {
            setPasswordError("")
            setShowPasswordModal(false)
            onComplete()
        } else {
            setPasswordError("Incorrect PIN. Please try again.")
            setPasswordInput("")
        }
    }

    const timeUnits = [
        { label: "Days", value: timeLeft.days, color: "from-pink-500 to-rose-500" },
        { label: "Hours", value: timeLeft.hours, color: "from-purple-500 to-pink-500" },
        { label: "Minutes", value: timeLeft.minutes, color: "from-indigo-500 to-purple-500" },
        { label: "Seconds", value: timeLeft.seconds, color: "from-blue-500 to-indigo-500" },
    ]

    const totalTime = timeLeft.days * 24 * 60 * 60 + timeLeft.hours * 60 * 60 + timeLeft.minutes * 60 + timeLeft.seconds

    return (
        <>
            <motion.div
                className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.8 }}
            >
                {/* ... existing countdown UI ... */}
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
                </motion.div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 max-w-4xl w-full">
                    {timeUnits.map((unit, index) => (
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
                    ))}
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
                </motion.div>

                <motion.div
                    className="mt-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.7 }}
                >
                    <button
                        onClick={() => setShowPasswordModal(true)}
                        className="flex items-center gap-2 text-sm text-purple-300 hover:text-white transition-colors"
                    >
                        <Key className="w-4 h-4" />
                        <span>Have a PIN?</span>
                    </button>
                </motion.div>
            </motion.div>

            <AnimatePresence>
                {showPasswordModal && (
                    <motion.div
                        className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <motion.div
                            className="bg-gray-800/50 backdrop-blur-md p-8 rounded-2xl shadow-2xl w-full max-w-sm relative border border-white/10"
                            initial={{ scale: 0.7, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.7, opacity: 0 }}
                        >
                            <button onClick={() => setShowPasswordModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white">
                                <X />
                            </button>
                            <h2 className="text-2xl font-bold text-white mb-4 text-center">Enter PIN</h2>
                            <form onSubmit={handlePasswordSubmit}>
                                <input
                                    type="password"
                                    value={passwordInput}
                                    onChange={(e) => setPasswordInput(e.target.value)}
                                    className="w-full bg-gray-900/50 text-white text-center text-2xl tracking-[0.5em] p-4 rounded-lg border border-white/20 focus:outline-none focus:ring-2 focus:ring-pink-500"
                                    maxLength={6}
                                    autoFocus
                                />
                                {passwordError && <p className="text-red-400 text-sm mt-3 text-center">{passwordError}</p>}
                                <button
                                    type="submit"
                                    className="w-full mt-6 bg-gradient-to-r from-pink-600 to-purple-600 text-white font-bold py-3 rounded-lg hover:from-pink-500 hover:to-purple-500 transition-all transform hover:scale-105"
                                >
                                    Unlock
                                </button>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    )
}

