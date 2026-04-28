"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ReservationModal } from "@/components/reservation-modal"
import { Sparkles, Heart } from "lucide-react"

export function Hero() {
  const [isVisible, setIsVisible] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <section id="inicio" className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
      {/* Background decorations with animations */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "2s" }} />
      </div>

      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <div className={`text-center lg:text-left transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
            <div className="inline-flex items-center gap-2 bg-card px-4 py-2 rounded-full border border-border mb-6 animate-bounce" style={{ animationDuration: "3s" }}>
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-muted-foreground">Bienvenida a ST Studio Belleza</span>
            </div>

            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-foreground leading-tight mb-6">
              <span className="text-balance">ST Studio</span>
              <br />
              <span className="text-primary bg-gradient-to-r from-primary to-secondary bg-clip-text">Belleza</span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground max-w-lg mx-auto lg:mx-0 mb-8">
              Transforma tu look con nuestros expertos en coloracion, peinados deslumbrantes, planchados profesionales y tratamientos de keratina de lujo.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button 
                size="lg" 
                onClick={() => setIsModalOpen(true)}
                className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-8 text-lg transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-primary/25"
              >
                Reservar Cita
              </Button>
              <Link href="#servicios">
                <Button size="lg" variant="outline" className="rounded-full px-8 text-lg border-primary text-primary hover:bg-primary/10 transition-all duration-300 hover:scale-105">
                  Ver Servicios
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className={`flex items-center justify-center lg:justify-start gap-8 mt-12 transition-all duration-1000 delay-500 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
              <div className="text-center group cursor-pointer">
                <p className="font-serif text-3xl md:text-4xl font-bold text-foreground transition-transform duration-300 group-hover:scale-110">10+</p>
                <p className="text-sm text-muted-foreground">Anos de Experiencia</p>
              </div>
              <div className="w-px h-12 bg-border" />
              <div className="text-center group cursor-pointer">
                <p className="font-serif text-3xl md:text-4xl font-bold text-foreground transition-transform duration-300 group-hover:scale-110">5K+</p>
                <p className="text-sm text-muted-foreground">Clientas Felices</p>
              </div>
              <div className="w-px h-12 bg-border" />
              <div className="text-center group cursor-pointer">
                <p className="font-serif text-3xl md:text-4xl font-bold text-foreground transition-transform duration-300 group-hover:scale-110">15+</p>
                <p className="text-sm text-muted-foreground">Estilistas Expertos</p>
              </div>
            </div>
          </div>

          {/* Hero Image */}
          <div className={`relative transition-all duration-1000 delay-300 ${isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10"}`}>
            <div className="relative aspect-[4/5] max-w-md mx-auto group">
              {/* Main image */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/30 via-secondary/40 to-accent/30 rounded-[3rem] overflow-hidden transition-transform duration-500 group-hover:scale-[1.02]">
                <div className="absolute inset-4 bg-card rounded-[2.5rem] overflow-hidden">
                  <Image
                    src="/images/hero-salon.jpg"
                    alt="Blossom Beauty Salon"
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                </div>
              </div>
              
              {/* Floating decorative elements */}
              <div className="absolute -top-4 -right-4 bg-primary text-primary-foreground p-4 rounded-2xl shadow-lg animate-bounce" style={{ animationDuration: "2s" }}>
                <Sparkles className="h-6 w-6" />
              </div>
              <div className="absolute -bottom-4 -left-4 bg-secondary p-4 rounded-2xl shadow-lg animate-bounce" style={{ animationDuration: "2.5s", animationDelay: "0.5s" }}>
                <Heart className="h-6 w-6 text-primary" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <ReservationModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </section>
  )
}
