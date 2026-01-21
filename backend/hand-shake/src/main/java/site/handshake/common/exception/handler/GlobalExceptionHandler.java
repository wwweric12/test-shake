package site.handshake.common.exception.handler;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import site.handshake.common.exception.GlobalException;
import site.handshake.common.response.ResponseBody;

@RestControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(GlobalException.class)
    public ResponseEntity<ResponseBody<Void>> handleException(GlobalException e) {
        return ResponseEntity.status(e.getErrorCode().getStatus())
                .body(ResponseBody.error(e.getErrorCode()));
    }
}
