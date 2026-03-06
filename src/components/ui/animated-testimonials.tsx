import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Quote, Star } from "lucide-react"
import { motion, useAnimation, useInView } from "framer-motion"
import { useEffect, useRef, useState } from "react"

export interface Testimonial {
  id: number
  name: string
  role: string
  company: string
  content: string
  rating: number
  avatar: string
}

export interface AnimatedTestimonialsProps {
  title?: string
  subtitle?: string
  badgeText?: string
  testimonials?: Testimonial[]
  autoRotateInterval?: number
  trustedCompanies?: string[]
  trustedCompaniesTitle?: string
  className?: string
}

export function AnimatedTestimonials({
  title = "Loved by the community",
  subtitle = "Don't just take our word for it.",
  badgeText = "Trusted by developers",
  testimonials = [],
  autoRotateInterval = 6000,
  trustedCompanies = [],
  trustedCompaniesTitle = "Trusted by developers from companies worldwide",
  className,
}: AnimatedTestimonialsProps) {
  const [activeIndex, setActiveIndex] = useState(0)

  const sectionRef = useRef(null)
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 })
  const controls = useAnimation()

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" as const },
    },
  }

  useEffect(() => {
    if (isInView) controls.start("visible")
  }, [isInView, controls])

  useEffect(() => {
    if (autoRotateInterval <= 0 || testimonials.length <= 1) return
    const interval = setInterval(() => {
      setActiveIndex((c) => (c + 1) % testimonials.length)
    }, autoRotateInterval)
    return () => clearInterval(interval)
  }, [autoRotateInterval, testimonials.length])

  if (testimonials.length === 0) return null

  return (
    <div ref={sectionRef} className={className}>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate={controls}
        className="max-w-7xl mx-auto"
      >
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* Left side */}
          <motion.div variants={itemVariants} className="space-y-6">
            <div className="space-y-4">
              {badgeText && (
                <div className="inline-flex items-center gap-2 rounded-full border border-navy-foreground/20 bg-navy-foreground/5 px-4 py-1.5">
                  <Star className="h-4 w-4 text-primary fill-primary" />
                  <span className="text-sm font-medium text-navy-foreground/80">{badgeText}</span>
                </div>
              )}
              <h2 className="text-3xl md:text-5xl font-display font-bold text-navy-foreground">
                {title}
              </h2>
              <p className="text-lg text-navy-foreground/60 leading-relaxed">{subtitle}</p>

              {/* Dot navigation */}
              <div className="flex gap-2 pt-4">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveIndex(index)}
                    className={`h-2.5 rounded-full transition-all duration-300 ${
                      activeIndex === index ? "w-10 bg-primary" : "w-2.5 bg-navy-foreground/30"
                    }`}
                    aria-label={`View testimonial ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </motion.div>

          {/* Right side: cards */}
          <motion.div variants={itemVariants} className="relative min-h-[280px] sm:min-h-[300px]">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.id}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{
                  opacity: activeIndex === index ? 1 : 0,
                  y: activeIndex === index ? 0 : 20,
                  scale: activeIndex === index ? 1 : 0.95,
                  zIndex: activeIndex === index ? 10 : 0,
                }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="absolute inset-0"
                style={{ pointerEvents: activeIndex === index ? "auto" : "none" }}
              >
                <div className="h-full rounded-2xl border border-navy-foreground/10 bg-navy-foreground/5 backdrop-blur-sm p-8 flex flex-col justify-between">
                  {/* Stars */}
                  <div>
                    <div className="flex gap-1 mb-4">
                      {Array(testimonial.rating)
                        .fill(0)
                        .map((_, i) => (
                          <Star key={i} className="h-5 w-5 text-primary fill-primary" />
                        ))}
                    </div>

                    <div className="flex gap-3">
                      <Quote className="h-8 w-8 text-primary/40 flex-shrink-0 mt-1" />
                      <p className="text-navy-foreground/80 text-base md:text-lg leading-relaxed italic">
                        "{testimonial.content}"
                      </p>
                    </div>
                  </div>

                  <div>
                    <Separator className="my-6 bg-navy-foreground/10" />
                    <div className="flex items-center gap-4">
                      <Avatar className="h-12 w-12 border-2 border-primary/20">
                        <AvatarImage src={testimonial.avatar} alt={`Portrait of ${testimonial.name}`} />
                        <AvatarFallback className="bg-primary/20 text-primary font-bold">
                          {testimonial.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-display font-semibold text-navy-foreground">{testimonial.name}</p>
                        <p className="text-sm text-navy-foreground/50">
                          {testimonial.role}, {testimonial.company}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}

            {/* Decorative blurs */}
            <div className="absolute -bottom-4 -right-4 h-32 w-32 rounded-full bg-primary/10 blur-2xl" />
            <div className="absolute -top-4 -left-4 h-24 w-24 rounded-full bg-sand/10 blur-2xl" />
          </motion.div>
        </div>

        {/* Trusted companies */}
        {trustedCompanies.length > 0 && (
          <motion.div variants={itemVariants} className="mt-16 text-center">
            <p className="text-sm text-navy-foreground/40 mb-6">{trustedCompaniesTitle}</p>
            <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
              {trustedCompanies.map((company) => (
                <span
                  key={company}
                  className="text-lg font-display font-semibold text-navy-foreground/25 hover:text-navy-foreground/50 transition-colors"
                >
                  {company}
                </span>
              ))}
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}
