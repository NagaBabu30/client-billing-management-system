package com.billing_db.service;

import com.billing_db.model.Invoice;
import com.billing_db.model.InvoiceItem;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.layout.element.Table;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;

@Service
public class PdfService {

    public byte[] generateInvoicePdf(Invoice invoice) {

        ByteArrayOutputStream out = new ByteArrayOutputStream();
        PdfWriter writer = new PdfWriter(out);
        PdfDocument pdf = new PdfDocument(writer);
        Document doc = new Document(pdf);

        doc.add(new Paragraph("INVOICE").setBold().setFontSize(18));
        doc.add(new Paragraph("Invoice ID: " + invoice.getId()));
        doc.add(new Paragraph("Client: " + invoice.getClient().getName()));
        doc.add(new Paragraph("Email: " + invoice.getClient().getEmail()));
        doc.add(new Paragraph("Status: " + invoice.getStatus()));
        doc.add(new Paragraph(" "));

        Table table = new Table(6);
        table.addCell("Product");
        table.addCell("Price");
        table.addCell("Qty");
        table.addCell("Discount");
        table.addCell("Tax");
        table.addCell("Subtotal");

        for (InvoiceItem it : invoice.getItems()) {
            double base = it.getPrice() * it.getQuantity();
            double discount = (base * it.getDiscount()) / 100;
            double tax = ((base - discount) * it.getTax()) / 100;
            double subtotal = base - discount + tax;

            table.addCell(it.getProduct().getName());
            table.addCell(String.valueOf(it.getPrice()));
            table.addCell(String.valueOf(it.getQuantity()));
            table.addCell(it.getDiscount() + "%");
            table.addCell(it.getTax() + "%");
            table.addCell(String.valueOf(subtotal));
        }

        doc.add(table);
        doc.add(new Paragraph(" "));
        doc.add(new Paragraph("Total: ₹" + invoice.getTotalAmount()));
        doc.add(new Paragraph("Paid: ₹" + invoice.getPaidAmount()));
        doc.add(new Paragraph("Balance: ₹" + invoice.getBalance()));

        doc.close();
        return out.toByteArray();
    }
}
