import { FiTag } from "react-icons/fi";

export default function MarketplaceForm() {
  const handleClick = () => {
    window.location.href = "/marketplace/claim";
  };

  return (
    <div className="flex flex-col items-center gap-3 max-w-md mx-auto">
      <button
        onClick={handleClick}
        className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-blue-700 text-white text-sm font-semibold hover:bg-blue-400 transition whitespace-nowrap flex items-center justify-center gap-2"
      >
        <FiTag />
        Code Redeem
      </button>

      <p className="text-xs text-slate-500">
        Klik untuk klaim kode redeem diskon Anda.
      </p>
    </div>
  );
}
