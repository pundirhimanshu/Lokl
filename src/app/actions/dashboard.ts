// @ts-nocheck
'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath, unstable_noStore as noStore } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { uploadImage } from '@/lib/supabase/storage'

async function getAuthenticatedUser() {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error || !user) throw new Error('Unauthorized')
  return user
}

export async function getDashboardData() {
  noStore();
  try {
    const user = await getAuthenticatedUser()
    console.log(">>> getDashboardData START for user:", user.id);
    const store = await prisma.store.findUnique({
      where: { userId: user.id },
      include: {
        products: true,
        visits: true,
        user: true,
      },
    })
    console.log(">>> Query DONE. Result:", store ? "Found store" : "No store");
    return { store, user: store?.user, success: true }
  } catch (error: any) {
    console.error(">>> getDashboardData ERROR:", error.message || error);
    return { success: false, error: 'Failed to fetch data' }
  } finally {
    console.log(">>> getDashboardData END");
  }
}

export async function updateStore(formData: FormData) {
  const name = formData.get('name') as string
  const phoneNumber = formData.get('phoneNumber') as string
  const description = formData.get('description') as string
  const address = formData.get('address') as string
  const logoFile = formData.get('logo') as File

  try {
    const user = await getAuthenticatedUser()
    
    let logoUrl = undefined
    if (logoFile && logoFile.size > 0) {
      logoUrl = await uploadImage(logoFile)
    }

    // Ensure the user exists first (Foreign Key requirement)
    await prisma.user.upsert({
      where: { id: user.id },
      update: {},
      create: {
        id: user.id,
        email: user.email!,
        name: user.user_metadata.full_name || 'Store Owner'
      }
    });

    await prisma.store.upsert({
      where: { userId: user.id },
      update: { 
        name, 
        phoneNumber, 
        description, 
        address,
        ...(logoUrl && { logoUrl })
      },
      create: { 
        name, 
        phoneNumber, 
        description, 
        address, 
        userId: user.id,
        logoUrl: logoUrl || "",
        url: name ? `${name.toLowerCase().replace(/\s+/g, '-')}-${user.id.slice(0, 4)}` : `store-${user.id.slice(0, 4)}`
      },
    })
    revalidatePath('/dashboard')
    return { success: true }
  } catch (error: any) {
    console.error('Error updating store:', error)
    return { success: false, error: error.message || 'Failed to update store' }
  }
}

export async function addProduct(formData: FormData) {
  const name = formData.get('name') as string
  const price = parseFloat(formData.get('price') as string)
  const description = formData.get('description') as string
  const imageFile = formData.get('image') as File

  try {
    const user = await getAuthenticatedUser()

    let imageUrl = undefined
    if (imageFile && imageFile.size > 0) {
      imageUrl = await uploadImage(imageFile)
    }

    // Ensure the user exists first (Foreign Key requirement)
    await prisma.user.upsert({
      where: { id: user.id },
      update: {},
      create: {
        id: user.id,
        email: user.email!,
        name: user.user_metadata.full_name || 'Store Owner'
      }
    });

    let store = await prisma.store.findUnique({ where: { userId: user.id } })
    
    if (!store) {
      // Create a default store if it doesn't exist yet
      store = await prisma.store.create({
        data: {
          name: "My Store",
          userId: user.id,
          url: `store-${user.id.slice(0, 5)}-${Math.floor(Math.random() * 1000)}`
        }
      });
    }

    await prisma.product.create({
      data: {
        name,
        price,
        description,
        imageUrl: imageUrl || "",
        storeId: store.id,
      },
    })

    revalidatePath('/dashboard')
    return { success: true }
  } catch (error: any) {
    console.error('Error adding product:', error)
    return { success: false, error: error.message || 'Failed to add product' }
  }
}


export async function deleteProduct(productId: string) {
  try {
    await prisma.product.delete({
      where: { id: productId },
    })
    revalidatePath('/dashboard')
    return { success: true }
  } catch (error) {
    console.error('Error deleting product:', error)
    return { success: false, error: 'Failed to delete product' }
  }
}

export async function getStoreBySlug(slug: string) {
  try {
    const store = await prisma.store.findUnique({
      where: { url: slug },
      include: {
        products: true,
      },
    })
    return { store, success: true }
  } catch (error) {
    console.error('Error fetching store by slug:', error)
    return { success: false, error: 'Failed to fetch store' }
  }
}
export async function getProductById(id: string) {
  try {
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        store: true
      }
    })
    return { product, success: true }
  } catch (error) {
    console.error('Error fetching product:', error)
    return { success: false, error: 'Failed to fetch product' }
  }
}

export async function updateProduct(formData: FormData) {
  try {
    const user = await getAuthenticatedUser()
    const id = formData.get('id') as string
    const name = formData.get('name') as string
    const price = parseFloat(formData.get('price') as string)
    const description = formData.get('description') as string
    const imageFile = formData.get('image') as File

    let imageUrl = formData.get('currentImageUrl') as string

    if (imageFile && imageFile.size > 0) {
      imageUrl = await uploadImage(imageFile, 'lokl-images')
    }

    await prisma.product.update({
      where: { id },
      data: {
        name,
        price,
        description,
        imageUrl,
      },
    })

    revalidatePath('/dashboard')
    return { success: true }
  } catch (error: any) {
    console.error('Error updating product:', error)
    return { success: false, error: error.message || 'Failed to update product' }
  }
}

export async function recordVisit(storeId: string, source: string = 'direct') {
  try {
    // @ts-ignore - 'source' exists in DB but Prisma Client needs regeneration (npx prisma generate)
    await prisma.visit.create({
      data: { storeId, source }
    })
    return { success: true }
  } catch (error) {
    console.error('Error recording visit:', error)
    return { success: false }
  }
}
