import * as React from 'react';
import SvgIcon from '@mui/material/SvgIcon';

// Renamed component
export default function AsyncAccessIcon() {
  // Text to display
  const logoText = "AsyncAccess";
  
  const textColor = "#4876EE";
  const newViewBoxWidth = 115;
  const svgInternalWidth = newViewBoxWidth; 
  const outerWidth = 145;

  return (
    // Adjusted width in sx and viewBox width
    <SvgIcon sx={{ height: 21, width: outerWidth, mr: 2 }}>
      <svg
        width={svgInternalWidth} // Use calculated width
        height={19}
        viewBox={`0 0 ${newViewBoxWidth} 19`} // Use calculated viewBox width
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* --- Start: Original Icon Paths (Untouched) --- */}
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
        <text
          x="24" // Starting position (adjust as needed, same as original 'S' approx)
          y="14.5" // Vertical position (adjust baseline for visual alignment)
          fill={textColor} // Use the original text color
          fontFamily="Arial, Helvetica, sans-serif" 
          fontSize="15" // Adjust size to fit vertically within height 19
          fontWeight="600" // Adjust weight (e.g., 'bold', '500', '600') to match original
          letterSpacing="0.1" // Optional: Adjust spacing between letters
        >
          {logoText}
        </text>
        {/* --- End: New "AsyncAccess" Text --- */}

      </svg>
    </SvgIcon>
  );
}