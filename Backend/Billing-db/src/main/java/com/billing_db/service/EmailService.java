package com.billing_db.service;

import jakarta.mail.internet.MimeMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.springframework.core.io.ByteArrayResource;

@Service
public class EmailService {

    private final JavaMailSender mailSender;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    // 📄 EXISTING – INVOICE MAIL (NO CHANGE)
    public void sendInvoiceEmail(String toEmail, byte[] pdfBytes, String fileName) {

        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);

            helper.setTo(toEmail);
            helper.setSubject("Invoice Generated");
            helper.setText(
                    "Hello,\n\n" +
                            "Your invoice has been generated successfully.\n" +
                            "Please find the attached invoice PDF.\n\n" +
                            "Thank you."
            );

            helper.addAttachment(fileName, new ByteArrayResource(pdfBytes));
            mailSender.send(message);

        } catch (Exception e) {
            throw new RuntimeException("Failed to send invoice email", e);
        }
    }

    // 🆕 NEW – CLIENT ACCOUNT CREDENTIALS MAIL
    public void sendClientCredentials(
            String toEmail,
            String username,
            String tempPassword) {

        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, false);

            helper.setTo(toEmail);
            helper.setSubject("Your Client Account Login Details");
            helper.setText(
                    "Hello,\n\n" +
                            "Your client account has been created.\n\n" +
                            "Login Details:\n" +
                            "Username: " + username + "\n" +
                            "Temporary Password: " + tempPassword + "\n\n" +
                            "⚠️ Please login and reset your password immediately.\n\n" +
                            "Thank you."
            );

            mailSender.send(message);

        } catch (Exception e) {
            throw new RuntimeException("Failed to send client credentials email", e);
        }
    }
}

