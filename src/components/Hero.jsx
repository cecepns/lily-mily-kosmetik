function Hero() {
  return (
    <section className="bg-gradient-to-r from-pink-400 via-pink-500 to-pink-600 text-white py-16">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-4" data-aos="fade-up">
          Lily Mily Kosmetik
        </h1>
        <p
          className="text-xl md:text-2xl mb-8 opacity-90"
          data-aos="fade-up"
          data-aos-delay="200"
        >
          Temukan produk kosmetik terbaik untuk merawat kulit, tubuh dan rambut
          Anda. Kualitas premium dengan harga terjangkau!
        </p>
        <div
          className="flex flex-wrap justify-center gap-4"
          data-aos="fade-up"
          data-aos-delay="400"
        >
          <div className="bg-white/20 backdrop-blur-sm rounded-lg px-6 py-3">
            <span className="text-sm font-medium">✨ Produk Original</span>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-lg px-6 py-3">
            <span className="text-sm font-medium">🚚 Pengiriman Cepat</span>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-lg px-6 py-3">
            <span className="text-sm font-medium">💝 Harga Terjangkau</span>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
