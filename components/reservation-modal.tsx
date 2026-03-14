"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ReservationForm } from "./reservation-form"

interface ReservationModalProps {
  isOpen: boolean
  onClose: () => void
  service?: string
}

// Mapeo de nombres de servicios a valores de formulario
const serviceMapping = {
  "Tintes": "coloring",
  "Peinados": "hairstyles",
  "Planchados": "straightening",
  "Keratinas": "keratin",
  "coloring": "coloring",
  "hairstyles": "hairstyles",
  "straightening": "straightening",
  "keratin": "keratin"
}

export function ReservationModal({ isOpen, onClose, service }: ReservationModalProps) {
  const mappedService = service ? (serviceMapping[service as keyof typeof serviceMapping] || "") : ""
  
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    service: mappedService,
    color: "",
    tipo: "",
    ocasion: "",
    notes: ""
  })
  
  const [submitted, setSubmitted] = useState(false)

  // Sincronizar servicio cuando cambie
  const handleOpenChange = (open: boolean) => {
    if (open) {
      setFormData(prev => ({
        ...prev,
        service: mappedService
      }))
    } else {
      onClose()
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const serviceNames = {
      coloring: "Tintes",
      hairstyles: "Peinados",
      straightening: "Planchados",
      keratin: "Keratinas"
    }

    // Construir mensaje para WhatsApp
    let message = `¡Hola! Me gustaría agendar una cita:%0A%0A`
    message += `*Datos del Cliente:%0A`
    message += `Nombre:* ${formData.name}%0A`
    message += `*Teléfono:* ${formData.phone}%0A%0A`
    message += `*Servicio:* ${serviceNames[formData.service as keyof typeof serviceNames] || formData.service}%0A`
    
    if (formData.color) {
      message += `*Color deseado:* ${formData.color}%0A`
    }
    if (formData.tipo) {
      message += `*Tipo:* ${formData.tipo}%0A`
    }
    if (formData.ocasion) {
      message += `*Ocasión:* ${formData.ocasion}%0A`
    }
    if (formData.notes) {
      message += `*Notas adicionales:* ${formData.notes}%0A`
    }

    // Abrir WhatsApp con mensaje
    const whatsappLink = `https://wa.me/573164136033?text=${message}`
    window.open(whatsappLink, "_blank")
    
    setSubmitted(true)
    setTimeout(() => {
      setSubmitted(false)
      setFormData({
        name: "",
        phone: "",
        service: service || "",
        color: "",
        tipo: "",
        ocasion: "",
        notes: ""
      })
      onClose()
    }, 2000)
  }

  const serviceNames = {
    coloring: "Tintes",
    hairstyles: "Peinados",
    straightening: "Planchados",
    keratin: "Keratinas"
  }

  const selectedService = formData.service as keyof typeof serviceNames

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-serif text-2xl text-foreground">
            Agendar Cita
          </DialogTitle>
          <p className="text-sm text-muted-foreground mt-2">
            Completa el formulario y envía directamente a WhatsApp
          </p>
        </DialogHeader>

        {submitted ? (
          <div className="text-center py-8 flex flex-col items-center justify-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <h3 className="font-serif text-xl font-bold text-foreground mb-2">
              ¡Cita enviada!
            </h3>
            <p className="text-muted-foreground">
              Te conectaremos pronto por WhatsApp para confirmar tu cita.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Datos personales */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="group">
                <label htmlFor="name" className="text-sm font-medium text-foreground mb-2 block">
                  Tu Nombre
                </label>
                <input 
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Maria Garcia" 
                  required
                  type="text"
                  className="w-full px-3 h-10 bg-muted/50 border border-border rounded-xl text-foreground focus:border-primary focus:outline-none transition-all duration-300"
                />
              </div>
              <div className="group">
                <label htmlFor="phone" className="text-sm font-medium text-foreground mb-2 block">
                  Teléfono
                </label>
                <input 
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+57 310 000 0000" 
                  required
                  type="tel"
                  className="w-full px-3 h-10 bg-muted/50 border border-border rounded-xl text-foreground focus:border-primary focus:outline-none transition-all duration-300"
                />
              </div>
            </div>

            {/* Selección de servicio */}
            <div>
              <label htmlFor="service" className="text-sm font-medium text-foreground mb-2 block">
                Servicio de Interés *
              </label>
              <select 
                id="service"
                name="service"
                value={formData.service}
                onChange={handleChange}
                required
                className="w-full h-10 px-3 bg-muted/50 border border-border rounded-xl text-foreground focus:border-primary focus:outline-none transition-all duration-300"
              >
                <option value="">Selecciona un servicio</option>
                <option value="coloring">Tintes</option>
                <option value="hairstyles">Peinados</option>
                <option value="straightening">Planchados</option>
                <option value="keratin">Keratinas</option>
              </select>
            </div>

            {/* Campos dinámicos según servicio */}
            {selectedService === "coloring" && (
              <>
                <div>
                  <label htmlFor="color" className="text-sm font-medium text-foreground mb-2 block">
                    Color deseado *
                  </label>
                  <input 
                    id="color"
                    name="color"
                    value={formData.color}
                    onChange={handleChange}
                    placeholder="Ej: Rubio ceniza, Castaño, Pelirrojo" 
                    required
                    type="text"
                    className="w-full px-3 h-10 bg-muted/50 border border-border rounded-xl text-foreground focus:border-primary focus:outline-none transition-all duration-300"
                  />
                </div>
                <div>
                  <label htmlFor="tipo" className="text-sm font-medium text-foreground mb-2 block">
                    Tipo de Tinte *
                  </label>
                  <select 
                    id="tipo"
                    name="tipo"
                    value={formData.tipo}
                    onChange={handleChange}
                    required
                    className="w-full h-10 px-3 bg-muted/50 border border-border rounded-xl text-foreground focus:border-primary focus:outline-none transition-all duration-300"
                  >
                    <option value="">Selecciona tipo</option>
                    <option value="balayage">Balayage</option>
                    <option value="mechas">Mechas</option>
                    <option value="completo">Color Completo</option>
                    <option value="correccion">Corrección de Color</option>
                  </select>
                </div>
              </>
            )}

            {selectedService === "hairstyles" && (
              <>
                <div>
                  <label htmlFor="tipo" className="text-sm font-medium text-foreground mb-2 block">
                    Tipo de Peinado *
                  </label>
                  <select 
                    id="tipo"
                    name="tipo"
                    value={formData.tipo}
                    onChange={handleChange}
                    required
                    className="w-full h-10 px-3 bg-muted/50 border border-border rounded-xl text-foreground focus:border-primary focus:outline-none transition-all duration-300"
                  >
                    <option value="">Selecciona tipo</option>
                    <option value="novia">Estilo de Novia</option>
                    <option value="recogido">Recogido</option>
                    <option value="trenzas">Trenzas</option>
                    <option value="secado">Secado</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="ocasion" className="text-sm font-medium text-foreground mb-2 block">
                    Ocasión *
                  </label>
                  <input 
                    id="ocasion"
                    name="ocasion"
                    value={formData.ocasion}
                    onChange={handleChange}
                    placeholder="Ej: Boda, Fiesta, Evento" 
                    required
                    type="text"
                    className="w-full px-3 h-10 bg-muted/50 border border-border rounded-xl text-foreground focus:border-primary focus:outline-none transition-all duration-300"
                  />
                </div>
              </>
            )}

            {selectedService === "straightening" && (
              <div>
                <label htmlFor="tipo" className="text-sm font-medium text-foreground mb-2 block">
                  Tipo de Planchado *
                </label>
                <select 
                  id="tipo"
                  name="tipo"
                  value={formData.tipo}
                  onChange={handleChange}
                  required
                  className="w-full h-10 px-3 bg-muted/50 border border-border rounded-xl text-foreground focus:border-primary focus:outline-none transition-all duration-300"
                >
                  <option value="">Selecciona tipo</option>
                  <option value="brasileño">Brasileño</option>
                  <option value="japones">Japonés</option>
                  <option value="tradicional">Tradicional</option>
                </select>
              </div>
            )}

            {selectedService === "keratin" && (
              <div>
                <label htmlFor="tipo" className="text-sm font-medium text-foreground mb-2 block">
                  Tipo de Queratina *
                </label>
                <select 
                  id="tipo"
                  name="tipo"
                  value={formData.tipo}
                  onChange={handleChange}
                  required
                  className="w-full h-10 px-3 bg-muted/50 border border-border rounded-xl text-foreground focus:border-primary focus:outline-none transition-all duration-300"
                >
                  <option value="">Selecciona tipo</option>
                  <option value="estandar">Queratina Estándar</option>
                  <option value="premium">Queratina Premium</option>
                  <option value="tratamiento">Tratamiento Capilar</option>
                </select>
              </div>
            )}

            {/* Notas adicionales */}
            <div>
              <label htmlFor="notes" className="text-sm font-medium text-foreground mb-2 block">
                Notas Adicionales
              </label>
              <textarea 
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                placeholder="Cuéntanos más sobre lo que deseas o cualquier detalle importante..." 
                rows={4}
                className="w-full px-3 py-2 bg-muted/50 border border-border rounded-xl text-foreground focus:border-primary focus:outline-none resize-none transition-all duration-300"
              />
            </div>

            <Button 
              type="submit" 
              size="lg"
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-full transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-primary/25"
            >
              Enviar a WhatsApp
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
