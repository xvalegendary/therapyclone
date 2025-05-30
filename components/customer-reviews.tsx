"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/context/language-context"
import { translations } from "@/lib/translations"

interface Review {
  id: number
  name: string
  rating: number
  comment: string
  product: string
  avatar: string
  date: string
}

export function CustomerReviews() {
  const [currentReview, setCurrentReview] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const { language } = useLanguage()
  const t = translations[language]

  const reviews: Review[] = [
    {
      id: 1,
      name: "Alex Johnson",
      rating: 5,
      comment:
        "Absolutely love this hoodie! The quality is outstanding and it's so comfortable. Perfect fit and the material feels premium.",
      product: "SDFM Classic Black",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      date: "2024-01-15",
    },
    {
      id: 2,
      name: "Sarah Chen",
      rating: 5,
      comment:
        "Best hoodie I've ever owned! The design is sleek and it keeps me warm during cold days. Highly recommend to everyone.",
      product: "SDFM Premium Gray",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
      date: "2024-01-12",
    },
    {
      id: 3,
      name: "Mike Rodriguez",
      rating: 4,
      comment:
        "Great quality and fast shipping. The hoodie exceeded my expectations. Will definitely order more colors!",
      product: "SDFM Signature Navy",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      date: "2024-01-10",
    },
    {
      id: 4,
      name: "Emma Wilson",
      rating: 5,
      comment:
        "Perfect oversized fit! The material is so soft and the color is exactly as shown. Customer service was also excellent.",
      product: "SDFM Oversized Fit",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
      date: "2024-01-08",
    },
    {
      id: 5,
      name: "David Kim",
      rating: 5,
      comment:
        "Amazing quality for the price! The hoodie looks exactly like in the photos and feels even better. Fast delivery too.",
      product: "SDFM Tech Fleece",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
      date: "2024-01-05",
    },
  ]

  useEffect(() => {
    if (!isAutoPlaying) return

    const interval = setInterval(() => {
      setCurrentReview((prev) => (prev + 1) % reviews.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [isAutoPlaying, reviews.length])

  const nextReview = () => {
    setCurrentReview((prev) => (prev + 1) % reviews.length)
    setIsAutoPlaying(false)
  }

  const prevReview = () => {
    setCurrentReview((prev) => (prev - 1 + reviews.length) % reviews.length)
    setIsAutoPlaying(false)
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star key={i} className={`w-5 h-5 ${i < rating ? "text-yellow-400 fill-current" : "text-gray-600"}`} />
    ))
  }

  return (
    <section className="w-full py-20 bg-gradient-to-b from-dark-900 via-dark-800 to-dark-900 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-20 w-40 h-40 bg-blue-500 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-48 h-48 bg-purple-500 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-pink-500 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl font-bold text-white mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            {t.reviews?.title || "What Our Customers Say"}
          </h2>
          <p className="text-gray-300 text-xl max-w-3xl mx-auto leading-relaxed">
            {t.reviews?.subtitle || "Don't just take our word for it - hear from our satisfied customers"}
          </p>
        </motion.div>

        <div className="max-w-6xl mx-auto relative">
          {/* Navigation buttons - moved further away */}
          <Button
            variant="outline"
            size="icon"
            className="absolute -left-20 top-1/2 transform -translate-y-1/2 bg-dark-600/90 border-gray-500 hover:bg-dark-500 text-white backdrop-blur-sm w-12 h-12 rounded-full shadow-lg z-10"
            onClick={prevReview}
          >
            <ChevronLeft className="w-6 h-6" />
          </Button>

          <Button
            variant="outline"
            size="icon"
            className="absolute -right-20 top-1/2 transform -translate-y-1/2 bg-dark-600/90 border-gray-500 hover:bg-dark-500 text-white backdrop-blur-sm w-12 h-12 rounded-full shadow-lg z-10"
            onClick={nextReview}
          >
            <ChevronRight className="w-6 h-6" />
          </Button>

          <div className="relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentReview}
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: -20 }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
                className="bg-gradient-to-br from-dark-700/80 to-dark-800/80 backdrop-blur-xl rounded-3xl p-10 border border-gray-600/30 shadow-2xl"
              >
                <div className="flex flex-col lg:flex-row items-center gap-10">
                  <div className="flex-shrink-0">
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur-md opacity-50"></div>
                      <img
                        src={reviews[currentReview].avatar || "/placeholder.svg"}
                        alt={reviews[currentReview].name}
                        className="relative w-32 h-32 rounded-full object-cover border-4 border-white/20 shadow-xl"
                      />
                      <div className="absolute -top-3 -right-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full p-3 shadow-lg">
                        <Quote className="w-5 h-5 text-white" />
                      </div>
                    </div>
                  </div>

                  <div className="flex-1 text-center lg:text-left">
                    <div className="flex justify-center lg:justify-start mb-4">
                      {renderStars(reviews[currentReview].rating)}
                    </div>

                    <blockquote className="text-gray-100 text-xl lg:text-2xl mb-6 leading-relaxed font-light italic">
                      "{reviews[currentReview].comment}"
                    </blockquote>

                    <div className="space-y-2">
                      <h4 className="text-white font-bold text-2xl">{reviews[currentReview].name}</h4>
                      <p className="text-blue-400 font-semibold text-lg">{reviews[currentReview].product}</p>
                      <p className="text-gray-400 text-sm">
                        {new Date(reviews[currentReview].date).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Dots indicator */}
          <div className="flex justify-center mt-10 space-x-3">
            {reviews.map((_, index) => (
              <button
                key={index}
                className={`w-4 h-4 rounded-full transition-all duration-300 ${
                  index === currentReview
                    ? "bg-gradient-to-r from-blue-500 to-purple-500 scale-125 shadow-lg"
                    : "bg-gray-600 hover:bg-gray-500 hover:scale-110"
                }`}
                onClick={() => {
                  setCurrentReview(index)
                  setIsAutoPlaying(false)
                }}
              />
            ))}
          </div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20"
          >
            <div className="text-center p-6 bg-dark-700/50 rounded-2xl backdrop-blur-sm border border-gray-600/30">
              <div className="text-5xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-3">
                4.9
              </div>
              <div className="text-gray-300 text-lg mb-3">Average Rating</div>
              <div className="flex justify-center">{renderStars(5)}</div>
            </div>
            <div className="text-center p-6 bg-dark-700/50 rounded-2xl backdrop-blur-sm border border-gray-600/30">
              <div className="text-5xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent mb-3">
                2,500+
              </div>
              <div className="text-gray-300 text-lg">Happy Customers</div>
            </div>
            <div className="text-center p-6 bg-dark-700/50 rounded-2xl backdrop-blur-sm border border-gray-600/30">
              <div className="text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-3">
                98%
              </div>
              <div className="text-gray-300 text-lg">Satisfaction Rate</div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
