"use client"

import { useEffect, useRef, useState } from "react"
import { MapPin, Phone, Mail, Clock, Send, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"

const contactInfo = [
  {
    icon: MapPin,
    title: "Visitanos",
    details: ["Calle Belleza 123", "Ciudad, CP 10001"]
  },
  {
    icon: Phone,
    title: "Llamanos",
    details: ["+1 (555) 123-4567"]
  },
  {
    icon: Mail,
    title: "Escribenos",
    details: ["hola@blossombeauty.com"]
  },
  {
    icon: Clock,
    title: "Horario",
    details: ["Lun-Sab: 9AM - 8PM", "Domingo: 10AM - 6PM"]
  }
]

export function Contact() {
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
    <section id="contacto" ref={sectionRef} className="py-20 md:py-32 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
          {/* Contact Info */}
          <div className={`transition-all duration-1000 ${isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-10"}`}>
            <span className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4">
              <Heart className="h-4 w-4 animate-pulse" />
              Contactanos
            </span>
            
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6 text-balance">
              Reserva Tu Experiencia de Belleza
            </h2>
            
            <p className="text-lg text-muted-foreground mb-10">
              Lista para transformar tu look? Contactanos hoy para agendar tu cita 
              o hacer cualquier pregunta. Te esperamos con los brazos abiertos!
            </p>

            <div className="grid sm:grid-cols-2 gap-6">
              {contactInfo.map((info, index) => (
                <Card 
                  key={index} 
                  className="bg-card border-border group hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10"
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <CardContent className="p-5">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center shrink-0 transition-all duration-300 group-hover:bg-primary group-hover:scale-110">
                        <info.icon className="h-5 w-5 text-primary transition-colors group-hover:text-primary-foreground" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground mb-1">{info.title}</h3>
                        {info.details.map((detail, i) => (
                          <p key={i} className="text-sm text-muted-foreground">{detail}</p>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Contact Form */}
          <Card className={`bg-card border-border transition-all duration-1000 delay-300 ${isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10"}`}>
            <CardContent className="p-6 md:p-8">
              <h3 className="font-serif text-2xl font-bold text-foreground mb-6">
                Envianos un Mensaje
              </h3>
              
              <form className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="group">
                    <label htmlFor="name" className="text-sm font-medium text-foreground mb-2 block">
                      Tu Nombre
                    </label>
                    <Input 
                      id="name"
                      placeholder="Maria Garcia" 
                      className="bg-muted/50 border-border focus:border-primary rounded-xl transition-all duration-300 focus:scale-[1.02]"
                    />
                  </div>
                  <div className="group">
                    <label htmlFor="phone" className="text-sm font-medium text-foreground mb-2 block">
                      Telefono
                    </label>
                    <Input 
                      id="phone"
                      placeholder="+1 (555) 000-0000" 
                      className="bg-muted/50 border-border focus:border-primary rounded-xl transition-all duration-300 focus:scale-[1.02]"
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="email" className="text-sm font-medium text-foreground mb-2 block">
                    Correo Electronico
                  </label>
                  <Input 
                    id="email"
                    type="email"
                    placeholder="maria@ejemplo.com" 
                    className="bg-muted/50 border-border focus:border-primary rounded-xl transition-all duration-300 focus:scale-[1.02]"
                  />
                </div>
                
                <div>
                  <label htmlFor="service" className="text-sm font-medium text-foreground mb-2 block">
                    Servicio de Interes
                  </label>
                  <select 
                    id="service"
                    className="w-full h-10 px-3 bg-muted/50 border border-border rounded-xl text-foreground focus:border-primary focus:outline-none transition-all duration-300 focus:scale-[1.02]"
                  >
                    <option value="">Selecciona un servicio</option>
                    <option value="coloring">Tintes</option>
                    <option value="hairstyles">Peinados</option>
                    <option value="straightening">Planchados</option>
                    <option value="keratin">Keratinas</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="message" className="text-sm font-medium text-foreground mb-2 block">
                    Mensaje
                  </label>
                  <Textarea 
                    id="message"
                    placeholder="Cuentanos sobre el look que deseas..." 
                    rows={4}
                    className="bg-muted/50 border-border focus:border-primary rounded-xl resize-none transition-all duration-300 focus:scale-[1.02]"
                  />
                </div>
                
                <Button 
                  type="submit" 
                  size="lg"
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-full transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-primary/25"
                >
                  <Send className="h-4 w-4 mr-2" />
                  Enviar Mensaje
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
