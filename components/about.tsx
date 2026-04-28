"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { Heart, Star, Award, Users } from "lucide-react"
import type { GalleryItem } from "@/lib/supabase"

const features = [
  { icon: Star, title: "Calidad Premium", description: "Usamos solo los mejores productos profesionales para resultados excepcionales." },
  { icon: Award, title: "Estilistas Expertos", description: "Nuestro equipo esta formado por profesionales del cabello altamente capacitados." },
  { icon: Heart, title: "Atencion Personal", description: "Cada clienta recibe atencion personalizada y servicios a su medida." },
  { icon: Users, title: "Espacio Acogedor", description: "Relajate en nuestro hermoso salon moderno disenado para tu comodidad." },
]

const PLACEHOLDERS = [
  { icon: Heart, gradient: "from-primary/20 to-secondary/30", aspect: "aspect-[3/4]" },
  { icon: Star, gradient: "from-secondary/30 to-accent/20", aspect: "aspect-square" },
  { icon: Award, gradient: "from-accent/20 to-primary/30", aspect: "aspect-square" },
  { icon: Users, gradient: "from-primary/30 to-secondary/20", aspect: "aspect-[3/4]" },
]

export function About() {
  const [photos, setPhotos] = useState<GalleryItem[]>([])
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    fetch("/api/gallery")
      .then((r) => r.ok ? r.json() : null)
      .then((data: GalleryItem[] | null) => {
        if (Array.isArray(data)) {
          const nosotros = data.filter((i) => i.category === "Nosotros").slice(0, 4)
          if (nosotros.length > 0) setPhotos(nosotros)
        }
      })
      .catch(() => {})

    const observer = new IntersectionObserver(
      (entries) => { entries.forEach((e) => { if (e.isIntersecting) setIsVisible(true) }) },
      { threshold: 0.2 }
    )
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section id="nosotros" ref={sectionRef} className="py-20 md:py-32">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          {/* Image Grid */}
          <div className={`relative transition-all duration-1000 ${isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-10"}`}>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                {[0, 1].map((i) => (
                  <div
                    key={i}
                    className={`${PLACEHOLDERS[i].aspect} bg-gradient-to-br ${PLACEHOLDERS[i].gradient} rounded-3xl overflow-hidden group hover:scale-[1.02] transition-transform duration-500 relative`}
                  >
                    {photos[i] ? (
                      <Image src={photos[i].file_url} alt={photos[i].title} fill className="object-cover transition-transform duration-700 group-hover:scale-110" />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        {(() => { const Icon = PLACEHOLDERS[i].icon; return <Icon className="h-12 w-12 text-primary transition-all duration-300 group-hover:scale-125 group-hover:rotate-12" /> })()}
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <div className="space-y-4 pt-8">
                {[2, 3].map((i) => (
                  <div
                    key={i}
                    className={`${PLACEHOLDERS[i].aspect} bg-gradient-to-br ${PLACEHOLDERS[i].gradient} rounded-3xl overflow-hidden group hover:scale-[1.02] transition-transform duration-500 relative`}
                  >
                    {photos[i] ? (
                      <Image src={photos[i].file_url} alt={photos[i].title} fill className="object-cover transition-transform duration-700 group-hover:scale-110" />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        {(() => { const Icon = PLACEHOLDERS[i].icon; return <Icon className="h-10 w-10 text-primary transition-all duration-300 group-hover:scale-125 group-hover:rotate-12" /> })()}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

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

          {/* Content */}
          <div className={`transition-all duration-1000 delay-300 ${isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10"}`}>
            <span className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4">
              <Heart className="h-4 w-4" />
              Sobre Nosotros
            </span>
            <h2 className="font-script text-4xl md:text-5xl text-foreground mb-6">
              Donde la Belleza se Encuentra con la Excelencia
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              En ST Studio Belleza, creemos que cada mujer merece sentirse segura y hermosa.
              Nuestro apasionado equipo combina arte con experiencia para crear looks que
              realzan tu belleza natural y expresan tu personalidad unica.
            </p>
            <div className="grid sm:grid-cols-2 gap-6">
              {features.map((feature, index) => (
                <div key={index} className="flex gap-4 group cursor-pointer transition-all duration-300 hover:translate-x-2" style={{ transitionDelay: `${index * 100}ms` }}>
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
