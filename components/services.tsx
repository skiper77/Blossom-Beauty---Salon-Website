"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { Palette, Scissors, Wind, Sparkles } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const services = [
  {
    icon: Palette,
    title: "Tintes",
    titleEn: "Hair Coloring",
    description: "Desde mechas sutiles hasta transformaciones audaces, nuestros expertos coloristas crean el tono perfecto para ti.",
    features: ["Balayage", "Mechas", "Color Completo", "Correccion de Color"],
    price: "Desde $80",
    image: "/images/hair-coloring.jpg"
  },
  {
    icon: Scissors,
    title: "Peinados",
    titleEn: "Hairstyles",
    description: "Recogidos impresionantes, ondas elegantes y cortes modernos creados por nuestros talentosos estilistas.",
    features: ["Estilos de Novia", "Recogidos", "Trenzas", "Secado"],
    price: "Desde $50",
    image: "/images/hairstyles.jpg"
  },
  {
    icon: Wind,
    title: "Planchados",
    titleEn: "Straightening",
    description: "Logra un cabello liso y suave con nuestros tratamientos profesionales de planchado.",
    features: ["Planchado Japones", "Brazilian Blowout", "Silk Press", "Termico"],
    price: "Desde $120",
    image: "/images/straightening.jpg"
  },
  {
    icon: Sparkles,
    title: "Keratinas",
    titleEn: "Keratin Treatments",
    description: "Tratamientos de keratina de lujo para un cabello sin frizz, saludable y brillante que dura.",
    features: ["Keratina Express", "Tratamiento Profundo", "Alisado", "Reparacion"],
    price: "Desde $150",
    image: "/images/keratin.jpg"
  },
]

export function Services() {
  const [visibleCards, setVisibleCards] = useState<number[]>([])
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            services.forEach((_, index) => {
              setTimeout(() => {
                setVisibleCards((prev) => [...prev, index])
              }, index * 150)
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
    <section id="servicios" ref={sectionRef} className="py-20 md:py-32 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4 animate-pulse">
            <Sparkles className="h-4 w-4" />
            Nuestros Servicios
          </span>
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4 text-balance">
            Transforma Tu Look
          </h2>
          <p className="text-lg text-muted-foreground">
            Descubre nuestra gama de servicios premium para el cabello disenados para hacerte sentir hermosa y segura.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <Card 
              key={index} 
              className={`group bg-card border-border hover:border-primary/50 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/20 overflow-hidden ${
                visibleCards.includes(index) ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
              }`}
            >
              {/* Service Image */}
              <div className="relative h-48 overflow-hidden">
                <Image
                  src={service.image}
                  alt={service.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
              </div>
              
              <CardHeader className="pb-4">
                <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
                  <service.icon className="h-7 w-7 text-primary" />
                </div>
                <CardTitle className="font-serif text-xl text-foreground">{service.title}</CardTitle>
                <span className="text-xs text-primary font-medium">{service.titleEn}</span>
                <CardDescription className="text-muted-foreground">
                  {service.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 mb-6">
                  {service.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground group-hover:translate-x-1 transition-transform duration-300" style={{ transitionDelay: `${i * 50}ms` }}>
                      <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <div className="flex items-center justify-between">
                  <span className="font-serif text-lg font-semibold text-primary">{service.price}</span>
                  <Button variant="outline" size="sm" className="rounded-full border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300 hover:scale-105">
                    Reservar
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
