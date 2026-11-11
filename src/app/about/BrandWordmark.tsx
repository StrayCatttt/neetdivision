import { useId } from "react";

/** Original bold/light outlines; inline glyphs share exact visible vertical bounds. */
export default function BrandWordmark({ className, variant = "stacked" }: { className?: string; variant?: "stacked" | "inline" }) {
  const titleId = useId();
  const inline = variant === "inline";
  // Normalize overshooting V/S/O/N individually, not the entire word's box.
  // Horizontal geometry and tracking remain unchanged; stacked mark is untouched.
  const offset = (stacked: number, compact: number) => {
    const bounds: Record<number, [number, number]> = {
      2965: [-57, 1464], 5631: [-39, 1499],
      8189: [-39, 1497], 10501: [-43, 1526],
    };
    const ink = inline ? bounds[stacked] : undefined;
    if (!ink) return `translate(${inline ? compact : stacked})`;
    const scale = 1464 / (ink[1] - ink[0]);
    return `translate(${compact} ${-ink[0] * scale}) scale(1 ${scale})`;
  };
  return (
    <svg className={className} viewBox={inline ? "0 0 679.616 100" : "0 0 620 365"} role="img" aria-labelledby={titleId} focusable="false" xmlns="http://www.w3.org/2000/svg">
      <title id={titleId}>NEET DIVISION</title>
      <g fill="#fff">
        <g transform={inline ? "translate(0 100) scale(.068493151 -.068493151) translate(-115 0)" : "translate(0 256.8915) scale(.175953079 -.175953079) translate(-115 0)"}>
          <path d="M115 0V1460H410L705 674Q718 636 741.5 557.5Q765 479 795 373Q772 528 761 657.5Q750 787 750 899V1460H1020V0H750L430 817Q422 835 388 966Q372 1026 363 1060Q373 975 378 868.5Q383 762 383 614V0Z" />
          <path transform={offset(1135, 1021.8)} d="M115 0V1460H729V1190H397V895H698V627H397V285H729V0Z" />
          <path transform={offset(1986, 1752.6)} d="M115 0V1460H729V1190H397V895H698V627H397V285H729V0Z" />
          <path transform={offset(2837, 2569.4)} d="M252 0V1190H29V1460H768V1190H545V0Z" />
        </g>
        <g transform={inline ? "translate(228.712329 100) scale(.063171194 -.068306010929) translate(-182 0)" : "translate(0 354) scale(.051449151 -.051449151) translate(-182 0)"}>
          <path d="M315 115H502Q729 115 824 140.5Q919 166 985 227Q1077 313 1124 441Q1171 569 1171 733Q1171 901 1123.5 1029Q1076 1157 983 1239Q913 1302 812 1328Q711 1354 459 1354H434H315ZM182 0V1464H410Q715 1464 843 1434Q971 1404 1063 1331Q1185 1234 1249 1081Q1313 928 1313 731Q1313 534 1249 380.5Q1185 227 1065 135Q970 62 848 31Q726 0 455 0H410Z" />
          <path transform={offset(1947, 1257.64)} d="M182 0V1464H315V0Z" />
          <path transform={offset(2965, 1717.28)} d="M555 -57 -18 1464H135L557 272L1001 1464H1147Z" />
          <path transform={offset(4613, 2808.92)} d="M182 0V1464H315V0Z" />
          <path transform={offset(5631, 3180.56)} d="M70 246 184 307Q216 199 294.5 139.5Q373 80 483 80Q622 80 700 162Q778 244 778 389Q778 495 725.5 565Q673 635 500 727Q279 844 206 933Q133 1022 133 1147Q133 1303 238.5 1401Q344 1499 512 1499Q622 1499 703.5 1452.5Q785 1406 836 1313L733 1251Q701 1314 642.5 1347Q584 1380 504 1380Q396 1380 332 1316.5Q268 1253 268 1145Q268 991 522 858Q568 834 592 821Q779 718 842 626.5Q905 535 905 389Q905 192 790 76.5Q675 -39 477 -39Q333 -39 230.5 32.5Q128 104 70 246Z" />
          <path transform={offset(7171, 4030.2)} d="M182 0V1464H315V0Z" />
          <path transform={offset(8189, 4358.84)} d="M895 80Q1025 80 1141 128Q1257 176 1350 268Q1441 361 1489.5 479.5Q1538 598 1538 729Q1538 861 1490 978.5Q1442 1096 1350 1190Q1259 1282 1142.5 1330Q1026 1378 895 1378Q765 1378 650 1330Q535 1282 442 1190Q350 1095 302 978.5Q254 862 254 729Q254 597 302 479.5Q350 362 442 268Q534 175 648 127.5Q762 80 895 80ZM1679 729Q1679 574 1620 434.5Q1561 295 1450 186Q1337 76 1195 18.5Q1053 -39 895 -39Q737 -39 595.5 18.5Q454 76 342 186Q230 297 171.5 435.5Q113 574 113 729Q113 886 171.5 1025.5Q230 1165 342 1276Q452 1385 593 1441Q734 1497 895 1497Q1057 1497 1198.5 1440.5Q1340 1384 1450 1276Q1562 1165 1620.5 1025.5Q1679 886 1679 729Z" />
          <path transform={offset(10501, 5982.48)} d="M182 0V1526L1219 301V1464H1343V-43L307 1184V0Z" />
        </g>
      </g>
    </svg>
  );
}
