package site.handshake.common.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.*;
import org.springframework.http.HttpStatus;
import site.handshake.common.exception.ErrorCode;

import static com.fasterxml.jackson.annotation.JsonInclude.*;
import static lombok.AccessLevel.*;

@Getter
@AllArgsConstructor(access = PRIVATE)
@Builder(access = PRIVATE)
public class ResponseBody<T> {
    private final int statusCode;
    private final String message;

    @JsonInclude(Include.NON_NULL)
    private Integer errorCode;

    @JsonInclude(Include.NON_NULL)
    private T data;

    public static <T> ResponseBody<T> success(T data) {
        return ResponseBody.<T>builder()
                .statusCode(HttpStatus.OK.value())
                .message(HttpStatus.OK.getReasonPhrase())
                .data(data)
                .build();
    }

    public static <T> ResponseBody<T> error(ErrorCode errorCode) {
        return ResponseBody.<T>builder()
                .statusCode(errorCode.getStatus().value())
                .message(errorCode.getMessage())
                .errorCode(errorCode.getCode())
                .build();
    }
}
