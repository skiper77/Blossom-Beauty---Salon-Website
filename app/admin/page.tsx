"use client"

import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import {
  Flower2, LogOut, Upload, Trash2, ImageIcon, Video, X, CheckCircle2, AlertCircle, Loader2,
  DollarSign, Pencil, Save, Star, MessageSquare, Home, Play, Users, GraduationCap, Briefcase, Award, Plus
} from "lucide-react"
import type { GalleryItem } from "@/lib/supabase"

type Review = {
  id: string
  name: string | null
  comment: string
  rating: number
  avatar_url: string | null
  is_anonymous: boolean
  created_at: string
}

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

type CredentialForm = {
  type: "experience" | "education" | "diploma"
  title: string
  institution: string
  year: string
  description: string
}

const CATEGORIES = ["Tintes", "Peinados", "Planchados", "Keratinas", "Otro"]
const MAX_FILE_SIZE_MB = 50

const SERVICE_LABELS: Record<string, string> = {
  tintes: "Tintes",
  peinados: "Peinados",
  planchados: "Planchados",
  keratinas: "Keratinas",
}

type ServiceRow = {
  id: string
  price: string
  description: string
  features: string[]
}

type ActiveTab = "inicio" | "galeria" | "transformaciones" | "nosotros" | "precios" | "resenas" | "experiencia"

export default function AdminPage() {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const transFileRef = useRef<HTMLInputElement>(null)
  const nosFileRef = useRef<HTMLInputElement>(null)
  const credFileRef = useRef<HTMLInputElement>(null)
  const heroFileRef = useRef<HTMLInputElement>(null)

  const [items, setItems] = useState<GalleryItem[]>([])
  const [loading, setLoading] = useState(true)

  // Main gallery upload
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [title, setTitle] = useState("")
  const [category, setCategory] = useState(CATEGORIES[0])
  const [uploading, setUploading] = useState(false)
  const [uploadStatus, setUploadStatus] = useState<{ type: "success" | "error"; message: string } | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)

  // Transformaciones upload
  const [transFile, setTransFile] = useState<File | null>(null)
  const [transTitle, setTransTitle] = useState("")
  const [transUploading, setTransUploading] = useState(false)
  const [transStatus, setTransStatus] = useState<{ type: "success" | "error"; message: string } | null>(null)

  // Nosotros upload
  const [nosFile, setNosFile] = useState<File | null>(null)
  const [nosTitle, setNosTitle] = useState("")
  const [nosUploading, setNosUploading] = useState(false)
  const [nosStatus, setNosStatus] = useState<{ type: "success" | "error"; message: string } | null>(null)

  // Services / prices
  const [services, setServices] = useState<ServiceRow[]>([])
  const [editingService, setEditingService] = useState<ServiceRow | null>(null)
  const [savingService, setSavingService] = useState(false)
  const [serviceStatus, setServiceStatus] = useState<{ type: "success" | "error"; message: string } | null>(null)

  // Reviews
  const [reviews, setReviews] = useState<Review[]>([])
  const [deletingReviewId, setDeletingReviewId] = useState<string | null>(null)

  // Hero
  const [heroUploading, setHeroUploading] = useState(false)
  const [heroStatus, setHeroStatus] = useState<{ type: "success" | "error"; message: string } | null>(null)

  // Credentials / Experiencia
  const [credentials, setCredentials] = useState<Credential[]>([])
  const [credLoading, setCredLoading] = useState(false)
  const [credForm, setCredForm] = useState<CredentialForm>({
    type: "experience", title: "", institution: "", year: "", description: ""
  })
  const [credFile, setCredFile] = useState<File | null>(null)
  const [credUploading, setCredUploading] = useState(false)
  const [credStatus, setCredStatus] = useState<{ type: "success" | "error"; message: string } | null>(null)
  const [deletingCredId, setDeletingCredId] = useState<string | null>(null)

  const [activeTab, setActiveTab] = useState<ActiveTab>("inicio")

  useEffect(() => {
    fetchItems()
    fetchServices()
    fetchReviews()
    fetchCredentials()
  }, [])

  async function fetchItems() {
    setLoading(true)
    const res = await fetch("/api/gallery")
    if (res.ok) setItems(await res.json())
    setLoading(false)
  }

  async function fetchServices() {
    const res = await fetch("/api/services")
    if (res.ok) { const data = await res.json(); if (Array.isArray(data)) setServices(data) }
  }

  async function fetchReviews() {
    const res = await fetch("/api/reviews")
    if (res.ok) { const data = await res.json(); if (Array.isArray(data)) setReviews(data) }
  }

  async function fetchCredentials() {
    setCredLoading(true)
    const res = await fetch("/api/credentials")
    if (res.ok) { const data = await res.json(); if (Array.isArray(data)) setCredentials(data) }
    setCredLoading(false)
  }

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" })
    router.push("/admin/login")
    router.refresh()
  }

  // ── Main gallery upload ──
  function handleFileChange(file: File | null) {
    if (!file) return
    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      setUploadStatus({ type: "error", message: `El archivo es muy grande. Máximo ${MAX_FILE_SIZE_MB}MB.` })
      return
    }
    setSelectedFile(file)
    setUploadStatus(null)
    setPreview(URL.createObjectURL(file))
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault(); setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFileChange(file)
  }

  function clearFile() {
    setSelectedFile(null)
    if (preview) URL.revokeObjectURL(preview)
    setPreview(null)
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  async function handleUpload(e: React.FormEvent) {
    e.preventDefault()
    if (!selectedFile || !title.trim() || !category) return
    setUploading(true); setUploadStatus(null)
    const formData = new FormData()
    formData.append("file", selectedFile)
    formData.append("title", title.trim())
    formData.append("category", category)
    const res = await fetch("/api/gallery", { method: "POST", body: formData })
    if (res.ok) {
      setUploadStatus({ type: "success", message: "¡Archivo subido con éxito!" })
      setTitle(""); setCategory(CATEGORIES[0]); clearFile(); fetchItems()
    } else {
      const data = await res.json()
      setUploadStatus({ type: "error", message: data.error || "Error al subir el archivo" })
    }
    setUploading(false)
  }

  async function handleDelete(id: string) {
    if (!confirm("¿Segura que quieres eliminar este elemento?")) return
    setDeletingId(id)
    await fetch(`/api/gallery/${id}`, { method: "DELETE" })
    setItems((prev) => prev.filter((item) => item.id !== id))
    setDeletingId(null)
  }

  // ── Section-specific uploads ──
  async function uploadSectionFile(
    file: File | null, title: string, sectionCategory: string,
    setStatus: (s: { type: "success" | "error"; message: string } | null) => void,
    setUploading: (v: boolean) => void,
    onSuccess: () => void
  ) {
    if (!file || !title.trim()) return
    setUploading(true); setStatus(null)
    const formData = new FormData()
    formData.append("file", file)
    formData.append("title", title.trim())
    formData.append("category", sectionCategory)
    const res = await fetch("/api/gallery", { method: "POST", body: formData })
    if (res.ok) {
      setStatus({ type: "success", message: "¡Subido con éxito!" })
      onSuccess()
      fetchItems()
    } else {
      const data = await res.json()
      setStatus({ type: "error", message: data.error || "Error al subir" })
    }
    setUploading(false)
  }

  // ── Hero upload ──
  async function handleHeroUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setHeroUploading(true); setHeroStatus(null)
    const formData = new FormData()
    formData.append("file", file)
    formData.append("title", "Foto Hero Principal")
    formData.append("category", "Hero")
    const res = await fetch("/api/gallery", { method: "POST", body: formData })
    setHeroStatus(res.ok
      ? { type: "success", message: "¡Foto subida! Actualiza la página principal para verla." }
      : { type: "error", message: "Error al subir la foto" })
    setHeroUploading(false)
  }

  // ── Services ──
  async function handleSaveService(e: React.FormEvent) {
    e.preventDefault()
    if (!editingService) return
    setSavingService(true); setServiceStatus(null)
    const res = await fetch(`/api/services/${editingService.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ price: editingService.price, description: editingService.description, features: editingService.features }),
    })
    if (res.ok) {
      const updated = await res.json()
      setServices((prev) => prev.map((s) => (s.id === updated.id ? updated : s)))
      setServiceStatus({ type: "success", message: "¡Precio actualizado con éxito!" })
      setEditingService(null)
    } else {
      const data = await res.json()
      setServiceStatus({ type: "error", message: data.error || "Error al guardar" })
    }
    setSavingService(false)
  }

  // ── Reviews ──
  async function handleDeleteReview(id: string) {
    if (!confirm("¿Eliminar esta reseña?")) return
    setDeletingReviewId(id)
    await fetch("/api/reviews", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) })
    setReviews((prev) => prev.filter((r) => r.id !== id))
    setDeletingReviewId(null)
  }

  // ── Credentials ──
  async function handleAddCredential(e: React.FormEvent) {
    e.preventDefault()
    if (!credForm.title.trim()) return
    setCredUploading(true); setCredStatus(null)
    const formData = new FormData()
    formData.append("type", credForm.type)
    formData.append("title", credForm.title.trim())
    formData.append("institution", credForm.institution.trim())
    formData.append("year", credForm.year.trim())
    formData.append("description", credForm.description.trim())
    if (credFile) formData.append("file", credFile)
    const res = await fetch("/api/credentials", { method: "POST", body: formData })
    if (res.ok) {
      setCredStatus({ type: "success", message: "¡Agregado con éxito!" })
      setCredForm({ type: "experience", title: "", institution: "", year: "", description: "" })
      setCredFile(null)
      if (credFileRef.current) credFileRef.current.value = ""
      fetchCredentials()
    } else {
      const data = await res.json()
      setCredStatus({ type: "error", message: data.error || "Error al guardar" })
    }
    setCredUploading(false)
  }

  async function handleDeleteCredential(id: string) {
    if (!confirm("¿Eliminar este elemento?")) return
    setDeletingCredId(id)
    await fetch(`/api/credentials/${id}`, { method: "DELETE" })
    setCredentials((prev) => prev.filter((c) => c.id !== id))
    setDeletingCredId(null)
  }

  // ── Helpers ──
  const transItems = items.filter((i) => i.category === "Transformaciones")
  const nosItems = items.filter((i) => i.category === "Nosotros")

  const CREDENTIAL_TYPE_LABELS = { experience: "Experiencia", education: "Formación / Estudios", diploma: "Diploma / Certificado" }

  const tabs: { key: ActiveTab; label: string; icon: React.ElementType }[] = [
    { key: "inicio", label: "Inicio", icon: Home },
    { key: "galeria", label: "Galería", icon: ImageIcon },
    { key: "transformaciones", label: "Transformaciones", icon: Play },
    { key: "nosotros", label: "Nosotros", icon: Users },
    { key: "precios", label: "Precios", icon: DollarSign },
    { key: "resenas", label: "Reseñas", icon: MessageSquare },
    { key: "experiencia", label: "Experiencia", icon: GraduationCap },
  ]

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      {/* Header */}
      <header className="bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-pink-100 dark:bg-pink-900/30 flex items-center justify-center">
              <Flower2 className="w-5 h-5 text-pink-500" />
            </div>
            <div>
              <h1 className="font-bold text-zinc-900 dark:text-white text-sm md:text-base font-serif">ST Studio Belleza</h1>
              <p className="text-xs text-zinc-400">Panel de administración</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-sm text-zinc-500 hover:text-red-500 transition-colors px-3 py-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Cerrar sesión</span>
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8 space-y-8">

        {/* Tabs */}
        <div className="flex gap-2 flex-wrap">
          {tabs.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 ${
                activeTab === key
                  ? "bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-lg shadow-pink-200 dark:shadow-pink-900/30"
                  : "bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:border-pink-300"
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </div>

        {/* ── TAB: INICIO & HERO ── */}
        {activeTab === "inicio" && (
          <>
            <section>
              <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-6 font-serif">Foto principal (Hero)</h2>
              <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6 md:p-8">
                <p className="text-zinc-500 dark:text-zinc-400 text-sm mb-6">
                  Esta es la foto grande que aparece al inicio de la página. La más reciente que subas será la que se muestre.
                </p>
                <label className="flex flex-col items-center justify-center gap-4 border-2 border-dashed border-zinc-200 dark:border-zinc-700 rounded-2xl p-10 cursor-pointer hover:border-pink-300 transition-colors">
                  {heroUploading ? <Loader2 className="w-10 h-10 text-pink-400 animate-spin" /> : <Upload className="w-10 h-10 text-pink-400" />}
                  <div className="text-center">
                    <p className="font-medium text-zinc-700 dark:text-zinc-300">
                      {heroUploading ? "Subiendo..." : "Haz clic para subir nueva foto de inicio"}
                    </p>
                    <p className="text-zinc-400 text-sm mt-1">JPG o PNG recomendado · Orientación vertical</p>
                  </div>
                  <input ref={heroFileRef} type="file" accept="image/*" className="hidden" onChange={handleHeroUpload} disabled={heroUploading} />
                </label>
                {heroStatus && (
                  <div className={`mt-4 flex items-center gap-3 px-4 py-3 rounded-xl text-sm ${heroStatus.type === "success" ? "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400" : "bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400"}`}>
                    {heroStatus.type === "success" ? <CheckCircle2 className="w-4 h-4 flex-shrink-0" /> : <AlertCircle className="w-4 h-4 flex-shrink-0" />}
                    {heroStatus.message}
                  </div>
                )}
              </div>
            </section>

            {/* Fotos Hero existentes */}
            {items.filter((i) => i.category === "Hero").length > 0 && (
              <section>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-zinc-900 dark:text-white font-serif">Fotos de inicio guardadas</h2>
                  <span className="text-sm text-zinc-400 bg-zinc-100 dark:bg-zinc-800 px-3 py-1 rounded-full">
                    {items.filter((i) => i.category === "Hero").length} fotos
                  </span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {items.filter((i) => i.category === "Hero").map((item) => (
                    <div key={item.id} className="group relative bg-white dark:bg-zinc-900 rounded-2xl overflow-hidden shadow-sm border border-zinc-200 dark:border-zinc-800">
                      <div className="aspect-[3/4] relative bg-zinc-100 dark:bg-zinc-800">
                        <Image src={item.file_url} alt={item.title} fill className="object-cover" />
                        <button
                          onClick={() => handleDelete(item.id)}
                          disabled={deletingId === item.id}
                          className="absolute top-2 right-2 w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-lg disabled:opacity-50"
                        >
                          {deletingId === item.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                      <div className="p-3">
                        <p className="text-xs font-medium text-zinc-900 dark:text-white truncate">{item.title}</p>
                        <p className="text-xs text-zinc-400 mt-0.5">{new Date(item.created_at).toLocaleDateString("es-CO")}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </>
        )}

        {/* ── TAB: GALERÍA GENERAL ── */}
        {activeTab === "galeria" && (
          <>
            <section>
              <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-6 font-serif">Subir nuevo contenido</h2>
              <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-zinc-200 dark:border-zinc-800 p-6 md:p-8">
                <form onSubmit={handleUpload} className="space-y-6">
                  <div
                    onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={handleDrop}
                    onClick={() => !selectedFile && fileInputRef.current?.click()}
                    className={`relative border-2 border-dashed rounded-2xl transition-all duration-200 ${isDragging ? "border-pink-400 bg-pink-50 dark:bg-pink-900/10" : "border-zinc-200 dark:border-zinc-700 hover:border-pink-300 dark:hover:border-pink-700"} ${!selectedFile ? "cursor-pointer" : ""}`}
                  >
                    {!selectedFile ? (
                      <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                        <div className="w-14 h-14 rounded-full bg-pink-50 dark:bg-pink-900/20 flex items-center justify-center mb-4">
                          <Upload className="w-6 h-6 text-pink-400" />
                        </div>
                        <p className="text-zinc-700 dark:text-zinc-300 font-medium mb-1">Arrastra tu foto o video aquí</p>
                        <p className="text-zinc-400 text-sm">o haz clic — JPG, PNG, MP4, MOV (máx. {MAX_FILE_SIZE_MB}MB)</p>
                      </div>
                    ) : (
                      <div className="relative p-4">
                        {selectedFile.type.startsWith("video/") ? (
                          <div className="flex items-center gap-4 p-4 bg-zinc-50 dark:bg-zinc-800 rounded-xl">
                            <div className="w-12 h-12 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center flex-shrink-0">
                              <Video className="w-6 h-6 text-purple-500" />
                            </div>
                            <div className="min-w-0">
                              <p className="font-medium text-zinc-900 dark:text-white truncate">{selectedFile.name}</p>
                              <p className="text-sm text-zinc-400">{(selectedFile.size / 1024 / 1024).toFixed(1)} MB</p>
                            </div>
                          </div>
                        ) : (
                          <div className="relative aspect-video max-h-64 rounded-xl overflow-hidden bg-zinc-100 dark:bg-zinc-800">
                            <Image src={preview!} alt="Vista previa" fill className="object-contain" />
                          </div>
                        )}
                        <button
                          type="button"
                          onClick={(e) => { e.stopPropagation(); clearFile() }}
                          className="absolute top-6 right-6 w-8 h-8 bg-zinc-900/70 hover:bg-red-500 text-white rounded-full flex items-center justify-center transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                  <input ref={fileInputRef} type="file" accept="image/*,video/*" className="hidden" onChange={(e) => handleFileChange(e.target.files?.[0] ?? null)} />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">Título</label>
                      <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Ej: Balayage dorado" required className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">Categoría</label>
                      <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition">
                        {CATEGORIES.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
                      </select>
                    </div>
                  </div>
                  {uploadStatus && (
                    <div className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm ${uploadStatus.type === "success" ? "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400" : "bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400"}`}>
                      {uploadStatus.type === "success" ? <CheckCircle2 className="w-4 h-4 flex-shrink-0" /> : <AlertCircle className="w-4 h-4 flex-shrink-0" />}
                      {uploadStatus.message}
                    </div>
                  )}
                  <button type="submit" disabled={uploading || !selectedFile} className="w-full md:w-auto px-8 py-3 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-pink-200 dark:shadow-pink-900/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
                    {uploading ? <><Loader2 className="w-4 h-4 animate-spin" />Subiendo...</> : <><Upload className="w-4 h-4" />Subir contenido</>}
                  </button>
                </form>
              </div>
            </section>

            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-zinc-900 dark:text-white font-serif">Contenido publicado</h2>
                <span className="text-sm text-zinc-400 bg-zinc-100 dark:bg-zinc-800 px-3 py-1 rounded-full">{items.length} {items.length === 1 ? "elemento" : "elementos"}</span>
              </div>
              {loading ? (
                <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-pink-400" /></div>
              ) : items.length === 0 ? (
                <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-16 text-center">
                  <ImageIcon className="w-10 h-10 text-zinc-300 mx-auto mb-3" />
                  <p className="text-zinc-500 dark:text-zinc-400">Aún no hay contenido.</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {items.map((item) => (
                    <div key={item.id} className="group relative bg-white dark:bg-zinc-900 rounded-2xl overflow-hidden shadow-sm border border-zinc-200 dark:border-zinc-800">
                      <div className="aspect-square relative bg-zinc-100 dark:bg-zinc-800">
                        {item.file_type === "video" ? (
                          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
                            <Video className="w-8 h-8 text-zinc-400" />
                            <span className="text-xs text-zinc-400">Video</span>
                          </div>
                        ) : (
                          <Image src={item.file_url} alt={item.title} fill className="object-cover" />
                        )}
                        <button onClick={() => handleDelete(item.id)} disabled={deletingId === item.id} className="absolute top-2 right-2 w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-lg disabled:opacity-50">
                          {deletingId === item.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                      <div className="p-3">
                        <p className="text-sm font-medium text-zinc-900 dark:text-white truncate">{item.title}</p>
                        <span className="inline-block mt-1 text-xs text-pink-500 bg-pink-50 dark:bg-pink-900/20 px-2 py-0.5 rounded-full">{item.category}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </>
        )}

        {/* ── TAB: TRANSFORMACIONES ── */}
        {activeTab === "transformaciones" && (
          <>
            <section>
              <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-2 font-serif">Transformaciones Increíbles</h2>
              <p className="text-zinc-500 dark:text-zinc-400 text-sm mb-6">Sube fotos y videos de antes/después. Se muestran en la sección "Transformaciones Increíbles" de la página principal.</p>
              <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6">
                <div className="flex flex-col sm:flex-row gap-4 items-start">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">Título</label>
                    <input type="text" value={transTitle} onChange={(e) => setTransTitle(e.target.value)} placeholder="Ej: Transformación de tinte" className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition" />
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">Archivo (foto o video)</label>
                    <label className="flex items-center gap-3 px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 cursor-pointer hover:border-pink-300 transition">
                      <Upload className="w-4 h-4 text-pink-400 flex-shrink-0" />
                      <span className="text-sm text-zinc-500 truncate">{transFile ? transFile.name : "Seleccionar archivo..."}</span>
                      <input ref={transFileRef} type="file" accept="image/*,video/*" className="hidden" onChange={(e) => setTransFile(e.target.files?.[0] ?? null)} />
                    </label>
                  </div>
                </div>
                {transStatus && (
                  <div className={`mt-4 flex items-center gap-3 px-4 py-3 rounded-xl text-sm ${transStatus.type === "success" ? "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400" : "bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400"}`}>
                    {transStatus.type === "success" ? <CheckCircle2 className="w-4 h-4 flex-shrink-0" /> : <AlertCircle className="w-4 h-4 flex-shrink-0" />}
                    {transStatus.message}
                  </div>
                )}
                <button
                  onClick={() => uploadSectionFile(transFile, transTitle, "Transformaciones", setTransStatus, setTransUploading, () => { setTransTitle(""); setTransFile(null); if (transFileRef.current) transFileRef.current.value = "" })}
                  disabled={transUploading || !transFile || !transTitle.trim()}
                  className="mt-4 px-6 py-2.5 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-semibold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 text-sm"
                >
                  {transUploading ? <><Loader2 className="w-4 h-4 animate-spin" />Subiendo...</> : <><Upload className="w-4 h-4" />Subir</>}
                </button>
              </div>
            </section>

            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-zinc-900 dark:text-white font-serif">Transformaciones publicadas</h2>
                <span className="text-sm text-zinc-400 bg-zinc-100 dark:bg-zinc-800 px-3 py-1 rounded-full">{transItems.length} elementos</span>
              </div>
              {transItems.length === 0 ? (
                <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-16 text-center">
                  <Play className="w-10 h-10 text-zinc-300 mx-auto mb-3" />
                  <p className="text-zinc-400 text-sm">Aún no hay transformaciones. ¡Sube la primera!</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {transItems.map((item) => (
                    <div key={item.id} className="group relative bg-white dark:bg-zinc-900 rounded-2xl overflow-hidden shadow-sm border border-zinc-200 dark:border-zinc-800">
                      <div className="aspect-video relative bg-zinc-100 dark:bg-zinc-800">
                        {item.file_type === "video" ? (
                          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
                            <Video className="w-8 h-8 text-zinc-400" /><span className="text-xs text-zinc-400">Video</span>
                          </div>
                        ) : (
                          <Image src={item.file_url} alt={item.title} fill className="object-cover" />
                        )}
                        <button onClick={() => handleDelete(item.id)} disabled={deletingId === item.id} className="absolute top-2 right-2 w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shadow-lg disabled:opacity-50">
                          {deletingId === item.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                      <div className="p-3">
                        <p className="text-sm font-medium text-zinc-900 dark:text-white truncate">{item.title}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </>
        )}

        {/* ── TAB: NOSOTROS ── */}
        {activeTab === "nosotros" && (
          <>
            <section>
              <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-2 font-serif">Fotos de "Sobre Nosotras"</h2>
              <p className="text-zinc-500 dark:text-zinc-400 text-sm mb-6">
                Sube hasta 4 fotos del salón o del equipo. Se muestran en la sección "Sobre Nosotros" de la página.
                {nosItems.length >= 4 && <span className="ml-2 text-amber-500 font-medium">Ya tienes 4 fotos. Elimina alguna antes de subir más.</span>}
              </p>
              {nosItems.length < 4 && (
                <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6">
                  <div className="flex flex-col sm:flex-row gap-4 items-start">
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">Título</label>
                      <input type="text" value={nosTitle} onChange={(e) => setNosTitle(e.target.value)} placeholder="Ej: El salón" className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition" />
                    </div>
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">Foto</label>
                      <label className="flex items-center gap-3 px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 cursor-pointer hover:border-pink-300 transition">
                        <Upload className="w-4 h-4 text-pink-400 flex-shrink-0" />
                        <span className="text-sm text-zinc-500 truncate">{nosFile ? nosFile.name : "Seleccionar foto..."}</span>
                        <input ref={nosFileRef} type="file" accept="image/*" className="hidden" onChange={(e) => setNosFile(e.target.files?.[0] ?? null)} />
                      </label>
                    </div>
                  </div>
                  {nosStatus && (
                    <div className={`mt-4 flex items-center gap-3 px-4 py-3 rounded-xl text-sm ${nosStatus.type === "success" ? "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400" : "bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400"}`}>
                      {nosStatus.type === "success" ? <CheckCircle2 className="w-4 h-4 flex-shrink-0" /> : <AlertCircle className="w-4 h-4 flex-shrink-0" />}
                      {nosStatus.message}
                    </div>
                  )}
                  <button
                    onClick={() => uploadSectionFile(nosFile, nosTitle, "Nosotros", setNosStatus, setNosUploading, () => { setNosTitle(""); setNosFile(null); if (nosFileRef.current) nosFileRef.current.value = "" })}
                    disabled={nosUploading || !nosFile || !nosTitle.trim()}
                    className="mt-4 px-6 py-2.5 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-semibold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 text-sm"
                  >
                    {nosUploading ? <><Loader2 className="w-4 h-4 animate-spin" />Subiendo...</> : <><Upload className="w-4 h-4" />Subir</>}
                  </button>
                </div>
              )}
            </section>

            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-zinc-900 dark:text-white font-serif">Fotos publicadas</h2>
                <span className="text-sm text-zinc-400 bg-zinc-100 dark:bg-zinc-800 px-3 py-1 rounded-full">{nosItems.length} / 4</span>
              </div>
              {nosItems.length === 0 ? (
                <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-16 text-center">
                  <Users className="w-10 h-10 text-zinc-300 mx-auto mb-3" />
                  <p className="text-zinc-400 text-sm">Aún no hay fotos de la sección "Sobre Nosotros".</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {nosItems.map((item) => (
                    <div key={item.id} className="group relative bg-white dark:bg-zinc-900 rounded-2xl overflow-hidden shadow-sm border border-zinc-200 dark:border-zinc-800">
                      <div className="aspect-square relative bg-zinc-100 dark:bg-zinc-800">
                        <Image src={item.file_url} alt={item.title} fill className="object-cover" />
                        <button onClick={() => handleDelete(item.id)} disabled={deletingId === item.id} className="absolute top-2 right-2 w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shadow-lg disabled:opacity-50">
                          {deletingId === item.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                      <div className="p-3">
                        <p className="text-sm font-medium text-zinc-900 dark:text-white truncate">{item.title}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </>
        )}

        {/* ── TAB: PRECIOS ── */}
        {activeTab === "precios" && (
          <section>
            <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-6 font-serif">Gestionar precios y servicios</h2>
            {editingService && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl w-full max-w-lg p-6 md:p-8">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="font-bold text-lg text-zinc-900 dark:text-white font-serif">
                      Editar — {SERVICE_LABELS[editingService.id] ?? editingService.id}
                    </h3>
                    <button onClick={() => { setEditingService(null); setServiceStatus(null) }} className="w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <form onSubmit={handleSaveService} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">Precio</label>
                      <input type="text" value={editingService.price} onChange={(e) => setEditingService({ ...editingService, price: e.target.value })} placeholder="Ej: Desde $80" required className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">Descripción</label>
                      <textarea value={editingService.description} onChange={(e) => setEditingService({ ...editingService, description: e.target.value })} rows={3} className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition resize-none" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">Características <span className="text-zinc-400 font-normal">(una por línea)</span></label>
                      <textarea value={editingService.features.join("\n")} onChange={(e) => setEditingService({ ...editingService, features: e.target.value.split("\n").filter((f) => f.trim() !== "") })} rows={4} placeholder={"Balayage\nMechas\nColor Completo"} className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition resize-none font-mono text-sm" />
                    </div>
                    {serviceStatus && (
                      <div className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm ${serviceStatus.type === "success" ? "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400" : "bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400"}`}>
                        {serviceStatus.type === "success" ? <CheckCircle2 className="w-4 h-4 flex-shrink-0" /> : <AlertCircle className="w-4 h-4 flex-shrink-0" />}
                        {serviceStatus.message}
                      </div>
                    )}
                    <div className="flex gap-3 pt-2">
                      <button type="button" onClick={() => { setEditingService(null); setServiceStatus(null) }} className="flex-1 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors font-medium">Cancelar</button>
                      <button type="submit" disabled={savingService} className="flex-1 py-3 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-semibold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                        {savingService ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        {savingService ? "Guardando..." : "Guardar cambios"}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {Object.keys(SERVICE_LABELS).map((serviceId) => {
                const saved = services.find((s) => s.id === serviceId)
                const defaultPrices: Record<string, string> = { tintes: "Desde $80", peinados: "Desde $50", planchados: "Desde $120", keratinas: "Desde $150" }
                return (
                  <div key={serviceId} className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-5 flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-zinc-900 dark:text-white font-serif">{SERVICE_LABELS[serviceId]}</span>
                      <DollarSign className="w-4 h-4 text-pink-400" />
                    </div>
                    <p className="text-2xl font-bold text-pink-500 font-serif">{saved?.price ?? defaultPrices[serviceId]}</p>
                    {saved && <p className="text-xs text-zinc-400 line-clamp-2">{saved.description}</p>}
                    <button
                      onClick={() => setEditingService({ id: serviceId, price: saved?.price ?? defaultPrices[serviceId], description: saved?.description ?? "", features: saved?.features ?? [] })}
                      className="mt-auto w-full py-2 rounded-xl border border-pink-200 dark:border-pink-800 text-pink-500 hover:bg-pink-50 dark:hover:bg-pink-900/20 transition-colors text-sm font-medium flex items-center justify-center gap-2"
                    >
                      <Pencil className="w-3.5 h-3.5" />Editar
                    </button>
                  </div>
                )
              })}
            </div>
          </section>
        )}

        {/* ── TAB: RESEÑAS ── */}
        {activeTab === "resenas" && (
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-zinc-900 dark:text-white font-serif">Reseñas de clientas</h2>
              <span className="text-sm text-zinc-400 bg-zinc-100 dark:bg-zinc-800 px-3 py-1 rounded-full">{reviews.length} reseña{reviews.length !== 1 ? "s" : ""}</span>
            </div>
            {reviews.length === 0 ? (
              <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-16 text-center">
                <MessageSquare className="w-10 h-10 text-zinc-300 mx-auto mb-3" />
                <p className="text-zinc-400">Aún no hay reseñas publicadas</p>
              </div>
            ) : (
              <div className="space-y-4">
                {reviews.map((review) => (
                  <div key={review.id} className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-5 flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-pink-100 dark:bg-pink-900/30 flex items-center justify-center flex-shrink-0">
                      <span className="font-bold text-pink-500 text-sm">{review.is_anonymous ? "A" : (review.name?.charAt(0) ?? "?")}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-semibold text-zinc-900 dark:text-white text-sm">{review.is_anonymous ? "Anónima" : (review.name ?? "Sin nombre")}</p>
                        <div className="flex gap-0.5">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star key={i} className={`w-3.5 h-3.5 ${i < review.rating ? "fill-primary text-primary" : "text-zinc-300"}`} />
                          ))}
                        </div>
                        <span className="text-xs text-zinc-400">{new Date(review.created_at).toLocaleDateString("es-CO")}</span>
                      </div>
                      <p className="text-zinc-600 dark:text-zinc-400 text-sm mt-1 line-clamp-3">{review.comment}</p>
                    </div>
                    <button onClick={() => handleDeleteReview(review.id)} disabled={deletingReviewId === review.id} className="flex-shrink-0 w-8 h-8 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 text-red-500 rounded-lg flex items-center justify-center transition-colors disabled:opacity-50">
                      {deletingReviewId === review.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* ── TAB: EXPERIENCIA ── */}
        {activeTab === "experiencia" && (
          <>
            <section>
              <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-2 font-serif">Agregar experiencia o formación</h2>
              <p className="text-zinc-500 dark:text-zinc-400 text-sm mb-6">Agrega experiencia laboral, estudios y diplomas. Se muestran en la sección "Mi Experiencia y Formación" de la página.</p>
              <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6">
                <form onSubmit={handleAddCredential} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">Tipo</label>
                      <select value={credForm.type} onChange={(e) => setCredForm({ ...credForm, type: e.target.value as CredentialForm["type"] })} className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition">
                        <option value="experience">Experiencia laboral</option>
                        <option value="education">Formación / Estudios</option>
                        <option value="diploma">Diploma / Certificado</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">Título <span className="text-red-400">*</span></label>
                      <input type="text" value={credForm.title} onChange={(e) => setCredForm({ ...credForm, title: e.target.value })} placeholder="Ej: Estilista Profesional" required className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">Institución / Empresa</label>
                      <input type="text" value={credForm.institution} onChange={(e) => setCredForm({ ...credForm, institution: e.target.value })} placeholder="Ej: Academia de Belleza XYZ" className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">Año</label>
                      <input type="text" value={credForm.year} onChange={(e) => setCredForm({ ...credForm, year: e.target.value })} placeholder="Ej: 2022 o 2020 – 2023" className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">Descripción</label>
                    <textarea value={credForm.description} onChange={(e) => setCredForm({ ...credForm, description: e.target.value })} rows={3} placeholder="Describe brevemente esta experiencia o formación..." className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition resize-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                      Imagen del diploma <span className="text-zinc-400 font-normal">(opcional — solo para diplomas)</span>
                    </label>
                    <label className="flex items-center gap-3 px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 cursor-pointer hover:border-pink-300 transition">
                      <Award className="w-4 h-4 text-amber-400 flex-shrink-0" />
                      <span className="text-sm text-zinc-500 truncate">{credFile ? credFile.name : "Seleccionar imagen del diploma..."}</span>
                      <input ref={credFileRef} type="file" accept="image/*" className="hidden" onChange={(e) => setCredFile(e.target.files?.[0] ?? null)} />
                    </label>
                  </div>
                  {credStatus && (
                    <div className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm ${credStatus.type === "success" ? "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400" : "bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400"}`}>
                      {credStatus.type === "success" ? <CheckCircle2 className="w-4 h-4 flex-shrink-0" /> : <AlertCircle className="w-4 h-4 flex-shrink-0" />}
                      {credStatus.message}
                    </div>
                  )}
                  <button type="submit" disabled={credUploading || !credForm.title.trim()} className="px-6 py-2.5 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-semibold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 text-sm">
                    {credUploading ? <><Loader2 className="w-4 h-4 animate-spin" />Guardando...</> : <><Plus className="w-4 h-4" />Agregar</>}
                  </button>
                </form>
              </div>
            </section>

            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-zinc-900 dark:text-white font-serif">Trayectoria publicada</h2>
                <span className="text-sm text-zinc-400 bg-zinc-100 dark:bg-zinc-800 px-3 py-1 rounded-full">{credentials.length} elementos</span>
              </div>
              {credLoading ? (
                <div className="flex justify-center py-16"><Loader2 className="w-8 h-8 animate-spin text-pink-400" /></div>
              ) : credentials.length === 0 ? (
                <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-16 text-center">
                  <GraduationCap className="w-10 h-10 text-zinc-300 mx-auto mb-3" />
                  <p className="text-zinc-400 text-sm">Aún no hay experiencia ni formación. ¡Agrega la primera!</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {credentials.map((cred) => {
                    const Icon = cred.type === "experience" ? Briefcase : cred.type === "education" ? GraduationCap : Award
                    return (
                      <div key={cred.id} className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-4 flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-pink-50 dark:bg-pink-900/20 flex items-center justify-center flex-shrink-0">
                          <Icon className="w-5 h-5 text-pink-500" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className="font-semibold text-zinc-900 dark:text-white text-sm truncate">{cred.title}</p>
                            <span className="text-xs bg-pink-50 dark:bg-pink-900/20 text-pink-500 px-2 py-0.5 rounded-full flex-shrink-0">
                              {CREDENTIAL_TYPE_LABELS[cred.type]}
                            </span>
                          </div>
                          <div className="flex items-center gap-3 mt-0.5">
                            {cred.institution && <p className="text-xs text-zinc-500 truncate">{cred.institution}</p>}
                            {cred.year && <p className="text-xs text-zinc-400">{cred.year}</p>}
                          </div>
                          {cred.description && <p className="text-xs text-zinc-400 mt-1 line-clamp-1">{cred.description}</p>}
                        </div>
                        {cred.file_url && (
                          <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 border border-zinc-200 dark:border-zinc-700">
                            <Image src={cred.file_url} alt="diploma" fill className="object-cover" />
                          </div>
                        )}
                        <button onClick={() => handleDeleteCredential(cred.id)} disabled={deletingCredId === cred.id} className="flex-shrink-0 w-8 h-8 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 text-red-500 rounded-lg flex items-center justify-center transition-colors disabled:opacity-50">
                          {deletingCredId === cred.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    )
                  })}
                </div>
              )}
            </section>
          </>
        )}

      </main>
    </div>
  )
}
