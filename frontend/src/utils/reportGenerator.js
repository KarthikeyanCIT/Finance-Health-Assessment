import { jsPDF } from 'jspdf';
import * as htmlToImage from 'html-to-image';

/**
 * Modern PDF Generator (html-to-image Version)
 * Uses SVG-based capture which is naturally compatible with modern CSS (oklch, oklab).
 */
export const generateInvestorReport = async (elementId, filename = "FinHealth_Report.pdf") => {
    const element = document.getElementById(elementId);
    if (!element) {
        console.error(`[PDF Export] Element #${elementId} not found.`);
        return { success: false, error: "Content container not found" };
    }

    const noPrintElements = element.querySelectorAll('.no-print');

    try {
        console.log("[PDF Export] Starting Modern Capture (html-to-image)...");

        // 1. Prepare original visibility
        noPrintElements.forEach(el => {
            el.dataset.originalDisplay = el.style.display;
            el.style.display = 'none';
        });

        const isDark = document.documentElement.classList.contains('dark');

        // Bypasses CSS parsing crashes by using the browser's native SVG snapshotting
        const dataUrl = await htmlToImage.toJpeg(element, {
            quality: 0.95,
            backgroundColor: isDark ? '#020617' : '#ffffff',
            style: {
                // Ensure proper isolated display during capture
                width: '1200px',
                padding: '40px',
                margin: '0 auto',
            },
            filter: (node) => {
                // Filter out no-print elements at the source
                if (node.classList && node.classList.contains('no-print')) {
                    return false;
                }
                return true;
            }
        });

        if (!dataUrl) throw new Error("Capture failed (No image data)");

        console.log("[PDF Export] Compiling PDF...");
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();

        // Create an image object to calculate dimensions accurately
        const img = new Image();
        img.src = dataUrl;
        await new Promise(r => img.onload = r);

        const pdfHeight = (img.height * pdfWidth) / img.width;

        pdf.addImage(dataUrl, 'JPEG', 0, 0, pdfWidth, pdfHeight);
        pdf.save(filename);

        return { success: true };

    } catch (error) {
        console.error("[PDF Export] MODERN CAPTURE FAILURE:", error);
        return { success: false, error: error.message || "Capture engine failure" };
    } finally {
        noPrintElements.forEach(el => {
            el.style.display = el.dataset.originalDisplay || '';
            delete el.dataset.originalDisplay;
        });
        console.log("[PDF Export] Cleanup complete.");
    }
};
