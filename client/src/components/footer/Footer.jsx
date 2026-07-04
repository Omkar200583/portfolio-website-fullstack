// ═══════════════════════════════════════════════════════════════
//  FOOTER — Premium Black & Gold (Fixed)
// ═══════════════════════════════════════════════════════════════
import React from "react";
import { FaGithub, FaLinkedin, FaHeart } from "react-icons/fa";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-black text-white py-10">
      <div className="container mx-auto px-4">

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">

          {/* BRAND (Left Side Improved) */}
          <div className="col-span-1 md:col-span-2 text-left">
            <Link
              to="/"
              className="text-2xl md:text-3xl font-bold text-white mb-3 block font-display"
            >
              OMKAR{" "}
              <span className="bg-gradient-to-r from-[#D4AF37] to-[#F0D060] bg-clip-text text-transparent">
                JADHAV
              </span>
            </Link>

            <p className="text-[#A3A3A3] text-sm max-w-sm mb-6">
              Building immersive digital experiences with modern web technologies and 3D interactivity.
            </p>

            {/* BIGGER ICONS */}
            <div className="flex gap-5 text-[#A3A3A3]">
              <a
                href="https://github.com/Omkar200583"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#D4AF37] transition"
              >
                <FaGithub size={26} />
              </a>

              <a
                href="https://linkedin.com/in/omkar-jadhav-6915052a1"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#D4AF37] transition"
              >
                <FaLinkedin size={26} />
              </a>
            </div>
          </div>

          {/* QUICK LINKS */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-base">
              Quick Links
            </h3>
            <ul className="space-y-2 text-sm text-[#A3A3A3]">
              <li><a href="#about" className="hover:text-[#D4AF37]">About Me</a></li>
              <li><a href="#projects" className="hover:text-[#D4AF37]">Projects</a></li>
              <li><a href="#skills" className="hover:text-[#D4AF37]">Skills</a></li>
              <li><a href="#contact" className="hover:text-[#D4AF37]">Contact</a></li>
            </ul>
          </div>

          {/* CONTACT (Properly Inside Grid) */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-base">
              Contact
            </h3>

            <div className="space-y-3">

              <a
                href="https://www.google.com/maps/search/?api=1&query=Alandi+Devachi+Pune+Maharashtra+India"
                target="_blank"
                rel="noopener noreferrer"
                className="block text-sm text-[#A3A3A3] border border-[#D4AF37]/20 px-3 py-2 rounded-md hover:bg-[#D4AF37] hover:text-black transition"
              >
                📍 Alandi Devachi, Pune
              </a>

              <a
                href="mailto:omkarjadhav415523@gmail.com"
                className="block text-sm text-[#A3A3A3] border border-[#D4AF37]/20 px-3 py-2 rounded-md hover:bg-[#D4AF37] hover:text-black transition"
              >
                📧 Email Me
              </a>

              <a
                href="tel:+919359873623"
                className="block text-sm text-[#A3A3A3] border border-[#D4AF37]/20 px-3 py-2 rounded-md hover:bg-[#D4AF37] hover:text-black transition"
              >
                📞 Call Me
              </a>

            </div>
          </div>

        </div>

        {/* BOTTOM BAR */}
        <div className="border-t border-[#D4AF37]/10 pt-5 flex flex-col md:flex-row justify-between items-center gap-3">

          <p className="text-[#A3A3A3] text-xs">
            © {new Date().getFullYear()} Omkar Jadhav
          </p>

          <div className="flex items-center gap-1 text-[#A3A3A3] text-xs">
            Designed with{" "}
            <FaHeart className="text-[#D4AF37]" size={12} />
            using React & Three.js
          </div>

        </div>

      </div>
    </footer>
  );
};

export default Footer;