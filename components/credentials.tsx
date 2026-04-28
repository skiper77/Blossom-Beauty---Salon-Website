"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { GraduationCap, Briefcase, Award, ExternalLink, Loader2 } from "lucide-react"

type Credential = {
  id: string
  type: "experience" | "education" | "diploma"
  title: string
  institution: string | null
  year: string | null
  description: string | null
  file_url: string | null
  file_type: string | null
  created_at: string
}

const TYPE_CONFIG = {
  experience: { label: "Experiencia", icon: Briefcase, color: "from-rose-400/20 to-pink-500/20", badge: "bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400" },
  education: { label: "Formación", icon: GraduationCap, color: "from-violet-400/20 to-purple-500/20", badge: "bg-violet-100 text-violet-600 dark:bg-violet-900/30 dark:text-violet-400" },
  diploma: { label: "Diploma", icon: Award, color: "from-amber-400/20 to-orange-500/20", badge: "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400" },
}

export function Credentials() {
  const [items, setItems] = useState<Credential[]>([])
  const [loading, setLoading] = useState(true)
  const [visibleItems, setVisibleItems] = useState<number[]>([])
  const [lightbox, setLightbox] = useState<string | null>(null)
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    fetch("/api/credentials")
      .then((r) => r.ok ? r.json() : [])
      .then((data) => { setItems(Array.isArray(data) ? data : []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) items.forEach((_, i) => setTimeout(() => setVisibleItems((p) => [...p, i]), i * 100))
        })
      },
      { threshold: 0.1 }
    )
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [items])

  if (!loading && items.length === 0) return null

  const grouped = {
    experience: items.filter((i) => i.type === "experience"),
    education: items.filter((i) => i.type === "education"),
    diploma: items.filter((i) => i.type === "diploma"),
  }

  return (
    <section ref={sectionRef} className="py-20 md:py-32 bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto px-4">

        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4">
            <GraduationCap className="h-4 w-4" />
            Trayectoria Profesional
          </span>
          <h2 className="font-script text-4xl md:text-5xl lg:text-6xl text-foreground mb-4">
            Mi Experiencia y Formación
          </h2>
          <p className="text-lg text-muted-foreground">
            Años de dedicación, aprendizaje continuo y pasión por la belleza.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="space-y-16">
            {(["experience", "education", "diploma"] as const).map((type) => {
              if (grouped[type].length === 0) return null
              const config = TYPE_CONFIG[type]
              const Icon = config.icon
              return (
                <div key={type}>
                  <div className="flex items-center gap-3 mb-8">
                    <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                    <h3 className="font-serif text-2xl font-bold text-foreground">{config.label}</h3>
                    <div className="flex-1 h-px bg-border" />
                  </div>

                  <div className={`grid gap-6 ${type === "diploma" ? "grid-cols-2 md:grid-cols-3 lg:grid-cols-4" : "md:grid-cols-2 lg:grid-cols-3"}`}>
                    {grouped[type].map((item, index) => (
                      <div
                        key={item.id}
                        className={`bg-card border border-border rounded-2xl overflow-hidden hover:border-primary/40 hover:shadow-xl hover:shadow-primary/10 transition-all duration-500 group ${
                          visibleItems.includes(items.indexOf(item)) ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                        }`}
                      >
                        {/* Diploma image */}
                        {item.file_url && item.file_type === "image" && (
                          <div
                            className="relative aspect-[3/4] bg-muted cursor-pointer overflow-hidden"
                            onClick={() => setLightbox(item.file_url!)}
                          >
                            <Image src={item.file_url} alt={item.title} fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
                              <ExternalLink className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                          </div>
                        )}

                        <div className="p-5">
                          <span className={`inline-block text-xs font-semibold px-2.5 py-1 rounded-full mb-3 ${config.badge}`}>
                            {config.label}
                          </span>
                          <h4 className="font-serif font-bold text-foreground text-lg leading-tight mb-1 group-hover:text-primary transition-colors">
                            {item.title}
                          </h4>
                          {item.institution && (
                            <p className="text-sm text-muted-foreground font-medium">{item.institution}</p>
                          )}
                          {item.year && (
                            <p className="text-xs text-primary/70 mt-1">{item.year}</p>
                          )}
                          {item.description && (
                            <p className="text-sm text-muted-foreground mt-3 leading-relaxed">{item.description}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Lightbox para diplomas */}
      {lightbox && (
        <div
          className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setLightbox(null)}
        >
          <div className="relative max-w-2xl w-full max-h-[90vh] rounded-2xl overflow-hidden">
            <Image src={lightbox} alt="Diploma" width={800} height={1000} className="object-contain w-full h-auto max-h-[85vh]" />
          </div>
          <button onClick={() => setLightbox(null)} className="absolute top-4 right-4 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-all">
            ✕
          </button>
        </div>
      )}
    </section>
  )
}
