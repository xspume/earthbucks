export const classNames = (...classes: String[]) => {
  return classes.filter(Boolean).join(" ");
};

type ImagePath =
  | "/artintellica-button-128.png"
  | "/black-button-128.png"
  | "/button-128.png"
  | "/button-logo.png"
  | "/compubutton-text-black.png"
  | "/compubutton-text-white.png"
  | "/computcha-bottlecap-128.png"
  | "/compute-circle-128.png"
  | "/earthbucks-coin-128.png"
  | "/error-2-96.png"
  | "/imp-avatar-bw.png"
  | "/mining-button-128.png"
  | "/pink-heart-128.png"
  | "/sun-128.png"
  | "/washington-button-128.png";

export const $image = (path: ImagePath) => {
  return path;
};
