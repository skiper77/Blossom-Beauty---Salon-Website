"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { Camera, X, ChevronLeft, ChevronRight, Video, Sparkles, Grid3X3, LayoutGrid } from "lucide-react"
import type { GalleryItem } from "@/lib/supabase"

const STATIC_FALLBACK: GalleryItem[] = [
  { id: "s1", title: "Balayage de Ensueño", category: "Tintes", file_url: "/images/hair-coloring.jpg", file_type: "image", created_at: "" },
  { id: "s2", title: "Recogido Elegante", category: "Peinados", file_url: "/images/hairstyles.jpg", file_type: "image", created_at: "" },
  { id: "s3", title: "Liso Perfecto", category: "Planchados", file_url: "/images/straightening.jpg", file_type: "image", created_at: "" },
  { id: "s4", title: "Brillo de Keratina", category: "Keratinas", file_url: "/images/keratin.jpg", file_type: "image", created_at: "" },
  { id: "s5", title: "Mechas Doradas", category: "Tintes", file_url: "/images/hair-coloring.jpg", file_type: "image", created_at: "" },
  { id: "s6", title: "Belleza Nupcial", category: "Peinados", file_url: "/images/hairstyles.jpg", file_type: "image", created_at: "" },
]

const CATEGORY_COLORS: Record<string, string> = {
  Tintes: "from-rose-400/40 to-pink-600/40",
  Peinados: "from-purple-400/40 to-violet-600/40",
  Planchados: "from-amber-400/40 to-orange-500/40",
  Keratinas: "from-emerald-400/40 to-teal-600/40",
  Otro: "from-sky-400/40 to-blue-600/40",
}

export function Gallery() {
  const [items, setItems] = useState<GalleryItem[]>(STATIC_FALLBACK)
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
  const [view, setView] = useState<"albums" | "grid">("albums")
  const [visibleItems, setVisibleItems] = useState<number[]>([])
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    fetch("/api/gallery")
      .then((r) => r.ok ? r.json() : null)
      .then((data) => { if (Array.isArray(data) && data.length > 0) setItems(data) })
      .catch(() => {})
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting)
            items.forEach((_, i) => setTimeout(() => setVisibleItems((p) => [...p, i]), i * 80))
        })
      },
      { threshold: 0.1 }
    )
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [items])

  const categories = [...new Set(items.map((i) => i.category))]
  const displayItems = activeCategory ? items.filter((i) => i.category === activeCategory) : items

  function openLightbox(index: number) { setLightboxIndex(index) }
  function closeLightbox() { setLightboxIndex(null) }
  function prevPhoto() { if (lightboxIndex !== null) setLightboxIndex((lightboxIndex - 1 + displayItems.length) % displayItems.length) }
  function nextPhoto() { if (lightboxIndex !== null) setLightboxIndex((lightboxIndex + 1) % displayItems.length) }

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (lightboxIndex === null) return
      if (e.key === "Escape") closeLightbox()
      if (e.key === "ArrowLeft") prevPhoto()
      if (e.key === "ArrowRight") nextPhoto()
    }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [lightboxIndex, displayItems.length])

  return (
    <section id="galeria" ref={sectionRef} className="py-20 md:py-32 bg-muted/30">
      <div className="container mx-auto px-4">

        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Camera className="h-4 w-4" />
            Nuestro Trabajo
          </span>
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4 text-balance">
            Galeria de Transformaciones
          </h2>
          <p className="text-lg text-muted-foreground">
            Explora nuestro portafolio de impresionantes transformaciones y encuentra inspiracion para tu proximo look.
          </p>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          {/* Category filters */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setActiveCategory(null)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                !activeCategory ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30" : "bg-card border border-border text-muted-foreground hover:border-primary/50"
              }`}
            >
              Todos ({items.length})
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat === activeCategory ? null : cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  activeCategory === cat ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30" : "bg-card border border-border text-muted-foreground hover:border-primary/50"
                }`}
              >
                {cat} ({items.filter((i) => i.category === cat).length})
              </button>
            ))}
          </div>

          {/* View toggle */}
          <div className="flex gap-1 bg-card border border-border rounded-xl p-1">
            <button
              onClick={() => setView("albums")}
              className={`p-2 rounded-lg transition-all ${view === "albums" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setView("grid")}
              className={`p-2 rounded-lg transition-all ${view === "grid" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
            >
              <Grid3X3 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Album View */}
        {view === "albums" && !activeCategory ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {categories.map((cat) => {
              const catItems = items.filter((i) => i.category === cat)
              const cover = catItems.find((i) => i.file_type === "image") ?? catItems[0]
              return (
                <button
                  key={cat}
                  onClick={() => { setActiveCategory(cat); setView("grid") }}
                  className="group relative aspect-square rounded-2xl overflow-hidden shadow-md hover:shadow-2xl hover:shadow-primary/20 transition-all duration-500 hover:scale-[1.03]"
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${CATEGORY_COLORS[cat] ?? CATEGORY_COLORS["Otro"]}`} />
                  {cover?.file_url && (
                    <Image src={cover.file_url} alt={cat} fill className="object-cover transition-transform duration-700 group-hover:scale-110 mix-blend-overlay" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4 text-left">
                    <p className="font-serif text-white font-bold text-xl leading-tight">{cat}</p>
                    <p className="text-white/70 text-sm">{catItems.length} {catItems.length === 1 ? "foto" : "fotos"}</p>
                  </div>
                  <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                </button>
              )
            })}
          </div>
        ) : (
          /* Grid View */
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            {displayItems.map((item, index) => (
              <div
                key={item.id}
                onClick={() => openLightbox(index)}
                className={`group relative overflow-hidden rounded-2xl md:rounded-3xl cursor-pointer transition-all duration-700 hover:scale-[1.02] ${
                  index === 0 || index === 5 ? "aspect-[3/4]" : "aspect-square"
                } ${visibleItems.includes(index) ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
              >
                {item.file_type === "video" ? (
                  <video
                    src={item.file_url}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    muted loop playsInline
                    onMouseEnter={(e) => (e.currentTarget as HTMLVideoElement).play()}
                    onMouseLeave={(e) => (e.currentTarget as HTMLVideoElement).pause()}
                  />
                ) : (
                  <Image src={item.file_url} alt={item.title} fill className="object-cover transition-transform duration-700 group-hover:scale-110" />
                )}
                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {item.file_type === "video" ? <Video className="h-5 w-5 text-white drop-shadow" /> : <Sparkles className="h-5 w-5 text-white drop-shadow" />}
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500">
                  <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                    <span className="text-xs text-white/90 bg-primary/70 px-3 py-1 rounded-full">{item.category}</span>
                    <h3 className="font-serif text-base md:text-lg font-semibold text-white mt-2">{item.title}</h3>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeCategory && (
          <div className="flex justify-center mt-8">
            <button
              onClick={() => { setActiveCategory(null); setView("albums") }}
              className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors text-sm"
            >
              <ChevronLeft className="w-4 h-4" />
              Ver todos los álbumes
            </button>
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-sm flex items-center justify-center"
          onClick={closeLightbox}
        >
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 z-10 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-all"
          >
            <X className="w-5 h-5" />
          </button>

          <button
            onClick={(e) => { e.stopPropagation(); prevPhoto() }}
            className="absolute left-4 z-10 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-all"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <div
            className="relative max-w-4xl max-h-[85vh] w-full mx-16 rounded-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {displayItems[lightboxIndex].file_type === "video" ? (
              <video
                src={displayItems[lightboxIndex].file_url}
                controls
                autoPlay
                className="w-full h-full object-contain max-h-[80vh]"
              />
            ) : (
              <div className="relative aspect-[4/3] md:aspect-video">
                <Image
                  src={displayItems[lightboxIndex].file_url}
                  alt={displayItems[lightboxIndex].title}
                  fill
                  className="object-contain"
                />
              </div>
            )}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
              <span className="text-xs text-white/70 bg-primary/60 px-3 py-1 rounded-full">
                {displayItems[lightboxIndex].category}
              </span>
              <h3 className="font-serif text-white font-semibold mt-2">{displayItems[lightboxIndex].title}</h3>
              <p className="text-white/50 text-xs mt-1">{lightboxIndex + 1} / {displayItems.length}</p>
            </div>
          </div>

          <button
            onClick={(e) => { e.stopPropagation(); nextPhoto() }}
            className="absolute right-4 z-10 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-all"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      )}
    </section>
  )
}
