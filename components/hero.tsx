"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ReservationModal } from "@/components/reservation-modal"
import { Sparkles, Heart, Star } from "lucide-react"

export function Hero() {
  const [isVisible, setIsVisible] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <section id="inicio" className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
      {/* Background blobs */}
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

            <h1 className="font-script leading-none mb-6" style={{ fontSize: "clamp(3.5rem, 9vw, 7rem)" }}>
              <span className="block text-foreground">ST Studio</span>
              <span className="block text-primary" style={{ WebkitTextStroke: "0px" }}>Belleza</span>
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground max-w-lg mx-auto lg:mx-0 mb-8">
              Transforma tu look con nuestros expertos en coloración, peinados deslumbrantes, planchados profesionales y tratamientos de keratina de lujo.
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
              {[
                { num: "10+", label: "Años de Experiencia" },
                { num: "5K+", label: "Clientas Felices" },
                { num: "15+", label: "Estilistas Expertos" },
              ].map((stat, i) => (
                <>
                  {i > 0 && <div key={`sep-${i}`} className="w-px h-12 bg-border" />}
                  <div key={stat.num} className="text-center group cursor-pointer">
                    <p className="font-serif text-3xl md:text-4xl font-bold text-foreground transition-transform duration-300 group-hover:scale-110">{stat.num}</p>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                  </div>
                </>
              ))}
            </div>
          </div>

          {/* Logo Display */}
          <div className={`relative transition-all duration-1000 delay-300 ${isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10"}`}>
            <div className="relative flex items-center justify-center" style={{ minHeight: "420px" }}>

              {/* Outer rotating ring */}
              <div
                className="absolute w-[380px] h-[380px] rounded-full border border-primary/15"
                style={{ animation: "rotateSlow 25s linear infinite" }}
              >
                {/* Dots on ring */}
                {[0, 60, 120, 180, 240, 300].map((deg) => (
                  <div
                    key={deg}
                    className="absolute w-2 h-2 rounded-full bg-primary/40"
                    style={{
                      top: "50%", left: "50%",
                      transform: `rotate(${deg}deg) translateX(188px) translateY(-50%)`,
                    }}
                  />
                ))}
              </div>

              {/* Inner rotating ring (reverse) */}
              <div
                className="absolute w-[310px] h-[310px] rounded-full border border-primary/20"
                style={{ animation: "rotateSlowReverse 18s linear infinite" }}
              >
                {[45, 135, 225, 315].map((deg) => (
                  <div
                    key={deg}
                    className="absolute w-1.5 h-1.5 rounded-full bg-secondary-foreground/30"
                    style={{
                      top: "50%", left: "50%",
                      transform: `rotate(${deg}deg) translateX(153px) translateY(-50%)`,
                    }}
                  />
                ))}
              </div>

              {/* Glow layers */}
              <div className="absolute w-72 h-72 rounded-full bg-primary/10 blur-3xl animate-pulse" style={{ animationDuration: "4s" }} />
              <div className="absolute w-52 h-52 rounded-full bg-secondary/25 blur-2xl animate-pulse" style={{ animationDuration: "2.5s", animationDelay: "1s" }} />

              {/* Logo */}
              <div
                className="relative w-64 h-64 drop-shadow-2xl"
                style={{ animation: "heroFloat 5s ease-in-out infinite" }}
              >
                <Image
                  src="/logo.png"
                  alt="ST Studio Belleza"
                  fill
                  className="object-contain"
                  priority
                />
              </div>

              {/* Floating decorative icons */}
              <div className="absolute top-6 right-10 animate-bounce" style={{ animationDuration: "2.2s" }}>
                <div className="w-10 h-10 bg-primary text-primary-foreground rounded-xl flex items-center justify-center shadow-lg">
                  <Sparkles className="w-5 h-5" />
                </div>
              </div>
              <div className="absolute bottom-8 left-10 animate-bounce" style={{ animationDuration: "2.8s", animationDelay: "0.4s" }}>
                <div className="w-10 h-10 bg-card border border-border rounded-xl flex items-center justify-center shadow-lg">
                  <Heart className="w-5 h-5 text-primary" />
                </div>
              </div>
              <div className="absolute top-1/2 right-2 animate-bounce" style={{ animationDuration: "3.5s", animationDelay: "0.8s" }}>
                <div className="w-8 h-8 bg-secondary rounded-xl flex items-center justify-center shadow-md">
                  <Star className="w-4 h-4 text-primary fill-primary" />
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
      <ReservationModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </section>
  )
}
