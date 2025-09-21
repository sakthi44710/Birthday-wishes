"use client"

import { useState, useEffect } from "react"
import { AnimatePresence } from "motion/react"
import Loader from "./components/Loader"
import Countdown from "./components/Countdown"
import Celebration from "./components/Celebration"
import HappyBirthday from "./components/HappyBirthday"
import PhotoGallery from "./components/PhotoGallery"
import Letter from "./components/Letter"

export default function BirthdayApp() {
  const [currentScreen, setCurrentScreen] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  
  // Set birthday date to September 25, 2025 at 12:00 AM
  const birthdayDate = new Date("2025-09-25T00:00:00")
  
  // Check if birthday has already passed
  const [isBirthdayOver, setIsBirthdayOver] = useState(() => {
    return new Date().getTime() >= birthdayDate.getTime()
  })

  // Handle countdown completion
  const handleCountdownComplete = () => {
    setIsBirthdayOver(true)
    // Optional: Add a small delay before showing celebration
    setTimeout(() => {
      setCurrentScreen(1) // Move to celebration screen
    }, 1000)
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 4000)
    return () => clearTimeout(timer)
  }, [])

  // Update current screen based on birthday status
  useEffect(() => {
    if (isBirthdayOver && currentScreen === 0) {
      setCurrentScreen(1) // Skip countdown and go to celebration
    }
  }, [isBirthdayOver, currentScreen])

  const screens = [
    // Screen 0: Countdown or Celebration (depending on time)
    !isBirthdayOver ? (
      <Countdown 
        key="countdown" 
        onComplete={handleCountdownComplete} 
        birthdayDate={birthdayDate} 
      />
    ) : (
      <Celebration 
        key="celebration" 
        onNext={() => setCurrentScreen(1)} 
      />
    ),
    // Screen 1: Happy Birthday
    <HappyBirthday key="happy" onNext={() => setCurrentScreen(2)} />,
    // Screen 2: Photo Gallery
    <PhotoGallery key="gallery" onNext={() => setCurrentScreen(3)} />,
    // Screen 3: Personal Letter
    <Letter key="letter" />,
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-950/30 via-black to-purple-950/30 overflow-hidden relative">
      {/* Radial gradients for background */}
      <div className="fixed inset-0 z-0 blur-[120px] opacity-20" style={{
        backgroundImage: "radial-gradient(circle at 20% 25%, rgba(255, 99, 165, 0.6), transparent 40%)",
      }} />

      <div className="fixed inset-0 z-0 blur-[120px] opacity-20" style={{
        backgroundImage: "radial-gradient(circle at 80% 80%, rgba(99, 102, 241, 0.6), transparent 40%)",
      }} />

      <div className="fixed inset-0 z-0 blur-[160px] opacity-10" style={{
        backgroundImage: "radial-gradient(circle at 50% 50%, rgba(228, 193, 255, 0.4), transparent 40%)",
      }} />

      <AnimatePresence mode="wait">
        {isLoading ? (
          <Loader key="loader" />
        ) : (
          <>
            <AnimatePresence mode="wait">
              {screens[currentScreen]}
            </AnimatePresence>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}