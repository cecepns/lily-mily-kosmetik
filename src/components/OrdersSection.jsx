import { ShoppingBag, Music } from 'lucide-react';

function OrdersSection() {
  const orderLinks = [
    {
      name: 'TikTok Shop',
      icon: Music,
      url: 'https://www.tiktok.com/@lily_mily04?_t=ZS-8wvJ0XgNK66&_r=1',
      color: 'bg-black hover:bg-gray-800'
    },
    {
      name: 'Shopee 1',
      icon: ShoppingBag,
      url: 'https://id.shp.ee/jTEMVvC',
      color: 'bg-orange-500 hover:bg-orange-600'
    },
    {
      name: 'Shopee 2',
      icon: ShoppingBag,
      url: 'https://id.shp.ee/oG3qmPx',
      color: 'bg-orange-500 hover:bg-orange-600'
    }
  ];

  return (
    <section className="bg-white py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12" data-aos="fade-up">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Orders
          </h2>
          <p className="text-gray-600 text-lg">Pilih platform untuk melakukan pemesanan</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
          {orderLinks.map((link, index) => {
            const IconComponent = link.icon;
            return (
              <a
                key={link.name}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Order via ${link.name}`}
                className="group block"
                data-aos="fade-up"
                data-aos-delay={index * 100}
              >
                <div className={`
                  ${link.color}
                  text-white
                  rounded-lg
                  p-6
                  text-center
                  transition-all
                  duration-300
                  transform
                  group-hover:scale-105
                  group-hover:shadow-lg
                  shadow-md
                `}>
                  <div className="flex justify-center mb-3">
                    <IconComponent size={32} />
                  </div>
                  <div className="font-medium text-sm">{link.name}</div>
                </div>
              </a>
            );
          })}
        </div>

        <div className="text-center mt-8" data-aos="fade-up" data-aos-delay="500">
          <p className="text-gray-600 text-sm">Klik kartu untuk membuka link pemesanan</p>
        </div>
      </div>
    </section>
  );
}

export default OrdersSection;


