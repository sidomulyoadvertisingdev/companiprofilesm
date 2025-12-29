import { motion } from "framer-motion";

export default function Portfolio() {
  return (
    <section id="portfolio" className="py-32 bg-white">
      <div className="max-w-6xl mx-auto px-6">

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl md:text-5xl font-semibold text-[#1d1d1f] mb-4">
            Portofolio Kami
          </h2>
          <p className="text-lg text-[#6e6e73]">
            Beberapa proyek yang telah kami kerjakan
          </p>
        </motion.div>

        {/* Portfolio Grid */}
        <div className="grid md:grid-cols-3 gap-14">
          {[
            {
              title: "Neon Box Premium",
              desc: "Akrilik & LED",
              image: "/portfolio-1.png",
            },
            {
              title: "Banner Promosi",
              desc: "Cetak Outdoor & Indoor",
              image: "/portfolio-2.png",
            },
            {
              title: "Huruf Timbul",
              desc: "Stainless & Akrilik",
              image: "/portfolio-3.png",
            },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.15, duration: 0.6 }}
              viewport={{ once: true }}
              className="group cursor-pointer"
            >
              {/* Image */}
              <div className="overflow-hidden rounded-3xl mb-6">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full aspect-[4/3] object-cover
                             transition-transform duration-500
                             group-hover:scale-[1.03]"
                />
              </div>

              {/* Text */}
              <h3 className="text-xl font-medium text-[#1d1d1f] mb-1">
                {item.title}
              </h3>
              <p className="text-[#6e6e73]">
                {item.desc}
              </p>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
