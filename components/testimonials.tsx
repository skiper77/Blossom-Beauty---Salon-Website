"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { Star, Quote, Send, User, Loader2, CheckCircle2 } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

type Review = {
  id: string
  name: string | null
  comment: string
  rating: number
  avatar_url: string | null
  is_anonymous: boolean
  created_at: string
}

function StarRating({ value, onChange }: { value: number; onChange?: (v: number) => void }) {
  const [hovered, setHovered] = useState(0)
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange?.(star)}
          onMouseEnter={() => onChange && setHovered(star)}
          onMouseLeave={() => onChange && setHovered(0)}
          className={onChange ? "cursor-pointer" : "cursor-default"}
        >
          <Star
            className={`h-5 w-5 transition-all duration-150 ${
              star <= (hovered || value)
                ? "fill-primary text-primary scale-110"
                : "text-zinc-300 dark:text-zinc-600"
            }`}
          />
        </button>
      ))}
    </div>
  )
}

export function Testimonials() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [visibleCards, setVisibleCards] = useState<number[]>([])
  const sectionRef = useRef<HTMLElement>(null)

  // Form state
  const [name, setName] = useState("")
  const [comment, setComment] = useState("")
  const [rating, setRating] = useState(0)
  const [isAnonymous, setIsAnonymous] = useState(false)
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [formError, setFormError] = useState("")

  useEffect(() => {
    fetch("/api/reviews")
      .then((r) => r.ok ? r.json() : [])
      .then((data) => { setReviews(Array.isArray(data) ? data : []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            reviews.forEach((_, i) => setTimeout(() => setVisibleCards((p) => [...p, i]), i * 150))
          }
        })
      },
      { threshold: 0.1 }
    )
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [reviews])

  function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setAvatarFile(file)
    setAvatarPreview(URL.createObjectURL(file))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setFormError("")
    if (rating === 0) { setFormError("Por favor selecciona una calificación"); return }
    if (!comment.trim()) { setFormError("Por favor escribe un comentario"); return }

    setSubmitting(true)
    let avatar_url: string | null = null

    if (avatarFile && !isAnonymous) {
      const formData = new FormData()
      formData.append("file", avatarFile)
      formData.append("title", `Avatar de ${name || "usuario"}`)
      formData.append("category", "Avatares")
      const uploadRes = await fetch("/api/gallery", { method: "POST", body: formData })
      if (uploadRes.ok) {
        const uploaded = await uploadRes.json()
        avatar_url = uploaded.file_url
      }
    }

    const res = await fetch("/api/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, comment, rating, avatar_url, is_anonymous: isAnonymous }),
    })

    if (res.ok) {
      const newReview = await res.json()
      setReviews((prev) => [newReview, ...prev])
      setSubmitted(true)
      setName(""); setComment(""); setRating(0); setAvatarFile(null); setAvatarPreview(null)
      setTimeout(() => setSubmitted(false), 4000)
    } else {
      const data = await res.json()
      setFormError(data.error || "Error al enviar la reseña")
    }
    setSubmitting(false)
  }

  const avgRating = reviews.length > 0
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : "—"

  return (
    <section ref={sectionRef} className="py-20 md:py-32">
      <div className="container mx-auto px-4">

        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Star className="h-4 w-4" />
            Testimonios
          </span>
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4 text-balance">
            Lo Que Dicen Nuestras Clientas
          </h2>
          {reviews.length > 0 && (
            <div className="flex items-center justify-center gap-3 mt-4">
              <StarRating value={Math.round(Number(avgRating))} />
              <span className="font-bold text-2xl text-foreground font-serif">{avgRating}</span>
              <span className="text-muted-foreground text-sm">({reviews.length} reseñas)</span>
            </div>
          )}
        </div>

        {/* Reviews Grid */}
        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : reviews.length > 0 ? (
          <div className="grid md:grid-cols-3 gap-6 mb-16">
            {reviews.map((review, index) => (
              <Card
                key={review.id}
                className={`bg-card border-border hover:border-primary/30 transition-all duration-700 hover:shadow-xl hover:shadow-primary/10 group ${
                  visibleCards.includes(index) ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                }`}
              >
                <CardContent className="p-6 md:p-8">
                  <Quote className="h-8 w-8 text-primary/30 mb-4 transition-all duration-300 group-hover:text-primary/50 group-hover:scale-110" />
                  <StarRating value={review.rating} />
                  <p className="text-muted-foreground my-4 leading-relaxed">
                    {`"${review.comment}"`}
                  </p>
                  <div className="flex items-center gap-3">
                    {review.avatar_url && !review.is_anonymous ? (
                      <div className="relative w-11 h-11 rounded-full overflow-hidden border-2 border-primary/20 flex-shrink-0">
                        <Image src={review.avatar_url} alt={review.name ?? "Usuario"} fill className="object-cover" />
                      </div>
                    ) : (
                      <div className="w-11 h-11 bg-gradient-to-br from-primary/30 to-secondary/30 rounded-full flex items-center justify-center flex-shrink-0">
                        <User className="h-5 w-5 text-primary" />
                      </div>
                    )}
                    <div>
                      <p className="font-semibold text-foreground">
                        {review.is_anonymous ? "Clienta Anónima" : (review.name || "Clienta")}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(review.created_at).toLocaleDateString("es-CO", { year: "numeric", month: "long", day: "numeric" })}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : null}

        {/* Review Form */}
        <div className="max-w-2xl mx-auto">
          <div className="bg-card border border-border rounded-3xl p-6 md:p-10 shadow-xl shadow-primary/5">
            <h3 className="font-serif text-2xl font-bold text-foreground mb-2 text-center">
              Deja tu Opinión
            </h3>
            <p className="text-muted-foreground text-sm text-center mb-8">
              Tu experiencia ayuda a otras clientas a conocernos
            </p>

            {submitted ? (
              <div className="flex flex-col items-center gap-3 py-8">
                <CheckCircle2 className="w-14 h-14 text-green-500" />
                <p className="font-semibold text-foreground text-lg">¡Gracias por tu reseña!</p>
                <p className="text-muted-foreground text-sm text-center">Tu opinión ya es visible para otras clientas.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">

                {/* Stars */}
                <div className="flex flex-col items-center gap-2">
                  <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                    ¿Cómo calificarías tu experiencia?
                  </label>
                  <div className="scale-125">
                    <StarRating value={rating} onChange={setRating} />
                  </div>
                </div>

                {/* Anonymous toggle */}
                <label className="flex items-center gap-3 cursor-pointer group">
                  <div
                    onClick={() => setIsAnonymous(!isAnonymous)}
                    className={`relative w-11 h-6 rounded-full transition-all duration-300 ${isAnonymous ? "bg-primary" : "bg-zinc-300 dark:bg-zinc-600"}`}
                  >
                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all duration-300 ${isAnonymous ? "left-6" : "left-1"}`} />
                  </div>
                  <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                    Publicar como anónima
                  </span>
                </label>

                {!isAnonymous && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">Tu nombre</label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Ej: María García"
                        className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-primary/40 transition"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                        Foto de perfil <span className="text-zinc-400 font-normal">(opcional)</span>
                      </label>
                      <label className="flex items-center gap-3 cursor-pointer px-4 py-3 rounded-xl border border-dashed border-zinc-300 dark:border-zinc-600 hover:border-primary/50 transition-colors">
                        {avatarPreview ? (
                          <div className="relative w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
                            <Image src={avatarPreview} alt="preview" fill className="object-cover" />
                          </div>
                        ) : (
                          <User className="w-5 h-5 text-zinc-400 flex-shrink-0" />
                        )}
                        <span className="text-sm text-zinc-500 truncate">
                          {avatarFile ? avatarFile.name : "Subir foto"}
                        </span>
                        <input type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
                      </label>
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">Tu comentario</label>
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    rows={4}
                    placeholder="Cuéntanos sobre tu experiencia en el salón..."
                    required
                    className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-primary/40 transition resize-none"
                  />
                </div>

                {formError && (
                  <p className="text-sm text-red-500 bg-red-50 dark:bg-red-900/20 px-4 py-3 rounded-xl">{formError}</p>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3 bg-gradient-to-r from-primary to-secondary text-primary-foreground font-semibold rounded-xl transition-all duration-200 hover:scale-[1.02] hover:shadow-lg hover:shadow-primary/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  {submitting ? "Enviando..." : "Publicar reseña"}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
