import Image from "next/image";
import Link from "next/link";
import { loginWithGoogle } from "@/app/actions/auth";

export default function LoginPage() {
  return (
    <div className="min-h-screen w-full bg-white flex flex-col lg:flex-row font-playfair text-[#1F1101]">
      
      {/* Left Side (Banner) */}
      <div className="w-full lg:w-1/2 bg-[#F8F7F5] p-8 md:p-16 lg:p-20 xl:p-24 flex flex-col justify-between min-h-[50vh] lg:min-h-screen relative overflow-hidden">
        
        <div className="z-10">
          {/* Logo */}
          <div className="mb-8 lg:mb-12 -ml-2">
             <Link href="/">
               <img 
                src="/Logo.png" 
                alt="Lokl Logo" 
                className="w-48 md:w-64 lg:w-80 h-auto object-contain"
              />
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex -space-x-3">
              <img src="/local_seller_1_1777011996907.png" alt="seller" className="w-10 h-10 lg:w-14 lg:h-14 rounded-full border-2 border-[#F8F7F5] object-cover shadow-sm" />
              <img src="/local_seller_2_1777012015295.png" alt="seller" className="w-10 h-10 lg:w-14 lg:h-14 rounded-full border-2 border-[#F8F7F5] object-cover shadow-sm" />
              <img src="/local_seller_3_1777012036738.png" alt="seller" className="w-10 h-10 lg:w-14 lg:h-14 rounded-full border-2 border-[#F8F7F5] object-cover shadow-sm" />
            </div>
            <p className="text-base lg:text-lg font-bold text-[#1F1101]">
              300+ <span className="font-sans font-medium text-sm lg:text-base">स्थानीय व्यवसायी पहले ही लोकल से जुड़ चुके हैं</span>
            </p>
          </div>
        </div>

        <div className="mt-12 lg:mt-auto z-10 pt-12">
          <h2 className="text-3xl lg:text-[2.5rem] xl:text-[3rem] font-bold leading-[1.3] text-[#1F1101] tracking-wide">
            हर दुकान, अब ऑनलाइन<br/>
            अपनी दुकान बनाएं, उत्पाद जोड़ें<br/>
            और लिंक साझा करें<br/>
            ग्राहकों से सीधे कॉल पर ऑर्डर<br/>
            लें
          </h2>
        </div>

      </div>

      {/* Right Side (Form) */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center px-6 py-16 lg:p-24 min-h-[50vh] lg:min-h-screen">
        
        <div className="w-full max-w-md">
          <h1 className="text-4xl lg:text-[3rem] font-bold mb-12 text-[#1F1101]">Get Started</h1>
          
          <form action={loginWithGoogle} className="w-full">
            <button type="submit" className="w-full flex items-center justify-center gap-4 bg-[#1F1101] hover:bg-[#0f0800] text-white py-4 lg:py-5 px-8 rounded-full transition-transform hover:scale-[1.02] active:scale-95 font-playfair font-semibold text-xl lg:text-2xl shadow-xl">
              {/* Google Icon SVG */}
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continue With Google
            </button>
          </form>

          <p className="mt-8 text-center text-sm lg:text-base font-playfair font-bold text-[#1F1101]">
            By signing in you agree to our <Link href="#" className="underline">Terms of service</Link> & <Link href="#" className="underline">Privacy policy</Link>
          </p>
        </div>

      </div>

    </div>
  );
}
