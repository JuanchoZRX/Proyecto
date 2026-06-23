package service.dto;


import lombok.Data;

import data.Usuario.Role;

@Data
public class RegisterRequestDTO {
    private String username;
    private String password;
    private Role role;
}