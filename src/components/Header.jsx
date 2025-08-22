import { Link } from 'react-router-dom';
import { ShoppingBag, User } from 'lucide-react';
import Logo from '../assets/logo.png'

function Header() {
  return (
    <header className="bg-white shadow-md sticky top-0 z-40">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <img src={Logo} className="w-14 h-auto"/>
          </Link>
          
          <Link 
            to="/admin/login"
            className="flex items-center space-x-2 text-gray-600 hover:text-pink-500 transition-colors"
          >
            <User className="h-5 w-5" />
            <span className="hidden sm:block">Admin</span>
          </Link>
        </div>
      </div>
    </header>
  );
}

export default Header;