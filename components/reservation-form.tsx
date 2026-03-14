"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Send, CheckCircle } from "lucide-react"

const serviceDetails = {
  coloring: {
    name: "Tintes",
    fields: ["color", "tipo"]
  },
  hairstyles: {
    name: "Peinados",
    fields: ["tipo", "ocasion"]
  },
  straightening: {
    name: "Planchados",
    fields: ["tipo"]
  },
  keratin: {
    name: "Keratinas",
    fields: ["tipo"]
  }
}

export function ReservationForm() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    service: "",
    color: "",
    tipo: "",
    ocasion: "",
    notes: ""
  })
  
  const [submitted, setSubmitted] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    // Construir mensaje para WhatsApp
    let message = `¡Hola! Me gustaría agendar una cita:%0A%0A`
    message += `*Datos del Cliente:%0A`
    message += `Nombre:* ${formData.name}%0A`
    message += `*Teléfono:* ${formData.phone}%0A%0A`
    message += `*Servicio:* ${serviceDetails[formData.service as keyof typeof serviceDetails]?.name || formData.service}%0A`
    
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
        service: "",
        color: "",
        tipo: "",
        ocasion: "",
        notes: ""
      })
    }, 3000)
  }

  const selectedService = formData.service as keyof typeof serviceDetails

  return (
    <div className="w-full max-w-2xl mx-auto">
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="font-serif text-2xl text-foreground">
            Agendar Cita
          </CardTitle>
          <p className="text-sm text-muted-foreground mt-2">
            Completa el formulario y envía directamente a WhatsApp
          </p>
        </CardHeader>
        <CardContent>
          {submitted ? (
            <div className="text-center py-8">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
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
                  <Input 
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Maria Garcia" 
                    required
                    className="bg-muted/50 border-border focus:border-primary rounded-xl transition-all duration-300 focus:scale-[1.02]"
                  />
                </div>
                <div className="group">
                  <label htmlFor="phone" className="text-sm font-medium text-foreground mb-2 block">
                    Teléfono
                  </label>
                  <Input 
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+57 310 000 0000" 
                    required
                    className="bg-muted/50 border-border focus:border-primary rounded-xl transition-all duration-300 focus:scale-[1.02]"
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
                  className="w-full h-10 px-3 bg-muted/50 border border-border rounded-xl text-foreground focus:border-primary focus:outline-none transition-all duration-300 focus:scale-[1.02]"
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
                    <Input 
                      id="color"
                      name="color"
                      value={formData.color}
                      onChange={handleChange}
                      placeholder="Ej: Rubio ceniza, Castaño, Pelirrojo" 
                      required
                      className="bg-muted/50 border-border focus:border-primary rounded-xl transition-all duration-300 focus:scale-[1.02]"
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
                      className="w-full h-10 px-3 bg-muted/50 border border-border rounded-xl text-foreground focus:border-primary focus:outline-none transition-all duration-300 focus:scale-[1.02]"
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
                      className="w-full h-10 px-3 bg-muted/50 border border-border rounded-xl text-foreground focus:border-primary focus:outline-none transition-all duration-300 focus:scale-[1.02]"
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
                    <Input 
                      id="ocasion"
                      name="ocasion"
                      value={formData.ocasion}
                      onChange={handleChange}
                      placeholder="Ej: Boda, Fiesta, Evento" 
                      required
                      className="bg-muted/50 border-border focus:border-primary rounded-xl transition-all duration-300 focus:scale-[1.02]"
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
                    className="w-full h-10 px-3 bg-muted/50 border border-border rounded-xl text-foreground focus:border-primary focus:outline-none transition-all duration-300 focus:scale-[1.02]"
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
                    className="w-full h-10 px-3 bg-muted/50 border border-border rounded-xl text-foreground focus:border-primary focus:outline-none transition-all duration-300 focus:scale-[1.02]"
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
                <Textarea 
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  placeholder="Cuéntanos más sobre lo que deseas o cualquier detalle importante..." 
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
                Enviar a WhatsApp
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
