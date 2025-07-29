import { trigramMap, TrigInfo } from "./trigramMap";
import { hexagramMap, HexaInfo } from "./hexagramMap";

const canvas = new OffscreenCanvas(100, 100);
const drawContext = canvas.getContext("2d");

const fill6Bit = (value) => {
  return `000000${value}`.slice(value.length);
};

export const getTrigramsFromHexagram = (
  index: number
): [upper: number, lower: number] => {
  return [index % 8, Math.floor(index / 8)];
};

export const getHexaImageURL = async (index: number, isDarkMode: boolean = false): Promise<string> => {
  const chars = fill6Bit(index.toString(2)).split("");
  drawContext?.clearRect(0, 0, 100, 100);

  // Set colors based on theme - softer colors
  const lineColor = isDarkMode ? '#e5e7eb' : '#374151';
  const shadowColor = isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';
  
  drawContext!.fillStyle = lineColor;

  chars.forEach((charValue, charIndex) => {
    const yAxis = (6 - Number(charIndex)) * 14 + 8; // Add padding
    const lineWidth = 8;
    const gapWidth = 12;
    const totalWidth = 80;
    
    if (charValue === "1") {
      // Solid line with rounded corners
      drawContext!.fillStyle = lineColor;
      drawContext?.fillRect(10, yAxis, totalWidth, lineWidth);
      
      // Add subtle shadow for depth
      drawContext!.fillStyle = shadowColor;
      drawContext?.fillRect(10, yAxis + lineWidth, totalWidth, 1);
    }

    if (charValue === "0") {
      // Broken lines with rounded corners
      const leftWidth = (totalWidth - gapWidth) / 2;
      
      drawContext!.fillStyle = lineColor;
      drawContext?.fillRect(10, yAxis, leftWidth, lineWidth);
      drawContext?.fillRect(10 + leftWidth + gapWidth, yAxis, leftWidth, lineWidth);
      
      // Add subtle shadow
      drawContext!.fillStyle = shadowColor;
      drawContext?.fillRect(10, yAxis + lineWidth, leftWidth, 1);
      drawContext?.fillRect(10 + leftWidth + gapWidth, yAxis + lineWidth, leftWidth, 1);
    }
  });

  return URL.createObjectURL(await canvas.convertToBlob());
};

export const extractHexagramInfo = (
  index: number
): [TrigInfo, TrigInfo, HexaInfo] => {
  const [upperTrig, lowerTrig] = getTrigramsFromHexagram(index).map(
    (index) => trigramMap[index]
  );

  return [upperTrig, lowerTrig, hexagramMap[index]];
};

export const concatHexagramName: (
  upperTrigInfo: TrigInfo,
  lowerTrigInfo: TrigInfo,
  hexaInfo: HexaInfo
) => string = (upperTrigInfo, lowerTrigInfo, hexaInfo) => {
  if (upperTrigInfo === lowerTrigInfo) {
    return `${upperTrigInfo.name}为${upperTrigInfo.symbol}`;
  }

  return upperTrigInfo.symbol + lowerTrigInfo.symbol + hexaInfo.name;
};

export const getHexaNameWithIndex = (index) =>
  concatHexagramName(...extractHexagramInfo(index));
