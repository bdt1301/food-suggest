package com.user.foodsuggest.enums;

public enum DishType {
    MON_MAN("Món mặn"),
    MON_CANH("Canh"),
    MON_TRANG_MIENG("Tráng miệng");

    private final String label;

    DishType(String label) {
        this.label = label;
    }

    public String getLabel() {
        return label;
    }
}
