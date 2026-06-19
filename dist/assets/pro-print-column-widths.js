(() => {
  'use strict';

  if (window.__DOIT_PRO_PRINT_COLUMN_WIDTHS__) return;
  window.__DOIT_PRO_PRINT_COLUMN_WIDTHS__ = true;

  function install() {
    if (document.getElementById('proPrintColumnWidthCss')) return;
    const style = document.createElement('style');
    style.id = 'proPrintColumnWidthCss';
    style.textContent = `
      .proPrintFix .receiptTable {
        table-layout: fixed !important;
      }
      .proPrintFix .receiptTable th:first-child,
      .proPrintFix .receiptTable td:first-child {
        width: 8mm !important;
        min-width: 8mm !important;
        max-width: 8mm !important;
        text-align: center !important;
        padding-left: 2px !important;
        padding-right: 2px !important;
      }
      .proPrintFix .receiptTable th:nth-child(2),
      .proPrintFix .receiptTable td:nth-child(2) {
        width: auto !important;
        text-align: left !important;
      }
      .proPrintFix .receiptTable th:nth-child(3),
      .proPrintFix .receiptTable td:nth-child(3) {
        width: 22mm !important;
        min-width: 22mm !important;
        max-width: 22mm !important;
        text-align: right !important;
      }
      .proPrintFix .receiptTable th:nth-child(4),
      .proPrintFix .receiptTable td:nth-child(4) {
        width: 30mm !important;
        min-width: 30mm !important;
        max-width: 30mm !important;
        text-align: right !important;
      }
      .proPrintFix .receiptTable th,
      .proPrintFix .receiptTable td {
        padding-top: 4px !important;
        padding-bottom: 4px !important;
      }
      .proPrintFix .receiptTable td:nth-child(2) {
        font-size: 13.8px !important;
        line-height: 1.22 !important;
      }
      .proPrintFix .receiptTable th:nth-child(3),
      .proPrintFix .receiptTable th:nth-child(4) {
        white-space: nowrap !important;
      }
      .proPrintFix .totalRow td:first-child {
        text-align: right !important;
      }
      @media print {
        .proPrintFix .receiptPage {
          padding-top: 6mm !important;
          padding-bottom: 6mm !important;
          box-sizing: border-box !important;
        }
        .proPrintFix .receiptTable tr {
          break-inside: avoid !important;
          page-break-inside: avoid !important;
        }
      }
    `;
    document.head.appendChild(style);
  }

  install();
})();
