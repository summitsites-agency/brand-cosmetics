import { Routes, Route } from 'react-router-dom'

import SmoothScroll from './smooth/SmoothScroll'
import { CartProvider } from './cart/CartContext'
import Nav from './components/Nav'
import Footer from './components/Footer'
import CartDrawer from './components/CartDrawer'
import PageTransition from './components/PageTransition'

import Home from './pages/Home'
import ShopAll from './pages/ShopAll'
import Skincare from './pages/Skincare'
import Collection from './pages/Collection'
import Story from './pages/Story'
import Contact from './pages/Contact'
import Product from './pages/Product'
import NotFound from './pages/NotFound'

export default function App() {
  return (
    <CartProvider>
      <SmoothScroll>
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <Nav />
        <main id="main">
          <PageTransition>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/shop" element={<ShopAll />} />
              <Route path="/skincare" element={<Skincare />} />
              <Route path="/collection" element={<Collection />} />
              <Route path="/story" element={<Story />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/product/:slug" element={<Product />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </PageTransition>
        </main>
        <Footer />
        <CartDrawer />
      </SmoothScroll>
    </CartProvider>
  )
}
