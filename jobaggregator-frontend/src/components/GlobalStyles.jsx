export function GlobalStyles({ dark }) {
  return (
    <style>{`
      @keyframes fadeUp {
        from { opacity: 0; transform: translateY(12px); }
        to   { opacity: 1; transform: translateY(0); }
      }
      input[type="date"]::-webkit-calendar-picker-indicator {
        filter: ${dark ? 'invert(1)' : 'none'};
        opacity: 0.5;
        cursor: pointer;
      }
      select option {
        background: ${dark ? '#18181F' : '#FFFFFF'};
        color: ${dark ? '#EDECE8' : '#0F0F1A'};
      }
      @media (max-width: 980px) {
        .job-grid {
          grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
        }
      }
      @media (max-width: 680px) {
        .job-grid {
          grid-template-columns: 1fr !important;
        }
      }
    `}</style>
  )
}
