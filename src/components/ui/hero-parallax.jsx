import React from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { FiArrowRight } from "react-icons/fi";

export const HeroParallax = ({
  products = [],
  title,
  subtitle,
  badgeText,
  ctaText,
  ctaLink,
  accentColor = "#0A4DA6",
}) => {
  // Ensure we have enough items for 3 parallax rows (at least 15 cards)
  const safeProducts = products.length > 0 ? products : [
    { title: "Neon Box Akrilik LED", thumbnail: "/catalog-1.webp", link: "/catalog" },
    { title: "Banner Flexi High Res", thumbnail: "/catalog-2.webp", link: "/catalog" },
    { title: "Huruf Timbul Stainless", thumbnail: "/catalog-3.webp", link: "/catalog" },
    { title: "Buku & Brosur Profil", thumbnail: "/catalog-4.webp", link: "/catalog" },
    { title: "Stiker & Label Custom", thumbnail: "/catalog-5.webp", link: "/catalog" },
  ];

  // Repeat items to fill 15 slots if products array is shorter
  const filledProducts = [];
  while (filledProducts.length < 15) {
    filledProducts.push(...safeProducts);
  }
  const items = filledProducts.slice(0, 15);

  const firstRow = items.slice(0, 5);
  const secondRow = items.slice(5, 10);
  const thirdRow = items.slice(10, 15);

  const ref = React.useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const springConfig = { stiffness: 300, damping: 30, bounce: 100 };

  const translateX = useSpring(
    useTransform(scrollYProgress, [0, 1], [0, 1000]),
    springConfig
  );
  const translateXReverse = useSpring(
    useTransform(scrollYProgress, [0, 1], [0, -1000]),
    springConfig
  );
  const rotateX = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [15, 0]),
    springConfig
  );
  const opacity = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [0.2, 1]),
    springConfig
  );
  const rotateZ = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [20, 0]),
    springConfig
  );
  const translateY = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [-700, 500]),
    springConfig
  );

  return (
    <div
      ref={ref}
      className="h-[300vh] py-20 md:py-40 overflow-hidden antialiased relative flex flex-col self-auto [perspective:1000px] [transform-style:preserve-3d]"
      style={{ background: `linear-gradient(135deg, ${accentColor} 0%, #07142b 100%)` }}
    >
      <Header
        title={title}
        subtitle={subtitle}
        badgeText={badgeText}
        ctaText={ctaText}
        ctaLink={ctaLink}
        accentColor={accentColor}
      />
      <motion.div
        style={{
          rotateX,
          rotateZ,
          translateY,
          opacity,
        }}
      >
        <motion.div className="flex flex-row-reverse space-x-reverse space-x-12 md:space-x-20 mb-12 md:mb-20">
          {firstRow.map((product, idx) => (
            <ParallaxCard
              product={product}
              translate={translateX}
              key={`row1-${idx}`}
            />
          ))}
        </motion.div>

        <motion.div className="flex flex-row space-x-12 md:space-x-20 mb-12 md:mb-20">
          {secondRow.map((product, idx) => (
            <ParallaxCard
              product={product}
              translate={translateXReverse}
              key={`row2-${idx}`}
            />
          ))}
        </motion.div>

        <motion.div className="flex flex-row-reverse space-x-reverse space-x-12 md:space-x-20">
          {thirdRow.map((product, idx) => (
            <ParallaxCard
              product={product}
              translate={translateX}
              key={`row3-${idx}`}
            />
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
};

export const Header = ({ title, subtitle, badgeText, ctaText, ctaLink, accentColor }) => {
  return (
    <div className="max-w-7xl relative mx-auto py-12 md:py-28 px-6 w-full left-0 top-0 text-white z-20">
      {badgeText && (
        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/15 backdrop-blur text-xs font-semibold uppercase tracking-wider mb-6 ring-1 ring-white/20">
          {badgeText}
        </span>
      )}
      <h1 className="text-3xl md:text-6xl lg:text-7xl font-extrabold leading-tight max-w-4xl drop-shadow-lg">
        {title || "Produk Percetakan & Advertising Kualitas Terbaik"}
      </h1>
      <p className="max-w-2xl text-base md:text-xl mt-6 text-white/90 leading-relaxed drop-shadow">
        {subtitle || "Solusi kebutuhan promosi bisnis Anda dengan hasil cetak presisi, mesin tercanggih, dan pelayanan profesional."}
      </p>
      {ctaText && (
        <div className="mt-8">
          <a
            href={ctaLink || "#"}
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-bold text-base bg-white shadow-xl hover:scale-105 transition-all text-slate-900"
            style={{ color: accentColor }}
          >
            {ctaText} <FiArrowRight />
          </a>
        </div>
      )}
    </div>
  );
};

export const ParallaxCard = ({ product, translate }) => {
  return (
    <motion.div
      style={{
        x: translate,
      }}
      whileHover={{
        y: -20,
      }}
      className="group/product h-72 w-[22rem] md:h-96 md:w-[30rem] relative shrink-0 rounded-3xl overflow-hidden shadow-2xl ring-1 ring-white/15"
    >
      <a
        href={product.link || "#"}
        className="block h-full w-full"
      >
        <img
          src={product.thumbnail || product.image || "/catalog-1.webp"}
          className="object-cover object-center absolute h-full w-full inset-0 rounded-3xl group-hover/product:scale-105 transition-transform duration-500"
          alt={product.title}
          loading="lazy"
        />
      </a>
      <div className="absolute inset-0 h-full w-full opacity-0 group-hover/product:opacity-75 bg-gradient-to-t from-black/90 via-black/40 to-transparent pointer-events-none rounded-3xl transition duration-300" />
      <div className="absolute bottom-6 left-6 right-6 opacity-0 group-hover/product:opacity-100 transition duration-300">
        <span className="text-xs font-bold text-blue-400 uppercase tracking-wider block mb-1">
          {product.category || "Percetakan"}
        </span>
        <h2 className="text-white font-bold text-xl md:text-2xl drop-shadow">
          {product.title}
        </h2>
        {product.priceText && (
          <p className="text-sm font-semibold text-slate-200 mt-1">
            {product.priceText}
          </p>
        )}
      </div>
    </motion.div>
  );
};
