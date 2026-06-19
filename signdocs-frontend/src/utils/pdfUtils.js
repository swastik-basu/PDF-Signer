import * as pdfjsLib from "pdfjs-dist";
import pdfjsWorker from "pdfjs-dist/build/pdf.worker.min.js?url";

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

// Loads a PDF from an ArrayBuffer (e.g. the response of
// GET /api/documents/download/{id}) and returns a pdfjs document proxy.
export async function loadPdf(arrayBuffer) {
  const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
  return loadingTask.promise;
}

// Renders a single page of a pdfjs document onto a canvas element at the
// given target width (in CSS pixels). Returns the page's native size in
// PDF points (1pt = 1/72 inch) and the render scale used, so the caller
// can convert between on-screen pixel coordinates and PDF coordinates.
export async function renderPageToCanvas(pdfDoc, pageNumber, canvas, targetWidth) {
  const page = await pdfDoc.getPage(pageNumber);
  const baseViewport = page.getViewport({ scale: 1 });
  const scale = targetWidth / baseViewport.width;
  const viewport = page.getViewport({ scale });

  canvas.width = viewport.width;
  canvas.height = viewport.height;

  const context = canvas.getContext("2d");
  await page.render({ canvasContext: context, viewport }).promise;

  return {
    pageWidthPt: baseViewport.width,
    pageHeightPt: baseViewport.height,
    renderWidth: viewport.width,
    renderHeight: viewport.height,
    scale,
  };
}
