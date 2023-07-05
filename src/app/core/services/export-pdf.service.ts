import { Injectable } from '@angular/core';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import {BehaviorSubject, Observable, Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ExportPdfService {

  public exportableState = new BehaviorSubject<boolean>(false)

  constructor() { }

  exportAllToPdf(pages: HTMLElement) {
    return new Promise(async (resolve) => {
      const doc = new jsPDF({
        unit: 'pt',
        format: 'A3',
        orientation: 'landscape',
      })

      async function forLoop() {
        for(let i = 0;i < 5; i+=1) {
          await doc.setPage(i)
          await doc.html(pages)
          await doc.addPage();
        }
      }

      await forLoop();




      await doc.save('pdf-export')
      setTimeout(() => resolve('finished'))




      // doc.html(pages, {
      //   callback: (doc: jsPDF) => {
      //     // doc.deletePage(doc.getNumberOfPages());
      //     doc.save('pdf-export')
      //     setTimeout(() => resolve('finished'))
      //   }
      // })
    })
  }

  exportToPdfWithCanvas(pages: HTMLElement) {
    return new Promise(resolve => {
      const htmlWidth = pages.offsetWidth;
      const htmlHeight = pages.offsetHeight;

      const topLeftMargin = 15;

      let pdfWidth = htmlWidth + (topLeftMargin * 2);
      let pdfHeight = (pdfWidth * 1.5) + (topLeftMargin * 2);

      const canvasImageWidth = htmlWidth;
      const canvasImageHeight = htmlHeight;

      const totalPDFPages = Math.ceil(htmlHeight / pdfHeight) - 1;
      html2canvas(pages, { allowTaint: true }).then(canvas => {

        canvas.getContext('2d');
        const imgData = canvas.toDataURL("image/jpeg", 1.0);
        let pdf = new jsPDF('p', 'pt', [pdfWidth, pdfHeight]);
          pdf.addImage(imgData, 'png', topLeftMargin, topLeftMargin, canvasImageWidth, canvasImageHeight);

          for (let i = 1; i <= totalPDFPages; i++) {
            pdf.addPage([pdfWidth, pdfHeight], 'p');
            pdf.addImage(imgData, 'png', topLeftMargin, - (pdfHeight * i) + (topLeftMargin * 4), canvasImageWidth, canvasImageHeight);
          }

          pdf.save(`Reporte_de_atencion_${new Date().toLocaleString()}.pdf`);

      });
      resolve('finished');
    })
  }

  exportSimplePdf() {
    window.print();
  }

  updateExportableState(value: boolean) {
    this.exportableState.next(value);
  }


}
