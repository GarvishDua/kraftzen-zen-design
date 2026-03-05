import React, { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

interface Feature {
  step: string
  title?: string
  content: string
  image: string
}

interface FeatureStepsProps {
  features: Feature[]
  className?: string
  title?: string
  autoPlayInterval?: number
  imageHeight?: string
}

export function FeatureSteps({
  features,
  className,
  title = "How to get Started",
  autoPlayInterval = 3000,
  imageHeight = "h-[400px]",
}: FeatureStepsProps) {
  const [currentFeature, setCurrentFeature] = useState(0)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      if (progress < 100) {
        setProgress((prev) => prev + 100 / (autoPlayInterval / 100))
      } else {
        setCurrentFeature((prev) => (prev + 1) % features.length)
        setProgress(0)
      }
    }, 100)

    return () => clearInterval(timer)
  }, [progress, features.length, autoPlayInterval])

  return (
    <div className={cn("p-8 md:p-12", className)}>
      <div className="max-w-7xl mx-auto w-full">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-foreground mb-10 text-center">
          {title}
        </h2>

        <div className="flex flex-col md:grid md:grid-cols-2 gap-6 md:gap-10">
          {/* Steps list */}
          <div className="order-2 md:order-1 space-y-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className={cn(
                  "flex items-start gap-4 md:gap-6 cursor-pointer p-4 rounded-xl transition-colors",
                  index === currentFeature ? "bg-primary/5" : "hover:bg-muted/50"
                )}
                onClick={() => {
                  setCurrentFeature(index)
                  setProgress(0)
                }}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                {/* Step indicator */}
                <div
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center border-2 text-sm font-bold flex-shrink-0 mt-1 transition-colors",
                    index <= currentFeature
                      ? "bg-primary border-primary text-primary-foreground"
                      : "border-muted-foreground/30 text-muted-foreground"
                  )}
                >
                  {index <= currentFeature ? (
                    <span>✓</span>
                  ) : (
                    <span>{index + 1}</span>
                  )}
                </div>

                {/* Text */}
                <div className="flex-1">
                  <h3
                    className={cn(
                      "text-lg md:text-xl font-display font-semibold transition-colors",
                      index === currentFeature ? "text-primary" : "text-foreground"
                    )}
                  >
                    {feature.title || feature.step}
                  </h3>
                  <p
                    className={cn(
                      "text-sm md:text-base mt-1 transition-colors",
                      index === currentFeature
                        ? "text-muted-foreground"
                        : "text-muted-foreground/60"
                    )}
                  >
                    {feature.content}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Image area */}
          <div
            className={cn(
              "order-1 md:order-2 relative overflow-hidden rounded-2xl",
              imageHeight
            )}
          >
            <AnimatePresence mode="wait">
              {features.map(
                (feature, index) =>
                  index === currentFeature && (
                    <motion.div
                      key={index}
                      className="absolute inset-0"
                      initial={{ opacity: 0, scale: 0.96 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 1.04 }}
                      transition={{ duration: 0.5, ease: "easeInOut" }}
                    >
                      <img
                        src={feature.image}
                        alt={feature.title || feature.step}
                        className="w-full h-full object-cover rounded-2xl"
                      />
                      <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-foreground/20 to-transparent" />
                    </motion.div>
                  )
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  )
}
