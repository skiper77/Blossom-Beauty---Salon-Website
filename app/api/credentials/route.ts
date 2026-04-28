import { NextRequest, NextResponse } from "next/server"
import { getSupabaseAdmin } from "@/lib/supabase"
import { verifySession } from "@/lib/auth"

export async function GET() {
  const supabase = getSupabaseAdmin()
  const { data, error } = await supabase
    .from("credentials")
    .select("*")
    .order("created_at", { ascending: false })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function POST(request: NextRequest) {
  const isAuthed = await verifySession()
  if (!isAuthed) return NextResponse.json({ error: "No autorizado" }, { status: 401 })

  const formData = await request.formData()
  const file = formData.get("file") as File | null
  const type = formData.get("type") as string
  const title = formData.get("title") as string
  const institution = formData.get("institution") as string
  const year = formData.get("year") as string
  const description = formData.get("description") as string

  if (!title || !type) return NextResponse.json({ error: "Título y tipo son requeridos" }, { status: 400 })

  const supabase = getSupabaseAdmin()
  let file_url: string | null = null
  let file_type: string | null = null

  if (file && file.size > 0) {
    const fileExt = file.name.split(".").pop()
    const fileName = `credentials/${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`
    file_type = file.type.startsWith("video/") ? "video" : "image"
    const arrayBuffer = await file.arrayBuffer()
    const { error: uploadError } = await supabase.storage
      .from("gallery")
      .upload(fileName, Buffer.from(arrayBuffer), { contentType: file.type })
    if (!uploadError) {
      const { data: { publicUrl } } = supabase.storage.from("gallery").getPublicUrl(fileName)
      file_url = publicUrl
    }
  }

  const { data, error } = await supabase
    .from("credentials")
    .insert({ type, title, institution, year, description, file_url, file_type })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data, { status: 201 })
}
