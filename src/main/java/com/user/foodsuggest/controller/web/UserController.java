package com.user.foodsuggest.controller.web;

import java.security.Principal;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import com.user.foodsuggest.dto.ChangePasswordDTO;
import com.user.foodsuggest.service.UserService;

import lombok.RequiredArgsConstructor;

@Controller
@RequestMapping("/user")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @PostMapping("/change-password")
    public String changePassword(@ModelAttribute ChangePasswordDTO request, Principal principal,
            RedirectAttributes redirectAttributes) {

        try {
            userService.changePassword(principal.getName(), request);
            redirectAttributes.addFlashAttribute("success", "Đổi mật khẩu thành công");
        } catch (RuntimeException ex) {
            redirectAttributes.addFlashAttribute("error", ex.getMessage());
        }

        return "redirect:/configuration";
    }
}
