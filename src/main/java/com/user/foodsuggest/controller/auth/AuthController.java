package com.user.foodsuggest.controller.auth;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import com.user.foodsuggest.service.UserService;

@Controller
public class AuthController {

    private final UserService userService;

    public AuthController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/register")
    public String register(@RequestParam String username,
            @RequestParam String password,
            @RequestParam String confirmPassword,
            RedirectAttributes redirect) {

        String error = userService.registerUser(username, password, confirmPassword);
        if (error != null) {
            redirect.addFlashAttribute("error", error);
            return "redirect:/login";
        }

        redirect.addFlashAttribute("success", "Đăng ký thành công, hãy đăng nhập");
        return "redirect:/login";
    }

}
