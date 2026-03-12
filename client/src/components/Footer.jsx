import { Link } from "react-router-dom";
import fbLogo from "../assets/facebook.png";
import igLogo from "../assets/instagram.png";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-400 py-8 mt-5 border-t border-white/5">
      <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
        {/* Brand Section */}
        <div className="w-64 ml-5">
          <h2 className="text-xl font-bold text-white italic tracking-tight">
            Lasa ng Pinas
          </h2>
          <p className="text-md mt-2 leading-relaxed">
            Preserving heirloom Filipino recipes, one dish at a time. Mula sa
            aming kusina, para sa inyo.
          </p>
        </div>

        {/* MIDDLE SECTION */}
        <div className="flex-1 flex justify-center">
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-2 text-md">
            <a href="#" className="hover:text-green-400 transition-colors">
              Luzon
            </a>
            <a href="#" className="hover:text-green-400 transition-colors">
              Visayas
            </a>
            <a href="#" className="hover:text-green-400 transition-colors">
              Mindanao
            </a>
            <a href="#" className="hover:text-green-400 transition-colors">
              Create Recipe
            </a>
          </div>
        </div>

        {/* Copyright & Socials */}
        <div className="text-right w-64 mr-5">
          <div className="flex justify-end gap-4 mb-2">
            <img src={fbLogo} alt="Facebook" className="w-10 h-10 opacity-90" />
            <img
              src={igLogo}
              alt="Instagram"
              className="w-10 h-10 opacity-90"
            />
          </div>
          <p className="text-xs uppercase tracking-widest">
            © {new Date().getFullYear()} Lasa ng Pinas PH
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
