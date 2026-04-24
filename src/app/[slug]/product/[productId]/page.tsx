import Image from "next/image";
import Link from "next/link";
import { getProductById } from "@/app/actions/dashboard";
import { notFound } from "next/navigation";
import { ArrowLeft, MessageCircle, Phone, Share2, ShieldCheck, Truck } from "lucide-react";

export default async function ProductDetailPage({ params }: { params: { slug: string, productId: string } }) {
  const { productId, slug } = await params;
  const { product, success } = await getProductById(productId);

  if (!success || !product) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[#FDFCFB] text-[#1F1101] font-playfair selection:bg-[#1F1101] selection:text-white pb-20">
      
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-40 bg-white/80 backdrop-blur-md border-b border-gray-100 px-6 py-4 md:px-12 flex justify-between items-center">
        <Link href={`/${slug}`} className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest hover:opacity-60 transition-opacity">
          <ArrowLeft size={18} />
          Back to Collection
        </Link>
      </nav>

      <main className="pt-32 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          
          {/* Image Side */}
          <div className="animate-in fade-in slide-in-from-left duration-1000">
            <div className="aspect-[4/5] relative rounded-[3rem] overflow-hidden bg-[#F1E9E0] shadow-2xl">
              <Image 
                src={product.imageUrl || "/product-placeholder.png"} 
                alt={product.name}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                unoptimized
                className="object-contain"
                priority
              />
            </div>
          </div>

          {/* Details Side */}
          <div className="space-y-10 animate-in fade-in slide-in-from-right duration-1000">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#1F1101] text-white rounded-full text-[10px] font-bold uppercase tracking-[0.2em]">
                Best Choice
              </div>
              <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-none uppercase">
                {product.name}
              </h1>
              <p className="text-4xl font-black text-[#1F1101]/40 italic">
                ₹{product.price}
              </p>
            </div>

            <div className="prose prose-lg font-sans text-gray-600 leading-relaxed max-w-xl">
              <p>{product.description || "No detailed description provided for this product yet. Rest assured, this item meets our highest local quality standards."}</p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-4 pt-6">
              <a 
                href={`tel:${product.store.phoneNumber}`}
                className="w-full py-6 bg-[#1F1101] text-white rounded-3xl font-bold text-xl hover:bg-[#0f0800] transition-all hover:translate-y-[-4px] shadow-2xl flex items-center justify-center gap-3"
              >
                <Phone size={22} />
                Call Store
              </a>
            </div>
          </div>
        </div>
      </main>

    </div>
  );
}
