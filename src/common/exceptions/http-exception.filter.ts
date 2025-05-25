import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
  ValidationError,
  BadRequestException,
} from '@nestjs/common';
import { Request, Response } from 'express';

// Define a type for the exception response structure
interface ExceptionResponseType {
  message?: string | string[];
  details?: Record<string, unknown>;
  [key: string]: unknown;
}

// Interface for a standardized error response
interface ErrorResponse {
  statusCode: number;
  timestamp: string;
  path: string;
  message: string;
  error: string;
  errorCode?: string;
  details?: Record<string, unknown> | null;
  stack?: string;
}

// Interface for formatted validation errors
interface FormattedValidationErrors {
  [key: string]: string | FormattedValidationErrors;
}

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: HttpException, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

    // Get the original response from the exception
    const exceptionResponse = exception.getResponse() as ExceptionResponseType;

    // Prepare the error name/type
    const errorName = this.getErrorName(exception, status);

    // Extract message and details
    const message = this.getErrorMessage(exception, exceptionResponse, status);
    const details = this.getErrorDetails(exception, exceptionResponse);

    // Prepare the error code (can be used for client-side error handling)
    const errorCode = this.getErrorCode(status);

    // Build the standardized error response
    const errorResponse: ErrorResponse = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message,
      error: errorName,
      errorCode,
      details,
    };

    // Add stack trace in development mode
    if (process.env.NODE_ENV !== 'production') {
      errorResponse.stack = exception.stack;
    }

    // Log the error for server-side debugging
    this.logError(exception, request, errorResponse);

    // Send the response
    response.status(status).json(errorResponse);
  }

  private getErrorName(exception: HttpException, status: number): string {
    // Use the exception constructor name if available
    if (exception.constructor && exception.constructor.name !== 'HttpException') {
      return exception.constructor.name.replace(/Exception$/, '');
    }

    // Using a type-safe approach with a mapping object
    const statusNameMap: Record<number, string> = {
      [HttpStatus.BAD_REQUEST]: 'BadRequest',
      [HttpStatus.UNAUTHORIZED]: 'Unauthorized',
      [HttpStatus.FORBIDDEN]: 'Forbidden',
      [HttpStatus.NOT_FOUND]: 'NotFound',
      [HttpStatus.CONFLICT]: 'Conflict',
      [HttpStatus.UNPROCESSABLE_ENTITY]: 'UnprocessableEntity',
      [HttpStatus.INTERNAL_SERVER_ERROR]: 'InternalServerError',
      [HttpStatus.SERVICE_UNAVAILABLE]: 'ServiceUnavailable'
    };

    return statusNameMap[status] || 'HttpError';
  }

  private getErrorMessage(exception: HttpException, exceptionResponse: ExceptionResponseType, status: number): string {
    // Handle special cases for common status codes
    if (status === 403) { // Using numeric value instead of enum for type safety
      return 'You do not have permission to access this resource';
    }

    // Extract message from exception response
    if (exceptionResponse && typeof exceptionResponse === 'object') {
      // If it's a validation error from class-validator
      if (exceptionResponse.message && Array.isArray(exceptionResponse.message)) {
        return 'Validation failed';
      }
      // If it has a message property as string
      if (exceptionResponse.message && typeof exceptionResponse.message === 'string') {
        return exceptionResponse.message;
      }
    }

    // Use exception message as fallback
    return exception.message || 'An error occurred';
  }

  private getErrorCode(status: number): string {
    // Using a type-safe approach with a mapping object
    const errorCodeMap: Record<number, string> = {
      [HttpStatus.BAD_REQUEST]: 'E400',
      [HttpStatus.UNAUTHORIZED]: 'E401',
      [HttpStatus.FORBIDDEN]: 'E403',
      [HttpStatus.NOT_FOUND]: 'E404',
      [HttpStatus.CONFLICT]: 'E409',
      [HttpStatus.UNPROCESSABLE_ENTITY]: 'E422',
      [HttpStatus.INTERNAL_SERVER_ERROR]: 'E500'
    };

    // Default for any other status code
    return errorCodeMap[status] || `E${status}`;
  }

  private getErrorDetails(exception: HttpException, exceptionResponse: ExceptionResponseType): Record<string, unknown> | null {
    // Handle validation errors
    if (exception instanceof BadRequestException) {
      if (exceptionResponse.message && Array.isArray(exceptionResponse.message)) {
        return this.formatValidationErrors(exceptionResponse.message);
      }
    }
        // Extract details if available
    if (exceptionResponse && typeof exceptionResponse === 'object' && exceptionResponse.details) {
      // Ensure we're returning a safe Record<string, unknown>
      return typeof exceptionResponse.details === 'object' 
        ? { ...exceptionResponse.details as object } 
        : null;
    }

    return null;
  }

  private formatValidationErrors(errors: ValidationError[] | string[]): Record<string, unknown> {
    // If already formatted strings, return directly
    if (errors.length > 0 && typeof errors[0] === 'string') {
      return { validationErrors: errors };
    }

    // Format class-validator ValidationError objects
    const formattedErrors: FormattedValidationErrors = {};

    // Handle class-validator errors
    (errors as ValidationError[]).forEach(error => {
      if (error.constraints) {
        // Take the first constraint message
        const constraintValues = Object.values(error.constraints);
        if (constraintValues.length > 0) {
          formattedErrors[error.property] = constraintValues[0];
        }
      }

      // Handle nested validation errors
      if (error.children && error.children.length > 0) {
        formattedErrors[error.property] = this.formatValidationErrors(error.children) as FormattedValidationErrors;
      }
    });

    return formattedErrors;
  }

  private logError(exception: HttpException, request: Request, errorResponse: ErrorResponse): void {
    const { method, url } = request;

    // Create a safe representation of request data
    // This approach uses a type-safe extraction of request information
    const safeRequestInfo = {
      method,
      url,
      // For potentially unsafe properties, we'll only include them if they exist
      // and make sure they're safely typed
      body: typeof request.body === 'object' ? { ...request.body } : request.body,
      params: typeof request.params === 'object' ? { ...request.params } : request.params,
      query: typeof request.query === 'object' ? { ...request.query } : request.query
    };

    // Log at appropriate level based on status code
    const status = errorResponse.statusCode;

    // Create log data without unsafe spreading
    const logData = {
      statusCode: errorResponse.statusCode,
      timestamp: errorResponse.timestamp,
      path: errorResponse.path,
      message: errorResponse.message,
      error: errorResponse.error,
      errorCode: errorResponse.errorCode,
      // Only include details if they exist
      ...(errorResponse.details ? { details: errorResponse.details } : {}),
      // Only include stack in non-production environments
      ...(errorResponse.stack ? { stack: errorResponse.stack } : {}),
      // Include request info
      requestInfo: safeRequestInfo
    };

    const logMessage = `[${method}] ${url} - ${errorResponse.message}`;
    const logDataString = JSON.stringify(logData);

    if (status >= 500) { // Internal server errors
      this.logger.error(logMessage, exception.stack, logDataString);
    } else if (status >= 400) { // Client errors
      this.logger.warn(logMessage, logDataString);
    } else {
      this.logger.log(logMessage, logDataString);
    }
  }
}
