import { NextRequest, NextResponse } from "next/server"
import { getSupabaseAdmin } from "@/lib/supabase"
import { verifySession } from "@/lib/auth"

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const isAuthed = await verifySession()
  if (!isAuthed) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 })
  }

  const { id } = await params
  const supabase = getSupabaseAdmin()

  const { data: item } = await supabase
    .from("gallery_items")
    .select("file_url")
    .eq("id", id)
    .single()

  if (item?.file_url) {
    const urlParts = item.file_url.split("/gallery/")
    const fileName = urlParts[1]
    if (fileName) {
      await supabase.storage.from("gallery").remove([fileName])
    }
  }

  const { error } = await supabase.from("gallery_items").delete().eq("id", id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
