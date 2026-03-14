"use client"

import { useEffect, useRef, useState } from "react"
import { Play, Pause, Sparkles } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

const transformations = [
  {
    id: 1,
    title: "Transformacion de Tinte",
    service: "Tintes",
    description: "De cabello oscuro a un hermoso balayage caramelo",
    videoId: "dQw4w9WgXcQ" // Placeholder - can be replaced with actual video
  },
  {
    id: 2,
    title: "Peinado de Novia",
    service: "Peinados",
    description: "Recogido elegante para el dia mas especial",
    videoId: "dQw4w9WgXcQ"
  },
  {
    id: 3,
    title: "Planchado Profesional",
    service: "Planchados",
    description: "De cabello rizado a liso perfecto",
    videoId: "dQw4w9WgXcQ"
  },
  {
    id: 4,
    title: "Tratamiento de Keratina",
    service: "Keratinas",
    description: "Cabello con frizz a seda brillante",
    videoId: "dQw4w9WgXcQ"
  },
]

export function BeforeAfter() {
  const [visibleCards, setVisibleCards] = useState<number[]>([])
  const [playingVideo, setPlayingVideo] = useState<number | null>(null)
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            transformations.forEach((_, index) => {
              setTimeout(() => {
                setVisibleCards((prev) => [...prev, index])
              }, index * 200)
            })
          }
        })
      },
      { threshold: 0.1 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <section ref={sectionRef} className="py-20 md:py-32">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Play className="h-4 w-4" />
            Antes y Despues
          </span>
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4 text-balance">
            Transformaciones Increibles
          </h2>
          <p className="text-lg text-muted-foreground">
            Mira los resultados reales de nuestras clientas. Cada video muestra el poder de nuestros tratamientos.
          </p>
        </div>

        {/* Videos Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {transformations.map((item, index) => (
            <Card 
              key={item.id}
              className={`group bg-card border-border overflow-hidden transition-all duration-700 hover:shadow-2xl hover:shadow-primary/20 ${
                visibleCards.includes(index) ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
              }`}
            >
              <CardContent className="p-0">
                {/* Video Container */}
                <div className="relative aspect-video bg-muted overflow-hidden">
                  {playingVideo === item.id ? (
                    <iframe
                      src={`https://www.youtube.com/embed/${item.videoId}?autoplay=1`}
                      title={item.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="absolute inset-0 w-full h-full"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/20 via-secondary/30 to-accent/20">
                      <div className="text-center">
                        <button 
                          onClick={() => setPlayingVideo(item.id)}
                          className="w-20 h-20 bg-primary text-primary-foreground rounded-full flex items-center justify-center mb-4 mx-auto transition-all duration-300 hover:scale-110 hover:shadow-xl hover:shadow-primary/50 group"
                        >
                          <Play className="h-8 w-8 ml-1 transition-transform duration-300 group-hover:scale-110" />
                        </button>
                        <p className="text-sm text-muted-foreground">Click para ver el video</p>
                      </div>
                    </div>
                  )}
                  
                  {/* Service Badge */}
                  <div className="absolute top-4 left-4 bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-medium">
                    {item.service}
                  </div>
                  
                  {/* Pause Button */}
                  {playingVideo === item.id && (
                    <button 
                      onClick={() => setPlayingVideo(null)}
                      className="absolute top-4 right-4 w-10 h-10 bg-foreground/80 text-primary-foreground rounded-full flex items-center justify-center transition-all duration-300 hover:bg-foreground"
                    >
                      <Pause className="h-5 w-5" />
                    </button>
                  )}
                </div>
                
                {/* Content */}
                <div className="p-6">
                  <h3 className="font-serif text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Floating sparkles decoration */}
        <div className="flex justify-center mt-12 gap-4">
          {[0, 1, 2].map((i) => (
            <Sparkles 
              key={i}
              className="h-6 w-6 text-primary animate-bounce"
              style={{ animationDelay: `${i * 0.2}s`, animationDuration: "1.5s" }}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
