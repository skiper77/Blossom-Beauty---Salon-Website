"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { Play, Sparkles, Video, Trash2, Loader2 } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import type { GalleryItem } from "@/lib/supabase"

const STATIC_FALLBACK: GalleryItem[] = [
  { id: "t1", title: "Transformacion de Tinte", category: "Transformaciones", file_url: "/images/hair-coloring.jpg", file_type: "image", created_at: "" },
  { id: "t2", title: "Peinado de Novia", category: "Transformaciones", file_url: "/images/hairstyles.jpg", file_type: "image", created_at: "" },
  { id: "t3", title: "Planchado Profesional", category: "Transformaciones", file_url: "/images/straightening.jpg", file_type: "image", created_at: "" },
  { id: "t4", title: "Tratamiento de Keratina", category: "Transformaciones", file_url: "/images/keratin.jpg", file_type: "image", created_at: "" },
]

export function BeforeAfter() {
  const [items, setItems] = useState<GalleryItem[]>(STATIC_FALLBACK)
  const [visibleCards, setVisibleCards] = useState<number[]>([])
  const [playingId, setPlayingId] = useState<string | null>(null)
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    fetch("/api/gallery")
      .then((r) => r.ok ? r.json() : null)
      .then((data: GalleryItem[] | null) => {
        if (Array.isArray(data)) {
          const transformaciones = data.filter((i) => i.category === "Transformaciones")
          if (transformaciones.length > 0) setItems(transformaciones)
        }
      })
      .catch(() => {})
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting)
            items.forEach((_, i) => setTimeout(() => setVisibleCards((p) => [...p, i]), i * 200))
        })
      },
      { threshold: 0.1 }
    )
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [items])

  return (
    <section ref={sectionRef} className="py-20 md:py-32">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Play className="h-4 w-4" />
            Antes y Despues
          </span>
          <h2 className="font-script text-4xl md:text-5xl lg:text-6xl text-foreground mb-4">
            Transformaciones Increibles
          </h2>
          <p className="text-lg text-muted-foreground">
            Mira los resultados reales de nuestras clientas. Cada foto muestra el poder de nuestros tratamientos.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {items.map((item, index) => (
            <Card
              key={item.id}
              className={`group bg-card border-border overflow-hidden transition-all duration-700 hover:shadow-2xl hover:shadow-primary/20 ${
                visibleCards.includes(index) ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
              }`}
            >
              <CardContent className="p-0">
                <div className="relative aspect-video bg-muted overflow-hidden">
                  {item.file_type === "video" ? (
                    playingId === item.id ? (
                      <video src={item.file_url} autoPlay controls className="absolute inset-0 w-full h-full object-cover" />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/20 via-secondary/30 to-accent/20">
                        <button
                          onClick={() => setPlayingId(item.id)}
                          className="w-20 h-20 bg-primary text-primary-foreground rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-xl hover:shadow-primary/50"
                        >
                          <Play className="h-8 w-8 ml-1" />
                        </button>
                      </div>
                    )
                  ) : (
                    <Image src={item.file_url} alt={item.title} fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
                  )}
                  <div className="absolute top-4 left-4 bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-medium">
                    {item.file_type === "video" ? <Video className="inline w-3.5 h-3.5 mr-1" /> : null}
                    {item.category}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="font-serif text-xl font-bold text-foreground mb-1 group-hover:text-primary transition-colors">
                    {item.title}
                  </h3>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="flex justify-center mt-12 gap-4">
          {[0, 1, 2].map((i) => (
            <Sparkles key={i} className="h-6 w-6 text-primary animate-bounce" style={{ animationDelay: `${i * 0.2}s`, animationDuration: "1.5s" }} />
          ))}
        </div>
      </div>
    </section>
  )
}
