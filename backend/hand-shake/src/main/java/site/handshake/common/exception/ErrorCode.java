package site.handshake.common.exception;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;

import static org.springframework.http.HttpStatus.*;

@Getter
@RequiredArgsConstructor
public enum ErrorCode {

    DEMO_ERROR(BAD_REQUEST, 9999, "데모 에러입니다."),
    ;

    private final HttpStatus status;
    private final int code;
    private final String message;
}
