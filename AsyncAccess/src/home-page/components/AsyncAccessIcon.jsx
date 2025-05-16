import * as React from 'react';
import SvgIcon from '@mui/material/SvgIcon';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import { useTheme } from '@mui/material/styles'; // Import useTheme

// Renamed component
export default function AsyncAccessIcon() {
  const theme = useTheme(); // Get the current theme
  const logoText = "AsyncAccess";

  // Split the text
  const asyncPart = "Async";
  const accessPart = "Access";

  const textColor = "#4876EE"; // Blue color for "Access"
  const asyncColor = theme.palette.mode === 'light' ? "#FFFFFF" : "#000000"; // White for dark, Black for light

  const newViewBoxWidth = 115;
  const svgInternalWidth = newViewBoxWidth;
  const outerWidth = 145;

  // Starting X position for the combined text block
  const textStartX = 24;
  // Vertical position for the text baseline
  const textBaselineY = 14.5;
  // Font properties
  const fontSize = "15";
  const fontFamily = "Arial, Helvetica, sans-serif";
  const fontWeight = "600";
  const letterSpacing = "0.1";

  const accessStartX = textStartX + 46; 

  return (
    <Link to="/" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}>
      <SvgIcon sx={{ height: 21, width: outerWidth }}>
        <svg
          width={svgInternalWidth} 
          height={19}
          viewBox={`0 0 ${newViewBoxWidth} 19`} 
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
      
          <path
            fill="#B4C0D3"
            d="m.787 12.567 6.055-2.675 3.485 2.006.704 6.583-4.295-.035.634-4.577-.74-.422-3.625 2.817-2.218-3.697Z"
          />
          <path
            fill="#00D3AB"
            d="m10.714 11.616 5.352 3.908 2.112-3.767-4.295-1.725v-.845l4.295-1.76-2.112-3.732-5.352 3.908v4.013Z"
          />
          <path
            fill="#4876EF"
            d="m10.327 7.286.704-6.583-4.295.07.634 4.577-.74.422-3.66-2.816L.786 6.617l6.055 2.676 3.485-2.007Z"
          />
          {/* --- End: Original Icon Paths (Untouched) --- */}

          {/* --- Start: Split Text --- */}
          <text
            x={textStartX} // Starting position for "Async"
            y={textBaselineY} // Vertical position
            fill={asyncColor} // White color
            fontFamily={fontFamily}
            fontSize={fontSize}
            fontWeight={fontWeight}
            letterSpacing={letterSpacing}
          >
            {asyncPart}
          </text>
          <text
            x={accessStartX} // Starting position for "Access"
            y={textBaselineY} // Vertical position (same as "Async")
            fill={textColor} // Blue color from variable
            fontFamily={fontFamily}
            fontSize={fontSize}
            fontWeight={fontWeight}
            letterSpacing={letterSpacing}
          >
            {accessPart}
          </text>
          {/* --- End: Split Text --- */}

        </svg>
      </SvgIcon>
    </Link>
  );
}