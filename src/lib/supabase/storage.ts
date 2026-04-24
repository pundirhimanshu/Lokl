import { createClient } from '@/lib/supabase/server'

export async function uploadImage(file: File, bucket: string = 'lokl-images') {
  const supabase = await createClient()
  
  const fileExt = file.name.split('.').pop()
  const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`
  const filePath = `${fileName}`

  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(filePath, file)

  if (error) {
    console.error('>>> SUPABASE UPLOAD ERROR:', error);
    if (error.message.includes('bucket not found')) {
      throw new Error('Storage bucket "lokl-images" not found. Please create it in Supabase dashboard.')
    }
    throw new Error(`Upload failed: ${error.message}`)
  }

  const { data: { publicUrl } } = supabase.storage
    .from(bucket)
    .getPublicUrl(filePath)

  return publicUrl
}
