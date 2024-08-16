package com.example.blog;

import java.util.HashMap;
import java.util.Map;

import org.springframework.web.bind.annotation.*;

@RestController
public class CalculationController {

    @PostMapping("/api/increment")
    public Map<String, Integer> increment(@RequestBody Map<String, Integer> payload) {
        int value = payload.get("number");
        int incrementedValue = value + 1;
        
        Map<String, Integer> response = new HashMap<>();
        response.put("result", incrementedValue);
        
        return response;
    }
}
