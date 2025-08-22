import { MapPin, MessageCircle, ShoppingBag, Store, Music } from 'lucide-react';

function FindUsSection() {
  const socialLinks = [
    {
      name: 'Google Maps',
      icon: MapPin,
      url: 'https://maps.app.goo.gl/rCibzPxGbh14RPcu5?g_st=ac',
      color: 'bg-red-500 hover:bg-red-600'
    },
    {
      name: 'WhatsApp',
      icon: MessageCircle,
      url: 'https://wa.me/6289668742121',
      color: 'bg-green-500 hover:bg-green-600'
    },
    {
      name: 'Shopee 1',
      icon: ShoppingBag,
      url: 'https://id.shp.ee/jTEMVvC',
      color: 'bg-orange-500 hover:bg-orange-600'
    },
    {
      name: 'Shopee 2',
      icon: Store,
      url: 'https://id.shp.ee/oG3qmPx',
      color: 'bg-orange-500 hover:bg-orange-600'
    },
    {
      name: 'TikTok Shop',
      icon: Music,
      url: 'https://www.tiktok.com/@lily_mily04?_t=ZS-8wvJ0XgNK66&_r=1',
      color: 'bg-black hover:bg-gray-800'
    }
  ];

  const handleClick = (url) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <section className="bg-white py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12" data-aos="fade-up">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Temukan Kami Di
          </h2>
          <p className="text-gray-600 text-lg">
            Kunjungi toko kami di berbagai platform online
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 max-w-4xl mx-auto">
          {socialLinks.map((link, index) => {
            const IconComponent = link.icon;
            return (
              <div
                key={link.name}
                className="group cursor-pointer"
                data-aos="fade-up"
                data-aos-delay={index * 100}
                onClick={() => handleClick(link.url)}
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
                  <div className="font-medium text-sm">
                    {link.name}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="text-center mt-8" data-aos="fade-up" data-aos-delay="600">
          <p className="text-gray-600 text-sm">
            Klik pada kartu di atas untuk mengunjungi platform kami
          </p>
        </div>
      </div>
    </section>
  );
}

export default FindUsSection;
