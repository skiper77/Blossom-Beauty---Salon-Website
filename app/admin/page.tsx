"use client"

import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import {
  Flower2, LogOut, Upload, Trash2, ImageIcon, Video, X, CheckCircle2, AlertCircle, Loader2,
  DollarSign, Pencil, Save
} from "lucide-react"
import type { GalleryItem } from "@/lib/supabase"

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

export default function AdminPage() {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [items, setItems] = useState<GalleryItem[]>([])
  const [loading, setLoading] = useState(true)

  // Upload form state
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [title, setTitle] = useState("")
  const [category, setCategory] = useState(CATEGORIES[0])
  const [uploading, setUploading] = useState(false)
  const [uploadStatus, setUploadStatus] = useState<{ type: "success" | "error"; message: string } | null>(null)

  // Delete state
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)

  // Services / prices state
  const [services, setServices] = useState<ServiceRow[]>([])
  const [editingService, setEditingService] = useState<ServiceRow | null>(null)
  const [savingService, setSavingService] = useState(false)
  const [serviceStatus, setServiceStatus] = useState<{ type: "success" | "error"; message: string } | null>(null)

  useEffect(() => {
    fetchItems()
    fetchServices()
  }, [])

  async function fetchItems() {
    setLoading(true)
    const res = await fetch("/api/gallery")
    if (res.ok) {
      const data = await res.json()
      setItems(data)
    }
    setLoading(false)
  }

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" })
    router.push("/admin/login")
    router.refresh()
  }

  function handleFileChange(file: File | null) {
    if (!file) return
    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      setUploadStatus({ type: "error", message: `El archivo es muy grande. Máximo ${MAX_FILE_SIZE_MB}MB.` })
      return
    }
    setSelectedFile(file)
    setUploadStatus(null)
    const url = URL.createObjectURL(file)
    setPreview(url)
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    setIsDragging(false)
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

    setUploading(true)
    setUploadStatus(null)

    const formData = new FormData()
    formData.append("file", selectedFile)
    formData.append("title", title.trim())
    formData.append("category", category)

    const res = await fetch("/api/gallery", { method: "POST", body: formData })

    if (res.ok) {
      setUploadStatus({ type: "success", message: "¡Archivo subido con éxito!" })
      setTitle("")
      setCategory(CATEGORIES[0])
      clearFile()
      fetchItems()
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

  async function fetchServices() {
    const res = await fetch("/api/services")
    if (res.ok) {
      const data = await res.json()
      if (Array.isArray(data)) setServices(data)
    }
  }

  async function handleSaveService(e: React.FormEvent) {
    e.preventDefault()
    if (!editingService) return
    setSavingService(true)
    setServiceStatus(null)

    const res = await fetch(`/api/services/${editingService.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        price: editingService.price,
        description: editingService.description,
        features: editingService.features,
      }),
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
              <h1 className="font-bold text-zinc-900 dark:text-white text-sm md:text-base font-serif">
                Blossom Beauty
              </h1>
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

      <main className="max-w-6xl mx-auto px-4 py-8 space-y-10">

        {/* Upload Section */}
        <section>
          <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-6 font-serif">
            Subir nuevo contenido
          </h2>

          <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-zinc-200 dark:border-zinc-800 p-6 md:p-8">
            <form onSubmit={handleUpload} className="space-y-6">

              {/* Drop Zone */}
              <div
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                onClick={() => !selectedFile && fileInputRef.current?.click()}
                className={`relative border-2 border-dashed rounded-2xl transition-all duration-200 ${
                  isDragging
                    ? "border-pink-400 bg-pink-50 dark:bg-pink-900/10"
                    : "border-zinc-200 dark:border-zinc-700 hover:border-pink-300 dark:hover:border-pink-700"
                } ${!selectedFile ? "cursor-pointer" : ""}`}
              >
                {!selectedFile ? (
                  <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                    <div className="w-14 h-14 rounded-full bg-pink-50 dark:bg-pink-900/20 flex items-center justify-center mb-4">
                      <Upload className="w-6 h-6 text-pink-400" />
                    </div>
                    <p className="text-zinc-700 dark:text-zinc-300 font-medium mb-1">
                      Arrastra tu foto o video aquí
                    </p>
                    <p className="text-zinc-400 text-sm">
                      o haz clic para seleccionar — JPG, PNG, MP4, MOV (máx. {MAX_FILE_SIZE_MB}MB)
                    </p>
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

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,video/*"
                className="hidden"
                onChange={(e) => handleFileChange(e.target.files?.[0] ?? null)}
              />

              {/* Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                    Título
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Ej: Balayage dorado"
                    required
                    className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                    Categoría
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Status */}
              {uploadStatus && (
                <div className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm ${
                  uploadStatus.type === "success"
                    ? "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400"
                    : "bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400"
                }`}>
                  {uploadStatus.type === "success"
                    ? <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                    : <AlertCircle className="w-4 h-4 flex-shrink-0" />}
                  {uploadStatus.message}
                </div>
              )}

              <button
                type="submit"
                disabled={uploading || !selectedFile}
                className="w-full md:w-auto px-8 py-3 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-pink-200 dark:shadow-pink-900/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {uploading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Subiendo...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4" />
                    Subir contenido
                  </>
                )}
              </button>
            </form>
          </div>
        </section>

        {/* Gallery Management */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-zinc-900 dark:text-white font-serif">
              Contenido publicado
            </h2>
            <span className="text-sm text-zinc-400 bg-zinc-100 dark:bg-zinc-800 px-3 py-1 rounded-full">
              {items.length} {items.length === 1 ? "elemento" : "elementos"}
            </span>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-pink-400" />
            </div>
          ) : items.length === 0 ? (
            <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-16 text-center">
              <div className="w-14 h-14 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mx-auto mb-4">
                <ImageIcon className="w-6 h-6 text-zinc-400" />
              </div>
              <p className="text-zinc-500 dark:text-zinc-400">
                Aún no hay contenido. ¡Sube tu primera foto o video!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="group relative bg-white dark:bg-zinc-900 rounded-2xl overflow-hidden shadow-sm border border-zinc-200 dark:border-zinc-800"
                >
                  {/* Thumbnail */}
                  <div className="aspect-square relative bg-zinc-100 dark:bg-zinc-800">
                    {item.file_type === "video" ? (
                      <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
                        <Video className="w-8 h-8 text-zinc-400" />
                        <span className="text-xs text-zinc-400">Video</span>
                      </div>
                    ) : (
                      <Image
                        src={item.file_url}
                        alt={item.title}
                        fill
                        className="object-cover"
                      />
                    )}

                    {/* Delete button */}
                    <button
                      onClick={() => handleDelete(item.id)}
                      disabled={deletingId === item.id}
                      className="absolute top-2 right-2 w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-lg disabled:opacity-50"
                    >
                      {deletingId === item.id
                        ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        : <Trash2 className="w-3.5 h-3.5" />}
                    </button>
                  </div>

                  {/* Info */}
                  <div className="p-3">
                    <p className="text-sm font-medium text-zinc-900 dark:text-white truncate">
                      {item.title}
                    </p>
                    <span className="inline-block mt-1 text-xs text-pink-500 bg-pink-50 dark:bg-pink-900/20 px-2 py-0.5 rounded-full">
                      {item.category}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
        {/* Services / Prices Section */}
        <section>
          <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-6 font-serif">
            Gestionar precios y servicios
          </h2>

          {/* Edit modal */}
          {editingService && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
              <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl w-full max-w-lg p-6 md:p-8">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-bold text-lg text-zinc-900 dark:text-white font-serif">
                    Editar — {SERVICE_LABELS[editingService.id] ?? editingService.id}
                  </h3>
                  <button
                    onClick={() => { setEditingService(null); setServiceStatus(null) }}
                    className="w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <form onSubmit={handleSaveService} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                      Precio
                    </label>
                    <input
                      type="text"
                      value={editingService.price}
                      onChange={(e) => setEditingService({ ...editingService, price: e.target.value })}
                      placeholder="Ej: Desde $80"
                      required
                      className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                      Descripción
                    </label>
                    <textarea
                      value={editingService.description}
                      onChange={(e) => setEditingService({ ...editingService, description: e.target.value })}
                      rows={3}
                      className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                      Características <span className="text-zinc-400 font-normal">(una por línea)</span>
                    </label>
                    <textarea
                      value={editingService.features.join("\n")}
                      onChange={(e) =>
                        setEditingService({
                          ...editingService,
                          features: e.target.value.split("\n").filter((f) => f.trim() !== ""),
                        })
                      }
                      rows={4}
                      placeholder={"Balayage\nMechas\nColor Completo"}
                      className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition resize-none font-mono text-sm"
                    />
                  </div>

                  {serviceStatus && (
                    <div className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm ${
                      serviceStatus.type === "success"
                        ? "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400"
                        : "bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400"
                    }`}>
                      {serviceStatus.type === "success"
                        ? <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                        : <AlertCircle className="w-4 h-4 flex-shrink-0" />}
                      {serviceStatus.message}
                    </div>
                  )}

                  <div className="flex gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => { setEditingService(null); setServiceStatus(null) }}
                      className="flex-1 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors font-medium"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      disabled={savingService}
                      className="flex-1 py-3 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-semibold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
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
              const defaultPrices: Record<string, string> = {
                tintes: "Desde $80", peinados: "Desde $50",
                planchados: "Desde $120", keratinas: "Desde $150",
              }
              const currentPrice = saved?.price ?? defaultPrices[serviceId]
              return (
                <div
                  key={serviceId}
                  className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-5 flex flex-col gap-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-zinc-900 dark:text-white font-serif">
                      {SERVICE_LABELS[serviceId]}
                    </span>
                    <DollarSign className="w-4 h-4 text-pink-400" />
                  </div>
                  <p className="text-2xl font-bold text-pink-500 font-serif">{currentPrice}</p>
                  {saved && (
                    <p className="text-xs text-zinc-400 line-clamp-2">{saved.description}</p>
                  )}
                  <button
                    onClick={() =>
                      setEditingService({
                        id: serviceId,
                        price: saved?.price ?? defaultPrices[serviceId],
                        description: saved?.description ?? "",
                        features: saved?.features ?? [],
                      })
                    }
                    className="mt-auto w-full py-2 rounded-xl border border-pink-200 dark:border-pink-800 text-pink-500 hover:bg-pink-50 dark:hover:bg-pink-900/20 transition-colors text-sm font-medium flex items-center justify-center gap-2"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                    Editar
                  </button>
                </div>
              )
            })}
          </div>
        </section>

      </main>
    </div>
  )
}
