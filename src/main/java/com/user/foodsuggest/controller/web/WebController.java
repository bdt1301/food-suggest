package com.user.foodsuggest.controller.web;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class WebController {
    @GetMapping("/")
    public String communityDishes() {
        return "index";
    }

    @GetMapping("/dishes")
    public String dishes() {
        return "dishes";
    }

    @GetMapping("/login")
    public String login() {
        return "login";
    }

    @GetMapping("/configuration")
    public String configuration() {
        return "configuration";
    }

    @GetMapping("/suggestions")
    public String suggestions() {
        return "suggestions";
    }
    
}
