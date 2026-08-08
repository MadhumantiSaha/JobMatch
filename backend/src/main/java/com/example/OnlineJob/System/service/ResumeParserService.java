package com.example.OnlineJob.System.service;

import org.apache.pdfbox.Loader;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Arrays;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class ResumeParserService {

    private final ChatClient chatClient;

    public ResumeParserService(ChatClient.Builder chatClientBuilder) {
        this.chatClient = chatClientBuilder.build();
    }

    public Set<String> extractSkills(MultipartFile resumeFile) throws IOException {
        String resumeText = extractTextFromPdf(resumeFile);

        System.out.println("\n========== PDF TEXT (first 600 chars) ==========");
        System.out.println(resumeText.substring(0, Math.min(600, resumeText.length())));
        System.out.println("================================================\n");

        String systemPrompt = """
                You are an expert resume parser.
                Extract ALL technical skills, tools, frameworks, programming languages, 
                and soft skills from the resume.
                Return ONLY a comma-separated list of skills.
                Do not invent skills. Keep them short and clean.
                Example: Java, Spring Boot, React, Docker, Leadership, Problem Solving
                """;

        try {
            String response = chatClient.prompt()
                    .system(systemPrompt)
                    .user("Extract skills from this resume:\n\n" + resumeText)
                    .call()
                    .content();

            System.out.println("\n========== GEMINI RESPONSE ==========");
            System.out.println(response);
            System.out.println("=====================================\n");

            return Arrays.stream(response.split(","))
                    .map(String::trim)
                    .filter(s -> !s.isBlank())
                    .map(String::toLowerCase)
                    .collect(Collectors.toSet());

        } catch (Exception e) {
            System.err.println("\n!!!!!!!!!! FULL EXCEPTION !!!!!!!!!!");
            e.printStackTrace();          // ← THIS is what we need
            System.err.println("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!\n");
            throw new RuntimeException("Failed to generate content", e);
        }
    }

    private String extractTextFromPdf(MultipartFile file) throws IOException {
        try (PDDocument document = Loader.loadPDF(file.getBytes())) {
            PDFTextStripper stripper = new PDFTextStripper();
            return stripper.getText(document);
        }
    }
}