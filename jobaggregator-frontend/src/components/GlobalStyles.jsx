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
      .site-header-inner,
      .site-brand,
      .filter-bottom,
      .filter-actions,
      .results-top,
      .pagination,
      .date-row {
        display: flex;
      }
      .site-header-inner {
        align-items: center;
        justify-content: space-between;
      }
      .site-brand,
      .filter-actions {
        align-items: center;
        gap: 0.5rem;
      }
      .filter-grid,
      .job-grid {
        display: grid;
      }
      .filter-grid {
        grid-template-columns: repeat(4, minmax(0, 1fr));
      }
      .filter-group-wide {
        grid-column: span 2;
      }
      .filter-bottom,
      .results-top {
        align-items: center;
        justify-content: space-between;
        flex-wrap: wrap;
      }
      .job-grid {
        grid-template-columns: repeat(3, minmax(0, 1fr));
      }
      @media (max-width: 980px) {
        .filter-grid {
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }
        .job-grid {
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }
      }
      @media (max-width: 680px) {
        .site-header-inner {
          height: auto !important;
          min-height: 64px;
          padding: 0.75rem 0;
        }
        .filter-grid,
        .job-grid {
          grid-template-columns: 1fr;
        }
        .filter-group-wide {
          grid-column: auto;
        }
        .date-row,
        .filter-actions,
        .pagination {
          width: 100%;
        }
        .date-row,
        .filter-actions {
          flex-direction: column;
          align-items: stretch;
        }
        .pagination {
          justify-content: space-between;
        }
        .job-grid {
          grid-template-columns: 1fr;
        }
      }
    `}</style>
  )
}
