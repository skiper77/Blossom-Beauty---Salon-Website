"use client"

import { useEffect, useRef, useState } from "react"
import { Heart, Star, Award, Users } from "lucide-react"

const features = [
  {
    icon: Star,
    title: "Calidad Premium",
    description: "Usamos solo los mejores productos profesionales para resultados excepcionales."
  },
  {
    icon: Award,
    title: "Estilistas Expertos",
    description: "Nuestro equipo esta formado por profesionales del cabello altamente capacitados."
  },
  {
    icon: Heart,
    title: "Atencion Personal",
    description: "Cada clienta recibe atencion personalizada y servicios a su medida."
  },
  {
    icon: Users,
    title: "Espacio Acogedor",
    description: "Relajate en nuestro hermoso salon moderno disenado para tu comodidad."
  }
]

export function About() {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true)
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
    <section id="nosotros" ref={sectionRef} className="py-20 md:py-32">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Image Side */}
          <div className={`relative transition-all duration-1000 ${isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-10"}`}>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="aspect-[3/4] bg-gradient-to-br from-primary/20 to-secondary/30 rounded-3xl overflow-hidden flex items-center justify-center group hover:scale-[1.02] transition-transform duration-500">
                  <Heart className="h-12 w-12 text-primary transition-all duration-300 group-hover:scale-125 group-hover:rotate-12" />
                </div>
                <div className="aspect-square bg-gradient-to-br from-secondary/30 to-accent/20 rounded-3xl overflow-hidden flex items-center justify-center group hover:scale-[1.02] transition-transform duration-500">
                  <Star className="h-10 w-10 text-primary transition-all duration-300 group-hover:scale-125 group-hover:rotate-12" />
                </div>
              </div>
              <div className="space-y-4 pt-8">
                <div className="aspect-square bg-gradient-to-br from-accent/20 to-primary/30 rounded-3xl overflow-hidden flex items-center justify-center group hover:scale-[1.02] transition-transform duration-500">
                  <Award className="h-10 w-10 text-primary transition-all duration-300 group-hover:scale-125 group-hover:rotate-12" />
                </div>
                <div className="aspect-[3/4] bg-gradient-to-br from-primary/30 to-secondary/20 rounded-3xl overflow-hidden flex items-center justify-center group hover:scale-[1.02] transition-transform duration-500">
                  <Users className="h-12 w-12 text-primary transition-all duration-300 group-hover:scale-125 group-hover:rotate-12" />
                </div>
              </div>
            </div>
            
            {/* Floating badge */}
            <div className="absolute -bottom-4 -right-4 md:bottom-8 md:right-0 bg-card border border-border p-4 rounded-2xl shadow-xl animate-bounce" style={{ animationDuration: "3s" }}>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <Award className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="font-serif font-bold text-foreground">Mejor Salon</p>
                  <p className="text-sm text-muted-foreground">Premio 2024</p>
                </div>
              </div>
            </div>
          </div>

          {/* Content Side */}
          <div className={`transition-all duration-1000 delay-300 ${isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10"}`}>
            <span className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4">
              <Heart className="h-4 w-4" />
              Sobre Nosotros
            </span>
            
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6 text-balance">
              Donde la Belleza se Encuentra con la Excelencia
            </h2>
            
            <p className="text-lg text-muted-foreground mb-8">
              En Blossom Beauty Salon, creemos que cada mujer merece sentirse segura y hermosa. 
              Nuestro apasionado equipo de estilistas combina arte con experiencia para crear looks que 
              realzan tu belleza natural y expresan tu personalidad unica.
            </p>

            <div className="grid sm:grid-cols-2 gap-6">
              {features.map((feature, index) => (
                <div 
                  key={index} 
                  className="flex gap-4 group cursor-pointer transition-all duration-300 hover:translate-x-2"
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center shrink-0 transition-all duration-300 group-hover:bg-primary group-hover:scale-110">
                    <feature.icon className="h-6 w-6 text-primary transition-colors duration-300 group-hover:text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
