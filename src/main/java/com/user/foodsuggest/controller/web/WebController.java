package com.user.foodsuggest.controller.web;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class WebController {
    @GetMapping("/")
    public String suggestions() {
        return "index";
    }

    @GetMapping("/dishes")
    public String dishes() {
        return "dishes";
    }
}
