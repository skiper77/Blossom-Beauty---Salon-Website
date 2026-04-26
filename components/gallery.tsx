"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { Sparkles, Camera, Video } from "lucide-react"
import type { GalleryItem } from "@/lib/supabase"

const STATIC_FALLBACK = [
  { id: "s1", title: "Balayage de Ensueño", category: "Tintes", file_url: "/images/hair-coloring.jpg", file_type: "image" as const, created_at: "" },
  { id: "s2", title: "Recogido Elegante", category: "Peinados", file_url: "/images/hairstyles.jpg", file_type: "image" as const, created_at: "" },
  { id: "s3", title: "Liso Perfecto", category: "Planchados", file_url: "/images/straightening.jpg", file_type: "image" as const, created_at: "" },
  { id: "s4", title: "Brillo de Keratina", category: "Keratinas", file_url: "/images/keratin.jpg", file_type: "image" as const, created_at: "" },
  { id: "s5", title: "Mechas Doradas", category: "Tintes", file_url: "/images/hair-coloring.jpg", file_type: "image" as const, created_at: "" },
  { id: "s6", title: "Belleza Nupcial", category: "Peinados", file_url: "/images/hairstyles.jpg", file_type: "image" as const, created_at: "" },
]

export function Gallery() {
  const [items, setItems] = useState<GalleryItem[]>(STATIC_FALLBACK)
  const [visibleItems, setVisibleItems] = useState<number[]>([])
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    fetch("/api/gallery")
      .then((r) => r.ok ? r.json() : null)
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) setItems(data)
      })
      .catch(() => {})
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            items.forEach((_, index) => {
              setTimeout(() => {
                setVisibleItems((prev) => [...prev, index])
              }, index * 100)
            })
          }
        })
      },
      { threshold: 0.1 }
    )

    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [items])

  return (
    <section id="galeria" ref={sectionRef} className="py-20 md:py-32 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Camera className="h-4 w-4" />
            Nuestro Trabajo
          </span>
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4 text-balance">
            Galeria de Transformaciones
          </h2>
          <p className="text-lg text-muted-foreground">
            Explora nuestro portafolio de impresionantes transformaciones de cabello y encuentra inspiracion para tu proximo look.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          {items.map((item, index) => (
            <div
              key={item.id}
              className={`group relative overflow-hidden rounded-2xl md:rounded-3xl cursor-pointer transition-all duration-700 hover:scale-[1.02] ${
                index === 0 || index === 5 ? "aspect-[3/4]" : "aspect-square"
              } ${visibleItems.includes(index) ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
            >
              {item.file_type === "video" ? (
                <video
                  src={item.file_url}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  muted
                  loop
                  playsInline
                  onMouseEnter={(e) => (e.currentTarget as HTMLVideoElement).play()}
                  onMouseLeave={(e) => (e.currentTarget as HTMLVideoElement).pause()}
                />
              ) : (
                <Image
                  src={item.file_url}
                  alt={item.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
              )}

              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                {item.file_type === "video"
                  ? <Video className="h-6 w-6 text-primary-foreground animate-pulse" />
                  : <Sparkles className="h-6 w-6 text-primary-foreground animate-pulse" />}
              </div>

              <div className="absolute inset-0 bg-gradient-to-t from-foreground/90 via-foreground/30 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500">
                <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                  <span className="text-xs md:text-sm text-primary-foreground/90 bg-primary/60 px-3 py-1 rounded-full">
                    {item.category}
                  </span>
                  <h3 className="font-serif text-lg md:text-xl font-semibold text-primary-foreground mt-2">
                    {item.title}
                  </h3>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
