import {
  FiSquare,
  FiPrinter,
  FiType,
  FiRadio,
  FiImage,
  FiBookOpen,
  FiBox,
  FiPenTool,
  FiAward,
  FiZap,
} from "react-icons/fi";

// Map string icon name (from data) -> react-icons component.
export const iconMap = {
  FiSquare,
  FiPrinter,
  FiType,
  FiRadio,
  FiImage,
  FiBookOpen,
  FiBox,
  FiPenTool,
  FiAward,
  FiZap,
};

export function getIcon(name) {
  return iconMap[name] || FiBox;
}
