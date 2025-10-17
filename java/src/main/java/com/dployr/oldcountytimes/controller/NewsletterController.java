package com.dployr.oldcountytimes.controller;

import com.dployr.oldcountytimes.model.NewsletterData;
import com.dployr.oldcountytimes.service.ContentGenerator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
public class NewsletterController {
    
    @Autowired
    private ContentGenerator contentGenerator;
    
    private NewsletterData currentNewsletterData;
    
    public NewsletterController() {
        // Initialize with default data
        this.currentNewsletterData = new NewsletterData();
    }
    
    @GetMapping("/")
    public String home(Model model) {
        // Generate fresh content for each request
        currentNewsletterData = contentGenerator.generateNewsletterData();
        model.addAttribute("newsletter", currentNewsletterData);
        return "index";
    }
    
    @GetMapping("/api/newsletter-data")
    @ResponseBody
    public ResponseEntity<NewsletterData> getNewsletterData() {
        // Generate fresh content for API requests
        currentNewsletterData = contentGenerator.generateNewsletterData();
        return ResponseEntity.ok(currentNewsletterData);
    }
}