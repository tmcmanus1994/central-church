/**
 * Icons for the mobile tab bar. Inlined rather than served from /public so
 * `fill="currentColor"` picks up the active/inactive text color for free —
 * no separate image request, and no color-swapped duplicate asset to keep
 * in sync with the active state.
 *
 * Source: Google Material Symbols (outlined), one per tab —
 * calendar_month, hub, cottage.
 */

export function VisitIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 -960 960 960"
      className={className}
      fill="currentColor"
    >
      <path d="M80-80v-320l160-71v-129l200-100v-60h-80v-80h80v-80h80v80h80v80h-80v60l200 100v129l160 71v320H520v-160q0-17-11.5-28.5T480-280q-17 0-28.5 11.5T440-240v160H80Zm80-80h200v-82q0-51 35-86.5t85-35.5q50 0 85 35.5t35 86.5v82h200v-192l-160-72v-134l-160-82-160 82v134l-160 72v192Zm362.5-277.5Q540-455 540-480t-17.5-42.5Q505-540 480-540t-42.5 17.5Q420-505 420-480t17.5 42.5Q455-420 480-420t42.5-17.5ZM480-400Z" />
    </svg>
  );
}

export function HubIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 -960 960 960"
      className={className}
      fill="currentColor"
    >
      <path d="m338-620-58-58q41-39 92.5-60.5T480-760q56 0 107.5 21.5T680-678l-58 58q-29-29-65-44.5T480-680q-41 0-77 15.5T338-620ZM226-736l-56-56q63-62 142.5-95T480-920q88 0 167.5 33T790-792l-56 56q-51-50-117-77t-137-27q-71 0-137 27t-117 77ZM400-80q-33 0-56.5-23.5T320-160v-320q0-33 23.5-56.5T400-560h160q33 0 56.5 23.5T640-480v320q0 33-23.5 56.5T560-80H400Zm160-80v-320H400v320h160Zm0 0H400h160Z" />
    </svg>
  );
}

export function CalendarIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 -960 960 960"
      className={className}
      fill="currentColor"
    >
      <path d="M200-80q-33 0-56.5-23.5T120-160v-560q0-33 23.5-56.5T200-800h40v-80h80v80h320v-80h80v80h40q33 0 56.5 23.5T840-720v560q0 33-23.5 56.5T760-80H200Zm0-80h560v-400H200v400Zm0-480h560v-80H200v80Zm0 0v-80 80Zm280 240q-17 0-28.5-11.5T440-440q0-17 11.5-28.5T480-480q17 0 28.5 11.5T520-440q0 17-11.5 28.5T480-400Zm-188.5-11.5Q280-423 280-440t11.5-28.5Q303-480 320-480t28.5 11.5Q360-457 360-440t-11.5 28.5Q337-400 320-400t-28.5-11.5ZM640-400q-17 0-28.5-11.5T600-440q0-17 11.5-28.5T640-480q17 0 28.5 11.5T680-440q0 17-11.5 28.5T640-400ZM480-240q-17 0-28.5-11.5T440-280q0-17 11.5-28.5T480-320q17 0 28.5 11.5T520-280q0 17-11.5 28.5T480-240Zm-188.5-11.5Q280-263 280-280t11.5-28.5Q303-320 320-320t28.5 11.5Q360-297 360-280t-11.5 28.5Q337-240 320-240t-28.5-11.5ZM640-240q-17 0-28.5-11.5T600-280q0-17 11.5-28.5T640-320q17 0 28.5 11.5T680-280q0 17-11.5 28.5T640-240Z" />
    </svg>
  );
}
