import { NextRequest, NextResponse } from "next/server"
import { getSupabaseAdmin } from "@/lib/supabase"
import { verifySession } from "@/lib/auth"

export async function GET() {
  const supabase = getSupabaseAdmin()
  const { data, error } = await supabase
    .from("gallery_items")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}

export async function POST(request: NextRequest) {
  const isAuthed = await verifySession()
  if (!isAuthed) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 })
  }

  const supabase = getSupabaseAdmin()
  const formData = await request.formData()
  const file = formData.get("file") as File
  const title = formData.get("title") as string
  const category = formData.get("category") as string

  if (!file || !title || !category) {
    return NextResponse.json({ error: "Faltan campos requeridos" }, { status: 400 })
  }

  const fileExt = file.name.split(".").pop()
  const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`
  const fileType = file.type.startsWith("video/") ? "video" : "image"
  const arrayBuffer = await file.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)

  const { error: uploadError } = await supabase.storage
    .from("gallery")
    .upload(fileName, buffer, { contentType: file.type, upsert: false })

  if (uploadError) {
    return NextResponse.json({ error: uploadError.message }, { status: 500 })
  }

  const { data: { publicUrl } } = supabase.storage.from("gallery").getPublicUrl(fileName)

  const { data, error } = await supabase
    .from("gallery_items")
    .insert({ title, category, file_url: publicUrl, file_type: fileType })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data, { status: 201 })
}
