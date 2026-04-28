import { NextRequest, NextResponse } from "next/server"
import { getSupabaseAdmin } from "@/lib/supabase"
import { verifySession } from "@/lib/auth"

export async function GET() {
  const supabase = getSupabaseAdmin()
  const { data, error } = await supabase
    .from("reviews")
    .select("*")
    .eq("is_approved", true)
    .order("created_at", { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function POST(request: NextRequest) {
  const body = await request.json()
  const { name, comment, rating, avatar_url, is_anonymous } = body

  if (!comment || !rating || rating < 1 || rating > 5) {
    return NextResponse.json({ error: "Comentario y calificación son requeridos" }, { status: 400 })
  }

  const supabase = getSupabaseAdmin()
  const { data, error } = await supabase
    .from("reviews")
    .insert({
      name: is_anonymous ? null : (name || "Anónimo"),
      comment,
      rating,
      avatar_url: avatar_url || null,
      is_anonymous: !!is_anonymous,
      is_approved: true,
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data, { status: 201 })
}

export async function DELETE(request: NextRequest) {
  const isAuthed = await verifySession()
  if (!isAuthed) return NextResponse.json({ error: "No autorizado" }, { status: 401 })

  const { id } = await request.json()
  const supabase = getSupabaseAdmin()
  const { error } = await supabase.from("reviews").delete().eq("id", id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
