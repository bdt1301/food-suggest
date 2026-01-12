package com.user.foodsuggest.controller.auth;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import com.user.foodsuggest.dto.RegisterDTO;
import com.user.foodsuggest.service.UserService;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Controller
public class AuthController {

    private final UserService userService;

    @PostMapping("/register")
    public String register(@ModelAttribute RegisterDTO registerDTO, RedirectAttributes redirect) {

        try {
            userService.registerUser(registerDTO);
            redirect.addFlashAttribute("success", "Đăng ký thành công, hãy đăng nhập");
        } catch (RuntimeException ex) {
            redirect.addFlashAttribute("error", ex.getMessage());
        }

        return "redirect:/login";
    }

}
