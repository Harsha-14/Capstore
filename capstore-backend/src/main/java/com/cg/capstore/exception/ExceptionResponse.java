package com.cg.capstore.exception;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

public class ExceptionResponse {
		
	private String timeStamp;
	private String errorMessage;

	public ExceptionResponse(String errorMessage) {
		super();
		DateTimeFormatter dtf = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm:ss");  
		LocalDateTime now = LocalDateTime.now();  
		this.timeStamp=dtf.format(now);
		this.errorMessage = errorMessage;
	}

	public ExceptionResponse() {
		super();
	}


	public String getTimeStamp() {
		return timeStamp;
	}

	public void setTimeStamp(String timeStamp) {
		this.timeStamp = timeStamp;
	}

	public String getErrorMessage() {
		return errorMessage;
	}

	public void setErrorMessage(final String errorMessage) {
		this.errorMessage = errorMessage;
	}

	}


