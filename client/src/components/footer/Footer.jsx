// ═══════════════════════════════════════════════════════════════
//  FOOTER — Premium Black & Gold
// ═══════════════════════════════════════════════════════════════
import React from "react";
import { FaGithub, FaLinkedin, FaHeart } from "react-icons/fa";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-[#0A0A0A] border-t border-[#D4AF37]/10 pt-12 pb-6">
      <div className="container mx-auto px-6">

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">

          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="text-2xl font-bold text-[#FFFFFF] mb-4 block font-display">
              OMKAR{" "}
              <span className="bg-gradient-to-r from-[#D4AF37] to-[#F0D060] bg-clip-text text-transparent">
                JADHAV
              </span>
            </Link>

            <p className="text-[#A3A3A3] text-sm max-w-xs mb-6">
              Building immersive digital experiences with modern web technologies and 3D interactivity.
            </p>

            <div className="flex gap-4 text-[#A3A3A3]">
              <a
                href="https://github.com/Omkar200583"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#D4AF37] transition-colors duration-250"
              >
                <FaGithub size={18} />
              </a>

              <a
                href="https://linkedin.com/in/omkar-jadhav-6915052a1"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#D4AF37] transition-colors duration-250"
              >
                <FaLinkedin size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-[#FFFFFF] font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm text-[#A3A3A3]">
              <li><a href="#about" className="hover:text-[#D4AF37] transition-colors duration-250">About Me</a></li>
              <li><a href="#projects" className="hover:text-[#D4AF37] transition-colors duration-250">Projects</a></li>
              <li><a href="#skills" className="hover:text-[#D4AF37] transition-colors duration-250">Skills</a></li>
              <li><a href="#contact" className="hover:text-[#D4AF37] transition-colors duration-250">Contact</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-[#FFFFFF] font-semibold mb-4">Contact</h3>
            <ul className="space-y-2 text-sm text-[#A3A3A3]">
              <li>Pune, Maharashtra, India</li>
              <li>omkar@example.com</li>
              <li>+91 98765 43210</li>
            </ul>
          </div>

        </div>

        <div className="border-t border-[#D4AF37]/10 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">

          <p className="text-[#A3A3A3] text-xs">
            &copy; {new Date().getFullYear()} Omkar Jadhav
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