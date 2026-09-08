import React from 'react'
import { Link } from 'react-router-dom'
import { assets } from '../assets/frontend_assets/assets'
import { Mail, Phone, MapPin } from 'lucide-react'
import { FaInstagram, FaFacebookF, FaTwitter } from 'react-icons/fa'

const Footer = () => {
  return (
    <footer className="bg-foreground text-background/80 font-sans mt-24">
      {/* Top Footer Section */}
      <div className="container-store section-padding grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
        
        {/* Brand Information */}
        <div className="flex flex-col gap-5">
          <Link to="/" className="outline-hidden">
            <img 
              src={assets.logo} 
              alt="Forever Logo" 
              className="w-32 invert opacity-95 hover:opacity-100 transition-opacity" 
            />
          </Link>
          <p className="text-xs leading-relaxed text-background/70 max-w-sm font-sans tracking-wide">
            An editorial collection of modern Indian luxury fashion. Curating the finest textiles and contemporary designs for the modern wardrobe.
          </p>
        </div>

        {/* Company Links */}
        <div className="flex flex-col gap-5">
          <h4 className="text-xs font-semibold tracking-[0.2em] text-background uppercase">
            Company
          </h4>
          <ul className="flex flex-col gap-3 text-xs tracking-wider font-light">
            <li>
              <Link to="/" className="hover:text-[#C6A15B] transition-colors outline-hidden">
                Home
              </Link>
            </li>
            <li>
              <Link to="/about" className="hover:text-[#C6A15B] transition-colors outline-hidden">
                About Us
              </Link>
            </li>
            <li className="hover:text-[#C6A15B] transition-colors cursor-default">
              Delivery Information
            </li>
            <li className="hover:text-[#C6A15B] transition-colors cursor-default">
              Privacy Policy
            </li>
          </ul>
        </div>

        {/* Contact Information */}
        <div className="flex flex-col gap-5">
          <h4 className="text-xs font-semibold tracking-[0.2em] text-background uppercase">
            Get In Touch
          </h4>
          <ul className="flex flex-col gap-3 text-xs tracking-wider font-light">
            <li className="flex items-center gap-2">
              <Phone className="size-3.5 text-[#C6A15B]" />
              <span>+91-9845695247</span>
            </li>
            <li className="flex items-center gap-2">
              <Mail className="size-3.5 text-[#C6A15B]" />
              <span>support@forever.com</span>
            </li>
            <li className="flex items-start gap-2 max-w-xs leading-relaxed">
              <MapPin className="size-3.5 text-[#C6A15B] shrink-0 mt-0.5" />
              <span>Lorem ipsum, Bheem ke ghar ke samne, Dholakpur, Bangalore.</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Footer Section */}
      <div className="border-t border-background/10 py-6">
        <div className="container-store flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] tracking-widest uppercase font-medium">
          {/* Copyright */}
          <p className="text-background/50">
            &copy; {new Date().getFullYear()} FOREVER. ALL RIGHTS RESERVED.
          </p>

          {/* Social Links (Visually Prepared/Placeholder) */}
          <div className="flex items-center gap-4">
            <a 
              href="#" 
              onClick={(e) => e.preventDefault()} 
              className="text-background/50 hover:text-[#C6A15B] transition-colors outline-hidden" 
              aria-label="Instagram"
            >
              <FaInstagram className="size-4" />
            </a>
            <a 
              href="#" 
              onClick={(e) => e.preventDefault()} 
              className="text-background/50 hover:text-[#C6A15B] transition-colors outline-hidden" 
              aria-label="Facebook"
            >
              <FaFacebookF className="size-3.5" />
            </a>
            <a 
              href="#" 
              onClick={(e) => e.preventDefault()} 
              className="text-background/50 hover:text-[#C6A15B] transition-colors outline-hidden" 
              aria-label="Twitter"
            >
              <FaTwitter className="size-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer