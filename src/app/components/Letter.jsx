"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Mail, Heart, Sparkles, RotateCcw } from "lucide-react"
import confetti from "canvas-confetti"

const SlidingImage = ({ src, isLeft, index, delay, side }) => {
    const [shouldAnimate, setShouldAnimate] = useState(false)
    
    useEffect(() => {
        const timer = setTimeout(() => {
            setShouldAnimate(true)
        }, delay)
        
        return () => clearTimeout(timer)
    }, [delay])
    
    if (!shouldAnimate) return null
    
    return (
        <motion.div
            className="fixed pointer-events-none z-10"
            style={{
                left: isLeft ? '3%' : '87%',
                top: 0,
            }}
            initial={{ 
                y: -200,
                opacity: 0,
                scale: 0.9,
                rotate: isLeft ? -3 : 3
            }}
            animate={{ 
                y: window.innerHeight + 100,
                opacity: [0, 1, 1, 0.8, 0],
                scale: [0.9, 1, 1, 0.95, 0.9],
                rotate: isLeft ? [3, 0, 0, -2] : [-3, 0, 0, 2]
            }}
            transition={{ 
                duration: 8, 
                ease: "linear",
                type: "tween"
            }}
        >
            <div className="photo-container-natural">
                <img 
                    src={src} 
                    alt={`Memory ${index + 1}`}
                    onError={() => console.log(`Failed to load: ${src}`)}
                />
                <div className="photo-number-natural">
                    {index + 1}
                </div>
                <div className="photo-side-indicator">
                    {side}
                </div>
            </div>
        </motion.div>
    )
}

export default function Letter() {
    const [isOpen, setIsOpen] = useState(false)
    const [showText, setShowText] = useState(false)
    const [currentText, setCurrentText] = useState("")
    const [showCursor, setShowCursor] = useState(true)
    const [photoSequenceStarted, setPhotoSequenceStarted] = useState(false)
    const [leftPhotoCount, setLeftPhotoCount] = useState(0)
    const [rightPhotoCount, setRightPhotoCount] = useState(0)
    const typingIntervalRef = useRef(null);
    const photoIntervalRef = useRef(null);

    const generatePhotoData = () => {
        const leftSidePhotos = []
        const rightSidePhotos = []
        
        for (let cycle = 0; cycle < 5; cycle++) { 
            for (let i = 1; i <= 18; i++) {
                leftSidePhotos.push({
                    id: `left-${i}-cycle-${cycle}`,
                    src: `/images/l${i}.jpg`,
                    isLeft: true,
                    index: (cycle * 18) + (i - 1),
                    delay: ((cycle * 18) + (i - 1)) * 4000,
                    displayNumber: i,
                    side: 'L',
                })
            }
        }
        
        for (let cycle = 0; cycle < 5; cycle++) {
            for (let i = 0; i < 18; i++) {
                const photoNumber = 36 - i
                rightSidePhotos.push({
                    id: `right-${photoNumber}-cycle-${cycle}`,
                    src: `/images/l${photoNumber}.jpg`,
                    isLeft: false,
                    index: (cycle * 18) + 18 + i,
                    delay: ((cycle * 18) + i) * 4000,
                    displayNumber: photoNumber,
                    side: 'R',
                })
            }
        }
        
        return [...leftSidePhotos, ...rightSidePhotos]
    }

    const letterPhotos = generatePhotoData()

    const letterText = `My Dear RUBA,

On this special day, I find myself searching for words that can truly capture the depth of my admiration for you. Your birthday is not just a celebration of another year, but a celebration of the incredible person you are, and the beautiful soul that brightens my world.

You possess a rare and captivating grace, an ability to light up any room with your presence, and a kindness that touches everyone you meet. Your heart is a treasure, and your spirit is an inspiration. It's not just your beauty that I admire, but the incredible strength and passion that shine from within.

Thank you for being the wonderful, amazing, and absolutely fantastic person that you are. The world is so much brighter and more beautiful because you're in it. To love you is a privilege, and to be loved by you is my greatest treasure.

Happy Birthday, my beautiful love! ❤

With all my heart and endless care for you,
Forever Yours,
SAKTHIPRAKASH`

    const startPhotoSequence = () => {
        setPhotoSequenceStarted(true)
        
        let leftCount = 0
        let rightCount = 0
        
        if (photoIntervalRef.current) clearInterval(photoIntervalRef.current);

        photoIntervalRef.current = setInterval(() => {
            leftCount++
            rightCount++
            setLeftPhotoCount(leftCount)
            setRightPhotoCount(rightCount)
        }, 4000)
    }
    
    const startTyping = () => {
        let index = 0
        
        if (typingIntervalRef.current) clearInterval(typingIntervalRef.current);

        typingIntervalRef.current = setInterval(() => {
            if (index < letterText.length) {
                setCurrentText(letterText.slice(0, index + 1))
                index++
            } else {
                clearInterval(typingIntervalRef.current)
                setShowCursor(false)
                confetti({
                    particleCount: 50,
                    spread: 70,
                    origin: { y: 0.6 },
                    colors: ["#ff69b4", "#ff1493", "#9370db", "#8a2be2", "#ffd700"],
                })
            }
        }, 45) 
    }

    const handleOpenLetter = () => {
        setIsOpen(true)
        startPhotoSequence();
        setTimeout(() => {
            setShowText(true)
        }, 8000)
    }

    useEffect(() => {
        if (showText) {
            startTyping();
        }
        return () => {
            if (typingIntervalRef.current) clearInterval(typingIntervalRef.current);
            if (photoIntervalRef.current) clearInterval(photoIntervalRef.current);
        }
    }, [showText])

    const handleReset = () => {
        if (typingIntervalRef.current) clearInterval(typingIntervalRef.current);
        if (photoIntervalRef.current) clearInterval(photoIntervalRef.current);
        setIsOpen(false)
        setShowText(false)
        setCurrentText("")
        setShowCursor(true)
        setPhotoSequenceStarted(false)
        setLeftPhotoCount(0)
        setRightPhotoCount(0)
    }

    return (
        <motion.div
            className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
        >
            {photoSequenceStarted && letterPhotos.map((photo) => (
                <SlidingImage
                    key={photo.id}
                    src={photo.src}
                    isLeft={photo.isLeft}
                    index={photo.displayNumber - 1}
                    delay={photo.delay}
                    side={photo.side}
                />
            ))}

            <div className="max-w-4xl w-full relative z-20">
                <motion.div
                    className="text-center mb-8"
                    initial={{ y: -50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                >
                    <h1 className="text-4xl md:text-6xl py-1 md:py-2 font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 mb-4">
                        A Special Letter
                    </h1>
                    <p className="text-lg text-purple-300">Just for you, on your special day ❤️</p>
                </motion.div>

                <motion.div
                    className="relative w-full h-full flex justify-center"
                    initial={{ scale: 0, rotate: -10 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{
                        delay: 0.5,
                        type: "spring",
                        stiffness: 200,
                    }}
                >
                    <AnimatePresence mode="wait">
                        {!isOpen ? (
                            <motion.div
                                key="envelope"
                                className="relative cursor-pointer"
                                whileHover={{ scale: 1.05, rotate: 2 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={handleOpenLetter}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ rotateX: -90, opacity: 0 }}
                                transition={{ duration: 0.5 }}
                            >
                                <div className="w-80 h-52 bg-gradient-to-br from-pink-200 to-purple-200 rounded-2xl shadow-2xl border-2 border-pink-300 relative overflow-hidden">
                                    <div className="absolute top-0 left-0 w-full h-26 bg-gradient-to-br from-pink-300 to-purple-300 transform origin-top"></div>
                                    <div className="absolute bottom-0 left-0 w-full h-40 bg-gradient-to-br from-pink-100 to-purple-100"></div>
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <Mail className="w-16 h-16 text-pink-500" />
                                    </div>
                                    <div className="absolute top-4 right-4">
                                        <Heart className="w-6 h-6 text-red-500 fill-current" />
                                    </div>
                                    <div className="absolute bottom-4 left-4">
                                        <Sparkles className="w-6 h-6 text-yellow-500" />
                                    </div>
                                    <motion.div
                                        className="absolute bottom-3 left-1/2 transform -translate-x-1/2 text-pink-700 text-base font-semibold"
                                        animate={{ opacity: [0.5, 1, 0.5] }}
                                        transition={{ duration: 1.5, repeat: Infinity }}
                                    >
                                        Click to open
                                    </motion.div>
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="letter"
                                className="w-full max-w-2xl rounded-2xl shadow-2xl border-2 border-pink-300 p-8 relative"
                                initial={{ rotateX: -90, opacity: 0 }}
                                animate={{ rotateX: 0, opacity: 1 }}
                                exit={{ opacity: 0, scale: 0.2 }}
                                transition={{ duration: 0.8, type: "spring" }}
                                style={{
                                    background: "linear-gradient(135deg, rgba(252, 231, 243, 0.98) 0%, rgba(250, 232, 255, 0.98) 25%, rgba(224, 231, 255, 0.98) 50%, rgba(253, 242, 248, 0.98) 75%, rgba(252, 231, 243, 0.98) 100%)",
                                    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.4), 0 0 30px rgba(236, 72, 153, 0.4)",
                                }}
                            >
                                <div className="text-center mb-6">
                                    <motion.div
                                        className="inline-block"
                                        animate={{ 
                                            rotate: [0, 5, -5, 0],
                                            scale: [1, 1.05, 1],
                                        }}
                                        transition={{ duration: 3, repeat: Infinity }}
                                    >
                                        <Heart className="w-12 h-12 text-red-500 fill-current mx-auto mb-3" />
                                    </motion.div>
                                </div>

                                <div className="min-h-72 max-h-72 overflow-y-auto text-gray-700 leading-relaxed letter-scroll">
                                    {showText && (
                                        <motion.div 
                                            initial={{ opacity: 0 }} 
                                            animate={{ opacity: 1 }} 
                                            className="mb-3 mr-2"
                                        >
                                            <div className="whitespace-pre-wrap font-cute text-base leading-relaxed">
                                                {currentText}
                                                {showCursor && (
                                                    <motion.span
                                                        className="inline-block w-0.5 h-5 bg-purple-600 ml-1"
                                                        animate={{ opacity: [0, 1, 0] }}
                                                        transition={{ duration: 0.8, repeat: Infinity }}
                                                    />
                                                )}
                                            </div>
                                        </motion.div>
                                    )}
                                </div>

                                {currentText === letterText && (
                                    <motion.div
                                        className="text-center mt-6"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 1 }}
                                    >
                                        <button
                                            onClick={handleReset}
                                            className="inline-flex items-center gap-2 bg-white/90 hover:bg-white text-pink-600 font-medium border-2 border-pink-400 px-6 py-3 rounded-full hover:shadow-lg transition-all duration-300 transform hover:scale-105"
                                        >
                                            <RotateCcw className="w-4 h-4" />
                                            Read Again
                                        </button>
                                    </motion.div>
                                )}

                                {photoSequenceStarted && (
                                    <div className="absolute -top-3 -right-3 flex gap-2">
                                        <motion.div
                                            className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-xs px-3 py-1 rounded-full font-medium shadow-lg"
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            transition={{ delay: 0.3 }}
                                        >
                                            L: {leftPhotoCount}
                                        </motion.div>
                                        <motion.div
                                            className="bg-gradient-to-r from-pink-500 to-purple-500 text-white text-xs px-3 py-1 rounded-full font-medium shadow-lg"
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            transition={{ delay: 0.5 }}
                                        >
                                            R: {rightPhotoCount}
                                        </motion.div>
                                    </div>
                                )}

                                <div className="absolute top-4 left-4">
                                    <Sparkles className="w-6 h-6 text-yellow-500" />
                                </div>
                                <div className="absolute top-4 right-4">
                                    <Heart className="w-6 h-6 text-rose-500 fill-current" />
                                </div>
                                <div className="absolute bottom-4 left-4">
                                    <Heart className="w-6 h-6 text-pink-500 fill-current" />
                                </div>
                                <div className="absolute bottom-4 right-4">
                                    <Sparkles className="w-6 h-6 text-purple-500" />
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            </div>
        </motion.div>
    )
}

