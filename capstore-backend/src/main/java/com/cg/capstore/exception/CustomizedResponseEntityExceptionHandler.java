package com.cg.capstore.exception;

import javax.servlet.http.HttpServletRequest;




import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;





@ControllerAdvice
@RestController
public class CustomizedResponseEntityExceptionHandler extends ResponseEntityExceptionHandler {

	
	
	@ExceptionHandler(InvalidCoupon.class)
	@ResponseStatus(value = HttpStatus.FORBIDDEN)
	public @ResponseBody ExceptionResponse handleInvalidCoupon(final InvalidCoupon exception,final HttpServletRequest request) {
		ExceptionResponse error = new ExceptionResponse(exception.getLocalizedMessage());
		return error;
	}
	
}
