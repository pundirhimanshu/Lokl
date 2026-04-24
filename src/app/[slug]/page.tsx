import Image from "next/image";
import Link from "next/link";
import { getStoreBySlug, recordVisit } from "@/app/actions/dashboard";
import { notFound } from "next/navigation";
import { headers } from "next/headers";
import { Phone, MapPin, Share2, ShoppingBag, MessageCircle, ArrowRight } from "lucide-react";

export const dynamic = 'force-dynamic';

export default async function StorePage({ 
  params, 
  searchParams 
}: { 
  params: { slug: string }, 
  searchParams: { source?: string } 
}) {
  const { slug } = await params;
  const { source } = await searchParams;
  const headerList = await headers();
  const isPrefetch = headerList.get('purpose') === 'prefetch' || headerList.get('next-purpose') === 'prefetch';

  const { store, success } = await getStoreBySlug(slug);

  if (!success || !store) {
    notFound();
  }

  // Only record the visit if it's NOT a Next.js prefetch
  if (!isPrefetch) {
    await recordVisit(store.id, source || 'direct').catch(err => console.error("Visit recording failed:", err));
  }

  return (
    <div className="min-h-screen bg-[#FDFCFB] text-[#1F1101] font-playfair selection:bg-[#1F1101] selection:text-white">
      
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-40 bg-white/80 backdrop-blur-md border-b border-gray-100 px-6 py-4 md:px-12 flex justify-between items-center">
        <div className="text-2xl font-black tracking-tighter flex items-center gap-3">
          <div className="w-10 h-10 bg-[#1F1101] rounded-lg flex items-center justify-center text-white text-sm overflow-hidden relative">
            {store.logoUrl ? (
              <Image src={store.logoUrl} alt={store.name} fill sizes="40px" unoptimized className="object-cover" />
            ) : (
              store.name[0]
            )}
          </div>
          <span className="hidden sm:block">{store.name}</span>
        </div>
        <div className="flex items-center gap-4">
          <a 
            href={`tel:${store.phoneNumber}`}
            className="flex items-center gap-2 px-6 py-2.5 bg-[#1F1101] text-white rounded-full text-sm font-bold hover:bg-[#0f0800] transition-colors"
          >
            <Phone size={18} />
            <span className="hidden sm:inline">Contact Store</span>
          </a>
        </div>
      </nav>

      {/* Hero Section - Split Layout */}
      <section className="pt-32 pb-16 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 animate-in fade-in slide-in-from-left duration-1000">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#F1E9E0] rounded-full text-sm font-bold text-[#1F1101]">
              <span className="w-2 h-2 bg-[#1F1101] rounded-full animate-pulse" />
              Live Store
            </div>
            <h1 className="text-6xl md:text-8xl font-black leading-[0.9] tracking-tight">
              {store.name}
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 font-sans leading-relaxed max-w-xl">
              {store.description || "Handpicked collections delivered with love from our local store to your doorstep."}
            </p>
            
            {store.address && (
              <div className="flex items-center gap-2 text-gray-500 font-sans font-medium">
                <MapPin size={20} className="text-[#1F1101]" />
                {store.address}
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-6 pt-4">
              <a 
                href={`tel:${store.phoneNumber}`}
                className="px-10 py-5 bg-[#1F1101] text-white rounded-2xl font-bold text-xl hover:bg-[#0f0800] transition-all hover:translate-y-[-4px] shadow-xl flex items-center justify-center gap-3 group"
              >
                <Phone size={20} />
                Contact Store
              </a>
            </div>
          </div>
          
          <div className="relative aspect-[4/5] rounded-[3rem] overflow-hidden shadow-xl animate-in fade-in zoom-in duration-1000 bg-white border border-gray-100 p-4">
            <Image 
              src={store.logoUrl || "/store-hero.jpg"} 
              alt={store.name}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              unoptimized
              className="object-contain"
              priority
            />
          </div>
        </div>
      </section>

      {/* Product Discovery */}
      <section className="px-6 md:px-12 max-w-7xl mx-auto pb-32">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div>
            <h2 className="text-4xl md:text-6xl font-black mb-4 tracking-tight">Browse Products</h2>
            <p className="text-gray-500 font-sans text-lg max-w-md">Browse through our curated list of items specifically selected for quality and style.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10">
          {store.products.length > 0 ? (
            store.products.map((product: any, idx: number) => (
              <Link 
                href={`/${slug}/product/${product.id}`}
                key={product.id} 
                className="group relative animate-in fade-in slide-in-from-bottom duration-700 block" 
                style={{ animationDelay: `${idx * 150}ms` }}
              >
                <div className="aspect-[3/4] relative rounded-[2.5rem] overflow-hidden bg-[#F1E9E0] mb-8 transition-transform duration-500 group-hover:scale-[1.02] group-hover:shadow-2xl">
                  <Image 
                    src={product.imageUrl || "/product-placeholder.png"} 
                    alt={product.name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    unoptimized
                    className="object-contain transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="px-2">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-3xl font-bold tracking-tight">{product.name}</h3>
                    <div className="bg-[#1F1101] text-white px-4 py-1.5 rounded-full text-lg font-black">
                      ₹{product.price}
                    </div>
                  </div>
                  <p className="text-gray-500 font-sans text-lg line-clamp-1 opacity-80 group-hover:opacity-100 transition-opacity">
                    {product.description}
                  </p>
                </div>
              </Link>
            ))
          ) : (
            <div className="col-span-full py-40 text-center bg-[#F8F7F5] border-2 border-dashed border-gray-200 rounded-[4rem]">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <ShoppingBag size={40} className="text-gray-300" />
              </div>
              <p className="text-2xl text-gray-400 font-sans font-medium">Our shelves are being restocked...</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

