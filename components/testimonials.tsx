"use client"

import { useEffect, useRef, useState } from "react"
import { Star, Quote } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

const testimonials = [
  {
    name: "Sofia Martinez",
    role: "Clienta Regular",
    content: "Blossom Beauty transformo mi cabello completamente! El balayage luce absolutamente impresionante y el equipo me hizo sentir muy comoda.",
    rating: 5
  },
  {
    name: "Elena Rodriguez",
    role: "Novia",
    content: "Hicieron mi peinado de boda y fue perfecto! Tan elegante y duro todo el dia. No podria haber pedido mejor servicio.",
    rating: 5
  },
  {
    name: "Maria Garcia",
    role: "Tratamiento Keratina",
    content: "El tratamiento de keratina cambio mi vida! Mi cabello nunca habia estado tan suave y manejable. Lo recomiendo mucho!",
    rating: 5
  },
]

export function Testimonials() {
  const [visibleCards, setVisibleCards] = useState<number[]>([])
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            testimonials.forEach((_, index) => {
              setTimeout(() => {
                setVisibleCards((prev) => [...prev, index])
              }, index * 200)
            })
          }
        })
      },
      { threshold: 0.2 }
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
            <Star className="h-4 w-4" />
            Testimonios
          </span>
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4 text-balance">
            Lo Que Dicen Nuestras Clientas
          </h2>
          <p className="text-lg text-muted-foreground">
            No solo tomes nuestra palabra - escucha lo que dicen nuestras clientas satisfechas.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <Card 
              key={index} 
              className={`bg-card border-border hover:border-primary/30 transition-all duration-700 hover:shadow-xl hover:shadow-primary/10 group ${
                visibleCards.includes(index) ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
              }`}
            >
              <CardContent className="p-6 md:p-8">
                <Quote className="h-8 w-8 text-primary/30 mb-4 transition-all duration-300 group-hover:text-primary/50 group-hover:scale-110" />
                
                {/* Rating */}
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star 
                      key={i} 
                      className="h-4 w-4 fill-primary text-primary transition-all duration-300 group-hover:scale-110"
                      style={{ transitionDelay: `${i * 50}ms` }}
                    />
                  ))}
                </div>
                
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  {`"${testimonial.content}"`}
                </p>
                
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary/30 to-secondary/30 rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110">
                    <span className="font-serif font-bold text-primary">
                      {testimonial.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
