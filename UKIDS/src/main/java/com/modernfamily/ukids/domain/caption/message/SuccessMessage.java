package com.modernfamily.ukids.domain.caption.message;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@AllArgsConstructor(access = AccessLevel.PROTECTED)
public enum SuccessMessage {
    
    SUCCESS_CREATE_CAPTION("캡션 생성 완료");
    
    private String message;
}
