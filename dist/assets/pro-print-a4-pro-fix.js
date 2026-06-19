(() => {
  'use strict';

  if (window.__DOIT_PRO_A4_PRINT_FIX__) return;
  window.__DOIT_PRO_A4_PRINT_FIX__ = true;

  function install() {
    if (document.getElementById('proA4PrintFixCss')) return;
    const style = document.createElement('style');
    style.id = 'proA4PrintFixCss';
    style.textContent = `
      @media print {
        .printMobileSafeA4 .a4Sheet {
          width: 210mm !important;
          height: 296mm !important;
          margin: 0 !important;
          padding: 8mm 7mm !important;
          display: flex !important;
          flex-direction: column !important;
          box-sizing: border-box !important;
          overflow: hidden !important;
          break-after: page !important;
          page-break-after: always !important;
        }
        .printMobileSafeA4 .a4Sheet:last-child {
          break-after: auto !important;
          page-break-after: auto !important;
        }
        .printMobileSafeA4 .receiptPage {
          height: 140mm !important;
          flex: 0 0 140mm !important;
          min-height: 0 !important;
          margin: 0 !important;
          padding: 2.5mm 3.5mm !important;
          box-sizing: border-box !important;
          overflow: hidden !important;
          break-inside: avoid !important;
          page-break-inside: avoid !important;
        }
      }
    `;
    document.head.appendChild(style);
  }

  install();
})();
